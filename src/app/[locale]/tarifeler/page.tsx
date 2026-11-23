import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { Faq } from "@/components/faq";
import { PageIntro } from "@/components/layout/page-intro";
import { PlansTable } from "@/components/plans/plans-table";
import { PricesNote } from "@/components/plans/prices-note";
import { SegmentNav } from "@/components/plans/segment-nav";
import { SegmentSection } from "@/components/plans/segment-section";
import { SpeedExplainer } from "@/components/plans/speed-explainer";
import { segments } from "@/data/plans";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("PlansPage");
  return {
    title: t("title"),
    description: t("lead"),
    alternates: alternatesFor("/tarifeler", locale),
  };
}

/** Every plan on one page, grouped by type, with a comparison table and FAQ. */
export default async function PlansPage() {
  const t = await getTranslations("PlansPage");

  return (
    <>
      <PageIntro title={t("title")} lead={t("lead")}>
        <PricesNote className="mt-6" />
      </PageIntro>
      <SegmentNav />
      <div className="container-page flex flex-col gap-section py-16 md:py-20">
        {segments.map((segment) => (
          <SegmentSection key={segment} segment={segment} />
        ))}
        <PlansTable />
        <SpeedExplainer />
        <Faq />
      </div>
    </>
  );
}
