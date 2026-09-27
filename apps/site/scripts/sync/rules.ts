/**
 * 路径映射规则表。
 *
 * 这是整个同步流程里**变更频率最高**的部分：仓库结构调整、新增文档目录、
 * 某篇文档改名，都会动这里。单独成模块就是为了让这类改动不必通读转义/遍历逻辑。
 *
 * 依据 `plans/2026-09-28-docs-site-rollout-plan.md` §四 的映射表。
 */
import { join } from "node:path";

import type { SyncContext } from "./context.ts";

/** 一条同步规则：从 `from` 取文件，按 `to` 前缀落到 content/docs 下。 */
export interface Rule {
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

/** 单篇但需要重命名的文档。 */
export interface SingleRename {
  from: string;
  to: string;
  label: string;
}

/** 只收 .md；两仓文档里没有 .mdx。 */
const isMarkdown = (name: string): boolean => name.endsWith(".md");

export function buildRules(ctx: SyncContext): Rule[] {
  const LUMINOUS = ctx.luminousRoot;
  const LUCENT = ctx.lucentRoot;

  return [
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
}

export function buildSingleRenames(ctx: SyncContext): SingleRename[] {
  return [
    {
      from: join(ctx.luminousRoot, "docs", "TODO.md"),
      to: "luminous/todo.md",
      label: "Luminous TODO",
    },
    {
      from: join(ctx.lucentRoot, "docs", "TODO.md"),
      to: "lucent/todo.md",
      label: "Lucent TODO",
    },
  ];
}
