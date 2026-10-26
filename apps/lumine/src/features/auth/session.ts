import { create } from 'zustand';

import * as authApi from '@/features/auth/api/service';
import { devMockSession } from '@/features/auth/dev-session';
import { isSessionExpired } from '@/features/auth/api/errors';
import { refreshSession } from '@/features/auth/api/session-refresh';
import type {
  AccountInfo,
  LoginRequest,
  RegisterRequest,
  SessionUser
} from '@/features/auth/api/types';

/**
 * 会话状态。
 *
 * ## 这个 store 里为什么没有 token
 *
 * 会话走 httpOnly cookie（见 Lucent 的 `/auth/browser/*`），token 由浏览器收下，
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
 * 未登录。注意登录表单的密码错误也是 401，但它带 `AUTH_WRONG_PASSWORD`，
 * 被 `isSessionExpired` 排除在外。
 *
 * ## access token 过期 ≠ 会话结束
 *
 * access token 短命（分钟级到小时级），refresh cookie 长命。SPA 闲置一段时间后
 * `getAccount()` 会拿到 `AUTH_TOKEN_EXPIRED`，但**会话其实还在**。所以 `bootstrap` 在这
 * 种情况下先尝试静默续期再重试一次，而不是直接把人踢去登录页。
 *
 * 续期走 `refreshSession()`——**单飞**的那个入口。并发场景下多个请求同时发现
 * token 过期时，只会产生一次轮换请求；否则第二次必然因为旧 refresh token 已作废
 * 而失败（Lucent 的轮换是一次性的）。
 */

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous';

/**
 * 账户资料 → 会话用户。
 *
 * `GET /account` 是账户资料的读入口，但它比登录响应多几个字段
 * （`hasPassword` / `lastLoginAt` / `linkedIdentities`），store 里只放
 * 「填登录态需要的那部分」，因此在这里收窄一次，而不是让两个 schema 在组件里混用。
 *
 * `email` **保持可空**：OAuth-only 账号（如微信登录）真的没有邮箱，直到用户
 * 通过「设置邮箱」补一个。把它压成空串会让「没登录」「没邮箱」「邮箱是空串」
 * 三种状态长得一样，调用点也失去编译器保护。展示层（账号菜单）自己做兜底。
 */
function toSessionUser(account: AccountInfo): SessionUser {
  return {
    id: account.id,
    email: account.email,
    nickname: account.nickname,
    avatar: account.avatar,
    // `AccountDto` 只有 `emailVerifiedAt`，没有布尔位；已验证 ⟺ 时间非空。
    emailVerified: account.emailVerifiedAt !== null,
    emailVerifiedAt: account.emailVerifiedAt,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt
  };
}

interface SessionState {
  status: SessionStatus;
  user: SessionUser | null;

  /** 静默读取当前会话；401 视为未登录，不抛错。 */
  bootstrap: () => Promise<void>;
  /** 静默续期并刷新本地登录态。并发调用共享一次网络请求。 */
  refresh: () => Promise<SessionUser>;
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
    // 开发测试会话（默认关闭，见 dev-session.ts）：完全不碰网络。
    const mock = devMockSession();
    if (mock) {
      set({ status: 'authenticated', user: mock });
      return;
    }

    try {
      const user = toSessionUser(await authApi.getAccount());
      set({ status: 'authenticated', user });
      return;
    } catch (error) {
      if (!isSessionExpired(error)) {
        // 断网 / 5xx：按未登录处理，但不掩盖——页面上的错误展示由各自的请求负责，
        // 这里只管登录态。
        set({ status: 'anonymous', user: null });
        return;
      }
    }

    // access token 过期时先尝试静默续期，成功就仍在登录态。
    try {
      const user = await get().refresh();
      set({ status: 'authenticated', user });
    } catch {
      // 续期失败（refresh cookie 也没了 / 已被轮换掉）才是真的未登录。
      set({ status: 'anonymous', user: null });
    }
  },

  async refresh() {
    const { user } = await refreshSession();
    set({ status: 'authenticated', user });
    return user;
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
