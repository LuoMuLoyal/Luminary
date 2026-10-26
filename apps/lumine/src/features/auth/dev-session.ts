/**
 * 开发模式的测试会话。
 *
 * ## 它解决什么问题
 *
 * 受保护区（`/dashboard` 及后续的工作台路由）在 `beforeLoad` 里要求
 * `status === 'authenticated'`，而这个状态只能由 Lucent 的 `/account` 给出。
 * 只看界面时不必起一整套后端（Postgres + Redis + Lucent），此时注入一个本地用户
 * 就能直接进到页面里改样式、看侧边栏。
 *
 * ## 为什么必须显式开启，且只在开发构建里生效
 *
 * **默认关闭**。没有 `VITE_LUMINE_MOCK_SESSION=true` 时，一切照旧走真实会话；
 * 就连开关为真，`import.meta.env.DEV` 为假的产物里也一律返回 `null`。
 * 这层是硬约束而不是礼貌提示：一旦漏到生产构建，它会绕过全部鉴权，
 * 让任何人直接进工作台。
 *
 * ## 它不模拟的
 *
 * 注入的只是 **store 里的登录态**，不发请求、不建 cookie、也不让接口调用成功。
 * 页面自身的 `fetch` 仍会拿到 401，请求层的 `handleRequestFailure` 会把会话
 * 打回未登录——这是故意的：用假用户在界面上假装有数据，比直接报错更难排查。
 * 要看真实数据，请起 Lucent。
 */

import type { SessionUser } from '@/features/auth/api/types';

const MOCK_USER: SessionUser = {
  id: '00000000-0000-4000-8000-000000000000',
  email: 'dev@lumine.local',
  nickname: 'Dev',
  avatar: null,
  emailVerified: true,
  emailVerifiedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

/**
 * 开发测试会话是否启用。
 *
 * 两个条件缺一不可：构建期注入的 `VITE_LUMINE_MOCK_SESSION === 'true'`，以及
 * 当前是 `vite dev`（或测试）构建。调用方拿到 `null` 表示「没有测试会话」。
 */
export function devMockSession(): SessionUser | null {
  if (!import.meta.env.DEV) return null;
  if (import.meta.env.VITE_LUMINE_MOCK_SESSION !== 'true') return null;
  return MOCK_USER;
}
