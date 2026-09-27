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
  paths: {
    personal: '/',
    product: '/luminous',
    docs: '/luminous/docs',
  },
  github: 'https://github.com/LuoMuLoyal/Luminous',
  releases: 'https://github.com/LuoMuLoyal/Luminous/releases',
} as const
