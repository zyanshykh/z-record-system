import React, { useState } from 'react';
import { Player } from '@/types';
import { ScoreInput } from './ScoreInput';
import {
  Trophy,
  Flame,
  Skull,
  History,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Undo2,
} from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  rank: number;
  isLeader: boolean;
  isWinner: boolean;
  isLoser: boolean;
  targetScore: number;
  onAddScore: (playerId: string, score: number) => void;
  onUndoLastScore?: (playerId: string) => void;
  onEditRoundScore?: (playerId: string, roundIndex: number, newScore: number) => void;
  onDeleteRoundScore?: (playerId: string, roundIndex: number) => void;
  isGameOver?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  rank,
  isLeader,
  isWinner,
  isLoser,
  targetScore,
  onAddScore,
  onUndoLastScore,
  onEditRoundScore,
  onDeleteRoundScore,
  isGameOver = false,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);

  const progressPercent = Math.min(100, Math.round((player.totalScore / targetScore) * 100));
  const remainingUntilBust = Math.max(0, targetScore - player.totalScore);
  const roundScores = player.roundScores || [];
  const isCloseToBust = player.totalScore >= targetScore * 0.8 && !isLoser;

  const handleStartEdit = (idx: number, currentVal: number) => {
    setEditingIndex(idx);
    setEditingValue(String(currentVal));
    setEditError(null);
  };

  const handleSaveEdit = (idx: number) => {
    const val = Number(editingValue.trim());
    if (isNaN(val) || !Number.isInteger(val) || val <= 0) {
      setEditError('Must be a positive number (> 0)');
      return;
    }
    if (onEditRoundScore) {
      onEditRoundScore(player.id, idx, val);
    }
    setEditingIndex(null);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditError(null);
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all shadow-sm ${
        isWinner
          ? 'border-amber-500/70 bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-900 ring-2 ring-amber-500/40'
          : isLoser
          ? 'border-red-500/70 bg-gradient-to-b from-red-500/10 via-zinc-900 to-zinc-900 ring-2 ring-red-500/40'
          : isCloseToBust && !isGameOver
          ? 'border-amber-500/40 bg-zinc-900/90'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700/80'
      }`}
    >
      {/* Top Banner / Player Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isWinner
                  ? 'bg-amber-500 text-zinc-950 font-black'
                  : isLoser
                  ? 'bg-red-500 text-white font-black'
                  : rank === 1
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              #{rank}
            </span>
            <h3 className="truncate text-base font-extrabold text-white" title={player.name}>
              {player.name}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {isWinner && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-950 shadow">
                <Trophy className="h-3 w-3" /> Winner
              </span>
            )}
            {isLoser && (
              <span className="inline-flex items-center gap-1 rounded bg-red-500 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow">
                <Skull className="h-3 w-3" /> Loser ({targetScore}+)
              </span>
            )}
            {isLeader && !isWinner && !isLoser && !isGameOver && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/25">
                <Flame className="h-3 w-3" /> Best (Lowest)
              </span>
            )}
            {isCloseToBust && !isGameOver && (
              <span className="inline-flex items-center gap-1 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/25">
                <AlertTriangle className="h-3 w-3" /> Danger
              </span>
            )}
          </div>
        </div>

        {/* Current Total Score (Large, Bold) */}
        <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Accumulated Score
          </div>
          <div className="mt-1 flex items-baseline justify-center gap-1.5">
            <span
              className={`text-5xl font-black tracking-tight ${
                isLoser
                  ? 'text-red-400'
                  : isWinner
                  ? 'text-amber-400'
                  : 'text-white'
              }`}
            >
              {player.totalScore}
            </span>
            <span className="text-xs font-bold text-zinc-500">/ {targetScore}</span>
          </div>

          {/* Progress bar towards target 100 bust */}
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full transition-all duration-300 ${
                  isLoser
                    ? 'bg-red-500'
                    : progressPercent >= 80
                    ? 'bg-red-400'
                    : progressPercent >= 50
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-zinc-400">
              <span>{progressPercent}% towards bust</span>
              <span>
                {remainingUntilBust === 0 ? (
                  <span className="font-bold text-red-400">Busted ({targetScore}+ pts)</span>
                ) : (
                  `${remainingUntilBust} pts until bust`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Round Scores History List with Tap-to-Edit & Undo */}
        <div className="mt-4">
          <div className="flex items-center justify-between pb-1.5 text-xs font-semibold text-zinc-400">
            <span className="flex items-center gap-1">
              <History className="h-3.5 w-3.5 text-zinc-500" />
              Round History
            </span>

            {/* Undo Last Score button */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">
                {roundScores.length} {roundScores.length === 1 ? 'round' : 'rounds'}
              </span>

              {roundScores.length > 0 && onUndoLastScore && (
                <button
                  type="button"
                  onClick={() => onUndoLastScore(player.id)}
                  title="Undo most recent score entry"
                  className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-amber-400 transition hover:bg-zinc-700 hover:text-amber-300 active:scale-95"
                >
                  <Undo2 className="h-3 w-3" />
                  <span>Undo Last</span>
                </button>
              )}
            </div>
          </div>

          <div className="mb-1 text-[10px] text-zinc-500 italic">
            Tap any round below to edit or delete score:
          </div>

          {roundScores.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800/80 bg-zinc-950/30 py-3 text-center text-xs text-zinc-500">
              No scores logged yet
            </div>
          ) : (
            <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
              {roundScores.map((score, idx) => {
                const isEditing = editingIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer ${
                      isEditing
                        ? 'bg-zinc-800 border border-amber-500/50'
                        : 'bg-zinc-950/60 hover:bg-zinc-800/80 hover:border-zinc-700 border border-transparent'
                    }`}
                    onClick={() => {
                      if (!isEditing) {
                        handleStartEdit(idx, score);
                      }
                    }}
                  >
                    <span className="font-mono text-[11px] font-semibold text-zinc-400">
                      Round {idx + 1}:
                    </span>

                    {isEditing ? (
                      <div
                        className="flex flex-col items-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            autoFocus
                            value={editingValue}
                            onChange={(e) => {
                              if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                                setEditingValue(e.target.value);
                                setEditError(null);
                              }
                            }}
                            className="w-16 rounded border border-amber-500 bg-zinc-900 px-1.5 py-0.5 text-center font-mono text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(idx)}
                            className="rounded p-1 text-emerald-400 hover:bg-emerald-500/10"
                            title="Save changes"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                          {onDeleteRoundScore && (
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteRoundScore(player.id, idx);
                                setEditingIndex(null);
                              }}
                              className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                              title="Delete this round score"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="rounded p-1 text-zinc-400 hover:bg-zinc-700"
                            title="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {editError && (
                          <span className="text-[10px] text-red-400 font-medium">
                            {editError}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">
                          {score}
                        </span>

                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(idx, score);
                            }}
                            title="Edit score"
                            className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          {onDeleteRoundScore && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteRoundScore(player.id, idx);
                              }}
                              title="Delete round score"
                              className="rounded p-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Score Entry Input at Bottom */}
      <ScoreInput
        disabled={isGameOver}
        onAddScore={(score) => onAddScore(player.id, score)}
      />
    </div>
  );
};
