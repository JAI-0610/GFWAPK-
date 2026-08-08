import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Headphones, Repeat, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { MicButton } from "@/components/MicButton";
import type { JobRow } from "@/components/JobCard";
import { useI18n } from "@/lib/i18n";
import { isVoiceInputSupported, speak, stopSpeaking } from "@/lib/speech";

/** Spoken command keywords, matched loosely across the main languages. */
const COMMANDS = {
  next: ["next", "aage", "आगे", "अगला", "agla", "skip"],
  repeat: ["repeat", "again", "दोबारा", "phir", "फिर"],
  apply: ["apply", "yes", "haan", "हाँ", "हां", "आवेदन", "ha"],
  no: ["no", "nahi", "नहीं", "skip"],
};

function matches(transcript: string, list: string[]) {
  const text = transcript.toLowerCase();
  return list.some((word) => text.includes(word.toLowerCase()));
}

/**
 * Voice-first browsing: reads each job aloud, asks a yes/no question, and
 * accepts spoken or tapped answers. Every spoken step has a visible button.
 */
export function VoiceJobFlow({
  jobs,
  onApply,
}: {
  jobs: JobRow[];
  onApply: (job: JobRow) => Promise<void> | void;
}) {
  const { t, bcp47 } = useI18n();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [voiceInput, setVoiceInput] = useState(true);
  const spokenFor = useRef<string | null>(null);

  useEffect(() => setVoiceInput(isVoiceInputSupported()), []);

  const job = jobs[index];

  const summary = useCallback(
    (j: JobRow) => {
      const wageWord = t(
        j.wage_type === "per_day" ? "perDay" : j.wage_type === "per_acre" ? "perAcre" : "fixed",
      );
      const place = [j.village, j.district].filter(Boolean).join(", ");
      return `${t("voicePromptJob")} ${j.title}. ${j.wage_amount} rupees ${wageWord}. ${place}. ${t("voicePromptAsk")}`;
    },
    [t],
  );

  const announce = useCallback(
    (j: JobRow) => {
      speak(summary(j), bcp47);
    },
    [bcp47, summary],
  );

  useEffect(() => {
    if (!active) return;
    if (!job) {
      speak(t("voiceNoMore"), bcp47);
      return;
    }
    if (spokenFor.current === job.id) return;
    spokenFor.current = job.id;
    announce(job);
  }, [active, job, announce, bcp47, t]);

  useEffect(() => () => stopSpeaking(), []);

  const goNext = () => {
    stopSpeaking();
    setIndex((i) => Math.min(i + 1, jobs.length));
  };

  const doApply = async () => {
    if (!job) return;
    stopSpeaking();
    await onApply(job);
    speak(t("voiceConfirmApply"), bcp47);
    toast.success(t("voiceConfirmApply"));
    setIndex((i) => i + 1);
  };

  const handleTranscript = (text: string) => {
    if (matches(text, COMMANDS.repeat) && job) return announce(job);
    if (matches(text, COMMANDS.apply)) return void doApply();
    if (matches(text, COMMANDS.next) || matches(text, COMMANDS.no)) return goNext();
    if (job) announce(job);
  };

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => {
          setActive(true);
          setIndex(0);
          spokenFor.current = null;
        }}
        aria-label={t("voiceMode")}
        className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-3xl bg-primary px-5 text-base font-bold text-primary-foreground shadow-card active:scale-[0.99]"
      >
        <Headphones className="size-6" aria-hidden="true" />
        {t("voiceMode")}
      </button>
    );
  }

  return (
    <section
      aria-label={t("voiceMode")}
      className="mt-3 rounded-3xl border border-primary/30 bg-primary/5 p-4"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className="min-w-0 text-sm font-bold text-primary">{t("voiceModeOn")}</p>
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            setActive(false);
          }}
          aria-label={t("voiceModeOff")}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <p aria-live="polite" className="mt-2 text-base font-semibold text-card-foreground">
        {job
          ? `${job.title} — ₹${job.wage_amount}`
          : t("voiceNoMore")}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {voiceInput ? t("voiceHelp") : t("voiceNotSupported")}
      </p>

      {job ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => announce(job)}
            aria-label={t("repeat")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 font-bold text-card-foreground active:scale-95"
          >
            <Repeat className="size-5" aria-hidden="true" /> {t("repeat")}
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={t("next")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 font-bold text-card-foreground active:scale-95"
          >
            {t("next")} <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => void doApply()}
            aria-label={t("apply")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-3 font-bold text-primary-foreground active:scale-95"
          >
            <Check className="size-5" aria-hidden="true" /> {t("apply")}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/jobs/$id", params: { id: job.id } })}
            aria-label={job.title}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 font-bold text-card-foreground active:scale-95"
          >
            <Volume2 className="size-5" aria-hidden="true" /> {t("continue")}
          </button>
        </div>
      ) : null}

      {voiceInput && job ? (
        <div className="mt-4 flex flex-col items-center gap-2">
          <MicButton onText={handleTranscript} />
          <p className="text-xs text-muted-foreground">{t("textFallback")}</p>
        </div>
      ) : null}
    </section>
  );
}
