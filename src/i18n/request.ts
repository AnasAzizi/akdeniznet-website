import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";

import { routing } from "./routing";

/**
 * Resolves the locale from the `[locale]` root param, which keeps every page
 * statically renderable without setRequestLocale. An explicit `locale`
 * (e.g. from a Server Action) takes precedence.
 */
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const param = await rootParams.locale();
    if (!hasLocale(routing.locales, param)) notFound();
    locale = param;
  }

  return {
    locale,
    // A fixed zone keeps server and browser date formatting identical.
    timeZone: "Europe/Istanbul",
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
