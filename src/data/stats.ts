/**
 * Network and customer figures from the 2023 site's counters (tag v1-2023,
 * added 31 Aug 2023). v1 labelled the total "Mutlu Müşteri" (happy
 * customers); it is simply home + business subscribers, so v2 calls it what
 * it is and derives it instead of storing a fourth number.
 */
export const stats = {
  asOf: "2023-09",
  confirmed: false,
  /** "Verici noktası": transmitter sites across Mersin. */
  transmitterSites: 65,
  subscribers: {
    home: 8000,
    business: 254,
  },
} as const;

export const totalSubscribers =
  stats.subscribers.home + stats.subscribers.business;
