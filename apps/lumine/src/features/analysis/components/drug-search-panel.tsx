import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { ANALYSIS_NAMESPACE } from '@/lib/i18n';
import type { ProblemDetails } from '@/lib/problem-details';
import { cn } from '@/lib/utils';
import type { SearchPagination, SearchState } from '../domain/search-state';
import type { MedicineSearchItem, MedicineSource } from '../infrastructure/types';

/**
 * 搜索面板：输入框 + 结果列表 + 知识源切换。
 *
 * ## 为什么选中态不放组件内 state
 *
 * 选中的药品存在 **URL**（`?id=&source=`），这里是纯受控组件：输入框的文字是唯一
 * 的本地状态，其余全部由 props 驱动。这样「刷新后仍选中」「链接可分享」自然成立，
 * 不需要额外的持久化。
 *
 * ## 为什么输入要防抖
 *
 * 19,842 个药的模糊匹配，每敲一个字符发一次请求会打出一串无用请求；而用户输入
 * 名称时中间态（如 "aspi"）本来也不是他要的结果。防抖后只在停顿处发一次。
 */
export function DrugSearchPanel({
  query,
  onQueryChange,
  source,
  onSourceChange,
  state,
  onSelect,
  selectedId,
  onPageChange
}: {
  query: string;
  onQueryChange: (value: string) => void;
  source: MedicineSource;
  onSourceChange: (value: MedicineSource) => void;
  state: SearchState<MedicineSearchItem>;
  onSelect: (item: MedicineSearchItem) => void;
  selectedId: string | null;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-3'>
      {/*
        输入框与源切换**始终竖排**。
        曾用 `sm:flex-row`（视口断点）横排，但左栏固定 22rem——视口 ≥640px 时
        它就横排，把输入框挤到只剩几十像素而截断。容器内的布局不能按视口判断，
        要按容器自己的宽度；这里容器本来就窄，竖排才是对的。
      */}
      <div className='flex flex-col gap-2'>
        <div className='relative'>
          <Icons.search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t(`${ANALYSIS_NAMESPACE}:search.placeholder`)}
            aria-label={t(`${ANALYSIS_NAMESPACE}:search.label`)}
            className='pl-9'
            autoComplete='off'
            autoFocus
          />
        </div>
        <SourceSwitch source={source} onSourceChange={onSourceChange} />
      </div>

      <SearchResults
        state={state}
        onSelect={onSelect}
        selectedId={selectedId}
        onPageChange={onPageChange}
      />
    </div>
  );
}

/**
 * 知识源切换。
 *
 * 换源会清空当前选择（`id` 不可跨源移植，见 `domain/selection.ts`），
 * 因为本项目不做 CN↔DrugBank 映射（ADR-0008）。
 */
function SourceSwitch({
  source,
  onSourceChange
}: {
  source: MedicineSource;
  onSourceChange: (value: MedicineSource) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      role='group'
      aria-label={t(`${ANALYSIS_NAMESPACE}:source.label`)}
      className='border-border grid grid-cols-2 gap-0.5 rounded-md border p-0.5'
    >
      {(['drugbank', 'cn'] as const).map((value) => (
        <Button
          key={value}
          type='button'
          size='sm'
          variant={value === source ? 'secondary' : 'ghost'}
          aria-pressed={value === source}
          onClick={() => onSourceChange(value)}
        >
          {t(`${ANALYSIS_NAMESPACE}:source.${value}`)}
        </Button>
      ))}
    </div>
  );
}

/**
 * 结果列表。
 *
 * 五个状态各有各的渲染，**互不共用样式**：
 * `idle`（还没输入）不显示任何提示，`empty`（查完没有）才说没有匹配，
 * `error` 必须报错。把 `empty` 和 `idle` 合并会让首次进入页面就说「没有匹配」。
 */
function SearchResults({
  state,
  onSelect,
  selectedId,
  onPageChange
}: {
  state: SearchState<MedicineSearchItem>;
  onSelect: (item: MedicineSearchItem) => void;
  selectedId: string | null;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation();

  // 未输入时什么都不渲染。曾在这里放过「继续输入以搜索」，但占位符
  // 「名称、CAS 号或 UNII」已经说明了能搜什么（HIG：placeholder 负责说明
  // 可搜索的内容），再提示一遍是把同一句话说两遍。
  if (state.status === 'idle') {
    return null;
  }

  if (state.status === 'loading') {
    return (
      <div className='flex flex-col gap-1.5' aria-busy='true'>
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className='h-11 w-full' />
        ))}
      </div>
    );
  }

  if (state.status === 'error') {
    return <SearchError problem={state.problem} />;
  }

  if (state.status === 'empty') {
    return (
      <div className='flex flex-col gap-0.5'>
        <p className='text-sm'>{t(`${ANALYSIS_NAMESPACE}:search.empty`)}</p>
        <p className='text-muted-foreground text-xs'>
          {t(`${ANALYSIS_NAMESPACE}:search.emptyHint`)}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <ul className='divide-border divide-y'>
        {state.items.map((item) => (
          <li key={`${item.source}:${item.id}`}>
            <button
              type='button'
              onClick={() => onSelect(item)}
              aria-current={item.id === selectedId}
              className={cn(
                'hover:bg-accent focus-visible:ring-ring flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.99]',
                item.id === selectedId && 'bg-accent'
              )}
            >
              <span className='flex w-full items-baseline gap-2'>
                <span className='truncate text-sm font-medium'>{item.name}</span>
                <span className='text-muted-foreground ml-auto shrink-0 font-mono text-xs'>
                  {item.id}
                </span>
              </span>
              {item.subtitle && (
                <span className='text-muted-foreground line-clamp-1 text-xs'>{item.subtitle}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <SearchPagination pagination={state.pagination} onPageChange={onPageChange} />
    </div>
  );
}

/**
 * 分页控件（shadcn 的 `Pagination`）。
 *
 * ## 为什么只在多于一页时渲染
 *
 * 单页结果下「上一页 / 下一页」两个按钮都禁用，占位却没有信息量。
 * 这与「有什么展示什么」一致：只有一页就没什么可分。
 *
 * ## 为什么只显示页码窗口而不是全部页
 *
 * 一个常见药名能命中上百页（19,842 个药），全列出来会把左栏撑爆。
 * 这里显示当前页前后各一页，其余用省略号折叠。
 */
function SearchPagination({
  pagination,
  onPageChange
}: {
  pagination: SearchPagination;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation();
  const { page, total, totalPages } = pagination;

  if (totalPages <= 1) return null;

  // 当前页前后各一页，首尾页始终可达。
  const window: ReadonlySet<number> = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages: number[] = [...window]
    .filter((value) => value >= 1 && value <= totalPages)
    .toSorted((a, b) => a - b);

  return (
    <div className='flex flex-col gap-1.5'>
      <p className='text-muted-foreground text-xs'>
        {t(`${ANALYSIS_NAMESPACE}:search.showingOf`, {
          shown: page * 20 - 19,
          total
        })}
      </p>
      <Pagination className='mx-0 w-auto justify-start'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={page <= 1}
              className={cn(page <= 1 && 'pointer-events-none opacity-50')}
              onClick={() => onPageChange(page - 1)}
            />
          </PaginationItem>

          {pages.map((value, index) => {
            const previous = pages[index - 1];
            const gap = previous !== undefined && value - previous > 1;

            return (
              <React.Fragment key={value}>
                {gap && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href='#'
                    isActive={value === page}
                    aria-label={t(`${ANALYSIS_NAMESPACE}:search.goToPage`, { page: value })}
                    onClick={(event) => {
                      event.preventDefault();
                      onPageChange(value);
                    }}
                  >
                    {value}
                  </PaginationLink>
                </PaginationItem>
              </React.Fragment>
            );
          })}

          <PaginationItem>
            <PaginationNext
              aria-disabled={page >= totalPages}
              className={cn(page >= totalPages && 'pointer-events-none opacity-50')}
              onClick={() => onPageChange(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SearchError({ problem }: { problem: ProblemDetails }) {
  const { t } = useTranslation();

  // 两段之间必须有可见分隔，否则渲染成 "Could not searchFailed to fetch"。
  // 用 flex + gap 而不是在文案里拼标点：文案要走 i18n，拼接会把标点带进翻译。
  return (
    <div className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5' role='alert'>
      <span className='text-destructive text-sm'>{t(`${ANALYSIS_NAMESPACE}:search.error`)}</span>
      <span className='text-muted-foreground text-xs'>{problem.detail ?? problem.title}</span>
    </div>
  );
}

/** 供路由使用的受控查询状态钩子。 */
export function useSearchQuery(initial = '') {
  const [query, setQuery] = useState(initial);
  const debounced = useDebounce(query, 250);

  return { query, setQuery, debounced };
}
