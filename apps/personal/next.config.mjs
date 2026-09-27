/**
 * 个人网站——**独立静态导出**。
 *
 * ## 为什么没有 `assetPrefix`
 *
 * multi-zones 里每个 zone 都要避开其他 zone 的静态资源路径。但本 app 是
 * **独立挂载**（独立域名/独立目录），不与 site 共用同一套 `/_next/` 路径，
 * 因此暂不需要 prefix。等 §8.2 的域名划分定了、且确认要与 site 同源挂载时再加。
 *
 * ## 为什么是 `output: 'export'`
 *
 * 展示型站点，无认证、无服务端状态、无 SSR 需求。
 * 这与 site 一致，与 workbench（SSR）相反——三者按发布形态分区，不按技术栈分。
 *
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
}

export default config