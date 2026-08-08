import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { JobCard, type JobRow } from "@/components/JobCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/saved")({
  component: SavedJobs,
  head: () => ({
    meta: [
      { title: "Saved Jobs | GO FARM WORK" },
      { name: "description", content: "Your bookmarked farm jobs, saved for later." },
      { property: "og:title", content: "Saved Jobs | GO FARM WORK" },
      { property: "og:description", content: "Your bookmarked farm jobs, saved for later." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function SavedJobs() {
  const { data: jobs } = useQuery({
    queryKey: ["saved-jobs-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job_id, jobs(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => r.jobs).filter(Boolean) as unknown as JobRow[];
    },
  });

  return (
    <AppShell title="Saved jobs" subtitle="Work you bookmarked to decide later">
      <div className="space-y-3">
        {jobs?.length ? (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No saved jobs yet. Tap the bookmark on any job to keep it here.
          </p>
        )}
      </div>
    </AppShell>
  );
}
