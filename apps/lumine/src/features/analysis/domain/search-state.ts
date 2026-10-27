import type { ProblemDetails } from '@/lib/problem-details';

/**
 * 搜索面板的状态机（纯函数）。
 *
 * ## `empty` 与 `idle` 是两种状态，不能合并
 *
 * - `idle`：用户还没输入（或输入不足最小长度）。此时**不该发请求**，界面不渲染结果区。
 * - `empty`：请求完成，但零结果。此时要显示「没有匹配」，否则用户会以为界面卡住。
 *
 * 合并成一个「没有结果」会让首次进入页面显示「没有匹配」——对着一个空搜索框说
 * 没有匹配，是错的。
 */

/**
 * 分页信息，直接来自契约的 `pagination`。
 *
 * **不自己算 `totalPages`**：`pageSize` 的缺省由服务端 schema 决定，客户端按自己的
 * 假设去除会得出与服务端不一致的页数（服务端 20 一页、客户端以为 10，页数就翻倍）。
 */
export interface SearchPagination {
  readonly page: number;
  readonly total: number;
  readonly totalPages: number;
}

export type SearchState<TItem> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'results'; items: readonly TItem[]; pagination: SearchPagination }
  | { status: 'empty' }
  | { status: 'error'; problem: ProblemDetails };

/** 触发搜索所需的最小输入长度。1 个字符在 19,842 个药上会命中太多，没有信息量。 */
export const MIN_QUERY_LENGTH = 2;

/**
 * 由「输入 + 查询结果」推导搜索状态。
 *
 * @param input.query 已防抖的关键词。
 * @param input.items 查询到的条目；未完成时为 `undefined`。
 * @param input.pagination 服务端返回的分页信息；未完成时为 `undefined`。
 * @param input.problem 失败详情。
 * @param input.isPending 请求是否在途。
 */
export function resolveSearchState<TItem>(input: {
  query: string;
  items: readonly TItem[] | undefined;
  pagination: SearchPagination | undefined;
  problem: ProblemDetails | null;
  isPending: boolean;
}): SearchState<TItem> {
  const { query, items, pagination, problem, isPending } = input;

  if (query.trim().length < MIN_QUERY_LENGTH) {
    return { status: 'idle' };
  }

  // 与详情页同一条规则：失败不能被渲染成「没有匹配」。
  if (problem !== null) {
    return { status: 'error', problem };
  }

  if (items !== undefined) {
    return items.length === 0
      ? { status: 'empty' }
      : {
          status: 'results',
          items,
          pagination: pagination ?? { page: 1, total: items.length, totalPages: 1 }
        };
  }

  if (isPending) {
    return { status: 'loading' };
  }

  return { status: 'idle' };
}
