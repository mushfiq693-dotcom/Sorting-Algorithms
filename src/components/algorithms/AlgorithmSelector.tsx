"use client";

import React from "react";
import { AlgorithmId } from "@/types/sorting";
import { ALGORITHMS, ALL_ALGORITHMS } from "@/data/algorithms";
import { Cpu, CheckCircle } from "lucide-react";

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
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <span>Algorithms</span>
        </h2>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
          All 5 Available
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {ALL_ALGORITHMS.map((algoId) => {
          const meta = ALGORITHMS[algoId];
          const isSelected = selectedAlgorithm === algoId;

          return (
            <button
              key={algoId}
              id={`algo-btn-${algoId}`}
              disabled={disabled}
              onClick={() => onSelectAlgorithm(algoId)}
              className={`group relative flex flex-col items-start rounded-xl p-3 text-left transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-blue-600/20 via-cyan-600/15 to-transparent border border-cyan-500/50 shadow-lg shadow-cyan-500/10 text-foreground"
                  : "border border-border/60 bg-background/50 hover:bg-secondary/60 hover:border-border text-muted-foreground hover:text-foreground"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"}`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                  {meta.name}
                  {isSelected && (
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  )}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {meta.complexity.average}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-1">
                {meta.shortDescription}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
