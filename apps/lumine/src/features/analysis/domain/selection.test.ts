import { describe, expect, it } from 'vitest';

import { carrySelectionAcrossSourceChange } from './selection';

/**
 * 换源时的选择迁移。
 *
 * 核心事实：两个知识源的 id 空间无关。`DB00176` 只对 DrugBank 有意义，
 * 拿它去中文源查会 404 或查到别的药。而按 ADR-0008，本项目不做 CN↔DrugBank
 * 映射，所以**没有**「把 id 翻译过去」这个选项。
 */
describe('换源时的选择迁移', () => {
  const drugbank = { id: 'DB00176', source: 'drugbank' as const };

  it('未选中时换源仍是未选中', () => {
    expect(carrySelectionAcrossSourceChange(null, 'cn')).toBeNull();
  });

  it('换到另一个源时清空选择（id 不可移植）', () => {
    expect(carrySelectionAcrossSourceChange(drugbank, 'cn')).toBeNull();
  });

  it('换到同一个源时保留选择', () => {
    // 否则用户点一下当前源就会丢掉正在看的药。
    expect(carrySelectionAcrossSourceChange(drugbank, 'drugbank')).toEqual(drugbank);
  });

  it('中文源的选择换到 drugbank 同样清空', () => {
    const cn = { id: '12345', source: 'cn' as const };
    expect(carrySelectionAcrossSourceChange(cn, 'drugbank')).toBeNull();
  });
});
