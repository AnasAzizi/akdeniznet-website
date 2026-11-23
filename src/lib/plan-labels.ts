import { getFormatter, getTranslations } from "next-intl/server";

import type { Plan } from "@/data/plans";

/**
 * Text for showing a plan, resolved on the server in the page's locale.
 * Client components receive the resulting strings as props.
 */
export async function getPlanLabels() {
  const t = await getTranslations("Plans");
  const format = await getFormatter();

  /** "25 Mbps" or "50/20 Mbps". */
  const speed = (plan: Plan) =>
    plan.uploadMbps === null
      ? t("speed", { download: plan.downloadMbps })
      : t("speedPair", {
          download: plan.downloadMbps,
          upload: plan.uploadMbps,
        });

  /** "Metro 20", "Eko Paket", or "25 Mbps İnternet" for home plans. */
  const title = (plan: Plan) =>
    plan.name ?? t("homePlanName", { download: plan.downloadMbps });

  /** "₺1.250/ay" or "Fiyat için arayın". */
  const priceWithPeriod = (plan: Plan) =>
    plan.monthlyPriceTRY === null
      ? t("priceOnRequest")
      : t("pricePerMonth", { price: plan.monthlyPriceTRY });

  return {
    title,
    speed,
    priceWithPeriod,
    /** "₺1.250" without the period, or null when the price is on request. */
    price: (plan: Plan) =>
      plan.monthlyPriceTRY === null
        ? null
        : format.number(plan.monthlyPriceTRY, "price"),
    /** Unique name for sentences: "Eko Paket 50/20 Mbps", "25 Mbps İnternet". */
    name: (plan: Plan) => uniqueName(plan),
    /** Unique and complete, for selects and summaries: "Eko Paket 50/20 Mbps – ₺1.250/ay". */
    full: (plan: Plan) => `${uniqueName(plan)} – ${priceWithPeriod(plan)}`,
  };

  function uniqueName(plan: Plan) {
    return plan.name === null ? title(plan) : `${plan.name} ${speed(plan)}`;
  }
}

export type PlanLabels = Awaited<ReturnType<typeof getPlanLabels>>;
