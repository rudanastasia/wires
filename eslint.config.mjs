/*Команды для работы с проектом:
npm run lint — проверить весь проект на ошибки ESLint.
npm run lint: fix — автоматически исправить ошибки во всём проекте.
npm run format — отформатировать все файлы проекта.
npm run format: check — проверить, правильно ли отформатированы все файлы.*/

import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  // Собранный сайт не проверяем (node_modules ESLint игнорирует сам)
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },

  // Конфиг Eleventy: CommonJS и окружение Node
  {
    files: ['eleventy.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },

  {
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  eslintConfigPrettier, // Отключает конфликтующие с Prettier правила
]);
