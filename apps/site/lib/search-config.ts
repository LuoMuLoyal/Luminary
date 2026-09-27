/**
 * 静态搜索索引的**共享参数**。
 *
 * 这些值必须在两处保持完全一致：
 *   - 构建期建索引：`app/api/search/route.ts`
 *   - 浏览器检索：`components/search.tsx`
 *
 * 为什么必须共享：flexsearch 的 `Document` 把倒排表按自己的 encoder 编码。
 * 用 A 配置建出来的索引，导入到 B 配置的 `Document` 里**不会报错**，只是查不出东西。
 * 实测（420 篇语料，四组查询）：
 *   服务端 strict+CJK → 客户端默认配置：环境变量=0 用药提醒=0 Riverpod=0 错误码=0
 *   服务端 strict+CJK → 客户端 strict+CJK：环境变量=1 用药提醒=1 Riverpod=1 错误码=1
 * 所以两边配置一旦漂移，搜索会「弹窗能开、输入无结果」地静默失败。
 *
 * 这里刻意不用 `flexsearchFromSource` / `flexsearchStaticClient` 的默认值：
 *   - 默认 `tokenize: "full"` 会把每个词的所有子串都建成索引，中文按字切分后组合数
 *     极大，420 篇导出 487 MB（单键 300 MB，超 V8 单字符串上限会直接构建失败）。
 *   - 默认编码器对中文分词不友好，`Charset.CJK` 按字编码，体积更小且召回更好。
 */

/** 每页最多收录的内容块数。 */
export const SEARCH_BLOCK_LIMIT = 6

/** 每块正文进入索引的字符上限。 */
export const SEARCH_BLOCK_CHARS = 400

/**
 * 建索引 / 检索两侧共用的 flexsearch Document 参数。
 *
 * 注意 `tokenize` 与 `encoder` 必须放在传给 `Search.Document` 的**顶层**：
 * fumadocs 的 `createDocument` 形如 `new Document({ tokenize: "full", ...options, document: {...} })`，
 * 放顶层才会覆盖默认值（实测放进 `document` 的嵌套层无效）。
 */
export const SEARCH_DOCUMENT_OPTIONS = {
  tokenize: 'strict',
  encoder: 'CJK',
} as const

/** 索引文件地址（站点根下的静态 JSON，由 `staticGET` 在构建期导出）。 */
export const SEARCH_INDEX_URL = '/api/search'
