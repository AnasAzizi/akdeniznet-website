import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { ContactCta, SpeedTeaser } from "@/components/home/closing-sections";
import { Highlights } from "@/components/home/highlights";
import { HomeHero } from "@/components/home/home-hero";
import { SegmentOverview } from "@/components/home/segment-overview";
import { StatsBand } from "@/components/home/stats-band";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { alternates: alternatesFor("/", locale) };
}

/**
 * Home: who it's for (plan types and starting prices), why Akdeniznet,
 * the network in numbers, the speed test, and how to get in touch.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <SegmentOverview />
      <Highlights />
      <StatsBand />
      <SpeedTeaser />
      <ContactCta />
    </>
  );
}
