import React, { useState } from 'react';
import { GameSession, Player, Team } from '@/types';
import { Users, User, Plus, Trash2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface NewGameFormProps {
  onStartGame: (session: GameSession) => void;
  onCancel?: () => void;
  className?: string;
}

export const NewGameForm: React.FC<NewGameFormProps> = ({
  onStartGame,
  onCancel,
  className = '',
}) => {
  const [mode, setMode] = useState<'solo' | 'partner'>('partner'); // Default to Partner or Solo
  const [matchTitle, setMatchTitle] = useState('');

  // Solo mode state (2 to 6 players)
  const [soloPlayerCount, setSoloPlayerCount] = useState<number>(4);
  const [soloPlayerNames, setSoloPlayerNames] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
    'Player 5',
    'Player 6',
  ]);

  // Partner mode state (Exactly 2 teams, 2 players each)
  const [teamAName, setTeamAName] = useState('Team A');
  const [teamAPlayer1, setTeamAPlayer1] = useState('Player 1');
  const [teamAPlayer2, setTeamAPlayer2] = useState('Player 2');

  const [teamBName, setTeamBName] = useState('Team B');
  const [teamBPlayer1, setTeamBPlayer1] = useState('Player 3');
  const [teamBPlayer2, setTeamBPlayer2] = useState('Player 4');

  const [targetScore, setTargetScore] = useState<number>(100);
  const [customTarget, setCustomTarget] = useState<string>('');

  const handleSoloNameChange = (index: number, val: string) => {
    const updated = [...soloPlayerNames];
    updated[index] = val;
    setSoloPlayerNames(updated);
  };

  const handleAddSoloPlayer = () => {
    if (soloPlayerCount < 6) {
      setSoloPlayerCount((prev) => prev + 1);
    }
  };

  const handleRemoveSoloPlayer = (idxToRemove: number) => {
    if (soloPlayerCount > 2) {
      const updated = soloPlayerNames.filter((_, i) => i !== idxToRemove);
      updated.push(`Player ${updated.length + 1}`);
      setSoloPlayerNames(updated);
      setSoloPlayerCount((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTarget = customTarget ? parseInt(customTarget, 10) || 100 : targetScore;

    if (mode === 'partner') {
      const t1p1 = teamAPlayer1.trim() || 'Player 1';
      const t1p2 = teamAPlayer2.trim() || 'Player 2';
      const t2p1 = teamBPlayer1.trim() || 'Player 3';
      const t2p2 = teamBPlayer2.trim() || 'Player 4';

      const t1Name = teamAName.trim() || `${t1p1} & ${t1p2}`;
      const t2Name = teamBName.trim() || `${t2p1} & ${t2p2}`;

      const team1Id = `team-${Date.now()}-1`;
      const team2Id = `team-${Date.now()}-2`;

      const teamA: Team = {
        id: team1Id,
        name: t1Name,
        players: [t1p1, t1p2],
        totalScore: 0,
        roundScores: [],
      };

      const teamB: Team = {
        id: team2Id,
        name: t2Name,
        players: [t2p1, t2p2],
        totalScore: 0,
        roundScores: [],
      };

      // In partner mode, session.players stores the two teams as scoring entities
      const playersAsTeams: Player[] = [
        {
          id: team1Id,
          name: t1Name,
          totalScore: 0,
          roundScores: [],
        },
        {
          id: team2Id,
          name: t2Name,
          totalScore: 0,
          roundScores: [],
        },
      ];

      const newSession: GameSession = {
        id: `game-${Date.now()}`,
        title: matchTitle.trim() || `Doubles: ${t1Name} vs ${t2Name}`,
        date: new Date().toISOString().slice(0, 10),
        players: playersAsTeams,
        teams: [teamA, teamB],
        winnerId: null,
        loserId: null,
        status: 'active',
        targetScore: finalTarget,
        mode: 'partner',
        currentRound: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onStartGame(newSession);
    } else {
      // Solo Mode
      const selectedPlayers: Player[] = soloPlayerNames
        .slice(0, soloPlayerCount)
        .map((name, i) => ({
          id: `p-${Date.now()}-${i + 1}-${Math.random().toString(36).substring(2, 6)}`,
          name: name.trim() || `Player ${i + 1}`,
          totalScore: 0,
          roundScores: [],
        }));

      const newSession: GameSession = {
        id: `game-${Date.now()}`,
        title: matchTitle.trim() || `Dominoes Match (${soloPlayerCount} Players)`,
        date: new Date().toISOString().slice(0, 10),
        players: selectedPlayers,
        winnerId: null,
        loserId: null,
        status: 'active',
        targetScore: finalTarget,
        mode: 'solo',
        currentRound: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onStartGame(newSession);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Mode Selector: Partner vs Solo */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
          Select Game Mode
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode('partner')}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
              mode === 'partner'
                ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                mode === 'partner'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-black text-zinc-900 dark:text-white">
                  Partner Mode
                </span>
                <span className="rounded bg-amber-500/20 shrink-0 whitespace-nowrap px-1.5 py-0.5 text-[10px] font-extrabold text-amber-500">
                  2 vs 2
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Traditional domino doubles. Exactly 2 teams with 2 partners each. 1 team boards points per round, other gets 0.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('solo')}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
              mode === 'solo'
                ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                mode === 'solo'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-black text-zinc-900 dark:text-white">
                  Solo Mode
                </span>
                <span className="rounded bg-zinc-200 dark:bg-zinc-800 shrink-0 whitespace-nowrap px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                  2-6 Players
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Individual free-for-all scoring. Each player tracks accumulated round points independently.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Match Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Match Title (Optional)
        </label>
        <input
          type="text"
          value={matchTitle}
          onChange={(e) => setMatchTitle(e.target.value)}
          placeholder={
            mode === 'partner'
              ? 'e.g. Domino Doubles Championship, Table 1'
              : 'e.g. Friday Night Dominoes, Table 1'
          }
          className="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 sm:py-2.5 sm:text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
        />
      </div>

      {/* PARTNER MODE CONFIGURATION */}
      {mode === 'partner' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Team Rosters (2 Teams • 2 Partners Each)
            </label>
            <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-amber-500">2 vs 2 Doubles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team A */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-xs font-black text-zinc-950">
                  A
                </span>
                <input
                  type="text"
                  value={teamAName}
                  onChange={(e) => setTeamAName(e.target.value)}
                  placeholder="Team A Name"
                  className="w-full min-w-0 bg-transparent text-base font-black text-zinc-900 sm:text-sm dark:text-white placeholder-zinc-400 focus:outline-none border-b border-amber-500/30 pb-0.5"
                  required
                />
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Partner 1
                  </span>
                  <input
                    type="text"
                    value={teamAPlayer1}
                    onChange={(e) => setTeamAPlayer1(e.target.value)}
                    placeholder="Partner 1 Name"
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 sm:py-2 sm:text-sm focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Partner 2
                  </span>
                  <input
                    type="text"
                    value={teamAPlayer2}
                    onChange={(e) => setTeamAPlayer2(e.target.value)}
                    placeholder="Partner 2 Name"
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 sm:py-2 sm:text-sm focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500 text-xs font-black text-white">
                  B
                </span>
                <input
                  type="text"
                  value={teamBName}
                  onChange={(e) => setTeamBName(e.target.value)}
                  placeholder="Team B Name"
                  className="w-full min-w-0 bg-transparent text-base font-black text-zinc-900 sm:text-sm dark:text-white placeholder-zinc-400 focus:outline-none border-b border-blue-500/30 pb-0.5"
                  required
                />
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Partner 1
                  </span>
                  <input
                    type="text"
                    value={teamBPlayer1}
                    onChange={(e) => setTeamBPlayer1(e.target.value)}
                    placeholder="Partner 1 Name"
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 sm:py-2 sm:text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Partner 2
                  </span>
                  <input
                    type="text"
                    value={teamBPlayer2}
                    onChange={(e) => setTeamBPlayer2(e.target.value)}
                    placeholder="Partner 2 Name"
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 sm:py-2 sm:text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOLO MODE CONFIGURATION */}
      {mode === 'solo' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Number of Players ({soloPlayerCount} Players)
              </label>
              <span className="text-xs font-semibold text-amber-500">2 - 6 Players</span>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSoloPlayerCount(count)}
                  className={`flex flex-col items-center justify-center rounded-xl py-2.5 text-sm font-bold transition ${
                    soloPlayerCount === count
                      ? 'bg-amber-500 text-zinc-950 shadow-md ring-2 ring-amber-400'
                      : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
                  }`}
                >
                  <span>{count}</span>
                  <span className="text-[10px] font-normal opacity-80">Players</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Player Names
              </label>
              {soloPlayerCount < 6 && (
                <button
                  type="button"
                  onClick={handleAddSoloPlayer}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Player
                </button>
              )}
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {soloPlayerNames.slice(0, soloPlayerCount).map((name, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 px-3 py-2 transition focus-within:border-amber-500"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-500">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleSoloNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1} name`}
                    className="w-full min-w-0 bg-transparent text-base font-medium text-zinc-900 sm:text-sm dark:text-white placeholder-zinc-400 focus:outline-none"
                    required
                  />
                  {soloPlayerCount > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSoloPlayer(index)}
                      title="Remove player"
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Target Bust Score (100 Points) */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Target Bust Score (Standard: 100 Points)
          </label>
          <span className="text-xs text-zinc-400">First to reach loses</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 min-[380px]:grid-cols-4">
          {[50, 100, 150, 200].map((pts) => (
            <button
              key={pts}
              type="button"
              onClick={() => {
                setTargetScore(pts);
                setCustomTarget('');
              }}
              className={`min-h-11 rounded-xl py-2 text-xs font-bold transition ${
                targetScore === pts && !customTarget
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 ring-2 ring-amber-500'
                  : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
              }`}
            >
              {pts} pts
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold sm:w-auto text-zinc-950 shadow-md hover:bg-amber-400 transition active:scale-95"
        >
          <span>Start {mode === 'partner' ? 'Partner Match' : 'Solo Match'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
