"use client";

import React, { useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Workflow,
  Repeat,
  Compass,
  MoveHorizontal,
} from "lucide-react";

export function TwoPointersDiagram() {
  const [activeTab, setActiveTab] = useState<"converging" | "container" | "fast-slow" | "cycle">("converging");

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-cyan-500" />
          <span className="text-foreground font-bold">
            Two Pointers Technique (Opposite &amp; Same-Direction)
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Time Complexity: O(n) Single Pass
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Auxiliary Space: O(1) In-Place
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
            Pruning: Eliminates O(n²) Brute Force
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("converging")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "converging"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <MoveHorizontal className="h-3.5 w-3.5" />
          <span>Opposite Converging (Two Sum)</span>
        </button>

        <button
          onClick={() => setActiveTab("container")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "container"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Container With Most Water</span>
        </button>

        <button
          onClick={() => setActiveTab("fast-slow")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "fast-slow"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Workflow className="h-3.5 w-3.5" />
          <span>Fast &amp; Slow (Reader vs Writer)</span>
        </button>

        <button
          onClick={() => setActiveTab("cycle")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "cycle"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Repeat className="h-3.5 w-3.5" />
          <span>Floyd Cycle Detection</span>
        </button>
      </div>

      {/* TAB 1: OPPOSITE CONVERGING POINTERS */}
      {activeTab === "converging" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Array Monotonic Scan */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-1.5">
                  <MoveHorizontal className="h-4 w-4 text-cyan-400" />
                  Sorted Monotonic Convergence
                </span>
                <span className="text-[11px] font-mono text-cyan-400">Target = 14</span>
              </div>

              {/* Graphical Visual */}
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                  {[
                    { val: 1, idx: 0, status: "elim" },
                    { val: 2, idx: 1, status: "elim" },
                    { val: 4, idx: 2, status: "elim" },
                    { val: 6, idx: 3, status: "left" },
                    { val: 8, idx: 4, status: "right" },
                    { val: 11, idx: 5, status: "elim" },
                    { val: 15, idx: 6, status: "elim" },
                  ].map((cell) => (
                    <div key={cell.idx} className="flex flex-col items-center">
                      <span className="text-[9px] text-muted-foreground font-mono">[{cell.idx}]</span>
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                          cell.status === "left"
                            ? "bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-md shadow-cyan-500/40"
                            : cell.status === "right"
                            ? "bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md shadow-amber-500/40"
                            : "bg-secondary/40 text-muted-foreground border-border/60 opacity-60 line-through"
                        }`}
                      >
                        {cell.val}
                      </div>
                      <span className="text-[8px] font-bold mt-0.5">
                        {cell.status === "left" ? "L →" : cell.status === "right" ? "← R" : ""}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 w-full text-center">
                  arr[L] + arr[R] = 6 + 8 = 14 🎯 <strong>MATCH FOUND!</strong>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                By starting pointers at outer extremes (<code className="text-foreground">L = 0</code>,{" "}
                <code className="text-foreground">R = n - 1</code>), every comparison determines the only viable
                direction to prune. The monotonicity of sorted values guarantees no viable pair is skipped.
              </p>
            </div>

            {/* Monotonic Search Space Pruning Grid */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400" />
                O(n²) Search Matrix Pruning Proof
              </span>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 flex flex-col gap-2 text-xs font-mono">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <span className="font-bold">Case 1: Sum &lt; Target</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      arr[L] + arr[R] &lt; T. Since array is sorted, arr[L] + any element &le; arr[R] is also strictly &lt; T.
                      <strong> Prune entire row L! (L++)</strong>
                    </p>
                  </div>
                  <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
                    <span className="font-bold">Case 2: Sum &gt; Target</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      arr[L] + arr[R] &gt; T. Since array is sorted, arr[R] + any element &ge; arr[L] is also strictly &gt; T.
                      <strong> Prune entire column R! (R--)</strong>
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded bg-secondary border border-border text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Candidate pairs: n × (n - 1) / 2</span>
                  <span className="text-emerald-400 font-bold">Evaluated: &le; n steps!</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Rather than checking all <code className="text-foreground">n² / 2</code> combinations in nested loops, each step
                prunes an entire row or column of the pair matrix. Total runtime is strictly bounded by{" "}
                <code className="text-foreground font-bold">O(n)</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTAINER WITH MOST WATER */}
      {activeTab === "container" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Geometric Area Formulation */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Geometric Boundary Invariant
              </span>

              <div className="p-4 rounded-lg bg-secondary/50 border border-border/80 flex flex-col items-center gap-3">
                {/* SVG Visual Container Simulation */}
                <svg className="w-full h-32" viewBox="0 0 280 120">
                  {/* Left Bar (h=8) */}
                  <rect x="40" y="20" width="10" height="90" fill="#38BDF8" rx="2" />
                  <text x="45" y="15" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">h=8</text>

                  {/* Right Bar (h=7) */}
                  <rect x="230" y="30" width="10" height="80" fill="#F59E0B" rx="2" />
                  <text x="235" y="25" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="bold">h=7</text>

                  {/* Water Fill Rectangle */}
                  <rect x="50" y="30" width="180" height="80" fill="#0EA5E9" fillOpacity="0.25" stroke="#0284C7" strokeDasharray="4 2" />
                  <text x="140" y="75" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold">
                    Area = (230 - 40) × min(8, 7) = 49
                  </text>

                  {/* Baseline */}
                  <line x1="20" y1="110" x2="260" y2="110" stroke="#64748B" strokeWidth="2" />
                </svg>

                <div className="text-[11px] font-mono text-muted-foreground text-center">
                  Formula: <strong className="text-foreground">Area(L, R) = (R - L) × min(height[L], height[R])</strong>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                The trapped water volume is constrained by the <em>shorter</em> of the two boundary walls. Any pair between
                them will have a smaller width.
              </p>
            </div>

            {/* Why Move the Shorter Pointer Proof */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Mathematical Elimination Theorem
              </span>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 flex flex-col gap-2.5 text-xs">
                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                  <strong className="block mb-1 text-emerald-400">Lemma (Taller Pointer Invariance):</strong>
                  If <code className="text-foreground">height[L] &lt; height[R]</code>, moving <code className="text-foreground">R</code> inward to any <code className="text-foreground">R&apos;</code> will strictly yield:
                  <div className="mt-1 font-bold text-foreground bg-secondary/80 p-1.5 rounded">
                    Area(L, R&apos;) &le; (R&apos; - L) × height[L] &lt; (R - L) × height[L] = Area(L, R)
                  </div>
                </div>

                <div className="text-muted-foreground text-xs leading-relaxed">
                  <strong>Conclusion:</strong> Keeping the shorter boundary and advancing the taller boundary inward
                  <em> can never produce a larger area</em>! Therefore, all pairs <code className="text-foreground">(L, R - 1), (L, R - 2)...</code> are provably redundant and can be safely eliminated in one step.
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                By always advancing the shorter line inward, we explore all potentially larger area candidates in strictly{" "}
                <code className="text-foreground font-bold">O(n)</code> time instead of brute-force checking all pairs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAST & SLOW POINTERS (READER VS WRITER) */}
      {activeTab === "fast-slow" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reader / Writer Pointer Mechanism */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Workflow className="h-4 w-4 text-teal-400" />
                In-Place Reader vs Writer Compaction
              </span>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-16 text-[10px] text-muted-foreground uppercase font-bold">Writer:</div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                      Slow Pointer
                    </span>
                    <span className="text-[10px] text-muted-foreground">→ Holds boundary of unique elements</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-16 text-[10px] text-muted-foreground uppercase font-bold">Reader:</div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                      Fast Pointer
                    </span>
                    <span className="text-[10px] text-muted-foreground">→ Scans unexplored elements ahead</span>
                  </div>
                </div>

                {/* State Strip */}
                <div className="p-2 rounded bg-card border border-border flex items-center justify-between text-[11px]">
                  <span>arr[0...slow] = <strong>Sorted Unique Prefix</strong></span>
                  <span className="text-emerald-400 font-bold">O(1) Aux Memory</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Solves classic in-place modification problems (LeetCode 26: Remove Duplicates, LeetCode 283: Move Zeroes)
                without allocating secondary vectors or hash sets.
              </p>
            </div>

            {/* Invariant Step Logic */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Step Decision Matrix
              </span>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 flex flex-col gap-2 font-mono text-xs">
                <div className="p-2 rounded bg-secondary border border-border/60">
                  <span className="text-foreground font-bold">1. Duplicate Encountered:</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    <code className="text-amber-400">arr[fast] === arr[slow]</code>: Do not advance writer. Just increment{" "}
                    <code className="text-cyan-400">fast++</code> to skip redundant copy.
                  </p>
                </div>

                <div className="p-2 rounded bg-secondary border border-border/60">
                  <span className="text-foreground font-bold">2. New Unique Encountered:</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    <code className="text-emerald-400">arr[fast] !== arr[slow]</code>: Advance writer{" "}
                    <code className="text-cyan-400">slow++</code> and copy <code className="text-foreground">arr[slow] = arr[fast]</code>.
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                When <code className="text-foreground">fast</code> reaches the end of the array, the sub-array{" "}
                <code className="text-foreground">arr[0...slow]</code> contains all unique elements in-place in exactly{" "}
                <code className="text-foreground font-bold">O(n)</code> operations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FLOYD'S TORTOISE AND HARE */}
      {activeTab === "cycle" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Speed Differential Math */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Repeat className="h-4 w-4 text-amber-400" />
                Relative Velocity &amp; Catch-Up Theorem
              </span>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 flex flex-col gap-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-secondary">
                  <span>Slow Pointer Speed:</span>
                  <span className="text-cyan-400 font-bold">1 step / tick</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-secondary">
                  <span>Fast Pointer Speed:</span>
                  <span className="text-amber-400 font-bold">2 steps / tick</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <span>Relative Distance Reduction:</span>
                  <span className="font-bold">2 - 1 = 1 node / tick</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                In any cyclic graph or linked list with cycle length <code className="text-foreground">C</code>, the relative
                distance between Fast and Slow decreases by exactly 1 on every step. Fast is guaranteed to catch Slow in{" "}
                <code className="text-foreground font-bold">&le; C</code> steps.
              </p>
            </div>

            {/* Cycle Head Algebraic Proof */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-purple-400" />
                Cycle Entrance Derivation Proof
              </span>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 flex flex-col gap-2 font-mono text-xs">
                <p className="text-[11px] text-muted-foreground">
                  Let <code className="text-foreground">F</code> = distance from head to cycle entrance.<br />
                  Let <code className="text-foreground">a</code> = distance from cycle entrance to meeting point.<br />
                  Let <code className="text-foreground">C</code> = cycle perimeter.
                </p>

                <div className="p-2 rounded bg-card border border-border text-[11px] leading-relaxed">
                  <code>Distance(Fast) = 2 × Distance(Slow)</code><br />
                  <code>F + k·C + a = 2(F + a)</code><br />
                  <code>F = k·C - a = (k - 1)·C + (C - a)</code>
                </div>

                <div className="text-[10px] text-cyan-300 font-sans">
                  <strong>Key Consequence:</strong> Distance from head to cycle entrance (<code className="text-foreground font-mono">F</code>)
                  equals the distance from the meeting point to cycle entrance (<code className="text-foreground font-mono">C - a</code>)!
                  Resetting one pointer to head and moving both 1 step at a time guarantees they collide at the exact cycle entrance.
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Powers LeetCode 141 (Linked List Cycle), LeetCode 142 (Linked List Cycle II), and LeetCode 287 (Find Duplicate Number).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
