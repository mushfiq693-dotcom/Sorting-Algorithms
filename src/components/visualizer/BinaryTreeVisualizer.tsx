"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BinaryTreeEngine,
  TreeStep,
  TreeNode,
  TreeTraversalType,
} from "@/algorithms/binaryTree";
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
  Split,
} from "lucide-react";

const BINARY_TREE_CPP_SOURCE = `// Production-Grade C++ Binary Tree Implementation
#include <iostream>
#include <queue>
#include <vector>
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinaryTree {
public:
    TreeNode* root;

    BinaryTree() : root(nullptr) {}

    // Line 20: Level-Order Insertion (Complete Tree)
    void insert(int val) {
        if (!root) {
            root = new TreeNode(val);
            return;
        }
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();
            if (!curr->left) {
                curr->left = new TreeNode(val);
                return;
            } else q.push(curr->left);
            if (!curr->right) {
                curr->right = new TreeNode(val);
                return;
            } else q.push(curr->right);
        }
    }

    // Line 45: DFS Pre-Order Traversal (NLR)
    void preOrder(TreeNode* node, vector<int>& res) {
        if (!node) return;
        res.push_back(node->val);   // Visit Root
        preOrder(node->left, res);  // Left
        preOrder(node->right, res); // Right
    }

    // Line 53: DFS In-Order Traversal (LNR)
    void inOrder(TreeNode* node, vector<int>& res) {
        if (!node) return;
        inOrder(node->left, res);   // Left
        res.push_back(node->val);   // Visit Root
        inOrder(node->right, res);  // Right
    }

    // Line 61: DFS Post-Order Traversal (LRN)
    void postOrder(TreeNode* node, vector<int>& res) {
        if (!node) return;
        postOrder(node->left, res);  // Left
        postOrder(node->right, res); // Right
        res.push_back(node->val);    // Visit Root
    }

    // Line 69: BFS Level-Order Traversal
    vector<int> levelOrder() {
        vector<int> res;
        if (!root) return res;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();
            res.push_back(curr->val);
            if (curr->left) q.push(curr->left);
            if (curr->right) q.push(curr->right);
        }
        return res;
    }
};`;

interface NodePos {
  x: number;
  y: number;
  depth: number;
}

// Compute non-overlapping (x, y) coordinates for any binary tree using in-order sequence
function computeTreeLayout(
  nodes: Record<number, TreeNode>,
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
  const paddingX = 52;
  const usableWidth = width - paddingX * 2;
  const stepX = totalInOrder > 1 ? usableWidth / (totalInOrder - 1) : usableWidth / 2;

  for (const idStr of Object.keys(nodes)) {
    const id = Number(idStr);
    const d = depthMap[id] ?? 0;
    const order = inOrderMap[id] ?? 0;
    const x = paddingX + (totalInOrder === 1 ? usableWidth / 2 : order * stepX);
    const y = 46 + d * 68;
    positions[id] = { x, y, depth: d };
  }

  return positions;
}

export function BinaryTreeVisualizer() {
  const prefersReducedMotion = useReducedMotion();
  const engineRef = useRef<BinaryTreeEngine>(new BinaryTreeEngine());
  const engine = engineRef.current;

  // Visualizer step & playback states
  const [currentStep, setCurrentStep] = useState<TreeStep>(() => engine.getIdleStep());
  const [playbackSteps, setPlaybackSteps] = useState<TreeStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(650);

  // User input states
  const [insertVal, setInsertVal] = useState("8");
  const [searchVal, setSearchVal] = useState("4");
  const [traversalType, setTraversalType] = useState<TreeTraversalType>("in-order");
  const [presetType, setPresetType] = useState<string>("balanced");

  // Timer reference for animation
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  // Playback loop
  useEffect(() => {
    if (isPlaying && playbackSteps.length > 0) {
      clearTimer();
      playTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= playbackSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          setCurrentStep(playbackSteps[next]);
          return next;
        });
      }, speedMs);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isPlaying, playbackSteps, speedMs]);

  // Compute node coordinates whenever tree state changes
  const layoutPositions = useMemo(() => {
    return computeTreeLayout(currentStep.nodes, currentStep.rootId, 640);
  }, [currentStep.nodes, currentStep.rootId]);

  // Handle Operations
  const handleInsert = () => {
    const val = parseInt(insertVal, 10);
    if (isNaN(val)) return;
    clearTimer();
    setIsPlaying(false);

    const steps = engine.generateInsertSteps(val);
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) setIsPlaying(true);
  };

  const handleSearch = () => {
    const val = parseInt(searchVal, 10);
    if (isNaN(val)) return;
    clearTimer();
    setIsPlaying(false);

    const steps = engine.generateSearchSteps(val);
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) setIsPlaying(true);
  };

  const handleStartTraversal = () => {
    clearTimer();
    setIsPlaying(false);

    const steps = engine.generateTraversalSteps(traversalType);
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) setIsPlaying(true);
  };

  const handleInvertTree = () => {
    clearTimer();
    setIsPlaying(false);

    const steps = engine.generateInvertSteps();
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) setIsPlaying(true);
  };

  const handlePruneLeaf = () => {
    clearTimer();
    setIsPlaying(false);

    const steps = engine.generateDeleteLeafSteps();
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) setIsPlaying(true);
  };

  const handleLoadPreset = (type: "balanced" | "complete" | "left-skewed" | "right-skewed" | "bst") => {
    clearTimer();
    setIsPlaying(false);
    setPresetType(type);
    const step = engine.loadPreset(type);
    setCurrentStep(step);
    setPlaybackSteps([]);
  };

  const handleRandomize = () => {
    clearTimer();
    setIsPlaying(false);
    const step = engine.randomize();
    setCurrentStep(step);
    setPlaybackSteps([]);
  };

  const handleClear = () => {
    clearTimer();
    setIsPlaying(false);
    const step = engine.clear();
    setCurrentStep(step);
    setPlaybackSteps([]);
  };

  const handlePlayPause = () => {
    if (playbackSteps.length === 0) return;
    if (currentStepIndex >= playbackSteps.length - 1) {
      setCurrentStepIndex(0);
      setCurrentStep(playbackSteps[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < playbackSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setCurrentStep(playbackSteps[nextIdx]);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setCurrentStep(playbackSteps[prevIdx]);
    }
  };

  const handleResetPlayback = () => {
    clearTimer();
    setIsPlaying(false);
    if (playbackSteps.length > 0) {
      setCurrentStepIndex(0);
      setCurrentStep(playbackSteps[0]);
    }
  };

  const metrics = currentStep.metrics;
  const isOperationComplete =
    playbackSteps.length > 0 && currentStepIndex === playbackSteps.length - 1;

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto" suppressHydrationWarning>
      {/* 2-Column Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual Stage Canvas Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col min-h-[380px] sm:min-h-[420px] relative overflow-hidden shadow-xs">
            {/* Header Indicators */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
                <GitFork className="h-4 w-4" />
                <span>Binary Tree Topology Studio</span>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-secondary border border-border text-foreground font-semibold text-[11px]">
                  {currentStep.rootId !== null ? `${metrics.nodeCount} Nodes` : "Empty Tree"}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold text-[11px]">
                  Height: {metrics.height}
                </span>
              </div>
            </div>

            {/* Tree SVG Node Render Viewport */}
            <div className="flex-1 flex items-center justify-center overflow-x-auto py-2">
              {currentStep.rootId === null ? (
                <div className="w-full flex flex-col items-center justify-center text-muted-foreground text-xs font-mono py-12 space-y-1.5">
                  <span className="text-cyan-500 font-bold text-sm">root == nullptr</span>
                  <span>The binary tree is empty. Use &quot;Insert BFS&quot; or select a Preset below.</span>
                </div>
              ) : (
                <svg
                  className="w-full h-full min-w-[540px] max-w-[640px] max-h-[320px]"
                  viewBox="0 0 640 320"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                    </linearGradient>
                    <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Level Guide Lines */}
                  {[0, 1, 2, 3].map((lvl) => {
                    const y = 46 + lvl * 68;
                    return (
                      <g key={`lvl-${lvl}`} opacity="0.25">
                        <line x1="20" y1={y} x2="620" y2={y} stroke="currentColor" strokeDasharray="3 3" />
                        <text x="24" y={y - 6} fill="currentColor" fontSize="9" fontFamily="monospace" fontWeight="600">
                          Level {lvl}
                        </text>
                      </g>
                    );
                  })}

                  {/* Connecting Edges with smooth curved beziers */}
                  {Object.values(currentStep.nodes).map((node) => {
                    const parentPos = layoutPositions[node.id];
                    if (!parentPos) return null;

                    return (
                      <g key={`edges-${node.id}`}>
                        {/* Left Child Edge */}
                        {node.left !== null && layoutPositions[node.left] && (
                          <path
                            d={`M ${parentPos.x} ${parentPos.y + 10} C ${parentPos.x} ${(parentPos.y + layoutPositions[node.left].y) / 2}, ${layoutPositions[node.left].x} ${(parentPos.y + layoutPositions[node.left].y) / 2}, ${layoutPositions[node.left].x} ${layoutPositions[node.left].y - 10}`}
                            stroke="url(#edgeGrad)"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        )}

                        {/* Right Child Edge */}
                        {node.right !== null && layoutPositions[node.right] && (
                          <path
                            d={`M ${parentPos.x} ${parentPos.y + 10} C ${parentPos.x} ${(parentPos.y + layoutPositions[node.right].y) / 2}, ${layoutPositions[node.right].x} ${(parentPos.y + layoutPositions[node.right].y) / 2}, ${layoutPositions[node.right].x} ${layoutPositions[node.right].y - 10}`}
                            stroke="url(#edgeGrad)"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Tree Nodes with AlgoHub-Standard Theme styling */}
                  {Object.values(currentStep.nodes).map((node) => {
                    const pos = layoutPositions[node.id];
                    if (!pos) return null;

                    const isActive = currentStep.activeNodeId === node.id;
                    const isVisited = currentStep.visitedIds.includes(node.id);
                    const isRoot = node.id === currentStep.rootId;
                    const isLeaf = node.left === null && node.right === null;
                    const isFound = currentStep.type === "found" && currentStep.activeNodeId === node.id;

                    // Color tokens matching AlgoHub Theme
                    let circleFill = "#18181b"; // Dark card base
                    let circleStroke = "#3f3f46"; // Card border
                    let textColor = "#f4f4f5";

                    if (isFound) {
                      circleFill = "#059669"; // Emerald active
                      circleStroke = "#34d399";
                      textColor = "#ffffff";
                    } else if (isActive) {
                      circleFill = "#0284c7"; // Sky active
                      circleStroke = "#38bdf8";
                      textColor = "#ffffff";
                    } else if (isVisited) {
                      circleFill = "#065f46"; // Visited dark emerald
                      circleStroke = "#10b981";
                      textColor = "#ecfdf5";
                    } else if (isRoot) {
                      circleFill = "#1e1b4b"; // Indigo root
                      circleStroke = "#818cf8";
                      textColor = "#e0e7ff";
                    }

                    return (
                      <g
                        key={`node-${node.id}`}
                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      >
                        {/* Outer Glow / Pulse for Active Node */}
                        {isActive && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="27"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                            className="animate-spin"
                            style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                          />
                        )}

                        {/* Node Card Circle */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="20"
                          fill={circleFill}
                          stroke={circleStroke}
                          strokeWidth="2.5"
                          filter="url(#nodeShadow)"
                          className="transition-colors duration-300"
                        />

                        {/* Node Value Label */}
                        <text
                          x={pos.x}
                          y={pos.y + 4.5}
                          textAnchor="middle"
                          fill={textColor}
                          fontSize="13"
                          fontWeight="700"
                          fontFamily="monospace"
                          className="select-none"
                        >
                          {node.val}
                        </text>

                        {/* Node Role Badges (ROOT / LEAF) */}
                        {isRoot && (
                          <g>
                            <rect
                              x={pos.x - 17}
                              y={pos.y - 32}
                              width="34"
                              height="12"
                              rx="3"
                              fill="#1e1b4b"
                              stroke="#818cf8"
                              strokeWidth="1"
                            />
                            <text
                              x={pos.x}
                              y={pos.y - 23}
                              textAnchor="middle"
                              fill="#a5b4fc"
                              fontSize="8"
                              fontWeight="800"
                              fontFamily="monospace"
                              className="select-none uppercase"
                            >
                              ROOT
                            </text>
                          </g>
                        )}

                        {isLeaf && !isRoot && (
                          <g>
                            <rect
                              x={pos.x - 16}
                              y={pos.y + 23}
                              width="32"
                              height="11"
                              rx="3"
                              fill="#18181b"
                              stroke="#52525b"
                              strokeWidth="1"
                            />
                            <text
                              x={pos.x}
                              y={pos.y + 31.5}
                              textAnchor="middle"
                              fill="#a1a1aa"
                              fontSize="7.5"
                              fontWeight="700"
                              fontFamily="monospace"
                              className="select-none uppercase"
                            >
                              LEAF
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Dynamic Explanation Text Box */}
            <div
              className={`rounded-xl border px-3 py-2 min-h-[38px] flex items-center shadow-inner ${
                currentStep.type === "found" || isOperationComplete
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                  : currentStep.type === "not-found"
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300"
                  : "border-border/80 bg-secondary/60 text-foreground"
              }`}
            >
              <p className="text-xs font-medium font-mono flex items-center gap-2 truncate">
                {currentStep.type === "found" || isOperationComplete ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : currentStep.type === "not-found" ? (
                  <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
                )}
                <span className="truncate">{currentStep.description}</span>
              </p>
            </div>
          </div>

          {/* Stepper Playback Toolbar */}
          {playbackSteps.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl border border-cyan-500/30 bg-card/90 text-xs font-mono shadow-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-[11px]">
                  Step {currentStepIndex + 1}/{playbackSteps.length}
                </span>
                <span className="text-muted-foreground truncate max-w-xs uppercase font-semibold">
                  {currentStep.type}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetPlayback}
                  className="p-1 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Reset Playback"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>

                <button
                  onClick={handleStepBack}
                  disabled={currentStepIndex === 0}
                  className="p-1 rounded-lg border border-border bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-40 cursor-pointer"
                  title="Previous Step"
                >
                  <SkipForward className="h-3 w-3 rotate-180" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs hover:opacity-95 cursor-pointer shadow-xs"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
                  <span>{isPlaying ? "Pause" : currentStepIndex >= playbackSteps.length - 1 ? "Replay" : "Play"}</span>
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={currentStepIndex >= playbackSteps.length - 1}
                  className="p-1 rounded-lg border border-border bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-40 cursor-pointer"
                  title="Next Step"
                >
                  <SkipForward className="h-3 w-3" />
                </button>
              </div>

              {/* Scrubber & Speed */}
              <div className="flex items-center gap-2.5">
                <input
                  type="range"
                  min="0"
                  max={playbackSteps.length - 1}
                  value={currentStepIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setCurrentStepIndex(idx);
                    setCurrentStep(playbackSteps[idx]);
                  }}
                  className="w-20 sm:w-28 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-[10px] text-muted-foreground font-mono">{speedMs}ms</span>
              </div>
            </div>
          )}

          {/* Interactive Operations Toolbar */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/90 shadow-xs backdrop-blur-xl space-y-3 font-mono text-xs">
            {/* Row 1: Insert, Search, Invert, Prune */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Insert Level-Order (BFS) */}
              <div className="flex items-center gap-1.5 min-w-0">
                <input
                  type="number"
                  value={insertVal}
                  onChange={(e) => setInsertVal(e.target.value)}
                  placeholder="Val"
                  className="w-14 px-2 py-1 rounded-lg border border-border bg-secondary text-foreground text-center font-bold font-mono focus:outline-hidden focus:ring-1 focus:ring-cyan-500/50 min-w-0"
                />
                <button
                  onClick={handleInsert}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-40 transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
                  title="Insert node in level-order filling left-to-right"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Insert BFS</span>
                </button>
              </div>

              {/* Search Target */}
              <div className="flex items-center gap-1.5 min-w-0">
                <input
                  type="number"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Target"
                  className="w-14 px-2 py-1 rounded-lg border border-border bg-secondary text-foreground text-center font-bold font-mono focus:outline-hidden focus:ring-1 focus:ring-cyan-500/50 min-w-0"
                />
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold hover:bg-cyan-500/20 disabled:opacity-40 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Search</span>
                </button>
              </div>

              {/* Invert Tree (LC 226) */}
              <button
                onClick={handleInvertTree}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold hover:bg-purple-500/20 disabled:opacity-40 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                title="Invert Binary Tree (LeetCode 226 mirror swap)"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Invert (LC 226)</span>
              </button>

              {/* Prune Leaf */}
              <button
                onClick={handlePruneLeaf}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300 font-bold hover:bg-rose-500/20 disabled:opacity-40 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                title="Delete deepest leaf node"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                <span>Prune Leaf</span>
              </button>
            </div>

            {/* Row 2: Traversals & Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/70">
              {/* Segmented Traversal Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Traverse:
                </span>
                <div className="inline-flex rounded-xl p-0.5 bg-secondary border border-border text-[11px] font-mono">
                  {(["in-order", "pre-order", "post-order", "level-order"] as TreeTraversalType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTraversalType(t)}
                      className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
                        traversalType === t
                          ? "bg-card text-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t === "in-order"
                        ? "In-Order"
                        : t === "pre-order"
                        ? "Pre-Order"
                        : t === "post-order"
                        ? "Post-Order"
                        : "Level-Order"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStartTraversal}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs hover:opacity-95 cursor-pointer shadow-xs ml-1"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Run</span>
                </button>
              </div>

              {/* Presets & Utility Controls */}
              <div className="flex items-center gap-1.5">
                <select
                  value={presetType}
                  onChange={(e) => handleLoadPreset(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-secondary text-foreground text-xs font-mono font-medium focus:outline-hidden"
                >
                  <option value="balanced">Balanced (7)</option>
                  <option value="complete">Complete (6)</option>
                  <option value="left-skewed">Left Skewed</option>
                  <option value="right-skewed">Right Skewed</option>
                  <option value="bst">BST Shape</option>
                </select>

                <button
                  onClick={handleRandomize}
                  title="Randomize Tree"
                  className="p-1.5 rounded-lg border border-border bg-secondary text-amber-500 hover:bg-secondary/80 cursor-pointer transition-all"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={handleClear}
                  title="Clear Tree"
                  className="p-1.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer & Invariants Studio (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* C++ Code Viewer Container with strict height limits */}
          <div className="rounded-2xl border border-border bg-card p-0 overflow-hidden shadow-xs h-[280px] sm:h-[300px] lg:h-[320px] max-h-[280px] sm:max-h-[300px] lg:max-h-[320px] min-h-0 shrink-0 flex flex-col">
            <CodeViewer
              code={BINARY_TREE_CPP_SOURCE}
              activeLineNumber={currentStep.codeLine}
              algorithmName="Binary Tree"
            />
          </div>

          {/* Traversal Sequence Order Log */}
          <div className="rounded-2xl border border-border bg-card/90 p-3.5 sm:p-4 backdrop-blur-xl shadow-xs space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-500" />
                <span>Traversal Sequence Order</span>
              </span>
              <span className="text-[10px] text-muted-foreground">
                {currentStep.traversalOrder.length} visited
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 min-h-[34px] p-2 bg-secondary/40 rounded-xl border border-border/60">
              {currentStep.traversalOrder.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No traversal active. Click &apos;Run&apos; to execute.</span>
              ) : (
                currentStep.traversalOrder.map((val, idx) => (
                  <span
                    key={`order-${idx}`}
                    className="px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold text-xs"
                  >
                    {val}
                  </span>
                ))
              )}
            </div>

            {/* DFS Call Stack Display */}
            {currentStep.callStack && currentStep.callStack.length > 0 && (
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">DFS Call Stack:</span>
                <div className="flex flex-col gap-1 text-[11px] font-mono text-purple-600 dark:text-purple-300 bg-purple-500/10 p-2 rounded-xl border border-purple-500/20 max-h-20 overflow-y-auto">
                  {currentStep.callStack.map((frame, i) => (
                    <span key={i} className="truncate">↳ {frame}</span>
                  ))}
                </div>
              </div>
            )}

            {/* BFS Queue Display */}
            {currentStep.queueState && (
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">BFS Queue:</span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20 overflow-x-auto">
                  {currentStep.queueState.length === 0 ? (
                    <span className="text-muted-foreground italic">Queue is empty</span>
                  ) : (
                    currentStep.queueState.map((qId, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 font-bold">
                        {currentStep.nodes[qId]?.val ?? qId}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tree Invariants & Structural Classifications */}
          <div className="rounded-2xl border border-border bg-card/90 p-3.5 sm:p-4 backdrop-blur-xl shadow-xs space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-500" />
                <span>Tree Invariants &amp; Classifications</span>
              </span>
            </div>

            {/* Metric Counter Tiles */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-border bg-secondary/50 p-2.5 flex flex-col items-center shadow-xs">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Height</span>
                <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{metrics.height}</span>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-2.5 flex flex-col items-center shadow-xs">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Leaves</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{metrics.leafCount}</span>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-2.5 flex flex-col items-center shadow-xs">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Internal</span>
                <span className="text-base font-black text-purple-600 dark:text-purple-400">{metrics.internalCount}</span>
              </div>
            </div>

            {/* Tree Classification Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div
                className={`p-2 rounded-xl border flex items-center justify-between shadow-xs ${
                  metrics.isFull
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold"
                    : "border-border bg-secondary/30 text-muted-foreground"
                }`}
              >
                <span>Full Tree (0 or 2)</span>
                {metrics.isFull ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60" />}
              </div>

              <div
                className={`p-2 rounded-xl border flex items-center justify-between shadow-xs ${
                  metrics.isComplete
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold"
                    : "border-border bg-secondary/30 text-muted-foreground"
                }`}
              >
                <span>Complete (Heap)</span>
                {metrics.isComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60" />}
              </div>

              <div
                className={`p-2 rounded-xl border flex items-center justify-between shadow-xs ${
                  metrics.isPerfect
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold"
                    : "border-border bg-secondary/30 text-muted-foreground"
                }`}
              >
                <span>Perfect Pyramid</span>
                {metrics.isPerfect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60" />}
              </div>

              <div
                className={`p-2 rounded-xl border flex items-center justify-between shadow-xs ${
                  metrics.isBalanced
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold"
                    : "border-border bg-secondary/30 text-muted-foreground"
                }`}
              >
                <span>Balanced (AVL)</span>
                {metrics.isBalanced ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
