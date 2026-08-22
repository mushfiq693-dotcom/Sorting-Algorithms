"use client";

import React from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";

export function QueueFIFODiagram() {
  const queueSlots = [
    { idx: 0, val: 5, role: "FRONT" },
    { idx: 1, val: 15, role: null },
    { idx: 2, val: 25, role: null },
    { idx: 3, val: 35, role: "REAR" },
    { idx: 4, val: null, role: "EMPTY" },
    { idx: 5, val: null, role: "EMPTY" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-500">
            <RefreshCw className="h-4 w-4" />
            <span>FIFO Circular Queue Ring Anatomy</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Capacity: 6 Slots • count = 4
          </span>
        </div>

        {/* Horizontal Buffer Diagram */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1 font-bold text-red-500">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>EXIT (Front = [0])</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-blue-500">
              <span>ENTRY (Rear = [3])</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {queueSlots.map((slot) => (
              <div key={slot.idx} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-full h-14 rounded-xl flex flex-col items-center justify-center border font-mono font-bold text-sm shadow-sm ${
                    slot.role === "FRONT"
                      ? "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-300"
                      : slot.role === "REAR"
                      ? "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-300"
                      : slot.val !== null
                      ? "bg-card border-border text-foreground"
                      : "bg-secondary/20 border-dashed border-border/60 text-muted-foreground/30"
                  }`}
                >
                  <span>{slot.val !== null ? slot.val : "-"}</span>
                  {slot.role && (
                    <span className="text-[9px] font-extrabold uppercase tracking-tighter">
                      {slot.role}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                  [{slot.idx}]
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Pointer Explanations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
          <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/10 space-y-1">
            <div className="font-bold text-blue-600 dark:text-blue-300">
              Enqueue Modulo Wrapping:
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              <code>rear = (rear + 1) % capacity</code> wraps seamlessly from index 5 back to 0 without moving existing items.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 space-y-1">
            <div className="font-bold text-red-600 dark:text-red-300">
              Dequeue Modulo Wrapping:
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              <code>front = (front + 1) % capacity</code> frees slots in constant O(1) time without shifting arrays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
