import { expect, test } from "@playwright/test";

import { allPages } from "./routes";

for (const { label, path, lang } of allPages) {
  test(`${label} renders correctly`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Akdeniznet/);

    // Canonical URL and both language alternates, and no indexing while a demo.
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(
      page.locator('link[rel="alternate"][hreflang="tr"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );

    // The portfolio-demo banner points to the official site.
    await expect(
      page.locator('a[href="https://www.akdeniznet.com.tr"]'),
    ).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow, "horizontal scrolling").toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("unknown paths show the localized 404 page", async ({ page }) => {
  const tr = await page.goto("/boyle-bir-sayfa-yok");
  expect(tr?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  await expect(page.locator("h1")).toHaveCount(1);

  const en = await page.goto("/en/no-such-page");
  expect(en?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("sitemap lists every page in both languages with its translations", async ({
  request,
}) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  expect(urls.sort()).toEqual(
    [
      "/",
      "/en",
      "/tarifeler",
      "/en/plans",
      "/basvuru",
      "/en/apply",
      "/hiz-testi",
      "/en/speed-test",
      "/iletisim",
      "/en/contact",
    ].sort(),
  );
  expect(xml).toContain('hreflang="x-default"');
});

test("robots.txt allows crawling (so noindex is seen) and hides the sitemap while a demo", async ({
  request,
}) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).not.toContain("Sitemap:");
});

test("home page describes the business as schema.org LocalBusiness", async ({
  page,
}) => {
  await page.goto("/");
  const json = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const data = JSON.parse(json ?? "{}");
  expect(data).toMatchObject({
    "@type": "LocalBusiness",
    name: "Akdeniznet",
    url: "https://www.akdeniznet.com.tr",
    telephone: "+908504718783",
    address: { addressRegion: "Mersin", addressCountry: "TR" },
  });
  expect(data.openingHoursSpecification).toHaveLength(2);
});
