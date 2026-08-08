import type { ReactNode } from "react";

import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export function MarketingPage({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-field px-4 py-16 text-primary-deep-foreground lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">{eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base opacity-85">{subtitle}</p>
          </div>
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
