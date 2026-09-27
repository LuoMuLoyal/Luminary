/**
 * 桌面工作台——**唯一的 SSR zone**。
 *
 * ## 与另外两个 app 的关键差别：没有 `output: 'export'`
 *
 * `output: 'export'` 是 **app 级**开关。site 与 personal 恒为静态导出，
 * 不受本 app 影响——这消除了"文档站被拖成 SSR"的担忧（见 monorepo 计划 §三）。
 *
 * 本 app 需要 SSR 的理由是发布形态不同：认证态、SSE、服务端缓存，
 * 且以 Tauri 打包分发，而不是上传 CDN。
 *
 * ## 路由
 *
 * 待定（monorepo 计划 §8.2 / §8.3）。若最终与静态站同域挂载，
 * 需要在静态站侧配 `rewrites` 指向本 zone，并给本 zone 配 `assetPrefix`
 * 以避免 `/_next/` 路径冲突。**当前都未配置**——先只证明 SSR 能构建。
 *
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  // 刻意不写 output: 'export'
}

export default config