import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../../../backend/database/types/database.types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or returns a cached singleton browser-side Supabase client using @supabase/ssr.
 * Safe to use inside React "use client" components.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing.");
  }

  if (typeof window === "undefined") {
    return createBrowserClient<Database>(
      supabaseUrl || "",
      supabaseAnonKey || ""
    );
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      supabaseUrl || "",
      supabaseAnonKey || ""
    );
  }

  return browserClient;
}
