import { z } from 'zod';

/**
 * 登录 / 注册路由的 search 参数。
 *
 * `redirect` 由路由守卫写入（未登录时被踢出来的原路径），登录成功后据此回跳。
 * 用 `zaf`（zod adapter）而不是手写 `validateSearch`：类型与校验一起声明，
 * 免得两处各写一份。
 */
export const authSearchSchema = z.object({
  /** 登录后要前往的路径；缺省时去 `/dashboard`。 */
  redirect: z.string().optional()
});

export type AuthSearch = z.infer<typeof authSearchSchema>;
