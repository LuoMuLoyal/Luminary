/**
 * 时间常量（毫秒）。
 *
 * ## 为什么需要它
 *
 * React Query 的 `staleTime` / `gcTime` 以**毫秒**为单位，而人思考缓存时长时
 * 用的是「分钟」。于是代码里到处出现 `5 * 60 * 1000` 这类算式：
 *
 * - 乘错的代价是静默的：`5 * 60`（300 毫秒）不报错，只是缓存几乎立即失效，
 *   表现为「切回上一个药品又打了一次网络」，很难联想到是少乘了 1000；
 * - 同一个时长在多个文件里各写一遍，改的时候必漏一处。
 *
 * 命名成 `FIVE_MINUTES` 这样的**用途名**而不是 `MS_PER_MINUTE * 5`：读代码时
 * 关心的是「缓存五分钟」，不是「三千个 100 毫秒」。
 */

/** 一秒的毫秒数。作为其余常量的基数，不直接用于业务。 */
const MS_PER_SECOND = 1000;

/** 一分钟的毫秒数。 */
export const ONE_MINUTE = 60 * MS_PER_SECOND;

/** 五分钟。 */
export const FIVE_MINUTES = 5 * ONE_MINUTE;

/** 十分钟。 */
export const TEN_MINUTES = 10 * ONE_MINUTE;

/** 三十分钟。 */
export const THIRTY_MINUTES = 30 * ONE_MINUTE;
