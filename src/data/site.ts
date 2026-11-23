/**
 * Locale-independent facts about the business. Translated text lives in
 * messages/{tr,en}.json; this file holds only values that are the same in
 * every language. Contact details come from the original 2023 site.
 */
export const site = {
  name: "Akdeniznet",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /**
   * This build is a portfolio redesign, not Akdeniznet's official site.
   * While true: a banner says so, search engines are told not to index it,
   * and forms must not reach the company.
   */
  isPortfolioDemo: true,
  officialSiteUrl: "https://www.akdeniznet.com.tr",

  /** Akdeniznet's own customer portal (log in, pay bills). */
  portalUrl: "https://oim.akdeniznet.com.tr/login/index",

  contact: {
    phone: { display: "0850 471 87 83", href: "tel:+908504718783" },
    whatsapp: { display: "0539 471 87 83", href: "https://wa.me/905394718783" },
    email: "bilgi@akdeniznet.com",
    address: {
      street: "Yalınayak Mahallesi, Kanal Caddesi No: 60/AA",
      city: "Toroslar / Mersin",
    },
  },

  /**
   * The office on Google Maps, from v1's embed (place "Akdeniz Net |
   * Kablosuz Fiber İnternet"). `{lang}` is replaced with the page's locale.
   */
  map: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51097.47963668528!2d34.715178851367185!3d36.828284200000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1527f391f7a64a31%3A0xf285efe044581680!2sAkdeniz%20Net%20l%20Kablosuz%20Fiber%20%C4%B0nternet!5e0!3m2!1s{lang}!2str!4v1692861863099!5m2!1s{lang}!2str",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Akdeniz%20Net%20Yal%C4%B1nayak%20Kanal%20Caddesi%2060%20Toroslar%20Mersin",
  },

  /** Opening hours, 24-hour clock. Sunday is closed. */
  hours: { weekdays: "09:00–18:00", saturday: "09:00–18:00" },

  /** Footer credit for the designer and developer of this redesign. */
  credit: { name: "Anas Azizi", url: "https://anasazizi.com" },

  social: {
    facebook: "https://www.facebook.com/akdeniznettelekom",
    instagram: "https://www.instagram.com/akdeniz_net",
    youtube: "https://www.youtube.com/@AkdeniznetTelekom",
  },
} as const;
