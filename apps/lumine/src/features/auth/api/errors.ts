import { ApiError } from '@/lib/problem-details';

/**
 * 把 Lucent 的错误映射成一句可展示的文案。
 *
 * ## 为什么按 `code` 而不是按 HTTP status
 *
 * 认证侧的失败有一半是同一个 401：密码错、账号不存在、验证码错服务端**刻意**
 * 统一成 `AUTH_WRONG_PASSWORD`（反枚举）。前端如果按 status 分支，只能给一句
 * 含糊的话；按 code 分支才能把「需要人机验证」「验证码过期」「限流」这些
 * **可操作**的差异讲清楚。
 *
 * ## 文案规则
 *
 * - 凭据类错误一律同一句：**不暗示账号是否存在**；
 * - 网络层失败与 5xx 分开说，避免用户改密码去解决一个服务端问题；
 * - 未识别的 code 回落到服务端给的 `detail`，再不行用状态码标题。
 */

/** `code` → 文案。键名与 Lucent `problem-catalog.ts` 的注册表一致。 */
const COPY_BY_CODE: Readonly<Record<string, string>> = {
  AUTH_WRONG_PASSWORD: '邮箱或密码、验证码不正确',
  AUTH_REQUIRED: '登录状态已失效，请重新登录',
  AUTH_TOKEN_EXPIRED: '登录状态已过期，请重新登录',
  AUTH_REFRESH_TOKEN_INVALID: '登录状态已失效，请重新登录',
  AUTH_CAPTCHA_REQUIRED: '请先完成人机验证',
  AUTH_CAPTCHA_INVALID: '人机验证未通过，请重试',
  AUTH_VERIFICATION_CODE_EXPIRED: '验证码已过期，请重新获取',
  AUTH_VERIFICATION_CODE_MISMATCH: '验证码不正确',
  AUTH_VERIFICATION_CODE_COOLDOWN: '验证码发送过于频繁，请稍后再试',
  VALIDATION_FAILED: '填写的内容不符合要求',
  RATE_LIMITED: '操作过于频繁，请稍后再试',
  DEPENDENCY_UNAVAILABLE: '服务暂时不可用，请稍后再试'
};

/**
 * @param error 任意异常。
 * @returns 一句面向用户的文案；永远不返回空串。
 */
export function describeAuthError(error: unknown): string {
  if (error instanceof ApiError) {
    const known = error.code === null ? undefined : COPY_BY_CODE[error.code];
    if (known !== undefined) return known;

    // 没登记的 code：用服务端 detail（可能是本地化过的说明），再退到标题。
    if (error.problem.detail !== null) return error.problem.detail;
    return error.problem.title;
  }

  if (error instanceof Error && error.name === 'NetworkError') {
    return '无法连接服务器，请检查网络';
  }

  return '操作失败，请稍后重试';
}

/**
 * 是否为「需要重新登录」的失败。
 *
 * 会话层用它决定要不要清空本地登录态并跳登录页——不能把这类 401 当成
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
