import { Volume2 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

export function ListenButton({ text, className }: { text: string; className?: string }) {
  const { bcp47, t } = useI18n();
  return (
    <button
      type="button"
      aria-label={t("listen")}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        speak(text, bcp47);
      }}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground active:scale-95",
        className,
      )}
    >
      <Volume2 className="size-5" />
      {t("listen")}
    </button>
  );
}
