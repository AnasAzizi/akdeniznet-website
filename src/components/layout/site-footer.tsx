import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { CurrentYear } from "@/components/layout/current-year";
import { navItems } from "@/components/layout/nav-items";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";

// min-h-6: every link is at least a 24px touch target (WCAG 2.2, 2.5.8).
const linkClass =
  "inline-flex min-h-6 items-center rounded-sm underline-offset-4 transition-colors hover:text-cta hover:underline";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 text-eyebrow text-inverse-muted uppercase">
      {children}
    </h2>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const { contact, hours, social } = site;

  return (
    <footer className="bg-inverse text-inverse-foreground">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.3fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          {/* The wordmark is blue-on-white, so it sits on a light chip. */}
          <Link href="/" className="rounded-xl bg-card px-3 py-2">
            <Logo className="h-8" />
          </Link>
          <p className="max-w-xs text-inverse-muted">{t("tagline")}</p>
          <div>
            <p className="sr-only">{t("follow")}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
              <li>
                <a href={social.instagram} className={linkClass}>
                  Instagram
                </a>
              </li>
              <li>
                <a href={social.facebook} className={linkClass}>
                  Facebook
                </a>
              </li>
              <li>
                <a href={social.youtube} className={linkClass}>
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <nav aria-labelledby="footer-explore">
          <FooterHeading>
            <span id="footer-explore">{t("explore")}</span>
          </FooterHeading>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/" className={linkClass}>
                {tNav("home")}
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {tNav(item.label)}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.portalUrl} className={linkClass}>
                {tNav("portal")}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <FooterHeading>{t("contact")}</FooterHeading>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-3">
              <PhoneIcon
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-cta"
              />
              <a href={contact.phone.href} className={linkClass}>
                <span className="sr-only">{t("phone")}: </span>
                {contact.phone.display}
              </a>
            </li>
            <li className="flex gap-3">
              <MessageCircleIcon
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-cta"
              />
              <a href={contact.whatsapp.href} className={linkClass}>
                <span className="sr-only">{t("whatsapp")}: </span>
                {contact.whatsapp.display}
              </a>
            </li>
            <li className="flex gap-3">
              <MailIcon
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-cta"
              />
              <a href={`mailto:${contact.email}`} className={linkClass}>
                <span className="sr-only">{t("email")}: </span>
                {contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPinIcon
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-cta"
              />
              <address className="not-italic">
                <span className="sr-only">{t("address")}: </span>
                {contact.address.street}
                <br />
                {contact.address.city}
              </address>
            </li>
          </ul>
        </div>

        <div>
          <FooterHeading>
            <span className="inline-flex items-center gap-2">
              <ClockIcon aria-hidden className="size-4" />
              {t("hours")}
            </span>
          </FooterHeading>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 tabular-nums">
            <dt className="text-inverse-muted">{t("weekdays")}</dt>
            <dd>{hours.weekdays}</dd>
            <dt className="text-inverse-muted">{t("saturday")}</dt>
            <dd>{hours.saturday}</dd>
            <dt className="text-inverse-muted">{t("sunday")}</dt>
            <dd>{t("closed")}</dd>
          </dl>
        </div>
      </div>

      <div className="border-t border-inverse-foreground/15">
        <div className="container-page flex flex-col gap-2 pt-6 pb-24 text-sm text-inverse-muted sm:flex-row sm:items-center sm:justify-between sm:pe-40 sm:pb-6 md:pe-44">
          <p>
            © <CurrentYear /> {t("rights")}
          </p>
          <p>
            {t("credit")}{" "}
            <a
              href={site.credit.url}
              className={`${linkClass} font-semibold text-inverse-foreground`}
            >
              {site.credit.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
