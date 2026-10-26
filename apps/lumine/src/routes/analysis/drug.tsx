import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderPage } from '@/features/analysis/components/placeholder-page';
import i18n from '@/lib/i18n';

export const Route = createFileRoute('/analysis/drug')({
  head: () => ({
    meta: [{ title: `${i18n.t('nav:item.drugAnalysis')} · ${i18n.t('app.name')}` }]
  }),
  component: () => (
    <PlaceholderPage
      titleKey='item.drugAnalysis'
      descriptionKey='drug.description'
      capabilityKey='drug.capability'
      icon='pill'
    />
  )
});
