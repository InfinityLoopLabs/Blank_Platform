const path = require("path")

/** @type {import("@storybook/react-vite").StorybookConfig} */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(baseConfig) {
    baseConfig.resolve = baseConfig.resolve || {}
    const currentAlias =
      typeof baseConfig.resolve.alias === "object" && !Array.isArray(baseConfig.resolve.alias)
        ? baseConfig.resolve.alias
        : {}
    baseConfig.resolve.alias = {
      ...currentAlias,
      "@": path.resolve(__dirname, "../src"),
      "@assets": path.resolve(__dirname, "../src/assets"),
    }

    return baseConfig
  },
}

module.exports = config
