import sharedConfig from "@infinityloop.labs/eslint-config";

export default [
  {
    ignores: [
      "build",
      "./app/features/generated",
      ".react-router/**/*",
      "node_modules/**/*",
      "node_modules",
      "*.config.js",
      "*.config.mjs",
      ".pnp.cjs",
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

    settings: {
      "import/resolver": {
        alias: {
          map: [
            ["@application", "./app/application"],
            ["@components", "./app/components"],
            ["@constants", "./app/constants"],
            ["@functions", "./app/utils/functions"],
            ["@generated", "./app/features/generated"],
            ["@hooks", "./app/utils/hooks"],
            ["@lib", "./app/utils/lib"],
            ["@layouts", "./app/layouts"],
            ["@modules", "./app/modules"],
            ["@pages", "./app/pages"],
            ["@services", "./app/features/services"],
            ["@widgets", "./app/features/widgets"],

          ],

          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    }

  },
];
