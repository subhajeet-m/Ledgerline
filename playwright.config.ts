import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    globalSetup: "./tests/e2e/global-setup.ts",
    fullyParallel: true,
    reporter: "list",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
    },
    // Default expect() timeout is 5s — too short for this environment's
    // first real hit to any given route, which pays cold Turbopack compile
    // + cold Neon connection cost together (same pattern already seen in
    // Vitest's hook/test timeouts and this file's own webServer timeout).
    expect: {
        timeout: 15000,
    },
    // Points at the system-installed Chrome instead of Playwright's own
    // bundled Chromium build — the bundled download was consistently timing
    // out against Playwright's CDN in this environment, and Chrome is
    // already installed here, so this sidesteps that entirely.
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"], channel: "chrome" },
        },
    ],
    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        // Turbopack compiles routes on first request, not at server start —
        // this machine's dev filesystem has been flagged slow by Next.js
        // itself ("Slow filesystem detected"), so the first real request
        // needs more than the 60s default to finish compiling.
        timeout: 120000,
    },
});
