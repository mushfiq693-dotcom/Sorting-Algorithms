"use client";

import React from "react";
import { AlgorithmId } from "@/types/sorting";
import { ALGORITHMS, SORTING_ALGORITHMS, DATA_STRUCTURES } from "@/data/algorithms";
import { Cpu, Layers, Database } from "lucide-react";

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmId;
  onSelectAlgorithm: (id: AlgorithmId) => void;
  disabled?: boolean;
}

export function AlgorithmSelector({
  selectedAlgorithm,
  onSelectAlgorithm,
  disabled = false,
}: AlgorithmSelectorProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/80 p-4 sm:p-5 backdrop-blur-xl shadow-xl">
      {/* Category 1: Sorting Algorithms */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-cyan-500" />
            <span>Sorting Algorithms</span>
          </h2>
          <span className="text-[10px] font-mono font-semibold text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
            5 Engines
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {SORTING_ALGORITHMS.map((algoId) => {
            const meta = ALGORITHMS[algoId];
            const isSelected = selectedAlgorithm === algoId;

            return (
              <button
                key={algoId}
                id={`algo-btn-${algoId}`}
                disabled={disabled}
                onClick={() => onSelectAlgorithm(algoId)}
                className={`group relative flex flex-col items-start rounded-xl p-2.5 sm:p-3 text-left transition-all ${
                  isSelected
                    ? "bg-cyan-500/10 border border-cyan-500/60 shadow-sm text-foreground"
                    : "border border-border bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99] cursor-pointer"}`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                    {meta.name}
                    {isSelected && (
                      <span className="flex items-end gap-0.5 h-3.5 px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-500">
                        <span className="w-1 h-1.5 rounded-xs bg-cyan-500" />
                        <span className="w-1 h-2.5 rounded-xs bg-cyan-500" />
                        <span className="w-1 h-3.5 rounded-xs bg-cyan-500" />
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      meta.complexity.average.includes("log")
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20"
                    }`}
                  >
                    {meta.complexity.average}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-1">
                  {meta.shortDescription}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category 2: Data Structures */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-blue-500" />
            <span>Data Structures</span>
          </h2>
          <span className="text-[10px] font-mono font-semibold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
            2 Structures
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {DATA_STRUCTURES.map((dsId) => {
            const meta = ALGORITHMS[dsId];
            const isSelected = selectedAlgorithm === dsId;

            return (
              <button
                key={dsId}
                id={`ds-btn-${dsId}`}
                disabled={disabled}
                onClick={() => onSelectAlgorithm(dsId)}
                className={`group relative flex flex-col items-start rounded-xl p-2.5 sm:p-3 text-left transition-all ${
                  isSelected
                    ? "bg-blue-500/10 border border-blue-500/60 shadow-sm text-foreground"
                    : "border border-border bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99] cursor-pointer"}`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                    {meta.name}
                    {isSelected && (
                      <span className="flex items-end gap-0.5 h-3.5 px-1 py-0.5 rounded bg-blue-500/20 text-blue-500">
                        <span className="w-1 h-1.5 rounded-xs bg-blue-500" />
                        <span className="w-1 h-2.5 rounded-xs bg-blue-500" />
                        <span className="w-1 h-3.5 rounded-xs bg-blue-500" />
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                    LIFO/FIFO O(1)
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed line-clamp-1">
                  {meta.shortDescription}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
