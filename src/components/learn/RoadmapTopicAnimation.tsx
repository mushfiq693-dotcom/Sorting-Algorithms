"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlgorithmId } from "@/types/sorting";
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  Zap,
  Cpu,
  Database,
  GitBranch,
  Repeat,
  Activity,
  CheckCircle2,
  TrendingUp,
  Clock,
  HardDrive,
  ArrowLeftRight,
} from "lucide-react";

interface RoadmapTopicAnimationProps {
  topicId: AlgorithmId;
}

export function RoadmapTopicAnimation({ topicId }: RoadmapTopicAnimationProps) {
  // Timer tick for loop cycling
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % 100);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-xl border border-border/70 bg-gradient-to-r from-secondary/40 via-background/70 to-secondary/30 p-3 sm:p-3.5 backdrop-blur-md shadow-inner overflow-hidden relative">
      {/* Subtle background circuit watermark */}
      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none select-none">
        <Cpu className="w-32 h-32" />
      </div>

      <div className="flex flex-col gap-2">
        {/* Topic-specific Micro Animation Stage */}
        <div className="h-16 sm:h-20 w-full flex items-center justify-center relative">
          {topicId === "bubble" && <BubbleSortMiniAnimation tick={tick} />}
          {topicId === "selection" && <SelectionSortMiniAnimation tick={tick} />}
          {topicId === "insertion" && <InsertionSortMiniAnimation tick={tick} />}
          {topicId === "merge" && <MergeSortMiniAnimation tick={tick} />}
          {topicId === "quick" && <QuickSortMiniAnimation tick={tick} />}
          {topicId === "array" && <ArrayMiniAnimation tick={tick} />}
          {topicId === "string" && <StringMiniAnimation tick={tick} />}
          {topicId === "stack" && <StackMiniAnimation tick={tick} />}
          {topicId === "queue" && <QueueMiniAnimation tick={tick} />}
          {topicId === "linked-list" && <LinkedListMiniAnimation tick={tick} />}
          {topicId === "linear-search" && <LinearSearchMiniAnimation tick={tick} />}
          {topicId === "binary-search" && <BinarySearchMiniAnimation tick={tick} />}
          {topicId === "time-complexity" && <TimeComplexityMiniAnimation tick={tick} />}
          {topicId === "space-complexity" && <SpaceComplexityMiniAnimation tick={tick} />}
        </div>

        {/* Dynamic Micro Legend / Core Takeaway Badge */}
        <div className="flex items-center justify-between pt-1.5 border-t border-border/50 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold truncate">
            <Sparkles className="h-3 w-3 shrink-0 animate-pulse text-cyan-500" />
            <span className="truncate">
              {topicId === "bubble" && "Adjacent Compare & Swap: Heavier elements bubble to the right"}
              {topicId === "selection" && "Scan Unsorted Pool: Locates global minimum with strictly 1 swap"}
              {topicId === "insertion" && "Playing Card Strategy: Lifts item & shifts greater elements right"}
              {topicId === "merge" && "Divide & Conquer: Halves recursively then zips sorted sub-arrays"}
              {topicId === "quick" && "In-Place Partition: Partitions elements into Left < Pivot < Right"}
              {topicId === "array" && "Contiguous RAM: Instant O(1) jump via Base + (Index × 4B) address"}
              {topicId === "string" && "Contiguous Chars: Instant 1-Byte offsets, in-place reversal, & sliding windows"}
              {topicId === "stack" && "Strict LIFO Order: PUSH ↓ and POP ↑ operations only at the TOP"}
              {topicId === "queue" && "First-In, First-Out: Continuous inflow at REAR and outflow at FRONT"}
              {topicId === "linked-list" && "Scattered Heap Nodes: Dynamic memory linked by pointer references"}
              {topicId === "linear-search" && "Sequential Scan: Probes every slot 0..n-1 until target is found"}
              {topicId === "binary-search" && "Logarithmic Bisection: Cuts remaining search space by 50% each probe"}
              {topicId === "time-complexity" && "Asymptotic Scalability: O(1) vs O(log n) vs O(n) vs O(n²) growth"}
              {topicId === "space-complexity" && "Memory Bounds: Input storage vs transient recursion stack frames"}
            </span>
          </div>

          <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-500 shrink-0 font-bold">
            Live Preview
          </span>
        </div>
      </div>
    </div>
  );
}

/* 1. BUBBLE SORT MINI ANIMATION */
function BubbleSortMiniAnimation({ tick }: { tick: number }) {
  const step = tick % 4;
  // Simulating 5 bars with an adjacent swap happening
  const heights = [
    [30, 75, 45, 90, 60],
    [30, 45, 75, 90, 60], // swapped index 1 & 2
    [30, 45, 75, 60, 90], // swapped index 3 & 4 (90 bubbled to end)
    [30, 45, 60, 75, 90], // nearly sorted
  ][step];

  const comparingIndices = step === 0 ? [1, 2] : step === 1 ? [2, 3] : step === 2 ? [3, 4] : [];

  return (
    <div className="flex items-end gap-2 sm:gap-3 h-14">
      {heights.map((h, i) => {
        const isComparing = comparingIndices.includes(i);
        const isSorted = i >= 4 - step;
        return (
          <motion.div
            key={i}
            layout
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ height: `${h}%` }}
            className={`w-7 sm:w-9 rounded-md border flex items-end justify-center pb-1 text-[10px] font-mono font-bold transition-colors ${
              isComparing
                ? "bg-amber-500/90 border-amber-300 text-slate-950 shadow-md shadow-amber-500/30 scale-105"
                : isSorted
                ? "bg-emerald-500/80 border-emerald-400 text-slate-950"
                : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
            }`}
          >
            <span>{h}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* 2. SELECTION SORT MINI ANIMATION */
function SelectionSortMiniAnimation({ tick }: { tick: number }) {
  const step = tick % 4;
  const scanIndex = (tick % 5);
  const items = [12, 45, 20, 60, 18];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {items.map((val, i) => {
        const isMin = i === 0;
        const isScanned = i === scanIndex;
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`text-[9px] font-mono font-bold h-3 ${isMin ? "text-emerald-400" : isScanned ? "text-amber-400" : "invisible"}`}>
              {isMin ? "MIN" : "SCAN"}
            </span>
            <div
              className={`w-8 sm:w-10 h-9 rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                isMin
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-md shadow-emerald-500/20 scale-105"
                  : isScanned
                  ? "bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse"
                  : "bg-secondary border-border text-foreground"
              }`}
            >
              {val}
            </div>
            <span className="text-[9px] font-mono text-muted-foreground">[{i}]</span>
          </div>
        );
      })}
    </div>
  );
}

/* 3. INSERTION SORT MINI ANIMATION */
function InsertionSortMiniAnimation({ tick }: { tick: number }) {
  const isLifted = tick % 2 === 0;

  return (
    <div className="flex items-end gap-2.5 h-14 pb-1">
      <div className="w-8 h-9 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
        14
      </div>
      <div className="w-8 h-9 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
        28
      </div>

      {/* Floating Card inserting into position */}
      <motion.div
        animate={{ y: isLifted ? -12 : 0, scale: isLifted ? 1.08 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-8 h-9 rounded-lg border border-amber-400 bg-amber-500 text-slate-950 font-mono text-xs font-black flex items-center justify-center shadow-lg shadow-amber-500/30"
      >
        35
      </motion.div>

      <motion.div
        animate={{ x: isLifted ? 6 : 0 }}
        className="w-8 h-9 rounded-lg border border-border bg-secondary text-foreground font-mono text-xs font-bold flex items-center justify-center"
      >
        70
      </motion.div>
      <div className="w-8 h-9 rounded-lg border border-border bg-secondary text-foreground font-mono text-xs font-bold flex items-center justify-center">
        92
      </div>
    </div>
  );
}

/* 4. MERGE SORT MINI ANIMATION */
function MergeSortMiniAnimation({ tick }: { tick: number }) {
  const isMerged = tick % 2 === 1;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Split state vs Merged state */}
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ x: isMerged ? 12 : 0 }}
          className="flex items-center gap-1 p-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold"
        >
          <span>[12</span>
          <span>35]</span>
        </motion.div>

        <span className="text-muted-foreground text-xs font-bold">⚡</span>

        <motion.div
          animate={{ x: isMerged ? -12 : 0 }}
          className="flex items-center gap-1 p-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 font-mono text-xs font-bold"
        >
          <span>[20</span>
          <span>48]</span>
        </motion.div>
      </div>

      <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
        <span>Merged Output: [12, 20, 35, 48]</span>
      </div>
    </div>
  );
}

/* 5. QUICK SORT MINI ANIMATION */
function QuickSortMiniAnimation({ tick }: { tick: number }) {
  return (
    <div className="flex items-center gap-2">
      {/* Left zone: < Pivot */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 font-mono text-xs text-cyan-300 font-bold">
        <span>18</span>
        <span>24</span>
        <span className="text-[9px] text-cyan-400 block ml-0.5">(&lt;P)</span>
      </div>

      {/* Center Pivot */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="px-2.5 py-1.5 rounded-xl bg-amber-500 border-2 border-amber-300 text-slate-950 font-mono font-black text-xs shadow-md shadow-amber-500/40 flex flex-col items-center"
      >
        <span className="text-[8px] uppercase tracking-wider font-extrabold text-amber-950">PIVOT</span>
        <span>42</span>
      </motion.div>

      {/* Right zone: > Pivot */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-purple-500/10 border border-purple-500/30 font-mono text-xs text-purple-300 font-bold">
        <span>65</span>
        <span>89</span>
        <span className="text-[9px] text-purple-400 block ml-0.5">(&gt;P)</span>
      </div>
    </div>
  );
}

/* 6. ARRAY MINI ANIMATION */
function ArrayMiniAnimation({ tick }: { tick: number }) {
  const activeIdx = tick % 4;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3].map((idx) => {
          const isActive = idx === activeIdx;
          const address = `0x100${idx * 4}`;
          return (
            <div key={idx} className="flex flex-col items-center">
              <span className={`text-[9px] font-mono transition-colors ${isActive ? "text-cyan-400 font-bold" : "text-muted-foreground"}`}>
                {address}
              </span>
              <motion.div
                animate={{ scale: isActive ? 1.08 : 1 }}
                className={`w-10 sm:w-12 h-8 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30"
                    : "bg-secondary border-border text-foreground"
                }`}
              >
                <span>arr[{idx}]</span>
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] font-mono text-cyan-500 font-semibold flex items-center gap-1">
        <Zap className="h-3 w-3 text-cyan-400 fill-current animate-pulse" />
        <span>Direct Pointer Formula: Base + ({activeIdx} × 4B)</span>
      </div>
    </div>
  );
}

/* 7. STRING MINI ANIMATION */
function StringMiniAnimation({ tick }: { tick: number }) {
  const chars = ["R", "A", "C", "E", "C", "A", "R"];
  const step = tick % 4;
  const left = step;
  const right = chars.length - 1 - step;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1">
        {chars.map((char, idx) => {
          const isL = idx === left;
          const isR = idx === right;
          const isMatched = idx < left || idx > right;
          return (
            <div key={idx} className="flex flex-col items-center relative">
              <span className={`text-[8px] font-mono ${isL || isR ? "text-cyan-400 font-bold" : "text-muted-foreground"}`}>
                {isL ? "L↓" : isR ? "R↓" : `+${idx}B`}
              </span>
              <motion.div
                animate={{ scale: isL || isR ? 1.1 : 1 }}
                className={`w-7 sm:w-8 h-8 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                  isL || isR
                    ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30"
                    : isMatched
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-secondary border-border text-foreground"
                }`}
              >
                <span>{char}</span>
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] font-mono text-cyan-500 font-semibold flex items-center gap-1">
        <ArrowLeftRight className="h-3 w-3 text-cyan-400" />
        <span>Two-Pointer Inward Match: str[{left}] ⟷ str[{right}]</span>
      </div>
    </div>
  );
}

/* 7. STACK MINI ANIMATION */
function StackMiniAnimation({ tick }: { tick: number }) {
  const count = (tick % 3) + 1; // 1, 2, 3 items

  return (
    <div className="flex items-center gap-4">
      {/* Stack well */}
      <div className="w-24 sm:w-28 border-x-2 border-b-2 border-cyan-500/40 rounded-b-xl p-1 bg-secondary/30 flex flex-col-reverse gap-1 h-16 justify-start">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`h-4 rounded border font-mono text-[9px] font-bold flex items-center justify-between px-2 ${
              i === count - 1
                ? "bg-cyan-500 text-slate-950 border-cyan-300"
                : "bg-card border-border text-foreground"
            }`}
          >
            <span>Item #{i + 1}</span>
            {i === count - 1 && <span className="text-[8px] font-black">TOP</span>}
          </motion.div>
        ))}
      </div>

      <div className="text-left font-mono text-[10px] text-muted-foreground space-y-0.5">
        <div className="text-cyan-400 font-bold flex items-center gap-1">
          <span>PUSH ↓ / POP ↑</span>
        </div>
        <div>Top Index: [{count - 1}]</div>
        <div className="text-emerald-400">O(1) LIFO Strict</div>
      </div>
    </div>
  );
}

/* 8. QUEUE MINI ANIMATION */
function QueueMiniAnimation({ tick }: { tick: number }) {
  return (
    <div className="flex items-center gap-2">
      {/* Dequeue Front */}
      <div className="flex items-center text-[10px] font-mono text-rose-400 font-bold gap-0.5">
        <ArrowLeft className="h-3 w-3 animate-pulse" />
        <span>FRONT</span>
      </div>

      {/* Conveyor Tube */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-cyan-500/40 bg-secondary/40 shadow-inner">
        {[10, 20, 30].map((val, i) => (
          <motion.div
            key={i}
            animate={{ x: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            className="w-8 h-7 rounded-lg border border-border bg-card text-foreground font-mono text-xs font-bold flex items-center justify-center shadow-xs"
          >
            {val}
          </motion.div>
        ))}
      </div>

      {/* Enqueue Rear */}
      <div className="flex items-center text-[10px] font-mono text-cyan-400 font-bold gap-0.5">
        <span>REAR</span>
        <ArrowLeft className="h-3 w-3" />
      </div>
    </div>
  );
}

/* 9. LINKED LIST MINI ANIMATION */
function LinkedListMiniAnimation({ tick }: { tick: number }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {[14, 28, 42].map((val, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center rounded-lg border border-cyan-500/30 bg-card p-1 font-mono text-xs shadow-xs">
            <span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-300 font-bold rounded">
              {val}
            </span>
            <span className="px-1 text-[10px] text-muted-foreground">●</span>
          </div>
          {i < 2 ? (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
              className="text-cyan-500 text-xs font-bold"
            >
              ──▶
            </motion.div>
          ) : (
            <span className="text-[10px] font-mono text-muted-foreground/60">──▶ null</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* 10. LINEAR SEARCH MINI ANIMATION */
function LinearSearchMiniAnimation({ tick }: { tick: number }) {
  const currentIdx = tick % 5;
  const items = [14, 38, 92, 42, 60];
  const target = 42;

  return (
    <div className="flex items-center gap-2">
      {items.map((val, idx) => {
        const isProbe = idx === currentIdx;
        const isMatch = isProbe && val === target;
        return (
          <div key={idx} className="flex flex-col items-center gap-0.5">
            <div
              className={`w-7 sm:w-9 h-8 rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                isMatch
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/40 scale-110"
                  : isProbe
                  ? "bg-amber-500 text-slate-950 border-amber-300 animate-pulse"
                  : "bg-secondary border-border text-foreground"
              }`}
            >
              {val}
            </div>
            <span className="text-[9px] font-mono text-muted-foreground">
              {isMatch ? "✓" : isProbe ? "≠" : `[${idx}]`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* 11. BINARY SEARCH MINI ANIMATION */
function BinarySearchMiniAnimation({ tick }: { tick: number }) {
  const isSecondHalf = tick % 2 === 1;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5 font-mono text-xs">
        {/* Left half discarded */}
        <div className={`flex items-center gap-1 p-1 rounded border transition-all ${
          isSecondHalf ? "opacity-30 line-through border-border bg-secondary/30 text-muted-foreground" : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-bold"
        }`}>
          <span>10</span>
          <span>25</span>
          <span>35</span>
        </div>

        {/* Mid element */}
        <div className="px-2 py-1 rounded-lg border-2 border-amber-400 bg-amber-500 text-slate-950 font-bold shadow-md">
          MID: 50
        </div>

        {/* Right half active */}
        <div className="flex items-center gap-1 p-1 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold">
          <span>65</span>
          <span>80</span>
          <span>95</span>
        </div>
      </div>

      <span className="text-[10px] font-mono text-cyan-400 font-semibold">
        {isSecondHalf ? "50% Discarded ──▶ Narrowed to Right Sub-Interval" : "Probe MID ──▶ Compare Target"}
      </span>
    </div>
  );
}

/* 12. TIME COMPLEXITY MINI ANIMATION */
function TimeComplexityMiniAnimation({ tick }: { tick: number }) {
  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <div className="flex flex-col gap-1 w-44">
        {/* O(1) */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-emerald-400 font-bold">O(1) Constant</span>
          <div className="w-24 h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-emerald-400 rounded-full" />
          </div>
        </div>

        {/* O(log n) */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-cyan-400 font-bold">O(log n)</span>
          <div className="w-24 h-1.5 bg-cyan-500/20 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-cyan-400 rounded-full" />
          </div>
        </div>

        {/* O(n) */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-amber-400 font-bold">O(n) Linear</span>
          <div className="w-24 h-1.5 bg-amber-500/20 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-amber-400 rounded-full" />
          </div>
        </div>

        {/* O(n²) */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-rose-400 font-bold">O(n²) Quadratic</span>
          <div className="w-24 h-1.5 bg-rose-500/20 rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-rose-400 rounded-full" />
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl bg-card border border-border">
        <TrendingUp className="h-5 w-5 text-cyan-500 animate-pulse" />
        <span className="text-[9px] text-muted-foreground mt-0.5">Scale Curves</span>
      </div>
    </div>
  );
}

/* 13. SPACE COMPLEXITY MINI ANIMATION */
function SpaceComplexityMiniAnimation({ tick }: { tick: number }) {
  const frames = (tick % 3) + 1;

  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <div className="flex items-center gap-2 p-2 rounded-xl border border-border bg-card">
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-muted-foreground">Input Space</span>
          <div className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px]">
            Array[N] (Fixed)
          </div>
        </div>

        <span className="text-muted-foreground font-bold">+</span>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-emerald-400">Stack Frames</span>
          <div className="flex gap-0.5">
            {Array.from({ length: frames }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-3.5 h-6 rounded bg-emerald-500/80 border border-emerald-400 text-[8px] text-slate-950 font-bold flex items-center justify-center"
              >
                F{i + 1}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <span className="text-[10px] text-muted-foreground">
        Auxiliary Memory: <strong className="text-emerald-400 font-bold">{frames} Stack Frame{frames > 1 ? "s" : ""}</strong>
      </span>
    </div>
  );
}
