import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ANALYSIS_NAMESPACE } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { medicineDetailOptions, medicineSearchOptions } from '../application/queries';
import {
  projectCounts,
  projectCrossReferences,
  projectDrugbankIdentity,
  projectIdentity,
  projectPharmacokinetics,
  projectTargets,
  projectTextSections
} from '../application/project-detail';
import { toProblemDetails } from '../application/to-problem-details';
import { resolveDetailState } from '../domain/detail-state';
import { MIN_QUERY_LENGTH, resolveSearchState } from '../domain/search-state';
import type { MedicineSelection } from '../domain/selection';
import type { MedicineSearchItem, MedicineSource } from '../infrastructure/types';
import { DrugDetailSkeleton, DrugDetailView } from './drug-detail-view';
import { DrugSearchPanel, useSearchQuery } from './drug-search-panel';
import { RequestFailure } from './request-failure';

/**
 * 单药分析页 —— **两栏布局**（列表 + 详情）。
 *
 * ## 为什么是两栏而不是上下堆叠
 *
 * 初版把搜索结果与详情**上下摞起来**，于是候选列表还开着、详情渲染在它下面，
 * 未选中的提示又挤在候选下方，三者互相矛盾，窄屏还要滚过一整屏候选才看到详情。
 *
 * Apple HIG 把这种「列表 + 详情」明确归为 **Split View（两栏）**：
 * *"Flat list with detail → Split View (two column): iPhone push/pop stack;
 * iPad/Mac primary + detail columns"*，并要求 *"persistently highlight the
 * current selection in each pane that leads to the detail view"*。
 *
 * 即：**宽屏两栏并排、列表常驻并高亮当前项**；**窄屏退化成单栏推入/弹出**。
 * 上下堆叠不在 HIG 的模式里——它既不是两栏也不是推入。
 *
 * ## 布局怎么切换
 *
 * 用 CSS 断点（`lg:`）而不是 `useIsMobile()`：布局是纯样式问题，交给 CSS
 * 就不会有「服务端渲染时宽度未知」的水合不一致。窄屏显示哪一栏由 `hasSelection`
 * 决定，对应 HIG 的 push/pop：没选中留在列表（还在找药），选中则进详情。
 *
 * ## 选择存在 URL 里，这里只读
 *
 * `selection` 由路由从 search params 解析后传入，组件**不持有**选中态。
 * 刷新、分享链接、前进后退因此都自然成立。
 */
export function DrugAnalysisPage({
  selection,
  source,
  page,
  onSelect,
  onSourceChange,
  onPageChange
}: {
  selection: MedicineSelection | null;
  source: MedicineSource;
  page: number;
  onSelect: (item: MedicineSearchItem) => void;
  onSourceChange: (value: MedicineSource) => void;
  onPageChange: (page: number) => void;
}) {
  const { query, setQuery, debounced } = useSearchQuery();

  const searchEnabled = debounced.trim().length >= MIN_QUERY_LENGTH;

  const searchQuery = useQuery(medicineSearchOptions(debounced, source, page, searchEnabled));

  const detailQuery = useQuery(
    medicineDetailOptions(selection?.id ?? '', selection?.source ?? source, selection !== null)
  );

  const searchState = useMemo(
    () =>
      resolveSearchState({
        query: debounced,
        items: searchQuery.data?.items,
        pagination: searchQuery.data?.pagination,
        problem: toProblemDetails(searchQuery.error),
        isPending: searchQuery.isPending
      }),
    [debounced, searchQuery.data, searchQuery.error, searchQuery.isPending]
  );

  const detailState = useMemo(
    () =>
      resolveDetailState({
        selection,
        detail: detailQuery.data,
        problem: toProblemDetails(detailQuery.error),
        isPending: detailQuery.isPending
      }),
    [selection, detailQuery.data, detailQuery.error, detailQuery.isPending]
  );

  const retryDetail = useCallback(() => {
    void detailQuery.refetch();
  }, [detailQuery]);

  /**
   * 改关键词时回到第 1 页。
   *
   * 否则在第 3 页改关键词，新词只有 1 页，会停在一个不存在的页上——界面显示
   * 「没有匹配」，而其实是有结果的。这是分页最常见的错误。
   */
  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (page !== 1) onPageChange(1);
    },
    [setQuery, page, onPageChange]
  );

  const hasSelection = selection !== null;

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-8'>
      {/* 左栏：搜索与候选。宽屏常驻；窄屏选中后让位给详情（HIG 的 push/pop）。 */}
      <div className={cn('min-w-0', hasSelection && 'hidden lg:block')}>
        <DrugSearchPanel
          query={query}
          onQueryChange={handleQueryChange}
          source={source}
          onSourceChange={onSourceChange}
          state={searchState}
          onSelect={onSelect}
          selectedId={selection?.id ?? null}
          onPageChange={onPageChange}
        />
      </div>

      {/* 右栏：详情。四个状态各自渲染，互不共用样式。 */}
      <div className={cn('min-w-0', !hasSelection && 'hidden lg:block')}>
        {detailState.status === 'empty' && <NotSelected />}
        {detailState.status === 'loading' && <DrugDetailSkeleton />}
        {detailState.status === 'error' && (
          <RequestFailure problem={detailState.problem} onRetry={retryDetail} />
        )}
        {detailState.status === 'ready' && <Detail detail={detailState.detail} />}
      </div>
    </div>
  );
}

/**
 * 未选中时的提示（右栏）。
 *
 * ## 为什么这里不叫「空状态」
 *
 * 按 HIG，搜索的空状态属于**列表那一栏**（`search.empty`，由搜索面板渲染）。
 * 这一块是「详情栏还没内容」，与「搜不到」是两件事，所以用不同的文案键。
 *
 * ## 为什么没有图标、边框与底衬
 *
 * 侧边栏已经用了 `pill` 图标，同一个语境再放一次是把同一句话说两遍。
 * 带框的空壳则会让人以为内容没加载出来。纯文本更准确。
 *
 * 按 HIG：**标题 + 一句话**，只讲下一步动作，不讲 URL、缓存这些实现细节。
 */
function NotSelected() {
  const { t } = useTranslation();

  return (
    <div className='flex h-full flex-col items-center justify-center gap-1 py-16 text-center'>
      <p className='text-base font-medium'>{t(`${ANALYSIS_NAMESPACE}:empty.title`)}</p>
      <p className='text-muted-foreground text-sm'>{t(`${ANALYSIS_NAMESPACE}:empty.body`)}</p>
    </div>
  );
}

/** 把载荷投影成可渲染内容；空值在投影阶段已被剔除。 */
function Detail({ detail }: { detail: Parameters<typeof projectIdentity>[0] }) {
  const identity = useMemo(
    () => [...projectIdentity(detail), ...projectDrugbankIdentity(detail)],
    [detail]
  );
  const textSections = useMemo(() => projectTextSections(detail), [detail]);
  const targets = useMemo(() => projectTargets(detail), [detail]);
  const pharmacokinetics = useMemo(() => projectPharmacokinetics(detail), [detail]);
  const crossRefs = useMemo(() => projectCrossReferences(detail), [detail]);
  const counts = useMemo(() => projectCounts(detail), [detail]);

  return (
    <DrugDetailView
      name={detail.name}
      id={detail.id}
      subtitle={detail.subtitle}
      identity={identity}
      counts={counts}
      textSections={textSections}
      targets={targets}
      pharmacokinetics={pharmacokinetics}
      crossRefs={crossRefs}
    />
  );
}
