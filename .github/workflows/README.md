# GitHub Actions Workflows

按**关注点**拆分：三个 app 各有一个构建门禁文件，安全类检查各占一个文件。
好处：粒度权限（默认 `contents: read`；`security-events: write` 只给安全类 job）、
独立触发与并发组、失败隔离、小 diff。

| 文件 | `name:` | 职责 | 触发 |
| --- | --- | --- | --- |
| `site.yml` | `site` | 官网 + 文档站构建门禁（需三仓平铺） | push(`main`), 路径过滤 |
| `personal.yml` | `personal` | 个人网站构建门禁（自包含） | push(`main`), 路径过滤 |
| `lumine.yml` | `lumine` | Lumine 桌面端双栈门禁（TS 构建 + `cargo check`） | push(`main`), 路径过滤 |
| `codeql.yml` | `CodeQL` | 代码安全分析（TS + Rust） | push, PR, 周度 |
| `osv-scanner.yml` | `OSV-Scanner` | 依赖漏洞扫描（npm + cargo） | push, PR, 周度 |
| `scorecard.yml` | `Scorecard` | 供应链安全评分 | push, 周度 |

## 构建门禁与安全门禁为什么分开

三个 app 的构建门禁各有 `paths` 白名单，只在**自己的输入变化**时触发——这是为了
不让改 personal 的文案去重跑 lumine 的 Rust 编译。安全类 workflow 则相反：
它们看的是全局状态（依赖树、源码模式、仓库配置），与具体改了哪个 app 无关，
所以用统一的 `branches` 触发而不做路径过滤。

如果把它们并进各自的 app 文件，`paths` 白名单会变成安全扫描的漏网条件——
改了 `Cargo.lock` 但没配在 `lumine.yml` 的 `paths` 里，扫描就不跑。

## 安全类 workflow

| workflow | 查什么 |
| --- | --- |
| `codeql.yml` | **源码**里的数据流漏洞。TS 覆盖三个 app 与 `packages/sync`；Rust 覆盖 `apps/lumine/src-tauri`（路径穿越、命令注入、不安全 TLS 配置） |
| `osv-scanner.yml` | **依赖**里的已知漏洞，含传递依赖。同时扫 `pnpm-lock.yaml` 与 `Cargo.lock` |
| `scorecard.yml` | **流程与配置**的反模式：分支保护、action 版本固定、评审要求、依赖更新开关 |

## 与其他仓库的差别

- 本仓的 CodeQL **多扫一门 Rust**：桌面端的原生能力与文件访问在 Rust 层，
  Tauri 应用会打包进安装包分发到用户机器，这部分漏洞无法靠发新前端修。
- 本仓此前没有 `dependabot.yml`，现已补齐 npm / cargo / github-actions 三套配置，
  见 `.github/dependabot.yml` 的注释。

⚠️ **三条安全 workflow 目前都不阻断合并**，报告只上 Security > Code scanning。
理由：首次接入会浮出全部存量问题，一上来就红没人会修。等存量清完再逐条收紧。

## 待办

本仓的 app 构建门禁只验「能编译」，**没有单元测试与 lint 步骤**。
补测试与 lint 门禁是独立的一项工作，不在本文档范围内。
