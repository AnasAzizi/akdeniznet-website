import {
  ArrowRightIcon,
  ArrowUpDownIcon,
  BuildingIcon,
  HouseIcon,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Segment, segments, startingPrice } from "@/data/plans";
import { Link } from "@/i18n/navigation";

const icons: Record<Segment, LucideIcon> = {
  home: HouseIcon,
  "business-symmetric": ArrowUpDownIcon,
  "business-asymmetric": BuildingIcon,
};

/** The three plan types, each with its lowest price, linking into the plans page. */
export async function SegmentOverview() {
  const t = await getTranslations("Home");
  const tPlans = await getTranslations("Plans");

  return (
    <section
      aria-labelledby="segments-heading"
      className="container-page py-section"
    >
      <h2 id="segments-heading" className="text-h2">
        {t("segmentsTitle")}
      </h2>
      <p className="mt-3 max-w-2xl text-lead text-muted-foreground">
        {t("segmentsLead")}
      </p>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {segments.map((segment) => {
          const Icon = icons[segment];
          const price = startingPrice(segment);
          return (
            <li key={segment} className="flex">
              <Link
                href={{ pathname: "/tarifeler", hash: segment }}
                className="group flex flex-1 flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon aria-hidden className="size-6" />
                </span>
                <span className="mt-5 text-h3">
                  {tPlans(`segments.${segment}.title`)}
                </span>
                <span className="mt-2 text-pretty text-muted-foreground">
                  {tPlans(`segments.${segment}.description`)}
                </span>
                {price !== null && (
                  <span className="mt-5 font-semibold tabular-nums">
                    {tPlans("startingFrom", { price })}
                    {tPlans("perMonth")}
                  </span>
                )}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-semibold text-primary-ink">
                  {t("segmentCta")}
                  <ArrowRightIcon
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
