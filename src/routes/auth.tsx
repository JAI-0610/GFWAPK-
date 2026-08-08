import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-field px-5 pb-10 pt-5 text-primary-deep-foreground">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <span className="text-lg font-extrabold">{t("appName")}</span>
          <LanguagePicker compact />
        </div>
        <h1 className="mx-auto mt-8 max-w-md text-3xl font-extrabold">
          {mode === "signup" ? t("signUp") : t("signIn")}
        </h1>
      </header>

      <div className="mx-auto -mt-5 max-w-md px-4 pb-16">
        <form
          onSubmit={submit}
          className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card"
        >
          {mode === "signup" ? (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-base">
                {t("name")}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-14 text-lg"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-base">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 text-lg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-base">
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-14 text-lg"
            />
          </div>

          <Button type="submit" disabled={busy} className="h-14 w-full text-lg font-bold">
            {mode === "signup" ? t("signUp") : t("signIn")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={google}
            className="h-14 w-full text-base font-semibold"
          >
            Google
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="w-full py-2 text-sm font-semibold text-primary"
          >
            {mode === "signup" ? t("signIn") : t("signUp")}
          </button>
        </form>
      </div>
    </div>
  );
}
