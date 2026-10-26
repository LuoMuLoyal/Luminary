import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { Icons } from '@/components/icons';
import { Fragment } from 'react';
import { useNavT } from '@/lib/i18n/use-nav-t';

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  // 面包屑的标题来自 nav-config，属于 `nav` 命名空间。用默认的 `t()` 取不到
  // （键格式是 `nav:path`），会把键原样渲染出来，所以走 navT。
  const navT = useNavT();
  if (items.length === 0) return null;

  const label = (item: (typeof items)[number]) => (item.isKey ? navT(item.title) : item.title);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.link}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href={item.link}>{label(item)}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className='hidden md:block'>
                <Icons.slash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && <BreadcrumbPage>{label(item)}</BreadcrumbPage>}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
