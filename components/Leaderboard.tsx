import React from 'react';
import { GameSession, PlayerStats } from '@/types';
import { computeLeaderboardStats } from '@/lib/game';
import { Trophy, Medal, Award, Flame, Users, Sparkles } from 'lucide-react';

interface LeaderboardProps {
  sessions: GameSession[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ sessions }) => {
  const stats = computeLeaderboardStats(sessions);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Player Standings
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Z Record System Hall of Fame
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Overall win/loss records, round highs, and scoring efficiency across all Dominoes sessions.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-center">
              <span className="block text-base font-black text-white">
                {sessions.length}
              </span>
              <span>Matches Tracked</span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-center">
              <span className="block text-base font-black text-amber-400">
                {stats.length}
              </span>
              <span>Unique Players</span>
            </div>
          </div>
        </div>
      </div>

      {/* Podium for Top 3 */}
      {stats.length >= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 2nd Place */}
          {stats[1] && (
            <div className="order-2 sm:order-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center flex flex-col justify-between">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 shadow-inner">
                  <Medal className="h-6 w-6" />
                </div>
                <span className="mt-2 inline-block rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                  2ND PLACE
                </span>
                <h3 className="mt-2 text-lg font-bold text-white truncate">
                  {stats[1].name}
                </h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3 text-xs">
                <div>
                  <span className="text-zinc-500">Wins</span>
                  <p className="font-bold text-white">{stats[1].gamesWon}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Win Rate</span>
                  <p className="font-bold text-amber-400">{stats[1].winRate}%</p>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {stats[0] && (
            <div className="order-1 sm:order-2 rounded-2xl border border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-zinc-900/90 to-zinc-900 p-6 text-center shadow-lg ring-1 ring-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 shadow-md">
                  <Trophy className="h-8 w-8" />
                </div>
                <span className="mt-2 inline-block rounded bg-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold text-zinc-950">
                  1ST PLACE CHAMPION
                </span>
                <h3 className="mt-2 text-xl font-black text-white truncate">
                  {stats[0].name}
                </h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-amber-500/20 pt-3 text-xs">
                <div>
                  <span className="text-zinc-400">Total Wins</span>
                  <p className="text-base font-extrabold text-white">
                    {stats[0].gamesWon}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-400">Win Rate</span>
                  <p className="text-base font-extrabold text-amber-400">
                    {stats[0].winRate}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {stats[2] && (
            <div className="order-3 sm:order-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center flex flex-col justify-between">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-amber-700 shadow-inner">
                  <Award className="h-6 w-6" />
                </div>
                <span className="mt-2 inline-block rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  3RD PLACE
                </span>
                <h3 className="mt-2 text-lg font-bold text-white truncate">
                  {stats[2].name}
                </h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3 text-xs">
                <div>
                  <span className="text-zinc-500">Wins</span>
                  <p className="font-bold text-white">{stats[2].gamesWon}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Win Rate</span>
                  <p className="font-bold text-amber-400">{stats[2].winRate}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-sm">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h3 className="text-base font-bold text-white">All Players Ranking</h3>
        </div>

        {stats.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">
            No player stats recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">Player</th>
                  <th className="px-6 py-3 text-center">Matches</th>
                  <th className="px-6 py-3 text-center">Won</th>
                  <th className="px-6 py-3 text-center">Lost</th>
                  <th className="px-6 py-3 text-center">Win Rate</th>
                  <th className="px-6 py-3 text-center">Total Points</th>
                  <th className="px-6 py-3 text-center">Avg / Game</th>
                  <th className="px-6 py-3 text-right">Best Round</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {stats.map((player, idx) => (
                  <tr
                    key={player.name}
                    className="hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          idx === 0
                            ? 'bg-amber-500 text-zinc-950'
                            : idx === 1
                            ? 'bg-zinc-300 text-zinc-900'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-bold text-white">
                      {player.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-zinc-300">
                      {player.gamesPlayed}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center font-semibold text-emerald-400">
                      {player.gamesWon}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-zinc-400">
                      {player.gamesLost}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center font-bold text-amber-400">
                      {player.winRate}%
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center font-mono font-medium text-zinc-200">
                      {player.totalPoints}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-zinc-400">
                      {player.avgScore}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-mono font-bold text-amber-400">
                      +{player.highestRound}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
