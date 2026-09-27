// Tauri v2 外壳——**骨架，无业务逻辑**。
//
// ## 为什么现在就建壳
//
// ADR-0008 已定「桌面壳选 Tauri」。壳的形态属于**结构决策**
// （放哪个 app、与 Next.js 如何共处），不是功能决策，所以随骨架一并固定。
//
// ## 与 SSR 的关系（重要）
//
// 本 app 是 **SSR**，不能像纯静态站点那样用 `frontendDist` 直接指向一个 HTML 目录：
// SSR 需要常驻 Node 进程按请求渲染。落地方式（sidecar 进程 vs 指向外部服务）
// 属于功能集计划的内容，**本骨架不做决定，也不假装已解决**。
//
// ## 前置依赖
//
// 构建需要 Rust 工具链与 WebView2（Win10+ 通常已预装）。

/// 应用入口。
///
/// 由 `main.rs` 调用；`mobile_entry_point` 是 Tauri v2 要求的属性，
/// 用于移动端复用同一入口（本项目暂不做移动端，但保留属性以免日后返工）。
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("启动 Tauri 应用失败");
}
