import { MessageCircleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { site } from "@/data/site";

/**
 * Floating WhatsApp link, as on v1 (customers used it). A labelled pill in
 * the brand's navy rather than WhatsApp green, whose white icon would fail
 * the 3:1 non-text contrast rule.
 */
export async function WhatsAppButton() {
  const t = await getTranslations("Common");

  return (
    <a
      href={site.contact.whatsapp.href}
      target="_blank"
      rel="noopener"
      // Contains the visible word "WhatsApp" (WCAG 2.5.3, label in name).
      aria-label={t("whatsapp")}
      className="fixed end-4 bottom-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-inverse ps-4 pe-5 text-sm font-semibold text-inverse-foreground shadow-lg shadow-sea-950/20 transition-transform hover:-translate-y-0.5 md:end-6 md:bottom-6"
    >
      <MessageCircleIcon aria-hidden className="size-5 text-cta" />
      <span className="sr-only sm:not-sr-only">WhatsApp</span>
    </a>
  );
}
