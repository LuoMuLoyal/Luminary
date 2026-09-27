'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'
import type { ReactNode } from 'react'

import CustomSearchDialog from '@/components/search'

/**
 * 客户端 Provider 包装。
 *
 * 单独包一层是因为 RootProvider 需要接收 SearchDialog 组件引用——
 * 按官方建议放在 client 组件里传，避免 server → client 边界上的序列化问题。
 */
export function Provider({ children }: { children: ReactNode }) {
  return <RootProvider search={{ SearchDialog: CustomSearchDialog }}>{children}</RootProvider>
}
