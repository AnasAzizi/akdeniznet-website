/**
 * Reasons to choose Akdeniznet. Each one restates a claim the 2023 site
 * made, so nothing here is invented; the text lives in
 * messages/{tr,en}.json under `Highlights.<key>`.
 */
export const highlights = [
  {
    key: "noCommitment",
    icon: "badge-check",
    /** Every plan card: "Taahhüt yok". */
    source: "v1 plan images (all 18)",
  },
  {
    key: "transparentPricing",
    icon: "receipt-text",
    /** "Hizmetlerimiz": no modem fee added to the bill later. */
    source: "v1 services section",
  },
  {
    key: "fastRepairs",
    icon: "wrench",
    /** Hero slide 3: "Online arıza işlemleri, 24 saat içinde arıza çözümü". */
    source: "v1 hero slide 3",
  },
  {
    key: "localNetwork",
    icon: "radio-tower",
    /** Counters: 65 transmitter sites, 8,254 subscribers (see stats.ts). */
    source: "v1 counters",
  },
] as const;

export type HighlightKey = (typeof highlights)[number]["key"];
