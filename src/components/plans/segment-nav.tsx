import { getTranslations } from "next-intl/server";

import { segments } from "@/data/plans";

/**
 * Sticky jump links to each plan type on the plans page. Plain anchors:
 * every plan stays on one page (comparable, findable, no JS needed).
 */
export async function SegmentNav() {
  const t = await getTranslations("Plans");

  return (
    <nav
      aria-label={t("segmentNav")}
      className="sticky top-18 z-30 border-b bg-background/90 backdrop-blur-md"
    >
      <ul className="container-page flex [scrollbar-width:none] gap-2 overflow-x-auto py-3">
        {segments.map((segment) => (
          <li key={segment} className="shrink-0">
            <a
              href={`#${segment}`}
              className="inline-flex h-11 items-center rounded-full border bg-card px-4 text-sm font-semibold whitespace-nowrap transition-colors hover:border-foreground/40 hover:bg-muted"
            >
              {t(`segments.${segment}.name`)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
