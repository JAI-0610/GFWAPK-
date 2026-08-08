import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, Megaphone, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/rates")({
  component: RatesPage,
  head: () => ({
    meta: [
      { title: "Wage Rates & Notice Board | GO FARM WORK" },
      {
        name: "description",
        content: "Daily wage rates by crop and district, plus community notices from your area.",
      },
      { property: "og:title", content: "Wage Rates & Notice Board | GO FARM WORK" },
      {
        property: "og:description",
        content: "Daily wage rates by crop and district, plus community notices from your area.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function RatesPage() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { data: rates } = useQuery({
    queryKey: ["market-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_rates")
        .select("*")
        .order("rate_date", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: notices } = useQuery({
    queryKey: ["notice-board"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notice_board")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });

  const post = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("notice_board").insert({
        author_id: user.id,
        title,
        body: body || null,
        district: profile?.district ?? null,
        village: profile?.village ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      setBody("");
      toast.success("Notice posted");
      void qc.invalidateQueries({ queryKey: ["notice-board"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell title="Rates & notices" subtitle="Know the fair wage before you agree">
      <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-2 text-primary">
          <TrendingUp className="size-5" />
          <h2 className="text-lg font-bold">Daily wage rates</h2>
        </div>
        <div className="mt-3 space-y-2">
          {rates?.length ? (
            rates.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-secondary px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-secondary-foreground">{r.crop}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {[r.district, r.state].filter(Boolean).join(", ")}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center font-extrabold text-primary">
                  <IndianRupee className="size-4" />
                  {Number(r.wage_low)}–{Number(r.wage_high)}
                </span>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
              No wage rates published for your area yet.
            </p>
          )}
        </div>

      </section>

      <section className="mt-4 rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-2 text-primary">
          <Megaphone className="size-5" />
          <h2 className="text-lg font-bold">Notice board</h2>
        </div>
        <div className="mt-3 space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Share an alert, e.g. Rain expected Friday"
            className="h-12"
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add details (optional)"
            rows={3}
          />
          <Button
            className="h-12 w-full font-bold"
            disabled={!title.trim() || post.isPending}
            onClick={() => post.mutate()}
          >
            Post notice
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {notices?.length ? (
            notices.map((n) => (
              <article key={n.id} className="rounded-2xl border border-border p-3">
                <h3 className="font-bold text-card-foreground">{n.title}</h3>
                {n.body ? <p className="mt-1 text-sm text-muted-foreground">{n.body}</p> : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {[n.village, n.district].filter(Boolean).join(", ")} ·{" "}
                  {new Date(n.created_at).toLocaleDateString()}
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
              No notices yet. Be the first to share.
            </p>
          )}
        </div>
      </section>
    </AppShell>
  );
}
