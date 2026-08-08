import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, Lock } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

type Txn = {
  id: string;
  amount: number;
  direction: string;
  kind: string;
  note: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/wallet")({
  component: WalletPage,
});

function WalletPage() {
  const { t } = useI18n();
  const { user } = useAuth();

  const { data: txns } = useQuery({
    queryKey: ["wallet", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as Txn[];
    },
  });

  const { data: escrow } = useQuery({
    queryKey: ["escrow", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("escrow_amount, released_amount, status");
      if (error) throw error;
      return (data ?? [])
        .filter((c) => c.status === "active" || c.status === "pending")
        .reduce((s, c) => s + (Number(c.escrow_amount) - Number(c.released_amount)), 0);
    },
  });

  const balance = (txns ?? []).reduce(
    (s, r) => s + (r.direction === "debit" ? -Number(r.amount) : Number(r.amount)),
    0,
  );

  return (
    <AppShell title={t("wallet")} subtitle={t("earnings")}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-lift">
          <p className="text-sm font-semibold opacity-85">{t("balance")}</p>
          <p className="mt-1 text-3xl font-extrabold">₹{balance}</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <Lock className="size-4" /> {t("inEscrow")}
          </p>
          <p className="mt-1 text-3xl font-extrabold text-card-foreground">₹{escrow ?? 0}</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {txns?.length ? (
          txns.map((tx) => {
            const credit = tx.direction !== "debit";
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <span
                  className={
                    credit
                      ? "grid size-11 place-items-center rounded-full bg-money/15 text-money"
                      : "grid size-11 place-items-center rounded-full bg-destructive/12 text-destructive"
                  }
                >
                  {credit ? (
                    <ArrowDownLeft className="size-5" />
                  ) : (
                    <ArrowUpRight className="size-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-card-foreground">
                    {tx.note || tx.kind}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-extrabold text-card-foreground">
                  {credit ? "+" : "−"}₹{Number(tx.amount)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
            —
          </p>
        )}
      </div>
    </AppShell>
  );
}
