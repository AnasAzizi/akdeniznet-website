import { notFound } from "next/navigation";

// This segment always stops at notFound(), so skip instant-navigation validation.
export const instant = false;

/** Any unknown path under a locale renders that locale's not-found page. */
export default function CatchAllPage() {
  notFound();
}
