# CLAUDE.md

Portfolio rebuild of **Akdeniznet**, an internet provider for homes and businesses in Mersin (Turkey), originally built in 2023 as a freelance project. **Audience:** Akdeniznet's customers (Turkish, many on phones); the case study speaks to employers. **Locales:** `tr` (default, unprefixed), `en` (`/en`). **Feel:** clear, local, trustworthy; brand blue with one orange call to action.

The roadmap: Phase 0 baseline (done) → 1 foundation (done) → 2 plan data model (done) → 3 pages (done) → 4 motion (done) → 5 quality → 6 ship and case study. The "before" measurements are in `docs/case-study/baseline/README.md`; keep the "after" measurements comparable (same tools and settings).

## Workflow

- Work on the **`v2`** branch. `main` holds v1, which is still deployed; never push to `main` or rewrite pushed history.
- Before calling a task done, run `npm run check` and `npm run build`; all must pass. `next build` and `next dev` share `.next/`: stop the dev server before a build (or restart it afterwards). If a `globals.css` change doesn't show up in dev, restart the dev server (the Tailwind loader can miss it).
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

- GSAP never loads before first paint: all JS motion lives in `src/lib/motion-runtime.ts`, imported lazily by `MotionProvider`, and never under reduced motion. Server Components only emit data attributes: `Reveal` → `[data-reveal]`, `[data-count-to]` (counters; pair with an `sr-only` final value), `[data-bar]` (scaleX bars). Use them only below the fold.
- Above-the-fold motion (the home hero and signal graphic) is pure CSS keyframes in `globals.css` (`[data-intro]`, `.signal-graphic`): it plays with the first paint, once, and never under reduced motion. The LCP headline blurs in at full opacity; never start it at `opacity: 0`.
- Background browser tabs pause animation frames and scroll events, so GSAP can't be tested in a hidden tab: check motion in a foreground tab or headless Chrome.
- Animate only `transform`, `opacity` and `filter`. No scroll hijacking or long pinned scenes.
- Content must never stay hidden if JavaScript fails (`motion-ok` is removed after 4 s without `motion-ready`).

## Content and data

- **Never invent facts, stats, prices or testimonials.** Real data comes from the v1 site (tag `v1-2023`) or from Akdeniznet; `docs/content-sources.md` records the source of every fact and the open questions for the client. v1 prices are from September 2023: show `Plans.pricesAsOf` next to prices until `planSource.confirmed` is true.
- Plans, stats and highlights live in `src/data/` (Zod-validated on import; `npm run data:check` also renders every message in both locales). Never store what can be derived: symmetric/asymmetric comes from the speeds, the subscriber total from its parts.
- Don't claim wireless or fiber technology until Akdeniznet confirms it.
- Format prices with the named `price` format (`{price, number, price}` or `format.number(value, "price")`) and use `tabular-nums`. Avoid Turkish suffixes after numbers in messages (vowel harmony depends on the number).
- While `site.isPortfolioDemo` is true: keep the demo banner and `noindex`, and forms must not send anything to Akdeniznet.
- Customer login is Akdeniznet's own portal (`site.portalUrl`): link to it, never copy it.
- Forms: Server Actions in `src/actions/forms.ts`, shared Zod schemas in `src/lib/forms.ts` (messages are error codes, shown via `Forms.errors.*`), delivery in `src/lib/deliver.ts` (nothing is sent while `isPortfolioDemo`). Client components that need text get only their namespaces via `<ClientMessages>`.
- Speed test: `@cloudflare/speedtest`, loaded only on Start. The sequence in `src/components/speed-test/measurements.ts` caps data use (`MAX_TEST_MB`, shown to visitors); keep that number truthful if the sequence changes.

## Never

- Hard-code user-facing text, use physical direction classes, use raw `<img>` or raw `<a>` for internal links.
- Use `any`, `@ts-ignore`, or disable lint rules to pass checks.
- Add a dependency without explaining why. Commit `.env*` files (except `.env.example`).
