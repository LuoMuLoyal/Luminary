'use client'

import { createOpenAPIPage } from 'fumadocs-openapi/ui'

/**
 * `api/**` 虚拟页用的 OpenAPI 渲染组件。
 *
 * ⚠️ 必须在**客户端模块**里创建。`createOpenAPIPage()` 本身是 client function，
 * 在服务端组件里调用会报：
 *   "Attempted to call createOpenAPIPage() from the server but createOpenAPIPage is on the client"
 * 所以这个文件带 `'use client'`，并由 `components/mdx.tsx`（服务端也可用）转出；
 * 服务端组件只把它当组件渲染或经 props 传递，不直接调用。
 *
 * 模块顶层创建一次即可——组件内部无状态，不必每次渲染重建。
 * 不传 options：默认渲染器已覆盖标题、参数表、请求/响应示例与 schema。
 */
export const OpenAPIPage = createOpenAPIPage()
