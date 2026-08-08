import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

export type PublicJob = {
  id: string;
  title: string;
  crop: string | null;
  wage_amount: number;
  wage_type: string;
  village: string | null;
  district: string | null;
  state: string | null;
  crew_size: number;
  start_date: string | null;
  urgency: string;
  food_provided: boolean;
  stay_provided: boolean;
  transport_provided: boolean;
  tools_provided: boolean;
  escrow_funded: boolean;
  created_at: string;
};

export const listPublicJobs = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  const supabasePublic = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const { data, error } = await supabasePublic
    .from("jobs")
    .select(
      "id, title, crop, wage_amount, wage_type, village, district, state, crew_size, start_date, urgency, food_provided, stay_provided, transport_provided, tools_provided, escrow_funded, created_at",
    )
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) throw new Error(error.message);
  return (data ?? []) as PublicJob[];
});
