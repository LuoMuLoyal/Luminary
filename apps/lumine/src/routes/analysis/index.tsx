import { createFileRoute, redirect } from '@tanstack/react-router';

/** `/analysis` 本身没有内容，落到第一个可用的分析页。 */
export const Route = createFileRoute('/analysis/')({
  beforeLoad: () => {
    throw redirect({ to: '/analysis/drug' });
  }
});
