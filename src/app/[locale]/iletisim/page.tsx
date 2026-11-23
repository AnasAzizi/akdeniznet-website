import {
  ArrowRightIcon,
  ClockIcon,
  type LucideIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { MapEmbed } from "@/components/contact/map-embed";
import { ClientMessages } from "@/components/forms/client-messages";
import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro } from "@/components/layout/page-intro";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("ContactPage");
  return {
    title: t("title"),
    description: t("lead"),
    alternates: alternatesFor("/iletisim", locale),
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations("ContactPage");
  const tFooter = await getTranslations("Footer");
  const { contact, hours, map } = site;
  const address = `${contact.address.street}, ${contact.address.city}`;

  const methods: {
    label: string;
    value: string;
    href: string;
    Icon: LucideIcon;
    external?: boolean;
  }[] = [
    {
      label: t("call"),
      value: contact.phone.display,
      href: contact.phone.href,
      Icon: PhoneIcon,
    },
    {
      label: t("write"),
      value: contact.whatsapp.display,
      href: contact.whatsapp.href,
      Icon: MessageCircleIcon,
      external: true,
    },
    {
      label: t("email"),
      value: contact.email,
      href: `mailto:${contact.email}`,
      Icon: MailIcon,
    },
  ];

  return (
    <>
      <PageIntro title={t("title")} lead={t("lead")} />

      <div className="container-page flex flex-col gap-section pb-section">
        <ul className="grid gap-4 sm:grid-cols-3">
          {methods.map(({ label, value, href, Icon, external }) => (
            <li key={href} className="flex">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
                className="flex flex-1 items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon aria-hidden className="size-6" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="truncate font-semibold tabular-nums">
                    {value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <section
          aria-labelledby="office-heading"
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
        >
          <MapEmbed
            src={map.embedUrl.replaceAll("{lang}", locale)}
            title={t("mapTitle")}
            loadLabel={t("loadMap")}
            notice={t("mapNotice")}
            address={address}
          />
          <div className="flex flex-col gap-8">
            <div>
              <h2
                id="office-heading"
                className="flex items-center gap-2 text-h3"
              >
                <MapPinIcon aria-hidden className="size-6 text-primary" />
                {t("visit")}
              </h2>
              <address className="mt-3 not-italic">
                {contact.address.street}
                <br />
                {contact.address.city}
              </address>
              <a
                href={map.directionsUrl}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex min-h-6 items-center gap-1.5 font-semibold text-primary-ink underline-offset-4 hover:underline"
              >
                {t("directions")}
                <ArrowRightIcon
                  aria-hidden
                  className="size-4 rtl:-scale-x-100"
                />
              </a>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-h3">
                <ClockIcon aria-hidden className="size-6 text-primary" />
                {tFooter("hours")}
              </h2>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 tabular-nums">
                <dt className="text-muted-foreground">{tFooter("weekdays")}</dt>
                <dd>{hours.weekdays}</dd>
                <dt className="text-muted-foreground">{tFooter("saturday")}</dt>
                <dd>{hours.saturday}</dd>
                <dt className="text-muted-foreground">{tFooter("sunday")}</dt>
                <dd>{tFooter("closed")}</dd>
              </dl>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="form-heading"
          className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)]"
        >
          <div>
            <h2 id="form-heading" className="text-h2">
              {t("formTitle")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("formLead")}</p>
            <div className="mt-8 rounded-2xl bg-secondary p-6">
              <p className="font-semibold">{t("newCustomer")}</p>
              <Link
                href="/basvuru"
                className="mt-2 inline-flex min-h-6 items-center gap-1.5 font-semibold text-primary-ink underline-offset-4 hover:underline"
              >
                {t("newCustomerLink")}
                <ArrowRightIcon
                  aria-hidden
                  className="size-4 rtl:-scale-x-100"
                />
              </Link>
            </div>
          </div>
          <div className="max-w-2xl">
            <ClientMessages namespaces={["Forms", "ContactForm"]}>
              <ContactForm phone={contact.phone.display} />
            </ClientMessages>
          </div>
        </section>
      </div>
    </>
  );
}
