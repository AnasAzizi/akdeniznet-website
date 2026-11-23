import { expect, test } from "@playwright/test";

test("skip link is the first stop and moves focus to the main content", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "İçeriğe geç" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("language switch keeps the current page", async ({ page }, testInfo) => {
  await page.goto("/tarifeler");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Menüyü aç" }).click();
  }
  await page
    .getByRole("link", { name: "Switch to English" })
    .locator("visible=true")
    .first()
    .click();
  await expect(page).toHaveURL(/\/en\/plans$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Plans");
  // A full page load: no hidden copy of the Turkish page stays mounted.
  await expect(page.locator("main")).toHaveCount(1);
});

test("mobile menu opens, closes with Escape and returns focus", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "The menu button only exists on small screens.",
  );
  await page.goto("/");
  const open = page.getByRole("button", { name: "Menüyü aç" });
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Tarifeler" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

test("mobile menu link navigates and closes the menu", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "The menu button only exists on small screens.",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Menüyü aç" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Hız testi" })
    .click();
  await expect(page).toHaveURL(/\/hiz-testi$/);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("plan card links preselect the plan in the application form", async ({
  page,
}) => {
  await page.goto("/tarifeler");
  await page
    .getByRole("link", { name: /^Başvur: Metro 50 50\/50 Mbps/ })
    .click();
  await expect(page).toHaveURL(/\/basvuru\?plan=metro-50$/);
  await expect(page.getByLabel("Tarife", { exact: true })).toHaveValue(
    "metro-50",
  );
});
