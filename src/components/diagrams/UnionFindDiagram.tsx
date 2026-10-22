"use client";

import React, { useState } from "react";
import {
  Share2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  GitFork,
  Activity,
  CheckCircle2,
  Workflow,
  Zap,
  Network,
  AlertTriangle,
} from "lucide-react";

export function UnionFindDiagram() {
  const [activeTab, setActiveTab] = useState<"forest" | "compression" | "rank" | "cycle">("forest");

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-emerald-500" />
          <span className="text-foreground font-bold">
            Disjoint Set Union (Union-Find / DSU)
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Amortized Find/Union: O(α(n)) ≈ O(1)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Space: O(n) Array
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
            Ackermann Inverse: α(10⁸⁰) ≤ 4
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("forest")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "forest"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Network className="h-3.5 w-3.5" />
          <span>DSU Forest &amp; Array Mapping</span>
        </button>

        <button
          onClick={() => setActiveTab("compression")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "compression"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Path Compression (Tree Flattening)</span>
        </button>

        <button
          onClick={() => setActiveTab("rank")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "rank"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Union by Rank &amp; Size</span>
        </button>

        <button
          onClick={() => setActiveTab("cycle")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "cycle"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Cycle Detection &amp; Kruskal MST</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: FOREST ARCHITECTURE & 1D ARRAY MAPPING
          ========================================================================= */}
      {activeTab === "forest" && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4 text-emerald-500" />
              <span>The Disjoint Set Forest Model</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Union-Find represents dynamic partitions of $n$ elements into disjoint equivalence classes.
              Each set is organized as a directed tree where every node points to its parent.
              The root of the tree is the <strong>canonical representative</strong> of the entire set, defined by the invariant{" "}
              <code className="text-emerald-600 dark:text-emerald-400 font-mono">parent[root] == root</code>.
            </p>
          </div>

          {/* Dual Representation Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Tree Forest Diagram */}
            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Logical Tree Forest (Directed Parent Pointers)</span>
              </span>

              <div className="p-4 rounded-lg border border-border/80 bg-background/80 flex justify-around items-center min-h-[160px]">
                {/* Tree 1: Root 0 with children 1, 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                    0*
                  </div>
                  <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                    Root
                  </div>
                  <div className="w-16 h-4 border-t-2 border-blue-500/40 border-l-2 border-r-2 mt-1 rounded-t-sm" />
                  <div className="flex justify-between w-20">
                    <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/50 text-foreground font-mono text-xs flex items-center justify-center">
                      1
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/50 text-foreground font-mono text-xs flex items-center justify-center">
                      2
                    </div>
                  </div>
                </div>

                {/* Tree 2: Root 3 with child 4 */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                    3*
                  </div>
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                    Root
                  </div>
                  <div className="w-0.5 h-4 bg-emerald-500/40 mt-1" />
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/50 text-foreground font-mono text-xs flex items-center justify-center">
                    4
                  </div>
                </div>

                {/* Tree 3: Singleton 5 */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-purple-500/20 border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                    5*
                  </div>
                  <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                    Singleton
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                Asterisk (*) denotes self-root where <code className="text-foreground">parent[i] == i</code>.
              </p>
            </div>

            {/* Right: 1D Physical Memory Array Strip */}
            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Physical Memory: Flat 1D Array Storage</span>
              </span>

              <div className="p-3 rounded-lg border border-border/80 bg-background/80 space-y-2">
                <div className="text-[11px] font-mono text-muted-foreground">
                  Array Indices (Elements):
                </div>
                <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <div key={`idx-${idx}`} className="p-1.5 rounded bg-muted/60 text-muted-foreground">
                      [{idx}]
                    </div>
                  ))}
                </div>

                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                  parent[] Pointer Values:
                </div>
                <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs">
                  <div className="p-1.5 rounded bg-blue-500/20 border border-blue-500/40 font-bold text-blue-600 dark:text-blue-300">0</div>
                  <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 text-foreground">0</div>
                  <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 text-foreground">0</div>
                  <div className="p-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 font-bold text-emerald-600 dark:text-emerald-300">3</div>
                  <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-foreground">3</div>
                  <div className="p-1.5 rounded bg-purple-500/20 border border-purple-500/40 font-bold text-purple-600 dark:text-purple-300">5</div>
                </div>

                <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold pt-1">
                  rank[] Upper Bound Heights:
                </div>
                <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs">
                  <div className="p-1.5 rounded bg-amber-500/10 text-foreground">1</div>
                  <div className="p-1.5 rounded bg-muted/30 text-muted-foreground">0</div>
                  <div className="p-1.5 rounded bg-muted/30 text-muted-foreground">0</div>
                  <div className="p-1.5 rounded bg-amber-500/10 text-foreground">1</div>
                  <div className="p-1.5 rounded bg-muted/30 text-muted-foreground">0</div>
                  <div className="p-1.5 rounded bg-amber-500/10 text-foreground">0</div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground font-mono">
                No tree node objects or heap pointers! The entire graph is captured in two integer arrays.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PATH COMPRESSION (FLATTENING)
          ========================================================================= */}
      {activeTab === "compression" && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Path Compression: The O(1) Amortization Superpower</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Without optimization, repeated unions can degrade trees into degenerate linked-list chains of height $O(n)$, causing queries to take $O(n)$ time.
              <strong> Path Compression</strong> solves this permanently: during any <code className="font-mono text-amber-500">find(x)</code> call, every node visited along the path is re-parented to point <em>directly to the root</em>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before: Skewed Chain */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3">
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>BEFORE find(4): Degenerate Chain (Height = 4)</span>
              </span>

              <div className="p-4 rounded-lg border border-border/80 bg-background/80 flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500 font-mono text-xs font-bold flex items-center justify-center">
                  0
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">↑ parent[1]=0</div>
                <div className="w-8 h-8 rounded-full bg-secondary border border-border font-mono text-xs flex items-center justify-center">
                  1
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">↑ parent[2]=1</div>
                <div className="w-8 h-8 rounded-full bg-secondary border border-border font-mono text-xs flex items-center justify-center">
                  2
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">↑ parent[3]=2</div>
                <div className="w-8 h-8 rounded-full bg-secondary border border-border font-mono text-xs flex items-center justify-center">
                  3
                </div>
                <div className="text-[10px] font-mono text-rose-500 font-bold">↑ parent[4]=3 (Traversal depth: 4 steps)</div>
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border-2 border-rose-500 font-mono text-xs font-bold text-rose-600 dark:text-rose-300 flex items-center justify-center">
                  4
                </div>
              </div>
            </div>

            {/* After: Star Graph */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>AFTER find(4): Flat Star Graph (Height = 1)</span>
              </span>

              <div className="p-4 rounded-lg border border-border/80 bg-background/80 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md">
                  0
                </div>
                <div className="w-48 h-3 border-t-2 border-emerald-500/50 border-l-2 border-r-2 rounded-t-sm" />
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((node) => (
                    <div key={`star-${node}`} className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500 text-foreground font-mono text-xs flex items-center justify-center font-bold">
                        {node}
                      </div>
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                        p={0}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-2 rounded bg-emerald-500/10 text-[11px] font-mono text-emerald-600 dark:text-emerald-300 text-center w-full">
                  All future calls to find(1), find(2), find(3), or find(4) now resolve in exactly ONE hop: O(1)!
                </div>
              </div>
            </div>
          </div>

          {/* Elegant 1-Line Implementation */}
          <div className="p-3.5 rounded-xl border border-border bg-card/60 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              Canonical C++ Path Compression One-Liner:
            </span>
            <code className="text-xs font-mono px-3 py-1.5 rounded-lg bg-background border border-border text-foreground font-bold">
              int find(int i) &#123; return parent[i] == i ? i : (parent[i] = find(parent[i])); &#125;
            </code>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: UNION BY RANK & SIZE
          ========================================================================= */}
      {activeTab === "rank" && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-500" />
              <span>Union by Rank &amp; Size: Keeping Trees Shallow</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When merging two sets with roots $r_1$ and $r_2$, never attach arbitrarily!
              Always attach the root of the <strong>shorter tree (lower rank)</strong> underneath the root of the <strong>taller tree (higher rank)</strong>.
              This guarantees that tree depth will never exceed $\lfloor \log_2 n \rfloor$ even without path compression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 space-y-2">
              <span className="text-xs font-mono font-bold text-foreground">Case 1: rank[r₁] &gt; rank[r₂]</span>
              <p className="text-xs text-muted-foreground">
                Attach $r_2$ under $r_1$. The overall tree height does not change because $r_1$ is already deeper!
              </p>
              <div className="p-2 rounded bg-background border border-border font-mono text-xs text-foreground">
                parent[r₂] = r₁;<br />
                <span className="text-muted-foreground">// rank[r₁] remains same</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 space-y-2">
              <span className="text-xs font-mono font-bold text-foreground">Case 2: rank[r₁] &lt; rank[r₂]</span>
              <p className="text-xs text-muted-foreground">
                Attach $r_1$ under $r_2$. The overall tree height does not change because $r_2$ is already deeper!
              </p>
              <div className="p-2 rounded bg-background border border-border font-mono text-xs text-foreground">
                parent[r₁] = r₂;<br />
                <span className="text-muted-foreground">// rank[r₂] remains same</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-500/10 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
                Case 3: rank[r₁] == rank[r₂] (TIE)
              </span>
              <p className="text-xs text-muted-foreground">
                Attach either (e.g. $r_2$ under $r_1$). The height increases by exactly 1 layer!
              </p>
              <div className="p-2 rounded bg-background border border-border font-mono text-xs text-foreground">
                parent[r₂] = r₁;<br />
                <span className="text-purple-600 dark:text-purple-300 font-bold">rank[r₁]++;</span>
              </div>
            </div>
          </div>

          {/* Ackermann Inverse table */}
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
            <span className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-500" />
              <span>Why is O(α(n)) Considered Practically Constant?</span>
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 px-3">Input Size n</th>
                    <th className="py-2 px-3">Ackermann Inverse α(n)</th>
                    <th className="py-2 px-3">Real-world Comparison</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  <tr>
                    <td className="py-2 px-3">1 to 4</td>
                    <td className="py-2 px-3 text-emerald-500 font-bold">1</td>
                    <td className="py-2 px-3 text-muted-foreground">Single memory word</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">5 to 16</td>
                    <td className="py-2 px-3 text-emerald-500 font-bold">2</td>
                    <td className="py-2 px-3 text-muted-foreground">Cache line size</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">17 to 65,536 (2¹⁶)</td>
                    <td className="py-2 px-3 text-emerald-500 font-bold">3</td>
                    <td className="py-2 px-3 text-muted-foreground">Small database table</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">65,537 to 2⁶⁵⁵³⁶</td>
                    <td className="py-2 px-3 text-emerald-500 font-bold">4</td>
                    <td className="py-2 px-3 text-cyan-500 font-bold">Far exceeds total atoms in the observable universe (~10⁸⁰)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CYCLE DETECTION & KRUSKAL'S MST
          ========================================================================= */}
      {activeTab === "cycle" && (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
            <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Graph Cycle Detection &amp; Kruskal's Algorithm</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When processing an undirected graph edge $(u, v)$, how do we know if adding this edge creates a cycle?
              We check the roots: if <code className="font-mono text-foreground font-bold">find(u) == find(v)</code>, both vertices already belong to the same connected component. Connecting them would close an alternative cycle!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Valid Tree Edge: find(u) ≠ find(v)</span>
              </span>
              <p className="text-xs text-muted-foreground">
                Vertices $u$ and $v$ belong to separate trees. We call <code className="font-mono text-foreground">union(u, v)</code>, bridging the two components into one and reducing total component count by 1.
              </p>
              <div className="p-2.5 rounded bg-background border border-border font-mono text-xs text-emerald-600 dark:text-emerald-300">
                Safe to add to Minimum Spanning Tree (MST)!
              </div>
            </div>

            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span>Redundant Edge / Cycle: find(u) == find(v)</span>
              </span>
              <p className="text-xs text-muted-foreground">
                Both vertices already share the same root representative. A path between $u$ and $v$ already exists!
              </p>
              <div className="p-2.5 rounded bg-background border border-border font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                REJECT EDGE: Adding (u, v) forms a closed cycle loop!
              </div>
            </div>
          </div>

          {/* Workflow Box */}
          <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2 font-mono text-xs">
            <span className="font-bold text-foreground flex items-center gap-2">
              <Workflow className="h-4 w-4 text-cyan-500" />
              <span>Kruskal's MST Algorithm Pipeline using DSU:</span>
            </span>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Sort all $E$ edges in non-decreasing order of weight: $O(E \log E)$.</li>
              <li>Initialize Union-Find with $V$ singleton sets: <code className="text-foreground">parent[i] = i</code> in $O(V)$.</li>
              <li>Iterate through sorted edges: if <code className="text-emerald-500 font-bold">find(u) != find(v)</code>, add edge to MST and <code className="text-emerald-500 font-bold">union(u, v)</code>.</li>
              <li>Stop when MST has exactly $V - 1$ edges. Total runtime: <strong className="text-foreground">O(E log E)</strong> (DSU operations contribute negligible $O(E \cdot \alpha(V))$).</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
