import { resolve } from 'node:path'

import { createOpenAPI } from 'fumadocs-openapi/server'

/**
 * Lucent OpenAPI spec 在文档站里的接入点。
 *
 * spec 由后端 `pnpm export:openapi` 生成（`Lucent/docs/reference/generated/openapi.json`），
 * 是 API 契约的唯一事实源——本站只读它、不手写 endpoint 散文（见规划 §八）。
 *
 * 路径解析：本文件在 `Luminary/lib/`，工作区根在上两级，后端仓库与 `Luminary` 同级。
 *
 * ⚠️ 同步内容与 spec 都不进 git（规划 §六.3），因此构建必须能读到同级仓库；
 * CI 需同时 checkout 三个仓库（见规划 Phase 5）。
 */
const workspaceRoot = resolve(process.cwd(), '..')

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
