import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { JobCard, type JobRow } from "@/components/JobCard";
import { MicButton } from "@/components/MicButton";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/jobs/")({
  component: JobsList,
});

function JobsList() {
  const { t } = useI18n();
  const [q, setQ] = useState("");

  const { data: jobs } = useQuery({
    queryKey: ["jobs-open"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return (data ?? []) as JobRow[];
    },
  });

  const needle = q.trim().toLowerCase();
  const filtered = (jobs ?? []).filter((j) =>
    needle
      ? [j.title, j.crop, j.village, j.district]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(needle))
      : true,
  );

  return (
    <AppShell title={t("findWork")} subtitle={t("jobsNearYou")}>
      <div className="flex items-center gap-2 rounded-3xl border border-border bg-card p-3 shadow-card">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("jobsNearYou")}
          className="h-12 border-0 bg-transparent text-lg shadow-none focus-visible:ring-0"
        />
        <MicButton onText={(text: string) => setQ(text)} />
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length ? (
          filtered.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
            {t("noJobs")}
          </p>
        )}
      </div>
    </AppShell>
  );
}
