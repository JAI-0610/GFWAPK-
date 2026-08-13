import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type Role = "worker" | "landlord" | "admin";

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  photo_url: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  taluk: string | null;
  gender: string | null;
  language: string;
  bio: string | null;
  skills: string[];
  crops: string[];
  equipment: string[];
  years_experience: number;
  day_rate: number | null;
  farm_name: string | null;
  is_verified: boolean;
  rating: number;
  jobs_completed: number;
  onboarded: boolean;
};

type AuthValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  role: Role | null;
  roles: Role[];
  isWorker: boolean;
  isOwner: boolean;
  refresh: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  const userId = session?.user.id ?? null;

  const { data } = useQuery({
    queryKey: ["me", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const [{ data: profile }, { data: rolesData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId!).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId!),
      ]);
      const roles = (rolesData?.map((r) => r.role) ?? []) as Role[];
      const role = roles[0] ?? null;
      return { 
        profile: (profile as Profile | null) ?? null, 
        role,
        roles,
        isWorker: roles.includes("worker"),
        isOwner: roles.includes("landlord"),
      };
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        profile: data?.profile ?? null,
        role: data?.role ?? null,
        roles: data?.roles ?? [],
        isWorker: data?.isWorker ?? false,
        isOwner: data?.isOwner ?? false,
        refresh: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
