import React, { useState } from 'react';
import { GameSession, Player } from '@/types';
import { X, Users, Trophy, Flag, Sparkles } from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (session: GameSession) => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onCreateGame,
}) => {
  const [title, setTitle] = useState('');
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2);
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);
  const [targetScore, setTargetScore] = useState<number>(100);
  const [customTarget, setCustomTarget] = useState<string>('');
  const [mode, setMode] = useState<'target-win' | 'lowest-pip'>('target-win');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handlePlayerNameChange = (index: number, val: string) => {
    const updated = [...playerNames];
    updated[index] = val;
    setPlayerNames(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPlayers: Player[] = playerNames
      .slice(0, playerCount)
      .map((name, i) => ({
        id: `p-${Date.now()}-${i + 1}`,
        name: name.trim() || `Player ${i + 1}`,
        totalScore: 0,
        roundScores: [],
      }));

    const finalTarget = customTarget ? parseInt(customTarget, 10) || 100 : targetScore;

    const newSession: GameSession = {
      id: `game-${Date.now()}`,
      title: title.trim() || `Dominoes Match (${playerCount} Players)`,
      date: new Date().toISOString().slice(0, 10),
      players: selectedPlayers,
      winnerId: null,
      loserId: null,
      status: 'active',
      targetScore: finalTarget,
      mode,
      currentRound: 1,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateGame(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Start New Domino Match</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          {/* Match Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Match Name / Event (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Friday Dominoes, Double Six Finals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Number of Players */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Number of Players
            </label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {([2, 3, 4] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPlayerCount(count)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold transition ${
                    playerCount === count
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>{count} Players</span>
                </button>
              ))}
            </div>
          </div>

          {/* Player Names */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Player Names
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Array.from({ length: playerCount }).map((_, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-zinc-500">
                    P{idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={playerNames[idx] || ''}
                    onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                    placeholder={`Player ${idx + 1}`}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2 pl-9 pr-3 text-sm font-medium text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Target Score */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Target Score to Win
              </label>
              <span className="text-xs text-amber-400 font-medium">
                Standard: 100 points
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {[50, 100, 150, 200].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => {
                    setTargetScore(score);
                    setCustomTarget('');
                  }}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition ${
                    targetScore === score && !customTarget
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {score} pts
                </button>
              ))}
              <input
                type="text"
                inputMode="numeric"
                placeholder="Custom"
                value={customTarget}
                onChange={(e) => {
                  if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                    setCustomTarget(e.target.value);
                  }
                }}
                className={`w-24 rounded-xl border px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none ${
                  customTarget
                    ? 'border-amber-500 bg-zinc-950 text-amber-400'
                    : 'border-zinc-800 bg-zinc-950'
                }`}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-zinc-950 shadow-md transition hover:bg-amber-400 active:scale-95"
            >
              <Trophy className="h-4 w-4" />
              Create & Launch Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
