import React, { useState } from 'react';
import { GameSession } from '@/types';
import { PlayerCard } from './PlayerCard';
import { GameResultsModal } from './GameResultsModal';
import {
  Trophy,
  Skull,
  Plus,
  RotateCcw,
  Sparkles,
  Award,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  addPlayerScore,
  undoPlayerLastScore,
  removePlayerScoreAtIndex,
  updateRoundScore,
  evaluateSessionOutcome,
} from '@/lib/game';

interface ActiveGameProps {
  session: GameSession | null;
  onUpdateSession: (updated: GameSession) => void;
  onStartNewGame: () => void;
  onViewHistory: () => void;
}

export const ActiveGame: React.FC<ActiveGameProps> = ({
  session,
  onUpdateSession,
  onStartNewGame,
  onViewHistory,
}) => {
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showFullScoreTable, setShowFullScoreTable] = useState(true);
  const [showResultsModal, setShowResultsModal] = useState(true);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/40 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-amber-400 shadow-inner">
          <Trophy className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-white">No Active Domino Match</h3>
        <p className="mt-2 max-w-md text-sm text-zinc-400">
          Start a new session with 2 to 6 players to record rounds, track domino pips, and see live rankings.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onStartNewGame}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-md transition hover:bg-amber-400"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Start New Game
          </button>
          <button
            onClick={onViewHistory}
            className="rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            Browse Past Games
          </button>
        </div>
      </div>
    );
  }

  const targetScore = session.targetScore || 100;
  const isCompleted = session.status === 'completed';

  // Compute standings sorted from LOWEST score (best) to HIGHEST score (worst)
  const sortedAscending = [...session.players].sort((a, b) => a.totalScore - b.totalScore);
  const bestPlayerId = sortedAscending[0]?.id;
  const highestPlayerId = sortedAscending[sortedAscending.length - 1]?.id;

  // Add individual score to player
  const handleAddPlayerScore = (playerId: string, score: number) => {
    const updated = addPlayerScore(session, playerId, score);
    onUpdateSession(updated);
    if (updated.status === 'completed') {
      setShowResultsModal(true);
    }
  };

  // Undo most recent score for player
  const handleUndoPlayerLastScore = (playerId: string) => {
    const updated = undoPlayerLastScore(session, playerId);
    onUpdateSession(updated);
  };

  // Edit individual round score for player
  const handleEditPlayerRoundScore = (
    playerId: string,
    roundIndex: number,
    newScore: number
  ) => {
    const updated = updateRoundScore(session, roundIndex, playerId, newScore);
    onUpdateSession(updated);
  };

  // Delete individual round score for player
  const handleDeletePlayerRoundScore = (playerId: string, roundIndex: number) => {
    const updated = removePlayerScoreAtIndex(session, playerId, roundIndex);
    onUpdateSession(updated);
  };

  const handleToggleCompleted = () => {
    const nextStatus = isCompleted ? 'active' : 'completed';
    const outcome = evaluateSessionOutcome(session);
    const updated: GameSession = {
      ...session,
      status: nextStatus,
      winnerId: nextStatus === 'completed' ? outcome.winnerId : null,
      loserId: nextStatus === 'completed' ? outcome.loserId : null,
    };
    onUpdateSession(updated);
    setShowConfirmFinish(false);
    if (nextStatus === 'completed') {
      setShowResultsModal(true);
    }
  };

  // Max rounds across any player
  const maxRounds = Math.max(0, ...session.players.map((p) => p.roundScores?.length || 0));

  const winner = session.players.find((p) => p.id === session.winnerId);
  const loser = session.players.find((p) => p.id === session.loserId);

  return (
    <div className="space-y-6">
      {/* Top Banner / Match Info Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                isCompleted
                  ? 'border border-zinc-700 bg-zinc-800 text-zinc-300'
                  : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isCompleted ? 'bg-zinc-400' : 'animate-ping bg-emerald-400'
                }`}
              />
              {isCompleted ? 'Match Completed' : 'In Progress (Real-Time)'}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="h-3 w-3" />
              {session.date}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs font-semibold text-red-400">
              Bust Limit: {targetScore} pts (1st to reach loses!)
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400">
              {session.players.length} Players
            </span>
          </div>

          <h2 className="mt-1.5 text-xl font-black tracking-tight text-white sm:text-2xl">
            {session.title || 'Dominoes Match'}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {isCompleted && (
            <button
              onClick={() => setShowResultsModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3.5 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/25 transition"
            >
              <Trophy className="h-3.5 w-3.5" />
              View Results
            </button>
          )}

          <button
            onClick={() => setShowConfirmFinish(!showConfirmFinish)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              isCompleted
                ? 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                : 'border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                Reopen Match
              </>
            ) : (
              <>
                <Award className="h-3.5 w-3.5 text-amber-400" />
                End Match Early
              </>
            )}
          </button>

          <button
            onClick={onStartNewGame}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-zinc-950 shadow-md transition hover:bg-amber-400"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            New Match
          </button>
        </div>
      </div>

      {/* Confirmation Modal to finish game early */}
      {showConfirmFinish && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-zinc-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-amber-400">
                {isCompleted ? 'Reopen this match?' : 'End match and declare winner?'}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                {isCompleted
                  ? 'This will set the match status back to Active so you can add more scores.'
                  : `Lowest score winner: ${sortedAscending[0]?.name} (${sortedAscending[0]?.totalScore} pts). Highest score: ${sortedAscending[sortedAscending.length - 1]?.name} (${sortedAscending[sortedAscending.length - 1]?.totalScore} pts).`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleCompleted}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed Game Announcement Banner */}
      {isCompleted && (
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-amber-500/15 via-zinc-900 to-red-500/15 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 shadow-lg">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  Match Winner (Lowest Score)
                </span>
                <h3 className="text-2xl font-black text-white">
                  {winner?.name || 'Winner'}
                </h3>
                <p className="text-xs text-zinc-300">
                  Lowest score of{' '}
                  <span className="font-bold text-amber-400">
                    {winner?.totalScore} pts
                  </span>
                </p>
              </div>
            </div>

            {loser && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2.5">
                <Skull className="h-5 w-5 text-red-400" />
                <div className="text-left text-xs">
                  <span className="font-bold text-red-400 block uppercase">
                    Loser (Reached {targetScore} First)
                  </span>
                  <span className="text-white font-bold">{loser.name}</span>{' '}
                  <span className="text-red-300">({loser.totalScore} pts)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Game Screen: Players Cards Side-by-Side */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Player Cards ({session.players.length} Players)
            </span>
            <span className="text-[11px] text-zinc-500">
              • Lowest score wins! First to {targetScore} pts is marked as LOSER.
            </span>
          </div>
        </div>

        {/* Responsive Grid of Player Cards Side-by-Side */}
        <div
          className={`grid gap-4 ${
            session.players.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : session.players.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : session.players.length === 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {session.players.map((player) => {
            // Rank from lowest score (1st place) to highest
            const rank = sortedAscending.findIndex((p) => p.id === player.id) + 1;
            const isWinner = session.winnerId === player.id;
            const isLoser = session.loserId === player.id;
            const isLeader = bestPlayerId === player.id && !isCompleted;

            return (
              <PlayerCard
                key={player.id}
                player={player}
                rank={rank}
                isLeader={isLeader}
                isWinner={isWinner}
                isLoser={isLoser}
                targetScore={targetScore}
                onAddScore={handleAddPlayerScore}
                onUndoLastScore={handleUndoPlayerLastScore}
                onEditRoundScore={handleEditPlayerRoundScore}
                onDeleteRoundScore={handleDeletePlayerRoundScore}
                isGameOver={isCompleted}
              />
            );
          })}
        </div>
      </div>

      {/* Aggregate Score Matrix / Rounds Table */}
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
        <button
          type="button"
          onClick={() => setShowFullScoreTable(!showFullScoreTable)}
          className="flex w-full items-center justify-between border-b border-zinc-800 px-6 py-4 text-left transition hover:bg-zinc-800/30"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Full Scorecard Table</h3>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-400">
              {maxRounds} {maxRounds === 1 ? 'Round' : 'Rounds'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>{showFullScoreTable ? 'Hide Table' : 'Show Table'}</span>
            {showFullScoreTable ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </button>

        {showFullScoreTable && (
          <div>
            {maxRounds === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">
                No scores recorded yet. Add scores on the player cards above to start filling the scorecard!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-zinc-800 bg-zinc-950/70 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-6 py-3">Round</th>
                      {session.players.map((p) => (
                        <th key={p.id} className="px-6 py-3">
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {Array.from({ length: maxRounds }).map((_, rIdx) => (
                      <tr
                        key={rIdx}
                        className="transition-colors hover:bg-zinc-800/30"
                      >
                        <td className="whitespace-nowrap px-6 py-3 font-medium text-zinc-300">
                          <span className="rounded bg-zinc-800 px-2 py-1 font-mono text-xs font-bold text-zinc-200">
                            R{rIdx + 1}
                          </span>
                        </td>

                        {session.players.map((player) => {
                          const score = player.roundScores[rIdx];
                          const hasScore = score !== undefined;
                          const cumulative = (player.roundScores || [])
                            .slice(0, rIdx + 1)
                            .reduce((a, b) => a + b, 0);

                          return (
                            <td
                              key={player.id}
                              className="whitespace-nowrap px-6 py-3 font-mono"
                            >
                              {hasScore ? (
                                <div className="flex items-baseline gap-2">
                                  <span
                                    className={`text-sm font-bold ${
                                      score > 0 ? 'text-amber-400' : 'text-zinc-500'
                                    }`}
                                  >
                                    +{score}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    ({cumulative})
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-zinc-600">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Totals Row */}
                    <tr className="border-t-2 border-zinc-700 bg-zinc-950 font-bold">
                      <td className="px-6 py-4 text-xs uppercase tracking-wider text-amber-400">
                        Total
                      </td>
                      {session.players.map((p) => (
                        <td key={p.id} className="px-6 py-4">
                          <span
                            className={`text-xl font-extrabold ${
                              p.id === session.loserId
                                ? 'text-red-400'
                                : p.id === session.winnerId
                                ? 'text-amber-400'
                                : 'text-white'
                            }`}
                          >
                            {p.totalScore}
                          </span>
                          <span className="ml-1 text-xs text-zinc-500">pts</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Modal on Losing Condition Trigger */}
      {isCompleted && (
        <GameResultsModal
          session={session}
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          onStartNewGame={onStartNewGame}
          onViewHistory={onViewHistory}
        />
      )}
    </div>
  );
};
