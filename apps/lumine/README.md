# Lumine

Lumine 药品知识工作台：Tauri 2 外壳 + TanStack Start（React）SPA。

基于 [Kiranism/tanstack-start-dashboard](https://github.com/Kiranism/tanstack-start-dashboard)
（MIT）搭建，保留其 dashboard 布局、路由、表单、表格、主题与演示数据。

## 技术栈

| 层       | 选型                                   |
| -------- | -------------------------------------- |
| 桌面外壳 | Tauri 2（Rust，`src-tauri/`）          |
| UI       | React 19 + TanStack Start / Router     |
| 构建     | Vite 8，TanStack Start SPA 模式        |
| 样式     | Tailwind CSS v4 + shadcn/ui（Base UI） |
| 数据     | TanStack Query；本地演示数据           |
| 质量     | TypeScript、OxLint、Oxfmt              |

## 开发与构建

在仓库根执行：

```bash
pnpm install
pnpm --filter @luminary/lumine dev          # 只起前端，http://localhost:1420
pnpm --filter @luminary/lumine build        # 产出 dist/client/
pnpm --filter @luminary/lumine tauri:dev    # 前端 + 桌面窗口
pnpm --filter @luminary/lumine tauri:build  # 打包安装包
```

`tauri dev` / `tauri build` 会通过 `beforeDevCommand` / `beforeBuildCommand`
自动调用 `pnpm dev` / `pnpm build`，不需要先手动构建前端。

## 构建产物

- `vite build` 启用 `spa.enabled`，先预渲染 SPA shell，再输出到 `dist/client/`。
- `dist/client/index.html` 是入口，`dist/client/assets/` 是 JS/CSS/字体。
- `src-tauri/tauri.conf.json` 的 `frontendDist` 指向 `../dist/client`。
- 不引入 Nitro 或 Node 服务端；Tauri 直接加载本地静态文件。

需要后端能力（认证、请求中转、系统集成）时写在 `src-tauri/` 的 Rust 层，
不要恢复 `createServerFn` 或 Nitro server。

## 目录

```text
src/
├── routes/        # TanStack Router 文件路由；routeTree.gen.ts 由插件生成
├── components/    # UI、布局、主题
├── features/      # 按业务域拆分的页面组件
├── lib/           # query client、工具函数
├── config/        # 导航、表格、Infobar 配置
├── constants/     # 演示数据
└── styles/        # 全局样式与主题 CSS
src-tauri/         # Rust 外壳、图标、Tauri 配置
```

## 注意

- `src/routeTree.gen.ts` 是生成文件，已被 gitignore；首次 `dev` / `build` 会重建。
- 根路由不使用 `createServerFn` 读取主题 cookie；主题在客户端从
  `document.cookie` 读取，保证静态 SPA 下可用。
- 当前页面数据仍以模板自带的演示数据为主，接入 Lucent API 前需要替换。

## 认证

认证走 **Lucent 的 httpOnly cookie 会话**（`/api/v1/auth/sessions/*`），
账户资料读 `GET /api/v1/account`，Web 与桌面两个宿主共用同一条路径：

- token 由浏览器以 `Set-Cookie` 收下，**前端代码读不到**，所以 `session.ts` 里
  不存 token，只存「用户是谁 + 登录态三态（unknown / authenticated / anonymous）」。
- **没有 `/auth/me`**：账户资料只有一个读入口 `/account`。登录/注册/刷新的响应里虽然
  也带 `user` 块，但那是会话建立的产物；会话恢复（首屏、续期后重试）读 `/account`。
  `bootstrap` 会把 `AccountResponse` 收窄成 `SessionUser`（`email` 可空、没有
  `emailVerified` 布尔位，这两处由 `toSessionUser()` 补齐）。
- `unknown` 表达「还没问过服务端」。SPA 没有服务端可判定登录态，把它当成 false
  会让每次刷新先闪一下登录页——这是三态而非布尔的原因。
- 会话轮换走 `refreshSession()`，**单飞**：Lucent 的轮换是一次性的，并发刷新会让
  第二次必然失败并登出。`bootstrap` 在 access token 过期时先静默续期再重试，
  而不是直接把人踢去登录页。
- 路由守卫在 `beforeLoad` 里做（`src/routes/dashboard.tsx`），并等 `unknown` 出结果；
  未登录时带 `redirect` 参数跳登录页，登录后回跳原路径。

配置见 `env.example.txt`。**Lucent 侧必须把本客户端的来源加进 `CORS_ORIGIN`**
（开发期 `http://localhost:1420`），否则预检失败且 Lucent 日志里看不到请求。

## 人机验证

Cloudflare Turnstile，用 `@marsidev/react-turnstile`（官方文档推荐的 React 封装）。

- 配置来自服务端 `GET /auth/captcha`（`{ enabled, siteKey }`），**不写死 siteKey**；
  `enabled: false` 时组件不渲染任何东西（本地开发与 e2e 都是这种）。
- **注册**：服务端无条件校验，所以只要启用就直接显示 widget，未取得 token 时提交按钮禁用。
- **登录**：服务端只在同一邮箱失败 3 次后才要求，所以一开始不显示；收到
  `AUTH_CAPTCHA_REQUIRED` 才把 widget 显示出来，`AUTH_CAPTCHA_INVALID` 则重置重取。
- token 一次性且短命：`onExpire` / `onError` 一律清空，宁可不让提交，也不提交一个
  必然被拒的值。

## API 契约

请求层**由 OpenAPI 契约驱动**，不手写类型：

```bash
# 1) 在 Lucent 导出契约（后端 API 变更后必跑）
cd ../Lucent && pnpm export:openapi

# 2) 在本 app 生成类型
pnpm contract          # -> src/generated/lucent-api.ts（勿手改）
```

`src/generated/lucent-api.ts` 是 `openapi-typescript` 的产物，已入库；
`src/lib/api-client.ts` 用 `openapi-fetch` 消费它，因此**路径与载荷都由后端契约
推导**——写错路径或漏字段是编译错误，不是线上故障。

**为什么是 `src/generated/`**：本 app 只有 `@/*` → `./src/*` 一条别名，生成物因此
直接落在 `@/generated/lucent-api` 上，不需要第二个别名或相对路径穿出 `src`。
它也参与打包，是应用源码的一部分，与 `src/routeTree.gen.ts` 同类。

**为什么不是 `src/lib/generated/`**：`src/lib/` 是手写工具代码（`utils` / `form` /
`query-client`…），掺入 400 KB 生成产物会让「谁维护这个文件」变得含糊；
`src/**` 下按类型分目录的约定也会被它打断。

该目录已加入 `.oxlintrc.json` 与 `.oxfmtrc.json` 的 ignore——生成文件自带格式，
规则不该对它报错或重写它。

- 契约源：`<workspace>/Lucent/docs/reference/generated/openapi.json`。
  路径按 `pnpm-workspace.yaml` 标记向上找，不数层级（数层级在目录变动时会**静默**指错）。
- 错误：`application/problem+json`（ADR-0012）在中间件里归一成 `ApiError`，
  保留稳定 `code` 供认证分支使用。
- `features/<domain>/api/types.ts` 只做**别名**（`components['schemas'][...]`），
  不写字段——需要新字段就去改后端契约。

## 国际化

界面文案全部走 i18n，**默认英文**：

- 资源：`src/lib/i18n/locales/{en,zh-CN}/auth.json`。
- 初始化：`src/lib/i18n/index.ts`，`fallbackLng: 'en'`；
  用户选择记在 `localStorage.lumine.lang`，**不跟随浏览器语言自动切换**
  （默认界面语言是产品决策，不是运行环境推断）。
- 切换入口：账号菜单里的语言项。
- 校验消息写成 **i18n key**（如 `auth.validation.emailInvalid`）而不是文案：
  zod schema 在模块加载时构造，那时取不到当前语言；`FieldError` 在渲染时按键翻译。
- **不要在组件里写人类可读文案**，包括中文与英文。

旧版模板的 Clerk 残留已全部清除，仓库内无任何 Clerk 依赖或配置。
