import { site } from "@/data/site";

type Submission =
  | { kind: "application"; data: Record<string, string> }
  | { kind: "contact"; data: Record<string, string> };

/**
 * Sends a validated form submission to whoever handles it.
 *
 * While this is a portfolio demo, nothing is sent: submissions must never
 * reach Akdeniznet (they run their own site now), and the form tells the
 * visitor so. Connecting a real destination (an email service such as
 * Resend, or Akdeniznet's CRM) happens here, behind `isPortfolioDemo`.
 */
export async function deliver(submission: Submission): Promise<void> {
  if (site.isPortfolioDemo) return;

  throw new Error(
    `No delivery is configured for "${submission.kind}" forms. Connect one in src/lib/deliver.ts before turning off site.isPortfolioDemo.`,
  );
}
