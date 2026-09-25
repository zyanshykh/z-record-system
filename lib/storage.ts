import { GameSession } from '@/types';

const STORAGE_KEY_SESSIONS = 'z_record_system_sessions';
const STORAGE_KEY_ACTIVE_ID = 'z_record_system_active_id';

/**
 * Loads real game sessions saved in localStorage.
 * No dummy or demo data is seeded; returns empty array if nothing is saved.
 */
export function getStoredSessions(): GameSession[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any legacy dummy games if user had them previously
      const realOnly = parsed.filter(
        (s) => s && s.id !== 'game-demo-1' && s.id !== 'game-demo-2'
      );
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(realOnly));
      }
      return realOnly;
    }
    return [];
  } catch (e) {
    console.error('Error loading game sessions from localStorage:', e);
    return [];
  }
}

/**
 * Saves game sessions array to localStorage.
 */
export function saveStoredSessions(sessions: GameSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving game sessions to localStorage:', e);
  }
}

/**
 * Gets the active game session ID, or finds the first active game in storage.
 */
export function getActiveSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    const all = getStoredSessions();
    if (active && all.some((s) => s.id === active)) {
      return active;
    }
    const firstActive = all.find((s) => s.status === 'active');
    if (firstActive) return firstActive.id;
    return all.length > 0 ? all[0].id : null;
  } catch {
    return null;
  }
}

/**
 * Sets the active game session ID in localStorage.
 */
export function setActiveSessionId(id: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    }
  } catch (e) {
    console.error('Error saving active session ID:', e);
  }
}

/**
 * Saves or updates a single game session in localStorage instantly.
 */
export function saveSingleSession(session: GameSession): void {
  const sessions = getStoredSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  const updatedSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    sessions[index] = updatedSession;
  } else {
    sessions.unshift(updatedSession);
  }
  saveStoredSessions(sessions);
}

/**
 * Deletes a session by ID and clears active ID if it matched.
 */
export function deleteSessionById(id: string): void {
  const sessions = getStoredSessions().filter((s) => s.id !== id);
  saveStoredSessions(sessions);
  const currentActive = getActiveSessionId();
  if (currentActive === id) {
    const nextActive = sessions.find((s) => s.status === 'active') || (sessions[0] ? sessions[0].id : null);
    setActiveSessionId(typeof nextActive === 'string' ? nextActive : nextActive ? nextActive.id : null);
  }
}

/**
 * Clears all user data completely (empty state).
 */
export function clearAllGameData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
  } catch (e) {
    console.error('Error clearing localStorage data:', e);
  }
}

export function exportBackupJSON(): string {
  const sessions = getStoredSessions();
  return JSON.stringify(sessions, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      saveStoredSessions(parsed);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to import backup JSON:', e);
    return false;
  }
}
