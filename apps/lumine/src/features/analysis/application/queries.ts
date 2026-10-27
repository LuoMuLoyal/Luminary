import { queryOptions } from '@tanstack/react-query';

import { FIVE_MINUTES, TEN_MINUTES } from '@/lib/time';
import { getMedicineDetail, searchMedicines } from '../infrastructure/service';
import type { MedicineSource } from '../infrastructure/types';

/**
 * 查询键与查询选项（application 层）。
 *
 * ## 键里必须同时带 `id` 和 `source`
 *
 * 只带 `id` 会让「切换知识源」命中同一个缓存条目：界面显示的是 DrugBank 的药，
 * 而用户已经切到中文源。这是静默错误——不报错，只是数据不对。
 *
 * ## 键里带 `id` 就是竞态防护
 *
 * 每个药品一个缓存条目，所以「先选 A 再快速选 B」时，A 的慢响应只会写进 A 的
 * 条目，B 的界面读 B 的条目。**不要在详情查询上用 `placeholderData`**：
 * 那会把上一个药的数据挂到当前选择下，正好制造出「把 A 的数据显示成 B」。
 */
export const medicineKeys = {
  all: ['medicines'] as const,
  search: (q: string, source: MedicineSource, page: number) =>
    [...medicineKeys.all, 'search', source, q, page] as const,
  detail: (id: string, source: MedicineSource) =>
    [...medicineKeys.all, 'detail', source, id] as const
};

/**
 * 搜索结果。
 *
 * `enabled` 由调用处按状态机给（关键词不足 `MIN_QUERY_LENGTH` 时不发请求）。
 * 这里不内建该判断，是为了让「什么时候不该请求」这条规则只有一个出处——
 * 放在 `domain/search-state.ts`，而不是领域和查询层各写一份。
 *
 * **页码进查询键**：否则翻到第 2 页会命中第 1 页的缓存，界面显示的还是旧结果。
 *
 * **`pageSize` 不传**：缺省由服务端 schema 决定（`medicineSearchQuerySchema` 的
 * `.default(20)`）。客户端抄一份就是第二份定义。
 */
export const medicineSearchOptions = (
  q: string,
  source: MedicineSource,
  page: number,
  enabled: boolean
) =>
  queryOptions({
    queryKey: medicineKeys.search(q, source, page),
    queryFn: () => searchMedicines({ q, source, page }),
    enabled,
    // 搜索由显式输入触发，重复输入同一个词不该再打一次网络。
    staleTime: FIVE_MINUTES
  });

/** 药品详情。药品知识是只读的，导入后不变，缓存久一点没有正确性代价。 */
export const medicineDetailOptions = (id: string, source: MedicineSource, enabled: boolean) =>
  queryOptions({
    queryKey: medicineKeys.detail(id, source),
    queryFn: () => getMedicineDetail({ id }, { source }),
    enabled,
    staleTime: TEN_MINUTES
  });
