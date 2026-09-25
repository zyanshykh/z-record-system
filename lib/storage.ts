import { GameSession, Player } from '@/types';

const STORAGE_KEY_SESSIONS = 'z_record_system_sessions';
const STORAGE_KEY_ACTIVE_ID = 'z_record_system_active_id';

const INITIAL_SAMPLES: GameSession[] = [
  {
    id: 'game-demo-1',
    title: 'Friday Night Dominoes Tournament',
    date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    status: 'completed',
    targetScore: 100,
    mode: 'target-win',
    winnerId: 'p-3',
    loserId: 'p-1',
    currentRound: 4,
    notes: 'Carlos reached 104 first and took the loss! Mateo won with the lowest total (42 pts).',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    players: [
      {
        id: 'p-1',
        name: 'Carlos R.',
        totalScore: 104,
        roundScores: [24, 18, 38, 24],
      },
      {
        id: 'p-2',
        name: 'Zyan (Host)',
        totalScore: 78,
        roundScores: [16, 32, 14, 16],
      },
      {
        id: 'p-3',
        name: 'Mateo D.',
        totalScore: 42,
        roundScores: [12, 10, 8, 12],
      },
      {
        id: 'p-4',
        name: 'Elena V.',
        totalScore: 65,
        roundScores: [22, 14, 15, 14],
      },
    ],
  },
  {
    id: 'game-demo-2',
    title: 'Classic Double-Six Showdown',
    date: new Date().toISOString().slice(0, 10),
    status: 'active',
    targetScore: 100,
    mode: 'target-win',
    winnerId: null,
    loserId: null,
    currentRound: 3,
    notes: 'Race to 100 points. Round 3 currently in progress.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    players: [
      {
        id: 'p-2',
        name: 'Zyan (Host)',
        totalScore: 62,
        roundScores: [34, 28],
      },
      {
        id: 'p-1',
        name: 'Carlos R.',
        totalScore: 48,
        roundScores: [18, 30],
      },
    ],
  },
];

export function getStoredSessions(): GameSession[] {
  if (typeof window === 'undefined') {
    return INITIAL_SAMPLES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(INITIAL_SAMPLES));
      return INITIAL_SAMPLES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLES;
  } catch (e) {
    console.error('Error loading game sessions from localStorage:', e);
    return INITIAL_SAMPLES;
  }
}

export function saveStoredSessions(sessions: GameSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving game sessions to localStorage:', e);
  }
}

export function getActiveSessionId(): string | null {
  if (typeof window === 'undefined') return 'game-demo-2';
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (active) return active;
    return 'game-demo-2';
  } catch {
    return null;
  }
}

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

export function deleteSessionById(id: string): void {
  const sessions = getStoredSessions().filter((s) => s.id !== id);
  saveStoredSessions(sessions);
  const currentActive = getActiveSessionId();
  if (currentActive === id) {
    setActiveSessionId(null);
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

export function resetToDefaults(): void {
  saveStoredSessions(INITIAL_SAMPLES);
  setActiveSessionId('game-demo-2');
}
