'use client'

import Search from 'flexsearch'
import { useDocsSearch } from 'fumadocs-core/search/client'
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

import { SEARCH_DOCUMENT_OPTIONS, SEARCH_INDEX_URL } from '@/lib/search-config'

/**
 * 静态模式的自定义搜索客户端。
 *
 * ## 为什么不用 `flexsearchStaticClient`
 *
 * 那个函数内部写死 `createDocument()`（即 `tokenize: "full"` + 默认编码器），
 * 且它的 `FlexsearchStaticOptions` 只暴露 `from` / `locale` / `tag`，没有任何入口
 * 修改 Document 参数。而本站的索引是用 `strict` + `Charset.CJK` 建出来的
 * （原因见 `lib/search-config.ts`：默认配置会导出 487 MB，构建直接失败）。
 *
 * 两边配置不一致时 flexsearch **不报错**，只是所有查询都返回空——表现为
 * 「搜索弹窗能正常打开、输入任何词都没有结果」，非常难排查。
 * 实测：默认配置的客户端导入本站索引，四组中英文查询全部 0 命中。
 *
 * 因此这里自己实现 `SearchClient`（fumadocs 的公开接口），
 * 用与服务端**同一份**参数建 Document。参数来自 `lib/search-config.ts`，避免漂移。
 *
 * ## 为什么不用默认 dialog 的 fetchClient
 *
 * 它请求 `/api/search?query=...`。静态托管下 `/api/search` 是一个固定 JSON 文件，
 * 没有服务端处理查询参数，所以默认实现在静态导出里同样搜不出东西。
 * 这里改为一次性拉取整份索引，之后在浏览器本地检索（零请求、零服务端）。
 */

interface ExportedIndex {
  type: string
  raw: Record<string, string>
}

type FlexDocument = InstanceType<typeof Search.Document>

/** 模块级缓存：索引体积较大（约 10 MB），避免每次打开弹窗重新下载与重建。 */
let indexPromise: Promise<FlexDocument> | null = null

function loadIndex(): Promise<FlexDocument> {
  if (indexPromise) return indexPromise

  indexPromise = (async () => {
    const res = await fetch(SEARCH_INDEX_URL)
    if (!res.ok) {
      throw new Error(`搜索索引加载失败（${res.status}）：${SEARCH_INDEX_URL}`)
    }

    const data = (await res.json()) as ExportedIndex

    const doc = new Search.Document({
      ...SEARCH_DOCUMENT_OPTIONS,
      encoder: Search.Charset[SEARCH_DOCUMENT_OPTIONS.encoder],
      document: { id: 'id', index: ['content'], tag: ['tags'], store: true },
    })

    for (const [key, value] of Object.entries(data.raw)) {
      doc.import(key, value)
    }

    return doc
  })()

  // 失败不要缓存：否则一次瞬时网络抖动会让本次会话的搜索永久失效。
  indexPromise.catch(() => {
    indexPromise = null
  })

  return indexPromise
}

/** 把 flexsearch 的命中 id 转成 fumadocs 结果所需的 url/内容。 */
function toSortedResults(
  doc: FlexDocument,
  ids: string[],
): { id: string; type: 'page'; url: string; content: string }[] {
  const results: { id: string; type: 'page'; url: string; content: string }[] = []
  // 同一篇文档会被 buildDocuments 拆成多条（标题、描述、每个标题、每个正文块），
  // 命中 id 带上 `-N` 后缀但共用同一个 url。按 url 去重，避免结果列表里
  // 同一页反复出现；保留首次（相关度最高）的那条。
  const seen = new Set<string>()

  for (const id of ids) {
    const record = doc.get(id) as
      | { content?: string; url?: string; title?: string }
      | null
      | undefined
    if (!record) continue

    // id 形如 `/luminous/docs/x#anchor` 或 `/luminous/docs/x-6`；store 里带了权威 url。
    const url = record.url ?? id.split('#')[0]
    if (seen.has(url)) continue
    seen.add(url)

    results.push({
      id,
      type: 'page',
      url,
      content: record.title ?? record.content?.slice(0, 120) ?? url,
    })
  }

  return results
}

const searchClient = {
  deps: [SEARCH_INDEX_URL],
  async search(query: string) {
    const doc = await loadIndex()
    const raw = doc.search(query, { index: 'content', limit: 20 }) as
      | { field?: string; result?: string[] }[]
      | undefined

    // flexsearch Document 查询返回按字段分组的结果，取 content 字段那一组。
    const ids = (raw?.find((r) => r.field === 'content') ?? raw?.[0])?.result ?? []
    return toSortedResults(doc, ids)
  },
}

export default function CustomSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({ client: searchClient })

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
