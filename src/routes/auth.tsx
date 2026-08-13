import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Phone,
  ShieldCheck,
  MessageCircle,
  IndianRupee,
  Users,
  Tractor,
  Briefcase,
  ChevronDown,
  Info,
  Globe
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
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { role, mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const email = `${phone.replace(/\D/g, '')}@gofarmwork.internal`; // Map phone to internal email for now
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { phone },
          },
        });
        if (error) throw error;
        toast.success("Account created successfully!");
        navigate({ to: "/onboarding", search: { role } });
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error("Google sign-in failed. Please try again.");
  };

  const isSignup = mode === "signup";

  return (
    <div className="relative min-h-screen w-full bg-[#f8faf9] overflow-hidden flex flex-col">
      {/* Top right language picker */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm cursor-pointer">
          <Globe className="size-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">English</span>
          <ChevronDown className="size-4 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 lg:grid lg:grid-cols-[1.1fr_1fr] relative z-10">
        
        {/* LEFT PANEL */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0A3D20] text-white">
          {/* Background gradient & image overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D20] via-[#0A3D20]/90 to-transparent z-10" />
            <img
              src={heroImage}
              alt="Farmer smiling"
              className="absolute inset-0 w-full h-full object-cover object-right opacity-60"
            />
          </div>

          <div className="relative z-20 flex flex-col h-full p-12 lg:p-16">
            
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-16">
              <img src="/logo.png" alt="GO FARM WORK" className="size-12 rounded-full shadow-sm" />
              <div>
                <div className="font-display text-2xl font-extrabold tracking-tight leading-none text-white">GO FARM WORK</div>
                <div className="text-xs font-medium text-green-300 tracking-wide mt-1">Work. Grow. Succeed.</div>
              </div>
            </Link>

            {/* Hero Text */}
            <div className="max-w-xl flex-1">
              <h1 className="font-display text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight">
                India's trusted<br />
                marketplace for<br />
                <span className="text-[#84CC16]">farm work.</span>
              </h1>
              <p className="mt-6 text-lg text-green-50 max-w-md leading-relaxed">
                Connecting verified farm owners with skilled workers. Secure payments, local support, and work opportunities in your language.
              </p>

              <div className="mt-12 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="grid size-10 place-items-center rounded-full bg-white/10 border border-white/20 shrink-0">
                    <ShieldCheck className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Verified farms & workers</h3>
                    <p className="text-sm text-green-100">Trust & safety first</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="grid size-10 place-items-center rounded-full bg-white/10 border border-white/20 shrink-0">
                    <IndianRupee className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Secure escrow payments</h3>
                    <p className="text-sm text-green-100">You're protected, always</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid size-10 place-items-center rounded-full bg-white/10 border border-white/20 shrink-0">
                    <MessageCircle className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Local support</h3>
                    <p className="text-sm text-green-100">Help in 14+ Indian languages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="mt-12 inline-flex items-center justify-between gap-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-6 max-w-fit">
              <div className="text-center px-4">
                <Users className="size-6 text-white mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold text-white">25K+</div>
                <div className="text-xs text-green-100 uppercase tracking-wider font-semibold mt-1">Workers</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center px-4">
                <Tractor className="size-6 text-white mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-xs text-green-100 uppercase tracking-wider font-semibold mt-1">Farms</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center px-4">
                <Briefcase className="size-6 text-white mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-xs text-green-100 uppercase tracking-wider font-semibold mt-1">Jobs Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="relative flex flex-col justify-center items-center p-6 lg:p-12 z-20">
          
          {/* Form Card */}
          <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 sm:p-10 relative z-30">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Welcome to <span className="text-[#155d27]">Go Farm Work</span>
              </h2>
              <p className="text-sm text-gray-500 mt-2 font-medium">Sign in or create an account to continue</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center mb-8 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={cn(
                  "flex-1 pb-4 text-center font-bold text-[15px] transition-colors relative",
                  !isSignup ? "text-[#155d27]" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Sign In
                {!isSignup && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#155d27] rounded-t-full" />}
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={cn(
                  "flex-1 pb-4 text-center font-bold text-[15px] transition-colors relative",
                  isSignup ? "text-[#155d27]" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Sign Up
                {isSignup && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#155d27] rounded-t-full" />}
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mobile Number</Label>
                <div className="relative flex rounded-xl border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#155d27] focus-within:border-transparent transition-all">
                  <div className="flex items-center px-4 bg-gray-50/50 border-r border-gray-200 text-gray-600 font-medium text-sm">
                    +91 <ChevronDown className="size-4 ml-1 opacity-50" />
                  </div>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="flex-1 border-0 rounded-none h-12 focus-visible:ring-0 text-base px-4"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Phone className="size-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 rounded-xl border-gray-300 focus-visible:ring-[#155d27] text-base px-4 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              {!isSignup && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-bold text-[#155d27] hover:underline">Forgot password?</a>
                </div>
              )}

              <Button
                type="submit"
                disabled={busy}
                className="w-full h-12 rounded-xl bg-[#0f4d1e] hover:bg-[#0a3d17] text-white font-bold text-[15px] shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {busy ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
                {!busy && <ArrowRight className="size-5" />}
              </Button>
            </form>

            <div className="mt-8 relative flex items-center justify-center">
              <span className="absolute h-px w-full bg-gray-200"></span>
              <span className="relative bg-white px-4 text-xs font-medium text-gray-400">or continue with</span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" onClick={google} className="h-12 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold shadow-sm gap-2">
                <GoogleMark />
                Google
              </Button>
              <Button type="button" variant="outline" className="h-12 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold shadow-sm gap-2">
                <AppleMark />
                Apple
              </Button>
            </div>

            <div className="mt-8 text-center text-sm font-medium text-gray-600">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={() => setMode(isSignup ? "signin" : "signup")} className="font-bold text-[#155d27] hover:underline">
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Trust Bar */}
      <div className="relative z-20 bg-white/80 backdrop-blur-xl border-t border-gray-100 py-6 px-4 hidden lg:block">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-[#155d27]">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">100% Secure</div>
              <div className="text-xs text-gray-500 font-medium">Your data is safe with us</div>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-[#155d27]">
              <Info className="size-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Fair Payments</div>
              <div className="text-xs text-gray-500 font-medium">Escrow protected</div>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-[#155d27]">
              <Users className="size-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Trusted by Thousands</div>
              <div className="text-xs text-gray-500 font-medium">Across India</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.86-.08-1.7-.22-2.5H12v4.73h6.45a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.58-5.14 3.58-8.83Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-3a7.2 7.2 0 0 1-10.73-3.78H1.36v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.35 14.32a7.2 7.2 0 0 1 0-4.62V6.6H1.36a12 12 0 0 0 0 10.8l3.99-3.08Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.42A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.36 6.6l3.99 3.1A7.2 7.2 0 0 1 12 4.75Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#000" d="M12.15 15.54c-.1-.02-.21-.02-.3 0-1.84.45-3.37-1.12-3.37-3.01 0-1.8 1.48-3.3 3.3-3.3.1 0 .19 0 .28.02 1.93.42 3.36 2.1 3.36 4.14 0 2.16-1.57 3.91-3.27 4.15Z" opacity=".1" />
      <path fill="#000" d="M16.24 16.51c-1.37.98-2.61.95-3.77.08-.41-.31-1.12-.31-1.53 0-1.16.87-2.4.9-3.77-.08-1.74-1.25-3.46-4.04-3.46-7.39 0-3.69 2.1-5.63 4.28-5.63 1.3 0 2.45.69 3.12.69.66 0 1.98-.8 3.51-.69 1.7.12 3.25 1 4.18 2.44-3.55 1.93-3 7.02.6 8.51-.64 1.45-1.55 2.92-3.16 4.07ZM12 6.54c-.06-1.95 1.51-3.6 3.4-3.81.33 2-1.39 3.9-3.4 3.81Z" />
    </svg>
  );
}
