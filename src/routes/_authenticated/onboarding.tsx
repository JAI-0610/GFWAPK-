import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Handshake, Sprout, Tractor, Upload, Camera, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-background">
      <header className="bg-field px-5 pb-10 pt-5 text-primary-deep-foreground">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <span className="text-lg font-extrabold">{t("appName")}</span>
          <LanguagePicker compact />
        </div>
        <h1 className="mx-auto mt-8 max-w-md text-3xl font-extrabold">{t("iAm")}</h1>
      </header>

      <div className="mx-auto -mt-5 max-w-md space-y-4 px-4 pb-16">
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

        <div className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-card">
          
          <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-border">
            <Label className="text-base font-semibold">Profile Picture</Label>
            <div 
              className="relative size-24 overflow-hidden rounded-full border-2 border-primary bg-muted/50 shadow-inner flex items-center justify-center cursor-pointer"
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
            >
              <Upload className="size-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <Field label={t("name")} value={fullName} onChange={setFullName} />
          
          <div className="space-y-1.5">
            <Label className="text-base">Gender</Label>
            <select
              className="flex h-14 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
            <Label htmlFor="phone" className="text-base">
              {t("phone")}
            </Label>
            <Input
              id="phone"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-14 text-lg"
            />
          </div>

          {/* Cascading Location Picker */}
          <div className="space-y-4 rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Location</h3>
              {loadingLocations && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-base">State</Label>
              <select
                className="flex h-14 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
              <Label className="text-base">District</Label>
              <select
                className="flex h-14 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
              <Label className="text-base">Taluk</Label>
              <select
                className="flex h-14 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
              <Label className="text-base">Village</Label>
              <select
                className="flex h-14 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

          <Button onClick={save} disabled={busy || loadingLocations} className="h-14 w-full mt-6 text-lg font-bold">
            {t("continue")}
          </Button>
        </div>
      </div>
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
      <Label className="text-base">{label}</Label>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-14 text-lg" />
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
        "flex flex-col items-center gap-3 rounded-3xl border-2 bg-card p-5 text-center shadow-card transition",
        active ? "border-primary bg-primary/8" : "border-border",
      )}
    >
      <Icon className={cn("size-10", active ? "text-primary" : "text-muted-foreground")} />
      <span className="text-base font-bold text-card-foreground">{label}</span>
    </button>
  );
}
