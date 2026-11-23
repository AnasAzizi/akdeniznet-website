import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/**
 * Serves Turkish at unprefixed URLs, English under `/en`, and translates
 * localized pathnames (`/en/plans` → the `/tarifeler` route).
 */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|_next|.*\\..*).*)",
};
