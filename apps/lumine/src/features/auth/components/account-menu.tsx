import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useSessionStore } from '@/features/auth/session';
import { LanguageMenuItems } from './language-menu-items';

/**
 * 侧边栏底部的账号区。
 *
 * 数据来自 `useSessionStore`——**不硬编码**用户信息（模板的假数据会让
 * 「登录了但显示别人」被误判成登录失败）。
 *
 * 头像不可用时的兜底取昵称/邮箱首字符，而不是固定的 `U`。
 */
export function AccountMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);

  // 受保护路由已保证登录态，但类型上仍是可空的：渲染期再守一次，
  // 避免会话在页面挂载后被踢掉时读到 null。
  if (user === null) return null;

  const displayName = user.nickname ?? user.email;
  const initial = displayName.trim().charAt(0).toUpperCase();

  async function handleLogout() {
    try {
      await logout();
      toast.success(t('auth.message.signedOut'));
    } catch {
      // 服务端吊销失败不阻塞退出：本地登录态已在 store 里清掉，
      // 未清的 cookie 由下次启动的 bootstrap 以 401 兜住。
      toast.warning(t('auth.message.signOutIncomplete'));
    }

    void navigate({ to: '/auth/sign-in', replace: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size='lg'
          aria-label={t('auth.account.openMenu')}
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <Avatar className='size-8 shrink-0 rounded-full'>
            {user.avatar !== null && <AvatarImage src={user.avatar} alt='' />}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-medium'>{displayName}</span>
            <span className='text-muted-foreground truncate text-xs'>{user.email}</span>
          </div>
          <Icons.chevronsDown className='ml-auto size-4' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
        side='bottom'
        align='end'
        sideOffset={4}
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{displayName}</p>
            <p className='text-muted-foreground text-xs leading-none'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <LanguageMenuItems />
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void handleLogout()}>
          <Icons.logout className='mr-2 h-4 w-4' />
          {t('auth.account.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
