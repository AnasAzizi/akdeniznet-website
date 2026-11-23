import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { PlanCard } from "@/components/plans/plan-card";
import { plansIn, type Segment } from "@/data/plans";

/**
 * All plans of one segment, with its title and who it's for. `reveal` fades
 * the cards in on scroll; leave it off for a segment that can be in view on
 * load, so it never waits for the motion code.
 */
export async function SegmentSection({
  segment,
  reveal = false,
}: {
  segment: Segment;
  reveal?: boolean;
}) {
  const List = reveal ? Reveal : "ul";
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
      <List
        {...(reveal ? { as: "ul" as const, stagger: 0.06 } : {})}
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {plansIn(segment).map((plan) => (
          <li key={plan.id} className="flex">
            <PlanCard plan={plan} />
          </li>
        ))}
      </List>
    </section>
  );
}
