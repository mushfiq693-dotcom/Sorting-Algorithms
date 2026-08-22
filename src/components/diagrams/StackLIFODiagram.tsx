"use client";

import React from "react";
import { ArrowDown, ArrowUp, Layers, CheckCircle2 } from "lucide-react";

export function StackLIFODiagram() {
  const stackItems = [
    { value: 40, label: "Top of Stack (arr[3])", isTop: true, op: "Most Recent Push" },
    { value: 30, label: "arr[2]", isTop: false, op: "3rd Push" },
    { value: 20, label: "arr[1]", isTop: false, op: "2nd Push" },
    { value: 10, label: "arr[0] - Stack Base", isTop: false, op: "1st Push" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-500">
            <Layers className="h-4 w-4" />
            <span>LIFO Memory Anatomy</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            Top Pointer: index [3]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Vertical Container Diagram */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-500 mb-2 animate-pulse">
              <ArrowDown className="h-3.5 w-3.5" />
              <span>PUSH / POP OPENING</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </div>

            <div className="w-48 border-x-4 border-b-4 border-cyan-500/50 rounded-b-2xl p-2.5 bg-secondary/40 space-y-2">
              {stackItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`h-11 rounded-xl flex items-center justify-between px-3 font-mono font-bold text-xs border shadow-sm ${
                    item.isTop
                      ? "bg-cyan-500 text-white border-cyan-400 shadow-md shadow-cyan-500/30"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  <span>{item.value}</span>
                  {item.isTop ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 text-white">
                      TOP
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-normal">
                      arr[{3 - idx}]
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-[11px] font-mono text-muted-foreground mt-2">
              Closed Container Bottom
            </div>
          </div>

          {/* Operation Trace Annotation */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-1">
              <div className="font-bold text-cyan-600 dark:text-cyan-300">
                1. Push(50) Operation:
              </div>
              <p className="text-muted-foreground text-[11px] leading-tight">
                Increments topIndex to [4] and sets arr[4] = 50. Total cost: O(1).
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-secondary/60 space-y-1">
              <div className="font-bold text-foreground">2. Pop() Operation:</div>
              <p className="text-muted-foreground text-[11px] leading-tight">
                Returns arr[3] (40) and decrements topIndex to [2]. Total cost: O(1).
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border bg-secondary/60 space-y-1">
              <div className="font-bold text-foreground">3. Call Stack Link:</div>
              <p className="text-muted-foreground text-[11px] leading-tight">
                Recursive functions push return addresses and local parameters in identical LIFO order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
