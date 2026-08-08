/**
 * Notification dispatcher.
 *
 * Writes the in-app notification, then walks a channel fallback chain
 * (WhatsApp -> SMS -> Email) honouring the recipient's preferences and quiet
 * hours. Every attempt is written to `notification_deliveries` for auditing.
 */
import { sendEmail, sendSms, sendWhatsApp, toE164, type ChannelResult } from "./channels.server";

export type NotificationKind =
  | "job_alert"
  | "application_update"
  | "contract_milestone"
  | "payment_update"
  | "invite"
  | "message"
  | "system";

export type NotifyInput = {
  userId: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  link?: string;
  data?: Record<string, unknown>;
  /** Ordered fallback chain; defaults to whatsapp -> sms -> email. */
  channels?: Array<"whatsapp" | "sms" | "email">;
  /** Send on every channel instead of stopping at the first success. */
  fanOut?: boolean;
};

const KIND_PREF: Record<NotificationKind, string | null> = {
  job_alert: "job_alerts",
  application_update: "application_updates",
  contract_milestone: "contract_milestones",
  payment_update: "payment_updates",
  invite: "application_updates",
  message: null,
  system: null,
};

function inQuietHours(start: number | null, end: number | null, timezone: string) {
  if (start == null || end == null || start === end) return false;
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: timezone }).format(new Date()),
  );
  return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

export async function notify(input: NotifyInput) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: notification, error } = await supabaseAdmin
    .from("notifications")
    .insert({
      user_id: input.userId,
      kind: input.kind,
      title: input.title,
      body: input.body ?? null,
      link: input.link ?? null,
      data: (input.data ?? {}) as never,
    })
    .select("id")
    .single();
  if (error) throw error;

  const [{ data: prefs }, { data: profile }] = await Promise.all([
    supabaseAdmin.from("notification_prefs").select("*").eq("user_id", input.userId).maybeSingle(),
    supabaseAdmin.from("profiles").select("phone, phone_verified, whatsapp_opt_in, full_name").eq("id", input.userId).maybeSingle(),
  ]);

  const prefKey = KIND_PREF[input.kind];
  if (prefs && prefKey && (prefs as Record<string, unknown>)[prefKey] === false) {
    return { notificationId: notification.id, deliveries: [] as ChannelResult[] };
  }
  if (prefs && inQuietHours(prefs.quiet_hours_start, prefs.quiet_hours_end, prefs.timezone)) {
    return { notificationId: notification.id, deliveries: [] as ChannelResult[] };
  }

  const phone = toE164(profile?.phone);
  const phoneUsable = Boolean(phone && profile?.phone_verified);

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(input.userId);
  const email = authUser?.user?.email ?? null;

  const chain = input.channels ?? ["whatsapp", "sms", "email"];
  const message = [input.title, input.body].filter(Boolean).join("\n\n");
  const results: ChannelResult[] = [];

  for (const channel of chain) {
    let destination: string | null = null;
    let enabled = true;

    if (channel === "whatsapp") {
      enabled = (prefs?.whatsapp ?? true) && (profile?.whatsapp_opt_in ?? true) && phoneUsable;
      destination = phone;
    } else if (channel === "sms") {
      enabled = (prefs?.sms ?? false) && phoneUsable;
      destination = phone;
    } else {
      enabled = (prefs?.email ?? true) && Boolean(email);
      destination = email;
    }

    if (!enabled || !destination) {
      results.push({ ok: false, status: "skipped", error: `${channel}: unavailable for recipient` });
      continue;
    }

    const result =
      channel === "whatsapp"
        ? await sendWhatsApp(destination, message)
        : channel === "sms"
          ? await sendSms(destination, message)
          : await sendEmail(destination, input.title, input.body ?? input.title, input.link);

    results.push(result);

    await supabaseAdmin.from("notification_deliveries").insert({
      notification_id: notification.id,
      user_id: input.userId,
      channel,
      destination,
      status: result.status,
      provider: result.provider ?? null,
      provider_message_id: result.providerMessageId ?? null,
      error: result.error ?? null,
      attempts: 1,
      sent_at: result.ok ? new Date().toISOString() : null,
    });

    if (result.ok && !input.fanOut) break;
  }

  return { notificationId: notification.id, deliveries: results };
}
