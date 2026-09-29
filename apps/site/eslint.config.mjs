import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // fumadocs-mdx 的编译产物（由 source.config.ts 驱动，构建时生成）。
    // 内容是生成的 TS，自带 @ts-nocheck 等本站不写的写法，对本目录 lint
    // 只会报与本站无关的问题。与 .next/ 同理：生成物不该进 lint 范围。
    ".source/**",
    // compodoc 产物（由 sync:docs 从 Lucent 拷入 public/）是**第三方生成的静态资源**：
    // 含 767 个 HTML 与 Compodoc 自己的 Angular playground 源码。它们不参与本站构建，
    // 只是整体搬运，对它们做 lint 会报 3000+ 条与本站无关的问题（且每次都一样）。
    // tsconfig.json 早已为同一理由排除了这个目录；这里保持一致。
    "public/compodoc/**",
  ]),
]);

export default eslintConfig;
