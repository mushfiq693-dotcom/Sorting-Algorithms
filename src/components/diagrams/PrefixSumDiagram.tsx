"use client";

import React, { useState } from "react";
import {
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Workflow,
  Sliders,
  Grid,
  Divide,
  Hash,
  MoveRight,
} from "lucide-react";

export function PrefixSumDiagram() {
  const [activeTab, setActiveTab] = useState<"1d" | "2d" | "difference" | "hash">("1d");

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-500" />
          <span className="text-foreground font-bold">
            Prefix Sum &amp; Difference Arrays Engine Architecture
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Precomputation: O(N) Once
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Range Query: O(1) Instant
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
            Range Update: O(1) Boundary
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
            Space: O(N) or O(1) In-Place
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("1d")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "1d"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>1D Prefix Sum Construction</span>
        </button>

        <button
          onClick={() => setActiveTab("2d")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "2d"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Grid className="h-3.5 w-3.5" />
          <span>2D Matrix (Inclusion-Exclusion)</span>
        </button>

        <button
          onClick={() => setActiveTab("difference")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "difference"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Divide className="h-3.5 w-3.5" />
          <span>Difference Array (O(1) Updates)</span>
        </button>

        <button
          onClick={() => setActiveTab("hash")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "hash"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Hash className="h-3.5 w-3.5" />
          <span>Hash Prefix (Subarray Sum = K)</span>
        </button>
      </div>

      {/* Tab 1: 1D Prefix Sum */}
      {activeTab === "1d" && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              1D Prefix Sum: Precompute O(n) → Query Any Subarray in O(1)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Instead of iterating over indices <code className="text-emerald-500 font-mono">L ... R</code> each time a sum is requested (taking <code className="text-rose-500 font-mono">O(n)</code> per query), we precalculate cumulative sums in an auxiliary array <code className="text-emerald-500 font-mono">P</code> of size <code className="text-emerald-500 font-mono">N+1</code>. The difference of two prefix endpoints gives any contiguous sum in exactly 1 subtraction!
            </p>
          </div>

          {/* Interactive Dual Strip Blueprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Mathematical Recurrence Formula
              </span>
              <div className="p-3 rounded-lg bg-card border border-border font-mono text-xs text-foreground flex flex-col gap-1.5">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  P[0] = 0 (Base Case: empty prefix)
                </div>
                <div className="text-foreground">
                  P[i] = P[i - 1] + A[i - 1] &nbsp; (for i ≥ 1)
                </div>
                <div className="text-cyan-600 dark:text-cyan-400 pt-1 border-t border-border/60">
                  sum(L, R) = P[R + 1] - P[L] &nbsp; (O(1) Evaluation)
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Using 1-based indexing for <code className="font-mono text-foreground">P</code> means queries starting at index 0 (e.g., <code className="font-mono text-foreground">sum(0, 3) = P[4] - P[0]</code>) naturally evaluate without an <code className="font-mono text-foreground">if (L == 0)</code> branch check.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col gap-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                Visual Subtraction Mechanics
              </span>
              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <span className="font-bold">+ P[R+1]:</span> Cumulative sum from index 0 all the way through R
                </div>
                <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                  <span className="font-bold">- P[L]:</span> Unwanted prefix sum from index 0 up to L-1
                </div>
                <div className="p-2.5 rounded bg-primary/10 border border-primary/20 text-foreground font-semibold">
                  <span className="font-bold">= Exact Contiguous Sum:</span> Elements A[L] + A[L+1] + ... + A[R]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 2D Matrix (Inclusion-Exclusion) */}
      {activeTab === "2d" && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
              <Grid className="h-4 w-4 text-cyan-500" />
              2D Matrix Prefix Sum: Inclusion-Exclusion Principle
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To query any arbitrary rectangular subgrid from <code className="font-mono text-cyan-500">(r1, c1)</code> to <code className="font-mono text-cyan-500">(r2, c2)</code> in <code className="font-mono text-emerald-500">O(1)</code> time, we precompute a 2D cumulative matrix <code className="font-mono text-cyan-500">P[r][c]</code> where each entry stores the total sum of the subgrid from top-left <code className="font-mono text-foreground">(0,0)</code> down to <code className="font-mono text-foreground">(r-1, c-1)</code>.
            </p>
          </div>

          {/* 4-Term Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                <span>+ Term 1: Full Block</span>
              </div>
              <div className="text-xs font-mono font-semibold text-foreground">
                + P[r2+1][c2+1]
              </div>
              <p className="text-[11px] text-muted-foreground">
                The full rectangle extending from (0,0) down to the bottom-right corner (r2, c2).
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                <span>- Term 2: Top Strip</span>
              </div>
              <div className="text-xs font-mono font-semibold text-foreground">
                - P[r1][c2+1]
              </div>
              <p className="text-[11px] text-muted-foreground">
                Subtracts the unwanted rectangular region strictly above row r1.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                <span>- Term 3: Left Strip</span>
              </div>
              <div className="text-xs font-mono font-semibold text-foreground">
                - P[r2+1][c1]
              </div>
              <p className="text-[11px] text-muted-foreground">
                Subtracts the unwanted rectangular region strictly to the left of column c1.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                <span>+ Term 4: Top-Left Overlap</span>
              </div>
              <div className="text-xs font-mono font-semibold text-foreground">
                + P[r1][c1]
              </div>
              <p className="text-[11px] text-muted-foreground">
                Since the top-left area was subtracted TWICE, adding it back once restores mathematical balance.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-secondary/30 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="text-foreground font-bold">
              SubgridSum = P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Exactly 4 Arithmetic Operations (Strictly O(1))
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Difference Array */}
      {activeTab === "difference" && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
              <Divide className="h-4 w-4 text-amber-500" />
              Difference Array: Range Updates in O(1) + Linear O(n) Reconstruction
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a problem requires applying <code className="font-mono text-amber-500">Q</code> range updates like <code className="font-mono text-foreground">A[L...R] += val</code> on a static array, updating every cell takes <code className="font-mono text-rose-500">O(Q · N)</code>. Difference arrays reduce each range update to marking only <strong>two boundary endpoints</strong> in <code className="font-mono text-emerald-500">O(1)</code> time, followed by a single prefix sum pass to materialize all values at once!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col gap-2">
              <span className="text-xs font-bold text-foreground font-mono">1. Build Diff Array</span>
              <p className="text-xs font-mono text-muted-foreground">
                D[0] = A[0]<br />
                D[i] = A[i] - A[i - 1]
              </p>
              <p className="text-[11px] text-muted-foreground">
                Each cell stores the change from the preceding index.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col gap-2">
              <span className="text-xs font-bold text-foreground font-mono">2. Range Update [L, R] += val</span>
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                D[L] += val<br />
                if (R + 1 &lt; N) D[R + 1] -= val
              </p>
              <p className="text-[11px] text-muted-foreground">
                Boundary markers cancel each other out once the sweep passes index R.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col gap-2">
              <span className="text-xs font-bold text-foreground font-mono">3. Final Reconstruction</span>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                A&apos;[i] = A&apos;[i - 1] + D[i]
              </p>
              <p className="text-[11px] text-muted-foreground">
                Running cumulative sum sweeps all accumulated updates across the array in O(N).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Hash Prefix */}
      {activeTab === "hash" && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
              <Hash className="h-4 w-4 text-purple-500" />
              Subarray Sum Equals K: Prefix Sum + Hash Map (LeetCode 560)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When an array contains <strong>negative integers</strong>, the window sum is no longer monotonic, so traditional Two Pointers / Sliding Window fail. The algebraic breakthrough is reformulating the subarray equation into a hash table lookup:
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 font-mono text-xs flex flex-col gap-2">
            <div className="text-purple-600 dark:text-purple-400 font-bold text-sm">
              sum(j, i) = P[i] - P[j - 1] = K &nbsp; ⟺ &nbsp; P[j - 1] = P[i] - K
            </div>
            <p className="text-xs text-foreground font-sans">
              As we maintain a running prefix sum <code className="font-mono text-purple-500">P[i]</code>, any earlier prefix sum equal to <code className="font-mono text-purple-500">P[i] - K</code> marks the beginning of a valid subarray ending at <code className="font-mono text-purple-500">i</code>!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 flex flex-col gap-2 text-xs">
              <span className="font-bold text-foreground font-mono uppercase">Why Hash Map Is Essential</span>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Multiple earlier indices can have the exact same prefix sum.</li>
                <li>The map stores <code className="font-mono text-foreground">{"{ prefixSum: count }"}</code> to count all matching subarrays simultaneously in <code className="font-mono text-emerald-500">O(1)</code> time.</li>
                <li>Base initialization <code className="font-mono text-foreground">{"{ 0: 1 }"}</code> handles subarrays that start at index 0.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 flex flex-col gap-2 text-xs">
              <span className="font-bold text-foreground font-mono uppercase">Complexity Comparison</span>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Naive Brute Force:</strong> <code className="font-mono text-rose-500">O(N²)</code> checking all pairs.</li>
                <li><strong>Two Pointers:</strong> Fails due to negative numbers breaking shrink conditions.</li>
                <li><strong>Prefix + Hash Map:</strong> <code className="font-mono text-emerald-500">O(N)</code> Time, <code className="font-mono text-cyan-500">O(N)</code> Auxiliary Space.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
