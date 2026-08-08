/**
 * Channel adapters for outbound notifications.
 *
 * Every adapter returns a normalised result so the dispatcher can fall back to
 * the next channel when one is unavailable or fails. Providers are optional:
 * when credentials are missing the adapter reports `not_configured` instead of
 * throwing, so the app keeps working before the integrations are connected.
 */

export type ChannelResult = {
  ok: boolean;
  status: "sent" | "not_configured" | "failed" | "skipped";
  provider?: string | undefined;
  providerMessageId?: string | undefined;
  error?: string | undefined;
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

function twilioCreds() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const twilioKey = process.env["TWILIO_API_KEY"];
  if (!lovableKey || !twilioKey) return null;
  return { lovableKey, twilioKey };
}

async function twilioSend(to: string, body: string, from: string | undefined, label: string): Promise<ChannelResult> {
  const creds = twilioCreds();
  if (!creds) return { ok: false, status: "not_configured", error: `${label}: Twilio not connected` };
  if (!from) return { ok: false, status: "not_configured", error: `${label}: sender number not configured` };

  try {
    const res = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.lovableKey}`,
        "X-Connection-Api-Key": creds.twilioKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`[notify] ${label} failed [${res.status}]: ${text}`);
      return { ok: false, status: "failed", provider: "twilio", error: `${res.status}: ${text.slice(0, 300)}` };
    }
    let sid: string | undefined;
    try {
      sid = (JSON.parse(text) as { sid?: string }).sid;
    } catch {
      /* ignore */
    }
    return { ok: true, status: "sent", provider: "twilio", providerMessageId: sid };
  } catch (err) {
    return { ok: false, status: "failed", provider: "twilio", error: (err as Error).message };
  }
}

/** Normalise an Indian phone number to E.164. */
export function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  if (raw.trim().startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

export async function sendSms(to: string, body: string): Promise<ChannelResult> {
  return twilioSend(to, body, process.env["TWILIO_SMS_FROM"], "SMS");
}

export async function sendWhatsApp(to: string, body: string): Promise<ChannelResult> {
  const from = process.env["TWILIO_WHATSAPP_FROM"];
  return twilioSend(`whatsapp:${to}`, body, from ? `whatsapp:${from.replace(/^whatsapp:/, "")}` : undefined, "WhatsApp");
}

export async function sendEmail(to: string, subject: string, body: string, link?: string): Promise<ChannelResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  const domain = process.env["EMAIL_SENDER_DOMAIN"];
  if (!apiKey || !domain) {
    return { ok: false, status: "not_configured", error: "Email sender domain not configured" };
  }
  try {
    // Resolved at runtime so the build succeeds before the email package is installed.
    const specifier = "@lovable.dev/email-js";
    const mod = (await import(/* @vite-ignore */ specifier).catch(() => null)) as {
      sendEmail?: (args: unknown) => Promise<{ id?: string }>;
    } | null;
    const send = mod?.sendEmail;
    if (typeof send !== "function") {
      return { ok: false, status: "not_configured", error: "Email package not installed" };
    }
    const html = `<div style="font-family:Arial,sans-serif;padding:24px;color:#0B3D2E">
      <h2 style="margin:0 0 12px">${escapeHtml(subject)}</h2>
      <p style="font-size:15px;line-height:1.6">${escapeHtml(body)}</p>
      ${link ? `<p><a href="${escapeHtml(link)}" style="display:inline-block;background:#1FA463;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Open GO FARM WORK</a></p>` : ""}
    </div>`;
    const result = await send({ apiKey, domain, to, subject, html, text: body });
    return { ok: true, status: "sent", provider: "lovable-email", providerMessageId: result?.id };
  } catch (err) {
    return { ok: false, status: "failed", provider: "lovable-email", error: (err as Error).message };
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
