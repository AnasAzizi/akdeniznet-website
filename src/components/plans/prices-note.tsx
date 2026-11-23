import { InfoIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { planSource } from "@/data/plans";
import { cn } from "@/lib/utils";

/** Says which price list the prices come from, until the client confirms them. */
export async function PricesNote({ className }: { className?: string }) {
  if (planSource.confirmed) return null;
  const t = await getTranslations("Plans");

  return (
    <p
      className={cn(
        "flex items-start gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <InfoIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {t("pricesAsOf", { asOf: new Date(`${planSource.asOf}-01T12:00:00Z`) })}
    </p>
  );
}
