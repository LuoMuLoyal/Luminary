import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { InteractiveGridPattern } from './interactive-grid';
import { LanguageSwitcher } from './language-switcher';

/**
 * 登录与注册共用的左右分栏壳。
 *
 * 只负责**布局与视觉**，不碰表单状态：两侧页面各自的字段差异很大
 * （登录有密码/验证码两种方式，注册要发验证码），把表单塞进来会让这个壳
 * 变成两个页面拼在一起。
 *
 * 小屏时隐藏左栏（`lg:flex`），因为品牌区在窄屏上会把表单挤到折叠线以下。
 */
interface AuthShellProps {
  /** 右上角的切换链接（登录 ↔ 注册）。 */
  switchAction: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  /** 表单下方的补充说明（条款链接等）。 */
  footer?: ReactNode;
}

export function AuthShell({ switchAction, title, description, children, footer }: AuthShellProps) {
  const { t } = useTranslation();

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* 右上角：语言切换 + 登录/注册互跳。两者放在同一行，语言永远在最右侧，
          这样表单页也有语言入口（账号菜单只在登录后才出现）。 */}
      <div className='absolute top-4 right-4 flex items-center gap-2 md:top-8 md:right-8'>
        <LanguageSwitcher />
        {switchAction}
      </div>

      <div className='relative hidden h-full flex-col p-10 lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-sidebar' />
        <div className='text-sidebar-foreground relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
            aria-hidden='true'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          {t('app.name')}
        </div>
        <InteractiveGridPattern
          className={cn(
            'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[0%] h-full skew-y-12'
          )}
        />
        <div className='text-sidebar-foreground relative z-20 mt-auto'>
          <p className='text-lg'>{t('app.tagline')}</p>
          <p className='text-sidebar-foreground/70 mt-2 text-sm'>{t('app.description')}</p>
        </div>
      </div>

      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
            <p className='text-muted-foreground text-sm'>{description}</p>
          </div>
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}
