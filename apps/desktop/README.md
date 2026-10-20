# Luminous Desktop

Luminous 桌面客户端：Tauri 2 外壳 + TanStack Start（React）SPA。

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
pnpm --filter @luminary/desktop dev          # 只起前端，http://localhost:1420
pnpm --filter @luminary/desktop build        # 产出 dist/client/
pnpm --filter @luminary/desktop tauri:dev    # 前端 + 桌面窗口
pnpm --filter @luminary/desktop tauri:build  # 打包安装包
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
