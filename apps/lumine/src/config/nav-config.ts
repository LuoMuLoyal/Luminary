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
    labelKey: 'group.analysis',
    items: [
      {
        titleKey: 'item.drugAnalysis',
        url: '/analysis/drug',
        icon: 'pill',
        isActive: false,
        items: []
      },
      {
        titleKey: 'item.combinationAnalysis',
        url: '/analysis/combination',
        icon: 'network',
        isActive: false,
        items: []
      },
      {
        titleKey: 'item.structureAnalysis',
        url: '/analysis/structure',
        icon: 'molecule',
        isActive: false,
        items: []
      }
    ]
  },
  {
    labelKey: 'group.overview',
    items: [
      {
        titleKey: 'item.dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: []
      },
      {
        titleKey: 'item.product',
        url: '/dashboard/product',
        icon: 'product',
        shortcut: ['p', 'p'],
        isActive: false,
        items: []
      },
      {
        titleKey: 'item.users',
        url: '/dashboard/users',
        icon: 'teams',
        shortcut: ['u', 'u'],
        isActive: false,
        items: []
      },
      {
        titleKey: 'item.kanban',
        url: '/dashboard/kanban',
        icon: 'kanban',
        shortcut: ['k', 'k'],
        isActive: false,
        items: []
      },
      {
        titleKey: 'item.chat',
        url: '/dashboard/chat',
        icon: 'chat',
        shortcut: ['c', 'c'],
        isActive: false,
        items: []
      }
    ]
  },
  {
    labelKey: 'group.elements',
    items: [
      {
        titleKey: 'item.forms',
        url: '#',
        icon: 'forms',
        isActive: true,
        items: [
          {
            titleKey: 'item.basicForm',
            url: '/dashboard/forms/basic',
            icon: 'forms',
            shortcut: ['f', 'f']
          },
          {
            titleKey: 'item.multiStepForm',
            url: '/dashboard/forms/multi-step',
            icon: 'forms'
          },
          {
            titleKey: 'item.sheetForm',
            url: '/dashboard/forms/sheet-form',
            icon: 'forms'
          },
          {
            titleKey: 'item.advancedPatterns',
            url: '/dashboard/forms/advanced',
            icon: 'forms'
          }
        ]
      },
      {
        titleKey: 'item.reactQuery',
        url: '/dashboard/react-query',
        icon: 'code',
        isActive: false,
        items: []
      },
      {
        titleKey: 'item.icons',
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
        titleKey: 'item.account',
        url: '#',
        icon: 'account',
        isActive: true,
        items: [
          {
            titleKey: 'item.notifications',
            url: '/dashboard/notifications',
            icon: 'notification',
            shortcut: ['n', 'n']
          }
        ]
      }
    ]
  }
];
