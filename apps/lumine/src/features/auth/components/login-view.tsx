import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import LoginForm from './user-auth-form';
import { AuthShell } from './auth-shell';

interface LoginViewProps {
  /** 登录成功后的回跳路径。 */
  redirectTo?: string;
}

/** 登录页。视觉壳见 `auth-shell.tsx`，表单见 `user-auth-form.tsx`。 */
export default function LoginView({ redirectTo }: LoginViewProps) {
  return (
    <AuthShell
      title='登录'
      description='登录后访问药品知识工作台'
      switchAction={
        <Button variant='ghost' asChild>
          <Link to='/auth/sign-up'>注册账号</Link>
        </Button>
      }
      footer={
        <p className='text-muted-foreground px-8 text-center text-sm'>
          服务条款与隐私政策以官网为准。
        </p>
      }
    >
      <LoginForm {...(redirectTo !== undefined && { redirectTo })} />
    </AuthShell>
  );
}
