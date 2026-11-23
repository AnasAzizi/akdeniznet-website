import { ArrowRightIcon, GaugeIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";

import { SignalGraphic } from "@/components/brand/signal-graphic";
import { buttonVariants } from "@/components/ui/button";
import { stats } from "@/data/stats";
import { Link } from "@/i18n/navigation";

/** Start delay in seconds for the CSS intro (`[data-intro]` in globals.css). */
const delay = (seconds: number) =>
  ({ "--intro-delay": seconds }) as CSSProperties;

export async function HomeHero() {
  const t = await getTranslations("Home");

  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:py-24">
        <div>
          <p
            data-intro=""
            style={delay(0)}
            className="text-eyebrow text-cta-ink uppercase"
          >
            {t("eyebrow", { sites: stats.transmitterSites })}
          </p>
          {/* Blurs in at full opacity: the LCP element is painted at once. */}
          <h1
            data-intro="blur"
            style={delay(0.05)}
            className="mt-4 max-w-3xl text-display text-balance"
          >
            {t("title")}
          </h1>
          <p
            data-intro=""
            style={delay(0.25)}
            className="mt-6 max-w-xl text-lead text-pretty text-muted-foreground"
          >
            {t("lead")}
          </p>
          <div
            data-intro=""
            style={delay(0.4)}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
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
