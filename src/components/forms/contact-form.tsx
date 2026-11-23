"use client";

import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useRef, useState } from "react";

import { submitContact } from "@/actions/forms";
import { describedBy, Field } from "@/components/forms/field";
import {
  ErrorSummary,
  Honeypot,
  SuccessPanel,
} from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import type { ContactField, FormState } from "@/lib/forms";

const initialState: FormState<ContactField> = { status: "idle" };

/** A message to Akdeniznet: name, phone or email (at least one), and the message. */
export function ContactForm({ phone }: { phone: string }) {
  const t = useTranslations("Forms");
  const tContact = useTranslations("ContactForm");
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState,
  );
  const [dismissed, setDismissed] = useState<typeof state | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.status === "success" && dismissed !== state) {
    return (
      <SuccessPanel
        title={tContact("successTitle")}
        body={tContact("successBody", { name: state.name })}
        demoNotice={state.demo ? t("demoNotice", { phone }) : undefined}
        againLabel={tContact("another")}
        onAgain={() => setDismissed(state)}
      />
    );
  }

  const errors = state.status === "invalid" ? state.errors : {};
  const values =
    state.status === "invalid" || state.status === "error" ? state.values : {};
  const error = (field: ContactField) =>
    errors[field] ? t(`errors.${errors[field]}`) : undefined;
  const control = (field: ContactField, hint?: string) => ({
    id: `contact-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy(`contact-${field}`, {
      hint,
      error: error(field),
    }),
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="relative flex flex-col gap-6"
    >
      <ErrorSummary state={state} formRef={formRef} />
      <Honeypot />

      <Field
        id="contact-fullName"
        label={t("fields.fullName")}
        error={error("fullName")}
      >
        <Input
          {...control("fullName")}
          required
          autoComplete="name"
          defaultValue={values.fullName}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="contact-phone"
          label={t("fields.phone")}
          hint={t("hints.contactMethod")}
          error={error("phone")}
        >
          <Input
            {...control("phone", t("hints.contactMethod"))}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={values.phone}
          />
        </Field>
        <Field
          id="contact-email"
          label={t("fields.email")}
          error={error("email")}
        >
          <Input
            {...control("email")}
            type="email"
            autoComplete="email"
            defaultValue={values.email}
          />
        </Field>
      </div>

      <Field
        id="contact-message"
        label={t("fields.message")}
        error={error("message")}
      >
        <Textarea
          {...control("message")}
          required
          rows={5}
          defaultValue={values.message}
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        <SendIcon aria-hidden />
        {pending ? t("submitting") : tContact("submit")}
      </Button>
    </form>
  );
}
