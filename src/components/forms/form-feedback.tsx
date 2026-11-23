"use client";

import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, type RefObject, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/forms";

/**
 * Announces errors after a submission (aria-live) and moves focus to the
 * first invalid field, so keyboard and screen-reader users land on it.
 */
export function ErrorSummary<Field extends string>({
  state,
  formRef,
}: {
  state: FormState<Field>;
  formRef: RefObject<HTMLFormElement | null>;
}) {
  const t = useTranslations("Forms.errors");

  useEffect(() => {
    if (state.status !== "invalid") return;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [state, formRef]);

  const count =
    state.status === "invalid" ? Object.keys(state.errors).length : 0;

  return (
    <div aria-live="assertive" aria-atomic="true">
      {(state.status === "invalid" || state.status === "error") && (
        <p className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive">
          <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.status === "invalid" ? t("summary", { count }) : t("server")}
        </p>
      )}
    </div>
  );
}

/** Shown after a successful submission; focus moves to its heading. */
export function SuccessPanel({
  title,
  body,
  demoNotice,
  againLabel,
  onAgain,
}: {
  title: string;
  body: ReactNode;
  demoNotice?: string;
  againLabel: string;
  onAgain: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <div role="status" className="rounded-2xl border bg-card p-6 md:p-8">
      <CircleCheckIcon
        aria-hidden
        className="size-10 text-primary"
        strokeWidth={1.75}
      />
      <h2 ref={heading} tabIndex={-1} className="mt-4 text-h3 outline-none">
        {title}
      </h2>
      <p className="mt-2 text-pretty">{body}</p>
      {demoNotice && (
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          <InfoIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          {demoNotice}
        </p>
      )}
      <Button
        type="button"
        variant="outline"
        className="mt-6"
        onClick={onAgain}
      >
        {againLabel}
      </Button>
    </div>
  );
}

/** Hidden field that only bots fill in (see src/actions/forms.ts). */
export function Honeypot() {
  return (
    <div
      aria-hidden
      className="absolute -start-[9999px] size-px overflow-hidden"
    >
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
