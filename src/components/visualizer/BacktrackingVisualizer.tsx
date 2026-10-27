"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  BacktrackingEngine,
  BacktrackStep,
  BacktrackingMode,
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
  Flame,
  Zap,
  Target,
  Activity,
  CheckCircle2,
  Crown,
  LayoutGrid,
} from "lucide-react";

export function BacktrackingVisualizer() {
  // Config & Mode State
  const [activeMode, setActiveMode] = useState<BacktrackingMode>("n-queens");
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
              confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
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

  // Derived board for rendering
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

  // Pre-compute dynamic classNames (avoid nested ternary template literals in JSX)
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

  const branchClassName = useMemo(() => {
    if (!currentStep) return "bg-secondary border-border text-muted-foreground";
    if (currentStep.status === "placing")
      return "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400";
    if (currentStep.status === "backtracking")
      return "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400";
    if (currentStep.status === "solved")
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";
    return "bg-secondary border-border text-muted-foreground";
  }, [currentStep]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto font-body">
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Control Hub (5 cols) */}
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
            <div className="min-h-[260px] sm:min-h-[320px] flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-secondary/30 border border-border/70 relative">
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
                                className={`aspect-square min-w-[40px] sm:min-w-[48px] rounded-lg border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${cellClassName}`}
                              >
                                {isQueen ? "♛" : isTrial ? "?" : ""}
                                <span className="absolute top-1 left-1 text-[8px] text-muted-foreground/60 font-mono">
                                  [{r},{c}]
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Active Placement / Backtrack Banner */}
                      {currentStep.col !== null && currentStep.row !== null && (
                        <div className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center justify-between w-full ${bannerClassName}`}>
                          <span className="flex items-center gap-1.5">
                            {currentStep.status === "valid" && <CheckCircle2 className="w-3 h-3" />}
                            {currentStep.status === "conflict" && <Crown className="w-3 h-3 text-rose-400" />}
                            {currentStep.status === "backtracking" && <RotateCcw className="w-3 h-3 text-amber-400" />}
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

                      {/* No Solution Banner */}
                      {currentStep.status === "no-solution" && (
                        <div className="px-4 py-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-500 font-bold text-xs font-mono flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          <span>No solution exists — backtracking exhausted all branches.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============ MODE 2: SUBSETS DECISION TREE ============ */}
                  {activeMode === "subsets" && currentStep.subset !== undefined && currentStep.index !== undefined && (
                    <div className="w-full flex flex-col items-center gap-6 py-4">
                      {/* Element Decision Strip */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        {preset.set?.map((val, i) => {
                          const idx = currentStep.index!;
                          const isCurrent = i === idx;
                          const isDecided = i < idx;
                          const isIncluded = currentStep.subset?.includes(val) ?? false;
                          const elClassName = isCurrent
                            ? "bg-amber-500/30 text-amber-400 border-amber-400 shadow-md shadow-amber-500/30 scale-105 animate-pulse"
                            : isDecided
                            ? isIncluded
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-400"
                              : "bg-secondary/40 text-muted-foreground/50 border-border/50 line-through opacity-50"
                            : "bg-card text-foreground border-border/80";
                          return (
                            <div key={i} className="flex flex-col items-center gap-1.5">
                              <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${elClassName}`}>
                                {val}
                              </div>
                              <span className="text-[9px] font-mono text-muted-foreground">idx[{i}]</span>
                              {isCurrent && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-xs font-mono text-foreground border border-border">
                                  {isIncluded ? "INCLUDED" : "PENDING"}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Current Subset Shelf */}
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card text-xs font-mono">
                        <span className="text-muted-foreground">Current Subset:</span>
                        <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                          [{currentStep.subset.join(", ") || "∅"}]
                        </span>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-[10px] text-muted-foreground">
                          {currentStep.subset.length} of {preset.set?.length} elements decided
                        </span>
                      </div>

                      {/* Decision Branch Indicator */}
                      <div className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center justify-between w-full ${branchClassName}`}>
                        <span className="flex items-center gap-1.5">
                          {currentStep.status === "placing" && <Target className="w-3 h-3" />}
                          {currentStep.status === "backtracking" && <RotateCcw className="w-3 h-3 text-amber-400" />}
                          {currentStep.status === "solved" && <CheckCircle2 className="w-3 h-3" />}
                          <span className="font-bold">{currentStep.explanation.split(".")[0]}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Live Step Explanation Banner */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/40 text-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
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
         * RIGHT COLUMN (5 COLS): INTERACTIVE CONTROLS & INVARIANTS
         * ==================================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Mode / Preset Selector Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
              <SlidersHorizontal className="w-4 h-4 text-fuchsia-400" />
              <span>Select Problem Pattern</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    className={`p-2.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${btnClassName}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mathematical Invariants & Backtracking Theorem Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-foreground font-bold border-b border-border/60 pb-2.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Core Backtracking Invariants</span>
            </div>

            <div className="flex flex-col gap-2.5 text-[11px] leading-relaxed">
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                <span className="text-emerald-400 font-bold">1. Choose → Explore → Undo:</span>
                <span className="text-muted-foreground">
                  At each decision node, make a choice (place queen / include element), recurse deeper, and if a dead end is reached, <strong className="text-foreground">undo the choice</strong> (remove queen / pop element) before trying the next alternative.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                <span className="text-cyan-400 font-bold">2. Constraint Pruning:</span>
                <span className="text-muted-foreground">
                  In N-Queens, a placement is rejected immediately if it shares a column or diagonal (<code className="text-foreground">|Δrow| === |Δcol|</code>) with any existing queen. This prunes entire subtrees without exploring them.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                <span className="text-amber-400 font-bold">3. Exponential Worst Case:</span>
                <span className="text-muted-foreground">
                  N-Queens explores up to <code className="text-foreground">O(N!)</code> placements; Subsets explores <code className="text-foreground">O(2ⁿ)</code> include/exclude branches. Constraint pruning dramatically reduces the average case.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                <span className="text-purple-400 font-bold">4. Recursion Stack Depth:</span>
                <span className="text-muted-foreground">
                  Bounded by problem size — <code className="text-foreground">O(N)</code> for N-Queens (one queen per row) and <code className="text-foreground">O(n)</code> for Subsets (one decision per element).
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
