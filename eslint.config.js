import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  {
    ignores: ["dist", "node_modules", ".git", "pnpm-lock.yaml", "yarn.lock", "package-lock.json"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/markdown/*"],
              message: '只能从 "@/markdown" 导入，禁止直接访问子模块。',
            },
          ],
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["src/markdown/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];
