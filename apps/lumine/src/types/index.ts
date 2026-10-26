import { Icons } from '@/components/icons';

export interface PermissionCheck {
  permission?: string;
  plan?: string;
  feature?: string;
  role?: string;
  requireOrg?: boolean;
}

export interface NavItem {
  /**
   * i18n key，**不是显示文案**。渲染处用 `t(item.titleKey)` 取当前语言的标题。
   *
   * 命名成 `titleKey` 而不是 `title` 是刻意的：这个字段以前叫 `title`，
   * 于是很容易顺手填一句英文进去（模板遗留的三组导航就是这样）。
   * 改名后类型会逼着调用点去翻译，写死文案的写法不再自然。
   */
  titleKey: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  access?: PermissionCheck;
}

export interface NavGroup {
  /** i18n key，理由同 {@link NavItem.titleKey}。 */
  labelKey: string;
  /**
   * 分组自身的路径（如 `/analysis`），用于面包屑解析分区根。
   *
   * 分组不是导航项、没有自己的入口，但它是路径的一级；不登记的话面包屑会
   * 掉进「未登记路径」的兜底分支，显示英文的路径段。
   */
  url?: string;
  items: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
