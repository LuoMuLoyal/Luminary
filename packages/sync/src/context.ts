/**
 * 同步流程的共享类型与路径解析。
 *
 * ## 为什么单独一个 `context.ts`
 *
 * 拆分前所有职责挤在一个 589 行的文件里，共享的是**文件级常量**
 * （`LUMINOUS` / `LUCENT` / `CONTENT`）。拆开后若还靠全局常量，
 * 各模块就产生隐式依赖，无法单独测试、也无法移动到别的 app。
 *
 * 因此这里把"根目录在哪"收敛成一个**显式传入的 `SyncContext`**：
 * 模块只收参数，不读全局，不猜目录。
 */
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 从 `start` 向上找含 `marker` 的目录。
 *
 * **不要退回 `resolve(here, "..")` 这种数层级的写法**：monorepo 改造把脚本
 * 从仓库根挪到 `apps/site/scripts/`，数层级会**静默指错**——不报错，
 * 只是去错目录找内容，表现为"同步成功但内容为空"。
 */
export function findUp(start: string, marker: string): string {
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

/** 一次同步所需的全部路径。模块只读这个对象，不自己推导目录。 */
export interface SyncContext {
  /** monorepo 根（含 `pnpm-workspace.yaml`）——同级仓库在它的上一级。 */
  repoRoot: string;
  /** 本站 app 根（含 `next.config.mjs`）——`content/` 与 `public/` 在这里。 */
  appRoot: string;
  /** 同级仓库所在目录（`Luminous` / `Lucent` 的父目录）。 */
  workspaceRoot: string;
  /** `Luminous` 仓库根。 */
  luminousRoot: string;
  /** `Lucent` 仓库根。 */
  lucentRoot: string;
  /** 同步目标：`<appRoot>/content/docs`。 */
  contentDir: string;
}

/**
 * 推导 monorepo 根（含 `pnpm-workspace.yaml`）。
 *
 * 本包在 `packages/sync/`，**不是**任何 app 的子目录，所以从这里向上找
 * `next.config.mjs` 是找不到的（app 根必须由调用方显式传入）。
 * 这也是把脚本移出 app 的必然代价：包不能猜"我要同步到哪个 app"。
 */
export function findRepoRoot(scriptDir: string): string {
  return findUp(scriptDir, "pnpm-workspace.yaml");
}

/**
 * 组装一次同步所需的全部路径。
 *
 * @param scriptDir 本包内任一入口文件所在目录（用于定位 monorepo 根）
 * @param appRoot   目标 app 的根目录（含 `content/` 与 `public/`）。
 *                  **必须显式传入**——本包不假设自己在哪个 app 里。
 */
export function createContext(scriptDir: string, appRoot: string): SyncContext {
  const repoRoot = findRepoRoot(scriptDir);
  const workspaceRoot = resolve(repoRoot, "..");

  if (!existsSync(join(appRoot, "next.config.mjs"))) {
    throw new Error(
      `目标 app 根目录里没有 next.config.mjs：${appRoot}\n` +
        `  该参数指向"文档站所在目录"，用于定位 content/ 与 public/。\n` +
        `  若 app 挪了位置，请更新调用方的参数（见各 app 的 package.json 脚本）。`,
    );
  }

  return {
    repoRoot,
    appRoot,
    workspaceRoot,
    luminousRoot: join(workspaceRoot, "Luminous"),
    lucentRoot: join(workspaceRoot, "Lucent"),
    contentDir: join(appRoot, "content", "docs"),
  };
}

/** 本文件所在目录——各入口用它调 `createContext`。 */
export function scriptDirOf(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}
