"use client";

import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useRef, useState } from "react";

import { submitApplication } from "@/actions/forms";
import { describedBy, Field } from "@/components/forms/field";
import {
  ErrorSummary,
  Honeypot,
  SuccessPanel,
} from "@/components/forms/form-feedback";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import type { ApplicationField, FormState } from "@/lib/forms";

type PlanGroup = {
  label: string;
  /** `label` is the full option text (with price); `name` is for sentences. */
  options: { id: string; label: string; name: string }[];
};

type ApplyFormProps = {
  groups: PlanGroup[];
  defaultPlan?: string;
  /** Company phone number, for the demo notice. */
  phone: string;
};

const initialState: FormState<ApplicationField> = { status: "idle" };

/** Application for a new connection, validated by the Server Action. */
export function ApplyForm({ groups, defaultPlan, phone }: ApplyFormProps) {
  const t = useTranslations("Forms");
  const tApply = useTranslations("ApplyForm");
  const [state, formAction, pending] = useActionState(
    submitApplication,
    initialState,
  );
  const [dismissed, setDismissed] = useState<typeof state | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.status === "success" && dismissed !== state) {
    const plan = groups
      .flatMap((group) => group.options)
      .find((option) => option.id === state.planId);
    return (
      <SuccessPanel
        title={tApply("successTitle")}
        body={tApply("successBody", {
          name: state.name,
          plan: plan?.name ?? "",
        })}
        demoNotice={state.demo ? t("demoNotice", { phone }) : undefined}
        againLabel={tApply("another")}
        onAgain={() => setDismissed(state)}
      />
    );
  }

  const errors = state.status === "invalid" ? state.errors : {};
  const values =
    state.status === "invalid" || state.status === "error" ? state.values : {};
  const error = (field: ApplicationField) =>
    errors[field] ? t(`errors.${errors[field]}`) : undefined;
  const control = (field: ApplicationField, hint?: string) => ({
    id: `apply-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy(`apply-${field}`, {
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

      <Field id="apply-plan" label={t("fields.plan")} error={error("plan")}>
        <NativeSelect
          {...control("plan")}
          required
          defaultValue={values.plan ?? defaultPlan ?? ""}
        >
          <option value="" disabled>
            {t("fields.planPlaceholder")}
          </option>
          {groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </NativeSelect>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="apply-fullName"
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
        <Field
          id="apply-phone"
          label={t("fields.phone")}
          hint={t("hints.phone")}
          error={error("phone")}
        >
          <Input
            {...control("phone", t("hints.phone"))}
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            defaultValue={values.phone}
          />
        </Field>
      </div>

      <Field
        id="apply-email"
        label={t("fields.email")}
        optional={t("optional")}
        error={error("email")}
      >
        <Input
          {...control("email")}
          type="email"
          autoComplete="email"
          defaultValue={values.email}
        />
      </Field>

      <Field
        id="apply-address"
        label={t("fields.address")}
        hint={t("hints.address")}
        error={error("address")}
      >
        <Textarea
          {...control("address", t("hints.address"))}
          required
          rows={3}
          autoComplete="street-address"
          defaultValue={values.address}
        />
      </Field>

      <Field
        id="apply-note"
        label={t("fields.note")}
        optional={t("optional")}
        error={error("note")}
      >
        <Textarea {...control("note")} rows={3} defaultValue={values.note} />
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={
              errors.consent ? "apply-consent-error" : undefined
            }
            className="mt-0.5 size-6 shrink-0 accent-primary"
          />
          <span className="text-sm">{tApply("consent")}</span>
        </label>
        {errors.consent && (
          <p
            id="apply-consent-error"
            className="text-sm font-medium text-destructive"
          >
            {t(`errors.${errors.consent}`)}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="cta"
        size="lg"
        disabled={pending}
        className="self-start"
      >
        <SendIcon aria-hidden />
        {pending ? t("submitting") : tApply("submit")}
      </Button>
    </form>
  );
}
