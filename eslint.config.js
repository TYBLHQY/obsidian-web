import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  {
    ignores: ["dist", "node_modules", ".git"],
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
              group: ["@/markdown/*", "!@/markdown"],
              message: '只能从 @/markdown 导入，不能直接访问子模块。请改为 import { ... } from "@/markdown"',
            },
          ],
        },
      ],
    },
  },
];
