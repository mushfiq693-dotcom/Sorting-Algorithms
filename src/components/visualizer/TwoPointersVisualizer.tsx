"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  TwoPointersEngine,
  TwoPointerStep,
  TwoPointersMode,
  TWO_POINTERS_PRESETS,
} from "@/algorithms/two-pointers";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowLeftRight,
  TrendingUp,
  Workflow,
  Repeat,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Zap,
  Target,
  ArrowDown,
} from "lucide-react";

export function TwoPointersVisualizer() {
  // Config & Mode State
  const [activeMode, setActiveMode] = useState<TwoPointersMode>("two-sum");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("sorted-two-sum");
  const [speed, setSpeed] = useState<number>(500); // ms per step
  const [customTarget, setCustomTarget] = useState<number>(14);

  // Playback & Step State
  const [steps, setSteps] = useState<TwoPointerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Steps on mode or preset change
  const initializeSteps = useCallback(
    (mode: TwoPointersMode, targetVal: number = 14) => {
      let generated: TwoPointerStep[] = [];
      const preset = TWO_POINTERS_PRESETS.find((p) => p.mode === mode) || TWO_POINTERS_PRESETS[0];

      if (mode === "two-sum") {
        generated = TwoPointersEngine.generateTwoSumSteps(preset.array, targetVal);
      } else if (mode === "container") {
        generated = TwoPointersEngine.generateContainerSteps(preset.array);
      } else if (mode === "fast-slow") {
        generated = TwoPointersEngine.generateFastSlowSteps(preset.array);
      } else if (mode === "palindrome") {
        generated = TwoPointersEngine.generatePalindromeSteps(preset.array);
      }

      setSteps(generated);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  useEffect(() => {
    initializeSteps(activeMode, customTarget);
  }, [activeMode, initializeSteps]);

  // Current active step snapshot
  const currentStep = useMemo<TwoPointerStep | null>(() => {
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
          if (steps[next]?.status === "found" || steps[next]?.status === "completed") {
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

  // Handle Play / Pause
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
      if (steps[next]?.status === "found" || steps[next]?.status === "completed") {
        try {
          confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
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

  const handleModeChange = (mode: TwoPointersMode) => {
    setActiveMode(mode);
    const preset = TWO_POINTERS_PRESETS.find((p) => p.mode === mode);
    if (preset) {
      setSelectedPresetId(preset.id);
      if (preset.target !== undefined) setCustomTarget(preset.target);
    }
  };

  const handleTargetChange = (newTarget: number) => {
    setCustomTarget(newTarget);
    initializeSteps("two-sum", newTarget);
  };

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
                <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <ArrowLeftRight className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground font-mono flex items-center gap-1.5">
                    <span>Two Pointers Studio</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground uppercase">
                      {activeMode.replace("-", " ")}
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
            <div className="min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-secondary/30 border border-border/70 relative">
              {currentStep && (
                <>
                  {/* MODE 1 & 4 & 3: ARRAY BAR / CELL PRESENTATION */}
                  {activeMode !== "container" ? (
                    <div className="w-full flex flex-col items-center gap-6 py-4">
                      {/* Array Cells Strip */}
                      <div className="flex flex-wrap items-end justify-center gap-1.5 sm:gap-2">
                        {currentStep.array.map((val, idx) => {
                          const isLeft = activeMode === "fast-slow" ? idx === currentStep.slow : idx === currentStep.left;
                          const isRight = activeMode === "fast-slow" ? idx === currentStep.fast : idx === currentStep.right;
                          const isEliminated = currentStep.eliminatedIndices.includes(idx);
                          const isMatched = currentStep.status === "found" && (idx === currentStep.left || idx === currentStep.right);
                          const isHighlighted = currentStep.highlightIndices.includes(idx);

                          return (
                            <div key={idx} className="flex flex-col items-center relative">
                              {/* Pointer Down Arrow Labels */}
                              <div className="h-6 flex items-center justify-center">
                                {isLeft && isRight ? (
                                  <span className="text-[10px] font-mono font-black text-rose-400 flex items-center gap-0.5 animate-bounce">
                                    <ArrowDown className="w-3 h-3" /> Collide
                                  </span>
                                ) : isLeft ? (
                                  <span className="text-[10px] font-mono font-black text-cyan-400 flex items-center gap-0.5 animate-bounce">
                                    <ArrowDown className="w-3 h-3" />
                                    {activeMode === "fast-slow" ? "Slow" : "L"}
                                  </span>
                                ) : isRight ? (
                                  <span className="text-[10px] font-mono font-black text-amber-400 flex items-center gap-0.5 animate-bounce">
                                    <ArrowDown className="w-3 h-3" />
                                    {activeMode === "fast-slow" ? "Fast" : "R"}
                                  </span>
                                ) : null}
                              </div>

                              {/* Index Badge */}
                              <span className="text-[9px] font-mono text-muted-foreground/70 mb-1">
                                [{idx}]
                              </span>

                              {/* Cell Box */}
                              <div
                                className={`w-9 sm:w-11 h-11 sm:h-12 rounded-xl border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                                  isMatched
                                    ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40 scale-105"
                                    : isLeft
                                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/30 scale-105"
                                    : isRight
                                    ? "bg-amber-500/20 text-amber-300 border-amber-400 shadow-md shadow-amber-500/30 scale-105"
                                    : isEliminated
                                    ? "bg-secondary/40 text-muted-foreground/40 border-border/50 line-through opacity-50"
                                    : isHighlighted
                                    ? "bg-secondary text-foreground border-border"
                                    : "bg-card text-foreground border-border/80"
                                }`}
                              >
                                {val}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mode-Specific Status Overlay */}
                      {activeMode === "two-sum" && currentStep.currentSum !== undefined && (
                        <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 rounded-xl border border-border bg-card/80 text-xs font-mono shadow-xs">
                          <span className="text-muted-foreground">Evaluation:</span>
                          <span className="text-cyan-400 font-bold">
                            arr[{currentStep.left}] ({currentStep.array[currentStep.left]})
                          </span>
                          <span>+</span>
                          <span className="text-amber-400 font-bold">
                            arr[{currentStep.right}] ({currentStep.array[currentStep.right]})
                          </span>
                          <span>=</span>
                          <span className="px-2 py-0.5 rounded bg-secondary font-black text-foreground">
                            {currentStep.currentSum}
                          </span>
                          <span className="text-muted-foreground">vs Target</span>
                          <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-black">
                            {currentStep.target}
                          </span>

                          {/* Decision Pill */}
                          {currentStep.status === "found" ? (
                            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1 animate-pulse">
                              <Sparkles className="w-3 h-3" /> MATCH!
                            </span>
                          ) : currentStep.currentSum < (currentStep.target || 0) ? (
                            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                              Sum &lt; Target → Advance Left (L++)
                            </span>
                          ) : (
                            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                              Sum &gt; Target → Decrement Right (R--)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Fast-Slow Unique Prefix Shelf */}
                      {activeMode === "fast-slow" && (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border text-xs font-mono">
                          <span className="text-muted-foreground">Unique Prefix Length:</span>
                          <span className="text-emerald-400 font-black text-sm">
                            {currentStep.uniqueCount || 1}
                          </span>
                          <span className="text-muted-foreground/60">•</span>
                          <span className="text-[11px] text-muted-foreground">
                            arr[0...{currentStep.slow}] contains strictly unique values
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* MODE 2: CONTAINER WITH MOST WATER (SVG WATER TANK) */
                    <div className="w-full flex flex-col items-center gap-3 py-2">
                      <div className="w-full h-44 sm:h-48 relative flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 320 160">
                          {/* Baseline Ground */}
                          <line x1="20" y1="140" x2="300" y2="140" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />

                          {/* Height Bars */}
                          {currentStep.array.map((h, i) => {
                            const stepX = 26;
                            const x = 32 + i * stepX;
                            const barHeight = h * 12;
                            const y = 140 - barHeight;
                            const isL = i === currentStep.left;
                            const isR = i === currentStep.right;
                            const isBoundary = isL || isR;

                            return (
                              <g key={i}>
                                {/* Vertical Bar */}
                                <rect
                                  x={x}
                                  y={y}
                                  width="8"
                                  height={barHeight}
                                  rx="2"
                                  fill={
                                    isL
                                      ? "#38BDF8"
                                      : isR
                                      ? "#F59E0B"
                                      : "#334155"
                                  }
                                  className="transition-all duration-300"
                                />

                                {/* Value label on top */}
                                <text
                                  x={x + 4}
                                  y={y - 4}
                                  textAnchor="middle"
                                  fill={isBoundary ? "#F8FAFC" : "#64748B"}
                                  fontSize="9"
                                  fontWeight={isBoundary ? "bold" : "normal"}
                                >
                                  {h}
                                </text>

                                {/* Index label below */}
                                <text
                                  x={x + 4}
                                  y="152"
                                  textAnchor="middle"
                                  fill={isBoundary ? (isL ? "#38BDF8" : "#F59E0B") : "#64748B"}
                                  fontSize="8"
                                  fontWeight="bold"
                                >
                                  {isL ? "L" : isR ? "R" : i}
                                </text>
                              </g>
                            );
                          })}

                          {/* Water Rectangle between Left and Right */}
                          {currentStep.left < currentStep.right && (
                            <>
                              {(() => {
                                const stepX = 26;
                                const xL = 32 + currentStep.left * stepX + 8;
                                const xR = 32 + currentStep.right * stepX;
                                const waterWidth = xR - xL;
                                const minH = Math.min(
                                  currentStep.array[currentStep.left],
                                  currentStep.array[currentStep.right]
                                );
                                const waterHeight = minH * 12;
                                const waterY = 140 - waterHeight;

                                return (
                                  <g>
                                    <rect
                                      x={xL}
                                      y={waterY}
                                      width={waterWidth}
                                      height={waterHeight}
                                      fill="#0EA5E9"
                                      fillOpacity="0.25"
                                      stroke="#0284C7"
                                      strokeDasharray="4 2"
                                      className="transition-all duration-300"
                                    />
                                    {/* Water Area Text Centered */}
                                    <text
                                      x={xL + waterWidth / 2}
                                      y={waterY + waterHeight / 2 + 4}
                                      textAnchor="middle"
                                      fill="#38BDF8"
                                      fontSize="11"
                                      fontWeight="bold"
                                      className="font-mono"
                                    >
                                      Area: {currentStep.currentArea}
                                    </text>
                                  </g>
                                );
                              })()}
                            </>
                          )}
                        </svg>
                      </div>

                      {/* Area Telemetry Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 w-full p-2.5 rounded-xl border border-border bg-card text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Current Area:</span>
                          <span className="text-cyan-400 font-bold">
                            ({currentStep.right} - {currentStep.left}) × min(
                            {currentStep.array[currentStep.left]}, {currentStep.array[currentStep.right]}) ={" "}
                            <strong>{currentStep.currentArea}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>Max Record: {currentStep.maxArea}</span>
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
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{currentStep?.explanation || "Ready to execute."}</span>
              </div>
              <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
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
                  title="Reset Pointers"
                >
                  <RotateCcw className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-muted-foreground">Speed:</span>
                <input
                  type="range"
                  min="150"
                  max="1200"
                  step="50"
                  value={1350 - speed}
                  onChange={(e) => setSpeed(1350 - Number(e.target.value))}
                  className="w-24 sm:w-28 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
         * RIGHT COLUMN (5 COLS): INTERACTIVE CONTROLS & INVARIANTS
         * ==================================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Pattern Selector Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Select Technique Pattern</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "two-sum", label: "Sorted Two Sum", icon: Target },
                { id: "container", label: "Container Water", icon: TrendingUp },
                { id: "fast-slow", label: "Fast & Slow", icon: Workflow },
                { id: "palindrome", label: "Palindrome Scan", icon: Repeat },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleModeChange(item.id as TwoPointersMode)}
                    className={`p-2.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-400 shadow-sm"
                        : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Target Sum Adjustor (Active in Two Sum mode) */}
          {activeMode === "two-sum" && (
            <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-400" />
                  Target Sum Controls
                </span>
                <span className="text-amber-400 font-black text-sm">{customTarget}</span>
              </div>

              <div className="flex items-center gap-2">
                {[10, 14, 17, 23, 26].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTargetChange(t)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                      customTarget === t
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm"
                        : "bg-secondary text-muted-foreground hover:text-foreground border-border"
                    }`}
                  >
                    T:{t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mathematical Invariants & Pruning Theorem Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card backdrop-blur-xl shadow-sm flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-foreground font-bold border-b border-border/60 pb-2.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Core Mathematical Invariants</span>
            </div>

            <div className="flex flex-col gap-2.5 text-[11px] leading-relaxed">
              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                <span className="text-emerald-400 font-bold">1. Monotonic Search Pruning:</span>
                <span className="text-muted-foreground">
                  In a sorted structure, if <code className="text-foreground">arr[L] + arr[R] &lt; Target</code>, no
                  element to the left of <code className="text-foreground">R</code> can ever pair with{" "}
                  <code className="text-foreground">arr[L]</code> to reach the target. Entire rows of the pair matrix
                  are pruned in <strong className="text-foreground">O(1)</strong> time.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                <span className="text-cyan-400 font-bold">2. O(1) Auxiliary Space Guarantee:</span>
                <span className="text-muted-foreground">
                  Only 2 index scalar variables (<code className="text-foreground">L, R</code> or{" "}
                  <code className="text-foreground">Slow, Fast</code>) are allocated in the CPU registers. Zero dynamic
                  heap reallocation or hash table lookups required.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/70 flex flex-col gap-1">
                <span className="text-amber-400 font-bold">3. Container Boundary Lemma:</span>
                <span className="text-muted-foreground">
                  Keeping the shorter wall and moving the taller wall strictly decreases width while capping height by
                  the shorter wall. Advancing the shorter wall is the <em>only</em> move that can potentially increase area.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
