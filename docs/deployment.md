# 部署说明（对象存储 + CDN）

本仓库三个 app 都是**静态导出**（`output: 'export'`）。本文件说明产物怎么分发。

## 站点拓扑

```
devluo.com/                  → personal（个人网站，占根路径）
devluo.com/luminous/         → site（官网）
devluo.com/luminous/docs/    → site（文档站）
```

桌面端（`apps/desktop`）**不占 HTTP 路由**：产物被 Tauri 内嵌进安装包，
用户装的是应用，不通过浏览器访问。

## 为什么 `site` 要挂在 `/luminous` 前缀下

`site` 与 `personal` 同域共存，**两者都会产出 `/_next/`**。若不区分前缀，
`site` 的 HTML 里写的绝对路径 `/_next/...` 会去**根路径**取，而根路径归 `personal`。

因此 `apps/site/next.config.mjs` 设了 `basePath: '/luminous'`。

## 配置选型：为什么是 `basePath` 而不是 `assetPrefix`

官方文档对两者的分工很明确：

| 配置 | 用途 | 适用本场景 |
|---|---|---|
| `assetPrefix` | 把静态资源指向 **CDN 域名** | ✗ |
| `basePath` | 把应用部署在域名的**子路径**下 | ✓ |

`assetPrefix` 文档里有一句直接针对本场景的警告：

> Next.js 9.5+ added support for a customizable Base Path, which is better suited for
> hosting your application on a sub-path like `/docs`. **We do not suggest you use a
> custom Asset Prefix for this use case.**

关键差别在**产物布局**（实测，非推断）：

| 配置 | HTML 里的资源路径 | 磁盘上实际位置 | 结果 |
|---|---|---|---|
| `assetPrefix: '/luminous'` | `/luminous/_next/...` | `out/_next/...` | ✗ 对不上，CDN 上 404 |
| `basePath: '/luminous'` | `/luminous/_next/...` | `out/_next/...` | 需在上传时重映射（见下） |

`assetPrefix` 的语义是「资源在别处（CDN 域名）」，物理文件仍在 `/_next/`，
靠 CDN 回源规则映射；静态导出没有服务端做这层映射。

`basePath` 还顺带解决**页面链接**：`<Link href="/docs">` 会被自动注入前缀
变成 `/luminous/docs`。若在代码里手写前缀，会产出 `/luminous/luminous/docs`。

⚠️ **`_next/` 的磁盘位置不因任何配置改变**，`out/_next/` 始终在根。
上传时必须手动重映射（见下方映射表）。

## 内部链接一律写裸路径（双重前缀的唯一成因）

`basePath` 会在渲染时给**所有**内部链接注入前缀——包括 fumadocs 生成的和
markdown 里手写的。所以这些地方**一律写裸路径**，写了前缀就是双重前缀：

| 位置 | 写法 | 错法 |
|---|---|---|
| `lib/source.ts` 的 `baseUrl` | `/docs` | `/luminous/docs` |
| `lib/site.ts` 的 `paths` | `/docs` | `/luminous/docs` |
| markdown 正文链接 | `/docs/...` | `/luminous/docs/...` |
| `<Link href>` | `/docs` | `/luminous/docs` |

这个错误**只在线上/产物里暴露**，本地 `next dev`（同样走 basePath）看起来正常，
但产物里的 href 会是死链。实测该 bug 曾让单个页面 14 条链接中招。

需要**绝对 URL**（canonical / og:url / JSON-LD）时不能直接用裸路径——
那类地址不会被注入前缀，用 `lib/site.ts` 的 `siteUrl()` 拼。

校验办法（构建后跑，应输出 0）：

```powershell
Get-ChildItem out\luminous -Recurse -File -Filter *.html |
  Select-String -Pattern '/luminous/luminous/' -List
```

## 为什么需要 `trailingSlash: true`

静态导出默认（`trailingSlash: false`）产出 `luminous.html`，而 URL `/luminous`
在对象存储上**映射不到这个文件**——静态托管只把目录的 `index.html` 当默认页，
不会拿 `luminous.html` 当 `/luminous` 的索引。结果是线上 404，
而本地 `next dev` 有服务端做映射，**看不出来**。

官方文档：`trailingSlash: true` 配 `output: 'export'` 时，`/about` 产出
`/about/index.html` 而不是 `/about.html`。

代价：URL 会带尾斜杠并被重定向（`/luminous` → `/luminous/`）。

## 产物上传映射（关键）

`site` 的产物**不能整体原样上传**，需要三部分分别落位：

| 产物路径 | 上传到 CDN | 说明 |
|---|---|---|
| `apps/site/out/luminous/**` | `/luminous/**` | 页面，路径已天然对应 |
| `apps/site/out/_next/**` | `/luminous/_next/**` | **需重映射**：磁盘在根，引用带前缀 |
| `apps/site/out/api/**` | `/luminous/api/**` | 搜索索引 |
| `apps/site/out/{favicon.ico,*.svg}` | `/luminous/` | 站点根级静态资源 |
| `apps/personal/out/**` | `/**` | 占根路径，原样上传 |

`personal` 不需要任何映射，也不需要 `basePath`/`assetPrefix`——
它占根路径，在 multi-zones 语义里是**默认应用**，官方明确默认应用不需要这些配置。

## 对象存储必须配置的项

1. **默认首页 `index.html`**——否则所有目录 URL 404
2. **`Content-Type` 按扩展名判定**——这也是构建收尾要改名搜索索引的原因（见下）
3. **Brotli 开启**——实测压缩率约 10%（281 MB HTML → 约 28 MB）
4. **404 页指向 `404.html`**
5. **`/luminous` → `/luminous/` 的 301**（若想让无斜杠 URL 可用，可选）
6. **旧根路径的 301**：`devluo.com/` 原为官网首页，现归 personal。
   若有外部链接指向旧官网，需按需重定向到 `/luminous/`

## 搜索索引为什么被改名

`apps/site/app/api/search/route.ts` 用 fumadocs 的 `staticGET()` 在构建期导出索引。
静态导出把 Route Handler 写成**无扩展名**文件（`out/api/search`），
而对象存储按扩展名判定 `Content-Type`——无扩展名会被当作 `application/octet-stream`，
前端 `fetch().json()` 失败。

`packages/sync/src/finalize-export.ts` 在 `next build` 之后把它改名为
`api/search.json`，已串进 `apps/site` 的 `build` 脚本。

⚠️ 该脚本的 `RENAMES` 与 `apps/site/lib/search-config.ts` 的 `SEARCH_INDEX_URL`
**必须同步修改**。两侧不联动的话，失败发生在**运行时**
（搜索弹窗能开、输入无结果），不会有构建错误。

## 上传工具与对象存储操作

本仓库的产物分发**不能靠 rsync / 拖拽**：`out/` 的磁盘布局与线上 URL 布局不一致
（见上方映射表），必须先按映射表重排。已提供脚本：

```powershell
pwsh scripts/deploy/qiniu-upload.ps1 -App site -Bucket <空间名> -Domain <域名> -DryRun
```

它按映射表组装 → 上传前自检（缺 `luminous/_next` 或 `api/search.json` 直接中止）
→ 调 `qshell` 上传 → 按域名做 HTTP 校验。七牛控制台各配置项、费用额度、
凭据获取与排错表见 `scripts/deploy/README.md`。

## 本地验证产物

`next dev` 有服务端，会掩盖上述所有映射问题。要验证真实形态，
必须按映射表组装一份目录再起静态服务器：

```powershell
$sim = "$env:TEMP\luminary-sim"
New-Item -ItemType Directory -Force -Path $sim,"$sim\luminous" | Out-Null
Copy-Item apps\personal\out\* $sim -Recurse -Force
Copy-Item apps\site\out\luminous\* "$sim\luminous\" -Recurse -Force
Copy-Item apps\site\out\_next "$sim\luminous\_next" -Recurse -Force
Copy-Item apps\site\out\api "$sim\luminous\api" -Recurse -Force
Copy-Item apps\site\out\favicon.ico,apps\site\out\*.svg "$sim\luminous\" -Force
npx serve $sim
```

然后确认 `/`、`/luminous/`、`/luminous/docs/` 都是 200，
且 `/luminous/api/search.json` 的 `Content-Type` 是 `application/json`。

## 桌面端

`apps/desktop` 的产物同样来自 `next build`，但**不走 CDN**：
`tauri build` 会把它打进安装包（`frontendDist: "../out"`）。

桌面端的 `assetPrefix` 与 `site` 的那个**不是一回事**：
它只在非生产运行时生效（`isProd ? undefined : 'http://localhost:3002'`），
作用是让 dev server 的 HMR 资源走绝对地址。生产构建下为空，
产物走相对路径——这正是 Tauri 内嵌所需。

⚠️ **不要"为了统一"给桌面端加 `basePath`**：Tauri 从本地加载页面，
加前缀会让资源路径全部失效。
