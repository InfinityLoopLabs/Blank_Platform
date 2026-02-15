import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const baseImportOrder = {
  groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  alphabetize: {
    order: 'asc',
    caseInsensitive: false,
  },
  pathGroupsExcludedImportTypes: ['builtin', 'react'],
};

export const createImportOrder = (overrides = {}) => {
  const { pathGroups = [], ...rest } = overrides;

  return {
    ...baseImportOrder,
    ...rest,
    pathGroups,
  };
};

const sharedRules = {
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-empty-function': 'warn',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-unnecessary-type-constraint': 'off',
  '@typescript-eslint/no-var-requires': 'warn',
  'arrow-body-style': ['error', 'as-needed'],
  curly: ['error', 'all'],
  'newline-before-return': 'error',
  'no-console': 'warn',
  'no-debugger': 'warn',
  'no-empty-pattern': 'warn',
  'object-property-newline': [
    'error',
    {
      allowAllPropertiesOnSameLine: false,
    },
  ],
  'prefer-template': 'error',
  'spaced-comment': [
    'warn',
    'always',
    {
      markers: ['/'],
    },
  ],
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'typeAlias',
      format: ['PascalCase'],
      custom: {
        regex: 'Type$',
        match: true,
      },
      leadingUnderscore: 'allow',
      trailingUnderscore: 'allow',
    },
    {
      selector: 'interface',
      format: ['PascalCase'],
      custom: {
        regex: '^I[A-Z]',
        match: true,
      },
      leadingUnderscore: 'allow',
      trailingUnderscore: 'allow',
    },
    {
      selector: 'enum',
      format: ['PascalCase'],
      custom: {
        regex: '^[A-Z][a-zA-Z]*Enum$',
        match: true,
      },
      leadingUnderscore: 'allow',
      trailingUnderscore: 'allow',
    },
    {
      selector: 'variable',
      types: ['boolean'],
      format: ['PascalCase'],
      prefix: ['is', 'has', 'can', 'should'],
      filter: {
        regex: '^(disabled)$',
        match: false,
      },
    },
    {
      selector: 'typeProperty',
      types: ['boolean'],
      format: ['PascalCase'],
      prefix: ['is', 'has', 'can', 'should'],
      filter: {
        regex: '^(disabled)$',
        match: false,
      },
    },
  ],
  'prettier/prettier': [
    'warn',
    {
      singleQuote: true,
      tabWidth: 2,
      useTabs: false,
      arrowParens: 'avoid',
      semi: false,
      bracketSameLine: true,
    },
  ],
  'import/no-default-export': 'warn',
  'import/order': ['error', createImportOrder()],
};

const sharedPlugins = {
  '@typescript-eslint': fixupPluginRules(typescriptEslint),
  import: fixupPluginRules(importPlugin),
  prettier: fixupPluginRules(prettierPlugin),
};

const overrides = [
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      'import/no-default-export': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*_Sample*', '**/*_sample*', '**/_Sample/**/*', '**/_sample/**/*'],
    rules: {
      'no-empty-pattern': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.config.js', '**/*.config.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
];

const coreConfig = [
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/warnings',
      'plugin:prettier/recommended',
      'prettier',
    ),
  ),
  {
    plugins: sharedPlugins,
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: sharedRules,
  },
  ...overrides,
];

export const createCoreConfig = () => [...coreConfig];

export default coreConfig;
