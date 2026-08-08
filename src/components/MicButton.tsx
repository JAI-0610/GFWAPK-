import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/lib/i18n";
import { isVoiceInputSupported, listenOnce } from "@/lib/speech";
import { cn } from "@/lib/utils";

export function MicButton({
  onText,
  className,
  size = "lg",
}: {
  onText: (text: string) => void;
  className?: string;
  size?: "lg" | "sm";
}) {
  const { bcp47, t } = useI18n();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => setSupported(isVoiceInputSupported()), []);

  if (!supported) return null;

  const toggle = () => {
    if (listening) {
      stopRef.current?.();
      setListening(false);
      return;
    }
    const stop = listenOnce(bcp47, onText, () => setListening(false));
    if (!stop) {
      setSupported(false);
      return;
    }
    stopRef.current = stop;
    setListening(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("speak")}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold shadow-lift transition-transform active:scale-95",
        listening
          ? "bg-destructive text-destructive-foreground"
          : "bg-accent text-accent-foreground",
        size === "lg" ? "size-16 text-base" : "size-11",
        className,
      )}
    >
      {listening ? <Square className="size-6" /> : <Mic className={size === "lg" ? "size-8" : "size-5"} />}
    </button>
  );
}
