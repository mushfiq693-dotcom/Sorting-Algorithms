"use client";

import React, { useMemo } from "react";
import { AlgorithmId } from "@/types/sorting";
import { calculatePredictedOperations } from "@/data/complexityDerivations";
import { ALGORITHMS } from "@/data/algorithms";
import {
  Activity,
  GitCompare,
  ArrowLeftRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

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

  // Determine initial array condition
  const initialCondition = useMemo(() => {
    if (!initialArray || initialArray.length <= 1) return "neutral";
    let isSorted = true;
    let isReverse = true;
    for (let i = 0; i < initialArray.length - 1; i++) {
      if (initialArray[i] > initialArray[i + 1]) isSorted = false;
      if (initialArray[i] < initialArray[i + 1]) isReverse = false;
    }
    if (isSorted) return "sorted";
    if (isReverse) return "reversed";
    return "random";
  }, [initialArray]);

  return (
    <div className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-cyan-400" />
          <span>Live Big-O Tracking • n = {arraySize}</span>
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
          Theoretical Bounds
        </span>
      </div>

      {/* Grid of Actual vs Predicted Bounds */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        {/* Actual Comparisons */}
        <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex flex-col">
          <span className="text-[10px] text-slate-400">Actual Comparisons</span>
          <span className="text-base font-extrabold text-cyan-300 mt-0.5">
            {comparisonsCount}
          </span>
          <span className="text-[10px] text-slate-500">Live Counter</span>
        </div>

        {/* Theoretical Best */}
        <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 flex flex-col">
          <span className="text-[10px] text-emerald-400">Best Bound</span>
          <span className="text-base font-bold text-emerald-300 mt-0.5">
            {predicted.bestComp}
          </span>
          <span className="text-[10px] text-slate-500">{meta.complexity.best}</span>
        </div>

        {/* Theoretical Average */}
        <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-950/10 flex flex-col">
          <span className="text-[10px] text-amber-400">Average Expected</span>
          <span className="text-base font-bold text-amber-300 mt-0.5">
            {predicted.avgComp}
          </span>
          <span className="text-[10px] text-slate-500">{meta.complexity.average}</span>
        </div>

        {/* Theoretical Worst */}
        <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-950/10 flex flex-col">
          <span className="text-[10px] text-rose-400">Worst Bound</span>
          <span className="text-base font-bold text-rose-300 mt-0.5">
            {predicted.worstComp}
          </span>
          <span className="text-[10px] text-slate-500">{meta.complexity.worst}</span>
        </div>
      </div>

      {/* Live Worst-Case Consumption Bar */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Worst-Case Budget Consumed:</span>
          <span className="text-cyan-400 font-bold">{ratioPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
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
      </div>

      {/* Post-Run Diagnostic Summary */}
      {isFinished && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 flex items-start gap-2.5 text-xs text-emerald-100/90 font-mono animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-emerald-300 block">
              Run Completed: {comparisonsCount} comparisons & {swapsCount} {predicted.operationName.toLowerCase()}.
            </span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {initialCondition === "sorted"
                ? `Input was already sorted. ${algorithmId === "bubble" || algorithmId === "insertion" ? "Early exit / adaptive logic took advantage of this to run in linear O(n) time!" : "Comparisons followed deterministic divide & conquer."}`
                : initialCondition === "reversed"
                ? "Input was strictly reversed. This triggered near maximal comparisons and inversions."
                : `Input was randomly permuted. Real comparisons (${comparisonsCount}) closely matched theoretical expectations (${predicted.avgComp}).`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
