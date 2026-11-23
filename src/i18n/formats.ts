import type { Formats } from "next-intl";

/**
 * Named number and date formats, usable in messages
 * (`{price, number, price}`, `{asOf, date, monthYear}`) and with
 * `format.number(value, "price")`. Self-contained so the data check can
 * import it without a bundler.
 */
export const formats = {
  number: {
    /** Whole Turkish lira with the ₺ sign: "₺1.250" (tr), "₺1,250" (en). */
    price: {
      style: "currency",
      currency: "TRY",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    },
  },
  dateTime: {
    /** "Eylül 2023" (tr), "September 2023" (en). */
    monthYear: { month: "long", year: "numeric" },
  },
} satisfies Formats;
