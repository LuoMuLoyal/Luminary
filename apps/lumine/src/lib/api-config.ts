/**
 * Lucent API 的运行时配置。
 *
 * 三件事集中在这里，避免散落在各处的字符串字面量：
 *   1. base URL —— 默认指向本机 Lucent（`/api` + 版本号 `1`，见 Lucent
 *      `setup-app.ts` 的 `setGlobalPrefix('api')` 与 `defaultVersion: '1'`）；
 *   2. 请求路径拼接；
 *   3. 是否带上浏览器凭据（cookie）。
 *
 * 凭据策略由本计划的方案 A 决定：Lucent 新增 httpOnly cookie 会话端点后，
 * Web 端与桌面端都靠 `credentials: 'include'` 同一条路径，不再各自持有 token。
 */

const DEFAULT_API_BASE = 'http://127.0.0.1:3000';

function readEnv(key: string): string | undefined {
  // import.meta.env 在测试（node 环境）与 SSR 壳里都可能不存在，显式兜底。
  const env = (import.meta as ImportMeta & { env?: Record<string, unknown> }).env;
  const value = env?.[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

/**
 * API 根地址，**不带**版本前缀之后的路径。可被 `VITE_LUCENT_API_BASE` 覆盖。
 *
 * 生产环境的真实地址由构建期注入，不入库（与 Luminous 的 `LUCENT_PROD_BASE_URL`
 * 口径一致：部署地址不写进仓库）。
 */
export function lucentApiBase(): string {
  return trimTrailingSlashes(readEnv('VITE_LUCENT_API_BASE') ?? DEFAULT_API_BASE);
}

/** 请求时是否携带 cookie。认证会话依赖它，所以默认就是 true。 */
export function lucentCredentialsInclude(): boolean {
  const raw = readEnv('VITE_LUCENT_CREDENTIALS');
  return raw !== 'omit';
}

/**
 * 把业务路径拼成完整 URL。
 *
 * @param path 以 `/` 开头的业务路径，例如 `/auth/login`（**不要**自己带 `/api/v1`）。
 */
export function lucentUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${lucentApiBase()}/api/v1${normalized}`;
}
