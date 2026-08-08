import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const KEY_BY_STATUS: Record<string, string> = {
  open: "statusOpen",
  in_progress: "statusInProgress",
  active: "statusInProgress",
  completed: "statusCompleted",
  cancelled: "statusCancelled",
  canceled: "statusCancelled",
  applied: "statusApplied",
  pending: "statusPending",
  hired: "statusHired",
  rejected: "statusRejected",
  paid: "statusPaid",
  funded: "statusFunded",
};

const TONE: Record<string, string> = {
  statusOpen: "bg-primary/12 text-primary",
  statusInProgress: "bg-accent/15 text-accent-foreground",
  statusCompleted: "bg-money/15 text-money",
  statusPaid: "bg-money/15 text-money",
  statusFunded: "bg-money/15 text-money",
  statusHired: "bg-money/15 text-money",
  statusCancelled: "bg-destructive/12 text-destructive",
  statusRejected: "bg-destructive/12 text-destructive",
};

/** Translated, colour-plus-text status pill (never colour alone). */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const { t } = useI18n();
  const key = KEY_BY_STATUS[status] ?? "statusPending";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        TONE[key] ?? "bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {t(key)}
    </span>
  );
}
