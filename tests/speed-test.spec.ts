import { expect, test } from "@playwright/test";

/**
 * Runs the speed test against a simulated 40/20 Mbps line: requests to
 * Cloudflare are answered locally after a delay matching their size, so
 * the engine's timing works and no real traffic leaves the machine.
 */
const DOWN_BPS = 40e6;
const UP_BPS = 20e6;
const LATENCY_MS = 25;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("nothing is measured until Start; then it runs to completion", async ({
  page,
}) => {
  test.setTimeout(120_000);
  let simulated = 0;

  await page.route(/cloudflare\.com/, async (route) => {
    simulated++;
    const request = route.request();
    const url = new URL(request.url());
    const headers = {
      "Timing-Allow-Origin": "*",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    };
    if (url.pathname.includes("__down")) {
      const bytes = Number(url.searchParams.get("bytes") ?? 0);
      await sleep(LATENCY_MS + (bytes * 8 * 1000) / DOWN_BPS);
      return route.fulfill({ status: 200, headers, body: Buffer.alloc(bytes) });
    }
    if (url.pathname.includes("__up")) {
      const bytes = request.postDataBuffer()?.length ?? 0;
      await sleep(LATENCY_MS + (bytes * 8 * 1000) / UP_BPS);
      return route.fulfill({ status: 200, headers, body: "" });
    }
    // Result logging and anything else.
    return route.fulfill({
      status: 200,
      headers,
      contentType: "application/json",
      body: "{}",
    });
  });

  await page.goto("/hiz-testi");
  await page.waitForTimeout(1500);
  expect(simulated, "requests before Start").toBe(0);

  await page.getByRole("button", { name: "Testi başlat" }).click();
  const status = page.locator("[data-phase]");
  await expect(status).toHaveAttribute("data-phase", "download", {
    timeout: 15_000,
  });

  // The dial eases between updates rather than jumping.
  const readings = new Set<string>();
  for (let i = 0; i < 12; i++) {
    readings.add(
      (await page.locator(".text-display.leading-none").textContent()) ?? "",
    );
    await page.waitForTimeout(150);
  }
  expect(readings.size).toBeGreaterThan(3);

  await expect(status).toHaveAttribute("data-phase", "done", {
    timeout: 90_000,
  });
  const download = Number(
    (await page.locator("dd").first().textContent())
      ?.replace(/[^\d,]/g, "")
      .replace(",", "."),
  );
  expect(download).toBeGreaterThan(25);
  expect(download).toBeLessThan(45);
  await expect(
    page.getByText(/Bu test yaklaşık \d+ MB veri kullandı/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Tekrar test et" }),
  ).toBeEnabled();
});
