import { ArrowRightIcon, GaugeIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SignalGraphic } from "@/components/brand/signal-graphic";
import { buttonVariants } from "@/components/ui/button";
import { stats } from "@/data/stats";
import { Link } from "@/i18n/navigation";

export async function HomeHero() {
  const t = await getTranslations("Home");

  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:py-24">
        <div>
          <p className="text-eyebrow text-cta-ink uppercase">
            {t("eyebrow", { sites: stats.transmitterSites })}
          </p>
          <h1 className="mt-4 max-w-3xl text-display text-balance">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lead text-pretty text-muted-foreground">
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
        </div>
        <SignalGraphic className="mx-auto max-w-md lg:max-w-none" />
      </div>
    </section>
  );
}
