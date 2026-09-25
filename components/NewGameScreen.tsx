import React, { useState } from 'react';
import { GameSession, Player } from '@/types';
import { Users, Plus, Trash2, Trophy, Sparkles, ArrowRight, X } from 'lucide-react';

interface NewGameScreenProps {
  onStartGame: (session: GameSession) => void;
  onCancel?: () => void;
}

export const NewGameScreen: React.FC<NewGameScreenProps> = ({ onStartGame, onCancel }) => {
  const [matchTitle, setMatchTitle] = useState('');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
    'Player 5',
    'Player 6',
  ]);
  const [targetScore, setTargetScore] = useState<number>(100);
  const [customTarget, setCustomTarget] = useState<string>('');

  const handleNameChange = (index: number, val: string) => {
    const updated = [...playerNames];
    updated[index] = val;
    setPlayerNames(updated);
  };

  const handleSetPlayerCount = (count: number) => {
    setPlayerCount(count);
  };

  const handleAddPlayer = () => {
    if (playerCount < 6) {
      setPlayerCount((prev) => prev + 1);
    }
  };

  const handleRemovePlayer = (idxToRemove: number) => {
    if (playerCount > 2) {
      const updated = playerNames.filter((_, i) => i !== idxToRemove);
      updated.push(`Player ${updated.length + 1}`);
      setPlayerNames(updated);
      setPlayerCount((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPlayers: Player[] = playerNames
      .slice(0, playerCount)
      .map((name, i) => ({
        id: `p-${Date.now()}-${i + 1}-${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim() || `Player ${i + 1}`,
        totalScore: 0,
        roundScores: [],
      }));

    const finalTarget = customTarget ? parseInt(customTarget, 10) || 100 : targetScore;

    const newSession: GameSession = {
      id: `game-${Date.now()}`,
      title: matchTitle.trim() || `Dominoes Match (${playerCount} Players)`,
      date: new Date().toISOString().slice(0, 10),
      players: selectedPlayers,
      winnerId: null,
      loserId: null,
      status: 'active',
      targetScore: finalTarget,
      mode: 'target-win',
      currentRound: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onStartGame(newSession);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                New Domino Match
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Configure 2 to 6 players or teams and set your winning target
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Match Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
              Match / Tournament Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Friday Night Championship, Double-Six Showdown"
              value={matchTitle}
              onChange={(e) => setMatchTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Player Count Selector (2 to 6) */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Number of Players / Teams (2 to 6)
              </label>
              <span className="text-xs font-bold text-amber-400">
                {playerCount} Players Selected
              </span>
            </div>

            <div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-5">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSetPlayerCount(num)}
                  className={`flex flex-col items-center justify-center rounded-xl border py-2.5 text-sm font-bold transition ${
                    playerCount === num
                      ? 'border-amber-500 bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-base">{num}</span>
                  <span className="text-[10px] font-normal uppercase text-zinc-500">
                    Players
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Player Names Input Grid */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Player / Team Names
              </label>
              {playerCount < 6 && (
                <button
                  type="button"
                  onClick={handleAddPlayer}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another player
                </button>
              )}
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: playerCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center rounded-xl border border-zinc-700/80 bg-zinc-950 px-3 py-1.5 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-800 font-mono text-xs font-bold text-amber-400">
                    P{idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={playerNames[idx] || ''}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    placeholder={`Player / Team ${idx + 1}`}
                    className="w-full bg-transparent px-2.5 py-1 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none"
                  />
                  {playerCount > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(idx)}
                      title="Remove player"
                      className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Target Score to Win */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Target Score to Win
              </label>
              <span className="text-xs font-medium text-amber-400">
                First to reach or exceed target wins
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {[50, 100, 150, 200].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => {
                    setTargetScore(score);
                    setCustomTarget('');
                  }}
                  className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                    targetScore === score && !customTarget
                      ? 'border-amber-500 bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {score} pts
                </button>
              ))}

              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Custom Target"
                  value={customTarget}
                  onChange={(e) => {
                    if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                      setCustomTarget(e.target.value);
                    }
                  }}
                  className={`w-32 rounded-xl border px-3 py-2 text-xs font-bold text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none ${
                    customTarget
                      ? 'border-amber-500 bg-zinc-950 text-amber-400 ring-1 ring-amber-500'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-5">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-zinc-700 bg-zinc-800/80 px-5 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-extrabold text-zinc-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-400 active:scale-95"
            >
              <span>Launch Match & Start Scoring</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
