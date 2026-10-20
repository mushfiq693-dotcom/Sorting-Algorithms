"use client";

import React, { useState } from "react";
import {
  Boxes,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  GitFork,
  Activity,
  CheckCircle2,
  Workflow,
  Zap,
} from "lucide-react";

export function PriorityQueueDiagram() {
  const [activeTab, setActiveTab] = useState<"architecture" | "scheduler" | "dijkstra" | "decrease-key">("architecture");

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Boxes className="h-4 w-4 text-amber-500" />
          <span className="text-foreground font-bold">
            Priority Queue (Abstract Data Type &amp; Heap Implementation)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
            Peek Extreme: O(1)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Push / Pop: O(log n)
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
            Decrease-Key: O(log n)
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("architecture")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "architecture"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>ADT vs Implementations</span>
        </button>

        <button
          onClick={() => setActiveTab("scheduler")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "scheduler"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>OS Process Scheduler Blueprint</span>
        </button>

        <button
          onClick={() => setActiveTab("dijkstra")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "dijkstra"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Workflow className="h-3.5 w-3.5" />
          <span>Dijkstra Shortest Path Frontier</span>
        </button>

        <button
          onClick={() => setActiveTab("decrease-key")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "decrease-key"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Change Priority / Decrease-Key</span>
        </button>
      </div>

      {/* TAB 1: ADT vs Implementations */}
      {activeTab === "architecture" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2 font-heading">
              <Boxes className="h-4 w-4 text-amber-500" />
              <span>Abstract Data Type (ADT) vs Concrete Implementation</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A <strong>Priority Queue</strong> is an abstract interface defining three operations: <code>push(item, priority)</code>, <code>pop()</code> (extract highest priority), and <code>peek()</code>. Unlike a standard FIFO queue where ordering is determined strictly by arrival time, a Priority Queue dispatches elements based on their intrinsic weight or urgency.
            </p>
          </div>

          {/* Implementation Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Approach 1: Unsorted List */}
            <div className="p-4 rounded-xl border border-border bg-card/70 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Approach 1
                </span>
                <h5 className="font-heading font-bold text-sm text-foreground mt-2">Unsorted Array</h5>
                <p className="text-xs text-muted-foreground mt-1">Appends new tasks to the end in O(1). Must scan all n items linearly on every extraction.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border font-mono text-[11px] space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Enqueue:</span><span className="text-emerald-500 font-bold">O(1)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dequeue:</span><span className="text-rose-500 font-bold">O(n) slow</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Peek:</span><span className="text-rose-500 font-bold">O(n)</span></div>
              </div>
            </div>

            {/* Approach 2: Sorted Array */}
            <div className="p-4 rounded-xl border border-border bg-card/70 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Approach 2
                </span>
                <h5 className="font-heading font-bold text-sm text-foreground mt-2">Sorted Array</h5>
                <p className="text-xs text-muted-foreground mt-1">Keeps array fully sorted. Extracting top element is O(1), but insertion requires O(n) element shifts.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border font-mono text-[11px] space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Enqueue:</span><span className="text-rose-500 font-bold">O(n) shifts</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dequeue:</span><span className="text-emerald-500 font-bold">O(1)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Peek:</span><span className="text-emerald-500 font-bold">O(1)</span></div>
              </div>
            </div>

            {/* Approach 3: Balanced BST */}
            <div className="p-4 rounded-xl border border-border bg-card/70 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  Approach 3
                </span>
                <h5 className="font-heading font-bold text-sm text-foreground mt-2">Self-Balancing BST</h5>
                <p className="text-xs text-muted-foreground mt-1">Guarantees O(log n) operations, but incurs heavy pointer overhead (left, right, parent) and poor CPU cache locality.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border font-mono text-[11px] space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Enqueue:</span><span className="text-cyan-500 font-bold">O(log n)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dequeue:</span><span className="text-cyan-500 font-bold">O(log n)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Peek:</span><span className="text-cyan-500 font-bold">O(log n)</span></div>
              </div>
            </div>

            {/* Approach 4: Binary Heap (Gold Standard) */}
            <div className="p-4 rounded-xl border-2 border-amber-500/60 bg-amber-500/10 shadow-md shadow-amber-500/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 w-fit">
                  <Sparkles className="h-3 w-3" /> Gold Standard
                </span>
                <h5 className="font-heading font-bold text-sm text-foreground mt-2">Binary Heap (Optimal)</h5>
                <p className="text-xs text-muted-foreground mt-1">Zero pointers. Mapped directly into 1D array. O(1) peek with perfectly balanced O(log n) insertion and deletion.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/30 font-mono text-[11px] space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Enqueue:</span><span className="text-emerald-500 font-bold">O(log n) Sift-Up</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dequeue:</span><span className="text-emerald-500 font-bold">O(log n) Sift-Down</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Peek:</span><span className="text-emerald-500 font-bold">O(1) Instant</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OS Process Scheduler Blueprint */}
      {activeTab === "scheduler" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl border border-border bg-card/60">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2 font-heading">
              <Cpu className="h-4 w-4 text-cyan-500" />
              <span>Real-Time OS CPU Scheduling Pipeline</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Modern operating system kernels (Linux CFS, Windows NT scheduler) manage thousands of concurrent threads. Critical hardware interrupts and UI refresh frames must preempt background tasks instantly. The kernel maintains a <strong>Max-Priority Queue</strong> where the CPU execution core dequeues the highest priority ready thread in $O(\log n)$.
            </p>
          </div>

          {/* Visual Execution Runway */}
          <div className="p-5 rounded-2xl border border-border bg-secondary/30 flex flex-col gap-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Scheduler Execution Runway (Left = Top Priority / Next to Run)
            </span>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <div className="shrink-0 p-3.5 rounded-xl border-2 border-rose-500/80 bg-rose-500/10 shadow-lg shadow-rose-500/10 w-44">
                <div className="flex items-center justify-between text-[11px] font-mono text-rose-500 font-bold">
                  <span>ROOT [0]</span>
                  <span>PRIO 99</span>
                </div>
                <div className="font-bold text-xs text-foreground mt-1">Kernel Panic IRQ</div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-mono mt-0.5">NEXT DISPATCH &rarr;</div>
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

              <div className="shrink-0 p-3 rounded-xl border border-amber-500/60 bg-amber-500/10 w-40">
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-500 font-bold">
                  <span>INDEX [1]</span>
                  <span>PRIO 90</span>
                </div>
                <div className="font-bold text-xs text-foreground mt-1">GPU V-Sync Frame</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Render Engine</div>
              </div>

              <div className="shrink-0 p-3 rounded-xl border border-cyan-500/60 bg-cyan-500/10 w-40">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-500 font-bold">
                  <span>INDEX [2]</span>
                  <span>PRIO 84</span>
                </div>
                <div className="font-bold text-xs text-foreground mt-1">Audio Mixer Stream</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Buffer Refill</div>
              </div>

              <div className="shrink-0 p-3 rounded-xl border border-border bg-card/60 w-36 opacity-75">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>INDEX [3]</span>
                  <span>PRIO 68</span>
                </div>
                <div className="font-semibold text-xs text-foreground mt-1">User Keyboard</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Event Loop</div>
              </div>

              <div className="shrink-0 p-3 rounded-xl border border-border bg-card/60 w-36 opacity-50">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>INDEX [6]</span>
                  <span>PRIO 15</span>
                </div>
                <div className="font-semibold text-xs text-foreground mt-1">Garbage Collector</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Background Idle</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Dijkstra Shortest Path Frontier */}
      {activeTab === "dijkstra" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl border border-border bg-card/60">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2 font-heading">
              <Workflow className="h-4 w-4 text-emerald-500" />
              <span>Dijkstra's Algorithm Exploration Frontier (Min-Priority Queue)</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dijkstra's Single-Source Shortest Path algorithm relies crucially on a <strong>Min-Priority Queue</strong> to drive greedy exploration. The priority key is the tentative distance from the source vertex. By always extracting the vertex with the minimum tentative distance in $O(\log V)$, Dijkstra avoids scanning all vertices, bringing the total time down from $O(V^2)$ to $O((V + E) \log V)$.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">1. Initialize Distance</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Source vertex pushed with <code>dist = 0</code>. All other vertices initialize to <code>dist = &infin;</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">2. Extract Minimum</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Min-PQ extracts the unsettled vertex <code>u</code> closest to source in $O(\log V)$. Its shortest path is now guaranteed optimal.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-2">
              <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">3. Edge Relaxation</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For each neighbor <code>v</code>, if <code>dist[u] + weight(u,v) &lt; dist[v]</code>, push or update <code>v</code> into the PQ with lower distance (Decrease-Key).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Decrease-Key & Sift Mechanics */}
      {activeTab === "decrease-key" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl border border-border bg-card/60">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2 font-heading">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span>Priority Modification Mechanics (Decrease-Key / Increase-Key)</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a task's priority changes dynamically while already queued in the heap:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="p-3.5 rounded-lg border border-border bg-background/50">
                <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Priority Escalation (More Urgent)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  The task bubbles upward toward the root using <strong>Sift-Up</strong> in $O(\log n)$ by repeatedly comparing with its parent node.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-background/50">
                <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Priority Demotion (Less Urgent)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  The task sinks downward toward the leaves using <strong>Sift-Down</strong> in $O(\log n)$ by swapping with its highest-priority child.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
