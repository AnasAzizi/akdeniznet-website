import { ArrowRightIcon, PhoneIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { ApplyForm } from "@/components/forms/apply-form";
import { ClientMessages } from "@/components/forms/client-messages";
import { PageIntro } from "@/components/layout/page-intro";
import { PricesNote } from "@/components/plans/prices-note";
import { getPlan, plansIn, segments } from "@/data/plans";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import { getPlanLabels } from "@/lib/plan-labels";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("ApplyPage");
  return {
    title: t("title"),
    description: t("lead"),
    alternates: alternatesFor("/basvuru", locale),
  };
}

/**
 * The form depends on `?plan=`, so it renders per request inside Suspense
 * while the rest of the page stays prerendered (Partial Prerendering).
 */
async function ApplyFormSection({
  searchParams,
}: {
  searchParams: PageProps<"/[locale]/basvuru">["searchParams"];
}) {
  const { plan } = await searchParams;
  const tPlans = await getTranslations("Plans");
  const labels = await getPlanLabels();
  const groups = segments.map((segment) => ({
    label: tPlans(`segments.${segment}.name`),
    options: plansIn(segment).map((option) => ({
      id: option.id,
      label: labels.full(option),
      name: labels.name(option),
    })),
  }));
  const defaultPlan =
    typeof plan === "string" && getPlan(plan) ? plan : undefined;

  return (
    <ClientMessages namespaces={["Forms", "ApplyForm"]}>
      <ApplyForm
        groups={groups}
        defaultPlan={defaultPlan}
        phone={site.contact.phone.display}
      />
    </ClientMessages>
  );
}

function FormSkeleton() {
  return (
    <div aria-hidden className="flex animate-pulse flex-col gap-6">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-12 rounded-xl bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default async function ApplyPage({
  searchParams,
}: PageProps<"/[locale]/basvuru">) {
  const t = await getTranslations("ApplyPage");
  const tHome = await getTranslations("Home");

  return (
    <>
      <PageIntro title={t("title")} lead={t("lead")} />
      <div className="container-page grid gap-12 pb-section lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="max-w-2xl">
          <Suspense fallback={<FormSkeleton />}>
            <ApplyFormSection searchParams={searchParams} />
          </Suspense>
        </div>
        <aside className="flex flex-col gap-6 self-start rounded-2xl bg-secondary p-6 lg:sticky lg:top-24">
          <div>
            <p className="font-semibold">{t("help")}</p>
            <Link
              href="/tarifeler"
              className="mt-2 inline-flex min-h-6 items-center gap-1.5 font-semibold text-primary-ink underline-offset-4 hover:underline"
            >
              {t("helpLink")}
              <ArrowRightIcon aria-hidden className="size-4 rtl:-scale-x-100" />
            </Link>
          </div>
          <a
            href={site.contact.phone.href}
            className="inline-flex min-h-6 items-center gap-2 font-semibold tabular-nums"
          >
            <PhoneIcon aria-hidden className="size-5 text-primary" />
            <span className="sr-only">{tHome("callUs")}: </span>
            {site.contact.phone.display}
          </a>
          <PricesNote />
        </aside>
      </div>
    </>
  );
}
