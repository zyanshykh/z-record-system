import React from 'react';
import { GameSession, Player } from '@/types';
import {
  Trophy,
  Skull,
  RotateCcw,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  X,
  History,
  CheckCircle2,
} from 'lucide-react';

interface GameResultsModalProps {
  session: GameSession;
  isOpen: boolean;
  onClose: () => void;
  onStartNewGame: () => void;
  onViewHistory: () => void;
}

export const GameResultsModal: React.FC<GameResultsModalProps> = ({
  session,
  isOpen,
  onClose,
  onStartNewGame,
  onViewHistory,
}) => {
  if (!isOpen) return null;

  const targetScore = session.targetScore || 100;
  const loser = session.players.find((p) => p.id === session.loserId);
  const winner = session.players.find((p) => p.id === session.winnerId);

  // Standings sorted from LOWEST score (best) to HIGHEST score (busted/loser)
  const sortedFromLowestToHighest = [...session.players].sort(
    (a, b) => a.totalScore - b.totalScore
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Alert: Losing condition triggered */}
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
            <Skull className="h-3.5 w-3.5" />
            Target Reached ({targetScore}+ pts) — Match Ended
          </div>

          <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Final Match Results
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            {session.title || 'Dominoes Match'} • {session.date} • Saved to Match History
          </p>
        </div>

        {/* Winner and Loser Dual Showcase */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Winner Card: LOWEST Score */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-gradient-to-b from-amber-500/15 via-zinc-900 to-zinc-900 p-5 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-wider">
                Winner (Lowest Score)
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-black text-white truncate">
                {winner?.name || 'Winner'}
              </h3>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-amber-400">
                  {winner?.totalScore}
                </span>
                <span className="text-xs font-semibold text-zinc-400">
                  total pts ({winner?.roundScores.length || 0} rounds)
                </span>
              </div>
              <p className="mt-2 text-[11px] text-zinc-400">
                Safely kept score the lowest while opponents accumulated points!
              </p>
            </div>
          </div>

          {/* Loser Card: FIRST to Reach 100 */}
          <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-500/15 via-zinc-900 to-zinc-900 p-5 shadow-lg">
            <div className="flex items-center gap-2 text-red-400">
              <Skull className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-wider">
                Loser (Reached {targetScore} First)
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-black text-white truncate">
                {loser?.name || 'Loser'}
              </h3>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-red-400">
                  {loser?.totalScore}
                </span>
                <span className="text-xs font-semibold text-zinc-400">
                  total pts (Busted at {targetScore})
                </span>
              </div>
              <p className="mt-2 text-[11px] text-zinc-400">
                Reached or crossed {targetScore} points first and ended the match.
              </p>
            </div>
          </div>
        </div>

        {/* Final Scoreboard: Sorted from Lowest to Highest Score */}
        <div className="mt-6">
          <div className="flex items-center justify-between pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Final Scoreboard (Lowest to Highest)
            </h4>
            <span className="text-[11px] text-zinc-500">
              Lower is better
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/80 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-4 py-2.5">Standing</th>
                  <th className="px-4 py-2.5">Player / Team</th>
                  <th className="px-4 py-2.5 text-center">Rounds</th>
                  <th className="px-4 py-2.5 text-right">Final Score</th>
                  <th className="px-4 py-2.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {sortedFromLowestToHighest.map((p, idx) => {
                  const isW = p.id === session.winnerId;
                  const isL = p.id === session.loserId;

                  return (
                    <tr
                      key={p.id}
                      className={
                        isW
                          ? 'bg-amber-500/10'
                          : isL
                          ? 'bg-red-500/10'
                          : 'hover:bg-zinc-800/30'
                      }
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-zinc-300">
                        #{idx + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-white">
                        {p.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center text-xs text-zinc-400">
                        {p.roundScores.length}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold">
                        <span
                          className={
                            isW
                              ? 'text-amber-400 text-base'
                              : isL
                              ? 'text-red-400 text-base'
                              : 'text-zinc-200'
                          }
                        >
                          {p.totalScore}
                        </span>{' '}
                        <span className="text-[10px] text-zinc-500">pts</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {isW && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-950">
                            <Trophy className="h-3 w-3" /> Winner
                          </span>
                        )}
                        {isL && (
                          <span className="inline-flex items-center gap-1 rounded bg-red-500 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                            <Skull className="h-3 w-3" /> Loser
                          </span>
                        )}
                        {!isW && !isL && (
                          <span className="text-xs text-zinc-400">
                            Rank #{idx + 1}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Persistence Confirmation Badge */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-900 px-3.5 py-2 text-xs text-zinc-400 border border-zinc-800">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Game saved to Match History in localStorage
          </span>
          <button
            onClick={onViewHistory}
            className="flex items-center gap-1 text-zinc-300 hover:text-white underline"
          >
            <History className="h-3.5 w-3.5" />
            View in History
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-zinc-800 pt-5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
          >
            Review Board
          </button>

          <button
            onClick={onStartNewGame}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-extrabold text-zinc-950 shadow-lg shadow-amber-500/10 hover:bg-amber-400 active:scale-95 transition"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Start New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};
