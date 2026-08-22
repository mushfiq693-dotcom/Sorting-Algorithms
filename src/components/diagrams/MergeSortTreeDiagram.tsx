"use client";

import React from "react";
import { GitFork, Layers, CheckCircle2, ArrowDown, ArrowUp } from "lucide-react";

export function MergeSortTreeDiagram() {
  const n = 8;
  const levels = Math.round(Math.log2(n));

  return (
    <div className="flex flex-col gap-6 w-full select-text">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-500" />
          <span className="text-foreground font-bold">
            Recursion Depth: log₂({n}) = {levels} levels
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
            Divide Phase (↓)
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            Conquer / Merge Phase (↑)
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            Work/Level: O(n)
          </span>
        </div>
      </div>

      {/* Horizontally Scrollable Tree Container */}
      <div className="w-full overflow-x-auto pb-4 pt-2">
        <div className="min-w-[680px] flex flex-col items-center gap-6 p-4 rounded-2xl border border-border bg-card shadow-sm">
          {/* ============================================================== */}
          {/* DIVIDE PHASE (TOP HALF) */}
          {/* ============================================================== */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-700 dark:text-cyan-300">
            <ArrowDown className="h-3.5 w-3.5" />
            <span className="font-bold">DIVIDE PHASE — Split in halves until singletons</span>
          </div>

          {/* Level 0: Root [38, 27, 43, 3, 9, 82, 10, 19] */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 p-2 rounded-xl bg-secondary/80 border border-cyan-500/40 shadow-sm">
              {[38, 27, 43, 3, 9, 82, 10, 19].map((v, i) => (
                <span key={i} className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-800 dark:text-cyan-200 border border-cyan-500/30 flex items-center justify-center font-mono text-xs font-bold">
                  {v}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">Level 0: Initial (n=8)</span>
          </div>

          {/* Connecting Lines L0 -> L1 */}
          <div className="w-96 flex justify-between px-16 text-muted-foreground text-xs select-none">
            <span>↙</span>
            <span>↘</span>
          </div>

          {/* Level 1: [38, 27, 43, 3] and [9, 82, 10, 19] */}
          <div className="flex justify-around w-full max-w-lg">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 p-1.5 rounded-xl bg-secondary/60 border border-cyan-500/30">
                {[38, 27, 43, 3].map((v, i) => (
                  <span key={i} className="w-7 h-7 rounded bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 flex items-center justify-center font-mono text-xs font-bold">
                    {v}
                  </span>
                ))}
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">Left Half (n=4)</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 p-1.5 rounded-xl bg-secondary/60 border border-cyan-500/30">
                {[9, 82, 10, 19].map((v, i) => (
                  <span key={i} className="w-7 h-7 rounded bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 flex items-center justify-center font-mono text-xs font-bold">
                    {v}
                  </span>
                ))}
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">Right Half (n=4)</span>
            </div>
          </div>

          {/* Level 2: [38, 27], [43, 3], [9, 82], [10, 19] */}
          <div className="flex justify-between w-full max-w-xl px-4">
            {[[38, 27], [43, 3], [9, 82], [10, 19]].map((arr, idx) => (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-cyan-500/20">
                  {arr.map((v, i) => (
                    <span key={i} className="w-6 h-6 rounded bg-cyan-500/10 text-cyan-800 dark:text-cyan-200 flex items-center justify-center font-mono text-[11px] font-semibold">
                      {v}
                    </span>
                  ))}
                </div>
                <span className="text-[8px] font-mono text-muted-foreground">n=2</span>
              </div>
            ))}
          </div>

          {/* Level 3 (Base Case - Singletons): [38], [27], [43], [3], [9], [82], [10], [19] */}
          <div className="flex justify-between w-full max-w-2xl px-2 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
            {[38, 27, 43, 3, 9, 82, 10, 19].map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="w-8 h-8 rounded-lg bg-purple-500/30 text-purple-800 dark:text-purple-200 border border-purple-500/50 flex items-center justify-center font-mono text-xs font-bold shadow-sm">
                  {v}
                </span>
                <span className="text-[8px] font-mono text-purple-700 dark:text-purple-300 mt-0.5">base</span>
              </div>
            ))}
          </div>

          {/* ============================================================== */}
          {/* CONQUER / MERGE PHASE (BOTTOM HALF) */}
          {/* ============================================================== */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-700 dark:text-emerald-300 mt-2">
            <ArrowUp className="h-3.5 w-3.5" />
            <span className="font-bold">CONQUER / MERGE PHASE — Two-pointer merge sorted pairs back upward</span>
          </div>

          {/* Merged Pairs (n=2): [27, 38], [3, 43], [9, 82], [10, 19] */}
          <div className="flex justify-between w-full max-w-xl px-4">
            {[[27, 38], [3, 43], [9, 82], [10, 19]].map((arr, idx) => (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/40">
                  {arr.map((v, i) => (
                    <span key={i} className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-mono text-[11px] font-bold">
                      {v}
                    </span>
                  ))}
                </div>
                <span className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400">merged 2s</span>
              </div>
            ))}
          </div>

          {/* Merged Quads (n=4): [3, 27, 38, 43] and [9, 10, 19, 82] */}
          <div className="flex justify-around w-full max-w-lg">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/50">
                {[3, 27, 38, 43].map((v, i) => (
                  <span key={i} className="w-7 h-7 rounded bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-mono text-xs font-bold">
                    {v}
                  </span>
                ))}
              </div>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">Merged Left (n=4)</span>
            </div>

            <div className="flex justify-center items-center">
              <span className="text-xs font-mono text-emerald-500 font-bold">+</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/50">
                {[9, 10, 19, 82].map((v, i) => (
                  <span key={i} className="w-7 h-7 rounded bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-mono text-xs font-bold">
                    {v}
                  </span>
                ))}
              </div>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">Merged Right (n=4)</span>
            </div>
          </div>

          {/* Final Assembled Array (n=8): [3, 9, 10, 19, 27, 38, 43, 82] */}
          <div className="flex flex-col items-center gap-1 mt-2">
            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-secondary border-2 border-emerald-500 shadow-sm">
              {[3, 9, 10, 19, 27, 38, 43, 82].map((v, i) => (
                <span key={i} className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-mono text-xs font-extrabold shadow-sm">
                  {v}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Final Sorted Array: O(n log n) Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
