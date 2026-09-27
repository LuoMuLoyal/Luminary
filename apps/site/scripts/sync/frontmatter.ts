/**
 * front-matter 解析与重建。
 *
 * 只处理两仓实际使用的平铺 `key: value` 形态，**不引入完整 YAML 依赖**——
 * 这里多解析一行都算过度设计（例如嵌套 map、锚点、多行标量在两仓文档里都不存在）。
 */

/** 拆出 front-matter 行数组与正文。无 front-matter 时 `meta` 为空。 */
export function splitFrontMatter(raw: string): { meta: string[]; body: string } {
  const normalized = raw.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { meta: [], body: normalized };

  const end = normalized.indexOf("\n---", 3);
  if (end === -1) return { meta: [], body: normalized };

  const metaBlock = normalized.slice(4, end);
  const body = normalized.slice(end + 4).replace(/^\n+/, "");
  const meta = metaBlock.split("\n").filter((line) => line.trim().length > 0);
  return { meta, body };
}

/** 从正文第一个 H1 取标题；没有则返回 undefined。跳过代码围栏。 */
export function extractH1(body: string): string | undefined {
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^#\s+(.+?)\s*$/.exec(line);
    if (m) return m[1].replace(/`/g, "").trim();
  }
  return undefined;
}

/** 从已解析的 front-matter 行里取 `title:`。 */
export function titleFromMeta(meta: string[]): string | undefined {
  for (const line of meta) {
    const m = /^title:\s*(.+)$/.exec(line);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return undefined;
}

/** 把一行渲染成 YAML 安全的标量。 */
export function yamlScalar(value: string): string {
  const needsQuote =
    /[:#{}[\]&*!|>'"%@`,]/.test(value) || /^\s|\s$/.test(value);
  return needsQuote
    ? `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
    : value;
}

/**
 * 重建 front-matter：`title` 置顶，其余原键保留（去掉原 title，避免重复）。
 *
 * `title` 是 Fumadocs 16 的**必填**字段，而两仓大量文档把标题写在正文 H1 里，
 * 所以调用方必须保证 `title` 已解析出（H1 → 文件名兜底）。
 */
export function buildFrontMatter(meta: string[], title: string): string {
  const kept = meta.filter((line) => !/^title:/.test(line));
  return ["---", `title: ${yamlScalar(title)}`, ...kept, "---"].join("\n");
}
