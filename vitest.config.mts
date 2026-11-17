import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./test/setup/vitest.setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["test/e2e/**", "node_modules/**"],
        clearMocks: true,
    },
    resolve: {
        alias: {
            "@test": fileURLToPath(new URL("./test", import.meta.url)),
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
