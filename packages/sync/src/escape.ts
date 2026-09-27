/**
 * MDX 正文转义。
 *
 * 两仓文档是 GitHub 风格 Markdown，正文里裸写的 `<` 与 `{` 在 MDX 里会被当作
 * JSX 标签 / 表达式起始，导致整篇编译失败。常见来源：
 *   - 泛型：`Map<string, Foo>`、`Array<T>`
 *   - 裸 HTML：`<br>`、`<details>`
 *   - 占位符：`{code}`、`{userId}`
 *   - 行内代码里的 JSON：`` `{"a": 1}` `` ← 行内代码在 MDX 里仍是表达式上下文
 *
 * 处理方式：`<` `{` `}` 实体化。**代码围栏（``` 块）整体跳过**——那里是纯文本。
 */
export function escapeMdx(body: string): { text: string; escapes: number } {
  const out: string[] = [];
  let inFence = false;
  let escapes = 0;

  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    out.push(
      line
        .replace(/</g, () => {
          escapes++;
          return "&lt;";
        })
        .replace(/\{/g, () => {
          escapes++;
          return "&#123;";
        })
        .replace(/\}/g, () => {
          escapes++;
          return "&#125;";
        }),
    );
  }

  return { text: out.join("\n"), escapes };
}
