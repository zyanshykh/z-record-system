import React, { useState } from 'react';
import { GameSession, Player } from '@/types';
import { Users, Plus, Trash2, ArrowRight } from 'lucide-react';

interface NewGameFormProps {
  onStartGame: (session: GameSession) => void;
  onCancel?: () => void;
  className?: string;
}

export const NewGameForm: React.FC<NewGameFormProps> = ({
  onStartGame,
  onCancel,
  className = '',
}) => {
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
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Match Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Match Title (Optional)
        </label>
        <input
          type="text"
          value={matchTitle}
          onChange={(e) => setMatchTitle(e.target.value)}
          placeholder="e.g. Saturday Night Dominoes, Table 1"
          className="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
        />
      </div>

      {/* Player Count Selector: 2 to 6 Players */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Number of Players / Teams ({playerCount} Players)
          </label>
          <span className="text-xs font-semibold text-amber-500">2 - 6 Players</span>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {[2, 3, 4, 5, 6].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => handleSetPlayerCount(count)}
              className={`flex flex-col items-center justify-center rounded-xl py-2.5 text-sm font-bold transition ${
                playerCount === count
                  ? 'bg-amber-500 text-zinc-950 shadow-md ring-2 ring-amber-400'
                  : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
              }`}
            >
              <span>{count}</span>
              <span className="text-[10px] font-normal opacity-80">Players</span>
            </button>
          ))}
        </div>
      </div>

      {/* Players Input List */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Player Names
          </label>
          {playerCount < 6 && (
            <button
              type="button"
              onClick={handleAddPlayer}
              className="flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Player
            </button>
          )}
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {playerNames.slice(0, playerCount).map((name, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 px-3 py-2 transition focus-within:border-amber-500"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-500">
                {index + 1}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1} name`}
                className="w-full bg-transparent text-sm font-medium text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
                required
              />
              {playerCount > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(index)}
                  title="Remove player"
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Target Bust Score */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Target Bust Score (Standard: 100 Points)
          </label>
          <span className="text-xs text-zinc-400">First to reach loses</span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[50, 100, 150, 200].map((pts) => (
            <button
              key={pts}
              type="button"
              onClick={() => {
                setTargetScore(pts);
                setCustomTarget('');
              }}
              className={`rounded-xl py-2 text-xs font-bold transition ${
                targetScore === pts && !customTarget
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 ring-2 ring-amber-500'
                  : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
              }`}
            >
              {pts} pts
            </button>
          ))}
        </div>
      </div>

      {/* Actions: Start Game & Cancel */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-zinc-950 shadow-md hover:bg-amber-400 transition active:scale-95"
        >
          <span>Start Game</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
