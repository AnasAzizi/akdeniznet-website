import { defineRouting } from "next-intl/routing";

/**
 * Turkish is the site's language; English is for visitors who don't read
 * Turkish (and portfolio reviewers). Turkish URLs carry no prefix
 * (`/tarifeler`), English ones do (`/en/plans`).
 */
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/tarifeler": { tr: "/tarifeler", en: "/plans" },
    "/hiz-testi": { tr: "/hiz-testi", en: "/speed-test" },
    "/iletisim": { tr: "/iletisim", en: "/contact" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;

const rtlLocales: ReadonlySet<string> = new Set(["ar"]);

/** Text direction for a locale (ready for Arabic if it is added later). */
export function getDirection(locale: string): "ltr" | "rtl" {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}
