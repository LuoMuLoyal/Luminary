import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/**
 * fumadocs-mdx 是 ESM-only，官方要求用 .mjs 配置（原 next.config.ts 已删除）。
 *
 * ## 托管模式
 *
 * 纯静态导出。全部路由构建期确定（无 SSR/ISR/Server Actions），产物为 out/ 下的
 * 静态文件，上传对象存储 + CDN。因此不需要常驻 Node 进程，也不使用 proxy.ts。
 * `images.unoptimized` 是静态导出的硬要求；图片由对象存储的边缘处理出图。
 *
 * ## 站点拓扑（已定）
 *
 * ```
 * devluo.com/              → personal（个人站，占根路径）
 * devluo.com/luminous      → 本 app（官网）
 * devluo.com/luminous/docs → 本 app（文档站）
 * ```
 *
 * ## 为什么用 `basePath` 而不是 `assetPrefix`
 *
 * 本 app 与 personal 同域共存，两者都会产出 `/_next/`。若不区分，本 app 的
 * HTML 里写的绝对路径 `/_next/...` 会去**根路径**取，而根路径归 personal。
 *
 * 官方文档对这两种配置有明确分工：
 *
 * - `assetPrefix`：用于**把静态资源指向 CDN 域名**。文档明确说
 *   「若目的是把应用挂在子路径，应改用 basePath；**不建议**为此用 assetPrefix」。
 * - `basePath`：用于**把应用部署在域名的子路径下**，正是本场景。
 *
 * 关键差别在**产物布局**（已实测）：
 *
 * | 配置 | HTML 里的资源路径 | 磁盘上的实际位置 | 结果 |
 * |---|---|---|---|
 * | `assetPrefix: '/luminous'` | `/luminous/_next/...` | `out/_next/...` | ❌ 对不上，CDN 上 404 |
 * | `basePath: '/luminous'` | `/luminous/_next/...` | `out/luminous/_next/...` | ✅ 一致 |
 *
 * 原因是 `assetPrefix` 的语义是"资源在别处（CDN 域名）"，物理文件仍在
 * `/_next/`，靠 CDN 回源规则去映射；而静态导出没有服务端做这层映射，
 * 必须让产物布局与引用路径**天然一致**——`basePath` 就是这样。
 *
 * `basePath` 还顺带解决两件事（这两件 `assetPrefix` 不管，得手写）：
 *   1. `<Link href="/luminous/docs">` 这类**页面链接**会自动带上前缀；
 *      但注意**代码里写的仍是裸路径**，前缀由 Next 注入。
 *   2. `next/image` 的 `src` 需自行加前缀（官方明确）。
 *
 * personal 占根路径，属于「默认应用」，**两边都不需要**。
 *
 * ## 为什么还要 `trailingSlash: true`
 *
 * 静态导出在 `trailingSlash: false`（默认）下产出的是 `luminous.html`，
 * 而 URL `/luminous` 在**对象存储上映射不到这个文件**——静态托管只会把
 * 目录的 `index.html` 当默认页，不会拿 `luminous.html` 当 `/luminous` 的索引。
 * 结果是页面 404，且只在线上暴露（本地 `next dev` 有服务端做映射，看不出来）。
 *
 * 官方文档明确：`trailingSlash: true` 配 `output: 'export'` 时，
 * `/about` 产出 `/about/index.html` 而不是 `/about.html`。这才与对象存储的
 * 默认页机制吻合。
 *
 * ⚠️ 代价是 URL 会带尾斜杠并**重定向**（`/luminous` → `/luminous/`）。
 * 这是静态托管的常规形态；若不接受，就得在 CDN 侧写规则做无斜杠映射。
 *
 * ## 为什么用环境变量而不是写死
 *
 * 本地 `pnpm dev` 跑在 `localhost:3000` 的**根路径**下。若写死前缀，
 * 开发时页面会变成 `localhost:3000/luminous`，访问根路径 404。
 * 因此本地不设该变量、部署与 CI 时设。
 *
 * 默认值给 '/luminous' 是刻意的：让忘设变量的 `pnpm build` 产出**正确的线上形态**，
 * 而不是悄悄构建出一份会打到根路径的产物（那种错误只在线上才暴露）。
 *
 * ⚠️ `NEXT_PUBLIC_` 前缀是必需的：该值要同时可用于客户端组件。
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/luminous'

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  basePath,
  // 静态导出 + 对象存储的硬要求，见上方说明
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default withMDX(config)
