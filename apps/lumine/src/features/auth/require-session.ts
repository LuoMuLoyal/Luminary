import { redirect } from '@tanstack/react-router';

import { useSessionStore } from './session';

/**
 * 受保护路由的 `beforeLoad` 守卫。
 *
 * ## 为什么抽出来
 *
 * `/dashboard` 与 `/analysis` 是两个并列的受保护分支，各自都要拦一次未登录。
 * 复制一遍守卫意味着以后改跳转参数或改三态判定时要记得改两处——而漏改的
 * 表现是「其中一个分支能进」，不是编译错误。
 *
 * ## 为什么在 beforeLoad 里等 `unknown` 出结果
 *
 * 首屏时根组件刚发起 `bootstrap()`，状态还是 `unknown`。直接判 `!== 'authenticated'`
 * 会把「还没问过服务端」误判成未登录，并把人无谓地踢去登录页。
 *
 * ## 跳转带 `redirect`
 *
 * 登录成功后回到原路径，否则用户点链接进来、登录完却落在首页。
 */
export async function requireSession(location: { href: string }): Promise<void> {
  if (useSessionStore.getState().status === 'unknown') {
    await useSessionStore.getState().bootstrap();
  }

  if (useSessionStore.getState().status !== 'authenticated') {
    throw redirect({
      to: '/auth/sign-in',
      search: { redirect: location.href },
      replace: true
    });
  }
}
