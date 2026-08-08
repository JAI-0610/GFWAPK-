import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/alerts")({
  component: AlertsPage,
  head: () => ({
    meta: [
      { title: "Job Alerts | GO FARM WORK" },
      {
        name: "description",
        content: "Set alerts for farm work by district, crop and minimum daily wage.",
      },
      { property: "og:title", content: "Job Alerts | GO FARM WORK" },
      {
        property: "og:description",
        content: "Set alerts for farm work by district, crop and minimum daily wage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AlertsPage() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const [district, setDistrict] = useState(profile?.district ?? "");
  const [crop, setCrop] = useState("");
  const [minWage, setMinWage] = useState("");

  const { data: alerts } = useQuery({
    queryKey: ["job-alerts", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("job_alerts").insert({
        user_id: user.id,
        district: district || null,
        crop: crop || null,
        min_wage: minWage ? Number(minWage) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setCrop("");
      setMinWage("");
      toast.success("Alert saved");
      void qc.invalidateQueries({ queryKey: ["job-alerts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("job_alerts").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["job-alerts"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["job-alerts"] }),
  });

  const matches = (alerts ?? []).filter((a) => a.active).length;

  return (
    <AppShell title="Job alerts" subtitle="Get told when the right work is posted near you">
      <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-2 text-primary">
          <BellRing className="size-5" />
          <h2 className="text-lg font-bold">New alert</h2>
        </div>
        <div className="mt-3 space-y-3">
          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Nashik"
              className="mt-1 h-12"
            />
          </div>
          <div>
            <Label htmlFor="crop">Crop or work</Label>
            <Input
              id="crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. Sugarcane cutting"
              className="mt-1 h-12"
            />
          </div>
          <div>
            <Label htmlFor="wage">Minimum daily wage (₹)</Label>
            <Input
              id="wage"
              inputMode="numeric"
              value={minWage}
              onChange={(e) => setMinWage(e.target.value)}
              placeholder="500"
              className="mt-1 h-12"
            />
          </div>
          <Button
            className="h-12 w-full text-base font-bold"
            disabled={create.isPending}
            onClick={() => create.mutate()}
          >
            Save alert
          </Button>
        </div>
      </section>

      <p className="mt-4 text-sm text-muted-foreground">{matches} active alert(s)</p>

      <div className="mt-2 space-y-3">
        {(alerts ?? []).map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-card"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-card-foreground">
                {[a.crop, a.district].filter(Boolean).join(" · ") || "All farm work"}
              </p>
              <p className="text-sm text-muted-foreground">
                {a.min_wage ? `₹${Number(a.min_wage)}+ per day` : "Any wage"}
              </p>
            </div>
            <Switch
              checked={a.active}
              onCheckedChange={(v) => toggle.mutate({ id: a.id, active: v })}
            />
            <button
              type="button"
              aria-label="Delete alert"
              onClick={() => remove.mutate(a.id)}
              className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
