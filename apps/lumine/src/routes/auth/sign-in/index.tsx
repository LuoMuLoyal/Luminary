import { createFileRoute } from '@tanstack/react-router';

import LoginView from '@/features/auth/components/login-view';
import { authSearchSchema } from '@/features/auth/search';
import i18n from '@/lib/i18n';

export const Route = createFileRoute('/auth/sign-in/')({
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [
      { title: `${i18n.t('auth.signIn.title')} · ${i18n.t('app.name')}` },
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  }),
  component: SignInRoute
});

function SignInRoute() {
  const { redirect } = Route.useSearch();
  return <LoginView redirectTo={redirect} />;
}
