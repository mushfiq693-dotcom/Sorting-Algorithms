"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AvlEngine,
  AvlStep,
  AvlNode,
} from "@/algorithms/avl-tree";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
  RotateCcw,
  Sparkles,
  GitFork,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  ListOrdered,
  Scale,
  RefreshCw,
  Zap,
} from "lucide-react";

// Production-Grade C++ AVL Tree Source Code for synchronized CodeViewer
const AVL_CPP_SOURCE = `// Production-Grade C++ AVL Tree (Self-Balancing BST)
#include <iostream>
#include <algorithm>
using namespace std;

struct AVLNode {
    int val, height;
    AVLNode *left, *right;
    AVLNode(int x) : val(x), height(1), left(nullptr), right(nullptr) {}
};

int getHeight(AVLNode* n) { return n ? n->height : 0; }
int getBF(AVLNode* n) { return n ? getHeight(n->left) - getHeight(n->right) : 0; }
void updateH(AVLNode* n) { n->height = 1 + max(getHeight(n->left), getHeight(n->right)); }

AVLNode* rotateRight(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    x->right = y;
    y->left = T2;
    updateH(y);
    updateH(x);
    return x; // New subtree root
}

AVLNode* rotateLeft(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;
    y->left = x;
    x->right = T2;
    updateH(x);
    updateH(y);
    return y; // New subtree root
}

AVLNode* insert(AVLNode* node, int val) {
    if (!node) return new AVLNode(val);
    if (val < node->val) node->left = insert(node->left, val);
    else if (val > node->val) node->right = insert(node->right, val);
    else return node; // Duplicate keys ignored

    updateH(node);
    int bf = getBF(node);

    // 4 Rotation Cases:
    if (bf > 1 && val < node->left->val) // LL
        return rotateRight(node);
    if (bf < -1 && val > node->right->val) // RR
        return rotateLeft(node);
    if (bf > 1 && val > node->left->val) { // LR
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    if (bf < -1 && val < node->right->val) { // RL
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }
    return node;
}`;

export function AvlTreeVisualizer() {
  const engineRef = useRef<AvlEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new AvlEngine();
  }
  const engine = engineRef.current;

  // Visualizer Animation State
  const [steps, setSteps] = useState<AvlStep[]>(() => [engine.getInitialStep()]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(750); // ms per step

  // Interactive Inputs
  const [inputVal, setInputVal] = useState<string>("40");
  const [selectedPreset, setSelectedPreset] = useState<
    "balanced" | "trigger-ll" | "trigger-rr" | "trigger-lr" | "trigger-rl" | "skew-test"
  >("balanced");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStep = steps[currentStepIndex] || steps[0];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Execution runner for multi-step animations
  const executeStepList = (newSteps: AvlStep[]) => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(false);
    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  // Preset switch
  const handlePresetChange = (
    preset: "balanced" | "trigger-ll" | "trigger-rr" | "trigger-lr" | "trigger-rl" | "skew-test"
  ) => {
    setSelectedPreset(preset);
    engine.loadPreset(preset);
    const initial = engine.getInitialStep(`Loaded preset: ${preset.toUpperCase().replace("-", " ")}`);
    executeStepList([initial]);
  };

  // Operation triggers
  const handleInsert = () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;
    const genSteps = engine.generateInsertSteps(val);
    executeStepList(genSteps);
  };

  const handleDelete = () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;
    const genSteps = engine.generateDeleteSteps(val);
    executeStepList(genSteps);
  };

  const handleSearch = () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;
    const genSteps = engine.generateSearchSteps(val);
    executeStepList(genSteps);
  };

  const handleInOrder = () => {
    const genSteps = engine.generateInOrderSteps();
    executeStepList(genSteps);
  };

  const handleRandomInsert = () => {
    const randomKey = Math.floor(Math.random() * 90) + 10;
    setInputVal(randomKey.toString());
    const genSteps = engine.generateInsertSteps(randomKey);
    executeStepList(genSteps);
  };

  const handleReset = () => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(false);
    engine.loadPreset(selectedPreset);
    executeStepList([engine.getInitialStep("AVL Tree reset to baseline.")]);
  };

  // Playback control handlers
  const handlePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Animation ticker loop
  useEffect(() => {
    if (isPlaying && !isPaused) {
      if (currentStepIndex < steps.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, speed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimer();
  }, [isPlaying, isPaused, currentStepIndex, steps.length, speed, clearTimer]);

  // ==========================================
  // SVG 2D COORDINATE PROJECTION SYSTEM
  // ==========================================
  // Uses in-order traversal index for X and node depth for Y to guarantee ZERO overlapping edges or nodes
  const calculateNodeCoordinates = useCallback(
    (nodes: Record<number, AvlNode>, rootId: number | null) => {
      const positions: Record<number, { x: number; y: number; depth: number }> = {};
      if (rootId === null) return { mapped: {}, svgWidth: 580, svgHeight: 340 };

      let inOrderCounter = 0;
      const depths: Record<number, number> = {};

      // 1. Calculate depths
      const computeDepth = (id: number | null, depth: number) => {
        if (id === null || !nodes[id]) return;
        depths[id] = depth;
        computeDepth(nodes[id].left, depth + 1);
        computeDepth(nodes[id].right, depth + 1);
      };
      computeDepth(rootId, 0);

      // 2. In-order projection
      const inOrderProject = (id: number | null) => {
        if (id === null || !nodes[id]) return;
        inOrderProject(nodes[id].left);
        const myIndex = inOrderCounter++;
        const depth = depths[id] || 0;
        positions[id] = {
          x: myIndex,
          y: depth,
          depth,
        };
        inOrderProject(nodes[id].right);
      };
      inOrderProject(rootId);

      const totalNodes = Object.keys(positions).length;
      const maxDepth = Math.max(...Object.values(depths), 0);

      // Canvas dimensions
      const svgWidth = Math.max(580, totalNodes * 56 + 100);
      const svgHeight = Math.max(340, (maxDepth + 1) * 72 + 60);

      const mapped: Record<number, { x: number; y: number; depth: number }> = {};
      const paddingX = 45;
      const usableWidth = svgWidth - paddingX * 2;
      const stepX = totalNodes > 1 ? usableWidth / (totalNodes - 1) : usableWidth / 2;

      for (const [idStr, pos] of Object.entries(positions)) {
        const id = Number(idStr);
        const screenX = totalNodes === 1 ? svgWidth / 2 : paddingX + pos.x * stepX;
        const screenY = 48 + pos.y * 68;
        mapped[id] = { x: screenX, y: screenY, depth: pos.depth };
      }

      return { mapped, svgWidth, svgHeight };
    },
    []
  );

  const { mapped: nodeCoords, svgWidth, svgHeight } = calculateNodeCoordinates(
    currentStep.nodes,
    currentStep.rootId
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto select-text font-body">
      {/* 2-Column Studio Grid: Left Visual Stage (7 cols), Right Code Execution & Telemetry (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ========================================================
            LEFT COLUMN (7 cols): Canvas, Rotation Banner, Controls
            ======================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual SVG Tree Chamber */}
          <div className="relative w-full rounded-2xl border border-border/80 bg-card shadow-sm p-4 overflow-hidden flex flex-col">
            {/* Top Toolbar overlay on Canvas */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  AVL Tree Dynamic Canvas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/60">
                  Total Nodes: {Object.keys(currentStep.nodes).length}
                </span>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-bold border ${
                    currentStep.metrics.isBalanced
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse"
                  }`}
                >
                  {currentStep.metrics.isBalanced ? "✓ |BF| ≤ 1 Balanced" : "⚠ |BF| ≥ 2 Unbalanced"}
                </span>
              </div>
            </div>

            {/* Rotation Notification Banner */}
            {currentStep.rotationBanner && (
              <div className="mb-3 p-3 rounded-xl border border-purple-500/30 bg-purple-500/10 animate-in fade-in flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold font-mono text-purple-600 dark:text-purple-300 flex items-center gap-2">
                    <span>{currentStep.rotationBanner.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300">
                      Auto-Rebalance
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {currentStep.rotationBanner.description}
                  </p>
                </div>
              </div>
            )}

            {/* Scrollable SVG Tree Stage */}
            <div className="w-full overflow-x-auto overflow-y-hidden rounded-xl bg-secondary/30 border border-border/40 p-2 min-h-[340px] flex items-center justify-center">
              {currentStep.rootId === null || Object.keys(currentStep.nodes).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-xs space-y-2">
                  <GitFork className="h-8 w-8 text-muted-foreground/40" />
                  <span>AVL Tree is empty. Insert a value to build the tree.</span>
                </div>
              ) : (
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  className="transition-all duration-300 ease-out select-none"
                >
                  <defs>
                    <linearGradient id="avlNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="avlActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="avlUnbalancedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                    <linearGradient id="avlPivotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <filter id="avlShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  {/* Connecting Edges */}
                  {Object.values(currentStep.nodes).map((node) => {
                    const fromCoord = nodeCoords[node.id];
                    if (!fromCoord) return null;

                    const renderEdge = (childId: number | null, isLeft: boolean) => {
                      if (childId === null || !nodeCoords[childId]) return null;
                      const toCoord = nodeCoords[childId];
                      const isTraversed =
                        currentStep.pathIds.includes(node.id) &&
                        currentStep.pathIds.includes(childId);

                      return (
                        <g key={`edge-${node.id}-${childId}`}>
                          <line
                            x1={fromCoord.x}
                            y1={fromCoord.y}
                            x2={toCoord.x}
                            y2={toCoord.y}
                            stroke={isTraversed ? "#06b6d4" : "currentColor"}
                            strokeWidth={isTraversed ? 2.8 : 1.8}
                            strokeDasharray={isTraversed ? undefined : "3 3"}
                            className={
                              isTraversed
                                ? "text-cyan-500 transition-all duration-300"
                                : "text-border transition-all duration-300"
                            }
                            strokeLinecap="round"
                          />
                          {/* Branch indicator chip */}
                          <circle
                            cx={(fromCoord.x + toCoord.x) / 2}
                            cy={(fromCoord.y + toCoord.y) / 2}
                            r="6"
                            fill="var(--background)"
                            stroke="currentColor"
                            className="text-border"
                          />
                          <text
                            x={(fromCoord.x + toCoord.x) / 2}
                            y={(fromCoord.y + toCoord.y) / 2 + 3}
                            fontSize="8"
                            textAnchor="middle"
                            fill="currentColor"
                            className="text-muted-foreground font-mono font-bold"
                          >
                            {isLeft ? "L" : "R"}
                          </text>
                        </g>
                      );
                    };

                    return (
                      <g key={`edges-group-${node.id}`}>
                        {renderEdge(node.left, true)}
                        {renderEdge(node.right, false)}
                      </g>
                    );
                  })}

                  {/* Tree Nodes */}
                  {Object.values(currentStep.nodes).map((node) => {
                    const coord = nodeCoords[node.id];
                    if (!coord) return null;

                    const isActive = currentStep.activeNodeId === node.id;
                    const isUnbalanced = currentStep.unbalancedNodeId === node.id || Math.abs(node.bf) > 1;
                    const isPivot = currentStep.pivotNodeId === node.id;
                    const isPath = currentStep.pathIds.includes(node.id);

                    let fillGrad = "url(#avlNodeGrad)";
                    let strokeColor = "#ffffff";
                    if (isUnbalanced) {
                      fillGrad = "url(#avlUnbalancedGrad)";
                      strokeColor = "#fee2e2";
                    } else if (isPivot) {
                      fillGrad = "url(#avlPivotGrad)";
                      strokeColor = "#f3e8ff";
                    } else if (isActive) {
                      fillGrad = "url(#avlActiveGrad)";
                      strokeColor = "#fef3c7";
                    }

                    return (
                      <g
                        key={`node-${node.id}`}
                        className="transition-all duration-300 ease-out cursor-pointer group"
                      >
                        {/* Glow halo for active / unbalanced / pivot nodes */}
                        {(isActive || isUnbalanced || isPivot) && (
                          <circle
                            cx={coord.x}
                            cy={coord.y}
                            r="28"
                            fill="none"
                            stroke={
                              isUnbalanced ? "#ef4444" : isPivot ? "#a855f7" : "#f59e0b"
                            }
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                            className="animate-spin"
                            style={{ animationDuration: "6s" }}
                          />
                        )}

                        {/* Main Node Circle */}
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r="20"
                          fill={fillGrad}
                          stroke={strokeColor}
                          strokeWidth={isActive || isUnbalanced || isPivot ? 2.5 : 1.5}
                          filter="url(#avlShadow)"
                        />

                        {/* Node Payload Value */}
                        <text
                          x={coord.x}
                          y={coord.y + 4.5}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          fontFamily="ui-sans-serif, system-ui, sans-serif"
                        >
                          {node.val}
                        </text>

                        {/* Balance Factor Pill Badge (Top Right of Node) */}
                        <g transform={`translate(${coord.x + 12}, ${coord.y - 18})`}>
                          <rect
                            x="-9"
                            y="-6"
                            width="22"
                            height="13"
                            rx="4"
                            fill={
                              Math.abs(node.bf) > 1
                                ? "#ef4444"
                                : node.bf === 0
                                ? "#10b981"
                                : "#3b82f6"
                            }
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                          <text
                            x="2"
                            y="4"
                            fontSize="8"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {node.bf > 0 ? `+${node.bf}` : `${node.bf}`}
                          </text>
                        </g>

                        {/* Height badge below node */}
                        <text
                          x={coord.x}
                          y={coord.y + 30}
                          textAnchor="middle"
                          fontSize="9"
                          fill="currentColor"
                          className="text-muted-foreground font-mono"
                        >
                          h={node.height}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* In-Order Traversal Live Strip (Sorted Array Output) */}
            <div className="mt-3 p-2.5 rounded-xl border border-border/60 bg-secondary/40 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <ListOrdered className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-foreground">In-Order Sorted Sequence:</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto max-w-full font-mono text-xs">
                {currentStep.sortedArray.length === 0 ? (
                  <span className="text-muted-foreground text-[11px]">Empty tree</span>
                ) : (
                  currentStep.sortedArray.map((val, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-card border border-border/60 text-foreground font-semibold"
                    >
                      {val}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Operation Status & Live Telemetry Box */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 backdrop-blur-md shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                <span className="font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Execution Telemetry
                </span>
              </div>
              <span className="text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed min-h-[38px] flex items-center">
              {currentStep.description}
            </p>
          </div>

          {/* Studio Control Deck */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 backdrop-blur-md shadow-sm space-y-4">
            {/* Action Bar: Custom Input & Operations */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <input
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Key value"
                  className="w-24 px-3 py-1.5 rounded-lg border border-border bg-secondary/60 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleInsert}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Insert</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all active:scale-95 flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={handleSearch}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary/80 hover:bg-secondary text-foreground border border-border/70 transition-all active:scale-95 flex items-center gap-1"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Search</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleInOrder}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-secondary/60 hover:bg-secondary text-foreground border border-border/70 transition-all active:scale-95 flex items-center gap-1"
                  title="Run in-order traversal to verify sorted order"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                  <span>In-Order</span>
                </button>
                <button
                  onClick={handleRandomInsert}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-secondary/60 hover:bg-secondary text-foreground border border-border/70 transition-all active:scale-95 flex items-center gap-1"
                  title="Insert a random number between 10 and 99"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Random</span>
                </button>
              </div>
            </div>

            {/* Presets Selector & Playback Controls */}
            <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground">Preset:</span>
                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-secondary/60 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="balanced">Balanced AVL (7 Nodes)</option>
                  <option value="trigger-ll">Trigger LL (Right Rotation)</option>
                  <option value="trigger-rr">Trigger RR (Left Rotation)</option>
                  <option value="trigger-lr">Trigger LR (Double Rotation)</option>
                  <option value="trigger-rl">Trigger RL (Double Rotation)</option>
                  <option value="skew-test">Sorted [10..70] (No Skew Hazard)</option>
                </select>
              </div>

              {/* Step / Play Controls & Speed */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleStepBackward}
                  disabled={currentStepIndex <= 0 || isPlaying}
                  className="p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 text-foreground transition-all active:scale-95 cursor-pointer"
                  title="Step Backward"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={isPlaying ? handlePause : handlePlay}
                  disabled={steps.length <= 1 && currentStepIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Play</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleStepForward}
                  disabled={currentStepIndex >= steps.length - 1 || isPlaying}
                  className="p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 text-foreground transition-all active:scale-95 cursor-pointer"
                  title="Step Forward"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground border border-border/60 transition-all active:scale-95 cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <span className="text-[11px] font-mono text-muted-foreground ml-1">
                  Step {steps.length > 0 ? currentStepIndex + 1 : 1}/{Math.max(1, steps.length)}
                </span>

                {/* Speed Slider */}
                <div className="flex items-center gap-1.5 ml-2">
                  <Sliders className="h-3 w-3 text-muted-foreground" />
                  <input
                    type="range"
                    min="250"
                    max="1500"
                    step="50"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-16 sm:w-20 accent-cyan-500 cursor-pointer h-1.5"
                    title={`Animation delay: ${speed}ms`}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {speed}ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (5 cols, sticky): CodeViewer & Invariant Inspector
            ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          {/* Synchronized Compact C++ CodeViewer */}
          <div className="h-[280px] sm:h-[300px] lg:h-[320px] max-h-[280px] sm:max-h-[300px] lg:max-h-[320px] min-h-0 shrink-0 overflow-hidden flex flex-col rounded-2xl border border-border/80 bg-card shadow-sm">
            <CodeViewer
              code={AVL_CPP_SOURCE}
              activeLineNumber={currentStep.codeLine}
              algorithmName="AVL Tree (C++)"
            />
          </div>

          {/* AVL Balance & Invariant Inspector */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 backdrop-blur-md shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-emerald-500" />
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                  AVL Balance &amp; Invariant Inspector
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                O(log n) Strictly Guaranteed
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl border border-border/60 bg-secondary/40 space-y-0.5">
                <span className="text-[10px] font-mono text-muted-foreground block">Height (h)</span>
                <span className="text-sm font-mono font-bold text-foreground">
                  {currentStep.metrics.height}
                </span>
                <span className="text-[9px] text-muted-foreground block">
                  Max: ≤ {currentStep.metrics.theoreticalMaxHeight}
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-border/60 bg-secondary/40 space-y-0.5">
                <span className="text-[10px] font-mono text-muted-foreground block">Max |BF|</span>
                <span
                  className={`text-sm font-mono font-bold ${
                    currentStep.metrics.maxBf <= 1 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {currentStep.metrics.maxBf}
                </span>
                <span className="text-[9px] text-muted-foreground block">Allowed: ≤ 1</span>
              </div>

              <div className="p-2.5 rounded-xl border border-border/60 bg-secondary/40 space-y-0.5">
                <span className="text-[10px] font-mono text-muted-foreground block">Rotations</span>
                <span className="text-sm font-mono font-bold text-purple-500">
                  {currentStep.metrics.rotationsCount}
                </span>
                <span className="text-[9px] text-muted-foreground block">
                  Last: {currentStep.metrics.lastRotation}
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-border/60 bg-secondary/40 space-y-0.5">
                <span className="text-[10px] font-mono text-muted-foreground block">Status</span>
                <span
                  className={`text-xs font-mono font-bold block truncate ${
                    currentStep.metrics.isBalanced ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {currentStep.metrics.isBalanced ? "Balanced" : "Violated"}
                </span>
                <span className="text-[9px] text-muted-foreground block">Self-Heals</span>
              </div>
            </div>

            {/* Invariant Truth Card */}
            <div className="p-3 rounded-xl border border-border/60 bg-secondary/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-foreground font-semibold text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>The AVL Invariant Theorem</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                For every node X, Balance Factor(X) = height(left) - height(right) &isin; &#123;-1, 0, +1&#125;.
                An AVL Tree of n nodes has height strictly bounded by h &le; 1.44 log₂(n + 2). This mathematically guarantees that search, insert, and delete never degrade into O(n) linear chains!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
