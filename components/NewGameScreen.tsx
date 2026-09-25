import React from 'react';
import { GameSession } from '@/types';
import { NewGameForm } from './NewGameForm';
import { Users, Sparkles } from 'lucide-react';

interface NewGameScreenProps {
  onStartGame: (session: GameSession) => void;
  onCancel?: () => void;
}

export const NewGameScreen: React.FC<NewGameScreenProps> = ({ onStartGame, onCancel }) => {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Header Banner */}
      <div className="mb-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950 shadow-md">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">
              Start New Dominoes Match
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Set up 2 to 6 players, configure the 100-bust target score, and start tracking immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <NewGameForm onStartGame={onStartGame} onCancel={onCancel} />
      </div>

      {/* Rules Notice */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-zinc-600 dark:text-zinc-300">
        <Sparkles className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <span className="font-bold text-zinc-900 dark:text-white">Z Record Rules:</span>{' '}
          Each round, players accumulate points from opponents&apos; remaining domino pips. The first player to reach or exceed 100 points takes the loss, and the player with the lowest score wins!
        </div>
      </div>
    </div>
  );
};
