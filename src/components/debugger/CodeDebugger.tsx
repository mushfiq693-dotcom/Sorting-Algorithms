"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AlgorithmId, SortOperation, CallStackFrame } from "@/types/sorting";
import { ALGORITHMS, ALGORITHM_RUNNERS } from "@/data/algorithms";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  StepBack,
  Layers,
  Terminal,
  Activity,
  Variable,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface CodeDebuggerProps {
  algorithmId: AlgorithmId;
  initialArray?: number[];
}

const DEFAULT_DEBUG_ARRAY: Record<AlgorithmId, number[]> = {
  bubble: [29, 10, 14, 37, 13, 22, 45, 8],
  selection: [35, 12, 48, 19, 7, 60, 24, 15],
  insertion: [24, 13, 9, 45, 18, 32, 7, 50],
  merge: [38, 27, 43, 3, 9, 82, 10, 19],
  quick: [33, 10, 55, 71, 29, 14, 42, 60],
};

export function CodeDebugger({ algorithmId, initialArray }: CodeDebuggerProps) {
  const sampleArray = useMemo(() => {
    return initialArray || DEFAULT_DEBUG_ARRAY[algorithmId] || [29, 10, 14, 37, 13, 22, 45, 8];
  }, [algorithmId, initialArray]);

  const meta = ALGORITHMS[algorithmId];

  // Pre-generate operations using the pure algorithm runner
  const operations = useMemo<SortOperation[]>(() => {
    const runner = ALGORITHM_RUNNERS[algorithmId];
    return runner ? runner(sampleArray) : [];
  }, [algorithmId, sampleArray]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(400);

  // Compute array state, active variables, and call stack at any step index
  const { currentArray, callStack, variables, currentLine, explanation } = useMemo(() => {
    let arr = [...sampleArray];
    const stack: CallStackFrame[] = [];
    let vars: Record<string, any> = {};
    let line: number | null = null;
    let desc = "Debugger ready. Click 'Step Into' to begin execution.";

    const limit = Math.min(currentIndex, operations.length);

    for (let idx = 0; idx < limit; idx++) {
      const op = operations[idx];

      if (op.type === "swap") {
        const [i, j] = op.indices;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      } else if (op.type === "overwrite") {
        arr[op.index] = op.value;
      }

      if (op.type === "call-enter") {
        stack.push({
          id: `${op.fn}-${op.args.join("-")}-${idx}`,
          fn: op.fn,
          args: op.args,
          label: `${op.fn}(${op.args.join(", ")})`,
        });
      } else if (op.type === "call-exit") {
        stack.pop();
      }

      if (idx === limit - 1) {
        line = meta.highlightLine(op);
        desc = op.description || "";
        if (op.snapshot) {
          vars = { ...op.snapshot };
        }
      }
    }

    // Default variable values if at start
    if (limit === 0 && operations.length > 0) {
      vars = {
        n: sampleArray.length,
        arr: [...sampleArray],
        status: "Unstarted",
      };
    }

    return {
      currentArray: arr,
      callStack: stack,
      variables: vars,
      currentLine: line,
      explanation: desc,
    };
  }, [currentIndex, operations, sampleArray, meta]);

  // Step Forward (Step Into)
  const handleStepInto = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, operations.length));
  }, [operations.length]);

  // Step Back (Time-travel backwards)
  const handleStepBack = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) return;

    if (currentIndex >= operations.length) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= operations.length) {
          setIsPlaying(false);
        }
        return next;
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, operations.length, speed]);

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= operations.length;
  const isRecursive = algorithmId === "merge" || algorithmId === "quick";

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span>Interactive Code Debugger</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step through C++ execution line-by-line with live scope variables & call stack.
          </p>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleStepBack}
            disabled={isAtStart || isPlaying}
            aria-label="Step Back one operation"
            title="Step Back one operation"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-cyan-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <StepBack className="h-3.5 w-3.5" />
            <span>Step Back</span>
          </button>

          <button
            onClick={handleStepInto}
            disabled={isAtEnd || isPlaying}
            aria-label="Step Into next operation"
            title="Step Into next operation"
            className="btn-compare-hover inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 py-2 text-xs font-extrabold text-slate-950 shadow-md shadow-cyan-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <StepForward className="h-3.5 w-3.5" />
            <span>Step Into</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isAtEnd}
            aria-label={isPlaying ? "Pause execution" : "Run execution"}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
              isPlaying
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-secondary text-foreground hover:bg-secondary/80 border border-border/60"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> Run
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            aria-label="Reset debugger"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Context Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-background/60 p-3 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 text-foreground/90">
          <Activity className="h-3.5 w-3.5 text-cyan-400" />
          <span>Step {currentIndex} / {operations.length}</span>
          {isAtEnd && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold ml-2">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Speed:</span>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-1.5 w-20 accent-cyan-400 bg-secondary rounded cursor-pointer"
          />
          <span>{speed}ms</span>
        </div>
      </div>

      {/* Main Grid: Left = Code Viewer, Right = Live Variables & Call Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: C++ Code Viewer */}
        <div className="lg:col-span-7 h-[420px]">
          <CodeViewer
            code={meta.cppCode}
            activeLineNumber={currentLine}
            algorithmName={meta.name}
          />
        </div>

        {/* Right Column: Live Variables & Call Stack Panels */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Live Scope Variables Panel */}
          <div className="rounded-2xl border border-border/60 bg-[#0d1117] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3">
              <h4 className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Variable className="h-3.5 w-3.5" /> Live Scope Variables
              </h4>
              <span className="text-[10px] font-mono text-muted-foreground">
                In-Scope
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {Object.keys(variables).length === 0 ? (
                <p className="text-muted-foreground text-[11px]">No active scope variables.</p>
              ) : (
                Object.entries(variables)
                  .filter(([k]) => k !== "arr")
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-background/50 border border-border/40"
                    >
                      <span className="text-slate-400 font-semibold">{key}:</span>
                      <span className="text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {String(val)}
                      </span>
                    </div>
                  ))
              )}

              {/* Current Array Slice Snapshot */}
              <div className="mt-3 pt-2.5 border-t border-border/40">
                <span className="text-[11px] text-muted-foreground mb-1 block">
                  arr[] values:
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentArray.map((val, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/80 border border-border/60 text-slate-300"
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Call Stack Panel (Merge & Quick Sort) */}
          {isRecursive && (
            <div className="rounded-2xl border border-border/60 bg-[#0d1117] p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3">
                <h4 className="text-xs font-bold font-mono text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="h-3.5 w-3.5" /> Call Stack (Recursion Depth)
                </h4>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Depth: {callStack.length}
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-xs">
                {callStack.length === 0 ? (
                  <p className="text-muted-foreground text-[11px]">
                    Top-level call stack idle.
                  </p>
                ) : (
                  [...callStack].reverse().map((frame, frameIdx) => (
                    <div
                      key={frame.id}
                      className={`flex items-center justify-between p-2 rounded-lg border text-[11px] ${
                        frameIdx === 0
                          ? "bg-purple-500/20 border-purple-400/50 text-purple-200 font-bold"
                          : "bg-background/40 border-border/40 text-muted-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-purple-400">↳</span> {frame.label}
                      </span>
                      {frameIdx === 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200">
                          Active Frame
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Contextual In-Context Explanation Box */}
          <div className="rounded-2xl border border-border/60 bg-background/70 p-3.5 text-xs text-foreground/90 leading-relaxed font-mono flex items-start gap-2.5">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-cyan-300 font-bold block mb-0.5">
                Current Execution Step:
              </strong>
              {explanation || "Click 'Step Into' to begin stepping through code."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
