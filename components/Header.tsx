import React from 'react';
import { ZLogo } from './ZLogo';
import { useTheme } from '@/lib/theme';
import {
  Trophy,
  History,
  Users,
  BookOpen,
  Plus,
  Moon,
  Sun,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'active' | 'new-game' | 'history' | 'leaderboard' | 'rules';
  setCurrentTab: (tab: 'active' | 'new-game' | 'history' | 'leaderboard' | 'rules') => void;
  onOpenNewGame: () => void;
  activeGameCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewGame,
  activeGameCount,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3">
        {/* Brand / Logo + Tagline */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setCurrentTab('active')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <ZLogo size="md" />

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base font-black tracking-tight text-zinc-900 dark:text-white sm:text-xl">
                  Z Record System
                </h1>
                <span className="hidden rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-amber-500/20 xs:inline-block">
                  Dominoes
                </span>
              </div>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 sm:text-xs">
                Never lose track of a point again.
              </p>
            </div>
          </button>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('active')}
              title="Live Scoreboard"
              className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'active'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline">Scoreboard</span>
              {activeGameCount > 0 && (
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              title="Match History"
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'history'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <History className="h-4 w-4 text-zinc-400" />
              <span>History</span>
            </button>

            <button
              onClick={() => setCurrentTab('leaderboard')}
              title="Player Standings"
              className={`hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'leaderboard'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Users className="h-4 w-4 text-zinc-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('rules')}
              title="Rules Guide"
              className={`hidden md:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'rules'
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <BookOpen className="h-4 w-4 text-zinc-400" />
              <span>Rules</span>
            </button>
          </nav>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            type="button"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-2 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700" />
            )}
          </button>

          {/* New Game Button */}
          <button
            onClick={onOpenNewGame}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold shadow transition-all active:scale-95 ${
              currentTab === 'new-game'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 ring-2 ring-amber-500'
                : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
            }`}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden xs:inline">New Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
