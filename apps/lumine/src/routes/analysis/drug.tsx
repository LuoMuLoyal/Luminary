import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-adapter';

import PageContainer from '@/components/layout/page-container';
import { DrugAnalysisPage } from '@/features/analysis/components/drug-analysis-page';
import { carrySelectionAcrossSourceChange } from '@/features/analysis/domain/selection';
import type { MedicineSearchItem, MedicineSource } from '@/features/analysis/infrastructure/types';
import i18n from '@/lib/i18n';

/**
 * `/analysis/drug` 的 URL 状态。
 *
 * ## 为什么选中态在 search param 而不是组件 state
 *
 * 「选中的药品」是**可分享、可刷新、可后退**的状态，而组件 state 三者都不成立。
 * 放在 search param 里，TanStack Router 负责解析与校验，链接天然可分享。
 *
 * 放在路径段（`/analysis/drug/DB00176`）也能分享，但会让「未选中」与「已选中」
 * 变成两个路由文件，而它们共用同一个页面外壳。
 *
 * ## 为什么不校验 id 格式
 *
 * 两个源的 id 形态完全不同（DrugBank 是 `DB00176`，中文产品是另一套编号），
 * 在这里写正则等于把后端 id 规则抄一份。非法 id 由后端返回 404，界面显示
 * 「无法加载该药品」——这比在前端猜格式更诚实。
 */
const drugSearchSchema = z.object({
  /** 选中的药品 id。 */
  id: z.string().optional(),
  /** 知识源；缺省由后端决定（DrugBank）。 */
  source: z.enum(['drugbank', 'cn']).optional(),
  /**
   * 搜索结果页码，1 起。
   *
   * 与 `id` 同理放 URL 里：翻页后可后退、可分享。`default(1)` 让缺省时也有值，
   * 调用处不必再判 `undefined`。
   */
  page: z.number().int().min(1).optional().default(1)
});

export const Route = createFileRoute('/analysis/drug')({
  head: () => ({
    meta: [{ title: `${i18n.t('nav:item.drugAnalysis')} · ${i18n.t('app.name')}` }]
  }),
  validateSearch: zodValidator(drugSearchSchema),
  component: DrugAnalysisRoute
});

function DrugAnalysisRoute() {
  const navigate = useNavigate();
  const { id, source, page } = Route.useSearch();

  // 契约里 `source` 是 `string`（服务端白名单），这里收窄；缺省与后端一致为 drugbank。
  const activeSource: MedicineSource = source ?? 'drugbank';

  const selection = id !== undefined ? { id, source: activeSource } : null;

  return (
    <PageContainer pageDescription={i18n.t('analysis:drug.description')}>
      <DrugAnalysisPage
        selection={selection}
        source={activeSource}
        page={page}
        onSelect={(item: MedicineSearchItem) => {
          void navigate({
            to: '/analysis/drug',
            search: (prev) => ({ ...prev, id: item.id, source: item.source })
          });
        }}
        onSourceChange={(next: MedicineSource) => {
          // id 不可跨源移植（ADR-0008 不做 CN↔DrugBank 映射），换源即清空选择。
          const carried = carrySelectionAcrossSourceChange(selection, next);
          void navigate({
            to: '/analysis/drug',
            search: (prev) => ({ ...prev, source: next, id: carried?.id, page: 1 })
          });
        }}
        onPageChange={(next: number) => {
          void navigate({
            to: '/analysis/drug',
            search: (prev) => ({ ...prev, page: next })
          });
        }}
      />
    </PageContainer>
  );
}
