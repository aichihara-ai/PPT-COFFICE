import js from "@eslint/js"
import eslintConfigNext from "eslint-config-next/core-web-vitals"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "vendor/**",
            "generated/**",
            "theme-packages/**",
            "scripts/**",
        ],
    },
    js.configs.recommended,
    ...eslintConfigNext,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    }
)
