"use client";

import React from "react";
import { ArrowRight, CheckCircle2, GitCompare, ArrowDown } from "lucide-react";

interface PassSnapshot {
  passNumber: number;
  label: string;
  array: number[];
  comparisons: number;
  sortedIndices: number[];
  swappedPair: [number, number] | null;
  explanation: string;
}

const BUBBLE_PASSES: PassSnapshot[] = [
  {
    passNumber: 0,
    label: "Initial Unsorted State",
    array: [5, 1, 4, 2, 8],
    comparisons: 0,
    sortedIndices: [],
    swappedPair: null,
    explanation: "Original input array before passes begin.",
  },
  {
    passNumber: 1,
    label: "Pass 1 Completed",
    array: [1, 4, 2, 5, 8],
    comparisons: 4,
    sortedIndices: [4],
    swappedPair: [0, 1],
    explanation: "Largest value 8 bubbles to the rightmost index [4].",
  },
  {
    passNumber: 2,
    label: "Pass 2 Completed",
    array: [1, 2, 4, 5, 8],
    comparisons: 3,
    sortedIndices: [3, 4],
    swappedPair: [1, 2],
    explanation: "Next largest value 5 bubbles to index [3].",
  },
  {
    passNumber: 3,
    label: "Pass 3 Completed",
    array: [1, 2, 4, 5, 8],
    comparisons: 2,
    sortedIndices: [2, 3, 4],
    swappedPair: null,
    explanation: "Value 4 is confirmed in place at index [2].",
  },
  {
    passNumber: 4,
    label: "Pass 4 (Early Break / Settled)",
    array: [1, 2, 4, 5, 8],
    comparisons: 1,
    sortedIndices: [0, 1, 2, 3, 4],
    swappedPair: null,
    explanation: "0 swaps detected → early exit! Entire array is sorted.",
  },
];

export function BubbleSortTimelineDiagram() {
  return (
    <div className="flex flex-col gap-4 w-full select-text">
      {/* Header Info Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-cyan-500/20 bg-secondary/60 text-xs font-mono text-cyan-700 dark:text-cyan-300">
        <span className="flex items-center gap-1.5 font-bold">
          <GitCompare className="h-4 w-4 text-cyan-500" />
          Pass Formula: (n - 1) + (n - 2) + ... + 1 = 10 max comparisons
        </span>
        <span className="text-muted-foreground">Array length n = 5</span>
      </div>

      {/* Vertical Timeline Stack */}
      <div className="flex flex-col gap-3 relative">
        {BUBBLE_PASSES.map((pass, pIdx) => {
          const isFinal = pass.sortedIndices.length === pass.array.length;

          return (
            <div
              key={pass.passNumber}
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                isFinal
                  ? "border-emerald-500/50 bg-emerald-500/10 shadow-sm"
                  : pIdx === 0
                  ? "border-border bg-secondary/30"
                  : "border-border bg-card hover:bg-secondary/40"
              }`}
            >
              {/* Left: Pass Label & Metric */}
              <div className="flex flex-col gap-1 md:w-56 shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isFinal
                        ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40"
                        : pIdx === 0
                        ? "bg-secondary text-foreground border border-border"
                        : "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {pass.label}
                  </span>
                  {isFinal && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {pass.explanation}
                </p>
                {pass.comparisons > 0 && (
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400/90 flex items-center gap-1 mt-0.5">
                    <span>Comparisons in this pass:</span>
                    <strong>{pass.comparisons}</strong>
                  </span>
                )}
              </div>

              {/* Right: Visual Array Elements */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {pass.array.map((val, idx) => {
                  const isSorted = pass.sortedIndices.includes(idx);
                  const isNewlySorted =
                    pass.sortedIndices.length > 0 &&
                    pass.sortedIndices[0] === idx &&
                    pIdx > 0 &&
                    !isFinal;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-11 h-12 sm:w-13 sm:h-14 rounded-xl flex items-center justify-center font-mono text-sm sm:text-base font-bold shadow-sm transition-all ${
                          isFinal
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-500 text-white"
                            : isSorted
                            ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/60"
                            : isNewlySorted
                            ? "bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-500"
                            : "bg-secondary text-foreground border border-border"
                        }`}
                      >
                        {val}
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground select-none">
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
