import { ArrowRightIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { ClientMessages } from "@/components/forms/client-messages";
import { PageIntro } from "@/components/layout/page-intro";
import { MAX_TEST_MB } from "@/components/speed-test/measurements";
import { SpeedTest } from "@/components/speed-test/speed-test";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
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

/**
 * The speed test. v1 embedded fast.com, which started measuring (and
 * downloading 80–110 MB) on every home-page visit; this one runs only when
 * the visitor asks for it.
 */
export default async function SpeedTestPage() {
  const t = await getTranslations("SpeedTestPage");
  const tTest = await getTranslations("SpeedTest");

  return (
    <>
      <PageIntro title={t("title")} lead={t("lead")} />
      <div className="container-page grid gap-10 pb-section lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ClientMessages namespaces={["SpeedTest"]}>
          <SpeedTest />
        </ClientMessages>

        <aside className="flex flex-col gap-6 self-start text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <InfoIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
            {tTest("dataWarning", { maxMb: MAX_TEST_MB })}
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheckIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
            {tTest("privacy")}
          </p>
          <div className="rounded-2xl bg-secondary p-6 text-foreground">
            <p className="font-semibold">{tTest("suggestion")}</p>
            <Link
              href="/tarifeler"
              className={`${buttonVariants({ size: "sm" })} mt-4`}
            >
              {tTest("suggestionCta")}
              <ArrowRightIcon aria-hidden className="rtl:-scale-x-100" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
