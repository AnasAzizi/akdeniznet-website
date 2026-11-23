import { z } from "zod";

import { plans } from "@/data/plans";

/**
 * Validation shared by the Server Actions and the forms. Each failure's
 * message is an error code; the form shows `Forms.errors.<code>` in the
 * page's language, so the schema never holds user-facing text.
 */
export const formErrorCodes = [
  "required",
  "fullName",
  "phone",
  "email",
  "plan",
  "address",
  "message",
  "contactMethod",
  "consent",
  "tooLong",
] as const;
export type FormErrorCode = (typeof formErrorCodes)[number];

/**
 * A Turkish phone number reduced to its 10 national digits, or null.
 * Accepts +90 / 90 / 0 prefixes, spaces, dashes and brackets. National
 * numbers start with 2–5 (landlines and mobiles) or 8 (0850 numbers).
 */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s().-]/g, "");
  return digits.match(/^(?:\+?90|0)?([2-58]\d{9})$/)?.[1] ?? null;
}

const fullName = z.string().trim().min(3, "fullName").max(100, "tooLong");
const optionalEmail = z
  .string()
  .trim()
  .max(254, "tooLong")
  .refine(
    (value) => value === "" || z.email().safeParse(value).success,
    "email",
  );

export const applicationFields = [
  "plan",
  "fullName",
  "phone",
  "email",
  "address",
  "note",
] as const;
export type ApplicationField = (typeof applicationFields)[number] | "consent";

export const applicationSchema = z.object({
  plan: z.string().refine((id) => plans.some((plan) => plan.id === id), "plan"),
  fullName,
  phone: z
    .string()
    .trim()
    .refine((value) => normalizePhone(value) !== null, "phone"),
  email: optionalEmail,
  address: z.string().trim().min(10, "address").max(500, "tooLong"),
  note: z.string().trim().max(1000, "tooLong"),
  consent: z.literal("on", { error: "consent" }),
});

export const contactFields = ["fullName", "phone", "email", "message"] as const;
export type ContactField = (typeof contactFields)[number];

export const contactSchema = z
  .object({
    fullName,
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || normalizePhone(value) !== null,
        "phone",
      ),
    email: optionalEmail,
    message: z.string().trim().min(10, "message").max(2000, "tooLong"),
  })
  .refine((data) => data.phone !== "" || data.email !== "", {
    message: "contactMethod",
    path: ["phone"],
  });

/** What a form shows after a submission. */
export type FormState<Field extends string> =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: Partial<Record<Field, FormErrorCode>>;
      values: Partial<Record<Field, string>>;
    }
  | { status: "error"; values: Partial<Record<Field, string>> }
  | { status: "success"; name: string; planId?: string; demo: boolean };

/** The first error code for each field, from a failed parse. */
export function fieldErrors<Field extends string>(
  error: z.ZodError,
): Partial<Record<Field, FormErrorCode>> {
  const errors: Partial<Record<Field, FormErrorCode>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as Field;
    if (field in errors) continue;
    errors[field] = (formErrorCodes as readonly string[]).includes(
      issue.message,
    )
      ? (issue.message as FormErrorCode)
      : "required";
  }
  return errors;
}
