import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("notifications")
      .select("id, kind, title, body, link, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return {
      items: data ?? [],
      unread: (data ?? []).filter((n) => !n.read_at).length,
    };
  });

export const markNotificationRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const markAllNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null);
    if (error) throw error;
    return { ok: true };
  });

export const getNotificationPrefs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("notification_prefs")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    return (
      data ?? {
        user_id: context.userId,
        in_app: true,
        email: true,
        sms: false,
        whatsapp: true,
        job_alerts: true,
        application_updates: true,
        contract_milestones: true,
        payment_updates: true,
        quiet_hours_start: null,
        quiet_hours_end: null,
        timezone: "Asia/Kolkata",
      }
    );
  });

export const updateNotificationPrefs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      in_app?: boolean;
      email?: boolean;
      sms?: boolean;
      whatsapp?: boolean;
      job_alerts?: boolean;
      application_updates?: boolean;
      contract_milestones?: boolean;
      payment_updates?: boolean;
      quiet_hours_start?: number | null;
      quiet_hours_end?: number | null;
      timezone?: string;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("notification_prefs")
      .upsert({ user_id: context.userId, ...data }, { onConflict: "user_id" });
    if (error) throw error;
    return { ok: true };
  });

/** Notify a worker that their application status changed. Owner-only. */
export const notifyApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { applicationId: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: app, error } = await context.supabase
      .from("job_applications")
      .select("id, status, worker_id, job_id, jobs!inner(title, owner_id)")
      .eq("id", data.applicationId)
      .single();
    if (error) throw error;
    const job = app.jobs as unknown as { title: string; owner_id: string };
    if (job.owner_id !== context.userId) throw new Error("Forbidden");

    const { notify } = await import("./notifications/dispatch.server");
    const labels: Record<string, string> = {
      shortlisted: "You have been shortlisted",
      hired: "You are hired!",
      rejected: "Application not selected",
      withdrawn: "Application withdrawn",
      pending: "Application received",
    };
    await notify({
      userId: app.worker_id,
      kind: "application_update",
      title: labels[app.status] ?? "Application update",
      body: `Job: ${job.title}. Status is now "${app.status}".`,
      link: `/jobs/${app.job_id}`,
      data: { applicationId: app.id, jobId: app.job_id, status: app.status },
    });
    return { ok: true };
  });

/** Notify both sides about a contract milestone. Either party can trigger. */
export const notifyContractMilestone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { contractId: string; event: string; note?: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: contract, error } = await context.supabase
      .from("contracts")
      .select("id, worker_id, owner_id, status, jobs!inner(title)")
      .eq("id", data.contractId)
      .single();
    if (error) throw error;
    if (context.userId !== contract.worker_id && context.userId !== contract.owner_id) {
      throw new Error("Forbidden");
    }
    const job = contract.jobs as unknown as { title: string };
    const { notify } = await import("./notifications/dispatch.server");
    const recipients = [contract.worker_id, contract.owner_id].filter((id) => id !== context.userId);
    for (const userId of recipients) {
      await notify({
        userId,
        kind: "contract_milestone",
        title: `Contract update — ${job.title}`,
        body: data.note ? `${data.event}: ${data.note}` : data.event,
        link: `/wallet`,
        data: { contractId: contract.id, event: data.event },
      });
    }
    return { ok: true };
  });

/** Fan a newly posted job out to every matching active job alert. Owner-only. */
export const notifyJobAlertMatches = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { jobId: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: job, error } = await context.supabase
      .from("jobs")
      .select("id, title, crop, district, state, wage_amount, owner_id, status")
      .eq("id", data.jobId)
      .single();
    if (error) throw error;
    if (job.owner_id !== context.userId) throw new Error("Forbidden");
    if (job.status !== "open") return { ok: true, matched: 0 };

    const { matchAlertsAndNotify } = await import("./notifications/job-alerts.server");
    const matched = await matchAlertsAndNotify(job);
    return { ok: true, matched };
  });
