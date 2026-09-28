/**
 * 桌面客户端首页——**骨架占位**。
 *
 * 本计划只搭骨架，**不实现业务功能**（monorepo 计划 §七）。
 * 功能集是独立计划（ADR-0008：0.1.0 发布后启动桌面 MVP）。
 *
 * 这里的目的是：
 *   1. 证明 app 产出**静态导出**产物（`out/`），能被 Tauri 内嵌
 *   2. 证明与另外两个静态 app 并存不冲突
 *
 * ⚠️ 本页是**静态**的：它在构建期就定型，不含任何按请求渲染的逻辑。
 * 登录态等运行时状态必须由 Rust 层提供（见 layout.tsx 顶部说明）。
 *
 * 后端由 `Lucent` 提供（ADR-0008 第 3 条），本骨架**不接**任何接口。
 */
export default function Home() {
  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "48rem", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Luminous</h1>
      <p style={{ lineHeight: 1.7, opacity: 0.75 }}>
        桌面客户端骨架已就位。功能集见后续计划。
      </p>
    </main>
  );
}
