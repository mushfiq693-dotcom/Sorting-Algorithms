"use client";

import React, { useState } from "react";
import {
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Workflow,
  Repeat,
  Compass,
  Sliders,
  Maximize2,
  Minimize2,
} from "lucide-react";

export function SlidingWindowDiagram() {
  const [activeTab, setActiveTab] = useState<"fixed" | "dynamic" | "frequency" | "monotonic">("fixed");

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-fuchsia-500" />
          <span className="text-foreground font-bold">
            Sliding Window Technique (Fixed, Dynamic &amp; Monotonic)
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Time Complexity: O(n) Amortized
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Auxiliary Space: O(1) or O(k)
          </span>
          <span className="px-2 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/20 font-bold">
            Optimization: Delta Math Eliminates O(n·k)
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("fixed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "fixed"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Fixed-Size Window (K-Slide)</span>
        </button>

        <button
          onClick={() => setActiveTab("dynamic")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "dynamic"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Dynamic Expand &amp; Shrink</span>
        </button>

        <button
          onClick={() => setActiveTab("frequency")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "frequency"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Frequency Hash Window</span>
        </button>

        <button
          onClick={() => setActiveTab("monotonic")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "monotonic"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Workflow className="h-3.5 w-3.5" />
          <span>Monotonic Deque Window</span>
        </button>
      </div>

      {/* TAB 1: Fixed-Size Window */}
      {activeTab === "fixed" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-fuchsia-500 uppercase tracking-wider">
              Pattern 1: Fixed-Length Contiguous Window
            </span>
            <h4 className="text-sm font-bold text-foreground">
              O(1) Delta Update Invariant: sum = prevSum - leaving + entering
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When the required window length is fixed at size K, we avoid recalculating the sum of K elements from scratch at each step. Instead of an O(n · K) brute force nested loop, we maintain a running aggregate: as the window slides rightward by 1 step, we subtract the element falling out on the left and add the newly included element on the right in O(1) constant time.
            </p>
          </div>

          {/* Graphical Frame Slide Representation */}
          <div className="p-5 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 flex flex-col gap-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fuchsia-400">
              Visualizing the O(1) Window Transition (K = 3)
            </span>

            {/* Step T: [2, 1, 5] */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono text-muted-foreground">
                Time t: Window [0..2] = [2, 1, 5] → Sum = 8
              </span>
              <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto py-1">
                <div className="p-2.5 rounded-lg border-2 border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300 font-bold min-w-[50px] text-center shadow-sm">
                  [2]
                </div>
                <div className="p-2.5 rounded-lg border-2 border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300 font-bold min-w-[50px] text-center shadow-sm">
                  [1]
                </div>
                <div className="p-2.5 rounded-lg border-2 border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300 font-bold min-w-[50px] text-center shadow-sm">
                  [5]
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-secondary/30 text-muted-foreground min-w-[50px] text-center">
                  [1]
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-secondary/30 text-muted-foreground min-w-[50px] text-center">
                  [3]
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-secondary/30 text-muted-foreground min-w-[50px] text-center">
                  [2]
                </div>
              </div>
            </div>

            {/* Transition Delta Arrow */}
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground pl-2 py-0.5">
              <span className="text-rose-400 font-bold">- Subtract Leaving arr[0] (2)</span>
              <span>+</span>
              <span className="text-emerald-400 font-bold">+ Add Entering arr[3] (1)</span>
              <span>=</span>
              <span className="text-foreground font-bold">New Sum = 8 - 2 + 1 = 7</span>
            </div>

            {/* Step T+1: [1, 5, 1] */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono text-muted-foreground">
                Time t+1: Window [1..3] = [1, 5, 1] → Sum = 7
              </span>
              <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto py-1">
                <div className="p-2.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400 line-through min-w-[50px] text-center opacity-60">
                  [2]
                </div>
                <div className="p-2.5 rounded-lg border-2 border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300 font-bold min-w-[50px] text-center shadow-sm">
                  [1]
                </div>
                <div className="p-2.5 rounded-lg border-2 border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300 font-bold min-w-[50px] text-center shadow-sm">
                  [5]
                </div>
                <div className="p-2.5 rounded-lg border-2 border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300 font-bold min-w-[50px] text-center shadow-sm">
                  [1]
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-secondary/30 text-muted-foreground min-w-[50px] text-center">
                  [3]
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-secondary/30 text-muted-foreground min-w-[50px] text-center">
                  [2]
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Complexity Invariant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-border bg-secondary/30 flex flex-col gap-1.5">
              <span className="font-mono font-bold text-foreground">Naive Brute-Force Recomputation</span>
              <p className="text-muted-foreground">
                For every index i from 0 to n - K, summing K elements requires K additions. Total operations = (n - K + 1) · K = O(n · K). When K = n/2, this degrades to O(n²).
              </p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-1.5">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Sliding Window O(1) Delta Update</span>
              <p className="text-foreground">
                Sum at step i is derived directly from step i-1 with 1 addition and 1 subtraction. Total operations = K (initial window) + 2(n - K) = O(n) strictly linear time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Dynamic Expand & Shrink */}
      {activeTab === "dynamic" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-wider">
              Pattern 2: Dynamic Window (Condition-Triggered Contraction)
            </span>
            <h4 className="text-sm font-bold text-foreground">
              Greedy Expansion (R++) &amp; Minimal Contraction (L++)
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When searching for the shortest or longest subarray satisfying a condition (such as sum ≥ Target or at most K distinct elements), the window size is dynamic. R expands greedily to satisfy the condition, and L contracts greedily to minimize the window.
            </p>
          </div>

          {/* Two Phase Loop Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                <Maximize2 className="h-4 w-4" />
                <span>Phase 1: Outer Expansion Loop (R++)</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                The outer pointer R iterates sequentially across every index from 0 to n - 1. Each incoming element arr[R] is absorbed into the active window state (sum, frequency map, or zero counter).
              </p>
              <div className="p-2.5 rounded-lg bg-secondary/60 border border-border font-mono text-xs text-cyan-300">
                windowSum += arr[right];
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                <Minimize2 className="h-4 w-4" />
                <span>Phase 2: Inner Contraction Loop (while condition met)</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                As long as the window condition is satisfied (e.g. windowSum ≥ Target), update the answer (minLen = min(minLen, R - L + 1)) and contract the window from the left by subtracting arr[L] and incrementing L++.
              </p>
              <div className="p-2.5 rounded-lg bg-secondary/60 border border-border font-mono text-xs text-amber-300">
                while (windowSum &gt;= target) &#123; minLen = min(minLen, R - L + 1); windowSum -= arr[left++]; &#125;
              </div>
            </div>
          </div>

          {/* Proof of O(n) Amortized Runtime */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-2 text-xs">
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Mathematical Proof: Why is Nested While Loop O(n) Instead of O(n²)?</span>
            </span>
            <p className="text-foreground leading-relaxed">
              Although the code contains an inner <code>while</code> loop nested inside a <code>for</code> loop, the left pointer L starts at 0 and strictly moves rightward (it is NEVER reset to 0). Over the entire execution, R increments at most n times, and L increments at most n times. Total pointer advances across both loops ≤ 2n. Therefore, the amortized runtime is strictly O(2n) = O(n).
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Frequency Hash Window */}
      {activeTab === "frequency" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
              Pattern 3: Auxiliary State &amp; Frequency Hash Windows
            </span>
            <h4 className="text-sm font-bold text-foreground">
              Instant Left-Pointer Hopping with Last-Seen Index Maps
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For problems like "Longest Substring Without Repeating Characters" (LeetCode 3), storing the last-seen index of each character allows the left pointer to instantly hop past the previous occurrence of a duplicate character without step-by-step single-character contraction.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col gap-3 font-mono text-xs">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              The Left Pointer Hopping Invariant:
            </span>
            <div className="p-3 rounded-xl bg-background/80 border border-border font-bold text-foreground text-sm">
              left = max(left, lastSeen[currentChar] + 1);
            </div>
            <p className="text-muted-foreground leading-relaxed font-sans">
              Why the <code>max()</code> guard? If a character was seen at index 2, but our left pointer has already contracted to index 5 due to other duplicates, we must NOT let the left pointer move backwards to 2 + 1 = 3! The <code>max()</code> ensures the left pointer only ever moves monotonically forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 flex flex-col gap-1">
              <span className="font-mono font-bold text-foreground">Time Complexity</span>
              <span className="font-mono text-emerald-500 font-bold">O(n) Single Pass</span>
              <p className="text-muted-foreground text-[11px]">
                Each character is processed at most once by R, and L only hops forward.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 flex flex-col gap-1">
              <span className="font-mono font-bold text-foreground">Space Complexity</span>
              <span className="font-mono text-cyan-400 font-bold">O(min(m, n))</span>
              <p className="text-muted-foreground text-[11px]">
                Hash map stores at most the size of the character alphabet (e.g. 128 ASCII or 26 lowercase).
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-secondary/30 flex flex-col gap-1">
              <span className="font-mono font-bold text-foreground">Common Applications</span>
              <span className="font-mono text-amber-400 font-bold">LeetCode 3, 76, 438</span>
              <p className="text-muted-foreground text-[11px]">
                Minimum window substring, anagram permutations, unique substrings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Monotonic Deque Window */}
      {activeTab === "monotonic" && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-150">
          <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-wider">
              Pattern 4: Monotonic Deque Window (Sliding Window Maximum)
            </span>
            <h4 className="text-sm font-bold text-foreground">
              O(1) Extremum Queries per Slide via Monotonic Candidate Pruning
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When sliding a window of size K and querying the maximum element at each step (LeetCode 239), a simple heap takes O(n log K). A Monotonic Deque maintains indices of candidates in strictly decreasing order of value, enabling O(1) peek and O(n) total runtime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex flex-col gap-1.5">
              <span className="font-mono font-bold text-rose-400">1. Prune Smaller Elements</span>
              <p className="text-foreground leading-relaxed">
                Before adding arr[R], pop elements from the back of the deque while <code>arr[deque.back()] &le; arr[R]</code>. An older, smaller element can NEVER be the maximum again.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col gap-1.5">
              <span className="font-mono font-bold text-amber-400">2. Evict Out-of-Bounds</span>
              <p className="text-foreground leading-relaxed">
                If the front element has fallen outside the current window (i.e. <code>deque.front() &lt; R - K + 1</code>), pop it from the front in O(1) time.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-1.5">
              <span className="font-mono font-bold text-emerald-400">3. Root is Current Max</span>
              <p className="text-foreground leading-relaxed">
                The front index of the deque <code>deque.front()</code> is always guaranteed to point to the maximum value of the active window in O(1) time.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between gap-4 flex-wrap text-xs font-mono">
            <div>
              <span className="text-muted-foreground">Heap Approach: </span>
              <span className="text-amber-400 font-bold">O(n log K)</span>
            </div>
            <div className="text-border">|</div>
            <div>
              <span className="text-muted-foreground">Monotonic Deque: </span>
              <span className="text-emerald-400 font-bold">O(n) Linear Time</span>
            </div>
            <div className="text-border">|</div>
            <div>
              <span className="text-muted-foreground">Deque Size: </span>
              <span className="text-cyan-400 font-bold">At most K elements</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
