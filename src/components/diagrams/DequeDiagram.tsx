"use client";

import React from "react";
import { ArrowLeft, ArrowRight, RotateCcw, RotateCw, Layers, ArrowLeftRight } from "lucide-react";

export function DequeDiagram() {
  const circularSlots = [
    { idx: 0, val: 42, role: "FRONT", hex: "0x1000" },
    { idx: 1, val: 58, role: null, hex: "0x1004" },
    { idx: 2, val: 73, role: null, hex: "0x1008" },
    { idx: 3, val: 89, role: "REAR", hex: "0x100C" },
    { idx: 4, val: null, role: "EMPTY", hex: "0x1010" },
    { idx: 5, val: null, role: "EMPTY", hex: "0x1014" },
    { idx: 6, val: null, role: "EMPTY", hex: "0x1018" },
    { idx: 7, val: null, role: "EMPTY", hex: "0x101C" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500">
          <ArrowLeftRight className="h-4 w-4" />
          <span>DOUBLE-ENDED QUEUE (DEQUE) ARCHITECTURAL BLUEPRINT</span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Circular Array & Pointer Wrap Topology
        </span>
      </div>

      {/* Main Dual-End Access Chamber */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Front End Control Box */}
        <div className="md:col-span-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5 flex flex-col items-center text-center space-y-2">
          <div className="text-xs font-mono font-bold text-red-500 flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>FRONT END (HEAD)</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Direct $O(1)$ Insertion & Deletion via Counter-Clockwise Wrap:
          </p>
          <div className="w-full space-y-1 font-mono text-[10px] bg-background/80 p-2 rounded-lg border border-border">
            <div className="text-emerald-500 flex justify-between">
              <span>pushFront:</span>
              <span className="font-bold">(F - 1 + N) % N</span>
            </div>
            <div className="text-red-400 flex justify-between">
              <span>popFront:</span>
              <span className="font-bold">(F + 1) % N</span>
            </div>
          </div>
        </div>

        {/* Central Circular Memory Buffer */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1 text-red-500 font-bold">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Front Pointer: Index [0]</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500 font-bold">
              <span>Rear Pointer: Index [3]</span>
              <RotateCw className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Slots Strip */}
          <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
            {circularSlots.map((slot) => {
              const isFront = slot.role === "FRONT";
              const isRear = slot.role === "REAR";
              const isOccupied = slot.val !== null;

              return (
                <div key={slot.idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full h-16 rounded-xl flex flex-col items-center justify-center border font-mono font-bold text-xs transition-all ${
                      isFront
                        ? "bg-red-500/15 border-red-500 text-red-600 dark:text-red-400 shadow-md shadow-red-500/10 ring-2 ring-red-500/30"
                        : isRear
                        ? "bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/30"
                        : isOccupied
                        ? "bg-secondary/40 border-border text-foreground"
                        : "bg-secondary/10 border-dashed border-border/50 text-muted-foreground/30"
                    }`}
                  >
                    <span className="text-sm">{slot.val !== null ? slot.val : "·"}</span>
                    <span className="text-[9px] tracking-tight text-muted-foreground font-mono">
                      [{slot.idx}]
                    </span>
                  </div>
                  {slot.role && slot.role !== "EMPTY" && (
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1 rounded ${
                        isFront ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {slot.role}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direction indicator footer */}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
            <span className="flex items-center gap-1 text-red-400">
              ◀ Grow Front (Index wrap 0 → 7)
            </span>
            <span className="text-muted-foreground/60">Capacity N = 8 Slots</span>
            <span className="flex items-center gap-1 text-blue-400">
              Grow Rear (Index wrap 7 → 0) ▶
            </span>
          </div>
        </div>

        {/* Rear End Control Box */}
        <div className="md:col-span-3 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col items-center text-center space-y-2">
          <div className="text-xs font-mono font-bold text-blue-500 flex items-center gap-1.5">
            <span>REAR END (TAIL)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Direct $O(1)$ Insertion & Deletion via Clockwise Wrap:
          </p>
          <div className="w-full space-y-1 font-mono text-[10px] bg-background/80 p-2 rounded-lg border border-border">
            <div className="text-emerald-500 flex justify-between">
              <span>pushBack:</span>
              <span className="font-bold">(R + 1) % N</span>
            </div>
            <div className="text-red-400 flex justify-between">
              <span>popBack:</span>
              <span className="font-bold">(R - 1 + N) % N</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doubly-Linked Alternative Infographic */}
      <div className="w-full p-4 rounded-xl border border-border/80 bg-background/50 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-500" />
            <span>Alternative Representation: Doubly-Linked Node Chain</span>
          </span>
          <span className="text-[10px] text-muted-foreground">
            Strict O(1) Operations with Bidirectional Pointers (prev ⇄ next)
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
          <span className="text-xs font-mono text-muted-foreground">nullptr</span>
          <span className="text-xs font-mono text-muted-foreground">⇄</span>

          <div className="px-3 py-2 rounded-lg border border-red-500/40 bg-red-500/10 text-center font-mono text-xs">
            <div className="text-[9px] font-bold text-red-500 uppercase">Head Node</div>
            <div className="font-bold text-foreground">42</div>
          </div>

          <span className="text-xs font-mono text-muted-foreground">⇄</span>

          <div className="px-3 py-2 rounded-lg border border-border bg-card text-center font-mono text-xs">
            <div className="text-[9px] text-muted-foreground uppercase">Node</div>
            <div className="font-bold text-foreground">58</div>
          </div>

          <span className="text-xs font-mono text-muted-foreground">⇄</span>

          <div className="px-3 py-2 rounded-lg border border-border bg-card text-center font-mono text-xs">
            <div className="text-[9px] text-muted-foreground uppercase">Node</div>
            <div className="font-bold text-foreground">73</div>
          </div>

          <span className="text-xs font-mono text-muted-foreground">⇄</span>

          <div className="px-3 py-2 rounded-lg border border-blue-500/40 bg-blue-500/10 text-center font-mono text-xs">
            <div className="text-[9px] font-bold text-blue-500 uppercase">Tail Node</div>
            <div className="font-bold text-foreground">89</div>
          </div>

          <span className="text-xs font-mono text-muted-foreground">⇄</span>
          <span className="text-xs font-mono text-muted-foreground">nullptr</span>
        </div>
      </div>
    </div>
  );
}
