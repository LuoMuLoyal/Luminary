'use client'

import { useDocsSearch } from 'fumadocs-core/search/client'
import { flexsearchStaticClient } from 'fumadocs-core/search/client/flexsearch-static'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search'

/**
 * 静态模式的自定义搜索弹窗。
 *
 * 为什么不能用默认 dialog：它走 `fetchClient`，会请求 `/api/search?query=...`。
 * 静态托管下 `/api/search` 是一个固定的 JSON 文件，查询参数没有任何人处理，
 * 所以默认实现在静态导出里搜不出东西。
 *
 * 这里改用 `flexsearchStaticClient`：启动时把构建期导出的整份索引拉到浏览器，
 * 之后在本地检索（零请求、零服务端）。中文召回已验证（规划 §3.3）。
 */
export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    client: flexsearchStaticClient(),
  })

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  )
}
