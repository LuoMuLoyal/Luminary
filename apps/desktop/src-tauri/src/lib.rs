// Tauri v2 外壳——**骨架，无业务逻辑**。
//
// ## 为什么现在就建壳
//
// ADR-0008 已定「桌面壳选 Tauri」。壳的形态属于**结构决策**
// （放哪个 app、Rust 层承担什么职责），不是功能决策，所以随骨架一并固定。
//
// ## Rust 层是本 app 的"服务端"（关键）
//
// 网页层是**静态导出**（Tauri 官方指南明确"不支持基于服务端的方案"），
// 因此 Next.js 侧没有 cookies / headers / rewrites / proxy，
// 无法在服务端读会话。承担这件事的是这里的 Rust 层：
//
//   Web(静态) ──invoke──> Rust ──HTTPS──> Lucent
//
// 好处不只是"能认证"：
//   1. **绕开 CORS**：请求从 Rust 出网，不是浏览器发起的跨域请求。
//      注意这是**顺带**的好处——网页端靠 Lucent 的 CORS_ORIGIN 白名单直连，
//      也完全可行；桌面端走 Rust 的真正理由是下面两条。
//   2. **凭据不进浏览器存储**：JWT 可放系统凭据库（Windows Credential Manager 等），
//      不必落 localStorage——WebView 里的脚本读不到，XSS 偷不走。
//   3. **能注入初始化数据**：Tauri 可在页面加载前把会话状态交给前端，
//      避免"首屏一帧未登录"的闪烁。
//
// ⚠️ 以上职责**本骨架都不实现**，只固定"谁调谁"。业务命令（登录、拉数据、
// 订阅）属于功能集计划（ADR-0008：0.1.0 发布后启动桌面 MVP）。
//
// ## 前置依赖
//
// Rust 工具链与 WebView2（Win10+ 通常已预装）。
// Windows 上另需 `icons/icon.ico`——tauri-build 生成 Windows Resource 时强制要求。

/// 应用入口。
///
/// 由 `main.rs` 调用；`mobile_entry_point` 是 Tauri v2 要求的属性，
/// 用于移动端复用同一入口（本项目暂不做移动端，但保留属性以免日后返工）。
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // shell 插件：后续用它在 Rust 侧发起外部请求 / 打开链接。
        // 现在只注册，不开任何权限——Tauri v2 的权限是白名单制，
        // 未在 capabilities 里声明的能力不会被前端调用到。
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("启动 Tauri 应用失败");
}
