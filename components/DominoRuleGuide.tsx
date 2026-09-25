import React, { useState } from 'react';
import { BookOpen, Calculator, Sparkles, HelpCircle, Check } from 'lucide-react';

export const DominoRuleGuide: React.FC = () => {
  // Quick Pip count calculator tool for end of hand
  const [pipInputs, setPipInputs] = useState<Record<number, number>>({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
  });

  const updatePip = (val: number, delta: number) => {
    setPipInputs((prev) => ({
      ...prev,
      [val]: Math.max(0, (prev[val] || 0) + delta),
    }));
  };

  const totalCalculated = Object.entries(pipInputs).reduce(
    (acc, [val, count]) => acc + Number(val) * count,
    0
  );

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Dominoes Rules & Scoring Guide</h2>
            <p className="text-xs text-zinc-400">
              Standard Double-Six scoring rules, special condition bonuses, and end-of-hand calculator.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Breakdown & Hand Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 0: Z Record System Core Rule */}
          <div className="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/10 via-zinc-900 to-amber-500/10 p-5 shadow-sm">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white">
                ★
              </span>
              Z Record System Core Rule (100-Bust & Lowest-Score Win)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              In this domino accumulation format:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-zinc-300 list-disc list-inside">
              <li>
                Whichever player or team reaches or crosses <strong>100 points FIRST is marked as the LOSER</strong>.
              </li>
              <li>
                The match <strong>ends immediately</strong> as soon as the losing threshold is crossed.
              </li>
              <li>
                Among the remaining players, the one with the <strong>LOWEST total score is crowned the WINNER</strong>!
              </li>
            </ul>
          </div>

          {/* Card 1: Standard Scoring */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                1
              </span>
              Standard Round Scoring (Double-Six)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              The first player or team to place all of their dominoes on the board declares <strong>"Domino!"</strong> and wins the hand. 
              The winner is awarded the <strong>sum of all pips</strong> (dots) remaining in the hands of all opposing players.
            </p>
            <div className="mt-3 rounded-xl bg-zinc-950/60 p-3 text-xs text-zinc-400 border border-zinc-800/80">
              <strong>Example:</strong> Player A goes domino. Player B has [3|5] (8 pts) and Player C has [6|2] (8 pts). Player A earns 16 points for that round.
            </div>
          </div>

          {/* Card 2: Capicúa */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Capicúa (Winning on Both Ends)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              A <strong>Capicúa</strong> occurs when a player wins by placing their final tile, and that tile could have legally been played on <strong>either open end</strong> of the domino chain (excluding double tiles in most traditions).
            </p>
            <p className="mt-2 text-xs text-amber-300 font-semibold">
              Bonus: In competitive Latin & Caribbean Dominoes, a Capicúa doubles the round score points! (Use the Capicúa toggle when logging round scores in Z Record System).
            </p>
          </div>

          {/* Card 3: Blocked Game (Trancón / Cierre) */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                3
              </span>
              Trancón / Blocked Game (Cierre)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              If no player can make a legal play and the boneyard is empty, the game is <strong>blocked (trancado)</strong>. Each player tallies the total pips left in their hand.
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
              <li>The player with the <strong>lowest pip count</strong> wins the round.</li>
              <li>The winner scores the difference between opponents' pips and their own, or in standard rules, the sum of all opposing pips.</li>
              <li>In case of a tie in points, the round is either voided or awarded to the hand opener.</li>
            </ul>
          </div>
        </div>

        {/* Hand Pip Calculator Tool */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 h-fit">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Calculator className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Pip Hand Counter</h3>
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            Quickly count pip dots left in an opponent's hand to compute points earned:
          </p>

          <div className="mt-4 space-y-2">
            {[6, 5, 4, 3, 2, 1].map((pip) => (
              <div
                key={pip}
                className="flex items-center justify-between rounded-xl bg-zinc-950 px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 font-bold text-amber-400">
                    {pip}
                  </span>
                  <span className="text-zinc-300">{pip}-dot halves</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updatePip(pip, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-bold text-white">
                    {pipInputs[pip]}
                  </span>
                  <button
                    type="button"
                    onClick={() => updatePip(pip, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Calculator Total */}
          <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
              Total Pip Count
            </span>
            <div className="text-3xl font-black text-white">
              {totalCalculated} <span className="text-xs font-normal text-zinc-400">pts</span>
            </div>
            <button
              onClick={() =>
                setPipInputs({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 })
              }
              className="mt-2 text-[11px] text-zinc-400 hover:text-white underline"
            >
              Reset Counter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
