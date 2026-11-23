import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { DemoBanner } from "@/components/layout/demo-banner";
import { InitScript } from "@/components/layout/init-script";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProvider } from "@/components/motion/motion-provider";
import { site } from "@/data/site";
import { getDirection, routing } from "@/i18n/routing";

import "../globals.css";

/**
 * One variable family for headings and body. `latin-ext` carries the
 * Turkish letters (ğ ş ı İ); both subsets are needed on every page, so
 * next/font's preloading fits (no per-locale scripts to split).
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-jakarta",
});

/** Every page is prerendered once per locale. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ogLocales = { tr: "tr_TR", en: "en_US" } as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");

  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: `%s | ${site.name}` },
    description: t("description"),
    applicationName: site.name,
    // A portfolio redesign must not compete with the official site.
    robots: site.isPortfolioDemo ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t("title"),
      description: t("description"),
      locale: ogLocales[locale],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
};

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getTranslations("Common");

  return (
    // The init script adds `motion-ok` before React loads, so <html>'s
    // classes may differ from the server HTML.
    <html
      lang={locale}
      dir={getDirection(locale)}
      suppressHydrationWarning
      className={`${jakarta.variable} scroll-pt-24 antialiased`}
    >
      <body className="flex flex-col">
        <InitScript />
        <MotionProvider />
        {/* Client components get translated strings as props, so no messages are serialized. */}
        <NextIntlClientProvider messages={null}>
          <a
            href="#main"
            className="sr-only rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50"
          >
            {t("skipToContent")}
          </a>
          <DemoBanner />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
