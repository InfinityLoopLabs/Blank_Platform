import path from 'path'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
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
  },
}

export default config
