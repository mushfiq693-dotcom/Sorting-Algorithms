"use client";

import React from "react";
import { GitFork, ArrowRight, Layers, Split, CheckCircle2 } from "lucide-react";

export function BinaryTreeDiagram() {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-500">
          <GitFork className="h-4 w-4" />
          <span>BINARY TREE HIERARCHY & RECURSIVE SUBTREE BLUEPRINT</span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Topological Branching, Depth & Height Metrics
        </span>
      </div>

      {/* Main Blueprint Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Tree Topology SVG Diagram */}
        <div className="md:col-span-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center justify-center">
          <div className="text-xs font-mono font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>TOPOLOGY & LEVEL ANATOMY</span>
          </div>

          <svg className="w-full max-w-[340px] h-[200px]" viewBox="0 0 340 200">
            <defs>
              <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Depth Lines */}
            <line x1="10" y1="35" x2="330" y2="35" stroke="#334155" strokeDasharray="3 3" />
            <text x="15" y="30" fill="#64748b" fontSize="9" fontFamily="monospace">Level 0 (Depth 0)</text>

            <line x1="10" y1="100" x2="330" y2="100" stroke="#334155" strokeDasharray="3 3" />
            <text x="15" y="95" fill="#64748b" fontSize="9" fontFamily="monospace">Level 1 (Depth 1)</text>

            <line x1="10" y1="165" x2="330" y2="165" stroke="#334155" strokeDasharray="3 3" />
            <text x="15" y="160" fill="#64748b" fontSize="9" fontFamily="monospace">Level 2 (Leaves)</text>

            {/* Edges */}
            <line x1="170" y1="35" x2="100" y2="100" stroke="url(#treeGrad)" strokeWidth="2" />
            <line x1="170" y1="35" x2="240" y2="100" stroke="url(#treeGrad)" strokeWidth="2" />

            <line x1="100" y1="100" x2="65" y2="165" stroke="url(#treeGrad)" strokeWidth="2" />
            <line x1="100" y1="100" x2="135" y2="165" stroke="url(#treeGrad)" strokeWidth="2" />

            <line x1="240" y1="100" x2="205" y2="165" stroke="url(#treeGrad)" strokeWidth="2" />
            <line x1="240" y1="100" x2="275" y2="165" stroke="url(#treeGrad)" strokeWidth="2" />

            {/* Level 0: Root */}
            <circle cx="170" cy="35" r="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
            <text x="170" y="39" textAnchor="middle" fill="#e0e7ff" fontSize="11" fontWeight="bold">1</text>
            <text x="170" y="14" textAnchor="middle" fill="#818cf8" fontSize="8" fontWeight="bold">ROOT</text>

            {/* Level 1 */}
            <circle cx="100" cy="100" r="15" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            <text x="100" y="104" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="bold">2</text>

            <circle cx="240" cy="100" r="15" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
            <text x="240" y="104" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="bold">3</text>

            {/* Level 2: Leaves */}
            <circle cx="65" cy="165" r="13" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <text x="65" y="169" textAnchor="middle" fill="#f8fafc" fontSize="10">4</text>

            <circle cx="135" cy="165" r="13" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <text x="135" y="169" textAnchor="middle" fill="#f8fafc" fontSize="10">5</text>

            <circle cx="205" cy="165" r="13" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <text x="205" y="169" textAnchor="middle" fill="#f8fafc" fontSize="10">6</text>

            <circle cx="275" cy="165" r="13" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <text x="275" y="169" textAnchor="middle" fill="#f8fafc" fontSize="10">7</text>
          </svg>

          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            7-Node Perfect Binary Tree: Height $h = 2$, Depth of leaves $= 2$, Total Edges $= 6$.
          </p>
        </div>

        {/* Right: Traversals & Key Invariants */}
        <div className="md:col-span-6 space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl border border-border bg-background/60 space-y-2">
            <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
              <Split className="h-3.5 w-3.5 text-blue-400" />
              <span>DFS & BFS Traversal Orderings</span>
            </span>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-secondary/50 border border-border">
                <span className="text-muted-foreground">Pre-Order (NLR):</span>
                <span className="text-emerald-400 font-semibold">[1, 2, 4, 5, 3, 6, 7]</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-secondary/50 border border-border">
                <span className="text-muted-foreground">In-Order (LNR):</span>
                <span className="text-sky-400 font-semibold">[4, 2, 5, 1, 6, 3, 7]</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-secondary/50 border border-border">
                <span className="text-muted-foreground">Post-Order (LRN):</span>
                <span className="text-purple-400 font-semibold">[4, 5, 2, 6, 7, 3, 1]</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-secondary/50 border border-border">
                <span className="text-muted-foreground">Level-Order (BFS):</span>
                <span className="text-amber-400 font-semibold">[1, 2, 3, 4, 5, 6, 7]</span>
              </div>
            </div>
          </div>

          {/* Mathematical Invariants */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg border border-border bg-secondary/30 space-y-1">
              <div className="text-muted-foreground text-[10px] uppercase font-bold">Max Nodes At Level L</div>
              <div className="text-foreground font-bold text-sm">2ᴸ</div>
              <p className="text-[9px] text-muted-foreground">Level 0: 1, Level 1: 2, Level 2: 4</p>
            </div>
            <div className="p-2.5 rounded-lg border border-border bg-secondary/30 space-y-1">
              <div className="text-muted-foreground text-[10px] uppercase font-bold">Total Nodes (Height h)</div>
              <div className="text-foreground font-bold text-sm">2ʰ⁺¹ - 1</div>
              <p className="text-[9px] text-muted-foreground">Height 2: 2³ - 1 = 7 nodes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
