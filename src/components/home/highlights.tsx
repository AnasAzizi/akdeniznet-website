import {
  BadgeCheckIcon,
  type LucideIcon,
  RadioTowerIcon,
  ReceiptTextIcon,
  WrenchIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { highlights } from "@/data/highlights";
import { stats, totalSubscribers } from "@/data/stats";

const icons: Record<(typeof highlights)[number]["icon"], LucideIcon> = {
  "badge-check": BadgeCheckIcon,
  "receipt-text": ReceiptTextIcon,
  wrench: WrenchIcon,
  "radio-tower": RadioTowerIcon,
};

/** Reasons to choose Akdeniznet, each one a claim the 2023 site made. */
export async function Highlights() {
  const t = await getTranslations("Highlights");
  const tHome = await getTranslations("Home");

  return (
    <section
      aria-labelledby="highlights-heading"
      className="bg-card py-section"
    >
      <div className="container-page">
        <h2 id="highlights-heading" className="text-h2">
          {tHome("highlightsTitle")}
        </h2>
        <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ key, icon }) => {
            const Icon = icons[icon];
            return (
              <li key={key}>
                <Icon
                  aria-hidden
                  className="size-8 text-primary"
                  strokeWidth={1.75}
                />
                <h3 className="mt-4 text-lg font-bold">{t(`${key}.title`)}</h3>
                <p className="mt-2 text-pretty text-muted-foreground">
                  {t(`${key}.body`, {
                    sites: stats.transmitterSites,
                    subscribers: totalSubscribers,
                  })}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
