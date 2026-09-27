import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

import { OpenAPIPage, getMDXComponents } from '@/components/mdx'
import { openapi } from '@/lib/openapi'
import { source } from '@/lib/source'

type DocsPageProps = {
  params: Promise<{ slug?: string[] }>
}

/** `source.getPage()` 的返回类型（docs 与 openapi 两个来源的联合）。 */
type DocPage = NonNullable<ReturnType<typeof source.getPage>>

/**
 * 文档页渲染器。
 *
 * 本目录下有两类页面，渲染方式不同：
 *
 * 1. **MDX 页**（manual / luminous / lucent / errors）：`page.data.body` 是编译后的组件。
 * 2. **OpenAPI 虚拟页**（`api/**`）：没有 `body`，用 `getOpenAPIPageProps()` 渲染。
 *
 * 用 `'body' in page.data` 分流，而不是判断 `slug[0] === 'api'`——前者跟随数据本身。
 */
export default async function DocsSlugPage({ params }: DocsPageProps) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <Content page={page} />
      </DocsBody>
    </DocsPage>
  )
}

/**
 * 按页面类型选择渲染路径。
 *
 * `preloadOpenAPIPage` 的签名是 `<Type, Data>(page: Page<Type, Data>)`，要求单一 `Type`；
 * 而 `source.getPage()` 在合并了两个来源后返回的是 `Page<'docs'> | Page<'openapi'>` 联合，
 * 直接传进去无法收窄。这里先分流、再在分支内调用，顺带避免给纯 MDX 页做无谓的 preload。
 */
async function Content({ page }: { page: DocPage }) {
  if ('body' in page.data && page.data.body) {
    const MDX = page.data.body
    return <MDX components={getMDXComponents()} />
  }

  return <OpenAPIContent page={page} />
}

/**
 * OpenAPI 虚拟页。
 *
 * ⚠️ 不要在这里调 `openapi.preloadOpenAPIPage(page)`。它读的是页面数据上的
 * `_openapi.preload`，而 `getVirtualFiles()` 写进虚拟页的 `_openapi` 只有
 * `{ method, webhook, deprecated }`，**没有 `preload` 键**（fumadocs-openapi 12.0.3）。
 * 于是它返回 `{ preloaded: { docs: {} } }`，而 `<OpenAPIPage />` 又要求
 * `preloaded.docs[document]` 存在，两边对不上就会抛
 * "the document ... is not preloaded"。
 *
 * 虚拟页的 `getOpenAPIPageProps()` 已经带上了 `payload.bundled`（spec 全文），
 * 走的是 `OpenAPIPageProps_Spec` 这条分支，本来就不需要 preload。
 * `preload` 是给「由 `generateFiles()` 生成成 .mdx」的页面用的：
 * 那种页面把 spec 放在页外，才需要预加载。本站用虚拟页，所以直接传 props 即可。
 */
function OpenAPIContent({ page }: { page: DocPage }) {
  return <OpenAPIPage {...getOpenApiProps(page)} />
}

/**
 * 取 OpenAPI 虚拟页的渲染属性。
 *
 * 类型说明：`getOpenAPIPageProps` 由 `openapiPlugin()` 在**运行时**注入到页面数据上，
 * 而 `page.data` 的静态类型来自 fumadocs-mdx 宏，只描述 front-matter 里声明过的字段
 * （`_openapi` 有声明，注入的方法没有）。因此这里做一次收敛断言，
 * 范围仅限本函数，不用 `any` 扩散到渲染逻辑。
 */
function getOpenApiProps(page: DocPage): Parameters<typeof OpenAPIPage>[0] {
  const data = page.data as { getOpenAPIPageProps?: () => Parameters<typeof OpenAPIPage>[0] }
  if (!data.getOpenAPIPageProps) {
    throw new Error(`OpenAPI 页面缺少 getOpenAPIPageProps：${page.url}`)
  }
  return data.getOpenAPIPageProps()
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({ params }: DocsPageProps) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

