import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { MicButton } from "@/components/MicButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/post-job")({
  component: PostJob,
});

const WAGE_TYPES = ["per_day", "per_acre", "fixed"] as const;

function PostJob() {
  const { t } = useI18n();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [crop, setCrop] = useState("");
  const [description, setDescription] = useState("");
  const [wage, setWage] = useState("500");
  const [wageType, setWageType] = useState<(typeof WAGE_TYPES)[number]>("per_day");
  const [crew, setCrew] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [food, setFood] = useState(false);
  const [stay, setStay] = useState(false);
  const [transport, setTransport] = useState(false);
  const [tools, setTools] = useState(false);
  const [women, setWomen] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() || !Number(wage)) {
      toast.error(t("postWork"));
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          owner_id: user!.id,
          title: title.trim(),
          crop: crop.trim() || null,
          description: description.trim() || null,
          wage_amount: Number(wage),
          wage_type: wageType,
          crew_size: Math.max(1, Number(crew) || 1),
          start_date: startDate || null,
          food_provided: food,
          stay_provided: stay,
          transport_provided: transport,
          tools_provided: tools,
          women_friendly: women,
          village: profile?.village ?? null,
          district: profile?.district ?? null,
          status: "open",
        })
        .select("id")
        .single();
      if (error) throw error;
      toast.success(t("postWork"));
      navigate({ to: "/jobs/$id", params: { id: data.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not post");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell title={t("postWork")} subtitle={t("tagline")}>
      <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card">
        <VoiceField label={t("findWork")} value={title} onChange={setTitle} />
        <VoiceField label="Crop" value={crop} onChange={setCrop} />

        <div className="space-y-1.5">
          <Label className="text-base">{t("askAnything")}</Label>
          <div className="flex items-start gap-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 text-base"
            />
            <MicButton onText={(text: string) => setDescription(text)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-base">₹</Label>
            <Input
              inputMode="numeric"
              value={wage}
              onChange={(e) => setWage(e.target.value)}
              className="h-14 text-lg font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-base">{t("workers")}</Label>
            <Input
              inputMode="numeric"
              value={crew}
              onChange={(e) => setCrew(e.target.value)}
              className="h-14 text-lg font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {WAGE_TYPES.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWageType(w)}
              className={cn(
                "rounded-2xl border-2 px-2 py-3 text-sm font-bold",
                wageType === w
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {t(w === "per_day" ? "perDay" : w === "per_acre" ? "perAcre" : "fixed")}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <Label className="text-base">{t("today")}</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-14 text-lg"
          />
        </div>

        <div className="space-y-2 rounded-2xl bg-secondary p-4">
          <Perk label={t("foodProvided")} checked={food} onChange={setFood} />
          <Perk label={t("stayProvided")} checked={stay} onChange={setStay} />
          <Perk label={t("transportProvided")} checked={transport} onChange={setTransport} />
          <Perk label={t("toolsProvided")} checked={tools} onChange={setTools} />
          <Perk label={t("womenFriendly")} checked={women} onChange={setWomen} />
        </div>

        <Button onClick={submit} disabled={busy} className="h-14 w-full text-lg font-bold">
          {t("postWork")}
        </Button>
      </div>
    </AppShell>
  );
}

function VoiceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-base">{label}</Label>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-14 text-lg" />
        <MicButton onText={(text: string) => onChange(text)} />
      </div>
    </div>
  );
}

function Perk({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-1.5 text-base font-semibold text-secondary-foreground">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
