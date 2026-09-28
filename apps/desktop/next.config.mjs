/**
 * 桌面客户端——**静态导出**。
 *
 * ## 为什么必须是静态（不是取舍，是硬约束）
 *
 * Tauri 官方 Next.js 指南的清单第一条写死了：
 *
 * > 用静态导出，设置 `output: 'export'`。**Tauri 不支持基于服务端的方案。**
 * > —— https://tauri.app/start/frontend/nextjs/
 *
 * 骨架最初按 SSR 建（理由是"认证需要服务端"），**该判断错误且不可用**：
 * 桌面端的"服务端"由 **Tauri 的 Rust 层**承担，不需要 Node 进程。
 * 这个错要到打包那一刻才会暴露。
 *
 * Next.js 侧的限制也印证同一件事：启用 `output: 'export'` 后
 * `cookies` / `headers` / `rewrites` / `redirects` / `proxy` / `Server Actions`
 * 全部不可用，文档明确理由是它们 "require a Node.js server"。
 * **要在静态导出里做认证，认证就必须发生在 Next.js 之外**——
 * 桌面端有这个"之外"（Rust），纯网页端没有，故不能照搬本结论。
 *
 * ## 三层调用关系
 *
 * ```
 * 桌面端：  Web(静态) ──invoke──> Rust(Tauri) ──HTTPS──> Lucent
 * 网页端：  Web(静态) ──直连 + Bearer──> Lucent（受 CORS_ORIGIN 白名单约束）
 * ```
 *
 * 桌面端走 Rust 的收益（**不只是绕开 CORS**）：JWT 可存系统凭据库，
 * WebView 里的脚本读不到 → XSS 偷不走；Rust 还能在页面加载前注入会话状态，
 * 消除首屏"未登录"闪烁。
 *
 * ## `assetPrefix` 为什么在这里、且**只在开发期**
 *
 * 开发期前端由 `next dev` 在 3002 提供，而 WebView 加载的是页面本身，
 * 静态资源必须能被解析到开发服务器上——官方指南正是为此配
 * `assetPrefix`（仅非生产）。生产期资源随 `out/` 一起被 Tauri 内嵌，
 * 走相对路径，**不能再加前缀**。
 *
 * ⚠️ 这与 multi-zones 的 CDN 路径前缀是**两件不同的事**：后者属于部署编排
 * （monorepo 计划 §8.2），在 Phase 6 定。不要混为一谈。
 *
 * ## 发布形态
 *
 * 产物是 `out/` 静态文件，由 Tauri 打包进应用；与 site / personal 同为静态，
 * 但**分发方式不同**（应用安装包 vs 上传 CDN）。这正是本 app 独立成 zone 的原因。
 *
 * @type {import('next').NextConfig}
 */
const isProd = process.env.NODE_ENV === 'production';

const config = {
  reactStrictMode: true,
  output: 'export',
  // 静态导出下没有 Node 进程做图片优化，官方指南要求显式关掉
  images: { unoptimized: true },
  // 仅开发期：把资源指回 next dev（见上方说明）
  assetPrefix: isProd ? undefined : 'http://localhost:3002',
};

export default config;
