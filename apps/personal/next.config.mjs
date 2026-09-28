/**
 * 个人网站——**根路径应用**。
 *
 * ## 站点拓扑（已定）
 *
 * ```
 * devluo.com/              → 本 app（占根路径）
 * devluo.com/luminous      → site（官网）
 * devluo.com/luminous/docs → site（文档站）
 * ```
 *
 * ## 为什么本 app **不需要** `assetPrefix`
 *
 * 本 app 占了根路径，在 multi-zones 的语义里是**默认应用**——
 * 处理所有未被更具体 zone 匹配的路径。官方指南明确：
 * 「The default application handling all paths not routed to another
 * more specific zone does not need an `assetPrefix`.」
 *
 * 反过来，`site` 挂在 `/luminous` 下，它**必须**配 `assetPrefix: '/luminous'`，
 * 否则它的 `/_next/` 会和本 app 的 `/_next/` 在根路径上撞车。
 *
 * ⚠️ 不要"为了对称"也给本 app 加前缀：那会让资源变成 `/<某前缀>/_next/...`，
 * 而根路径下并不存在该前缀 → 全站资源 404。
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
