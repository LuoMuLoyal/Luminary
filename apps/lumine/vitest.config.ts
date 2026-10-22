import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    // 与 tsconfig 的 `@/*` -> `./src/*` 对齐。vitest 不读 tsconfig paths，
    // 不显式声明的话，测试里 import 带 `@/` 的模块会直接解析失败。
    alias: { '@': resolve(import.meta.dirname, 'src') }
  },
  test: {
    // 只扫 src/：dist/ 里是构建产物，node_modules 里是三方代码。
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
});
