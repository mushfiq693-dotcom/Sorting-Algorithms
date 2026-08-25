"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Activity,
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

  const peakBytes = targetAuxiliarySlots * 4; // 4 bytes per integer

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card/80 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col gap-4 border-b border-border pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                <HardDrive className="h-4 w-4" />
                <span>Memory Footprint & Allocation Engine</span>
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${profile.badgeBg} ${profile.badgeText} border ${profile.badgeBorder}`}>
                {profile.complexity}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-foreground tracking-tight">
              {profile.name} — <span className="font-mono text-cyan-400">{profile.complexity}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
              {profile.description}
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-secondary/40 shrink-0">
            <span className="text-[11px] font-mono font-bold text-muted-foreground px-2">Formula:</span>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-background/80 px-2.5 py-1 rounded-lg border border-border">
              {profile.formulaStr}
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(SPACE_MODE_PROFILES) as SpaceAllocationMode[]).map((modeKey) => {
            const p = SPACE_MODE_PROFILES[modeKey];
            const isSelected = selectedMode === modeKey;

            return (
              <button
                key={modeKey}
                onClick={() => setSelectedMode(modeKey)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-500/80 text-foreground font-bold shadow-md shadow-cyan-500/10 scale-[1.02]"
                    : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                <span className="font-mono text-xs font-bold text-foreground">{p.complexity}</span>
                <span className="text-[9px] font-sans text-muted-foreground mt-0.5 truncate">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Sliders & Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-border bg-secondary/30">
        {/* Input Size N Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-foreground flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-cyan-500" />
              <span>Input Size (n)</span>
            </span>
            <span className="font-mono font-bold text-cyan-400 bg-background px-2 py-0.5 rounded border border-border text-xs">
              n = {n}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={profile.maxN}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>n = 1</span>
            <span>Max for mode: n = {profile.maxN}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePlayToggle}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              <span>{isPlaying ? "Pause" : activeFrameCount >= targetAuxiliarySlots ? "Restart" : "Allocate Memory"}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={isPlaying || activeFrameCount >= targetAuxiliarySlots}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
              title="Single step forward"
            >
              <StepForward className="h-3.5 w-3.5 text-cyan-500" />
              <span>Step</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-95 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[10px] font-mono text-muted-foreground">Speed:</span>
            <input
              type="range"
              min={100}
              max={800}
              step={50}
              value={900 - speed}
              onChange={(e) => setSpeed(900 - parseInt(e.target.value, 10))}
              className="w-20 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Memory Telemetry Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
            Input Array Memory
          </span>
          <div className="text-base sm:text-lg font-mono font-bold text-foreground flex items-center gap-1.5">
            <Box className="h-4 w-4 text-muted-foreground" />
            <span>{n} items ({n * 4} B)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
            Auxiliary Slots Used
          </span>
          <div className="text-base sm:text-lg font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-cyan-500" />
            <span>{activeFrameCount} / {targetAuxiliarySlots}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
            Peak Extra Bytes
          </span>
          <div className="text-base sm:text-lg font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{peakBytes} Bytes</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
            Memory Efficiency
          </span>
          <div className="text-base sm:text-lg font-mono font-bold text-purple-400 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span>{selectedMode === "in-place" ? "100% In-Place" : `${(targetAuxiliarySlots / n).toFixed(1)}× Extra`}</span>
          </div>
        </div>
      </div>

      {/* Main Memory Allocation Stage */}
      <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-4">
        {selectedMode === "recursion-tree" || selectedMode === "linear-recursion" ? (
          /* Stack Frame Call Stack Visualizer */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-cyan-500" />
                <span>Call Stack Activation Frames (Peak Depth = {targetAuxiliarySlots})</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {activeFrameCount} Active Frames
              </span>
            </div>

            <div className="flex flex-col-reverse gap-2 min-h-48 p-4 rounded-xl border border-border bg-background/80 max-h-72 overflow-y-auto">
              {stackFrames.length === 0 ? (
                <div className="text-center py-10 text-xs font-mono text-muted-foreground">
                  Call stack empty. Click &ldquo;Allocate Memory&rdquo; to simulate recursive function calls.
                </div>
              ) : (
                stackFrames.map((frame, idx) => (
                  <motion.div
                    key={frame.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                      idx === stackFrames.length - 1
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold"
                        : "bg-secondary/60 border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-1.5 py-0.5 rounded bg-background text-[10px] border border-border">
                        Frame #{frame.id}
                      </span>
                      <span className="font-bold">{frame.fnName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{frame.memAddr}</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{frame.sizeBytes}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Heap Dynamic Memory Buffer Cells Grid */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5 text-cyan-500" />
                <span>Heap Memory Slots Allocated ({heapCells.length} Total Buffer Cells)</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {activeFrameCount} / {targetAuxiliarySlots} Allocated
              </span>
            </div>

            <div className={`grid gap-2 p-4 rounded-xl border border-border bg-background/80 min-h-48 items-center ${
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
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center font-mono transition-all ${
                    cell.isAllocated ? "text-cyan-300 shadow-sm" : "text-muted-foreground/40"
                  }`}
                >
                  <span className="text-xs font-bold">Slot #{cell.id}</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5">{cell.address}</span>
                  <span className="text-[8px] font-semibold text-emerald-400 mt-0.5">4B</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Synchronized C++ Memory Management Code */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-cyan-500" />
          <span>C++ Memory Allocation Pattern</span>
        </span>
        <pre className="text-xs font-mono text-foreground bg-background/90 p-3.5 rounded-xl border border-border overflow-x-auto leading-relaxed">
          <code>{profile.codeSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
