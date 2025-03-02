import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import drizzle from "eslint-plugin-drizzle";
import reactCompiler from "eslint-plugin-react-compiler";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ),
  {
    plugins: {
      drizzle,
      "react-compiler": reactCompiler,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "drizzle/enforce-delete-with-where": [
        "error",
        {
          drizzleObjectName: ["db", "ctx.db"],
        },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        {
          drizzleObjectName: ["db", "ctx.db"],
        },
      ],
      "react-compiler/react-compiler": "error",
    },
  },
];
