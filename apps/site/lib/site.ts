/**
 * 站点级常量——单一来源，不要在页面里散落硬编码。
 *
 * `softwareName` / `version` 是软著申请表、源程序页眉、说明书页眉三处必须**逐字一致**的两项
 * （最高频的补正原因，见规划 §7）。等 §9 待定项确认后只改这里。
 */
export const site = {
  /** 本站项目名（注意与产品名 Luminous 区分，别写裸名） */
  project: 'Luminary',
  /** 产品名 */
  product: 'Luminous',
  /** 软著用的软件全称——待定，见规划 §9 */
  softwareName: 'TODO（待定：软著软件全称）',
  /** 版本号——待定，见规划 §9 */
  version: '0.1.0',
  /** 单一域名 + 路径式；静态导出后由 OSS/COS + CDN 直出 */
  domain: 'devluo.com',
  /**
   * 路径常量（**裸路径**，不含 `basePath` 前缀）。
   *
   * 与 `source.ts` 的 `baseUrl` 同一约定：前缀由 Next 的 `basePath` 统一注入，
   * 代码里再写一遍就是双重前缀（`/luminous/luminous/...`）。
   *
   * ⚠️ 这些值**只适用于会被 Next 注入前缀的场合**（`<Link href>` 等）。
   * 需要绝对 URL（canonical / og:url / JSON-LD）时用下面的 `siteUrl()`，
   * 它才会把域名和前缀都拼上。
   */
  paths: {
    personal: '/',
    product: '/',
    docs: '/docs',
  },
  github: 'https://github.com/LuoMuLoyal/Luminous',
  releases: 'https://github.com/LuoMuLoyal/Luminous/releases',
} as const

/**
 * 站点的**部署前缀**。
 *
 * 与 `next.config.mjs` 的 `basePath` 必须一致——那里默认 `/luminous`。
 * 本地开发时为 `''`（页面在 `localhost:3000` 根路径）。
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/luminous'

/**
 * 拼一个**完整公开 URL**，用于 canonical / og:url / JSON-LD 这类
 * **不会被 Next 注入前缀**的绝对地址。
 *
 * 为什么需要它：`site.paths` 是裸路径，直接拼 `https://${domain}${path}`
 * 会得到 `https://devluo.com/docs`——**漏了 `/luminous`**，与线上实际地址不符。
 * 元数据里的错误 URL 不会报错，只会让搜索引擎收录到不存在的地址。
 *
 * @param path 裸路径，如 `/docs` 或 `site.paths.docs`
 */
export function siteUrl(path = '/'): string {
  const prefix = basePath.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `https://${site.domain}${prefix}${suffix}`
}
