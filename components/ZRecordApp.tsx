'use client';

import React, { useState, useEffect } from 'react';
import { GameSession } from '@/types';
import {
  getStoredSessions,
  getActiveSessionId,
  setActiveSessionId,
  saveSingleSession,
  deleteSessionById,
  resetToDefaults,
} from '@/lib/storage';
import { ThemeProvider } from '@/lib/theme';
import { Header } from '@/components/Header';
import { ActiveGame } from '@/components/ActiveGame';
import { NewGameScreen } from '@/components/NewGameScreen';
import { GameHistory } from '@/components/GameHistory';
import { Leaderboard } from '@/components/Leaderboard';
import { DominoRuleGuide } from '@/components/DominoRuleGuide';
import { RotateCcw } from 'lucide-react';

interface ZRecordAppProps {
  initialTab?: 'active' | 'new-game' | 'history' | 'leaderboard' | 'rules';
}

export function ZRecordApp({ initialTab = 'active' }: ZRecordAppProps) {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [activeSessionId, setActiveId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<
    'active' | 'new-game' | 'history' | 'leaderboard' | 'rules'
  >(initialTab);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with browser URL /history or hash if accessible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/history')) {
        setCurrentTab('history');
      }
    }
  }, []);

  // Load initial data on mount (client-side safe)
  useEffect(() => {
    const loadedSessions = getStoredSessions();
    setSessions(loadedSessions);
    const activeId = getActiveSessionId();
    setActiveId(activeId);
    setIsLoaded(true);
  }, []);

  // Update session and persist to localStorage immediately
  const handleUpdateSession = (updatedSession: GameSession) => {
    saveSingleSession(updatedSession);
    const refreshed = getStoredSessions();
    setSessions(refreshed);
    setActiveId(updatedSession.id);
    setActiveSessionId(updatedSession.id);
  };

  // Create new session from 2-6 players screen and start game immediately
  const handleCreateGame = (newSession: GameSession) => {
    saveSingleSession(newSession);
    setActiveSessionId(newSession.id);
    setActiveId(newSession.id);
    setSessions(getStoredSessions());
    setCurrentTab('active');
  };

  const handleDeleteSession = (id: string) => {
    deleteSessionById(id);
    const updated = getStoredSessions();
    setSessions(updated);
    if (activeSessionId === id) {
      const remainingActive = updated.find((s) => s.status === 'active') || updated[0];
      const nextId = remainingActive ? remainingActive.id : null;
      setActiveId(nextId);
      setActiveSessionId(nextId);
    }
  };

  const handleSelectSession = (id: string) => {
    setActiveId(id);
    setActiveSessionId(id);
    setCurrentTab('active');
  };

  const handleResetData = () => {
    if (confirm('Reset all match data to default sample games?')) {
      resetToDefaults();
      const resetSessions = getStoredSessions();
      setSessions(resetSessions);
      setActiveId('game-demo-2');
      setActiveSessionId('game-demo-2');
    }
  };

  // Find active session object
  const activeSession =
    sessions.find((s) => s.id === activeSessionId) ||
    sessions.find((s) => s.status === 'active') ||
    sessions[0] ||
    null;

  const activeCount = sessions.filter((s) => s.status === 'active').length;

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-amber-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Loading Z Record System...
          </span>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        {/* Header */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenNewGame={() => setCurrentTab('new-game')}
          activeGameCount={activeCount}
        />

        {/* Main Content Area */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-8">
          {currentTab === 'new-game' && (
            <NewGameScreen
              onStartGame={handleCreateGame}
              onCancel={activeSession ? () => setCurrentTab('active') : undefined}
            />
          )}

          {currentTab === 'active' && (
            <ActiveGame
              session={activeSession}
              onUpdateSession={handleUpdateSession}
              onStartNewGame={() => setCurrentTab('new-game')}
              onViewHistory={() => setCurrentTab('history')}
            />
          )}

          {currentTab === 'history' && (
            <GameHistory
              sessions={sessions}
              activeSessionId={activeSession?.id || null}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
              onStartNewGame={() => setCurrentTab('new-game')}
              onReload={() => setSessions(getStoredSessions())}
            />
          )}

          {currentTab === 'leaderboard' && <Leaderboard sessions={sessions} />}

          {currentTab === 'rules' && <DominoRuleGuide />}

          {/* Global Persistence Status & Reset Action */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-900 pt-6 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                Z Record System
              </span>
              <span>•</span>
              <button
                onClick={handleResetData}
                className="flex items-center gap-1 text-zinc-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 transition"
                title="Reset to default sample domino games"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Demo Data
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                Local Storage Persistence Active (Vercel Ready)
              </span>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
