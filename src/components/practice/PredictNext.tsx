"use client";

import React, { useState, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import { AlgorithmId, SortOperation } from "@/types/sorting";
import { ALGORITHMS, ALGORITHM_RUNNERS } from "@/data/algorithms";
import { ArrayBars } from "@/components/visualizer/ArrayBars";
import {
  Compass,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Play,
  Zap,
  Award,
} from "lucide-react";

import { useProgressSync } from "@/hooks/useProgressSync";

interface PredictNextProps {
  algorithmId: AlgorithmId;
  sampleArray?: number[];
}

const DEFAULT_PREDICT_ARRAY: Partial<Record<AlgorithmId, number[]>> = {
  bubble: [45, 12, 89, 34, 7, 60, 23, 19],
  selection: [35, 12, 48, 19, 7, 60, 24, 15],
  insertion: [24, 13, 9, 45, 18, 32, 7, 50],
  merge: [38, 27, 43, 3, 9, 82, 10, 19],
  quick: [33, 10, 55, 71, 29, 14, 42, 60],
};

interface PredictionRound {
  stepIndex: number; // Paused before this operation index
  op: SortOperation; // The actual next operation to predict
  question: string;
  type: "swap-decision" | "compare-indices" | "value-direction";
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export function PredictNext({ algorithmId, sampleArray: customArray }: PredictNextProps) {
  const { syncActivityScore } = useProgressSync();
  const initialArr = useMemo(() => {
    return customArray || DEFAULT_PREDICT_ARRAY[algorithmId] || [45, 12, 89, 34, 7, 60, 23, 19];
  }, [algorithmId, customArray]);

  const meta = ALGORITHMS[algorithmId];

  // Generate real operations from pure engine
  const operations = useMemo<SortOperation[]>(() => {
    const runner = ALGORITHM_RUNNERS[algorithmId];
    return runner ? runner([...initialArr]) : [];
  }, [algorithmId, initialArr]);

  // Construct 5-6 real prediction rounds sampled from early, mid, late
  const rounds = useMemo<PredictionRound[]>(() => {
    if (operations.length < 5) return [];

    const generatedRounds: PredictionRound[] = [];
    const totalOps = operations.length;

    // Pick 5 distinct target step indices across execution
    const candidateIndices = [
      Math.max(1, Math.floor(totalOps * 0.1)),
      Math.floor(totalOps * 0.3),
      Math.floor(totalOps * 0.5),
      Math.floor(totalOps * 0.7),
      Math.min(totalOps - 1, Math.floor(totalOps * 0.85)),
    ];

    candidateIndices.forEach((targetIdx, roundNum) => {
      const op = operations[targetIdx];
      if (!op) return;

      if (op.type === "swap") {
        const [i, j] = op.indices;
        generatedRounds.push({
          stepIndex: targetIdx,
          op,
          question: `In this state, elements at index ${i} and ${j} are being evaluated. Will a SWAP occur on this step?`,
          type: "swap-decision",
          options: ["YES, a swap will occur", "NO, no swap is needed"],
          correctOptionIndex: 0,
          explanation: `The element at index ${i} is greater than the element at index ${j}, so the algorithm performs a swap.`,
        });
      } else if (op.type === "compare") {
        const [i, j] = op.indices;
        // Check if the next op is a swap
        const nextIsSwap = operations[targetIdx + 1]?.type === "swap";
        generatedRounds.push({
          stepIndex: targetIdx,
          op,
          question: `The algorithm compares index ${i} and index ${j}. Based on their values, what happens next?`,
          type: "compare-indices",
          options: [
            nextIsSwap ? "A swap will occur next" : "No swap; it moves to the next comparison",
            nextIsSwap ? "No swap; it breaks early" : "A swap will occur next",
          ],
          correctOptionIndex: 0,
          explanation: nextIsSwap
            ? `arr[${i}] is out of order compared to arr[${j}], so a swap will follow.`
            : `arr[${i}] and arr[${j}] are already in relative order, so no swap is performed.`,
        });
      } else if (op.type === "overwrite") {
        generatedRounds.push({
          stepIndex: targetIdx,
          op,
          question: `The algorithm is writing value ${op.value} into the array. At which index will it be written?`,
          type: "value-direction",
          options: [
            `Index ${op.index}`,
            `Index ${(op.index + 1) % initialArr.length}`,
            `Index ${Math.max(0, op.index - 1)}`,
          ],
          correctOptionIndex: 0,
          explanation: `In this step, the merged/shifted value ${op.value} is placed into target index ${op.index}.`,
        });
      } else {
        // Fallback generic round (metadata or non-mutating inspection)
        generatedRounds.push({
          stepIndex: targetIdx,
          op,
          question: `At step ${targetIdx + 1}, is this operation an active comparison or inspection?`,
          type: "swap-decision",
          options: [
            "YES, inspecting/scoping elements",
            "NO, executing an immediate swap",
          ],
          correctOptionIndex: 0,
          explanation: `Operation '${op.type}' inspects or scopes subarray boundaries without performing an immediate in-place swap.`,
        });
      }
    });

    return generatedRounds;
  }, [operations, initialArr]);

  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const activeRound = rounds[currentRoundIdx];

  // Compute visualizer array state at the current paused step (or stepped forward if answered)
  const visualState = useMemo(() => {
    let arr = [...initialArr];
    if (!activeRound) {
      return { array: arr, comparing: [], swapping: [], sorted: [] };
    }

    const targetLimit = isAnswered ? activeRound.stepIndex + 1 : activeRound.stepIndex;

    let comparing: number[] = [];
    let swapping: number[] = [];
    let sorted: number[] = [];

    for (let i = 0; i < targetLimit; i++) {
      const op = operations[i];
      if (op.type === "swap") {
        const [a, b] = op.indices;
        const temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
      } else if (op.type === "overwrite") {
        arr[op.index] = op.value;
      }

      if (i === targetLimit - 1) {
        if (op.type === "compare") comparing = op.indices;
        if (op.type === "swap") swapping = op.indices;
        if (op.type === "sorted") sorted = op.indices;
      }
    }

    return { array: arr, comparing, swapping, sorted };
  }, [initialArr, operations, activeRound, isAnswered]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !activeRound) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === activeRound.correctOptionIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextRound = () => {
    if (currentRoundIdx === rounds.length - 1) {
      setIsFinished(true);
      const percentScore = Math.round((score / rounds.length) * 100);
      syncActivityScore(
        algorithmId,
        "prediction",
        percentScore,
        `${meta.name} Prediction (${percentScore}%)`
      );
      if (score >= Math.ceil(rounds.length * 0.7)) {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      }
    } else {
      setCurrentRoundIdx((r) => r + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (!rounds.length) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-2xl">
        Generating prediction rounds...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 backdrop-blur-xl shadow-sm dark:shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Predict the Next Operation
            </h3>
            <p className="text-xs text-muted-foreground">
              Trace the algorithm state in real time and anticipate the next decision!
            </p>
          </div>
        </div>

        {!isFinished && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-secondary text-purple-600 dark:text-purple-300 border border-border">
              Round {currentRoundIdx + 1} of {rounds.length}
            </span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Visualizer Paused State */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
              <span>Current Array State (Paused at Step {activeRound.stepIndex + 1})</span>
              {isAnswered && (
                <span className="text-purple-600 dark:text-purple-400 font-semibold animate-pulse">
                  Stepped Forward +1 Operation
                </span>
              )}
            </div>

            <ArrayBars
              array={visualState.array}
              comparingIndices={visualState.comparing}
              swappingIndices={visualState.swapping}
              sortedIndices={visualState.sorted}
              pivotIndex={null}
              activeRange={null}
              overwritingIndex={null}
            />
          </div>

          {/* Question Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-purple-500/30 bg-purple-500/10 space-y-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-mono text-xs uppercase tracking-wider font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>Prediction Challenge</span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
              {activeRound.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeRound.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === activeRound.correctOptionIndex;

              let style = "border-border bg-secondary/50 text-foreground hover:bg-secondary hover:border-purple-400/50";
              if (isAnswered) {
                if (isCorrect) {
                  style = "border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 shadow-sm";
                } else if (isSelected) {
                  style = "border-rose-500 bg-rose-500/20 text-rose-800 dark:text-rose-200 shadow-sm";
                } else {
                  style = "border-border bg-secondary/30 text-muted-foreground opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer ${style}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="space-y-4 animate-in fade-in">
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  selectedOption === activeRound.correctOptionIndex
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200"
                }`}
              >
                <strong>
                  {selectedOption === activeRound.correctOptionIndex ? "🎉 Accurate Prediction! " : "💡 Not quite: "}
                </strong>
                {activeRound.explanation}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextRound}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-purple-500 transition-all active:scale-95 shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  <span>{currentRoundIdx === rounds.length - 1 ? "Complete Prediction Session" : "Next Round"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Summary */
        <div className="text-center py-8 space-y-5 animate-in fade-in">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-foreground">Prediction Session Completed!</h4>
            <p className="text-sm text-muted-foreground mt-1">
              You accurately predicted <strong className="text-purple-600 dark:text-purple-400">{score}</strong> out of{" "}
              <strong>{rounds.length}</strong> operations!
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
