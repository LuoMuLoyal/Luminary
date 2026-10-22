import { ApiError, parseProblemDetails } from '@/lib/problem-details';

/**
 * Lucent HTTP 客户端。
 *
 * ## 为什么不用 openapi 生成的客户端
 *
 * Lucent 的契约源是 `Lucent/docs/reference/generated/openapi.json`，但同工作区的
 * `Luminous` 用的是 dart-dio 生成器、生成物体量很大。Lumine 目前只需要 auth 与后续
 * 少量只读查询，先手写薄封装；等接口面铺开再考虑生成。**契约仍以后端为准**：
 * 类型定义在 `features/<domain>/api/types.ts` 里与 OpenAPI 对齐。
 *
 * ## 三条硬约束
 *
 * 1. **header 必须合并，不能覆盖。** 旧实现把 `...options` 展开在 `headers` 之后，
 *    调用方一传 headers，默认头就被整体替换（典型表现：POST 丢了
 *    `Content-Type`，服务端当成表单处理）。
 * 2. **错误必须带 `code`。** 认证分支（需要验证码 / 验证码错 / 凭据错）只能靠
 *    Lucent 的稳定错误码判断，所以统一抛 {@link ApiError}，不让调用方各自摸响应体。
 * 3. **cookie 默认带上。** 会话走 httpOnly cookie（见 `api-config.ts`）。
 */

export interface ApiRequestOptions {
  /** 请求方法，默认 `GET`。 */
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  /** JSON 请求体；`undefined` 时不发送 body，也不设置 `Content-Type`。 */
  body?: unknown;
  /** 额外的请求头；与默认头**合并**（同名时以这里的为准）。 */
  headers?: Record<string, string>;
  /** `AbortSignal`，用于超时与组件卸载时取消。 */
  signal?: AbortSignal;
  /** 覆盖 cookie 策略；默认取 `api-config.ts` 的全局设置。 */
  credentials?: RequestCredentials;
}

/** 把字节流之外的失败（网络中断、DNS、CORS 预检被拦）与「服务端明确返回的错误」分开。 */
export class NetworkError extends Error {
  readonly cause: unknown;

  constructor(message: string, cause: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;

  const text = await response.text();
  if (text.length === 0) return null;

  const contentType = response.headers.get('content-type') ?? '';
  // 非 JSON 的响应体（例如网关的 HTML 错误页）原样交给解析器回落，不在这里抛。
  if (!contentType.includes('json')) return text;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/**
 * 发一个请求并把错误归一成 {@link ApiError}。
 *
 * @param path 业务路径，例如 `/auth/login`（不含 `/api/v1`，由 `lucentUrl` 负责）。
 * @throws {ApiError} 服务端返回了 4xx / 5xx。
 * @throws {NetworkError} 请求根本没到服务端（断网、CORS 被拦、超时取消）。
 */
export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, signal, credentials } = options;

  const mergedHeaders: Record<string, string> = {
    Accept: 'application/json',
    // 显式合并：调用方同名头覆盖默认值，其余默认值保留。
    ...headers
  };

  // 只有带 body 时才声明 Content-Type：GET/DELETE 带上它会让部分中间层
  // 触发不必要的预检。
  if (body !== undefined && mergedHeaders['Content-Type'] === undefined) {
    mergedHeaders['Content-Type'] = 'application/json';
  }

  let response: Response;
  try {
    const { lucentCredentialsInclude, lucentUrl } = await import('@/lib/api-config');
    response = await fetch(lucentUrl(path), {
      method,
      headers: mergedHeaders,
      credentials: credentials ?? (lucentCredentialsInclude() ? 'include' : 'omit'),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...(signal ? { signal } : {})
    });
  } catch (error) {
    // fetch 只在「请求没发出去」或「响应没回来」时抛；CORS 预检失败也在这里。
    throw new NetworkError(`Request to ${path} failed before a response arrived`, error);
  }

  const payload = await readBody(response);

  if (!response.ok) {
    throw new ApiError(parseProblemDetails(response.status, payload));
  }

  return payload as T;
}
