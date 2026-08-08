import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Bug,
  Check,
  Droplets,
  Handshake,
  IndianRupee,
  Leaf,
  MilkOff,
  Quote,
  Search,
  Sprout,
  Star,
  Tractor,
  UserPlus,
  Users,
} from "lucide-react";

import farmerField from "@/assets/farmer-field.jpg";
import heroTractor from "@/assets/hero-tractor.jpg";
import workersHarvest from "@/assets/workers-harvest.jpg";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GO FARM WORK — Hire trusted farm workers & find farm jobs" },
      {
        name: "description",
        content:
          "India's freelancer marketplace for farming. Post farm work, hire verified farm partners, find steady farm jobs and get paid safely — in every Indian language.",
      },
      { property: "og:title", content: "GO FARM WORK — Hire trusted farm workers & find farm jobs" },
      {
        property: "og:description",
        content:
          "Post farm work or find work near your village. Verified profiles, milestone-based secure payments, 13 Indian languages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const stats = [
  { icon: Users, value: "12,400+", label: "Skilled Farm Partners" },
  { icon: Briefcase, value: "3,800+", label: "Farm Owners on board" },
  { icon: BadgeCheck, value: "27,100+", label: "Jobs Completed" },
  { icon: IndianRupee, value: "₹9.6 Cr", label: "Earned by Workers" },
];

const categories = [
  {
    icon: Sprout,
    title: "Crop Cultivation",
    body: "Sowing, transplanting, weeding and harvesting specialists.",
  },
  {
    icon: MilkOff,
    title: "Livestock Management",
    body: "Dairy, poultry and cattle-care experts for your farm.",
  },
  {
    icon: Tractor,
    title: "Equipment Operation",
    body: "Tractor, harvester, rotavator and tiller operators.",
  },
  {
    icon: Droplets,
    title: "Irrigation Systems",
    body: "Drip, sprinkler and borewell setup and maintenance.",
  },
  {
    icon: Leaf,
    title: "Organic Farming",
    body: "Natural composting, organic certification and advisory.",
  },
  {
    icon: Bug,
    title: "Crop Protection",
    body: "Pesticide spraying, drone operations and pest management.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Create a Profile",
    body: "Sign up as a Farm Owner or Farm Partner. Build your profile with skills, experience and credentials.",
  },
  {
    icon: Search,
    title: "Find Opportunities",
    body: "Browse thousands of farm jobs or search for skilled agricultural workers based on your needs.",
  },
  {
    icon: Handshake,
    title: "Connect & Hire",
    body: "Message potential matches, negotiate terms and secure agreements with our safe payment system.",
  },
  {
    icon: Star,
    title: "Work & Review",
    body: "Complete the job successfully and leave reviews to build your reputation in the farming community.",
  },
];

const plans = [
  {
    name: "Basic",
    price: "₹0",
    period: "forever",
    features: [
      "Unlimited job browsing",
      "Up to 3 proposals / month",
      "Basic profile visibility",
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
      "Advanced filters",
      "Priority email support",
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
      "API access",
    ],
    popular: false,
  },
];

const faqs = [
  {
    q: "Is GO FARM WORK free to use?",
    a: "Yes. Browsing jobs, creating a profile and sending up to three proposals a month is free forever. Paid plans only add visibility and volume.",
  },
  {
    q: "How do payments work?",
    a: "The farm owner funds the wage before work begins. The money is held safely and released milestone by milestone as the work is completed and confirmed.",
  },
  {
    q: "Which areas are covered?",
    a: "We are live across 31 districts and expanding steadily. Jobs are always ranked by distance from your village first.",
  },
  {
    q: "How do you verify Farm Partners?",
    a: "Every partner verifies a phone number, adds work history and collects ratings after each completed job. Verified badges are earned, never bought.",
  },
  {
    q: "Can I use the app in regional languages?",
    a: "Yes. The whole app works in 13 Indian languages with listen-and-speak buttons on every screen, so you never need to type or read to use it.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <img
            src={heroTractor}
            alt="Farmer ploughing a paddy field with a tractor at sunrise"
            width={1920}
            height={1088}
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-deep via-primary-deep/85 to-primary-deep/40" />

          <div className="mx-auto max-w-7xl px-4 pb-28 pt-20 text-primary-deep-foreground sm:pb-36 sm:pt-28 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-deep-foreground/25 bg-primary-deep-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
              India&apos;s farm work marketplace
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
              Connecting farms in need with farmers who deliver
            </h1>
            <p className="mt-6 max-w-xl text-base opacity-90 sm:text-lg">
              A trusted marketplace for farm jobs, agricultural services and farming expertise —
              voice-first, in your own language, with money held safely until the work is done.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/auth"
                search={{ role: "worker" }}
                className="inline-flex items-center gap-2 rounded-full bg-warn px-7 py-4 text-base font-bold text-warn-foreground shadow-lift transition-transform active:scale-95"
              >
                Find Work <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/auth"
                search={{ role: "landlord" }}
                className="inline-flex items-center gap-2 rounded-full bg-card px-7 py-4 text-base font-bold text-primary-deep shadow-lift transition-transform active:scale-95"
              >
                Hire Farmers
              </Link>
            </div>

            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
              Operating across India
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["31 districts", "29 job categories", "13 languages"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-primary-deep-foreground/25 px-4 py-1.5 text-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto -mt-16 max-w-7xl px-4 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-border bg-card p-6 shadow-lift"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </span>
                <p className="mt-5 font-display text-3xl font-extrabold text-card-foreground">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="categories" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <SectionHeading
            eyebrow="Categories"
            title="Explore farming categories"
            subtitle="Find skilled agricultural experts for your farming needs."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <article
                key={c.title}
                className="group rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="size-6" />
                </span>
                <h3 className="mt-6 text-lg font-bold text-card-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-secondary/50 py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading
              eyebrow="Simple process"
              title="How GO FARM WORK works"
              subtitle="Simple steps to connect farms with skilled agricultural workers."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <article
                  key={s.title}
                  className="relative rounded-3xl border border-border bg-card p-7"
                >
                  <span className="absolute -top-3 right-6 grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <s.icon className="size-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-card-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TWO AUDIENCES */}
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-24 lg:grid-cols-2 lg:px-8">
          <article
            id="for-owners"
            className="relative isolate overflow-hidden rounded-[2rem] bg-primary-deep p-9 text-primary-deep-foreground"
          >
            <img
              src={farmerField}
              alt="Farmer holding a bundle of harvested paddy"
              loading="lazy"
              width={1024}
              height={1024}
              className="absolute -bottom-8 -right-10 -z-10 size-72 rounded-full object-cover opacity-30"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
              For farm owners
            </p>
            <h3 className="mt-3 text-3xl font-extrabold">Hire skilled farmers fast</h3>
            <p className="mt-3 max-w-md text-sm opacity-85">
              Post any work — sowing, spraying, harvesting or machinery — and hire nearby Farm
              Partners quickly.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm">
              {["Post work in minutes", "Compare proposals", "Milestone-based secure payments"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-warn" /> {f}
                  </li>
                ),
              )}
            </ul>
            <Link
              to="/auth"
              search={{ role: "landlord" }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm font-bold text-primary-deep active:scale-95"
            >
              Hire Farmers <ArrowRight className="size-4" />
            </Link>
          </article>

          <article
            id="for-workers"
            className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-card p-9"
          >
            <img
              src={workersHarvest}
              alt="Farm workers harvesting vegetables"
              loading="lazy"
              width={1024}
              height={1024}
              className="absolute -bottom-10 -right-10 -z-10 size-64 rounded-full object-cover opacity-15"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              For farm partners
            </p>
            <h3 className="mt-3 text-3xl font-extrabold text-card-foreground">
              Find steady farm work
            </h3>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Browse nearby jobs, send proposals and build your reputation with ratings.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm text-card-foreground">
              {["Nearby jobs, any language", "Build trust with ratings", "On-time secure earnings"].map(
                (f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" /> {f}
                  </li>
                ),
              )}
            </ul>
            <Link
              to="/auth"
              search={{ role: "worker" }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground active:scale-95"
            >
              Find Work <ArrowRight className="size-4" />
            </Link>
          </article>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Affordable plans for everyone"
            subtitle="Choose the plan that works best for your farming needs."
          />
          <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
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
                  className={`mt-8 flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors ${
                    p.popular
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  }`}
                >
                  Get Started
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* QUOTE */}
        <section id="quote" className="bg-field py-24 text-primary-deep-foreground">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Quote className="mx-auto size-8 text-warn" />
            <p className="mt-6 font-display text-2xl font-semibold leading-snug sm:text-3xl">
              GO FARM WORK exists for one reason — to make sure farmers can always find willing
              hands when they need them, and skilled rural workers can always find dignified,
              well-paid work nearby. No middlemen. No empty promises.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-primary-deep-foreground/15 text-xs font-bold">
                GFW
              </span>
              <div className="text-left text-sm">
                <p className="font-bold">The GO FARM WORK Team</p>
                <p className="opacity-70">India</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-24 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA */}
        <section id="cta" className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
          <div className="rounded-[2rem] bg-field px-6 py-16 text-center text-primary-deep-foreground">
            <h2 className="text-3xl font-extrabold sm:text-5xl">Ready to get farm work done?</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm opacity-85 sm:text-base">
              Join thousands of farmers and farm owners building a stronger rural economy.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/auth"
                search={{ role: "worker" }}
                className="rounded-full bg-warn px-7 py-3.5 text-sm font-bold text-warn-foreground active:scale-95"
              >
                Find Work
              </Link>
              <Link
                to="/auth"
                search={{ role: "landlord" }}
                className="rounded-full bg-card px-7 py-3.5 text-sm font-bold text-primary-deep active:scale-95"
              >
                Hire Farmers
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-5xl">{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
