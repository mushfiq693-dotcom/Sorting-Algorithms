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
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md shadow-xl">
      {/* Top Header & Live Counter Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isFinished ? "bg-emerald-400" : "bg-cyan-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isFinished ? "bg-emerald-500" : "bg-cyan-500"
              }`}
            />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-cyan-400" /> Live Execution
          </span>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-amber-300">
            <GitCompare className="h-3.5 w-3.5 text-amber-400" />
            <span>Comparisons:</span>
            <strong className="font-bold text-amber-200">{comparisonsCount}</strong>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-rose-300">
            <ArrowLeftRight className="h-3.5 w-3.5 text-rose-400" />
            <span>Swaps:</span>
            <strong className="font-bold text-rose-200">{swapsCount}</strong>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-blue-300">
            <span>Step:</span>
            <strong className="font-bold text-blue-200">
              {currentStep} / {totalSteps}
            </strong>
          </div>
        </div>
      </div>

      {/* Dynamic Explanation Text Box */}
      <div className="rounded-xl border border-border/70 bg-background/70 px-4 py-3 min-h-[52px] flex items-center">
        <p className="text-sm font-medium text-foreground/90 leading-relaxed font-mono flex items-center gap-2">
          {isFinished && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
          <span>{explanation || "Ready. Click 'Start Sort' or 'Step' to begin visualization."}</span>
        </p>
      </div>

      {/* Color Indicator Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
        <span className="font-medium text-foreground/70">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500" />
          <span>Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
}
