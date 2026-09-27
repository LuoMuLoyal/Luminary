/**
 * 个人网站首页——**骨架占位**。
 *
 * 本计划只确定 app 的边界与位置，**不做内容设计**（见 monorepo 计划 §七
 * "不做 personal 的内容设计"）。这里的目的是：
 *   1. 证明 app 能独立构建
 *   2. 证明产物与 site **不互相覆盖**（各自的 `out/`）
 *
 * 内容（个人介绍、项目列表、履历）是后续独立任务。
 */
export default function Home() {
  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "48rem", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>个人主页</h1>
      <p style={{ lineHeight: 1.7, opacity: 0.75 }}>
        站点骨架已就位。内容设计见后续任务。
      </p>
    </main>
  );
}
