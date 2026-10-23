import { ApiError } from '@/lib/problem-details';

/**
 * 把 Lucent 的失败映射成 **i18n key**。
 *
 * ## 为什么返回 key 而不是文案
 *
 * 这里没有 `t()` 可用（错误可能在组件外产生），而且同一个失败在不同上下文
 * 的措辞可能不同。返回 key 让文案留在 locale 文件里——**默认英文**，
 * 由界面语言决定实际显示。
 *
 * ## 为什么按 `code` 而不是按 HTTP status
 *
 * 认证侧的失败有一半是同一个 401：密码错、账号不存在、验证码错服务端**刻意**
 * 统一成 `AUTH_WRONG_PASSWORD`（反枚举）。按 status 分支只能给一句含糊的话；
 * 按 code 才能把「需要人机验证」「验证码过期」「限流」这些**可操作**的差异
 * 讲清楚。
 *
 * ## 文案规则
 *
 * - 凭据类错误一律同一句：**不暗示账号是否存在**；
 * - 网络层失败与 5xx 分开说，避免用户改密码去解决一个服务端问题。
 */

/** `code` → i18n key。键名与 Lucent `problem-catalog.ts` 的注册表一致。 */
const KEY_BY_CODE: Readonly<Record<string, string>> = {
  AUTH_WRONG_PASSWORD: 'error.wrongCredentials',
  AUTH_REQUIRED: 'error.sessionExpired',
  AUTH_TOKEN_EXPIRED: 'error.sessionExpired',
  AUTH_REFRESH_TOKEN_INVALID: 'error.sessionExpired',
  AUTH_CAPTCHA_REQUIRED: 'error.captchaRequired',
  AUTH_CAPTCHA_INVALID: 'error.captchaInvalid',
  AUTH_VERIFICATION_CODE_EXPIRED: 'error.codeExpired',
  AUTH_VERIFICATION_CODE_MISMATCH: 'error.codeMismatch',
  AUTH_VERIFICATION_CODE_COOLDOWN: 'error.codeCooldown',
  VALIDATION_FAILED: 'error.validationFailed',
  RATE_LIMITED: 'error.rateLimited',
  DEPENDENCY_UNAVAILABLE: 'error.dependencyUnavailable'
};

/**
 * @param error 任意异常。
 * @returns 一个 i18n key；调用方用 `t(key)` 取文案。
 *   未识别的 code 回落到服务端 `detail`（已本地化过的服务端文案），
 *   再不行用 `error.unknown`。
 */
export function authErrorKey(error: unknown): string {
  if (error instanceof ApiError) {
    const known = error.code === null ? undefined : KEY_BY_CODE[error.code];
    if (known !== undefined) return known;

    // 未登记的 code：服务端 detail 是它自己的文案（可能是中文），
    // 但它比通用提示更有信息量；没有就退回通用。
    if (error.problem.detail !== null) return error.problem.detail;
    return 'error.unknown';
  }

  if (error instanceof Error && error.name === 'NetworkError') {
    return 'error.network';
  }

  return 'error.unknown';
}

/**
 * 是否为「需要重新登录」的失败。
 *
 * 会话层用它决定要不要清空登录态并跳登录页——不能把这类 401 当成
 * 「登录表单填错了」展示。
 */
export function isSessionExpired(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;

  return (
    error.status === 401 &&
    error.code !== 'AUTH_WRONG_PASSWORD' &&
    error.code !== 'AUTH_CAPTCHA_REQUIRED' &&
    error.code !== 'AUTH_CAPTCHA_INVALID'
  );
}
