import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sprout, Tractor } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LanguagePicker } from "@/components/LanguagePicker";
import { MicButton } from "@/components/MicButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Intent = "worker" | "landlord" | "both";
type Search = { role?: Intent | undefined };

const parseIntent = (value: unknown): Intent | undefined =>
  value === "landlord" || value === "worker" || value === "both" ? value : undefined;

export const Route = createFileRoute("/_authenticated/onboarding")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    role: parseIntent(search["role"]),
  }),
  component: Onboarding,
});

function Onboarding() {
  const { t, lang } = useI18n();
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const { role: intendedRole } = Route.useSearch();
  const [role, setRole] = useState<Intent>(() => {
    if (intendedRole) return intendedRole;
    if (typeof window !== "undefined") {
      const stored = parseIntent(window.localStorage.getItem("gfw_intent"));
      if (stored) return stored;
    }
    return "worker";
  });


  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast.error(t("name"));
      return;
    }
    setBusy(true);
    try {
      const { error: pErr } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          village: village.trim() || null,
          district: district.trim() || null,
          language: lang,
          onboarded: true,
        })
        .eq("id", user.id);
      if (pErr) throw pErr;

      const { error: rErr } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role });
      if (rErr && rErr.code !== "23505") throw rErr;


      await refresh();
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-field px-5 pb-10 pt-5 text-primary-deep-foreground">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <span className="text-lg font-extrabold">{t("appName")}</span>
          <LanguagePicker compact />
        </div>
        <h1 className="mx-auto mt-8 max-w-md text-3xl font-extrabold">{t("iAm")}</h1>
      </header>

      <div className="mx-auto -mt-5 max-w-md space-y-4 px-4 pb-16">
        <div className="grid grid-cols-2 gap-3">
          <RoleCard
            active={role === "worker"}
            icon={Sprout}
            label={t("worker")}
            onClick={() => setRole("worker")}
          />
          <RoleCard
            active={role === "landlord"}
            icon={Tractor}
            label={t("landlord")}
            onClick={() => setRole("landlord")}
          />
        </div>

        <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card">
          <Field label={t("name")} value={fullName} onChange={setFullName} />
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-base">
              {t("phone")}
            </Label>
            <Input
              id="phone"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-14 text-lg"
            />
          </div>
          <Field label={t("village")} value={village} onChange={setVillage} />
          <Field label={t("district")} value={district} onChange={setDistrict} />

          <Button onClick={save} disabled={busy} className="h-14 w-full text-lg font-bold">
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
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

function RoleCard({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Sprout;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl border-2 bg-card p-5 text-center shadow-card transition",
        active ? "border-primary bg-primary/8" : "border-border",
      )}
    >
      <Icon className={cn("size-10", active ? "text-primary" : "text-muted-foreground")} />
      <span className="text-base font-bold text-card-foreground">{label}</span>
    </button>
  );
}
