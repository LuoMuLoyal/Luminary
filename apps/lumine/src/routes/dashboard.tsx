import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import CommandMenu from '@/components/command-menu';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useSessionStore } from '@/features/auth/session';
import i18n from '@/lib/i18n';

/**
 * 受保护区的路由。
 *
 * ## 鉴权在 `beforeLoad` 里做，不在组件里
 *
 * 放在 `beforeLoad` 才能在**渲染前**拦下；组件里跳转会先闪一下受保护页面的骨架。
 *
 * ## 为什么这里可以 `await` 一次判定
 *
 * 首屏时根组件刚发起 `bootstrap()`，状态还是 `unknown`。这里等它出结果再决定，
 * 否则会把「还没问过服务端」误判成未登录，并把人无谓地踢去登录页。
 *
 * ## 跳转要带 `redirect`
 *
 * 登录成功后回到原路径，否则用户点链接进来、登录完却落在首页。
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
  beforeLoad: async ({ location }) => {
    if (useSessionStore.getState().status === 'unknown') {
      await useSessionStore.getState().bootstrap();
    }

    if (useSessionStore.getState().status !== 'authenticated') {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect: location.href },
        replace: true
      });
    }
  },
  component: DashboardLayout
});

function DashboardLayout() {
  return (
    <CommandMenu>
      <SidebarProvider>
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring'
        >
          Skip to content
        </a>
        <AppSidebar />
        <SidebarInset id='main-content' tabIndex={-1}>
          <Header />
          <InfobarProvider defaultOpen={false}>
            <Outlet />
            <InfoSidebar side='right' />
          </InfobarProvider>
        </SidebarInset>
      </SidebarProvider>
    </CommandMenu>
  );
}
