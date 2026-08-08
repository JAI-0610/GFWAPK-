import { createFileRoute, Link } from "@tanstack/react-router";
import { IndianRupee, Lock, Mic, Users } from "lucide-react";

import { LanguagePicker } from "@/components/LanguagePicker";
import { ListenButton } from "@/components/ListenButton";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GO FARM WORK — Farm jobs, fair wages, safe payments" },
      {
        name: "description",
        content:
          "A voice-first, multilingual marketplace where farm owners post work and farm workers get hired, tracked and paid safely.",
      },
      { property: "og:title", content: "GO FARM WORK — Farm jobs, fair wages, safe payments" },
      {
        property: "og:description",
        content:
          "Post farm work or find work near your village. Voice-first, in your own language, with money held safely until the job is done.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  const pitch = `${t("appName")}. ${t("tagline")}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-field px-5 pb-12 pt-5 text-primary-deep-foreground">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight">{t("appName")}</span>
          <LanguagePicker compact />
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">{t("tagline")}</h1>
          <p className="mt-3 max-w-md text-base opacity-90">
            Speak. Get matched. Get paid. Built for villages, in your language.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              search={{ role: "worker" }}
              className="inline-flex items-center gap-2 rounded-2xl bg-card px-6 py-4 text-lg font-bold text-primary-deep shadow-lift active:scale-95"
            >
              <Users className="size-6" /> {t("findWork")}
            </Link>
            <Link
              to="/auth"
              search={{ role: "landlord" }}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-card/50 px-6 py-4 text-lg font-bold active:scale-95"
            >
              {t("postWork")}
            </Link>
            <ListenButton text={pitch} className="bg-card/15 text-current" />
          </div>
        </div>
      </header>

      <section className="mx-auto -mt-6 grid max-w-3xl gap-3 px-4 pb-16">
        <Feature
          icon={Mic}
          title="Speak, don't type"
          body="Say what work you need or what work you want. The app fills the rest."
        />
        <Feature
          icon={Lock}
          title="Money held safely"
          body="The farm owner puts the wage in before work starts. It is released as work is done."
        />
        <Feature
          icon={IndianRupee}
          title="Fair, local wages"
          body="See what the going rate is for this crop and this district before you agree."
        />
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Mic;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5 shadow-card">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon className="size-6" />
      </span>
      <div>
        <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
