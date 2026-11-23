"use client";

import { GlobeIcon } from "lucide-react";
import { useLocale } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { getPathname, usePathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitchProps = {
  /** Accessible label in the target language, e.g. "Switch to English". */
  label: string;
  /** The target language's name in its own language. */
  name: string;
  className?: string;
};

/**
 * The same page in the other language, always with its locale prefix
 * (`/tr/tarifeler`, `/en/plans`): the proxy stores the choice in the
 * NEXT_LOCALE cookie and redirects Turkish to its clean URL, even without
 * JavaScript.
 */
function localizedHref(
  pathname: Parameters<typeof getPathname>[0]["href"],
  locale: Locale,
) {
  const path = getPathname({ href: pathname, locale });
  const prefix = `/${locale}`;
  if (path === prefix || path.startsWith(`${prefix}/`)) return path;
  return path === "/" ? prefix : `${prefix}${path}`;
}

/**
 * With two languages a menu is one click too many: this links straight to
 * the same page in the other language.
 *
 * A plain <a>, deliberately: switching language changes the root layout's
 * locale, and a client-side navigation would keep the old page mounted but
 * hidden (Cache Components keeps visited routes in the DOM), duplicating
 * IDs such as #main. A full page load starts clean.
 */
export function LocaleSwitch({ label, name, className }: LocaleSwitchProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const target =
    routing.locales.find((option) => option !== locale) ??
    routing.defaultLocale;

  return (
    <a
      href={localizedHref(pathname, target)}
      hrefLang={target}
      aria-label={label}
      title={label}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "gap-1.5 px-3",
        className,
      )}
    >
      <GlobeIcon aria-hidden />
      <span lang={target}>{name}</span>
    </a>
  );
}
