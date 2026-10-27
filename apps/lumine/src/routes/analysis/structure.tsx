import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderPage } from '@/features/analysis/components/placeholder-page';
import i18n from '@/lib/i18n';

export const Route = createFileRoute('/analysis/structure')({
  head: () => ({
    meta: [{ title: `${i18n.t('nav:item.structureAnalysis')} · ${i18n.t('app.name')}` }]
  }),
  component: () => (
    <PlaceholderPage
      descriptionKey='structure.description'
      capabilityKey='structure.capability'
      icon='molecule'
    />
  )
});
