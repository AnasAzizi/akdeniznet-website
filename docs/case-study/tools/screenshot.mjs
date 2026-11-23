import { chromium } from 'playwright-core';
const [,, url, outDir, prefix = "v1"] = process.argv;
const browser = await chromium.launch({ channel: 'chrome' });
const targets = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false },
  { name: 'mobile',  viewport: { width: 390,  height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];
for (const t of targets) {
  const ctx = await browser.newContext({ viewport: t.viewport, deviceScaleFactor: t.deviceScaleFactor, isMobile: t.isMobile, hasTouch: !!t.hasTouch, locale: 'tr-TR' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  // scroll through the page so lazy images load
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += Math.floor(t.viewport.height * 0.8)) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(250); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${outDir}/${prefix}-${t.name}-full.png`, fullPage: true });
  await page.screenshot({ path: `${outDir}/${prefix}-${t.name}-hero.png` });
  console.log(t.name, 'page height', h);
  await ctx.close();
}
await browser.close();
