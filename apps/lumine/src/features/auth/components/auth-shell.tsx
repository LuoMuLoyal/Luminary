import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { InteractiveGridPattern } from './interactive-grid';

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
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='absolute top-4 right-4 md:top-8 md:right-8'>{switchAction}</div>

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
          Lumine
        </div>
        <InteractiveGridPattern
          className={cn(
            'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[0%] h-full skew-y-12'
          )}
        />
        <div className='text-sidebar-foreground relative z-20 mt-auto'>
          <p className='text-lg'>药品知识工作台</p>
          <p className='text-sidebar-foreground/70 mt-2 text-sm'>
            面向药品研发与药学分析：靶点机制、成药性、结构与图谱。
          </p>
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
