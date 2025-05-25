module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
  ],
  env: {
    node: true,
    es2021: true,
  },
  overrides: [
    {
      files: ['application/client/**/*.{js,ts,vue}'],
      extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        'plugin:prettier/recommended',
      ],
      env: {
        browser: true,
        node: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 2021,
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-undef': 'off', // TypeScript already checks this
        'console': 'warn', // Warn on console usage
      }
    },
    {
      files: ['application/server/**/*.{js,ts}'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      plugins: [
        '@typescript-eslint',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { 
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
        }],
        'no-undef': 'off' // TypeScript already checks this
      }
    }
  ],
  ignorePatterns: ['**/dist/**', '**/node_modules/**', '**/public/**'],
};
