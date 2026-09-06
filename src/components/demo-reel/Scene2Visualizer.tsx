"use client";

import React, { useState, useEffect, useRef } from "react";
import { quickSort } from "@/algorithms/quickSort";
import { ALGORITHMS } from "@/data/algorithms";
import { SortOperation } from "@/types/sorting";
import { Code2, Cpu, Sparkles, CheckCircle2, Zap } from "lucide-react";

/**
 * Scene 2: Sorting Visualizer (Quick Sort in Action)
 * 
 * Note: /demo-reel is intentionally designed as an automated screen-recording tool
 * for social media marketing reels. Its scripted animations bypass prefers-reduced-motion
 * by design to guarantee deterministic recording output across environments.
 */
const INITIAL_ARRAY = [52, 28, 85, 19, 73, 34, 62, 11];

export function Scene2Visualizer() {
  const [array, setArray] = useState<number[]>(INITIAL_ARRAY);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [currentLineNumber, setCurrentLineNumber] = useState<number | null>(null);
  const [description, setDescription] = useState<string>("Initializing QuickSort partition...");
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [swapsCount, setSwapsCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const isRunningRef = useRef(true);

  // Compute full operations list deterministically
  const operations: SortOperation[] = React.useMemo(() => {
    return quickSort([...INITIAL_ARRAY]);
  }, []);

  const meta = ALGORITHMS["quick"];

  useEffect(() => {
    isRunningRef.current = true;

    async function runScriptedVisualizer() {
      let currentArr = [...INITIAL_ARRAY];
      let comps = 0;
      let swaps = 0;
      const sorted = new Set<number>();

      for (let i = 0; i < operations.length; i++) {
        if (!isRunningRef.current) return;

        const op = operations[i];
        setCurrentStepIndex(i);
        setDescription(op.description || "Executing partition...");

        // Map code line highlight
        const line = meta?.highlightLine ? meta.highlightLine(op) : null;
        setCurrentLineNumber(line);

        // Apply operation state
        switch (op.type) {
          case "pivot":
            setPivotIndex(op.index ?? null);
            setComparingIndices([]);
            setSwappingIndices([]);
            break;

          case "compare":
            if (op.indices) {
              setComparingIndices(op.indices);
              comps++;
              setComparisonsCount(comps);
            }
            setSwappingIndices([]);
            break;

          case "swap":
            if (op.indices) {
              setSwappingIndices(op.indices);
              const [idxA, idxB] = op.indices;
              const temp = currentArr[idxA];
              currentArr[idxA] = currentArr[idxB];
              currentArr[idxB] = temp;
              setArray([...currentArr]);
              swaps++;
              setSwapsCount(swaps);
            }
            break;

          case "sorted":
            if (op.indices) {
              op.indices.forEach((idx) => sorted.add(idx));
              setSortedIndices(Array.from(sorted));
            }
            setComparingIndices([]);
            setSwappingIndices([]);
            break;

          default:
            break;
        }

        // Tuned step delay for rhythmic social reel viewing
        await new Promise((r) => setTimeout(r, 420));
      }

      if (!isRunningRef.current) return;

      // Final celebration state
      setSortedIndices(Array.from({ length: INITIAL_ARRAY.length }, (_, k) => k));
      setComparingIndices([]);
      setSwappingIndices([]);
      setPivotIndex(null);
      setCurrentLineNumber(20);
      setDescription("Array sorted completely in O(n log n) time!");
      setIsFinished(true);
    }

    runScriptedVisualizer();

    return () => {
      isRunningRef.current = false;
    };
  }, [operations, meta]);

  const maxVal = Math.max(...INITIAL_ARRAY);

  // Shortened, mobile-optimized C++ snippet for Quick Sort
  const cppSnippet = [
    "int partition(vector<int>& arr, int low, int high) {",
    "    int pivot = arr[high]; // Select Pivot",
    "    int i = low - 1;",
    "    for (int j = low; j < high; j++) {",
    "        if (arr[j] < pivot) { // Compare",
    "            swap(arr[++i], arr[j]); // Swap",
    "        }",
    "    }",
    "    swap(arr[i + 1], arr[high]);",
    "    return i + 1;",
    "}",
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#1C1714] text-[#E8DFD4] select-none overflow-hidden font-sans">
      {/* Top Header & Algorithm Metrics */}
      <div className="relative z-10 pt-2 space-y-2">
        <div className="flex items-center justify-between border-b border-[#4A3F35]/70 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-heading text-lg font-bold text-white">
              Quick Sort Studio
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B08422]/15 text-[#C9A962] border border-[#B08422]/30 font-bold">
              O(n log n)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
              Divide &amp; Conquer
            </span>
          </div>
        </div>

        {/* Dynamic Telemetry / Status Pill */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#14100D] border border-[#4A3F35] text-[11px] font-mono">
          <span className="text-cyan-300 truncate max-w-[200px] flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-cyan-400 shrink-0" />
            {description}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
            <span>C: <strong className="text-amber-400 font-bold">{comparisonsCount}</strong></span>
            <span>S: <strong className="text-rose-400 font-bold">{swapsCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Center Area: Large Dynamic Array Bars */}
      <div className="relative z-10 my-auto w-full py-2">
        <div className="rounded-2xl border border-[#4A3F35] bg-[#14100D]/90 p-3.5 shadow-2xl backdrop-blur-md">
          <div className="flex h-36 items-end justify-center gap-2 px-1">
            {array.map((val, idx) => {
              const isPivot = pivotIndex === idx;
              const isComparing = comparingIndices.includes(idx);
              const isSwapping = swappingIndices.includes(idx);
              const isSorted = sortedIndices.includes(idx);
              const heightPercent = Math.max(18, Math.round((val / maxVal) * 92));

              let barGradient = "from-[#B8953F] via-[#C9A962] to-[#D4B872]";
              let glowBorder = "border-[#C9A962]/40";
              let badge = null;

              if (isPivot) {
                barGradient = "from-purple-600 via-indigo-500 to-purple-400";
                glowBorder = "border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.7)] ring-2 ring-purple-400";
                badge = "PIVOT";
              } else if (isSwapping) {
                barGradient = "from-rose-600 via-red-500 to-amber-500";
                glowBorder = "border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)] ring-2 ring-rose-400";
                badge = "SWAP";
              } else if (isComparing) {
                barGradient = "from-amber-500 to-yellow-400";
                glowBorder = "border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)] ring-2 ring-amber-400";
                badge = "COMP";
              } else if (isSorted) {
                barGradient = "from-emerald-500 to-teal-400";
                glowBorder = "border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
              }

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full transition-all duration-150 relative"
                >
                  {badge && (
                    <span className="absolute -top-4 text-[8px] font-mono font-extrabold px-1 py-0.2 rounded bg-black/80 text-white border border-white/20 tracking-wider">
                      {badge}
                    </span>
                  )}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md bg-gradient-to-t ${barGradient} border-t ${glowBorder} transition-all duration-150`}
                  />
                  <span className="text-[10px] font-mono font-bold text-white mt-1">
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Synchronized Live Code Highlight Panel */}
      <div className="relative z-10 pb-2">
        <div className="rounded-xl border border-[#4A3F35] bg-[#14100D] overflow-hidden shadow-xl text-[11px] font-mono">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#4A3F35] bg-[#1C1714]">
            <span className="flex items-center gap-1.5 text-xs text-[#C9A962] font-semibold">
              <Code2 className="h-3.5 w-3.5" />
              <span>quicksort.cpp • Live Execution Sync</span>
            </span>
            <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold">
              Line {currentLineNumber || "--"}
            </span>
          </div>

          <div className="p-2 space-y-0.5 max-h-32 overflow-hidden text-[10px] leading-tight">
            {cppSnippet.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isCurrentLine = currentLineNumber === lineNum;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-1.5 py-0.5 rounded transition-colors ${
                    isCurrentLine
                      ? "bg-[#B08422]/25 border-l-2 border-[#C9A962] text-white font-bold"
                      : "text-slate-400 opacity-80"
                  }`}
                >
                  <span className="w-4 text-right text-[9px] text-slate-500 select-none">
                    {lineNum}
                  </span>
                  <span className="truncate">{lineText}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
