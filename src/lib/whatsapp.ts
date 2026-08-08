/** WhatsApp deep-link helpers (wa.me) for sharing and confirmations. */

import { toE164 } from "@/lib/phone";

export function waLink(text: string, phone?: string | null) {
  const encoded = encodeURIComponent(text);
  const e164 = toE164(phone);
  return e164
    ? `https://wa.me/${e164.replace("+", "")}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}

export function openWhatsApp(text: string, phone?: string | null) {
  if (typeof window === "undefined") return;
  window.open(waLink(text, phone), "_blank", "noopener,noreferrer");
}

export function jobUrl(jobId: string) {
  if (typeof window === "undefined") return `/jobs/${jobId}`;
  return `${window.location.origin}/jobs/${jobId}`;
}

export function jobShareText(job: {
  id: string;
  title: string;
  wage_amount: number;
  wageWord: string;
  place?: string | null | undefined;
}) {
  const place = job.place ? `\n📍 ${job.place}` : "";
  return `*${job.title}*\n💰 ₹${job.wage_amount} ${job.wageWord}${place}\n\nApply on GO FARM WORK:\n${jobUrl(job.id)}`;
}

export function hireConfirmText(args: {
  jobTitle: string;
  workerName?: string | null | undefined;
  wage: number;
  wageWord: string;
  startDate?: string | null | undefined;
}) {
  const who = args.workerName ? ` ${args.workerName}` : "";
  const start = args.startDate ? `\n📅 Start: ${args.startDate}` : "";
  return `✅ Hire confirmed${who}\n\n*${args.jobTitle}*\n💰 ₹${args.wage} ${args.wageWord}${start}\n🔒 Wage is held safely in escrow until the work is done.\n\nGO FARM WORK`;
}

export function paymentConfirmText(args: {
  amount: number;
  jobTitle?: string | null | undefined;
  note?: string | null | undefined;
}) {
  const job = args.jobTitle ? `\nWork: ${args.jobTitle}` : "";
  const note = args.note ? `\n${args.note}` : "";
  return `💸 Payment released: ₹${args.amount}${job}${note}\n\nGO FARM WORK`;
}
