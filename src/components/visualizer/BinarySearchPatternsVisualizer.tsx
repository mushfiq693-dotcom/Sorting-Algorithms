"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  BinarySearchPatternsEngine,
  BinarySearchPatternsStep,
  BinarySearchPatternMode,
  BinarySearchPatternPreset,
  BINARY_SEARCH_PATTERN_PRESETS,
} from "@/algorithms/binary-search-patterns";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  RotateCw,
  Gauge,
  Mountain,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  Zap,
  ArrowDown,
  Info,
  Check,
  X,
  TrendingUp,
} from "lucide-react";

export function BinarySearchPatternsVisualizer() {
  // Config & Mode State
  const [activeMode, setActiveMode] =
    useState<BinarySearchPatternMode>("lower-upper-bound");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("bound-duplicates");
  const [speed, setSpeed] = useState<number>(600); // ms per step
  const [customTarget, setCustomTarget] = useState<number>(4);
  const [customHours, setCustomHours] = useState<number>(8);

  // Playback & Step State
  const [steps, setSteps] = useState<BinarySearchPatternsStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter presets for the active mode
  const currentPresets = useMemo(() => {
    return BINARY_SEARCH_PATTERN_PRESETS.filter((p: BinarySearchPatternPreset) => p.mode === activeMode);
  }, [activeMode]);

  // Initialize Steps on mode, preset, or parameter changes
  const initializeSteps = useCallback(
    (
      mode: BinarySearchPatternMode,
      presetId: string,
      targetVal: number,
      hoursVal: number
    ) => {
      let generated: BinarySearchPatternsStep[] = [];
      const preset: BinarySearchPatternPreset =
        BINARY_SEARCH_PATTERN_PRESETS.find((p: BinarySearchPatternPreset) => p.id === presetId) ||
        BINARY_SEARCH_PATTERN_PRESETS.find((p: BinarySearchPatternPreset) => p.mode === mode) ||
        BINARY_SEARCH_PATTERN_PRESETS[0];

      if (mode === "lower-upper-bound") {
        generated = BinarySearchPatternsEngine.generateBoundSteps(
          preset.array ?? [1, 2, 4, 4, 4, 6, 7, 9],
          targetVal
        );
      } else if (mode === "rotated-array") {
        generated = BinarySearchPatternsEngine.generateRotatedSteps(
          preset.array ?? [4, 5, 6, 7, 0, 1, 2],
          targetVal
        );
      } else if (mode === "search-on-answer") {
        generated = BinarySearchPatternsEngine.generateSearchOnAnswerSteps(
          preset.piles ?? [3, 6, 7, 11],
          hoursVal
        );
      } else if (mode === "peak-element") {
        generated = BinarySearchPatternsEngine.generatePeakElementSteps(
          preset.array ?? [1, 2, 1, 3, 5, 6, 4]
        );
      }

      setSteps(generated);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  // Mode change handler
  const handleModeChange = (newMode: BinarySearchPatternMode) => {
    setActiveMode(newMode);
    const firstPreset =
      BINARY_SEARCH_PATTERN_PRESETS.find((p: BinarySearchPatternPreset) => p.mode === newMode) ||
      BINARY_SEARCH_PATTERN_PRESETS[0];
    setSelectedPresetId(firstPreset.id);

    let defaultTarget = 4;
    if (newMode === "rotated-array") defaultTarget = 0;
    setCustomTarget(defaultTarget);

    const defaultHours = firstPreset.maxHours || 8;
    setCustomHours(defaultHours);

    initializeSteps(newMode, firstPreset.id, defaultTarget, defaultHours);
  };

  // Preset change handler
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = BINARY_SEARCH_PATTERN_PRESETS.find((p: BinarySearchPatternPreset) => p.id === presetId);
    if (!preset) return;

    const targetVal = preset.target ?? customTarget;
    const hoursVal = preset.maxHours ?? customHours;
    if (preset.target !== undefined) setCustomTarget(targetVal);
    if (preset.maxHours !== undefined) setCustomHours(hoursVal);

    initializeSteps(activeMode, presetId, targetVal, hoursVal);
  };

  // Initial load
  useEffect(() => {
    initializeSteps(activeMode, selectedPresetId, customTarget, customHours);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Current active step snapshot
  const currentStep = useMemo<BinarySearchPatternsStep | null>(() => {
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
          if (
            steps[next]?.status === "found" ||
            steps[next]?.status === "completed"
          ) {
            try {
              confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
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

  const stepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Helper status color badges
  const getStatusBadge = (status: BinarySearchPatternsStep["status"]) => {
    switch (status) {
      case "found":
      case "completed":
        return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "evaluating-mid":
        return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "branching-left":
        return "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
      case "branching-right":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "not-found":
        return "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30";
      default:
        return "bg-secondary text-muted-foreground border-border";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-body select-text">
      {/* Studio 7:5 Top-Level Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: 7 Columns on Desktop (The Visual Interactive Stage) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Visualizer Canvas Container */}
          <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-5 sm:p-6 shadow-sm dark:shadow-2xl overflow-hidden flex flex-col gap-5 min-h-[500px]">
            {/* Top Telemetry HUD */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Binary Search Studio
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${getStatusBadge(
                    currentStep?.status || "idle"
                  )}`}
                >
                  {currentStep?.status.replace("-", " ") || "idle"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-secondary/60 px-2 py-1 rounded-md border border-border">
                  <span className="text-[10px] uppercase text-muted-foreground">
                    Step:
                  </span>
                  <span className="text-foreground font-bold">
                    {currentStepIndex + 1}
                  </span>
                  <span className="text-muted-foreground/60">/</span>
                  <span>{Math.max(1, steps.length)}</span>
                </div>
              </div>
            </div>

            {/* Pointers Telemetry Strip */}
            {currentStep && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">
                    Low (L)
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {currentStep.low}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
                    Mid (M)
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {currentStep.mid >= 0 ? currentStep.mid : "—"}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">
                    High (H)
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {currentStep.high}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 col-span-3 sm:col-span-1">
                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                    {activeMode === "search-on-answer" ? "Max Hours" : "Target"}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {activeMode === "search-on-answer"
                      ? currentStep.maxHours ?? customHours
                      : currentStep.target ?? customTarget}
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* Visualizer Mode 1, 2, 4: Array-Based Displays */}
            {/* ========================================================= */}
            {activeMode !== "search-on-answer" && currentStep && (
              <div className="flex-1 flex flex-col justify-center items-center py-4 my-auto">
                <div className="w-full overflow-x-auto pb-4 pt-8 px-2 flex justify-center">
                  <div className="flex items-end gap-2 sm:gap-2.5">
                    {currentStep.array.map((val, idx) => {
                      const isLow = currentStep.low === idx;
                      const isMid = currentStep.mid === idx;
                      const isHigh = currentStep.high === idx;
                      const isDiscarded =
                        currentStep.discardedIndices?.includes(idx);
                      const isFound =
                        currentStep.foundIndex === idx ||
                        currentStep.lowerBoundResult === idx;
                      const isActiveRange =
                        idx >= currentStep.low && idx <= currentStep.high;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-1.5 transition-all duration-300 relative group"
                        >
                          {/* Live Pointer Badges Floating Above */}
                          <div className="h-6 flex items-center justify-center gap-1 text-[10px] font-mono font-bold">
                            {isLow && (
                              <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white shadow-sm animate-bounce">
                                L
                              </span>
                            )}
                            {isMid && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white shadow-sm animate-bounce">
                                M
                              </span>
                            )}
                            {isHigh && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-500 text-white shadow-sm animate-bounce">
                                H
                              </span>
                            )}
                          </div>

                          {/* Array Cell */}
                          <div
                            className={`w-11 sm:w-13 h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base transition-all duration-300 border-2 ${
                              isFound
                                ? "bg-emerald-500/25 border-emerald-500 text-emerald-600 dark:text-emerald-300 shadow-md shadow-emerald-500/20 scale-105"
                                : isMid
                                ? "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-300 shadow-md shadow-amber-500/20 scale-105"
                                : isActiveRange
                                ? "bg-primary/10 border-primary/40 text-foreground"
                                : isDiscarded
                                ? "bg-secondary/30 border-dashed border-border/60 text-muted-foreground/40 opacity-40"
                                : "bg-card border-border text-foreground"
                            }`}
                          >
                            <span>{val}</span>
                          </div>

                          {/* Index Label Below */}
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {idx}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-Pattern Specific Annotations */}
                {activeMode === "rotated-array" && currentStep && (
                  <div className="w-full mt-3 p-3 rounded-xl bg-secondary/40 border border-border flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Sorted Half:</span>
                      {currentStep.isLeftSorted ? (
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                          LEFT [low={currentStep.low} .. mid={currentStep.mid}]
                        </span>
                      ) : currentStep.isRightSorted ? (
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                          RIGHT [mid={currentStep.mid} .. high={currentStep.high}]
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Evaluating...</span>
                      )}
                    </div>

                    <div className="text-muted-foreground">
                      Target {currentStep.target}
                    </div>
                  </div>
                )}

                {activeMode === "lower-upper-bound" && currentStep && (
                  <div className="w-full mt-3 p-3 rounded-xl bg-secondary/40 border border-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Lower Bound (≥):</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {currentStep.lowerBoundResult !== undefined
                          ? `Index ${currentStep.lowerBoundResult}`
                          : "Searching..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Upper Bound (&gt;):</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">
                        {currentStep.upperBoundResult !== undefined
                          ? `Index ${currentStep.upperBoundResult}`
                          : "Searching..."}
                      </span>
                    </div>
                    {currentStep.lowerBoundResult !== undefined &&
                      currentStep.upperBoundResult !== undefined && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold">
                          Freq: {currentStep.upperBoundResult - currentStep.lowerBoundResult}
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* Visualizer Mode 3: Search On Answer (Koko Eating Bananas) */}
            {/* ========================================================= */}
            {activeMode === "search-on-answer" && currentStep && (
              <div className="flex-1 flex flex-col justify-center py-2 gap-4">
                {/* Banana Piles Bar Chart */}
                <div className="p-4 rounded-xl border border-border bg-background/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-amber-500" /> Banana Piles
                    </span>
                    <span className="text-foreground font-bold">
                      H = {currentStep.maxHours} hours
                    </span>
                  </div>

                  <div className="flex items-end justify-around h-32 pt-4 border-b border-border/80 px-2">
                    {(currentStep.piles || [3, 6, 7, 11]).map((pile, pIdx) => {
                      const speedK = currentStep.speedCandidate || 1;
                      const hoursForPile = Math.ceil(pile / speedK);
                      const maxPile = Math.max(
                        ...(currentStep.piles || [3, 6, 7, 11])
                      );
                      const heightPercent = Math.max(
                        20,
                        (pile / maxPile) * 100
                      );

                      return (
                        <div
                          key={pIdx}
                          className="flex flex-col items-center gap-1"
                        >
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {hoursForPile}h
                          </span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-10 sm:w-14 rounded-t-lg bg-amber-500/30 border-2 border-amber-500/60 flex items-center justify-center font-mono font-bold text-xs text-amber-600 dark:text-amber-300"
                          >
                            {pile}
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Pile {pIdx + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">
                      Formula: <code>ceil(pile / speed)</code>
                    </span>
                    <span className="text-foreground font-bold">
                      Total: {currentStep.calculatedHours ?? "—"} hrs
                    </span>
                  </div>
                </div>

                {/* Candidate Evaluation HUD */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-card border border-border flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase">
                      Testing Speed (K)
                    </span>
                    <span className="text-xl font-bold text-amber-500">
                      {currentStep.speedCandidate ?? currentStep.mid} ban/hr
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border flex flex-col gap-1 ${
                      currentStep.predicateResult === true
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : currentStep.predicateResult === false
                        ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                        : "bg-card border-border text-foreground"
                    }`}
                  >
                    <span className="text-[10px] uppercase text-muted-foreground">
                      Predicate f(k) ≤ H
                    </span>
                    <span className="text-sm font-bold flex items-center gap-1.5">
                      {currentStep.predicateResult === true ? (
                        <>
                          <Check className="h-4 w-4" /> Feasible (≤ {currentStep.maxHours}h)
                        </>
                      ) : currentStep.predicateResult === false ? (
                        <>
                          <X className="h-4 w-4" /> Too Slow (&gt; {currentStep.maxHours}h)
                        </>
                      ) : (
                        "Evaluating..."
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Invariant & Explanation Callout */}
            {currentStep && (
              <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/30 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-primary" /> Step State Transition
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {currentStep.formulaText}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {currentStep.explanation}
                </p>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/15">
                  <strong>Invariant:</strong> {currentStep.invariantNote}
                </div>
              </div>
            )}

            {/* Playback Controls Footer Bar */}
            <div className="flex flex-col gap-3 pt-3 border-t border-border/60">
              {/* Playback Slider */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, steps.length - 1)}
                  value={currentStepIndex}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentStepIndex(Number(e.target.value));
                  }}
                  className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetVisualization}
                    className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-all cursor-pointer"
                    title="Reset to Start"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    onClick={stepBackward}
                    disabled={currentStepIndex === 0}
                    className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-40 text-foreground transition-all cursor-pointer"
                    title="Previous Step"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                      isPlaying
                        ? "bg-amber-500 text-white shadow-amber-500/20"
                        : "bg-primary text-primary-foreground shadow-primary/20"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> {currentStepIndex >= steps.length - 1 ? "Replay" : "Play"}
                      </>
                    )}
                  </button>

                  <button
                    onClick={stepForward}
                    disabled={currentStepIndex >= steps.length - 1}
                    className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-40 text-foreground transition-all cursor-pointer"
                    title="Next Step"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Speed Selector */}
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Speed:</span>
                  {[
                    { label: "0.5x", val: 1000 },
                    { label: "1x", val: 600 },
                    { label: "2x", val: 250 },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSpeed(s.val)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                        speed === s.val
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 5 Columns on Desktop (Controls & Deep-Dive Invariants) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Pattern Switcher Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col gap-3 shadow-sm">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" /> Select Algorithmic Pattern
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleModeChange("lower-upper-bound")}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex flex-col gap-1 cursor-pointer ${
                  activeMode === "lower-upper-bound"
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-secondary/40 border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Lower &amp; Upper Bound</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Range [L, R) &amp; Frequency Count
                </span>
              </button>

              <button
                onClick={() => handleModeChange("rotated-array")}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex flex-col gap-1 cursor-pointer ${
                  activeMode === "rotated-array"
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-secondary/40 border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Rotated Sorted Array</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Sorted half check (LC 33)
                </span>
              </button>

              <button
                onClick={() => handleModeChange("search-on-answer")}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex flex-col gap-1 cursor-pointer ${
                  activeMode === "search-on-answer"
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-secondary/40 border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <Gauge className="h-3.5 w-3.5" />
                  <span>Search on Answer</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Monotonic Predicate (LC 875)
                </span>
              </button>

              <button
                onClick={() => handleModeChange("peak-element")}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex flex-col gap-1 cursor-pointer ${
                  activeMode === "peak-element"
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-secondary/40 border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <Mountain className="h-3.5 w-3.5" />
                  <span>Peak Element</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Gradient climb (LC 162)
                </span>
              </button>
            </div>
          </div>

          {/* Preset & Interactive Parameters Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col gap-4 shadow-sm">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-emerald-500" /> Pattern Configurations
            </span>

            {/* Presets List */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono text-muted-foreground">
                Domain Dataset Preset:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {currentPresets.map((preset: BinarySearchPatternPreset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetChange(preset.id)}
                    className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedPresetId === preset.id
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "bg-secondary/40 border-border/80 text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {preset.array?.length || preset.piles?.length} items
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode-Specific Parameter Sliders / Inputs */}
            {activeMode !== "peak-element" && (
              <div className="flex flex-col gap-3 pt-2 border-t border-border/60">
                {activeMode !== "search-on-answer" ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Search Target Value:</span>
                      <span className="font-bold text-foreground px-2 py-0.5 rounded bg-secondary">
                        {customTarget}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={20}
                        value={customTarget}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCustomTarget(val);
                          initializeSteps(
                            activeMode,
                            selectedPresetId,
                            val,
                            customHours
                          );
                        }}
                        className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Time Limit (H hours):</span>
                      <span className="font-bold text-foreground px-2 py-0.5 rounded bg-secondary">
                        {customHours} hrs
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={4}
                        max={15}
                        value={customHours}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCustomHours(val);
                          initializeSteps(
                            activeMode,
                            selectedPresetId,
                            customTarget,
                            val
                          );
                        }}
                        className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mathematical Invariants Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col gap-3 shadow-sm font-mono text-xs">
            <span className="font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-500" /> Mathematical Invariant Deep-Dive
            </span>

            {activeMode === "lower-upper-bound" && (
              <div className="space-y-2 text-muted-foreground text-[11px] leading-relaxed">
                <p>
                  <strong>Lower Bound [low, high):</strong> Maintains the invariant that all elements before <code>low</code> are strictly <code>&lt; target</code>, and all elements at or after <code>high</code> are <code>&ge; target</code>.
                </p>
                <p>
                  <strong>Loop Termination:</strong> Terminates when <code>low == high</code>. The resulting pointer marks the exact index of the first occurrence or where the element should be inserted.
                </p>
                <div className="p-2 rounded bg-secondary/50 border border-border text-foreground">
                  <code>Frequency = UpperBound(x) - LowerBound(x)</code>
                </div>
              </div>
            )}

            {activeMode === "rotated-array" && (
              <div className="space-y-2 text-muted-foreground text-[11px] leading-relaxed">
                <p>
                  <strong>The One-Sorted-Half Guarantee:</strong> In any rotated sorted array without duplicates, for any midpoint <code>mid</code>, at least one of <code>arr[low..mid]</code> or <code>arr[mid..high]</code> is strictly sorted.
                </p>
                <p>
                  <strong>Logarithmic Elimination:</strong> By testing target boundary inclusion on the guaranteed sorted half, 50% of elements are discarded unconditionally each turn.
                </p>
              </div>
            )}

            {activeMode === "search-on-answer" && (
              <div className="space-y-2 text-muted-foreground text-[11px] leading-relaxed">
                <p>
                  <strong>Monotone Step Function:</strong> The predicate <code>f(k) = (totalHours(k) &le; H)</code> maps monotonically: <code>[False, False, ..., True, True]</code>.
                </p>
                <p>
                  <strong>Ceiling Division Trick:</strong> To compute <code>ceil(p / k)</code> with pure integer operations without floating point inaccuracies, evaluate: <code>(p + k - 1) / k</code>.
                </p>
              </div>
            )}

            {activeMode === "peak-element" && (
              <div className="space-y-2 text-muted-foreground text-[11px] leading-relaxed">
                <p>
                  <strong>Ascending Hill Climbing:</strong> If <code>arr[mid] &lt; arr[mid+1]</code>, walking right is guaranteed to encounter a peak because <code>arr[n] = -∞</code>.
                </p>
                <p>
                  <strong>Convergence:</strong> Search interval <code>[low, high]</code> contracts monotonically until <code>low == high</code>, converging directly onto a peak.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
