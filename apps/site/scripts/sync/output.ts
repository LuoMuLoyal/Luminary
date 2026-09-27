/**
 * 同步结果的控制台输出。
 *
 * 与 `run.ts` 分开：编排决定"做什么"，这里只决定"怎么说"。
 * 输出格式是**人类核对用的**（也用于验收时逐字比对），改动它不该影响同步行为。
 */
import type { Report } from "./report.ts";

export function printReport(report: Report): void {
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
}
