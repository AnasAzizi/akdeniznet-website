import {
  ArrowRightIcon,
  GaugeIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Invitation to run the speed test. */
export async function SpeedTeaser() {
  const t = await getTranslations("Home");

  return (
    <section
      aria-labelledby="speed-heading"
      className="container-page py-section"
    >
      <div className="flex flex-col items-start gap-6 rounded-3xl bg-secondary p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="flex items-start gap-5">
          <GaugeIcon
            aria-hidden
            className="size-12 shrink-0 text-primary"
            strokeWidth={1.5}
          />
          <div>
            <h2 id="speed-heading" className="text-h2">
              {t("speedTitle")}
            </h2>
            <p className="mt-2 max-w-xl text-secondary-foreground">
              {t("speedLead")}
            </p>
          </div>
        </div>
        <Link
          href="/hiz-testi"
          className={cn(buttonVariants({ size: "lg" }), "shrink-0")}
        >
          {t("speedCta")}
          <ArrowRightIcon aria-hidden className="rtl:-scale-x-100" />
        </Link>
      </div>
    </section>
  );
}

/** Closing call to action: talk to a person, or apply online. */
export async function ContactCta() {
  const t = await getTranslations("Home");
  const tCommon = await getTranslations("Common");

  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="container-page pb-section"
    >
      <div className="grid gap-8 border-t pt-section lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 id="contact-cta-heading" className="text-h1">
            {t("contactTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
            {t("contactLead")}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={site.contact.phone.href}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <PhoneIcon aria-hidden />
            <span>
              <span className="sr-only">{t("callUs")}: </span>
              <span className="tabular-nums">{site.contact.phone.display}</span>
            </span>
          </a>
          <a
            href={site.contact.whatsapp.href}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <MessageCircleIcon aria-hidden />
            {tCommon("whatsapp")}
          </a>
          <Link
            href="/basvuru"
            className={buttonVariants({ variant: "cta", size: "lg" })}
          >
            {t("contactApply")}
            <ArrowRightIcon aria-hidden className="rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}
