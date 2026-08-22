"use client";

import React from "react";
import { AlgorithmMetadata } from "@/types/sorting";
import { Clock, HardDrive, ShieldCheck, Zap, Info, AlertCircle } from "lucide-react";

interface ComplexityCardProps {
  metadata: AlgorithmMetadata;
}

export function ComplexityCard({ metadata }: ComplexityCardProps) {
  const { complexity, name, description } = metadata;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 backdrop-blur-xl shadow-sm dark:shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>Complexity & Properties</span>
        </h3>
        <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
          {name}
        </span>
      </div>

      {/* Grid of Complexity Metrics (Linear-Style Dev-Tool Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Best Time */}
        <div className="flex flex-col rounded-xl border border-border bg-secondary/50 p-2.5">
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-emerald-500" /> Best
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {complexity.best}
          </span>
        </div>

        {/* Average Time */}
        <div className="flex flex-col rounded-xl border border-border bg-secondary/50 p-2.5">
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-amber-500" /> Average
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {complexity.average}
          </span>
        </div>

        {/* Worst Time */}
        <div className="flex flex-col rounded-xl border border-border bg-secondary/50 p-2.5">
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-rose-500" /> Worst
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {complexity.worst}
          </span>
        </div>

        {/* Space Complexity */}
        <div className="flex flex-col rounded-xl border border-border bg-secondary/50 p-2.5">
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
            <HardDrive className="h-3 w-3 text-cyan-500" /> Auxiliary Space
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
            {complexity.space}
          </span>
        </div>

        {/* Stability */}
        <div className="flex flex-col rounded-xl border border-border bg-secondary/50 p-2.5">
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-indigo-500" /> Stable?
          </span>
          <span
            className={`text-xs sm:text-sm font-bold font-mono mt-1 ${
              complexity.stable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {complexity.stable ? "Yes (Stable)" : "No (Unstable)"}
          </span>
        </div>

        {/* In-Place */}
        <div className="flex flex-col rounded-xl border border-border bg-secondary/50 p-2.5">
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-purple-500" /> In-Place?
          </span>
          <span
            className={`text-xs sm:text-sm font-bold font-mono mt-1 ${
              complexity.inPlace ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {complexity.inPlace ? "Yes [O(1)]" : "No [O(n)]"}
          </span>
        </div>
      </div>

      {/* Special note if exists */}
      {complexity.spaceNote && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-2.5 text-xs font-mono text-purple-800 dark:text-purple-200 leading-relaxed flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
          <p>{complexity.spaceNote}</p>
        </div>
      )}

      {/* Description Summary */}
      <div className="rounded-xl border border-border bg-secondary/30 p-3 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
        <Info className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
        <p>{description}</p>
      </div>
    </div>
  );
}
