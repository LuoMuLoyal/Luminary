/**
 * 工作台首页——**骨架占位**。
 *
 * 本计划只搭骨架，**不实现业务功能**（monorepo 计划 §七："不实现工作台业务功能"）。
 * 工作台的功能集是独立计划（ADR-0008：0.1.0 发布后启动桌面 MVP）。
 *
 * 这里的目的是：
 *   1. 证明 app 走 **SSR** 产物（不是静态导出）
 *   2. 证明与两个静态 app 并存不冲突
 *
 * 后端由 `Lucent` 提供（ADR-0008 第 3 条），本骨架**不接**任何接口。
 */
export default function Home() {
  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "48rem", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>工作台</h1>
      <p style={{ lineHeight: 1.7, opacity: 0.75 }}>
        桌面工作台骨架已就位。功能集见后续计划。
      </p>
    </main>
  );
}
