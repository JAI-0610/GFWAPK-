import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell, BellRing, CheckCheck, Loader2, Mail, MessageCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  getNotificationPrefs,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPrefs,
} from "@/lib/notifications.functions";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "Notifications | GO FARM WORK" },
      { name: "description", content: "Job alerts, application updates and contract milestones in one place." },
    ],
  }),
});

const CHANNELS = [
  { key: "whatsapp" as const, label: "WhatsApp", icon: MessageCircle, hint: "First choice for alerts" },
  { key: "sms" as const, label: "SMS", icon: Smartphone, hint: "Fallback when WhatsApp fails" },
  { key: "email" as const, label: "Email", icon: Mail, hint: "Final fallback" },
];

const TOPICS = [
  { key: "job_alerts" as const, label: "New matching jobs" },
  { key: "application_updates" as const, label: "Application status changes" },
  { key: "contract_milestones" as const, label: "Contract milestones" },
  { key: "payment_updates" as const, label: "Payments & payouts" },
];

function NotificationsPage() {
  const { t } = useI18n();
  const qc = useQueryClient();

  const fetchList = useServerFn(listNotifications);
  const fetchPrefs = useServerFn(getNotificationPrefs);
  const savePrefs = useServerFn(updateNotificationPrefs);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllNotificationsRead);

  const list = useQuery({ queryKey: ["notifications"], queryFn: () => fetchList() });
  const prefs = useQuery({ queryKey: ["notification-prefs"], queryFn: () => fetchPrefs() });

  const prefMutation = useMutation({
    mutationFn: (patch: Record<string, boolean>) => savePrefs({ data: patch }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notification-prefs"] });
      toast.success("Preferences saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const p = prefs.data as Record<string, boolean | null> | undefined;

  return (
    <AppShell title="Notifications" subtitle="Alerts, updates and milestones">
      <Card className="mt-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-bold">
            <BellRing className="size-4 text-primary" /> Inbox
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await markAll();
              qc.invalidateQueries({ queryKey: ["notifications"] });
            }}
          >
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        </div>

        <div className="mt-3 space-y-2">
          {list.isLoading ? (
            <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </p>
          ) : (list.data?.items.length ?? 0) === 0 ? (
            <EmptyState
              icon={Bell}
              title={t("emptyNotificationsTitle")}
              body={t("emptyNotificationsBody")}
              actionLabel={t("emptyJobsCta")}
              actionTo="/alerts"
            />

          ) : (
            list.data?.items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={async () => {
                  if (!n.read_at) {
                    await markRead({ data: { id: n.id } });
                    qc.invalidateQueries({ queryKey: ["notifications"] });
                  }
                  if (n.link) window.location.assign(n.link);
                }}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  n.read_at ? "border-border bg-card" : "border-primary/30 bg-primary/5"
                }`}
              >
                <p className="text-sm font-semibold">{n.title}</p>
                {n.body ? <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p> : null}
                <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="font-bold">How you get alerts</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We try WhatsApp first, then SMS, then email — so you never miss work.
        </p>

        <div className="mt-3 space-y-3">
          {CHANNELS.map(({ key, label, icon: Icon, hint }) => (
            <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <div className="flex items-center gap-3">
                <Icon className="size-4 text-primary" />
                <div>
                  <Label className="text-sm font-semibold">{label}</Label>
                  <p className="text-xs text-muted-foreground">{hint}</p>
                </div>
              </div>
              <Switch
                checked={Boolean(p?.[key])}
                disabled={prefs.isLoading}
                onCheckedChange={(v) => prefMutation.mutate({ [key]: v })}
              />
            </div>
          ))}
        </div>

        <h3 className="mt-5 font-bold">What to notify me about</h3>
        <div className="mt-2 space-y-2">
          {TOPICS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <Label className="text-sm">{label}</Label>
              <Switch
                checked={p?.[key] !== false}
                disabled={prefs.isLoading}
                onCheckedChange={(v) => prefMutation.mutate({ [key]: v })}
              />
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
