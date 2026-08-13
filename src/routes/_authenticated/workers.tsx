import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Search, Send, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { MicButton } from "@/components/MicButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/workers")({
  component: WorkerSearch,
  head: () => ({
    meta: [
      { title: "Find Farm Workers | GO FARM WORK" },
      {
        name: "description",
        content: "Search verified farm workers by skill, crop and district, then invite them.",
      },
      { property: "og:title", content: "Find Farm Workers | GO FARM WORK" },
      {
        property: "og:description",
        content: "Search verified farm workers by skill, crop and district, then invite them.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function WorkerSearch() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [jobId, setJobId] = useState("");

  const { data: workers } = useQuery({
    queryKey: ["worker-directory"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "worker");
      if (rolesError) throw rolesError;
      const ids = (roles ?? []).map((r) => r.user_id);
      if (!ids.length) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids)
        .order("rating", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: myJobs } = useQuery({
    queryKey: ["my-open-jobs", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("owner_id", user!.id)
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const invite = useMutation({
    mutationFn: async (workerId: string) => {
      const job = jobId || myJobs?.[0]?.id;
      if (!user || !job) throw new Error("Post a job first to invite workers");
      const { error } = await supabase.from("job_invites").insert({
        job_id: job,
        owner_id: user.id,
        worker_id: workerId,
        message: "We would like you to join this work.",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invite sent");
      void qc.invalidateQueries({ queryKey: ["job-invites"] });
    },
    onError: (e: Error) =>
      toast.error(e.message.includes("duplicate") ? "Already invited" : e.message),
  });

  const needle = q.trim().toLowerCase();
  const filtered = (workers ?? []).filter((w) =>
    needle
      ? [w.full_name, w.district, w.village, w.state, ...(w.skills ?? []), ...(w.crops ?? [])]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(needle))
      : true,
  );

  return (
    <AppShell title="Find workers" subtitle="Search skilled farm partners and invite them">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/50">
        <Search className="ml-2 size-5 shrink-0 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Skill, crop, district…"
          className="h-10 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
        />
        <MicButton onText={(text: string) => setQ(text)} />
      </div>

      {myJobs?.length ? (
        <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <label htmlFor="invite-job" className="text-sm font-semibold text-foreground">
            Invite to job
          </label>
          <select
            id="invite-job"
            value={jobId || myJobs[0]!.id}
            onChange={(e) => setJobId(e.target.value)}
            className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {myJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {filtered.length ? (
          filtered.map((w) => (
              <div key={w.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-1.5 truncate text-base font-semibold text-card-foreground">
                    {w.full_name || "Farm partner"}
                    {w.is_verified ? <BadgeCheck className="size-4 text-primary" /> : null}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {[w.village, w.district].filter(Boolean).join(", ") || "India"}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                  <Star className="size-3.5 fill-current text-primary" />
                  {Number(w.rating).toFixed(1)}
                </span>
              </div>

              {w.skills?.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {w.skills.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-secondary/60 px-2 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {w.years_experience} yrs · {w.jobs_completed} jobs done
                  {w.day_rate ? ` · ₹${Number(w.day_rate)}/day` : ""}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 font-semibold text-xs"
                  disabled={invite.isPending || w.id === user?.id}
                  onClick={() => invite.mutate(w.id)}
                >
                  <Send className="size-3.5 mr-1" /> Invite
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">No workers match that search yet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
