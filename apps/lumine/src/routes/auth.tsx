import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { useSessionStore } from '@/features/auth/session';

/**
 * `/auth` 布局。
 *
 * ## 已登录访问登录/注册页时直接回跳
 *
 * 不这样的话，一个已登录用户点到登录页会看到表单，填完再次提交——体验上是
 * 「明明登录了还要再登一次」。这里按会话状态重定向到 `redirect` 目标（或 `/dashboard`）。
 *
 * ## 为什么要等 `unknown` 出结果
 *
 * 首屏时 `bootstrap()` 还在飞。此时若直接放行表单，已登录用户会短暂看到登录页；
 * 若直接重定向，未登录用户会被无谓地踢走。等一次是唯一正确的做法。
 */
export const Route = createFileRoute('/auth')({
  beforeLoad: async ({ location }) => {
    // 只有进入登录/注册页时才需要这个判断；`/auth` 本身由 index 路由重定向。
    if (!location.pathname.startsWith('/auth/')) return;

    if (useSessionStore.getState().status === 'unknown') {
      await useSessionStore.getState().bootstrap();
    }

    if (useSessionStore.getState().status === 'authenticated') {
      const redirectTo = new URLSearchParams(location.searchStr).get('redirect');
      throw redirect({ to: redirectTo ?? '/dashboard', replace: true });
    }
  },
  component: AuthLayout
});

function AuthLayout() {
  return <Outlet />;
}
