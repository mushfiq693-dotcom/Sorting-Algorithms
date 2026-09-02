"use client";

import React from "react";
import { Search, Layers, CheckCircle2, XCircle, ArrowRight, Clock } from "lucide-react";

export function LinearSearchTimelineDiagram() {
  const exampleArray = [42, 17, 89, 23, 56, 12, 78];

  return (
    <div className="flex flex-col gap-6 w-full select-text">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-500" />
          <span className="text-foreground font-bold">
            Data Array: n = {exampleArray.length} items (Unsorted / Any Order)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Best Case: O(1) (First Slot)
          </span>
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 font-bold">
            Worst Case: O(n) (Last / Absent)
          </span>
        </div>
      </div>

      {/* Diagram Comparison Container */}
      <div className="w-full overflow-x-auto pb-4 pt-2">
        <div className="min-w-[650px] flex flex-col gap-6 p-5 rounded-2xl border border-border bg-card shadow-sm">
          {/* Scenario 1: Best Case Execution (Target = 42) */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Scenario A: Best-Case Search (Target = 42 at Index 0)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold text-[10px]">
                1 Comparison • O(1) Time
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {exampleArray.map((val, idx) => {
                const isMatch = idx === 0;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-full h-12 rounded-xl border flex flex-col items-center justify-center font-mono ${
                        isMatch
                          ? "border-emerald-500 bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-500/30 shadow-md scale-105"
                          : "border-border/40 bg-secondary/30 text-muted-foreground opacity-40"
                      }`}
                    >
                      <span className="text-sm font-extrabold">{val}</span>
                      <span className="text-[8px] uppercase">{isMatch ? "MATCH!" : "SKIPPED"}</span>
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">[{idx}]</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] font-mono text-muted-foreground mt-1">
              ✓ Stops immediately on loop iteration i = 0. Zero further elements are evaluated.
            </p>
          </div>

          {/* Scenario 2: Worst-Case Execution (Target = 78) */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" />
                Scenario B: Worst-Case Search (Target = 78 at Index 6)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-[10px]">
                7 Comparisons • O(n) Time
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {exampleArray.map((val, idx) => {
                const isMatch = idx === exampleArray.length - 1;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-full h-12 rounded-xl border flex flex-col items-center justify-center font-mono ${
                        isMatch
                          ? "border-emerald-500 bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-500/30 shadow-md scale-105"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-bold"
                      }`}
                    >
                      <span className="text-sm font-extrabold">{val}</span>
                      <span className="text-[8px] uppercase">{isMatch ? "MATCH!" : "CHECKED"}</span>
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">[{idx}]</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] font-mono text-muted-foreground mt-1">
              ⚠️ Must inspect every single predecessor element before arriving at the target or returning -1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
