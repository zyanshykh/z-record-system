import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { GameSession } from '@/types';
import { getSupabase, isCloudConfigured } from '@/lib/supabase';
import {
  fetchCloudSessions,
  upsertCloudSessions,
  deleteCloudSession,
  deleteAllCloudSessions,
} from '@/lib/cloud';
import { mergeSessions } from '@/lib/sync';
import {
  getStoredSessions,
  saveStoredSessions,
  getCacheOwner,
  setCacheOwner,
  setActiveSessionId,
} from '@/lib/storage';

export type SyncStatus = 'unconfigured' | 'checking' | 'signed-out' | 'syncing' | 'synced' | 'error';

/** When the tab comes back to the foreground, sync again if the last sync is older than this. */
const RESYNC_AFTER_MS = 30_000;

/**
 * Optional cloud sync on top of the local-first storage.
 *
 * localStorage stays the source the UI reads from (instant, works offline). When a user is signed in,
 * every change is also written to Supabase, and the two sides are merged on sign-in and whenever
 * the app returns to the foreground.
 *
 * `onLocalDataChanged` is called after a sync changed what is stored in this browser.
 */
export function useCloudSync(onLocalDataChanged: () => void) {
  const configured = isCloudConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SyncStatus>(configured ? 'checking' : 'unconfigured');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userRef = useRef<User | null>(null);
  const lastSyncRef = useRef(0);
  const onChangedRef = useRef(onLocalDataChanged);
  onChangedRef.current = onLocalDataChanged;

  const fail = useCallback((error: unknown) => {
    setErrorMessage(error instanceof Error ? error.message : 'Sync failed');
    setStatus('error');
  }, []);

  /** Two-way merge between this browser and the account: the newest copy of each match wins. */
  const syncNow = useCallback(async (): Promise<boolean> => {
    const current = userRef.current;
    if (!current) return false;
    setStatus('syncing');
    try {
      const cloud = await fetchCloudSessions();

      // Read local data only after the network call so edits made meanwhile are not overwritten.
      // Matches that belong to a different account are never mixed into this one.
      const owner = getCacheOwner();
      const local = owner && owner !== current.id ? [] : getStoredSessions();
      const { merged, toUpload } = mergeSessions(local, cloud);

      saveStoredSessions(merged);
      setCacheOwner(current.id);
      onChangedRef.current();

      await upsertCloudSessions(current.id, toUpload);
      lastSyncRef.current = Date.now();
      setErrorMessage(null);
      setStatus('synced');
      return true;
    } catch (error) {
      fail(error);
      return false;
    }
  }, [fail]);

  const handleUser = useCallback(
    (next: User | null) => {
      const previousId = userRef.current?.id ?? null;
      userRef.current = next;
      setUser(next);
      if (!next) {
        setStatus('signed-out');
        return;
      }
      if (next.id !== previousId) void syncNow();
    },
    [syncNow]
  );

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => handleUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // Deferred on purpose: supabase-js must not be called synchronously inside this callback.
      setTimeout(() => handleUser(session?.user ?? null), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [handleUser]);

  // Pick up changes made on another device when the user returns to this tab.
  useEffect(() => {
    if (!user) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastSyncRef.current > RESYNC_AFTER_MS) {
        void syncNow();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user, syncNow]);

  const writeToCloud = useCallback(
    async (write: (userId: string) => Promise<void>) => {
      const current = userRef.current;
      if (!current) return;
      setStatus('syncing');
      try {
        await write(current.id);
        setErrorMessage(null);
        setStatus('synced');
      } catch (error) {
        fail(error);
      }
    },
    [fail]
  );

  const pushSession = useCallback(
    (session: GameSession) => writeToCloud((userId) => upsertCloudSessions(userId, [session])),
    [writeToCloud]
  );
  const removeSession = useCallback(
    (sessionId: string) => writeToCloud((userId) => deleteCloudSession(userId, sessionId)),
    [writeToCloud]
  );
  const clearCloud = useCallback(() => writeToCloud((userId) => deleteAllCloudSessions(userId)), [writeToCloud]);

  /**
   * Signs out and removes the account's matches from this browser.
   * Returns false (and stays signed in) if the final sync fails, so nothing is lost.
   */
  const signOut = useCallback(async (): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) return false;
    if (userRef.current && !(await syncNow())) return false;

    saveStoredSessions([]);
    setActiveSessionId(null);
    setCacheOwner(null);
    onChangedRef.current();
    await supabase.auth.signOut();
    return true;
  }, [syncNow]);

  return { configured, user, status, errorMessage, syncNow, pushSession, removeSession, clearCloud, signOut };
}
