import { defineConfig } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end tests against the production build (`npm run build` first;
 * `npm run e2e` does both). Uses the installed Chrome, so no Playwright
 * browser download is needed locally or on GitHub's runners.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    locale: "tr-TR",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    {
      name: "mobile",
      // Layout, navigation and accessibility at phone size.
      testMatch: /(pages|a11y|navigation)\.spec\.ts/,
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
