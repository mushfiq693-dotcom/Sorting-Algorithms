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
  Hash,
  GitFork,
  RotateCcw,
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
          {topicId === "deque" && <DequeMiniAnimation tick={tick} />}
          {topicId === "stack" && <StackMiniAnimation tick={tick} />}
          {topicId === "queue" && <QueueMiniAnimation tick={tick} />}
          {topicId === "linked-list" && <LinkedListMiniAnimation tick={tick} />}
          {topicId === "hash-table" && <HashTableMiniAnimation tick={tick} />}
          {topicId === "binary-tree" && <BinaryTreeMiniAnimation tick={tick} />}
          {topicId === "bst" && <BstMiniAnimation tick={tick} />}
          {topicId === "avl-tree" && <AvlTreeMiniAnimation tick={tick} />}
          {topicId === "heap" && <HeapMiniAnimation tick={tick} />}
          {topicId === "priority-queue" && <PriorityQueueMiniAnimation tick={tick} />}
          {topicId === "union-find" && <UnionFindMiniAnimation tick={tick} />}
          {topicId === "linear-search" && <LinearSearchMiniAnimation tick={tick} />}
          {topicId === "binary-search" && <BinarySearchMiniAnimation tick={tick} />}
          {topicId === "backtracking" && <BacktrackingMiniAnimation tick={tick} />}
          {topicId === "time-complexity" && <TimeComplexityMiniAnimation tick={tick} />}
          {topicId === "space-complexity" && <SpaceComplexityMiniAnimation tick={tick} />}
          {/* Universal fallback for future roadmap expansions */}
          {![
            "bubble", "selection", "insertion", "merge", "quick",
            "array", "string", "deque", "stack", "queue", "linked-list", "hash-table",
            "binary-tree", "bst", "avl-tree", "heap", "priority-queue", "union-find",
            "linear-search", "binary-search", "backtracking", "time-complexity", "space-complexity"
          ].includes(topicId) && <DefaultMiniAnimation topicId={topicId} />}
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
              {topicId === "deque" && "Double-Ended Queue: O(1) Push and Pop from both Front and Rear boundaries"}
              {topicId === "linked-list" && "Scattered Heap Nodes: Dynamic memory linked by pointer references"}
              {topicId === "hash-table" && "Direct Hashing: h(k) = k % M converts keys into instant O(1) memory slots"}
              {topicId === "binary-tree" && "Hierarchical Branching: Root branches into Left & Right child subtrees"}
              {topicId === "bst" && "BST Property: Left (< Root) < Root < Right (> Root) with O(log n) Pruning"}
              {topicId === "avl-tree" && "Self-Balancing Rotations: Strict |BF| ≤ 1 invariant restored via O(1) LL/RR/LR/RL pivots"}
              {topicId === "heap" && "Pointerless Complete Tree: Contiguous RAM array mapping with O(log n) Sift-Up & Sift-Down"}
              {topicId === "priority-queue" && "Priority Dispatch: O(1) Highest-priority peek with O(log n) dynamic heap triage"}
              {topicId === "union-find" && "Disjoint Set Forests: Near-constant O(α(n)) connectivity with Path Compression & Union-by-Rank"}
              {topicId === "linear-search" && "Sequential Scan: Probes every slot 0..n-1 until target is found"}
              {topicId === "binary-search" && "Logarithmic Bisection: Cuts remaining search space by 50% each probe"}
              {topicId === "backtracking" && "Choose → Explore → Undo: Build solutions incrementally and prune dead ends via constraint backtracking"}
              {topicId === "time-complexity" && "Asymptotic Scalability: O(1) vs O(log n) vs O(n) vs O(n²) growth"}
              {topicId === "space-complexity" && "Memory Bounds: Input storage vs transient recursion stack frames"}
              {![
                "bubble", "selection", "insertion", "merge", "quick",
                "array", "string", "deque", "stack", "queue", "linked-list", "hash-table",
                "binary-tree", "bst", "avl-tree", "heap", "priority-queue", "union-find",
                "linear-search", "binary-search", "backtracking", "time-complexity", "space-complexity"
              ].includes(topicId) && "Interactive Algorithmic Stage: Visual execution engine & step telemetry"}
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

/* 8b. DEQUE MINI ANIMATION */
function DequeMiniAnimation({ tick }: { tick: number }) {
  const isFrontActive = (tick % 2) === 0;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2">
        {/* Front Push/Pop */}
        <div className={`flex items-center text-[9px] font-mono font-bold gap-0.5 px-1.5 py-0.5 rounded ${
          isFrontActive ? "bg-red-500/20 text-red-400 border border-red-500/40" : "text-muted-foreground"
        }`}>
          <ArrowLeft className="h-2.5 w-2.5" />
          <span>FRONT O(1)</span>
        </div>

        {/* Double-ended conveyor chamber */}
        <div className="flex items-center gap-1 p-1.5 rounded-xl border border-amber-500/40 bg-secondary/40 shadow-inner">
          {[15, 28, 42, 56].map((val, i) => (
            <motion.div
              key={i}
              animate={{ scale: (isFrontActive && i === 0) || (!isFrontActive && i === 3) ? 1.08 : 1 }}
              className={`w-7 sm:w-8 h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center shadow-xs transition-all ${
                i === 0
                  ? "bg-red-500/15 border-red-500/50 text-red-400"
                  : i === 3
                  ? "bg-blue-500/15 border-blue-500/50 text-blue-400"
                  : "bg-card border-border text-foreground"
              }`}
            >
              {val}
            </motion.div>
          ))}
        </div>

        {/* Rear Push/Pop */}
        <div className={`flex items-center text-[9px] font-mono font-bold gap-0.5 px-1.5 py-0.5 rounded ${
          !isFrontActive ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : "text-muted-foreground"
        }`}>
          <span>REAR O(1)</span>
          <ArrowRight className="h-2.5 w-2.5" />
        </div>
      </div>

      <div className="text-[10px] font-mono text-amber-500 font-semibold flex items-center gap-1">
        <ArrowLeftRight className="h-3 w-3" />
        <span>Bidirectional O(1) Push & Pop • Circular Ring Buffer</span>
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

/* 9b. HASH TABLE MINI ANIMATION */
function HashTableMiniAnimation({ tick }: { tick: number }) {
  const keys = [12, 25, 38];
  const activeKeyIdx = tick % keys.length;
  const activeKey = keys[activeKeyIdx];
  const activeSlot = activeKey % 4;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-3">
        {/* Hash Key Input */}
        <div className="px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-400">
          key: {activeKey}
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
        {/* Modulo Hash Math */}
        <div className="text-[10px] font-mono text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded border border-border">
          {activeKey} % 4 = <span className="text-cyan-400 font-bold">[{activeSlot}]</span>
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
        {/* Buckets */}
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3].map((slot) => {
            const isActive = slot === activeSlot;
            return (
              <motion.div
                key={slot}
                animate={{ scale: isActive ? 1.15 : 1 }}
                className={`w-7 h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30 font-extrabold"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {slot}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="text-[10px] font-mono text-cyan-500 font-semibold flex items-center gap-1">
        <Hash className="h-3 w-3 text-cyan-400" />
        <span>Direct Addressing: O(1) Memory Jump to Slot [{activeSlot}]</span>
      </div>
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

/* 11b. BACKTRACKING MINI ANIMATION */
function BacktrackingMiniAnimation({ tick }: { tick: number }) {
  const step = tick % 4;
  const board = [
    [1, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ][step % 1];
  const activeCell = step % 2 === 0 ? [0, 0] : [1, 2];

  return (
    <div className="flex flex-col items-center gap-1 font-mono">
      {/* Mini 4x4 board */}
      <div className="grid grid-cols-4 gap-0.5">
        {[0, 1, 2, 3].flatMap((r) =>
          [0, 1, 2, 3].map((c) => {
            const isQueen = (r === 0 && c === 0) || (r === 1 && c === 2);
            const isActive = r === activeCell[0] && c === activeCell[1];
            return (
              <div
                key={`${r}-${c}`}
                className={`aspect-square min-w-[22px] sm:min-w-[26px] rounded border flex items-center justify-center font-mono text-[9px] font-bold transition-all ${
                  isQueen
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm"
                    : isActive
                    ? "bg-amber-500/30 text-amber-400 border-amber-400 animate-pulse"
                    : "bg-secondary/40 border-border/60 text-muted-foreground/50"
                }`}
              >
                {isQueen ? "♛" : isActive ? "?" : ""}
              </div>
            );
          })
        )}
      </div>

      <span className="text-[10px] text-fuchsia-500 font-semibold">
        {step % 2 === 0 ? "Place Queen ──▶ Validate Constraints" : "Backtrack ──▶ Undo & Try Next Column"}
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

function BinaryTreeMiniAnimation({ tick }: { tick: number }) {
  // Cycle through 0: Root, 1: Left child, 2: Right child
  const activeNode = tick % 3;

  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <div className="relative w-36 h-14 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 144 56">
          {/* Edges */}
          <line
            x1="72"
            y1="14"
            x2="36"
            y2="42"
            stroke={activeNode === 1 ? "#10b981" : "#475569"}
            strokeWidth={activeNode === 1 ? "2.5" : "1.5"}
            className="transition-all duration-300"
          />
          <line
            x1="72"
            y1="14"
            x2="108"
            y2="42"
            stroke={activeNode === 2 ? "#10b981" : "#475569"}
            strokeWidth={activeNode === 2 ? "2.5" : "1.5"}
            className="transition-all duration-300"
          />

          {/* Root */}
          <circle
            cx="72"
            cy="14"
            r="10"
            fill={activeNode === 0 ? "#047857" : "#1e293b"}
            stroke={activeNode === 0 ? "#34d399" : "#64748b"}
            strokeWidth="2"
            className="transition-all duration-300"
          />
          <text x="72" y="17.5" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold">
            1
          </text>

          {/* Left Child */}
          <circle
            cx="36"
            cy="42"
            r="9"
            fill={activeNode === 1 ? "#047857" : "#1e293b"}
            stroke={activeNode === 1 ? "#34d399" : "#64748b"}
            strokeWidth="2"
            className="transition-all duration-300"
          />
          <text x="36" y="45.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">
            2
          </text>

          {/* Right Child */}
          <circle
            cx="108"
            cy="42"
            r="9"
            fill={activeNode === 2 ? "#047857" : "#1e293b"}
            stroke={activeNode === 2 ? "#34d399" : "#64748b"}
            strokeWidth="2"
            className="transition-all duration-300"
          />
          <text x="108" y="45.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">
            3
          </text>
        </svg>
      </div>

      <div className="flex flex-col text-[10px]">
        <span className="text-muted-foreground">Active Node:</span>
        <strong className="text-emerald-400 font-bold">
          {activeNode === 0 ? "Root (Node 1)" : activeNode === 1 ? "Left Child (Node 2)" : "Right Child (Node 3)"}
        </strong>
      </div>
    </div>
  );
}

/* 14. BST (BINARY SEARCH TREE) MINI ANIMATION */
function BstMiniAnimation({ tick }: { tick: number }) {
  // Cycle between searching for 75 (right branch) and searching for 25 (left branch)
  const step = tick % 4;
  const isSearchRight = step < 2;
  const targetKey = isSearchRight ? 75 : 25;
  const isAtRoot = step === 0 || step === 2;
  const isMatched = step === 1 || step === 3;

  return (
    <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
      {/* Target Key Indicator */}
      <div className="flex flex-col items-center">
        <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Target</span>
        <div className={`px-2 py-0.5 rounded-md border text-xs font-bold transition-all ${
          isMatched
            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-xs"
            : "bg-amber-500/15 border-amber-500/40 text-amber-400"
        }`}>
          Key: {targetKey}
        </div>
        <span className="text-[8px] text-muted-foreground mt-0.5 font-medium">
          {isAtRoot ? (isSearchRight ? "> 50 (Right)" : "< 50 (Left)") : "Match Found ✓"}
        </span>
      </div>

      {/* Mini Tree Branching */}
      <div className="relative w-32 sm:w-36 h-12 sm:h-14 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 144 56">
          {/* Left Branch */}
          <line
            x1="72"
            y1="14"
            x2="36"
            y2="42"
            stroke={!isSearchRight ? (isMatched ? "#10b981" : "#f59e0b") : "#334155"}
            strokeWidth={!isSearchRight ? "2.5" : "1.5"}
            strokeDasharray={!isSearchRight && isAtRoot ? "3 3" : undefined}
            className="transition-all duration-300"
          />
          {/* Right Branch */}
          <line
            x1="72"
            y1="14"
            x2="108"
            y2="42"
            stroke={isSearchRight ? (isMatched ? "#10b981" : "#f59e0b") : "#334155"}
            strokeWidth={isSearchRight ? "2.5" : "1.5"}
            strokeDasharray={isSearchRight && isAtRoot ? "3 3" : undefined}
            className="transition-all duration-300"
          />

          {/* Root Node: 50 */}
          <circle
            cx="72"
            cy="14"
            r="10"
            fill={isAtRoot ? "#d97706" : "#1e293b"}
            stroke={isAtRoot ? "#fbbf24" : "#64748b"}
            strokeWidth="2"
            className="transition-all duration-300"
          />
          <text x="72" y="17.5" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold">
            50
          </text>

          {/* Left Node: 25 (< 50) */}
          <circle
            cx="36"
            cy="42"
            r="9"
            fill={!isSearchRight && isMatched ? "#047857" : "#1e293b"}
            stroke={!isSearchRight && isMatched ? "#34d399" : "#64748b"}
            strokeWidth="2"
            className="transition-all duration-300"
          />
          <text x="36" y="45.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">
            25
          </text>

          {/* Right Node: 75 (> 50) */}
          <circle
            cx="108"
            cy="42"
            r="9"
            fill={isSearchRight && isMatched ? "#047857" : "#1e293b"}
            stroke={isSearchRight && isMatched ? "#34d399" : "#64748b"}
            strokeWidth="2"
            className="transition-all duration-300"
          />
          <text x="108" y="45.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">
            75
          </text>
        </svg>
      </div>

      {/* Decision Status */}
      <div className="flex flex-col text-[10px]">
        <span className="text-muted-foreground font-medium">BST Decision:</span>
        <strong className={`font-bold ${isMatched ? "text-emerald-400" : "text-amber-400"}`}>
          {isAtRoot ? (isSearchRight ? "75 > 50 (Prune Left)" : "25 < 50 (Prune Right)") : "O(log n) Leaf Hit!"}
        </strong>
      </div>
    </div>
  );
}

/* 15. AVL TREE (SELF-BALANCING ROTATION) MINI ANIMATION */
function AvlTreeMiniAnimation({ tick }: { tick: number }) {
  // Step 0: Skewed imbalance (BF = +2)
  // Step 1: Right-Rotate pivot in O(1)
  const isRotated = tick % 2 === 1;

  return (
    <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
      {/* Balance Factor Badge */}
      <div className="flex flex-col items-center">
        <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Balance</span>
        <div className={`px-2 py-0.5 rounded-md border text-xs font-bold transition-all ${
          isRotated
            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
            : "bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse"
        }`}>
          {isRotated ? "BF = 0 (Balanced)" : "BF = +2 (Skew)"}
        </div>
        <span className="text-[8px] text-muted-foreground mt-0.5 font-medium">
          {isRotated ? "|BF| ≤ 1 Invariant" : "Needs Rebalance"}
        </span>
      </div>

      {/* Dynamic Balanced vs Skewed SVG Tree */}
      <div className="relative w-32 sm:w-36 h-12 sm:h-14 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 144 56">
          {isRotated ? (
            /* Balanced Triangle: 20 at root, 10 at left, 30 at right */
            <>
              <line x1="72" y1="14" x2="36" y2="42" stroke="#10b981" strokeWidth="2" />
              <line x1="72" y1="14" x2="108" y2="42" stroke="#10b981" strokeWidth="2" />

              <circle cx="72" cy="14" r="10" fill="#047857" stroke="#34d399" strokeWidth="2" />
              <text x="72" y="17.5" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold">20</text>

              <circle cx="36" cy="42" r="9" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
              <text x="36" y="45.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">10</text>

              <circle cx="108" cy="42" r="9" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
              <text x="108" y="45.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">30</text>
            </>
          ) : (
            /* Imbalanced Left-Skewed Chain: 30 at root, 20 middle, 10 leaf */
            <>
              <line x1="100" y1="12" x2="68" y2="28" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="68" y1="28" x2="36" y2="44" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />

              <circle cx="100" cy="12" r="9" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
              <text x="100" y="15" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">30</text>

              <circle cx="68" cy="28" r="9" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="68" y="31" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">20</text>

              <circle cx="36" cy="44" r="9" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="36" y="47" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">10</text>
            </>
          )}
        </svg>
      </div>

      {/* Rotation Status */}
      <div className="flex flex-col text-[10px]">
        <span className="text-muted-foreground font-medium">Rotation Action:</span>
        <strong className={`font-bold flex items-center gap-1 ${isRotated ? "text-emerald-400" : "text-amber-400"}`}>
          <RotateCcw className={`h-3 w-3 ${isRotated ? "" : "animate-spin"}`} />
          <span>{isRotated ? "Right Rotation (LL)" : "Triggering Pivot ↻"}</span>
        </strong>
      </div>
    </div>
  );
}

/* 16. BINARY HEAP (POINTERLESS TREE & RAM ARRAY) MINI ANIMATION */
function HeapMiniAnimation({ tick }: { tick: number }) {
  const step = tick % 3;
  const heapArray = [10, 20, 15, 35, 42];

  return (
    <div className="flex flex-col items-center gap-1 font-mono">
      {/* Contiguous Array Slots */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {heapArray.map((val, idx) => {
          const isRoot = idx === 0;
          const isChildren = step === 1 && (idx === 1 || idx === 2);
          return (
            <div key={idx} className="flex flex-col items-center">
              <span className={`text-[8px] font-bold ${
                isRoot && step === 0 ? "text-emerald-400" : isChildren ? "text-amber-400" : "text-muted-foreground"
              }`}>
                {isRoot ? "ROOT [0]" : `[${idx}]`}
              </span>
              <motion.div
                animate={{ scale: (isRoot && step === 0) || isChildren ? 1.08 : 1 }}
                className={`w-7 sm:w-9 h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                  isRoot && step === 0
                    ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/30"
                    : isChildren
                    ? "bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse"
                    : "bg-secondary border-border text-foreground"
                }`}
              >
                <span>{val}</span>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Duality & Zero Pointer Formula */}
      <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
        <Zap className="h-3 w-3 text-amber-400 fill-current" />
        <span>
          {step === 0 && "Min-Heap Root: O(1) Instant Minimum Access at arr[0]"}
          {step === 1 && "Children Mapping: Left = 2i+1, Right = 2i+2 in contiguous RAM"}
          {step === 2 && "Sift-Down / Sift-Up: O(log n) tree maintenance with zero pointers"}
        </span>
      </div>
    </div>
  );
}

/* 17. PRIORITY QUEUE MINI ANIMATION */
function PriorityQueueMiniAnimation({ tick }: { tick: number }) {
  const step = tick % 3;

  const tasks = [
    { id: "VIP", prio: 99, label: "Critical", isVip: true },
    { id: "T2", prio: 75, label: "High", isVip: false },
    { id: "T3", prio: 40, label: "Normal", isVip: false },
    { id: "T4", prio: 15, label: "Low", isVip: false },
  ];

  return (
    <div className="flex flex-col items-center gap-1 font-mono">
      <div className="flex items-center gap-2">
        {/* Front Exit */}
        <div className="flex items-center text-[9px] font-bold text-emerald-400 gap-0.5">
          <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
          <span>DISPATCH O(1)</span>
        </div>

        {/* Priority Task Conveyor */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-amber-500/40 bg-secondary/40 shadow-inner">
          {tasks.map((task, i) => {
            const isDispatched = step === 2 && i === 0;
            const isPromoted = step === 1 && i === 0;
            return (
              <motion.div
                key={task.id}
                animate={{
                  scale: isPromoted ? 1.08 : 1,
                  opacity: isDispatched ? 0.4 : 1,
                  y: isPromoted ? -2 : 0,
                }}
                className={`px-2 py-0.5 rounded-lg border font-mono text-[11px] font-bold flex flex-col items-center shadow-xs transition-all ${
                  task.isVip
                    ? "bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/40"
                    : "bg-card border-border text-foreground"
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <span>P:{task.prio}</span>
                </div>
                <span className="text-[7px] uppercase tracking-wider font-semibold opacity-80">
                  {task.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Action Indicator */}
        <div className="text-[9px] font-bold text-cyan-400">
          {step === 2 ? "POPPED ✓" : step === 1 ? "SIFT-UP ↑" : "ENQUEUE ⤹"}
        </div>
      </div>

      <div className="text-[10px] text-cyan-500 font-semibold flex items-center gap-1">
        <Clock className="h-3 w-3 text-cyan-400" />
        <span>
          {step === 0 && "Arrival: Tasks dispatched by Priority metric, never arrival order"}
          {step === 1 && "Dynamic Triage: VIP Task (P:99) surges to front in O(log n)"}
          {step === 2 && "Dispatch: O(1) peek extraction at root powers OS thread schedulers"}
        </span>
      </div>
    </div>
  );
}

/* 18. UNION-FIND (DISJOINT SET UNION) MINI ANIMATION */
function UnionFindMiniAnimation({ tick }: { tick: number }) {
  const isMerged = tick % 2 === 1;

  return (
    <div className="flex flex-col items-center gap-1 font-mono">
      <div className="flex items-center gap-2.5">
        {/* Set 1 */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-bold shadow-xs">
          <span>Set A: [1, 2]</span>
        </div>

        <motion.div
          animate={{ scale: isMerged ? 1.15 : 1 }}
          className="text-amber-400 font-bold text-xs"
        >
          {isMerged ? "∪ Unite" : "vs"}
        </motion.div>

        {/* Set 2 */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs font-bold shadow-xs">
          <span>Set B: [3, 4]</span>
        </div>
      </div>

      <div className="text-[10px] text-cyan-500 font-semibold flex items-center gap-1">
        <GitBranch className="h-3 w-3 text-cyan-400" />
        <span>
          {isMerged
            ? "Path Compression: Merged root in near-constant O(α(n)) inverse Ackermann time"
            : "Disjoint Sets: find(x) verifies cycle-free partitions and component IDs in O(1)"}
        </span>
      </div>
    </div>
  );
}

/* 19. UNIVERSAL FALLBACK FOR UPCOMING EXPANSIONS */
function DefaultMiniAnimation({ topicId }: { topicId: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 font-mono">
      <div className="flex items-center gap-2 px-3 py-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-xs">
        <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
        <span className="text-xs font-bold capitalize">
          {topicId.replace(/-/g, " ")}
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
          Live Preview
        </span>
      </div>
      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-cyan-400" />
        <span>Deterministic algorithmic simulation & execution studio</span>
      </div>
    </div>
  );
}
