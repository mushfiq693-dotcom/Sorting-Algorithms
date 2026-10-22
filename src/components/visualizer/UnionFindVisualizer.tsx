"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Share2,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Link2,
  Search,
  Network,
  Layers,
  Settings2,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  UnionFindEngine,
  UFStep,
  UFPreset,
  UF_PALETTE,
  UF_PRESET_SINGLETONS,
  UF_PRESET_NETWORK,
  UF_PRESET_CYCLE_DETECTION,
  UF_PRESET_DEGENERATE_CHAIN,
} from "@/algorithms/union-find";

export function UnionFindVisualizer() {
  const [nodeCount, setNodeCount] = useState<number>(8);
  const [pathCompression, setPathCompression] = useState<boolean>(true);
  const [unionStrategy, setUnionStrategy] = useState<"rank" | "size" | "naive">("rank");

  const [engine] = useState<UnionFindEngine>(
    () => new UnionFindEngine(8, true, "rank")
  );

  const [steps, setSteps] = useState<UFStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(550); // ms per step

  // Controls input state
  const [unionX, setUnionX] = useState<number>(0);
  const [unionY, setUnionY] = useState<number>(1);
  const [findX, setFindX] = useState<number>(0);
  const [connX, setConnX] = useState<number>(0);
  const [connY, setConnY] = useState<number>(2);
  const [activePreset, setActivePreset] = useState<string>("singletons");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync engine settings when toggles change
  useEffect(() => {
    engine.setOptimizations(pathCompression, unionStrategy);
  }, [engine, pathCompression, unionStrategy]);

  // Initial load
  useEffect(() => {
    const initStep = engine.loadPreset(UF_PRESET_SINGLETONS);
    setSteps([initStep]);
    setCurrentStepIdx(0);
    setNodeCount(engine.getNodeCount());
  }, [engine]);

  const currentStep = useMemo<UFStep>(() => {
    if (steps.length === 0 || currentStepIdx >= steps.length) {
      return {
        type: "init",
        description: "Ready",
        parent: engine.getParent(),
        rank: engine.getRank(),
        size: engine.getSize(),
        activeNodes: [],
        comparedRoots: null,
        compressedNodes: [],
        cycleDetected: false,
        componentsCount: engine.getComponentCount(),
        highlightedEdge: null,
        explanation: "Select an operation to begin.",
      };
    }
    return steps[currentStepIdx];
  }, [steps, currentStepIdx, engine]);

  // Compute forest SVG coordinates from current step's parent array
  const forestData = useMemo(() => {
    return engine.computeForestCoordinates(700, 240);
  }, [engine, currentStep.parent]);

  // Group components for the summary shelf
  const componentsList = useMemo(() => {
    const map = new Map<number, number[]>();
    const parentArr = currentStep.parent;
    const n = parentArr.length;

    for (let i = 0; i < n; i++) {
      let r = i;
      while (parentArr[r] !== r) {
        r = parentArr[r];
      }
      if (!map.has(r)) map.set(r, []);
      map.get(r)!.push(i);
    }

    return Array.from(map.entries()).map(([root, members]) => ({
      root,
      members: members.sort((a, b) => a - b),
      color: UF_PALETTE[root % UF_PALETTE.length],
      rank: currentStep.rank[root] || 0,
      size: currentStep.size[root] || members.length,
    }));
  }, [currentStep.parent, currentStep.rank, currentStep.size]);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speed]);

  // Handle Operations
  const handleUnion = () => {
    if (unionX < 0 || unionX >= nodeCount || unionY < 0 || unionY >= nodeCount) return;
    setIsPlaying(false);
    const newSteps = engine.generateUnionSteps(unionX, unionY);
    if (newSteps.length > 0) {
      setSteps(newSteps);
      setCurrentStepIdx(0);
      setIsPlaying(true);

      const last = newSteps[newSteps.length - 1];
      if (!last.cycleDetected) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ["#3b82f6", "#10b981", "#8b5cf6"],
        });
      }
    }
  };

  const handleFind = () => {
    if (findX < 0 || findX >= nodeCount) return;
    setIsPlaying(false);
    const newSteps = engine.generateFindSteps(findX);
    if (newSteps.length > 0) {
      setSteps(newSteps);
      setCurrentStepIdx(0);
      setIsPlaying(true);
    }
  };

  const handleConnected = () => {
    if (connX < 0 || connX >= nodeCount || connY < 0 || connY >= nodeCount) return;
    setIsPlaying(false);
    const newSteps = engine.generateConnectedSteps(connX, connY);
    if (newSteps.length > 0) {
      setSteps(newSteps);
      setCurrentStepIdx(0);
      setIsPlaying(true);
    }
  };

  const handlePresetChange = (presetId: string) => {
    setActivePreset(presetId);
    setIsPlaying(false);

    let targetPreset: UFPreset = UF_PRESET_SINGLETONS;
    if (presetId === "network") targetPreset = UF_PRESET_NETWORK;
    else if (presetId === "cycle") targetPreset = UF_PRESET_CYCLE_DETECTION;
    else if (presetId === "chain") targetPreset = UF_PRESET_DEGENERATE_CHAIN;

    const step = engine.loadPreset(targetPreset);
    setNodeCount(engine.getNodeCount());
    setSteps([step]);
    setCurrentStepIdx(0);

    // Update form pickers to match valid range
    setUnionX(0);
    setUnionY(Math.min(1, engine.getNodeCount() - 1));
    setFindX(0);
    setConnX(0);
    setConnY(Math.min(2, engine.getNodeCount() - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    handlePresetChange(activePreset);
  };

  const handleStepNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleStepPrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto font-body select-text">
      {/* =========================================================================
          TOP CONTROL BAR: Preset Selection & Optimization Toggles
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-foreground tracking-tight">
                  Union-Find (DSU) Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                  Amortized O(α(n))
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Disjoint Set Forest, Path Compression, and Union by Rank / Size
              </p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground mr-1 hidden sm:inline">
              Presets:
            </span>
            <button
              onClick={() => handlePresetChange("singletons")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePreset === "singletons"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              8 Singletons
            </button>
            <button
              onClick={() => handlePresetChange("network")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePreset === "network"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              Subnet Clusters
            </button>
            <button
              onClick={() => handlePresetChange("cycle")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePreset === "cycle"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              Cycle Detection
            </button>
            <button
              onClick={() => handlePresetChange("chain")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activePreset === "chain"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              Worst Skew Chain
            </button>
          </div>
        </div>

        {/* Dynamic Optimization Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-border/60 text-xs font-mono">
          {/* Path Compression Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-secondary/30">
            <span className="flex items-center gap-2 text-foreground font-semibold">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Path Compression:</span>
            </span>
            <button
              onClick={() => setPathCompression(!pathCompression)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                pathCompression
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {pathCompression ? "ON (Flatten O(1))" : "OFF (Naive Chain)"}
            </button>
          </div>

          {/* Union Strategy Selector */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-secondary/30">
            <span className="flex items-center gap-2 text-foreground font-semibold">
              <Layers className="h-3.5 w-3.5 text-purple-500" />
              <span>Union Strategy:</span>
            </span>
            <select
              value={unionStrategy}
              onChange={(e) => setUnionStrategy(e.target.value as any)}
              className="px-2 py-1 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-hidden"
            >
              <option value="rank">Union by Rank</option>
              <option value="size">Union by Size</option>
              <option value="naive">Naive Attachment</option>
            </select>
          </div>

          {/* Live Component Metric */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-secondary/30 sm:col-span-2 lg:col-span-1">
            <span className="flex items-center gap-2 text-foreground font-semibold">
              <Network className="h-3.5 w-3.5 text-cyan-500" />
              <span>Active Sets:</span>
            </span>
            <span className="font-bold text-foreground px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
              {currentStep.componentsCount} Disjoint Components
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STUDIO 7:5 SPLIT GRID
          Left (7 cols): Interactive Tree SVG Canvas, 1D Memory Strips, Transport
          Right (5 cols): Operation Command Hub & Connectedness Inspector
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =====================================================================
            LEFT COLUMN (7 cols): Visual Stage, Array Strips & Playback
            ===================================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Visual Stage */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Disjoint Set Forest (Tree Topology)</span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Nodes: {nodeCount} | Edges: {forestData.edges.length}
              </span>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="w-full h-[250px] sm:h-[280px] rounded-xl border border-border/80 bg-background/70 overflow-hidden relative flex items-center justify-center">
              <svg
                viewBox="0 0 700 240"
                className="w-full h-full select-none"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.06))" }}
              >
                <defs>
                  {/* Arrow markers for directed parent pointers */}
                  <marker
                    id="arrow-default"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                  </marker>
                  <marker
                    id="arrow-compressed"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                  </marker>
                  <marker
                    id="arrow-highlighted"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                  </marker>
                  <marker
                    id="arrow-cycle"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                  </marker>
                </defs>

                {/* Render Edges (Parent pointers pointing up to parent) */}
                {forestData.edges.map((edge) => {
                  const fromNode = forestData.nodes.find((n) => n.id === edge.from);
                  const toNode = forestData.nodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isEdgeHighlighted =
                    currentStep.highlightedEdge &&
                    ((currentStep.highlightedEdge[0] === edge.from &&
                      currentStep.highlightedEdge[1] === edge.to) ||
                      (currentStep.highlightedEdge[1] === edge.from &&
                        currentStep.highlightedEdge[0] === edge.to));

                  const isCompressed = currentStep.compressedNodes.includes(edge.from);
                  const isCycle = currentStep.cycleDetected && isEdgeHighlighted;

                  let strokeColor = "#94a3b8"; // slate-400
                  let strokeWidth = 2;
                  let markerId = "arrow-default";

                  if (isCycle) {
                    strokeColor = "#ef4444";
                    strokeWidth = 3;
                    markerId = "arrow-cycle";
                  } else if (isCompressed) {
                    strokeColor = "#10b981";
                    strokeWidth = 3;
                    markerId = "arrow-compressed";
                  } else if (isEdgeHighlighted) {
                    strokeColor = "#f59e0b";
                    strokeWidth = 3;
                    markerId = "arrow-highlighted";
                  }

                  return (
                    <g key={`edge-${edge.from}-${edge.to}`}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={edge.isCompressed ? "4 3" : undefined}
                        markerEnd={`url(#${markerId})`}
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {forestData.nodes.map((node) => {
                  const isActive = currentStep.activeNodes.includes(node.id);
                  const isCompressed = currentStep.compressedNodes.includes(node.id);
                  const isRoot = node.isRoot;

                  let borderColor = node.color;
                  let bgColor = `${node.color}25`;
                  let textColor = node.color;

                  if (isActive) {
                    borderColor = "#f59e0b"; // amber active
                    bgColor = "rgba(245, 158, 11, 0.35)";
                    textColor = "#f59e0b";
                  } else if (isCompressed) {
                    borderColor = "#10b981"; // emerald compressed
                    bgColor = "rgba(16, 185, 129, 0.35)";
                    textColor = "#10b981";
                  }

                  return (
                    <g
                      key={`node-${node.id}`}
                      className="transition-all duration-300 cursor-pointer"
                      onClick={() => setFindX(node.id)}
                    >
                      {/* Outer pulse circle if active */}
                      {isActive && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={24}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          className="animate-ping opacity-75"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isRoot ? 19 : 16}
                        fill={bgColor}
                        stroke={borderColor}
                        strokeWidth={isRoot ? 3 : 2}
                        className="transition-all duration-300"
                      />

                      {/* Node ID label */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-xs font-mono font-bold select-none"
                      >
                        {node.id}
                      </text>

                      {/* Root badge indicator */}
                      {isRoot && (
                        <text
                          x={node.x}
                          y={node.y - 23}
                          textAnchor="middle"
                          fill={node.color}
                          className="text-[9px] font-mono font-bold select-none uppercase tracking-wide"
                        >
                          ROOT
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 1D Memory Array Strip (Parent & Rank/Size) */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">
                  Physical Memory: parent[] &amp; rank[] Array Strip
                </span>
                <span className="text-[11px] text-muted-foreground">
                  parent[i] == i &rarr; Self Root
                </span>
              </div>

              <div className="grid grid-cols-8 gap-1.5 overflow-x-auto pb-1">
                {Array.from({ length: nodeCount }).map((_, idx) => {
                  const pVal = currentStep.parent[idx];
                  const rVal = currentStep.rank[idx] || 0;
                  const isSelfRoot = pVal === idx;
                  const isActive = currentStep.activeNodes.includes(idx);
                  const isCompressed = currentStep.compressedNodes.includes(idx);
                  const color = UF_PALETTE[pVal % UF_PALETTE.length];

                  return (
                    <div
                      key={`strip-${idx}`}
                      onClick={() => setFindX(idx)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isActive
                          ? "border-amber-500 bg-amber-500/15 shadow-sm"
                          : isCompressed
                          ? "border-emerald-500 bg-emerald-500/15 shadow-sm"
                          : isSelfRoot
                          ? "border-primary/50 bg-secondary/50"
                          : "border-border/60 bg-secondary/20"
                      }`}
                    >
                      <div className="text-[10px] font-mono text-muted-foreground font-bold">
                        [{idx}]
                      </div>
                      <div
                        className="font-mono font-bold text-xs mt-0.5"
                        style={{ color: isSelfRoot ? color : undefined }}
                      >
                        p: {pVal}
                        {isSelfRoot && "*"}
                      </div>
                      <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                        rk: {rVal}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Operation Telemetry */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/40 flex items-start gap-3">
              <div
                className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                  currentStep.cycleDetected
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-500"
                    : "bg-emerald-500/15 border-emerald-500/30 text-emerald-500"
                }`}
              >
                {currentStep.cycleDetected ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span className="font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                    <span>Live Telemetry</span>
                    {currentStep.cycleDetected && (
                      <span className="text-rose-500 font-bold font-mono">
                        [CYCLE DETECTED]
                      </span>
                    )}
                  </span>
                  <span>
                    Step {currentStepIdx + 1} / {Math.max(1, steps.length)}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 mt-1 leading-relaxed">
                  {currentStep.explanation || currentStep.description}
                </p>
              </div>
            </div>

            {/* Playback Transport Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>

                <button
                  onClick={handleStepPrev}
                  disabled={currentStepIdx === 0}
                  className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Step Backward"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  onClick={handleStepNext}
                  disabled={currentStepIdx >= steps.length - 1}
                  className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Step Forward"
                >
                  <SkipForward className="h-4 w-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground cursor-pointer transition-all"
                  title="Reset Scenario"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">Delay:</span>
                <input
                  type="range"
                  min="150"
                  max="1000"
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-24 accent-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                  {speed}ms
                </span>
              </div>
            </div>
          </div>

          {/* Active Disjoint Components Shelf */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
                <Network className="h-4 w-4 text-cyan-500" />
                <span>Connected Components Partition Shelf</span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                {componentsList.length} Sets
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {componentsList.map((comp) => (
                <div
                  key={`comp-${comp.root}`}
                  className="p-2.5 rounded-xl border border-border bg-secondary/30 flex items-center gap-2.5 transition-all hover:bg-secondary/50"
                >
                  <div
                    className="w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center border text-white shadow-xs"
                    style={{ backgroundColor: comp.color, borderColor: comp.color }}
                  >
                    {comp.root}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-foreground font-semibold">
                      &#123;{comp.members.join(", ")}&#125;
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      Size: {comp.size} | Rank: {comp.rank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (5 cols, sticky): Operations Hub & Query Inspector
            ===================================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
          {/* Operation Action Hub */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm space-y-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              <span>Union-Find Operations Hub</span>
            </h4>

            {/* 1. UNION OPERATION FORM */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/30 space-y-3">
              <span className="text-[11px] font-mono font-bold text-foreground flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-blue-500" />
                <span>Union(x, y) — Connect Sets</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-muted-foreground">Element x</label>
                  <select
                    value={unionX}
                    onChange={(e) => setUnionX(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-hidden"
                  >
                    {Array.from({ length: nodeCount }).map((_, i) => (
                      <option key={`ux-${i}`} value={i}>
                        Node {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-muted-foreground">Element y</label>
                  <select
                    value={unionY}
                    onChange={(e) => setUnionY(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-hidden"
                  >
                    {Array.from({ length: nodeCount }).map((_, i) => (
                      <option key={`uy-${i}`} value={i}>
                        Node {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleUnion}
                disabled={unionX === unionY}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 shadow-md shadow-blue-500/20"
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>Merge Sets union({unionX}, {unionY})</span>
              </button>
            </div>

            {/* 2. FIND OPERATION FORM */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/30 space-y-3">
              <span className="text-[11px] font-mono font-bold text-foreground flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-emerald-500" />
                <span>Find(x) — Root Lookup &amp; Compression</span>
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={findX}
                  onChange={(e) => setFindX(Number(e.target.value))}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-hidden"
                >
                  {Array.from({ length: nodeCount }).map((_, i) => (
                    <option key={`fx-${i}`} value={i}>
                      Find Root for Node {i}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleFind}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Execute find({findX})</span>
                </button>
              </div>
            </div>

            {/* 3. CONNECTED QUERY FORM */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/30 space-y-3">
              <span className="text-[11px] font-mono font-bold text-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-purple-500" />
                <span>Connected(x, y) — Query Equivalency</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={connX}
                  onChange={(e) => setConnX(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-hidden"
                >
                  {Array.from({ length: nodeCount }).map((_, i) => (
                    <option key={`cx-${i}`} value={i}>
                      Node {i}
                    </option>
                  ))}
                </select>

                <select
                  value={connY}
                  onChange={(e) => setConnY(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-hidden"
                >
                  {Array.from({ length: nodeCount }).map((_, i) => (
                    <option key={`cy-${i}`} value={i}>
                      Node {i}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleConnected}
                className="w-full py-2 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Check Path: connected({connX}, {connY})</span>
              </button>
            </div>

            {/* Quick Reset Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => handlePresetChange("singletons")}
                className="text-xs font-mono text-muted-foreground hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Reset All to Singletons</span>
              </button>
            </div>
          </div>

          {/* DSU Invariants & Math Formula Card */}
          <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 shadow-sm space-y-3">
            <span className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-emerald-500" />
              <span>Disjoint Set Mathematical Invariants</span>
            </span>

            <div className="space-y-2 text-xs font-mono text-muted-foreground">
              <div className="p-2 rounded-lg bg-secondary/40 border border-border/50">
                <span className="text-foreground font-bold">Root Invariant:</span>
                <p className="text-[11px] mt-0.5">
                  <code className="text-emerald-500 font-bold">parent[x] == x</code> indicates node $x$ is the set representative.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-secondary/40 border border-border/50">
                <span className="text-foreground font-bold">Height Bound:</span>
                <p className="text-[11px] mt-0.5">
                  Union by Rank strictly bounds tree height to <code className="text-purple-500 font-bold">h ≤ ⌊log₂ n⌋</code>.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-secondary/40 border border-border/50">
                <span className="text-foreground font-bold">Ackermann Inverse α(n):</span>
                <p className="text-[11px] mt-0.5">
                  Combined with Path Compression, any sequence of $m$ operations on $n$ elements executes in <code className="text-cyan-500 font-bold">O(m · α(n)) ≈ O(m)</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
