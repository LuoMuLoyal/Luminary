import type { Metadata } from "next";

import "./globals.css";

/**
 * 工作台站点元数据。
 *
 * ## ⚠️ 注意不要在本 app 里加 `export const dynamic = 'force-static'`
 *
 * 本 app 是 SSR 的，页面需要能按请求渲染（认证态）。若给页面加了静态优化，
 * 构建期会把未登录状态固化成静态 HTML，表现为"打开就是未登录、登录后刷新才正常"。
 * 这是静态站与 SSR 混用时最容易踩的一类问题，故在此显式记下。
 */
export const metadata: Metadata = {
  title: "工作台",
  description: "Luminous 桌面工作台",
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
