import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "single"],
            "no-unused-vars": "warn",
            "no-console": "off",
        },
    },
];
