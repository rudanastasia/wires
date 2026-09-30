/*Команды для работы с проектом:
npm run lint — проверить весь проект на ошибки ESLint.
npm run lint: fix — автоматически исправить ошибки во всём проекте.
npm run format — отформатировать все файлы проекта.
npm run format: check — проверить, правильно ли отформатированы все файлы.*/

import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser }
  },
  eslintConfigPrettier, // Отключает конфликтующие с Prettier правила
  {
    rules: {
      "prefer-const": "error",
      "no-var": "error",
    },
  },
]);

