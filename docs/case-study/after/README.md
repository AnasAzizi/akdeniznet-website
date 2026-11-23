# v2 after (compared with the v1 baseline)

Measured on **23 Nov 2026** against the live v2 deployment, with the same tools and settings as the [baseline](../baseline/README.md).

|        |                                                                                                                                                                                                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL    | https://akdeniznet-website.vercel.app/ (Turkish home page)                                                                                                                                                                                                       |
| Source | branch `v2` / `main`, commit `2910585`                                                                                                                                                                                                                           |
| Tools  | Lighthouse 13.6.0, Chrome 158, Playwright (system Chrome) for screenshots                                                                                                                                                                                        |
| Method | 3 Lighthouse runs per form factor, **median run reported**, range in brackets. Mobile: Lighthouse default emulation (412×823, simulated slow 4G, 4× CPU slowdown); desktop: `--preset=desktop`. `Accept-Language: tr` so the Turkish page is measured, as on v1. |

## Lighthouse scores

|                                  | v1 (2023)  | v2               |
| -------------------------------- | ---------- | ---------------- |
| **Mobile performance**           | 47 (29–51) | **100** (87–100) |
| **Desktop performance**          | 56 (55–60) | **100**          |
| Accessibility (mobile / desktop) | 75 / 87    | **100 / 100**    |
| Best practices                   | 100        | 100              |
| SEO                              | 100        | 69               |

SEO is lower on purpose: v2 is a portfolio redesign of a site Akdeniznet no longer uses, so every page is `noindex`, and the only failing audit is `is-crawlable`. With `site.isPortfolioDemo` off, that audit passes too. v1's 100 is only Lighthouse's basic checklist; it could not see that every price was inside an image.

## Core metrics (median run)

|                          | v1 mobile  | v2 mobile          | v1 desktop       | v2 desktop |
| ------------------------ | ---------- | ------------------ | ---------------- | ---------- |
| First Contentful Paint   | 4.3 s      | **1.0 s**          | 1.5 s            | **0.3 s**  |
| Largest Contentful Paint | 7.2 s      | **1.0 s**          | 2.1 s            | **0.3 s**  |
| Total Blocking Time      | 480 ms     | **70 ms** (40–500) | 70 ms            | **0 ms**   |
| Cumulative Layout Shift  | 0 (0–0.38) | **0**              | 0.50 (0.50–0.74) | **0**      |
| Speed Index              | 10.8 s     | **1.8 s**          | 3.4 s            | **0.6 s**  |

## Page weight

|                                        | v1                                             | v2                                                                             |
| -------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Everything a home-page visit downloads | **81–110 MB**, ~1,100 requests                 | **317 KiB**, 23 requests                                                       |
| Of which: the site's own files         | 4.1 MB, 34 requests                            | 317 KiB                                                                        |
| Speed test on page load                | fast.com ran automatically (~94% of the bytes) | Nothing until the visitor presses Start; at most 66 MB, shown before and after |

A v2 home-page visit is about **0.3%** of a v1 visit.

## Accessibility

|                                   | v1                                                                                            | v2                                                                                                                            |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Lighthouse accessibility failures | 6 audits, 44 elements (contrast, unnamed links, touch targets, untitled iframes, no `<main>`) | 0                                                                                                                             |
| Automated WCAG 2.2 AA scans (axe) | not run                                                                                       | 0 violations on every page in both languages, plus open menus, open disclosures and form errors (`tests/a11y.spec.ts`, in CI) |
| Brand orange                      | white text on `#F37A04`, 2.8:1                                                                | navy text on `#F37A04`, 5.8:1; 28 colour pairs checked in CI                                                                  |

## Screenshots

|                    | v1                                                                                                           | v2                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Desktop, full page | [`v1-desktop-full.jpg`](../baseline/screenshots/v1-desktop-full.jpg)                                         | [`v2-desktop-full.jpg`](screenshots/v2-desktop-full.jpg)                             |
| Mobile, full page  | [`v1-mobile-full.jpg`](../baseline/screenshots/v1-mobile-full.jpg)                                           | [`v2-mobile-full.jpg`](screenshots/v2-mobile-full.jpg)                               |
| First screen       | [desktop](../baseline/screenshots/v1-desktop-hero.png), [mobile](../baseline/screenshots/v1-mobile-hero.png) | [desktop](screenshots/v2-desktop-hero.png), [mobile](screenshots/v2-mobile-hero.png) |

Full Lighthouse reports (median runs): [`lighthouse/v2-mobile.report.html`](lighthouse/v2-mobile.report.html), [`lighthouse/v2-desktop.report.html`](lighthouse/v2-desktop.report.html).

One mobile run scored 87 because of a 500 ms blocking-time spike; the other two scored 100 with 40–70 ms. Lighthouse runs vary, which is why both measurements report the median of three.
