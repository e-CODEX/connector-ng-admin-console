import { defineConfig, devices } from "@playwright/test";

// The suite runs against test/e2e/support/mock-backend.mts, not a real connector backend.
process.env.E2E_USER ??= "e2e-admin";
process.env.E2E_PASSWORD ??= "E2e-Passw0rd!";

const MOCK_BACKEND_PORT = Number(process.env.E2E_MOCK_BACKEND_PORT ?? 30999);
const APP_PORT = Number(process.env.E2E_APP_PORT ?? 3100);
const APP_URL = `http://localhost:${APP_PORT}`;
const DIST_DIR = ".next-e2e";

// CI runs the production build the same way the Dockerfile does: the standalone server,
// with static assets and public/ copied next to it (`next start` doesn't support standalone).
const STANDALONE = `${DIST_DIR}/standalone`;
const PROD_SERVER_COMMAND = [
    "npm run build",
    `mkdir -p ${STANDALONE}/${DIST_DIR}/static ${STANDALONE}/public`,
    `cp -r ${DIST_DIR}/static/. ${STANDALONE}/${DIST_DIR}/static/`,
    `cp -r public/. ${STANDALONE}/public/`,
    `node ${STANDALONE}/server.js`,
].join(" && ");

export default defineConfig({
    testDir: "./test/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI
        ? [["github"], ["html", { open: "never" }]]
        : "list",
    use: {
        baseURL: APP_URL,
        // A visible browser locally; headless on CI (no display there).
        headless: !!process.env.CI,
        trace: "on-first-retry",
    },
    projects: [
        { name: "setup", testMatch: /auth\.setup\.ts/ },
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "test/e2e/.auth/user.json",
            },
            dependencies: ["setup"],
        },
    ],
    webServer: [
        {
            command: "node test/e2e/support/mock-backend.mts",
            url: `http://localhost:${MOCK_BACKEND_PORT}/actuator/health`,
            env: {
                E2E_MOCK_BACKEND_PORT: String(MOCK_BACKEND_PORT),
                E2E_USER: process.env.E2E_USER,
                E2E_PASSWORD: process.env.E2E_PASSWORD,
            },
            reuseExistingServer: !process.env.CI,
            timeout: 10_000,
        },
        {
            command: process.env.CI
                ? PROD_SERVER_COMMAND
                : `npm run dev -- --port ${APP_PORT}`,
            url: `${APP_URL}/login`,
            env: {
                CONNECTOR_API_URL: `http://localhost:${MOCK_BACKEND_PORT}`,
                NEXT_DIST_DIR: DIST_DIR,
                // Required by the app; the mock backend doesn't check them. Real env vars (e.g. from CI) win.
                BASIC_AUTH_USER: process.env.BASIC_AUTH_USER ?? "e2e-actuator",
                BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD ?? "e2e-actuator-password",
                PORT: String(APP_PORT),
                HOSTNAME: "localhost",
            },
            reuseExistingServer: !process.env.CI,
            timeout: 300_000,
        },
    ],
});
