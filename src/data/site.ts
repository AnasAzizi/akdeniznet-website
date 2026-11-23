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
