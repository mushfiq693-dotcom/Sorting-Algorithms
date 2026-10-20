"use client";

import React, { useState } from "react";
import {
  GitFork,
  Layers,
  Scale,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";

export function AvlTreeDiagram() {
  const [activeTab, setActiveTab] = useState<"rotations" | "bf" | "comparison">("rotations");
  const [rotationSubTab, setRotationSubTab] = useState<"LL" | "RR" | "LR" | "RL">("LL");

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* Telemetry Metric Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-emerald-500" />
          <span className="text-foreground font-bold">
            AVL Tree Self-Balancing Architecture &amp; Rotation Mechanics
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
            Search/Insert/Delete: O(log n)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Max Height: &lt; 1.44 log₂(n)
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-bold">
            BF: {"{-1, 0, +1}"}
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("rotations")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "rotations"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>The 4 Rotation Types (LL, RR, LR, RL)</span>
        </button>
        <button
          onClick={() => setActiveTab("bf")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "bf"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Balance Factor &amp; Invariant Invariants</span>
        </button>
        <button
          onClick={() => setActiveTab("comparison")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "comparison"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>AVL vs Naive BST Height Bound</span>
        </button>
      </div>

      {/* Main Blueprint Card */}
      <div className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        {activeTab === "rotations" && (
          <div className="w-full space-y-5">
            {/* Sub-tabs for LL, RR, LR, RL */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">Select Case:</span>
              {(["LL", "RR", "LR", "RL"] as const).map((caseType) => (
                <button
                  key={caseType}
                  onClick={() => setRotationSubTab(caseType)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    rotationSubTab === caseType
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {caseType} Case
                </button>
              ))}
            </div>

            {/* Rotation Visual Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left: SVG Diagram of Rotation */}
              <div className="md:col-span-7 p-4 rounded-xl border border-border bg-secondary/30 flex flex-col items-center justify-center">
                <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>
                    {rotationSubTab === "LL" && "LL CASE • SINGLE RIGHT ROTATION ON PARENT"}
                    {rotationSubTab === "RR" && "RR CASE • SINGLE LEFT ROTATION ON PARENT"}
                    {rotationSubTab === "LR" && "LR CASE • DOUBLE ROTATION: LEFT ON CHILD, RIGHT ON PARENT"}
                    {rotationSubTab === "RL" && "RL CASE • DOUBLE ROTATION: RIGHT ON CHILD, LEFT ON PARENT"}
                  </span>
                </div>

                <svg className="w-full max-w-[420px] h-[210px]" viewBox="0 0 420 210">
                  <defs>
                    <linearGradient id="nodeBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="nodeUnbalanced" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                    <linearGradient id="nodePivot" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>

                  {/* Transition Arrow in Center */}
                  <g transform="translate(195, 95)">
                    <rect x="-15" y="-12" width="50" height="24" rx="6" fill="var(--secondary)" stroke="var(--border)" />
                    <text x="10" y="4" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="bold">➔</text>
                  </g>

                  {/* BEFORE (Left side: x: 20..180) */}
                  <text x="95" y="20" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="monospace" className="text-muted-foreground font-bold">
                    UNBALANCED BEFORE
                  </text>

                  {rotationSubTab === "LL" && (
                    <>
                      {/* Left: z=50 (BF=+2), y=30 (BF=+1), x=10 (BF=0) */}
                      <line x1="120" y1="45" x2="80" y2="105" stroke="#ef4444" strokeWidth="2.5" />
                      <line x1="80" y1="105" x2="45" y2="165" stroke="#3b82f6" strokeWidth="2" />

                      {/* z=50 */}
                      <circle cx="120" cy="45" r="17" fill="url(#nodeUnbalanced)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="120" y="49" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">50</text>
                      <rect x="135" y="32" width="22" height="13" rx="3" fill="#ef4444" />
                      <text x="146" y="42" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">+2</text>

                      {/* y=30 (pivot) */}
                      <circle cx="80" cy="105" r="17" fill="url(#nodePivot)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="80" y="109" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">30</text>
                      <rect x="95" y="92" width="22" height="13" rx="3" fill="#3b82f6" />
                      <text x="106" y="102" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">+1</text>

                      {/* x=10 */}
                      <circle cx="45" cy="165" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="45" y="169" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">10</text>

                      {/* AFTER (Right side: x: 240..400): y=30 as root, x=10 left, z=50 right */}
                      <text x="325" y="20" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        RESTORED AFTER ROTATE
                      </text>
                      <line x1="325" y1="65" x2="275" y2="125" stroke="#10b981" strokeWidth="2" />
                      <line x1="325" y1="65" x2="375" y2="125" stroke="#10b981" strokeWidth="2" />

                      {/* y=30 */}
                      <circle cx="325" cy="65" r="17" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="325" y="69" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">30</text>
                      <rect x="340" y="52" width="18" height="13" rx="3" fill="#10b981" />
                      <text x="349" y="62" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">0</text>

                      {/* x=10 */}
                      <circle cx="275" cy="125" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="275" y="129" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">10</text>

                      {/* z=50 */}
                      <circle cx="375" cy="125" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="375" y="129" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">50</text>
                    </>
                  )}

                  {rotationSubTab === "RR" && (
                    <>
                      {/* Left: z=10 (BF=-2), y=30 (BF=-1), x=50 (BF=0) */}
                      <line x1="60" y1="45" x2="105" y2="105" stroke="#ef4444" strokeWidth="2.5" />
                      <line x1="105" y1="105" x2="145" y2="165" stroke="#3b82f6" strokeWidth="2" />

                      {/* z=10 */}
                      <circle cx="60" cy="45" r="17" fill="url(#nodeUnbalanced)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="60" y="49" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">10</text>
                      <rect x="75" y="32" width="22" height="13" rx="3" fill="#ef4444" />
                      <text x="86" y="42" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">-2</text>

                      {/* y=30 (pivot) */}
                      <circle cx="105" cy="105" r="17" fill="url(#nodePivot)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="105" y="109" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">30</text>

                      {/* x=50 */}
                      <circle cx="145" cy="165" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="145" y="169" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">50</text>

                      {/* AFTER */}
                      <text x="325" y="20" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        RESTORED AFTER ROTATE
                      </text>
                      <line x1="325" y1="65" x2="275" y2="125" stroke="#10b981" strokeWidth="2" />
                      <line x1="325" y1="65" x2="375" y2="125" stroke="#10b981" strokeWidth="2" />

                      <circle cx="325" cy="65" r="17" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="325" y="69" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">30</text>
                      <rect x="340" y="52" width="18" height="13" rx="3" fill="#10b981" />
                      <text x="349" y="62" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">0</text>

                      <circle cx="275" cy="125" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="275" y="129" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">10</text>

                      <circle cx="375" cy="125" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="375" y="129" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">50</text>
                    </>
                  )}

                  {rotationSubTab === "LR" && (
                    <>
                      {/* Left: z=50 (BF=+2), y=20 (BF=-1), x=35 (BF=0) (Kink / Zig-Zag) */}
                      <line x1="120" y1="45" x2="65" y2="105" stroke="#ef4444" strokeWidth="2.5" />
                      <line x1="65" y1="105" x2="105" y2="165" stroke="#a855f7" strokeWidth="2" />

                      <circle cx="120" cy="45" r="17" fill="url(#nodeUnbalanced)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="120" y="49" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">50</text>
                      <rect x="135" y="32" width="22" height="13" rx="3" fill="#ef4444" />
                      <text x="146" y="42" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">+2</text>

                      <circle cx="65" cy="105" r="17" fill="url(#nodePivot)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="65" y="109" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">20</text>

                      <circle cx="105" cy="165" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="105" y="169" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">35</text>

                      {/* AFTER */}
                      <text x="325" y="20" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        RESTORED: 35 BECOMES ROOT
                      </text>
                      <line x1="325" y1="65" x2="275" y2="125" stroke="#10b981" strokeWidth="2" />
                      <line x1="325" y1="65" x2="375" y2="125" stroke="#10b981" strokeWidth="2" />

                      <circle cx="325" cy="65" r="17" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="325" y="69" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">35</text>
                      <rect x="340" y="52" width="18" height="13" rx="3" fill="#10b981" />
                      <text x="349" y="62" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">0</text>

                      <circle cx="275" cy="125" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="275" y="129" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">20</text>

                      <circle cx="375" cy="125" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="375" y="129" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">50</text>
                    </>
                  )}

                  {rotationSubTab === "RL" && (
                    <>
                      {/* Left: z=20 (BF=-2), y=50 (BF=+1), x=35 (BF=0) (Kink / Zag-Zig) */}
                      <line x1="65" y1="45" x2="120" y2="105" stroke="#ef4444" strokeWidth="2.5" />
                      <line x1="120" y1="105" x2="80" y2="165" stroke="#a855f7" strokeWidth="2" />

                      <circle cx="65" cy="45" r="17" fill="url(#nodeUnbalanced)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="65" y="49" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">20</text>
                      <rect x="80" y="32" width="22" height="13" rx="3" fill="#ef4444" />
                      <text x="91" y="42" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">-2</text>

                      <circle cx="120" cy="105" r="17" fill="url(#nodePivot)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="120" y="109" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">50</text>

                      <circle cx="80" cy="165" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="80" y="169" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">35</text>

                      {/* AFTER */}
                      <text x="325" y="20" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        RESTORED: 35 BECOMES ROOT
                      </text>
                      <line x1="325" y1="65" x2="275" y2="125" stroke="#10b981" strokeWidth="2" />
                      <line x1="325" y1="65" x2="375" y2="125" stroke="#10b981" strokeWidth="2" />

                      <circle cx="325" cy="65" r="17" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="325" y="69" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">35</text>
                      <rect x="340" y="52" width="18" height="13" rx="3" fill="#10b981" />
                      <text x="349" y="62" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">0</text>

                      <circle cx="275" cy="125" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="275" y="129" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">20</text>

                      <circle cx="375" cy="125" r="15" fill="url(#nodeBlue)" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="375" y="129" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">50</text>
                    </>
                  )}
                </svg>
              </div>

              {/* Right: Explanatory Breakdown Card */}
              <div className="md:col-span-5 flex flex-col gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="font-bold text-foreground block">
                    {rotationSubTab === "LL" && "Left-Left (LL) Case"}
                    {rotationSubTab === "RR" && "Right-Right (RR) Case"}
                    {rotationSubTab === "LR" && "Left-Right (LR) Case"}
                    {rotationSubTab === "RL" && "Right-Left (RL) Case"}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {rotationSubTab === "LL" &&
                      "Node z has BF = +2 (left-heavy), and the new key was inserted into the left child's left subtree. A single Right Rotation at z lowers z and promotes y to the subtree root."}
                    {rotationSubTab === "RR" &&
                      "Node z has BF = -2 (right-heavy), and the new key was inserted into the right child's right subtree. A single Left Rotation at z lowers z and promotes y to the subtree root."}
                    {rotationSubTab === "LR" &&
                      "Node z has BF = +2, but the insertion occurred in the left child's RIGHT subtree (forming a zig-zag). Single rotation cannot fix this. We first Left-Rotate child y (converting it to an LL line), then Right-Rotate z."}
                    {rotationSubTab === "RL" &&
                      "Node z has BF = -2, but the insertion occurred in the right child's LEFT subtree (forming a zag-zig). We first Right-Rotate child y (converting it to an RR line), then Left-Rotate parent z."}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card font-mono text-[11px] text-purple-600 dark:text-purple-400">
                  {rotationSubTab === "LL" && "return rotateRight(z); // 1 rotation"}
                  {rotationSubTab === "RR" && "return rotateLeft(z); // 1 rotation"}
                  {rotationSubTab === "LR" && "z->left = rotateLeft(z->left);\nreturn rotateRight(z); // 2 rotations"}
                  {rotationSubTab === "RL" && "z->right = rotateRight(z->right);\nreturn rotateLeft(z); // 2 rotations"}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bf" && (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-xs">
            {/* Visual Formula & Scale */}
            <div className="md:col-span-6 p-5 rounded-xl border border-border bg-secondary/30 flex flex-col items-center justify-center space-y-4">
              <span className="font-mono font-bold text-xs text-foreground uppercase tracking-wider">
                The Balance Factor Formula
              </span>
              <div className="p-3.5 rounded-xl bg-card border border-border font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">
                BF(X) = Height(Left) - Height(Right)
              </div>
              <p className="text-muted-foreground text-center leading-relaxed">
                Height of an empty subtree (nullptr) is defined as $0$, and a leaf has height $1$.
              </p>

              {/* Status Band */}
              <div className="w-full flex items-center justify-between gap-2 p-3 rounded-xl border border-border/60 bg-card font-mono text-xs">
                <div className="text-center flex-1">
                  <span className="block text-emerald-500 font-bold">-1, 0, +1</span>
                  <span className="text-[10px] text-muted-foreground">Safe / Invariant Met</span>
                </div>
                <div className="w-[1px] h-8 bg-border" />
                <div className="text-center flex-1">
                  <span className="block text-rose-500 font-bold">|BF| ≥ 2</span>
                  <span className="text-[10px] text-muted-foreground">Rotation Triggered</span>
                </div>
              </div>
            </div>

            {/* Invariant Guarantees */}
            <div className="md:col-span-6 flex flex-col gap-3">
              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="font-bold text-foreground block mb-1">1. Localized Balance, Global Depth</span>
                <p className="text-muted-foreground leading-relaxed">
                  By strictly guaranteeing $|BF(X)| \le 1$ for *every single node*, the height of the entire tree can never grow uncontrollably.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="font-bold text-foreground block mb-1">2. Upward Bubble Verification</span>
                <p className="text-muted-foreground leading-relaxed">
                  After inserting or deleting a node, we retrace the path back to the root. In insertion, at most **ONE** single or double rotation restores balance to the whole tree!
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="font-bold text-foreground block mb-1">3. Cascading Deletion Risk</span>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike insertion, node deletion can trigger multiple rotations cascading all the way to the root ($O(\log n)$ total rotations in the worst case).
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comparison" && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-xs">
            {/* AVL Tree */}
            <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> AVL Tree (Strict Logarithmic)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Guaranteed
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Even if keys arrive in sorted order <code className="font-mono text-foreground">[10, 20, 30, 40, 50, 60, 70]</code>, tree rotations automatically restructure the nodes into a symmetrical height-3 tree!
              </p>
              <div className="p-3 rounded-lg bg-card border border-border font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Worst-Case Height:</span>
                  <span className="font-bold text-emerald-500">1.44 log₂(n)</span>
                </div>
                <div className="flex justify-between">
                  <span>Search for n = 1,000,000:</span>
                  <span className="font-bold text-emerald-500">≤ 29 comparisons</span>
                </div>
              </div>
            </div>

            {/* Naive BST */}
            <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Naive BST (Skew Hazard)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                  Vulnerable
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Inserting the same sorted keys into an ordinary BST creates a single-chain branch. No rotations occur, causing the tree to collapse into a slow linear linked list.
              </p>
              <div className="p-3 rounded-lg bg-card border border-border font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Worst-Case Height:</span>
                  <span className="font-bold text-rose-500">n (Linear)</span>
                </div>
                <div className="flex justify-between">
                  <span>Search for n = 1,000,000:</span>
                  <span className="font-bold text-rose-500">1,000,000 comparisons</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
