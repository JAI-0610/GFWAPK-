import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { MarketingPage } from "@/components/marketing/MarketingPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact GO FARM WORK — Support for Farms & Farm Partners" },
      {
        name: "description",
        content:
          "Talk to the GO FARM WORK team about hiring crews, finding farm work, payments or partnerships. Support available in 13 Indian languages.",
      },
      { property: "og:title", content: "Contact GO FARM WORK" },
      {
        property: "og:description",
        content: "Support for farms and farm partners in 13 Indian languages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <MarketingPage
      eyebrow="Contact"
      title="We are here to help"
      subtitle="Questions about hiring, finding work, payments or partnerships? Send us a note and we will get back within one working day."
    >
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const subject = encodeURIComponent(`GO FARM WORK enquiry from ${name || "a visitor"}`);
              const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
              window.location.href = `mailto:gofarmwork@gmail.com?subject=${subject}&body=${body}`;
              toast.success("Opening your email app…");
            }}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-card"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" value={name} onChange={setName} />
              <Field label="Email" value={email} onChange={setEmail} type="email" />
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-card-foreground">How can we help?</span>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-background p-4 text-base outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground active:scale-95"
            >
              Send message
            </button>
          </form>

          <div className="grid gap-4 self-start">
            <Info icon={Mail} title="Email" body="gofarmwork@gmail.com" />
            <Info icon={Phone} title="Helpline" body="+91 6360566370" />
            <Info icon={MessageCircle} title="WhatsApp" body="Coming soon — job alerts on WhatsApp" />
            <Info icon={MapPin} title="Office" body="Bangalore, India" />
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-card-foreground">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none focus:border-primary"
      />
    </label>
  );
}

function Info({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Mail;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-border bg-card p-6 shadow-card">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="font-display text-base font-bold text-card-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
