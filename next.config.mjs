import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/**
 * fumadocs-mdx 是 ESM-only，官方要求用 .mjs 配置（原 next.config.ts 已删除）。
 *
 * 托管模式：纯静态导出（见规划 §4.1、§8）。
 * 全部路由构建期确定（无 SSR/ISR/Server Actions），产物为 out/ 下的静态文件，
 * 直接上传 OSS/COS + CDN。因此不再需要常驻 Node 进程，也不使用 proxy.ts（已删除）。
 * images.unoptimized 是静态导出的硬要求；图片改由 OSS/COS 的边缘图片处理出图。
 *
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
}

export default withMDX(config)
