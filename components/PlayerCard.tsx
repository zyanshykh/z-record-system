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
  Users,
} from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  subtitle?: string | null; // e.g. Partner names "Carlos & Mateo"
  rank: number;
  isLeader: boolean;
  isWinner: boolean;
  isLoser: boolean;
  targetScore: number;
  onAddScore: (playerId: string, score: number) => void;
  onUndoLastScore?: (playerId: string) => void;
  onEditRoundScore?: (playerId: string, roundIndex: number) => void;
  isGameOver?: boolean;
  showScoreInput?: boolean; // When in partner mode, score is entered via PartnerScorePanel
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  subtitle,
  rank,
  isLeader,
  isWinner,
  isLoser,
  targetScore,
  onAddScore,
  onUndoLastScore,
  onEditRoundScore,
  isGameOver = false,
  showScoreInput = true,
}) => {
  const progressPercent = Math.min(100, Math.round((player.totalScore / targetScore) * 100));
  const remainingUntilBust = Math.max(0, targetScore - player.totalScore);
  const roundScores = player.roundScores || [];
  const isCloseToBust = player.totalScore >= targetScore * 0.8 && !isLoser;

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
            <div className="min-w-0">
              <h3 className="truncate text-base font-extrabold text-white" title={player.name}>
                {player.name}
              </h3>
              {subtitle && (
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 truncate">
                  <Users className="h-3 w-3 text-amber-500/80 shrink-0" />
                  <span>{subtitle}</span>
                </div>
              )}
            </div>
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

        {/* Round Scores History List with Tap-to-Edit */}
        <div className="mt-4">
          <div className="flex items-center justify-between pb-1.5 text-xs font-semibold text-zinc-400">
            <span className="flex items-center gap-1">
              <History className="h-3.5 w-3.5 text-zinc-500" />
              Round History
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">
                {roundScores.length} {roundScores.length === 1 ? 'round' : 'rounds'}
              </span>

              {showScoreInput && roundScores.length > 0 && onUndoLastScore && (
                <button
                  type="button"
                  onClick={() => onUndoLastScore(player.id)}
                  title="Undo most recent score entry"
                  className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-amber-400 transition hover:bg-zinc-700 hover:text-amber-300 active:scale-95"
                >
                  <Undo2 className="h-3 w-3" />
                  <span>Undo</span>
                </button>
              )}
            </div>
          </div>

          <div className="mb-1 text-[10px] text-zinc-500 italic">
            Tap any round below to edit or delete:
          </div>

          {roundScores.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800/80 bg-zinc-950/30 py-3 text-center text-xs text-zinc-500">
              No scores logged yet
            </div>
          ) : (
            <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
              {roundScores.map((score, idx) => (
                <div
                  key={idx}
                  onClick={() => onEditRoundScore && onEditRoundScore(player.id, idx)}
                  className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition cursor-pointer border ${
                    score === 0
                      ? 'bg-zinc-950/40 border-zinc-800/40 hover:border-amber-500/40 hover:bg-zinc-900'
                      : 'bg-zinc-950/70 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/80'
                  }`}
                  title={`Click to edit or delete Round ${idx + 1}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-semibold text-zinc-400">
                      Round {idx + 1}:
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        score === 0 ? 'text-zinc-500' : 'text-amber-400'
                      }`}
                    >
                      {score === 0 ? '0 (won hand)' : `+${score}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-zinc-500 group-hover:text-amber-400 transition-colors">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </span>
                    <Edit2 className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Solo Score Entry Control */}
      {showScoreInput && (
        <ScoreInput
          onAddScore={(score) => onAddScore(player.id, score)}
          disabled={isGameOver}
        />
      )}
    </div>
  );
};
