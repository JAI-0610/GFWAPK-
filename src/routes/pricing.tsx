import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { MarketingPage } from "@/components/marketing/MarketingPage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Free Farm Jobs, Affordable Plans | GO FARM WORK" },
      {
        name: "description",
        content:
          "Browse jobs and hire for free. Upgrade to Professional at ₹499/month or Business at ₹1,499/month for unlimited proposals, featured placement and bulk posting.",
      },
      { property: "og:title", content: "GO FARM WORK Pricing" },
      {
        property: "og:description",
        content: "Free forever plan plus affordable Professional and Business tiers for farms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "Basic",
    price: "₹0",
    period: "forever",
    features: [
      "Unlimited job browsing",
      "Up to 3 proposals / month",
      "Basic profile visibility",
      "Voice search in 14 languages",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹499",
    period: "/ month",
    features: [
      "Unlimited proposals",
      "Featured profile placement",
      "Priority notifications",
      "Advanced filters and alerts",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Business",
    price: "₹1,499",
    period: "/ month",
    features: [
      "Everything in Professional",
      "Multi-user farm account",
      "Bulk job posting",
      "Dedicated account manager",
      "Crew payout reports",
    ],
    popular: false,
  },
];

const faqs = [
  {
    q: "Is there any commission on wages?",
    a: "No commission is taken from a worker's wage. Paid plans only cover visibility and volume for farms and professionals.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. Plans are monthly and can be cancelled before the next billing date. Your profile stays active on the free plan.",
  },
  {
    q: "Do workers ever have to pay?",
    a: "Never to find or accept work. The free plan covers everything a farm partner needs to get hired and get paid.",
  },
];

function Pricing() {
  return (
    <MarketingPage
      eyebrow="Pricing"
      title="Affordable plans for every farm"
      subtitle="Start free. Upgrade only when you need more reach, more proposals or a bigger crew."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid items-start gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`relative rounded-3xl border bg-card p-8 ${
                p.popular ? "border-primary shadow-lift lg:-mt-4 lg:pb-12" : "border-border"
              }`}
            >
              {p.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-warn px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-warn-foreground">
                  Most popular
                </span>
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {p.name}
              </p>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-extrabold text-card-foreground">
                  {p.price}
                </span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </p>
              <ul className="mt-7 grid gap-3 text-sm text-card-foreground">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                search={{ role: "worker" }}
                className={`mt-8 flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold active:scale-95 ${
                  p.popular
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-card-foreground"
                }`}
              >
                Get started
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-display text-2xl font-extrabold text-foreground">Pricing questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </MarketingPage>
  );
}
