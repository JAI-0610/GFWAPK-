import { MessageCircle } from "lucide-react";

import { openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * One-tap WhatsApp shortcut: share a job, start a chat, or confirm a hire or
 * payment. Always renders a real label plus an aria-label for screen readers.
 */
export function WhatsAppButton({
  text,
  phone,
  label,
  variant = "solid",
  className,
}: {
  text: string;
  phone?: string | null;
  label: string;
  variant?: "solid" | "outline";
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openWhatsApp(text, phone);
      }}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition-transform active:scale-95",
        variant === "solid"
          ? "bg-money text-money-foreground shadow-card"
          : "border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
