import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { MicButton } from "@/components/MicButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("messages-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        refetch();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const partnerId = messages?.find((m) => m.sender_id !== user?.id)?.sender_id;

  const send = async () => {
    if (!draft.trim() || !user || !partnerId) return;
    const body = draft.trim();
    setDraft("");
    await supabase
      .from("messages")
      .insert({ sender_id: user.id, recipient_id: partnerId, body });
    refetch();
  };

  return (
    <AppShell title={t("messages")} subtitle={t("chat")}>
      <div className="space-y-2 pb-4">
        {messages?.length ? (
          messages.map((m) => {
            const mine = m.sender_id === user?.id;
            return (
              <div
                key={m.id}
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-base",
                  mine
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border border-border",
                )}
              >
                {m.body}
              </div>
            );
          })
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
            —
          </p>
        )}
        <div ref={bottom} />
      </div>

      <div className="sticky bottom-20 flex items-center gap-2 rounded-3xl border border-border bg-card p-2 shadow-lift">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
        />
        <MicButton onText={(text: string) => setDraft(text)} />
        <Button onClick={send} className="h-12 font-bold">
          {t("send")}
        </Button>
      </div>
    </AppShell>
  );
}
