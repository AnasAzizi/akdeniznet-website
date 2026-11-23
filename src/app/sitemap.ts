import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { getPathname } from "@/i18n/navigation";
import { type Pathname, routing } from "@/i18n/routing";

const pages: { href: Pathname; priority: number }[] = [
  { href: "/", priority: 1 },
  { href: "/tarifeler", priority: 0.9 },
  { href: "/basvuru", priority: 0.7 },
  { href: "/hiz-testi", priority: 0.6 },
  { href: "/iletisim", priority: 0.6 },
];

/** Every page in both languages, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (href: Pathname, locale: (typeof routing.locales)[number]) =>
    new URL(getPathname({ href, locale }), site.url).toString();

  return pages.flatMap(({ href, priority }) => {
    const languages = {
      ...Object.fromEntries(
        routing.locales.map((locale) => [locale, url(href, locale)]),
      ),
      "x-default": url(href, routing.defaultLocale),
    };
    return routing.locales.map((locale) => ({
      url: url(href, locale),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
