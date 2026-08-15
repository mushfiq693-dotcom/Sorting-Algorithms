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
} from "lucide-react";

interface BugHuntProps {
  algorithmId: AlgorithmId;
}

const SAMPLE_BUG_ARRAY = [45, 12, 89, 34, 7, 60, 23, 19];

export function BugHunt({ algorithmId }: BugHuntProps) {
  const challenge = BUG_HUNT_CHALLENGES[algorithmId];
  const lines = useMemo(() => challenge.buggyCode.split("\n"), [challenge.buggyCode]);

  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [editedLineText, setEditedLineText] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    status: "idle" | "correct" | "wrong-line" | "wrong-fix";
    message: string;
  }>({ status: "idle", message: "" });

  // Execution state for the visualizer preview
  const [previewArray, setPreviewArray] = useState<number[]>([...SAMPLE_BUG_ARRAY]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [fixedSuccessfully, setFixedSuccessfully] = useState<boolean>(false);

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
      setPreviewArray([...SAMPLE_BUG_ARRAY]);
      setComparingIndices([]);
      setSwappingIndices([]);
      setSortedIndices([]);

      const runner = isFixed
        ? ALGORITHM_RUNNERS[algorithmId]
        : challenge.flawedRunner;

      const ops = runner([...SAMPLE_BUG_ARRAY]);

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
    },
    [algorithmId, challenge.flawedRunner]
  );

  // Validate user fix
  const handleVerifyFix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLine) return;

    // Check if correct line was targeted
    if (selectedLine !== challenge.buggyLineNumber) {
      setFeedback({
        status: "wrong-line",
        message: `Line ${selectedLine} is actually correct! Check loop boundaries or comparison conditions instead.`,
      });
      return;
    }

    // Check if the edited text correctly fixes the bug
    const isFixValid = challenge.validateFix(editedLineText);
    if (!isFixValid) {
      setFeedback({
        status: "wrong-fix",
        message: `You identified the right line (Line ${selectedLine})! But this edit still doesn't produce an ascending sort. Try running the logic or check the hint.`,
      });
      return;
    }

    // Success!
    setFixedSuccessfully(true);
    setFeedback({
      status: "correct",
      message: `🎉 Fixed! ${challenge.explanation}`,
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    handleRunExecution(true);
  };

  // Reset challenge
  const handleResetChallenge = () => {
    setSelectedLine(null);
    setEditedLineText("");
    setShowHint(false);
    setFeedback({ status: "idle", message: "" });
    setFixedSuccessfully(false);
    setPreviewArray([...SAMPLE_BUG_ARRAY]);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/70 p-4 sm:p-6 backdrop-blur-md shadow-2xl">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bug className="h-4 w-4 text-rose-400" />
            <span>Bug-Hunt Challenge</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {challenge.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all active:scale-95"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
          </button>

          <button
            onClick={handleResetChallenge}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Description & Hint Box */}
      <div className="space-y-2">
        <p className="text-xs text-foreground/90 leading-relaxed">
          {challenge.description}
        </p>

        {showHint && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2 animate-in fade-in">
            <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="font-semibold text-amber-300">Hint: </strong>
              {challenge.hint}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Left = Code with Clickable Lines, Right = Visualizer Preview & Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Buggy Code Viewer with Clickable Lines */}
        <div className="lg:col-span-7 rounded-2xl border border-border/60 bg-[#0d1117] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/60 bg-card/80 px-4 py-2.5 text-xs font-mono text-muted-foreground">
            <span className="text-foreground font-semibold flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-rose-400" /> Click a line to fix the bug
            </span>
            <span>{lines.length} lines</span>
          </div>

          <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto select-none">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isSelected = selectedLine === lineNum;
              const isBuggyLine = lineNum === challenge.buggyLineNumber;

              return (
                <div
                  key={lineNum}
                  onClick={() => handleSelectLine(lineNum)}
                  className={`flex items-center rounded-md px-2 py-1 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-rose-500/20 text-rose-200 border-l-4 border-rose-400 font-bold"
                      : "hover:bg-white/[0.04] text-slate-300"
                  }`}
                >
                  <span
                    className={`w-7 shrink-0 text-right pr-3 text-xs select-none ${
                      isSelected ? "text-rose-400 font-bold" : "text-muted-foreground/40"
                    }`}
                  >
                    {lineNum}
                  </span>
                  <span className="whitespace-pre flex-1">{line || " "}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-rose-500/30 text-rose-200 px-1.5 py-0.5 rounded ml-2">
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mini Visualizer + Line Fix Form + Feedback */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Mini Visualizer Preview */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-foreground flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-cyan-400" /> Execution Output
              </span>
              <button
                onClick={() => handleRunExecution(fixedSuccessfully)}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-2.5 py-1 text-xs font-semibold text-white hover:from-blue-500 transition-all disabled:opacity-40"
              >
                <Play className="h-3 w-3 fill-current" />
                {isRunning ? "Running..." : fixedSuccessfully ? "Run Fixed Code" : "Run Flawed Code"}
              </button>
            </div>

            <div className="h-44">
              <ArrayBars
                array={previewArray}
                comparingIndices={comparingIndices}
                swappingIndices={swappingIndices}
                sortedIndices={sortedIndices}
                pivotIndex={null}
                activeRange={null}
                overwritingIndex={null}
              />
            </div>
          </div>

          {/* Inline Edit Line Form */}
          {selectedLine && !fixedSuccessfully && (
            <form
              onSubmit={handleVerifyFix}
              className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-xl space-y-3 animate-in fade-in"
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
                className="w-full rounded-xl border border-border/80 bg-card/90 px-3 py-2 text-xs font-mono text-foreground focus:border-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/20"
                placeholder="Type corrected line..."
              />

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-500/20 hover:from-rose-500 transition-all active:scale-95"
              >
                <Check className="h-4 w-4" />
                Verify Fix
              </button>
            </form>
          )}

          {/* Feedback Card */}
          {feedback.status !== "idle" && (
            <div
              className={`rounded-2xl border p-3.5 text-xs leading-relaxed flex items-start gap-2.5 animate-in fade-in ${
                feedback.status === "correct"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/40 text-rose-300"
              }`}
            >
              {feedback.status === "correct" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <p className="font-medium">{feedback.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
