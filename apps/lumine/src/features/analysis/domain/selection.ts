import type { MedicineSource } from '../infrastructure/types';

/**
 * 被选中的药品 —— 领域里的值对象。
 *
 * ## 为什么必须同时带 `source`
 *
 * 两个知识源的 `id` 空间无关：`DB00176` 只对 DrugBank 有意义，中文产品的 id
 * 是另一套编号。只带 `id` 会让「切换源」命中同一个选择，于是拿 DrugBank 的 id
 * 去中文源查，结果是 404 或更糟——查到另一个药。
 */
export interface MedicineSelection {
  readonly id: string;
  readonly source: MedicineSource;
}

/**
 * 切换知识源时的选择迁移。
 *
 * **id 不可跨源移植**，所以换源即清空选择，回到「未选中」状态。这不是偷懒：
 * 若保留 id，就必须回答「这个中文 id 在 DrugBank 里是哪个药」——而按
 * ADR-0008，本项目**不做** CN↔DrugBank 映射。
 *
 * 同源切换（重复点同一个源）保持选择不变，否则用户点一下当前源就丢掉了正在看的药。
 */
export function carrySelectionAcrossSourceChange(
  current: MedicineSelection | null,
  nextSource: MedicineSource
): MedicineSelection | null {
  if (current === null) {
    return null;
  }

  return current.source === nextSource ? current : null;
}
