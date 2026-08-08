/** Matches a newly published job against saved job alerts and notifies workers. */
import { notify } from "./dispatch.server";

type JobRow = {
  id: string;
  title: string;
  crop: string | null;
  district: string | null;
  state: string | null;
  wage_amount: number;
  owner_id: string;
};

export async function matchAlertsAndNotify(job: JobRow): Promise<number> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: alerts, error } = await supabaseAdmin
    .from("job_alerts")
    .select("id, user_id, district, state, crop, keywords, min_wage")
    .eq("active", true);
  if (error) throw error;

  const eq = (a?: string | null, b?: string | null) =>
    !a || (b ?? "").trim().toLowerCase() === a.trim().toLowerCase();

  const seen = new Set<string>();
  let matched = 0;

  for (const alert of alerts ?? []) {
    if (alert.user_id === job.owner_id || seen.has(alert.user_id)) continue;
    if (!eq(alert.district, job.district)) continue;
    if (!eq(alert.state, job.state)) continue;
    if (!eq(alert.crop, job.crop)) continue;
    if (alert.min_wage != null && Number(job.wage_amount) < Number(alert.min_wage)) continue;
    if (alert.keywords) {
      const haystack = `${job.title} ${job.crop ?? ""}`.toLowerCase();
      const hit = alert.keywords
        .split(/[,\s]+/)
        .filter(Boolean)
        .some((kw) => haystack.includes(kw.toLowerCase()));
      if (!hit) continue;
    }

    seen.add(alert.user_id);
    matched += 1;
    try {
      await notify({
        userId: alert.user_id,
        kind: "job_alert",
        title: `New farm work: ${job.title}`,
        body: `${job.crop ? `${job.crop} · ` : ""}${job.district ?? job.state ?? "Nearby"} · ₹${job.wage_amount}`,
        link: `/jobs/${job.id}`,
        data: { jobId: job.id, alertId: alert.id },
      });
    } catch (err) {
      console.error("[job-alerts] notify failed", err);
    }
  }

  return matched;
}
