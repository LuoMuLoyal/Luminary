/**
 * 构建收尾：修正静态导出产物里**无扩展名**的文件。
 *
 * 运行：`pnpm build`（由 `apps/site` 的 build 脚本串在 `next build` 之后）
 *
 * ## 为什么需要这一步
 *
 * `output: 'export'` 会把 Route Handler 导出成**无扩展名**的静态文件。
 * 本站的搜索索引就是这种情况：产物是 `out/api/search`（11 MB JSON），
 * 而对象存储按扩展名判定 `Content-Type`——无扩展名会被当作
 * `application/octet-stream`（或被拒），前端 `fetch().json()` 直接失败。
 *
 * 这条路**只在部署时暴露**：本地 `next dev` 有服务端按路由返回正确类型，
 * `serve` 之类的本地静态服务器也会兜底猜类型，所以本地测不出来。
 *
 * ## 为什么改名而不是改 Route Handler
 *
 * fumadocs 的 `staticGET()` 是 Route Handler 专用，输出文件名由路由路径决定，
 * Next 没有提供「加扩展名」的配置。改名是不改动索引生成流程的唯一做法。
 *
 * ## 目标 app 怎么定位
 *
 * 与 `sync-docs.ts` 同一套约定（本包不在任何 app 里，不能猜）：
 *   1. 命令行：`node finalize-export.ts <appRoot>`
 *   2. 环境变量：`LUMINARY_APP_ROOT`
 *   3. 缺省：`<repoRoot>/apps/site`
 *
 * ⚠️ 注意本脚本读的是 **`<appRoot>/out/`**，不是本包自己的目录。
 * （早期写错过一次：`resolve(scriptDir, '..')` 指向 `packages/sync/`。）
 */
import { existsSync } from "node:fs";
import { rename } from "node:fs/promises";
import { join, resolve } from "node:path";

import { findRepoRoot, scriptDirOf } from "./context.ts";

/**
 * 需要补扩展名的产物（相对 `out/`）。
 *
 * ⚠️ 改这里时必须同步改 `lib/search-config.ts` 的 `SEARCH_INDEX_URL`，
 * 否则前端会请求一个不存在的路径。两侧不联动的话失败在**运行时**
 * （搜索弹窗能开、输入无结果），不会有构建错误。
 */
const RENAMES: { from: string; to: string; why: string }[] = [
  {
    from: "api/search",
    to: "api/search.json",
    why: "搜索索引：无扩展名时对象存储不返回 application/json",
  },
];

const scriptDir = scriptDirOf(import.meta.url);
const appRootArg = process.argv[2] ?? process.env.LUMINARY_APP_ROOT;
const appRoot = appRootArg
  ? resolve(appRootArg)
  : join(findRepoRoot(scriptDir), "apps", "site");

const outDir = join(appRoot, "out");

if (!existsSync(outDir)) {
  console.error(`✗ 找不到产物目录：${outDir}`);
  console.error("  先跑 next build，或确认本脚本在 build 之后执行。");
  process.exit(1);
}

let renamed = 0;
for (const { from, to, why } of RENAMES) {
  const src = join(outDir, from);
  const dest = join(outDir, to);

  if (!existsSync(src)) {
    // 已经改过（重复执行）或索引根本没生成——两种必须区分开
    if (existsSync(dest)) {
      console.log(`- ${from} → ${to}（已处理，跳过）`);
      continue;
    }
    console.error(`✗ 期望的产物不存在：${src}`);
    console.error(`  原因：${why}`);
    console.error("  若索引生成流程改了输出路径，请同步更新本脚本的 RENAMES。");
    process.exit(1);
  }

  await rename(src, dest);
  console.log(`✓ ${from} → ${to}（${why}）`);
  renamed++;
}

console.log(`产物收尾完成：改名 ${renamed} 个。`);
