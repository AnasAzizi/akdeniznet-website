import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";

type Namespace = keyof Awaited<ReturnType<typeof getMessages>>;

/**
 * Sends only the named message namespaces to the client components inside
 * (forms, the speed test), so they can call useTranslations without the
 * whole catalogue being serialized into every page.
 */
export async function ClientMessages({
  namespaces,
  children,
}: {
  namespaces: readonly Namespace[];
  children: ReactNode;
}) {
  const messages = await getMessages();
  const picked = Object.fromEntries(
    namespaces.map((namespace) => [namespace, messages[namespace]]),
  );

  return (
    <NextIntlClientProvider messages={picked}>
      {children}
    </NextIntlClientProvider>
  );
}
