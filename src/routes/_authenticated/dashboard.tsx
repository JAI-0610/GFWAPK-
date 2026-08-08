import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IndianRupee, PlusCircle, Search, Users } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { JobCard, type JobRow } from "@/components/JobCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();
  const { profile, role, user } = useAuth();
  const isOwner = role === "landlord";

  const { data: jobs } = useQuery({
    queryKey: ["dash-jobs", role, user?.id],
    queryFn: async () => {
      const query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      const { data, error } = isOwner
        ? await query.eq("owner_id", user!.id)
        : await query.eq("status", "open");
      if (error) throw error;
      return (data ?? []) as JobRow[];
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

  return (
    <AppShell
      title={profile?.full_name ? `Namaste, ${profile.full_name.split(" ")[0]}` : t("appName")}
      subtitle={[profile?.village, profile?.district].filter(Boolean).join(", ") || t("tagline")}
    >
      <div className="grid grid-cols-2 gap-3">
        <Link
          to={isOwner ? "/post-job" : "/jobs"}
          className="flex flex-col gap-2 rounded-3xl bg-primary p-5 text-primary-foreground shadow-lift active:scale-[0.98]"
        >
          {isOwner ? <PlusCircle className="size-8" /> : <Search className="size-8" />}
          <span className="text-lg font-bold">{isOwner ? t("postWork") : t("findWork")}</span>
        </Link>
        <Link
          to="/wallet"
          className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-5 shadow-card active:scale-[0.98]"
        >
          <IndianRupee className="size-8 text-money" />
          <span className="text-sm font-semibold text-muted-foreground">{t("balance")}</span>
          <span className="text-2xl font-extrabold text-card-foreground">₹{wallet ?? 0}</span>
        </Link>
      </div>

      <h2 className="mt-7 flex items-center gap-2 text-lg font-bold text-foreground">
        <Users className="size-5 text-primary" />
        {isOwner ? t("myJobs") : t("jobsNearYou")}
      </h2>

      <div className="mt-3 space-y-3">
        {jobs?.length ? (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
            {t("noJobs")}
          </p>
        )}
      </div>
    </AppShell>
  );
}
