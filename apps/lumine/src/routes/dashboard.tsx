import { createFileRoute } from '@tanstack/react-router';

import { AppShell } from '@/components/layout/app-shell';
import { requireSession } from '@/features/auth/require-session';
import i18n from '@/lib/i18n';

/**
 * 受保护区域的壳路由。守卫与元信息在这里，界面在 {@link AppShell}——
 * 与 `/analysis` 共用同一份外壳（见 `analysis.tsx`）。
 */
export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: [
      { title: i18n.t('app.name') },
      {
        name: 'description',
        content: i18n.t('app.tagline')
      },
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  }),
  beforeLoad: ({ location }) => requireSession(location),
  component: AppShell
});
