import { GameSession, Player, PlayerStats, Team } from '@/types';

/**
 * Recalculates total scores for each player/team from their roundScores array.
 */
export function recalculateTotals(players: Player[]): Player[] {
  return players.map((player) => ({
    ...player,
    totalScore: (player.roundScores || []).reduce((acc, score) => acc + (Number(score) || 0), 0),
  }));
}

/**
 * Checks if a game session has met victory/loss conditions or determines winner/loser.
 * 
 * CORE RULE for Z Record System (Solo & Partner):
 * - Game uses point accumulation.
 * - Whichever player/team reaches or crosses target (default 100) FIRST is marked as the LOSER,
 *   and the game ends immediately.
 * - Among the remaining players/teams, the one with the LOWEST total score is the WINNER.
 * - If totals drop back below the target (e.g. after undo, edit, or delete), hasEnded is false.
 */
export function evaluateSessionOutcome(session: GameSession): {
  winnerId: string | null;
  loserId: string | null;
  hasEnded: boolean;
  sortedStanding: Player[];
} {
  const target = session.targetScore || 100;
  const players = recalculateTotals(session.players);

  if (players.length === 0) {
    return { winnerId: null, loserId: null, hasEnded: false, sortedStanding: [] };
  }

  // Standings sorted from LOWEST score (best) to HIGHEST score (worst)
  const sortedAscending = [...players].sort((a, b) => a.totalScore - b.totalScore);

  // Check if any player has reached or exceeded target score
  const bustedPlayers = players.filter((p) => p.totalScore >= target);

  if (bustedPlayers.length > 0) {
    // The player/team who crossed target first/highest is the LOSER
    const sortedDesc = [...bustedPlayers].sort((a, b) => b.totalScore - a.totalScore);
    const loser = sortedDesc[0];

    // Among remaining players (not the loser), player/team with LOWEST score is WINNER
    const nonLosers = players.filter((p) => p.id !== loser.id);
    const sortedNonLosers = [...nonLosers].sort((a, b) => a.totalScore - b.totalScore);
    const winner = sortedNonLosers[0] || sortedAscending[0];

    return {
      winnerId: winner ? winner.id : null,
      loserId: loser ? loser.id : null,
      hasEnded: true,
      sortedStanding: sortedAscending,
    };
  }

  // Game still in progress:
  const currentLeader = sortedAscending[0];
  const currentDanger = sortedAscending[sortedAscending.length - 1];

  return {
    winnerId: currentLeader ? currentLeader.id : null,
    loserId: currentDanger && currentDanger.id !== currentLeader?.id ? currentDanger.id : null,
    hasEnded: false,
    sortedStanding: sortedAscending,
  };
}

/**
 * Adds a single score entry to a specific player in Solo mode.
 */
export function addPlayerScore(
  session: GameSession,
  playerId: string,
  score: number
): GameSession {
  const updatedPlayers = session.players.map((player) => {
    if (player.id !== playerId) return player;
    const newRounds = [...(player.roundScores || []), score];
    return {
      ...player,
      roundScores: newRounds,
      totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
    };
  });

  const outcome = evaluateSessionOutcome({
    ...session,
    players: updatedPlayers,
  });

  return {
    ...session,
    players: updatedPlayers,
    winnerId: outcome.winnerId,
    loserId: outcome.loserId,
    status: outcome.hasEnded ? 'completed' : 'active',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Core Rule for Partner Mode (2 vs 2 Doubles):
 * Exactly ONE team gets a score added per round (the points boarded/caught against them),
 * and the OTHER team automatically gets 0 for that round.
 */
export function addPartnerRoundScore(
  session: GameSession,
  boardingTeamId: string,
  points: number
): GameSession {
  const updatedPlayers = session.players.map((team) => {
    const isBoarding = team.id === boardingTeamId;
    const roundScore = isBoarding ? points : 0;
    const newRounds = [...(team.roundScores || []), roundScore];
    return {
      ...team,
      roundScores: newRounds,
      totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
    };
  });

  const outcome = evaluateSessionOutcome({
    ...session,
    players: updatedPlayers,
  });

  return {
    ...session,
    players: updatedPlayers,
    currentRound: (session.currentRound || 1) + 1,
    winnerId: outcome.winnerId,
    loserId: outcome.loserId,
    status: outcome.hasEnded ? 'completed' : 'active',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * UNDO LAST ROUND (Works in BOTH Solo and Partner modes):
 * - In Partner mode: removes the most recent round entry for BOTH teams together.
 * - In Solo mode: removes the most recent round entry from whichever player has the most recent entry.
 * Recalculates all totals, checks 100-bust condition, and resets status to active if dropped below 100.
 */
export function undoLastRound(session: GameSession): GameSession {
  if (session.mode === 'partner') {
    return undoPartnerLastRound(session);
  }

  // Solo mode: find player with the highest round index or the most recent round
  const maxRounds = Math.max(0, ...session.players.map((p) => p.roundScores?.length || 0));
  if (maxRounds === 0) return session;

  const roundIndexToRemove = maxRounds - 1;

  // In Solo mode, if rounds are synchronized, remove roundIndex from all players who reached that round
  const updatedPlayers = session.players.map((player) => {
    const newRounds = [...(player.roundScores || [])];
    if (newRounds.length === maxRounds) {
      newRounds.pop();
    }
    return {
      ...player,
      roundScores: newRounds,
      totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
    };
  });

  const outcome = evaluateSessionOutcome({
    ...session,
    players: updatedPlayers,
  });

  return {
    ...session,
    players: updatedPlayers,
    winnerId: outcome.hasEnded ? outcome.winnerId : null,
    loserId: outcome.hasEnded ? outcome.loserId : null,
    status: outcome.hasEnded ? 'completed' : 'active',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Undoes the most recent round in Partner mode (pops last round score from BOTH teams).
 */
export function undoPartnerLastRound(session: GameSession): GameSession {
  const maxRounds = Math.max(0, ...session.players.map((p) => p.roundScores?.length || 0));
  if (maxRounds === 0) return session;

  const roundIndexToRemove = maxRounds - 1;
  return removeRoundAtIndex(session, roundIndexToRemove);
}

/**
 * Undoes the most recent round score for a single player in Solo mode.
 */
export function undoPlayerLastScore(
  session: GameSession,
  playerId: string
): GameSession {
  const targetPlayer = session.players.find((p) => p.id === playerId);
  if (!targetPlayer || !targetPlayer.roundScores || targetPlayer.roundScores.length === 0) {
    return session;
  }
  const lastIndex = targetPlayer.roundScores.length - 1;
  return removePlayerScoreAtIndex(session, playerId, lastIndex);
}

/**
 * Removes a round score for a single player by index and recalculates totals and outcome.
 */
export function removePlayerScoreAtIndex(
  session: GameSession,
  playerId: string,
  roundIndex: number
): GameSession {
  const updatedPlayers = session.players.map((player) => {
    if (player.id !== playerId) return player;
    const newRounds = [...(player.roundScores || [])];
    if (roundIndex >= 0 && roundIndex < newRounds.length) {
      newRounds.splice(roundIndex, 1);
    }
    return {
      ...player,
      roundScores: newRounds,
      totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
    };
  });

  const outcome = evaluateSessionOutcome({
    ...session,
    players: updatedPlayers,
  });

  return {
    ...session,
    players: updatedPlayers,
    winnerId: outcome.hasEnded ? outcome.winnerId : null,
    loserId: outcome.hasEnded ? outcome.loserId : null,
    status: outcome.hasEnded ? 'completed' : 'active',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Removes a round across all players/teams (0-indexed).
 * In Partner mode, this keeps both teams in exact sync.
 */
export function removeRoundAtIndex(session: GameSession, roundIndex: number): GameSession {
  const updatedPlayers = session.players.map((player) => {
    const newRounds = [...(player.roundScores || [])];
    if (roundIndex >= 0 && roundIndex < newRounds.length) {
      newRounds.splice(roundIndex, 1);
    }
    return {
      ...player,
      roundScores: newRounds,
      totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
    };
  });

  const outcome = evaluateSessionOutcome({
    ...session,
    players: updatedPlayers,
  });

  return {
    ...session,
    players: updatedPlayers,
    currentRound: Math.max(1, (session.currentRound || 1) - 1),
    winnerId: outcome.hasEnded ? outcome.winnerId : null,
    loserId: outcome.hasEnded ? outcome.loserId : null,
    status: outcome.hasEnded ? 'completed' : 'active',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Edits a specific round score for a single player or team.
 * Re-evaluates 100-bust status so that if points drop below target, the game returns to active.
 */
export function updateRoundScore(
  session: GameSession,
  roundIndex: number,
  playerId: string,
  newScore: number
): GameSession {
  const updatedPlayers = session.players.map((player) => {
    if (player.id !== playerId) return player;
    const newRounds = [...(player.roundScores || [])];
    if (roundIndex >= 0 && roundIndex < newRounds.length) {
      newRounds[roundIndex] = newScore;
    }
    return {
      ...player,
      roundScores: newRounds,
      totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
    };
  });

  const outcome = evaluateSessionOutcome({
    ...session,
    players: updatedPlayers,
  });

  return {
    ...session,
    players: updatedPlayers,
    winnerId: outcome.hasEnded ? outcome.winnerId : null,
    loserId: outcome.hasEnded ? outcome.loserId : null,
    status: outcome.hasEnded ? 'completed' : 'active',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Partner Mode Round Edit:
 * Enforces that exactly one team receives the boarded score, and the other team receives 0.
 */
export function updatePartnerRound(
  session: GameSession,
  roundIndex: number,
  boardingTeamId: string,
  boardedScore: number
): GameSession {
  const updatedPlayers = session.players.map((team) => {
    const newRounds = [...(team.roundScores || [])];
    const isBoarding = team.id === boardingTeamId;
    newRounds[roundIndex] = isBoarding ? boardedScore : 0;
    return {
      ...team,
      roundScores: newRounds,
      totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
    };
  });

  const outcome = evaluateSessionOutcome({
    ...session,
    players: updatedPlayers,
  });

  return {
    ...session,
    players: updatedPlayers,
    winnerId: outcome.hasEnded ? outcome.winnerId : null,
    loserId: outcome.hasEnded ? outcome.loserId : null,
    status: outcome.hasEnded ? 'completed' : 'active',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Aggregates statistics across all completed and active games for all unique player/team names.
 */
export function computeLeaderboardStats(sessions: GameSession[]): PlayerStats[] {
  const statsMap: Record<
    string,
    {
      name: string;
      gamesPlayed: number;
      gamesWon: number;
      gamesLost: number;
      totalPoints: number;
      highestRound: number;
    }
  > = {};

  sessions.forEach((session) => {
    const isCompleted = session.status === 'completed';

    session.players.forEach((player) => {
      const key = player.name.trim().toLowerCase();
      if (!statsMap[key]) {
        statsMap[key] = {
          name: player.name.trim(),
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          totalPoints: 0,
          highestRound: 0,
        };
      }

      statsMap[key].gamesPlayed += 1;
      statsMap[key].totalPoints += player.totalScore;

      if (isCompleted) {
        if (session.winnerId === player.id) {
          statsMap[key].gamesWon += 1;
        } else if (session.loserId === player.id) {
          statsMap[key].gamesLost += 1;
        }
      }

      // Check highest round score
      player.roundScores.forEach((rScore) => {
        if (rScore > statsMap[key].highestRound) {
          statsMap[key].highestRound = rScore;
        }
      });
    });
  });

  return Object.values(statsMap)
    .map((item) => ({
      name: item.name,
      gamesPlayed: item.gamesPlayed,
      gamesWon: item.gamesWon,
      gamesLost: item.gamesLost,
      totalPoints: item.totalPoints,
      winRate:
        item.gamesPlayed > 0 ? Math.round((item.gamesWon / item.gamesPlayed) * 100) : 0,
      avgScore:
        item.gamesPlayed > 0 ? Math.round(item.totalPoints / item.gamesPlayed) : 0,
      highestRound: item.highestRound,
    }))
    .sort((a, b) => b.gamesWon - a.gamesWon || b.winRate - a.winRate || b.totalPoints - a.totalPoints);
}
