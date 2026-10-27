"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  BacktrackingEngine,
  BacktrackStep,
  BACKTRACKING_PRESETS,
} from "@/algorithms/backtracking";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  SlidersHorizontal,
  Zap,
  Target,
  Activity,
  CheckCircle2,
  Crown,
  LayoutGrid,
  Layers,
  GitBranch,
  Boxes,
  Check,
} from "lucide-react";

interface DecisionTreeNode {
  id: string;
  parentId: string | null;
  label: string;
  edgeLabel?: string;
  x: number;
  y: number;
  depth: number;
  isLeftChild?: boolean;
  subset: string[];
  path: ("include" | "exclude")[];
}

export function BacktrackingVisualizer() {
  // Preset Selection & Controls
  const [selectedPresetId, setSelectedPresetId] = useState<string>("n-queens-4");
  const [speed, setSpeed] = useState<number>(600); // ms per step

  // Playback & Step State
  const [steps, setSteps] = useState<BacktrackStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const preset = useMemo(
    () => BACKTRACKING_PRESETS.find((p) => p.id === selectedPresetId) || BACKTRACKING_PRESETS[0],
    [selectedPresetId]
  );

  // Derive activeMode directly from selected preset
  const activeMode = preset.mode;

  // Initialize Steps on preset change
  const initializeSteps = useCallback(() => {
    const generated = BacktrackingEngine.generateSteps(preset);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [preset]);

  useEffect(() => {
    initializeSteps();
  }, [initializeSteps]);

  const currentStep = useMemo<BacktrackStep | null>(() => {
    if (steps.length === 0) return null;
    return steps[Math.min(currentStepIndex, steps.length - 1)];
  }, [steps, currentStepIndex]);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          const next = prev + 1;
          if (steps[next]?.status === "solved") {
            try {
              confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
            } catch {
              // ignore
            }
          }
          return next;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, speed]);

  const togglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      if (steps[next]?.status === "solved") {
        try {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handlePresetChange = (id: string) => {
    setSelectedPresetId(id);
  };

  // N-Queens derived state
  const board = useMemo(() => {
    if (!currentStep || currentStep.mode !== "n-queens") return null;
    return currentStep.board;
  }, [currentStep]);

  const queens = useMemo(() => {
    if (!currentStep || currentStep.mode !== "n-queens") return [];
    return currentStep.queens ?? [];
  }, [currentStep]);

  const boardSize = useMemo(() => {
    if (!currentStep || currentStep.mode !== "n-queens") return 4;
    return currentStep.boardSize ?? 4;
  }, [currentStep]);

  const conflictCells = useMemo(() => {
    if (!currentStep) return new Set<string>();
    return new Set((currentStep.conflictCells ?? []).map(([r, c]) => `${r},${c}`));
  }, [currentStep]);

  const isCurrentQueen = useMemo(() => {
    if (!currentStep) return null;
    if (currentStep.row === null || currentStep.col === null) return null;
    return `${currentStep.row},${currentStep.col}`;
  }, [currentStep]);

  // Subsets Binary Decision Tree Graph Data
  const treeData = useMemo(() => {
    if (activeMode !== "subsets") return { nodes: [], edges: [], elements: [] };
    const elements = (preset.set ?? ["A", "B", "C"]).map(String);
    const n = elements.length;
    const nodes: DecisionTreeNode[] = [];
    const edges: {
      from: DecisionTreeNode;
      to: DecisionTreeNode;
      label: string;
      isLeft: boolean;
    }[] = [];

    const width = 700;
    const leafCount = Math.pow(2, n);
    const leafMargin = 45;
    const leafStep = (width - 2 * leafMargin) / Math.max(leafCount - 1, 1);

    const getY = (d: number) => 26 + d * 53;

    function buildSubtree(
      depth: number,
      path: ("include" | "exclude")[],
      currentSubset: string[],
      parentId: string | null,
      edgeLabel?: string,
      isLeft?: boolean
    ): { id: string; x: number; y: number } {
      const id = path.length === 0 ? "root" : "node-" + path.join("-");
      const y = getY(depth);

      if (depth === n) {
        let leafIdx = 0;
        path.forEach((p, idx) => {
          if (p === "exclude") {
            leafIdx += Math.pow(2, n - 1 - idx);
          }
        });
        const x = leafMargin + leafIdx * leafStep;
        const leafLabel = currentSubset.length > 0 ? `{${currentSubset.join(",")}}` : "∅";
        const node: DecisionTreeNode = {
          id,
          parentId,
          label: leafLabel,
          edgeLabel,
          x,
          y,
          depth,
          isLeftChild: isLeft,
          subset: currentSubset,
          path,
        };
        nodes.push(node);
        return { id, x, y };
      }

      const el = elements[depth];
      const leftChild = buildSubtree(
        depth + 1,
        [...path, "include"],
        [...currentSubset, el],
        id,
        `+${el}`,
        true
      );
      const rightChild = buildSubtree(
        depth + 1,
        [...path, "exclude"],
        [...currentSubset],
        id,
        `-${el}`,
        false
      );

      const x = (leftChild.x + rightChild.x) / 2;
      const label = currentSubset.length > 0 ? `{${currentSubset.join(",")}}` : "∅";
      const node: DecisionTreeNode = {
        id,
        parentId,
        label,
        edgeLabel,
        x,
        y,
        depth,
        isLeftChild: isLeft,
        subset: currentSubset,
        path,
      };
      nodes.push(node);
      return { id, x, y };
    }

    buildSubtree(0, [], [], null);

    const nodeMap = new Map(nodes.map((nd) => [nd.id, nd]));
    nodes.forEach((nd) => {
      if (nd.parentId) {
        const parent = nodeMap.get(nd.parentId);
        if (parent) {
          edges.push({
            from: parent,
            to: nd,
            label: nd.edgeLabel || "",
            isLeft: nd.isLeftChild ?? true,
          });
        }
      }
    });

    return { nodes, edges, elements };
  }, [activeMode, preset.set]);

  const currentDecisionPath = useMemo(() => {
    return currentStep?.decisionPath ?? [];
  }, [currentStep]);

  const isNodeOnActivePath = useCallback(
    (node: DecisionTreeNode) => {
      if (node.path.length > currentDecisionPath.length) return false;
      return node.path.every((p, i) => currentDecisionPath[i] === p);
    },
    [currentDecisionPath]
  );

  const isLeafDiscovered = useCallback(
    (node: DecisionTreeNode) => {
      if (!currentStep?.allDiscoveredSubsets) return false;
      return currentStep.allDiscoveredSubsets.some(
        (sub) =>
          sub.length === node.subset.length &&
          sub.every((v, i) => String(v) === String(node.subset[i]))
      );
    },
    [currentStep]
  );

  const isCurrentActiveNode = useCallback(
    (node: DecisionTreeNode) => {
      if (!currentStep) return false;
      if (currentStep.nodeId === node.id) return true;
      if (!currentStep.nodeId && node.id === "root") return true;
      return false;
    },
    [currentStep]
  );

  // Pre-compute dynamic classNames for N-Queens
  const bannerClassName = useMemo(() => {
    if (!currentStep) return "bg-secondary border-border text-muted-foreground";
    if (currentStep.status === "valid")
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
    if (currentStep.status === "conflict")
      return "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400";
    if (currentStep.status === "backtracking")
      return "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400";
    return "bg-secondary border-border text-muted-foreground";
  }, [currentStep]);

  // Subsets Discovered progress
  const discoveredSubsets = useMemo(() => {
    return currentStep?.allDiscoveredSubsets ?? [];
  }, [currentStep]);

  const totalExpectedSubsets = currentStep?.totalExpectedSubsets ?? 8;
  const subsetsProgressPercent = Math.min(
    100,
    Math.round((discoveredSubsets.length / totalExpectedSubsets) * 100)
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto font-body">
      {/* Studio Grid: Left Visual Stage (7 cols), Right Control Hub (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ====================================================================
         * LEFT COLUMN (7 COLS): VISUAL STAGE & PLAYBACK TELEMETRY
         * ==================================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visualizer Stage */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 backdrop-blur-xl shadow-sm dark:shadow-xl relative overflow-hidden flex flex-col gap-4">
            {/* Top Stage Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                  <Activity className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground font-mono flex items-center gap-1.5">
                    <span>Backtracking Studio</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground uppercase">
                      {activeMode === "n-queens" ? "N-Queens" : "Subsets"}
                    </span>
                  </h3>
                </div>
              </div>

              {/* Progress Step Counter */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-muted-foreground">Step</span>
                <span className="px-2 py-0.5 rounded-md bg-secondary font-bold text-foreground border border-border">
                  {currentStepIndex + 1} / {Math.max(steps.length, 1)}
                </span>
              </div>
            </div>

            {/* Visual Representation Stage */}
            <div className="min-h-[280px] sm:min-h-[340px] flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl bg-secondary/30 border border-border/70 relative overflow-hidden">
              {currentStep && (
                <>
                  {/* ============ MODE 1: N-QUEENS BOARD ============ */}
                  {activeMode === "n-queens" && board && boardSize && (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                      {/* Constraint Legend */}
                      <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400" />
                          <span className="text-emerald-400 font-bold">Placed Queen</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-500" />
                          <span className="text-rose-400 font-bold">Conflict Cell</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-400" />
                          <span className="text-amber-400 font-bold">Trial Cell</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-card border border-border" />
                          <span className="text-muted-foreground font-bold">Empty Slot</span>
                        </div>
                      </div>

                      {/* N×N Board */}
                      <div className="grid gap-0.5 p-1 border border-border rounded-xl bg-secondary/40 shadow-inner">
                        {board.map((row, r) =>
                          row.map((cell, c) => {
                            const isQueen = cell === 1;
                            const isConflict = conflictCells.has(`${r},${c}`);
                            const isTrial = isCurrentQueen === `${r},${c}` && !isQueen;
                            const cellClassName = isQueen
                              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/40 scale-110"
                              : isConflict
                              ? "bg-rose-500/30 text-rose-400 border-rose-500/50 animate-pulse"
                              : isTrial
                              ? "bg-amber-500/30 text-amber-400 border-amber-400 shadow-md shadow-amber-500/30 scale-105"
                              : "bg-card text-foreground border-border/70";
                            return (
                              <div
                                key={`${r}-${c}`}
                                className={`aspect-square min-w-[38px] sm:min-w-[46px] rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 relative ${cellClassName}`}
                              >
                                {isQueen ? "♛" : isTrial ? "?" : ""}
                                <span className="absolute top-0.5 left-1 text-[7px] text-muted-foreground/60 font-mono">
                                  [{r},{c}]
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Active Placement / Backtrack Banner */}
                      {currentStep.col !== undefined && currentStep.row !== undefined && (
                        <div
                          className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center justify-between w-full ${bannerClassName}`}
                        >
                          <span className="flex items-center gap-1.5">
                            {currentStep.status === "valid" && <CheckCircle2 className="w-3 h-3" />}
                            {currentStep.status === "conflict" && (
                              <Crown className="w-3 h-3 text-rose-400" />
                            )}
                            {currentStep.status === "backtracking" && (
                              <RotateCcw className="w-3 h-3 text-amber-400" />
                            )}
                            <span className="font-bold">
                              {currentStep.status === "valid"
                                ? `Place Queen at (${currentStep.row}, ${currentStep.col})`
                                : currentStep.status === "conflict"
                                ? `Conflict at (${currentStep.row}, ${currentStep.col})`
                                : currentStep.status === "backtracking"
                                ? `Backtrack from (${currentStep.row}, ${currentStep.col})`
                                : ""}
                            </span>
                          </span>
                          <span className="text-[9px] text-muted-foreground/70">
                            {currentStep.validColumns?.length
                              ? `Valid columns left: ${currentStep.validColumns.join(", ")}`
                              : ""}
                          </span>
                        </div>
                      )}

                      {/* Solution Found Banner */}
                      {currentStep.status === "solved" && (
                        <div className="px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 font-bold text-xs font-mono flex items-center gap-2 animate-pulse">
                          <Sparkles className="w-4 h-4" />
                          <span>Solution Found — {queens.length} queens placed, zero conflicts!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============ MODE 2: SUBSETS DECISION TREE ============ */}
                  {activeMode === "subsets" && (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                      {/* Tree Legend & View Header */}
                      <div className="flex flex-wrap items-center justify-between w-full px-1 text-[10px] font-mono border-b border-border/50 pb-2">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-3.5 h-3.5 text-fuchsia-400" />
                          <span className="font-bold text-foreground">
                            State-Space Binary Decision Tree
                          </span>
                          <span className="text-muted-foreground/70">
                            ({preset.set?.length ?? 3} levels, {totalExpectedSubsets} leaves)
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-emerald-400 font-bold">Left: Include (+)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span className="text-cyan-400 font-bold">Right: Exclude (-)</span>
                          </div>
                        </div>
                      </div>

                      {/* SVG Decision Tree Stage */}
                      <div className="w-full overflow-x-auto pb-1">
                        <svg
                          viewBox="0 0 700 215"
                          className="w-full min-w-[560px] h-auto max-h-[215px] select-none"
                        >
                          <defs>
                            <filter
                              id="node-glow"
                              x="-25%"
                              y="-25%"
                              width="150%"
                              height="150%"
                            >
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Level Depth Background Labels */}
                          <g className="font-mono text-[8px] fill-muted-foreground/40 font-bold">
                            <text x="6" y="29">
                              Depth 0
                            </text>
                            <text x="6" y="82">
                              Depth 1
                            </text>
                            <text x="6" y="135">
                              Depth 2
                            </text>
                            <text x="6" y="190">
                              Leaves
                            </text>
                          </g>

                          {/* Tree Edges */}
                          {treeData.edges.map((edge, idx) => {
                            const isEdgeOnPath =
                              isNodeOnActivePath(edge.to) &&
                              edge.to.path.length <= currentDecisionPath.length;
                            const mx = (edge.from.x + edge.to.x) / 2;
                            const my = (edge.from.y + edge.to.y) / 2;
                            const toOffsetY =
                              edge.to.depth === treeData.elements.length ? 12 : 12;
                            const pathD = `M ${edge.from.x} ${edge.from.y + 12} C ${
                              edge.from.x
                            } ${(edge.from.y + edge.to.y) / 2}, ${edge.to.x} ${
                              (edge.from.y + edge.to.y) / 2
                            }, ${edge.to.x} ${edge.to.y - toOffsetY}`;

                            return (
                              <g key={`edge-${edge.to.id}-${idx}`}>
                                <path
                                  d={pathD}
                                  fill="none"
                                  className={`transition-all duration-300 ${
                                    isEdgeOnPath
                                      ? "stroke-fuchsia-500 stroke-[2.5px] filter drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]"
                                      : "stroke-border/70 stroke-[1.2px]"
                                  }`}
                                />
                                {/* Branch Label Badge (+A, -A, etc.) */}
                                <rect
                                  x={mx - 9}
                                  y={my - 6}
                                  width="18"
                                  height="12"
                                  rx="3"
                                  className={
                                    isEdgeOnPath
                                      ? edge.isLeft
                                        ? "fill-emerald-500/25 stroke-emerald-400 stroke-1"
                                        : "fill-cyan-500/25 stroke-cyan-400 stroke-1"
                                      : "fill-card/90 stroke-border/70 stroke-1"
                                  }
                                />
                                <text
                                  x={mx}
                                  y={my + 3}
                                  textAnchor="middle"
                                  className={`font-mono text-[7px] font-bold ${
                                    isEdgeOnPath
                                      ? edge.isLeft
                                        ? "fill-emerald-400"
                                        : "fill-cyan-300"
                                      : "fill-muted-foreground/75"
                                  }`}
                                >
                                  {edge.label}
                                </text>
                              </g>
                            );
                          })}

                          {/* Tree Nodes */}
                          {treeData.nodes.map((node) => {
                            const isCur = isCurrentActiveNode(node);
                            const isOnPath = isNodeOnActivePath(node);
                            const isLeaf = node.depth === treeData.elements.length;
                            const isFound = isLeaf && isLeafDiscovered(node);

                            if (isLeaf) {
                              return (
                                <g key={node.id} className="transition-all duration-300">
                                  {isCur && (
                                    <rect
                                      x={node.x - 33}
                                      y={node.y - 14}
                                      width="66"
                                      height="26"
                                      rx="7"
                                      className="fill-none stroke-fuchsia-400 stroke-2 animate-pulse filter drop-shadow-[0_0_6px_rgba(236,72,153,0.9)]"
                                    />
                                  )}
                                  <rect
                                    x={node.x - 31}
                                    y={node.y - 12}
                                    width="62"
                                    height="22"
                                    rx="5"
                                    className={`stroke transition-all duration-300 ${
                                      isCur
                                        ? "fill-fuchsia-500/30 stroke-fuchsia-400"
                                        : isFound
                                        ? "fill-emerald-500/20 stroke-emerald-500"
                                        : "fill-card/85 stroke-border/80"
                                    }`}
                                  />
                                  <text
                                    x={node.x}
                                    y={node.y + 3}
                                    textAnchor="middle"
                                    className={`font-mono text-[8px] font-bold select-none ${
                                      isCur
                                        ? "fill-fuchsia-300 font-extrabold"
                                        : isFound
                                        ? "fill-emerald-400 font-bold"
                                        : "fill-muted-foreground/60"
                                    }`}
                                  >
                                    {isFound ? `✓ ${node.label}` : node.label}
                                  </text>
                                </g>
                              );
                            }

                            return (
                              <g key={node.id} className="transition-all duration-300">
                                {isCur && (
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="15"
                                    className="fill-none stroke-fuchsia-400 stroke-2 animate-ping opacity-60"
                                  />
                                )}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="11"
                                  className={`stroke transition-all duration-300 ${
                                    isCur
                                      ? "fill-fuchsia-500/30 stroke-fuchsia-400 shadow-md shadow-fuchsia-500/50"
                                      : isOnPath
                                      ? "fill-primary/20 stroke-primary/80"
                                      : "fill-card stroke-border/80"
                                  }`}
                                />
                                <text
                                  x={node.x}
                                  y={node.y + 3}
                                  textAnchor="middle"
                                  className={`font-mono text-[7px] font-bold select-none ${
                                    isCur
                                      ? "fill-fuchsia-300"
                                      : isOnPath
                                      ? "fill-foreground"
                                      : "fill-muted-foreground/70"
                                  }`}
                                >
                                  {node.label}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Element Decision Strip */}
                      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full pt-1">
                        {treeData.elements.map((el, i) => {
                          const frame = currentStep.callStack?.find((f) => f.index === i);
                          const isCurrent =
                            currentStep.index === i && currentStep.choice !== "backtrack";
                          const isIncluded = frame?.decision === "include";
                          const isExcluded = frame?.decision === "exclude";

                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono transition-all duration-300 ${
                                isCurrent
                                  ? "bg-amber-500/20 border-amber-400 text-amber-400 shadow-sm shadow-amber-500/20 scale-105"
                                  : isIncluded
                                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                                  : isExcluded
                                  ? "bg-secondary/40 border-border/70 text-muted-foreground/60 line-through"
                                  : "bg-secondary/20 border-border/60 text-muted-foreground"
                              }`}
                            >
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-background/70 border border-border">
                                {el}
                              </span>
                              <div className="flex flex-col text-[9px] leading-tight">
                                <span className="text-muted-foreground/80 text-[7px]">
                                  Index {i}
                                </span>
                                <span className="font-bold">
                                  {isCurrent
                                    ? "DECIDING..."
                                    : isIncluded
                                    ? "+ INCLUDED"
                                    : isExcluded
                                    ? "- EXCLUDED"
                                    : "PENDING"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Live Accumulator Shelf */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-border/80 bg-card/70 w-full font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-[11px] font-semibold">
                            Active Subset Buffer:
                          </span>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 font-bold text-xs">
                            <span>{"{"}</span>
                            {currentStep.subset && currentStep.subset.length > 0 ? (
                              currentStep.subset.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300"
                                >
                                  {String(s)}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted-foreground/70 italic text-[11px]">
                                ∅ (Empty Set)
                              </span>
                            )}
                            <span>{"}"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-[10px]">Action:</span>
                          <span
                            className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${
                              currentStep.choice === "include"
                                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                                : currentStep.choice === "exclude"
                                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400"
                                : currentStep.choice === "backtrack"
                                ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                                : currentStep.choice === "leaf"
                                ? "bg-purple-500/20 border-purple-500/40 text-purple-300 animate-pulse"
                                : "bg-secondary border-border text-muted-foreground"
                            }`}
                          >
                            {currentStep.choice === "include" &&
                              `+ INCLUDE '${currentStep.element}'`}
                            {currentStep.choice === "exclude" &&
                              `- EXCLUDE '${currentStep.element}'`}
                            {currentStep.choice === "backtrack" && `↩️ UNDO / POP`}
                            {currentStep.choice === "leaf" && `🎯 LEAF RECORDED`}
                            {currentStep.choice === "start" && `🚀 READY`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Live Step Explanation Banner */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/40 text-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse shrink-0" />
                <span>{currentStep?.explanation || "Ready to execute."}</span>
              </div>
              <div className="text-[11px] font-mono text-fuchsia-600 dark:text-fuchsia-400">
                {currentStep?.invariantNote}
              </div>
            </div>

            {/* Transport Playback Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepPrev}
                  disabled={currentStepIndex === 0}
                  className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>

                <button
                  onClick={togglePlay}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-fuchsia-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{currentStepIndex >= steps.length - 1 ? "Replay" : "Play"}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStepNext}
                  disabled={currentStepIndex >= steps.length - 1}
                  className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 transition-all cursor-pointer"
                  title="Reset Backtracking"
                >
                  <RotateCcw className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-muted-foreground">Speed:</span>
                <input
                  type="range"
                  min="200"
                  max="1400"
                  step="50"
                  value={1550 - speed}
                  onChange={(e) => setSpeed(1550 - Number(e.target.value))}
                  className="w-24 sm:w-28 accent-fuchsia-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
         * RIGHT COLUMN (5 COLS): INTERACTIVE CONTROLS, CALL STACK & INVARIANTS
         * ==================================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Mode / Preset Selector Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
              <SlidersHorizontal className="w-4 h-4 text-fuchsia-400" />
              <span>Select Problem Pattern</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: "n-queens-4", label: "N-Queens 4×4", icon: LayoutGrid },
                { id: "n-queens-8", label: "N-Queens 8×8", icon: Crown },
                { id: "subsets-abc", label: "Subsets {A,B,C}", icon: Activity },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedPresetId === item.id;
                const btnClassName = isSelected
                  ? "bg-fuchsia-500/15 border-fuchsia-500/50 text-fuchsia-400 shadow-sm"
                  : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary";
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePresetChange(item.id)}
                    className={`p-2 rounded-xl border text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${btnClassName}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============ SUBSETS SPECIFIC PANELS ============ */}
          {activeMode === "subsets" && (
            <>
              {/* Discovered Power Set Gallery Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2 text-foreground font-bold">
                    <Boxes className="w-4 h-4 text-emerald-400" />
                    <span>Discovered Power Set</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                    {discoveredSubsets.length} / {totalExpectedSubsets} ({subsetsProgressPercent}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${subsetsProgressPercent}%` }}
                  />
                </div>

                {/* Grid of Discovered Subsets */}
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {discoveredSubsets.map((sub, idx) => {
                    const isLatest =
                      idx === discoveredSubsets.length - 1 && currentStep?.choice === "leaf";
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border font-mono text-[11px] flex items-center justify-between transition-all duration-300 ${
                          isLatest
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm animate-pulse"
                            : "bg-secondary/40 border-border text-foreground"
                        }`}
                      >
                        <span className="text-[9px] text-muted-foreground font-mono">
                          #{idx + 1}
                        </span>
                        <span className="font-bold">
                          {sub.length > 0 ? `{${sub.join(", ")}}` : "∅"}
                        </span>
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                    );
                  })}
                  {discoveredSubsets.length === 0 && (
                    <div className="col-span-2 py-3 text-center text-muted-foreground/60 text-[11px] italic">
                      Explore down to leaf nodes to collect subsets...
                    </div>
                  )}
                </div>
              </div>

              {/* Recursion Call Stack Depth Card */}
              <div className="p-4 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-2.5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-foreground font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Recursion Call Stack</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Depth: {currentStep?.callStack?.length ?? 0} / {treeData.elements.length}
                  </span>
                </div>

                {currentStep?.callStack && currentStep.callStack.length > 0 ? (
                  <div className="flex flex-col-reverse gap-1">
                    {currentStep.callStack.map((frame, idx) => (
                      <div
                        key={idx}
                        className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-[11px] ${
                          idx === currentStep.callStack!.length - 1
                            ? "bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300 font-bold"
                            : "bg-secondary/40 border-border/70 text-muted-foreground"
                        }`}
                      >
                        <span>
                          subsets(idx={frame.index}) → &apos;{String(frame.element)}&apos;
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                            frame.decision === "include"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : frame.decision === "exclude"
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "bg-background/60 text-muted-foreground"
                          }`}
                        >
                          {frame.decision}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground/60 text-[11px] italic py-1">
                    Stack is at root level (Depth 0).
                  </span>
                )}
              </div>
            </>
          )}

          {/* Core Backtracking Invariants Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-foreground font-bold border-b border-border/60 pb-2.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>
                {activeMode === "subsets"
                  ? "Subsets Backtracking Invariants"
                  : "Core Backtracking Invariants"}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-[11px] leading-relaxed">
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                <span className="text-emerald-400 font-bold">1. Choose → Explore → Undo:</span>
                <span className="text-muted-foreground">
                  At each decision node, make a choice (include / place), recurse deeper, and when
                  done, <strong className="text-foreground">undo the choice</strong> (pop element /
                  remove queen) before trying the next alternative.
                </span>
              </div>

              {activeMode === "subsets" ? (
                <>
                  <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                    <span className="text-cyan-400 font-bold">
                      2. Binary Include / Exclude Branching:
                    </span>
                    <span className="text-muted-foreground">
                      Each element splits into 2 discrete branches: Left includes the element in the
                      accumulated subset; Right skips it. Both branches are explored depth-first.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                    <span className="text-amber-400 font-bold">3. Power Set Size O(2ⁿ):</span>
                    <span className="text-muted-foreground">
                      A set of <code className="text-foreground">n</code> elements yields exactly{" "}
                      <code className="text-foreground">2ⁿ</code> leaves. For{" "}
                      <code className="text-foreground">n=3</code>,{" "}
                      <code className="text-foreground">2³ = 8</code> unique subsets are generated.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                    <span className="text-purple-400 font-bold">
                      4. Recursion Stack Depth O(n):
                    </span>
                    <span className="text-muted-foreground">
                      Bounded by the input set length — at most{" "}
                      <code className="text-foreground">n</code> call frames are active
                      simultaneously on the recursion stack.
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                    <span className="text-cyan-400 font-bold">2. Constraint Pruning:</span>
                    <span className="text-muted-foreground">
                      A placement is rejected immediately if it shares a column or diagonal (
                      <code className="text-foreground">|Δrow| === |Δcol|</code>) with any existing
                      queen. This prunes entire subtrees without exploring them.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                    <span className="text-amber-400 font-bold">3. Factorial Worst Case:</span>
                    <span className="text-muted-foreground">
                      N-Queens explores up to <code className="text-foreground">O(N!)</code>{" "}
                      placements. Constraint pruning dramatically reduces the average case.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                    <span className="text-purple-400 font-bold">4. Stack Depth O(N):</span>
                    <span className="text-muted-foreground">
                      Bounded by board dimension — exactly one queen placed per row, yielding at
                      most <code className="text-foreground">N</code> stack frames.
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
