import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, IndianRupee, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ListenButton } from "@/components/ListenButton";
import { MicButton } from "@/components/MicButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { notifyApplicationStatus, notifyContractMilestone } from "@/lib/notifications.functions";

type Job = {
  id: string;
  owner_id: string;
  title: string;
  crop: string | null;
  description: string | null;
  crew_size: number;
  wage_amount: number;
  wage_type: "per_day" | "per_acre" | "fixed";
  village: string | null;
  district: string | null;
  start_date: string | null;
  escrow_funded: boolean;
  status: string;
};

type Application = {
  id: string;
  worker_id: string;
  message: string | null;
  counter_wage: number | null;
  status: string;
};

export const Route = createFileRoute("/_authenticated/jobs/$id")({
  component: JobDetail,
});

function JobDetail() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [message, setMessage] = useState("");

  const { data: job } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Job | null;
    },
  });

  const isOwner = job?.owner_id === user?.id;

  const { data: apps } = useQuery({
    queryKey: ["job-apps", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("id, worker_id, message, counter_wage, status")
        .eq("job_id", id);
      if (error) throw error;
      return (data ?? []) as Application[];
    },
  });

  const workerIds = (apps ?? []).map((a) => a.worker_id);
  const { data: workers } = useQuery({
    queryKey: ["job-app-workers", id, workerIds.join(",")],
    enabled: isOwner && workerIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", workerIds);
      if (error) throw error;
      return (data ?? []) as { id: string; full_name: string | null; phone: string | null }[];
    },
  });

  const myApp = apps?.find((a) => a.worker_id === user?.id);


  const apply = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("job_applications")
        .insert({ job_id: id, worker_id: user!.id, message: message.trim() || null });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("applied"));
      setMessage("");
      qc.invalidateQueries({ queryKey: ["job-apps", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const hire = useMutation({
    mutationFn: async (app: Application) => {
      if (!job) return;
      const wage = app.counter_wage ?? job.wage_amount;
      const { error: cErr } = await supabase.from("contracts").insert({
        job_id: job.id,
        worker_id: app.worker_id,
        owner_id: user!.id,
        agreed_wage: wage,
        wage_type: job.wage_type,
        escrow_amount: wage,
        status: "active",
      });
      if (cErr) throw cErr;
      await supabase.from("job_applications").update({ status: "hired" }).eq("id", app.id);
      await supabase.from("jobs").update({ status: "in_progress" }).eq("id", job.id);
      try {
        await notifyApplicationStatus({ data: { applicationId: app.id } });
        const { data: contract } = await supabase
          .from("contracts")
          .select("id")
          .eq("job_id", job.id)
          .eq("worker_id", app.worker_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (contract) {
          await notifyContractMilestone({
            data: { contractId: contract.id, event: "Contract started", note: `Agreed wage ₹${wage}` },
          });
        }
      } catch (notifyError) {
        console.error("hire notification failed", notifyError);
      }
    },
    onSuccess: () => {
      toast.success(t("hire"));
      qc.invalidateQueries({ queryKey: ["job-apps", id] });
      qc.invalidateQueries({ queryKey: ["job", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!job) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">…</div>
    );
  }

  const wageWord = t(
    job.wage_type === "per_day" ? "perDay" : job.wage_type === "per_acre" ? "perAcre" : "fixed",
  );
  const place = [job.village, job.district].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-field px-4 pb-8 pt-5 text-primary-deep-foreground">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            onClick={() => navigate({ to: "/jobs" })}
            className="rounded-full bg-card/15 p-2"
            aria-label={t("back")}
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-2xl font-extrabold">{job.title}</h1>
          <ListenButton
            text={`${job.title}. ₹${job.wage_amount} ${wageWord}. ${place}. ${job.description ?? ""}`}
            className="bg-card/15 text-current"
          />
        </div>
      </header>

      <div className="mx-auto -mt-4 max-w-2xl space-y-3 px-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 text-3xl font-extrabold text-money">
            <IndianRupee className="size-7" />
            {Number(job.wage_amount)}
            <span className="text-base font-semibold text-muted-foreground">{wageWord}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-secondary-foreground">
            {place ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5">
                <MapPin className="size-4" /> {place}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5">
              <Users className="size-4" /> {job.crew_size} {t("workers")}
            </span>
            {job.crop ? (
              <span className="rounded-full bg-secondary px-3 py-1.5">{job.crop}</span>
            ) : null}
          </div>
          {job.description ? (
            <p className="mt-4 text-base leading-relaxed text-card-foreground">{job.description}</p>
          ) : null}
        </div>

        {isOwner ? (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <h2 className="text-lg font-bold text-card-foreground">
              {t("applicants")} ({apps?.length ?? 0})
            </h2>
            <div className="mt-3 space-y-3">
              {apps?.length ? (
                apps.map((a) => {
                  const worker = workers?.find((w) => w.id === a.worker_id);
                  const wage = Number(a.counter_wage ?? job.wage_amount);
                  return (
                    <div key={a.id} className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-secondary-foreground">
                            {worker?.full_name || t("worker")}
                          </p>
                          <p className="mt-1 text-sm text-secondary-foreground">{a.message || "—"}</p>
                          {a.counter_wage ? (
                            <p className="mt-1 text-sm font-bold text-money">₹{wage}</p>
                          ) : null}
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {a.status !== "hired" ? (
                          <Button onClick={() => hire.mutate(a)} className="h-12 font-bold">
                            {t("hire")}
                          </Button>
                        ) : (
                          <WhatsAppButton
                            label={t("confirmHireOnWhatsApp")}
                            phone={worker?.phone}
                            text={hireConfirmText({
                              jobTitle: job.title,
                              workerName: worker?.full_name,
                              wage,
                              wageWord,
                              startDate: job.start_date,
                            })}
                          />
                        )}
                        <WhatsAppButton
                          variant="outline"
                          label={t("chatOnWhatsApp")}
                          phone={worker?.phone}
                          text={`${t("appName")}: ${job.title}`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={Users}
                  title={t("emptyApplicantsTitle")}
                  body={t("emptyApplicantsBody")}
                  action={
                    <WhatsAppButton
                      label={t("shareOnWhatsApp")}
                      text={jobShareText({
                        id: job.id,
                        title: job.title,
                        wage_amount: Number(job.wage_amount),
                        wageWord,
                        place,
                      })}
                    />
                  }
                />
              )}
            </div>
          </div>

        ) : (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            {myApp ? (
              <p className="text-center text-lg font-bold text-primary">{t("applied")}</p>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("askAnything")}
                    className="min-h-24 text-base"
                  />
                  <MicButton onText={(text: string) => setMessage(text)} />
                </div>
                <Button
                  onClick={() => apply.mutate()}
                  disabled={apply.isPending}
                  className="mt-3 h-14 w-full text-lg font-bold"
                >
                  {t("apply")}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
