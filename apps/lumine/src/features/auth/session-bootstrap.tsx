import { useEffect } from 'react';

import { useSessionStore } from './session';

/**
 * 应用启动时向服务端确认一次登录态。
 *
 * ## 为什么必须在客户端做
 *
 * Lumine 是纯 SPA（`spa.enabled` + 静态宿主），没有服务端可以替我们判定 cookie 会话。
 * 所以在根组件挂载后打一次 `GET /auth/me`。
 *
 * ## 为什么只做一次
 *
 * 会话失效由 `session.ts` 的统一 401 处理兜住；这里只负责**启动时**的首次判定。
 * 重复挂载（StrictMode 在开发期会双挂）用一个模块级标志挡住，避免开发时打两次。
 *
 * 挂载在根组件而不是某个路由上：登录页也需要知道「已经登录了」才能把人送回原页面。
 */
let bootstrapped = false;

export function SessionBootstrap() {
  useEffect(() => {
    if (bootstrapped) return;
    bootstrapped = true;

    void useSessionStore.getState().bootstrap();
  }, []);

  return null;
}
