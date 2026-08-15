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
      <div className="flex h-72 w-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 p-8 text-center text-muted-foreground">
        <div>
          <p className="text-sm font-medium">Array is empty.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Generate a random array or input custom numbers above.
          </p>
        </div>
      </div>
    );
  }

  const showValues = array.length <= 30;
  const showIndices = array.length <= 26;

  return (
    <div
      role="region"
      aria-label="Sorting Array Bars Visualization"
      className="relative flex h-80 w-full items-end justify-center gap-1 sm:gap-2 rounded-2xl border border-border/60 bg-gradient-to-b from-card/80 via-card/50 to-background/90 p-4 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden"
    >
      {/* Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:2rem_2rem]" />

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

        // Determine bar color and glow styling
        let barColor = "from-cyan-500 to-blue-600 shadow-cyan-500/20";
        let glowBorder = "border-cyan-400/30";
        let badgeText: string | null = null;
        let badgeColor = "";

        if (isPivot) {
          barColor = "from-purple-500 via-violet-500 to-indigo-600 shadow-purple-500/60";
          glowBorder = "border-purple-300 ring-2 ring-purple-400/60";
          badgeText = "Pivot";
          badgeColor = "bg-purple-500 text-white";
        } else if (isSwapping) {
          barColor = "from-rose-500 via-red-500 to-amber-500 shadow-rose-500/50";
          glowBorder = "border-rose-300 ring-2 ring-rose-400/60";
          badgeText = "Swap";
          badgeColor = "bg-rose-500 text-white";
        } else if (isOverwriting) {
          barColor = "from-amber-500 via-orange-500 to-rose-500 shadow-orange-500/50";
          glowBorder = "border-amber-300 ring-2 ring-amber-400/60";
          badgeText = "Write";
          badgeColor = "bg-orange-500 text-white";
        } else if (isComparing) {
          barColor = "from-amber-400 to-yellow-500 shadow-yellow-400/40";
          glowBorder = "border-amber-200 ring-2 ring-amber-400/50";
        } else if (isSorted) {
          barColor = "from-emerald-400 to-teal-500 shadow-emerald-500/30";
          glowBorder = "border-emerald-300/60";
        } else if (isLeftMerge) {
          barColor = "from-sky-400 to-blue-500 shadow-sky-400/20";
          glowBorder = "border-sky-300/40";
        } else if (isRightMerge) {
          barColor = "from-fuchsia-400 to-purple-600 shadow-fuchsia-400/20";
          glowBorder = "border-fuchsia-300/40";
        }

        // Height percentage (minimum 8% height so small values remain clearly visible)
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
                    ? "text-rose-300 scale-110"
                    : isOverwriting
                    ? "text-orange-300 scale-110"
                    : isComparing
                    ? "text-amber-300 scale-110"
                    : isSorted
                    ? "text-emerald-300"
                    : isLeftMerge
                    ? "text-sky-300"
                    : isRightMerge
                    ? "text-fuchsia-300"
                    : "text-muted-foreground/80 group-hover:text-foreground"
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
              className={`w-full rounded-t-lg bg-gradient-to-t ${barColor} ${glowBorder} border shadow-lg relative overflow-hidden transition-all duration-200`}
            >
              {/* Top highlight cap */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30 rounded-t-lg" />
            </motion.div>

            {/* Index Label Below */}
            {showIndices && (
              <span className="mt-1 text-[9px] sm:text-[10px] font-mono text-muted-foreground/60 select-none">
                {idx}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});
