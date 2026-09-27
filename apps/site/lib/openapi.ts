import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createOpenAPI } from 'fumadocs-openapi/server'

/**
 * Lucent OpenAPI spec 在文档站里的接入点。
 *
 * spec 由后端 `pnpm export:openapi` 生成（`Lucent/docs/reference/generated/openapi.json`），
 * 是 API 契约的唯一事实源——本站只读它、不手写 endpoint 散文（见规划 §八）。
 *
 * ## 路径解析：按标记文件向上找，**不要用 `resolve(cwd, '..')`**
 *
 * monorepo 改造后本站位于 `Luminary/apps/site/`，而同级仓库 `Luminous` / `Lucent`
 * 挂在 monorepo 根的上一级（即工作区根 `Lumos/`）。原先的 `resolve(cwd, '..')`
 * 只上一级，会指到 `Luminary/apps/`——**静默指错**，表现为构建时说 spec 不存在。
 *
 * 这里从本文件位置向上找含 `pnpm-workspace.yaml` 的目录作为 monorepo 根，
 * 再上一级才是工作区根。这样脚本或 app 再挪位置也不需要改这里。
 *
 * ⚠️ 同步内容与 spec 都不进 git（规划 §六.3），因此构建必须能读到同级仓库；
 * CI 需同时 checkout 三个仓库（见规划 Phase 6）。
 */
function findUp(start: string, marker: string): string {
  let dir = start
  for (;;) {
    if (existsSync(join(dir, marker))) return dir
    const parent = resolve(dir, '..')
    if (parent === dir) {
      throw new Error(
        `从 ${start} 向上找不到标记文件 ${marker}；无法推导 monorepo 根目录。`,
      )
    }
    dir = parent
  }
}

/** monorepo 根（含 pnpm-workspace.yaml）。 */
const monorepoRoot = findUp(
  dirname(fileURLToPath(import.meta.url)),
  'pnpm-workspace.yaml',
)
/** 工作区根：同级仓库 `Luminous` / `Lucent` 在这里。 */
const workspaceRoot = resolve(monorepoRoot, '..')

export const openapiSpecPath = resolve(
  workspaceRoot,
  'Lucent',
  'docs',
  'reference',
  'generated',
  'openapi.json',
)

export const openapi = createOpenAPI({
  // 传绝对路径：构建期读文件即可，页面元数据里只记 schema id，
  // 不会把本机路径写进产物（这一点与 generateFiles() 生成的 MDX 不同）。
  input: [openapiSpecPath],
  // spec 由后端产出，构建期不需要热更新
  disableCache: true,
})
