"use client";

import React, { useState, useMemo } from "react";
import { AlgorithmId } from "@/types/sorting";
import { ALL_ALGORITHMS, ALGORITHMS } from "@/data/algorithms";
import { calculatePredictedOperations } from "@/data/complexityDerivations";
import {
  Sliders,
  Calculator,
  GitCompare,
  ArrowLeftRight,
  TrendingUp,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

interface ComplexityCalculatorProps {
  initialAlgorithm?: AlgorithmId;
  showAllAlgorithmsToggle?: boolean;
}

export function ComplexityCalculator({
  initialAlgorithm = "bubble",
  showAllAlgorithmsToggle = true,
}: ComplexityCalculatorProps) {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>(initialAlgorithm);
  const [arraySize, setArraySize] = useState<number>(200);
  const [viewMode, setViewMode] = useState<"single" | "cross">("single");

  const singleResult = useMemo(() => {
    return calculatePredictedOperations(selectedAlgo, arraySize);
  }, [selectedAlgo, arraySize]);

  const crossResults = useMemo(() => {
    return ALL_ALGORITHMS.map((id) => ({
      id,
      name: ALGORITHMS[id].name,
      ...calculatePredictedOperations(id, arraySize),
    }));
  }, [arraySize]);

  const maxWorstComp = Math.max(...crossResults.map((r) => r.worstComp), 1);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Calculator className="h-4 w-4" />
            <span>Interactive Big-O Calculator</span>
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white font-sans mt-0.5">
            Calculate Exact Predicted Operations
          </h3>
        </div>

        {showAllAlgorithmsToggle && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono">
            <button
              onClick={() => setViewMode("single")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "single"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Single Algorithm
            </button>
            <button
              onClick={() => setViewMode("cross")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "cross"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All 5 Compared
            </button>
          </div>
        )}
      </div>

      {/* Input Slider Controls */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-[#070b14]/90">
        <div className="flex items-center justify-between text-xs font-mono">
          <label htmlFor="calculator-n-slider" className="text-slate-300 font-bold flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>Array Size (n):</span>
          </label>
          <span className="text-base font-extrabold text-cyan-300">
            {arraySize.toLocaleString()} elements
          </span>
        </div>

        <input
          id="calculator-n-slider"
          type="range"
          min="5"
          max="1000"
          step="5"
          value={arraySize}
          aria-label="Adjust calculation array size n"
          onChange={(e) => setArraySize(Number(e.target.value))}
          className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
        />

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-slate-500">Quick Presets:</span>
          {[10, 50, 100, 250, 500, 1000].map((preset) => (
            <button
              key={preset}
              onClick={() => setArraySize(preset)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                arraySize === preset
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700"
              }`}
            >
              n = {preset}
            </button>
          ))}
        </div>
      </div>

      {/* SINGLE ALGORITHM VIEW */}
      {viewMode === "single" && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          {/* Algorithm Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {ALL_ALGORITHMS.map((algoId) => (
              <button
                key={algoId}
                onClick={() => setSelectedAlgo(algoId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  selectedAlgo === algoId
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-sm"
                    : "bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white"
                }`}
              >
                {ALGORITHMS[algoId].name}
              </button>
            ))}
          </div>

          {/* Operation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Best Case Operations */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-400">
                Best Case Comparisons
              </span>
              <span className="text-xl font-mono font-extrabold text-emerald-300">
                {singleResult.bestComp.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {singleResult.bestSwaps.toLocaleString()} {singleResult.operationName}
              </span>
            </div>

            {/* Average Case Operations */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase text-amber-400">
                Average Case Comparisons
              </span>
              <span className="text-xl font-mono font-extrabold text-amber-300">
                {singleResult.avgComp.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Theoretical expected operations
              </span>
            </div>

            {/* Worst Case Operations */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase text-rose-400">
                Worst Case Comparisons
              </span>
              <span className="text-xl font-mono font-extrabold text-rose-300">
                {singleResult.worstComp.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {singleResult.worstSwaps.toLocaleString()} {singleResult.operationName}
              </span>
            </div>
          </div>

          {/* Real-World Context Insight */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-xs text-slate-200 leading-relaxed font-mono">
            <span className="text-cyan-300 font-bold">Scaling Insight: </span>
            For an array of <strong className="text-white">n = {arraySize}</strong>, {ALGORITHMS[selectedAlgo].name} requires up to{" "}
            <strong className="text-cyan-300">{singleResult.worstComp.toLocaleString()} comparisons</strong>.
            {selectedAlgo === "merge" || selectedAlgo === "quick" ? (
              <span> The recursion tree depth reaches <strong className="text-purple-300">~{singleResult.depth} activation levels</strong>.</span>
            ) : (
              <span> If you double n to {arraySize * 2}, the work will approximately quadruple to <strong className="text-rose-300">{((arraySize * 2 * (arraySize * 2 - 1)) / 2).toLocaleString()} operations</strong>.</span>
            )}
          </div>
        </div>
      )}

      {/* CROSS-ALGORITHM COMPARISON VIEW */}
      {viewMode === "cross" && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Worst-Case Comparisons at n = {arraySize}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              O(n log n) vs O(n²) Scalability Gap
            </span>
          </div>

          {/* Bar Chart Comparison */}
          <div className="space-y-3">
            {crossResults.map((item) => {
              const percent = Math.max(3, Math.round((item.worstComp / maxWorstComp) * 100));
              const isLogarithmic = item.id === "merge" || (item.id === "quick" && item.worstComp < maxWorstComp);

              return (
                <div key={item.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <span className={`font-bold ${item.id === "merge" ? "text-emerald-400" : "text-slate-300"}`}>
                      {item.worstComp.toLocaleString()} operations
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-lg bg-slate-800 overflow-hidden relative">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full rounded-lg transition-all duration-300 ${
                        item.id === "merge"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_#10b981]"
                          : item.id === "quick"
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                          : "bg-gradient-to-r from-rose-500 to-amber-500"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-[#070b14]/80 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Notice how Merge Sort takes only <strong className="text-emerald-300">{crossResults.find(r => r.id === 'merge')?.worstComp.toLocaleString()}</strong> operations, while quadratic algorithms take <strong className="text-rose-400">{maxWorstComp.toLocaleString()}</strong>.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
