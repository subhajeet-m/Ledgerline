import { prisma } from "@/lib/prisma";
import test, { expect } from "@playwright/test";

test("signup lands on the dashboard with 0 balance", async ({page})=>{
    await page.goto("/signup");
    await page.getByLabel("Name").fill("E2E Test User");
    await page.getByLabel("Email").fill(`e2e-${crypto.randomUUID()}@gmail.com`);
    await page.getByLabel("Password", { exact: true }).fill("Passw0rd!");
    await page.getByLabel("Confirm Password").fill("Passw0rd!");
    await page.getByRole("button", {name: "Sign Up"}).click();

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("₹0.00")).toBeVisible();
})

test("full flow: two signups, a seeded balance, a transfer, and it showing up everywhere", async ({ page }) => {
    // Two signups, two sign-outs, a sign-in, a transfer, and two page loads —
    // each pays this environment's per-request cold-compile/cold-connection
    // cost, so the default 30s test timeout is too tight for this one test.
    test.setTimeout(90000);

    // --- Sign up the sender ---
    const senderEmail = `e2e-sender-${crypto.randomUUID()}@gmail.com`;
    await page.goto("/signup");
    await page.getByLabel("Name").fill("E2E Sender");
    await page.getByLabel("Email").fill(senderEmail);
    await page.getByLabel("Password", { exact: true }).fill("Passw0rd!");
    await page.getByLabel("Confirm Password").fill("Passw0rd!");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page).toHaveURL("/dashboard");

    // Sign out the sender before signing up the recipient — signup's own
    // (auth) layout redirects an already-authenticated visitor away from
    // /signup, so a second signup can't happen while still logged in as
    // the first user.
    await page.getByRole("button", { name: "Sign Out" }).click();
    await expect(page).toHaveURL("/signin");

    // --- Sign up the recipient ---
    const recipientName = "E2E Recipient";
    const recipientEmail = `e2e-recipient-${crypto.randomUUID()}@gmail.com`;
    await page.goto("/signup");
    await page.getByLabel("Name").fill(recipientName);
    await page.getByLabel("Email").fill(recipientEmail);
    await page.getByLabel("Password", { exact: true }).fill("Passw0rd!");
    await page.getByLabel("Confirm Password").fill("Passw0rd!");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page).toHaveURL("/dashboard");

    await page.getByRole("button", { name: "Sign Out" }).click();
    await expect(page).toHaveURL("/signin");

    const senderUser = await prisma.user.findUniqueOrThrow({
        where: {
            email: senderEmail
        },
        include: {
            wallet: true,
        },
    });

    await prisma.wallet.update({
        where: {
            id: senderUser.wallet?.id,
        },
        data: {
            balance: 10000.00,
        },
    });

    // --- Sign back in as the sender ---
    await page.getByLabel("Email").fill(senderEmail);
    await page.getByLabel("Password").fill("Passw0rd!");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/dashboard");

    // --- Send a transfer to the recipient ---
    await page.goto("/transfer");
    await page.getByLabel("Recipient Email").fill(recipientEmail);
    await page.getByLabel("Amount").fill("100");
    await page.getByRole("button", { name: "Transfer" }).click();
    await expect(page).toHaveURL("/dashboard");

    await expect(page.getByText("₹9,900.00")).toBeVisible();

    // --- Confirm it shows up in the transaction list ---
    await page.goto("/transactions");
    await expect(page.getByText("Sent to")).toBeVisible();
    await expect(page.getByText(recipientName)).toBeVisible();
});