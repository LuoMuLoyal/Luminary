import { queryOptions } from '@tanstack/react-query';

import { getCaptchaConfig } from './service';

/**
 * 认证相关查询。
 *
 * 目前只有一条：人机验证配置（`GET /auth/captcha`）。
 *
 * ## 为什么要缓存却又要「先问一次」
 *
 * `enabled` / `siteKey` 是**部署配置**，在一次会话里不会变，所以 `staleTime`
 * 设为 30 分钟、不重试——没必要每次渲染都打一次。但**不能读成常量**：
 * 同一个前端既可能连开发后端（Turnstile 关闭）也可能连生产（开启），
 * 配置必须来自服务端。
 *
 * 用 TanStack Query 而不是手写 `useEffect` 的原因：
 * 登录页与注册页会同时请求它，Query 会**去重并发请求**并共享缓存，
 * 而手写实现要么重复请求、要么自己再写一层缓存。
 */
export const authKeys = {
  all: ['auth'] as const,
  captcha: () => [...authKeys.all, 'captcha'] as const
};

export const captchaQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.captcha(),
    queryFn: getCaptchaConfig,
    // 部署配置在一次会话内不变；失败重试只会拖慢登录页的首次渲染。
    staleTime: 30 * 60 * 1000,
    retry: 1
  });
