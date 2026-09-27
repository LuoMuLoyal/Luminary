import { loader } from 'fumadocs-core/source'
import { defineDocs } from 'fumadocs-mdx/macro'

/**
 * 文档内容源。
 *
 * 目录：content/docs/
 *   - manual/    手写：使用教程（提交进 git）
 *   - luminous/  同步自 Luminous/docs（是否提交待定，见规划 §9）
 *   - lucent/    同步自 Lucent/docs（同上）
 *   - api/       生成：fumadocs-openapi
 *   - errors/    生成：错误码参考（W4）
 *
 * baseUrl 必须等于公开 URL：路径式拓扑下文档在 devluo.com/luminous/docs。
 */
const docs = defineDocs({
  dir: 'content/docs',
})

export const source = loader({
  baseUrl: '/luminous/docs',
  source: docs.toFumadocsSource(),
})
