import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, IndianRupee, PlusCircle, Search, Users, Wallet } from "lucide-react";

import farmerField from "@/assets/farmer-field.jpg";
import heroTractor from "@/assets/hero-tractor.jpg";
import workersHarvest from "@/assets/workers-harvest.jpg";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { JobCard, type JobRow } from "@/components/JobCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();
  const { profile, isWorker, isOwner, user } = useAuth();

  const { data: jobs } = useQuery({
    queryKey: ["dash-jobs", isWorker, isOwner, user?.id],
    queryFn: async () => {
      const query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
        
      let res;
      if (isWorker && isOwner) {
        res = await query.or(`owner_id.eq.${user!.id},status.eq.open`);
      } else if (isOwner) {
        res = await query.eq("owner_id", user!.id);
      } else {
        res = await query.eq("status", "open");
      }
      
      if (res.error) throw res.error;
      return (res.data ?? []) as JobRow[];
    },
  });

  const { data: wallet } = useQuery({
    queryKey: ["wallet-sum", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("amount, direction");
      if (error) throw error;
      return (data ?? []).reduce(
        (sum, r) => sum + (r.direction === "debit" ? -Number(r.amount) : Number(r.amount)),
        0,
      );
    },
  });

  const myJobs = jobs?.filter((j) => j.owner_id === user?.id) || [];
  const openJobs = jobs?.filter((j) => j.status === "open" && j.owner_id !== user?.id) || [];

  return (
    <AppShell
      title={profile?.full_name ? `Namaste, ${profile.full_name.split(" ")[0]}` : t("appName")}
      subtitle={[profile?.village, profile?.district].filter(Boolean).join(", ") || t("tagline")}
      headerImage={heroTractor}
    >
      <div className="flex flex-col gap-3">
        <div className={cn("grid gap-3", isWorker && isOwner ? "grid-cols-2" : "grid-cols-1")}>
          {isWorker && (
            <Link
              to="/jobs"
              className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-cover bg-center p-6 text-white shadow-sm transition-all hover:border-primary/30 hover:shadow-card active:scale-[0.99]"
              style={{ backgroundImage: `url(${workersHarvest})` }}
            >
              <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent transition-opacity group-hover:bg-black/50" />
              <Search className="relative size-8 drop-shadow-md" />
              <span className="relative text-lg font-bold drop-shadow-md">{t("findWork")}</span>
            </Link>
          )}
          {isOwner && (
            <Link
              to="/post-job"
              className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-cover bg-center p-6 text-white shadow-sm transition-all hover:border-primary/30 hover:shadow-card active:scale-[0.99]"
              style={{ backgroundImage: `url(${farmerField})` }}
            >
              <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent transition-opacity group-hover:bg-black/50" />
              <PlusCircle className="relative size-8 drop-shadow-md" />
              <span className="relative text-lg font-bold drop-shadow-md">{t("postWork")}</span>
            </Link>
          )}
        </div>

        <Link
          to="/wallet"
          className="group relative mt-1 flex items-center justify-between overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-card active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Wallet className="size-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">{t("balance")}</span>
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                ₹{wallet ?? 0}
              </span>
            </div>
          </div>
          <div className="rounded-full bg-secondary p-3 text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <PlusCircle className="size-5" />
          </div>
        </Link>
      </div>

      {isOwner && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Briefcase className="size-5 text-primary" />
            {t("myJobs")}
          </h2>
          <div className="mt-4 space-y-3">
            {myJobs.length > 0 ? (
              myJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <EmptyState
                icon={Briefcase}
                title={t("myJobs")}
                body="You haven't posted any jobs yet. Create one to find workers."
                actionLabel={t("postWork")}
                actionTo="/post-job"
              />
            )}
          </div>
        </div>
      )}

      {isWorker && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Users className="size-5 text-primary" />
            {t("jobsNearYou")}
          </h2>
          <div className="mt-4 space-y-3">
            {openJobs.length > 0 ? (
              openJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <EmptyState
                icon={Users}
                title={t("jobsNearYou")}
                body={t("noJobs")}
                actionLabel={t("findWork")}
                actionTo="/jobs"
              />
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
