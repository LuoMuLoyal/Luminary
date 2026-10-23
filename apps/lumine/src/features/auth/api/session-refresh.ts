import { singleFlight } from '@/lib/single-flight';

import { refresh as requestRefresh } from './service';
import type { SessionResponse } from './types';

/**
 * 会话轮换 —— **单飞**。
 *
 * ## 为什么必须单飞
 *
 * Lucent 的 refresh 是**一次性轮换**：成功后旧 refresh token 立即作废
 * （服务端原子认领会话）。如果页面上两个请求同时拿到 401、各自调一次刷新，
 * 第二个必然拿到 `AUTH_REFRESH_TOKEN_INVALID`——用户被迫重新登录，
 * 而原因是纯粹的内部竞态。
 *
 * 所以刷新入口只有这一个，且并发调用共享一次网络请求。
 * **不要绕过它直接调 `service.refresh`。**
 *
 * ## 失败语义
 *
 * 轮换失败不会被缓存：调用方下次再调会真正重试。若失败是
 * `AUTH_REFRESH_TOKEN_INVALID`，说明会话确实没了，会话层据此转 `anonymous`。
 */
export const refreshSession: () => Promise<SessionResponse> = singleFlight(() => requestRefresh());
