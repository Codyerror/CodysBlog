import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Contentlayer 生成物，不属于手写源码
    ".contentlayer/**",
  ]),
  {
    rules: {
      // eslint-config-next 16 自带的 React Compiler 规则面向 React 19 / Next 16。
      // 本项目锁在 Next 14 + React 18：next-themes 的 mounted 检测、
      // useMDXComponent 在 render 中返回组件、DOM 扫描后 setState 都是官方推荐写法。
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
  {
    // Contentlayer 0.3.4 的类型定义与 TS 5 / ESM 不兼容，配置文件需保留 ts 注释。
    files: ["contentlayer.config.ts", "lib/contentlayer.ts"],
    rules: { "@typescript-eslint/ban-ts-comment": "off" },
  },
]);

export default eslintConfig;
