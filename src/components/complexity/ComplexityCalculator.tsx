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
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 sm:p-7 backdrop-blur-xl shadow-sm dark:shadow-2xl">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Calculator className="h-4 w-4" />
            <span>Interactive Big-O Calculator</span>
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-foreground font-sans mt-0.5">
            Calculate Exact Predicted Operations
          </h3>
        </div>

        {showAllAlgorithmsToggle && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary border border-border text-xs font-mono">
            <button
              onClick={() => setViewMode("single")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "single"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Single Algorithm
            </button>
            <button
              onClick={() => setViewMode("cross")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "cross"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All 5 Compared
            </button>
          </div>
        )}
      </div>

      {/* Input Slider Controls */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-secondary/40">
        <div className="flex items-center justify-between text-xs font-mono">
          <label htmlFor="calculator-n-slider" className="text-foreground font-bold flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-cyan-500" />
            <span>Array Size (n):</span>
          </label>
          <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-300">
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
          className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-cyan-500"
        />

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-muted-foreground">Quick Presets:</span>
          {[10, 50, 100, 250, 500, 1000].map((preset) => (
            <button
              key={preset}
              onClick={() => setArraySize(preset)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                arraySize === preset
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedAlgo === algoId
                    ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500 font-bold shadow-sm"
                    : "bg-secondary text-muted-foreground border border-border hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {ALGORITHMS[algoId].name}
              </button>
            ))}
          </div>

          {/* Operation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Best Case Operations */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                Best Case Comparisons
              </span>
              <span className="text-xl font-mono font-extrabold text-emerald-800 dark:text-emerald-300">
                {singleResult.bestComp.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {singleResult.bestSwaps.toLocaleString()} {singleResult.operationName}
              </span>
            </div>

            {/* Average Case Operations */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400">
                Average Case Comparisons
              </span>
              <span className="text-xl font-mono font-extrabold text-amber-800 dark:text-amber-300">
                {singleResult.avgComp.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Theoretical expected operations
              </span>
            </div>

            {/* Worst Case Operations */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold uppercase text-rose-700 dark:text-rose-400">
                Worst Case Comparisons
              </span>
              <span className="text-xl font-mono font-extrabold text-rose-800 dark:text-rose-300">
                {singleResult.worstComp.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {singleResult.worstSwaps.toLocaleString()} {singleResult.operationName}
              </span>
            </div>
          </div>

          {/* Real-World Context Insight */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-secondary/50 text-xs text-foreground leading-relaxed font-mono">
            <span className="text-cyan-600 dark:text-cyan-300 font-bold">Scaling Insight: </span>
            For an array of <strong className="text-foreground">n = {arraySize}</strong>, {ALGORITHMS[selectedAlgo].name} requires up to{" "}
            <strong className="text-cyan-600 dark:text-cyan-300">{singleResult.worstComp.toLocaleString()} comparisons</strong>.
            {selectedAlgo === "merge" || selectedAlgo === "quick" ? (
              <span> The recursion tree depth reaches <strong className="text-purple-600 dark:text-purple-300">~{singleResult.depth} activation levels</strong>.</span>
            ) : (
              <span> If you double n to {arraySize * 2}, the work will approximately quadruple to <strong className="text-rose-600 dark:text-rose-300">{((arraySize * 2 * (arraySize * 2 - 1)) / 2).toLocaleString()} operations</strong>.</span>
            )}
          </div>
        </div>
      )}

      {/* CROSS-ALGORITHM COMPARISON VIEW */}
      {viewMode === "cross" && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              Worst-Case Comparisons at n = {arraySize}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              O(n log n) vs O(n²) Scalability Gap
            </span>
          </div>

          {/* Bar Chart Comparison */}
          <div className="space-y-3">
            {crossResults.map((item) => {
              const percent = Math.max(3, Math.round((item.worstComp / maxWorstComp) * 100));

              return (
                <div key={item.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-foreground">{item.name}</span>
                    <span className={`font-bold ${item.id === "merge" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      {item.worstComp.toLocaleString()} operations
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-lg bg-secondary overflow-hidden relative">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full rounded-lg transition-all duration-300 ${
                        item.id === "merge"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm"
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

          <div className="p-3.5 rounded-xl border border-border bg-secondary/50 text-[11px] font-mono text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              Notice how Merge Sort takes only <strong className="text-emerald-600 dark:text-emerald-300">{crossResults.find(r => r.id === 'merge')?.worstComp.toLocaleString()}</strong> operations, while quadratic algorithms take <strong className="text-rose-600 dark:text-rose-400">{maxWorstComp.toLocaleString()}</strong>.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
