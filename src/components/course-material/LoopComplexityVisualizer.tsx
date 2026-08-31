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
  Activity,
  Layers,
  TrendingUp,
  Award,
  CheckCircle2,
  Code2,
  Sliders,
  ChevronRight,
  Calculator,
  ArrowRight,
  FastForward,
} from "lucide-react";

export function LoopComplexityVisualizer() {
  // Navigation: 'nested' (Algorithm P2.7A) | 'logarithmic' (Algorithm P2.7B)
  const [activeTab, setActiveTab] = useState<"nested" | "logarithmic">("nested");

  // =========================================================================
  // STATE: ALGORITHM P2.7A (Nested 3-Loop O(n³))
  // =========================================================================
  const [nNested, setNNested] = useState<number>(3);
  const [mNested, setMNested] = useState<number>(1);
  const [currentStepNested, setCurrentStepNested] = useState<number>(0);
  const [isPlayingNested, setIsPlayingNested] = useState<boolean>(false);
  const [speedNested, setSpeedNested] = useState<number>(400); // ms per step
  const timerNestedRef = useRef<NodeJS.Timeout | null>(null);

  // Generate sequence of (I, J, K) iterations (0-based indexing)
  const nestedSteps = useMemo(() => {
    const steps: { i: number; j: number; k: number; executionCount: number }[] = [];
    let count = 0;
    for (let i = 0; i < nNested; i++) {
      for (let j = 0; j < nNested; j++) {
        for (let k = i; k < nNested; k++) {
          count++;
          steps.push({ i, j, k, executionCount: count });
        }
      }
    }
    return steps;
  }, [nNested]);

  // Total theoretical executions
  const totalNestedExecutions = useMemo(() => {
    return (nNested * nNested * (nNested + 1)) / 2;
  }, [nNested]);

  // Handle Playback for Nested
  useEffect(() => {
    if (isPlayingNested) {
      timerNestedRef.current = setInterval(() => {
        setCurrentStepNested((prev) => {
          if (prev >= nestedSteps.length - 1) {
            setIsPlayingNested(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedNested);
    } else {
      if (timerNestedRef.current) clearInterval(timerNestedRef.current);
    }
    return () => {
      if (timerNestedRef.current) clearInterval(timerNestedRef.current);
    };
  }, [isPlayingNested, nestedSteps.length, speedNested]);

  const activeNestedStep = nestedSteps[currentStepNested] || {
    i: 1,
    j: 1,
    k: 1,
    executionCount: 1,
  };

  // =========================================================================
  // STATE: ALGORITHM P2.7B (Logarithmic Jumps O(log_b n))
  // =========================================================================
  const [nLog, setNLog] = useState<number>(32);
  const [bLog, setBLog] = useState<number>(2);
  const [mLog, setMLog] = useState<number>(1);
  const [currentStepLog, setCurrentStepLog] = useState<number>(0);
  const [isPlayingLog, setIsPlayingLog] = useState<boolean>(false);
  const timerLogRef = useRef<NodeJS.Timeout | null>(null);

  // Generate sequence of J values
  const logSteps = useMemo(() => {
    const steps: { iteration: number; j: number; nextJ: number; isWithinBound: boolean }[] = [];
    let j = 1;
    let iter = 1;
    while (j <= nLog) {
      steps.push({
        iteration: iter,
        j: j,
        nextJ: j * bLog,
        isWithinBound: true,
      });
      j = j * bLog;
      iter++;
    }
    return steps;
  }, [nLog, bLog]);

  const theoreticalLogCount = useMemo(() => {
    return Math.floor(Math.log(nLog) / Math.log(bLog)) + 1;
  }, [nLog, bLog]);

  // Handle Playback for Log
  useEffect(() => {
    if (isPlayingLog) {
      timerLogRef.current = setInterval(() => {
        setCurrentStepLog((prev) => {
          if (prev >= logSteps.length - 1) {
            setIsPlayingLog(false);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    } else {
      if (timerLogRef.current) clearInterval(timerLogRef.current);
    }
    return () => {
      if (timerLogRef.current) clearInterval(timerLogRef.current);
    };
  }, [isPlayingLog, logSteps.length]);

  const activeLogStep = logSteps[currentStepLog] || {
    iteration: 1,
    j: 1,
    nextJ: bLog,
    isWithinBound: true,
  };

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-[#080d1a]/95 text-foreground overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-background border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10 shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Exercise 2.7 Lab
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Complexity C(n) Derivation
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight mt-1">
              Loop Counting & Complexity Simulator
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary/80 rounded-2xl border border-border/80 text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveTab("nested")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "nested"
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>(a) Algorithm P2.7A [O(n³)]</span>
          </button>
          <button
            onClick={() => setActiveTab("logarithmic")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "logarithmic"
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>(b) Algorithm P2.7B [O(log n)]</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALGORITHM P2.7A (Nested 3-Loop O(n³)) */}
      {/* ========================================================================= */}
      {activeTab === "nested" && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Parameter Sliders */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-secondary/30">
            <div className="flex flex-wrap items-center gap-4">
              {/* Slider for N */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-muted-foreground">Input Size N:</span>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={nNested}
                  onChange={(e) => {
                    setNNested(parseInt(e.target.value, 10));
                    setCurrentStepNested(0);
                    setIsPlayingNested(false);
                  }}
                  className="w-24 sm:w-32 accent-indigo-500 cursor-pointer"
                />
                <span className="font-bold text-indigo-400 text-sm w-4">{nNested}</span>
              </div>

              {/* Input for M */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-muted-foreground">Time Unit M:</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={mNested}
                  onChange={(e) => setMNested(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-16 px-2 py-1 rounded-lg border border-border bg-background text-xs font-mono text-foreground"
                />
              </div>
            </div>

            {/* Quick Math Pill */}
            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300">
              Total Executions: <span className="font-extrabold text-white">{totalNestedExecutions}</span>
            </div>
          </div>

          {/* 3-Loop Live Stepper HUD (0-based Indexing) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            {/* Loop 1 */}
            <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-indigo-400 text-[10px] font-bold uppercase">
                <span>Outer Loop 1 (I)</span>
                <span>0 to N-1</span>
              </div>
              <div className="text-2xl font-black text-white my-2 flex items-center gap-2">
                I = <span className="text-indigo-400">{activeNestedStep.i}</span>{" "}
                <span className="text-xs text-muted-foreground font-normal">/ {nNested - 1}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Controls inner boundary for K: runs for $K = I \dots N-1$.
              </div>
            </div>

            {/* Loop 2 */}
            <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-purple-400 text-[10px] font-bold uppercase">
                <span>Middle Loop 2 (J)</span>
                <span>0 to N-1</span>
              </div>
              <div className="text-2xl font-black text-white my-2 flex items-center gap-2">
                J = <span className="text-purple-400">{activeNestedStep.j}</span>{" "}
                <span className="text-xs text-muted-foreground font-normal">/ {nNested - 1}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Repeats the $K$ loop independently exactly $N$ times.
              </div>
            </div>

            {/* Loop 3 */}
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold uppercase">
                <span>Inner Loop 3 (K)</span>
                <span>I to N-1</span>
              </div>
              <div className="text-2xl font-black text-white my-2 flex items-center gap-2">
                K = <span className="text-emerald-400">{activeNestedStep.k}</span>{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  ({nNested - activeNestedStep.i} steps for current I)
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                Executes Module A on each step.
              </div>
            </div>
          </div>

          {/* Real-time Visual Execution Matrix */}
          <div className="rounded-2xl border border-border/80 bg-black/50 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                <Code2 className="h-4 w-4 text-indigo-400" />
                <span>Live Module A Trigger Grid (0-based Indexing)</span>
              </div>

              {/* Progress counter */}
              <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                Module A Executions: {activeNestedStep.executionCount} / {totalNestedExecutions}
              </div>
            </div>

            {/* Visual breakdown per I */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: nNested }, (_, idx) => {
                const iVal = idx; // 0-based
                const isCurrentI = activeNestedStep.i === iVal;
                const kCount = nNested - iVal;
                const totalForThisI = nNested * kCount;

                return (
                  <div
                    key={iVal}
                    className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                      isCurrentI
                        ? "border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30"
                        : "border-border/60 bg-secondary/30 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={isCurrentI ? "text-indigo-300" : "text-slate-300"}>
                        Pass I = {iVal}
                      </span>
                      <span className="text-muted-foreground">K runs {kCount} times</span>
                    </div>

                    <div className="text-muted-foreground text-[10px] mt-1">
                      {nNested} (J loops) × {kCount} (K loops) ={" "}
                      <span className="font-bold text-foreground">{totalForThisI} executions</span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full h-2 bg-secondary/80 rounded-full mt-2 overflow-hidden">
                      <div
                        style={{
                          width: `${(kCount / nNested) * 100}%`,
                        }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlayingNested(false);
                  setCurrentStepNested(0);
                }}
                disabled={currentStepNested === 0}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
                title="First Step"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlayingNested(false);
                  setCurrentStepNested((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentStepNested === 0}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
                title="Previous Step"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  if (currentStepNested >= nestedSteps.length - 1) {
                    setCurrentStepNested(0);
                  }
                  setIsPlayingNested(!isPlayingNested);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                {isPlayingNested ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>{currentStepNested >= nestedSteps.length - 1 ? "Replay" : "Play Execution"}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsPlayingNested(false);
                  setCurrentStepNested((prev) => Math.min(nestedSteps.length - 1, prev + 1));
                }}
                disabled={currentStepNested >= nestedSteps.length - 1}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
                title="Next Step"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Speed Options */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span>Speed:</span>
              {[
                { label: "Slow", val: 600 },
                { label: "Normal", val: 300 },
                { label: "Fast", val: 100 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSpeedNested(s.val)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    speedNested === s.val
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 font-bold"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mathematical Proof Card */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3 font-mono text-xs">
            <div className="text-xs font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wider">
              <Calculator className="h-4 w-4" />
              <span>Step-by-Step Closed Form Complexity Calculation</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div>
                1. For a fixed <span className="text-indigo-400 font-bold">I</span>, the{" "}
                <span className="text-emerald-400 font-bold">K</span> loop executes{" "}
                <span className="text-white font-bold">(N - I + 1)</span> times.
              </div>
              <div>
                2. For a fixed <span className="text-indigo-400 font-bold">I</span>, the{" "}
                <span className="text-purple-400 font-bold">J</span> loop runs{" "}
                <span className="text-white font-bold">N</span> times. Thus, Module A executes:
                <div className="p-2 bg-black/40 rounded-lg mt-1 text-cyan-300">
                  Executions(I) = N × (N - I + 1)
                </div>
              </div>
              <div>
                3. Summing over all <span className="text-indigo-400 font-bold">I from 1 to N</span>:
                <div className="p-2 bg-black/40 rounded-lg mt-1 text-emerald-300">
                  Total = ∑(I=1 to N) [N × (N - I + 1)] = N × [N + (N-1) + ... + 1] = N × [N(N+1) / 2] = (N³ + N²) / 2
                </div>
              </div>
              <div className="pt-1 text-sm font-extrabold text-white">
                Final Complexity:{" "}
                <span className="text-amber-400">
                  C(n) = M × (n³ + n²) / 2 = O(n³)
                </span>{" "}
                (For N={nNested}, M={mNested} ➔ Total Time = {mNested * totalNestedExecutions} units)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALGORITHM P2.7B (Logarithmic Jumps O(log_b n)) */}
      {/* ========================================================================= */}
      {activeTab === "logarithmic" && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Parameter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl border border-border/60 bg-secondary/30 font-mono text-xs">
            {/* Input N */}
            <div className="space-y-1">
              <span className="text-muted-foreground">Input Limit N:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={4}
                  max={256}
                  value={nLog}
                  onChange={(e) => {
                    setNLog(parseInt(e.target.value, 10));
                    setCurrentStepLog(0);
                    setIsPlayingLog(false);
                  }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <span className="font-bold text-indigo-400 w-10 text-right">{nLog}</span>
              </div>
            </div>

            {/* Multiplier B */}
            <div className="space-y-1">
              <span className="text-muted-foreground">Multiplier B (b &gt; 1):</span>
              <div className="flex items-center gap-2">
                {[2, 3, 4, 10].map((base) => (
                  <button
                    key={base}
                    onClick={() => {
                      setBLog(base);
                      setCurrentStepLog(0);
                      setIsPlayingLog(false);
                    }}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      bLog === base
                        ? "bg-indigo-500 text-white font-bold border-indigo-400"
                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    B = {base}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Unit M */}
            <div className="space-y-1">
              <span className="text-muted-foreground">Time Unit M:</span>
              <input
                type="number"
                min={1}
                max={10}
                value={mLog}
                onChange={(e) => setMLog(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-2.5 py-1 rounded-lg border border-border bg-background text-xs font-mono text-foreground"
              />
            </div>
          </div>

          {/* Exponential Jumps Visualization Canvas */}
          <div className="rounded-2xl border border-border/80 bg-black/50 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <span>Logarithmic Stepping Progression (J := B × J)</span>
              </span>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                Total Steps: {logSteps.length} (vs Linear: {nLog})
              </span>
            </div>

            {/* Stepping Cards Sequence */}
            <div className="flex flex-wrap items-center gap-3 py-2">
              {logSteps.map((step, idx) => {
                const isActive = currentStepLog === idx;
                const isPast = currentStepLog > idx;

                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`px-4 py-3 rounded-2xl border transition-all duration-300 font-mono text-center min-w-[90px] ${
                        isActive
                          ? "border-emerald-400 bg-emerald-950/40 shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/30 scale-105"
                          : isPast
                          ? "border-indigo-500/60 bg-indigo-950/20 text-slate-300"
                          : "border-border/60 bg-secondary/30 text-slate-500"
                      }`}
                    >
                      <div className="text-[10px] text-muted-foreground uppercase">Step {step.iteration}</div>
                      <div className="text-lg font-black text-white mt-0.5">J = {step.j}</div>
                      <div className="text-[10px] text-indigo-400 mt-0.5 font-sans">
                        B^{step.iteration - 1} = {step.j}
                      </div>
                    </div>

                    {idx < logSteps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                );
              })}

              {/* Exit Card */}
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="px-3.5 py-3 rounded-2xl border border-rose-500/30 bg-rose-950/20 font-mono text-center text-xs opacity-75">
                  <div className="text-[10px] text-rose-400 uppercase font-bold">Exit Condition</div>
                  <div className="font-bold text-rose-300 mt-0.5">
                    J = {activeLogStep.j * bLog} &gt; {nLog}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Step Description */}
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-xs font-mono text-foreground flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  Iteration {activeLogStep.iteration}: J = {activeLogStep.j} ≤ {nLog} ➔ Execute Module A, then update J := {bLog} × {activeLogStep.j} = {activeLogStep.nextJ}.
                </span>
              </div>
              <span className="text-[11px] text-indigo-400 shrink-0">
                Step {currentStepLog + 1} / {logSteps.length}
              </span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlayingLog(false);
                  setCurrentStepLog(0);
                }}
                disabled={currentStepLog === 0}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlayingLog(false);
                  setCurrentStepLog((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentStepLog === 0}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  if (currentStepLog >= logSteps.length - 1) {
                    setCurrentStepLog(0);
                  }
                  setIsPlayingLog(!isPlayingLog);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
              >
                {isPlayingLog ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>{currentStepLog >= logSteps.length - 1 ? "Replay" : "Play Steps"}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsPlayingLog(false);
                  setCurrentStepLog((prev) => Math.min(logSteps.length - 1, prev + 1));
                }}
                disabled={currentStepLog >= logSteps.length - 1}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              Total Operations: <span className="font-bold text-emerald-400">{logSteps.length}</span>{" "}
              (Efficiency: <span className="text-cyan-400 font-bold">{((logSteps.length / nLog) * 100).toFixed(1)}%</span> of linear scan)
            </div>
          </div>

          {/* Mathematical Proof Card */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-3 font-mono text-xs">
            <div className="text-xs font-bold text-purple-300 flex items-center gap-2 uppercase tracking-wider">
              <Calculator className="h-4 w-4" />
              <span>Logarithmic Growth Derivation</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div>
                1. <span className="text-indigo-400 font-bold">J</span> multiplies by{" "}
                <span className="text-white font-bold">B</span> on each iteration:
                <div className="p-2 bg-black/40 rounded-lg mt-1 text-cyan-300">
                  J values: 1, B, B², B³, ..., B^(k-1)
                </div>
              </div>
              <div>
                2. The loop terminates when <span className="text-rose-400 font-bold">B^(k-1) &gt; N</span>.
                Taking logarithm base B:
                <div className="p-2 bg-black/40 rounded-lg mt-1 text-emerald-300">
                  k - 1 ≤ log_B(N) ⟹ Number of Iterations k = ⌊log_B(N)⌋ + 1
                </div>
              </div>
              <div className="pt-1 text-sm font-extrabold text-white">
                Final Complexity:{" "}
                <span className="text-amber-400">
                  C(n) = M × (⌊log_b n⌋ + 1) = O(log_b n) = O(log n)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
