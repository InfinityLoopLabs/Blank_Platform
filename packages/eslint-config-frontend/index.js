import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';

import {
  createCoreConfig,
  createImportOrder,
} from '@infinityloop.labs/eslint-config-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const frontendSpecific = [
  ...fixupConfigRules(compat.extends('plugin:react/recommended')),
  {
    plugins: {
      react: fixupPluginRules(reactPlugin),
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.jasmine,
        ...globals.jest,
        ...globals.node,
      },
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
    rules: {
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'ignore',
        },
      ],
      'react/jsx-max-props-per-line': [
        'error',
        {
          maximum: 1,
          when: 'multiline',
        },
      ],
      'import/order': [
        'error',
        createImportOrder({
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@app/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@components/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@constants/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@functions/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@hooks/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@layouts/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@pages/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@services/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@styles/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@widgets/**',
              group: 'internal',
              position: 'before',
            },
          ],
        }),
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'no-console': 'warn',
    },
  },
];

const frontendConfig = [...createCoreConfig(), ...frontendSpecific];

export default frontendConfig;
