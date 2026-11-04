import { GameSession } from '@/types';
import { getSupabase } from '@/lib/supabase';
import { sanitizeSessions } from '@/lib/storage';

const TABLE = 'game_sessions';

function client() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Cloud sync is not configured.');
  return supabase;
}

/** Loads every match of the signed-in user (Row Level Security limits rows to their own). */
export async function fetchCloudSessions(): Promise<GameSession[]> {
  const { data, error } = await client().from(TABLE).select('data');
  if (error) throw new Error(error.message);
  return sanitizeSessions((data ?? []).map((row) => row.data));
}

export async function upsertCloudSessions(userId: string, sessions: GameSession[]): Promise<void> {
  if (sessions.length === 0) return;
  const rows = sessions.map((session) => ({
    user_id: userId,
    id: session.id,
    status: session.status,
    data: session,
    updated_at: session.updatedAt || session.createdAt || new Date().toISOString(),
  }));
  const { error } = await client().from(TABLE).upsert(rows, { onConflict: 'user_id,id' });
  if (error) throw new Error(error.message);
}

export async function deleteCloudSession(userId: string, sessionId: string): Promise<void> {
  const { error } = await client().from(TABLE).delete().eq('user_id', userId).eq('id', sessionId);
  if (error) throw new Error(error.message);
}

export async function deleteAllCloudSessions(userId: string): Promise<void> {
  const { error } = await client().from(TABLE).delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export interface AuthResult {
  error: string | null;
  needsEmailConfirmation?: boolean;
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const { error } = await client().auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await client().auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  return { error: error?.message ?? null, needsEmailConfirmation: !error && !data.session };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await client().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  return { error: error?.message ?? null };
}
