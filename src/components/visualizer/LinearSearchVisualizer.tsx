"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import { CodeViewer } from "@/components/code/CodeViewer";
import { ALGORITHMS } from "@/data/algorithms";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Shuffle,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";

interface LinearSearchVisualizerProps {
  initialArray?: number[];
  initialTarget?: number;
}

export function LinearSearchVisualizer({
  initialArray = [29, 14, 67, 42, 85, 12, 93, 38],
  initialTarget = 42,
}: LinearSearchVisualizerProps) {
  const [array, setArray] = useState<number[]>(initialArray);
  const [target, setTarget] = useState<number>(initialTarget);
  const [targetInput, setTargetInput] = useState<string>(String(initialTarget));

  // Visualizer Execution State
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [comparisons, setComparisons] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>(
    `Ready to search for target value ${initialTarget}. Click 'Start Search' or 'Step' to scan.`
  );
  const [speed, setSpeed] = useState<number>(600); // ms per step

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleReset = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentIndex(null);
    setFoundIndex(null);
    setCheckedIndices([]);
    setComparisons(0);
    setExplanation(`Reset. Enter a target value and click 'Start Search'.`);
  }, [clearTimer]);

  const handleNewRandomArray = useCallback(() => {
    handleReset();
    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArr);
    // Pick a random target from the array 70% of the time, or absent 30% of the time
    const pickFromArray = Math.random() > 0.3;
    const newTarget = pickFromArray
      ? newArr[Math.floor(Math.random() * newArr.length)]
      : 99;
    setTarget(newTarget);
    setTargetInput(String(newTarget));
    setExplanation(`Generated new array. Searching for target ${newTarget}.`);
  }, [handleReset]);

  const handleSetTarget = (val: number) => {
    handleReset();
    setTarget(val);
    setTargetInput(String(val));
    setExplanation(`Target set to ${val}. Ready to search.`);
  };

  // Step function
  const stepForward = useCallback(() => {
    if (isFinished) return;

    const nextIndex = currentIndex === null ? 0 : currentIndex + 1;

    if (nextIndex >= array.length) {
      // Reached end without finding
      setIsPlaying(false);
      setIsFinished(true);
      setCurrentIndex(null);
      setExplanation(`Finished: Target ${target} not found in array. Returned -1 after ${array.length} comparisons (Worst Case O(n)).`);
      return;
    }

    const currentVal = array[nextIndex];
    setComparisons((prev) => prev + 1);
    setCurrentIndex(nextIndex);

    if (currentVal === target) {
      // Found match!
      setFoundIndex(nextIndex);
      setIsPlaying(false);
      setIsFinished(true);
      setExplanation(`Found target ${target} at index ${nextIndex}! (${nextIndex === 0 ? "Best Case O(1)" : `Completed in ${nextIndex + 1} comparison(s)`})`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setCheckedIndices((prev) => [...prev, nextIndex]);
      setExplanation(`Step ${nextIndex + 1}: array[${nextIndex}] = ${currentVal} ≠ ${target}. Moving to next index...`);
    }
  }, [currentIndex, array, target, isFinished]);

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    timerRef.current = setTimeout(() => {
      stepForward();
    }, speed);

    return () => clearTimer();
  }, [isPlaying, stepForward, speed, clearTimer]);

  const maxVal = Math.max(...array, 100);

  const activeLineNumber = useMemo(() => {
    if (foundIndex !== null) return 5;
    if (isFinished && foundIndex === null) return 8;
    if (currentIndex !== null) return 4;
    if (isPlaying) return 3;
    return null;
  }, [foundIndex, isFinished, currentIndex, isPlaying]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Array Bars Display Stage */}
          <div className="h-56 sm:h-64 rounded-2xl border border-border/80 bg-card/60 p-4 flex items-end justify-center gap-2 sm:gap-3 relative overflow-hidden shadow-inner">
            {array.map((val, idx) => {
              const heightPercent = Math.max(18, Math.round((val / maxVal) * 85));
              const isCurrent = currentIndex === idx;
              const isFound = foundIndex === idx;
              const isChecked = checkedIndices.includes(idx);

              let barColor = "bg-secondary border-border text-foreground";
              if (isFound) {
                barColor = "bg-emerald-500 border-emerald-400 text-slate-950 ring-4 ring-emerald-500/30 animate-bounce";
              } else if (isCurrent) {
                barColor = "bg-amber-500 border-amber-400 text-slate-950 ring-2 ring-amber-400/40";
              } else if (isChecked) {
                barColor = "bg-secondary/40 border-border/40 text-muted-foreground opacity-50";
              }

              return (
                <div key={idx} className="flex-1 max-w-[55px] flex flex-col items-center gap-1.5 h-full justify-end">
                  {/* Status Indicator on Top of Bar */}
                  <div className="h-5 flex items-center justify-center font-mono text-[10px]">
                    {isFound && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] shadow-sm animate-pulse">
                        MATCH!
                      </span>
                    )}
                    {isCurrent && !isFound && (
                      <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-bold text-[9px]">
                        CHECK
                      </span>
                    )}
                    {isChecked && !isFound && !isCurrent && (
                      <span className="text-muted-foreground text-[10px]">≠</span>
                    )}
                  </div>

                  {/* Bar Element */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-xl border flex flex-col justify-between items-center py-2 transition-all duration-300 shadow-md ${barColor}`}
                  >
                    <span className="font-mono text-xs font-extrabold">{val}</span>
                  </div>

                  {/* Index Subscript */}
                  <span className="font-mono text-[10px] text-muted-foreground">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* Operation Status & Live Execution Telemetry */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2.5 sm:p-3 backdrop-blur-xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    foundIndex !== null ? "bg-emerald-400" : isPlaying ? "bg-cyan-400" : "bg-muted-foreground"
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    foundIndex !== null ? "bg-emerald-500" : isPlaying ? "bg-cyan-500" : "bg-muted-foreground"
                  }`} />
                </span>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
                  Execution Telemetry
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-300">
                  <span className="text-[10px] text-muted-foreground">Comp:</span>
                  <strong className="font-bold">{comparisons}</strong>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-cyan-600 dark:text-cyan-300">
                  <span className="text-[10px] text-muted-foreground">Target:</span>
                  <strong className="font-bold">{target}</strong>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-secondary border border-border px-2 py-0.5 text-foreground">
                  <span className="text-[10px] text-muted-foreground">Status:</span>
                  <strong className={`font-bold ${foundIndex !== null ? "text-emerald-500" : isFinished ? "text-rose-400" : isPlaying ? "text-cyan-400" : "text-muted-foreground"}`}>
                    {foundIndex !== null ? `FOUND [${foundIndex}]` : isFinished ? "NOT FOUND" : isPlaying ? "SCANNING" : "IDLE"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Dynamic Explanation Text Box */}
            <div className={`rounded-xl border px-3 py-1.5 min-h-[36px] flex items-center shadow-inner ${
              foundIndex !== null
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                : isFinished
                ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300"
                : "border-border/80 bg-secondary/60 text-foreground"
            }`}>
              <p className="text-xs font-medium font-mono flex items-center gap-2 truncate">
                {foundIndex !== null ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-cyan-500 shrink-0 animate-pulse" />
                )}
                <span className="truncate">{explanation}</span>
              </p>
            </div>
          </div>

          {/* Target Configuration & Controls Bar */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/90 shadow-sm backdrop-blur-xl space-y-2.5">
            {/* Target Value Input & Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-border/70 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-foreground">Target:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = parseInt(targetInput, 10);
                        if (!isNaN(val)) handleSetTarget(val);
                      }
                    }}
                    className="w-16 px-2 py-0.5 rounded-lg border border-border bg-card font-mono text-xs font-bold text-foreground text-center"
                  />
                  <button
                    onClick={() => {
                      const val = parseInt(targetInput, 10);
                      if (!isNaN(val)) handleSetTarget(val);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors cursor-pointer text-[11px]"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                <span className="text-muted-foreground uppercase mr-1">Presets:</span>
                <button
                  onClick={() => handleSetTarget(array[0])}
                  className="px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 cursor-pointer"
                >
                  Best: {array[0]}
                </button>
                <button
                  onClick={() => handleSetTarget(array[Math.floor(array.length / 2)])}
                  className="px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300 cursor-pointer"
                >
                  Mid: {array[Math.floor(array.length / 2)]}
                </button>
                <button
                  onClick={() => handleSetTarget(array[array.length - 1])}
                  className="px-1.5 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 cursor-pointer"
                >
                  Last: {array[array.length - 1]}
                </button>
                <button
                  onClick={() => handleSetTarget(999)}
                  className="px-1.5 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 cursor-pointer"
                >
                  Absent: 999
                </button>
              </div>
            </div>

            {/* Playback Controls & Speed */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                {!isPlaying ? (
                  <button
                    onClick={() => {
                      if (isFinished) handleReset();
                      setIsPlaying(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>{isFinished ? "Restart" : "Start Search"}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Pause className="h-3 w-3 fill-current" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={stepForward}
                  disabled={isPlaying || isFinished}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border bg-secondary/80 text-foreground font-semibold text-xs hover:bg-secondary disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
                >
                  <StepForward className="h-3 w-3" />
                  <span>Step</span>
                </button>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border bg-secondary/80 text-foreground font-semibold text-xs hover:bg-secondary transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleNewRandomArray}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border bg-secondary/80 text-foreground font-semibold text-xs hover:bg-secondary transition-all active:scale-95 cursor-pointer"
                >
                  <Shuffle className="h-3 w-3" />
                  <span>Random</span>
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <Sliders className="h-3 w-3 text-cyan-500" />
                <span>Delay:</span>
                <input
                  type="range"
                  min="150"
                  max="1200"
                  step="50"
                  value={1350 - speed}
                  onChange={(e) => setSpeed(1350 - Number(e.target.value))}
                  className="w-20 accent-cyan-500 cursor-pointer h-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized C++ Code Viewer */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[280px] sm:h-[300px] lg:h-[320px] max-h-[280px] sm:max-h-[300px] lg:max-h-[320px] min-h-0 shrink-0 overflow-hidden flex flex-col">
            <CodeViewer
              code={ALGORITHMS["linear-search"].cppCode}
              activeLineNumber={activeLineNumber}
              algorithmName="LinearSearch"
            />
          </div>

          {/* Linear Scan Invariant Card */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              <span>Unsorted Search Invariant</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Without prior sorting or indexing guarantees, any element could reside at any position with uniform probability 1/n. Every slot in [0..i-1] must be sequentially verified before inspecting slot i.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
