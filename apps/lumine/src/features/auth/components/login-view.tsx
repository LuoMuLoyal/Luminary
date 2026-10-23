import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <AuthShell
      title={t('auth.signIn.title')}
      description={t('auth.signIn.description')}
      switchAction={
        <Button variant='ghost' asChild>
          <Link to='/auth/sign-up'>{t('auth.switchToSignUp')}</Link>
        </Button>
      }
      footer={
        <p className='text-muted-foreground px-8 text-center text-sm'>{t('auth.footer.terms')}</p>
      }
    >
      <LoginForm {...(redirectTo !== undefined && { redirectTo })} />
    </AuthShell>
  );
}
