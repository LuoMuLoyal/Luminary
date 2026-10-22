import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import RegisterForm from './register-form';
import { AuthShell } from './auth-shell';

interface RegisterViewProps {
  /** 注册成功后的回跳路径。 */
  redirectTo?: string;
}

/** 注册页。 */
export default function RegisterView({ redirectTo }: RegisterViewProps) {
  return (
    <AuthShell
      title='注册账号'
      description='需要邮箱验证码完成注册'
      switchAction={
        <Button variant='ghost' asChild>
          <Link to='/auth/sign-in'>返回登录</Link>
        </Button>
      }
      footer={
        <p className='text-muted-foreground px-8 text-center text-sm'>
          服务条款与隐私政策以官网为准。
        </p>
      }
    >
      <RegisterForm {...(redirectTo !== undefined && { redirectTo })} />
    </AuthShell>
  );
}
