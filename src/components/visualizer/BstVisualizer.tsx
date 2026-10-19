"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BstEngine,
  BstStep,
  BstNode,
} from "@/algorithms/bst";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Plus,
  Search,
  Shuffle,
  Trash2,
  GitFork,
  ArrowRight,
  Layers,
  CheckCircle2,
  XCircle,
  Activity,
  Sliders,
  Sparkles,
  ArrowDownLeft,
  ArrowDownRight,
  AlertTriangle,
  Scale,
} from "lucide-react";

const BST_CPP_SOURCE = `// Production-Grade C++ Binary Search Tree Implementation
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinarySearchTree {
public:
    Node* root = nullptr;

    // Line 17: Logarithmic Search - O(h)
    bool search(Node* node, int target) {
        if (!node) return false;
        if (node->val == target) return true;
        if (target < node->val)
            return search(node->left, target);
        else
            return search(node->right, target);
    }

    // Line 27: Leaf Insertion - O(h)
    Node* insert(Node* node, int val) {
        if (!node) return new Node(val);
        if (val < node->val)
            node->left = insert(node->left, val);
        else if (val > node->val)
            node->right = insert(node->right, val);
        return node;
    }

    // Line 38: Find Minimum (In-Order Successor)
    Node* findMin(Node* node) {
        while (node && node->left) node = node->left;
        return node;
    }

    // Line 44: 3-Case Node Deletion - O(h)
    Node* remove(Node* node, int val) {
        if (!node) return nullptr;
        if (val < node->val)
            node->left = remove(node->left, val);
        else if (val > node->val)
            node->right = remove(node->right, val);
        else {
            // Case 1 & 2: 0 or 1 child
            if (!node->left) {
                Node* temp = node->right;
                delete node;
                return temp;
            } else if (!node->right) {
                Node* temp = node->left;
                delete node;
                return temp;
            }
            // Case 3: 2 children -> In-Order Successor swap
            Node* succ = findMin(node->right);
            node->val = succ->val;
            node->right = remove(node->right, succ->val);
        }
        return node;
    }

    // Line 70: In-Order Traversal yields Sorted Order
    void inOrder(Node* node, vector<int>& res) {
        if (!node) return;
        inOrder(node->left, res);
        res.push_back(node->val);
        inOrder(node->right, res);
    }
};`;

interface NodePos {
  x: number;
  y: number;
  depth: number;
}

// Compute non-overlapping (x, y) coordinates for any BST using in-order coordinate spacing
function computeTreeLayout(
  nodes: Record<number, BstNode>,
  rootId: number | null,
  width: number = 640
): Record<number, NodePos> {
  const positions: Record<number, NodePos> = {};
  if (!rootId || !nodes[rootId]) return positions;

  let inOrderCounter = 0;
  const inOrderMap: Record<number, number> = {};
  const depthMap: Record<number, number> = {};

  const getDepths = (id: number | null, d: number) => {
    if (id === null || !nodes[id]) return;
    depthMap[id] = d;
    getDepths(nodes[id].left, d + 1);
    inOrderMap[id] = inOrderCounter++;
    getDepths(nodes[id].right, d + 1);
  };
  getDepths(rootId, 0);

  const totalInOrder = Math.max(1, inOrderCounter);
  const paddingX = 48;
  const usableWidth = width - paddingX * 2;
  const stepX = totalInOrder > 1 ? usableWidth / (totalInOrder - 1) : usableWidth / 2;

  for (const idStr of Object.keys(nodes)) {
    const id = Number(idStr);
    const d = depthMap[id] ?? 0;
    const order = inOrderMap[id] ?? 0;
    const x = paddingX + (totalInOrder === 1 ? usableWidth / 2 : order * stepX);
    const y = 46 + d * 66;
    positions[id] = { x, y, depth: d };
  }

  return positions;
}

export function BstVisualizer() {
  const prefersReducedMotion = useReducedMotion();
  const engineRef = useRef<BstEngine>(new BstEngine());
  const engine = engineRef.current;

  // Step and playback state
  const [currentStep, setCurrentStep] = useState<BstStep>(() => engine.getInitialStep());
  const [playbackSteps, setPlaybackSteps] = useState<BstStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(650);

  // User input states
  const [searchVal, setSearchVal] = useState("37");
  const [insertVal, setInsertVal] = useState("68");
  const [deleteVal, setDeleteVal] = useState("25");
  const [presetType, setPresetType] = useState<string>("balanced");
  const [activeTab, setActiveTab] = useState<"search" | "insert" | "delete" | "inorder">("search");

  // Timer reference
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute node positions
  const nodePositions = useMemo(() => {
    return computeTreeLayout(currentStep.nodes, currentStep.rootId, 620);
  }, [currentStep.nodes, currentStep.rootId]);

  // Execute playback steps
  const startPlayback = (steps: BstStep[]) => {
    if (steps.length === 0) return;
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    setIsPlaying(true);
  };

  // Step ticker
  useEffect(() => {
    if (!isPlaying) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    playTimerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < playbackSteps.length) {
          setCurrentStep(playbackSteps[next]);
          return next;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, speedMs);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, playbackSteps, speedMs]);

  const handleStepNext = () => {
    if (currentStepIndex < playbackSteps.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      setCurrentStep(playbackSteps[next]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    engine.loadPreset(presetType as any);
    const initial = engine.getInitialStep("Tree reset to initial state");
    setCurrentStep(initial);
    setPlaybackSteps([]);
    setCurrentStepIndex(0);
  };

  const handlePresetChange = (preset: string) => {
    setPresetType(preset);
    setIsPlaying(false);
    engine.loadPreset(preset as any);
    const initial = engine.getInitialStep(`Loaded preset: ${preset}`);
    setCurrentStep(initial);
    setPlaybackSteps([]);
    setCurrentStepIndex(0);
  };

  // Operation triggers
  const handleSearch = () => {
    const val = parseInt(searchVal, 10);
    if (isNaN(val)) return;
    const steps = engine.generateSearchSteps(val);
    startPlayback(steps);
  };

  const handleInsert = () => {
    const val = parseInt(insertVal, 10);
    if (isNaN(val)) return;
    const steps = engine.generateInsertSteps(val);
    startPlayback(steps);
  };

  const handleDelete = () => {
    const val = parseInt(deleteVal, 10);
    if (isNaN(val)) return;
    const steps = engine.generateDeleteSteps(val);
    startPlayback(steps);
  };

  const handleInOrder = () => {
    const steps = engine.generateInOrderSteps();
    startPlayback(steps);
  };

  const handleFindMin = () => {
    const steps = engine.generateMinMaxSteps("min");
    startPlayback(steps);
  };

  const handleFindMax = () => {
    const steps = engine.generateMinMaxSteps("max");
    startPlayback(steps);
  };

  // Visual state styling helpers
  const getNodeColor = (id: number) => {
    if (currentStep.activeNodeId === id) {
      if (currentStep.type === "search-found") {
        return "fill-emerald-500 stroke-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.8)]";
      }
      if (currentStep.type === "delete-case3-find-successor") {
        return "fill-amber-500 stroke-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.8)]";
      }
      return "fill-cyan-500 stroke-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.8)]";
    }
    if (currentStep.candidateNodeId === id) {
      return "fill-amber-500 stroke-amber-300 animate-pulse";
    }
    if (currentStep.visitedIds.includes(id)) {
      return "fill-cyan-900/60 stroke-cyan-500/70";
    }
    return "fill-slate-800/90 stroke-slate-600/80";
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      {/* Signature 2-Column Studio Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ========================================================
            LEFT COLUMN (7 cols): Visual Stage, Telemetry & Controls
            ======================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Visual Chamber Container */}
          <div className="relative rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-md overflow-hidden flex flex-col">
            {/* Stage Header & Invariant Badges */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-secondary/30">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-foreground">
                  BST Active Stage
                </span>
              </div>

              {/* Live Metric Pills */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded-md bg-secondary border border-border/60 text-muted-foreground">
                  Nodes: <strong className="text-foreground">{currentStep.metrics.nodeCount}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-secondary border border-border/60 text-muted-foreground">
                  Height: <strong className="text-cyan-400">{currentStep.metrics.height}</strong>
                  <span className="text-[10px] text-muted-foreground ml-1">(opt: {currentStep.metrics.optimalHeight})</span>
                </span>
                {currentStep.metrics.isDegenerate && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Degenerate O(n)
                  </span>
                )}
              </div>
            </div>

            {/* Tree SVG Visual Stage */}
            <div className="relative w-full h-[320px] sm:h-[350px] overflow-auto flex items-center justify-center p-2 bg-radial from-secondary/15 via-background to-background">
              {currentStep.rootId === null || Object.keys(currentStep.nodes).length === 0 ? (
                <div className="text-center text-muted-foreground text-xs font-mono py-16">
                  Tree is currently empty. Insert nodes to begin exploring BST operations.
                </div>
              ) : (
                <svg
                  viewBox="0 0 620 330"
                  className="w-full h-full max-h-[340px] select-none"
                >
                  <defs>
                    <linearGradient id="bstBranchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(6,182,212,0.6)" />
                      <stop offset="100%" stopColor="rgba(16,185,129,0.4)" />
                    </linearGradient>
                  </defs>

                  {/* Draw Connecting Branches */}
                  {Object.values(currentStep.nodes).map((node) => {
                    const pos = nodePositions[node.id];
                    if (!pos) return null;

                    return (
                      <g key={`branches-${node.id}`}>
                        {/* Left Branch */}
                        {node.left !== null && nodePositions[node.left] && (
                          <line
                            x1={pos.x}
                            y1={pos.y}
                            x2={nodePositions[node.left].x}
                            y2={nodePositions[node.left].y}
                            stroke="currentColor"
                            className="text-border dark:text-slate-700/80 transition-all duration-300"
                            strokeWidth={currentStep.pathIds.includes(node.left) ? 3 : 1.75}
                            strokeDasharray={currentStep.pathIds.includes(node.left) ? "none" : "none"}
                            style={{
                              stroke: currentStep.pathIds.includes(node.left)
                                ? "#06b6d4"
                                : undefined,
                            }}
                          />
                        )}

                        {/* Right Branch */}
                        {node.right !== null && nodePositions[node.right] && (
                          <line
                            x1={pos.x}
                            y1={pos.y}
                            x2={nodePositions[node.right].x}
                            y2={nodePositions[node.right].y}
                            stroke="currentColor"
                            className="text-border dark:text-slate-700/80 transition-all duration-300"
                            strokeWidth={currentStep.pathIds.includes(node.right) ? 3 : 1.75}
                            style={{
                              stroke: currentStep.pathIds.includes(node.right)
                                ? "#06b6d4"
                                : undefined,
                            }}
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Draw Tree Nodes */}
                  {Object.values(currentStep.nodes).map((node) => {
                    const pos = nodePositions[node.id];
                    if (!pos) return null;

                    const isRoot = node.id === currentStep.rootId;
                    const isActive = currentStep.activeNodeId === node.id;
                    const isCandidate = currentStep.candidateNodeId === node.id;

                    return (
                      <g key={`node-${node.id}`} className="transition-transform duration-300">
                        {/* Outer Glow Halo for Active Nodes */}
                        {(isActive || isCandidate) && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={26}
                            className={
                              isActive
                                ? "fill-cyan-500/20 animate-ping"
                                : "fill-amber-500/20 animate-pulse"
                            }
                          />
                        )}

                        {/* Node Circle */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={19}
                          className={`${getNodeColor(node.id)} transition-all duration-300 cursor-pointer`}
                          strokeWidth={isActive ? 2.5 : 1.5}
                        />

                        {/* Node Key Text */}
                        <text
                          x={pos.x}
                          y={pos.y + 4.5}
                          textAnchor="middle"
                          className="font-mono text-xs font-bold fill-white pointer-events-none select-none"
                        >
                          {node.val}
                        </text>

                        {/* Root Badge */}
                        {isRoot && (
                          <text
                            x={pos.x}
                            y={pos.y - 24}
                            textAnchor="middle"
                            className="text-[9px] font-mono font-bold uppercase tracking-wider fill-cyan-400"
                          >
                            ROOT
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Dynamic Step Telemetry Strip */}
            <div className="p-3.5 border-t border-border/80 bg-secondary/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                <p className="font-sans text-foreground leading-snug truncate">
                  {currentStep.description}
                </p>
              </div>

              {currentStep.comparison && (
                <span className="shrink-0 font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary border border-border text-foreground">
                  {currentStep.comparison.decision === "left" && (
                    <span className="text-cyan-400 flex items-center gap-1">
                      <ArrowDownLeft className="h-3 w-3" /> Left Subtree
                    </span>
                  )}
                  {currentStep.comparison.decision === "right" && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ArrowDownRight className="h-3 w-3" /> Right Subtree
                    </span>
                  )}
                  {currentStep.comparison.decision === "match" && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Exact Match!
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Operation Tabs & Studio Control Deck */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 backdrop-blur-md shadow-sm space-y-4">
            {/* Top Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/60 border border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("search")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "search"
                      ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("insert")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "insert"
                      ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("delete")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "delete"
                      ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("inorder")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "inorder"
                      ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  In-Order
                </button>
              </div>

              {/* Presets Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">Preset:</span>
                <select
                  value={presetType}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-secondary text-xs font-mono text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="balanced">Balanced Tree</option>
                  <option value="unbalanced">Pathological (Skewed)</option>
                  <option value="two-sum">Large Tree</option>
                  <option value="random">Randomized</option>
                </select>
              </div>
            </div>

            {/* Active Operation Control Inputs */}
            <div className="flex flex-wrap items-center gap-3">
              {activeTab === "search" && (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Key to search"
                    className="w-28 sm:w-36 px-3 py-1.5 rounded-xl border border-border bg-secondary/80 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Search Key</span>
                  </button>
                </div>
              )}

              {activeTab === "insert" && (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    value={insertVal}
                    onChange={(e) => setInsertVal(e.target.value)}
                    placeholder="New value"
                    className="w-28 sm:w-36 px-3 py-1.5 rounded-xl border border-border bg-secondary/80 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleInsert}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Insert Node</span>
                  </button>
                </div>
              )}

              {activeTab === "delete" && (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    value={deleteVal}
                    onChange={(e) => setDeleteVal(e.target.value)}
                    placeholder="Value to delete"
                    className="w-28 sm:w-36 px-3 py-1.5 rounded-xl border border-border bg-secondary/80 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Node</span>
                  </button>
                </div>
              )}

              {activeTab === "inorder" && (
                <div className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={handleInOrder}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <GitFork className="h-3.5 w-3.5" />
                    <span>Run In-Order Scan (Sorted Array)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFindMin}
                    className="px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground cursor-pointer transition-all"
                  >
                    Find Min
                  </button>
                  <button
                    type="button"
                    onClick={handleFindMax}
                    className="px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground cursor-pointer transition-all"
                  >
                    Find Max
                  </button>
                </div>
              )}
            </div>

            {/* Playback Transport & Speed Slider */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={playbackSteps.length === 0}
                  className="h-8 w-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white flex items-center justify-center shadow-sm cursor-pointer active:scale-95 transition-all"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleStepNext}
                  disabled={isPlaying || currentStepIndex >= playbackSteps.length - 1}
                  className="h-8 w-8 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 flex items-center justify-center text-foreground cursor-pointer transition-all"
                  aria-label="Step Next"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="h-8 w-8 rounded-xl border border-border bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                  aria-label="Reset Tree"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <span className="text-xs font-mono text-muted-foreground ml-1">
                  Step {playbackSteps.length > 0 ? currentStepIndex + 1 : 1} / {Math.max(1, playbackSteps.length)}
                </span>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-mono text-muted-foreground">Delay:</span>
                <input
                  type="range"
                  min="250"
                  max="1200"
                  step="50"
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                  className="w-24 sm:w-28 accent-cyan-500 cursor-pointer"
                />
                <span className="text-[11px] font-mono text-muted-foreground w-12 text-right">
                  {speedMs}ms
                </span>
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
              code={BST_CPP_SOURCE}
              activeLineNumber={currentStep.codeLine}
              algorithmName="Binary Search Tree (C++)"
            />
          </div>

          {/* BST Invariant Guarantee & Balance Inspector */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 backdrop-blur-md shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-emerald-500" />
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
                  BST Invariant Inspector
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Left &lt; Node &lt; Right
              </span>
            </div>

            {/* Invariant Formula Box */}
            <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 space-y-1">
              <div className="text-[11px] font-mono font-bold text-cyan-400">
                Ordering Guarantee:
              </div>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                ∀x ∈ Left(Root), val(x) &lt; val(Root) &lt; ∀y ∈ Right(Root), val(y)
              </p>
            </div>

            {/* Live In-Order Sequence Ribbon */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>In-Order Sorted Projection:</span>
                <span className="text-emerald-400">Strictly Monotonic</span>
              </div>
              <div className="p-2.5 rounded-xl border border-border/60 bg-background/60 font-mono text-xs text-foreground overflow-x-auto flex items-center gap-1.5">
                {currentStep.sortedArray.length === 0 ? (
                  <span className="text-muted-foreground text-[11px] italic">Empty sequence</span>
                ) : (
                  currentStep.sortedArray.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-2 py-0.5 rounded bg-secondary font-bold text-cyan-400 shrink-0">
                        {val}
                      </span>
                      {idx < currentStep.sortedArray.length - 1 && (
                        <span className="text-muted-foreground text-[10px]">≤</span>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>

            {/* Mathematical Height vs Optimal Benchmark */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl border border-border bg-secondary/30 space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase">Current Depth</span>
                <div className="text-sm font-bold text-foreground">
                  {currentStep.metrics.height} levels
                </div>
              </div>
              <div className="p-2.5 rounded-xl border border-border bg-secondary/30 space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase">Optimal ⌊log₂ N⌋</span>
                <div className="text-sm font-bold text-emerald-400">
                  {currentStep.metrics.optimalHeight} levels
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
