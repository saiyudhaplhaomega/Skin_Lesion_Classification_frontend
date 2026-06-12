import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

type PublicShellProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
};

/** Shared shell for public/marketing/info pages: nav, glass header, footer. */
export function PublicShell({ eyebrow, title, lead, children }: PublicShellProps) {
  return (
    <>
      <SiteNav />
      <main className="relative z-[2] mx-auto w-[min(1120px,92%)] pb-12 pt-36">
        <header className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          {lead && <p className="mt-5 text-lg text-slate-soft">{lead}</p>}
        </header>
        <div className="mt-12">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
