# v1 baseline (before the rebuild)

Measured on **23 Nov 2026** against the live v1 deployment, so the rebuild can be compared like-for-like later.

|        |                                                                                                                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL    | https://akdeniznet-website.vercel.app/                                                                                                                                                                    |
| Source | tag `v1-2023` (commit `2fe83fb`)                                                                                                                                                                          |
| Tools  | Lighthouse 13.6.0, Chrome 158, Playwright (system Chrome) for screenshots                                                                                                                                 |
| Method | 3 Lighthouse runs per form factor, **median run reported**, range in brackets. Mobile uses Lighthouse's default emulation (412×823, simulated slow 4G, 4× CPU slowdown); desktop uses `--preset=desktop`. |

## Lighthouse scores

|             | Performance    | Accessibility | Best practices | SEO |
| ----------- | -------------- | ------------- | -------------- | --- |
| **Mobile**  | **47** (29–51) | **75**        | 100            | 100 |
| **Desktop** | **56** (55–60) | **87**        | 100            | 100 |

## Core metrics (median run)

|         | FCP   | LCP                 | TBT    | CLS                  | Speed Index |
| ------- | ----- | ------------------- | ------ | -------------------- | ----------- |
| Mobile  | 4.3 s | **7.2 s** (7.0–9.5) | 480 ms | 0 (0–0.38)           | 10.8 s      |
| Desktop | 1.5 s | 2.1 s               | 70 ms  | **0.50** (0.50–0.74) | 3.4 s       |

"Good" thresholds: LCP ≤ 2.5 s, CLS ≤ 0.1. Mobile LCP is almost 3× the limit; desktop CLS is 5× the limit.

## Page weight: the headline finding

|                                                     | Transferred   | Requests         |
| --------------------------------------------------- | ------------- | ---------------- |
| The site's own files (HTML, CSS, JS, images, video) | 4.1 MB        | 34               |
| **Everything a visit actually downloads**           | **81–110 MB** | **~1,090–1,180** |

**About 94% of every visit is the embedded speed test.** The `fast.com` iframe in the "Hız Testi" section has no `loading="lazy"`, and fast.com starts measuring as soon as it loads. So every visitor runs a full speed test against Netflix's servers (`*.oca.nflxvideo.net`) the moment the home page opens, whether or not they scroll to it. On a metered mobile plan, that costs roughly 80–110 MB per visit (measured on a fast connection; how much fast.com downloads depends on the line's speed).

The site's own 4.1 MB is also heavy:

- **Plan images:** 36 files, 6.1 MB on disk. Each plan exists as a 1280×2250 desktop JPG and a separate mobile JPG.
- **Videos:** 2 MP4s, 6.5 MB.
- **Hero backgrounds:** 3 images of about 230–260 KB each.

## Accessibility failures (Lighthouse, mobile)

| Audit                                                                          | Elements |
| ------------------------------------------------------------------------------ | -------- |
| Colour contrast too low (brand orange `#F37A04` text; white on orange ≈ 2.8:1) | 13       |
| Links without a discernible name                                               | 24       |
| Touch targets too small or too close                                           | 3        |
| `<iframe>` without a title (speed test, map)                                   | 2        |
| Button without an accessible name                                              | 1        |
| No `<main>` landmark                                                           | 1        |

SEO scores 100 only because Lighthouse checks the basics (title, meta description, `lang`, crawlable links). It can't see that **every price and plan detail is inside an image** that search engines and screen readers can't read.

## Code audit (`public/index.html`)

| Issue                                                                                                     | Count           |
| --------------------------------------------------------------------------------------------------------- | --------------- |
| Plan images with meaningless alt text (`alt="item-1"` …)                                                  | 36 of 48 images |
| Links to the customer-portal **login** (all 36 plan images, all 3 "Hemen Başvur" buttons, plus nav links) | 41              |
| `<h1>` elements (all four are stat counters; the page has no real H1 title)                               | 4               |
| Duplicate IDs (`Tarifelerimiz`, `hiz-testi`)                                                              | 2               |
| Inline `onclick` handlers                                                                                 | 3               |
| Tailwind loaded twice (runtime CDN `cdn.tailwindcss.com` + compiled `style.css`)                          | 1               |
| Unpinned CDN dependency (`tw-elements` from jsDelivr with no version)                                     | 1               |
| Font families loaded (Alata, Josefin Sans, Lobster, Roboto) + full Font Awesome                           | 4 + 1           |

### Repository

- **No `.gitignore`.** `node_modules` (4,324 files) has been committed since the June 2025 build fix (`8db13ca`), along with `.DS_Store`.
- **No linting, formatting, type checking or CI.** The only script is the Tailwind build.

### UX findings

- **New customers hit a login wall.** Every plan card and "Hemen Başvur" (apply now) button sends a prospective customer to the existing-customer portal login. There is no way to apply for a plan on the site itself.
- **Counters animate on page load**, before anyone scrolls down to see them.
- **The services section mentions both a transmitter network and fiber** ("Fiber İnternet", "Modem Kurulumu"), and the stats show 65 transmitter points. The v2 copy should describe both, not "wireless" only.

## Screenshots

|                              |                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Desktop 1440 px, full page   | [`screenshots/v1-desktop-full.jpg`](screenshots/v1-desktop-full.jpg)                                             |
| Mobile 390 px @2x, full page | [`screenshots/v1-mobile-full.jpg`](screenshots/v1-mobile-full.jpg)                                               |
| First screen                 | [`v1-desktop-hero.png`](screenshots/v1-desktop-hero.png), [`v1-mobile-hero.png`](screenshots/v1-mobile-hero.png) |

The speed test and map are cross-origin iframes, so full-page captures show them blank.

Full Lighthouse reports (median runs): [`lighthouse/v1-mobile.report.html`](lighthouse/v1-mobile.report.html), [`lighthouse/v1-desktop.report.html`](lighthouse/v1-desktop.report.html).

## Decision: speed test library for v2

`@cloudflare/speedtest` **v1.17.0**: **MIT licence**, actively maintained (last push 9 Nov 2026), and the engine behind speed.cloudflare.com.

- **It runs only when the visitor presses Start,** which removes the 81–110 MB auto-download.
- **The live API (`onResultsChange`, `play()`/`pause()`)** can drive a GSAP gauge directly.
- **Privacy:** the README says results are collected by Cloudflare on completion for aggregated insights. The speed test UI must say so in one line.
- **Endpoints:** by default it measures against `speed.cloudflare.com`. A real ISP deployment would point `measurementTargets` at its own servers, which is more meaningful for "how fast is my Akdeniznet line". For the portfolio demo, the default endpoints are fine.
- **Packet loss** needs TURN server credentials, so it stays out of scope. We'll measure download, upload, latency and jitter only.

## Reproducing (for the "after" measurements)

```bash
npx -y lighthouse@13.6.0 <url> --chrome-flags="--headless=new" --output=json --output=html --output-path=./mobile-1
npx -y lighthouse@13.6.0 <url> --preset=desktop --chrome-flags="--headless=new" --output=json --output=html --output-path=./desktop-1
node docs/case-study/tools/screenshot.mjs <url> <out-dir> v2   # needs playwright-core; uses installed Chrome
```

Run each Lighthouse command 3 times and report the median, as above.
