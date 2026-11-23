import type { ConfigOptions } from "@cloudflare/speedtest";

/**
 * The measurement sequence: Cloudflare's default, capped at 10 MB requests.
 *
 * The default steps up to 25, 100 and 250 MB files; on an 83 Mbps line it
 * used 169 MB. Akdeniznet's plans top out at 500 Mbps, where a 10 MB request
 * still takes long enough (~0.16 s) to measure. Slow lines stop earlier: the
 * engine skips larger files once a request takes over a second.
 */
export const MEASUREMENTS = [
  { type: "latency", numPackets: 1 },
  { type: "download", bytes: 1e5, count: 1, bypassMinDuration: true },
  { type: "latency", numPackets: 20 },
  { type: "download", bytes: 1e5, count: 9 },
  { type: "download", bytes: 1e6, count: 8 },
  { type: "upload", bytes: 1e5, count: 8 },
  { type: "upload", bytes: 1e6, count: 6 },
  { type: "download", bytes: 1e7, count: 3 },
  { type: "upload", bytes: 1e7, count: 2 },
] satisfies ConfigOptions["measurements"];

/** Upper bound of the payload the test transfers, in whole megabytes. */
export const MAX_TEST_MB = Math.ceil(
  // Latency steps carry no payload, so their bytes and count count as 0.
  MEASUREMENTS.reduce(
    (total, step) => total + (step.bytes ?? 0) * (step.count ?? 0),
    0,
  ) / 1e6,
);
