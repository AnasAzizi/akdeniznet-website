import { getTranslations } from "next-intl/server";

import { site } from "@/data/site";

/**
 * Tells visitors this is a portfolio redesign and points to the official
 * site, so nobody mistakes it for Akdeniznet's live website.
 */
export async function DemoBanner() {
  if (!site.isPortfolioDemo) return null;
  const t = await getTranslations("DemoBanner");

  return (
    <div className="bg-inverse text-inverse-foreground">
      <p className="container-page flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 py-2 text-center text-xs sm:text-sm">
        <span>{t("text")}</span>
        <a
          href={site.officialSiteUrl}
          className="inline-flex min-h-6 items-center font-semibold text-cta underline underline-offset-4 hover:no-underline"
        >
          {t("official")}
        </a>
      </p>
    </div>
  );
}
