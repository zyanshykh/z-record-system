import { GameSession } from '@/types';

/** Last-modified time of a session in ms (0 when unknown). */
const stamp = (session: GameSession): number => {
  const time = Date.parse(session.updatedAt || session.createdAt || '');
  return Number.isNaN(time) ? 0 : time;
};

/**
 * Merges two lists of sessions by id. The most recently updated copy of each match wins;
 * on a tie the `remote` copy is kept.
 *
 * `toUpload` lists the local sessions that are newer than (or missing from) `remote`,
 * i.e. the ones the remote side still needs to receive.
 */
export function mergeSessions(
  local: GameSession[],
  remote: GameSession[]
): { merged: GameSession[]; toUpload: GameSession[] } {
  const byId = new Map<string, GameSession>();
  remote.forEach((session) => byId.set(session.id, session));

  const toUpload: GameSession[] = [];
  local.forEach((session) => {
    const existing = byId.get(session.id);
    if (!existing || stamp(session) > stamp(existing)) {
      byId.set(session.id, session);
      toUpload.push(session);
    }
  });

  const merged = Array.from(byId.values()).sort((a, b) => stamp(b) - stamp(a));
  return { merged, toUpload };
}
