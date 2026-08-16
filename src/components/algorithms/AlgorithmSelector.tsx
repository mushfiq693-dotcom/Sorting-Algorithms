"use client";

import React from "react";
import { AlgorithmId } from "@/types/sorting";
import { ALGORITHMS, ALL_ALGORITHMS } from "@/data/algorithms";
import { Cpu, CheckCircle2 } from "lucide-react";

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
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 p-4 sm:p-5 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <span>Algorithms</span>
        </h2>
        <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
          5 Engines
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
              className={`group relative flex flex-col items-start rounded-xl p-3 text-left transition-all card-swap-hover ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-400/60 shadow-lg shadow-cyan-500/10 text-white"
                  : "border border-slate-800 bg-[#070b14]/70 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99]"}`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-100 flex items-center gap-2">
                  {meta.name}
                  {isSelected ? (
                    <span className="flex items-end gap-0.5 h-3.5 px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                      <span className="w-1 h-1.5 rounded-xs bg-cyan-400" />
                      <span className="w-1 h-2.5 rounded-xs bg-cyan-400" />
                      <span className="w-1 h-3.5 rounded-xs bg-cyan-400" />
                    </span>
                  ) : null}
                </span>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                  meta.complexity.average.includes("log")
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                }`}>
                  {meta.complexity.average}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed line-clamp-1">
                {meta.shortDescription}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
