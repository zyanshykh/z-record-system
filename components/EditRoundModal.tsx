import React, { useState, useEffect } from 'react';
import { GameSession, Player } from '@/types';
import { X, Check, Trash2, AlertTriangle, Users, User, ArrowRightLeft } from 'lucide-react';

interface EditRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: GameSession;
  roundIndex: number;
  initialPlayerId?: string; // player clicked
  onSaveRound: (session: GameSession) => void;
  onDeleteRound: (session: GameSession) => void;
}

export const EditRoundModal: React.FC<EditRoundModalProps> = ({
  isOpen,
  onClose,
  session,
  roundIndex,
  initialPlayerId,
  onSaveRound,
  onDeleteRound,
}) => {
  const isPartner = session.mode === 'partner';
  const roundNumber = roundIndex + 1;

  // Partner mode states
  const [partnerBoardingTeamId, setPartnerBoardingTeamId] = useState<string>(
    session.players[0]?.id || ''
  );
  const [partnerScoreInput, setPartnerScoreInput] = useState<string>('');

  // Solo mode states: mapping of playerId -> score string
  const [soloScores, setSoloScores] = useState<Record<string, string>>({});
  const [activeSoloPlayerId, setActiveSoloPlayerId] = useState<string>(
    initialPlayerId || session.players[0]?.id || ''
  );

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state when modal opens or roundIndex changes
  useEffect(() => {
    if (!isOpen) {
      setConfirmDelete(false);
      setError(null);
      return;
    }

    setConfirmDelete(false);
    setError(null);

    if (isPartner) {
      // Find which team had > 0 in this round
      const teamA = session.players[0];
      const teamB = session.players[1];
      const scoreA = teamA?.roundScores?.[roundIndex] || 0;
      const scoreB = teamB?.roundScores?.[roundIndex] || 0;

      if (scoreA > 0) {
        setPartnerBoardingTeamId(teamA.id);
        setPartnerScoreInput(String(scoreA));
      } else if (scoreB > 0) {
        setPartnerBoardingTeamId(teamB.id);
        setPartnerScoreInput(String(scoreB));
      } else {
        // If both were 0 or tie
        const initial = initialPlayerId || teamA?.id || '';
        setPartnerBoardingTeamId(initial);
        const currentScore = session.players.find((p) => p.id === initial)?.roundScores?.[roundIndex] || 0;
        setPartnerScoreInput(String(currentScore));
      }
    } else {
      // Solo mode: load current round values for all players
      const map: Record<string, string> = {};
      session.players.forEach((p) => {
        const val = p.roundScores?.[roundIndex];
        map[p.id] = val !== undefined ? String(val) : '';
      });
      setSoloScores(map);
      if (initialPlayerId) {
        setActiveSoloPlayerId(initialPlayerId);
      }
    }
  }, [isOpen, roundIndex, session, isPartner, initialPlayerId]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (isPartner) {
      const trimmed = partnerScoreInput.trim();
      const num = Number(trimmed);

      if (trimmed === '' || isNaN(num) || !Number.isInteger(num) || num <= 0) {
        setError('Please enter a positive whole number (> 0) for the boarded points');
        return;
      }

      // Update both teams in sync: boarding team gets num, other team gets 0
      const updatedPlayers = session.players.map((team) => {
        const newRounds = [...(team.roundScores || [])];
        const isBoarding = team.id === partnerBoardingTeamId;
        newRounds[roundIndex] = isBoarding ? num : 0;
        return {
          ...team,
          roundScores: newRounds,
          totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
        };
      });

      // Recalculate target outcome
      const outcome = recalculateOutcome(session, updatedPlayers);
      onSaveRound(outcome);
      onClose();
    } else {
      // Solo mode: validate active edited player or all players
      const targetValStr = soloScores[activeSoloPlayerId];
      if (targetValStr === undefined || targetValStr.trim() === '') {
        setError('Please enter a valid round score');
        return;
      }

      const num = Number(targetValStr.trim());
      if (isNaN(num) || !Number.isInteger(num) || num < 0) {
        setError('Score must be a positive number or 0');
        return;
      }

      const updatedPlayers = session.players.map((player) => {
        const newRounds = [...(player.roundScores || [])];
        const valStr = soloScores[player.id];
        if (valStr !== undefined && valStr.trim() !== '') {
          const valNum = Number(valStr.trim());
          if (!isNaN(valNum) && Number.isInteger(valNum) && valNum >= 0) {
            newRounds[roundIndex] = valNum;
          }
        }
        return {
          ...player,
          roundScores: newRounds,
          totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
        };
      });

      const outcome = recalculateOutcome(session, updatedPlayers);
      onSaveRound(outcome);
      onClose();
    }
  };

  const handleDelete = () => {
    // Delete this round from all players / teams together
    const updatedPlayers = session.players.map((player) => {
      const newRounds = [...(player.roundScores || [])];
      if (roundIndex >= 0 && roundIndex < newRounds.length) {
        newRounds.splice(roundIndex, 1);
      }
      return {
        ...player,
        roundScores: newRounds,
        totalScore: newRounds.reduce((sum, n) => sum + (Number(n) || 0), 0),
      };
    });

    const outcome = recalculateOutcome(session, updatedPlayers);
    onDeleteRound(outcome);
    onClose();
  };

  function recalculateOutcome(originalSession: GameSession, players: Player[]): GameSession {
    const target = originalSession.targetScore || 100;
    const sortedAscending = [...players].sort((a, b) => a.totalScore - b.totalScore);
    const busted = players.filter((p) => p.totalScore >= target);

    if (busted.length > 0) {
      const sortedDesc = [...busted].sort((a, b) => b.totalScore - a.totalScore);
      const loser = sortedDesc[0];
      const nonLosers = players.filter((p) => p.id !== loser.id);
      const sortedNonLosers = [...nonLosers].sort((a, b) => a.totalScore - b.totalScore);
      const winner = sortedNonLosers[0] || sortedAscending[0];

      return {
        ...originalSession,
        players,
        winnerId: winner ? winner.id : null,
        loserId: loser ? loser.id : null,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };
    }

    // Still in progress or dropped back below 100
    const leader = sortedAscending[0];
    const danger = sortedAscending[sortedAscending.length - 1];

    return {
      ...originalSession,
      players,
      winnerId: leader ? leader.id : null,
      loserId: danger && danger.id !== leader?.id ? danger.id : null,
      status: 'active',
      updatedAt: new Date().toISOString(),
    };
  }

  const activeSoloPlayer = session.players.find((p) => p.id === activeSoloPlayerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-xs font-bold text-amber-400 border border-amber-500/30">
                Round {roundNumber}
              </span>
              <span className="text-xs text-zinc-400">
                {isPartner ? 'Partner Doubles (2 vs 2)' : 'Solo Play'}
              </span>
            </div>
            <h3 className="mt-1 text-lg font-black text-white">
              Edit Round {roundNumber} Score
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="mt-5 space-y-5">
          {isPartner ? (
            /* PARTNER MODE EDIT */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Which team boarded points in Round {roundNumber}?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {session.players.map((team, idx) => {
                    const isSelected = team.id === partnerBoardingTeamId;
                    const metaTeam = session.teams?.find((t) => t.id === team.id);
                    const partnerText = metaTeam?.players
                      ? `${metaTeam.players[0]} & ${metaTeam.players[1]}`
                      : null;

                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => {
                          setPartnerBoardingTeamId(team.id);
                          if (error) setError(null);
                        }}
                        className={`flex flex-col rounded-2xl border p-3.5 text-left transition ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/40 shadow'
                            : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black ${
                              idx === 0 ? 'bg-amber-500 text-zinc-950' : 'bg-blue-500 text-white'
                            }`}
                          >
                            {idx === 0 ? 'A' : 'B'}
                          </span>
                          <span className="text-sm font-black text-white truncate">
                            {team.name}
                          </span>
                        </div>
                        {partnerText && (
                          <span className="mt-1 text-[11px] text-zinc-400 truncate">
                            {partnerText}
                          </span>
                        )}
                        <span
                          className={`mt-2 font-mono text-xs font-bold ${
                            isSelected ? 'text-amber-400' : 'text-zinc-500'
                          }`}
                        >
                          {isSelected ? 'Gets Boarded Points' : 'Auto 0 points'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Points Boarded for Round {roundNumber}
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    Opposing team will be set to <strong className="text-emerald-400">0 pts</strong>
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={partnerScoreInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      setPartnerScoreInput(val);
                      if (error) setError(null);
                    }
                  }}
                  placeholder="Points (e.g. 29)"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-base font-bold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          ) : (
            /* SOLO MODE EDIT */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Select Player to Edit for Round {roundNumber}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {session.players.map((player) => {
                    const isSelected = player.id === activeSoloPlayerId;
                    return (
                      <button
                        key={player.id}
                        type="button"
                        onClick={() => {
                          setActiveSoloPlayerId(player.id);
                          if (error) setError(null);
                        }}
                        className={`rounded-xl border p-2.5 text-left transition ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/40'
                            : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-white truncate">
                          {player.name}
                        </div>
                        <div className="mt-1 font-mono text-xs text-amber-400 font-bold">
                          Current: +{player.roundScores?.[roundIndex] ?? 0}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Round {roundNumber} Score for{' '}
                  <span className="text-amber-400 font-bold">
                    {activeSoloPlayer?.name || 'Selected Player'}
                  </span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={soloScores[activeSoloPlayerId] ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      setSoloScores((prev) => ({ ...prev, [activeSoloPlayerId]: val }));
                      if (error) setError(null);
                    }
                  }}
                  placeholder="Enter round score"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-base font-bold text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {/* Delete Confirmation Step */}
          {confirmDelete ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  Are you sure you want to delete Round {roundNumber}?
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                {isPartner
                  ? 'This will delete Round ' + roundNumber + ' for BOTH teams, keeping team histories in sync.'
                  : 'This will remove Round ' + roundNumber + ' and recalculate all totals.'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition"
                >
                  Yes, Delete Round {roundNumber}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 transition"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Round {roundNumber}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 shadow transition"
                >
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
