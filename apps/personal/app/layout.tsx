import type { Metadata } from "next";

import "./globals.css";

/**
 * 站点元数据。
 *
 * `metadataBase` 用于把相对图片/链接解析成绝对 URL（社交分享卡片需要绝对地址）。
 * 域名待定，见 monorepo 计划 §8.2——这里先留 TODO，**不编造**一个正式域名。
 */
export const metadata: Metadata = {
  title: "个人主页",
  description: "个人介绍、项目与作品展示",
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
