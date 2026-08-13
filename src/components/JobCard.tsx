import { Link } from "@tanstack/react-router";
import { Bus, Hammer, Home, IndianRupee, Lock, MapPin, Sun, Utensils } from "lucide-react";

import { ListenButton } from "@/components/ListenButton";
import { SaveJobButton } from "@/components/SaveJobButton";
import { WhatsAppButton } from "@/components/WhatsAppButton";

import { useI18n } from "@/lib/i18n";
import { jobShareText } from "@/lib/whatsapp";

export type JobRow = {
  id: string;
  title: string;
  crop: string | null;
  wage_amount: number;
  wage_type: "per_day" | "per_acre" | "fixed";
  village: string | null;
  district: string | null;
  start_date: string | null;
  crew_size: number;
  food_provided: boolean;
  stay_provided: boolean;
  transport_provided: boolean;
  tools_provided: boolean;
  women_friendly: boolean;
  urgency: string;
  escrow_funded: boolean;
};

export function JobCard({ job }: { job: JobRow }) {
  const { t } = useI18n();
  const place = [job.village, job.district].filter(Boolean).join(", ");
  const wageWord = t(
    job.wage_type === "per_day" ? "perDay" : job.wage_type === "per_acre" ? "perAcre" : "fixed",
  );
  const spoken = `${job.title}. ₹${job.wage_amount} ${wageWord}. ${place}. ${
    job.crew_size
  } ${t("workers")}.${job.food_provided ? ` ${t("foodProvided")}.` : ""}`;

  return (
    <Link
      to="/jobs/$id"
      params={{ id: job.id }}
      className="group relative block overflow-hidden rounded-xl border border-white/20 bg-white/40 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/60 hover:shadow-[0_8px_30px_rgb(30,200,100,0.15)] active:scale-[0.99] dark:border-white/10 dark:bg-black/30 dark:hover:bg-black/50"
    >
      <div className="absolute -right-16 -top-16 size-32 rounded-full bg-primary/10 blur-[40px] transition-all duration-500 group-hover:bg-primary/20 group-hover:blur-[50px] z-0 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">{job.title}</h3>
          {job.crop ? <p className="mt-0.5 text-sm text-muted-foreground">{job.crop}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <div className="flex items-center text-money">
            <IndianRupee className="size-4" />
            <span className="text-xl font-bold leading-none">{Number(job.wage_amount)}</span>
          </div>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{wageWord}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {place ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1 text-xs font-medium text-secondary-foreground">
            <MapPin className="size-3.5" /> {place}
          </span>
        ) : null}
        {job.start_date ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1 text-xs font-medium text-secondary-foreground">
            <Sun className="size-3.5" /> {job.start_date}
          </span>
        ) : null}
        {job.food_provided ? <Perk icon={Utensils} label={t("foodProvided")} /> : null}
        {job.stay_provided ? <Perk icon={Home} label={t("stayProvided")} /> : null}
        {job.transport_provided ? <Perk icon={Bus} label={t("transportProvided")} /> : null}
        {job.tools_provided ? <Perk icon={Hammer} label={t("toolsProvided")} /> : null}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        {job.escrow_funded ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <Lock className="size-3.5" aria-hidden="true" /> {t("moneyLocked")}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1">
          <ListenButton text={spoken} />
          <WhatsAppButton
            variant="ghost"
            label=""
            text={jobShareText({
              id: job.id,
              title: job.title,
              wage_amount: Number(job.wage_amount),
              wageWord,
              place,
            })}
          />
          <SaveJobButton jobId={job.id} />
        </div>
      </div>
    </Link>
  );
}

function Perk({ icon: Icon, label }: { icon: typeof Utensils; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
      <Icon className="size-3.5" /> {label}
    </span>
  );
}
