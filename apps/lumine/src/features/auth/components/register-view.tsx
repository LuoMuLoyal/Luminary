import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <AuthShell
      title={t('auth.signUp.title')}
      description={t('auth.signUp.description')}
      switchAction={
        <Button variant='ghost' asChild>
          <Link to='/auth/sign-in'>{t('auth.switchToSignIn')}</Link>
        </Button>
      }
      footer={
        <p className='text-muted-foreground px-8 text-center text-sm'>{t('auth.footer.terms')}</p>
      }
    >
      <RegisterForm {...(redirectTo !== undefined && { redirectTo })} />
    </AuthShell>
  );
}
