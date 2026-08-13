import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Handshake, Sprout, Tractor, Upload, Camera, Loader2, ShieldCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import heroImage from "@/assets/workers-harvest.jpg";
import { LanguagePicker } from "@/components/LanguagePicker";
import { MicButton } from "@/components/MicButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Intent = "worker" | "landlord" | "both";
type Search = { role?: Intent | undefined };

const parseIntent = (value: unknown): Intent | undefined =>
  value === "landlord" || value === "worker" || value === "both" ? value : undefined;

export const Route = createFileRoute("/_authenticated/onboarding")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    role: parseIntent(search["role"]),
  }),
  component: Onboarding,
});

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

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

function Onboarding() {
  const { t, lang } = useI18n();
  const { user, refresh, profile, roles } = useAuth();
  const navigate = useNavigate();
  const { role: intendedRole } = Route.useSearch();
  const [role, setRole] = useState<Intent>(() => {
    if (intendedRole) return intendedRole;
    if (typeof window !== "undefined") {
      const stored = parseIntent(window.localStorage.getItem("gfw_intent"));
      if (stored) return stored;
    }
    return "worker";
  });

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Karnataka");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");
  const [customVillage, setCustomVillage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [locationData, setLocationData] = useState<any>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && !initialized) {
      setFullName(profile.full_name ?? "");
      setGender(profile.gender ?? "");
      setPhone(profile.phone ?? "");
      setState(profile.state ?? "Karnataka");
      setDistrict(profile.district ?? "");
      setTaluk(profile.taluk ?? "");
      setVillage(profile.village ?? "");
      setPhotoUrl(profile.photo_url ?? "");
      
      if (roles && roles.length > 0) {
        if (roles.includes("worker") && roles.includes("landlord")) setRole("both");
        else if (roles.includes("landlord")) setRole("landlord");
        else if (roles.includes("worker")) setRole("worker");
      }
      setInitialized(true);
    }
  }, [profile, roles, initialized]);

  useEffect(() => {
    async function fetchStateData() {
      if (!state) {
        setLocationData(null);
        return;
      }
      setLoadingLocations(true);
      try {
        const encodedState = encodeURIComponent(state);
        const url = `https://raw.githubusercontent.com/pranshumaheshwari/indian-cities-and-villages/master/By%20States/${encodedState}.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch locations");
        const data = await res.json();
        setLocationData(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load districts for this state.");
      } finally {
        setLoadingLocations(false);
      }
    }
    fetchStateData();
  }, [state]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = e.target.files[0];
      if (!file) {
        throw new Error('You must select an image to upload.');
      }
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setPhotoUrl(data.publicUrl);
      toast.success("Profile picture uploaded!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // Derived location dropdown options
  const districtsList = locationData?.districts?.map((d: any) => d.district) || [];
  const selectedDistrictData = locationData?.districts?.find((d: any) => d.district === district);
  const taluksList = selectedDistrictData?.subDistricts?.map((s: any) => s.subDistrict) || [];
  const selectedTalukData = selectedDistrictData?.subDistricts?.find((s: any) => s.subDistrict === taluk);
  const villagesList = selectedTalukData?.villages || [];

  const save = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast.error(t("name") + " is required");
      return;
    }
    setBusy(true);
    try {
      const finalVillage = village === "Other" ? customVillage.trim() : village.trim();
      const { error: pErr } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          gender: gender || null,
          phone: phone.trim() || null,
          state: state || null,
          district: district || null,
          taluk: taluk || null,
          village: finalVillage || null,
          photo_url: photoUrl || null,
          language: lang,
          onboarded: true,
        })
        .eq("id", user.id);
      if (pErr) throw pErr;

      const rolesToAdd: Array<"worker" | "landlord"> =
        role === "both" ? ["worker", "landlord"] : [role];
      const { error: rErr } = await supabase
        .from("user_roles")
        .insert(rolesToAdd.map((r) => ({ user_id: user.id, role: r })));
      if (rErr && rErr.code !== "23505") throw rErr;

      await refresh();
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

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
      <main className="relative flex min-h-screen flex-col bg-background/50 h-screen overflow-y-auto">
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

          <div className="flex flex-1 items-start justify-center px-4 py-10 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
                  Complete Profile
                </span>
                <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground">
                  Just a few more details
                </h1>
                <p className="mt-2 text-base text-muted-foreground">
                  You are successfully signed in! We just need your location to show you relevant farm work and workers.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/50 p-6 shadow-[0_8px_40px_rgb(0,0,0,0.08)] backdrop-blur-2xl sm:p-7 dark:border-white/10 dark:bg-black/40">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none dark:from-white/5 dark:to-transparent" />
                <div className="relative z-10 space-y-6">
                  
                  <fieldset>
                    <legend className="mb-3 text-sm font-bold text-foreground">
                      What brings you here?
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      <RoleCard
                        active={role === "worker"}
                        icon={Sprout}
                        label={t("worker")}
                        onClick={() => setRole("worker")}
                      />
                      <RoleCard
                        active={role === "landlord"}
                        icon={Tractor}
                        label={t("landlord")}
                        onClick={() => setRole("landlord")}
                      />
                      <div className="col-span-2">
                        <RoleCard
                          active={role === "both"}
                          icon={Handshake}
                          label="Both — hire & work"
                          onClick={() => setRole("both")}
                        />
                      </div>
                    </div>
                  </fieldset>

                  <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-border/50">
                    <Label className="text-sm font-bold">Profile Picture</Label>
                    <div 
                      className="relative size-24 overflow-hidden rounded-full border-2 border-primary bg-background shadow-inner flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {photoUrl ? (
                        <img src={photoUrl} alt="Avatar" className="size-full object-cover" />
                      ) : (
                        <Camera className="size-8 text-muted-foreground" />
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      disabled={uploading}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="rounded-xl"
                    >
                      <Upload className="size-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>

                  <Field label={t("name")} value={fullName} onChange={setFullName} />
                  
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold">Gender</Label>
                    <select
                      className="flex h-12 w-full rounded-2xl border border-input bg-transparent px-4 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-bold">
                      {t("phone")}
                    </Label>
                    <Input
                      id="phone"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 rounded-2xl text-base"
                    />
                  </div>

                  {/* Cascading Location Picker */}
                  <div className="space-y-4 rounded-2xl border border-border bg-background/50 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm">Location Details</h3>
                      {loadingLocations && <Loader2 className="size-4 animate-spin text-primary" />}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">State</Label>
                      <select
                        className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          setDistrict("");
                          setTaluk("");
                          setVillage("");
                        }}
                      >
                        <option value="">Select State</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">District</Label>
                      <select
                        className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          setTaluk("");
                          setVillage("");
                        }}
                        disabled={!state || loadingLocations}
                      >
                        <option value="">Select District</option>
                        {districtsList.map((d: string) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Taluk</Label>
                      <select
                        className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        value={taluk}
                        onChange={(e) => {
                          setTaluk(e.target.value);
                          setVillage("");
                        }}
                        disabled={!district || loadingLocations}
                      >
                        <option value="">Select Taluk</option>
                        {taluksList.map((t: string) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Village</Label>
                      <select
                        className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        disabled={!taluk || loadingLocations}
                      >
                        <option value="">Select Village</option>
                        {villagesList.map((v: string) => <option key={v} value={v}>{v}</option>)}
                        <option value="Other">Other (Type manually)</option>
                      </select>
                    </div>

                    {village === "Other" && (
                      <Field label="Enter Village Name" value={customVillage} onChange={setCustomVillage} />
                    )}
                  </div>

                  <Button onClick={save} disabled={busy || loadingLocations} className="h-14 w-full rounded-2xl text-lg font-bold">
                    {t("continue")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-bold">{label}</Label>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-12 rounded-2xl text-base" />
        <MicButton onText={(text: string) => onChange(text)} />
      </div>
    </div>
  );
}

function RoleCard({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Sprout;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border-2 bg-background p-4 text-center transition",
        active ? "border-primary bg-primary/8 shadow-card" : "border-border hover:border-primary/40",
      )}
    >
      <Icon className={cn("size-8", active ? "text-primary" : "text-muted-foreground")} />
      <span className="text-sm font-bold text-foreground">{label}</span>
    </button>
  );
}
