import { ApiError, type ProblemDetails } from '@/lib/problem-details';

/**
 * 把任意抛出的错误归一成 {@link ProblemDetails}（application 层）。
 *
 * ## 为什么要归一
 *
 * 查询层可能抛出两类东西，界面需要不同的呈现：
 *
 * 1. **`ApiError`**：服务端明确拒绝（RFC 9457），带稳定 `code` 与已本地化的 `detail`。
 * 2. **其它**（网络中断、DNS 失败、`NetworkError`）：请求根本没到服务端。
 *    这类没有 `code`，status 记 0。
 *
 * 把两者都摊平成「加载失败」会让用户无法区分「服务器说没有这个药」和「你断网了」——
 * 而这两种情况的下一步动作完全不同（改查询 vs 检查网络）。
 *
 * 返回 `null` 表示没有错误，供状态机直接消费。
 */
export function toProblemDetails(error: unknown): ProblemDetails | null {
  if (error === null || error === undefined) {
    return null;
  }

  if (error instanceof ApiError) {
    return error.problem;
  }

  // 非 ApiError：网络层失败。status 0 是「没有 HTTP 响应」的约定写法，
  // title 保留原始 message 以便排查，但界面文案走 i18n 的通用网络错误。
  return {
    status: 0,
    code: 'NETWORK_ERROR',
    title: 'Network Error',
    detail: error instanceof Error ? error.message : null,
    type: null,
    instance: null
  };
}
