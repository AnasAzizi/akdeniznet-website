import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

import { allPages } from "./routes";

/** WCAG 2.2 A and AA rules (axe-core). */
const scan = (page: Page) =>
  new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

const summary = (violations: Awaited<ReturnType<typeof scan>>["violations"]) =>
  violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
  );

for (const { label, path } of allPages) {
  test(`${label} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(path);
    // Let the hero intro finish so contrast is measured on final colours.
    await page.waitForTimeout(3000);
    const { violations } = await scan(page);
    expect(summary(violations)).toEqual([]);
  });
}

test("plans page with every disclosure open has no violations", async ({
  page,
}) => {
  await page.goto("/tarifeler");
  await page
    .locator("details")
    .evaluateAll((all) => all.forEach((d) => d.setAttribute("open", "")));
  const { violations } = await scan(page);
  expect(summary(violations)).toEqual([]);
});

test("apply form showing errors has no violations", async ({ page }) => {
  await page.goto("/basvuru");
  await page.getByRole("button", { name: "Başvuruyu gönder" }).click();
  await expect(page.getByText("Formda düzeltilmesi gereken")).toBeVisible();
  const { violations } = await scan(page);
  expect(summary(violations)).toEqual([]);
});

test("open mobile menu has no violations", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "The menu button only exists on small screens.",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Menüyü aç" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const { violations } = await scan(page);
  expect(summary(violations)).toEqual([]);
});
