import { defineConfig } from 'fumadocs-mdx/config'

/**
 * fumadocs-mdx 的**全局编译配置**。
 *
 * ⚠️ 这些东西**不能**配在 `next.config.mjs` 里：那里 `createMDX()` 只接受
 * `configPath` / `outDir` / `macro` / `index` 四项，与 MDX 编译无关。
 * 本文件是默认路径（`source.config.ts`），由 fumadocs-mdx 自动发现，
 * 编译产物落在 `.source/`。
 *
 * ## 为什么要配 `rehypeCodeOptions.fallbackLanguage`
 *
 * 代码块由 shiki 高亮，而 shiki 只认识它内置的语法。文档里一旦出现它不认识的
 * 语言标识符，构建会**直接失败**：
 *
 *     ShikiError: Language `datalog` not found, you may need to load it first
 *
 * 实测触发点：`Lucent/docs/reference/adr/0022-graph-backend-neo4j.md` 里的
 * 一个 ```datalog 代码块（该文件由 `sync:docs` 从 Lucent 仓库同步进来）。
 *
 * 这个失败的影响面与收益完全不成比例——**一个语言标注不认识，整个站点构建不出来**。
 * 而文档是跨仓库同步的，随时可能引入新的语言标识符，不能每次都在这里补一个
 * `langs` 白名单。
 *
 * `fallbackLanguage: 'text'` 让这类块退化成纯文本渲染：内容照常显示，
 * 只是没有语法着色。比让构建挂掉合理得多。
 *
 * ## 为什么还要显式写 `themes`
 *
 * `rehypeCodeOptions` 的类型要求 `themes`（或 `theme`）必填。而 fumadocs 的
 * 默认主题只在**两者都没给**时才由 `applyDefaultThemes` 注入
 * （见 `fumadocs-core/dist/utils-*.js` 的 `defaultThemes`）。
 * 一旦我们传了对象，就必须自己把默认值补上，否则配色会变。
 *
 * 下面这两个值就是 fumadocs 的默认值（light: github-light / dark: github-dark、
 * `defaultColor: false`），照抄以保持现有观感不变。
 */
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      fallbackLanguage: 'text',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
})
