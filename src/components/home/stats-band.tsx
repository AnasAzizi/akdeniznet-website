import { getFormatter, getTranslations } from "next-intl/server";

import { stats } from "@/data/stats";

/**
 * The network in numbers, from the 2023 site's counters. The numbers are
 * final in the HTML; `data-count-to` lets the motion runtime count up to
 * them later without hiding the real value from anyone.
 */
export async function StatsBand() {
  const t = await getTranslations("Stats");
  const tHome = await getTranslations("Home");
  const format = await getFormatter();

  const items = [
    { label: t("transmitterSites"), value: stats.transmitterSites },
    { label: t("homeSubscribers"), value: stats.subscribers.home },
    { label: t("businessSubscribers"), value: stats.subscribers.business },
  ];

  return (
    <section
      aria-labelledby="stats-heading"
      className="bg-inverse py-section text-inverse-foreground"
    >
      <div className="container-page">
        <h2 id="stats-heading" className="text-h2">
          {tHome("statsTitle")}
        </h2>
        <dl className="mt-10 grid gap-8 sm:grid-cols-3">
          {items.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col-reverse gap-2 border-t border-inverse-foreground/15 pt-6"
            >
              <dt className="text-inverse-muted">{label}</dt>
              <dd
                className="text-display text-cta tabular-nums"
                data-count-to={value}
              >
                {format.number(value)}
              </dd>
            </div>
          ))}
        </dl>
        {!stats.confirmed && (
          <p className="mt-8 text-sm text-inverse-muted">
            {t("asOf", { asOf: new Date(`${stats.asOf}-01T12:00:00Z`) })}
          </p>
        )}
      </div>
    </section>
  );
}
