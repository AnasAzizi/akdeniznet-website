import { CircleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  /** Shown after the label, e.g. "(optional)". */
  optional?: string;
  hint?: string;
  error?: string;
  className?: string;
  /** The control, given `aria-describedby` / `aria-invalid` via `describedBy` below. */
  children: ReactNode;
};

/**
 * The ID a control should reference so its hint or error is read out.
 * Matches what <Field> renders: the error replaces the hint.
 */
export function describedBy(
  id: string,
  { hint, error }: { hint?: string; error?: string },
) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

/** Label, control, hint and error message for one form field. */
export function Field({
  id,
  label,
  optional,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">
            {" "}
            ({optional})
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-start gap-1.5 text-sm font-medium text-destructive"
        >
          <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
