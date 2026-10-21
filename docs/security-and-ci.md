# 安全与 CI 门禁

本文件说明本仓自动跑的安全检查、它们各自覆盖什么、以及为什么目前都不阻断合并。
分发流程见 [deployment.md](deployment.md)。

## 仓库形态对安全策略的影响

本仓是 polyglot monorepo，三个 app 的发布形态完全不同，这决定了安全面也不同：

| app | 产物形态 | 主要风险面 |
|---|---|---|
| `site` | 静态导出 → CDN | 文档内容渲染进 HTML（XSS）；内容来自另外两个仓库，属跨仓不可信输入 |
| `personal` | 静态导出 → CDN | 同上，但内容自包含，风险面较小 |
| `desktop` | Tauri 安装包 → 用户机器 | **Rust 层的认证与请求中转**；依赖被编译进安装包，漏洞无法靠发新前端修 |

`desktop` 是本仓风险最高的部分：它的认证、请求中转、原生能力都在
`apps/desktop/src-tauri/` 的 Rust 层，且产物分发到用户设备后无法热修。

## 自动检查清单

| 检查 | 文件 | 覆盖范围 | 阻断 |
|---|---|---|---|
| CodeQL | `.github/workflows/codeql.yml` | TS：三个 app 与 `packages/sync`；Rust：`src-tauri/` | 否 |
| OSV-Scanner | `.github/workflows/osv-scanner.yml` | `pnpm-lock.yaml` 与 `Cargo.lock`，含传递依赖 | 否 |
| Scorecard | `.github/workflows/scorecard.yml` | 仓库配置与流程的反模式 | 否 |
| Dependabot | `.github/dependabot.yml` | npm / cargo / github-actions 三套月度分组更新 | 开 PR |

三者查的层面不同，不可互相替代：

- **CodeQL** 查源码里的数据流漏洞。Rust 部分用 `build-mode: autobuild`，因为它需要
  真实构建上下文才能解析宏与泛型。
- **OSV-Scanner** 查依赖树里的已知漏洞，包括不直接声明、由上游带进来的传递依赖。
  Dependabot 抓不到这类——它只在有新版本时才动，而传递依赖不在它的视野里。
- **Scorecard** 不查代码，查工程习惯：分支保护有没有开、action 有没有固定版本、
  有没有要求代码评审。这些单看代码都正常，但正是供应链攻击最常利用的入口。

## 为什么现在都不阻断

首次接入会一次性浮出全部存量问题。一个从第一天就红的检查，结果是被人忽略或被
无条件豁免，而不是被修复。

这与其他仓库的口径一致：Lucent 的 Trivy 镜像扫描同样是 `exit-code: '0'` 报告模式，
`arch:check` 也是先用基线对账再逐步收紧。

收紧路径：先观察一到两个周期 → 清理或显式豁免存量 → 把 `osv-scanner.yml` 的
`fail-on-vuln` 改为 `true`、把对应检查加入分支保护。

## 已知缺口

以下能力本仓**尚未具备**，列在这里以免误以为已经覆盖：

1. **没有单元测试与 lint 门禁**。三个 app 的 workflow 只验「能编译」，
   `cargo check` + `vite build` 通过不代表逻辑正确。这是本仓最大的基建缺口。
2. **action 未固定到 SHA**。全部用 tag 引用；tag 可被上游仓库移动，是供应链攻击
   的常见入口。Scorecard 会把它记为 finding。
3. **没有 pre-commit 钩子**。检查全部后移到 CI，本地提交前无拦截。

前两项属于"该补"，但不在本次改动范围内。
