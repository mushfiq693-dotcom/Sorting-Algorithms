"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  HardDrive,
  Layers,
  Sparkles,
  Sliders,
  Cpu,
  RotateCcw,
  Play,
  Pause,
  StepForward,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ArrowDown,
  Box,
} from "lucide-react";

export type SpaceAllocationMode =
  | "in-place"
  | "recursion-tree"
  | "dynamic-buffer"
  | "linear-recursion"
  | "matrix-grid";

interface SpaceModeProfile {
  id: SpaceAllocationMode;
  name: string;
  complexity: string;
  category: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  maxN: number;
  defaultN: number;
  auxiliaryFormula: (n: number) => number;
  formulaStr: string;
  codeSnippet: string;
}

const SPACE_MODE_PROFILES: Record<SpaceAllocationMode, SpaceModeProfile> = {
  "in-place": {
    id: "in-place",
    name: "In-Place Scalar Mutation",
    complexity: "O(1) Auxiliary",
    category: "Optimal Memory",
    description: "Modifies data directly in the input buffer using a few scalar pointer indices. Zero extra heap or recursive frames allocated.",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    maxN: 16,
    defaultN: 8,
    auxiliaryFormula: () => 1,
    formulaStr: "S(n) = 1 slot (O(1))",
    codeSnippet: `void reverseInPlace(vector<int>& arr) {
    int left = 0, right = (int)arr.size() - 1;
    while (left < right) {
        swap(arr[left++], arr[right--]); // Uses single temp int
    }
}`,
  },
  "recursion-tree": {
    id: "recursion-tree",
    name: "Divide & Conquer Call Stack",
    complexity: "O(log n) Stack",
    category: "Balanced Tree",
    description: "Binary recursion (like Merge Sort or Quick Sort). The call stack depth never exceeds the height of the tree: ⌈log₂ n⌉ frames.",
    badgeBg: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-400",
    maxN: 16,
    defaultN: 8,
    auxiliaryFormula: (n) => Math.floor(Math.log2(Math.max(1, n))) + 1,
    formulaStr: "S(n) = ⌊log₂ n⌋ + 1 frames",
    codeSnippet: `void divide(int low, int high) {
    if (low >= high) return;
    int mid = low + (high - low) / 2;
    divide(low, mid);     // Max stack depth = log2(n)
    divide(mid + 1, high);
}`,
  },
  "dynamic-buffer": {
    id: "dynamic-buffer",
    name: "Linear Auxiliary Vector",
    complexity: "O(n) Heap Buffer",
    category: "Extra Buffer",
    description: "Allocates a new heap array or temporary holding buffer of size n (e.g. Merge Sort merge step or counting array).",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-400",
    maxN: 16,
    defaultN: 8,
    auxiliaryFormula: (n) => n,
    formulaStr: "S(n) = n heap elements",
    codeSnippet: `vector<int> duplicateBuffer(const vector<int>& arr) {
    vector<int> temp(arr.size());
    for (size_t i = 0; i < arr.size(); i++) {
        temp[i] = arr[i]; // Consumes n auxiliary integers
    }
    return temp;
}`,
  },
  "linear-recursion": {
    id: "linear-recursion",
    name: "Linear Call Stack Chain",
    complexity: "O(n) Stack Frames",
    category: "Deep Recursion",
    description: "Naive linear recursion (e.g. countdown or unoptimized factorial). Each step adds an active activation frame on the CPU call stack.",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
    maxN: 12,
    defaultN: 6,
    auxiliaryFormula: (n) => n,
    formulaStr: "S(n) = n call stack frames",
    codeSnippet: `int factorial(int n) {
    if (n <= 1) return 1;
    // Pushes n activation frames onto call stack
    return n * factorial(n - 1);
}`,
  },
  "matrix-grid": {
    id: "matrix-grid",
    name: "2D Matrix / Grid Space",
    complexity: "O(n²) Matrix Heap",
    category: "Quadratic Memory",
    description: "Dynamic programming 2D tables or graph adjacency matrices. Allocates an n × n grid of cells.",
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/30",
    badgeText: "text-rose-400",
    maxN: 8,
    defaultN: 4,
    auxiliaryFormula: (n) => n * n,
    formulaStr: "S(n) = n × n = n² cells",
    codeSnippet: `vector<vector<int>> createGrid(int n) {
    // Allocates n x n contiguous heap memory
    return vector<vector<int>>(n, vector<int>(n, 0));
}`,
  },
};

export function SpaceComplexityVisualizer() {
  const [selectedMode, setSelectedMode] = useState<SpaceAllocationMode>("in-place");
  const profile = SPACE_MODE_PROFILES[selectedMode];

  const [n, setN] = useState<number>(profile.defaultN);
  const [activeFrameCount, setActiveFrameCount] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(400);

  const targetAuxiliarySlots = useMemo(() => profile.auxiliaryFormula(n), [profile, n]);

  // Adjust n when mode changes
  useEffect(() => {
    if (n > profile.maxN) {
      setN(profile.maxN);
    }
    setActiveFrameCount(0);
    setIsPlaying(false);
  }, [selectedMode]);

  // Reset when n changes
  useEffect(() => {
    setActiveFrameCount(0);
    setIsPlaying(false);
  }, [n]);

  // Animation Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveFrameCount((prev) => {
          if (prev >= targetAuxiliarySlots) {
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
  }, [isPlaying, speed, targetAuxiliarySlots]);

  const handlePlayToggle = () => {
    if (activeFrameCount >= targetAuxiliarySlots) {
      setActiveFrameCount(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (activeFrameCount < targetAuxiliarySlots) {
      setActiveFrameCount((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveFrameCount(0);
  };

  // Stack Frame data
  const stackFrames = useMemo(() => {
    const isStackType = selectedMode === "recursion-tree" || selectedMode === "linear-recursion";
    if (!isStackType) return [];

    const frames = [];
    for (let i = 1; i <= activeFrameCount; i++) {
      frames.push({
        id: i,
        fnName: selectedMode === "recursion-tree" ? `divide(n=${Math.round(n / Math.pow(2, i - 1))})` : `factorial(${n - i + 1})`,
        memAddr: `0x7ffee${(800 + i * 16).toString(16)}`,
        sizeBytes: "64 Bytes",
      });
    }
    return frames;
  }, [selectedMode, activeFrameCount, n]);

  // Heap Memory Cells
  const heapCells = useMemo(() => {
    const isHeapType = selectedMode === "dynamic-buffer" || selectedMode === "matrix-grid" || selectedMode === "in-place";
    if (!isHeapType) return [];

    const cells = [];
    for (let i = 1; i <= targetAuxiliarySlots; i++) {
      cells.push({
        id: i,
        isAllocated: i <= activeFrameCount,
        address: `0x60000${(100 + i * 4).toString(16)}`,
      });
    }
    return cells;
  }, [selectedMode, targetAuxiliarySlots, activeFrameCount]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto" suppressHydrationWarning>
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual Allocation Stage Canvas */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col min-h-[360px] relative overflow-hidden shadow-xs">
            {/* Header Indicators */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
                <HardDrive className="h-4 w-4" />
                <span>Memory Allocation Canvas ({profile.name})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">Formula:</span>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-secondary/80 px-2 py-0.5 rounded border border-border">
                  {profile.formulaStr}
                </span>
              </div>
            </div>

            {/* Stage Body */}
            <div className="flex-1 flex flex-col justify-center space-y-3 py-2">
              {selectedMode === "recursion-tree" || selectedMode === "linear-recursion" ? (
                /* Stack Frame Call Stack Visualizer */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Call Stack Activation Frames (Peak Depth = {targetAuxiliarySlots})</span>
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                      {activeFrameCount} Active Frames
                    </span>
                  </div>

                  <div className="flex flex-col-reverse gap-1.5 min-h-[200px] p-3 rounded-xl border border-border bg-secondary/20 max-h-56 overflow-y-auto">
                    {stackFrames.length === 0 ? (
                      <div className="text-center py-12 text-xs font-mono text-muted-foreground">
                        Call stack idle. Click &ldquo;Allocate Memory&rdquo; to simulate recursive function calls.
                      </div>
                    ) : (
                      stackFrames.map((frame, idx) => (
                        <motion.div
                          key={frame.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-2 rounded-lg border flex items-center justify-between text-xs font-mono ${
                            idx === stackFrames.length - 1
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-600 dark:text-cyan-300 shadow-xs font-bold"
                              : "bg-secondary/60 border-border text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded bg-card text-[10px] border border-border">
                              #{frame.id}
                            </span>
                            <span className="font-bold">{frame.fnName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{frame.memAddr}</span>
                            <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">{frame.sizeBytes}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Heap Dynamic Memory Buffer Cells Grid */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Box className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Heap Memory Buffer ({heapCells.length} Total Slots)</span>
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                      {activeFrameCount} / {targetAuxiliarySlots} Allocated
                    </span>
                  </div>

                  <div className={`grid gap-1.5 p-3 rounded-xl border border-border bg-secondary/20 min-h-[200px] items-center ${
                    selectedMode === "matrix-grid" ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8" : "grid-cols-4 sm:grid-cols-8 md:grid-cols-12"
                  }`}>
                    {heapCells.map((cell) => (
                      <motion.div
                        key={cell.id}
                        initial={{ scale: 0.8 }}
                        animate={{
                          scale: cell.isAllocated ? 1.05 : 1,
                          backgroundColor: cell.isAllocated ? "rgba(6, 182, 212, 0.2)" : "rgba(100, 116, 139, 0.1)",
                          borderColor: cell.isAllocated ? "#06b6d4" : "rgba(100, 116, 139, 0.2)",
                        }}
                        className={`p-1.5 rounded-lg border flex flex-col items-center justify-center text-center font-mono transition-all ${
                          cell.isAllocated ? "text-cyan-600 dark:text-cyan-300 shadow-xs" : "text-muted-foreground/40"
                        }`}
                      >
                        <span className="text-[11px] font-bold">Slot #{cell.id}</span>
                        <span className="text-[8px] text-muted-foreground">{cell.address}</span>
                        <span className="text-[8px] font-bold text-emerald-500 mt-0.5">4B</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Memory Footprint Stats Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono pt-1 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Box className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Input Buffer: <strong className="text-foreground">{n} items ({n * 4} B)</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
                  <span>Auxiliary Efficiency: <strong className="text-foreground">{selectedMode === "in-place" ? "100% In-Place" : `${(targetAuxiliarySlots / n).toFixed(1)}× Extra`}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Operation Status & Live Execution Telemetry */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2.5 sm:p-3 backdrop-blur-xl shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-cyan-400" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
                  Execution Telemetry
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <div className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-cyan-600 dark:text-cyan-300">
                  <span className="text-[10px] text-muted-foreground">Space:</span>
                  <strong className="font-bold">{profile.complexity}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-300">
                  <span className="text-[10px] text-muted-foreground">n:</span>
                  <strong className="font-bold">{n}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-600 dark:text-emerald-300">
                  <span className="text-[10px] text-muted-foreground">Aux Slots:</span>
                  <strong className="font-bold">{activeFrameCount}/{targetAuxiliarySlots}</strong>
                </div>
              </div>
            </div>

            {/* Dynamic Explanation Text Box */}
            <div className="rounded-xl border border-border/80 bg-secondary/60 px-3 py-1.5 min-h-[36px] flex items-center shadow-inner text-foreground">
              <p className="text-xs font-medium font-mono flex items-center gap-2 truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
                <span className="truncate">{profile.description}</span>
              </p>
            </div>

          </div>

          {/* Studio Control Bar */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/90 shadow-xs backdrop-blur-xl space-y-2.5">
            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pb-2 border-b border-border/70">
              {(Object.keys(SPACE_MODE_PROFILES) as SpaceAllocationMode[]).map((modeKey) => {
                const p = SPACE_MODE_PROFILES[modeKey];
                const isSelected = selectedMode === modeKey;

                return (
                  <button
                    key={modeKey}
                    onClick={() => setSelectedMode(modeKey)}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-500/80 text-cyan-600 dark:text-cyan-400 font-bold shadow-xs"
                        : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">{p.complexity}</span>
                    <span className="text-[8px] font-sans text-muted-foreground truncate max-w-full">{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Size & Stepper Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Size Slider */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-xs font-mono text-muted-foreground font-semibold flex items-center gap-1">
                  <Sliders className="h-3 w-3 text-cyan-500" />
                  <span>Size (n):</span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={profile.maxN}
                  value={n}
                  onChange={(e) => setN(parseInt(e.target.value, 10))}
                  className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-secondary px-2 py-0.5 rounded border border-border">
                  {n}
                </span>
              </div>

              {/* Playback Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePlayToggle}
                  className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:opacity-95 transition-all cursor-pointer shadow-xs"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
                  <span>{isPlaying ? "Pause" : activeFrameCount >= targetAuxiliarySlots ? "Restart" : "Allocate Memory"}</span>
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={isPlaying || activeFrameCount >= targetAuxiliarySlots}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 disabled:opacity-40 cursor-pointer"
                >
                  <StepForward className="h-3 w-3 text-cyan-500" />
                  <span>Step</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky C++ Code Studio & Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[270px] sm:h-[290px] lg:h-[310px]">
            <CodeViewer
              code={profile.codeSnippet}
              algorithmName={`SpaceComplexity_${profile.id.replace(/[^a-zA-Z0-9]/g, "")}`}
              activeLineNumber={isPlaying ? 3 : null}
            />
          </div>

          {/* Allocation Pattern Table */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-500" />
              <span>Memory Pattern Breakdown (n = {n})</span>
            </h3>

            <div className="space-y-1 font-mono text-xs">
              {(Object.keys(SPACE_MODE_PROFILES) as SpaceAllocationMode[]).map((modeKey) => {
                const p = SPACE_MODE_PROFILES[modeKey];
                const slots = p.auxiliaryFormula(n);
                const isCurrent = selectedMode === modeKey;

                return (
                  <div
                    key={modeKey}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-all ${
                      isCurrent
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-bold"
                        : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-20 font-bold">{p.complexity.split(" ")[0]}</span>
                      <span className="text-[10px] text-muted-foreground font-sans hidden sm:inline">{p.name}</span>
                    </div>
                    <span className="font-bold">
                      {slots * 4} Bytes ({slots} slots)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auxiliary Space Invariant card */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-500" />
              <span>Auxiliary Space vs. Total Space Invariant</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
              In algorithm analysis, <strong className="text-foreground">Auxiliary Space</strong> specifically isolates the <em>extra working memory</em> allocated by the algorithm itself, ignoring the input array storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
