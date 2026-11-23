import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** 404 in the visitor's language, with the two most useful ways out. */
export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className="container-page flex flex-col items-start gap-6 py-section">
      <p className="text-eyebrow text-cta-ink uppercase">404</p>
      <h1 className="max-w-3xl text-h1 text-balance">{t("title")}</h1>
      <p className="max-w-xl text-lead text-pretty text-muted-foreground">
        {t("description")}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/tarifeler"
          className={buttonVariants({ variant: "cta", size: "lg" })}
        >
          {t("plans")}
          <ArrowRightIcon aria-hidden className="rtl:-scale-x-100" />
        </Link>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t("home")}
        </Link>
      </div>
    </section>
  );
}
