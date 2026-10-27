import React from 'react';
import { cn } from '@/lib/utils';
import { Heading } from '../ui/heading';
import type { InfobarContent } from '@/components/ui/infobar';

function PageSkeleton() {
  return (
    <div className='flex flex-1 animate-pulse flex-col gap-4 p-4 md:px-6'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='bg-muted mb-2 h-8 w-48 rounded' />
          <div className='bg-muted h-4 w-96 rounded' />
        </div>
      </div>
      <div className='bg-muted mt-6 h-40 w-full rounded-lg' />
      <div className='bg-muted h-40 w-full rounded-lg' />
    </div>
  );
}

/**
 * 受保护区域的标准页面容器。
 *
 * ## 为什么不再渲染大标题
 *
 * 顶部面包屑的末项（`BreadcrumbPage`）已经显示了「你在这个页面上」，侧边栏同时
 * 高亮着对应的导航项。页面里再顶一个同名的 `<h1>` 是把同一句话说第三遍。
 *
 * [Atlassian 的 Page header 规范](https://docs.atlassian.com/aui/7.7.2-SNAPSHOT/dist/docs/page-header.html)
 * 把面包屑与标题归为**同一个 header**：*"The page header gives context to the
 * content within the page. It is made up of a combination of the page title,
 * avatar, metadata and related actions"*，且面包屑紧贴标题之上。也就是说两者是
 * 一个语义单元的两部分，而不是两处各写一次同样的文字。
 *
 * 所以这里把标题降级为**可选**：`pageDescription` 仍作为一句上下文展示，
 * 标题只在使用方确实需要区分（例如同一路由下的不同子视图）时才传。
 *
 * ## 为什么 `isLoading` 仍然是整页骨架
 *
 * 首屏还没有数据时，页面结构本身还不确定；此时给一个匹配最终布局的骨架，
 * 比先渲染出标题和空区块再跳变要稳。
 */
export default function PageContainer({
  children,
  isLoading = false,
  access = true,
  accessFallback,
  pageDescription,
  infoContent,
  pageHeaderAction,
  className
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  access?: boolean;
  accessFallback?: React.ReactNode;
  /**
   * 页面标题。
   *
   * **默认不要传**：面包屑已经是「你在哪里」的唯一指示器，重复渲染标题会让同一个
   * 名字在界面上出现三次（侧边栏 + 面包屑 + 大标题）。只有同一路由下需要区分子
   * 视图时才用。
   */
  pageTitle?: string;
  pageDescription?: string;
  infoContent?: InfobarContent;
  pageHeaderAction?: React.ReactNode;
  className?: string;
}) {
  if (!access) {
    return (
      <div className='flex flex-1 items-center justify-center p-4 md:px-6'>
        {accessFallback ?? (
          <div className='text-muted-foreground text-center text-lg'>
            You do not have access to this page.
          </div>
        )}
      </div>
    );
  }

  const content = isLoading ? <PageSkeleton /> : children;

  // 头部只在有实际内容时才占位——描述或操作都没有时不留空行。
  const hasHeader = Boolean(pageDescription || pageHeaderAction || infoContent);

  return (
    <div className={cn('flex flex-1 flex-col p-4 md:px-6', className)}>
      {hasHeader && (
        <div className='mb-4 flex items-start justify-between gap-4'>
          <Heading description={pageDescription ?? ''} infoContent={infoContent} />
          {pageHeaderAction && <div className='shrink-0'>{pageHeaderAction}</div>}
        </div>
      )}
      {content}
    </div>
  );
}
