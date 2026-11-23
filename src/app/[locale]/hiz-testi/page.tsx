import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PageIntro } from "@/components/layout/page-intro";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("SpeedTestPage");
  return {
    title: t("title"),
    description: t("lead"),
    alternates: alternatesFor("/hiz-testi", locale),
  };
}

/** Speed test. Phase 1 shell: the Cloudflare-based test arrives in Phase 3. */
export default async function SpeedTestPage() {
  const t = await getTranslations("SpeedTestPage");
  return <PageIntro title={t("title")} lead={t("lead")} />;
}
