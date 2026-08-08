import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: saved } = useQuery({
    queryKey: ["saved-jobs", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_jobs").select("job_id");
      if (error) throw error;
      return (data ?? []).map((r) => r.job_id);
    },
  });

  const isSaved = Boolean(saved?.includes(jobId));

  const toggle = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (isSaved) {
        await supabase.from("saved_jobs").delete().eq("job_id", jobId).eq("user_id", user.id);
      } else {
        await supabase.from("saved_jobs").insert({ job_id: jobId, user_id: user.id });
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["saved-jobs"] });
      void qc.invalidateQueries({ queryKey: ["saved-jobs-full"] });
    },
  });

  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove from saved" : "Save job"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle.mutate();
      }}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card transition-colors",
        isSaved && "border-primary bg-primary/12 text-primary",
      )}
    >
      <Bookmark className={cn("size-5", isSaved && "fill-current")} />
    </button>
  );
}
