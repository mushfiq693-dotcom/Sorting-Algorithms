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
  HelpCircle,
  Activity,
  Sliders,
  Sparkles,
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
}

// Compute non-overlapping (x, y) coordinates for any binary tree using in-order ordering
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
  const paddingX = 48;
  const usableWidth = width - paddingX * 2;
  const stepX = totalInOrder > 1 ? usableWidth / (totalInOrder - 1) : usableWidth / 2;

  for (const idStr of Object.keys(nodes)) {
    const id = Number(idStr);
    const d = depthMap[id] ?? 0;
    const order = inOrderMap[id] ?? 0;
    const x = paddingX + (totalInOrder === 1 ? usableWidth / 2 : order * stepX);
    const y = 48 + d * 64;
    positions[id] = { x, y };
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

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      {/* 2-Column Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Tree Canvas & Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual Stage Canvas */}
          <div className="relative bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-xl p-4 min-h-[360px] sm:min-h-[400px] flex flex-col justify-between overflow-hidden shadow-xl backdrop-blur-sm">
            {/* Top Canvas Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    Binary Tree Topology Canvas
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Hierarchical Nodes with Recursive Left & Right Subtrees
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-800/80 text-slate-300 border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentStep.rootId !== null ? `${metrics.nodeCount} Nodes` : "Empty Tree"}</span>
              </div>
            </div>

            {/* Tree SVG Node Render Area */}
            <div className="relative w-full h-[260px] sm:h-[300px] overflow-x-auto overflow-y-hidden my-auto flex items-center justify-center">
              {currentStep.rootId === null ? (
                <div className="flex flex-col items-center justify-center text-slate-500 gap-2 py-8">
                  <div className="p-3 rounded-full bg-slate-800/50 border border-slate-700/50">
                    <GitFork className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-sm">The binary tree is empty (root == nullptr).</p>
                  <p className="text-xs text-slate-600">Insert values or select a preset below to visualize.</p>
                </div>
              ) : (
                <svg
                  className="w-full h-full max-w-[640px] max-h-[300px]"
                  viewBox="0 0 640 300"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Connecting Edges */}
                  {Object.values(currentStep.nodes).map((node) => {
                    const parentPos = layoutPositions[node.id];
                    if (!parentPos) return null;

                    return (
                      <g key={`edges-${node.id}`}>
                        {/* Left Child Edge */}
                        {node.left !== null && layoutPositions[node.left] && (
                          <line
                            x1={parentPos.x}
                            y1={parentPos.y}
                            x2={layoutPositions[node.left].x}
                            y2={layoutPositions[node.left].y}
                            stroke="url(#edgeGrad)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        )}

                        {/* Right Child Edge */}
                        {node.right !== null && layoutPositions[node.right] && (
                          <line
                            x1={parentPos.x}
                            y1={parentPos.y}
                            x2={layoutPositions[node.right].x}
                            y2={layoutPositions[node.right].y}
                            stroke="url(#edgeGrad)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Tree Nodes */}
                  {Object.values(currentStep.nodes).map((node) => {
                    const pos = layoutPositions[node.id];
                    if (!pos) return null;

                    const isActive = currentStep.activeNodeId === node.id;
                    const isVisited = currentStep.visitedIds.includes(node.id);
                    const isRoot = node.id === currentStep.rootId;
                    const isLeaf = node.left === null && node.right === null;

                    let circleFill = "#1e293b"; // slate-800
                    let circleStroke = "#475569"; // slate-600
                    let textColor = "#f1f5f9"; // slate-100

                    if (isActive) {
                      circleFill = "#0284c7"; // sky-600
                      circleStroke = "#38bdf8"; // sky-400
                    } else if (currentStep.type === "found" && currentStep.activeNodeId === node.id) {
                      circleFill = "#059669"; // emerald-600
                      circleStroke = "#34d399";
                    } else if (isVisited) {
                      circleFill = "#047857"; // emerald-700
                      circleStroke = "#10b981";
                    } else if (isRoot) {
                      circleFill = "#1e1b4b"; // indigo-950
                      circleStroke = "#6366f1"; // indigo-500
                    }

                    return (
                      <g
                        key={`node-${node.id}`}
                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      >
                        {/* Outer Glow for Active Node */}
                        {isActive && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="24"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                            className="animate-spin"
                            style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                          />
                        )}

                        {/* Main Node Circle */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="19"
                          fill={circleFill}
                          stroke={circleStroke}
                          strokeWidth="2.5"
                          filter={isActive ? "url(#glow)" : undefined}
                          className="transition-colors duration-300"
                        />

                        {/* Node Value Label */}
                        <text
                          x={pos.x}
                          y={pos.y + 4.5}
                          textAnchor="middle"
                          fill={textColor}
                          fontSize="12"
                          fontWeight="600"
                          className="select-none font-mono"
                        >
                          {node.val}
                        </text>

                        {/* Node Role Badges (Root / Leaf) */}
                        {isRoot && (
                          <text
                            x={pos.x}
                            y={pos.y - 23}
                            textAnchor="middle"
                            fill="#818cf8"
                            fontSize="9"
                            fontWeight="700"
                            className="uppercase tracking-wider select-none"
                          >
                            ROOT
                          </text>
                        )}
                        {isLeaf && !isRoot && (
                          <text
                            x={pos.x}
                            y={pos.y + 29}
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="8"
                            fontWeight="600"
                            className="select-none uppercase tracking-wider"
                          >
                            LEAF
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Bottom Status / Event Banner */}
            <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <span className="truncate pr-2 font-mono text-[11px] sm:text-xs">
                {currentStep.description}
              </span>
              <span className="shrink-0 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {currentStep.type}
              </span>
            </div>
          </div>

          {/* Interactive Operations Control Panel */}
          <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-3 shadow-lg">
            {/* Row 1: Insert, Search, and Leaf Pruning */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Insert Level-Order */}
              <div className="flex items-center gap-1.5 min-w-0">
                <input
                  type="number"
                  value={insertVal}
                  onChange={(e) => setInsertVal(e.target.value)}
                  placeholder="Val"
                  className="w-16 h-8 px-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-emerald-500 min-w-0"
                />
                <button
                  onClick={handleInsert}
                  className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert BFS</span>
                </button>
              </div>

              {/* Search Value */}
              <div className="flex items-center gap-1.5 min-w-0">
                <input
                  type="number"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Target"
                  className="w-16 h-8 px-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 font-mono text-center focus:outline-none focus:border-sky-500 min-w-0"
                />
                <button
                  onClick={handleSearch}
                  className="h-8 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>

              {/* Invert Tree & Prune Leaf */}
              <button
                onClick={handleInvertTree}
                className="h-8 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Invert (LC 226)</span>
              </button>

              <button
                onClick={handlePruneLeaf}
                className="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap border border-slate-700"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Prune Leaf</span>
              </button>
            </div>

            {/* Row 2: Traversals & Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              {/* Traversal Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Traversal:
                </span>
                {(["in-order", "pre-order", "post-order", "level-order"] as TreeTraversalType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTraversalType(t);
                    }}
                    className={`h-7 px-2.5 rounded-md text-xs font-medium transition-all ${
                      traversalType === t
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                        : "bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50"
                    }`}
                  >
                    {t === "in-order"
                      ? "In-Order (LNR)"
                      : t === "pre-order"
                      ? "Pre-Order (NLR)"
                      : t === "post-order"
                      ? "Post-Order (LRN)"
                      : "Level-Order (BFS)"}
                  </button>
                ))}
                <button
                  onClick={handleStartTraversal}
                  className="h-7 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-sm ml-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Traverse</span>
                </button>
              </div>

              {/* Presets & Actions */}
              <div className="flex items-center gap-1.5">
                <select
                  value={presetType}
                  onChange={(e) => handleLoadPreset(e.target.value as any)}
                  className="h-7 px-2 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-slate-500"
                >
                  <option value="balanced">Preset: Balanced</option>
                  <option value="complete">Preset: Complete</option>
                  <option value="left-skewed">Preset: Left Skewed</option>
                  <option value="right-skewed">Preset: Right Skewed</option>
                  <option value="bst">Preset: BST Layout</option>
                </select>

                <button
                  onClick={handleRandomize}
                  title="Randomize Tree"
                  className="h-7 w-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={handleClear}
                  title="Clear Tree"
                  className="h-7 w-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Row 3: Playback Controls */}
            {playbackSteps.length > 0 && (
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleResetPlayback}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    title="Restart"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleStepBack}
                    disabled={currentStepIndex === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs transition-colors"
                    title="Step Back"
                  >
                    <SkipForward className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={currentStepIndex >= playbackSteps.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs transition-colors"
                    title="Step Forward"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scrubber / Progress */}
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {currentStepIndex + 1}/{playbackSteps.length}
                  </span>
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
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Speed Slider */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono">{speedMs}ms</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Viewer & Invariants Studio (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* C++ Code Viewer Container with strict height limits */}
          <div className="h-[280px] sm:h-[300px] lg:h-[320px] max-h-[280px] sm:max-h-[300px] lg:max-h-[320px] min-h-0 shrink-0 overflow-hidden flex flex-col bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-xl shadow-lg">
            <CodeViewer
              code={BINARY_TREE_CPP_SOURCE}
              activeLineNumber={currentStep.codeLine}
              algorithmName="Binary Tree"
            />
          </div>

          {/* Traversal Output Log */}
          <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Traversal Sequence Order</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentStep.traversalOrder.length} visited
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-1.5 bg-slate-950/50 rounded-lg border border-slate-800/60">
              {currentStep.traversalOrder.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No traversal active. Click 'Traverse' to run.</span>
              ) : (
                currentStep.traversalOrder.map((val, idx) => (
                  <span
                    key={`order-${idx}`}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold"
                  >
                    {val}
                  </span>
                ))
              )}
            </div>

            {/* Call Stack or Queue Display */}
            {currentStep.callStack && currentStep.callStack.length > 0 && (
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-[11px] font-medium text-slate-400">DFS Call Stack:</span>
                <div className="flex flex-col gap-1 text-[11px] font-mono text-purple-300 bg-purple-950/30 p-1.5 rounded border border-purple-800/40 max-h-20 overflow-y-auto">
                  {currentStep.callStack.map((frame, i) => (
                    <span key={i} className="truncate">↳ {frame}</span>
                  ))}
                </div>
              </div>
            )}

            {currentStep.queueState && (
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-[11px] font-medium text-slate-400">BFS Queue:</span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-sky-300 bg-sky-950/30 p-1.5 rounded border border-sky-800/40 overflow-x-auto">
                  {currentStep.queueState.length === 0 ? (
                    <span className="text-slate-500 italic">Queue is empty</span>
                  ) : (
                    currentStep.queueState.map((qId, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-500/30">
                        {currentStep.nodes[qId]?.val ?? qId}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tree Invariants & Structural Classifications */}
          <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tree Invariants & Classifications</span>
              </span>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/70 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Height</span>
                <span className="text-base font-bold text-indigo-400 font-mono">{metrics.height}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/70 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Leaves</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{metrics.leafCount}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/70 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Internal</span>
                <span className="text-base font-bold text-sky-400 font-mono">{metrics.internalCount}</span>
              </div>
            </div>

            {/* Tree Type Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2 rounded-lg border flex items-center justify-between ${
                metrics.isFull ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-slate-950/50 border-slate-800 text-slate-400"
              }`}>
                <span>Full Tree (0 or 2)</span>
                {metrics.isFull ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
              </div>

              <div className={`p-2 rounded-lg border flex items-center justify-between ${
                metrics.isComplete ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-slate-950/50 border-slate-800 text-slate-400"
              }`}>
                <span>Complete (Heap)</span>
                {metrics.isComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
              </div>

              <div className={`p-2 rounded-lg border flex items-center justify-between ${
                metrics.isPerfect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-slate-950/50 border-slate-800 text-slate-400"
              }`}>
                <span>Perfect Pyramid</span>
                {metrics.isPerfect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
              </div>

              <div className={`p-2 rounded-lg border flex items-center justify-between ${
                metrics.isBalanced ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-slate-950/50 border-slate-800 text-slate-400"
              }`}>
                <span>Balanced (AVL)</span>
                {metrics.isBalanced ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
