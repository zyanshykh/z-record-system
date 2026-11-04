import { GameSession } from '@/types';
import { mergeSessions } from '@/lib/sync';

const STORAGE_KEY_SESSIONS = 'z_record_system_sessions';
const STORAGE_KEY_ACTIVE_ID = 'z_record_system_active_id';
const STORAGE_KEY_OWNER = 'z_record_system_owner';

function isValidSession(value: unknown): value is GameSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<GameSession>;
  return (
    typeof session.id === 'string' &&
    session.id.length > 0 &&
    Array.isArray(session.players) &&
    session.players.every(
      (p) => p && typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.roundScores)
    )
  );
}

/**
 * Keeps only well-formed sessions from untrusted data (backup files, cloud rows, old storage)
 * so a bad entry can never crash the app.
 */
export function sanitizeSessions(value: unknown): GameSession[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isValidSession).map((session) => ({
    ...session,
    status: session.status === 'completed' ? 'completed' : 'active',
    players: session.players.map((p) => ({
      ...p,
      totalScore: p.roundScores.reduce((sum, n) => sum + (Number(n) || 0), 0),
    })),
  }));
}

/**
 * Loads game sessions saved in localStorage.
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
    const sessions = sanitizeSessions(JSON.parse(raw));
    // Filter out any legacy dummy games if user had them previously
    const realOnly = sessions.filter((s) => s.id !== 'game-demo-1' && s.id !== 'game-demo-2');
    if (realOnly.length !== sessions.length) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(realOnly));
    }
    return realOnly;
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
 * Returns the stored copy (with its fresh `updatedAt`) so it can be sent to the cloud as-is.
 */
export function saveSingleSession(session: GameSession): GameSession {
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
  return updatedSession;
}

/**
 * Deletes a session by ID and clears active ID if it matched.
 */
export function deleteSessionById(id: string): void {
  const sessions = getStoredSessions().filter((s) => s.id !== id);
  saveStoredSessions(sessions);
  const currentActive = getActiveSessionId();
  if (currentActive === id) {
    const nextActive = sessions.find((s) => s.status === 'active') || sessions[0];
    setActiveSessionId(nextActive ? nextActive.id : null);
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

/**
 * Which cloud account the matches stored in this browser belong to (null = guest data).
 * Used so one person's matches are never mixed into another person's account.
 */
export function getCacheOwner(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY_OWNER);
  } catch {
    return null;
  }
}

export function setCacheOwner(userId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (userId) {
      localStorage.setItem(STORAGE_KEY_OWNER, userId);
    } else {
      localStorage.removeItem(STORAGE_KEY_OWNER);
    }
  } catch (e) {
    console.error('Error saving cache owner:', e);
  }
}

export function exportBackupJSON(): string {
  const sessions = getStoredSessions();
  return JSON.stringify(sessions, null, 2);
}

/**
 * Imports a backup file. Valid matches are merged into the existing ones (newest copy of
 * each match wins) instead of replacing everything. Returns false if nothing usable was found.
 */
export function importBackupJSON(jsonStr: string): boolean {
  try {
    const imported = sanitizeSessions(JSON.parse(jsonStr));
    if (imported.length === 0) {
      return false;
    }
    const { merged } = mergeSessions(getStoredSessions(), imported);
    saveStoredSessions(merged);
    return true;
  } catch (e) {
    console.error('Failed to import backup JSON:', e);
    return false;
  }
}
