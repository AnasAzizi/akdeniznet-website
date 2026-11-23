"use server";

import { site } from "@/data/site";
import { deliver } from "@/lib/deliver";
import {
  applicationFields,
  applicationSchema,
  type ApplicationField,
  contactFields,
  contactSchema,
  type ContactField,
  fieldErrors,
  type FormState,
} from "@/lib/forms";

/** Name of the hidden field only bots fill in. */
const HONEYPOT = "website";

const read = <Field extends string>(
  formData: FormData,
  fields: readonly Field[],
) =>
  Object.fromEntries(
    fields.map((field) => [field, String(formData.get(field) ?? "")]),
  ) as Record<Field, string>;

const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? "";

/** A bot filled the honeypot: answer as if it worked and do nothing. */
const isBot = (formData: FormData) =>
  String(formData.get(HONEYPOT) ?? "") !== "";

export async function submitApplication(
  _previous: FormState<ApplicationField>,
  formData: FormData,
): Promise<FormState<ApplicationField>> {
  const values = read(formData, applicationFields);
  if (isBot(formData))
    return { status: "success", name: "", demo: site.isPortfolioDemo };

  const parsed = applicationSchema.safeParse({
    ...values,
    consent: formData.get("consent") ?? undefined,
  });
  if (!parsed.success)
    return { status: "invalid", errors: fieldErrors(parsed.error), values };

  try {
    const { plan, fullName, phone, email, address, note } = parsed.data;
    await deliver({
      kind: "application",
      data: { plan, fullName, phone, email, address, note },
    });
  } catch (error) {
    console.error("Application delivery failed", error);
    return { status: "error", values };
  }

  return {
    status: "success",
    name: firstName(parsed.data.fullName),
    planId: parsed.data.plan,
    demo: site.isPortfolioDemo,
  };
}

export async function submitContact(
  _previous: FormState<ContactField>,
  formData: FormData,
): Promise<FormState<ContactField>> {
  const values = read(formData, contactFields);
  if (isBot(formData))
    return { status: "success", name: "", demo: site.isPortfolioDemo };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success)
    return { status: "invalid", errors: fieldErrors(parsed.error), values };

  try {
    await deliver({ kind: "contact", data: parsed.data });
  } catch (error) {
    console.error("Contact delivery failed", error);
    return { status: "error", values };
  }

  return {
    status: "success",
    name: firstName(parsed.data.fullName),
    demo: site.isPortfolioDemo,
  };
}
