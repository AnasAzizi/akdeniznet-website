import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  type LucideIcon,
} from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { isSymmetric, type Plan } from "@/data/plans";
import { Link } from "@/i18n/navigation";
import { getPlanLabels } from "@/lib/plan-labels";
import { cn } from "@/lib/utils";

/** One plan: speeds, monthly price, features and an "Apply" link. */
export async function PlanCard({ plan }: { plan: Plan }) {
  const t = await getTranslations("Plans");
  const format = await getFormatter();
  const labels = await getPlanLabels();
  const price = labels.price(plan);
  const titleId = `plan-${plan.id}`;

  const speeds: {
    key: "download" | "upload";
    value: number;
    Icon: LucideIcon;
  }[] = [{ key: "download", value: plan.downloadMbps, Icon: ArrowDownIcon }];
  if (plan.uploadMbps !== null)
    speeds.push({ key: "upload", value: plan.uploadMbps, Icon: ArrowUpIcon });

  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-1 flex-col rounded-2xl border bg-card p-6 shadow-[0_1px_2px_rgb(11_34_56/0.04)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={titleId} className="text-lg font-bold">
          {labels.title(plan)}
        </h3>
        {plan.segment !== "home" && (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
            {isSymmetric(plan) ? t("symmetric") : t("asymmetric")}
          </span>
        )}
      </div>

      <dl className="mt-5 flex gap-8">
        {speeds.map(({ key, value, Icon }) => (
          <div key={key} className="flex flex-col-reverse gap-1">
            <dt className="flex items-center gap-1 text-sm text-muted-foreground">
              <Icon aria-hidden className="size-4" />
              {t(key)}
            </dt>
            <dd className="text-h2 tabular-nums">
              {format.number(value)}
              <span className="ms-1 text-base font-semibold text-muted-foreground">
                Mbps
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 border-t pt-5">
        <span className="sr-only">{t("monthlyPrice")}: </span>
        {price ? (
          <>
            <span className="text-h3 tabular-nums">{price}</span>
            <span className="text-muted-foreground">{t("perMonth")}</span>
          </>
        ) : (
          <span className="text-lg font-bold">{t("priceOnRequest")}</span>
        )}
      </p>

      <ul className="mt-5 mb-7 flex flex-col gap-2.5 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
            {t(`features.${feature}`)}
          </li>
        ))}
      </ul>

      <Link
        href={{ pathname: "/basvuru", query: { plan: plan.id } }}
        aria-label={`${t("apply")}: ${labels.full(plan)}`}
        className={cn(buttonVariants(), "mt-auto w-full")}
      >
        {t("apply")}
      </Link>
    </article>
  );
}
