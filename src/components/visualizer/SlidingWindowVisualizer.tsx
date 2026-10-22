"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  SlidingWindowEngine,
  SlidingWindowStep,
  SlidingWindowMode,
  SLIDING_WINDOW_PRESETS,
} from "@/algorithms/sliding-window";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  Maximize2,
  Minimize2,
  TrendingUp,
  Workflow,
  CheckCircle2,
  Flame,
  Zap,
  Target,
  Hash,
  Layers,
} from "lucide-react";

export function SlidingWindowVisualizer() {
  // Config & Mode State
  const [activeMode, setActiveMode] = useState<SlidingWindowMode>("fixed");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("fixed-max-sum");
  const [speed, setSpeed] = useState<number>(500); // ms per step
  const [windowK, setWindowK] = useState<number>(3);
  const [targetSum, setTargetSum] = useState<number>(7);
  const [maxFlips, setMaxFlips] = useState<number>(2);

  // Playback & Step State
  const [steps, setSteps] = useState<SlidingWindowStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Steps on mode, preset, or parameter change
  const initializeSteps = useCallback(
    (
      mode: SlidingWindowMode,
      kVal: number = 3,
      targetVal: number = 7,
      flipsVal: number = 2
    ) => {
      const preset =
        SLIDING_WINDOW_PRESETS.find((p) => p.mode === mode) ||
        SLIDING_WINDOW_PRESETS[0];

      const generated = SlidingWindowEngine.generateSteps(mode, preset.array, {
        windowSize: kVal,
        target: targetVal,
        maxFlips: flipsVal,
      });

      setSteps(generated);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  useEffect(() => {
    initializeSteps(activeMode, windowK, targetSum, maxFlips);
  }, [activeMode, windowK, targetSum, maxFlips, initializeSteps]);

  // Current active step snapshot
  const currentStep = useMemo<SlidingWindowStep | null>(() => {
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
            confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speed]);

  // Handlers
  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleModeChange = (newMode: SlidingWindowMode) => {
    setActiveMode(newMode);
    const matchedPreset = SLIDING_WINDOW_PRESETS.find((p) => p.mode === newMode);
    if (matchedPreset) {
      setSelectedPresetId(matchedPreset.id);
      if (matchedPreset.windowSize) setWindowK(matchedPreset.windowSize);
      if (matchedPreset.target) setTargetSum(matchedPreset.target);
      if (matchedPreset.maxFlips) setMaxFlips(matchedPreset.maxFlips);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = SLIDING_WINDOW_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setActiveMode(preset.mode);
    if (preset.windowSize) setWindowK(preset.windowSize);
    if (preset.target) setTargetSum(preset.target);
    if (preset.maxFlips) setMaxFlips(preset.maxFlips);
    initializeSteps(
      preset.mode,
      preset.windowSize ?? windowK,
      preset.target ?? targetSum,
      preset.maxFlips ?? maxFlips
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full select-text font-body">
      {/* 7:5 Studio Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================
            LEFT COLUMN (7 cols): Visual Stage + Telemetry + Transport
            ======================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Visualizer Stage */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm dark:shadow-xl flex flex-col gap-5">
            {/* Stage Header */}
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400">
                <Sliders className="h-4 w-4" />
                <span>
                  {activeMode === "fixed"
                    ? "Fixed-Size Window (K-Slide)"
                    : activeMode === "dynamic-sum"
                    ? "Dynamic Window (Sum >= Target)"
                    : activeMode === "longest-unique"
                    ? "Auxiliary Hash Frequency Window"
                    : "At-Most-K Condition Window"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
                <span>
                  Step {steps.length > 0 ? currentStepIndex + 1 : 0} of {steps.length}
                </span>
              </div>
            </div>

            {/* Interactive Array Cell Track with Window Bracket Highlights */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Active Data Buffer</span>
                {currentStep && (
                  <span className="text-fuchsia-400 font-bold">
                    Window: [{currentStep.left}..{currentStep.right}] (Length:{" "}
                    {Math.max(0, currentStep.right - currentStep.left + 1)})
                  </span>
                )}
              </div>

              {/* Cell Track */}
              <div className="flex items-center gap-2 overflow-x-auto py-4 px-2 bg-secondary/30 rounded-xl border border-border/80 no-scrollbar">
                {currentStep?.array.map((item, idx) => {
                  const isLeft = idx === currentStep.left;
                  const isRight = idx === currentStep.right;
                  const isInsideWindow = currentStep.windowIndices.includes(idx);
                  const isHighlighted = currentStep.highlightIndices.includes(idx);

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1.5 shrink-0"
                    >
                      {/* Left Pointer Marker */}
                      <div className="h-5 flex items-center justify-center font-mono text-[10px] font-bold">
                        {isLeft && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow-xs animate-bounce">
                            [L
                          </span>
                        )}
                      </div>

                      {/* Array Value Cell */}
                      <div
                        className={`w-11 h-12 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm sm:text-base border-2 transition-all duration-200 select-none ${
                          isHighlighted
                            ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105"
                            : isInsideWindow
                            ? "border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.25)]"
                            : "border-border bg-card/60 text-muted-foreground"
                        }`}
                      >
                        {String(item)}
                      </div>

                      {/* Index / Right Pointer Marker */}
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {idx}
                        </span>
                        {isRight && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold shadow-xs animate-bounce">
                            R]
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Telemetry HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Metric 1: Current Window Size */}
              <div className="p-3 rounded-xl border border-border bg-secondary/40 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Window Length
                </span>
                <span className="text-base font-bold font-mono text-foreground">
                  {currentStep
                    ? Math.max(0, currentStep.right - currentStep.left + 1)
                    : 0}
                </span>
              </div>

              {/* Metric 2: Window Sum or Zeros */}
              {activeMode === "fixed" || activeMode === "dynamic-sum" ? (
                <div className="p-3 rounded-xl border border-border bg-secondary/40 flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Current Sum
                  </span>
                  <span className="text-base font-bold font-mono text-cyan-400">
                    {currentStep?.windowSum ?? 0}
                  </span>
                </div>
              ) : activeMode === "at-most-k" ? (
                <div className="p-3 rounded-xl border border-border bg-secondary/40 flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Zeros in Window
                  </span>
                  <span
                    className={`text-base font-bold font-mono ${
                      (currentStep?.zeroCount ?? 0) > maxFlips
                        ? "text-rose-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {currentStep?.zeroCount ?? 0} / {maxFlips}
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-border bg-secondary/40 flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Unique Chars
                  </span>
                  <span className="text-base font-bold font-mono text-cyan-400">
                    {currentStep?.charFrequency
                      ? Object.keys(currentStep.charFrequency).length
                      : 0}
                  </span>
                </div>
              )}

              {/* Metric 3: Target or Condition */}
              <div className="p-3 rounded-xl border border-border bg-secondary/40 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {activeMode === "fixed"
                    ? "Target Size K"
                    : activeMode === "dynamic-sum"
                    ? "Target Sum S"
                    : activeMode === "at-most-k"
                    ? "Max Flips K"
                    : "Condition"}
                </span>
                <span className="text-base font-bold font-mono text-amber-400">
                  {activeMode === "fixed"
                    ? windowK
                    : activeMode === "dynamic-sum"
                    ? `>= ${targetSum}`
                    : activeMode === "at-most-k"
                    ? `<= ${maxFlips}`
                    : "No Duplicates"}
                </span>
              </div>

              {/* Metric 4: Optimal Record */}
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {activeMode === "fixed"
                    ? "Best Max Sum"
                    : activeMode === "dynamic-sum"
                    ? "Best Min Length"
                    : "Best Max Length"}
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-300">
                  {activeMode === "fixed"
                    ? currentStep?.bestSum !== undefined && currentStep.bestSum !== -Infinity
                      ? currentStep.bestSum
                      : "—"
                    : activeMode === "dynamic-sum"
                    ? currentStep?.minLen !== undefined && currentStep.minLen !== Infinity
                      ? currentStep.minLen
                      : "—"
                    : currentStep?.maxLen ?? 0}
                </span>
              </div>
            </div>

            {/* Invariant Note Card */}
            {currentStep?.invariantNote && (
              <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/20 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/90 font-mono leading-relaxed">
                  {currentStep.invariantNote}
                </p>
              </div>
            )}

            {/* Live Step Explanation Banner */}
            <div className="p-4 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-fuchsia-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400">
                  State Telemetry • Step {currentStepIndex + 1}
                </span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {currentStep?.explanation || "Ready to begin sliding window execution."}
                </p>
              </div>
            </div>

            {/* Transport & Playback Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              {/* Play / Pause / Step Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePlayPause}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 text-white text-xs font-semibold shadow-md shadow-fuchsia-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>{currentStepIndex >= steps.length - 1 ? "Replay" : "Play"}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStepBackward}
                  disabled={currentStepIndex === 0 || isPlaying}
                  className="p-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Step Backward"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={currentStepIndex >= steps.length - 1 || isPlaying}
                  className="p-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Step Forward"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-foreground active:scale-95 transition-all cursor-pointer"
                  title="Reset to Start"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span>Speed:</span>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-24 sm:w-28 accent-fuchsia-500 cursor-pointer"
                />
                <span className="w-12 text-right">{speed}ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (5 cols): Pattern Switcher, Parameters & Invariants
            (Strictly NO static C++ code box clutter!)
            ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
          {/* 1. Paradigm / Pattern Switcher */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              <Sliders className="h-4 w-4 text-fuchsia-500" />
              <span>Select Sliding Window Pattern</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleModeChange("fixed")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeMode === "fixed"
                    ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-300 font-bold shadow-xs"
                    : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Fixed Window</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                  Max Sum (K = 3)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("dynamic-sum")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeMode === "dynamic-sum"
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 font-bold shadow-xs"
                    : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Dynamic Sum</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                  Min Size (Sum ≥ 7)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("longest-unique")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeMode === "longest-unique"
                    ? "border-amber-500 bg-amber-500/10 text-amber-300 font-bold shadow-xs"
                    : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Unique Chars</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                  No Duplicates
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("at-most-k")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  activeMode === "at-most-k"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold shadow-xs"
                    : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Hash className="h-3.5 w-3.5" />
                  <span>At-Most-K</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground block mt-0.5">
                  Max Ones (K flips)
                </span>
              </button>
            </div>
          </div>

          {/* 2. Interactive Parameters & Preset Controls */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Target className="h-4 w-4 text-cyan-500" />
                <span>Execution Parameters</span>
              </span>
            </div>

            {/* Mode-Specific Parameter Sliders */}
            {activeMode === "fixed" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Fixed Window Size K:</span>
                  <span className="font-bold text-fuchsia-400">{windowK} elements</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={windowK}
                  onChange={(e) => setWindowK(Number(e.target.value))}
                  className="w-full accent-fuchsia-500 cursor-pointer"
                />
              </div>
            )}

            {activeMode === "dynamic-sum" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Target Threshold Sum:</span>
                  <span className="font-bold text-cyan-400">≥ {targetSum}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  value={targetSum}
                  onChange={(e) => setTargetSum(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            )}

            {activeMode === "at-most-k" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Max Allowed Flips (K):</span>
                  <span className="font-bold text-emerald-400">{maxFlips} zeros</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={maxFlips}
                  onChange={(e) => setMaxFlips(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}

            {/* Domain Preset Selector */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <span className="text-[11px] font-mono text-muted-foreground block">
                Domain Presets:
              </span>
              <div className="flex flex-col gap-1.5">
                {SLIDING_WINDOW_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      selectedPresetId === preset.id
                        ? "border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300 font-semibold"
                        : "border border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="font-semibold">{preset.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Mathematical Invariants Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-400">
              <TrendingUp className="h-4 w-4" />
              <span>Mathematical Invariants &amp; Proofs</span>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground font-sans leading-relaxed">
              <div className="p-2.5 rounded-xl border border-border/60 bg-background/50 space-y-1 font-mono">
                <span className="text-foreground font-bold">1. Single-Pass O(n) Bound:</span>
                <p className="text-[11px] text-muted-foreground">
                  The right pointer R increments at most n times. The left pointer L increments at most n times. Total pointer movements ≤ 2n = O(n).
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-border/60 bg-background/50 space-y-1 font-mono">
                <span className="text-foreground font-bold">2. O(1) Delta Update:</span>
                <p className="text-[11px] text-muted-foreground">
                  sum_new = sum_old - arr[left - 1] + arr[right]. Converting nested O(n·k) summations into 2 scalar operations.
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-border/60 bg-background/50 space-y-1 font-mono">
                <span className="text-foreground font-bold">3. Monotonic Left Hopping:</span>
                <p className="text-[11px] text-muted-foreground">
                  left = max(left, lastSeen[c] + 1) guarantees left never moves backwards, maintaining strictly non-decreasing traversal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
