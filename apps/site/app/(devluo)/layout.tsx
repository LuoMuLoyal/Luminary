import type { ReactNode } from 'react'

import '../globals.css'

/**
 * 个人站 root layout（host: devluo.com）。
 *
 * 多 root layout：顶层 app/layout.tsx 已删除，每个 route group 自带 <html>/<body>。
 * 见规划 §4.4。
 */
export const metadata = {
  title: {
    default: 'devluo',
    template: '%s | devluo',
  },
  description: '个人介绍、作品集与联系方式',
}

export default function DevluoRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  )
}
