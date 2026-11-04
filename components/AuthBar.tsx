import React, { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Cloud, CloudOff, LogIn, LogOut, RefreshCw } from 'lucide-react';
import type { SyncStatus } from '@/lib/useCloudSync';

interface AuthBarProps {
  user: User | null;
  status: SyncStatus;
  errorMessage: string | null;
  onSignIn: () => void;
  onSignOut: () => Promise<boolean>;
  onRetry: () => void;
}

const barClass =
  'mb-4 flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between';

const buttonClass =
  'flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2 text-xs font-bold text-zinc-800 transition hover:bg-zinc-100 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700';

export const AuthBar: React.FC<AuthBarProps> = ({
  user,
  status,
  errorMessage,
  onSignIn,
  onSignOut,
  onRetry,
}) => {
  const [notice, setNotice] = useState<string | null>(null);

  if (status === 'checking') return null;

  if (status === 'unconfigured') {
    return (
      <div className={barClass}>
        <span className="flex items-center gap-2">
          <CloudOff className="h-4 w-4 shrink-0 text-zinc-400" />
          Local mode: matches are saved on this browser only.
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={barClass}>
        <span className="flex items-center gap-2">
          <CloudOff className="h-4 w-4 shrink-0 text-zinc-400" />
          Guest mode: matches are saved on this browser only.
        </span>
        <button type="button" onClick={onSignIn} className={buttonClass}>
          <LogIn className="h-4 w-4" />
          Sign in to sync
        </button>
      </div>
    );
  }

  const handleSignOut = async () => {
    setNotice(null);
    const done = await onSignOut();
    if (!done) {
      setNotice('Could not sync your latest matches, so you are still signed in. Check your connection and try again.');
    }
  };

  return (
    <div className={barClass}>
      <div className="min-w-0">
        <span className="flex items-center gap-2">
          <Cloud
            className={`h-4 w-4 shrink-0 ${status === 'error' ? 'text-red-500' : 'text-emerald-500'}`}
          />
          <span className="truncate font-semibold text-zinc-800 dark:text-zinc-100" title={user.email ?? ''}>
            {user.email}
          </span>
          <span className="shrink-0 text-zinc-500 dark:text-zinc-400">
            {status === 'syncing' ? 'Syncing…' : status === 'error' ? 'Sync failed' : 'Synced'}
          </span>
        </span>
        {status === 'error' && errorMessage && (
          <p className="mt-1 text-[11px] text-red-500 dark:text-red-400">{errorMessage}</p>
        )}
        {notice && <p className="mt-1 text-[11px] text-red-500 dark:text-red-400">{notice}</p>}
      </div>

      <div className="flex items-center gap-2">
        {status === 'error' && (
          <button type="button" onClick={onRetry} className={buttonClass}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        )}
        <button type="button" onClick={handleSignOut} className={buttonClass}>
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
};
