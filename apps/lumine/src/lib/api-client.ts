/**
 * Lucent API 客户端 —— **由 OpenAPI 契约驱动的类型化客户端**。
 *
 * ## 为什么用 `openapi-fetch` 而不是手写 fetch 包装
 *
 * 契约的唯一事实源是 Lucent 的 `docs/reference/generated/openapi.json`。
 * 手写请求层等于维护第二份契约：路径拼错、字段改名、响应形状变化都不会在
 * 编译期暴露。`openapi-fetch` 直接消费生成的 `paths`，**路径与载荷都由后端
 * 契约推导**——写错路径是类型错误，漏字段是类型错误。
 *
 * ## 错误仍然是 RFC 9457 Problem Details
 *
 * Lucent 的错误体是 `application/problem+json`（ADR-0012），认证侧必须拿到
 * 稳定 `code` 才能分支（`AUTH_CAPTCHA_REQUIRED` / `AUTH_WRONG_PASSWORD` ...）。
 * 所以这里注册一个 `onResponse` 中间件：非 2xx 时解析成 `ApiError` 并抛出，
 * 调用方只写 try/catch，不必每次判断 `error` 字段。
 *
 * ## cookie
 *
 * 会话走 httpOnly cookie（`/auth/browser/*`），因此全局 `credentials: 'include'`。
 * 这不是可选项——漏掉它浏览器不会带 cookie，表现是「登录成功但立刻 401」。
 */

import createClient, { type Middleware } from 'openapi-fetch';

import { ApiError, parseProblemDetails } from '@/lib/problem-details';
import type { paths } from '@/generated/lucent-api';
import { lucentApiBase, lucentCredentialsInclude } from './api-config';

/**
 * 把非 2xx 响应归一成 {@link ApiError}。
 *
 * 放在中间件里而不是每个调用点：认证分支要用 `code`，漏一处就会出现
 * 「这里报 401、那里报 200 但没数据」的不一致。
 */
const problemDetailsMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.ok) return response;

    // 204 之类没有体，`json()` 会抛；先探 content-type 再决定怎么读。
    const contentType = response.headers.get('content-type') ?? '';
    let payload: unknown = null;

    try {
      payload = contentType.includes('json')
        ? await response.clone().json()
        : await response.clone().text();
    } catch {
      // 读不出来就退回纯状态码，解析器对畸形输入是宽容的。
      payload = null;
    }

    throw new ApiError(parseProblemDetails(response.status, payload));
  }
};

/**
 * 全局客户端。业务模块只从这里取，不各自 `createClient`——
 * 否则 credentials 与错误语义会在各模块间漂移。
 */
/**
 * 创建客户端。
 *
 * `fetch` 可注入是**为测试而设计的接缝**：`openapi-fetch` 在创建时就把
 * `fetch` 捕获进闭包，事后 `vi.stubGlobal('fetch', ...)` 不会生效。
 * 与其在测试里玩模块加载顺序，不如把依赖显式传进来。
 */
export function createLucentClient(options: { fetch?: typeof fetch } = {}) {
  const client = createClient<paths>({
    baseUrl: lucentApiBase(),
    credentials: lucentCredentialsInclude() ? 'include' : 'omit',
    ...(options.fetch !== undefined && { fetch: options.fetch })
  });

  client.use(problemDetailsMiddleware);
  return client;
}

/** 业务模块使用的单例。测试请用 {@link createLucentClient} 注入假 fetch。 */
export const lucent = createLucentClient();

/**
 * 网络层失败（请求没发出去 / 响应没回来）。
 *
 * 与 {@link ApiError} 分开：前者是「连不上」，后者是「服务端明确拒绝」。
 * 把两者混成一个类型会让 UI 只能给一句含糊的文案。
 */
export class NetworkError extends Error {
  readonly cause: unknown;

  constructor(message: string, cause: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

/**
 * 把 `openapi-fetch` 的「零值风格」返回值收敛成「成功即数据、失败即异常」。
 *
 * `openapi-fetch` 不抛错，返回 `{ data, error, response }`。业务代码里
 * 大多数路径只关心成功值，所以包一层；需要精细处理响应头的地方可以直接用
 * {@link lucent}（`/auth/browser/*` 的 `expiresIn` 已在响应体里，不必读头）。
 *
 * @param result `openapi-fetch` 的返回值。
 * @throws {ApiError} 非 2xx（由中间件抛出前已转换）。
 * @throws {NetworkError} 请求未到达服务端。
 */
export async function expectData<T>(result: {
  data?: T;
  error?: unknown;
  response: Response;
}): Promise<T> {
  if (result.error !== undefined) {
    // 中间件已经抛过；走到这里说明中间件未命中（例如自定义 response 处理）。
    throw new ApiError(parseProblemDetails(result.response.status, result.error));
  }

  if (result.data === undefined) {
    throw new NetworkError(
      `Request to ${result.response.url || 'Lucent'} returned no body`,
      undefined
    );
  }

  return result.data;
}
