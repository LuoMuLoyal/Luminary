import { expectData, NetworkError, lucent } from '@/lib/api-client';

/**
 * 认证端点的唯一调用入口 —— **类型全部来自 OpenAPI 契约**。
 *
 * 路径与载荷由 `@/generated/lucent-api`（从 Lucent 的 openapi.json 生成）
 * 推导，因此这里没有手写的请求 / 响应类型：后端改字段，这里立刻是类型错误。
 *
 * 全部走 **httpOnly cookie 会话**（`/auth/browser/*`）：响应体里没有 token，
 * cookie 由浏览器收下，脚本读不到。
 *
 * 路径用 `browser` 而不是 `cookie`：它表达的是**安全契约**（token 不进响应体、
 * 脚本不可读），不是存储机制。Bearer 那条路（`/auth/login` 等）会把 token
 * 放进响应体，供无法使用 cookie 的客户端使用——两者不能共用一个端点。
 */

/** 登录并建立会话。 */
export async function login(body: {
  email: string;
  password?: string;
  code?: string;
  captchaToken?: string;
}) {
  return expectData(await lucent.POST('/api/v1/auth/browser/login', { body }));
}

/** 注册并建立会话。`code` 是邮箱验证码，必填。 */
export async function register(body: {
  email: string;
  password: string;
  code: string;
  captchaToken?: string;
  nickname?: string;
}) {
  return expectData(await lucent.POST('/api/v1/auth/browser/register', { body }));
}

/** 轮换会话。access token 过期时由会话层调用。 */
export async function refresh() {
  return expectData(await lucent.POST('/api/v1/auth/browser/refresh', {}));
}

/** 登出并清掉 cookie。幂等：没有会话时也应视为成功。 */
export async function logout(): Promise<void> {
  // 204 没有响应体，所以不能用 expectData（它会要求 data 存在）。
  const { response, error } = await lucent.POST('/api/v1/auth/browser/logout', {});
  if (error !== undefined || !response.ok) {
    // 中间件通常已经抛错；这里兜住「中间件未命中」的路径，保持语义一致。
    throw new NetworkError(`Logout failed with ${String(response.status)}`, error);
  }
}

/**
 * 读取当前账户资料。
 *
 * 走 `GET /account`——账户资料只有这一个读入口。登录/注册/刷新的响应里虽然也
 * 带用户块，但那是「会话建立」的产物；会话恢复（刷新页面、access token 过期后
 * 重试）应当读账户资料，而不是把登录时的快照当权威。
 *
 * 401 表示未登录，调用方不应把它当错误展示。
 */
export async function getAccount() {
  return expectData(await lucent.GET('/api/v1/account'));
}

/**
 * 发送邮箱验证码，返回冷却秒数。
 *
 * 冷却值来自服务端（`cooldown`），客户端**不要写死**——服务端改配置时
 * 写死值会造成「按钮亮了但服务端还没放行」的 429。
 */
export async function sendVerificationCode(body: {
  email: string;
  scene:
    | 'register'
    | 'login'
    | 'change-email'
    | 'set-password'
    | 'delete-account'
    | 'forgot-password';
}) {
  return expectData(await lucent.POST('/api/v1/auth/send-verification-code', { body }));
}

/** 人机验证配置。`enabled` 为 false 时不需要渲染 Turnstile。 */
export async function getCaptchaConfig() {
  return expectData(await lucent.GET('/api/v1/auth/captcha'));
}
