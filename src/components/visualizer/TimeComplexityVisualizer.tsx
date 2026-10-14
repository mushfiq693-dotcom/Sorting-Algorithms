"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Zap,
  Clock,
  Layers,
  Sparkles,
  Sliders,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export type ComplexityClass = "O(1)" | "O(log n)" | "O(n)" | "O(n log n)" | "O(n^2)" | "O(2^n)";

interface ComplexityProfile {
  id: ComplexityClass;
  name: string;
  category: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  formulaStr: string;
  maxN: number;
  defaultN: number;
  description: string;
  formulaFn: (n: number) => number;
  codeSnippet: string;
}

const COMPLEXITY_PROFILES: Record<ComplexityClass, ComplexityProfile> = {
  "O(1)": {
    id: "O(1)",
    name: "Constant Time",
    category: "Instant",
    color: "emerald",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    formulaStr: "f(n) = 1",
    maxN: 100,
    defaultN: 10,
    description: "Execution time remains strictly constant regardless of how massive the input array n becomes.",
    formulaFn: () => 1,
    codeSnippet: `int getFirst(const vector<int>& arr) {
    if (arr.empty()) return -1;
    return arr[0]; // Exactly 1 operation
}`,
  },
  "O(log n)": {
    id: "O(log n)",
    name: "Logarithmic Time",
    category: "Super Fast",
    color: "cyan",
    badgeBg: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-400",
    formulaStr: "f(n) = ⌊log₂ n⌋ + 1",
    maxN: 64,
    defaultN: 16,
    description: "Search space is halved in every single step (e.g. Binary Search). Scaling n by 1000× adds only ~10 extra steps.",
    formulaFn: (n) => Math.floor(Math.log2(Math.max(1, n))) + 1,
    codeSnippet: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1; // Halves remaining search space
    }
    return -1;
}`,
  },
  "O(n)": {
    id: "O(n)",
    name: "Linear Time",
    category: "Fair & Direct",
    color: "blue",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-400",
    formulaStr: "f(n) = n",
    maxN: 40,
    defaultN: 12,
    description: "Operations scale in direct 1:1 proportion to input size n. Scanning through all elements once.",
    formulaFn: (n) => n,
    codeSnippet: `int findMax(const vector<int>& arr) {
    int maxVal = arr[0];
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] > maxVal) maxVal = arr[i]; // Executes n times
    }
    return maxVal;
}`,
  },
  "O(n log n)": {
    id: "O(n log n)",
    name: "Linearithmic Time",
    category: "Optimal Sorting",
    color: "purple",
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-400",
    formulaStr: "f(n) = n × ⌈log₂ n⌉",
    maxN: 24,
    defaultN: 8,
    description: "The mathematical theoretical lower bound for general comparison-based sorting (Merge Sort, Quick Sort avg).",
    formulaFn: (n) => n * Math.ceil(Math.log2(Math.max(1, n))),
    codeSnippet: `void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(arr, l, mid);     // log2(n) levels
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);      // n work per level
}`,
  },
  "O(n^2)": {
    id: "O(n^2)",
    name: "Quadratic Time",
    category: "Slow & Steep",
    color: "amber",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
    formulaStr: "f(n) = n²",
    maxN: 16,
    defaultN: 6,
    description: "Nested loops comparing every pair. Doubling the input quadruples (4×) the total execution operations.",
    formulaFn: (n) => n * n,
    codeSnippet: `void printAllPairs(const vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            // Nested loop executes n * n times
        }
    }
}`,
  },
  "O(2^n)": {
    id: "O(2^n)",
    name: "Exponential Time",
    category: "Intractable",
    color: "rose",
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/30",
    badgeText: "text-rose-400",
    formulaStr: "f(n) = 2ⁿ",
    maxN: 8,
    defaultN: 5,
    description: "Operations double with every single addition to n. Quickly becomes impossible to compute for n > 40.",
    formulaFn: (n) => Math.pow(2, n),
    codeSnippet: `int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2); // 2 branches per call
}`,
  },
};

export function TimeComplexityVisualizer() {
  const [selectedClass, setSelectedClass] = useState<ComplexityClass>("O(n)");
  const profile = COMPLEXITY_PROFILES[selectedClass];

  const [n, setN] = useState<number>(profile.defaultN);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(300);

  // Total operations needed
  const totalOps = useMemo(() => profile.formulaFn(n), [profile, n]);

  // Adjust n if exceeding profile maxN
  useEffect(() => {
    if (n > profile.maxN) {
      setN(profile.maxN);
    }
    setCurrentStep(0);
    setIsPlaying(false);
  }, [selectedClass]);

  // Reset step if n changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [n]);

  // Playback timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalOps) {
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
  }, [isPlaying, speed, totalOps]);

  const handlePlayToggle = () => {
    if (currentStep >= totalOps) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (currentStep < totalOps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  // Generate visual operation tokens
  const operationTokens = useMemo(() => {
    const tokens = [];
    const count = Math.min(totalOps, 120); // Cap grid rendering to 120 slots for visual smoothness
    for (let i = 1; i <= count; i++) {
      tokens.push({
        id: i,
        executed: i <= currentStep,
        isCurrent: i === currentStep,
      });
    }
    return tokens;
  }, [totalOps, currentStep]);

  // Progress percentage
  const progressPercent = totalOps > 0 ? Math.min(100, Math.round((currentStep / totalOps) * 100)) : 0;

  // Real world time estimation at 10^9 ops/sec
  const modernCpuTimeNs = totalOps; // 1 ns per op
  const formatModernTime = (ops: number) => {
    if (ops <= 1) return "< 1 nanosecond";
    if (ops < 1000) return `${ops} ns`;
    if (ops < 1_000_000) return `${(ops / 1000).toFixed(2)} µs`;
    if (ops < 1_000_000_000) return `${(ops / 1_000_000).toFixed(2)} ms`;
    if (ops < 60_000_000_000) return `${(ops / 1_000_000_000).toFixed(2)} seconds`;
    return `${(ops / 3.154e16).toFixed(2)} years!`;
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto" suppressHydrationWarning>
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Execution Canvas Stage */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col min-h-[360px] relative overflow-hidden shadow-xs">
            {/* Header Indicators */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
                <Zap className="h-4 w-4" />
                <span>CPU Execution Stream ({profile.name})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">Formula:</span>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-secondary/80 px-2 py-0.5 rounded border border-border">
                  {profile.formulaStr}
                </span>
              </div>
            </div>

            {/* Visualized Operation Cells Grid */}
            <div className="flex-1 flex flex-col justify-center space-y-3 py-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <Cpu className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Instruction Pipeline ({operationTokens.length} active slots)</span>
                </span>
                {totalOps > 120 && (
                  <span>Showing 120 of {totalOps} ops</span>
                )}
              </div>

              {/* Operation Slots */}
              <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1.5 max-h-48 overflow-y-auto p-1 bg-secondary/20 rounded-xl border border-border/60">
                {operationTokens.map((op) => (
                  <motion.div
                    key={op.id}
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: op.isCurrent ? 1.15 : 1,
                      backgroundColor: op.isCurrent
                        ? "#06b6d4"
                        : op.executed
                        ? "rgba(6, 182, 212, 0.25)"
                        : "rgba(100, 116, 139, 0.15)",
                      borderColor: op.isCurrent
                        ? "#22d3ee"
                        : op.executed
                        ? "rgba(6, 182, 212, 0.5)"
                        : "rgba(100, 116, 139, 0.2)",
                    }}
                    transition={{ duration: 0.15 }}
                    className={`h-7 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold ${
                      op.isCurrent
                        ? "text-slate-950 shadow-md shadow-cyan-500/50 z-10"
                        : op.executed
                        ? "text-cyan-600 dark:text-cyan-300"
                        : "text-muted-foreground/50"
                    }`}
                    title={`Operation #${op.id}`}
                  >
                    {op.id}
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden border border-border/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>

              {/* Micro-Metrics Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono pt-1 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
                  <span>Growth Multiplier: <strong className="text-foreground">{(totalOps / Math.max(1, n)).toFixed(1)}× per item</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>CPU Estimate: <strong className="text-foreground">{formatModernTime(totalOps)}</strong></span>
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
                  <span className="text-[10px] text-muted-foreground">Class:</span>
                  <strong className="font-bold">{profile.id}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-300">
                  <span className="text-[10px] text-muted-foreground">n:</span>
                  <strong className="font-bold">{n}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-600 dark:text-emerald-300">
                  <span className="text-[10px] text-muted-foreground">Ops:</span>
                  <strong className="font-bold">{currentStep}/{totalOps}</strong>
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
            {/* Complexity Classes Selector Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pb-2 border-b border-border/70">
              {(Object.keys(COMPLEXITY_PROFILES) as ComplexityClass[]).map((cls) => {
                const p = COMPLEXITY_PROFILES[cls];
                const isSelected = selectedClass === cls;

                return (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-500/80 text-cyan-600 dark:text-cyan-400 font-bold shadow-xs"
                        : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">{cls}</span>
                    <span className="text-[8px] font-sans text-muted-foreground truncate max-w-full">{p.category}</span>
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
                  <span>{isPlaying ? "Pause" : currentStep >= totalOps ? "Restart" : "Simulate"}</span>
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={isPlaying || currentStep >= totalOps}
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
              algorithmName={`TimeComplexity_${selectedClass.replace(/[^a-zA-Z0-9]/g, "")}`}
              activeLineNumber={isPlaying ? 3 : null}
            />
          </div>

          {/* Growth Comparison at n Table */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-cyan-500" />
              <span>Growth Comparison at n = {n}</span>
            </h3>

            <div className="space-y-1 font-mono text-xs">
              {(Object.keys(COMPLEXITY_PROFILES) as ComplexityClass[]).map((cls) => {
                const p = COMPLEXITY_PROFILES[cls];
                const ops = p.formulaFn(n);
                const isCurrent = selectedClass === cls;

                return (
                  <div
                    key={cls}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-all ${
                      isCurrent
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-bold"
                        : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-16 font-bold">{cls}</span>
                      <span className="text-[10px] text-muted-foreground font-sans hidden sm:inline">{p.name}</span>
                    </div>
                    <span className="font-bold">
                      {ops > 1_000_000 ? `${(ops / 1_000_000).toFixed(1)}M ops` : `${ops} ops`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Asymptotic Invariant card */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-500" />
              <span>Hardware-Agnostic Asymptotic Invariant</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
              Big-O analysis strips away hardware clock frequency, CPU architecture, and compiler optimizations. It measures the pure mathematical rate of instruction growth as <code className="text-cyan-500 font-bold">n → ∞</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
