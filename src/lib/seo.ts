import type { Metadata } from "next";

import { site } from "@/data/site";
import { getPathname } from "@/i18n/navigation";
import { type Locale, type Pathname, routing } from "@/i18n/routing";

/**
 * Canonical URL and hreflang alternates for a route, in every locale
 * (`/tarifeler` ↔ `/en/plans`). Turkish is the x-default.
 */
export function alternatesFor(
  href: Pathname,
  locale: Locale,
): Metadata["alternates"] {
  const url = (target: Locale) =>
    new URL(getPathname({ href, locale: target }), site.url).toString();

  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])),
      "x-default": url(routing.defaultLocale),
    },
  };
}
