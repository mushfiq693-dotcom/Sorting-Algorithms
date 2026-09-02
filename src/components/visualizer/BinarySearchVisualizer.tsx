"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
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

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/80 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
      {/* Visualizer Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground font-sans flex items-center gap-2">
              <span>Binary Search Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                Divide &amp; Conquer O(log n)
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Requires sorted input. Cuts search range in half on every comparison.
            </p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-border bg-secondary/80 flex items-center gap-2">
            <span className="text-muted-foreground">Comparisons:</span>
            <span className="font-bold text-foreground">{comparisons} / ≤{maxPossibleSteps}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-border bg-secondary/80 flex items-center gap-2">
            <span className="text-muted-foreground">Range [low..high]:</span>
            <span className="font-bold text-cyan-500">[{low}..{high}]</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-border bg-secondary/80 flex items-center gap-2">
            <span className="text-muted-foreground">Status:</span>
            <span className={`font-bold ${foundIndex !== null ? "text-emerald-500" : isFinished ? "text-rose-400" : isPlaying ? "text-cyan-400" : "text-muted-foreground"}`}>
              {foundIndex !== null ? `FOUND (mid: ${foundIndex})` : isFinished ? "NOT FOUND (-1)" : isPlaying ? "HALVING..." : "IDLE"}
            </span>
          </div>
        </div>
      </div>

      {/* Precondition Verification Warning Banner (if unsorted) */}
      {!isSorted && (
        <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              <strong>PRECONDITION VIOLATED:</strong> Binary Search produces undefined/incorrect results on unsorted data!
            </span>
          </div>
          <button
            onClick={handleSortArray}
            className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
          >
            Sort Array Now
          </button>
        </div>
      )}

      {/* Target Configuration & Presets Toolbar */}
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
            onClick={() => handleSetTarget(array[Math.floor(array.length / 2)])}
            className="px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            title="Exact middle element: 1-step O(1) best case"
          >
            Best (Mid): {array[Math.floor(array.length / 2)]}
          </button>
          <button
            onClick={() => handleSetTarget(array[0])}
            className="px-2 py-0.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer"
            title="Leftmost element: O(log n) steps"
          >
            Left: {array[0]}
          </button>
          <button
            onClick={() => handleSetTarget(array[array.length - 1])}
            className="px-2 py-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer"
            title="Rightmost element: O(log n) steps"
          >
            Right: {array[array.length - 1]}
          </button>
          <button
            onClick={() => handleSetTarget(array[Math.floor(array.length / 4)])}
            className="px-2 py-0.5 rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 transition-colors cursor-pointer"
          >
            Quarter: {array[Math.floor(array.length / 4)]}
          </button>
          <button
            onClick={() => handleSetTarget(999)}
            className="px-2 py-0.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
            title="Absent element: Exhausts search interval"
          >
            Absent: 999
          </button>
        </div>
      </div>

      {/* Main Array Bars Stage with Active Interval & Discarded Halves */}
      <div className="h-60 sm:h-68 rounded-2xl border border-border/80 bg-card/60 p-4 flex items-end justify-center gap-2 sm:gap-3 relative overflow-hidden shadow-inner">
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
              disabled={!isSorted}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 transition-all active:scale-95 shadow-md shadow-cyan-500/20 cursor-pointer"
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
            disabled={isPlaying || isFinished || !isSorted}
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
            onClick={handleGenerateSortedArray}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-secondary/80 text-foreground font-semibold text-xs hover:bg-secondary transition-all active:scale-95 cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Random Sorted</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Sliders className="h-3.5 w-3.5 text-cyan-500" />
          <span>Speed:</span>
          <input
            type="range"
            min="200"
            max="1400"
            step="50"
            value={1600 - speed}
            onChange={(e) => setSpeed(1600 - Number(e.target.value))}
            className="w-24 accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
