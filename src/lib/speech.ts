/** Voice output + voice input helpers. Degrade silently on unsupported devices. */

export function speak(text: string, bcp47 = "en-IN") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = bcp47;
  utterance.rate = 0.92;
  const match = window.speechSynthesis.getVoices().find((v) => v.lang === bcp47);
  if (match) utterance.voice = match;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function isVoiceInputSupported() {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w["SpeechRecognition"] ?? w["webkitSpeechRecognition"]);
}

export function listenOnce(
  bcp47: string,
  onResult: (text: string) => void,
  onEnd?: () => void,
): (() => void) | null {
  if (!isVoiceInputSupported()) return null;
  const w = window as unknown as Record<string, (new () => SpeechRecognitionLike) | undefined>;
  const Ctor = w["SpeechRecognition"] ?? w["webkitSpeechRecognition"];
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.lang = bcp47;
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript ?? "";
    if (transcript) onResult(transcript);
  };
  recognition.onerror = () => onEnd?.();
  recognition.onend = () => onEnd?.();
  recognition.start();
  return () => recognition.stop();
}
