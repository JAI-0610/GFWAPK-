import { supabase } from "../supabase/client";

export const auth = {
    signInWithOAuth: async (provider: "google" | "apple" | "microsoft", opts?: any) => {
        const result = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: opts?.redirectTo || window.location.origin
            }
        });
        return result;
    }
};
