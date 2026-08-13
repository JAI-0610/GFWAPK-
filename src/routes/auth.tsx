import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Handshake,

  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  Tractor,
  User,
} from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import heroImage from "@/assets/workers-harvest.jpg";
import { LanguagePicker } from "@/components/LanguagePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";


type Intent = "worker" | "landlord" | "both";
type Search = { role?: Intent | undefined; mode?: "signin" | "signup" | undefined };

const parseIntent = (value: unknown): Intent | undefined =>
  value === "landlord" || value === "worker" || value === "both" ? value : undefined;

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    role: parseIntent(search["role"]),
    mode: search["mode"] === "signin" || search["mode"] === "signup" ? search["mode"] : undefined,
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
  const { role, mode: initialMode } = Route.useSearch();
  const [intent, setIntent] = useState<Intent>(role ?? "worker");
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signup");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (authMethod === "phone") {
        if (!otpSent) {
          const { error } = await supabase.auth.signInWithOtp({ phone });
          if (error) throw error;
          setOtpSent(true);
          toast.success("OTP sent to your phone");
        } else {
          const { error, data } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
          if (error) throw error;
          if (isSignup && data.session) {
            navigate({ to: "/onboarding", search: { role: intent } });
          } else {
            navigate({ to: "/dashboard" });
          }
        }
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name, intended_role: intent },
          },
        });
        if (error) throw error;
        const { data: sess } = await supabase.auth.getSession();
        if (sess.session) {
          navigate({ to: "/onboarding", search: { role: intent } });
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
    if (isSignup && typeof window !== "undefined") {
      window.localStorage.setItem("gfw_intent", intent);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    // With Supabase OAuth, the user is redirected away.
    // So we don't need to navigate manually if there's no error.
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
            <img src="/logo.png" alt="GO FARM WORK logo" className="size-11 rounded-full object-cover shadow-sm" />
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
            <Stat value="Free" label="To join & post work" />
            <Stat value="Escrow" label="Wages held safely" />
            <Stat value="14" label="Languages" />
          </div>

        </div>
      </aside>

      {/* Right: form panel */}
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-background/50">
        <div className="absolute top-[-20%] right-[-10%] size-[60%] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] left-[-10%] size-[60%] rounded-full bg-money/10 blur-[120px] pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center justify-between px-5 pt-5 lg:px-12">
            <Link to="/" className="inline-flex items-center gap-2 lg:invisible">
              <img src="/logo.png" alt="GO FARM WORK logo" className="size-9 rounded-full object-cover shadow-sm" />
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
                {!isSignup
                  ? "Welcome back"
                  : intent === "landlord"
                    ? "Farm owner"
                    : intent === "both"
                      ? "Owner & worker"
                      : "Farm worker"}
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground">
                {isSignup ? "Create your free account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                {!isSignup
                  ? "Sign in to manage your jobs, crew and payments."
                  : intent === "landlord"
                    ? "Hire verified farm workers for your land. Free to join, no posting fees."
                    : intent === "both"
                      ? "Hire crews for your land and take up paid work too — one account, both sides."
                      : "Find paid farm work near your village. Free to join, you keep every rupee."}
              </p>

            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/50 p-6 shadow-[0_8px_40px_rgb(0,0,0,0.08)] backdrop-blur-2xl sm:p-7 dark:border-white/10 dark:bg-black/40">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none dark:from-white/5 dark:to-transparent" />
              <div className="relative z-10">
              {isSignup ? (
                <fieldset className="mb-6">
                  <legend className="mb-3 text-sm font-bold text-foreground">
                    What brings you here?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <IntentCard
                      active={intent === "landlord"}
                      icon={Tractor}
                      title="I want to hire"
                      description="Post farm work and hire trusted workers for my land"
                      onClick={() => setIntent("landlord")}
                    />
                    <IntentCard
                      active={intent === "worker"}
                      icon={Sprout}
                      title="I want to work"
                      description="Find paid farm work near my village and get hired"
                      onClick={() => setIntent("worker")}
                    />
                    <div className="sm:col-span-2">
                      <IntentCard
                        active={intent === "both"}
                        icon={Handshake}
                        title="I want to do both"
                        description="Hire workers for my land and also take up paid farm work"
                        onClick={() => setIntent("both")}
                      />
                    </div>
                  </div>
                </fieldset>
              ) : null}


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

              <div className="mb-6 flex rounded-xl border border-border bg-secondary/50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("email");
                    setOtpSent(false);
                  }}
                  className={cn(
                    "flex-1 rounded-lg py-2 text-sm font-bold transition-all",
                    authMethod === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("phone");
                    setOtpSent(false);
                  }}
                  className={cn(
                    "flex-1 rounded-lg py-2 text-sm font-bold transition-all",
                    authMethod === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Phone Number
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                {isSignup && authMethod === "email" ? (
                  <Field
                    id="name"
                    icon={User}
                    label={t("name")}
                    value={name}
                    onChange={setName}
                    placeholder="Ramesh Patil"
                  />
                ) : null}

                {authMethod === "phone" ? (
                  <>
                    <Field
                      id="phone"
                      icon={Phone}
                      type="tel"
                      label="Phone Number"
                      value={phone}
                      onChange={setPhone}
                      placeholder="+91 98765 43210"
                      disabled={otpSent}
                    />
                    {otpSent ? (
                      <Field
                        id="otp"
                        icon={Lock}
                        type="text"
                        label="6-Digit OTP"
                        value={otp}
                        onChange={setOtp}
                        placeholder="123456"
                      />
                    ) : null}
                  </>
                ) : (
                  <>
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
                  </>
                )}

                <Button
                  type="submit"
                  disabled={busy}
                  className="h-14 w-full gap-2 rounded-2xl text-lg font-bold"
                >
                  {busy
                    ? "Please wait…"
                    : authMethod === "phone" && !otpSent
                      ? "Send Code"
                      : isSignup
                        ? t("signUp")
                        : t("signIn")}
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
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              By continuing you agree to our Terms and Privacy Policy. Payments are held in secure
              escrow until work is confirmed.
            </p>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}

function IntentCard({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: typeof Sprout;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 p-4 text-left transition-colors",
        active
          ? "border-primary bg-primary/8 shadow-card"
          : "border-border bg-background hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-xl",
          active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="mt-3 block text-base font-extrabold text-foreground">{title}</span>
      <span className="mt-1 block text-sm leading-snug text-muted-foreground">{description}</span>
    </button>
  );
}

const TRUST = [

  "Verified farms and workers, checked by our team",
  "Escrow payments — money released only after work",
  "Voice-first, works on any phone, in 14 languages",
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
  disabled,
}: {
  id: string;
  icon: typeof Mail;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
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
          disabled={disabled}
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
