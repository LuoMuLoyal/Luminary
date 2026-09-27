import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

import { OpenAPIPage } from './openapi-page'

/**
 * 由渲染层直接使用（`api/**` 虚拟页），同时挂进 MDX 组件表。
 * 组件本体在 `openapi-page.tsx`（client 模块），原因见该文件。
 */
export { OpenAPIPage }

/** MDX 渲染组件表；错误码页的表格等自定义组件也在这里挂载。 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    OpenAPIPage,
    ...components,
  }
}
