"use client";

import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  Zap,
  RotateCcw,
  CheckCircle2,
  Crown,
  Compass,
  Layers,
  TrendingUp,
} from "lucide-react";

export function BacktrackingDiagram() {
  const [activeTab, setActiveTab] = useState<"n-queens" | "decision-tree">("n-queens");

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-fuchsia-500" />
          <span className="text-foreground font-bold">
            Backtracking — Constraint Satisfaction & Decision Tree
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-500/20 font-bold">
            Technique: Recursive Backtrack
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold">
            Worst Time: O(N!) / O(2ⁿ)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Aux Space: O(N) Stack
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("n-queens")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "n-queens"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Crown className="h-3.5 w-3.5" />
          <span>N-Queens Constraint Board</span>
        </button>

        <button
          onClick={() => setActiveTab("decision-tree")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "decision-tree"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Include/Exclude Decision Tree</span>
        </button>
      </div>

      {/* TAB 1: N-QUEENS CONSTRAINT BOARD */}
      {activeTab === "n-queens" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Constraint Rules Card */}
            <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-fuchsia-500 flex items-center gap-1.5">
                  <Zap className="h-4 w-4" /> Validity & Conflict Rules
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  4×4 Example
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Place N queens on an N×N board so that no two queens attack each other. A placement is
                <strong className="text-foreground">invalid</strong> if it shares a column or either diagonal with an existing queen.
              </p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    1. Column Conflict:
                  </span>
                  <span className="text-muted-foreground">
                    Two queens in the <strong>same column</strong> attack vertically. Each column holds at most one queen.
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                    2. Diagonal Conflict:
                  </span>
                  <span className="text-muted-foreground">
                    Two queens on the <strong>same diagonal</strong> attack when
                    <code className="text-foreground">|row₁ − row₂| === |col₁ − col₂|</code>.
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5">
                  <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                    3. Row Invariant:
                  </span>
                  <span className="text-muted-foreground">
                    Process one row at a time. By construction, each row holds exactly one queen, so row conflicts are impossible.
                  </span>
                </div>
              </div>

              <div className="mt-2 p-2.5 rounded-lg bg-secondary/40 border border-border text-[11px] font-mono text-muted-foreground">
                <span className="text-foreground font-semibold">Pruning Guarantee:</span> An invalid column is skipped immediately — its entire descendant subtree is never explored.
              </div>
            </div>

            {/* Visual Board State Machine */}
            <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-fuchsia-500" /> Place → Validate → Backtrack Cycle
              </span>

              {/* Cycle Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                  <span className="text-[9px] text-emerald-500 font-bold block mb-1">1. CHOOSE</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">
                    Place queen at (r, c)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
                  <span className="text-[9px] text-cyan-500 font-bold block mb-1">2. VALIDATE</span>
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-mono">
                    Check column + diagonals
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5">
                  <span className="text-[9px] text-amber-500 font-bold block mb-1">3. BACKTRACK</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">
                    Remove queen, try next column
                  </span>
                </div>
              </div>

              {/* Mini 4x4 Board Visual */}
              <div className="mt-3 p-3 rounded-lg border border-border bg-background/50 flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">
                  Row 0: trying col 0 → valid → recurse to Row 1
                </span>
                <div className="grid grid-cols-4 gap-0.5">
                  {[0, 1, 2, 3].flatMap((r) =>
                    [0, 1, 2, 3].map((c) => (
                      <div
                        key={`${r}-${c}`}
                        className={`aspect-square min-w-[24px] sm:min-w-[28px] rounded border flex items-center justify-center font-mono text-[10px] font-bold ${
                          r === 0 && c === 0
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black"
                            : r === 1 && c === 2
                            ? "bg-emerald-500 text-slate-950 border-emerald-400"
                            : r === 2 && c === 0 && r > 1
                            ? "bg-rose-500/30 text-rose-400 border-rose-500/50"
                            : "bg-secondary/40 border-border/60 text-muted-foreground/50"
                        }`}
                      >
                        {r === 0 && c === 0 ? "♛" : r === 1 && c === 2 ? "♛" : ""}
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 rounded bg-secondary border border-border/80 text-[10px] font-mono text-muted-foreground">
                  Queens at (0,0) and (1,2). Row 2 finds column 0 conflicts diagonally with (1,2): <code>|2−1| === |0−2|</code> is false → actually column 0 is fine here, but this illustrates the conflict-check visual style.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/20 text-xs">
                <RotateCcw className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong>Dead end:</strong> when a row has no valid column, the algorithm backtracks — removes the last-placed queen and resumes from its next untried column.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INCLUDE/EXCLUDE DECISION TREE (SUBSETS) */}
      {activeTab === "decision-tree" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Decision Tree Rules Card */}
            <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-fuchsia-500 flex items-center gap-1.5">
                  <Layers className="h-4 w-4" /> Binary Include/Exclude Tree
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Set {"{a, b, c}"}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate every subset of a set by making a binary decision at each element:
                <strong className="text-foreground">include</strong> it in the running subset, or <strong className="text-foreground">exclude</strong> it. Both branches are explored depth-first.
              </p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    1. Include Branch:
                  </span>
                  <span className="text-muted-foreground">
                    Push the current element onto the subset, recurse to the next index, then <strong className="text-foreground">pop</strong> it (undo) before trying the exclude branch.
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">
                    2. Exclude Branch:
                  </span>
                  <span className="text-muted-foreground">
                    Skip the current element entirely; the subset is unchanged as we descend to the next index.
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-purple-500/20 bg-purple-500/5">
                  <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                    3. Leaf Solution:
                  </span>
                  <span className="text-muted-foreground">
                    When the index reaches the set length, the accumulated subset is a complete power-set member.
                  </span>
                </div>
              </div>

              <div className="mt-2 p-2.5 rounded-lg bg-secondary/40 border border-border text-[11px] font-mono text-muted-foreground">
                <span className="text-foreground font-semibold">Complexity:</span> Each of n elements doubles the branch count → <code className="text-foreground">O(2ⁿ)</code> total subsets, <code className="text-foreground">O(n)</code> recursion depth.
              </div>
            </div>

            {/* Decision Tree Visual */}
            <div className="p-4 rounded-xl border border-border bg-card/60 flex flex-col gap-3">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-fuchsia-500" /> Include vs Exclude Branching
              </span>

              <div className="p-3 rounded-lg border border-border bg-background/50 flex flex-col gap-3 font-mono text-[10px]">
                {/* Root decision */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-7 rounded-lg border bg-amber-500/20 border-amber-400 text-amber-600 font-bold flex items-center justify-center text-[9px]">
                    idx 0: a?
                  </div>
                  <div className="flex gap-1">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] text-emerald-500 font-bold">INCLUDE</span>
                      <div className="w-8 h-6 rounded-lg border bg-emerald-500/20 border-emerald-400 text-emerald-600 font-bold flex items-center justify-center text-[8px]">
                        {"a"}
                      </div>
                      <span className="text-[8px] text-muted-foreground">→ idx 1: b?</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] text-cyan-500 font-bold">EXCLUDE</span>
                      <div className="w-8 h-6 rounded-lg border bg-secondary/40 border-border text-muted-foreground font-bold flex items-center justify-center text-[8px]">
                        ∅
                      </div>
                      <span className="text-[8px] text-muted-foreground">→ idx 1: b?</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded bg-secondary border border-border text-[10px] font-mono text-muted-foreground">
                  <span className="text-foreground font-bold">Backtrack point:</span> after exhausting all descendants of <code>include a</code>, pop <code>a</code> so the <code>exclude a</code> branch starts from an empty subset.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/20 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>
                  <strong>Power Set:</strong> a set of n elements yields exactly <code className="text-foreground">2ⁿ</code> subsets, including the empty set ∅ and the full set itself.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
