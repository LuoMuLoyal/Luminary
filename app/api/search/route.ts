import Search from 'flexsearch'
import { flexsearchFromSource } from 'fumadocs-core/search/flexsearch'

import { SEARCH_BLOCK_CHARS, SEARCH_BLOCK_LIMIT, SEARCH_DOCUMENT_OPTIONS } from '@/lib/search-config'
import { source } from '@/lib/source'

/** `remark-structure` 产出的结构；宏生成类型不向 TS 暴露它，这里显式声明。 */
interface StructuredData {
  headings: { id: string; content: string }[]
  contents: { heading: string | undefined; content: string }[]
}

/**
 * 静态搜索索引（构建期导出到 `out/api/search`）。
 *
 * 静态导出下没有服务端：构建期 `staticGET()` 把整份 flexsearch 索引导出成静态 JSON，
 * 浏览器拉取后在本地检索（见 `components/search.tsx`）。所以索引体积不只是
 * 「构建能不能过」，而是「浏览器能不能加载」。
 *
 * ## 参数是怎么定的（420 篇真实语料实测）
 *
 * 默认配置（`buildIndexDefault` + `tokenize: "full"`）在这个站上不可用：
 * 索引导出 **487 MB**，单个键 `content.1.map` 就 300 MB，超过 V8 单字符串上限
 * （约 512 MB）会抛 `RangeError: Invalid string length`，构建直接失败。
 *
 * 实测取舍（体积）：
 *
 * | 配置 | 体积 |
 * | --- | --- |
 * | `full`（默认） | 487 MB |
 * | `strict` | 29 MB |
 * | `strict` + `Charset.CJK` | 52 MB |
 * | `strict` + CJK + 每页正文截断至 6×400 | **10.9 MB** |
 *
 * 结论：
 * 1. `tokenize: "full"` 是体积爆炸的根因——它把每个词的所有子串都建索引，
 *    中文按字切分后组合数极大。`strict` 体积降一个数量级且召回不降。
 * 2. `Charset.CJK` 让中文按字编码，匹配更准（默认编码器对中文分词不友好）。
 * 3. 正文裁剪到每页 6 块 × 400 字后体积再降数倍，中英文查询仍全部命中。
 *    标题与描述完整保留，正文只作召回补充。
 *
 * ⚠️ `tokenize` / `encoder` 必须与客户端**完全一致**，否则所有查询返回空
 * 且不报错。共享常量在 `lib/search-config.ts`，两侧都从这里取值。
 *
 * ⚠️ 这两个键必须放在传给 `createDocument` 的**顶层**。实测路径：
 * `flexsearchFromSource` → `server()` → `createDocument(options.document)`，
 * `server()` 只取 `options.document` 往下传，而 `createDocument` 内部是
 * `new Document({ tokenize: "full", ...options, document: {...} })`；
 * 所以放进 `document` 的这两个键会在展开时覆盖默认的 `tokenize: "full"`，
 * 而放在 `flexsearchFromSource` 的顶层则会被 `server()` 丢掉（字节数与默认完全一致）。
 */

export const dynamic = 'force-static'

/** `flexsearchFromSource` 的选项类型（该参数可选，这里取非空形态）。 */
type FromSourceOptions = NonNullable<Parameters<typeof flexsearchFromSource>[1]>

/**
 * `document` 通道的类型断言桥接：
 * 上游把 `document` 标为 flexsearch 的 `DocumentOptions`，那里不含
 * `tokenize`/`encoder`（它们在 `IndexOptions` 上），但运行时确实会读到。
 * 上游补齐类型后可直接删掉断言。
 */
type DocumentChannel = FromSourceOptions['document']

const searchOptions: FromSourceOptions = {
  buildIndex: async (page) => {
    const raw = (page.data as { structuredData?: StructuredData | (() => Promise<StructuredData>) })
      .structuredData
    if (!raw) throw new Error(`搜索结果缺少 structuredData：${page.url}`)

    const structured = typeof raw === 'function' ? await raw() : raw

    const contents = structured.contents.slice(0, SEARCH_BLOCK_LIMIT).map((item) => ({
      ...item,
      content: item.content.slice(0, SEARCH_BLOCK_CHARS),
    }))

    const headings = structured.headings.slice(0, SEARCH_BLOCK_LIMIT)

    return {
      title: page.data.title ?? page.url,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: { headings, contents },
    }
  },
  // 唯一能到达 createDocument 的通道；取值见 lib/search-config.ts。
  document: {
    tokenize: SEARCH_DOCUMENT_OPTIONS.tokenize,
    encoder: Search.Charset[SEARCH_DOCUMENT_OPTIONS.encoder],
  } as DocumentChannel,
}

export const { staticGET: GET } = flexsearchFromSource(source, searchOptions)
