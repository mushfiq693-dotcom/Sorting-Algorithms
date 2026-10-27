"use client";

import React, { useState } from "react";
import {
  Search,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Workflow,
  Compass,
  RotateCw,
  Gauge,
  Mountain,
} from "lucide-react";

export function BinarySearchPatternsDiagram() {
  const [activeTab, setActiveTab] = useState<
    "lower-upper" | "rotated" | "search-on-answer" | "peak"
  >("lower-upper");

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-emerald-500" />
          <span className="text-foreground font-bold">
            Binary Search Structural Patterns &amp; Invariants
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Time Complexity: O(log n) Halving
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Auxiliary Space: O(1) Iterative
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
            Search Space: Monotonic Predicates
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("lower-upper")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "lower-upper"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Lower &amp; Upper Bound [L, R)</span>
        </button>

        <button
          onClick={() => setActiveTab("rotated")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "rotated"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <RotateCw className="h-3.5 w-3.5" />
          <span>Rotated Sorted Array (Pivot Invariant)</span>
        </button>

        <button
          onClick={() => setActiveTab("search-on-answer")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "search-on-answer"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Gauge className="h-3.5 w-3.5" />
          <span>Search on Answer (Monotonic Predicate)</span>
        </button>

        <button
          onClick={() => setActiveTab("peak")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "peak"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mountain className="h-3.5 w-3.5" />
          <span>Peak Element (Gradient Slope Climb)</span>
        </button>
      </div>

      {/* Tab 1: Lower & Upper Bound */}
      {activeTab === "lower-upper" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Architecture Card */}
          <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Workflow className="h-4 w-4" /> Half-Open Boundary Invariant: [low, high)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                STL std::lower_bound
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Standard binary search checks equality (<code>arr[mid] == target</code>). Boundary search instead partitions the entire universe into two halves via a monotonic predicate:
            </p>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  1. Lower Bound (First index i where arr[i] ≥ target):
                </span>
                <span className="text-muted-foreground">
                  If <code>arr[mid] &gt;= target</code> &rarr; <code>high = mid</code> (target could be at mid or left)<br />
                  Else &rarr; <code>low = mid + 1</code> (target must be strictly to right).
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                  2. Upper Bound (First index i where arr[i] &gt; target):
                </span>
                <span className="text-muted-foreground">
                  If <code>arr[mid] &gt; target</code> &rarr; <code>high = mid</code> (strictly greater is at mid or left)<br />
                  Else &rarr; <code>low = mid + 1</code> (must be strictly right).
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-purple-500/20 bg-purple-500/5">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                  3. Duplication Frequency:
                </span>
                <span className="text-muted-foreground">
                  <code>Frequency = UpperBound(X) - LowerBound(X)</code> in exactly <code>2 × O(log n)</code> steps!
                </span>
              </div>
            </div>

            <div className="mt-2 p-2.5 rounded-lg bg-secondary/40 border border-border text-[11px] font-mono text-muted-foreground">
              <span className="text-foreground font-semibold">Loop Termination Invariant:</span> When <code>low == high</code>, the exact partition index is isolated without off-by-one errors.
            </div>
          </div>

          {/* Graphical Walkthrough */}
          <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-500" /> Search Space Partition Visualization
            </span>

            {/* Visual Partition Array */}
            <div className="p-3 rounded-lg border border-border bg-background/50 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">
                Target = 5 in Sorted Array [2, 3, 5, 5, 5, 7, 8, 11]
              </span>
              <div className="grid grid-cols-8 gap-1.5 text-center font-mono text-xs">
                <div className="p-2 rounded bg-secondary/80 border border-border">
                  <span className="block text-[10px] text-muted-foreground">0</span>2
                </div>
                <div className="p-2 rounded bg-secondary/80 border border-border">
                  <span className="block text-[10px] text-muted-foreground">1</span>3
                </div>
                <div className="p-2 rounded bg-emerald-500/20 border-2 border-emerald-500 font-bold text-emerald-600 dark:text-emerald-300">
                  <span className="block text-[9px] text-emerald-600 dark:text-emerald-400">LB=2</span>5
                </div>
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold text-foreground">
                  <span className="block text-[10px] text-muted-foreground">3</span>5
                </div>
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold text-foreground">
                  <span className="block text-[10px] text-muted-foreground">4</span>5
                </div>
                <div className="p-2 rounded bg-cyan-500/20 border-2 border-cyan-500 font-bold text-cyan-600 dark:text-cyan-300">
                  <span className="block text-[9px] text-cyan-600 dark:text-cyan-400">UB=5</span>7
                </div>
                <div className="p-2 rounded bg-secondary/80 border border-border">
                  <span className="block text-[10px] text-muted-foreground">6</span>8
                </div>
                <div className="p-2 rounded bg-secondary/80 border border-border">
                  <span className="block text-[10px] text-muted-foreground">7</span>11
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">LowerBound = Index 2</span>
                <span className="text-purple-500 font-bold">Count = 5 - 2 = 3</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">UpperBound = Index 5</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Range Query:</strong> Duplicate instances of target reside precisely on the half-open interval <code>[LB, UB)</code>.
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Target Missing:</strong> If target is absent, <code>LB == UB</code>, perfectly indicating frequency 0 without branch faults.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rotated Sorted Array */}
      {activeTab === "rotated" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-primary flex items-center gap-1.5">
                <RotateCw className="h-4 w-4" /> The One-Half-Always-Sorted Invariant
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                LeetCode 33
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              When a sorted array is rotated at an unknown pivot, slicing it at any midpoint <code>mid</code> produces at least <strong>one strictly sorted contiguous half</strong>.
            </p>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg border border-blue-500/20 bg-blue-500/5">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                  1. Determine Which Half is Sorted:
                </span>
                <span className="text-muted-foreground">
                  If <code>arr[low] &lt;= arr[mid]</code> &rarr; <strong>Left Half</strong> is monotonically sorted.<br />
                  Else &rarr; <strong>Right Half</strong> is monotonically sorted.
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  2. Containment Decision (Left Sorted):
                </span>
                <span className="text-muted-foreground">
                  If <code>target &gt;= arr[low] &amp;&amp; target &lt; arr[mid]</code> &rarr; <code>high = mid - 1</code><br />
                  Else &rarr; <code>low = mid + 1</code> (discard sorted left half entirely).
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-purple-500/20 bg-purple-500/5">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                  3. Containment Decision (Right Sorted):
                </span>
                <span className="text-muted-foreground">
                  If <code>target &gt; arr[mid] &amp;&amp; target &lt;= arr[high]</code> &rarr; <code>low = mid + 1</code><br />
                  Else &rarr; <code>high = mid - 1</code>.
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-blue-500" /> Pivot &amp; Inflection Point Diagram
            </span>

            {/* Rotated Visual Array */}
            <div className="p-3 rounded-lg border border-border bg-background/50 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">
                Array: [4, 5, 6, 7, 0, 1, 2], Mid = Index 3 (Val 7), Target = 0
              </span>

              <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-xs">
                <div className="p-2 rounded bg-blue-500/20 border border-blue-500/50">
                  <span className="block text-[9px] text-blue-500">L (0)</span>4
                </div>
                <div className="p-2 rounded bg-blue-500/20 border border-blue-500/50">
                  <span className="block text-[9px] text-blue-500">1</span>5
                </div>
                <div className="p-2 rounded bg-blue-500/20 border border-blue-500/50">
                  <span className="block text-[9px] text-blue-500">2</span>6
                </div>
                <div className="p-2 rounded bg-amber-500/20 border-2 border-amber-500 font-bold text-amber-600 dark:text-amber-300">
                  <span className="block text-[9px] text-amber-500">M (3)</span>7
                </div>
                <div className="p-2 rounded bg-emerald-500/20 border-2 border-emerald-500 font-bold text-emerald-600 dark:text-emerald-300">
                  <span className="block text-[9px] text-emerald-500">Target (4)</span>0
                </div>
                <div className="p-2 rounded bg-secondary/80 border border-border">
                  <span className="block text-[9px] text-muted-foreground">5</span>1
                </div>
                <div className="p-2 rounded bg-secondary/80 border border-border">
                  <span className="block text-[9px] text-muted-foreground">H (6)</span>2
                </div>
              </div>

              <div className="p-2 rounded-lg bg-secondary/30 border border-border/80 text-[11px] font-mono">
                <p className="text-foreground">
                  <strong>Analysis:</strong> <code>arr[L] (4) &lt;= arr[M] (7)</code> &rarr; Left half <code>[4, 5, 6, 7]</code> is sorted!
                </p>
                <p className="text-muted-foreground mt-1">
                  Is target (0) inside <code>[4, 7]</code>? <strong>No</strong>. Therefore target MUST be in the unsorted right half &rarr; <code>low = mid + 1</code>.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs">
              <strong>Guaranteed O(log n):</strong> Even with rotation, one branch is ruled out completely in each iteration.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Search on Answer */}
      {activeTab === "search-on-answer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Gauge className="h-4 w-4" /> Monotonic Predicate Invariant: f(x)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                LeetCode 875 &amp; 410
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              When the problem asks for the <em>minimum</em> or <em>maximum</em> possible value of a parameter (e.g. eating speed, capacity), and evaluating feasibility is monotonic:
            </p>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  1. Monotonicity Criterion:
                </span>
                <span className="text-muted-foreground">
                  If speed <code>k</code> can finish within <code>H</code> hours, then any speed <code>k&#39; &gt; k</code> is also guaranteed to finish!
                  Search space becomes: <code>[False, False, ..., True, True]</code>.
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                  2. Boundary Reduction:
                </span>
                <span className="text-muted-foreground">
                  If <code>canFinish(mid) == true</code> &rarr; <code>ans = mid</code>, <code>high = mid - 1</code> (seek slower feasible speed)<br />
                  Else &rarr; <code>low = mid + 1</code> (speed is too slow, must speed up).
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-purple-500/20 bg-purple-500/5">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                  3. Integer Ceiling Division Formula:
                </span>
                <span className="text-muted-foreground">
                  Hours for pile <code>p</code> at speed <code>k</code>: <code>ceil(p / k) = (p + k - 1) / k</code>. Prevents floating point errors!
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Predicate Truth-Value Step Function
            </span>

            <div className="p-3 rounded-lg border border-border bg-background/50 flex flex-col gap-3 font-mono">
              <span className="text-[10px] text-muted-foreground">
                Piles = [3, 6, 7, 11], H = 8 hours. Search Space k ∈ [1, 11]
              </span>

              {/* Predicate Step Function */}
              <div className="grid grid-cols-6 gap-1 text-center text-xs">
                <div className="p-2 rounded bg-red-500/15 border border-red-500/30">
                  <span className="block text-[9px] text-muted-foreground">k=1</span>
                  <span className="text-red-500 font-bold">27h ❌</span>
                </div>
                <div className="p-2 rounded bg-red-500/15 border border-red-500/30">
                  <span className="block text-[9px] text-muted-foreground">k=2</span>
                  <span className="text-red-500 font-bold">15h ❌</span>
                </div>
                <div className="p-2 rounded bg-red-500/15 border border-red-500/30">
                  <span className="block text-[9px] text-muted-foreground">k=3</span>
                  <span className="text-red-500 font-bold">10h ❌</span>
                </div>
                <div className="p-2 rounded bg-emerald-500/25 border-2 border-emerald-500 font-bold text-emerald-600 dark:text-emerald-300 shadow-sm">
                  <span className="block text-[9px] text-emerald-500 font-bold">k=4 ★</span>
                  <span>8h ✅</span>
                </div>
                <div className="p-2 rounded bg-emerald-500/15 border border-emerald-500/30">
                  <span className="block text-[9px] text-muted-foreground">k=5</span>
                  <span className="text-emerald-500">8h ✅</span>
                </div>
                <div className="p-2 rounded bg-emerald-500/15 border border-emerald-500/30">
                  <span className="block text-[9px] text-muted-foreground">k=11</span>
                  <span className="text-emerald-500">4h ✅</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-secondary/30 border border-border/80 text-[11px]">
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Transition Inflection Point = k = 4 (Optimal Minimum Speed)
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Binary search on answers locates the exact transition between <strong>Impossible</strong> and <strong>Feasible</strong> in <code>O(N · log(maxPile))</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Universality:</strong> Capacity to Ship Packages (LC 1011), Split Array Largest Sum (LC 410), Aggressive Cows all use this identical template.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Peak Element */}
      {activeTab === "peak" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Mountain className="h-4 w-4" /> Gradient Ascending Invariant
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                LeetCode 162
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Binary search does <strong>NOT</strong> require a globally sorted array! It only requires a local directional gradient that guarantees the existence of a solution in one discarded partition.
            </p>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  1. Slope Test at Midpoint:
                </span>
                <span className="text-muted-foreground">
                  Compare <code>arr[mid]</code> with its adjacent right neighbor <code>arr[mid + 1]</code>:
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  2. Ascending Slope (arr[mid] &lt; arr[mid + 1]):
                </span>
                <span className="text-muted-foreground">
                  We are climbing uphill towards the right. Since <code>arr[n] = -∞</code>, the path must either keep climbing or drop, guaranteeing at least one peak on the right!<br />
                  &rarr; <code>low = mid + 1</code>.
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-blue-500/20 bg-blue-500/5">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                  3. Descending Slope (arr[mid] &gt; arr[mid + 1]):
                </span>
                <span className="text-muted-foreground">
                  We are on a downhill slope. Either <code>mid</code> itself is a peak, or a peak exists uphill to the left!<br />
                  &rarr; <code>high = mid</code>.
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-amber-500" /> Uphill Climbing Proof
            </span>

            {/* Hill Profile Visualization */}
            <div className="p-3 rounded-lg border border-border bg-background/50 flex flex-col gap-3 font-mono">
              <span className="text-[10px] text-muted-foreground">
                Array: [1, 2, 1, 3, 5, 6, 4]
              </span>

              <div className="flex items-end justify-between h-28 px-3 pt-2 pb-1 border-b border-border/80 text-xs">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-secondary/80 rounded-t h-6 border border-border"></div>
                  <span className="text-[10px] text-muted-foreground">1</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-amber-500/30 rounded-t h-12 border border-amber-500/50"></div>
                  <span className="text-[10px] text-muted-foreground">2</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-secondary/80 rounded-t h-6 border border-border"></div>
                  <span className="text-[10px] text-muted-foreground">1</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-secondary/80 rounded-t h-14 border border-border"></div>
                  <span className="text-[10px] text-muted-foreground">3</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-secondary/80 rounded-t h-20 border border-border"></div>
                  <span className="text-[10px] text-muted-foreground">5</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-emerald-500/40 rounded-t h-24 border-2 border-emerald-500 font-bold text-emerald-400"></div>
                  <span className="text-[10px] text-emerald-500 font-bold">6 ★</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-secondary/80 rounded-t h-16 border border-border"></div>
                  <span className="text-[10px] text-muted-foreground">4</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-secondary/30 border border-border/80 text-[11px]">
                <p className="text-foreground">
                  <strong>Invariant:</strong> Whenever you step in the direction of the strictly larger adjacent neighbor, you can never get trapped in a dead end because the boundaries are <code>-∞</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs">
              <Zap className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Key Takeaway:</strong> Binary search doesn&apos;t require total ordering — it only requires an elimination rule that safely discards 50% of the candidate space.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
