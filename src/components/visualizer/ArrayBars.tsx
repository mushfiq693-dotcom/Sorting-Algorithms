"use client";

import React, { memo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  containerHeight?: string;
  className?: string;
}

interface ArrayBarItemProps {
  idx: number;
  value: number;
  maxVal: number;
  isPivot: boolean;
  isSwapping: boolean;
  isComparing: boolean;
  isSorted: boolean;
  isOverwriting: boolean;
  isInsideRange: boolean;
  isLeftMerge: boolean;
  isRightMerge: boolean;
  showValues: boolean;
  showIndices: boolean;
}

const ArrayBarItem = memo(function ArrayBarItem({
  idx,
  value,
  maxVal,
  isPivot,
  isSwapping,
  isComparing,
  isSorted,
  isOverwriting,
  isInsideRange,
  isLeftMerge,
  isRightMerge,
  showValues,
  showIndices,
}: ArrayBarItemProps) {
  // Canonical Academia Material Tokens
  let barColor = "from-[#B8953F] via-[#C9A962] to-[#D4B872] shadow-[0_0_12px_rgba(201,169,98,0.25)]";
  let glowBorder = "border-[#C9A962]/50";
  let badgeText: string | null = null;
  let badgeColor = "";

  if (isPivot) {
    barColor = "from-[#8B2635] via-[#A62D3F] to-[#C9A962] shadow-[0_0_20px_rgba(139,38,53,0.6)]";
    glowBorder = "border-[#C9A962] ring-2 ring-[#C9A962]/80";
    badgeText = "Pivot";
    badgeColor = "bg-[#8B2635] text-[#F3EAD8] font-bold border border-[#C9A962]/80 shadow-md shadow-black/40";
  } else if (isSwapping) {
    barColor = "from-[#8B2635] via-[#A62D3F] to-[#6E1E2A] shadow-[0_0_20px_rgba(139,38,53,0.7)]";
    glowBorder = "border-[#A62D3F] ring-2 ring-[#8B2635]/80";
    badgeText = "Swap";
    badgeColor = "bg-[#A62D3F] text-white font-bold border border-[#D4B872]/80 shadow-md shadow-black/40";
  } else if (isOverwriting) {
    barColor = "from-[#D97706] via-[#B45309] to-[#8B2635] shadow-[0_0_16px_rgba(217,119,6,0.5)]";
    glowBorder = "border-[#D4B872] ring-2 ring-[#D97706]/80";
    badgeText = "Write";
    badgeColor = "bg-gradient-to-r from-[#EA580C] to-[#D97706] text-white font-bold border border-amber-300 shadow-md shadow-orange-950/50";
  } else if (isComparing) {
    barColor = "from-[#D4B872] to-[#F59E0B] shadow-[0_0_16px_rgba(212,184,114,0.5)]";
    glowBorder = "border-[#D4B872] ring-2 ring-[#C9A962]/80";
  } else if (isSorted) {
    barColor = "from-[#10B981] to-[#047857] shadow-[0_0_14px_rgba(16,185,129,0.35)]";
    glowBorder = "border-[#34D399]/70";
  } else if (isLeftMerge) {
    barColor = "from-[#C9A962] to-[#B8953F] shadow-[0_0_12px_rgba(201,169,98,0.3)]";
    glowBorder = "border-[#D4B872]/60";
  } else if (isRightMerge) {
    barColor = "from-[#8B2635] to-[#A62D3F] shadow-[0_0_12px_rgba(139,38,53,0.3)]";
    glowBorder = "border-[#A62D3F]/60";
  }

  // Height percentage (minimum 8% height)
  const heightPercent = Math.max(8, Math.round((value / maxVal) * 86));

  return (
    <div
      className={`group relative flex flex-1 flex-col items-center justify-end h-full max-w-[48px] transition-opacity duration-150 ${
        !isInsideRange && !isSorted ? "opacity-30" : "opacity-100"
      }`}
    >
      {/* Status / Action Indicator Badge */}
      {badgeText && (
        <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
          <span
            className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase shadow-lg border whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 ${badgeColor}`}
          >
            {badgeText}
          </span>
          <div
            className={`w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] ${
              isPivot
                ? "border-t-[#8B2635]"
                : isSwapping
                ? "border-t-[#A62D3F]"
                : "border-t-[#D97706]"
            }`}
          />
        </div>
      )}

      {/* Value Label on Top */}
      {showValues && (
        <span
          className={`mb-1 text-[10px] sm:text-xs font-mono font-semibold shrink-0 transition-colors duration-150 ${
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

      {/* Vertical Bar Track & Animated Bar */}
      <div className="relative w-full flex-1 flex items-end justify-center min-h-0">
        <div
          style={{ height: `${heightPercent}%` }}
          className={`w-full rounded-t-lg bg-gradient-to-t ${barColor} ${glowBorder} border shadow-lg relative overflow-hidden transition-[height,transform,background-color,border-color,box-shadow] duration-150 will-change-[height,transform] ${
            isSwapping || isOverwriting
              ? "scale-105"
              : isComparing || isPivot
              ? "scale-102"
              : "scale-100"
          }`}
        >
          {/* Glassmorphic Top Highlight Cap */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-white/40 rounded-t-lg" />
        </div>
      </div>

      {/* Index Label Below */}
      {showIndices && (
        <span className="mt-1 text-[9px] sm:text-[10px] font-mono text-slate-500 shrink-0 select-none">
          {idx}
        </span>
      )}
    </div>
  );
});

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
  containerHeight = "h-52 sm:h-60",
  className = "",
}: ArrayBarsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (array.length === 0) {
    return (
      <div className={`flex ${containerHeight} w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/50 p-6 text-center backdrop-blur-md ${className}`}>
        {/* Array-Bar Motif Empty State Graphic */}
        <div className="flex items-end gap-1.5 h-10 mb-2 opacity-30" aria-hidden="true">
          <div className="w-2.5 h-3 rounded-t bg-cyan-500" />
          <div className="w-2.5 h-6 rounded-t bg-cyan-500" />
          <div className="w-2.5 h-9 rounded-t bg-cyan-500" />
          <div className="w-2.5 h-5 rounded-t bg-cyan-500" />
          <div className="w-2.5 h-8 rounded-t bg-cyan-500" />
        </div>
        <p className="text-xs font-mono font-semibold text-foreground">
          Array is uninitialized [length: 0]
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
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
      className={`relative flex ${containerHeight} w-full items-end justify-center gap-1 sm:gap-1.5 rounded bg-[#251E19] border border-[#4A3F35] pt-10 pb-3 px-3 sm:pt-11 sm:pb-4 sm:px-4 shadow-2xl backdrop-blur-xl overflow-hidden corner-flourish ${className}`}
    >
      {/* Classical Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#c9a96208_1px,transparent_1px),linear-gradient(to_bottom,#c9a96208_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

      {array.map((value, idx) => {
        const isPivot = pivotIndex === idx;
        const isSwapping = swappingIndices.includes(idx);
        const isComparing = comparingIndices.includes(idx) && !isSwapping;
        const isSorted = sortedIndices.includes(idx);
        const isOverwriting = overwritingIndex === idx;

        const isInsideRange =
          activeRange === null ||
          (idx >= activeRange[0] && idx <= activeRange[1]);

        let isLeftMerge = false;
        let isRightMerge = false;
        if (mergeRange) {
          if (idx >= mergeRange.left && idx <= mergeRange.mid) isLeftMerge = true;
          if (idx > mergeRange.mid && idx <= mergeRange.right) isRightMerge = true;
        }

        return (
          <ArrayBarItem
            key={idx}
            idx={idx}
            value={value}
            maxVal={maxVal}
            isPivot={isPivot}
            isSwapping={isSwapping}
            isComparing={isComparing}
            isSorted={isSorted}
            isOverwriting={isOverwriting}
            isInsideRange={isInsideRange}
            isLeftMerge={isLeftMerge}
            isRightMerge={isRightMerge}
            showValues={showValues}
            showIndices={showIndices}
          />
        );
      })}
    </div>
  );
});
