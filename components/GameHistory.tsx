import React, { useState } from 'react';
import { GameSession } from '@/types';
import { MatchDetailsModal } from './MatchDetailsModal';
import {
  Trophy,
  Skull,
  Calendar,
  Layers,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  User,
  Plus,
  Eye,
} from 'lucide-react';
import { exportBackupJSON, importBackupJSON } from '@/lib/storage';

interface GameHistoryProps {
  sessions: GameSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onStartNewGame: () => void;
  onReload: () => void;
}

export const GameHistory: React.FC<GameHistoryProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onStartNewGame,
  onReload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // Selected session for viewing full rounds details
  const [inspectingSession, setInspectingSession] = useState<GameSession | null>(null);

  // Sort sessions MOST RECENT FIRST by createdAt or date or updatedAt
  const sortedSessions = [...sessions].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.date).getTime();
    const timeB = new Date(b.createdAt || b.date).getTime();
    return timeB - timeA;
  });

  const filtered = sortedSessions.filter((s) => {
    const matchesStatus =
      statusFilter === 'all' || s.status === statusFilter;
    const matchesSearch =
      (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.players.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleExport = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `z-record-dominoes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const success = importBackupJSON(importJsonText);
    if (success) {
      setImportMessage('Data successfully imported!');
      setTimeout(() => {
        setShowImportDialog(false);
        setImportMessage(null);
        setImportJsonText('');
        onReload();
      }, 1000);
    } else {
      setImportMessage('Invalid JSON backup file. Please check format.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search matches or player names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({sessions.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                statusFilter === 'completed'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`rounded-lg px-3 py-1 font-medium transition ${
                statusFilter === 'active'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Active
            </button>
          </div>
        </div>

        {/* Export / Import & New Game Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            title="Download JSON backup"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowImportDialog(true)}
            title="Import JSON backup"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={onStartNewGame}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            New Match
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Import Session Backup</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Paste JSON content exported from Z Record System to restore your games.
            </p>
            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON here..."
              className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs font-mono text-zinc-200 focus:border-amber-500 focus:outline-none"
            />
            {importMessage && (
              <p
                className={`mt-2 text-xs font-semibold ${
                  importMessage.includes('success') ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {importMessage}
              </p>
            )}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportMessage(null);
                }}
                className="rounded-xl border border-zinc-700 px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Grid (Most Recent First) */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <p className="text-sm text-zinc-400">No matches found matching your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((item) => {
            const isCurrentlyActiveScoreboard = activeSessionId === item.id;
            const winner = item.players.find((p) => p.id === item.winnerId);
            const loser = item.players.find((p) => p.id === item.loserId);
            const roundsPlayed = Math.max(
              0,
              ...item.players.map((p) => p.roundScores?.length || 0)
            );

            // Sort players ascending by final score
            const sortedPlayers = [...item.players].sort((a, b) => a.totalScore - b.totalScore);

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-3xl border p-5 transition-all ${
                  isCurrentlyActiveScoreboard
                    ? 'border-amber-500/50 bg-zinc-900/80 shadow-md ring-1 ring-amber-500/20'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          item.status === 'completed'
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {item.status === 'completed' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-zinc-400" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 text-emerald-400 animate-pulse" />
                            Active
                          </>
                        )}
                      </span>

                      {isCurrentlyActiveScoreboard && (
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                          Current Board
                        </span>
                      )}
                    </div>

                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-white">
                    {item.title || 'Dominoes Session'}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                    <span>Target: {item.targetScore || 100} pts</span>
                    <span>•</span>
                    <span>{roundsPlayed} Rounds</span>
                    <span>•</span>
                    <span>{item.players.length} Players</span>
                  </div>

                  {/* Winner and Loser display */}
                  <div className="mt-3 space-y-1.5">
                    {winner && (
                      <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>
                            Winner: <strong className="text-white">{winner.name}</strong>
                          </span>
                        </div>
                        <span className="font-mono font-bold text-amber-400 shrink-0">
                          {winner.totalScore} pts (lowest)
                        </span>
                      </div>
                    )}
                    {loser && (
                      <div className="flex items-center justify-between rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <Skull className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          <span>
                            Bust Loser: <strong className="text-white">{loser.name}</strong>
                          </span>
                        </div>
                        <span className="font-mono font-bold text-red-400 shrink-0">
                          {loser.totalScore} pts ({item.targetScore || 100}+)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Players Score Summary (sorted by score) */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {sortedPlayers.map((p, idx) => (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 ${
                          p.id === item.winnerId
                            ? 'bg-amber-500/10 border border-amber-500/20'
                            : p.id === item.loserId
                            ? 'bg-red-500/10 border border-red-500/20'
                            : 'bg-zinc-950/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate max-w-[110px]">
                          <span className="text-[10px] font-bold text-zinc-500">
                            #{idx + 1}
                          </span>
                          <span className="truncate text-zinc-300 font-medium">
                            {p.name}
                          </span>
                        </div>
                        <span
                          className={`font-mono font-bold ${
                            p.id === item.winnerId
                              ? 'text-amber-400'
                              : p.id === item.loserId
                              ? 'text-red-400'
                              : 'text-zinc-300'
                          }`}
                        >
                          {p.totalScore} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                  <button
                    onClick={() => {
                      if (confirm('Delete this game from history?')) {
                        onDeleteSession(item.id);
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* View Full Rounds Details */}
                    <button
                      onClick={() => setInspectingSession(item)}
                      className="flex items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View All Rounds</span>
                    </button>

                    <button
                      onClick={() => onSelectSession(item.id)}
                      className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Match Full Details Modal */}
      {inspectingSession && (
        <MatchDetailsModal
          session={inspectingSession}
          isOpen={!!inspectingSession}
          onClose={() => setInspectingSession(null)}
          onOpenInScoreboard={onSelectSession}
        />
      )}
    </div>
  );
};
