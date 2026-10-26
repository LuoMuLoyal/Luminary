import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

import { navGroups } from '@/config/nav-config';
import type { NavItem } from '@/types';

export type BreadcrumbItem = {
  /** i18n 路径（不含 `nav:` 前缀）。`isKey` 为 false 时是字面文本。 */
  title: string;
  /** True when {@link title} is an i18n key rather than literal text. */
  isKey: boolean;
  link: string;
};

/**
 * url → i18n key，由 `nav-config` 推导。
 *
 * 面包屑的标题曾经是写死的英文映射表（`/dashboard/product` → 'Product'），
 * 与侧边栏各写一份，改一处必漏一处。这里改成**复用同一份导航配置**：
 * 侧边栏改名，面包屑跟着变。
 *
 * 分组自己的 `url`（如 `/analysis`）也要登记：它是分区根路径，不是任何一个
 * 导航项，漏掉就会掉进下面的字面量兜底——表现为 `/analysis/drug` 的面包屑
 * 前半截是英文 'Analysis'，切到中文也不变。
 */
function buildTitleKeyMap(): Map<string, string> {
  const map = new Map<string, string>();

  const walk = (items: NavItem[]) => {
    for (const item of items) {
      if (item.url && item.url !== '#') map.set(item.url, item.titleKey);
      if (item.items?.length) walk(item.items);
    }
  };

  for (const group of navGroups) {
    if (group.url) map.set(group.url, group.labelKey);
    walk(group.items);
  }

  return map;
}

/**
 * 由路径算出面包屑。抽成纯函数是为了能直接测——挂在 hook 里就要造路由上下文，
 * 而这里的逻辑（哪些段有译名、哪些走兜底）恰恰是最容易出错的部分。
 */
export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const titleKeys = buildTitleKeyMap();
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, index): BreadcrumbItem => {
    const link = `/${segments.slice(0, index + 1).join('/')}`;
    const key = titleKeys.get(link);

    return key
      ? { title: key, isKey: true, link }
      : // 未登记的路径（如详情页 ID）：没有可用的译名，原样显示比编一个更诚实。
        { title: segment.charAt(0).toUpperCase() + segment.slice(1), isKey: false, link };
  });
}

export function useBreadcrumbs() {
  const { pathname } = useLocation();

  return useMemo(() => buildBreadcrumbs(pathname), [pathname]);
}
