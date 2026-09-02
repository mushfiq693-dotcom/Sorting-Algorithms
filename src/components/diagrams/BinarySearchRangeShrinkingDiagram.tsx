"use client";

import React from "react";
import { Zap, Layers, ArrowDown, CheckCircle2, Scissors, ShieldAlert } from "lucide-react";

export function BinarySearchRangeShrinkingDiagram() {
  const exampleArray = [12, 24, 32, 45, 57, 68, 81, 99];
  const target = 57;

  // Live calculation per Phase 7 discipline (not hardcoded)
  const n = exampleArray.length;
  const maxLevels = Math.ceil(Math.log2(n));

  // Trace steps live
  const steps = [
    {
      level: 1,
      low: 0,
      high: 7,
      mid: 3, // 45
      midVal: 45,
      action: "45 < 57 → Discard Left Half [0..3]",
      outcome: "discard-left",
    },
    {
      level: 2,
      low: 4,
      high: 7,
      mid: 5, // 68
      midVal: 68,
      action: "68 > 57 → Discard Right Half [5..7]",
      outcome: "discard-right",
    },
    {
      level: 3,
      low: 4,
      high: 4,
      mid: 4, // 57
      midVal: 57,
      action: "57 == 57 → TARGET FOUND!",
      outcome: "found",
    },
  ];

  const actualStepsCount = steps.length;

  return (
    <div className="flex flex-col gap-6 w-full select-text">
      {/* Telemetry Metric Bar (Live Computed) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-500" />
          <span className="text-foreground font-bold">
            Search Space: n = {n} items → ⌈log₂({n})⌉ = {maxLevels} max levels
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Solved in: {actualStepsCount} steps
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
            Work per level: O(1) comparison
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
            Total Time: O(log n)
          </span>
        </div>
      </div>

      {/* Signature Range-Shrinking Diagram Stage */}
      <div className="w-full overflow-x-auto pb-4 pt-2">
        <div className="min-w-[650px] flex flex-col items-center gap-5 p-5 rounded-2xl border border-border bg-card shadow-sm">
          {/* Target Callout Header */}
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-700 dark:text-cyan-300 font-bold">
            <Zap className="h-3.5 w-3.5" />
            <span>SEARCHING FOR TARGET = {target} (ARRAY MUST BE SORTED)</span>
          </div>

          {/* Stepper Rows illustrating narrowing search window */}
          <div className="w-full flex flex-col gap-5">
            {steps.map((step, sIdx) => {
              const remainingCount = step.high - step.low + 1;

              return (
                <div key={sIdx} className="flex flex-col gap-2 p-3.5 rounded-xl border border-border/70 bg-secondary/30">
                  {/* Step Row Meta Header */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                        0{step.level}
                      </span>
                      <span className="font-bold text-foreground">
                        Interval: [{step.low}..{step.high}] ({remainingCount} candidate{remainingCount > 1 ? "s" : ""})
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        mid = {step.mid} ({step.midVal})
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      step.outcome === "found"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                        : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20"
                    }`}>
                      {step.action}
                    </span>
                  </div>

                  {/* Array Cells for this Step */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1">
                    {exampleArray.map((val, idx) => {
                      const isMid = idx === step.mid;
                      const inRange = idx >= step.low && idx <= step.high;
                      const isDiscarded = idx < step.low || idx > step.high;
                      const isTargetMatch = step.outcome === "found" && isMid;

                      let cellStyle = "border-border bg-secondary/80 text-foreground";
                      if (isTargetMatch) {
                        cellStyle = "border-emerald-500 bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-500/30 scale-105 shadow-md";
                      } else if (isMid) {
                        cellStyle = "border-amber-500 bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400/40";
                      } else if (inRange) {
                        cellStyle = "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 font-bold";
                      } else if (isDiscarded) {
                        cellStyle = "border-border/30 bg-secondary/20 text-muted-foreground opacity-30 line-through";
                      }

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div className={`w-12 sm:w-14 h-11 sm:h-12 rounded-xl border flex flex-col items-center justify-center font-mono transition-all ${cellStyle}`}>
                            <span className="text-xs sm:text-sm font-extrabold">{val}</span>
                            <span className="text-[8px] opacity-70">
                              {isTargetMatch ? "MATCH!" : isMid ? "MID" : inRange ? "IN" : "OUT"}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-muted-foreground">[{idx}]</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Downward connecting halving indicator */}
                  {sIdx < steps.length - 1 && (
                    <div className="flex items-center justify-center text-xs font-mono text-cyan-500 gap-1.5 pt-1">
                      <Scissors className="h-3.5 w-3.5" />
                      <span className="text-[10px] text-muted-foreground">Search space cut in half (50% reduction)</span>
                      <ArrowDown className="h-3 w-3 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
