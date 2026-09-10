"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Play,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Code2,
  HelpCircle,
  Zap,
} from "lucide-react";

export function StackOperationsStudio() {
  const [activeTab, setActiveTab] = useState<"stack" | "postfix" | "quicksort">("stack");

  // --- TAB 1: STACK ADT (PUSH / POP) ---
  const MAXSTK = 8;
  const [stack, setStack] = useState<string[]>(["XXX", "YYY", "ZZZ"]);
  const [inputValue, setInputValue] = useState("");
  const [stackStatusMessage, setStackStatusMessage] = useState<{
    text: string;
    type: "info" | "success" | "error" | "warning";
  }>({ text: "Stack initialized with 3 elements (TOP = 3, MAXSTK = 8).", type: "info" });

  const handlePush = (val?: string) => {
    const itemToPush = val || inputValue.trim();
    if (!itemToPush) {
      setStackStatusMessage({ text: "Please enter an item to PUSH.", type: "warning" });
      return;
    }
    if (stack.length >= MAXSTK) {
      setStackStatusMessage({
        text: "OVERFLOW: Cannot PUSH into full stack (TOP = MAXSTK = 8)!",
        type: "error",
      });
      return;
    }
    setStack([...stack, itemToPush]);
    setInputValue("");
    setStackStatusMessage({
      text: `PUSH('${itemToPush}') successful. New TOP = ${stack.length + 1}.`,
      type: "success",
    });
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setStackStatusMessage({
        text: "UNDERFLOW: Cannot POP from an empty stack (TOP = 0)!",
        type: "error",
      });
      return;
    }
    const poppedItem = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setStackStatusMessage({
      text: `POP() successful. Removed '${poppedItem}'. New TOP = ${stack.length - 1}.`,
      type: "info",
    });
  };

  const handleResetStack = () => {
    setStack(["XXX", "YYY", "ZZZ"]);
    setStackStatusMessage({
      text: "Stack reset to initial state (TOP = 3, Elements: XXX, YYY, ZZZ).",
      type: "info",
    });
  };

  // --- TAB 2: POSTFIX EVALUATION & INFIX TRACE ---
  // Example 6.6 Postfix evaluation steps: 5, 6, 2, +, *, 12, 4, /, -
  const postfixSteps = [
    { step: 0, scanned: "Start", stack: [], action: "Initial state before evaluation" },
    { step: 1, scanned: "5", stack: [5], action: "Push operand 5" },
    { step: 2, scanned: "6", stack: [5, 6], action: "Push operand 6" },
    { step: 3, scanned: "2", stack: [5, 6, 2], action: "Push operand 2" },
    { step: 4, scanned: "+", stack: [5, 8], action: "Pop 2, 6 -> Evaluate 6 + 2 = 8 -> Push 8" },
    { step: 5, scanned: "*", stack: [40], action: "Pop 8, 5 -> Evaluate 5 * 8 = 40 -> Push 40" },
    { step: 6, scanned: "12", stack: [40, 12], action: "Push operand 12" },
    { step: 7, scanned: "4", stack: [40, 12, 4], action: "Push operand 4" },
    { step: 8, scanned: "/", stack: [40, 3], action: "Pop 4, 12 -> Evaluate 12 / 4 = 3 -> Push 3" },
    { step: 9, scanned: "-", stack: [37], action: "Pop 3, 40 -> Evaluate 40 - 3 = 37 -> Push 37" },
    { step: 10, scanned: ")", stack: [37], action: "Sentinel reached: Final Result = 37" },
  ];

  const [currentPostfixStep, setCurrentPostfixStep] = useState(0);
  const [isPostfixPlaying, setIsPostfixPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPostfixPlaying && currentPostfixStep < postfixSteps.length - 1) {
      timer = setTimeout(() => {
        setCurrentPostfixStep((s) => s + 1);
      }, 1200);
    } else if (currentPostfixStep >= postfixSteps.length - 1) {
      setIsPostfixPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPostfixPlaying, currentPostfixStep, postfixSteps.length]);

  // --- TAB 3: QUICKSORT PARTITIONING (EXAMPLE 6.8) ---
  const quicksortSteps = [
    {
      step: 0,
      array: [44, 33, 11, 55, 77, 90, 40, 60, 99, 22, 88, 66],
      pivotIdx: 0,
      desc: "Initial array. Pivot = 44 at index 0.",
      swapped: [],
    },
    {
      step: 1,
      array: [22, 33, 11, 55, 77, 90, 40, 60, 99, 44, 88, 66],
      pivotIdx: 9,
      desc: "Pass 1 (R-to-L): Found 22 < 44. Interchange 44 and 22.",
      swapped: [0, 9],
    },
    {
      step: 2,
      array: [22, 33, 11, 44, 77, 90, 40, 60, 99, 55, 88, 66],
      pivotIdx: 3,
      desc: "Pass 2 (L-to-R): Found 55 > 44. Interchange 44 and 55.",
      swapped: [3, 9],
    },
    {
      step: 3,
      array: [22, 33, 11, 40, 77, 90, 44, 60, 99, 55, 88, 66],
      pivotIdx: 6,
      desc: "Pass 3 (R-to-L): Found 40 < 44. Interchange 44 and 40.",
      swapped: [3, 6],
    },
    {
      step: 4,
      array: [22, 33, 11, 40, 44, 90, 77, 60, 99, 55, 88, 66],
      pivotIdx: 4,
      desc: "Pass 4 (L-to-R): Found 77 > 44. Interchange 44 and 77.",
      swapped: [4, 6],
    },
    {
      step: 5,
      array: [22, 33, 11, 40, 44, 90, 77, 60, 99, 55, 88, 66],
      pivotIdx: 4,
      desc: "Pass 5 (R-to-L): Meets 44 at index 4. Partition finished! Pivot 44 locked at final index 4 (1-based index 5).",
      swapped: [],
    },
  ];

  const [currentQsStep, setCurrentQsStep] = useState(0);

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-card/95 backdrop-blur-xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-500">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              Chapter 6: Stacks & Partitioning Interactive Lab
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Simulation
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Hands-on visualization of LIFO Stack Operations, Postfix Evaluation, and Quicksort Partitioning
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-secondary/80 p-1 rounded-2xl border border-border/60 text-xs">
          <button
            onClick={() => setActiveTab("stack")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === "stack"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Array Stack (Push/Pop)
          </button>
          <button
            onClick={() => setActiveTab("postfix")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === "postfix"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Postfix Evaluator (Ex 6.6)
          </button>
          <button
            onClick={() => setActiveTab("quicksort")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === "quicksort"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Quicksort Partition (Ex 6.8)
          </button>
        </div>
      </div>

      {/* --- TAB 1: STACK OPERATIONS --- */}
      {activeTab === "stack" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Enter item (e.g. WWW)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePush()}
              className="px-3.5 py-2 rounded-xl border border-border bg-background/80 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/40 w-44"
            />
            <button
              onClick={() => handlePush()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              PUSH (Procedure 6.1)
            </button>
            <button
              onClick={handlePop}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              POP (Procedure 6.2)
            </button>
            <button
              onClick={handleResetStack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-xs font-medium border border-border transition-all ml-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Status message */}
          <div
            className={`p-3 rounded-2xl text-xs flex items-center gap-2 border font-medium ${
              stackStatusMessage.type === "error"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                : stackStatusMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : stackStatusMessage.type === "warning"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
            }`}
          >
            {stackStatusMessage.type === "error" ? (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            ) : stackStatusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <Sparkles className="h-4 w-4 shrink-0" />
            )}
            <span>{stackStatusMessage.text}</span>
          </div>

          {/* Stack Horizontal Array Visualization (Fig 6.5) */}
          <div className="space-y-3 p-5 rounded-2xl bg-secondary/40 border border-border/80">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>STACK Array (1-Based Representation)</span>
              <span>
                Capacity: <strong>{MAXSTK}</strong> | Current TOP: <strong>{stack.length}</strong>
              </span>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: MAXSTK }).map((_, idx) => {
                const element = stack[idx];
                const isOccupied = element !== undefined;
                const isTop = idx === stack.length - 1;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-full h-16 rounded-xl border flex flex-col items-center justify-center font-mono text-sm font-bold transition-all relative ${
                        isTop
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/20 scale-105"
                          : isOccupied
                          ? "bg-secondary/90 border-border text-foreground"
                          : "bg-background/40 border-dashed border-border/60 text-muted-foreground/40"
                      }`}
                    >
                      {element || "—"}
                      {isTop && (
                        <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-cyan-500 text-[9px] text-white font-sans font-bold">
                          TOP
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">[{idx + 1}]</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: POSTFIX EVALUATION (EXAMPLE 6.6) --- */}
      {activeTab === "postfix" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400">Expression P:</span>
              <p className="text-sm font-mono font-bold text-foreground mt-0.5">
                5, 6, 2, +, *, 12, 4, /, - )
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPostfixPlaying(!isPostfixPlaying)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
              >
                <Play className={`h-3.5 w-3.5 ${isPostfixPlaying ? "animate-spin" : ""}`} />
                {isPostfixPlaying ? "Playing..." : "Auto Trace"}
              </button>
              <button
                onClick={() => {
                  setIsPostfixPlaying(false);
                  setCurrentPostfixStep((s) => Math.max(0, s - 1));
                }}
                disabled={currentPostfixStep === 0}
                className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-medium border border-border disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => {
                  setIsPostfixPlaying(false);
                  setCurrentPostfixStep((s) => Math.min(postfixSteps.length - 1, s + 1));
                }}
                disabled={currentPostfixStep === postfixSteps.length - 1}
                className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-medium border border-border disabled:opacity-40"
              >
                Next
              </button>
              <button
                onClick={() => {
                  setIsPostfixPlaying(false);
                  setCurrentPostfixStep(0);
                }}
                className="p-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground border border-border"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Tokens Ribbon */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-secondary/40 border border-border/60">
            {postfixSteps.slice(1).map((item, idx) => {
              const isCurrent = idx + 1 === currentPostfixStep;
              const isPassed = idx + 1 < currentPostfixStep;

              return (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-cyan-500 text-white scale-110 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400"
                      : isPassed
                      ? "bg-secondary text-muted-foreground line-through opacity-70"
                      : "bg-background/80 border border-border/60 text-foreground"
                  }`}
                >
                  {item.scanned}
                </div>
              );
            })}
          </div>

          {/* Active Step Details & Stack State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-2">
              <span className="text-[11px] font-mono uppercase text-muted-foreground">
                Step {currentPostfixStep} of {postfixSteps.length - 1}
              </span>
              <h4 className="text-sm font-bold text-foreground">
                Scanned: <span className="text-cyan-400 font-mono">"{postfixSteps[currentPostfixStep].scanned}"</span>
              </h4>
              <p className="text-xs text-muted-foreground">
                {postfixSteps[currentPostfixStep].action}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-2">
              <span className="text-[11px] font-mono uppercase text-muted-foreground">
                Evaluation Stack State
              </span>
              <div className="flex items-center gap-2 min-h-10 font-mono">
                {postfixSteps[currentPostfixStep].stack.length === 0 ? (
                  <span className="text-xs text-muted-foreground/60 italic">(Stack is Empty)</span>
                ) : (
                  postfixSteps[currentPostfixStep].stack.map((val, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold"
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: QUICKSORT PARTITIONING (EXAMPLE 6.8) --- */}
      {activeTab === "quicksort" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400">Example 6.8 Partition Step:</span>
              <p className="text-xs text-muted-foreground">
                Pivot = <strong>44</strong> | Dividing into left (&lt;44) and right (&gt;44) sublists
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentQsStep((s) => Math.max(0, s - 1))}
                disabled={currentQsStep === 0}
                className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-medium border border-border disabled:opacity-40"
              >
                Prev Pass
              </button>
              <button
                onClick={() => setCurrentQsStep((s) => Math.min(quicksortSteps.length - 1, s + 1))}
                disabled={currentQsStep === quicksortSteps.length - 1}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 disabled:opacity-40"
              >
                Next Pass
              </button>
              <button
                onClick={() => setCurrentQsStep(0)}
                className="p-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground border border-border"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Step description */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 text-xs text-foreground font-medium">
            <span className="text-cyan-400 font-bold font-mono">Pass {quicksortSteps[currentQsStep].step}: </span>
            {quicksortSteps[currentQsStep].desc}
          </div>

          {/* Array visualizer */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 p-4 rounded-2xl bg-secondary/20 border border-border/60">
            {quicksortSteps[currentQsStep].array.map((val, idx) => {
              const isPivot = idx === quicksortSteps[currentQsStep].pivotIdx;
              const isSwapped = quicksortSteps[currentQsStep].swapped.includes(idx);
              const isFinished = currentQsStep === 5;
              const isLeftSublist = isFinished && idx < 4;
              const isRightSublist = isFinished && idx > 4;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full h-14 rounded-xl border flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                      isPivot
                        ? "bg-amber-500/25 border-amber-500 text-amber-400 shadow-md shadow-amber-500/20 scale-105"
                        : isSwapped
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                        : isLeftSublist
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : isRightSublist
                        ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400"
                        : "bg-background/80 border-border text-foreground"
                    }`}
                  >
                    {val}
                    {isPivot && (
                      <span className="text-[8px] uppercase tracking-wider font-bold text-amber-400">
                        Pivot
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">[{idx + 1}]</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
