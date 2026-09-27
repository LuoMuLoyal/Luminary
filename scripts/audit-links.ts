/**
 * 断链普查（只读，不改任何东西）。
 *
 * 目的：量化"两仓文档的链接搬进站点后有多少会 404"，为"是否值得处理"提供依据。
 *
 * 运行：node scripts/audit-links.ts
 *
 * 判定口径：把每个链接按**站点内文件**解析（相对当前文档目录），
 * 解析不到就算断链。注意三类特殊情况：
 *   1. 源码路径（如 `../src/**`）—— 源码不在站点里，必然解析不到，属预期
 *   2. 目录链接（如 `../adr/`）—— 站点里对应目录有 index 则可达
 *   3. 站内绝对路径（`/luminous/docs/**`）—— 按站点路由解析
 */
import { existsSync, statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const CONTENT = join(repoRoot, "content", "docs");

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (/\.mdx?$/.test(e.name)) out.push(full);
  }
  return out;
}

/** 去掉代码块与行内代码，避免把示例里的链接算进来。 */
function stripCode(src: string): string {
  return src.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

function extractLinks(src: string): string[] {
  const out: string[] = [];
  const re = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const t = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(t)) continue;
    out.push(t);
  }
  return out;
}

/** 站点内是否存在该路径（含 .mdx/.md/index 变体）。 */
function siteHas(p: string): boolean {
  if (existsSync(p)) {
    try {
      if (statSync(p).isDirectory()) {
        return existsSync(join(p, "index.mdx")) || existsSync(join(p, "index.md"));
      }
    } catch {
      /* ignore */
    }
    return true;
  }
  return [p + ".mdx", p + ".md", join(p, "index.mdx"), join(p, "index.md")].some((c) =>
    existsSync(c),
  );
}

/** 源码/构建产物路径——站点里本来就不该有，不算"断链缺陷"。 */
const SOURCE_LIKE = /^(\.\.\/)*(src|scripts|prisma|test|tests|generated|tool|lib|backend)\//;

const files = await walk(CONTENT);

interface Row {
  file: string;
  target: string;
  isSource: boolean;
}
const all: Row[] = [];

for (const file of files) {
  const src = stripCode(await readFile(file, "utf8"));
  for (const target of extractLinks(src)) {
    const clean = target.split("#")[0].split("?")[0];
    if (!clean) continue;
    all.push({ file: relative(CONTENT, file), target: clean, isSource: SOURCE_LIKE.test(clean) });
  }
}

// 分类判定
const brokenInside: Row[] = []; // 指向站点内容但解析不到 —— 真正的断链
const brokenSource: Row[] = []; // 指向源码 —— 预期内，站点不提供

for (const row of all) {
  const abs = row.file;
  const base = join(CONTENT, dirname(abs));
  let resolved: string;
  if (row.target.startsWith("/")) {
    resolved = join(CONTENT, row.target.replace(/^\/+/, "").replace(/^luminous\/docs\/?/, ""));
  } else {
    resolved = resolve(base, row.target);
  }

  if (siteHas(resolved)) continue;
  // 站内绝对路径指向 /compodoc/（public 下，非 content）
  if (row.target.startsWith("/compodoc")) continue;

  if (row.isSource) brokenSource.push(row);
  else brokenInside.push(row);
}

console.log(`扫描 ${files.length} 篇文档，共 ${all.length} 个内链（已排除外链与纯锚点）\n`);

console.log(`A. 指向源码/构建产物，站点本就不提供：${brokenSource.length} 个`);
for (const s of brokenSource.slice(0, 5)) console.log(`     ${s.file} → ${s.target}`);

console.log(`\nB. 指向站点内容但解析不到（真正的断链）：${brokenInside.length} 个，` +
  `涉及 ${new Set(brokenInside.map((b) => b.file)).size} 篇文档`);

// 按归并形态看是否可控
const pat = new Map<string, number>();
const ex = new Map<string, string[]>();
for (const b of brokenInside) {
  const t = b.target;
  let k: string;
  if (/^[A-Za-z0-9_-]+\.md$/.test(t)) k = "同目录文件名（如 README.md / architecture.md）";
  else if (/^\.\.\/[a-z0-9-]+\/[A-Za-z0-9_-]+\.md$/.test(t)) k = "../<目录>/文件.md（ADR 引用为主）";
  else if (/^\.\.\/\.\.\//.test(t)) k = "../../ 跨层相对路径";
  else if (/^adr\//.test(t)) k = "adr/...（缺 ../reference/ 前缀）";
  else if (t.startsWith("/")) k = "站内绝对路径";
  else k = "其他";
  pat.set(k, (pat.get(k) ?? 0) + 1);
  const a = ex.get(k) ?? [];
  if (a.length < 3) a.push(`${b.file} → ${t}`);
  ex.set(k, a);
}

console.log("\n   断链形态：");
for (const [k, v] of [...pat.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`     ${String(v).padStart(4)}  ${k}`);
  for (const s of ex.get(k) ?? []) console.log(`             ${s}`);
}
