import { createFileRoute } from '@tanstack/react-router';

import { AppShell } from '@/components/layout/app-shell';
import { requireSession } from '@/features/auth/require-session';
import i18n from '@/lib/i18n';

/**
 * 受保护区域的外壳路由。
 *
 * 这里只有守卫与元信息，界面在 {@link AppShell}：`/dashboard` 与 `/analysis`
 * 是它的两个并列子分支（TanStack Router 的文件路由用 `dashboard.tsx` /
 * `analysis.tsx` 表达「同级的父路由」）。
 */
export const Route = createFileRoute('/analysis')({
  head: () => ({
    meta: [
      { title: i18n.t('app.name') },
      { name: 'description', content: i18n.t('app.tagline') },
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  }),
  beforeLoad: ({ location }) => requireSession(location),
  component: AppShell
});
