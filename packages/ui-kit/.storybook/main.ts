// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import path, { dirname } from 'path';
import type { StorybookConfig } from '@storybook/react-vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath("@storybook/addon-docs")],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  async viteFinal(baseConfig) {
    baseConfig.resolve = baseConfig.resolve || {}
    const currentAlias =
      typeof baseConfig.resolve.alias === 'object' &&
      !Array.isArray(baseConfig.resolve.alias)
        ? baseConfig.resolve.alias
        : {}

    baseConfig.resolve.alias = {
      ...currentAlias,
      '@': path.resolve(__dirname, '../src'),
      '@assets': path.resolve(__dirname, '../src/assets'),
    }

    return baseConfig
  }
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
