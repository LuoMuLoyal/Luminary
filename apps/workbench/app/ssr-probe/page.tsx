/**
 * SSR 自检页——**骨架占位，用于证明本 app 确实是 SSR**。
 *
 * 页面在**每次请求时**渲染（`dynamic = 'force-dynamic'`），因此时间戳会变。
 * 这不是业务功能，而是把"SSR 真的生效"变成可观测的事实：
 * 若有人误加了静态优化，这个页面的时间戳会冻结在构建时刻，一眼可见。
 *
 * 功能集与真实认证逻辑都不在这里——那是后续独立计划。
 */
export const dynamic = "force-dynamic";

export default function SsrProbe() {
  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "48rem", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>SSR 自检</h1>
      <p style={{ lineHeight: 1.7, opacity: 0.75 }}>
        本次请求的服务端渲染时间：{new Date().toISOString()}
      </p>
      <p style={{ lineHeight: 1.7, opacity: 0.75, fontSize: "0.875rem" }}>
        刷新本页时间应变化。若不变，说明静态优化被误开（见 layout.tsx 顶部说明）。
      </p>
    </main>
  );
}
