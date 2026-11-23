# Case study: Akdeniznet, three years later

> Draft for the portfolio (English source; Turkish and Arabic versions to follow). Every number comes from [`baseline/`](baseline/README.md) and [`after/`](after/README.md); every fact about the client from [`../content-sources.md`](../content-sources.md). Before publishing, get Akdeniznet's permission to use their name, logo and plans (question 8 there).

**Client:** Akdeniznet, an internet provider for homes and businesses in Mersin, Turkey
**Role:** design and development, solo
**2023:** pitched, built and shipped the site; live for about a year
**2026:** rebuilt from scratch as a portfolio redesign
**Live:** https://akdeniznet-website.vercel.app (portfolio demo; the official site is akdeniznet.com.tr)

## In one paragraph

In 2023 I won Akdeniznet's website by pitching a redesign of their dated site, and it ran in production for about a year before they moved to another agency. Coming back to it three years later, the problems were plain: every visit to the home page downloaded **81–110 MB** because an embedded speed test started by itself, every price lived inside an image, and new customers who clicked a plan landed on a login page. The rebuild is a bilingual Next.js site where a home-page visit is **317 KB**, mobile performance went from **47 to 100**, accessibility from **75 to 100**, and changing a price is one line of data instead of two Photoshop exports and an FTP upload.

## The client and the problem

Akdeniznet serves Mersin with 65 transmitter sites and, in 2023, 8,254 subscribers (8,000 homes, 254 businesses). Their customers mostly arrive on phones, many on mobile data. They sell three kinds of plan: home, symmetric business and asymmetric business.

The original brief was mine: their old site looked dated, so I pitched a new one. Customers used every part of it: plans, speed test, contact form and the link to their customer portal.

## What I built in 2023, and what was wrong with it

The 2023 site was one long static HTML page with Tailwind. It looked modern for its time. Measured again in 2026 (Lighthouse 13, median of three runs):

|                                   | 2023 site                  |
| --------------------------------- | -------------------------- |
| Mobile performance                | 47                         |
| Largest Contentful Paint (mobile) | 7.2 s                      |
| Accessibility                     | 75                         |
| One home-page visit               | 81–110 MB, ~1,100 requests |

What caused it:

1. **The speed test ran on every visit.** The fast.com embed starts measuring as soon as it loads, so every visitor downloaded tens of megabytes from Netflix's servers, about 94% of the page's weight, whether or not they scrolled to it.
2. **Prices were pictures.** All 18 plans were JPGs, each in a desktop and a mobile version. Search engines and screen readers couldn't read them, they couldn't be translated, and every price change meant editing two images and uploading them over FTP. Mistakes crept in: all six asymmetric business plans said "SİMETRİ İNTERNET" (symmetric), and the ₺3,500 plan's file was called `5000.jpg`.
3. **New customers hit a login wall.** Every "apply" button opened the existing-customer portal. There was no way to apply on the site.
4. **The details added up.** White text on the brand orange (2.8:1 contrast), four font families, Tailwind loaded twice, no `<h1>`, `node_modules` committed to git.

The honest lesson: the site worked, but it tied the client to me for every price change and quietly cost their customers data.

## The rebuild

### Content as data

The 18 plans are now typed data, validated with Zod when the site builds. "Symmetric" is computed from the speeds, so the label can never contradict the numbers again, and the subscriber total is computed from its parts. A check that runs in CI renders every plan in both languages and fails on a missing translation. Prices stay labelled "September 2023 price list" until the client confirms current ones; nothing on the site is invented.

### A speed test that asks first

The speed test now runs on Cloudflare's open-source engine and starts only when the visitor presses Start. I capped it at 10 MB requests: Cloudflare's default used 169 MB on an 83 Mbps line, the capped version 66 MB at the same speed, with matching results. The page states the maximum before the test and the actual data used after it.

### A path for new customers

Every plan links to an application form with that plan already selected. The form is validated on the server and shows errors in the visitor's language, then moves focus to the first problem. Existing customers still reach Akdeniznet's own portal, which the site links to instead of imitating.

### Accessible by default, and checked

The brand's orange stayed, but carries navy text (5.8:1) instead of white. A script checks 28 colour pairs against WCAG AA in CI. Automated WCAG 2.2 AA scans (axe) run on every page in both languages, including the open mobile menu and a form showing errors. Motion respects reduced-motion settings, and nothing stays hidden without JavaScript.

### Motion that earns its place

The brand's logo has signal waves above the "i", so the home page opens with waves spreading from a transmitter and sites lighting up one by one. It's pure CSS that plays with the first paint, once. The headline blurs in at full opacity, so it never delays the Largest Contentful Paint. Below the fold, GSAP loads only after the page has loaded (never with reduced motion) and counts up the stats and grows the comparison bars.

### Bilingual

Turkish lives at `/` and English at `/en`, with translated URLs (`/tarifeler` ↔ `/en/plans`) and hreflang links between them.

## Results

|                                   | 2023                | 2026                                                                                 |
| --------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| Mobile performance                | 47                  | **100**                                                                              |
| Desktop performance               | 56                  | **100**                                                                              |
| Accessibility                     | 75                  | **100**                                                                              |
| Largest Contentful Paint (mobile) | 7.2 s               | **1.0 s**                                                                            |
| Layout shift (desktop)            | 0.50                | **0**                                                                                |
| One home-page visit               | 81–110 MB           | **317 KB**                                                                           |
| Requests                          | ~1,100              | **23**                                                                               |
| Changing a price                  | 2 image edits + FTP | **1 line of data**                                                                   |
| Languages                         | Turkish             | **Turkish, English**                                                                 |
| Automated checks                  | none                | **lint, types, translations, contrast, data, 71 end-to-end and accessibility tests** |

## Stack

Next.js 16 (App Router, Cache Components, every page prerendered), TypeScript, Tailwind CSS 4, shadcn/ui conventions, next-intl, GSAP, Zod, Cloudflare's speed test engine, Playwright with axe, hosted on Vercel.

## What I'd do next

- A small content editor so Akdeniznet's staff could change prices themselves (the data model is ready for one).
- Arabic with a right-to-left layout: Mersin has a large Arabic-speaking community, and the layout already uses logical CSS properties.
- Real coverage information per neighbourhood, if the client can share it.

## Assets for the portfolio page

- Before/after screenshots: [`baseline/screenshots/`](baseline/screenshots/) and [`after/screenshots/`](after/screenshots/)
- Lighthouse reports: [`baseline/lighthouse/`](baseline/lighthouse/) and [`after/lighthouse/`](after/lighthouse/)
- Worth recording as short clips: the hero animation, the plans page on a phone, a speed test run.
