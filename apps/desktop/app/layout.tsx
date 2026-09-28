import type { Metadata } from "next";

import "./globals.css";

/**
 * 桌面客户端站点元数据。
 *
 * ## ⚠️ 本 app 是**静态导出**，认证不在 Next.js 里做
 *
 * 启用 `output: 'export'` 后，`cookies` / `headers` / `rewrites` / `proxy` 都不可用，
 * 因此**没有"服务端读会话再决定渲染什么"这条路**。
 * 认证由 **Rust（Tauri）层**承担，页面只通过 `invoke` 拿状态。
 *
 * 推论（写页面时最容易踩）：
 *   1. 页面**一律按"未知态"渲染**，登录状态在客户端挂载后异步取，
 *      不能像 SSR 那样假设渲染时已知身份。
 *   2. **不要**用 `redirect()` 做未登录跳转——静态产物里没有服务端逻辑；
 *      跳转由客户端路由或 Rust 层决定。
 *   3. 首屏会有一帧"未登录"，属预期。要避免闪烁就在 Rust 层把状态
 *      同步注入（Tauri 能在加载前注入初始化数据），这是功能集的事。
 */
export const metadata: Metadata = {
  title: "Luminous",
  description: "Luminous 桌面客户端",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
