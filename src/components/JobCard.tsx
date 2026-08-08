import { Link } from "@tanstack/react-router";
import { Bus, Hammer, Home, IndianRupee, MapPin, Sun, Utensils } from "lucide-react";

import { ListenButton } from "@/components/ListenButton";
import { useI18n } from "@/lib/i18n";

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
      className="block rounded-3xl border border-border bg-card p-4 shadow-card active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-card-foreground">{job.title}</h3>
          {job.crop ? <p className="text-sm text-muted-foreground">{job.crop}</p> : null}
        </div>
        <div className="flex shrink-0 items-center rounded-2xl bg-money px-3 py-2 text-money-foreground">
          <IndianRupee className="size-5" />
          <span className="text-2xl font-extrabold leading-none">{Number(job.wage_amount)}</span>
        </div>
      </div>

      <p className="mt-1 text-right text-xs font-semibold text-muted-foreground">{wageWord}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        {place ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
            <MapPin className="size-4" /> {place}
          </span>
        ) : null}
        {job.start_date ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
            <Sun className="size-4" /> {job.start_date}
          </span>
        ) : null}
        {job.food_provided ? <Perk icon={Utensils} label={t("foodProvided")} /> : null}
        {job.stay_provided ? <Perk icon={Home} label={t("stayProvided")} /> : null}
        {job.transport_provided ? <Perk icon={Bus} label={t("transportProvided")} /> : null}
        {job.tools_provided ? <Perk icon={Hammer} label={t("toolsProvided")} /> : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {job.escrow_funded ? (
          <span className="rounded-full bg-primary/12 px-3 py-1.5 text-xs font-bold text-primary">
            🔒 {t("moneyLocked")}
          </span>
        ) : (
          <span />
        )}
        <ListenButton text={spoken} />
      </div>
    </Link>
  );
}

function Perk({ icon: Icon, label }: { icon: typeof Utensils; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-1 font-semibold text-primary">
      <Icon className="size-4" /> {label}
    </span>
  );
}
