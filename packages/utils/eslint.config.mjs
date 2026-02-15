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

        settings: {},

        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-case-declarations": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/no-empty-object-type": "off"
        }

    },
];
