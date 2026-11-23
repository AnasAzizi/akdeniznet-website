import logo from "@/assets/brand/akdeniznet-logo.png";
import { site } from "@/data/site";

/**
 * schema.org LocalBusiness for the home page: the business's own facts
 * (official URL, phone, address, hours, social profiles), so search
 * engines can show them. No prices: the published ones date from 2023.
 */
export function LocalBusinessJsonLd() {
  const { contact, hours, social } = site;
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: site.officialSiteUrl,
    logo: new URL(logo.src, site.url).toString(),
    telephone: contact.phone.href.replace("tel:", ""),
    email: contact.email,
    areaServed: "Mersin",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: "Toroslar",
      addressRegion: "Mersin",
      addressCountry: "TR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: hours.weekdays.opens,
        closes: hours.weekdays.closes,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: hours.saturday.opens,
        closes: hours.saturday.closes,
      },
    ],
    sameAs: Object.values(social),
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
