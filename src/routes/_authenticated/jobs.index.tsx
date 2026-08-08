import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Sprout } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { JobCard, type JobRow } from "@/components/JobCard";
import { MicButton } from "@/components/MicButton";
import { VoiceJobFlow } from "@/components/VoiceJobFlow";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/jobs/")({
  component: JobsList,
  head: () => ({
    meta: [
      { title: "Find Farm Work Near You | GO FARM WORK" },
      {
        name: "description",
        content: "Browse open farm jobs near your village by voice or text, and apply in one tap.",
      },
      { property: "og:title", content: "Find Farm Work Near You | GO FARM WORK" },
      {
        property: "og:description",
        content: "Browse open farm jobs near your village by voice or text, and apply in one tap.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function JobsList() {
  const { t } = useI18n();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: jobs, isLoading } = useQuery({
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

  const applyToJob = useMutation({
    mutationFn: async (job: JobRow) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("job_applications")
        .insert({ job_id: job.id, worker_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-apps"] }),
    onError: (e: Error) => toast.error(e.message),
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
        <label htmlFor="job-search" className="sr-only">
          {t("jobsNearYou")}
        </label>
        <Search className="ml-1 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Input
          id="job-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("jobsNearYou")}
          className="h-12 border-0 bg-transparent text-lg shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
        />
        <MicButton onText={(text: string) => setQ(text)} size="sm" />
      </div>

      {filtered.length ? (
        <VoiceJobFlow jobs={filtered} onApply={(job) => applyToJob.mutateAsync(job)} />
      ) : null}

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <p className="py-8 text-center text-muted-foreground" aria-live="polite">
            {t("loading")}
          </p>
        ) : filtered.length ? (
          filtered.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <EmptyState
            icon={Sprout}
            title={t("emptyJobsTitle")}
            body={t("emptyJobsBody")}
            actionLabel={t("emptyJobsCta")}
            actionTo="/alerts"
          />
        )}
      </div>
    </AppShell>
  );
}
