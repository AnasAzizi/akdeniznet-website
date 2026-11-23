# Akdeniznet website, v2

A rebuild of the website I designed and built in 2023 for **Akdeniznet**, an internet provider for homes and businesses in Mersin, Turkey. v1 was live on akdeniznet.com.tr for about a year. This version is a portfolio redesign: it is **not** Akdeniznet's official site, and says so on every page.

- **v1 (2023):** static HTML and Tailwind, preserved at tag [`v1-2023`](../../tree/v1-2023).
- **Before/after measurements:** [`docs/case-study/baseline`](docs/case-study/baseline/README.md).

## Stack

|           |                                                                                               |
| --------- | --------------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Cache Components, every page prerendered)                             |
| Language  | TypeScript (strict)                                                                           |
| Styling   | Tailwind CSS 4 (via Turbopack), shadcn/ui conventions, design tokens in `src/app/globals.css` |
| i18n      | next-intl: Turkish at `/`, English at `/en`, with localized URLs (`/tarifeler` ↔ `/en/plans`) |
| Motion    | GSAP, loaded only after first paint and never under reduced motion                            |
| Icons     | Lucide                                                                                        |

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for production builds.

## Scripts

| Command                           | What it does                                               |
| --------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                     | Development server                                         |
| `npm run build`                   | Production build                                           |
| `npm run lint`                    | ESLint                                                     |
| `npm run typecheck`               | Route types + `tsc --noEmit`                               |
| `npm run format` / `format:check` | Prettier (with Tailwind class sorting)                     |
| `npm run i18n:check`              | Every English message key exists in Turkish and vice versa |
| `npm run contrast:check`          | Every color pair the design uses meets WCAG 2.2 AA         |
| `npm run data:check`              | Validates the plan data and renders it in every language   |
| `npm run check`                   | All of the checks above except the build                   |
| `npm run e2e`                     | Production build, then the Playwright suite                |
| `npm run test:e2e`                | Playwright suite against an existing build                 |

CI runs all of them, the build and the end-to-end suite on every push and pull request.

The end-to-end suite (`tests/`) runs in the installed Google Chrome against the production build, at desktop and phone sizes. It covers every page in both languages, WCAG 2.2 AA with axe, keyboard and menu navigation, both forms, motion with normal motion, reduced motion and JavaScript off, and the speed test on a simulated 40/20 Mbps line (no real traffic). Stop `npm run dev` first: the build and the dev server share `.next/`.

## Structure

```
messages/{tr,en}.json     All user-facing text (Turkish is the source)
docs/content-sources.md   Where every fact comes from, and questions for the client
scripts/                  CI checks (messages, contrast, data)
src/app/[locale]/         Pages (one route per page, prerendered per locale)
src/components/layout/    Header, footer, navigation, demo banner
src/components/motion/    Server-side motion markers + the lazy motion loader
src/components/ui/        shadcn/ui-style primitives
src/data/                 Locale-independent facts: plans (Zod-validated), stats,
                          highlights, contact details, hours, links
src/i18n/                 Locales, localized pathnames, navigation helpers
src/lib/motion-runtime.ts All GSAP code, imported lazily
src/proxy.ts              Locale routing (Next 16's renamed middleware)
tests/                    Playwright end-to-end and accessibility tests
```
