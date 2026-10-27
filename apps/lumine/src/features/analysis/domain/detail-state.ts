import type { ProblemDetails } from '@/lib/problem-details';

/**
 * 分析页的状态机（纯函数，不依赖 React / 路由 / 网络）。
 *
 * ## 为什么状态机是泛型的
 *
 * 领域层不该 import 生成契约（`@/generated/lucent-api`）——那是外层的东西，
 * 领域依赖它就把契约变更变成了领域变更。这里对「详情载荷」保持泛型，
 * 具体类型由调用方（application 层）填入。
 *
 * ## 为什么 ready / loading / error 都携带 selection
 *
 * 这是本模块存在的核心理由。界面上有两条容易混淆的「什么都没有」：
 *
 * - **字段缺失**：请求成功，但这个药确实没有毒性数据。此时应当**不渲染该区块**。
 * - **请求失败**：网络断了 / 后端 500。此时**必须显式报错**，绝不能渲染成空页面。
 *
 * 把后者静默成前者，用户会以为「这个药没有不良反应数据」，而事实是「我们没查到」。
 * 这在药品数据上是误导，不是体验问题。
 *
 * 让每个非空状态都带上它所属的 `selection`，使「把 A 的响应渲染到 B 的界面上」
 * 在类型层面就不可能——状态自身知道它属于谁。
 */
export type AsyncDetailState<TSelection, TDetail> =
  | { status: 'empty' }
  | { status: 'loading'; selection: TSelection }
  | { status: 'ready'; selection: TSelection; detail: TDetail }
  | { status: 'error'; selection: TSelection; problem: ProblemDetails };

/**
 * 由「当前选择 + 查询结果」推导详情状态。
 *
 * ## 为什么是推导而不是 reducer
 *
 * 请求的进行/成功/失败由 React Query 持有（它有重试、缓存、失效）。再写一个
 * reducer 去维护 `isLoading`，就有两个事实源，二者漂移时表现是「转圈不消失」。
 * 所以这里只做单向推导：查询状态是输入，界面状态是输出。
 *
 * ## 判定顺序不能调换
 *
 * 先判 `selection === null`（没有选中就没有请求，`error` 也无意义），
 * 再判错误，最后才判数据。反过来写会让「有旧缓存 + 新请求失败」显示旧数据。
 *
 * @param input.selection 当前选中的药品；`null` 表示未选中。
 * @param input.detail 查询到的详情；未完成时为 `undefined`。
 * @param input.problem 查询失败时的 RFC 9457 问题详情。
 * @param input.isPending 请求是否在途（含首次加载与切换选择后的重新加载）。
 */
export function resolveDetailState<TSelection, TDetail>(input: {
  selection: TSelection | null;
  detail: TDetail | undefined;
  problem: ProblemDetails | null;
  isPending: boolean;
}): AsyncDetailState<TSelection, TDetail> {
  const { selection, detail, problem, isPending } = input;

  if (selection === null) {
    return { status: 'empty' };
  }

  // 失败优先于数据：查询失败时 React Query 仍可能留着上一次的成功缓存，
  // 直接展示它等于把「查不到」伪装成「查到了」。
  if (problem !== null) {
    return { status: 'error', selection, problem };
  }

  if (detail !== undefined) {
    return { status: 'ready', selection, detail };
  }

  if (isPending) {
    return { status: 'loading', selection };
  }

  // 既没有数据、也没有错误、也不在途：React Query 在查询被禁用时会是这个形态。
  // 不编造一个 ready，也不假装还在加载。
  return { status: 'empty' };
}
