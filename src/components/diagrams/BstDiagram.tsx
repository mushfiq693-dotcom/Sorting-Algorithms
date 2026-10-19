"use client";

import React, { useState } from "react";
import { GitFork, Layers, Split, Database, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, AlertTriangle, Trash2 } from "lucide-react";

export function BstDiagram() {
  const [activeTab, setActiveTab] = useState<"invariant" | "deletion" | "skew">("invariant");

  return (
    <div className="flex flex-col gap-6 w-full select-text">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <GitFork className="h-4 w-4 text-emerald-500" />
          <span className="text-foreground font-bold">
            Binary Search Tree (BST) Architectural Blueprint
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Search: O(log n) avg
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            In-Order: Sorted Ascending
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
            Skew Worst: O(n)
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("invariant")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "invariant"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>BST Invariant &amp; Ordering</span>
        </button>
        <button
          onClick={() => setActiveTab("deletion")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "deletion"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>3-Case Deletion Anatomy</span>
        </button>
        <button
          onClick={() => setActiveTab("skew")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "skew"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Balanced vs Degenerate Hazard</span>
        </button>
      </div>

      {/* Main Blueprint Card */}
      <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        {activeTab === "invariant" && (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: SVG Diagram of Invariant */}
            <div className="md:col-span-7 p-4 rounded-xl border border-border bg-secondary/30 flex flex-col items-center justify-center">
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                <span>LEFT &lt; ROOT &lt; RIGHT ORDERING RULE</span>
              </div>

              <svg className="w-full max-w-[380px] h-[230px]" viewBox="0 0 380 230">
                <defs>
                  <linearGradient id="bstLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="bstRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                  <linearGradient id="bstRootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>

                {/* Left Subtree Region Highlight */}
                <ellipse cx="110" cy="140" rx="80" ry="60" fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeDasharray="3 3" strokeWidth="1.2" />
                <text x="110" y="215" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  All Keys &lt; 50 (Left Subtree)
                </text>

                {/* Right Subtree Region Highlight */}
                <ellipse cx="270" cy="140" rx="80" ry="60" fill="#10b981" fillOpacity="0.08" stroke="#10b981" strokeDasharray="3 3" strokeWidth="1.2" />
                <text x="270" y="215" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  All Keys &gt; 50 (Right Subtree)
                </text>

                {/* Edges from 50 */}
                <line x1="190" y1="35" x2="110" y2="95" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="190" y1="35" x2="270" y2="95" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

                {/* Edges from 30 */}
                <line x1="110" y1="95" x2="65" y2="155" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <line x1="110" y1="95" x2="155" y2="155" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

                {/* Edges from 70 */}
                <line x1="270" y1="95" x2="225" y2="155" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                <line x1="270" y1="95" x2="315" y2="155" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

                {/* Root Node (50) */}
                <circle cx="190" cy="35" r="20" fill="url(#bstRootGrad)" stroke="#ffffff" strokeWidth="2" />
                <text x="190" y="40" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">50</text>

                {/* Node 30 */}
                <circle cx="110" cy="95" r="17" fill="url(#bstLeftGrad)" stroke="#ffffff" strokeWidth="1.5" />
                <text x="110" y="100" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">30</text>

                {/* Node 70 */}
                <circle cx="270" cy="95" r="17" fill="url(#bstRightGrad)" stroke="#ffffff" strokeWidth="1.5" />
                <text x="270" y="100" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">70</text>

                {/* Leaves */}
                <circle cx="65" cy="155" r="14" fill="#3b82f6" />
                <text x="65" y="159" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">20</text>

                <circle cx="155" cy="155" r="14" fill="#3b82f6" />
                <text x="155" y="159" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">40</text>

                <circle cx="225" cy="155" r="14" fill="#10b981" />
                <text x="225" y="159" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">60</text>

                <circle cx="315" cy="155" r="14" fill="#10b981" />
                <text x="315" y="159" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">80</text>
              </svg>
            </div>

            {/* Right: Invariant Guarantees */}
            <div className="md:col-span-5 flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="font-bold text-foreground block mb-1">1. Global Subtree Trichotomy</span>
                <p className="text-muted-foreground leading-relaxed">
                  The BST invariant is NOT just local! Every single node in the entire left subtree of node $X$ must be strictly smaller than $X$, and every node in the right subtree must be strictly greater.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="font-bold text-foreground block mb-1">2. In-Order Yields Sorted Array</span>
                <p className="text-muted-foreground leading-relaxed">
                  Traversing Left &rarr; Root &rarr; Right on any valid BST guarantees a strictly ascending sequence: <code className="text-emerald-500 font-mono font-bold">[20, 30, 40, 50, 60, 70, 80]</code>.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="font-bold text-foreground block mb-1">3. Binary Decision at Every Step</span>
                <p className="text-muted-foreground leading-relaxed">
                  Comparing target <code className="text-primary font-mono">T</code> with current node allows immediately discarding half the remaining search space, exactly like Binary Search on arrays!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "deletion" && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Case 1: Leaf */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
                  Case 1: Leaf Node
                </span>
              </div>
              <p className="font-semibold text-foreground">Zero Children (Degree 0)</p>
              <p className="text-muted-foreground leading-relaxed">
                The node has no descendants (<code className="font-mono">left == nullptr &amp;&amp; right == nullptr</code>). Simply sever the parent’s pointer and free memory.
              </p>
              <div className="mt-auto p-2 rounded bg-secondary/60 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                delete target; return nullptr;
              </div>
            </div>

            {/* Case 2: One Child */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold font-mono text-[11px]">
                  Case 2: Single Child
                </span>
              </div>
              <p className="font-semibold text-foreground">One Subtree (Degree 1)</p>
              <p className="text-muted-foreground leading-relaxed">
                The node has exactly one child. Splice out the node by directly linking the parent’s pointer to the sole grandchild.
              </p>
              <div className="mt-auto p-2 rounded bg-secondary/60 font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                Node* child = root-&gt;left ? root-&gt;left : root-&gt;right;
              </div>
            </div>

            {/* Case 3: Two Children */}
            <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold font-mono text-[11px]">
                  Case 3: Two Children
                </span>
              </div>
              <p className="font-semibold text-foreground">Two Subtrees (Degree 2)</p>
              <p className="text-muted-foreground leading-relaxed">
                Find the In-Order Successor (smallest node in right subtree). Copy its value to target, then recursively delete the successor from the right subtree.
              </p>
              <div className="mt-auto p-2 rounded bg-secondary/60 font-mono text-[11px] text-purple-600 dark:text-purple-400">
                root-&gt;val = successor-&gt;val; root-&gt;right = del(root-&gt;right, succ);
              </div>
            </div>
          </div>
        )}

        {activeTab === "skew" && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Balanced BST */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Balanced BST: O(log n)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Ideal Topology
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                When elements are inserted in random or balanced order, height $h \approx \log_2(n)$. Every decision cuts remaining nodes in half. For $n = 1,000,000$, search takes only ~20 comparisons!
              </p>
              <div className="p-2.5 rounded bg-card border border-border text-[11px] font-mono flex justify-between items-center">
                <span>Height $h$:</span>
                <span className="font-bold text-emerald-500">&lfloor;log₂ n&rfloor;</span>
              </div>
            </div>

            {/* Degenerate Skewed BST */}
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Degenerate Skew: O(n)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                  Pathological Risk
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Inserting pre-sorted numbers (e.g. 10, 20, 30, 40, 50) forms a single linked list branch! Height collapses to $h = n$, destroying logarithmic search and causing $O(n)$ search time.
              </p>
              <div className="p-2.5 rounded bg-card border border-border text-[11px] font-mono flex justify-between items-center">
                <span>Height $h$:</span>
                <span className="font-bold text-rose-500">n (Linear List)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
