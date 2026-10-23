/**
 * 从 Lucent 的 OpenAPI 契约生成 TypeScript 类型。
 *
 * ## 为什么要生成而不是手写
 *
 * Lumine 是 Lucent 的**消费者**，而契约的唯一事实源是 Lucent 的
 * `docs/reference/generated/openapi.json`（由 `pnpm export:openapi` 产出）。
 * 手写类型等于维护第二份契约：后端加字段时前端不会报错，直到线上才暴露。
 *
 * ## 路径推导：按标记文件向上找，不数层级
 *
 * 本脚本会随目录调整而移动。历史教训是「`resolve(here, '..')` 在搬家后静默指错」
 * ——不报错，只是去错目录找空内容。因此这里找两个标记：
 *   - `pnpm-workspace.yaml` → monorepo 根（`Luminary/`）；
 *   - 其上一级 → 工作区根（`Lumos/`），同级仓库都在那里。
 *
 * ## 找不到契约时**直接失败**，不生成空壳
 *
 * 静默产出空类型会让 `tsc` 报一堆看不懂的错，反而把
 * 「Lucent 仓库不在旁边」这个真实原因藏起来。
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import openapiTS, { astToString } from "openapi-typescript";

const here = dirname(fileURLToPath(import.meta.url));

/** 从 `start` 向上找到含 `marker` 的目录。找不到时抛出可操作的错误。 */
function findUp(start: string, marker: string): string {
  let dir = start;
  for (;;) {
    if (existsSync(join(dir, marker))) return dir;
    const parent = resolve(dir, "..");
    if (parent === dir) {
      throw new Error(
        `从 ${start} 向上找不到标记文件 ${marker}。\n` +
          "  该标记用于推导 monorepo 根目录；若目录结构变了，请同步更新本脚本。",
      );
    }
    dir = parent;
  }
}

const repoRoot = findUp(here, "pnpm-workspace.yaml");
const workspaceRoot = resolve(repoRoot, "..");

const openapiPath = join(
  workspaceRoot,
  "Lucent",
  "docs",
  "reference",
  "generated",
  "openapi.json",
);
const outputPath = join(
  here,
  "..",
  "..",
  "src",
  "lib",
  "generated",
  "lucent-api.ts",
);

if (!existsSync(openapiPath)) {
  throw new Error(
    `找不到 Lucent 的 OpenAPI 契约：${openapiPath}\n` +
      "  Lumine 需要与 Lucent 平铺在同一工作区下：\n" +
      "    <workspace>/{Luminary,Lucent,Luminous}\n" +
      "  若文件存在但内容过期，先在 Lucent 执行 pnpm export:openapi。",
  );
}

const schema = await readFile(openapiPath, "utf8");
const ast = await openapiTS(new URL(`file://${openapiPath.replaceAll("\\", "/")}`), {
  alphabetize: true,
  exportType: true,
});

const banner = `/**
 * 由 \`pnpm --filter @luminary/lumine contract\` 生成，**请勿手改**。
 *
 * 契约源：Lucent 的 docs/reference/generated/openapi.json
 * 生成器：openapi-typescript
 *
 * 改了后端契约时的流程：
 *   1. 在 Lucent 执行 \`pnpm export:openapi\`
 *   2. 在 apps/lumine 执行 \`pnpm contract\`
 *   3. 提交本文件与改动一起
 */

`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, banner + astToString(ast), "utf8");
console.log(`[contract] 已生成 ${outputPath}（源 ${schema.length} 字节）`);
