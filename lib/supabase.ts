import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_* variables must be referenced literally so Next.js can inline them in the browser bundle.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * True when both Supabase env vars are set.
 * Without them the app keeps working in local-only mode (data stays in this browser).
 */
export const isCloudConfigured = (): boolean => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Returns the shared Supabase browser client, or null when cloud sync is not configured. */
export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}
