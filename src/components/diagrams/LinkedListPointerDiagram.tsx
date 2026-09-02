"use client";

import React from "react";
import { Database, Layers, CheckCircle2, ArrowRight, Zap, GitCommit } from "lucide-react";

export function LinkedListPointerDiagram() {
  return (
    <div className="flex flex-col gap-6 w-full select-text">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-purple-500" />
          <span className="text-foreground font-bold">
            Singly Linked List Memory Architecture
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Insert at Head: O(1)
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            Search: O(n)
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
            Aux Space: O(n) pointers
          </span>
        </div>
      </div>

      {/* Main Visual Infographic Diagram */}
      <div className="w-full overflow-x-auto pb-4 pt-2">
        <div className="min-w-[660px] flex flex-col gap-6 p-5 rounded-2xl border border-border bg-card shadow-sm">
          {/* Section 1: Anatomy of a Linked List */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-cyan-500" />
              <span>1. Standard Singly Linked List Node Anatomy</span>
            </span>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-border/80 bg-secondary/30">
              {/* HEAD Label */}
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-mono text-[10px] font-bold">
                  HEAD
                </span>
                <span className="text-cyan-500 text-xs font-mono">↓</span>
              </div>

              {/* Node 1 */}
              <div className="flex items-center gap-2">
                <div className="flex items-stretch h-12 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
                  <div className="px-3 flex flex-col items-center justify-center border-r border-border font-mono">
                    <span className="text-[8px] text-muted-foreground">data</span>
                    <span className="text-xs font-black text-foreground">10</span>
                  </div>
                  <div className="px-2 flex flex-col items-center justify-center bg-secondary/50 font-mono text-cyan-500 text-[10px] font-bold">
                    <span>next</span>
                    <span>•→</span>
                  </div>
                </div>
                <span className="text-cyan-500 font-mono font-bold">→</span>
              </div>

              {/* Node 2 */}
              <div className="flex items-center gap-2">
                <div className="flex items-stretch h-12 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
                  <div className="px-3 flex flex-col items-center justify-center border-r border-border font-mono">
                    <span className="text-[8px] text-muted-foreground">data</span>
                    <span className="text-xs font-black text-foreground">25</span>
                  </div>
                  <div className="px-2 flex flex-col items-center justify-center bg-secondary/50 font-mono text-cyan-500 text-[10px] font-bold">
                    <span>next</span>
                    <span>•→</span>
                  </div>
                </div>
                <span className="text-cyan-500 font-mono font-bold">→</span>
              </div>

              {/* Node 3 */}
              <div className="flex items-center gap-2">
                <div className="flex items-stretch h-12 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
                  <div className="px-3 flex flex-col items-center justify-center border-r border-border font-mono">
                    <span className="text-[8px] text-muted-foreground">data</span>
                    <span className="text-xs font-black text-foreground">60</span>
                  </div>
                  <div className="px-2 flex flex-col items-center justify-center bg-secondary/50 font-mono text-cyan-500 text-[10px] font-bold">
                    <span>next</span>
                    <span>•→</span>
                  </div>
                </div>
                <span className="text-cyan-500 font-mono font-bold">→</span>
              </div>

              {/* Terminal NULL */}
              <div className="px-3 py-2 rounded-xl border border-border/60 bg-secondary/50 font-mono text-xs text-muted-foreground font-bold">
                nullptr
              </div>
            </div>
          </div>

          {/* Section 2: O(1) Prepend vs O(n) Array Shift Contrast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Linked List Prepend */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> Linked List Prepend (Insert Head)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold text-[10px]">
                    Strictly O(1)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Allocate new node(5), point its <code className="text-emerald-600 dark:text-emerald-400">next = head</code>, then reassign <code className="text-emerald-600 dark:text-emerald-400">head = newNode</code>. Exactly 2 pointer operations regardless of whether the list has 10 nodes or 10,000,000 nodes!
                </p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/60 border border-border/60 font-mono text-[10px] text-foreground">
                <code>newNode-&gt;next = head; head = newNode; // Zero elements shifted</code>
              </div>
            </div>

            {/* Array Prepend Shift */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <GitCommit className="h-3.5 w-3.5" /> Array Prepend (Insert at index 0)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-[10px]">
                    Costly O(n)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contiguous memory requires index 0..n-1 to shift forward by 1 slot to create an opening. Inserting at the front moves all n items in memory.
                </p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/60 border border-border/60 font-mono text-[10px] text-foreground">
                <code>for (int j = n; j &gt; 0; j--) arr[j] = arr[j-1]; // O(n) data movement</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
