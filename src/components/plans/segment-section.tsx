import { getTranslations } from "next-intl/server";

import { PlanCard } from "@/components/plans/plan-card";
import { plansIn, type Segment } from "@/data/plans";

/** All plans of one segment, with its title and who it's for. */
export async function SegmentSection({ segment }: { segment: Segment }) {
  const t = await getTranslations("Plans");
  const headingId = `${segment}-heading`;

  return (
    <section id={segment} aria-labelledby={headingId} className="scroll-mt-40">
      <h2 id={headingId} className="text-h2">
        {t(`segments.${segment}.title`)}
      </h2>
      <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
        {t(`segments.${segment}.description`)}
      </p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plansIn(segment).map((plan) => (
          <li key={plan.id} className="flex">
            <PlanCard plan={plan} />
          </li>
        ))}
      </ul>
    </section>
  );
}
