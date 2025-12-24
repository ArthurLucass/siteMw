import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Validações apenas em runtime (não durante build)
if (typeof window !== "undefined" || process.env.VERCEL !== "1") {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada no .env.local");
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada no .env.local"
    );
  }
}

// Cliente principal (funciona no client e server)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
