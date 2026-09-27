/**
 * 同步编排：清空 → 按规则搬运 → 手写导航 → 自检 → compodoc。
 *
 * 本模块只负责**顺序与计数**，不含任何具体转换逻辑——
 * 转换在 `page.ts`，映射在 `rules.ts`，遍历在 `walk.ts`。
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, posix, relative } from "node:path";

import { copyCompodoc } from "./compodoc.ts";
import type { SyncContext } from "./context.ts";
import { assertCopiesIgnored, copyNav } from "./nav.ts";
import { buildPage } from "./page.ts";
import { createReport, type Report } from "./report.ts";
import { buildRules, buildSingleRenames } from "./rules.ts";
import { walk } from "./walk.ts";

export async function sync(ctx: SyncContext): Promise<Report> {
  if (!existsSync(ctx.luminousRoot) || !existsSync(ctx.lucentRoot)) {
    throw new Error(
      `找不到两仓工作区：\n  Luminous: ${ctx.luminousRoot}\n  Lucent:   ${ctx.lucentRoot}`,
    );
  }

  const report = createReport();

  // 整体清空再写：源文件被删除后站点不残留
  for (const dir of ["luminous", "lucent"]) {
    await rm(join(ctx.contentDir, dir), { recursive: true, force: true });
  }

  const writePage = async (
    raw: string,
    destRel: string,
    sourcePath: string,
    section: string,
  ): Promise<void> => {
    const dest = join(ctx.contentDir, destRel);
    await mkdir(dirname(dest), { recursive: true });
    const fallbackTitle = posix.basename(destRel).replace(/\.md$/, "");
    await writeFile(
      dest,
      buildPage(raw, { file: sourcePath, fallbackTitle }, report),
      "utf8",
    );
    report.written++;
    report.bySection.set(section, (report.bySection.get(section) ?? 0) + 1);
  };

  for (const rule of buildRules(ctx)) {
    if (!existsSync(rule.from)) {
      report.warnings.push(`源目录不存在，跳过：${rule.from}`);
      continue;
    }

    // features / modules 是「每子目录一篇 README.md」，按子目录名命名；
    // 其余规则保持原文件名与相对目录结构。
    if (rule.nested) {
      const subdirs = (
        await readdir(rule.from, { withFileTypes: true })
      ).filter((d) => d.isDirectory());
      for (const sub of subdirs) {
        const readme = join(rule.from, sub.name, "README.md");
        if (!existsSync(readme)) {
          report.skipped++;
          report.warnings.push(`无 README，跳过：${join(rule.from, sub.name)}`);
          continue;
        }
        await writePage(
          await readFile(readme, "utf8"),
          `${rule.to}/${sub.name}.md`,
          readme,
          rule.label,
        );
      }
      continue;
    }

    for (const file of await walk(rule.from, !rule.flat)) {
      const name = posix.basename(file);
      if (rule.filter && !rule.filter(name)) {
        report.skipped++;
        continue;
      }

      const rel = relative(rule.from, file).split("\\").join("/");
      // 子目录里的 README.md 变成该目录的 index.md，避免与同级同名文件冲突
      const destRel =
        name === "README.md"
          ? `${rule.to}/${posix.dirname(rel)}/index.md`
          : `${rule.to}/${rel}`;

      await writePage(await readFile(file, "utf8"), destRel, file, rule.label);
    }
  }

  for (const item of buildSingleRenames(ctx)) {
    if (!existsSync(item.from)) {
      report.warnings.push(`源文件不存在，跳过：${item.from}`);
      continue;
    }
    await writePage(
      await readFile(item.from, "utf8"),
      item.to,
      item.from,
      item.label,
    );
  }

  // 手写导航放在最后：上面刚把目标目录整个清空了。
  report.navCopied = await copyNav(ctx);

  // 自检：复制出来的路径必须都在 .gitignore 里，否则新增导航分区会静默留下未跟踪文件。
  await assertCopiesIgnored(ctx);

  // compodoc 产物整体拷到 public/ 下作外链入口。
  report.compodocCopied = await copyCompodoc(ctx);

  return report;
}
