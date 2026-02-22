import sharedConfig from '@infinityloop.labs/eslint-config-backend';

export default [
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
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@core', './src/platform'],
            ['@features', './src/features'],
          ],
          extensions: ['.js', '.ts'],
        },
      },
    },
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
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@core', './src/platform'],
            ['@features', './src/features'],
          ],
          extensions: ['.js', '.ts'],
        },
      },
    },
  },
];
