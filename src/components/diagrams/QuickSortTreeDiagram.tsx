"use client";

import React from "react";
import { GitFork, CheckCircle2, ShieldAlert, Zap, ArrowDown } from "lucide-react";

export function QuickSortTreeDiagram() {
  return (
    <div className="flex flex-col gap-6 w-full select-text">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-purple-500/20 bg-purple-950/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-400" />
          <span className="text-slate-200 font-bold">
            Asymmetric Partition Tree (Lomuto Scheme)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Pivot (Fixed Key)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Smaller (&lt; Pivot)
          </span>
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
            Greater (&gt; Pivot)
          </span>
        </div>
      </div>

      {/* Horizontally Scrollable Tree Container */}
      <div className="w-full overflow-x-auto pb-4 pt-2">
        <div className="min-w-[700px] flex flex-col items-center gap-6 p-4 rounded-2xl border border-slate-800 bg-[#070b14]/90 shadow-inner">
          {/* Level 0: Starting Array with Pivot 60 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1 p-2 rounded-xl bg-slate-800/90 border border-slate-700 shadow-md">
              {[33, 10, 55, 71, 29, 14, 42].map((v, i) => (
                <span key={i} className="w-8 h-8 rounded-lg bg-slate-700/80 text-slate-200 flex items-center justify-center font-mono text-xs font-bold">
                  {v}
                </span>
              ))}
              {/* Pivot */}
              <span className="w-9 h-9 rounded-lg bg-purple-500 text-white flex items-center justify-center font-mono text-xs font-extrabold shadow-[0_0_12px_rgba(168,85,247,0.6)] border-2 border-purple-300">
                60
              </span>
            </div>
            <span className="text-[10px] font-mono text-purple-300 font-bold">
              Level 0: Initial Array (n=8) • Chosen Pivot = [60]
            </span>
          </div>

          {/* Partition 0 Breakdown (3 clear columns) */}
          <div className="w-full flex items-center justify-center gap-4 py-2 px-4 rounded-xl bg-[#0b101d] border border-purple-500/30">
            {/* Left: < 60 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                &lt; 60 (Smaller: 6 items)
              </span>
              <div className="flex items-center gap-1 p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                {[33, 10, 55, 29, 14, 42].map((v, i) => (
                  <span key={i} className="w-7 h-7 rounded bg-cyan-500/20 text-cyan-200 flex items-center justify-center font-mono text-xs font-bold">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Middle: Pivot 60 Settled */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                PIVOT SETTLED
              </span>
              <div className="p-1 rounded-lg bg-purple-950/60 border border-purple-400">
                <span className="w-8 h-8 rounded-md bg-purple-500 text-white flex items-center justify-center font-mono text-xs font-extrabold shadow-[0_0_10px_#a855f7]">
                  60
                </span>
              </div>
            </div>

            {/* Right: > 60 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                &gt; 60 (Greater: 1 item)
              </span>
              <div className="flex items-center gap-1 p-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30">
                <span className="w-7 h-7 rounded bg-rose-500/20 text-rose-200 flex items-center justify-center font-mono text-xs font-bold">
                  71
                </span>
              </div>
            </div>
          </div>

          {/* Level 1: Sub-partitions on the Left Subarray */}
          <div className="flex items-start justify-between w-full max-w-2xl px-2 gap-4">
            {/* Left Sub-tree: Recurse on [33, 10, 55, 29, 14, 42] with Pivot = 42 */}
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/20 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-slate-400">Recurse Left: Pivot = </span>
                <span className="px-1.5 py-0.2 rounded bg-purple-500 text-white font-mono text-[10px] font-bold">42</span>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-800">
                {[33, 10, 29, 14].map((v, i) => (
                  <span key={i} className="w-6 h-6 rounded bg-cyan-500/15 text-cyan-200 flex items-center justify-center font-mono text-[11px]">
                    {v}
                  </span>
                ))}
                <span className="w-6 h-6 rounded bg-purple-500 text-white flex items-center justify-center font-mono text-[11px] font-bold">
                  42
                </span>
                <span className="w-6 h-6 rounded bg-rose-500/20 text-rose-200 flex items-center justify-center font-mono text-[11px]">
                  55
                </span>
              </div>
              <span className="text-[8px] font-mono text-cyan-300">Partitioned: &lt; 42: [33, 10, 29, 14] | &gt; 42: [55]</span>
            </div>

            {/* Right Sub-tree: [71] base case */}
            <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30">
              <span className="text-[9px] font-mono text-emerald-400 font-semibold">Right Side Base Case</span>
              <span className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
                71
              </span>
              <span className="text-[8px] font-mono text-slate-500">n=1 (settled)</span>
            </div>
          </div>

          {/* Level 2: Sub-partition on [33, 10, 29, 14] with Pivot = 14 */}
          <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-900/80 border border-slate-700 w-full max-w-xl">
            <span className="text-[9px] font-mono text-slate-400">Recurse: [33, 10, 29, 14] • Pivot = [14]</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/40 border border-cyan-500/30">
                <span className="text-[9px] font-mono text-cyan-400">&lt; 14:</span>
                <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-200 flex items-center justify-center font-mono text-[11px] font-bold">10</span>
              </div>
              <span className="w-6 h-6 rounded bg-purple-500 text-white flex items-center justify-center font-mono text-[11px] font-bold">14</span>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-rose-950/40 border border-rose-500/30">
                <span className="text-[9px] font-mono text-rose-400">&gt; 14:</span>
                <span className="w-6 h-6 rounded bg-rose-500/20 text-rose-200 flex items-center justify-center font-mono text-[11px] font-bold">29</span>
                <span className="w-6 h-6 rounded bg-rose-500/20 text-rose-200 flex items-center justify-center font-mono text-[11px] font-bold">33</span>
              </div>
            </div>
          </div>

          {/* Final Assembled Array */}
          <div className="flex flex-col items-center gap-1 mt-2">
            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-[#07130e] to-emerald-950/90 border-2 border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.25)]">
              {[10, 14, 29, 33, 42, 55, 60, 71].map((v, i) => (
                <span key={i} className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-mono text-xs font-extrabold shadow-sm">
                  {v}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold mt-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Final In-Place Sorted Array: O(n log n) Average</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
