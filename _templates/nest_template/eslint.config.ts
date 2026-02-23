import type { Linter } from 'eslint';
import sharedConfig from '@infinityloop.labs/eslint-config-backend';

const aliasResolver: Linter.Config['settings'] = {
  'import/resolver': {
    alias: {
      map: [
        ['@core', './src/platform'],
        ['@features', './src/features'],
        ['@infrastructure', './src/infrastructure'],
      ],
      extensions: ['.js', '.ts'],
    },
  },
};

const config: Linter.Config[] = [
  {
    ignores: ['dist/**/*', 'build/**/*', 'node_modules/**/*'],
  },
  ...sharedConfig,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: aliasResolver,
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        projectService: {
          defaultProject: './tsconfig.json',
          allowDefaultProject: ['tests/*/*.ts'],
        },
      },
    },
    settings: aliasResolver,
  },
];

export default config;
