import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/reviews")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Ratings & Reviews | GO FARM WORK" },
      {
        name: "description",
        content: "Rate completed farm work and build a trusted reputation on GO FARM WORK.",
      },
      { property: "og:title", content: "Ratings & Reviews | GO FARM WORK" },
      {
        property: "og:description",
        content: "Rate completed farm work and build a trusted reputation on GO FARM WORK.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star`}
          onClick={() => onChange(n)}
          className="p-1"
        >
          <Star
            className={cn(
              "size-7",
              n <= value ? "fill-current text-primary" : "text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, { rating: number; comment: string }>>({});

  const { data: contracts } = useQuery({
    queryKey: ["completed-contracts", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("id, owner_id, worker_id, jobs(title)")
        .eq("status", "completed");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: given } = useQuery({
    queryKey: ["reviews-given", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const submit = useMutation({
    mutationFn: async (contract: { id: string; owner_id: string; worker_id: string }) => {
      const draft = drafts[contract.id];
      if (!user || !draft?.rating) throw new Error("Pick a star rating first");
      const revieweeId = contract.owner_id === user.id ? contract.worker_id : contract.owner_id;
      const { error } = await supabase.from("reviews").insert({
        contract_id: contract.id,
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        rating: draft.rating,
        comment: draft.comment || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Thanks for the review");
      void qc.invalidateQueries({ queryKey: ["reviews-given"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reviewedContractIds = new Set(
    (given ?? []).filter((r) => r.reviewer_id === user?.id).map((r) => r.contract_id),
  );
  const received = (given ?? []).filter((r) => r.reviewee_id === user?.id);
  const pending = (contracts ?? []).filter((c) => !reviewedContractIds.has(c.id));

  return (
    <AppShell title="Ratings & reviews" subtitle="Trust is built one finished job at a time">
      <h2 className="text-lg font-bold text-foreground">Waiting for your rating</h2>
      <div className="mt-2 space-y-3">
        {pending.length ? (
          pending.map((c) => {
            const draft = drafts[c.id] ?? { rating: 0, comment: "" };
            const job = c.jobs as { title?: string } | null;
            return (
              <div key={c.id} className="rounded-3xl border border-border bg-card p-4 shadow-card">
                <p className="font-bold text-card-foreground">{job?.title ?? "Completed work"}</p>
                <Stars
                  value={draft.rating}
                  onChange={(v) => setDrafts((d) => ({ ...d, [c.id]: { ...draft, rating: v } }))}
                />
                <Textarea
                  value={draft.comment}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [c.id]: { ...draft, comment: e.target.value } }))
                  }
                  placeholder="How was the work? (optional)"
                  rows={2}
                  className="mt-2"
                />
                <Button
                  className="mt-3 h-11 w-full font-bold"
                  disabled={submit.isPending}
                  onClick={() => submit.mutate(c)}
                >
                  Submit review
                </Button>
              </div>
            );
          })
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No completed work waiting for a review.
          </p>
        )}
      </div>

      <h2 className="mt-6 text-lg font-bold text-foreground">Reviews you received</h2>
      <div className="mt-2 space-y-3">
        {received.length ? (
          received.map((r) => (
            <div key={r.id} className="rounded-3xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              {r.comment ? (
                <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
              ) : null}
            </div>
          ))
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No reviews yet.
          </p>
        )}
      </div>
    </AppShell>
  );
}
