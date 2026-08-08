import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { ListenButton } from "@/components/ListenButton";
import { MicButton } from "@/components/MicButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { askFarmhand } from "@/lib/ai.functions";
import { LANGUAGES, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Turn = { role: "user" | "ai"; text: string };

export const Route = createFileRoute("/_authenticated/assistant")({
  component: Assistant,
});

function Assistant() {
  const { t, lang } = useI18n();
  const { role } = useAuth();
  const ask = useServerFn(askFarmhand);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);

  const mutation = useMutation({
    mutationFn: async (question: string) =>
      ask({
        data: {
          question,
          language: LANGUAGES.find((l) => l.code === lang)?.label ?? "English",
          role: role ?? "worker",
        },
      }),
    onSuccess: (res) => setTurns((prev) => [...prev, { role: "ai", text: res.answer }]),
    onError: (e: Error) => toast.error(e.message),
  });

  const submit = () => {
    const question = draft.trim();
    if (!question) return;
    setTurns((prev) => [...prev, { role: "user", text: question }]);
    setDraft("");
    mutation.mutate(question);
  };

  return (
    <AppShell title={t("assistant")} subtitle={t("askAnything")}>
      <div className="space-y-3 pb-4">
        {turns.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center">
            <Sparkles className="mx-auto size-8 text-primary" />
            <p className="mt-3 text-muted-foreground">{t("askAnything")}</p>
          </div>
        ) : null}

        {turns.map((turn, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-3xl px-4 py-3 text-base leading-relaxed",
              turn.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "border border-border bg-card text-card-foreground shadow-card",
            )}
          >
            {turn.text}
            {turn.role === "ai" ? (
              <div className="mt-2">
                <ListenButton text={turn.text} />
              </div>
            ) : null}
          </div>
        ))}

        {mutation.isPending ? <p className="text-sm text-muted-foreground">…</p> : null}
      </div>

      <div className="sticky bottom-20 flex items-center gap-2 rounded-3xl border border-border bg-card p-2 shadow-lift">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t("askAnything")}
          className="h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
        />
        <MicButton onText={(text: string) => setDraft(text)} />
        <Button onClick={submit} disabled={mutation.isPending} className="h-12 font-bold">
          {t("send")}
        </Button>
      </div>
    </AppShell>
  );
}
