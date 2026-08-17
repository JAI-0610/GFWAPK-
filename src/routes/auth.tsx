import { Link, createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, Lock, ChevronDown, CheckCircle2, ChevronRight, UserCircle2, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const authSearchSchema = z.object({
  role: z.enum(["worker", "landlord", "admin"]).optional(),
  returnTo: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: authSearchSchema,
  component: AuthPage,
});

function AuthPage() {
  const { session } = useAuth();
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();

  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [method, setMethod] = useState<"email" | "phone">("phone");
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"worker" | "landlord">(
    (search.role as "worker" | "landlord") || "worker",
  );
  
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) {
      navigate({ to: search.returnTo || "/dashboard", replace: true });
    }
  }, [session, navigate, search.returnTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      const isSignup = mode === "signup";
      if (isSignup) {
        const authEmail = method === "email" ? email : `${phone}@gofarmwork.internal`;
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: { role, phone: method === "phone" ? phone : undefined },
            emailRedirectTo: `${window.location.origin}/onboarding`,
          },
        });
        if (error) throw error;
        toast.success("Account created successfully!");
        navigate({ to: "/onboarding", search: { role } });
      } else {
        const authEmail = method === "email" ? email : `${phone}@gofarmwork.internal`;
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password });
        if (error) throw error;
        navigate({ to: search.returnTo || "/dashboard" });
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      {/* Header Area */}
      <div className="px-6 pb-6 pt-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome to GOFARMWORK
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {mode === "signup" ? "Create an account to get started" : "Sign in to continue"}
        </p>
      </div>

      <div className="flex-1 px-6 pb-8">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="space-y-6">
            
            {/* Toggle Email / Phone */}
            <div className="flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  method === "phone" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Phone Number
              </button>
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  method === "email" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Email Address
              </button>
            </div>

            {/* Input Fields */}
            <AnimatePresence mode="wait">
              {method === "email" ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail className="size-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="h-14 w-full rounded-[1.25rem] border border-gray-200 bg-gray-50 pl-12 pr-4 text-base transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex h-14 items-center overflow-hidden rounded-[1.25rem] border border-gray-200 bg-gray-50 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-1 focus-within:ring-primary"
                >
                  <div className="flex h-full items-center gap-2 border-r border-gray-200 bg-gray-100/50 px-4 text-sm font-medium text-gray-600">
                    <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 rounded-[2px]" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    required
                    className="h-full w-full bg-transparent px-4 text-base outline-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="size-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="h-14 w-full rounded-[1.25rem] border border-gray-200 bg-gray-50 pl-12 pr-4 text-base transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Role Selection (Only on Signup) */}
            {mode === "signup" && (
              <div className="pt-2">
                <h3 className="mb-3 text-sm font-bold text-gray-900">I want to:</h3>
                <div className="space-y-3">
                  <RoleCard
                    icon={<UserCircle2 className="size-6" />}
                    title="Find Work"
                    description="Browse jobs and get hired"
                    selected={role === "worker"}
                    onClick={() => setRole("worker")}
                  />
                  <RoleCard
                    icon={<Sprout className="size-6" />}
                    title="Hire Workers"
                    description="Post jobs and manage your farm"
                    selected={role === "landlord"}
                    onClick={() => setRole("landlord")}
                  />
                  <RoleCard
                    icon={<div className="flex -space-x-2"><UserCircle2 className="size-5" /><Sprout className="size-5" /></div>}
                    title="Both"
                    description="I want to hire workers and find work"
                    selected={role === "both"}
                    onClick={() => setRole("both")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-8">
            <button
              type="submit"
              disabled={busy}
              className="flex h-14 w-full items-center justify-center rounded-[1.25rem] bg-primary text-base font-bold text-primary-foreground shadow-sm transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {busy ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-px w-full bg-gray-100"></div>
              <span className="shrink-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
              <div className="h-px w-full bg-gray-100"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-[1.25rem] border border-gray-200 bg-white text-base font-bold text-gray-700 shadow-sm transition-all active:bg-gray-50"
            >
              <GoogleMark />
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm font-medium text-gray-500">
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="font-bold text-primary active:opacity-70"
              >
                {mode === "signup" ? "Sign In" : "Sign Up"}
              </button>
            </p>
            
            <p className="mt-6 text-center text-[11px] font-medium text-gray-400">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline underline-offset-2">Terms & Conditions</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[1.25rem] border p-4 text-left transition-all ${
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${selected ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-500"}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-xs font-medium text-gray-500">{description}</p>
      </div>
      <div className="shrink-0">
        {selected ? (
          <CheckCircle2 className="size-6 text-primary" />
        ) : (
          <div className="size-6 rounded-full border-2 border-gray-200" />
        )}
      </div>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.86-.08-1.7-.22-2.5H12v4.73h6.45a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.58-5.14 3.58-8.83Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-3a7.2 7.2 0 0 1-10.73-3.78H1.36v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.35 14.32a7.2 7.2 0 0 1 0-4.62V6.6H1.36a12 12 0 0 0 0 10.8l3.99-3.08Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.42A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.36 6.6l3.99 3.1A7.2 7.2 0 0 1 12 4.75Z" />
    </svg>
  );
}
