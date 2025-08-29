import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            // Allow exporting non-components from files with components
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            // Prettier rules
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    tabWidth: 4,
                    printWidth: 100,
                },
            ],
            "arrow-body-style": "off",
            "prefer-arrow-callback": "off",
        },
    },
]);
