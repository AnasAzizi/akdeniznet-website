/**
 * Akdeniznet's internet plans, transcribed from the 18 plan images on the
 * 2023 site (tag v1-2023, `public/images/desktop/…`). The data is validated
 * when this module loads, so a typo fails the build and `npm run data:check`.
 *
 * Self-contained on purpose (imports only zod, type-only syntax that Node can
 * strip), so the CI check can import it without a bundler.
 *
 * Deliberately not stored, because v1 derived or never stated them:
 * - "symmetric": computed from the speeds (v1's asymmetric cards all said
 *   "SİMETRİ İNTERNET" by mistake).
 * - Upload speed of home plans: v1 only gave the download speed.
 * - "Mutluluk Var" ("happiness included"): a slogan, not a plan feature.
 */
import { z } from "zod";

/** Provenance of the prices. Shown next to prices until the client confirms them. */
export const planSource = {
  /** Year and month the v1 plan images were published. */
  asOf: "2023-09",
  confirmed: false,
} as const;

export const segments = [
  "home",
  "business-symmetric",
  "business-asymmetric",
] as const;
export type Segment = (typeof segments)[number];

export const planFeatures = [
  /** "Taahhüt yok": no minimum contract (every plan). */
  "no-commitment",
  /** "Telefon yok": no landline needed (home plans). */
  "no-phone-line",
  /** "Sınırsız": unlimited data (business plans). */
  "unlimited-data",
  /** "AKN yok": no fair-usage threshold that slows the line (business plans). */
  "no-fair-usage-cap",
] as const;
export type PlanFeature = (typeof planFeatures)[number];

const planSchema = z
  .object({
    /** Stable, URL-safe identifier (used in `/basvuru?plan=…`). */
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    segment: z.enum(segments),
    /** Product name as sold ("Metro 20", "Eko Paket"); null for home plans, which are named by speed. */
    name: z.string().min(1).nullable(),
    downloadMbps: z.number().int().positive(),
    /** null when the plan doesn't state it. */
    uploadMbps: z.number().int().positive().nullable(),
    /** Monthly price in Turkish lira; null means "Fiyat alınız" (price on request). */
    monthlyPriceTRY: z.number().int().positive().nullable(),
    features: z.array(z.enum(planFeatures)).min(1),
  })
  .superRefine((plan, ctx) => {
    const issue = (message: string) =>
      ctx.addIssue({ code: "custom", message: `${plan.id}: ${message}` });

    if (plan.segment === "home" && plan.name !== null)
      issue("home plans are named by their speed");
    if (plan.segment !== "home" && plan.name === null)
      issue("business plans need a product name");
    if (plan.segment !== "home" && plan.uploadMbps === null)
      issue("business plans must state an upload speed");
    if (
      plan.segment === "business-symmetric" &&
      plan.uploadMbps !== plan.downloadMbps
    )
      issue("a symmetric plan needs equal download and upload speeds");
    if (
      plan.segment === "business-asymmetric" &&
      plan.uploadMbps !== null &&
      plan.uploadMbps >= plan.downloadMbps
    )
      issue("an asymmetric plan needs upload slower than download");
    if (new Set(plan.features).size !== plan.features.length)
      issue("duplicate features");
  });

export type Plan = z.infer<typeof planSchema>;

const plansSchema = z.array(planSchema).superRefine((list, ctx) => {
  const ids = new Set<string>();
  for (const plan of list) {
    if (ids.has(plan.id))
      ctx.addIssue({ code: "custom", message: `duplicate id: ${plan.id}` });
    ids.add(plan.id);
  }

  // Within a segment, plans are listed slowest first, and a faster plan never
  // costs less. This catches transcription slips such as a mistyped price or
  // two swapped rows. Price-on-request plans come last.
  for (const segment of segments) {
    const inSegment = list.filter((plan) => plan.segment === segment);
    for (let i = 1; i < inSegment.length; i++) {
      const [prev, next] = [inSegment[i - 1], inSegment[i]];
      const slower =
        next.downloadMbps < prev.downloadMbps ||
        (next.downloadMbps === prev.downloadMbps &&
          (next.uploadMbps ?? 0) <= (prev.uploadMbps ?? 0));
      if (slower)
        ctx.addIssue({
          code: "custom",
          message: `${next.id} must be faster than ${prev.id}`,
        });
      if (prev.monthlyPriceTRY === null && next.monthlyPriceTRY !== null)
        ctx.addIssue({
          code: "custom",
          message: `${next.id}: price-on-request plans go last`,
        });
      if (
        prev.monthlyPriceTRY !== null &&
        next.monthlyPriceTRY !== null &&
        next.monthlyPriceTRY < prev.monthlyPriceTRY
      )
        ctx.addIssue({
          code: "custom",
          message: `${next.id} is faster but cheaper than ${prev.id}`,
        });
    }
  }
});

const home = ["no-commitment", "no-phone-line"] as const;
const business = [
  "unlimited-data",
  "no-commitment",
  "no-fair-usage-cap",
] as const;

/** Exactly as published in September 2023, in v1's order. */
// prettier-ignore
const rawPlans = [
  // Home ("Bireysel"): download speed only.
  { id: "home-4", segment: "home", name: null, downloadMbps: 4, uploadMbps: null, monthlyPriceTRY: 150, features: [...home] },
  { id: "home-6", segment: "home", name: null, downloadMbps: 6, uploadMbps: null, monthlyPriceTRY: 170, features: [...home] },
  { id: "home-10", segment: "home", name: null, downloadMbps: 10, uploadMbps: null, monthlyPriceTRY: 180, features: [...home] },
  { id: "home-12", segment: "home", name: null, downloadMbps: 12, uploadMbps: null, monthlyPriceTRY: 190, features: [...home] },
  { id: "home-16", segment: "home", name: null, downloadMbps: 16, uploadMbps: null, monthlyPriceTRY: 210, features: [...home] },
  { id: "home-25", segment: "home", name: null, downloadMbps: 25, uploadMbps: null, monthlyPriceTRY: 250, features: [...home] },

  // Business, symmetric ("Kurumsal Simetrik"): "Metro" plans.
  { id: "metro-20", segment: "business-symmetric", name: "Metro 20", downloadMbps: 20, uploadMbps: 20, monthlyPriceTRY: 800, features: [...business] },
  { id: "metro-30", segment: "business-symmetric", name: "Metro 30", downloadMbps: 30, uploadMbps: 30, monthlyPriceTRY: 1200, features: [...business] },
  { id: "metro-50", segment: "business-symmetric", name: "Metro 50", downloadMbps: 50, uploadMbps: 50, monthlyPriceTRY: 1800, features: [...business] },
  { id: "metro-100", segment: "business-symmetric", name: "Metro 100", downloadMbps: 100, uploadMbps: 100, monthlyPriceTRY: 3500, features: [...business] },
  { id: "metro-200", segment: "business-symmetric", name: "Metro 200", downloadMbps: 200, uploadMbps: 200, monthlyPriceTRY: null, features: [...business] },
  { id: "metro-500", segment: "business-symmetric", name: "Metro 500", downloadMbps: 500, uploadMbps: 500, monthlyPriceTRY: null, features: [...business] },

  // Business, asymmetric ("Kurumsal Asimetrik"): all sold as "Eko Paket".
  { id: "eko-16-5", segment: "business-asymmetric", name: "Eko Paket", downloadMbps: 16, uploadMbps: 5, monthlyPriceTRY: 350, features: [...business] },
  { id: "eko-24-5", segment: "business-asymmetric", name: "Eko Paket", downloadMbps: 24, uploadMbps: 5, monthlyPriceTRY: 400, features: [...business] },
  { id: "eko-35-5", segment: "business-asymmetric", name: "Eko Paket", downloadMbps: 35, uploadMbps: 5, monthlyPriceTRY: 550, features: [...business] },
  { id: "eko-35-15", segment: "business-asymmetric", name: "Eko Paket", downloadMbps: 35, uploadMbps: 15, monthlyPriceTRY: 800, features: [...business] },
  { id: "eko-50-20", segment: "business-asymmetric", name: "Eko Paket", downloadMbps: 50, uploadMbps: 20, monthlyPriceTRY: 1250, features: [...business] },
  { id: "eko-75-50", segment: "business-asymmetric", name: "Eko Paket", downloadMbps: 75, uploadMbps: 50, monthlyPriceTRY: 2200, features: [...business] },
] satisfies z.input<typeof planSchema>[];

/** All plans, validated. Throws (failing the build) if the data is invalid. */
export const plans: readonly Plan[] = plansSchema.parse(rawPlans);

/** Plans in one segment, slowest first. */
export function plansIn(segment: Segment): Plan[] {
  return plans.filter((plan) => plan.segment === segment);
}

export function getPlan(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

/** Same download and upload speed. Derived, never stored. */
export function isSymmetric(plan: Plan): boolean {
  return plan.uploadMbps !== null && plan.uploadMbps === plan.downloadMbps;
}

/** The lowest listed monthly price in a segment ("from …"). */
export function startingPrice(segment: Segment): number | null {
  const prices = plansIn(segment)
    .map((plan) => plan.monthlyPriceTRY)
    .filter((price): price is number => price !== null);
  return prices.length ? Math.min(...prices) : null;
}
