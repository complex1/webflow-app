import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier/recommended';
import tsconfigRecommended from '@typescript-eslint/eslint-plugin/configs/recommended';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    ignores: ['**/node_modules/**', '**/dist/**', '**/public/**'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      ...tsconfigRecommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
      }],
    },
  },
  prettier,
];
