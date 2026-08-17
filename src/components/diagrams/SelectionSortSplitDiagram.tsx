"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Search, ArrowDown } from "lucide-react";

interface SelectionSnapshot {
  iteration: number;
  label: string;
  sortedPart: number[];
  unsortedPart: number[];
  minIndexInUnsorted: number;
  minValue: number;
  swapAction: string;
}

const SELECTION_SNAPSHOTS: SelectionSnapshot[] = [
  {
    iteration: 0,
    label: "Iteration 0 (Find min in unsorted)",
    sortedPart: [],
    unsortedPart: [64, 25, 12, 22, 11],
    minIndexInUnsorted: 4,
    minValue: 11,
    swapAction: "Minimum 11 found → Swap with arr[0] (64)",
  },
  {
    iteration: 1,
    label: "Iteration 1",
    sortedPart: [11],
    unsortedPart: [25, 12, 22, 64],
    minIndexInUnsorted: 1,
    minValue: 12,
    swapAction: "Minimum 12 found → Swap with arr[1] (25)",
  },
  {
    iteration: 2,
    label: "Iteration 2",
    sortedPart: [11, 12],
    unsortedPart: [25, 22, 64],
    minIndexInUnsorted: 1,
    minValue: 22,
    swapAction: "Minimum 22 found → Swap with arr[2] (25)",
  },
  {
    iteration: 3,
    label: "Iteration 3",
    sortedPart: [11, 12, 22],
    unsortedPart: [25, 64],
    minIndexInUnsorted: 0,
    minValue: 25,
    swapAction: "Minimum 25 found → Already in place at arr[3]",
  },
  {
    iteration: 4,
    label: "Iteration 4 (Final Settled)",
    sortedPart: [11, 12, 22, 25, 64],
    unsortedPart: [],
    minIndexInUnsorted: -1,
    minValue: 64,
    swapAction: "Last remaining element 64 is implicitly sorted.",
  },
];

export function SelectionSortSplitDiagram() {
  return (
    <div className="flex flex-col gap-4 w-full select-text">
      {/* Header Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-[#070b14]/90 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-emerald-500/30 border border-emerald-400" />
            <span className="text-emerald-300 font-semibold">Sorted Boundary (Left)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-500/30 border border-amber-400" />
            <span className="text-amber-300 font-semibold">Minimum Found (Scan)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-slate-800 border border-slate-700" />
            <span className="text-slate-400">Unsorted (Right)</span>
          </div>
        </div>
        <span className="text-cyan-400 font-bold">5 Elements [64, 25, 12, 22, 11]</span>
      </div>

      {/* Snapshots Stack */}
      <div className="flex flex-col gap-3">
        {SELECTION_SNAPSHOTS.map((snap) => {
          const isFinal = snap.unsortedPart.length === 0;

          return (
            <div
              key={snap.iteration}
              className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                isFinal
                  ? "border-emerald-500/50 bg-[#07130e]/80 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "border-slate-800/80 bg-[#0b101d]/90 hover:border-slate-700"
              }`}
            >
              {/* Left description */}
              <div className="flex flex-col gap-1 lg:w-64 shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isFinal
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {snap.label}
                  </span>
                  {isFinal && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-amber-300/90 font-mono mt-0.5">
                  {snap.swapAction}
                </p>
              </div>

              {/* Right: Visual Array with Split Boundary */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {/* Sorted Region */}
                {snap.sortedPart.map((val, sIdx) => (
                  <div key={`sorted-${sIdx}`} className="flex flex-col items-center gap-1">
                    <div className="w-11 h-12 sm:w-13 sm:h-14 rounded-xl flex items-center justify-center font-mono text-sm sm:text-base font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                      {val}
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 select-none">
                      [{sIdx}]
                    </span>
                  </div>
                ))}

                {/* Moving Partition Wall / Divider */}
                {!isFinal && snap.sortedPart.length > 0 && (
                  <div className="h-12 sm:h-14 w-0.5 bg-gradient-to-b from-cyan-400 via-amber-400 to-rose-400 mx-1 rounded-full shadow-[0_0_8px_#38bdf8]" />
                )}

                {/* Unsorted Region */}
                {snap.unsortedPart.map((val, uIdx) => {
                  const isMin = uIdx === snap.minIndexInUnsorted;
                  const actualIdx = snap.sortedPart.length + uIdx;

                  return (
                    <div key={`unsorted-${uIdx}`} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-11 h-12 sm:w-13 sm:h-14 rounded-xl flex items-center justify-center font-mono text-sm sm:text-base font-bold transition-all relative ${
                          isMin
                            ? "bg-amber-500/30 text-amber-200 border-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)]"
                            : "bg-slate-800/90 text-slate-300 border border-slate-700/80"
                        }`}
                      >
                        {isMin && (
                          <span className="absolute -top-2.5 px-1 py-0.2 rounded bg-amber-400 text-slate-950 text-[8px] font-mono font-extrabold uppercase">
                            MIN
                          </span>
                        )}
                        {val}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 select-none">
                        [{actualIdx}]
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
