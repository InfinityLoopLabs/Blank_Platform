// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import sharedConfig from "@infinityloop.labs/eslint-config-frontend";

export default [{
  ignores: [
    "build",
    "dist",
    "node_modules/**/*",
    "node_modules",
  ],
}, ...sharedConfig, {
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",

    parserOptions: {
      project: "./tsconfig.json",
    },

  },
  plugins: {
    "react-refresh": (await import("eslint-plugin-react-refresh")).default,
  },
  rules: {
    // Add any react-refresh specific rules here if needed
  },
}, {
  files: ["src/**/*.stories.@(js|jsx|ts|tsx)"],
  rules: {
    "import/no-default-export": "off",
  },
}, ...storybook.configs["flat/recommended"]];
