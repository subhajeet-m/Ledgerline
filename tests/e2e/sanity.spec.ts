import { test, expect } from "@playwright/test";

test("home page redirects toward auth", async ({ page }) => {
    await page.goto("/");
    // Unauthenticated visitor should end up redirected to signin.
    await expect(page).toHaveURL(/\/signin/);
});
