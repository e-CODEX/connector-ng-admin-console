import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { fixStyle: "inline-type-imports" },
            ],
        },
    },
    globalIgnores([
        ".next/**",
        "dist/**",
        "build/**",
        "out/**",
        "coverage/**",
        "test-results/**",
        "next-env.d.ts",
        "*.config.*",
        "public/**",
    ]),
]);
