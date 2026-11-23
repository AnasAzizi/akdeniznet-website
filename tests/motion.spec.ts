import { expect, type Page, test } from "@playwright/test";

/**
 * Motion must never hide content: it plays with normal motion, is skipped
 * under reduced motion, and the page is complete without JavaScript.
 * GSAP itself must load only after the page has loaded, or not at all.
 */

/** Records when a script containing GSAP's ScrollTrigger is downloaded. */
function watchGsap(page: Page) {
  const loads: number[] = [];
  page.on("response", async (response) => {
    if (!response.url().endsWith(".js")) return;
    const body = await response.text().catch(() => "");
    if (body.includes("ScrollTrigger")) loads.push(Date.now());
  });
  return loads;
}

async function scrollToBottom(page: Page) {
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y <= height; y += 300) {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: "instant" }),
      y,
    );
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(2500);
}

const state = (page: Page) =>
  page.evaluate(() => ({
    hidden: [
      ...document.querySelectorAll("[data-reveal], [data-reveal] > *"),
    ].filter((element) => Number(getComputedStyle(element).opacity) < 0.99)
      .length,
    counters: [...document.querySelectorAll("[data-count-to]")].map(
      (e) => e.textContent,
    ),
  }));

const finalCounters = ["65", "8.000", "254"];

test("normal motion: content reveals, counters finish, GSAP loads after the page", async ({
  page,
}) => {
  const gsapLoads = watchGsap(page);
  await page.goto("/");
  const loadedAt = Date.now();
  await expect(page.locator("h1")).toHaveCSS("animation-name", "intro-blur");

  await page.waitForTimeout(2500);
  expect(gsapLoads.length, "GSAP downloaded").toBeGreaterThan(0);
  expect(gsapLoads[0]).toBeGreaterThanOrEqual(loadedAt);

  await scrollToBottom(page);
  expect(await state(page)).toEqual({ hidden: 0, counters: finalCounters });

  await page.goto("/tarifeler");
  await scrollToBottom(page);
  expect((await state(page)).hidden).toBe(0);
  const bars = await page
    .locator("[data-bar]")
    .evaluateAll((all) =>
      all.map((bar) =>
        new DOMMatrix(getComputedStyle(bar).transform).a.toFixed(2),
      ),
    );
  // Metro 50 (50/50) and Eko Paket 50/20.
  expect(bars).toEqual(["1.00", "1.00", "1.00", "0.40"]);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing animates, nothing is hidden, GSAP is never downloaded", async ({
    page,
  }) => {
    const gsapLoads = watchGsap(page);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCSS("animation-name", "none");
    await page.waitForTimeout(2500);
    expect(await state(page)).toEqual({ hidden: 0, counters: finalCounters });
    expect(gsapLoads).toEqual([]);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every page is complete", async ({ page }) => {
    for (const path of ["/", "/tarifeler"]) {
      await page.goto(path);
      expect(await state(page)).toMatchObject({ hidden: 0 });
    }
    expect((await state(page)).counters).toEqual([]);
    await page.goto("/");
    expect((await state(page)).counters).toEqual(finalCounters);
  });
});
