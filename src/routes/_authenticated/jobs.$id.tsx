import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, IndianRupee, MapPin, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/EmptyState";
import { ListenButton } from "@/components/ListenButton";
import { MicButton } from "@/components/MicButton";
import { StatusBadge } from "@/components/StatusBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { notifyApplicationStatus, notifyContractMilestone } from "@/lib/notifications.functions";
import { hireConfirmText, jobShareText } from "@/lib/whatsapp";


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
  latitude: number | null;
  longitude: number | null;
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
  head: () => ({
    meta: [
      { title: "Farm Job Details | GO FARM WORK" },
      {
        name: "description",
        content: "See wage, location, crew size and perks for this farm job, then apply or hire in one tap.",
      },
      { property: "og:title", content: "Farm Job Details | GO FARM WORK" },
      {
        property: "og:description",
        content: "See wage, location, crew size and perks for this farm job, then apply or hire in one tap.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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

  const deleteJob = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job deleted successfully");
      qc.invalidateQueries({ queryKey: ["dash-jobs"] });
      navigate({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

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
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary px-4 pb-6 pt-5 text-primary-foreground">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
            aria-label={t("back")}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-2xl font-bold tracking-tight">{job.title}</h1>
          <ListenButton
            text={`${job.title}. ₹${job.wage_amount} ${wageWord}. ${place}. ${job.description ?? ""}`}
            className="shrink-0 bg-black/10 hover:bg-black/20 text-current transition-colors"
          />
          <WhatsAppButton
            variant="ghost"
            label=""
            className="shrink-0 border-transparent bg-black/10 hover:bg-black/20 text-current transition-colors"
            text={jobShareText({
              id: job.id,
              title: job.title,
              wage_amount: Number(job.wage_amount),
              wageWord,
              place,
            })}
          />
          {isOwner && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this job?")) {
                  deleteJob.mutate();
                }
              }}
              disabled={deleteJob.isPending}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-black/10 text-red-100 transition-colors hover:bg-destructive hover:text-white disabled:opacity-50"
              aria-label="Delete job"
            >
              <Trash2 className="size-5" />
            </button>
          )}
        </div>

      </header>

      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-2xl font-bold text-money">
            <IndianRupee className="size-6" />
            {Number(job.wage_amount)}
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{wageWord}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-secondary-foreground">
            {place ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1">
                <MapPin className="size-3.5" /> {place}
              </span>
            ) : null}
            {job.latitude && job.longitude ? (
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${job.latitude},${job.longitude}`}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2 py-1 hover:bg-primary/20 transition-colors"
              >
                <MapPin className="size-3.5" /> View on Map
              </a>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1">
              <Users className="size-3.5" /> {job.crew_size} {t("workers")}
            </span>
            {job.crop ? (
              <span className="rounded-md bg-secondary/60 px-2 py-1">{job.crop}</span>
            ) : null}
          </div>
          {job.description ? (
            <p className="mt-5 border-t border-border/60 pt-4 text-sm leading-relaxed text-card-foreground">{job.description}</p>
          ) : null}
        </div>

        {isOwner ? (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-base font-semibold text-card-foreground">
              {t("applicants")} ({apps?.length ?? 0})
            </h2>
            <div className="mt-4 space-y-3">
              {apps?.length ? (
                apps.map((a) => {
                  const worker = workers?.find((w) => w.id === a.worker_id);
                  const wage = Number(a.counter_wage ?? job.wage_amount);
                  return (
                    <div key={a.id} className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-secondary-foreground">
                            {worker?.full_name || t("worker")}
                          </p>
                          <p className="mt-1 text-sm text-secondary-foreground">{a.message || "—"}</p>
                          {a.counter_wage ? (
                            <p className="mt-1 text-sm font-bold text-money">₹{wage}</p>
                          ) : null}
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {a.status !== "hired" ? (
                          <Button onClick={() => hire.mutate(a)} className="h-9 font-semibold" size="sm">
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
                          size="sm"
                          label={t("chatOnWhatsApp")}
                          phone={worker?.phone}
                          text={`${t("appName")}: ${job.title}`}
                          className="h-9"
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
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            {myApp ? (
              <p className="text-center text-base font-semibold text-primary">{t("applied")}</p>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("askAnything")}
                    className="min-h-[80px] text-sm resize-none"
                  />
                  <MicButton onText={(text: string) => setMessage(text)} size="sm" />
                </div>
                <Button
                  onClick={() => apply.mutate()}
                  disabled={apply.isPending}
                  className="mt-4 h-10 w-full text-sm font-bold"
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
