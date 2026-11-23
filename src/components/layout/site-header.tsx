import { ExternalLinkIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/brand/logo";
import { LocaleSwitch } from "@/components/layout/locale-switch";
import { MobileNav } from "@/components/layout/mobile-nav";
import { navItems } from "@/components/layout/nav-items";
import { NavLinks } from "@/components/layout/nav-links";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Sticky header. Desktop (lg+) shows the links inline; smaller screens get
 * the full-screen menu. Existing customers reach Akdeniznet's own portal
 * from here (it opens in a new tab; this site never handles their login).
 */
export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const tCommon = await getTranslations("Common");
  const links = navItems.map((item) => ({
    href: item.href,
    label: t(item.label),
  }));
  const localeSwitch = (
    <LocaleSwitch label={t("switchLocale")} name={t("localeName")} />
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`Akdeniznet – ${t("home")}`}
          className="-ms-1 rounded-lg p-1"
        >
          <Logo priority />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <NavLinks links={links} label={t("label")} />
          <span aria-hidden className="mx-1 h-6 w-px bg-border" />
          {localeSwitch}
          <a
            href={site.portalUrl}
            target="_blank"
            rel="noopener"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "ms-1",
            )}
          >
            {t("portal")}
            <ExternalLinkIcon aria-hidden />
            <span className="sr-only">{tCommon("opensInNewTab")}</span>
          </a>
        </div>

        <MobileNav
          className="-me-2 lg:hidden"
          links={links}
          portal={{
            href: site.portalUrl,
            label: t("portal"),
            newTab: tCommon("opensInNewTab"),
          }}
          labels={{
            title: t("menuTitle"),
            open: t("openMenu"),
            close: t("closeMenu"),
            home: t("home"),
          }}
          localeSwitch={localeSwitch}
        />
      </div>
    </header>
  );
}
