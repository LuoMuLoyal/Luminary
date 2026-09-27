/**
 * 同步过程的计数与告警收集。
 *
 * 单独成模块的理由：`Report` 被写入端（frontmatter/walk）读取、被入口打印。
 * 拆开后若把它塞进任一业务模块，另一个模块就得反向依赖它，
 * 产生"转义逻辑依赖遍历逻辑"这种无意义的耦合。
 */
export interface EscapeSample {
  file: string;
  count: number;
}

export interface Report {
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

export function createReport(): Report {
  return {
    written: 0,
    skipped: 0,
    bySection: new Map(),
    warnings: [],
    escapingSamples: [],
    navCopied: 0,
    compodocCopied: 0,
  };
}
