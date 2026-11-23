import { getFormatter, getTranslations } from "next-intl/server";

import { getPlan, type Plan } from "@/data/plans";

/**
 * Symmetric vs asymmetric, shown with two real plans at the same download
 * speed: Metro 50 (50/50) and Eko Paket (50/20). Bar lengths are drawn
 * with `scaleX` so they can be animated later without layout work.
 */
export async function SpeedExplainer() {
  const t = await getTranslations("Plans");
  const format = await getFormatter();
  const examples = [
    {
      plan: getPlan("metro-50"),
      body: t("explainer.symmetricBody"),
      title: t("symmetric"),
    },
    {
      plan: getPlan("eko-50-20"),
      body: t("explainer.asymmetricBody"),
      title: t("asymmetric"),
    },
  ].filter((example): example is typeof example & { plan: Plan } =>
    Boolean(example.plan),
  );
  const max = Math.max(...examples.map(({ plan }) => plan.downloadMbps));

  return (
    <section
      aria-labelledby="explainer-heading"
      className="rounded-3xl bg-secondary p-6 md:p-10"
    >
      <h2 id="explainer-heading" className="text-h2">
        {t("explainer.title")}
      </h2>
      <p className="mt-2 text-lead text-secondary-foreground">
        {t("explainer.lead")}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {examples.map(({ plan, title, body }) => (
          <div key={plan.id} className="rounded-2xl bg-card p-6">
            <h3 className="text-h3">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {plan.name} ·{" "}
              {t("speedPair", {
                download: plan.downloadMbps,
                upload: plan.uploadMbps ?? 0,
              })}
            </p>
            <dl className="mt-5 flex flex-col gap-3">
              {(
                [
                  ["download", plan.downloadMbps, "bg-primary"],
                  ["upload", plan.uploadMbps ?? 0, "bg-cta"],
                ] as const
              ).map(([key, value, color], index) => (
                <div
                  key={key}
                  className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-sm"
                >
                  <dt className="text-muted-foreground">{t(key)}</dt>
                  <dd className="h-3 overflow-hidden rounded-full bg-muted">
                    <span
                      data-bar=""
                      data-bar-delay={index * 0.15}
                      className={`block h-full origin-left rounded-full rtl:origin-right ${color}`}
                      style={{ transform: `scaleX(${value / max})` }}
                    />
                  </dd>
                  <dd className="font-semibold tabular-nums">
                    {format.number(value)} Mbps
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-pretty">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
