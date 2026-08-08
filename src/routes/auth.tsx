import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sprout,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import heroImage from "@/assets/workers-harvest.jpg";
import { LanguagePicker } from "@/components/LanguagePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

type Search = { role?: "worker" | "landlord" | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    role: search["role"] === "landlord" ? "landlord" : search["role"] === "worker" ? "worker" : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Sign in — GO FARM WORK" },
      { name: "description", content: "Sign in to post farm work or find farm work near your village." },
      { property: "og:title", content: "Sign in — GO FARM WORK" },
      { property: "og:description", content: "Sign in to post farm work or find farm work near your village." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { role } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name, intended_role: role ?? "worker" },
          },
        });
        if (error) throw error;
        const { data: sess } = await supabase.auth.getSession();
        if (sess.session) {
          navigate({ to: "/onboarding" });
        } else {
          toast.success("Check your email to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Left: cinematic brand panel */}
      <aside className="relative hidden overflow-hidden bg-primary-deep lg:block">
        <img
          src={heroImage}
          alt="Farmers working together in an Indian field at golden hour"
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-deep via-primary-deep/85 to-accent/40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-deep-foreground">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Sprout className="size-6" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">{t("appName")}</span>
          </Link>

          <div className="max-w-lg">
            <h2 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight">
              India&apos;s trusted marketplace for farm work.
            </h2>
            <p className="mt-5 text-lg text-primary-deep-foreground/80">
              Hire verified farm crews or find paid work near your village — with secure escrow
              payments and support in every Indian language.
            </p>
            <ul className="mt-8 space-y-3">
              {TRUST.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base font-medium">
                  <ShieldCheck className="size-5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-10">
            <Stat value="12,400+" label="Farms & workers" />
            <Stat value="₹9.6 Cr" label="Paid out safely" />
            <Stat value="13" label="Languages" />
          </div>
        </div>
      </aside>

      {/* Right: form panel */}
      <main className="relative flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-5 pt-5 lg:px-12">
          <Link to="/" className="inline-flex items-center gap-2 lg:invisible">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sprout className="size-5" />
            </span>
            <span className="font-display text-base font-extrabold">{t("appName")}</span>
          </Link>
          <div className="text-foreground">
            <LanguagePicker compact />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
                {role === "landlord" ? "Farm owner" : role === "worker" ? "Farm partner" : "Welcome"}
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground">
                {isSignup ? "Create your free account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                {isSignup
                  ? "Takes under a minute. No fees to join, ever."
                  : "Sign in to manage your jobs, crew and payments."}
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7">
              <Button
                type="button"
                variant="outline"
                onClick={google}
                className="h-14 w-full gap-3 rounded-2xl text-base font-semibold"
              >
                <GoogleMark />
                Continue with Google
              </Button>

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                {isSignup ? (
                  <Field
                    id="name"
                    icon={User}
                    label={t("name")}
                    value={name}
                    onChange={setName}
                    placeholder="Ramesh Patil"
                  />
                ) : null}

                <Field
                  id="email"
                  icon={Mail}
                  type="email"
                  label={t("email")}
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                />

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="h-14 rounded-2xl pl-12 pr-12 text-base"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground hover:bg-secondary"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                  {isSignup ? (
                    <p className="pt-1 text-xs text-muted-foreground">At least 6 characters.</p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className="h-14 w-full gap-2 rounded-2xl text-lg font-bold"
                >
                  {busy ? "Please wait…" : isSignup ? t("signUp") : t("signIn")}
                  {!busy && <ArrowRight className="size-5" />}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                {isSignup ? "Already have an account?" : "New to GO FARM WORK?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(isSignup ? "signin" : "signup")}
                  className="font-bold text-primary underline-offset-4 hover:underline"
                >
                  {isSignup ? t("signIn") : t("signUp")}
                </button>
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              By continuing you agree to our Terms and Privacy Policy. Payments are held in secure
              escrow until work is confirmed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const TRUST = [
  "Verified farms and workers, checked by our team",
  "Escrow payments — money released only after work",
  "Voice-first, works on any phone, in 13 languages",
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-extrabold">{value}</div>
      <div className="text-sm text-primary-deep-foreground/70">{label}</div>
    </div>
  );
}

function Field({
  id,
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  icon: typeof Mail;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
          className="h-14 rounded-2xl pl-12 text-base"
        />
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.86-.08-1.7-.22-2.5H12v4.73h6.45a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.58-5.14 3.58-8.83Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-3a7.2 7.2 0 0 1-10.73-3.78H1.36v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.35 14.32a7.2 7.2 0 0 1 0-4.62V6.6H1.36a12 12 0 0 0 0 10.8l3.99-3.08Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.42A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.36 6.6l3.99 3.1A7.2 7.2 0 0 1 12 4.75Z"
      />
    </svg>
  );
}
