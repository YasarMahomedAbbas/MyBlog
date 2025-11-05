import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import noHardcodedColors from "./eslint-rules/no-hardcoded-colors.js";
import noConsoleLog from "./eslint-rules/no-console-log.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "next-env.d.ts",
      "**/*.d.ts",
      ".env*",
      "public/**",
      "coverage/**",
      ".nyc_output/**",
      "**/*.min.js",
      "src/components/icons/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      prettier,
      "custom-rules": {
        rules: {
          "no-hardcoded-colors": noHardcodedColors,
          "no-console-log": noConsoleLog,
        },
      },
    },
    rules: {
      "prettier/prettier": "error",
      "prefer-const": "error",
      "no-var": "error",
      "react/no-unescaped-entities": "off",
      "custom-rules/no-hardcoded-colors": "error",
      "custom-rules/no-console-log": "error",
    },
  },
  {
    files: ["src/lib/logging/providers/browser-logger.ts"],
    rules: {
      "custom-rules/no-console-log": "off",
    },
  },
]);
