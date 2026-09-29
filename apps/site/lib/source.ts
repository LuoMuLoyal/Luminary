import { loader, multiple } from 'fumadocs-core/source'
import { defineDocs } from 'fumadocs-mdx/macro'
import { openapiPlugin } from 'fumadocs-openapi/server'

import { openapi } from './openapi'

/**
 * 文档内容源。
 *
 * ## baseUrl 为什么是**裸路径** `/docs`
 *
 * fumadocs 生成的链接会**原样输出**，而 Next 的 `basePath`（`/luminous`）
 * 还会在渲染时**再注入一次**。两者叠加的后果是双重前缀：
 * `/luminous/luminous/docs/...`——线上死链（实测：单个页面 14 条链接中招）。
 *
 * 所以这里写**裸路径**，前缀交给 `basePath` 统一注入，与本仓库其他内部链接
 * （见 `app/(luminous)/luminous/page.tsx` 的说明）保持一致。
 *
 * ⚠️ 这与「baseUrl 必须等于公开 URL」的直觉相反，但公开 URL 是
 * `basePath + baseUrl` 的**合成结果**，不是 baseUrl 本身。
 * 公开 URL 仍是 devluo.com/luminous/docs。
 *
 * ## 内容来源
 *
 * - `content/docs/`：手写（manual / errors）与同步（luminous / lucent）的 MDX。
 *   由 `defineDocs` 提供。
 * - `api/**`：**虚拟页面**，构建期从 OpenAPI spec 生成，不落盘。
 *
 * ## api/ 为什么是虚拟页面而不是生成的 MDX
 *
 * 两条路都可用，这里选虚拟页面：
 *
 * 1. `generateFiles()` 会写出 143 个 `.mdx`，每个内嵌一个 `_openapi.preload`，
 *    值为 **spec 的绝对文件路径**（实测形如 `D:\...\Lucent\docs\...\openapi.json`）。
 *    该路径在 CI 上必然不同，产物不可移植；这些文件还得再 gitignore 一遍。
 * 2. 虚拟页面把 spec 路径只有一处（`lib/openapi.ts`），构建期直接读。
 *
 * ## openapiPlugin() 的作用
 *
 * 注意它**只装饰不建页**：给已有页面（靠 `_openapi` 元数据识别）加上 HTTP 方法标签
 * 与 deprecated 删除线。真正的页面由 `openapi.staticSource()` 提供，
 * 两者一起用才完整。
 */
const docs = defineDocs({
  dir: 'content/docs',
})

export const source = loader({
  baseUrl: '/docs',
  source: multiple({
    docs: docs.toFumadocsSource(),
    // baseDir 决定虚拟页挂在哪个路径前缀下。不传的话 143 个 API 页会直接落到
    // `/docs/<operationName>`（实测），与普通文档同级、也无法在导航里分组。
    //
    // groupBy: 'tag' 按 spec 的 tag 分文件夹（实测 23 组）。不做的话 143 个端点在
    // 侧边栏里平铺，读者无法按模块定位。
    openapi: await openapi.staticSource({ baseDir: 'api', groupBy: 'tag' }),
  }),
  plugins: [openapiPlugin()],
})
