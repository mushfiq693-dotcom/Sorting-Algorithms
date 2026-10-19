"use client";

import React from "react";
import { Database, Cpu, ArrowRight, ArrowLeftRight, Zap, Layers, Binary, ShieldAlert, Scissors } from "lucide-react";

export function StringMemoryDiagram() {
  const characters = [
    { index: 0, char: "A", address: "0x7FFF00", offset: "+0B", dec: 65, hex: "0x41" },
    { index: 1, char: "L", address: "0x7FFF01", offset: "+1B", dec: 76, hex: "0x4C" },
    { index: 2, char: "G", address: "0x7FFF02", offset: "+2B", dec: 71, hex: "0x47" },
    { index: 3, char: "O", address: "0x7FFF03", offset: "+3B", dec: 79, hex: "0x4F" },
    { index: 4, char: "R", address: "0x7FFF04", offset: "+4B", dec: 82, hex: "0x52" },
    { index: 5, char: "I", address: "0x7FFF05", offset: "+5B", dec: 73, hex: "0x49" },
    { index: 6, char: "T", address: "0x7FFF06", offset: "+6B", dec: 84, hex: "0x54" },
    { index: 7, char: "H", address: "0x7FFF07", offset: "+7B", dec: 72, hex: "0x48" },
    { index: 8, char: "M", address: "0x7FFF08", offset: "+8B", dec: 77, hex: "0x4D" },
    { index: 9, char: "\\0", address: "0x7FFF09", offset: "+9B", dec: 0, hex: "0x00" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-500">
          <Database className="h-4 w-4" />
          <span>Contiguous 1-Byte Character Buffer &amp; ASCII Memory Strip</span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Base Address: 0x7FFF00 | sizeof(char) = 1 Byte
        </span>
      </div>

      {/* Physical Character Memory Strip */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-semibold text-foreground flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-cyan-500" />
            <span>Hardware Memory Layout: "ALGORITHM\\0"</span>
          </div>
          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
            Zero Pointer Fragmentation • 1 Byte per Cell
          </span>
        </div>

        <div className="w-full overflow-x-auto py-2">
          <div className="flex items-center gap-2 min-w-[620px]">
            {characters.map((cell) => {
              const isNullTerminator = cell.char === "\\0";
              return (
                <div key={cell.index} className="flex-1 flex flex-col items-center gap-1.5 font-mono">
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                    {cell.address}
                  </span>

                  <div
                    className={`w-full h-20 rounded-xl flex flex-col items-center justify-between p-1.5 border transition-all ${
                      isNullTerminator
                        ? "bg-secondary/30 border-dashed border-border/80 text-muted-foreground"
                        : "bg-secondary/70 border-cyan-500/40 text-foreground"
                    }`}
                  >
                    <span className="text-[9px] opacity-70">{cell.offset}</span>
                    <span className="text-base sm:text-lg font-bold text-foreground">
                      {cell.char}
                    </span>
                    <span className="text-[8px] font-mono opacity-60">
                      {cell.hex} ({cell.dec})
                    </span>
                  </div>

                  <span className="text-xs font-bold text-foreground">[{cell.index}]</span>
                  <span className="text-[9px] text-muted-foreground">
                    {isNullTerminator ? "Null Byte" : `Char #${cell.index + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Architectural Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Column: Two-Pointer & In-Place Reversal */}
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            <ArrowLeftRight className="h-4 w-4 text-cyan-500" />
            <span>1. Two-Pointer In-Place Reversal &amp; Palindromes</span>
          </div>
          <p className="text-xs text-foreground leading-relaxed">
            Because character memory is contiguous, two integer index pointers <code className="text-cyan-500">Left = 0</code> and <code className="text-cyan-500">Right = n - 1</code> can walk inward symmetrically:
          </p>
          <div className="p-2.5 rounded-lg bg-background/80 border border-border text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 space-y-1">
            <div>while (left &lt; right) swap(s[left++], s[right--]);</div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Guarantees strict <strong className="text-foreground">O(n/2) = O(n)</strong> time and <strong className="text-emerald-500">O(1)</strong> auxiliary space with zero heap allocations.
          </p>
        </div>

        {/* Right Column: Sliding Window Substring Scanning */}
        <div className="p-4 rounded-xl border border-border bg-secondary/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
            <Scissors className="h-4 w-4 text-emerald-500" />
            <span>2. The Sliding Window Paradigm</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Substrings represent contiguous slice intervals <code className="font-mono text-cyan-500">s[L..R]</code>. Instead of evaluating all $O(n^2)$ possible substrings, the sliding window dynamically expands $R$ to consume characters and contracts $L$ when duplicates or constraints are violated:
          </p>
          <div className="p-2.5 rounded-lg bg-background/80 border border-border text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Window Size = (Right - Left + 1) • Time: O(n) single scan
          </div>
        </div>
      </div>

      {/* String Immutability Overhead Infographic */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          <span>3. The Immutability Trap: Why str += &quot;!&quot; in a Loop Crashes Performance</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-background/70 border border-border space-y-1.5">
            <div className="flex items-center justify-between text-emerald-500 font-bold">
              <span>C++ std::string (Mutable)</span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">O(1) In-Place</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
              Modifying <code className="text-cyan-500">s[i] = &apos;X&apos;</code> writes directly to physical RAM address <code className="font-mono">0x7FFF00 + i</code>. The buffer is modified in-place with zero memory allocation and zero copied bytes.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-background/70 border border-border space-y-1.5">
            <div className="flex items-center justify-between text-red-400 font-bold">
              <span>Python / Java / JS (Immutable)</span>
              <span className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded">O(n) Copy Overhead</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
              Strings are read-only objects. Modifying one character or appending in a loop allocates a <strong>completely new memory buffer</strong> of size $n$, copies all $n$ characters over, and discards the old buffer. In a loop of $n$ iterations, this costs $O(n^2)$ time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
