/**
 * 手写导航的复制与自检。
 *
 * 手写导航（分区首页 `index.mdx` + 各级 `meta.json`）在 `content/nav/` 下维护，
 * 同步时复制到 `content/docs/`。**必须放在同步的最后**——流程开头会整体清空
 * `content/docs/{luminous,lucent}`，若导航直接写在目标位置，每次同步都会被 `rm` 掉。
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import type { SyncContext } from "./context.ts";
import { walk } from "./walk.ts";

/**
 * 把 `content/nav/**` 原样复制到 `content/docs/**`，返回复制文件数。
 *
 * ⚠️ `content/docs/` 下的副本必须在 `.gitignore` 里逐条忽略（与 `luminous/`、`lucent/`
 * 一样），否则它们会以「未跟踪文件」的形态出现在 `git status` 里，看起来像残留。
 * 这里递归遍历整个 `content/nav/`，所以**新增任何导航分区都会自动产生新的副本路径**。
 */
export async function copyNav(ctx: SyncContext): Promise<number> {
  const navRoot = join(ctx.appRoot, "content", "nav");
  if (!existsSync(navRoot)) return 0;

  let count = 0;
  for (const file of await walk(navRoot, true)) {
    const rel = relative(navRoot, file);
    const dest = join(ctx.contentDir, rel);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, await readFile(file), "utf8");
    count++;
  }
  return count;
}

/**
 * 校验 `content/nav/` 复制出的每个目标路径都被 git 忽略。
 *
 * 用 `git check-ignore` 判定——直接问 git 本身，而不是自己解析 `.gitignore`
 * （后者要处理取反、嵌套、锚定等一堆规则，容易写错）。
 *
 * 任何一条没被忽略就抛错。这是**故意的硬失败**：宁可让同步看起来"失败"，
 * 也不要留下一个只有靠人肉眼才能发现的静默不一致。
 */
export async function assertCopiesIgnored(ctx: SyncContext): Promise<void> {
  const navRoot = join(ctx.appRoot, "content", "nav");
  if (!existsSync(navRoot) || !existsSync(join(ctx.repoRoot, ".git"))) return;

  // 报告路径要相对 **git 仓库根**（repoRoot），而不是 appRoot——
  // app 已移到 apps/site/，用户看到的报错应当是可以直接去 .gitignore 里找的路径。
  const copies = (await walk(navRoot, true)).map((file) =>
    relative(ctx.repoRoot, join(ctx.contentDir, relative(navRoot, file))),
  );

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const run = promisify(execFile);

  const notIgnored: string[] = [];
  for (const rel of copies) {
    try {
      // check-ignore 对被忽略的路径返回 0，未忽略返回 1
      await run("git", ["check-ignore", "-q", rel], { cwd: ctx.repoRoot });
    } catch {
      notIgnored.push(rel);
    }
  }

  if (notIgnored.length > 0) {
    throw new Error(
      `content/nav/ 复制出的这些文件没有被 .gitignore 忽略：\n` +
        notIgnored.map((f) => `  ${f}`).join("\n") +
        `\n\n请在 monorepo 根的 .gitignore 里补上对应目录（它们是构建期副本，不该提交）。\n` +
        `  注意：monorepo 根的规则**不要写前导斜杠**，否则锚定的是仓库根而不是 app 目录。`,
    );
  }
}
