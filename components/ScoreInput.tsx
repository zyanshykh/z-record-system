import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

interface ScoreInputProps {
  onAddScore: (score: number) => void;
  disabled?: boolean;
}

export const ScoreInput: React.FC<ScoreInputProps> = ({ onAddScore, disabled = false }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();

    // Validation: prevent adding empty/invalid scores
    if (!trimmed) {
      setError('Please enter a score');
      return;
    }

    const num = Number(trimmed);

    // Validation: must be a valid positive integer > 0
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
      setError('Score must be a positive number (> 0)');
      return;
    }

    setError(null);
    onAddScore(num);
    setValue('');
  };

  const handleQuickAdd = (pips: number) => {
    setError(null);
    onAddScore(pips);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow whole positive digits
    if (val === '' || /^\d+$/.test(val)) {
      setValue(val);
      if (error) setError(null);
    }
  };

  return (
    <div className="mt-4 border-t border-zinc-800/80 pt-3">
      {/* Quick Pip Buttons */}
      <div className="mb-2 flex items-center justify-between gap-1 text-[11px]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Quick:
        </span>
        <div className="flex gap-1">
          {[5, 10, 20, 30].map((pts) => (
            <button
              key={pts}
              type="button"
              disabled={disabled}
              onClick={() => handleQuickAdd(pts)}
              className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              +{pts}
            </button>
          ))}
        </div>
      </div>

      {/* Main Score Input & Button */}
      <form onSubmit={handleSubmit} className="space-y-1">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Score (e.g. 25)"
              disabled={disabled}
              value={value}
              onChange={handleInputChange}
              className={`w-full rounded-xl border bg-zinc-950 px-3 py-2 text-sm font-semibold text-white placeholder-zinc-500 transition focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-700 focus:border-amber-500 focus:ring-amber-500'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="flex items-center gap-1 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-zinc-950 shadow transition hover:bg-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Add Score</span>
          </button>
        </div>

        {/* Validation Error Message */}
        {error && (
          <p className="flex items-center gap-1 text-[11px] font-medium text-red-400">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </form>
    </div>
  );
};
