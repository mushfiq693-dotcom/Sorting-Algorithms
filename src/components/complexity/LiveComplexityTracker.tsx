"use client";

import React, { useMemo } from "react";
import { AlgorithmId } from "@/types/sorting";
import { calculatePredictedOperations } from "@/data/complexityDerivations";
import { ALGORITHMS } from "@/data/algorithms";
import { Activity, CheckCircle2 } from "lucide-react";

interface LiveComplexityTrackerProps {
  algorithmId: AlgorithmId;
  arraySize: number;
  comparisonsCount: number;
  swapsCount: number;
  isFinished: boolean;
  initialArray: number[];
}

export function LiveComplexityTracker({
  algorithmId,
  arraySize,
  comparisonsCount,
  swapsCount,
  isFinished,
  initialArray,
}: LiveComplexityTrackerProps) {
  const meta = ALGORITHMS[algorithmId];
  const predicted = useMemo(() => {
    return calculatePredictedOperations(algorithmId, arraySize);
  }, [algorithmId, arraySize]);

  // Compute efficiency ratio
  const worstComp = Math.max(1, predicted.worstComp);
  const ratioPercent = Math.min(100, Math.round((comparisonsCount / worstComp) * 100));

  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-cyan-500" />
          <span>Live Big-O Bounds • n = {arraySize}</span>
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="text-muted-foreground">Worst Budget:</span>
          <strong className="text-cyan-500 font-bold">{ratioPercent}%</strong>
        </div>
      </div>

      {/* Grid of Actual vs Predicted Bounds (Compact 4-Pill Row) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
        {/* Actual Comparisons */}
        <div className="p-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground">Actual Comp</span>
            <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-300">
              {comparisonsCount}
            </span>
          </div>
          <span className="text-[9px] text-cyan-500 font-semibold px-1 rounded bg-cyan-500/10">Live</span>
        </div>

        {/* Theoretical Best */}
        <div className="p-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400">Best Bound</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">
              {predicted.bestComp}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">{meta.complexity.best}</span>
        </div>

        {/* Theoretical Average */}
        <div className="p-2 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-amber-600 dark:text-amber-400">Avg Expected</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-300">
              {predicted.avgComp}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">{meta.complexity.average}</span>
        </div>

        {/* Theoretical Worst */}
        <div className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-rose-600 dark:text-rose-400">Worst Bound</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-300">
              {predicted.worstComp}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">{meta.complexity.worst}</span>
        </div>
      </div>

      {/* Slim Worst-Case Progress Bar */}
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          style={{ width: `${ratioPercent}%` }}
          className={`h-full rounded-full transition-all duration-150 ${
            ratioPercent < 50
              ? "bg-emerald-400"
              : ratioPercent < 85
              ? "bg-amber-400"
              : "bg-rose-500"
          }`}
        />
      </div>

      {/* Post-Run Diagnostic Summary */}
      {isFinished && (
        <div className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-300 font-mono animate-in fade-in">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">
            Run Completed: {comparisonsCount} comparisons & {swapsCount} {predicted.operationName.toLowerCase()}.
          </span>
        </div>
      )}
    </div>
  );
}
