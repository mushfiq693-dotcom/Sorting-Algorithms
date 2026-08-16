"use client";

import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ArrayBarsProps {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  pivotIndex: number | null;
  activeRange: [number, number] | null;
  overwritingIndex: number | null;
  mergeRange?: { left: number; mid: number; right: number } | null;
  maxVal?: number;
}

export const ArrayBars = memo(function ArrayBars({
  array,
  comparingIndices,
  swappingIndices,
  sortedIndices,
  pivotIndex,
  activeRange,
  overwritingIndex,
  mergeRange,
  maxVal = Math.max(...(array.length ? array : [100]), 100),
}: ArrayBarsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (array.length === 0) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#070b14]/70 p-8 text-center backdrop-blur-md">
        {/* Array-Bar Motif Empty State Graphic */}
        <div className="flex items-end gap-1.5 h-12 mb-3 opacity-30" aria-hidden="true">
          <div className="w-2.5 h-4 rounded-t bg-cyan-400" />
          <div className="w-2.5 h-7 rounded-t bg-cyan-400" />
          <div className="w-2.5 h-11 rounded-t bg-cyan-400" />
          <div className="w-2.5 h-6 rounded-t bg-cyan-400" />
          <div className="w-2.5 h-9 rounded-t bg-cyan-400" />
        </div>
        <p className="text-xs font-mono font-semibold text-slate-300">
          Array is uninitialized [length: 0]
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Click &quot;Random Array&quot; or type custom values in the controls above to start.
        </p>
      </div>
    );
  }

  const showValues = array.length <= 30;
  const showIndices = array.length <= 26;

  return (
    <div
      role="region"
      aria-label="Sorting Array Bars Visualization"
      className="relative flex h-80 w-full items-end justify-center gap-1 sm:gap-2 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0c1220]/90 via-[#070b14]/95 to-[#050811] p-4 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden"
    >
      {/* Precision Dev-Tool Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

      {array.map((value, idx) => {
        const isPivot = pivotIndex === idx;
        const isSwapping = swappingIndices.includes(idx);
        const isComparing = comparingIndices.includes(idx) && !isSwapping;
        const isSorted = sortedIndices.includes(idx);
        const isOverwriting = overwritingIndex === idx;

        // Check if inside active subarray range
        const isInsideRange =
          activeRange === null ||
          (idx >= activeRange[0] && idx <= activeRange[1]);

        // Merge subarray colors
        let isLeftMerge = false;
        let isRightMerge = false;
        if (mergeRange) {
          if (idx >= mergeRange.left && idx <= mergeRange.mid) isLeftMerge = true;
          if (idx > mergeRange.mid && idx <= mergeRange.right) isRightMerge = true;
        }

        // Canonical Dev-Tool Color Tokens
        let barColor = "from-cyan-500 to-blue-600 shadow-[0_0_12px_rgba(56,189,248,0.15)]";
        let glowBorder = "border-cyan-400/40";
        let badgeText: string | null = null;
        let badgeColor = "";

        if (isPivot) {
          barColor = "from-purple-500 via-violet-500 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.5)]";
          glowBorder = "border-purple-300 ring-2 ring-purple-400/80";
          badgeText = "Pivot";
          badgeColor = "bg-purple-500 text-white";
        } else if (isSwapping) {
          barColor = "from-rose-500 via-red-500 to-amber-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]";
          glowBorder = "border-rose-300 ring-2 ring-rose-400/80";
          badgeText = "Swap";
          badgeColor = "bg-rose-500 text-white";
        } else if (isOverwriting) {
          barColor = "from-amber-500 via-orange-500 to-rose-500 shadow-[0_0_16px_rgba(249,115,22,0.5)]";
          glowBorder = "border-amber-300 ring-2 ring-amber-400/80";
          badgeText = "Write";
          badgeColor = "bg-orange-500 text-white";
        } else if (isComparing) {
          barColor = "from-amber-400 to-yellow-500 shadow-[0_0_16px_rgba(251,191,36,0.5)]";
          glowBorder = "border-amber-200 ring-2 ring-amber-400/80";
        } else if (isSorted) {
          barColor = "from-emerald-400 to-teal-500 shadow-[0_0_14px_rgba(16,185,129,0.35)]";
          glowBorder = "border-emerald-300/70";
        } else if (isLeftMerge) {
          barColor = "from-sky-400 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.2)]";
          glowBorder = "border-sky-300/50";
        } else if (isRightMerge) {
          barColor = "from-fuchsia-400 to-purple-600 shadow-[0_0_12px_rgba(217,70,239,0.2)]";
          glowBorder = "border-fuchsia-300/50";
        }

        // Height percentage (minimum 8% height)
        const heightPercent = Math.max(8, Math.round((value / maxVal) * 86));

        return (
          <div
            key={idx}
            className={`group relative flex flex-1 flex-col items-center justify-end h-full max-w-[48px] transition-opacity duration-200 ${
              !isInsideRange && !isSorted ? "opacity-30" : "opacity-100"
            }`}
          >
            {/* Status / Pivot Badge */}
            {badgeText && (
              <span
                className={`absolute -top-6 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono tracking-tight shadow-md animate-bounce z-10 ${badgeColor}`}
              >
                {badgeText}
              </span>
            )}

            {/* Value Label on Top */}
            {showValues && (
              <span
                className={`mb-1 text-[10px] sm:text-xs font-mono font-semibold transition-colors duration-150 ${
                  isPivot
                    ? "text-purple-300 scale-110 font-bold"
                    : isSwapping
                    ? "text-rose-300 scale-110 font-bold"
                    : isOverwriting
                    ? "text-orange-300 scale-110 font-bold"
                    : isComparing
                    ? "text-amber-300 scale-110 font-bold"
                    : isSorted
                    ? "text-emerald-300"
                    : isLeftMerge
                    ? "text-sky-300"
                    : isRightMerge
                    ? "text-fuchsia-300"
                    : "text-slate-400 group-hover:text-white"
                }`}
              >
                {value}
              </span>
            )}

            {/* Visual Bar with Motion */}
            <motion.div
              layout={!prefersReducedMotion}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: `${heightPercent}%`,
                opacity: 1,
                scale: isSwapping || isOverwriting ? 1.05 : isComparing || isPivot ? 1.02 : 1,
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      damping: 24,
                      stiffness: 300,
                      mass: 0.8,
                    }
              }
              className={`w-full rounded-t-lg bg-gradient-to-t ${barColor} ${glowBorder} border shadow-lg relative overflow-hidden transition-all duration-150`}
            >
              {/* Glassmorphic Top Highlight Cap */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-white/40 rounded-t-lg" />
            </motion.div>

            {/* Index Label Below */}
            {showIndices && (
              <span className="mt-1 text-[9px] sm:text-[10px] font-mono text-slate-500 select-none">
                {idx}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});
