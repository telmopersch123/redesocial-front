import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwind from "eslint-plugin-tailwindcss";


import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
export default defineConfig([
  globalIgnores(["dist", "build"]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["node_modules", "dist", "build"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      tailwind,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      tailwind.configs.recommended,
      prettier, // deve vir sempre por último
    ],
    rules: {
      "react/react-in-jsx-scope": "off", // não é necessário no React 17+
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/enforces-shorthand": "off",
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "clsx", "classnames"],
        config: "tailwind.config.js",
      },
    },
  },
]);
