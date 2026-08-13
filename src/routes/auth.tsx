import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Phone,
  ShieldCheck,
  MessageCircle,
  IndianRupee,
  Users,
  Tractor,
  Briefcase,
  ChevronDown,
  Info,
  Globe,
  Mail,
  Lock
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

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      // Use provided email or map phone to internal email
      const authEmail = email.trim() !== "" ? email : `${phone.replace(/\D/g, '')}@gofarmwork.internal`;
      
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
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
      options: { redirectTo: `${window.location.origin}/dashboard` },
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
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
                Welcome back to
              </h2>
              <h1 className="text-3xl font-extrabold text-[#155d27] mt-1 tracking-tight">
                Go Farm Work
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-medium">Sign in to continue to your account</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-gray-900">Email address</Label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-12 rounded-xl border-gray-200 focus-visible:ring-[#155d27] text-sm px-10"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="size-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-gray-900">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 rounded-xl border-gray-200 focus-visible:ring-[#155d27] text-sm px-10"
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="size-4 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {!isSignup && (
                  <div className="flex justify-end pt-1">
                    <a href="#" className="text-[13px] font-bold text-[#155d27] hover:underline">Forgot password?</a>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-gray-900">Phone number</Label>
                <div className="relative flex rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#155d27] focus-within:border-transparent transition-all">
                  <div className="flex items-center px-4 bg-gray-50/50 border-r border-gray-200 text-gray-600 font-medium text-sm gap-2">
                    <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5" />
                    +91 <ChevronDown className="size-4 ml-1 opacity-50" />
                  </div>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="flex-1 border-0 rounded-none h-12 focus-visible:ring-0 text-sm px-4"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Phone className="size-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-4 rounded border-gray-300 text-[#155d27] focus:ring-[#155d27]" 
                    />
                    <label htmlFor="remember" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm font-bold text-[#155d27] hover:underline">
                    Use passwordless login
                  </a>
                </div>
              )}

              <Button
                type="submit"
                disabled={busy}
                className="w-full h-12 rounded-xl bg-[#0f4d1e] hover:bg-[#0a3d17] text-white font-bold text-[15px] shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {busy ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
                {!busy && <ArrowRight className="size-5" />}
              </Button>
            </form>

            <div className="mt-8 relative flex items-center justify-center">
              <span className="absolute h-px w-full bg-gray-200"></span>
              <span className="relative bg-white px-4 text-xs font-medium text-gray-400">or sign in with</span>
            </div>

            <div className="mt-8">
              <Button type="button" variant="outline" onClick={google} className="h-12 w-full rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold shadow-sm gap-2">
                <GoogleMark />
                Continue with Google
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
