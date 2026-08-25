"use client";

import React from "react";
import { HardDrive, Layers, Box, Database, ShieldCheck, Zap, AlertCircle } from "lucide-react";

export function SpaceComplexityDiagram() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-slate-950/80 p-5 sm:p-7 text-slate-100 shadow-2xl">
      {/* Visual Memory Anatomy: Input vs Auxiliary Space */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="h-4 w-4 text-cyan-400" />
            <span>Memory Anatomy: Total Space = Input Space + Auxiliary Space</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
            RAM Allocation Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Space Card */}
          <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-blue-400 flex items-center gap-2">
                <Box className="h-4 w-4" /> Input Space O(n)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                Fixed by Caller
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The memory required to store the original input dataset (e.g. an array of n integers passed into the function).
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-blue-500/20 font-mono text-[11px] text-blue-300">
              <code>int arr[n] = &#123;29, 10, 14, 37...&#125;; // Caller provides</code>
            </div>
          </div>

          {/* Auxiliary Space Card */}
          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                <Layers className="h-4 w-4" /> Auxiliary Space S(n)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Algorithm Overhead
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The <strong>extra or temporary memory</strong> allocated by the algorithm itself to solve the problem (temporary arrays, recursion stack frames, hash sets).
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 font-mono text-[11px] text-cyan-300">
              <code>vector&lt;int&gt; temp(n); // Extra heap buffer allocated</code>
            </div>
          </div>
        </div>
      </div>

      {/* Stack vs Heap Memory Layout Infographic */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Database className="h-4 w-4 text-purple-400" />
          <span>Physical Process Memory Architecture</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          {/* Stack Memory */}
          <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300">Stack Memory</span>
              <span className="text-[9px] text-purple-400">Fast / Fixed</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Stores local primitive variables, loop iterators (<code>i</code>, <code>j</code>), and function call stack frames during recursion.
            </p>
            <span className="text-[10px] font-bold text-purple-400 block pt-1">
              Depth: O(1) loop → O(log n) tree → O(n) linear
            </span>
          </div>

          {/* Heap Memory */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300">Heap Memory</span>
              <span className="text-[9px] text-amber-400">Dynamic / Scalable</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Stores dynamically allocated objects: <code>std::vector</code>, <code>malloc</code>, hash tables, and 2D matrices.
            </p>
            <span className="text-[10px] font-bold text-amber-400 block pt-1">
              Size: O(n) buffers → O(n²) matrices
            </span>
          </div>

          {/* In-Place Guarantee */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300">In-Place Invariant</span>
              <span className="text-[9px] text-emerald-400">Zero Extra Buffer</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              An algorithm is in-place if auxiliary space is strictly <code>O(1)</code> or <code>O(log n)</code> stack frames.
            </p>
            <span className="text-[10px] font-bold text-emerald-400 block pt-1">
              Bubble, Selection, Insertion, Quick Sort
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
