"use client";

import React from "react";
import { ArrowLeftRight, GitCompare, CheckCircle2, Activity, Sparkles } from "lucide-react";

interface OperationIndicatorProps {
  explanation: string;
  comparisonsCount: number;
  swapsCount: number;
  currentStep: number;
  totalSteps: number;
  isFinished: boolean;
}

export function OperationIndicator({
  explanation,
  comparisonsCount,
  swapsCount,
  currentStep,
  totalSteps,
  isFinished,
}: OperationIndicatorProps) {
  const stepPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <div className={`flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:p-5 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all ${
      isFinished ? "border-emerald-500/40 shadow-emerald-500/10" : "border-border"
    }`}>
      {/* Top Header & Live Counter Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isFinished ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isFinished ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-cyan-500 shadow-[0_0_8px_#38bdf8]"
              }`}
            />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-cyan-500" />
            <span>{isFinished ? "Sorted Array Settled" : "Execution Telemetry"}</span>
          </span>
        </div>

        {/* Counter Badges (Monospace Metrics) */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-amber-600 dark:text-amber-300 shadow-sm">
            <GitCompare className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] text-muted-foreground">Comparisons:</span>
            <strong className="font-bold text-amber-700 dark:text-amber-200">{comparisonsCount}</strong>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-rose-600 dark:text-rose-300 shadow-sm">
            <ArrowLeftRight className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-[11px] text-muted-foreground">Swaps:</span>
            <strong className="font-bold text-rose-700 dark:text-rose-200">{swapsCount}</strong>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-cyan-600 dark:text-cyan-300 shadow-sm">
            <span className="text-[11px] text-muted-foreground">Progress:</span>
            <strong className="font-bold text-cyan-700 dark:text-cyan-200">
              {currentStep}/{totalSteps} ({stepPercent}%)
            </strong>
          </div>
        </div>
      </div>

      {/* Dynamic Explanation Text Box */}
      <div className="rounded-xl border border-border bg-secondary/70 px-4 py-3 min-h-[52px] flex items-center shadow-inner">
        <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed font-mono flex items-center gap-2.5">
          {isFinished ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
          )}
          <span>{explanation || "Ready. Click 'Start Sort' or 'Step' to begin visualization."}</span>
        </p>
      </div>

      {/* Color Indicator Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
        <span className="font-bold text-slate-300">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
          <span>Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          <span>Sorted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
          <span>Pivot</span>
        </div>
      </div>
    </div>
  );
}
