/**
 * compodoc 产物搬运。
 *
 * 把 `Lucent/docs/reference/generated/compodoc/` 整目录拷到 `public/compodoc/`。
 *
 * 用**整目录拷贝**而不是逐篇同步：compodoc 产物内部互相链接（767 个 HTML 的
 * 自带导航），改写路径反而会破坏它自己的跳转。这里只当静态资源搬运。
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import type { SyncContext } from "./context.ts";
import { walk } from "./walk.ts";

export async function copyCompodoc(ctx: SyncContext): Promise<number> {
  const from = join(
    ctx.lucentRoot,
    "docs",
    "reference",
    "generated",
    "compodoc",
  );
  const to = join(ctx.appRoot, "public", "compodoc");

  await rm(to, { recursive: true, force: true });
  if (!existsSync(from)) return 0;

  const files = await walk(from, true);
  for (const file of files) {
    const rel = relative(from, file);
    const dest = join(to, rel);
    await mkdir(dirname(dest), { recursive: true });
    // 按二进制读写的意义：compodoc 产物含图片与字体，用 utf8 会损坏它们
    await writeFile(dest, await readFile(file));
  }
  return files.length;
}
