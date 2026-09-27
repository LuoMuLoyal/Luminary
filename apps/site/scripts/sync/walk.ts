/**
 * 目录遍历。
 *
 * 只做一件事：把目录下的**文件**列出来（可选递归）。
 * 不排序、不过滤扩展名——那些是调用方的判断，放在这里会让本模块承担策略。
 */
import { readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * 递归或仅顶层列出文件。
 *
 * 注意 `recurse=false` 时**只取顶层文件**，子目录整体跳过。
 * 这是 `flat` 规则需要的语义：`docs/reference/` 与 `docs/archive/` 都含子目录，
 * 而其中 `reference/adr/` 有自己的规则，递归会导致 ADR 落到两处（双份）。
 */
export async function walk(dir: string, recurse: boolean): Promise<string[]> {
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
