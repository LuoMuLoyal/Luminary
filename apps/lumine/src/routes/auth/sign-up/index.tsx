import { createFileRoute } from '@tanstack/react-router';

import RegisterView from '@/features/auth/components/register-view';
import { authSearchSchema } from '@/features/auth/search';

export const Route = createFileRoute('/auth/sign-up/')({
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [{ title: '注册 · Lumine' }, { name: 'robots', content: 'noindex, nofollow' }]
  }),
  component: SignUpRoute
});

function SignUpRoute() {
  const { redirect } = Route.useSearch();
  return <RegisterView redirectTo={redirect} />;
}
