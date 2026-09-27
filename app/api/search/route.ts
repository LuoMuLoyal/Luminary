import { flexsearchFromSource } from 'fumadocs-core/search/flexsearch'

import { source } from '@/lib/source'

/**
 * 静态搜索索引。
 *
 * 构建期 `staticGET()` 把整份 flexsearch 索引导出成 `out/api/search`（静态 JSON），
 * 客户端由 `components/search.tsx` 里的 `flexsearchStaticClient` 拉取后本地检索。
 *
 * `force-static` 是 output: 'export' 下 route handler 的硬要求——
 * 静态站点没有服务端，这个 handler 只在构建时被调用一次。
 */
export const dynamic = 'force-static'

export const { staticGET: GET } = flexsearchFromSource(source)
