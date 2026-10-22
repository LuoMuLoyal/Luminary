import { request } from '@/lib/api-client';
import type {
  CaptchaConfig,
  LoginRequest,
  RegisterRequest,
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  SessionResponse,
  SessionUser
} from './types';

/**
 * 认证端点的唯一调用入口。
 *
 * 全部走 **httpOnly cookie 会话**（`/auth/session/*`），响应体里没有 tokens——
 * token 由浏览器在 `Set-Cookie` 里收下，脚本读不到。
 *
 * 所有方法都依赖调用方的 `request` 默认带 cookie（见 `lib/api-config.ts`）；
 * 这里不再重复声明 `credentials`。
 */

/** 注册并建立会话。成功后 cookie 已种下，无需另调登录。 */
export function register(input: RegisterRequest): Promise<SessionResponse> {
  return request<SessionResponse>('/auth/session/register', {
    method: 'POST',
    body: input
  });
}

/** 登录并建立会话。 */
export function login(input: LoginRequest): Promise<SessionResponse> {
  return request<SessionResponse>('/auth/session/login', {
    method: 'POST',
    body: input
  });
}

/** 轮换会话。access token 过期时由调用方（会话层）在 401 后重试。 */
export function refresh(): Promise<SessionResponse> {
  return request<SessionResponse>('/auth/session/refresh', { method: 'POST' });
}

/** 登出并清掉 cookie。幂等：没有会话时也应视为成功。 */
export async function logout(): Promise<void> {
  await request<null>('/auth/session/logout', { method: 'POST' });
}

/** 读取当前登录用户。401 表示未登录，调用方不应把它当成错误展示。 */
export function me(): Promise<SessionUser> {
  return request<SessionUser>('/auth/me');
}

/** 发送邮箱验证码，返回冷却秒数（服务端决定，不要在客户端写死）。 */
export function sendVerificationCode(
  input: SendVerificationCodeRequest
): Promise<SendVerificationCodeResponse> {
  return request<SendVerificationCodeResponse>('/auth/send-verification-code', {
    method: 'POST',
    body: input
  });
}

/** 人机验证配置。`enabled` 为 false 时不需要渲染 Turnstile。 */
export function getCaptchaConfig(): Promise<CaptchaConfig> {
  return request<CaptchaConfig>('/auth/captcha');
}
