/**
 * 两仓文档 → Luminary 内容目录同步。
 *
 * 运行：`pnpm sync:docs`（Node 24 原生类型剥离，无需 tsx/ts-node）
 *
 * 依据 `plans/2026-09-28-docs-site-rollout-plan.md` §四 的映射表，把 `Luminous` 与
 * `Lucent` 的 docs/ 与 plans/ **全量**搬进 `content/docs/{luminous,lucent}/`。
 *
 * 本文件只做**入口编排**：解析路径 → 调 `sync()` → 打印报告。
 * 具体职责拆在 `sync/` 下：
 *
 * | 模块 | 职责 | 变更频率 |
 * |---|---|---|
 * | `rules.ts` | 路径映射表 | 高（仓库结构调整就要改） |
 * | `run.ts` | 编排顺序与计数 | 中 |
 * | `page.ts` | front-matter + 转义 | 低 |
 * | `frontmatter.ts` / `escape.ts` | 纯函数 | 极低 |
 * | `walk.ts` / `compodoc.ts` / `nav.ts` | 文件搬运 | 低 |
 * | `context.ts` | 路径推导 | 极低（但错了会静默失败） |
 *
 * 三条硬约束（来自 Fumadocs 16 的实际行为，不是风格偏好）：
 *
 * 1. `pageSchema.title` 是**必填**非可选字段。两仓大量文档只有 `status/owner/updated`
 *    这类 front-matter，标题写在正文 H1 里，必须提取并补进去，否则构建期 schema 校验失败。
 *    → 见 `page.ts`
 *
 * 2. 正文里的 MDX 语法地雷。两仓文档是给 GitHub / 编辑器看的手写 Markdown，会出现
 *    裸 `<`（泛型 `Map<string>`、`<br>`）与 `{`（占位符、JSON 片段）。这些在 MDX 里是
 *    JSX / 表达式语法，会把整篇解析崩掉。搬进来前必须实体化。只处理正文，
 *    front-matter 与代码围栏内不动。
 *    → 见 `escape.ts`
 *
 * 3. `_naming-lookup.json` 必须跳过（`Lucent/plans/` 下），否则会被当 MDX 解析。
 *    → 由 `rules.ts` 的 `isMarkdown` 过滤承担
 *
 * 同步产物**不进 git**，可反复运行：每次先整体清空目标目录再写，
 * 保证源文件删除后站点不残留。
 */
import { join, resolve } from "node:path";

import { createContext, findRepoRoot, scriptDirOf } from "./context.ts";
import { printReport } from "./output.ts";
import { sync } from "./run.ts";

/**
 * 目标 app 根目录。
 *
 * 本包**不知道**自己在给哪个 app 同步内容（它不在任何 app 目录下），
 * 所以目标必须由调用方给出，优先级：
 *   1. 命令行：`node sync-docs.ts <appRoot>`
 *   2. 环境变量：`LUMINARY_APP_ROOT`
 *   3. 缺省：`<repoRoot>/apps/site`（当前唯一的静态 app）
 *
 * 给缺省值的理由：`pnpm sync:docs` 是最高频入口，每次都传路径很烦。
 * 而"猜错了"的代价是**明确失败**而不是静默写错地方——
 * `createContext` 会检查目标目录下有没有 `next.config.mjs`，没有就报错。
 */
const scriptDir = scriptDirOf(import.meta.url);
const appRootArg = process.argv[2] ?? process.env.LUMINARY_APP_ROOT;
const appRoot = appRootArg
  ? resolve(appRootArg)
  : join(findRepoRoot(scriptDir), "apps", "site");

printReport(await sync(createContext(scriptDir, appRoot)));
