/**
 * 单篇文档的组装：front-matter 规整 + MDX 转义。
 *
 * 这是"源文档 → 站点页"的**唯一转换点**。把它单独成模块，是因为
 * `escapeMdx` 与 `frontmatter` 都只是纯函数，真正的策略决定在这里：
 * 标题从哪来、兜底怎么取、front-matter 顺序如何。
 */
import { buildFrontMatter, extractH1, splitFrontMatter, titleFromMeta } from "./frontmatter.ts";
import { escapeMdx } from "./escape.ts";
import type { Report } from "./report.ts";

export interface PageContext {
  /** 源文件绝对路径，仅用于告警与统计的可读定位 */
  file: string;
  /** 无 title 也无 H1 时的兜底（取目标文件名） */
  fallbackTitle: string;
}

/**
 * 组装输出文件：保留原 front-matter、补齐 `title`、转义正文。
 *
 * `title` 的优先级：front-matter 的 `title` → 正文第一个 H1 → `fallbackTitle`。
 * 三者都没有时记一条告警（而不是静默用空标题——那会在构建期报 schema 错，
 * 且看不出是哪篇）。
 */
export function buildPage(
  raw: string,
  ctx: PageContext,
  report: Report,
): string {
  const { meta, body } = splitFrontMatter(raw);

  let title = titleFromMeta(meta);
  if (!title) {
    const h1 = extractH1(body);
    title = h1 ?? ctx.fallbackTitle;
    if (!h1)
      report.warnings.push(`无 title 也无 H1，回退到文件名：${ctx.file}`);
  }

  const { text, escapes } = escapeMdx(body);
  if (escapes > 0)
    report.escapingSamples.push({ file: ctx.file, count: escapes });

  return `${buildFrontMatter(meta, title)}\n\n${text}\n`;
}
