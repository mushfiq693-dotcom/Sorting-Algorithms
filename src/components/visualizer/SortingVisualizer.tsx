"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { AlgorithmId, SortOperation } from "@/types/sorting";
import { ALGORITHMS, ALGORITHM_RUNNERS } from "@/data/algorithms";
import { generateRandomArray } from "@/lib/utils";
import { ArrayBars } from "./ArrayBars";
import { VisualizerControls } from "./VisualizerControls";
import { OperationIndicator } from "./OperationIndicator";
import { ComplexityCard } from "@/components/algorithms/ComplexityCard";
import { AlgorithmSelector } from "@/components/algorithms/AlgorithmSelector";
import { CodeViewer } from "@/components/code/CodeViewer";
import { LiveComplexityTracker } from "@/components/complexity/LiveComplexityTracker";
import { StackVisualizer } from "./StackVisualizer";
import { QueueVisualizer } from "./QueueVisualizer";
import { LinkedListVisualizer } from "./LinkedListVisualizer";
import { LinearSearchVisualizer } from "./LinearSearchVisualizer";
import { BinarySearchVisualizer } from "./BinarySearchVisualizer";
import { TimeComplexityVisualizer } from "./TimeComplexityVisualizer";
import { SpaceComplexityVisualizer } from "./SpaceComplexityVisualizer";
import { Sparkles, ArrowLeft } from "lucide-react";

const DEFAULT_INITIAL_ARRAY = [48, 15, 86, 34, 92, 28, 65, 12, 54, 78, 23, 95, 41, 60, 31];

export function SortingVisualizer() {
  // Config & Selection State
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmId>("bubble");
  const [arraySize, setArraySize] = useState<number>(15);
  const [speed, setSpeed] = useState<number>(120);

  // Array & Execution State (deterministic initial state to avoid SSR hydration mismatch)
  const [originalArray, setOriginalArray] = useState<number[]>(DEFAULT_INITIAL_ARRAY);
  const [array, setArray] = useState<number[]>(DEFAULT_INITIAL_ARRAY);
  const [operations, setOperations] = useState<SortOperation[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Playback Control State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Visual Highlights & Metrics
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [activeRange, setActiveRange] = useState<[number, number] | null>(null);
  const [overwritingIndex, setOverwritingIndex] = useState<number | null>(null);
  const [mergeRange, setMergeRange] = useState<{ left: number; mid: number; right: number } | null>(null);

  const [currentLineNumber, setCurrentLineNumber] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [swapsCount, setSwapsCount] = useState<number>(0);

  // Timer Ref to avoid race conditions
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer helper
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearVisualHighlights = useCallback(() => {
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setPivotIndex(null);
    setActiveRange(null);
    setOverwritingIndex(null);
    setMergeRange(null);
    setCurrentLineNumber(null);
  }, []);

  // Reset visualizer to pre-sort state
  const handleReset = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(false);
    setIsFinished(false);
    setArray([...originalArray]);
    setCurrentStepIndex(0);
    clearVisualHighlights();
    setExplanation("Visualizer reset to initial state.");
    setComparisonsCount(0);
    setSwapsCount(0);
  }, [clearTimer, originalArray, clearVisualHighlights]);

  // Generate new random array
  const handleGenerateRandom = useCallback(() => {
    clearTimer();
    const newArr = generateRandomArray(arraySize);
    setOriginalArray(newArr);
    setArray(newArr);
    setOperations([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
    setIsFinished(false);
    clearVisualHighlights();
    setExplanation("Generated a new random array.");
    setComparisonsCount(0);
    setSwapsCount(0);
  }, [clearTimer, arraySize, clearVisualHighlights]);

  // Handle custom array input
  const handleCustomArray = useCallback(
    (newArr: number[]) => {
      clearTimer();
      setArraySize(newArr.length);
      setOriginalArray(newArr);
      setArray(newArr);
      setOperations([]);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsPaused(false);
      setIsFinished(false);
      clearVisualHighlights();
      setExplanation(`Custom array loaded with ${newArr.length} elements.`);
      setComparisonsCount(0);
      setSwapsCount(0);
    },
    [clearTimer, clearVisualHighlights]
  );

  // Switch algorithm
  const handleSelectAlgorithm = useCallback(
    (algoId: AlgorithmId) => {
      clearTimer();
      setSelectedAlgorithm(algoId);
      setIsPlaying(false);
      setIsPaused(false);
      setIsFinished(false);
      setArray([...originalArray]);
      setOperations([]);
      setCurrentStepIndex(0);
      clearVisualHighlights();
      setExplanation(`Selected ${ALGORITHMS[algoId].name}. Click Start to visualize.`);
      setComparisonsCount(0);
      setSwapsCount(0);
    },
    [clearTimer, originalArray, clearVisualHighlights]
  );

  // Apply single operation to state
  const applyOperation = useCallback(
    (op: SortOperation, currentArr: number[]): number[] => {
      const nextArr = [...currentArr];
      const meta = ALGORITHMS[selectedAlgorithm];
      const line = meta?.highlightLine ? meta.highlightLine(op) : null;
      setCurrentLineNumber(line);

      if (op.description) {
        setExplanation(op.description);
      }

      switch (op.type) {
        case "compare": {
          setComparingIndices(op.indices);
          setSwappingIndices([]);
          setOverwritingIndex(null);
          setComparisonsCount((prev) => prev + 1);
          break;
        }
        case "swap": {
          const [i, j] = op.indices;
          setComparingIndices([]);
          setSwappingIndices([i, j]);
          setOverwritingIndex(null);
          const temp = nextArr[i];
          nextArr[i] = nextArr[j];
          nextArr[j] = temp;
          setSwapsCount((prev) => prev + 1);
          break;
        }
        case "overwrite": {
          setComparingIndices([]);
          setSwappingIndices([]);
          setOverwritingIndex(op.index);
          nextArr[op.index] = op.value;
          setSwapsCount((prev) => prev + 1);
          break;
        }
        case "pivot": {
          setPivotIndex(op.index);
          setComparingIndices([]);
          setSwappingIndices([]);
          break;
        }
        case "range": {
          setActiveRange([op.left, op.right]);
          break;
        }
        case "merge-start": {
          setMergeRange({ left: op.left, mid: op.mid, right: op.right });
          setActiveRange([op.left, op.right]);
          setComparingIndices([]);
          setSwappingIndices([]);
          setOverwritingIndex(null);
          break;
        }
        case "merge-compare": {
          setComparingIndices([op.leftIndex, op.rightIndex]);
          setSwappingIndices([]);
          setOverwritingIndex(null);
          setComparisonsCount((prev) => prev + 1);
          break;
        }
        case "sorted": {
          setComparingIndices([]);
          setSwappingIndices([]);
          setOverwritingIndex(null);
          setSortedIndices(op.indices);
          break;
        }
      }

      return nextArr;
    },
    [selectedAlgorithm]
  );

  // Step Forward One Operation
  const handleStep = useCallback(() => {
    if (isFinished) return;

    let currentOps = operations;
    if (currentOps.length === 0) {
      const runner = ALGORITHM_RUNNERS[selectedAlgorithm];
      currentOps = runner ? runner(array) : [];
      setOperations(currentOps);
    }

    if (currentStepIndex >= currentOps.length) {
      setIsFinished(true);
      setIsPlaying(false);
      setIsPaused(false);
      setComparingIndices([]);
      setSwappingIndices([]);
      setPivotIndex(null);
      setActiveRange(null);
      setMergeRange(null);
      setOverwritingIndex(null);
      setSortedIndices(Array.from({ length: array.length }, (_, i) => i));
      setExplanation("Sorting complete!");
      return;
    }

    const op = currentOps[currentStepIndex];
    setArray((prevArr) => applyOperation(op, prevArr));
    const nextIdx = currentStepIndex + 1;
    setCurrentStepIndex(nextIdx);

    if (nextIdx >= currentOps.length) {
      setIsFinished(true);
      setIsPlaying(false);
      setIsPaused(false);
      setComparingIndices([]);
      setSwappingIndices([]);
      setPivotIndex(null);
      setActiveRange(null);
      setMergeRange(null);
      setOverwritingIndex(null);
      setSortedIndices(Array.from({ length: array.length }, (_, i) => i));
      setExplanation("Sorting complete!");
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [isFinished, operations, selectedAlgorithm, array, currentStepIndex, applyOperation]);

  // Start Sorting Execution
  const handleStart = useCallback(() => {
    clearTimer();
    const runner = ALGORITHM_RUNNERS[selectedAlgorithm];
    const ops = runner ? runner(originalArray) : [];
    setOperations(ops);
    setArray([...originalArray]);
    setCurrentStepIndex(0);
    setComparisonsCount(0);
    setSwapsCount(0);
    clearVisualHighlights();
    setIsFinished(false);
    setIsPaused(false);
    setIsPlaying(true);
  }, [clearTimer, selectedAlgorithm, originalArray, clearVisualHighlights]);

  // Pause
  const handlePause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(true);
    setExplanation("Paused. Click Resume or Step to continue.");
  }, [clearTimer]);

  // Resume
  const handleResume = useCallback(() => {
    setIsPaused(false);
    setIsPlaying(true);
  }, []);

  // Execution Loop driven by isPlaying, speed, and step index
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    if (currentStepIndex >= operations.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setIsFinished(true);
      setComparingIndices([]);
      setSwappingIndices([]);
      setPivotIndex(null);
      setActiveRange(null);
      setMergeRange(null);
      setOverwritingIndex(null);
      setSortedIndices(Array.from({ length: array.length }, (_, i) => i));
      setExplanation("Sorting complete!");
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      return;
    }

    timerRef.current = setTimeout(() => {
      const op = operations[currentStepIndex];
      setArray((prevArr) => applyOperation(op, prevArr));
      setCurrentStepIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimer();
  }, [isPlaying, currentStepIndex, operations, speed, applyOperation, clearTimer, array.length]);

  // Handle Array Size Slider changes
  const handleArraySizeChange = (newSize: number) => {
    setArraySize(newSize);
    clearTimer();
    const newArr = generateRandomArray(newSize);
    setOriginalArray(newArr);
    setArray(newArr);
    setOperations([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
    setIsFinished(false);
    clearVisualHighlights();
    setExplanation(`Adjusted array size to ${newSize} bars.`);
    setComparisonsCount(0);
    setSwapsCount(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const currentMeta = ALGORITHMS[selectedAlgorithm] || ALGORITHMS.bubble;
  const isSorting = ["bubble", "selection", "insertion", "merge", "quick"].includes(selectedAlgorithm);

  // Render dedicated visualizer for Data Structures (Stack, Queue) and Complexity topics
  if (!isSorting) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
        {/* Active Specialized Topic Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card/70 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Active Workspace:</span>
            <span className="px-3 py-1 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{currentMeta.name}</span>
            </span>
          </div>

          <button
            onClick={() => handleSelectAlgorithm("bubble")}
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border bg-secondary/60 hover:bg-secondary cursor-pointer active:scale-95 shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Switch to Sorting Algorithms</span>
          </button>
        </div>

        {/* Dedicated Specialized Visualizer Stage */}
        <div className="w-full">
          {selectedAlgorithm === "stack" && <StackVisualizer />}
          {selectedAlgorithm === "queue" && <QueueVisualizer />}
          {selectedAlgorithm === "linked-list" && <LinkedListVisualizer />}
          {selectedAlgorithm === "linear-search" && <LinearSearchVisualizer />}
          {selectedAlgorithm === "binary-search" && <BinarySearchVisualizer />}
          {selectedAlgorithm === "time-complexity" && <TimeComplexityVisualizer />}
          {selectedAlgorithm === "space-complexity" && <SpaceComplexityVisualizer />}
        </div>

        {/* Studio Bottom Grid: Topic Selector (left) + C++ Code & Complexity (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-4 border-t border-border">
          {/* Topic Categories Accordion */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={handleSelectAlgorithm}
              disabled={false}
            />
          </div>

          {/* Synchronized Reference Code & Complexity */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="h-[400px] sm:h-[450px]">
              <CodeViewer
                code={currentMeta.cppCode}
                activeLineNumber={null}
                algorithmName={currentMeta.name}
              />
            </div>
            <ComplexityCard metadata={currentMeta} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution & Complexity (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls + Live Big-O + Collapsible Categories */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Visualizer Canvas */}
          <ArrayBars
            array={array}
            comparingIndices={comparingIndices}
            swappingIndices={swappingIndices}
            sortedIndices={sortedIndices}
            pivotIndex={pivotIndex}
            activeRange={activeRange}
            overwritingIndex={overwritingIndex}
            mergeRange={mergeRange}
          />

          {/* Operation Status & Live Telemetry */}
          <OperationIndicator
            explanation={explanation}
            comparisonsCount={comparisonsCount}
            swapsCount={swapsCount}
            currentStep={currentStepIndex}
            totalSteps={operations.length || 0}
            isFinished={isFinished}
          />

          {/* Compact Studio Controls */}
          <VisualizerControls
            isPlaying={isPlaying}
            isFinished={isFinished}
            isPaused={isPaused}
            canStep={!isPlaying && (!isFinished || currentStepIndex < operations.length)}
            speed={speed}
            arraySize={arraySize}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStep={handleStep}
            onReset={handleReset}
            onGenerateRandom={handleGenerateRandom}
            onCustomArraySubmit={handleCustomArray}
            onSpeedChange={setSpeed}
            onArraySizeChange={handleArraySizeChange}
          />

          {/* Live Big-O Bounds Strip */}
          <LiveComplexityTracker
            algorithmId={selectedAlgorithm}
            arraySize={array.length}
            comparisonsCount={comparisonsCount}
            swapsCount={swapsCount}
            isFinished={isFinished}
            initialArray={originalArray}
          />

          {/* Collapsible Topic Categories */}
          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            onSelectAlgorithm={handleSelectAlgorithm}
            disabled={isPlaying}
          />
        </div>

        {/* Right Column: Synchronized C++ Code Viewer + Complexity Invariants */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[380px] sm:h-[420px] lg:h-[450px]">
            <CodeViewer
              code={currentMeta.cppCode}
              activeLineNumber={currentLineNumber}
              algorithmName={currentMeta.name}
            />
          </div>
          <ComplexityCard metadata={currentMeta} />
        </div>
      </div>
    </div>
  );
}
