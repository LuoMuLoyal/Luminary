import { expectData, lucent } from '@/lib/api-client';
import type { operations } from '@/generated/lucent-api';

/**
 * 分析页对 Lucent 的唯一调用入口（基础设施层）。
 *
 * ## 为什么这里几乎没有类型声明
 *
 * 契约的唯一事实源是 Lucent 的 `openapi.json`，它已经导出了 `operations`：
 * 每个端点的**请求参数与响应体**都在里面。所以这一层只做「取参数 → 调用 → 抛错」，
 * 所有类型用 `operations[...]` 派生，**不重写一遍**。
 *
 * 重写会带来两类静默漂移，都是我在这一版里先写错、再改掉的：
 *
 * 1. **自造响应类型**：我原本写了 `interface MedicineSearchResult { items; total }`，
 *    而契约给的是 `MedicineSearchResponse { items; pagination }`。多包一层后，
 *    后端往 `pagination` 加字段（例如 `hasMore`）这里拿不到，也不报错。
 * 2. **抄服务端默认值**：我原本写 `page: params.page ?? 1`。默认值由服务端的 zod
 *    schema 定义（`medicineSearchQuerySchema` 的 `.default(1)`），抄到客户端就是
 *    第二份定义——服务端改成 0 起或改 pageSize 上限时，这里不会报错。
 *
 * `params: { query, path }` 这个**外层形状不是手写的**：它是 `openapi-fetch` 的
 * `ParamsOption` 类型要求的调用约定，字段本身由契约校验。
 */

/** `GET /api/v1/medicines` 的查询参数（从契约派生，不重写）。 */
export type MedicineSearchQuery = NonNullable<operations['search']['parameters']['query']>;

/** `GET /api/v1/medicines/{id}` 的路径参数。 */
export type MedicineDetailPath = operations['getDetail']['parameters']['path'];

/** `GET /api/v1/medicines/{id}` 的查询参数。 */
export type MedicineDetailQuery = NonNullable<operations['getDetail']['parameters']['query']>;

/**
 * 搜索药品。
 *
 * 直接透传契约的查询参数：`q` / `source` / `page` / `pageSize` 都是可选的，
 * 缺省行为由服务端决定。调用方只需给它在意的字段。
 *
 * 返回契约的 `MedicineSearchResponse`（`items` + `pagination`），不做二次包装。
 */
export async function searchMedicines(query: MedicineSearchQuery) {
  return expectData(await lucent.GET('/api/v1/medicines', { params: { query } }));
}

/**
 * 取药品详情。
 *
 * `source` 必须与列表结果一致：同一个 `id` 在两个源下是不同的实体。
 * 路径参数与查询参数都来自契约，所以 `id` 拼错、`source` 漏传都是类型错误。
 */
export async function getMedicineDetail(path: MedicineDetailPath, query: MedicineDetailQuery) {
  return expectData(await lucent.GET('/api/v1/medicines/{id}', { params: { path, query } }));
}
