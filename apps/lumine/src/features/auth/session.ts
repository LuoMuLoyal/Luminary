import { create } from 'zustand';

import * as authApi from '@/features/auth/api/service';
import { isSessionExpired } from '@/features/auth/api/errors';
import type { LoginRequest, RegisterRequest, SessionUser } from '@/features/auth/api/types';

/**
 * 会话状态。
 *
 * ## 这个 store 里为什么没有 token
 *
 * 会话走 httpOnly cookie（见 `Lucent` 的 `/auth/session/*`），token 由浏览器收下，
 * **脚本读不到**。所以这里能存的只有「用户是谁 + 登录态三态」，这正是设计意图：
 * 即使发生 XSS，也偷不到可复用的凭据。
 *
 * ## 三态而不是布尔
 *
 * SPA 没有服务端可以替我们在首屏判定登录态。用 `status: 'unknown'` 表达
 * 「还没问过服务端」——把它当成 boolean 的 false 会让每次刷新都先闪一下登录页。
 *
 * ## 401 的统一处理
 *
 * 任何一次请求拿到「会话失效」的 401（`isSessionExpired`），都直接把 store 置为
 * 未登录，而不是让每个页面各写一遍跳转逻辑。注意登录表单的密码错误也是 401，
 * 但它带 `AUTH_WRONG_PASSWORD`，由 `isSessionExpired` 排除在外。
 */

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous';

interface SessionState {
  status: SessionStatus;
  user: SessionUser | null;

  /** 静默读取当前会话；401 视为未登录，不抛错。 */
  bootstrap: () => Promise<void>;
  login: (input: LoginRequest) => Promise<SessionUser>;
  register: (input: RegisterRequest) => Promise<SessionUser>;
  logout: () => Promise<void>;
  /** 供任意请求的失败分支调用：确认是会话失效时清理本地登录态。 */
  handleRequestFailure: (error: unknown) => void;
  /** 供「会话失效」时从外部显式清理。 */
  clear: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  status: 'unknown',
  user: null,

  async bootstrap() {
    // 已经在判定中或已判定过的情况不重复打；调用方可以随时再调，成本是一次请求。
    try {
      const user = await authApi.me();
      set({ status: 'authenticated', user });
    } catch (error) {
      // 401 = 未登录；其它错误（断网、5xx）也按未登录处理，但不掩盖——
      // 页面上的错误展示由各自的请求负责，这里只管登录态。
      if (!isSessionExpired(error)) {
        set({ status: 'anonymous', user: null });
        return;
      }
      set({ status: 'anonymous', user: null });
    }
  },

  async login(input) {
    const { user } = await authApi.login(input);
    set({ status: 'authenticated', user });
    return user;
  },

  async register(input) {
    const { user } = await authApi.register(input);
    set({ status: 'authenticated', user });
    return user;
  },

  async logout() {
    try {
      await authApi.logout();
    } finally {
      // 无论服务端是否成功，本地必须回到未登录：否则会卡在
      // 「cookie 已清、界面还显示已登录」的自相矛盾状态。
      get().clear();
    }
  },

  handleRequestFailure(error) {
    if (isSessionExpired(error)) {
      set({ status: 'anonymous', user: null });
    }
  },

  clear() {
    set({ status: 'anonymous', user: null });
  }
}));
