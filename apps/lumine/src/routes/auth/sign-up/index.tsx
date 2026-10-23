import { createFileRoute } from '@tanstack/react-router';

import RegisterView from '@/features/auth/components/register-view';
import { authSearchSchema } from '@/features/auth/search';
import i18n from '@/lib/i18n';

export const Route = createFileRoute('/auth/sign-up/')({
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [
      { title: `${i18n.t('auth.signUp.title')} · ${i18n.t('app.name')}` },
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  }),
  component: SignUpRoute
});

function SignUpRoute() {
  const { redirect } = Route.useSearch();
  return <RegisterView redirectTo={redirect} />;
}
