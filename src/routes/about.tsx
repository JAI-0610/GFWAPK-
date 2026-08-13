import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe2, HeartHandshake, ShieldCheck, Sprout } from "lucide-react";

import farmerField from "@/assets/farmer-field.jpg";
import { MarketingPage } from "@/components/marketing/MarketingPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GO FARM WORK — Dignified Work for Rural India" },
      {
        name: "description",
        content:
          "GO FARM WORK connects farm owners with skilled farm partners across India, with fair wages, secure payments and support for 14 Indian languages.",
      },
      { property: "og:title", content: "About GO FARM WORK" },
      {
        property: "og:description",
        content: "Our mission: fair, dignified and reliable farm work for every village in India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const values = [
  { icon: HeartHandshake, title: "Dignity first", body: "Farm work is skilled work. Every profile shows real experience, ratings and fair rates." },
  { icon: ShieldCheck, title: "Money you can trust", body: "Wages are funded up front and released as work is confirmed, so nobody chases payment." },
  { icon: Globe2, title: "Every Indian language", body: "14 languages with listen and speak buttons, so reading and typing are never a barrier." },
  { icon: Sprout, title: "Village-first design", body: "Built for low bandwidth, small screens and one-handed use in the middle of a field." },
];

function About() {
  return (
    <MarketingPage
      eyebrow="About us"
      title="Building the workforce backbone of Indian farming"
      subtitle="Millions of skilled farm workers and lakhs of farms still find each other by word of mouth. We are changing that."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img
            src={farmerField}
            alt="Farmer standing in a green paddy field"
            loading="lazy"
            width={1024}
            height={1024}
            className="h-80 w-full rounded-[2rem] object-cover shadow-lift"
          />
          <div>
            <h2 className="font-display text-3xl font-extrabold text-foreground">Our mission</h2>
            <p className="mt-4 text-base text-muted-foreground">
              GO FARM WORK exists so that a farm owner in any district can find the right crew in
              minutes, and so that every farm partner can find steady, fairly paid work close to
              home. We handle discovery, agreements, communication and secure payments — the farming
              stays with the farmers.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              The platform is voice-first and multilingual by design, because the people who feed
              this country should never be locked out of a tool built for them.
            </p>
            <Link
              to="/how-it-works"
              className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground active:scale-95"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <article key={v.title} className="rounded-3xl border border-border bg-card p-7 shadow-card">
              <v.icon className="size-8 text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold text-card-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingPage>
  );
}
