import React, { useState } from 'react';
import { GameSession } from '@/types';
import {
  Trophy,
  Skull,
  Calendar,
  Layers,
  X,
  Clock,
  ArrowRight,
  TrendingDown,
  BarChart2,
} from 'lucide-react';

interface MatchDetailsModalProps {
  session: GameSession | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenInScoreboard?: (id: string) => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  session,
  isOpen,
  onClose,
  onOpenInScoreboard,
}) => {
  if (!isOpen || !session) return null;

  const targetScore = session.targetScore || 100;
  const isCompleted = session.status === 'completed';

  const winner = session.players.find((p) => p.id === session.winnerId);
  const loser = session.players.find((p) => p.id === session.loserId);

  // Standings sorted lowest to highest (lowest score is best)
  const sortedStandings = [...session.players].sort((a, b) => a.totalScore - b.totalScore);
  const maxRounds = Math.max(0, ...session.players.map((p) => p.roundScores?.length || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title & Metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider ${
                isCompleted
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isCompleted ? 'Completed Match' : 'In Progress'}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
              {session.mode === 'partner' ? 'Partner Mode (2 vs 2)' : `Solo (${session.players.length} Players)`}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Calendar className="h-3.5 w-3.5" />
              {session.date}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Target Bust: {targetScore} pts</span>
          </div>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {session.title || (session.mode === 'partner' ? 'Domino Doubles Match' : 'Dominoes Match Details')}
          </h2>

          {session.notes && (
            <p className="mt-1 text-xs text-zinc-400 italic">
              Note: {session.notes}
            </p>
          )}
        </div>

        {/* Winner and Loser Summary Banner */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {winner && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 shadow">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                  Winner (Lowest Score)
                </span>
                <h4 className="truncate text-lg font-black text-white">
                  {winner.name}
                </h4>
                <p className="font-mono text-xs font-bold text-amber-400">
                  {winner.totalScore} pts across {winner.roundScores.length} rounds
                </p>
              </div>
            </div>
          )}

          {loser && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white shadow">
                <Skull className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-400">
                  Bust Loser ({targetScore}+ pts)
                </span>
                <h4 className="truncate text-lg font-black text-white">
                  {loser.name}
                </h4>
                <p className="font-mono text-xs font-bold text-red-400">
                  {loser.totalScore} pts (First to reach {targetScore})
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Final Standings Cards */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Player Final Standings
          </h4>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {sortedStandings.map((p, idx) => {
              const isW = p.id === session.winnerId;
              const isL = p.id === session.loserId;

              return (
                <div
                  key={p.id}
                  className={`rounded-xl border p-3 text-center ${
                    isW
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : isL
                      ? 'border-red-500/40 bg-red-500/5'
                      : 'border-zinc-800 bg-zinc-900/50'
                  }`}
                >
                  <span className="text-[10px] font-bold text-zinc-500">
                    Rank #{idx + 1}
                  </span>
                  <h5 className="truncate text-sm font-bold text-white">
                    {p.name}
                  </h5>
                  {session.teams?.find((t) => t.id === p.id)?.players && (
                    <span className="text-[10px] text-zinc-400 block truncate">
                      {session.teams.find((t) => t.id === p.id)!.players.join(' & ')}
                    </span>
                  )}
                  <div className="mt-1 font-mono text-xl font-black">
                    <span
                      className={
                        isW ? 'text-amber-400' : isL ? 'text-red-400' : 'text-zinc-200'
                      }
                    >
                      {p.totalScore}
                    </span>
                    <span className="text-[10px] font-normal text-zinc-500"> pts</span>
                  </div>
                  <span className="mt-1 block text-[10px] text-zinc-400">
                    {p.roundScores.length} rounds
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Rounds Detail Matrix */}
        <div className="mt-6">
          <div className="flex items-center justify-between pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-amber-400" />
              Complete Round-by-Round Log ({maxRounds} Rounds)
            </h4>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/70">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-zinc-800 bg-zinc-950 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-4 py-2.5">Round</th>
                  {session.players.map((p) => (
                    <th key={p.id} className="px-4 py-2.5">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {Array.from({ length: maxRounds }).map((_, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-800/30">
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-bold text-zinc-400">
                      Round {rIdx + 1}
                    </td>

                    {session.players.map((p) => {
                      const score = p.roundScores[rIdx];
                      const cumulative = (p.roundScores || [])
                        .slice(0, rIdx + 1)
                        .reduce((a, b) => a + b, 0);

                      return (
                        <td key={p.id} className="whitespace-nowrap px-4 py-2.5 font-mono">
                          {score !== undefined ? (
                            <div className="flex items-baseline gap-1.5">
                              <span
                                className={`text-xs font-bold ${
                                  score > 0 ? 'text-amber-400' : 'text-zinc-500'
                                }`}
                              >
                                +{score}
                              </span>
                              <span className="text-[10px] text-zinc-500">
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

                {/* Final Total Row */}
                <tr className="border-t-2 border-zinc-700 bg-zinc-950 font-bold">
                  <td className="px-4 py-3 text-xs uppercase tracking-wider text-amber-400">
                    Final Total
                  </td>
                  {session.players.map((p) => (
                    <td key={p.id} className="px-4 py-3 font-mono">
                      <span
                        className={`text-base font-extrabold ${
                          p.id === session.loserId
                            ? 'text-red-400'
                            : p.id === session.winnerId
                            ? 'text-amber-400'
                            : 'text-white'
                        }`}
                      >
                        {p.totalScore}
                      </span>
                      <span className="ml-1 text-[10px] text-zinc-500">pts</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            Close
          </button>

          {onOpenInScoreboard && (
            <button
              onClick={() => {
                onOpenInScoreboard(session.id);
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition"
            >
              <span>Open in Live Scoreboard</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
