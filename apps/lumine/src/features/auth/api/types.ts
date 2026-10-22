/**
 * Lucent 认证端点与响应体类型。
 *
 * 契约源是 `Lucent/docs/reference/generated/openapi.json`；这里手写的是
 * **cookie 会话那条路**（`/auth/session/*` + `/auth/me`），它刻意与 Bearer 那条路
 * 形状不同：**响应里没有 tokens**。
 */

/** 会话用户资料（`/auth/me` 与登录/注册/刷新共用）。 */
export interface SessionUser {
  id: string;
  email: string;
  nickname: string | null;
  avatar: string | null;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 建立或轮换会话的响应。`expiresIn` 是 access token 的剩余秒数。 */
export interface SessionResponse {
  user: SessionUser;
  expiresIn: number;
}

/** 登录请求。密码与验证码二选一；都缺时服务端按统一凭据失败处理。 */
export interface LoginRequest {
  email: string;
  password?: string;
  code?: string;
  captchaToken?: string;
}

/** 注册请求。`code` 是邮箱验证码，必填。 */
export interface RegisterRequest {
  email: string;
  password: string;
  code: string;
  captchaToken?: string;
  nickname?: string;
}

/** `POST /auth/send-verification-code` 的请求。 */
export interface SendVerificationCodeRequest {
  email: string;
  scene: VerificationScene;
}

/** 验证码场景，与服务端 `VERIFICATION_SCENES` 一致。 */
export type VerificationScene =
  | 'register'
  | 'login'
  | 'change-email'
  | 'set-password'
  | 'delete-account'
  | 'forgot-password';

/** `POST /auth/send-verification-code` 的响应：冷却秒数 + 提示文案。 */
export interface SendVerificationCodeResponse {
  cooldown: number;
  message: string;
}

/**
 * `GET /auth/captcha` 的响应。
 *
 * `enabled` 为 false 时不需要渲染人机验证，`siteKey` 也不应被使用。
 */
export interface CaptchaConfig {
  enabled: boolean;
  siteKey: string;
}
