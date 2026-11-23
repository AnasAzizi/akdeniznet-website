import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PageIntro } from "@/components/layout/page-intro";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("ContactPage");
  return {
    title: t("title"),
    description: t("lead"),
    alternates: alternatesFor("/iletisim", locale),
  };
}

/** Contact. Phase 1 shell: the form and map arrive in Phase 3. */
export default async function ContactPage() {
  const t = await getTranslations("ContactPage");
  return <PageIntro title={t("title")} lead={t("lead")} />;
}
