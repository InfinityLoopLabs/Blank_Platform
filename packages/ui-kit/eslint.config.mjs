import sharedConfig from "@infinityloop.labs/eslint-config-frontend";

export default [
  {
    ignores: [
      "build",
      "dist",
      "node_modules/**/*",
      "node_modules",
    ],
  },
  ...sharedConfig,
  {
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
  },
];
