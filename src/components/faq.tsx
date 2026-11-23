import { PlusIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

/** Questions answerable from what Akdeniznet has published (see docs/content-sources.md). */
const faqKeys = [
  "commitment",
  "phoneLine",
  "symmetric",
  "akn",
  "faults",
  "modem",
] as const;

/** Frequently asked questions as native <details>: no JS, searchable with Ctrl+F. */
export async function Faq() {
  const t = await getTranslations("Faq");

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-h2">
        {t("title")}
      </h2>
      <div className="mt-8 divide-y border-y">
        {faqKeys.map((key) => (
          <details key={key} name="faq" className="group">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {t(`items.${key}.q`)}
              <PlusIcon
                aria-hidden
                className="size-5 shrink-0 text-primary transition-transform group-open:rotate-45"
              />
            </summary>
            <p className="max-w-3xl pb-6 text-pretty text-muted-foreground">
              {t(`items.${key}.a`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
