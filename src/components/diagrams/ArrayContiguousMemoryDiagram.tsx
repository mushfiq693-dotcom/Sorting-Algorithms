"use client";

import React from "react";
import { Database, Cpu, ArrowRight, ArrowDown, Zap, Layers, Calculator } from "lucide-react";

export function ArrayContiguousMemoryDiagram() {
  const memoryCells = [
    { index: 0, address: "0x7FFF00", value: 14, offset: "+0B", role: "HEAD / Base" },
    { index: 1, address: "0x7FFF04", value: 28, offset: "+4B", role: "arr[1]" },
    { index: 2, address: "0x7FFF08", value: 42, offset: "+8B", role: "arr[2]" },
    { index: 3, address: "0x7FFF0C", value: 56, offset: "+12B", role: "arr[3]" },
    { index: 4, address: "0x7FFF10", value: 70, offset: "+16B", role: "END / arr[4]" },
    { index: 5, address: "0x7FFF14", value: "-", offset: "+20B", role: "Capacity Slot" },
    { index: 6, address: "0x7FFF18", value: "-", offset: "+24B", role: "Capacity Slot" },
    { index: 7, address: "0x7FFF1C", value: "-", offset: "+28B", role: "Capacity Slot" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
      {/* Top Title & Overview */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-500">
          <Database className="h-4 w-4" />
          <span>Contiguous RAM Allocation &amp; Address Derivation</span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Base Address: 0x7FFF00 | sizeof(int) = 4 Bytes
        </span>
      </div>

      {/* Contiguous RAM Memory Map */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-semibold text-foreground flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-cyan-500" />
          <span>Physical Hardware Memory Strip (Zero Fragmented Gaps)</span>
        </div>

        <div className="w-full overflow-x-auto py-2">
          <div className="flex items-center gap-2 min-w-[620px]">
            {memoryCells.map((cell) => {
              const isOccupied = cell.value !== "-";
              return (
                <div key={cell.index} className="flex-1 flex flex-col items-center gap-1.5 font-mono">
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                    {cell.address}
                  </span>

                  <div
                    className={`w-full h-16 rounded-xl flex flex-col items-center justify-between p-1.5 border ${
                      isOccupied
                        ? "bg-secondary/70 border-cyan-500/40 text-foreground"
                        : "bg-secondary/20 border-dashed border-border/70 text-muted-foreground/40"
                    }`}
                  >
                    <span className="text-[9px] opacity-70">{cell.offset}</span>
                    <span className="text-sm font-bold text-foreground">{cell.value}</span>
                    <span className="text-[8px] opacity-60">4B INT</span>
                  </div>

                  <span className="text-xs font-bold text-foreground">[{cell.index}]</span>
                  <span className="text-[9px] text-muted-foreground">{cell.role}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Architectural Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Column: Direct Indexing Math */}
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            <Calculator className="h-4 w-4 text-cyan-500" />
            <span>1. O(1) Direct Offset Calculation</span>
          </div>
          <p className="text-xs text-foreground leading-relaxed">
            The computer calculates any element&apos;s physical RAM location in a single instruction:
          </p>
          <div className="p-2.5 rounded-lg bg-background/80 border border-border text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
            Address(arr[i]) = BaseAddress + (i × sizeof(Type))
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            For <code className="text-cyan-500">arr[3]</code>: <code className="font-mono">0x7FFF00 + (3 × 4B) = 0x7FFF0C</code>. No traversal required!
          </p>
        </div>

        {/* Right Column: Cache Line Locality */}
        <div className="p-4 rounded-xl border border-border bg-secondary/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
            <Cpu className="h-4 w-4 text-amber-500" />
            <span>2. Hardware L1/L2 Spatial Locality</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            CPUs read memory in <strong>64-byte Cache Lines</strong>. Fetching <code className="font-mono text-cyan-500">arr[0]</code> automatically pulls <code className="font-mono text-cyan-500">arr[0..15]</code> into high-speed CPU cache, making array loops order of magnitude faster than linked node traversals.
          </p>
        </div>
      </div>

      {/* Shifting Cost Infographic */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>3. Element Shifting Cost Tradeoff (Insert / Delete)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-1">
          <div className="p-2.5 rounded-lg bg-background/70 border border-border">
            <span className="text-emerald-500 font-bold block mb-1">Tail Append / Pop</span>
            <span className="text-foreground font-bold">O(1) Amortized</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">Zero element shifts required.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-background/70 border border-border">
            <span className="text-amber-500 font-bold block mb-1">Middle Insert / Delete</span>
            <span className="text-foreground font-bold">O(n / 2) = O(n)</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">Shifts half of array elements.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-background/70 border border-border">
            <span className="text-red-400 font-bold block mb-1">Head Insert / Delete</span>
            <span className="text-foreground font-bold">O(n) Worst Case</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">Shifts all n elements across.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
