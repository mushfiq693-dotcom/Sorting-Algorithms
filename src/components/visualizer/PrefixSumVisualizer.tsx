"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  PrefixSumEngine,
  PrefixSumStep,
  PrefixSumMode,
  PREFIX_SUM_PRESETS,
  RangeUpdate,
} from "@/algorithms/prefix-sum";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  TrendingUp,
  Workflow,
  CheckCircle2,
  Zap,
  Target,
  Hash,
  Layers,
  Grid,
  Divide,
  ArrowRight,
} from "lucide-react";

export function PrefixSumVisualizer() {
  // Config & Mode State
  const [activeMode, setActiveMode] = useState<PrefixSumMode>("1d-range-query");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("1d-metric-stream");
  const [speed, setSpeed] = useState<number>(500); // ms per step

  // 1D Parameter state
  const [queryL, setQueryL] = useState<number>(2);
  const [queryR, setQueryR] = useState<number>(5);

  // 2D Parameter state
  const [queryR1, setQueryR1] = useState<number>(1);
  const [queryC1, setQueryC1] = useState<number>(1);
  const [queryR2, setQueryR2] = useState<number>(2);
  const [queryC2, setQueryC2] = useState<number>(2);

  // Hash Prefix Parameter state (LC 560)
  const [targetK, setTargetK] = useState<number>(7);

  // Playback & Step State
  const [steps, setSteps] = useState<PrefixSumStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Steps on mode, preset, or parameter change
  const initializeSteps = useCallback(() => {
    const preset =
      PREFIX_SUM_PRESETS.find((p) => p.id === selectedPresetId) ||
      PREFIX_SUM_PRESETS.find((p) => p.mode === activeMode) ||
      PREFIX_SUM_PRESETS[0];

    let generated: PrefixSumStep[] = [];

    if (activeMode === "1d-range-query") {
      generated = PrefixSumEngine.generateSteps({
        mode: "1d-range-query",
        array1D: preset.array1D ?? [3, 1, 4, 1, 5, 9, 2, 6],
        queryL,
        queryR,
      });
    } else if (activeMode === "2d-range-query") {
      generated = PrefixSumEngine.generateSteps({
        mode: "2d-range-query",
        grid2D: preset.grid2D,
        queryR1,
        queryC1,
        queryR2,
        queryC2,
      });
    } else if (activeMode === "difference-array") {
      generated = PrefixSumEngine.generateSteps({
        mode: "difference-array",
        array1D: preset.array1D ?? [0, 0, 0, 0, 0, 0, 0, 0],
        updates: preset.updates,
      });
    } else if (activeMode === "hash-prefix") {
      generated = PrefixSumEngine.generateSteps({
        mode: "hash-prefix",
        array1D: preset.array1D ?? [3, 4, 7, 2, -3, 1, 4, 2],
        targetK,
      });
    }

    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [activeMode, selectedPresetId, queryL, queryR, queryR1, queryC1, queryR2, queryC2, targetK]);

  useEffect(() => {
    initializeSteps();
  }, [initializeSteps]);

  // Current active step snapshot
  const currentStep = useMemo<PrefixSumStep | null>(() => {
    if (steps.length === 0) return null;
    return steps[Math.min(currentStepIndex, steps.length - 1)];
  }, [steps, currentStepIndex]);

  // Confetti effect on completion
  useEffect(() => {
    if (
      currentStep &&
      currentStep.status === "completed" &&
      currentStepIndex === steps.length - 1 &&
      steps.length > 1
    ) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Safe fallback
      }
    }
  }, [currentStep, currentStepIndex, steps.length]);

  // Transport loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
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

  // Transport Controls
  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
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

  const handleModeChange = (mode: PrefixSumMode) => {
    setActiveMode(mode);
    const matchingPreset = PREFIX_SUM_PRESETS.find((p) => p.mode === mode);
    if (matchingPreset) {
      setSelectedPresetId(matchingPreset.id);
      if (matchingPreset.queryL !== undefined) setQueryL(matchingPreset.queryL);
      if (matchingPreset.queryR !== undefined) setQueryR(matchingPreset.queryR);
      if (matchingPreset.queryR1 !== undefined) setQueryR1(matchingPreset.queryR1);
      if (matchingPreset.queryC1 !== undefined) setQueryC1(matchingPreset.queryC1);
      if (matchingPreset.queryR2 !== undefined) setQueryR2(matchingPreset.queryR2);
      if (matchingPreset.queryC2 !== undefined) setQueryC2(matchingPreset.queryC2);
      if (matchingPreset.targetK !== undefined) setTargetK(matchingPreset.targetK);
    }
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PREFIX_SUM_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setActiveMode(preset.mode);
      if (preset.queryL !== undefined) setQueryL(preset.queryL);
      if (preset.queryR !== undefined) setQueryR(preset.queryR);
      if (preset.queryR1 !== undefined) setQueryR1(preset.queryR1);
      if (preset.queryC1 !== undefined) setQueryC1(preset.queryC1);
      if (preset.queryR2 !== undefined) setQueryR2(preset.queryR2);
      if (preset.queryC2 !== undefined) setQueryC2(preset.queryC2);
      if (preset.targetK !== undefined) setTargetK(preset.targetK);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto select-text font-body">
      {/* Studio Grid: Left Visual Stage (7 cols), Right Controls & Math (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Visual Canvas + Telemetry + Transport (7 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Visualizer Stage Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm dark:shadow-2xl flex flex-col gap-5">
            {/* Stage Header & Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {activeMode === "1d-range-query"
                    ? "1D Range Sum Query"
                    : activeMode === "2d-range-query"
                    ? "2D Matrix (Inclusion-Exclusion)"
                    : activeMode === "difference-array"
                    ? "Difference Array (O(1) Updates)"
                    : "Hash Prefix (Subarray Sum = K)"}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Step {currentStepIndex + 1} / {steps.length || 1}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {currentStep?.status === "building" && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Precomputing P[]
                  </span>
                )}
                {currentStep?.status === "querying" && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse">
                    O(1) Query Evaluation
                  </span>
                )}
                {currentStep?.status === "updating" && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    O(1) Boundary Write
                  </span>
                )}
                {currentStep?.status === "reconstructing" && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    O(n) Sweep Sweep
                  </span>
                )}
                {currentStep?.status === "completed" && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </span>
                )}
              </div>
            </div>

            {/* Canvas Area: Mode-Specific Renderers */}
            <div className="flex flex-col gap-4 min-h-[300px]">
              {/* -------------------------------------------------- */}
              {/* 1D MODE CANVAS */}
              {/* -------------------------------------------------- */}
              {activeMode === "1d-range-query" && currentStep?.array1D && (
                <div className="flex flex-col gap-5 py-2">
                  {/* Original Array A */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span className="font-semibold text-foreground">Original Array A (0-Indexed)</span>
                      <span>Target Subarray: [{queryL} ... {queryR}]</span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
                      {currentStep.array1D.map((val, idx) => {
                        const inRange = idx >= queryL && idx <= queryR;
                        const isUnderConstruction = currentStep.highlightIndices1D?.includes(idx);
                        return (
                          <div
                            key={`a-${idx}`}
                            className={`flex flex-col items-center justify-center min-w-[44px] h-14 rounded-xl border text-sm font-mono font-bold transition-all relative ${
                              inRange
                                ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                : isUnderConstruction
                                ? "border-blue-500 bg-blue-500/15 text-blue-600 dark:text-blue-300 ring-2 ring-blue-500/30"
                                : "border-border bg-secondary/40 text-foreground"
                            }`}
                          >
                            <span className="text-[10px] text-muted-foreground font-normal absolute top-1">
                              {idx}
                            </span>
                            <span className="pt-2">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prefix Array P */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Prefix Array P (1-Indexed, Size N+1)
                      </span>
                      <span className="text-emerald-500 font-bold">
                        P[0] = 0 (Base Case)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
                      {currentStep.prefix1D?.map((val, idx) => {
                        const highlight = currentStep.prefixHighlightIndices?.find(
                          (h) => h.index === idx
                        );
                        const isPositive = highlight?.role === "positive";
                        const isNegative = highlight?.role === "negative";
                        const isActive = highlight?.role === "active";

                        return (
                          <div
                            key={`p-${idx}`}
                            className={`flex flex-col items-center justify-center min-w-[44px] h-14 rounded-xl border text-sm font-mono font-bold transition-all relative ${
                              isPositive
                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500"
                                : isNegative
                                ? "border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.3)] ring-2 ring-rose-500"
                                : isActive
                                ? "border-blue-500 bg-blue-500/20 text-blue-600 dark:text-blue-300"
                                : "border-border bg-card/60 text-foreground"
                            }`}
                          >
                            <span className="text-[10px] text-muted-foreground font-normal absolute top-1">
                              P[{idx}]
                            </span>
                            <span className="pt-2">{val}</span>
                            {isPositive && (
                              <span className="absolute -bottom-2 text-[9px] px-1 rounded bg-emerald-500 text-white font-bold">
                                +P[R+1]
                              </span>
                            )}
                            {isNegative && (
                              <span className="absolute -bottom-2 text-[9px] px-1 rounded bg-rose-500 text-white font-bold">
                                -P[L]
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Formula Telemetry HUD */}
                  {currentStep.computedSum !== undefined && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-bold">O(1) Evaluation:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          P[{queryR + 1}] - P[{queryL}] = {currentStep.prefix1D?.[queryR + 1]} - {currentStep.prefix1D?.[queryL]} = {currentStep.computedSum}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Sum = {currentStep.computedSum}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* 2D MODE CANVAS */}
              {/* -------------------------------------------------- */}
              {activeMode === "2d-range-query" && currentStep?.grid2D && (
                <div className="flex flex-col gap-4 py-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Grid */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono font-semibold text-foreground">
                        Original Grid A [{currentStep.grid2D.length}×{currentStep.grid2D[0].length}]
                      </span>
                      <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl border border-border bg-secondary/30">
                        {currentStep.grid2D.map((row, r) =>
                          row.map((val, c) => {
                            const isSelected =
                              r >= queryR1 &&
                              r <= queryR2 &&
                              c >= queryC1 &&
                              c <= queryC2;
                            return (
                              <div
                                key={`g-${r}-${c}`}
                                className={`flex flex-col items-center justify-center h-11 rounded-lg border font-mono text-xs font-bold transition-all ${
                                  isSelected
                                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 ring-2 ring-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                                    : "border-border bg-card/60 text-foreground"
                                }`}
                              >
                                <span>{val}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Cumulative Matrix P */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono font-semibold text-foreground">
                        Prefix Matrix P [5×5] (4 Inclusion-Exclusion Points)
                      </span>
                      <div className="grid grid-cols-5 gap-1 p-2 rounded-xl border border-border bg-secondary/30">
                        {currentStep.prefix2D?.map((row, r) =>
                          row.map((val, c) => {
                            const highlight = currentStep.prefixHighlightCells2D?.find(
                              (h) => h.r === r && h.c === c
                            );
                            const role = highlight?.role;
                            return (
                              <div
                                key={`p2-${r}-${c}`}
                                className={`flex flex-col items-center justify-center h-9 rounded-md border font-mono text-[11px] font-bold transition-all relative ${
                                  role === "positive"
                                    ? "border-emerald-500 bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 ring-2 ring-emerald-500"
                                    : role === "negative"
                                    ? "border-rose-500 bg-rose-500/25 text-rose-600 dark:text-rose-300 ring-2 ring-rose-500"
                                    : role === "overlap"
                                    ? "border-amber-500 bg-amber-500/25 text-amber-600 dark:text-amber-300 ring-2 ring-amber-500"
                                    : "border-border/60 bg-card/40 text-muted-foreground"
                                }`}
                              >
                                <span>{val}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inclusion-Exclusion Formula Box */}
                  {currentStep.inclusionExclusion && (
                    <div className="p-3.5 rounded-xl border border-border bg-card font-mono text-xs flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span>4-Term Inclusion-Exclusion Breakdown</span>
                        <span className="text-cyan-500 font-bold">O(1) Arithmetic</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap text-foreground font-semibold">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          + P[{queryR2 + 1}][{queryC2 + 1}] ({currentStep.inclusionExclusion.bottomRight.val})
                        </span>
                        <span className="text-rose-600 dark:text-rose-400">
                          - P[{queryR1}][{queryC2 + 1}] ({currentStep.inclusionExclusion.topRegion?.val})
                        </span>
                        <span className="text-rose-600 dark:text-rose-400">
                          - P[{queryR2 + 1}][{queryC1}] ({currentStep.inclusionExclusion.leftRegion?.val})
                        </span>
                        <span className="text-amber-600 dark:text-amber-400">
                          + P[{queryR1}][{queryC1}] ({currentStep.inclusionExclusion.topLeftOverlap?.val})
                        </span>
                        <span>=</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                          {currentStep.subgridSum ?? 0}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* DIFFERENCE ARRAY CANVAS */}
              {/* -------------------------------------------------- */}
              {activeMode === "difference-array" && currentStep?.diffArray && (
                <div className="flex flex-col gap-4 py-2">
                  {/* Difference Array D */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Difference Array D (Boundary Markers)
                      </span>
                      <span className="text-amber-500">
                        D[L] += val, D[R+1] -= val
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
                      {currentStep.diffArray.map((val, idx) => {
                        const highlight = currentStep.diffHighlightIndices?.find(
                          (h) => h.index === idx
                        );
                        const isAdd = highlight?.role === "add";
                        const isSub = highlight?.role === "subtract";
                        const isCarry = highlight?.role === "carry";
                        return (
                          <div
                            key={`d-${idx}`}
                            className={`flex flex-col items-center justify-center min-w-[44px] h-14 rounded-xl border text-sm font-mono font-bold transition-all relative ${
                              isAdd
                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 ring-2 ring-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                : isSub
                                ? "border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-300 ring-2 ring-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                                : isCarry
                                ? "border-purple-500 bg-purple-500/20 text-purple-600 dark:text-purple-300 ring-2 ring-purple-500"
                                : "border-border bg-card/60 text-foreground"
                            }`}
                          >
                            <span className="text-[10px] text-muted-foreground font-normal absolute top-1">
                              D[{idx}]
                            </span>
                            <span className="pt-2">{val > 0 ? `+${val}` : val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reconstructed Final Array A' */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Reconstructed Array A&apos; (Cumulative Prefix of D)
                      </span>
                      <span className="text-emerald-500 font-bold">O(n) Sweep</span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
                      {currentStep.reconstructedArray?.map((val, idx) => (
                        <div
                          key={`rec-${idx}`}
                          className="flex flex-col items-center justify-center min-w-[44px] h-14 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-sm font-mono font-bold relative"
                        >
                          <span className="text-[10px] text-muted-foreground font-normal absolute top-1">
                            A&apos;[{idx}]
                          </span>
                          <span className="pt-2">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* HASH PREFIX CANVAS (LC 560) */}
              {/* -------------------------------------------------- */}
              {activeMode === "hash-prefix" && currentStep?.array1D && (
                <div className="flex flex-col gap-4 py-2">
                  {/* Array scan row */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Linear Array Scan (Target K = {targetK})
                      </span>
                      <span className="text-purple-500 font-bold">
                        Matching Subarrays: {currentStep.totalSubarraysCount ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
                      {currentStep.array1D.map((val, idx) => {
                        const isCurrent = currentStep.currentIndex === idx;
                        return (
                          <div
                            key={`hp-${idx}`}
                            className={`flex flex-col items-center justify-center min-w-[44px] h-14 rounded-xl border text-sm font-mono font-bold transition-all relative ${
                              isCurrent
                                ? "border-purple-500 bg-purple-500/25 text-purple-600 dark:text-purple-300 ring-2 ring-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                                : idx < (currentStep.currentIndex ?? -1)
                                ? "border-border/60 bg-secondary/30 text-muted-foreground"
                                : "border-border bg-card/60 text-foreground"
                            }`}
                          >
                            <span className="text-[10px] text-muted-foreground font-normal absolute top-1">
                              {idx}
                            </span>
                            <span className="pt-2">{val}</span>
                            {isCurrent && (
                              <span className="absolute -bottom-2 text-[9px] px-1 rounded bg-purple-600 text-white font-bold">
                                i
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Hash Map Frequency Registry */}
                  <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-border bg-card/60">
                    <span className="text-xs font-mono font-semibold text-foreground">
                      Prefix Frequency Hash Map: &#123; prefixSum: frequency &#125;
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.entries(currentStep.prefixHashMap || {}).map(([key, count]) => {
                        const isNeeded = Number(key) === currentStep.neededPrefixSum;
                        return (
                          <div
                            key={`map-${key}`}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                              isNeeded
                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 ring-2 ring-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                                : "border-border bg-secondary/40 text-foreground"
                            }`}
                          >
                            <span className="text-muted-foreground">Sum {key}:</span>
                            <span className="font-bold">{count}x</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation & Invariant Telemetry Box */}
            <div className="p-3.5 rounded-xl border border-border bg-secondary/40 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between text-muted-foreground text-[11px] font-mono">
                <span className="text-foreground font-semibold flex items-center gap-1.5">
                  <Workflow className="h-3.5 w-3.5 text-primary" />
                  Algorithm Step Trace
                </span>
                <span className="text-foreground font-mono font-bold">
                  {currentStep?.formulaText}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {currentStep?.explanation}
              </p>
              <div className="pt-1.5 border-t border-border/50 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                {currentStep?.invariantNote}
              </div>
            </div>

            {/* Transport Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              {/* Playback Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Play
                    </>
                  )}
                </button>

                <button
                  onClick={handleStepBackward}
                  disabled={currentStepIndex === 0}
                  className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={currentStepIndex >= steps.length - 1}
                  className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 transition-all cursor-pointer"
                  title="Reset to Step 0"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span>Speed:</span>
                <input
                  type="range"
                  min="150"
                  max="1000"
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-24 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="w-12 text-right">{speed}ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Controls, Mode Switcher & Invariants (5 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Technique Mode Selector */}
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-emerald-500" />
              Prefix Sum Pattern
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleModeChange("1d-range-query")}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  activeMode === "1d-range-query"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1 font-bold">
                  <Layers className="h-3.5 w-3.5" /> 1D Range Query
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  P[R+1] - P[L] in O(1)
                </span>
              </button>

              <button
                onClick={() => handleModeChange("2d-range-query")}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  activeMode === "2d-range-query"
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 shadow-sm"
                    : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1 font-bold">
                  <Grid className="h-3.5 w-3.5" /> 2D Matrix Subgrid
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Inclusion-Exclusion in O(1)
                </span>
              </button>

              <button
                onClick={() => handleModeChange("difference-array")}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  activeMode === "difference-array"
                    ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-sm"
                    : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1 font-bold">
                  <Divide className="h-3.5 w-3.5" /> Difference Array
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Range updates in O(1)
                </span>
              </button>

              <button
                onClick={() => handleModeChange("hash-prefix")}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  activeMode === "hash-prefix"
                    ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 shadow-sm"
                    : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1 font-bold">
                  <Hash className="h-3.5 w-3.5" /> Subarray Sum = K
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  LC 560 Prefix Hash Map
                </span>
              </button>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-2.5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              Domain Problem Presets
            </span>
            <select
              value={selectedPresetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {PREFIX_SUM_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Parameters Card */}
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3.5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-primary" />
              Interactive Query Parameters
            </span>

            {/* 1D Parameters: L and R */}
            {activeMode === "1d-range-query" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Query Left Boundary (L):</span>
                    <span className="font-bold text-foreground">{queryL}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={queryR}
                    value={queryL}
                    onChange={(e) => setQueryL(Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Query Right Boundary (R):</span>
                    <span className="font-bold text-foreground">{queryR}</span>
                  </div>
                  <input
                    type="range"
                    min={queryL}
                    max="7"
                    value={queryR}
                    onChange={(e) => setQueryR(Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            )}

            {/* 2D Parameters */}
            {activeMode === "2d-range-query" && (
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Row Top (r1): {queryR1}</span>
                  <input
                    type="range"
                    min="0"
                    max={queryR2}
                    value={queryR1}
                    onChange={(e) => setQueryR1(Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Row Bottom (r2): {queryR2}</span>
                  <input
                    type="range"
                    min={queryR1}
                    max="3"
                    value={queryR2}
                    onChange={(e) => setQueryR2(Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Col Left (c1): {queryC1}</span>
                  <input
                    type="range"
                    min="0"
                    max={queryC2}
                    value={queryC1}
                    onChange={(e) => setQueryC1(Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Col Right (c2): {queryC2}</span>
                  <input
                    type="range"
                    min={queryC1}
                    max="3"
                    value={queryC2}
                    onChange={(e) => setQueryC2(Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            )}

            {/* Hash Prefix Target K */}
            {activeMode === "hash-prefix" && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Target Subarray Sum (K):</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{targetK}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="15"
                  value={targetK}
                  onChange={(e) => setTargetK(Number(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            )}

            {/* Difference Array Summary */}
            {activeMode === "difference-array" && (
              <div className="p-2.5 rounded-xl border border-border bg-secondary/30 text-xs font-mono flex flex-col gap-1">
                <span className="text-muted-foreground">Batch Operations:</span>
                <span className="text-foreground">3 Simultaneous Range Updates</span>
                <span className="text-emerald-500 font-bold">O(Q) writes + O(N) sweep</span>
              </div>
            )}
          </div>

          {/* Mathematical Invariants Card (Strictly NO static C++ code box) */}
          <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Mathematical Invariants &amp; Bounds
            </span>
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="p-2 rounded-lg bg-secondary/40 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">Precomputation:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">O(N) One-Time</span>
              </div>
              <div className="p-2 rounded-lg bg-secondary/40 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">Per-Query Cost:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">O(1) Instant</span>
              </div>
              <div className="p-2 rounded-lg bg-secondary/40 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">Difference Update:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">O(1) 2-Points</span>
              </div>
              <div className="p-2 rounded-lg bg-secondary/40 border border-border/60 flex items-center justify-between">
                <span className="text-muted-foreground">Hash Prefix (LC 560):</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">O(N) Single-Pass</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong>Core Guarantee:</strong> Prefix summation decouples query execution time from interval size. Whether query length is 2 or 10,000,000 elements, computation takes strictly 1 subtraction step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
