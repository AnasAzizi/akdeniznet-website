import { ChevronDownIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { plans } from "@/data/plans";
import { getPlanLabels } from "@/lib/plan-labels";

/**
 * Every plan in one table, collapsed by default (native <details>, no JS).
 * The table scrolls sideways on phones and can be scrolled by keyboard.
 */
export async function PlansTable() {
  const t = await getTranslations("Plans");
  const format = await getFormatter();
  const labels = await getPlanLabels();
  const mbps = (value: number | null) =>
    value === null ? t("table.notStated") : `${format.number(value)} Mbps`;

  return (
    <details className="group rounded-2xl border bg-card">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-4 font-semibold [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-lg font-bold">{t("compareTitle")}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {t("compareSummary")}
          </span>
        </span>
        <ChevronDownIcon
          aria-hidden
          className="size-5 shrink-0 transition-transform group-open:rotate-180"
        />
      </summary>
      <div
        role="region"
        aria-label={t("compareTitle")}
        tabIndex={0}
        className="overflow-x-auto border-t"
      >
        <table className="w-full min-w-[40rem] text-start text-sm tabular-nums">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3 text-start font-semibold">
                {t("table.plan")}
              </th>
              <th scope="col" className="px-4 py-3 text-start font-semibold">
                {t("table.type")}
              </th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">
                {t("download")}
              </th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">
                {t("upload")}
              </th>
              <th scope="col" className="px-6 py-3 text-end font-semibold">
                {t("table.price")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {plans.map((plan) => (
              <tr key={plan.id}>
                <th scope="row" className="px-6 py-3 text-start font-semibold">
                  {labels.title(plan)}
                </th>
                <td className="px-4 py-3">
                  {t(`segments.${plan.segment}.name`)}
                </td>
                <td className="px-4 py-3 text-end">
                  {mbps(plan.downloadMbps)}
                </td>
                <td className="px-4 py-3 text-end">{mbps(plan.uploadMbps)}</td>
                <td className="px-6 py-3 text-end font-semibold">
                  {labels.priceWithPeriod(plan)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
