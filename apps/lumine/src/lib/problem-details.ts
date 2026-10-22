/**
 * RFC 9457 Problem Details 的客户端解析（Lucent 的错误契约，见 ADR-0012）。
 *
 * Lucent 的所有错误响应体都是 `application/problem+json`，稳定字段是
 * `status` / `code` / `title` / `detail`。认证侧必须拿到 `code` 才能分支
 * （`AUTH_CAPTCHA_REQUIRED` / `AUTH_CAPTCHA_INVALID` / `AUTH_WRONG_PASSWORD` ...），
 * 而 `fetch` 本身只给 status —— 所以解析集中在这里，其余代码不再各自摸错误体。
 *
 * 本模块刻意不依赖任何浏览器 API：它被单元测试直接调用，也要在 Tauri 的
 * WebView 之外（Node 里）跑得通。
 */

/** 客户端能安全消费的错误信息。所有字段都已归一，不含 `undefined`。 */
export interface ProblemDetails {
  /** HTTP 状态码（来自响应本身，不可被错误体覆盖）。 */
  status: number;
  /** Lucent 的稳定错误码；错误体里没有时是 `null`。 */
  code: string | null;
  /** 简短标题；错误体没给时按 status 推导。 */
  title: string;
  /** 详细说明（可能是本地化过的文案）；没给时是 `null`。 */
  detail: string | null;
  /** RFC 9457 `type`，通常是错误码的 URI 形式；没给时是 `null`。 */
  type: string | null;
  /** RFC 9457 `instance`，指向出错的请求路径；没给时是 `null`。 */
  instance: string | null;
}

const STATUS_TITLES: Readonly<Record<number, string>> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  412: 'Precondition Failed',
  415: 'Unsupported Media Type',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout'
};

/** 按 status 推导一个可展示的标题。5xx 一律折成 Internal Server Error，避免泄露内部细节。 */
export function titleForStatus(status: number): string {
  if (status >= 500) return 'Internal Server Error';
  return STATUS_TITLES[status] ?? 'Request Failed';
}

function pickString(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

/**
 * 把任意的错误响应体解析成 {@link ProblemDetails}。
 *
 * 对畸形输入是**宽容**的：非对象、字段类型不对、干脆是 HTML（网关错误页）都不会抛，
 * 只会回落到按 status 推导的标题。调用方因此不需要再包一层 try/catch。
 *
 * @param status 响应的 HTTP 状态码；**优先于**错误体里的 `status`，
 *   因为错误体可能来自中间的代理而不是 Lucent 自己。
 * @param body 已解析的 JSON，或原始文本（解析失败时由调用方传原文）。
 */
export function parseProblemDetails(status: number, body: unknown): ProblemDetails {
  const source =
    body !== null && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};

  return {
    status,
    code: pickString(source, 'code'),
    title: pickString(source, 'title') ?? titleForStatus(status),
    detail: pickString(source, 'detail'),
    type: pickString(source, 'type'),
    instance: pickString(source, 'instance')
  };
}

/** 网络层与 API 层的统一异常：调用方只需判断 `code` / `status`。 */
export class ApiError extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(`${problem.status} ${problem.title}${problem.code ? ` (${problem.code})` : ''}`);
    this.name = 'ApiError';
    this.problem = problem;
  }

  get status(): number {
    return this.problem.status;
  }

  get code(): string | null {
    return this.problem.code;
  }
}
