"use client";

import React from "react";
import { GitFork, Layers, Split, Database, Sparkles, CheckCircle2 } from "lucide-react";

export function BinaryTreeDiagram() {
  return (
    <div className="flex flex-col gap-6 w-full select-text">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <GitFork className="h-4 w-4 text-emerald-500" />
          <span className="text-foreground font-bold">
            Binary Tree Hierarchy &amp; Recursive Subtree Architecture
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Insert (BFS): O(n)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Traversals: O(n)
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
            Aux Stack: O(h)
          </span>
        </div>
      </div>

      {/* Main Blueprint Card */}
      <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        {/* Main Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Tree Topology SVG Diagram */}
          <div className="md:col-span-6 p-4 rounded-xl border border-border bg-secondary/30 flex flex-col items-center justify-center">
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>TOPOLOGY &amp; LEVEL ANATOMY</span>
            </div>

            <svg className="w-full max-w-[340px] h-[210px]" viewBox="0 0 340 210">
              <defs>
                <linearGradient id="treeGradDiag" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* Depth / Level Guideline Lines */}
              <line x1="10" y1="38" x2="330" y2="38" stroke="currentColor" strokeDasharray="3 3" className="text-border" />
              <text x="15" y="32" fill="currentColor" fontSize="9" fontFamily="monospace" className="text-muted-foreground select-none">
                Level 0 (Depth 0)
              </text>

              <line x1="10" y1="105" x2="330" y2="105" stroke="currentColor" strokeDasharray="3 3" className="text-border" />
              <text x="15" y="99" fill="currentColor" fontSize="9" fontFamily="monospace" className="text-muted-foreground select-none">
                Level 1 (Depth 1)
              </text>

              <line x1="10" y1="172" x2="330" y2="172" stroke="currentColor" strokeDasharray="3 3" className="text-border" />
              <text x="15" y="166" fill="currentColor" fontSize="9" fontFamily="monospace" className="text-muted-foreground select-none">
                Level 2 (Leaves)
              </text>

              {/* Curved Edges (Root to Level 1) */}
              <path
                d="M 170 38 C 170 70, 100 70, 100 105"
                fill="none"
                stroke="url(#treeGradDiag)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 170 38 C 170 70, 240 70, 240 105"
                fill="none"
                stroke="url(#treeGradDiag)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Curved Edges (Level 1 to Leaves) */}
              <path
                d="M 100 105 C 100 138, 65 138, 65 172"
                fill="none"
                stroke="url(#treeGradDiag)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 100 105 C 100 138, 135 138, 135 172"
                fill="none"
                stroke="url(#treeGradDiag)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M 240 105 C 240 138, 205 138, 205 172"
                fill="none"
                stroke="url(#treeGradDiag)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 240 105 C 240 138, 275 138, 275 172"
                fill="none"
                stroke="url(#treeGradDiag)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Level 0: Root Node */}
              <circle cx="170" cy="38" r="16" fill="#0891b2" stroke="#22d3ee" strokeWidth="2.5" />
              <text x="170" y="42" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">1</text>
              <g>
                <rect x="153" y="10" width="34" height="12" rx="3" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />
                <text x="170" y="19" textAnchor="middle" fill="#a5f3fc" fontSize="8" fontWeight="bold" fontFamily="monospace">ROOT</text>
              </g>

              {/* Level 1 Nodes */}
              <circle cx="100" cy="105" r="15" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="100" y="109.5" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">2</text>

              <circle cx="240" cy="105" r="15" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="240" y="109.5" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">3</text>

              {/* Level 2: Leaves */}
              <g>
                <circle cx="65" cy="172" r="13" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="65" y="176" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">4</text>
                <rect x="51" y="191" width="28" height="10" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
                <text x="65" y="198.5" textAnchor="middle" fill="#cbd5e1" fontSize="6.5" fontWeight="bold" fontFamily="monospace">LEAF</text>
              </g>

              <g>
                <circle cx="135" cy="172" r="13" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="135" y="176" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">5</text>
                <rect x="121" y="191" width="28" height="10" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
                <text x="135" y="198.5" textAnchor="middle" fill="#cbd5e1" fontSize="6.5" fontWeight="bold" fontFamily="monospace">LEAF</text>
              </g>

              <g>
                <circle cx="205" cy="172" r="13" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="205" y="176" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">6</text>
                <rect x="191" y="191" width="28" height="10" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
                <text x="205" y="198.5" textAnchor="middle" fill="#cbd5e1" fontSize="6.5" fontWeight="bold" fontFamily="monospace">LEAF</text>
              </g>

              <g>
                <circle cx="275" cy="172" r="13" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="275" y="176" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">7</text>
                <rect x="261" y="191" width="28" height="10" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
                <text x="275" y="198.5" textAnchor="middle" fill="#cbd5e1" fontSize="6.5" fontWeight="bold" fontFamily="monospace">LEAF</text>
              </g>
            </svg>

            <p className="text-[10px] text-muted-foreground mt-2 text-center font-mono">
              7-Node Perfect Binary Tree: Height $h = 2$, Depth of leaves $= 2$, Total Edges $= 6$.
            </p>
          </div>

          {/* Right: Traversals & Key Invariants */}
          <div className="md:col-span-6 space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-secondary/40 space-y-2.5">
              <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                <Split className="h-3.5 w-3.5 text-cyan-500" />
                <span>DFS &amp; BFS Traversal Orderings</span>
              </span>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border shadow-xs">
                  <span className="text-muted-foreground">Pre-Order (NLR):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">[1, 2, 4, 5, 3, 6, 7]</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border shadow-xs">
                  <span className="text-muted-foreground">In-Order (LNR):</span>
                  <span className="text-sky-600 dark:text-sky-400 font-bold">[4, 2, 5, 1, 6, 3, 7]</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border shadow-xs">
                  <span className="text-muted-foreground">Post-Order (LRN):</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">[4, 5, 2, 6, 7, 3, 1]</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border shadow-xs">
                  <span className="text-muted-foreground">Level-Order (BFS):</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">[1, 2, 3, 4, 5, 6, 7]</span>
                </div>
              </div>
            </div>

            {/* Mathematical Invariants */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-3 rounded-xl border border-border bg-card shadow-xs space-y-1">
                <div className="text-muted-foreground text-[10px] uppercase font-bold">Max Nodes At Level L</div>
                <div className="text-cyan-600 dark:text-cyan-400 font-bold text-base">2ᴸ</div>
                <p className="text-[9px] text-muted-foreground">Level 0: 1, Level 1: 2, Level 2: 4</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-card shadow-xs space-y-1">
                <div className="text-muted-foreground text-[10px] uppercase font-bold">Total Nodes (Height h)</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-base">2ʰ⁺¹ - 1</div>
                <p className="text-[9px] text-muted-foreground">Height 2: 2³ - 1 = 7 nodes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

