import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, LogOut, Star } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useI18n();
  const { profile, role } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <AppShell title={t("profile")} subtitle={profile?.full_name ?? ""}>
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-border/50">
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt="Profile" className="size-16 rounded-full object-cover border-2 border-primary" />
          ) : (
            <div className="size-16 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-secondary-foreground">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold">{profile?.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
                {role === "landlord" ? t("landlord") : t("worker")}
              </span>
              {profile?.is_verified ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-money">
                  <BadgeCheck className="size-4" /> Verified
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-1 py-2">
          <Row label="Gender" value={profile?.gender ?? "—"} />
          <Row label={t("phone")} value={profile?.phone ?? "—"} />
          <Row label="State" value={profile?.state ?? "—"} />
          <Row label={t("district")} value={profile?.district ?? "—"} />
          <Row label="Taluk" value={profile?.taluk ?? "—"} />
          <Row label={t("village")} value={profile?.village ?? "—"} />
          <Row
            label="Rating"
            value={
              <span className="inline-flex items-center gap-1">
                <Star className="size-4 fill-money text-money" /> {profile?.rating ?? 0}
              </span>
            }
          />
          <Row label={t("myJobs")} value={String(profile?.jobs_completed ?? 0)} />
        </div>

        <div className="pt-4 space-y-3">
          <Link
            to="/onboarding"
            className="block rounded-lg bg-secondary py-3 text-center text-sm font-bold text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            {t("save")}
          </Link>

          <Button
            onClick={signOut}
            variant="outline"
            className="h-12 w-full gap-2 text-sm font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" /> {t("signOut")}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <span className="font-bold text-card-foreground">{value}</span>
    </div>
  );
}
