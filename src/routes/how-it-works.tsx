import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Handshake, Search, ShieldCheck, Star, UserPlus, Wallet } from "lucide-react";

import { MarketingPage } from "@/components/marketing/MarketingPage";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How GO FARM WORK Works — Hire or Find Farm Work in 4 Steps" },
      {
        name: "description",
        content:
          "Create a profile, post or find farm work, agree the wage, and get paid safely through milestone payments. Here is exactly how GO FARM WORK works.",
      },
      { property: "og:title", content: "How GO FARM WORK Works" },
      {
        property: "og:description",
        content: "Four simple steps from profile to payment, in any Indian language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const owner = [
  { icon: UserPlus, title: "Create your farm profile", body: "Add your farm, village and the crops you grow. Takes two minutes with voice input." },
  { icon: Search, title: "Post the work", body: "Describe the job, crew size, wage and perks like food, stay or transport." },
  { icon: Handshake, title: "Compare and hire", body: "Review proposals, listen to voice notes, check ratings and hire the right crew." },
  { icon: Wallet, title: "Pay on completion", body: "Fund the wage up front; it is released milestone by milestone as work is confirmed." },
];

const worker = [
  { icon: UserPlus, title: "Build your work profile", body: "List your skills, equipment and experience. Speak instead of typing if you prefer." },
  { icon: Search, title: "Find jobs near your village", body: "Jobs are ranked by distance first, with wage, perks and crew size shown clearly." },
  { icon: Handshake, title: "Send a proposal", body: "Apply with a voice note, accept the wage or send a counter-offer." },
  { icon: Star, title: "Work and get paid", body: "Finish the job, get paid securely and collect a rating that wins your next job." },
];

function HowItWorks() {
  return (
    <MarketingPage
      eyebrow="How it works"
      title="From profile to payment in four steps"
      subtitle="The same simple flow, whether you are hiring a harvest crew or looking for steady farm work."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Track label="For farm owners" steps={owner} role="landlord" cta="Post a job" />
          <Track label="For farm partners" steps={worker} role="worker" cta="Find work" />
        </div>

        <div className="mt-16 rounded-[2rem] border border-border bg-card p-9 shadow-card">
          <ShieldCheck className="size-9 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-extrabold text-card-foreground">
            Why payments are safe
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            The farm owner funds the agreed wage before work begins. The money is held in a secure
            wallet and released as each milestone is confirmed, so workers are never left unpaid and
            owners never pay for work that was not done. Every transaction is logged in your wallet
            history.
          </p>
        </div>
      </section>
    </MarketingPage>
  );
}

function Track({
  label,
  steps,
  role,
  cta,
}: {
  label: string;
  steps: { icon: typeof UserPlus; title: string; body: string }[];
  role: "worker" | "landlord";
  cta: string;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <ol className="mt-6 grid gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
              <s.icon className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-card-foreground">
                {i + 1}. {s.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link
        to="/auth"
        search={{ role }}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground active:scale-95"
      >
        {cta} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
