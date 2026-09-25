import React, { useState } from 'react';
import { GameSession, Player, Team } from '@/types';
import { Plus, Users, AlertCircle, ArrowRight, ShieldCheck, Flame, Skull, Trophy, Undo2 } from 'lucide-react';
import { addPartnerRoundScore, undoLastRound } from '@/lib/game';

interface PartnerScorePanelProps {
  session: GameSession;
  onUpdateSession: (updated: GameSession) => void;
  disabled?: boolean;
}

export const PartnerScorePanel: React.FC<PartnerScorePanelProps> = ({
  session,
  onUpdateSession,
  disabled = false,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    session.players[0]?.id || ''
  );
  const [pointsValue, setPointsValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fallback to first team if selectedTeamId not found
  const activeSelectedId =
    session.players.some((p) => p.id === selectedTeamId)
      ? selectedTeamId
      : session.players[0]?.id || '';

  const selectedTeam = session.players.find((p) => p.id === activeSelectedId);
  const otherTeam = session.players.find((p) => p.id !== activeSelectedId);

  const nextRoundNumber =
    Math.max(
      0,
      ...(session.players.map((p) => p.roundScores?.length || 0))
    ) + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = pointsValue.trim();

    if (!trimmed) {
      setError('Please enter points boarded this hand');
      return;
    }

    const num = Number(trimmed);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
      setError('Points must be a positive whole number (> 0)');
      return;
    }

    setError(null);
    const updated = addPartnerRoundScore(session, activeSelectedId, num);
    onUpdateSession(updated);
    setPointsValue('');
  };

  const handleQuickAdd = (pips: number) => {
    setError(null);
    const updated = addPartnerRoundScore(session, activeSelectedId, pips);
    onUpdateSession(updated);
    setPointsValue('');
  };

  const handleUndoLast = () => {
    const updated = undoLastRound(session);
    onUpdateSession(updated);
  };

  return (
    <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-900 p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-black shadow">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                Round {nextRoundNumber} Score Entry
              </h3>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-400 border border-amber-500/30">
                Partner Mode (2 vs 2)
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Select which team boarded points this hand. The other team automatically gets 0 for this round.
            </p>
          </div>
        </div>

        {nextRoundNumber > 1 && (
          <button
            type="button"
            onClick={handleUndoLast}
            disabled={disabled}
            className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-zinc-700 hover:text-amber-300 transition active:scale-95 disabled:opacity-40"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Undo Round {nextRoundNumber - 1}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Step 1: Pick the Boarding Team */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            1. Which Team Boarded Points (Losing Side of Hand)?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {session.players.map((team, idx) => {
              const isSelected = team.id === activeSelectedId;
              const metaTeam = session.teams?.find((t) => t.id === team.id);
              const partnerNames = metaTeam?.players
                ? `${metaTeam.players[0]} & ${metaTeam.players[1]}`
                : null;

              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => {
                    setSelectedTeamId(team.id);
                    if (error) setError(null);
                  }}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/20 ring-2 ring-amber-500/50 shadow-md'
                      : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                        idx === 0
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {idx === 0 ? 'A' : 'B'}
                    </span>
                    <div>
                      <div className="text-sm font-black text-white">
                        {team.name}
                      </div>
                      {partnerNames && (
                        <div className="text-xs text-zinc-400">
                          {partnerNames}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-zinc-500 uppercase">
                      Current
                    </div>
                    <div className="font-mono text-base font-black text-amber-400">
                      {team.totalScore} pts
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Enter Boarded Points */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
              2. Enter Points for{' '}
              <span className="text-amber-400 font-extrabold">
                {selectedTeam?.name || 'Selected Team'}
              </span>
            </label>
            <span className="text-[11px] text-zinc-400 font-medium">
              {otherTeam?.name || 'Other Team'} will auto-score{' '}
              <strong className="text-emerald-400">0 pts</strong>
            </span>
          </div>

          {/* Quick Pip Buttons */}
          <div className="mb-2 flex items-center gap-1.5 text-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Quick:
            </span>
            {[10, 15, 20, 25, 30, 40].map((pts) => (
              <button
                key={pts}
                type="button"
                disabled={disabled}
                onClick={() => handleQuickAdd(pts)}
                className="rounded-lg bg-zinc-800 px-2 py-1 font-mono text-xs font-bold text-zinc-300 transition hover:bg-zinc-700 hover:text-amber-400 active:scale-95 disabled:opacity-40"
              >
                +{pts}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={`Points caught (e.g. 29)`}
                disabled={disabled}
                value={pointsValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d+$/.test(val)) {
                    setPointsValue(val);
                    if (error) setError(null);
                  }
                }}
                className={`w-full rounded-2xl border bg-zinc-950 px-4 py-3 text-base font-bold text-white placeholder-zinc-500 focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-zinc-700 focus:border-amber-500 focus:ring-amber-500/50'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={disabled || !pointsValue.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black text-zinc-950 shadow-md hover:bg-amber-400 transition active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Record Round Score</span>
            </button>
          </div>

          {error && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
