# Lumine 认证落地计划：同构（Web + 桌面）下的认证接入

> 状态：**主体已实施**（2026-10-22 起草，2026-10-23 落地 F1–F4 与 A0–A8）。
> 已完成：cookie 会话端点（Lucent 侧按 ADR-0024 四层落地）、类型化客户端
> （由 OpenAPI 生成）、登录/注册页、路由守卫、账号菜单、i18n（默认英文）、
> 单元测试基建。未完成见 §十四。
> 定位：**Lumine 同时服务 Web 与桌面，是同一份前端代码 + 两种宿主**。
> 这个约束是本计划的第一性原理——凡是只在 Tauri 里成立的方案，都不能作为默认路径。
> 范围：以 `apps/lumine` 为主；`Lucent` 只可能涉及 `CORS_ORIGIN`（见 §八）；
> **不改 `Luminous`**。
> 前置阅读：`apps/lumine/PRODUCT.md` §十（「认证沿用 Lucent 现有认证」）、§11.1（侧边栏底部账号区）、
> §11.2（收藏与最近打开「跟随账号同步」）。

## 一、一句话结论

模板的登录/注册页已有，但**没有一行认证代码**。原计划（删 Clerk 残留 + 把认证放 Rust 层）
在「同构」这个前提下**不成立**：Web 端没有 Rust，Rust 层就不能是认证的唯一实现。

正确的落法是：

> **认证必须活在 Web 层（TypeScript，跑在宿主能提供的同一个浏览器环境里）；
> Rust 只承担「单写者 / 安全存储」这个角色，且必须在 TypeScript 侧存在纯 Web 降级路径。**

---

## 二、「同构」这条约束改写了什么

### 2.1 两种宿主，一份代码

| 宿主                                                               | 运行时                        | 谁能发 HTTP                      | 能存 token 的最安全位置                     |
| ------------------------------------------------------------------ | ----------------------------- | -------------------------------- | ------------------------------------------- |
| **Web**（浏览器，`devluo.com` 域下）                               | 纯 TS + 浏览器 API            | 浏览器 fetch                     | **httpOnly cookie**（浏览器的唯一安全存储） |
| **桌面**（Tauri，`tauri://localhost` 或 `http://tauri.localhost`） | 同一个 TS bundle + IPC + Rust | 浏览器 fetch **或** Rust reqwest | Rust 侧 OS 凭据库                           |

硬事实（已核实）：

- **同一个 JS bundle 跑在两处，没有 SSR。** `vite.config.ts` 开着
  `tanstackStart({ spa: { enabled: true } })`，`index.html` 是静态壳；
  Luminous/Lucent 侧的 SSR 能力用不上。任何「服务端会话」都得另找宿主。
- **`@tauri-apps/api` 根本没装。** `apps/lumine/package.json` 只有 `@tauri-apps/cli`（devDependency），
  `node_modules/@tauri-apps/` 下只有 `cli`。也就是说**今天连「判断自己是不是在 Tauri 里」都做不到**，
  要写 `isTauri()` 必须先加这个依赖。
- **`dist/` 会被构建整体清空**（已实测：塞探针 → `pnpm build` → 探针消失）。
  所以任何「往产物里塞桩再用信任模式打包」的捷径都不可用。

### 2.2 「同构」不是「同一套代码硬塞两种存储」

两种宿主的安全边界不同，token 落点**必须**不同：

|             | Web                                                                     | 桌面                                                  |
| ----------- | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| token 放哪  | httpOnly + Secure + SameSite=Lax cookie                                 | Rust 侧 OS 凭据库，**或** httpOnly cookie（若走代理） |
| JS 能否读到 | 否                                                                      | 否                                                    |
| 谁来续期    | 服务端用 cookie 换新 token（或前端用「refresh 轮值 + 单飞」）           | 同左                                                  |
| 跨域        | 是（`devluo.com` ↔ Lucent），**需要 `credentials: 'include'` + 白名单** | 否（Rust curl 或同源代理）                            |

**推论一**：把 token 放 `localStorage` 是**最省事也最不该做**的选项——
它两端都能跑，但等于把 XSS 变成账号接管。在 Web 端点（尤其是挂在 `devluo.com` 上、
和文档站同域）这个代价不能接受。

**推论二**：既然 Web 端必须能发带凭据的跨域请求，`CORS_ORIGIN` 那条线就绕不开了。
原来想靠「走 Rust 免 CORS」省掉的配置，在 Web 端**必须做**——而这恰好也让桌面端的原生 fetch 一起能用。

### 2.3 谁能判断「现在是什么宿主」

```ts
// 唯一判据；不要散落 window.__TAURI__ 判断
const isTauri = '__TAURI_INTERNALS__' in window;
```

需要 `@tauri-apps/api` 的 `isTauri()` 时，它是**唯一要新加的运行时依赖**；
不想要依赖时，上面的 `in window` 判断在 Tauri v2 上是可靠的。

**这一行判断决定了后面所有分支。** 计划里凡是「桌面专属」的工作项，都必须能回答
「Web 端这里走什么」。

---

## 三、现状（已核实）

### 3.1 模板认证只是一套 UI 骨架

| 项           | 位置                                                                                  | 实际行为                                                          |
| ------------ | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 登录页       | `src/routes/auth/sign-in/index.tsx` → `src/features/auth/components/sign-in-view.tsx` | 纯展示                                                            |
| 注册页       | `src/routes/auth/sign-up/index.tsx` → `src/features/auth/components/sign-up-view.tsx` | 纯展示                                                            |
| `/auth` 入口 | `src/routes/auth/index.tsx`                                                           | `redirect` 到 `/auth/sign-in`                                     |
| `/auth` 布局 | `src/routes/auth.tsx`                                                                 | 只有一个 `<Outlet />`                                             |
| 表单         | `src/features/auth/components/user-auth-form.tsx`                                     | zod 只校验邮箱格式；`onSubmit` 只 `toast.success`，**不发请求**   |
| GitHub 登录  | `src/features/auth/components/github-auth-button.tsx`                                 | `onClick={() => void 0}`                                          |
| 装饰网格     | `src/features/auth/components/interactive-grid.tsx`                                   | 纯装饰，两端都能用                                                |
| 路由守卫     | 无                                                                                    | `src/routes/dashboard.tsx` 没有 `beforeLoad`，`/dashboard` 可直达 |
| 顶部用户菜单 | `src/components/layout/user-nav.tsx`                                                  | 硬编码 `User` / `user@example.com`，`Sign out` 无处理             |

### 3.2 Clerk 残留：本地已删，代码里还剩一处

| 项                                                                     | 状态                                                                    |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `.clerk/` 目录                                                         | **已删除**（2026-10-22 核实）                                           |
| `.env.local` 里 6 个 `CLERK_*` / `NEXT_PUBLIC_CLERK_*`                 | **已删除**（2026-10-22 核实：`.env.local` 仍在，但已无任何 Clerk 变量） |
| `apps/lumine/.gitignore:59-60` 的 `# clerk configuration` + `/.clerk/` | **仍在，且已提交进库**——这是唯一残留，见 F4                             |
| 密钥吊销                                                               | 由用户负责，本计划不做                                                  |

### 3.3 基线检查

| 命令                | 结果                                                       |
| ------------------- | ---------------------------------------------------------- |
| `pnpm build`        | ✅ exit 0，产出 `dist/client/`                             |
| `pnpm typecheck`    | ✅ exit 0                                                  |
| `pnpm lint`         | ✅ 0 warnings / 0 errors（248 文件）                       |
| `pnpm format:check` | ❌ `PRODUCT.md` 未格式化（**唯一失败项，且是未跟踪文件**） |

---

## 四、必须先承认的两件既有缺陷

### F1（阻塞认证）：`api-client.ts` 会吞掉并发 header

```ts
const res = await fetch(`${BASE_URL}${endpoint}`, {
  headers: { 'Content-Type': 'application/json' },
  ...options // ← 在 headers 之后展开
});
```

调用方一传 `options.headers`，默认头就被**整体替换**而不是合并。
登录后每个带 `Authorization` 的请求都会走这条路，这里不修，表现就是
「一个请求带 token、下一个不带」。另外 `BASE_URL = '/api'` 与 Lucent 的真实前缀
`/api/v1`（`Lucent/src/setup-app.ts:212-216`）不一致，现在没调用方所以没暴露。

### F2（不阻塞）：`desktop.yml` 的过滤对 `lumine` 已失效

`.github/workflows/desktop.yml` 里三处都还是改名前的 `apps/desktop` / `@luminary/desktop`：

- `paths` 过滤不命中 → 改 `apps/lumine` 不触发；
- `pnpm --filter @luminary/desktop ...` → 包名是 `@luminary/lumine`；
- `working-directory: apps/desktop` → 目录不存在。

**桌面端的 CI 门禁事实上已经停了。** 不先修，后面所有「CI 必须过」的验收都无从验证。

---

## 五、Lucent 认证契约（只读，已核实）

| 端点                                                                   | 请求                                                                                                            | 响应                                           |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `POST /api/v1/auth/register`                                           | `{ email, password, code, captchaToken?, nickname? }`，**`.strict()`**                                          | `201 { user: UserBrief, tokens }`              |
| `POST /api/v1/auth/login`                                              | `{ email, password?, code?, captchaToken? }`（密码与验证码二选一），**`.strict()`**                             | `200 { user: UserFull, tokens }`               |
| `POST /api/v1/auth/refresh`                                            | `{ refreshToken }`，**`@Public()`**                                                                             | `200 { accessToken, refreshToken, expiresIn }` |
| `POST /api/v1/auth/logout`                                             | `{ refreshToken }`                                                                                              | 需鉴权                                         |
| `GET /api/v1/auth/sessions`、`DELETE /api/v1/auth/sessions/:sessionId` | —                                                                                                               | 需鉴权                                         |
| `GET /api/v1/auth/captcha`                                             | —                                                                                                               | `{ enabled, siteKey }`                         |
| `POST /api/v1/auth/send-verification-code`                             | `{ email, scene }`，scene ∈ `register`/`login`/`change-email`/`set-password`/`delete-account`/`forgot-password` | `{ cooldown, message }`                        |

六个最容易踩的契约细节：

1. **注册必须有邮箱验证码 `code`**，且要先 `POST /auth/send-verification-code`（`scene: 'register'`）。
   模板的注册表单只有邮箱一个字段，**完全不够用**。
2. **登录密码走 `strongPasswordSchema()`**（`dto/credentials/login.dto.ts:28`）：≥8 位 **且 zxcvbn 强度评分要过**。
   前端只校验「非空」的话，用户会拿到一个前端看不出来的 `401`。
3. **`captchaToken` 在 schema 里可选，是否强制由服务端运行时定**：
   `TurnstileService.verify()`（`turnstile.service.ts:95-105`）在 `enabled` 时**没有 token 直接回 `AUTH_CAPTCHA_REQUIRED`**。
   所以要给用户机会，就必须先 `GET /auth/captcha` 拿 `siteKey`。
4. **反枚举**：`credentialsInvalidFailure()` 把凭据级失败统一成 `AUTH_WRONG_PASSWORD`。
   前端**不能**按 code 区分「账号不存在 / 密码错 / 验证码错」，UI 也只能给一句通用错误。
5. **错误体是 RFC 9457 Problem Details**（ADR-0012），`api-client.ts` 现在拿不到 `code`。
6. **`refresh` 会轮换 refreshToken**，旧的立即作废。前端必须原子替换，并发刷新会把会话刷死。

> **契约边界（需人工确认，见 Q2）**：以上端点**全部是 JSON body + `Authorization: Bearer`**，
> `setup-app.ts:266-277` 的 CORS 也没配 `credentials`。也就是说
> **Lucent 目前没有「httpOnly cookie 会话」这条路径**。§六 的「凭据放置」会直接撞上这一点。

---

## 六、方案（按「同构」重新排序）

### 方案 1（推荐）：Web 层直连 Lucent，两端同一套调用 + 单飞刷新

- **调用链（两端一致）**：TS 里 `fetch(LUCENT_BASE + '/auth/login')`，`Authorization: Bearer`。
  桌面端也走浏览器 fetch（Tauri 的 WebView 就是浏览器），**不经过 Rust**。
- **token 落点**：见 §七「凭据存储」——这是本方案唯一的难点。
- **刷新**：单飞（同一时刻只允许一个 refresh 在飞，其余请求排队），因为轮换会作废旧 token。
- **好处**：两端零分支；Web 端「本来就要做」的 CORS 配置顺带把桌面端也解决了；
  Rust 层保持为空，不引入新子系统。
- **代价**：需要 Lucent 侧 OpenAPI 生成客户端（见 A0），需要 `CORS_ORIGIN` 加开发 origin 与线上域名。

### 方案 2：同一 TS 代码，**仅凭据存储**按宿主分叉

在方案 1 之上只加一处分叉：

```
sessionStore = isTauri ? tauriStore() : webCookieStore()
```

- 桌面：Rust 命令持有 token（系统凭据库），TS 只拿「已登录/未登录 + 用户资料」。
- Web：token 仍在 JS 里（或由服务端 cookie 方案替代）。
- **问题**：这要求 **Rust 真的实现一遍认证**（§六 方案 3 的全部成本），
  而收益只覆盖桌面——**同构项目里这是「为一半用户写第二套认证」**。
  只有当产品要求「桌面端 token 绝不出现在 WebView」时才值得。

### 方案 3：Rust 持有 token（只在桌面）

- 需要 `reqwest` + `#[tauri::command]` + capabilities + 系统凭据库（`keyring` crate），
  并解决 Windows 上 `keyring` 的可用性验证。
- **同构前提下不可作为默认**：Web 端没有 Rust，等于认证有两套实现、两套错误映射、两套测试。
- 保留为**未来增强**：如果将来桌面端需要离线缓存药品数据、后台同步，
  Rust 本来就得能发请求，那时再把它接进认证才有性价比。

### 结论

**默认走方案 1**；方案 2 只保留「凭据存放」这一个可切换的缝（接口先定好，实现先只给 Web）；
方案 3 明确列为不做（§十一）。

---

## 七、凭据存储（方案 1 里真正的难点）

三条路，代价不同：

| 选项                                           | Web                                  | 桌面                | 评价                                                                     |
| ---------------------------------------------- | ------------------------------------ | ------------------- | ------------------------------------------------------------------------ |
| **A. `httpOnly` cookie 会话**                  | ✅ 最安全                            | ✅ 若走同源代理也行 | **需要 Lucent 加一个 cookie 会话端点**——与 §五 注「契约边界」冲突，需 Q2 |
| **B. 内存 + `sessionStorage` 存 refreshToken** | 刷新页面会掉登录（除非配合静默刷新） | 同左                | 两端一致、改动小；但 XSS 可读 refreshToken                               |
| **C. `localStorage`**                          | 最方便                               | 同左                | **不推荐**：XSS 直接变账号接管，且 `devluo.com` 上与文档站同域           |

**目前的倾向**：先按 **B** 落地（最快跑通、两端一致），**同时**把
`SessionStore` 抽成接口，为 A 留位置。选 A 的决策成本在 Lucent 侧，不在 Lumine 侧。

⚠️ 无论选哪个，**「网页端也用 Bearer、不用 cookie」意味着 Web 端要处理刷新令牌的生命周期**，
这一点不能靠「反正桌面端有 Rust」糊过去。

---

## 八、配置与部署清单

| 项                      | 值                                 | 落到哪                                                                      |
| ----------------------- | ---------------------------------- | --------------------------------------------------------------------------- |
| Web 端来源              | `https://devluo.com`（已在白名单） | Lucent `.env.production` 的 `CORS_ORIGIN`                                   |
| 桌面端开发 origin       | `http://localhost:1420`            | Lucent `.env.development` 的 `CORS_ORIGIN`                                  |
| Lucent API 地址（开发） | `http://127.0.0.1:3000/api/v1`     | `apps/lumine/.env.development`（**新建**；`.env*.local` 已被忽略）          |
| Lucent API 地址（生产） | 构建期注入                         | CI secrets；**部署地址不入库**（沿用 Luminous `LUCENT_PROD_BASE_URL` 口径） |

⚠️ 漏配 `CORS_ORIGIN` 的表现是**浏览器直接拦掉请求、Lucent 日志里什么都看不到**
（`plans/2026-09-28-luminary-monorepo-plan.md` §8.5 记录过这个坑），排查方向极易被带偏。
必须写进 `docs/deployment.md`。

---

## 九、工作项

### F 档：与认证决策无关，可以立即做

#### F1 修 `api-client.ts`

- header 改为**显式合并**；
- 抽出 `LUCENT_API_BASE`（默认 `http://127.0.0.1:3000/api/v1`，可被 `import.meta.env` 覆盖），
  去掉写死的 `'/api'`；
- 解析 RFC 9457 Problem Details，抛出带 `status` + `code` 的类型化错误。

**验收**：单测覆盖「默认头 + 调用方头并存」与「ProblemDetails 解析」。

#### F2 修 `desktop.yml`（三处 `apps/desktop` → `apps/lumine`）

**验收**：本地逐条跑通 workflow 命令；push 后 job 真的被触发。

#### F3 让 `format:check` 变绿

`apps/lumine` 没有 `format:write`，只有 `format`（`oxfmt --write .`）。在 `apps/lumine` 下跑 `pnpm format`。
⚠️ `PRODUCT.md` 是未跟踪文件，格式化它等于替别人改未提交文档，应单独提交或注明。

#### F4 清掉 `.gitignore` 里的 Clerk 残留

删 `apps/lumine/.gitignore:59-60` 的 `# clerk configuration` + `/.clerk/`。
理由：对应文件已不存在，留着会让下一个人以为项目还在用 Clerk（本次的认知成本就是它造成的）。

**验收**：`git grep -i clerk` 零命中。

#### F5 加 `@tauri-apps/api`

`isTauri()` 需要它；现在只装了 `@tauri-apps/cli`。**这是「同构」判断的地基**，早加早暴露 bundler 问题。

### 认证档

| #   | 工作项                                                                                                                  | 依赖 | 为何在同构下必须这么做                   |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------- |
| A0  | 从 `Lucent/docs/reference/generated/openapi.json` 生成 TS 客户端，或手写 `features/auth/api/{types,schemas,service}.ts` | —    | 两端共用一个契约源，避免手写漂移         |
| A1  | `SessionStore` 接口 + Web 实现（§七 选项 B）                                                                            | A0   | 预留 A 的位置；桌面实现将来只替换这一层  |
| A2  | 认证状态 + 客户端守卫：`dashboard.tsx` 的 `beforeLoad`、`__root.tsx` 注入「未知态」                                     | A1   | SPA 无 SSR，守卫**只能**在客户端做       |
| A3  | 登录页：邮箱+密码 / 邮箱+验证码两条路径、Turnstile、`code` 分支                                                         | A0   | 参考 §五                                 |
| A4  | 注册页：发验证码（含响应自带 `cooldown` 倒计时）→ 验证码 → 密码 → 可选昵称                                              | A0   | 模板表单字段不够                         |
| A5  | refresh 轮换的单飞                                                                                                      | A1   | 并发刷新会刷死会话                       |
| A6  | `user-nav.tsx` 接真实账号 + `Sign out`                                                                                  | A2   | PRODUCT.md §11.1/§11.2 都等它            |
| A7  | 「Continue with GitHub」去留                                                                                            | Q3   | Lucent 的 OAuth 只有微信/QQ/Google/Apple |
| A8  | 文案：Lumine 无 l10n 设施                                                                                               | Q4   | 决定后续所有文案工作量                   |

---

## 十、测试与门禁

Lumine **没有测试设施**（`package.json` 无 vitest/jest；`docs/security-and-ci.md`
「已知缺口」第 1 条已记录）。认证涉及 token 生命周期与错误分支，不写测试不可维护。

最小设施建议：`vitest` + `@testing-library/react`，只做纯逻辑与状态机；
首批用例：`api-client` 头合并、ProblemDetails 解析、refresh 单飞、`code` → 文案映射。

同时补一条**同构测试**：在 `isTauri()` 两个分支下，`SessionStore` 的选择正确
（这条用 vitest 的 `vi.stubGlobal` 就能覆盖，不需要真起 Tauri）。

---

## 十一、不做

- **不把认证实现两遍**（Web 一套、Rust 一套）——这是同构项目里最贵的错误。
- 不引入既有文档站那条「Phase 8.6：服务端由 Rust 承担」的旧结论作为认证依据——
  那是**桌面端 SSR 路线被推翻时**的产物，不是同构 Web 端的结论。
- 不做找回密码 / 改邮箱 / 改密码 / 设备会话管理（Lucent 有端点，首版不做）。
- 不做微信 / QQ / Google / Apple OAuth（首版不做）。
- 不做「离线登录」或「本地账号」（会制造第二套身份）。
- 不改 `Luminous`。

---

## 十二、验收标准

### F 档

- [ ] `git grep -i clerk` 零命中；`.clerk/`、`.env.local` 无 Clerk 变量
- [ ] `build` / `typecheck` / `lint` / `format:check` 全绿
- [ ] `desktop.yml` 与 `apps/lumine` 一致；改 `apps/lumine/src/**` 能触发
- [ ] `api-client` 单测通过；`isTauri()` 在浏览器里返回 `false`

### 认证档

- [ ] **Web 与桌面**都能走完：注册（含验证码）→ 登录 → 刷新 → 登出
- [ ] 未登录访问 `/dashboard` 重定向到登录页；登录后回跳原路径
- [ ] `AUTH_CAPTCHA_REQUIRED` / `AUTH_CAPTCHA_INVALID` / `AUTH_WRONG_PASSWORD` / `429` 各有提示，
      且**不泄露账号是否存在**
- [ ] 并发刷新不会让会话失效（单飞）
- [ ] `user-nav` 显示真实昵称/邮箱，`Sign out` 后回登录页
- [ ] **Web 端与桌面端的行为差异，只有 `SessionStore` 一层**（用代码审查确认，不靠口头约定）

---

## 十三、文档更新清单

| 文档                          | 更新什么                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| `apps/lumine/README.md`       | 「注意」补：认证承载层是同构 Web 层；`.env` 变量表                                           |
| `apps/lumine/env.example.txt` | 现在只有一句 `No environment variables required for basic usage`，与事实不符，改成真实变量表 |
| `apps/lumine/PRODUCT.md` §十  | 写清「认证在同构 Web 层；Rust 不承担认证」，并列出实际用到的端点与错误契约                   |
| `docs/deployment.md`          | 桌面端 + Web 端两套 API 地址与 `CORS_ORIGIN` 清单                                            |
| `docs/security-and-ci.md`     | 已知缺口第 1 条；F2 修复后 CI 覆盖变化                                                       |
| 本文件                        | 实施完毕后**整体删除**（本仓约定：计划完成即删）                                             |

---

## 十四、已决问题与剩余事项

### 已决（2026-10-22 / 10-23）

| #   | 问题                              | 决定                                                                                                                                         |
| --- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | 凭据存储 A / B / C                | **A**：httpOnly cookie 会话。选 B/C 会让 XSS 直接等于账号接管，而 Web 端与文档站同域，代价不可接受。                                         |
| Q2  | Lucent 加 cookie 会话是否纳入范围 | **纳入**。新增 `/auth/session/*` 与 `/auth/me`，Bearer 契约保持不动（手机端不受影响）；按 ADR-0024 落在 `domain/application/adapters` 三层。 |
| Q3  | 「Continue with GitHub」按钮      | **删除**。Lucent 的 OAuth 只有微信/QQ/Google/Apple，模板那个按钮从来没有后端。                                                               |
| Q4  | 是否引入 i18n                     | **引入，默认英文**。资源在 `src/lib/i18n/locales/{en,zh-CN}`，切换入口在账号菜单；校验消息用 i18n key。                                      |
| —   | API 类型怎么来                    | **由 OpenAPI 生成**（`openapi-typescript` + `openapi-fetch`），不手写。`pnpm contract` 生成 `src/lib/generated/lucent-api.ts`。              |

### 剩余

| 项            | 说明                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q5 域名       | Web 端挂哪个域名仍未定，影响 `CORS_ORIGIN` 与路由 `basePath`。桌面端不受影响（Tauri 内嵌）。                                                               |
| 刷新单飞      | 当前 refresh 只在 401 后由调用方触发；并发请求可能各触发一次。轮换会让旧 refresh 作废，所以**必须**加单飞。见 Lucent 的 refresh 端点在重复消费时返回 401。 |
| Turnstile     | 后端已支持（`GET /auth/captcha` + `AUTH_CAPTCHA_REQUIRED`），前端已能识别该错误码，但**尚未渲染 Turnstile 组件**。                                         |
| 收藏/最近打开 | PRODUCT.md §11.2 要求跟随账号同步；本计划只做了账号区，同步逻辑未做。                                                                                      |
