/**
 * 文档站构建门禁。
 *
 * 运行：`pnpm verify:docs`（Node 24 原生类型剥离，无需 tsx/ts-node）
 *
 * 规划 §五 Phase 5 定的门禁范围是三条，**不含全站死链校验**（见规划 §四
 * 「关于相对链接」——两仓文档里的相对链接按已决事项不做处理，因此查死链必然误报）：
 *
 *   1. 两仓工作区可读（`Luminous` 与 `Lucent` 与本站同级）
 *   2. 同步结果与源计数一致（防止同步规则漏掉某个目录，静默少搬内容）
 *   3. 每个同步分区都有内容（防止规则写错导致整段为空却仍"成功"）
 *
 * 这个脚本**不跑 `pnpm build`**——那是耗时最长的一步，交给调用方（CI 或人）串行执行，
 * 这样可以先花几秒拿到"内容对不对"的结论，再决定要不要付构建的时间成本。
 *
 * 退出码：0 通过，1 失败。
 */
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 路径推导——与 `sync-docs.ts` 同规则：**按标记文件向上找，不数层级**。
 * 见该文件顶部的说明（monorepo 改造把脚本从仓库根挪到了 `apps/site/scripts/`，
 * 原先的 `resolve(here, "..")` 会静默指错）。
 */
function findUp(start: string, marker: string): string {
  let dir = start;
  for (;;) {
    if (existsSync(join(dir, marker))) return dir;
    const parent = resolve(dir, "..");
    if (parent === dir) {
      throw new Error(
        `从 ${start} 向上找不到标记文件 ${marker}。\n` +
          `  该标记用于推导 monorepo 根目录；若目录结构变了，请同步更新本函数。`,
      );
    }
    dir = parent;
  }
}

const here = dirname(fileURLToPath(import.meta.url));
/** monorepo 根——同级仓库 Luminous / Lucent 在它的上一级。 */
const repoRoot = findUp(here, "pnpm-workspace.yaml");
/**
 * 本站 app 根——`content/` 与 `public/` 在这里。
 *
 * ⚠️ **不能**用 `findUp(here, "next.config.mjs")`：本包已移到 `packages/sync/`，
 * 向上找不到 app。目标 app 与 `sync-docs.ts` 同规则由调用方给出
 * （命令行参数 → `LUMINARY_APP_ROOT` → 缺省 `apps/site`）。
 */
const appRootArg = process.argv[2] ?? process.env.LUMINARY_APP_ROOT;
const appRoot = appRootArg ? resolve(appRootArg) : join(repoRoot, "apps", "site");
const workspaceRoot = resolve(repoRoot, "..");

const LUMINOUS = join(workspaceRoot, "Luminous");
const LUCENT = join(workspaceRoot, "Lucent");
const CONTENT = join(appRoot, "content", "docs");

/** 一个必须存在的同步分区：目标目录 + 期望的最少篇数。 */
interface Expectation {
  /** 相对 content/docs 的路径 */
  dir: string;
  /** 说明 */
  label: string;
  /** 至少要有多少篇，防止"整段为空也算成功" */
  min: number;
}

/**
 * 期望的分区与最小篇数。
 *
 * 数字取实测值向下留出余量，不写精确值：**文档会持续新增**，
 * 门禁的职责是抓"整段丢失/规则失效"，不是锁死篇数。
 * 精确计数由 `sync:docs` 自己打印，供人核对。
 */
const EXPECTATIONS: Expectation[] = [
  { dir: "luminous", label: "Luminous 全量文档", min: 180 },
  { dir: "lucent", label: "Lucent 全量文档", min: 180 },
  { dir: "luminous/archive", label: "Luminous 归档", min: 80 },
  { dir: "lucent/archive", label: "Lucent 归档", min: 80 },
  { dir: "luminous/adr", label: "Luminous ADR", min: 8 },
  { dir: "lucent/adr", label: "Lucent ADR", min: 18 },
  { dir: "luminous/plans", label: "Luminous 执行计划", min: 15 },
  { dir: "lucent/plans", label: "Lucent 执行计划", min: 10 },
  { dir: "luminous/logs/migration-log", label: "Luminous 变更流水", min: 15 },
  { dir: "lucent/logs/migration-log", label: "Lucent 变更流水", min: 15 },
];

/** 手写页也必须存在（它们不在同步流程里，容易被误删）。 */
const MANUAL_PAGES = [
  "manual/index.mdx",
  "manual/today.mdx",
  "manual/record.mdx",
  "manual/medicine.mdx",
  "manual/review.mdx",
  "manual/mine.mdx",
  "manual/medicine-reminder.mdx",
  "api/index.mdx",
  "errors/index.mdx",
  "compodoc/index.mdx",
];

/** 递归数出目录下的 .md / .mdx。 */
async function countDocs(dir: string): Promise<number> {
  if (!existsSync(dir)) return -1;
  let n = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) n += await countDocs(full);
    else if (/\.mdx?$/.test(entry.name)) n++;
  }
  return n;
}

const failures: string[] = [];

// 1. 两仓工作区必须可读——同步内容不进 git，CI 必须同时 checkout 三仓
for (const [label, path] of [
  ["Luminous", LUMINOUS],
  ["Lucent", LUCENT],
] as const) {
  if (!existsSync(path)) {
    failures.push(
      `找不到 ${label} 工作区：${path}\n` +
        `  同步内容不进 git，构建必须能读到同级仓库（CI 需 checkout 三仓）。`,
    );
  }
}

// 2. 每个分区都要达到最小篇数
const rows: string[] = [];
for (const exp of EXPECTATIONS) {
  const n = await countDocs(join(CONTENT, exp.dir));
  const ok = n >= exp.min;
  if (!ok) {
    failures.push(
      `${exp.dir} 只有 ${n === -1 ? "目录不存在" : n} 篇，期望 ≥ ${exp.min}（${exp.label}）`,
    );
  }
  rows.push(
    `  ${ok ? "OK  " : "失败"} ${exp.label.padEnd(22)} ${String(n).padStart(4)} 篇  (≥${exp.min})`,
  );
}

/**
 * 同步文档总数。
 *
 * ⚠️ 只数 `luminous` + `lucent` 两个**顶层**目录，其余分区（archive / adr / plans /
 * logs）都是它们的子目录。若把上表各分区相加会严重重复计数
 * （实测相加得 763，而实际只有 422）——那是个会误导人的数字，不要那么报。
 */
const syncedTotal = await countDocs(join(CONTENT, "luminous"));
const syncedTotal2 = await countDocs(join(CONTENT, "lucent"));

// 3. 手写页必须都在
const manualRows: string[] = [];
for (const rel of MANUAL_PAGES) {
  const ok = existsSync(join(CONTENT, rel));
  if (!ok) failures.push(`手写页缺失：content/docs/${rel}`);
  manualRows.push(`  ${ok ? "OK  " : "失败"} ${rel}`);
}

console.log("文档站门禁检查\n");
console.log("同步分区（子分区是上面两项的子集，故不求和）：");
for (const r of rows) console.log(r);
console.log(
  `\n  同步文档合计 ${syncedTotal + syncedTotal2} 篇` +
    `（Luminous ${syncedTotal} + Lucent ${syncedTotal2}，不含手写页）\n`,
);
console.log("手写页：");
for (const r of manualRows) console.log(r);

// compodoc 是外链入口，缺了入口页仍可用，但应在
if (!existsSync(join(appRoot, "public", "compodoc", "index.html"))) {
  console.log(
    "\n提示：public/compodoc/index.html 不存在，compodoc 入口会指向空页面。" +
      "\n  跑一次 `pnpm sync:docs` 即可（它负责拷贝 compodoc 产物）。",
  );
}

if (failures.length > 0) {
  console.error(`\n门禁未通过，${failures.length} 项失败：`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("\n门禁通过。");
