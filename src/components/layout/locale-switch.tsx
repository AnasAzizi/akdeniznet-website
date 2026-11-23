"use client";

import { GlobeIcon } from "lucide-react";
import { useLocale } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitchProps = {
  /** Accessible label in the target language, e.g. "Switch to English". */
  label: string;
  /** The target language's name in its own language. */
  name: string;
  className?: string;
};

/**
 * With two languages a menu is one click too many: this links straight to
 * the same page in the other language.
 */
export function LocaleSwitch({ label, name, className }: LocaleSwitchProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const target = routing.locales.find((option) => option !== locale) ?? "tr";

  return (
    <Link
      href={pathname}
      locale={target}
      scroll={false}
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
    </Link>
  );
}
