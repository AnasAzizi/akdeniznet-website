import type { ReactNode } from "react";

type PageIntroProps = {
  title: string;
  lead: string;
  children?: ReactNode;
};

/** The top of an inner page: its one <h1> and a short lead. */
export function PageIntro({ title, lead, children }: PageIntroProps) {
  return (
    <section className="container-page py-16 md:py-24">
      <h1 className="max-w-3xl text-h1 text-balance">{title}</h1>
      <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">
        {lead}
      </p>
      {children}
    </section>
  );
}
