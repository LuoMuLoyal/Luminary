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
 * 去掉正文**开头**那个 H1（如果它就是页面标题）。
 *
 * ## 为什么必须去掉
 *
 * Fumadocs 把 front-matter 的 `title` 渲染成页面标题（`<DocsTitle>`），
 * 于是「front-matter 有 title」+「正文开头又一个 H1」= **页面上出现两个标题**。
 * 实测 436 篇文档里 412 篇中招——因为两仓的文档习惯把标题写成正文 H1，
 * 而同步器又按这个 H1 补了 `title`，两边叠加。
 *
 * ## 什么情况才去
 *
 * 只去**正文最前面**的那个 H1，且文本与 `title` 一致（忽略首尾空白）。
 * 这样：
 *   - 正文中间的 `#` 级标题不动（那是真的分节）
 *   - 开头 H1 与 title 不一致时不动（可能是刻意的副标题，留给人工判断）
 *
 * 「最前面」允许前面只有空行与 **HTML 注释**：Luminous 的 `generated/` 文档
 * 开头有一行 `<!-- AUTO-GENERATED ... -->` 横幅，H1 在其后。注释本身保留，
 * 只摘掉 H1。
 *
 * 跳过代码围栏，避免把代码块里的 `# 注释` 误当标题。
 */
export function stripLeadingH1(body: string, title: string): string {
  const lines = body.split("\n");
  let inFence = false;
  let seenContent = false;
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // HTML 注释区块（含单行形式）：跳过判定用，但**内容要保留**——
    // Luminous 的 generated/ 文档开头是 `<!-- AUTO-GENERATED ... -->` 横幅，
    // 它本身有信息量（提示不要手改），不能连注释一起删掉。
    if (inComment) {
      if (line.includes("-->")) inComment = false;
      continue;
    }
    if (!seenContent && line.trimStart().startsWith("<!--")) {
      if (!line.includes("-->")) inComment = true;
      continue;
    }

    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // 跳过开头空白行（尚未遇到实质内容）
    if (!seenContent && line.trim() === "") continue;

    if (!seenContent) {
      seenContent = true;
      const m = /^#\s+(.+?)\s*$/.exec(line);
      if (!m) return body; // 首个实质内容不是 H1 → 不动

      const h1 = m[1].replace(/`/g, "").trim();
      if (h1 !== title.trim()) return body; // 与 title 不一致 → 留给人工判断

      // 保留 H1 之前的前缀（空行与注释横幅），只摘掉 H1 本身
      const prefix = lines.slice(0, i);
      while (prefix.length > 0 && prefix[prefix.length - 1].trim() === "") prefix.pop();

      const rest = lines.slice(i + 1);
      while (rest.length > 0 && rest[0].trim() === "") rest.shift();

      return [...prefix, ...(prefix.length > 0 && rest.length > 0 ? [""] : []), ...rest].join("\n");
    }

    return body; // 已有实质内容却还没命中，说明首个内容不是 H1
  }

  return body;
}

/**
 * 重建 front-matter：`title` 置顶，其余原键保留（去掉原 title，避免重复）。
 *
 * `title` 是 Fumadocs 16 的**必填**字段，而两仓大量文档把标题写在正文 H1 里，
 * 所以调用方必须保证 `title` 已解析出（H1 → 文件名兜底）。
 *
 * ⚠️ 补完 `title` 之后，正文里那个同名 H1 必须由 `stripLeadingH1` 摘掉，
 * 否则页面上会出现两个标题（front-matter 一个、正文一个）。
 * 这两件事是配套的，别只做一半。
 */
export function buildFrontMatter(meta: string[], title: string): string {
  const kept = meta.filter((line) => !/^title:/.test(line));
  return ["---", `title: ${yamlScalar(title)}`, ...kept, "---"].join("\n");
}
