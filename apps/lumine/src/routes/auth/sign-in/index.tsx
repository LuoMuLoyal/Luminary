import { createFileRoute } from '@tanstack/react-router';

import LoginView from '@/features/auth/components/login-view';
import { authSearchSchema } from '@/features/auth/search';

export const Route = createFileRoute('/auth/sign-in/')({
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [{ title: '登录 · Lumine' }, { name: 'robots', content: 'noindex, nofollow' }]
  }),
  component: SignInRoute
});

function SignInRoute() {
  const { redirect } = Route.useSearch();
  return <LoginView redirectTo={redirect} />;
}
