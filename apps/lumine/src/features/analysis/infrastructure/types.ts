import type { components } from '@/generated/lucent-api';

/**
 * 分析页用到的契约类型别名（基础设施层）。
 *
 * ## 为什么这一层存在
 *
 * 领域层（`domain/`）不 import 生成契约：契约是外层产物，领域依赖它就把
 * 「后端改字段」变成了「领域变更」。契约只在这一层出现，向上以领域类型暴露。
 *
 * ## 为什么只做别名、不写字段
 *
 * 字段是后端契约的一部分。在这里重抄一遍等于维护第二份定义：后端改字段时
 * 这里不会报错，只是静默变旧。
 */

/** 药品详情（`GET /api/v1/medicines/{id}`）。 */
export type MedicineDetail = components['schemas']['MedicineDetailResponse'];

/**
 * 详情里 DrugBank 分支的字段集。
 *
 * `detail` 是 `kind` 判别联合（`drugbank` / `cnProduct`），两边的字段集完全不同。
 * 用 `Extract` 取其中一个分支而不是把两边并起来，是为了让「只有 DrugBank 才有的
 * 字段」在中文源下**在类型上就取不到**——两源字段名有重合但语义不同，混用会静默出错。
 */
export type DrugbankDetail = Extract<MedicineDetail['detail'], { kind: 'drugbank' }>;

/** 搜索结果条目。 */
export type MedicineSearchItem = components['schemas']['MedicineSearchResponseItems'];

/** 搜索结果响应（`items` + `pagination`，直接用契约的形状）。 */
export type MedicineSearchResponse = components['schemas']['MedicineSearchResponse'];

/**
 * 知识源。
 *
 * 契约里 `source` 是 `string`（服务端按白名单校验），这里收窄成联合类型：
 * 界面上只有这两个源可选，写错在编译期暴露。
 *
 * 注意这**不是**「手写第二份契约」——它是把 `string` 收窄成子集，方向是安全的
 * （联合类型永远能赋给 `string`）。反过来把服务端的联合类型放宽成 `string` 才是错的。
 */
export type MedicineSource = 'drugbank' | 'cn';

/** 可选知识源，供界面遍历渲染。 */
export const MEDICINE_SOURCES: readonly MedicineSource[] = ['drugbank', 'cn'];
