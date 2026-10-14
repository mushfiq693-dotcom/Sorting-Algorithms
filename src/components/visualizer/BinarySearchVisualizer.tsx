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
  AlertTriangle,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Layers,
  Zap,
} from "lucide-react";

interface BinarySearchVisualizerProps {
  initialArray?: number[];
  initialTarget?: number;
}

export function BinarySearchVisualizer({
  initialArray = [12, 24, 32, 45, 57, 68, 81, 99],
  initialTarget = 57,
}: BinarySearchVisualizerProps) {
  const [array, setArray] = useState<number[]>(initialArray);
  const [target, setTarget] = useState<number>(initialTarget);
  const [targetInput, setTargetInput] = useState<string>(String(initialTarget));

  // Binary Search Pointers & Bounds
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(initialArray.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [discardedIndices, setDiscardedIndices] = useState<number[]>([]);

  // Execution States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [comparisons, setComparisons] = useState<number>(0);
  const [stepPhase, setStepPhase] = useState<"evaluate-mid" | "narrow-interval">("evaluate-mid");
  const [explanation, setExplanation] = useState<string>(
    `Binary Search ready. Searching for target ${initialTarget} in sorted array of size ${initialArray.length}.`
  );
  const [speed, setSpeed] = useState<number>(750);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if array is sorted
  const isSorted = useMemo(() => {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) return false;
    }
    return true;
  }, [array]);

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
    setLow(0);
    setHigh(array.length - 1);
    setMid(null);
    setFoundIndex(null);
    setDiscardedIndices([]);
    setComparisons(0);
    setStepPhase("evaluate-mid");
    setExplanation(`Reset. Search interval restored to [0..${array.length - 1}]. Target is ${target}.`);
  }, [clearTimer, array.length, target]);

  const handleSortArray = useCallback(() => {
    handleReset();
    const sorted = [...array].sort((a, b) => a - b);
    setArray(sorted);
    setExplanation("Array sorted in ascending order. Precondition satisfied!");
  }, [array, handleReset]);

  const handleGenerateSortedArray = useCallback(() => {
    clearTimer();
    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 95) + 5).sort((a, b) => a - b);
    setArray(newArr);
    // Pick target from array 70% of time
    const pickFromArray = Math.random() > 0.3;
    const newTarget = pickFromArray
      ? newArr[Math.floor(Math.random() * newArr.length)]
      : 50;
    setTarget(newTarget);
    setTargetInput(String(newTarget));
    setLow(0);
    setHigh(newArr.length - 1);
    setMid(null);
    setFoundIndex(null);
    setDiscardedIndices([]);
    setComparisons(0);
    setIsPlaying(false);
    setIsFinished(false);
    setStepPhase("evaluate-mid");
    setExplanation(`Generated sorted array. Searching for target ${newTarget}.`);
  }, [clearTimer]);

  const handleSetTarget = (val: number) => {
    handleReset();
    setTarget(val);
    setTargetInput(String(val));
    setExplanation(`Target set to ${val}. Ready to search.`);
  };

  // Step function
  const stepForward = useCallback(() => {
    if (isFinished) return;

    if (low > high) {
      setIsPlaying(false);
      setIsFinished(true);
      setMid(null);
      setExplanation(`Search interval exhausted (low > high: ${low} > ${high}). Target ${target} not found. Returned -1 in O(log n) steps.`);
      return;
    }

    if (stepPhase === "evaluate-mid") {
      // Calculate middle element
      const currentMid = low + Math.floor((high - low) / 2);
      const midVal = array[currentMid];
      setMid(currentMid);
      setComparisons((prev) => prev + 1);

      if (midVal === target) {
        setFoundIndex(currentMid);
        setIsPlaying(false);
        setIsFinished(true);
        setExplanation(`Match found! array[${currentMid}] == ${target}. Target located in ${comparisons + 1} comparison(s)!`);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else if (midVal < target) {
        setExplanation(`array[mid: ${currentMid}] = ${midVal} < target ${target}. Target must be in the RIGHT half. Discarding indices [${low}..${currentMid}].`);
        setStepPhase("narrow-interval");
      } else {
        setExplanation(`array[mid: ${currentMid}] = ${midVal} > target ${target}. Target must be in the LEFT half. Discarding indices [${currentMid}..${high}].`);
        setStepPhase("narrow-interval");
      }
    } else {
      // narrow-interval phase
      if (mid === null) return;
      const midVal = array[mid];

      if (midVal < target) {
        // Discard low..mid
        const newDiscarded = [...discardedIndices];
        for (let i = low; i <= mid; i++) {
          if (!newDiscarded.includes(i)) newDiscarded.push(i);
        }
        setDiscardedIndices(newDiscarded);
        const nextLow = mid + 1;
        setLow(nextLow);
        setMid(null);
        setStepPhase("evaluate-mid");
        if (nextLow > high) {
          setIsPlaying(false);
          setIsFinished(true);
          setExplanation(`Interval exhausted: low (${nextLow}) > high (${high}). Target ${target} not present in array.`);
        } else {
          setExplanation(`Narrowed active range to [${nextLow}..${high}]. Candidates remaining: ${high - nextLow + 1}.`);
        }
      } else {
        // Discard mid..high
        const newDiscarded = [...discardedIndices];
        for (let i = mid; i <= high; i++) {
          if (!newDiscarded.includes(i)) newDiscarded.push(i);
        }
        setDiscardedIndices(newDiscarded);
        const nextHigh = mid - 1;
        setHigh(nextHigh);
        setMid(null);
        setStepPhase("evaluate-mid");
        if (low > nextHigh) {
          setIsPlaying(false);
          setIsFinished(true);
          setExplanation(`Interval exhausted: low (${low}) > high (${nextHigh}). Target ${target} not present in array.`);
        } else {
          setExplanation(`Narrowed active range to [${low}..${nextHigh}]. Candidates remaining: ${nextHigh - low + 1}.`);
        }
      }
    }
  }, [isFinished, low, high, stepPhase, array, target, comparisons, mid, discardedIndices]);

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
  const maxPossibleSteps = Math.ceil(Math.log2(array.length));

  const activeLineNumber = useMemo(() => {
    if (foundIndex !== null) return 9;
    if (isFinished && foundIndex === null) return 16;
    if (mid !== null) {
      if (stepPhase === "evaluate-mid") return 8;
      if (array[mid] < target) return 11;
      return 13;
    }
    if (isPlaying) return 6;
    return null;
  }, [foundIndex, isFinished, mid, stepPhase, array, target, isPlaying]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Array Bars Stage with Active Interval & Discarded Halves */}
          <div className="h-56 sm:h-64 rounded-2xl border border-border/80 bg-card/60 p-4 flex items-end justify-center gap-2 sm:gap-3 relative overflow-hidden shadow-inner">
            {array.map((val, idx) => {
              const heightPercent = Math.max(18, Math.round((val / maxVal) * 85));
              const isMid = mid === idx;
              const isFound = foundIndex === idx;
              const isLow = low === idx && !isFinished;
              const isHigh = high === idx && !isFinished;
              const inActiveRange = idx >= low && idx <= high && !isFinished;
              const isDiscarded = discardedIndices.includes(idx) || idx < low || idx > high;

              let barColor = "bg-secondary border-border text-foreground";
              if (isFound) {
                barColor = "bg-emerald-500 border-emerald-400 text-slate-950 ring-4 ring-emerald-500/30 animate-bounce";
              } else if (isMid) {
                barColor = "bg-amber-500 border-amber-400 text-slate-950 ring-4 ring-amber-400/40";
              } else if (inActiveRange) {
                barColor = "bg-cyan-500/20 border-cyan-500/50 text-cyan-300";
              } else if (isDiscarded) {
                barColor = "bg-secondary/30 border-border/30 text-muted-foreground opacity-30 grayscale";
              }

              return (
                <div key={idx} className="flex-1 max-w-[55px] flex flex-col items-center gap-1.5 h-full justify-end">
                  {/* Top Pointer Tags (MID / LOW / HIGH) */}
                  <div className="h-6 flex flex-col items-center justify-end font-mono text-[9px]">
                    {isFound ? (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">
                        MATCH!
                      </span>
                    ) : isMid ? (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black flex items-center gap-0.5">
                        MID
                      </span>
                    ) : isLow && isHigh ? (
                      <span className="px-1 py-0.2 rounded bg-cyan-500 text-slate-950 font-bold text-[8px]">
                        L=H
                      </span>
                    ) : isLow ? (
                      <span className="px-1 py-0.2 rounded bg-cyan-500/30 text-cyan-300 font-bold text-[8px] border border-cyan-500/40">
                        LOW
                      </span>
                    ) : isHigh ? (
                      <span className="px-1 py-0.2 rounded bg-cyan-500/30 text-cyan-300 font-bold text-[8px] border border-cyan-500/40">
                        HIGH
                      </span>
                    ) : isDiscarded ? (
                      <span className="text-muted-foreground text-[8px] line-through">OUT</span>
                    ) : null}
                  </div>

                  {/* The Bar */}
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
                  <strong className="font-bold">{comparisons} / ≤{maxPossibleSteps}</strong>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-cyan-600 dark:text-cyan-300">
                  <span className="text-[10px] text-muted-foreground">Range:</span>
                  <strong className="font-bold">[{low}..{high}]</strong>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-secondary border border-border px-2 py-0.5 text-foreground">
                  <span className="text-[10px] text-muted-foreground">Status:</span>
                  <strong className={`font-bold ${foundIndex !== null ? "text-emerald-500" : isFinished ? "text-rose-400" : isPlaying ? "text-cyan-400" : "text-muted-foreground"}`}>
                    {foundIndex !== null ? `FOUND [${foundIndex}]` : isFinished ? "NOT FOUND" : isPlaying ? "HALVING" : "IDLE"}
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

          {/* Precondition Verification Warning Banner (if unsorted) */}
          {!isSorted && (
            <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                <span>
                  <strong>PRECONDITION VIOLATED:</strong> Binary Search requires sorted data!
                </span>
              </div>
              <button
                onClick={handleSortArray}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
              >
                Sort Array Now
              </button>
            </div>
          )}

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
                  onClick={() => handleSetTarget(array[Math.floor(array.length / 2)])}
                  className="px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 cursor-pointer"
                  title="Exact middle element: 1-step O(1) best case"
                >
                  Best (Mid): {array[Math.floor(array.length / 2)]}
                </button>
                <button
                  onClick={() => handleSetTarget(array[0])}
                  className="px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 cursor-pointer"
                >
                  Left: {array[0]}
                </button>
                <button
                  onClick={() => handleSetTarget(array[array.length - 1])}
                  className="px-1.5 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 cursor-pointer"
                >
                  Right: {array[array.length - 1]}
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
                    disabled={!isSorted}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer"
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
                  disabled={isPlaying || isFinished || !isSorted}
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
                  onClick={handleGenerateSortedArray}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border bg-secondary/80 text-foreground font-semibold text-xs hover:bg-secondary transition-all active:scale-95 cursor-pointer"
                >
                  <Shuffle className="h-3 w-3" />
                  <span>Random Sorted</span>
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <Sliders className="h-3 w-3 text-cyan-500" />
                <span>Delay:</span>
                <input
                  type="range"
                  min="200"
                  max="1400"
                  step="50"
                  value={1600 - speed}
                  onChange={(e) => setSpeed(1600 - Number(e.target.value))}
                  className="w-20 accent-cyan-500 cursor-pointer h-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized C++ Code Viewer */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[270px] sm:h-[290px] lg:h-[310px]">
            <CodeViewer
              code={ALGORITHMS["binary-search"].cppCode}
              activeLineNumber={activeLineNumber}
              algorithmName="BinarySearch"
            />
          </div>

          {/* Halving Invariant Card */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              <span>Logarithmic Elimination Invariant</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Because the array is sorted, comparing target with <code>arr[mid]</code> proves monotonically that either [low..mid-1] or [mid+1..high] cannot contain the target. The search domain strictly halves on each iteration: N → N/2 → N/4 ... → 1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
