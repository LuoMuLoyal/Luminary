/**
 * 单飞（single-flight）：同一时刻只允许一个调用在飞，其余调用共享同一个 Promise。
 *
 * ## 为什么需要它
 *
 * 会话轮换是**一次性**的：`POST /auth/browser/refresh` 会让旧的 refresh token
 * 立即作废。如果两个请求同时拿到 401、各自触发一次刷新，第二个必然失败——
 * 用户会被莫名其妙地登出。
 *
 * 单飞把「并发刷新」压成一次网络请求，所有调用方等同一个结果。
 *
 * ## 为什么不用现成库
 *
 * 没有可用的：npm 上的 `singleflight` 停在 `0.0.1`（2022 年），语义还不一定是这个；
 * `p-memoize` / `promise-memoize` 是**缓存**语义（按参数记忆一段时间），
 * 与「只合并同时发生的调用、结束后立刻放开」不是一回事，套用会让刷新拿到陈旧 token。
 * 这个原语本身是十几行纯逻辑，手写比引一个语义不符的依赖更安全。
 *
 * ## 边界
 *
 * - **只合并同时在飞的调用**：`run()` 一落定就清空，下一次调用重新执行。
 * - **不缓存结果**：失败也不会被记住，调用方重试能真的重试。
 * - 返回的 Promise 是同一个引用，因此所有调用方观察到的成功/失败完全一致。
 */

/**
 * @param run 真正执行工作的函数。
 * @returns 一个包装后的函数：并发调用共享一次 `run`。
 */
export function singleFlight<T>(run: () => Promise<T>): () => Promise<T> {
  let inFlight: Promise<T> | null = null;

  return () => {
    if (inFlight !== null) return inFlight;

    // 用 `finally` 而不是 `then/catch` 两处清理：既保证成功与失败都清空，
    // 也不会吞掉拒绝——`finally` 返回的 Promise 保持原状态。
    const current = run().finally(() => {
      // 只在仍是这一次调用时清空：避免「前一次 finally 晚于后一次开始」
      // 时把后一次的 in-flight 误清掉。
      if (inFlight === current) inFlight = null;
    });

    inFlight = current;
    return current;
  };
}
