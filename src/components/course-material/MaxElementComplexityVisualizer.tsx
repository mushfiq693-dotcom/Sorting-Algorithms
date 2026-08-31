"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Layers,
  ChevronRight,
  Eye,
  Sliders,
  Flame,
  ShieldCheck,
  Code2,
  RefreshCw,
  Crown,
  ArrowUpRight,
  Activity,
  Calculator,
  Shuffle,
  Dice5,
} from "lucide-react";

// Step record for live execution
interface SimulationStep {
  stepIndex: number;
  k: number; // 1-indexed K (1 to n)
  loc: number; // 1-indexed LOC
  maxVal: number;
  currentVal: number;
  comparisonType: "init" | "compare_true" | "compare_false" | "finished";
  updateHappened: boolean;
  totalUpdatesSoFar: number;
  totalComparisonsSoFar: number;
  codeLine: number; // 1 to 6 in pseudo-code
  message: string;
}

// Preset configurations
interface PresetOption {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  array: number[];
}

const PRESETS: PresetOption[] = [
  {
    id: "worst",
    name: "Worst Case (Ascending)",
    badge: "C(n) = n - 1",
    badgeColor: "bg-rose-500/15 text-rose-500 border-rose-500/30",
    description: "Strictly increasing order: Every single element from K=2 to n is greater than the previous MAX, triggering an update at EVERY step.",
    array: [14, 28, 45, 62, 79, 95],
  },
  {
    id: "best",
    name: "Best Case (Max First)",
    badge: "C(n) = 0",
    badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    description: "Strictly decreasing order (or largest element at index 1): DATA[1] is already maximum; Step 3 condition is NEVER true.",
    array: [95, 79, 62, 45, 28, 14],
  },
  {
    id: "average",
    name: "Average / Mixed Case",
    badge: "0 < C(n) < n - 1",
    badgeColor: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    description: "Random permutation: Updates occur whenever a newly scanned element happens to be a running prefix maximum.",
    array: [38, 84, 19, 92, 53, 71],
  },
];

// Helper: Calculate Harmonic Number H_n = sum(1/k for k=1..n)
function getHarmonicMinusOne(n: number): number {
  let sum = 0;
  for (let k = 2; k <= n; k++) {
    sum += 1 / k;
  }
  return sum;
}

export function MaxElementComplexityVisualizer() {
  // Navigation Tabs: 'studio' | 'permutations' | 'harmonic'
  const [activeTab, setActiveTab] = useState<"studio" | "permutations" | "harmonic">("studio");

  // ----------------------------------------------------
  // TAB 1: STUDIO (Live Trace Simulator)
  // ----------------------------------------------------
  const [array, setArray] = useState<number[]>([14, 28, 45, 62, 79, 95]);
  const [customInput, setCustomInput] = useState<string>("14, 28, 45, 62, 79, 95");
  const [activePreset, setActivePreset] = useState<string>("worst");

  // Playback state
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate trace steps whenever array changes
  useEffect(() => {
    if (!array || array.length === 0) return;

    const n = array.length;
    const trace: SimulationStep[] = [];
    let loc = 0;
    let maxVal = array[0];
    let updateCount = 0;
    let compCount = 0;

    // Step 0: Initialization (K=0, LOC=0, MAX=DATA[0])
    trace.push({
      stepIndex: 0,
      k: 0,
      loc: 0,
      maxVal: maxVal,
      currentVal: array[0],
      comparisonType: "init",
      updateHappened: false,
      totalUpdatesSoFar: 0,
      totalComparisonsSoFar: 0,
      codeLine: 1,
      message: `Initialize: Set K := 0, LOC := 0, MAX := DATA[0] (${maxVal}). No comparison needed for K=0.`,
    });

    // Loop K = 1 to n - 1 (0-based indexing)
    for (let k = 1; k < n; k++) {
      const currentVal = array[k];
      compCount++;

      if (currentVal > maxVal) {
        updateCount++;
        loc = k;
        maxVal = currentVal;
        trace.push({
          stepIndex: trace.length,
          k: k,
          loc: loc,
          maxVal: maxVal,
          currentVal: currentVal,
          comparisonType: "compare_true",
          updateHappened: true,
          totalUpdatesSoFar: updateCount,
          totalComparisonsSoFar: compCount,
          codeLine: 4,
          message: `Step 3 (True): DATA[${k}] (${currentVal}) > MAX (${array[trace[trace.length - 1].loc] || maxVal}) ➔ UPDATE! Set LOC := ${k}, MAX := ${maxVal}. C(n) count = ${updateCount}.`,
        });
      } else {
        trace.push({
          stepIndex: trace.length,
          k: k,
          loc: loc,
          maxVal: maxVal,
          currentVal: currentVal,
          comparisonType: "compare_false",
          updateHappened: false,
          totalUpdatesSoFar: updateCount,
          totalComparisonsSoFar: compCount,
          codeLine: 3,
          message: `Step 3 (False): DATA[${k}] (${currentVal}) ≤ MAX (${maxVal}) ➔ NO update. LOC remains ${loc}, MAX remains ${maxVal}.`,
        });
      }
    }

    // Finished step
    trace.push({
      stepIndex: trace.length,
      k: n,
      loc: loc,
      maxVal: maxVal,
      currentVal: maxVal,
      comparisonType: "finished",
      updateHappened: false,
      totalUpdatesSoFar: updateCount,
      totalComparisonsSoFar: compCount,
      codeLine: 6,
      message: `Finished: Loop exited (K = ${n}). Output LOC = ${loc}, MAX = ${maxVal}. Total Step 3 Updates C(n) = ${updateCount} out of ${n - 1} comparisons.`,
    });

    setSteps(trace);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [array]);

  // Handle Playback Interval
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
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  const currentStep = steps[currentStepIdx] || {
    stepIndex: 0,
    k: 1,
    loc: 1,
    maxVal: array[0] || 0,
    currentVal: array[0] || 0,
    comparisonType: "init",
    updateHappened: false,
    totalUpdatesSoFar: 0,
    totalComparisonsSoFar: 0,
    codeLine: 1,
    message: "Initializing algorithm trace...",
  };

  const handleApplyPreset = (preset: PresetOption) => {
    setActivePreset(preset.id);
    setArray([...preset.array]);
    setCustomInput(preset.array.join(", "));
  };

  const handleRandomize = () => {
    const size = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const nums: number[] = [];
    while (nums.length < size) {
      const r = Math.floor(Math.random() * 90) + 10;
      if (!nums.includes(r)) nums.push(r);
    }
    setActivePreset("custom");
    setArray(nums);
    setCustomInput(nums.join(", "));
  };

  const handleApplyCustom = () => {
    const parsed = customInput
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (parsed.length >= 2 && parsed.length <= 12) {
      setActivePreset("custom");
      setArray(parsed);
    }
  };

  // ----------------------------------------------------
  // TAB 2: PERMUTATIONS (n = 3 Matrix Explorer)
  // ----------------------------------------------------
  const [permN, setPermN] = useState<3 | 4>(3);

  // Precomputed n=3 table data
  const permutations3Data = useMemo(() => {
    const perms = [
      { arr: [1, 2, 3], k2: true, k3: true, updates: 2, note: "Worst Case (C(3) = 2)" },
      { arr: [1, 3, 2], k2: true, k3: false, updates: 1, note: "Average Case (C(3) = 1)" },
      { arr: [2, 1, 3], k2: false, k3: true, updates: 1, note: "Average Case (C(3) = 1)" },
      { arr: [2, 3, 1], k2: true, k3: false, updates: 1, note: "Average Case (C(3) = 1)" },
      { arr: [3, 1, 2], k2: false, k3: false, updates: 0, note: "Best Case (C(3) = 0)" },
      { arr: [3, 2, 1], k2: false, k3: false, updates: 0, note: "Best Case (C(3) = 0)" },
    ];
    const sum = perms.reduce((acc, p) => acc + p.updates, 0);
    const avg = sum / perms.length;
    return { perms, sum, avg };
  }, []);

  const loadPermutationToStudio = (pArr: number[]) => {
    setArray([...pArr]);
    setCustomInput(pArr.join(", "));
    setActivePreset("custom");
    setActiveTab("studio");
  };

  // ----------------------------------------------------
  // TAB 3: HARMONIC & MONTE CARLO SIMULATOR
  // ----------------------------------------------------
  const [harmonicN, setHarmonicN] = useState<number>(10);
  const [monteCarloTrials, setMonteCarloTrials] = useState<number>(2000);
  const [monteCarloResult, setMonteCarloResult] = useState<{
    empiricalMean: number;
    theoreticalMean: number;
    distribution: Record<number, number>;
    totalSimulated: number;
  } | null>(null);
  const [isSimulatingMonteCarlo, setIsSimulatingMonteCarlo] = useState<boolean>(false);

  const theoreticalMeanForN = useMemo(() => {
    return getHarmonicMinusOne(harmonicN);
  }, [harmonicN]);

  const runMonteCarloSimulation = () => {
    setIsSimulatingMonteCarlo(true);

    setTimeout(() => {
      const dist: Record<number, number> = {};
      let totalUpdatesSum = 0;

      for (let t = 0; t < monteCarloTrials; t++) {
        // Generate random permutation of 1..harmonicN using Fisher-Yates
        const p: number[] = Array.from({ length: harmonicN }, (_, i) => i + 1);
        for (let i = p.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [p[i], p[j]] = [p[j], p[i]];
        }

        // Count Algorithm 2.3 updates
        let maxVal = p[0];
        let updates = 0;
        for (let k = 1; k < p.length; k++) {
          if (p[k] > maxVal) {
            maxVal = p[k];
            updates++;
          }
        }

        totalUpdatesSum += updates;
        dist[updates] = (dist[updates] || 0) + 1;
      }

      setMonteCarloResult({
        empiricalMean: totalUpdatesSum / monteCarloTrials,
        theoreticalMean: getHarmonicMinusOne(harmonicN),
        distribution: dist,
        totalSimulated: monteCarloTrials,
      });
      setIsSimulatingMonteCarlo(false);
    }, 50);
  };

  // Run on first load for tab 3
  useEffect(() => {
    if (activeTab === "harmonic" && !monteCarloResult) {
      runMonteCarloSimulation();
    }
  }, [activeTab]);

  const maxValInArray = Math.max(...(array.length ? array : [100]), 100);

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-[#080d1a]/95 text-foreground overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-background border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Algorithm 2.3 Simulation
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Problem 2.6 Lab
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight mt-1 flex items-center gap-2">
              Max Element & Step 3 Update Complexity <span className="text-cyan-400 font-mono">C(n)</span>
            </h3>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary/80 rounded-2xl border border-border/80 text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "studio"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>Trace Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab("permutations")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "permutations"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>n = 3 Permutations</span>
          </button>
          <button
            onClick={() => setActiveTab("harmonic")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "harmonic"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Harmonic Monte Carlo</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STUDIO / LIVE TRACE SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === "studio" && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Preset Buttons & Custom Array Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-secondary/30">
            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-muted-foreground mr-1">PRESETS:</span>
              {PRESETS.map((p) => {
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20"
                        : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={handleRandomize}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <Shuffle className="h-3 w-3 text-cyan-400" />
                <span>Shuffle</span>
              </button>
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 10, 45, 20, 80"
                className="px-3 py-1.5 rounded-xl border border-border/80 bg-background/80 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 w-48 sm:w-56"
              />
              <button
                onClick={handleApplyCustom}
                className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold transition-all active:scale-95"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Active Preset Description Banner */}
          {activePreset !== "custom" && (
            <div className="text-xs text-muted-foreground flex items-start gap-2 bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-cyan-300">
                  {PRESETS.find((p) => p.id === activePreset)?.name}:
                </span>{" "}
                {PRESETS.find((p) => p.id === activePreset)?.description}
              </div>
            </div>
          )}

          {/* Real-time Visual Array Canvas */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 flex flex-col items-center justify-between min-h-[300px] overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

            {/* Array Bars Visualization */}
            <div className="w-full flex items-end justify-center gap-3 sm:gap-4 h-48 py-4 z-10">
              {array.map((val, idx) => {
                const isCurrentK = currentStep.k === idx;
                const isLoc = currentStep.loc === idx;
                const isScanned = currentStep.k > idx || currentStep.comparisonType === "finished";
                const isComparedNow = isCurrentK && currentStep.comparisonType !== "init" && currentStep.comparisonType !== "finished";
                const isUpdateTarget = isCurrentK && currentStep.comparisonType === "compare_true";

                const heightPercent = Math.max(18, Math.round((val / maxValInArray) * 90));

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[70px]">
                    {/* Top Pointer Badge */}
                    <div className="h-7 flex items-center justify-center">
                      {isLoc && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-500 text-black shadow-lg shadow-amber-500/30 animate-bounce">
                          <Crown className="h-3 w-3" />
                          <span>LOC</span>
                        </span>
                      )}
                      {isCurrentK && !isLoc && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold bg-cyan-500 text-black animate-pulse">
                          K={idx}
                        </span>
                      )}
                    </div>

                    {/* Bar Component */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-2xl border transition-all duration-300 flex flex-col items-center justify-between p-2 shadow-lg relative ${
                        isUpdateTarget
                          ? "bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 border-emerald-300 shadow-emerald-500/40 ring-4 ring-emerald-500/30 scale-105"
                          : isComparedNow
                          ? "bg-gradient-to-t from-cyan-600 via-cyan-500 to-cyan-400 border-cyan-200 shadow-cyan-500/40 ring-4 ring-cyan-500/30 scale-105"
                          : isLoc
                          ? "bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 border-amber-300 shadow-amber-500/30"
                          : isScanned
                          ? "bg-slate-800/80 border-slate-700 text-slate-400"
                          : "bg-slate-900/60 border-slate-800/80 text-slate-500"
                      }`}
                    >
                      <span
                        className={`font-mono text-xs sm:text-sm font-extrabold ${
                          isUpdateTarget || isComparedNow || isLoc ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {val}
                      </span>
                    </div>

                    {/* Array Index (0-indexed) */}
                    <div className="flex flex-col items-center text-center">
                      <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                        [{idx}]
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Step Explanation Message Banner */}
            <div className="w-full mt-4 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md flex items-center justify-between gap-3 text-xs sm:text-sm z-10">
              <div className="flex items-center gap-2.5">
                {currentStep.comparisonType === "compare_true" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : currentStep.comparisonType === "compare_false" ? (
                  <AlertCircle className="h-5 w-5 text-slate-400 shrink-0" />
                ) : currentStep.comparisonType === "finished" ? (
                  <Award className="h-5 w-5 text-amber-400 shrink-0" />
                ) : (
                  <Sparkles className="h-5 w-5 text-cyan-400 shrink-0" />
                )}
                <span className="font-mono text-foreground">{currentStep.message}</span>
              </div>

              <div className="shrink-0 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                Step {currentStepIdx + 1} / {steps.length}
              </div>
            </div>
          </div>

          {/* Controls Bar & Speed Slider */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/80">
            {/* Playback Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(0);
                }}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
                title="First Step"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
                title="Step Backward"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  if (currentStepIdx >= steps.length - 1) {
                    setCurrentStepIdx(0);
                  }
                  setIsPlaying(!isPlaying);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>{currentStepIdx >= steps.length - 1 ? "Replay" : "Play Trace"}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
                }}
                disabled={currentStepIdx >= steps.length - 1}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
                title="Step Forward"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span>Speed:</span>
              {[
                { label: "0.5x", val: 1800 },
                { label: "1.0x", val: 1000 },
                { label: "2.0x", val: 500 },
                { label: "4.0x", val: 250 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setPlaybackSpeed(s.val)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    playbackSpeed === s.val
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Analytics: Algorithm Code Tracker + Live Complexity HUD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Algorithm 2.3 Pseudocode / C++ Step Synchronizer (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-black/60 p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <span className="font-bold text-slate-300 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                  Algorithm 2.3 Execution Tracker
                </span>
                <span className="text-[10px] text-cyan-400 font-bold">1-Indexed Notation</span>
              </div>

              <div className="space-y-1 text-slate-300">
                {[
                  {
                    line: 1,
                    text: "1. [Initialize] Set K := 1, LOC := 1, MAX := DATA[1].",
                  },
                  {
                    line: 2,
                    text: "2. Repeat Steps 3 and 4 while K ≤ n:",
                  },
                  {
                    line: 3,
                    text: "3.   If MAX < DATA[K], then:",
                  },
                  {
                    line: 4,
                    text: "       Set LOC := K and MAX := DATA[K].  /* Step 3 Update! C(n)++ */",
                    isUpdateLine: true,
                  },
                  {
                    line: 5,
                    text: "4.   Set K := K + 1. [End of Step 2 loop.]",
                  },
                  {
                    line: 6,
                    text: "5. [Output] Output LOC and MAX. Exit.",
                  },
                ].map((item) => {
                  const isActive = currentStep.codeLine === item.line;
                  return (
                    <div
                      key={item.line}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                        isActive
                          ? item.isUpdateLine
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                            : "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-bold"
                          : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <span>{item.text}</span>
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-300 font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Complexity HUD Stats (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card/80 p-5 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  Live Complexity HUD
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  n = {array.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                {/* Total Comparisons */}
                <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                  <div className="text-[10px] text-muted-foreground uppercase">Comparisons</div>
                  <div className="text-lg font-black text-cyan-300 mt-1">
                    {currentStep.totalComparisonsSoFar}{" "}
                    <span className="text-xs text-muted-foreground font-normal">/ {array.length - 1}</span>
                  </div>
                  <div className="text-[10px] text-cyan-400/80 mt-0.5 font-sans">Invariant: Exactly n - 1</div>
                </div>

                {/* Updates C(n) */}
                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                  <div className="text-[10px] text-muted-foreground uppercase">Updates C(n)</div>
                  <div className="text-lg font-black text-emerald-300 mt-1">
                    {currentStep.totalUpdatesSoFar}{" "}
                    <span className="text-xs text-muted-foreground font-normal">times</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80 mt-0.5 font-sans">
                    {currentStep.totalUpdatesSoFar === array.length - 1
                      ? "🔴 Worst Case (n - 1)"
                      : currentStep.totalUpdatesSoFar === 0
                      ? "🟢 Best Case (0)"
                      : "🟡 Average / Mixed"}
                  </div>
                </div>

                {/* Current Max */}
                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-950/20">
                  <div className="text-[10px] text-muted-foreground uppercase">Current MAX</div>
                  <div className="text-lg font-black text-amber-300 mt-1">{currentStep.maxVal}</div>
                  <div className="text-[10px] text-amber-400/80 mt-0.5">Found at LOC = {currentStep.loc}</div>
                </div>

                {/* Theoretical Bound */}
                <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
                  <div className="text-[10px] text-muted-foreground uppercase">Average Expected</div>
                  <div className="text-lg font-black text-indigo-300 mt-1">
                    {getHarmonicMinusOne(array.length).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-indigo-400/80 mt-0.5">H_{array.length} - 1 updates</div>
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground bg-secondary/50 p-2.5 rounded-xl border border-border">
                <span className="font-semibold text-foreground">Core Takeaway:</span> While comparisons are always{" "}
                <span className="font-mono text-cyan-400 font-bold">{array.length - 1}</span>, Step 3 updates range strictly between{" "}
                <span className="font-mono text-emerald-400 font-bold">0 (Best)</span> and{" "}
                <span className="font-mono text-rose-400 font-bold">{array.length - 1} (Worst)</span> depending on order.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PERMUTATIONS (Problem 2.6 (c) n = 3 Matrix Explorer) */}
      {/* ========================================================================= */}
      {activeTab === "permutations" && (
        <div className="p-5 sm:p-7 space-y-6">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                Problem 2.6 (c): Complete Permutations Matrix for n = 3
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Assuming all 3! = 6 arrangements of {"{1, 2, 3}"} are equally likely, each permutation has probability P = 1/6.
              </p>
            </div>

            {/* Quick Result Pill */}
            <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center shrink-0">
              <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Expected Average C(3)</div>
              <div className="text-xl font-extrabold text-cyan-400 font-mono">
                5 / 6 <span className="text-xs text-muted-foreground">≈ 0.833</span>
              </div>
            </div>
          </div>

          {/* Interactive Permutations Table */}
          <div className="rounded-2xl border border-border/80 bg-card/90 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-secondary/70 border-b border-border/80 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5 pl-5">#</th>
                    <th className="p-3.5">Permutation DATA</th>
                    <th className="p-3.5">Initial State (K=0)</th>
                    <th className="p-3.5">K=1 Check (DATA[1] &gt; MAX)</th>
                    <th className="p-3.5">K=2 Check (DATA[2] &gt; MAX)</th>
                    <th className="p-3.5 text-center">Updates C(3)</th>
                    <th className="p-3.5 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-mono">
                  {permutations3Data.perms.map((p, idx) => {
                    const isWorst = p.updates === 2;
                    const isBest = p.updates === 0;

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-cyan-500/[0.04] ${
                          isWorst
                            ? "bg-rose-500/[0.02]"
                            : isBest
                            ? "bg-emerald-500/[0.02]"
                            : ""
                        }`}
                      >
                        <td className="p-3.5 pl-5 text-muted-foreground">{idx + 1}</td>
                        <td className="p-3.5">
                          <span className="font-extrabold text-foreground font-sans text-sm bg-secondary px-2.5 py-1 rounded-lg border border-border">
                            ({p.arr.join(", ")})
                          </span>
                        </td>
                        <td className="p-3.5 text-muted-foreground">
                          MAX = {p.arr[0]}, LOC = 0
                        </td>
                        <td className="p-3.5">
                          {p.k2 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {p.arr[1]} &gt; {p.arr[0]} (Update MAX={p.arr[1]})
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              {p.arr[1]} &lt; {p.arr[0]} (No update)
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {p.k3 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {p.arr[2]} &gt; {Math.max(p.arr[0], p.arr[1])} (Update MAX={p.arr[2]})
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              {p.arr[2]} &lt; {Math.max(p.arr[0], p.arr[1])} (No update)
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg font-extrabold text-xs border ${
                              isWorst
                                ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                : isBest
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            {p.updates}
                          </span>
                        </td>
                        <td className="p-3.5 pr-5 text-right font-sans">
                          <button
                            onClick={() => loadPermutationToStudio(p.arr)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-all active:scale-95"
                          >
                            <Play className="h-3 w-3" />
                            <span>Simulate</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Proof Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl border border-border/80 bg-secondary/40 space-y-1">
              <div className="text-muted-foreground uppercase text-[10px]">1. Total Sum of Updates</div>
              <div className="text-xl font-extrabold text-foreground">
                ∑ C(3) = 2 + 1 + 1 + 1 + 0 + 0 = <span className="text-cyan-400">5</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans">Sum of updates across all 6 permutations.</div>
            </div>

            <div className="p-4 rounded-2xl border border-border/80 bg-secondary/40 space-y-1">
              <div className="text-muted-foreground uppercase text-[10px]">2. Total Permutations</div>
              <div className="text-xl font-extrabold text-foreground">
                N = 3! = 3 × 2 × 1 = <span className="text-cyan-400">6</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans">All permutations equally probable (p = 1/6).</div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
              <div className="text-emerald-400 uppercase text-[10px] font-bold">3. Final Average Result</div>
              <div className="text-xl font-extrabold text-emerald-300">
                E[C(3)] = 5 / 6 ≈ <span className="text-emerald-400">0.8333</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-sans">Matches theoretical Harmonic sum ½ + ⅓ = ⅚.</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HARMONIC & MONTE CARLO EXPERIMENT */}
      {/* ========================================================================= */}
      {activeTab === "harmonic" && (
        <div className="p-5 sm:p-7 space-y-6">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                General Average Complexity for Arbitrary n (Harmonic Series)
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">
                By probability theory, the $k$-th element is the maximum of the first $k$ elements with probability{" "}
                <span className="font-mono text-cyan-400 font-bold">P(update at k) = 1/k</span>. Therefore, by linearity of expectation:{" "}
                <span className="font-mono text-indigo-300 font-bold">E[C(n)] = ∑(k=2 to n) 1/k = H_n - 1 ≈ ln(n) + γ - 1</span>.
              </p>
            </div>

            {/* Slider for n */}
            <div className="flex items-center gap-3 bg-secondary/80 px-4 py-2.5 rounded-2xl border border-border shrink-0">
              <div className="text-xs font-mono text-muted-foreground">Array Size n:</div>
              <input
                type="range"
                min={3}
                max={50}
                value={harmonicN}
                onChange={(e) => setHarmonicN(parseInt(e.target.value, 10))}
                className="w-28 sm:w-36 accent-cyan-500 cursor-pointer"
              />
              <span className="font-mono font-extrabold text-cyan-400 text-sm w-6 text-right">
                {harmonicN}
              </span>
            </div>
          </div>

          {/* Bounds Comparison for current n */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="text-[10px] text-emerald-400 uppercase font-bold">Best Case</div>
              <div className="text-xl font-extrabold text-emerald-300 mt-1">0</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Largest element at index 1</div>
            </div>

            <div className="p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
              <div className="text-[10px] text-cyan-400 uppercase font-bold">Harmonic Average</div>
              <div className="text-xl font-extrabold text-cyan-300 mt-1">
                {theoreticalMeanForN.toFixed(3)}
              </div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">H_{harmonicN} - 1 updates</div>
            </div>

            <div className="p-3.5 rounded-2xl border border-rose-500/30 bg-rose-950/20">
              <div className="text-[10px] text-rose-400 uppercase font-bold">Worst Case</div>
              <div className="text-xl font-extrabold text-rose-300 mt-1">{harmonicN - 1}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Strictly ascending array</div>
            </div>

            <div className="p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
              <div className="text-[10px] text-indigo-400 uppercase font-bold">Total Comparisons</div>
              <div className="text-xl font-extrabold text-indigo-300 mt-1">{harmonicN - 1}</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Always invariant</div>
            </div>
          </div>

          {/* Monte Carlo Live Trial Section */}
          <div className="rounded-2xl border border-border/80 bg-card/90 p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Dice5 className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-foreground">
                  Monte Carlo Empirical Verification Engine
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[1000, 5000, 10000].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setMonteCarloTrials(count);
                      runMonteCarloSimulation();
                    }}
                    disabled={isSimulatingMonteCarlo}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                      monteCarloTrials === count
                        ? "bg-cyan-500 text-white border-cyan-400 shadow-sm"
                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {count.toLocaleString()} Trials
                  </button>
                ))}
                <button
                  onClick={runMonteCarloSimulation}
                  disabled={isSimulatingMonteCarlo}
                  className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <RefreshCw className={`h-3 w-3 ${isSimulatingMonteCarlo ? "animate-spin" : ""}`} />
                  <span>Run</span>
                </button>
              </div>
            </div>

            {/* Results Comparison HUD */}
            {monteCarloResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                    <div className="text-[10px] text-muted-foreground">Empirical Sample Mean (from {monteCarloResult.totalSimulated.toLocaleString()} trials)</div>
                    <div className="text-xl font-extrabold text-cyan-300 mt-1">
                      {monteCarloResult.empiricalMean.toFixed(4)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
                    <div className="text-[10px] text-muted-foreground">Exact Theoretical Mean (H_{harmonicN} - 1)</div>
                    <div className="text-xl font-extrabold text-indigo-300 mt-1">
                      {monteCarloResult.theoreticalMean.toFixed(4)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                    <div className="text-[10px] text-muted-foreground">Error Discrepancy</div>
                    <div className="text-xl font-extrabold text-emerald-300 mt-1">
                      {Math.abs(monteCarloResult.empiricalMean - monteCarloResult.theoreticalMean).toFixed(4)}{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        (
                        {(
                          (Math.abs(monteCarloResult.empiricalMean - monteCarloResult.theoreticalMean) /
                            monteCarloResult.theoreticalMean) *
                          100
                        ).toFixed(2)}
                        %)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Histogram Frequency Chart */}
                <div className="p-4 rounded-xl border border-border/70 bg-black/40 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-muted-foreground flex items-center justify-between">
                    <span>Frequency Distribution of Updates C({harmonicN}) across {monteCarloResult.totalSimulated.toLocaleString()} trials:</span>
                    <span className="text-cyan-400">Peak around E[C(n)] ≈ {monteCarloResult.theoreticalMean.toFixed(2)}</span>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {Object.entries(monteCarloResult.distribution)
                      .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
                      .map(([updateCount, count]) => {
                        const pct = ((count / monteCarloResult.totalSimulated) * 100).toFixed(1);
                        const isClosestToMean =
                          Math.abs(parseInt(updateCount, 10) - monteCarloResult.theoreticalMean) < 0.6;

                        return (
                          <div key={updateCount} className="flex items-center gap-3 text-xs font-mono">
                            <span className="w-16 text-muted-foreground text-right">
                              {updateCount} updates:
                            </span>
                            <div className="flex-1 h-5 bg-secondary/80 rounded-md overflow-hidden p-0.5">
                              <div
                                style={{ width: `${Math.max(2, parseFloat(pct))}%` }}
                                className={`h-full rounded transition-all duration-500 ${
                                  isClosestToMean
                                    ? "bg-gradient-to-r from-cyan-500 to-emerald-400"
                                    : "bg-cyan-600/60"
                                }`}
                              />
                            </div>
                            <span className="w-20 text-muted-foreground text-[11px]">
                              {count} ({pct}%)
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
