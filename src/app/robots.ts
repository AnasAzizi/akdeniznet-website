import type { MetadataRoute } from "next";

import { site } from "@/data/site";

/**
 * Crawling stays allowed even for the portfolio demo: its pages say
 * `noindex`, and crawlers can only see that if they may fetch them. The
 * sitemap is advertised only once this is the real site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(site.isPortfolioDemo ? {} : { sitemap: `${site.url}/sitemap.xml` }),
  };
}
