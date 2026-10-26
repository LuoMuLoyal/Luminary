import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

import { navGroups } from '@/config/nav-config';
import type { NavItem } from '@/types';

type BreadcrumbItem = {
  /** i18n key when the segment matches a nav entry, otherwise the raw segment. */
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
 */
function buildTitleKeyMap(): Map<string, string> {
  const map = new Map<string, string>();

  const walk = (items: NavItem[]) => {
    for (const item of items) {
      if (item.url && item.url !== '#') map.set(item.url, item.titleKey);
      if (item.items?.length) walk(item.items);
    }
  };

  for (const group of navGroups) walk(group.items);

  return map;
}

export function useBreadcrumbs() {
  const { pathname } = useLocation();

  return useMemo(() => {
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
  }, [pathname]);
}
