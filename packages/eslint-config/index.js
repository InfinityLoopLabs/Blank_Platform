
import {
    fixupConfigRules,
    fixupPluginRules,
} from "@eslint/compat";

import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";

import {
    FlatCompat,
} from "@eslint/eslintrc";

import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/warnings",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "prettier",
    )),
    {
        plugins: {
            react: fixupPluginRules(react),
            "@typescript-eslint": fixupPluginRules(typescriptEslint),
            prettier: fixupPluginRules(prettier),
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jasmine,
                ...globals.jest,
                ...globals.node,
            },

            parser: tsParser,
        },

        settings: {
            react: {
                pragma: "React",
                version: "detect",
            },
        },

        rules: {
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/ban-types": "off",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unnecessary-type-constraint": "off",
            "@typescript-eslint/no-var-requires": "warn",
            "arrow-body-style": ["error", "as-needed"],
            "newline-before-return": "error",
            "no-console": "warn",
            "no-debugger": "warn",
            "no-empty-pattern": "warn",
            "prefer-template": "error",
            "react/display-name": "off",

            "spaced-comment": ["warn", "always", {
                markers: ["/"],
            }],

            "react/jsx-curly-brace-presence": ["error", {
                props: "never",
                children: "ignore",
            }],

            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "react/self-closing-comp": "error",
            curly: ["error", "all"],

            "@typescript-eslint/naming-convention": ["error", {
                selector: "typeAlias",
                format: ["PascalCase"],

                custom: {
                    regex: "Type$",
                    match: true,
                },

                leadingUnderscore: "allow",
                trailingUnderscore: "allow",
            }, {
                selector: "interface",
                format: ["PascalCase"],

                custom: {
                    regex: "^I[A-Z]",
                    match: true,
                },

                leadingUnderscore: "allow",
                trailingUnderscore: "allow",
            }, {
                selector: "enum",
                format: ["PascalCase"],

                custom: {
                    regex: "^[A-Z][a-zA-Z]*Enum$",
                    match: true,
                },

                leadingUnderscore: "allow",
                trailingUnderscore: "allow",
            }, {
                selector: "variable",
                types: ["boolean"],
                format: ["PascalCase"],
                prefix: ["is", "has", "can", "should"],

                filter: {
                    regex: "^(disabled)$",
                    match: false,
                },
            }, {
                selector: "typeProperty",
                types: ["boolean"],
                format: ["PascalCase"],
                prefix: ["is", "has", "can", "should"],

                filter: {
                    regex: "^(disabled)$",
                    match: false,
                },
            }],

            "object-property-newline": ["error", {
                allowAllPropertiesOnSameLine: false,
            }],

            "react/jsx-max-props-per-line": ["error", {
                maximum: 1,
                when: "multiline",
            }],

            "prettier/prettier": ["warn", {
                singleQuote: true,
                tabWidth: 2,
                useTabs: false,
                arrowParens: "avoid",
                semi: false,
                bracketSameLine: true,
            }],

            "import/no-default-export": "warn",

            "import/order": ["error", {
                groups: ["builtin", "external", "internal", "parent", "sibling", "index"],

                alphabetize: {
                    order: "asc",
                    caseInsensitive: false,
                },

                pathGroups: [{
                    pattern: "react",
                    group: "external",
                    position: "before",
                }, {
                    pattern: "@app/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@components/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@constants/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@functions/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@hooks/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@layouts/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@pages/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@services/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@styles/**",
                    group: "internal",
                    position: "before",
                }, {
                    pattern: "@widgets/**",
                    group: "internal",
                    position: "before",
                }],

                pathGroupsExcludedImportTypes: ["builtin", "react"],
            }],
        },
    },
    {
        files: ["**/*.ts", "**/*.js"],

        rules: {
            "no-console": "off",
        },
    },
    {
        files: ["**/*.d.ts"],

        rules: {
            "@typescript-eslint/naming-convention": "off",
        },
    },
    {
        files: ["**/*.js"],

        rules: {
            "import/no-default-export": "off",
            "@typescript-eslint/no-var-requires": "off",
        },
    },
    {
        files: ["**/*.tsx"],

        rules: {
            "no-console": "warn",
        },
    },
    {
        files: ["**/*_Sample*", "**/*_sample*", "**/_Sample/**/*", "**/_sample/**/*"],

        rules: {
            "no-empty-pattern": "off",
            "no-console": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        files: ["**/*.config.js", "**/*.config.ts"],

        rules: {
            "import/no-default-export": "off",
        },
    },
];
