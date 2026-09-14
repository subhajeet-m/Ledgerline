import dotenv from "dotenv";

// The Playwright test runner is a separate Node process from the Next.js
// dev server it starts — the dev server loads .env itself, but nothing
// loads it into the test-runner process. Any test file that imports
// @/lib/prisma directly (not just via page.* browser actions) needs this,
// same reasoning as tests/setup.ts for Vitest.
export default function globalSetup() {
    dotenv.config({ path: ".env.local" });
    dotenv.config({ path: ".env" });
}
