import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderPage } from '@/features/analysis/components/placeholder-page';
import i18n from '@/lib/i18n';

export const Route = createFileRoute('/analysis/combination')({
  head: () => ({
    meta: [{ title: `${i18n.t('nav:item.combinationAnalysis')} · ${i18n.t('app.name')}` }]
  }),
  component: () => (
    <PlaceholderPage
      descriptionKey='combination.description'
      capabilityKey='combination.capability'
      icon='network'
    />
  )
});
