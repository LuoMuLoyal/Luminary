/**
 * 契约类型的**别名**，不是手写定义。
 *
 * 每个类型都指向 `@/lib/generated/lucent-api`（由 Lucent 的 `openapi.json`
 * 生成）里的 schema。这里存在的唯一理由是让业务代码用短名字，
 * 并在后端重命名 schema 时**只有这一个文件需要改**。
 *
 * 规则：**不要在这里手写字段**。需要新字段就去改后端契约，然后
 * `pnpm contract` 重新生成——否则又回到「维护第二份契约」。
 */

import type { components } from '@/lib/generated/lucent-api';

/** 会话用户资料（`/auth/me` 与登录/注册/刷新的响应共用）。 */
export type SessionUser = components['schemas']['SessionResponseUser'];

/** 建立或轮换会话的响应。`expiresIn` 是 access token 的剩余秒数。 */
export type SessionResponse = components['schemas']['SessionResponse'];

/** 登录请求体。密码与验证码二选一。 */
export type LoginRequest = components['schemas']['LoginSessionRequest'];

/** 注册请求体。`code` 是邮箱验证码，必填。 */
export type RegisterRequest = components['schemas']['RegisterSessionRequest'];

/** `POST /auth/send-verification-code` 的响应：冷却秒数 + 提示文案。 */
export type SendVerificationCodeResponse = components['schemas']['SendVerificationCodeResponse'];

/** `GET /auth/captcha` 的响应。`enabled` 为 false 时不需要渲染人机验证。 */
export type CaptchaConfig = components['schemas']['CaptchaResponse'];

/**
 * 验证码场景。取请求 schema 里 `scene` 字段的类型，
 * 因此后端加场景时这里自动跟上，不会漏。
 */
export type VerificationScene = components['schemas']['SendVerificationCodeRequest']['scene'];
