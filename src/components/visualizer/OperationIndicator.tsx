"use client";

import React from "react";
import { ArrowLeftRight, GitCompare, CheckCircle2, Activity } from "lucide-react";

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
    <div
      className={`flex flex-col gap-2 rounded-2xl border bg-card p-2.5 sm:p-3 backdrop-blur-xl shadow-sm transition-all ${
        isFinished ? "border-emerald-500/40 shadow-emerald-500/10" : "border-border"
      }`}
    >
      {/* Top Header & Telemetry Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isFinished ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isFinished ? "bg-emerald-500" : "bg-cyan-500"
              }`}
            />
          </span>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
            {isFinished ? "Sorted Array Settled" : "Execution Telemetry"}
          </span>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-300">
            <GitCompare className="h-3 w-3 text-amber-500" />
            <span className="text-[10px] text-muted-foreground">Comp:</span>
            <strong className="font-bold">{comparisonsCount}</strong>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-rose-600 dark:text-rose-300">
            <ArrowLeftRight className="h-3 w-3 text-rose-500" />
            <span className="text-[10px] text-muted-foreground">Swaps:</span>
            <strong className="font-bold">{swapsCount}</strong>
          </div>

          <div className="hidden sm:flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-cyan-600 dark:text-cyan-300">
            <span className="text-[10px] text-muted-foreground">Step:</span>
            <strong className="font-bold">
              {currentStep}/{totalSteps} ({stepPercent}%)
            </strong>
          </div>
        </div>
      </div>

      {/* Dynamic Explanation Text Box */}
      <div className="rounded-xl border border-border/80 bg-secondary/60 px-3 py-1.5 min-h-[36px] flex items-center shadow-inner">
        <p className="text-xs font-medium text-foreground font-mono flex items-center gap-2 truncate">
          {isFinished ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
          )}
          <span className="truncate">{explanation || "Ready. Click 'Start' or 'Step' to begin."}</span>
        </p>
      </div>

      {/* Compact Color Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted-foreground pt-0.5 px-0.5">
        <span className="font-bold text-foreground">Legend:</span>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-xs bg-cyan-400" />
          <span>Default</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-xs bg-amber-400" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-xs bg-rose-500" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-xs bg-emerald-400" />
          <span>Sorted</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-xs bg-purple-400" />
          <span>Pivot</span>
        </div>
      </div>
    </div>
  );
}
