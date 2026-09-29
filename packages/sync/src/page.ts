/**
 * 单篇文档的组装：front-matter 规整 + MDX 转义。
 *
 * 这是"源文档 → 站点页"的**唯一转换点**。把它单独成模块，是因为
 * `escapeMdx` 与 `frontmatter` 都只是纯函数，真正的策略决定在这里：
 * 标题从哪来、兜底怎么取、front-matter 顺序如何。
 */
import {
  buildFrontMatter,
  extractH1,
  splitFrontMatter,
  stripLeadingH1,
  titleFromMeta,
} from "./frontmatter.ts";
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
 *
 * ⚠️ 补完 `title` 后必须把正文开头那个重复的 H1 去掉，否则页面上会出现
 * **两个标题**：Fumadocs 把 front-matter 的 `title` 渲染成页面标题，
 * 正文里再有一个 H1 就是第二个。实测 412/436 篇都中招（见 `stripLeadingH1`）。
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

  // 去重必须在 title 确定之后：只有知道「页面标题是什么」，
  // 才能判断正文开头那个 H1 是不是它的重复。
  const deduped = stripLeadingH1(body, title);

  const { text, escapes } = escapeMdx(deduped);
  if (escapes > 0)
    report.escapingSamples.push({ file: ctx.file, count: escapes });

  return `${buildFrontMatter(meta, title)}\n\n${text}\n`;
}
