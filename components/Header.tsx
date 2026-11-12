import React from 'react';
import { ZLogo } from './ZLogo';
import { useTheme } from '@/lib/theme';
import { Trophy, History, Users, BookOpen, Plus, Moon, Sun, type LucideIcon } from 'lucide-react';

type Tab = 'active' | 'new-game' | 'history' | 'leaderboard' | 'rules';

interface HeaderProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  onOpenNewGame: () => void;
  activeGameCount: number;
}

const NAV_ITEMS: { tab: Tab; label: string; title: string; Icon: LucideIcon; iconClass: string }[] = [
  { tab: 'active', label: 'Scoreboard', title: 'Live Scoreboard', Icon: Trophy, iconClass: 'text-amber-500' },
  { tab: 'history', label: 'History', title: 'Match History', Icon: History, iconClass: 'text-zinc-400' },
  { tab: 'leaderboard', label: 'Leaderboard', title: 'Player Standings', Icon: Users, iconClass: 'text-zinc-400' },
  { tab: 'rules', label: 'Rules', title: 'Rules Guide', Icon: BookOpen, iconClass: 'text-zinc-400' },
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewGame,
  activeGameCount,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3.5 py-2.5 sm:px-6 sm:py-3">
          {/* Brand / Logo + Tagline */}
          <button
            onClick={() => setCurrentTab('active')}
            className="flex min-w-0 items-center gap-2.5 text-left focus:outline-none"
          >
            <ZLogo size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate whitespace-nowrap text-base font-black tracking-tight text-zinc-900 dark:text-white sm:text-xl">
                  Z Record System
                </h1>
                <span className="hidden shrink-0 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 lg:inline-block">
                  Dominoes
                </span>
              </div>
              <p className="hidden text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:block">
                Never lose track of a point again.
              </p>
            </div>
          </button>

          {/* Navigation & Controls */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Tabs in the header from tablet width up; phones use the bottom bar */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map(({ tab, label, title, Icon, iconClass }) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  title={title}
                  className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-semibold transition-all ${
                    currentTab === tab
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-700'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${iconClass}`} />
                  <span>{label}</span>
                  {tab === 'active' && activeGameCount > 0 && (
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </nav>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 transition hover:text-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-amber-400"
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
              aria-label="New Game"
              className={`flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl px-2.5 text-sm font-bold shadow transition-all active:scale-95 sm:px-3 ${
                currentTab === 'new-game'
                  ? 'bg-zinc-950 text-white ring-2 ring-amber-500 dark:bg-white dark:text-zinc-950'
                  : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
              }`}
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Game</span>
            </button>
          </div>
        </div>
      </header>

      {/* Phone navigation: a bottom bar so every tab is reachable with one thumb */}
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {NAV_ITEMS.map(({ tab, label, Icon }) => {
            const active = currentTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition ${
                  active ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
                {tab === 'active' && activeGameCount > 0 && (
                  <span className="absolute right-[28%] top-2.5 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
