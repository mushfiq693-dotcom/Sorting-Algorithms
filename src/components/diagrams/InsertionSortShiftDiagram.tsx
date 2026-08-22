"use client";

import React from "react";
import { ArrowRight, ArrowDown, Sparkles, CheckCircle2 } from "lucide-react";

interface InsertionSnapshot {
  step: number;
  label: string;
  key: number;
  keyIndex: number;
  sortedBefore: number[];
  shiftedElements: number[];
  insertIndex: number;
  arrayAfter: number[];
  explanation: string;
}

const INSERTION_SNAPSHOTS: InsertionSnapshot[] = [
  {
    step: 1,
    label: "Step 1 (Key = 3)",
    key: 3,
    keyIndex: 1,
    sortedBefore: [8],
    shiftedElements: [8],
    insertIndex: 0,
    arrayAfter: [3, 8, 5, 1, 9, 2],
    explanation: "Lift key=3. Compare with 8 (8 > 3) → Shift 8 right → Drop 3 at index [0].",
  },
  {
    step: 2,
    label: "Step 2 (Key = 5)",
    key: 5,
    keyIndex: 2,
    sortedBefore: [3, 8],
    shiftedElements: [8],
    insertIndex: 1,
    arrayAfter: [3, 5, 8, 1, 9, 2],
    explanation: "Lift key=5. Compare with 8 (8 > 5) → Shift 8 right. Stop at 3 (3 < 5) → Drop 5 at index [1].",
  },
  {
    step: 3,
    label: "Step 3 (Key = 1)",
    key: 1,
    keyIndex: 3,
    sortedBefore: [3, 5, 8],
    shiftedElements: [8, 5, 3],
    insertIndex: 0,
    arrayAfter: [1, 3, 5, 8, 9, 2],
    explanation: "Lift key=1. 8 > 1, 5 > 1, 3 > 1 → Shift 8, 5, 3 all right → Drop 1 at index [0].",
  },
  {
    step: 4,
    label: "Step 4 (Key = 9)",
    key: 9,
    keyIndex: 4,
    sortedBefore: [1, 3, 5, 8],
    shiftedElements: [],
    insertIndex: 4,
    arrayAfter: [1, 3, 5, 8, 9, 2],
    explanation: "Lift key=9. Compare with 8 (8 < 9) → 0 shifts required → Drop 9 at index [4].",
  },
  {
    step: 5,
    label: "Step 5 (Key = 2 — Final)",
    key: 2,
    keyIndex: 5,
    sortedBefore: [1, 3, 5, 8, 9],
    shiftedElements: [9, 8, 5, 3],
    insertIndex: 1,
    arrayAfter: [1, 2, 3, 5, 8, 9],
    explanation: "Lift key=2. Shift 9, 8, 5, 3 right → Drop 2 at index [1] → Entire array is sorted!",
  },
];

export function InsertionSortShiftDiagram() {
  return (
    <div className="flex flex-col gap-4 w-full select-text">
      {/* Header Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[8px]">
              K
            </span>
            <span className="text-amber-700 dark:text-amber-300 font-semibold">Lifted Key (Card)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-rose-500/30 border border-rose-500" />
            <span className="text-rose-700 dark:text-rose-300 font-semibold">Shifted Right (→)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-emerald-500/30 border border-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Sorted Portion</span>
          </div>
        </div>
        <span className="text-cyan-600 dark:text-cyan-400 font-bold">Input: [8, 3, 5, 1, 9, 2]</span>
      </div>

      {/* Snapshots Stack */}
      <div className="flex flex-col gap-3">
        {INSERTION_SNAPSHOTS.map((snap) => {
          const isFinal = snap.step === 5;

          return (
            <div
              key={snap.step}
              className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                isFinal
                  ? "border-emerald-500/50 bg-emerald-500/10 shadow-sm"
                  : "border-border bg-card hover:bg-secondary/40"
              }`}
            >
              {/* Left description */}
              <div className="flex flex-col gap-1 lg:w-72 shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isFinal
                        ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40"
                        : "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {snap.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                    Key: {snap.key}
                  </span>
                  {isFinal && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  {snap.explanation}
                </p>
              </div>

              {/* Right: Visual Result Array */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {snap.arrayAfter.map((val, idx) => {
                  const isInsertedKey = idx === snap.insertIndex;
                  const isSortedZone = idx <= snap.step;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-10 h-11 sm:w-12 sm:h-13 rounded-xl flex items-center justify-center font-mono text-sm sm:text-base font-bold transition-all relative ${
                          isFinal
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-500 text-white shadow-sm"
                            : isInsertedKey
                            ? "bg-amber-400 text-slate-950 font-extrabold shadow-sm scale-105"
                            : isSortedZone
                            ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/50"
                            : "bg-secondary text-muted-foreground border border-border"
                        }`}
                      >
                        {isInsertedKey && !isFinal && (
                          <span className="absolute -top-2 px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[7px] font-mono font-bold uppercase">
                            INSERT
                          </span>
                        )}
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
