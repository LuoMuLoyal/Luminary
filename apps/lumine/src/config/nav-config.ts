import { NavGroup } from '@/types';

/**
 * Navigation configuration
 *
 * This configuration is used for both the sidebar navigation and Cmd+K bar.
 * Items are organized into groups, each rendered with a SidebarGroupLabel.
 *
 * `labelKey` / `titleKey` hold **i18n keys**, never display text. The sidebar and
 * the command palette resolve them with `t()` at render time, so switching
 * language re-labels the whole navigation without rebuilding this list.
 */
export const navGroups: NavGroup[] = [
  {
    labelKey: 'nav.group.analysis',
    items: [
      {
        titleKey: 'nav.item.drugAnalysis',
        url: '/analysis/drug',
        icon: 'pill',
        isActive: false,
        items: []
      },
      {
        titleKey: 'nav.item.combinationAnalysis',
        url: '/analysis/combination',
        icon: 'network',
        isActive: false,
        items: []
      },
      {
        titleKey: 'nav.item.structureAnalysis',
        url: '/analysis/structure',
        icon: 'molecule',
        isActive: false,
        items: []
      }
    ]
  },
  {
    labelKey: 'nav.group.overview',
    items: [
      {
        titleKey: 'nav.item.dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        titleKey: 'nav.item.product',
        url: '/dashboard/product',
        icon: 'product',
        shortcut: ['p', 'p'],
        isActive: false,
        items: []
      },
      {
        titleKey: 'nav.item.users',
        url: '/dashboard/users',
        icon: 'teams',
        shortcut: ['u', 'u'],
        isActive: false,
        items: []
      },
      {
        titleKey: 'nav.item.kanban',
        url: '/dashboard/kanban',
        icon: 'kanban',
        shortcut: ['k', 'k'],
        isActive: false,
        items: []
      },
      {
        titleKey: 'nav.item.chat',
        url: '/dashboard/chat',
        icon: 'chat',
        shortcut: ['c', 'c'],
        isActive: false,
        items: []
      }
    ]
  },
  {
    labelKey: 'nav.group.elements',
    items: [
      {
        titleKey: 'nav.item.forms',
        url: '#',
        icon: 'forms',
        isActive: true,
        items: [
          {
            titleKey: 'nav.item.basicForm',
            url: '/dashboard/forms/basic',
            icon: 'forms',
            shortcut: ['f', 'f']
          },
          {
            titleKey: 'nav.item.multiStepForm',
            url: '/dashboard/forms/multi-step',
            icon: 'forms'
          },
          {
            titleKey: 'nav.item.sheetForm',
            url: '/dashboard/forms/sheet-form',
            icon: 'forms'
          },
          {
            titleKey: 'nav.item.advancedPatterns',
            url: '/dashboard/forms/advanced',
            icon: 'forms'
          }
        ]
      },
      {
        titleKey: 'nav.item.reactQuery',
        url: '/dashboard/react-query',
        icon: 'code',
        isActive: false,
        items: []
      },
      {
        titleKey: 'nav.item.icons',
        url: '/dashboard/elements/icons',
        icon: 'palette',
        isActive: false,
        items: []
      }
    ]
  },
  {
    labelKey: '',
    items: [
      {
        titleKey: 'nav.item.account',
        url: '#',
        icon: 'account',
        isActive: true,
        items: [
          {
            titleKey: 'nav.item.notifications',
            url: '/dashboard/notifications',
            icon: 'notification',
            shortcut: ['n', 'n']
          }
        ]
      }
    ]
  }
];
