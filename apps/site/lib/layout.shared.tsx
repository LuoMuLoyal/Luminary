import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

import { site } from '@/lib/site'

/** Fumadocs 各布局（docs / home）共用的基础选项。 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: site.product,
    },
    githubUrl: site.github,
  }
}
