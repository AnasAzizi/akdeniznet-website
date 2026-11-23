import { ArrowRightIcon, GaugeIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return { alternates: alternatesFor("/", locale) };
}

/** Home. Phase 1 shell: the full page (plans, coverage, stats…) comes in Phase 3. */
export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <section className="container-page py-20 md:py-32">
      <h1 className="max-w-4xl text-display text-balance">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-lead text-pretty text-muted-foreground">
        {t("lead")}
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/tarifeler"
          className={buttonVariants({ variant: "cta", size: "lg" })}
        >
          {t("ctaPlans")}
          <ArrowRightIcon aria-hidden className="rtl:-scale-x-100" />
        </Link>
        <Link
          href="/hiz-testi"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <GaugeIcon aria-hidden />
          {t("ctaSpeedTest")}
        </Link>
      </div>
    </section>
  );
}
