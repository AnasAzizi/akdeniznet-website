// Validates the content data and renders it in every locale, so CI fails on:
// - invalid plan data (the Zod schema in src/data/plans.ts runs on import),
// - a plan, feature, segment, stat or highlight with no message in a locale,
// - a message whose ICU placeholders or named formats are broken.
// Prints the Turkish plan table as a readable diff of the price list.
// Run with `npm run data:check` (Node ≥ 22.18 strips the TypeScript types).
import { readFileSync } from "node:fs";

import { createTranslator } from "next-intl";

const { plans, segments, planSource } = await import("../src/data/plans.ts");
const { stats, totalSubscribers } = await import("../src/data/stats.ts");
const { highlights } = await import("../src/data/highlights.ts");
const { formats } = await import("../src/i18n/formats.ts");

const LOCALES = ["tr", "en"];
const asOf = (yearMonth) => new Date(`${yearMonth}-01T12:00:00Z`);

for (const locale of LOCALES) {
  const messages = JSON.parse(
    readFileSync(new URL(`../messages/${locale}.json`, import.meta.url)),
  );
  const t = createTranslator({
    locale,
    messages,
    formats,
    timeZone: "Europe/Istanbul",
    onError(error) {
      throw new Error(`[${locale}] ${error.message}`);
    },
  });

  const rows = plans.map((plan) => ({
    segment: t(`Plans.segments.${plan.segment}.name`),
    plan: plan.name ?? t("Plans.homePlanName", { download: plan.downloadMbps }),
    speed:
      plan.uploadMbps === null
        ? t("Plans.speed", { download: plan.downloadMbps })
        : t("Plans.speedPair", {
            download: plan.downloadMbps,
            upload: plan.uploadMbps,
          }),
    price:
      plan.monthlyPriceTRY === null
        ? t("Plans.priceOnRequest")
        : t("Plans.pricePerMonth", { price: plan.monthlyPriceTRY }),
    features: plan.features.map((f) => t(`Plans.features.${f}`)).join(", "),
  }));

  for (const segment of segments) {
    t(`Plans.segments.${segment}.title`);
    t(`Plans.segments.${segment}.description`);
  }
  const note = t("Plans.pricesAsOf", { asOf: asOf(planSource.asOf) });
  t("Stats.asOf", { asOf: asOf(stats.asOf) });
  for (const { key } of highlights) {
    t(`Highlights.${key}.title`);
    t(`Highlights.${key}.body`, {
      sites: stats.transmitterSites,
      subscribers: totalSubscribers,
    });
  }

  if (locale === "tr") {
    console.table(rows);
    console.log(note);
  }
}

console.log(
  `\nData OK: ${plans.length} plans in ${segments.length} segments, ${highlights.length} highlights; ` +
    `every message renders in ${LOCALES.join(", ")}.`,
);
