import { Outlet } from '@tanstack/react-router';

import CommandMenu from '@/components/command-menu';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useNavT } from '@/lib/i18n/use-nav-t';

/**
 * 受保护区域的统一外壳：侧边栏 + 顶栏 + 内容区 + 右侧信息栏。
 *
 * ## 为什么抽成组件
 *
 * `/dashboard` 与 `/analysis` 是并列的两个受保护分支，外壳完全相同。
 * 各自复制一份的代价不是这 20 行，而是以后加东西时只改一处——
 * 表现是「两个分支的顶栏行为不一致」，且没有任何编译错误提示。
 *
 * 路由文件只负责守卫与元信息，外壳在这里。
 */
export function AppShell() {
  const navT = useNavT();

  return (
    <CommandMenu>
      <SidebarProvider>
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring'
        >
          {navT('a11y.skipToContent')}
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
