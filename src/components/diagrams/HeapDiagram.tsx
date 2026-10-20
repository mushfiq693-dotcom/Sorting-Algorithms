"use client";

import React, { useState } from "react";
import {
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  GitFork,
  Scale,
  Zap,
  Info,
} from "lucide-react";

export function HeapDiagram() {
  const [activeTab, setActiveTab] = useState<"mapping" | "sift-up" | "sift-down" | "heapify">("mapping");
  const [selectedHeapType, setSelectedHeapType] = useState<"min" | "max">("min");

  // Sample heap nodes: [10, 15, 30, 40, 50, 100, 40]
  const sampleArr = selectedHeapType === "min" ? [10, 20, 15, 30, 40, 50, 60] : [90, 75, 80, 50, 60, 40, 30];

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-500" />
          <span className="text-foreground font-bold">
            Binary Heap (Array-as-Tree Complete Invariant)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
            Peek Root: O(1)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Insert / Extract: O(log n)
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Build-Heap (Heapify): O(n)
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("mapping")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "mapping"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitFork className="h-3.5 w-3.5" />
            <span>Array-to-Tree Pointerless Mapping</span>
          </button>
          <button
            onClick={() => setActiveTab("sift-up")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "sift-up"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Sift-Up (Bubble-Up on Insert)</span>
          </button>
          <button
            onClick={() => setActiveTab("sift-down")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "sift-down"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Sift-Down (Bubble-Down on Extract)</span>
          </button>
          <button
            onClick={() => setActiveTab("heapify")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "heapify"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Linear O(n) Heapify Proof</span>
          </button>
        </div>

        {/* Min/Max switch */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg border border-border">
          <button
            onClick={() => setSelectedHeapType("min")}
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
              selectedHeapType === "min"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Min-Heap
          </button>
          <button
            onClick={() => setSelectedHeapType("max")}
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
              selectedHeapType === "max"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Max-Heap
          </button>
        </div>
      </div>

      {/* Main Blueprint Display Chamber */}
      <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        {/* TAB 1: Array-to-Tree Pointerless Mapping */}
        {activeTab === "mapping" && (
          <div className="w-full space-y-6">
            <div className="text-center space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                How a 1D Array Represents a Complete Binary Tree with Zero Pointers
              </h4>
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                No `left` or `right` pointer objects needed! Parent-child relationships are derived in $O(1)$ through simple index arithmetic.
              </p>
            </div>

            {/* Tree Visualization SVG */}
            <div className="relative w-full max-w-xl mx-auto h-[200px] flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                {/* Edges from Root (0) to (1) and (2) */}
                <line x1="250" y1="30" x2="140" y2="90" stroke="currentColor" className="text-border" strokeWidth="2" />
                <line x1="250" y1="30" x2="360" y2="90" stroke="currentColor" className="text-border" strokeWidth="2" />

                {/* Edges from (1) to (3) and (4) */}
                <line x1="140" y1="90" x2="80" y2="150" stroke="currentColor" className="text-border" strokeWidth="2" />
                <line x1="140" y1="90" x2="200" y2="150" stroke="currentColor" className="text-border" strokeWidth="2" />

                {/* Edges from (2) to (5) and (6) */}
                <line x1="360" y1="90" x2="300" y2="150" stroke="currentColor" className="text-border" strokeWidth="2" />
                <line x1="360" y1="90" x2="420" y2="150" stroke="currentColor" className="text-border" strokeWidth="2" />

                {/* Nodes */}
                {[
                  { idx: 0, x: 250, y: 30, val: sampleArr[0], label: "Root [0]" },
                  { idx: 1, x: 140, y: 90, val: sampleArr[1], label: "Left [1]" },
                  { idx: 2, x: 360, y: 90, val: sampleArr[2], label: "Right [2]" },
                  { idx: 3, x: 80, y: 150, val: sampleArr[3], label: "[3]" },
                  { idx: 4, x: 200, y: 150, val: sampleArr[4], label: "[4]" },
                  { idx: 5, x: 300, y: 150, val: sampleArr[5], label: "[5]" },
                  { idx: 6, x: 420, y: 150, val: sampleArr[6], label: "[6]" },
                ].map((n) => (
                  <g key={n.idx} className="cursor-pointer transition-transform hover:scale-110">
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="20"
                      className="fill-card stroke-amber-500/80 dark:stroke-amber-400 stroke-2"
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      className="font-mono text-xs font-bold fill-foreground"
                    >
                      {n.val}
                    </text>
                    <text
                      x={n.x}
                      y={n.y - 24}
                      textAnchor="middle"
                      className="font-mono text-[10px] font-semibold fill-amber-600 dark:fill-amber-400"
                    >
                      i={n.idx}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Downward Connector Arrow */}
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-500 font-bold">
              <span>Level-Order Breadth-First Array Serialization</span>
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>

            {/* 1D Array Representation */}
            <div className="w-full max-w-xl mx-auto flex flex-col gap-1.5 items-center">
              <div className="flex items-center gap-1.5 sm:gap-2 justify-center flex-wrap">
                {sampleArr.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 min-w-[50px] sm:min-w-[58px]"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground">[{idx}]</span>
                    <span className="text-sm font-mono font-bold text-foreground">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulas Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mx-auto text-xs font-mono">
              <div className="p-3 rounded-xl border border-border bg-secondary/40 text-center">
                <span className="text-muted-foreground block text-[11px]">Parent of node i:</span>
                <span className="font-bold text-amber-500 text-sm">⌊(i - 1) / 2⌋</span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-secondary/40 text-center">
                <span className="text-muted-foreground block text-[11px]">Left Child of node i:</span>
                <span className="font-bold text-cyan-500 text-sm">2i + 1</span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-secondary/40 text-center">
                <span className="text-muted-foreground block text-[11px]">Right Child of node i:</span>
                <span className="font-bold text-purple-500 text-sm">2i + 2</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Sift-Up (Insertion) */}
        {activeTab === "sift-up" && (
          <div className="w-full space-y-5 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                Sift-Up (Bubble-Up): Restoring Invariant on Insert
              </h4>
              <p className="text-xs text-muted-foreground">
                New element lands at the first vacant leaf index $[n]$ and rises along its ancestry line in $O(\log n)$ swaps.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground font-bold shrink-0">Step 1</span>
                <div>
                  <span className="font-bold text-foreground">Append to End:</span>
                  <p className="text-muted-foreground mt-0.5">Place new key $x$ into index $[n]$. Heap remains a complete binary tree without empty slots.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold shrink-0">Step 2</span>
                <div>
                  <span className="font-bold text-foreground">Compare with Parent:</span>
                  <p className="text-muted-foreground mt-0.5">Let $p = \lfloor (curr - 1) / 2 \rfloor$. If $arr[curr] &lt; arr[p]$ (for Min-Heap), swap them immediately.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">Step 3</span>
                <div>
                  <span className="font-bold text-foreground">Repeat Until Settled:</span>
                  <p className="text-muted-foreground mt-0.5">Continue bubbling up until $curr = 0$ (Root reached) or parent already satisfies the heap property. At most $\lfloor \log_2 n \rfloor$ swaps.</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2.5">
              <Zap className="h-4 w-4 shrink-0 text-amber-500" />
              <span>
                <strong>Why logarithmic?</strong> A complete tree of $n$ nodes has height $h = \lfloor \log_2 n \rfloor$. The newly inserted leaf traverses at most a single branch from leaf to root.
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: Sift-Down (Extraction) */}
        {activeTab === "sift-down" && (
          <div className="w-full space-y-5 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                Sift-Down (Bubble-Down): Extracting Root &amp; Rebalancing
              </h4>
              <p className="text-xs text-muted-foreground">
                Root is removed, last leaf takes its spot, and sinks downward by swapping with the optimal child.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground font-bold shrink-0">Step 1</span>
                <div>
                  <span className="font-bold text-foreground">Extract Root:</span>
                  <p className="text-muted-foreground mt-0.5">Cache $arr[0]$ to return. Overwrite $arr[0] = arr[n - 1]$ and pop the last element.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold shrink-0">Step 2</span>
                <div>
                  <span className="font-bold text-foreground">Pick Best Child:</span>
                  <p className="text-muted-foreground mt-0.5">Inspect left ($2i+1$) and right ($2i+2$). In a Min-Heap, pick $\min(left, right)$. In a Max-Heap, pick $\max(left, right)$.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">Step 3</span>
                <div>
                  <span className="font-bold text-foreground">Sink Down:</span>
                  <p className="text-muted-foreground mt-0.5">If the chosen child violates the heap property with the parent, swap them and recurse downward. Max depth is $\le \log_2 n$.</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs text-cyan-800 dark:text-cyan-200 flex items-center gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-cyan-500" />
              <span>
                <strong>Crucial Invariant:</strong> Why swap with the <em>smaller</em> of two children in a Min-Heap? Because the new parent must be smaller than <em>both</em> subtrees!
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: Linear O(n) Heapify Proof */}
        {activeTab === "heapify" && (
          <div className="w-full space-y-5 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-foreground">
                Mathematical Proof: Why Build-Heap is Linear $O(n)$ Instead of $O(n \log n)$
              </h4>
              <p className="text-xs text-muted-foreground">
                Sequential insertions take $O(n \log n)$. But Bottom-Up Heapify runs in strict $O(n)$ time!
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3 text-xs font-mono leading-relaxed">
              <p className="text-foreground font-semibold">
                Most nodes live near the bottom of the tree where heights are smallest:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Level 0 (Leaves): $n/2$ nodes, height = 0 $\implies 0$ work</li>
                <li>Level 1: $n/4$ nodes, height = 1 $\implies \le 1$ swap each</li>
                <li>Level 2: $n/8$ nodes, height = 2 $\implies \le 2$ swaps each</li>
                <li>Root Level: Only 1 node, height = $\log_2 n \implies \le \log n$ swaps</li>
              </ul>
              <div className="p-3 rounded-lg bg-card border border-border/80 text-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {"$$\\text{Total Work} = \\sum_{h=0}^{\\log n} \\frac{n}{2^{h+1}} \\cdot h = \\frac{n}{2} \\sum_{h=0}^{\\log n} \\frac{h}{2^h} \\le \\frac{n}{2} \\cdot 2 = O(n)$$"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center space-y-1">
                <span className="text-muted-foreground block text-[11px]">N Sequential Inserts</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">O(n log n)</span>
                <p className="text-[10px] text-muted-foreground">Leaves do maximum work</p>
              </div>
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-1">
                <span className="text-muted-foreground block text-[11px]">Bottom-Up Heapify</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">O(n) Linear</span>
                <p className="text-[10px] text-muted-foreground">Leaves do ZERO work!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
