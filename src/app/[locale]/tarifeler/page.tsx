import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PageIntro } from "@/components/layout/page-intro";
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

/** Plans. Phase 1 shell: plan data and comparison arrive in Phases 2–3. */
export default async function PlansPage() {
  const t = await getTranslations("PlansPage");
  return <PageIntro title={t("title")} lead={t("lead")} />;
}
