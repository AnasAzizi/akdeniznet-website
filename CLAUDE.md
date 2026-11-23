# CLAUDE.md

Portfolio rebuild of **Akdeniznet**, an internet provider for homes and businesses in Mersin (Turkey), originally built in 2023 as a freelance project. **Audience:** Akdeniznet's customers (Turkish, many on phones); the case study speaks to employers. **Locales:** `tr` (default, unprefixed), `en` (`/en`). **Feel:** clear, local, trustworthy; brand blue with one orange call to action.

The roadmap: Phase 0 baseline (done) → 1 foundation (done) → 2 plan data model → 3 pages → 4 motion → 5 quality → 6 ship and case study. The "before" measurements are in `docs/case-study/baseline/README.md`; keep the "after" measurements comparable (same tools and settings).

## Workflow

- Work on the **`v2`** branch. `main` holds v1, which is still deployed; never push to `main` or rewrite pushed history.
- Before calling a task done, run `npm run check` and `npm run build`; all must pass.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`). Commit or push only when asked.
- Explain important technical decisions briefly, and push back when a better option exists.

## Next.js 16.4

- Read the bundled guide in `node_modules/next/dist/docs/` before writing Next.js code (see `AGENTS.md`). `cacheComponents` is on; Tailwind runs through a Turbopack loader (no PostCSS config); locale routing lives in `src/proxy.ts`.
- Server Components by default. Add `"use client"` only for state, effects or browser APIs; pass translated strings to client components as props (`NextIntlClientProvider messages={null}`).
- Every page is prerendered per locale. The locale comes from the `[locale]` root param (`src/i18n/request.ts`). Reading the clock needs `"use cache"` (see `CurrentYear`).
- Every page exports `generateMetadata` with `alternates: alternatesFor(pathname, locale)`.
- Keep it portable: nothing Vercel-only, so `output: "standalone"` can run on any Node host.

## Internationalization

- All user-facing text goes in `messages/{tr,en}.json`; add each key to both files (`npm run i18n:check`). Turkish is the source language. Locale-independent facts (phone, address, hours, URLs) live in `src/data/site.ts`.
- New pages: add the pathname to `src/i18n/routing.ts` with its English slug, and link with `Link` from `@/i18n/navigation`.
- Use logical CSS only (`ms-* me-* ps-* pe-* start-* end-*`), so Arabic (RTL) can be added later.
- Turkish casing: `lang` is set per locale so `uppercase` turns `i` into `İ`; never uppercase strings in JavaScript.

## Design

- Use semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, `bg-cta`, `text-cta-ink`, `bg-inverse`…). Brand scales (`sea-*`, `sun-*`, `sand-*`) are for illustrations only.
- **Orange (`--cta`) is a background for navy text, never small text on light backgrounds.** Use `text-cta-ink` for orange text. One orange CTA per screen.
- Any token change must pass `npm run contrast:check` (it reads `:root` in `globals.css`).
- Type scale: `text-display`, `text-h1`…`text-h3`, `text-lead`, `text-eyebrow`. Use `tabular-nums` for prices and speeds.
- Buttons: `Button` / `buttonVariants` (native elements). Touch targets ≥ 44px for buttons, ≥ 24px for text links.
- Prefer native primitives for overlays (`<dialog>` for the mobile menu).
- Mobile-first; check 375, 768 and 1440.

## Motion

- GSAP never loads before first paint: all JS motion lives in `src/lib/motion-runtime.ts`, imported lazily by `MotionProvider`, and never under reduced motion. Server Components only emit data attributes (`Reveal` → `[data-reveal]`).
- Animate only `transform`, `opacity` and `filter`. No scroll hijacking or long pinned scenes.
- Content must never stay hidden if JavaScript fails (`motion-ok` is removed after 4 s without `motion-ready`).

## Content and data

- **Never invent facts, stats, prices or testimonials.** Real data comes from the v1 site (tag `v1-2023`) or from Akdeniznet. v1 prices are from 2023: label them as such until the client confirms current ones.
- While `site.isPortfolioDemo` is true: keep the demo banner and `noindex`, and forms must not send anything to Akdeniznet.
- Customer login is Akdeniznet's own portal (`site.portalUrl`): link to it, never copy it.

## Never

- Hard-code user-facing text, use physical direction classes, use raw `<img>` or raw `<a>` for internal links.
- Use `any`, `@ts-ignore`, or disable lint rules to pass checks.
- Add a dependency without explaining why. Commit `.env*` files (except `.env.example`).
