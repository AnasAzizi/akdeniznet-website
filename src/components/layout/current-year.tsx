import { cacheLife } from "next/cache";

/**
 * The current year. Cache Components forbids reading the clock while
 * prerendering, so the value is cached and refreshed daily.
 */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
