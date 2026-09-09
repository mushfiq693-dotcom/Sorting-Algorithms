"use client";

import React, { useState, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import { AlgorithmId } from "@/types/sorting";
import { BUG_HUNT_CHALLENGES } from "@/data/bugHunt";
import { ALGORITHM_RUNNERS } from "@/data/algorithms";
import { ArrayBars } from "@/components/visualizer/ArrayBars";
import {
  Bug,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Lightbulb,
  Sparkles,
  HelpCircle,
  Wrench,
  Check,
  Award,
  Database,
  Layers,
  Link as LinkIcon,
  Search,
  Clock,
  Cpu,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { useProgressSync } from "@/hooks/useProgressSync";
import { calculateBugHuntScore } from "@/lib/scoring";

interface BugHuntProps {
  algorithmId: AlgorithmId;
}

const SAMPLE_BUG_ARRAY = [45, 12, 89, 34, 7, 60, 23, 19];

export function BugHunt({ algorithmId }: BugHuntProps) {
  const challenge = BUG_HUNT_CHALLENGES[algorithmId];
  const { syncActivityScore } = useProgressSync();
  const lines = useMemo(() => challenge.buggyCode.split("\n"), [challenge.buggyCode]);

  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [editedLineText, setEditedLineText] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [wrongAttemptsCount, setWrongAttemptsCount] = useState<number>(0);
  const [earnedScore, setEarnedScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    status: "idle" | "correct" | "wrong-line" | "wrong-fix";
    message: string;
  }>({ status: "idle", message: "" });

  // Execution state for sorting preview
  const [previewArray, setPreviewArray] = useState<number[]>([...SAMPLE_BUG_ARRAY]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [fixedSuccessfully, setFixedSuccessfully] = useState<boolean>(false);

  // Custom simulation state for non-sorting data structures & algorithms
  const [customSimState, setCustomSimState] = useState<{
    status: "idle" | "running" | "flawed-error" | "fixed-success";
    step: number;
    log: string[];
  }>({
    status: "idle",
    step: 0,
    log: [],
  });

  const isSorting = [
    "bubble",
    "selection",
    "insertion",
    "merge",
    "quick",
  ].includes(algorithmId);

  // Handle line selection for editing
  const handleSelectLine = (lineNum: number) => {
    if (fixedSuccessfully) return;
    setSelectedLine(lineNum);
    setEditedLineText(lines[lineNum - 1] || "");
    setFeedback({ status: "idle", message: "" });
  };

  // Run flawed or fixed algorithm visually
  const handleRunExecution = useCallback(
    async (isFixed: boolean) => {
      setIsRunning(true);

      if (isSorting) {
        setPreviewArray([...SAMPLE_BUG_ARRAY]);
        setComparingIndices([]);
        setSwappingIndices([]);
        setSortedIndices([]);

        const runner = isFixed
          ? ALGORITHM_RUNNERS[algorithmId]
          : challenge.flawedRunner;

        const ops = runner ? runner([...SAMPLE_BUG_ARRAY]) : [];
        let currentArr = [...SAMPLE_BUG_ARRAY];

        for (let i = 0; i < ops.length; i++) {
          const op = ops[i];

          if (op.type === "compare" || op.type === "merge-compare") {
            setComparingIndices(
              op.type === "compare" ? op.indices : [op.leftIndex, op.rightIndex]
            );
            setSwappingIndices([]);
          } else if (op.type === "swap") {
            const [a, b] = op.indices;
            setComparingIndices([]);
            setSwappingIndices([a, b]);
            const temp = currentArr[a];
            currentArr[a] = currentArr[b];
            currentArr[b] = temp;
            setPreviewArray([...currentArr]);
          } else if (op.type === "overwrite") {
            setComparingIndices([]);
            setSwappingIndices([op.index]);
            currentArr[op.index] = op.value;
            setPreviewArray([...currentArr]);
          } else if (op.type === "sorted") {
            setComparingIndices([]);
            setSwappingIndices([]);
            setSortedIndices(op.indices);
          }

          await new Promise((r) => setTimeout(r, 60));
        }

        setComparingIndices([]);
        setSwappingIndices([]);
        setIsRunning(false);
      } else {
        // Topic-specific non-sorting simulation
        setCustomSimState({
          status: "running",
          step: 1,
          log: ["Executing code..."],
        });

        await new Promise((r) => setTimeout(r, 450));
        setCustomSimState((prev) => ({
          ...prev,
          step: 2,
          log: [...prev.log, "Processing operations..."],
        }));

        await new Promise((r) => setTimeout(r, 550));
        setCustomSimState({
          status: isFixed ? "fixed-success" : "flawed-error",
          step: 3,
          log: isFixed
            ? ["Operations completed cleanly without error.", "Expected behavior achieved!"]
            : ["Execution halted!", challenge.hint],
        });

        setIsRunning(false);
      }
    },
    [algorithmId, challenge.flawedRunner, challenge.hint, isSorting]
  );

  // Validate user fix
  const handleVerifyFix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLine) return;

    // Check if correct line was targeted
    if (selectedLine !== challenge.buggyLineNumber) {
      setWrongAttemptsCount((prev) => prev + 1);
      setFeedback({
        status: "wrong-line",
        message: `Line ${selectedLine} is actually correct! Check the faulty condition or assignment instead. (-10 pts penalty)`,
      });
      return;
    }

    // Check if the edited text correctly fixes the bug
    const isFixValid = challenge.validateFix(editedLineText);
    if (!isFixValid) {
      setWrongAttemptsCount((prev) => prev + 1);
      setFeedback({
        status: "wrong-fix",
        message: `You identified the right line (Line ${selectedLine})! But this syntax edit still doesn't fix the bug. (-10 pts penalty)`,
      });
      return;
    }

    // Success!
    const finalScore = calculateBugHuntScore(hintsUsedCount, wrongAttemptsCount);
    setEarnedScore(finalScore);
    setFixedSuccessfully(true);
    setFeedback({
      status: "correct",
      message: `🎉 Fixed! ${challenge.explanation}`,
    });

    syncActivityScore(
      algorithmId,
      "bug_hunt",
      finalScore,
      `${challenge.title} (${finalScore}/100 pts)`
    );

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    handleRunExecution(true);
  };

  // Reset challenge
  const handleResetChallenge = () => {
    setSelectedLine(null);
    setEditedLineText("");
    setShowHint(false);
    setHintsUsedCount(0);
    setWrongAttemptsCount(0);
    setEarnedScore(null);
    setFeedback({ status: "idle", message: "" });
    setFixedSuccessfully(false);
    setPreviewArray([...SAMPLE_BUG_ARRAY]);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setCustomSimState({ status: "idle", step: 0, log: [] });
  };

  const handleToggleHint = () => {
    if (!showHint) {
      setHintsUsedCount((prev) => prev + 1);
    }
    setShowHint(!showHint);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 sm:p-6 backdrop-blur-md shadow-sm dark:shadow-2xl">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bug className="h-4 w-4 text-rose-500" />
            <span>Bug-Hunt Challenge</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {challenge.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Hint Toggle */}
          <button
            onClick={handleToggleHint}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              showHint
                ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                : "border-border bg-secondary/80 text-foreground hover:bg-secondary"
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>{showHint ? "Hide Hint" : "Need a Hint? (-15 pts)"}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleResetChallenge}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Description & Hint Box */}
      <div className="space-y-2">
        <p className="text-xs text-foreground leading-relaxed">
          {challenge.description}
        </p>

        {showHint && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed flex items-start gap-2 animate-in fade-in">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong className="font-semibold text-amber-700 dark:text-amber-300">Hint: </strong>
              {challenge.hint}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Left = Code with Clickable Lines, Right = Visualizer Preview & Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Buggy Code Viewer with Clickable Lines */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-secondary/30 overflow-hidden shadow-sm dark:shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-secondary/70 px-4 py-2.5 text-xs font-mono text-muted-foreground">
            <span className="text-foreground font-semibold flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-rose-500" /> Click a line to fix the bug
            </span>
            <span>{lines.length} lines</span>
          </div>

          <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto select-none">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isSelected = selectedLine === lineNum;

              return (
                <div
                  key={lineNum}
                  onClick={() => handleSelectLine(lineNum)}
                  className={`flex items-center rounded-md px-2 py-1 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-rose-500/20 text-rose-700 dark:text-rose-200 border-l-4 border-rose-500 font-bold"
                      : "hover:bg-secondary/60 text-foreground"
                  }`}
                >
                  <span
                    className={`w-7 shrink-0 text-right pr-3 text-xs select-none ${
                      isSelected ? "text-rose-500 font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {lineNum}
                  </span>
                  <span className="whitespace-pre flex-1">{line || " "}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-700 dark:text-rose-200 px-1.5 py-0.5 rounded ml-2">
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Topic-Aware Execution Visualizer + Line Fix Form + Feedback */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Context-Aware Visualizer Preview */}
          <div className="rounded-2xl border border-border bg-card p-3.5 backdrop-blur-sm shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-foreground flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-cyan-500" /> Execution Output
              </span>
              <button
                onClick={() => handleRunExecution(fixedSuccessfully)}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-2.5 py-1 text-xs font-semibold text-white hover:from-blue-500 transition-all disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <Play className="h-3 w-3 fill-current" />
                {isRunning ? "Running..." : fixedSuccessfully ? "Run Fixed Code" : "Run Flawed Code"}
              </button>
            </div>

            {/* 1. SORTING ALGORITHMS (ArrayBars) */}
            {isSorting && (
              <ArrayBars
                array={previewArray}
                comparingIndices={comparingIndices}
                swappingIndices={swappingIndices}
                sortedIndices={sortedIndices}
                pivotIndex={null}
                activeRange={null}
                overwritingIndex={null}
                containerHeight="h-44"
              />
            )}

            {/* 2. QUEUE (Circular Buffer State) */}
            {algorithmId === "queue" && (
              <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Database className="h-3.5 w-3.5 text-cyan-400" />
                    Circular Buffer (arr[8]):
                  </span>
                  <span className="text-primary font-bold">
                    front = 0 | capacity = 8
                  </span>
                </div>

                {/* 8-slot array display */}
                <div className="grid grid-cols-8 gap-1 text-center text-[10px]">
                  {[10, 20, 30, 40, 50, 60, 70, 80].map((val, idx) => {
                    const isRearFlawed = customSimState.status === "flawed-error" && idx === 7;
                    const isRearFixed = customSimState.status === "fixed-success" && idx === 0;

                    return (
                      <div
                        key={idx}
                        className={`p-1.5 rounded-lg border flex flex-col justify-between ${
                          isRearFlawed
                            ? "bg-rose-500/20 border-rose-500 text-rose-400 font-bold animate-pulse"
                            : isRearFixed
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                            : "bg-card border-border/80 text-foreground"
                        }`}
                      >
                        <span className="text-muted-foreground text-[9px]">[{idx}]</span>
                        <span className="font-bold text-xs">{val}</span>
                        <span className="text-[8px] text-muted-foreground mt-0.5">
                          {idx === 0 ? "F" : idx === 7 ? "R" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Live execution state */}
                <div className="p-2 rounded-lg bg-card border border-border text-[11px] leading-snug">
                  {customSimState.status === "flawed-error" ? (
                    <div className="text-rose-400 flex items-start gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>
                        <strong>Out of Bounds Corrupted!</strong> <code className="text-rose-300">rear = 8</code> exceeded capacity. Slots at index 0 were never reused without <code className="text-amber-300">% capacity</code>!
                      </span>
                    </div>
                  ) : customSimState.status === "fixed-success" ? (
                    <div className="text-emerald-400 flex items-start gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong>Modulo Wrap Success!</strong> <code className="text-emerald-300">rear = (7 + 1) % 8 = 0</code>. Enqueue seamlessly wrapped around to index 0!
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Click <strong>Run Flawed Code</strong> to observe rear exceeding boundary without modulo wrapping.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 3. STACK (ArrayStack pop underflow) */}
            {algorithmId === "stack" && (
              <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-indigo-400" />
                    Stack Container:
                  </span>
                  <span className="text-primary font-bold">
                    arr[100] | topIndex = 0
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="w-32 flex flex-col border-2 border-t-0 border-border bg-card p-1.5 rounded-b-xl gap-1">
                    <div className="p-2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-center font-bold text-xs">
                      arr[0] = 42 (1 Element)
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <div>Operation: <code>pop()</code></div>
                    <div>State: <code>topIndex == 0</code></div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-card border border-border text-[11px] leading-snug">
                  {customSimState.status === "flawed-error" ? (
                    <div className="text-rose-400 flex items-start gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>
                        <strong>False Underflow Error!</strong> <code className="text-rose-300">if (topIndex == 0) return -1</code> erroneously aborted while 1 valid element existed at index 0.
                      </span>
                    </div>
                  ) : customSimState.status === "fixed-success" ? (
                    <div className="text-emerald-400 flex items-start gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong>Pop Success!</strong> Validly popped 42 and decremented <code className="text-emerald-300">topIndex</code> to -1 (empty).
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Click <strong>Run Flawed Code</strong> to see <code>pop()</code> fail on a 1-element stack.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 4. LINKED LIST (Memory orphan on prepend) */}
            {algorithmId === "linked-list" && (
              <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
                    Pointer Linking Diagram:
                  </span>
                  <span className="text-primary font-bold">
                    insertAtHead(30)
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1.5 py-2 overflow-x-auto text-[11px]">
                  <span className="text-emerald-400 font-bold">head ↓</span>
                  <div className="px-2.5 py-1.5 rounded-lg border border-primary bg-primary/20 font-bold text-white">
                    [ 30 | next ]
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  {customSimState.status === "flawed-error" ? (
                    <div className="px-2.5 py-1.5 rounded-lg border border-rose-500 bg-rose-500/20 text-rose-400 font-bold flex items-center gap-1">
                      <span>[ 30 ] (Self Loop 💥)</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1.5 rounded-lg border border-border bg-card font-bold text-slate-300">
                      [ 10 | next ] → [ 20 | NULL ]
                    </div>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-card border border-border text-[11px] leading-snug">
                  {customSimState.status === "flawed-error" ? (
                    <div className="text-rose-400 flex items-start gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>
                        <strong>Memory Orphan &amp; Self Loop!</strong> <code className="text-rose-300">head = newNode</code> overwrote the starting pointer before linking, orphaning all old nodes in memory.
                      </span>
                    </div>
                  ) : customSimState.status === "fixed-success" ? (
                    <div className="text-emerald-400 flex items-start gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong>Clean Prepend!</strong> <code className="text-emerald-300">newNode-&gt;next = head; head = newNode;</code> linked the chain without memory leaks.
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Click <strong>Run Flawed Code</strong> to see old nodes get orphaned in heap memory.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 5. BINARY SEARCH (Strict inequality bug) */}
            {algorithmId === "binary-search" && (
              <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Search className="h-3.5 w-3.5 text-cyan-400" />
                    Binary Search (Target = 45):
                  </span>
                  <span className="text-primary font-bold">
                    arr = [10, 20, 30, 45, 60]
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1 text-center text-[10px]">
                  {[10, 20, 30, 45, 60].map((v, i) => {
                    const isTarget = v === 45;
                    return (
                      <div
                        key={i}
                        className={`flex-1 p-1.5 rounded-lg border ${
                          isTarget
                            ? customSimState.status === "fixed-success"
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                              : customSimState.status === "flawed-error"
                              ? "bg-rose-500/20 border-rose-500 text-rose-400 font-bold"
                              : "bg-primary/20 border-primary text-primary font-bold"
                            : "bg-card border-border text-muted-foreground"
                        }`}
                      >
                        <div className="text-[9px]">[{i}]</div>
                        <div className="font-bold text-xs">{v}</div>
                        {isTarget && <div className="text-[8px] text-amber-400">target</div>}
                      </div>
                    );
                  })}
                </div>

                <div className="p-2 rounded-lg bg-card border border-border text-[11px] leading-snug">
                  {customSimState.status === "flawed-error" ? (
                    <div className="text-rose-400 flex items-start gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>
                        <strong>Target Missed (-1)!</strong> When <code className="text-rose-300">low == high == 3</code>, <code className="text-rose-300">while (low &lt; high)</code> exited prematurely without checking index 3.
                      </span>
                    </div>
                  ) : customSimState.status === "fixed-success" ? (
                    <div className="text-emerald-400 flex items-start gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong>Match Found!</strong> <code className="text-emerald-300">while (low &lt;= high)</code> checked index 3 and returned index 3 correctly.
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Click <strong>Run Flawed Code</strong> to see single-element candidate missed.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 6. LINEAR SEARCH (Premature loop termination) */}
            {algorithmId === "linear-search" && (
              <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Search className="h-3.5 w-3.5 text-cyan-400" />
                    Linear Scan (Target = 99 at last index):
                  </span>
                  <span className="text-primary font-bold">
                    arr[5] = [12, 34, 56, 78, 99]
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {[12, 34, 56, 78, 99].map((v, i) => (
                    <div
                      key={i}
                      className={`p-1.5 rounded-lg border ${
                        i === 4
                          ? customSimState.status === "flawed-error"
                            ? "border-rose-500 bg-rose-500/20 text-rose-400 font-bold"
                            : customSimState.status === "fixed-success"
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold"
                            : "border-amber-500 bg-amber-500/10 text-amber-300 font-bold"
                          : "bg-card border-border text-foreground"
                      }`}
                    >
                      <div className="text-[9px]">[{i}]</div>
                      <div className="font-bold text-xs">{v}</div>
                      <div className="text-[8px] text-muted-foreground">{i === 4 ? "Last" : "Visited"}</div>
                    </div>
                  ))}
                </div>

                <div className="p-2 rounded-lg bg-card border border-border text-[11px] leading-snug">
                  {customSimState.status === "flawed-error" ? (
                    <div className="text-rose-400 flex items-start gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>
                        <strong>Off-By-One Skip!</strong> <code className="text-rose-300">i &lt; arr.size() - 1</code> stopped at index 3, skipping the last element completely and returning -1.
                      </span>
                    </div>
                  ) : customSimState.status === "fixed-success" ? (
                    <div className="text-emerald-400 flex items-start gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong>Complete Scan!</strong> <code className="text-emerald-300">i &lt; arr.size()</code> inspected index 4 and returned index 4.
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Click <strong>Run Flawed Code</strong> to see last element missed.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 7. TIME COMPLEXITY (Infinite loop stall) */}
            {algorithmId === "time-complexity" && (
              <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    Loop Growth &amp; Termination Meter:
                  </span>
                  <span className="text-primary font-bold">
                    Target = 999
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-border bg-card flex items-center justify-between text-[11px]">
                  <span>Iteration Counter:</span>
                  <span className={`font-bold ${customSimState.status === "flawed-error" ? "text-rose-400 animate-pulse text-sm" : "text-emerald-400"}`}>
                    {customSimState.status === "flawed-error" ? "∞ (1,000,000+ Stalled)" : customSimState.status === "fixed-success" ? "3 steps O(log n)" : "0"}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-card border border-border text-[11px] leading-snug">
                  {customSimState.status === "flawed-error" ? (
                    <div className="text-rose-400 flex items-start gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>
                        <strong>CPU Infinite Loop Lock!</strong> <code className="text-rose-300">low = mid</code> failed to shrink the search interval when <code className="text-rose-300">mid == low</code>.
                      </span>
                    </div>
                  ) : customSimState.status === "fixed-success" ? (
                    <div className="text-emerald-400 flex items-start gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong>Logarithmic Termination!</strong> <code className="text-emerald-300">low = mid + 1</code> shrank search space in $O(\log n)$ time.
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Click <strong>Run Flawed Code</strong> to observe infinite loop stall.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 8. SPACE COMPLEXITY (Pass by value recursion explosion) */}
            {algorithmId === "space-complexity" && (
              <div className="p-3 rounded-xl border border-border bg-secondary/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Cpu className="h-3.5 w-3.5 text-purple-400" />
                    Stack Memory Allocation Meter:
                  </span>
                  <span className="text-primary font-bold">
                    Recursive Depth = 16
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-border bg-card flex items-center justify-between text-[11px]">
                  <span>Auxiliary Memory Used:</span>
                  <span className={`font-bold ${customSimState.status === "flawed-error" ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}>
                    {customSimState.status === "flawed-error" ? "O(n²) [Memory Cloned]" : customSimState.status === "fixed-success" ? "O(log n) [Reference Passed]" : "Idle"}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-card border border-border text-[11px] leading-snug">
                  {customSimState.status === "flawed-error" ? (
                    <div className="text-rose-400 flex items-start gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>
                        <strong>Stack Memory Blowup!</strong> <code className="text-rose-300">vector&lt;int&gt; arr</code> passed by value cloned the entire array on every stack frame.
                      </span>
                    </div>
                  ) : customSimState.status === "fixed-success" ? (
                    <div className="text-emerald-400 flex items-start gap-1.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>
                        <strong>Clean Reference!</strong> <code className="text-emerald-300">const vector&lt;int&gt;&amp; arr</code> avoided cloning and preserved $O(\log n)$ memory.
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Click <strong>Run Flawed Code</strong> to observe memory cloning explosion.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Inline Edit Line Form */}
          {selectedLine && !fixedSuccessfully && (
            <form
              onSubmit={handleVerifyFix}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm dark:shadow-xl space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-foreground">
                  Editing Line {selectedLine}:
                </span>
                <span className="text-muted-foreground text-[11px]">
                  Submit correct C++ syntax
                </span>
              </div>

              <input
                type="text"
                value={editedLineText}
                onChange={(e) => setEditedLineText(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/70 px-3 py-2 text-xs font-mono text-foreground focus:border-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20"
                placeholder="Type corrected line..."
              />

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:from-rose-500 transition-all active:scale-95 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                Verify Fix
              </button>
            </form>
          )}

          {/* Feedback Card */}
          {feedback.status !== "idle" && (
            <div
              className={`rounded-2xl border p-3.5 text-xs leading-relaxed flex flex-col gap-2 animate-in fade-in ${
                feedback.status === "correct"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-300"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {feedback.status === "correct" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <p className="font-medium">{feedback.message}</p>
              </div>

              {feedback.status === "correct" && earnedScore !== null && (
                <div className="flex items-center justify-between pt-2 border-t border-emerald-500/30 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Award className="h-3.5 w-3.5" /> Earned: {earnedScore}/100 pts
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400/80">
                    ({hintsUsedCount} hints, {wrongAttemptsCount} invalid attempts)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
