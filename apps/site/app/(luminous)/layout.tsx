import type { ReactNode } from 'react'

import { Provider } from '@/components/provider'

import '../globals.css'

/**
 * 产品站 + 文档站 root layout（devluo.com/luminous/**）。
 *
 * 文档与产品落地页共用这个 root layout；Fumadocs 的 RootProvider 必须包在
 * 含文档的那一侧（主题、搜索弹窗都由它提供）。
 */
export const metadata = {
  title: {
    default: 'Luminous',
    template: '%s | Luminous',
  },
}

export default function LuminousRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
