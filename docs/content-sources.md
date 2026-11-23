# Content sources

Every fact on the v2 site comes from the 2023 site (tag `v1-2023`) or from Akdeniznet. This file records where each one came from, what v1 got wrong, and what to confirm with the client before the site could go live. Nothing in v2 is invented.

## Where the facts come from

| Fact                                                 | Value in v2                                     | Source in v1                                   | Lives in                 |
| ---------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------- | ------------------------ |
| Home plans                                           | 6 plans, 4–25 Mbps, ₺150–250                    | Plan images `bireysel/*.jpg` (Aug–Sep 2023)    | `src/data/plans.ts`      |
| Business symmetric plans                             | "Metro" 20–500 Mbps, ₺800–3,500, two on request | Plan images `KURUMSAL SIMETRIK/*.jpg`          | `src/data/plans.ts`      |
| Business asymmetric plans                            | "Eko Paket" 16/5–75/50 Mbps, ₺350–2,200         | Plan images `KURUMSAL ASIMETRIK/*.jpg`         | `src/data/plans.ts`      |
| No commitment                                        | All 18 plans                                    | "Taahhüt yok" on every plan image              | `planFeatures`           |
| No landline needed                                   | Home plans                                      | "Telefon yok" on home plan images              | `planFeatures`           |
| Unlimited data, no fair-usage cap                    | Business plans                                  | "Sınırsız", "AKN yok" on business plan images  | `planFeatures`           |
| 65 transmitter sites                                 |                                                 | Counter "Verici Noktası"                       | `src/data/stats.ts`      |
| 8,000 home + 254 business subscribers                | Total 8,254 is derived                          | Counters (v1 called the total "Mutlu Müşteri") | `src/data/stats.ts`      |
| Faults fixed within 24 hours, reported online        |                                                 | Hero slide 3                                   | `src/data/highlights.ts` |
| No hidden modem fee                                  |                                                 | Services section text                          | `src/data/highlights.ts` |
| Phone, WhatsApp, email, address, hours, social links |                                                 | Contact section, footer, floating buttons      | `src/data/site.ts`       |

## Errors in v1 that v2 fixes

- **All six asymmetric plans said "SİMETRİ İNTERNET"** (symmetric internet). Every card also misspelled "simetrik" as "simetri". v2 derives symmetric/asymmetric from the speeds, so the label can't contradict the numbers.
- **The Metro 100 image (₺3,500) was named `5000.jpg`.**
- **Both services ("Modem Kurulumu" and "Fiber İnternet") shared the same copy-pasted paragraph**, which was about pricing, not either service.
- **The subscriber total was labelled "happy customers"** although it is simply home + business subscribers.
- **Every plan's "buy" link opened the existing-customer login**, so new customers had no way to apply.

## Removed from v1

- **"Mutluluk Var" ("happiness included")** on home plans: a slogan, not a plan feature.
- **The stock photos with text baked into them** (hero slides): their licence is unknown, and baked-in text can't be read by search engines or screen readers, or translated.

## Questions for Akdeniznet

1. **Current prices.** v2 shows the September 2023 price list, labelled with its date.
2. **Upload speeds of the home plans.** v1 only stated the download speed.
3. **Billing details.** Are prices monthly, and do they include VAT (KDV)? v2 shows "/ay" (per month) but makes no VAT claim.
4. **"Telefon yok".** v2 reads it as "no landline needed". Is that right?
5. **Technology.** The 65 "verici noktası" (transmitter sites) and the slogan "fiber hızında internet" (fiber-_speed_ internet) suggest a wireless network, but v1 also listed "Fiber İnternet" as a service. Which technologies does each plan use? Until confirmed, v2 claims neither.
6. **Current figures.** Transmitter sites and subscriber counts are from 2023.
7. **A vector logo (SVG).** v2 uses the 334×78 PNG from v1.
8. **Permission** to show the Akdeniznet name, logo and plans in a portfolio case study.
