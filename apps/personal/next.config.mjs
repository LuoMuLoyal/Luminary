/**
 * 个人网站——**独立静态导出**。
 *
 * ## 为什么没有 `assetPrefix`
 *
 * multi-zones 里每个 zone 都要避开其他 zone 的静态资源路径。但本 app 是
 * **独立挂载**（独立域名/独立目录），不与 site 共用同一套 `/_next/` 路径，
 * 因此暂不需要 prefix。等 §8.2 的域名划分定了、且确认要与 site 同源挂载时再加。
 *
 * ⚠️ 别把这里和 desktop 的 `assetPrefix` 混为一谈：desktop 那个只在**开发期**
 * 生效，用途是让 WebView 内的资源指回 `next dev`，与 multi-zones 的路径前缀无关。
 *
 * ## 为什么是 `output: 'export'`
 *
 * 展示型站点，无认证、无服务端状态、无 SSR 需求。
 * 三个 app **都是静态导出**，差别在分发方式（CDN vs 应用安装包），不在渲染方式。
 *
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
}

export default config