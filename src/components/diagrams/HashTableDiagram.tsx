"use client";

import React from "react";
import { Hash, ArrowRight, Database, ArrowDownRight, Layers, Split } from "lucide-react";

export function HashTableDiagram() {
  const sampleBuckets = [
    { idx: 0, entries: [] },
    { idx: 1, entries: [{ key: 25, val: "Alice" }, { key: 33, val: "Bob" }] },
    { idx: 2, entries: [{ key: 42, val: "Carol" }] },
    { idx: 3, entries: [] },
    { idx: 4, entries: [{ key: 12, val: "Dave" }, { key: 20, val: "Eve" }] },
    { idx: 5, entries: [] },
    { idx: 6, entries: [{ key: 78, val: "Frank" }] },
    { idx: 7, entries: [] },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-500">
          <Hash className="h-4 w-4" />
          <span>HASH TABLE & COLLISION RESOLUTION ARCHITECTURAL BLUEPRINT</span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Direct Addressing & Chained Bucket Topology
        </span>
      </div>

      {/* Main Architectural Flow */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Input Key & Hash Engine Transformation Box */}
        <div className="md:col-span-4 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 flex flex-col items-center text-center space-y-3">
          <div className="text-xs font-mono font-bold text-cyan-500 flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            <span>HASH ENGINE h(k)</span>
          </div>

          <div className="w-full p-2.5 rounded-lg bg-background/80 border border-border space-y-1.5 font-mono text-[11px]">
            <div className="text-muted-foreground flex justify-between">
              <span>Input Key:</span>
              <strong className="text-foreground">k = 25</strong>
            </div>
            <div className="text-muted-foreground flex justify-between">
              <span>Capacity M:</span>
              <strong className="text-foreground">8 slots</strong>
            </div>
            <div className="pt-1.5 border-t border-border flex justify-between text-cyan-400 font-bold">
              <span>h(25) = 25 % 8:</span>
              <span>Index [1]</span>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground leading-relaxed text-left">
            Calculates hardware array offset in $O(1)$ single-instruction time. Distinct keys yielding the same slot index trigger collision chains.
          </p>
        </div>

        {/* Right: Buckets & Linked Lists Representation */}
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
            <span>Bucket Slots (Array Indices [0..7])</span>
            <span>Chained Linked Lists (Separate Chaining)</span>
          </div>

          <div className="space-y-1.5">
            {sampleBuckets.map((b) => (
              <div
                key={b.idx}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-border/60 bg-background/60"
              >
                {/* Bucket Index Indicator */}
                <div className="w-16 px-2 py-1 rounded-lg bg-secondary/80 border border-border flex items-center justify-between font-mono text-[11px]">
                  <span className="font-bold text-muted-foreground">#{b.idx}</span>
                  <span className={`text-[10px] ${b.entries.length > 0 ? "text-cyan-400 font-semibold" : "text-muted-foreground/50"}`}>
                    ({b.entries.length})
                  </span>
                </div>

                {/* Chained Linked Nodes */}
                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                  {b.entries.length === 0 ? (
                    <span className="text-[10px] font-mono text-muted-foreground/40 italic pl-1">
                      empty bucket
                    </span>
                  ) : (
                    b.entries.map((item, nIdx) => (
                      <React.Fragment key={item.key}>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-mono">
                          <span className="font-bold text-blue-400">{item.key}</span>
                          <span className="text-muted-foreground">:</span>
                          <span className="text-foreground text-[11px]">"{item.val}"</span>
                        </div>
                        {nIdx < b.entries.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collision Strategy Comparison Sub-bar */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60 text-xs font-mono">
        <div className="p-3 rounded-xl bg-background/50 border border-border space-y-1">
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-blue-500" />
            <span>Separate Chaining (Buckets)</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Buckets hold dynamic pointer-linked chains. Accommodates load factors $\alpha &gt; 1.0$ without overflow errors, but incurs 8-byte pointer overhead per node.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-background/50 border border-border space-y-1">
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <Split className="h-3.5 w-3.5 text-amber-500" />
            <span>Open Addressing (Linear Probing)</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All elements reside directly in the flat array. Collisions probe $(i + 1) \pmod M$. Deletions mark slots with Tombstone (DEL) to preserve probe continuity.
          </p>
        </div>
      </div>
    </div>
  );
}
