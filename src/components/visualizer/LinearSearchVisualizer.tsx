"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
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

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/80 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
      {/* Visualizer Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground font-sans flex items-center gap-2">
              <span>Linear Search Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                Sequential O(n)
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Scans elements left-to-right without requiring sorted data.
            </p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-border bg-secondary/80 flex items-center gap-2">
            <span className="text-muted-foreground">Comparisons:</span>
            <span className="font-bold text-foreground">{comparisons}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-border bg-secondary/80 flex items-center gap-2">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-bold ${foundIndex !== null ? "text-emerald-500" : isFinished ? "text-rose-400" : isPlaying ? "text-cyan-400" : "text-muted-foreground"}`}>
              {foundIndex !== null ? `FOUND (idx ${foundIndex})` : isFinished ? "NOT FOUND (-1)" : isPlaying ? "SCANNING..." : "IDLE"}
            </span>
          </div>
        </div>
      </div>

      {/* Target Configuration & Preset Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-secondary/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-foreground">Target Value:</span>
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
              className="w-20 px-2.5 py-1 rounded-lg border border-border bg-card font-mono text-xs font-bold text-foreground text-center focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              onClick={() => {
                const val = parseInt(targetInput, 10);
                if (!isNaN(val)) handleSetTarget(val);
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              Set
            </button>
          </div>
        </div>

        {/* Preset Target Quick-Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          <span className="text-muted-foreground text-[10px] uppercase">Presets:</span>
          <button
            onClick={() => handleSetTarget(array[0])}
            className="px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            title="First element in array: Best Case O(1)"
          >
            Best: {array[0]} [0]
          </button>
          <button
            onClick={() => handleSetTarget(array[Math.floor(array.length / 2)])}
            className="px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
            title="Middle element in array"
          >
            Mid: {array[Math.floor(array.length / 2)]}
          </button>
          <button
            onClick={() => handleSetTarget(array[array.length - 1])}
            className="px-2 py-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer"
            title="Last element in array: Worst Case O(n)"
          >
            Last: {array[array.length - 1]} [{array.length - 1}]
          </button>
          <button
            onClick={() => handleSetTarget(999)}
            className="px-2 py-0.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
            title="Absent from array: -1"
          >
            Absent: 999
          </button>
        </div>
      </div>

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

      {/* Step Explanation Banner */}
      <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200 text-xs font-mono flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-cyan-500 shrink-0" />
        <span className="leading-relaxed">{explanation}</span>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/80">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={() => {
                if (isFinished) handleReset();
                setIsPlaying(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isFinished ? "Restart Search" : "Start Search"}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <Pause className="h-3.5 w-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={stepForward}
            disabled={isPlaying || isFinished}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-secondary/80 text-foreground font-semibold text-xs hover:bg-secondary disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
          >
            <StepForward className="h-3.5 w-3.5" />
            <span>Step</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-secondary/80 text-foreground font-semibold text-xs hover:bg-secondary transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleNewRandomArray}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-secondary/80 text-foreground font-semibold text-xs hover:bg-secondary transition-all active:scale-95 cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Random Array</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Sliders className="h-3.5 w-3.5 text-cyan-500" />
          <span>Speed:</span>
          <input
            type="range"
            min="150"
            max="1200"
            step="50"
            value={1350 - speed}
            onChange={(e) => setSpeed(1350 - Number(e.target.value))}
            className="w-24 accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
