/**
 * 两仓文档 → Luminary 内容目录同步。
 *
 * 依据 `plans/2026-09-28-docs-site-rollout-plan.md` §四 的映射表，把 `Luminous` 与
 * `Lucent` 的 docs/ 与 plans/ **全量**搬进 `content/docs/{luminous,lucent}/`。
 *
 * 运行：`pnpm sync:docs`（Node 24 原生类型剥离，无需 tsx/ts-node）
 *
 * 三条硬约束（来自 Fumadocs 16 的实际行为，不是风格偏好）：
 *
 * 1. `pageSchema.title` 是**必填**非可选字段。两仓大量文档只有 `status/owner/updated`
 *    这类 front-matter，标题写在正文 H1 里，必须提取并补进去，否则构建期 schema 校验失败。
 *
 * 2. 正文里的 MDX 语法地雷。两仓文档是给 GitHub / 编辑器看的手写 Markdown，会出现
 *    裸 `<`（泛型 `Map<string>`、`<br>`）与 `{`（占位符、JSON 片段）。这些在 MDX 里是
 *    JSX / 表达式语法，会把整篇解析崩掉。搬进来前必须实体化。只处理正文，
 *    front-matter 与代码围栏内不动。
 *
 * 3. `_naming-lookup.json` 必须跳过（`Lucent/plans/` 下），否则会被当 MDX 解析。
 *
 * 同步产物**不进 git**（规划 §六.3），可反复运行：每次先整体清空目标目录再写，
 * 保证源文件删除后站点不残留。
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 路径推导——**不要用 `resolve(here, "../../..")` 这种数层级的写法**。
 *
 * monorepo 改造把这个文件从仓库根挪到了 `apps/site/scripts/`，
 * 原先的 `resolve(here, "..")` 立刻指到了 `apps/site`，而它当仓库根用。
 * 数层级的问题是：**层级一改，错误是静默的**——它不会报错，只会去错目录找内容，
 * 表现为"同步成功但内容为空"或门禁说分区不存在。
 *
 * 因此改成**按标记文件向上找**：
 *   - `appRoot`  = 最近的含 `next.config.mjs` 的祖先目录（即 app 自己）
 *   - `repoRoot` = 最近的含 `pnpm-workspace.yaml` 的祖先目录（即 monorepo 根）
 *
 * 这样既支持 `apps/site/scripts/`（当前形态），也支持脚本日后迁到
 * `packages/sync/` 的情形——不需要再改这里。
 */
function findUp(start: string, marker: string): string {
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

const here = dirname(fileURLToPath(import.meta.url));
/** monorepo 根（含 pnpm-workspace.yaml）——同级仓库 Luminous / Lucent 在这里。 */
const repoRoot = findUp(here, "pnpm-workspace.yaml");
/** 本站 app 根（含 next.config.mjs）——content/ 与 public/ 在这里。 */
const appRoot = findUp(here, "next.config.mjs");
/** 同级仓库所在目录：monorepo 的上一级。 */
const workspaceRoot = resolve(repoRoot, "..");

const LUMINOUS = join(workspaceRoot, "Luminous");
const LUCENT = join(workspaceRoot, "Lucent");
const CONTENT = join(appRoot, "content", "docs");

/** 一条同步规则：从 `from` 取文件，按 `to` 前缀落到 content/docs 下。 */
interface Rule {
  /** 源目录绝对路径 */
  from: string;
  /** 目标目录，相对 content/docs（如 `luminous/reference`） */
  to: string;
  /** 只保留匹配的文件名 */
  filter?: (name: string) => boolean;
  /** 该源目录是「每子目录一篇 README.md」形态，按子目录名命名 */
  nested?: boolean;
  /**
   * 只取该目录下的顶层文件，**不递归子目录**。
   *
   * `docs/reference/` 与 `docs/archive/` 都含子目录，且 `reference/adr/` 有自己独立的
   * 规则。若这里递归，ADR 会同时落到 `reference/adr/` 与 `adr/` 两处（双份）。
   * 因此凡是「子目录另有规则」或「子目录结构由 archive 那样整体保留」的，
   * 都要显式声明自己的粒度。
   */
  flat?: boolean;
  /** 说明，用于日志 */
  label: string;
}

/** 只收 .md；两仓文档里没有 .mdx。 */
const isMarkdown = (name: string): boolean => name.endsWith(".md");

const rules: Rule[] = [
  // ---------- Luminous ----------
  // reference 顶层是平铺的稳定文档；其 adr/ 与 generated/ 子目录各有独立规则
  {
    label: "Luminous reference",
    from: join(LUMINOUS, "docs", "reference"),
    to: "luminous/reference",
    filter: isMarkdown,
    flat: true,
  },
  {
    label: "Luminous adr",
    from: join(LUMINOUS, "docs", "reference", "adr"),
    to: "luminous/adr",
    filter: isMarkdown,
    flat: true,
  },
  {
    label: "Luminous generated",
    from: join(LUMINOUS, "docs", "reference", "generated"),
    to: "luminous/generated",
    filter: isMarkdown,
    flat: true,
  },
  {
    label: "Luminous product",
    from: join(LUMINOUS, "docs", "product"),
    to: "luminous/product",
    filter: isMarkdown,
  },
  {
    label: "Luminous explanation",
    from: join(LUMINOUS, "docs", "explanation"),
    to: "luminous/explanation",
    filter: isMarkdown,
  },
  {
    label: "Luminous howto",
    from: join(LUMINOUS, "docs", "howto"),
    to: "luminous/howto",
    filter: isMarkdown,
  },
  {
    label: "Luminous features",
    from: join(LUMINOUS, "lib", "features"),
    to: "luminous/features",
    nested: true,
  },
  {
    label: "Luminous archive",
    from: join(LUMINOUS, "docs", "archive"),
    to: "luminous/archive",
    filter: isMarkdown,
  },
  {
    label: "Luminous logs",
    from: join(LUMINOUS, "docs", "logs"),
    to: "luminous/logs",
    filter: isMarkdown,
  },
  {
    label: "Luminous plans",
    from: join(LUMINOUS, "plans"),
    to: "luminous/plans",
    filter: isMarkdown,
    flat: true,
  },

  // ---------- Lucent ----------
  // docs/reference 顶层的 README.md 是索引，与 lucent/adr/README.md 作用不同，
  // 单独保留会与目录 index 约定打架；索引价值由站点自身的导航承担，这里排除。
  {
    label: "Lucent reference",
    from: join(LUCENT, "docs", "reference"),
    to: "lucent/reference",
    filter: (n) => isMarkdown(n) && n !== "README.md",
    flat: true,
  },
  {
    label: "Lucent adr",
    from: join(LUCENT, "docs", "reference", "adr"),
    to: "lucent/adr",
    filter: isMarkdown,
    flat: true,
  },
  {
    label: "Lucent explanation",
    from: join(LUCENT, "docs", "explanation"),
    to: "lucent/explanation",
    filter: isMarkdown,
  },
  {
    label: "Lucent howto",
    from: join(LUCENT, "docs", "howto"),
    to: "lucent/howto",
    filter: isMarkdown,
  },
  {
    label: "Lucent modules",
    from: join(LUCENT, "src", "modules"),
    to: "lucent/modules",
    nested: true,
  },
  {
    label: "Lucent archive",
    from: join(LUCENT, "docs", "archive"),
    to: "lucent/archive",
    filter: isMarkdown,
  },
  {
    label: "Lucent logs",
    from: join(LUCENT, "docs", "logs"),
    to: "lucent/logs",
    filter: isMarkdown,
  },
  {
    label: "Lucent plans",
    from: join(LUCENT, "plans"),
    to: "lucent/plans",
    filter: isMarkdown,
    flat: true,
  },
];

/** 单篇但需要重命名的文档。 */
const singleRenames: { from: string; to: string; label: string }[] = [
  {
    from: join(LUMINOUS, "docs", "TODO.md"),
    to: "luminous/todo.md",
    label: "Luminous TODO",
  },
  {
    from: join(LUCENT, "docs", "TODO.md"),
    to: "lucent/todo.md",
    label: "Lucent TODO",
  },
];

interface EscapeSample {
  file: string;
  count: number;
}

interface Report {
  written: number;
  skipped: number;
  bySection: Map<string, number>;
  warnings: string[];
  escapingSamples: EscapeSample[];
  /** 从 content/nav/ 复制过去的导航文件数（index.mdx / meta.json）。 */
  navCopied: number;
  /** 从 Lucent compodoc 拷到 public/compodoc 的文件数。 */
  compodocCopied: number;
}

/**
 * YAML front-matter 解析：只处理两仓实际使用的平铺 `key: value` 形态，
 * 不引入完整 YAML 依赖——这里多解析一行都算过度设计。
 */
function splitFrontMatter(raw: string): { meta: string[]; body: string } {
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
function extractH1(body: string): string | undefined {
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

interface BodyContext {
  file: string;
  fallbackTitle: string;
}

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
 * 处理方式：`<` `{` `}` 实体化。代码围栏（``` 块）整体跳过——那里是纯文本。
 */
function escapeMdx(body: string): { text: string; escapes: number } {
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

/** 把一行渲染成 YAML 安全的标量。 */
function yamlScalar(value: string): string {
  const needsQuote =
    /[:#{}[\]&*!|>'"%@`,]/.test(value) || /^\s|\s$/.test(value);
  return needsQuote
    ? `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
    : value;
}

/** 组装输出文件：保留原 front-matter、补齐 `title`、转义正文。 */
function buildPage(raw: string, ctx: BodyContext, report: Report): string {
  const { meta, body } = splitFrontMatter(raw);

  let title: string | undefined;
  for (const line of meta) {
    const m = /^title:\s*(.+)$/.exec(line);
    if (m) {
      title = m[1].trim().replace(/^["']|["']$/g, "");
      break;
    }
  }

  if (!title) {
    const h1 = extractH1(body);
    title = h1 ?? ctx.fallbackTitle;
    if (!h1)
      report.warnings.push(`无 title 也无 H1，回退到文件名：${ctx.file}`);
  }

  const { text, escapes } = escapeMdx(body);
  if (escapes > 0)
    report.escapingSamples.push({ file: ctx.file, count: escapes });

  // 重建 front-matter：title 置顶，其余原键保留（去重原 title）
  const kept = meta.filter((line) => !/^title:/.test(line));
  const front = ["---", `title: ${yamlScalar(title)}`, ...kept, "---"].join(
    "\n",
  );

  return `${front}\n\n${text}\n`;
}

async function walk(dir: string, recurse: boolean): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recurse) files.push(...(await walk(full, true)));
    } else if (entry.isFile()) files.push(full);
  }
  return files;
}

async function sync(): Promise<Report> {
  if (!existsSync(LUMINOUS) || !existsSync(LUCENT)) {
    throw new Error(
      `找不到两仓工作区：\n  Luminous: ${LUMINOUS}\n  Lucent:   ${LUCENT}`,
    );
  }

  const report: Report = {
    written: 0,
    skipped: 0,
    bySection: new Map(),
    warnings: [],
    escapingSamples: [],
    navCopied: 0,
    compodocCopied: 0,
  };

  // 整体清空再写：源文件被删除后站点不残留
  for (const dir of ["luminous", "lucent"]) {
    await rm(join(CONTENT, dir), { recursive: true, force: true });
  }

  const writePage = async (
    raw: string,
    destRel: string,
    sourcePath: string,
    section: string,
  ): Promise<void> => {
    const dest = join(CONTENT, destRel);
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

  for (const rule of rules) {
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

  for (const item of singleRenames) {
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

  // 手写导航（分区首页 index.mdx + 各级 meta.json）在 content/nav/ 下维护，
  // 同步最后覆盖到 content/docs/。放在这里是因为上面刚把目标目录整个清空了——
  // 若把它们直接写在 content/docs/ 里，每次同步都会被 rm 掉。
  report.navCopied = await copyNav();

  // 自检：复制出来的路径必须都在 .gitignore 里，否则新增导航分区会静默留下未跟踪文件。
  await assertCopiesIgnored();

  // compodoc 产物（Lucent 的 API 文档站）整体拷到 public/ 下作外链入口。
  report.compodocCopied = await copyCompodoc();

  return report;
}

/**
 * 把 `Lucent/docs/reference/generated/compodoc/` 整目录拷到 `public/compodoc/`。
 *
 * 767 个 HTML，是本站体积的大头之一（见规划 Phase 5 的体积说明）。
 * 用整目录拷贝而不是逐篇同步：compodoc 产物内部互相链接，
 * 改写路径反而会破坏它自己的导航。
 */
async function copyCompodoc(): Promise<number> {
  const from = join(LUCENT, "docs", "reference", "generated", "compodoc");
  const to = join(appRoot, "public", "compodoc");

  await rm(to, { recursive: true, force: true });
  if (!existsSync(from)) return 0;

  const files = await walk(from, true);
  for (const file of files) {
    const rel = relative(from, file);
    const dest = join(to, rel);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, await readFile(file));
  }
  return files.length;
}

/**
 * 把 content/nav/** 原样复制到 content/docs/**，返回复制文件数。
 *
 * ⚠️ `content/docs/` 下的副本必须在 `.gitignore` 里逐条忽略（与 `luminous/`、`lucent/`
 * 一样），否则它们会以「未跟踪文件」的形态出现在 `git status` 里，看起来像残留。
 * 这里递归遍历整个 `content/nav/`，所以**新增任何导航分区都会自动产生新的副本路径**。
 * 为此下面调用 `assertCopiesIgnored()` 做一次自检：漏了规则就明确报错，
 * 而不是让人对着 `git status` 猜。
 */
async function copyNav(): Promise<number> {
  const navRoot = join(appRoot, "content", "nav");
  if (!existsSync(navRoot)) return 0;

  let count = 0;
  for (const file of await walk(navRoot, true)) {
    const rel = relative(navRoot, file);
    const dest = join(CONTENT, rel);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, await readFile(file), "utf8");
    count++;
  }
  return count;
}

/**
 * 校验 content/nav/ 复制出的每个目标路径都被 git 忽略。
 *
 * 用 `git check-ignore` 判定——直接问 git 本身，而不是自己解析 `.gitignore`
 * （后者要处理取反、嵌套、锚定等一堆规则，容易写错）。
 *
 * 任何一条没被忽略就抛错。这是**故意的硬失败**：宁可让同步看起来"失败"，
 * 也不要留下一个只有靠人肉眼才能发现的静默不一致。
 */
async function assertCopiesIgnored(): Promise<void> {
  const navRoot = join(appRoot, "content", "nav");
  if (!existsSync(navRoot) || !existsSync(join(repoRoot, ".git"))) return;

  // 报告路径要相对 **git 仓库根**（repoRoot），而不是 appRoot——
  // app 已移到 apps/site/，用户看到的报错应当是可以直接去 .gitignore 里找的路径。
  const copies = (await walk(navRoot, true)).map((file) =>
    relative(repoRoot, join(CONTENT, relative(navRoot, file))),
  );

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const run = promisify(execFile);

  const notIgnored: string[] = [];
  for (const rel of copies) {
    try {
      // check-ignore 对被忽略的路径返回 0，未忽略返回 1
      await run("git", ["check-ignore", "-q", rel], { cwd: repoRoot });
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

const report = await sync();

console.log("文档同步完成\n");
console.log(
  `写入 ${report.written} 篇，跳过 ${report.skipped} 篇，导航 ${report.navCopied} 个，compodoc ${report.compodocCopied} 个\n`,
);

const rows = Array.from(report.bySection.entries()).sort((a, b) =>
  a[0].localeCompare(b[0]),
);
const width = Math.max(...rows.map(([k]) => k.length), 12);
for (const [section, count] of rows) {
  console.log(`  ${section.padEnd(width)}  ${String(count).padStart(4)}`);
}

const totalEscapes = report.escapingSamples.reduce(
  (sum, s) => sum + s.count,
  0,
);
if (totalEscapes > 0) {
  console.log(
    `\nMDX 转义：${report.escapingSamples.length} 篇、共 ${totalEscapes} 处（< { } 实体化）`,
  );
}

if (report.warnings.length > 0) {
  console.log(`\n告警 ${report.warnings.length} 条：`);
  for (const w of report.warnings.slice(0, 20)) console.log(`  - ${w}`);
  if (report.warnings.length > 20)
    console.log(`  ...还有 ${report.warnings.length - 20} 条`);
}
