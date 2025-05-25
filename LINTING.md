# ESLint Setup for Webflow App

This project uses ESLint for code quality and to maintain consistency across the codebase. The configuration is set up for both client and server components.

## Project Structure

- Client: Vue 3 + TypeScript application in `/application/client`
- Server: Node.js + TypeScript application in `/application/server`

## ESLint Configuration

The ESLint configuration is maintained in three separate files:

1. Root level: `/.eslintrc.json`
2. Client: `/application/client/.eslintrc.json`
3. Server: `/application/server/.eslintrc.json`

### Client-side Configuration

The client-side configuration includes support for:

- Vue 3 components with Single File Component syntax
- TypeScript parsing for .ts files and Vue template scripts
- Basic code style rules (quotes, semicolons, etc.)

```json
{
  "root": true,
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": 2021,
    "sourceType": "module",
    "extraFileExtensions": [".vue"]
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "rules": {
    "no-console": "warn",
    "no-debugger": "warn",
    "vue/multi-word-component-names": "off",
    "semi": ["warn", "always"],
    "quotes": ["warn", "single"]
  },
  "ignorePatterns": ["dist/**/*", "node_modules/**/*", "public/**/*"]
}
```

### Server-side Configuration

The server-side configuration includes support for:

- Node.js environment
- TypeScript parsing for .ts files
- Basic code style rules similar to the client side

```json
{
  "root": true,
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "no-console": "warn",
    "no-debugger": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "semi": ["warn", "always"],
    "quotes": ["warn", "single"]
  },
  "overrides": [
    {
      "files": ["*.ts"],
      "rules": {
        "no-undef": "off"
      }
    }
  ],
  "ignorePatterns": ["dist/**/*", "node_modules/**/*"]
}
```

## ESLint Commands

The project includes the following npm scripts for linting:

### Root Package.json

```json
"lint": "concurrently \"cd application/server && npm run lint\" \"cd application/client && npm run lint\"",
"lint:fix": "concurrently \"cd application/server && npm run lint:fix\" \"cd application/client && npm run lint:fix\""
```

### Client Package.json

```json
"lint": "eslint . --ext .js,.vue,.ts",
"lint:fix": "eslint . --ext .js,.vue,.ts --fix"
```

### Server Package.json

```json
"lint": "eslint . --ext .js,.ts",
"lint:fix": "eslint . --ext .js,.ts --fix"
```

## Installed Dependencies

### Client-side

```
eslint
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
@vue/eslint-config-typescript
eslint-plugin-vue
vue-eslint-parser
```

### Server-side

```
eslint
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
```

## Usage

- Run `npm run lint` at the project root to lint both client and server code
- Run `npm run lint:fix` to automatically fix linting issues where possible
- You can also run the lint commands in the respective client and server directories

## Common Issues

### TypeScript `any` Type

Many files in the project currently use the `any` type, which generates ESLint warnings. For proper TypeScript usage, these should ideally be replaced with more specific types.

### Console Statements

Console statements are marked as warnings. In production code, these should be removed or replaced with proper logging.

### Unused Variables

Unused variables are flagged to help keep the code clean. Consider removing them or prefixing with underscore if they're intentionally unused.
