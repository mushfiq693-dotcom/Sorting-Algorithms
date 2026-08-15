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
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span>Complexity & Properties</span>
        </h3>
        <span className="text-xs font-mono font-medium text-cyan-400">
          {name}
        </span>
      </div>

      {/* Grid of Complexity Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Best Time */}
        <div className="flex flex-col rounded-xl border border-border/60 bg-background/60 p-2.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 text-emerald-400" /> Best Time
          </span>
          <span className="text-sm font-bold font-mono text-emerald-400 mt-1">
            {complexity.best}
          </span>
        </div>

        {/* Average Time */}
        <div className="flex flex-col rounded-xl border border-border/60 bg-background/60 p-2.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-400" /> Average Time
          </span>
          <span className="text-sm font-bold font-mono text-amber-400 mt-1">
            {complexity.average}
          </span>
        </div>

        {/* Worst Time */}
        <div className="flex flex-col rounded-xl border border-border/60 bg-background/60 p-2.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 text-rose-400" /> Worst Time
          </span>
          <span className="text-sm font-bold font-mono text-rose-400 mt-1">
            {complexity.worst}
          </span>
        </div>

        {/* Space Complexity */}
        <div className="flex flex-col rounded-xl border border-border/60 bg-background/60 p-2.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-cyan-400" /> Space
          </span>
          <span className="text-sm font-bold font-mono text-cyan-400 mt-1">
            {complexity.space}
          </span>
        </div>

        {/* Stability */}
        <div className="flex flex-col rounded-xl border border-border/60 bg-background/60 p-2.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-indigo-400" /> Stable?
          </span>
          <span
            className={`text-sm font-bold font-mono mt-1 ${
              complexity.stable ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {complexity.stable ? "Yes" : "No"}
          </span>
        </div>

        {/* In-Place */}
        <div className="flex flex-col rounded-xl border border-border/60 bg-background/60 p-2.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3 text-purple-400" /> In-Place?
          </span>
          <span
            className={`text-sm font-bold font-mono mt-1 ${
              complexity.inPlace ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {complexity.inPlace ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {/* Special note if exists (e.g. Quick Sort space complexity recursion note) */}
      {complexity.spaceNote && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p>{complexity.spaceNote}</p>
        </div>
      )}

      {/* Description Summary */}
      <div className="rounded-xl border border-border/50 bg-background/40 p-3 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
        <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>{description}</p>
      </div>
    </div>
  );
}
