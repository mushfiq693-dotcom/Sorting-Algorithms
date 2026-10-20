"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  HeapEngine,
  HeapStep,
  HeapType,
  calculateHeapTreeCoordinates,
} from "@/algorithms/heap";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Zap,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// Production-Grade C++ Binary Heap Source Code for synchronized CodeViewer
const HEAP_CPP_SOURCE = `// Production-Grade C++ Binary Heap (Min/Max Priority Queue)
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class BinaryHeap {
private:
    vector<int> heap;
    bool isMin;

    int parent(int i) { return (i - 1) / 2; }
    int left(int i)   { return 2 * i + 1; }
    int right(int i)  { return 2 * i + 2; }

    void siftUp(int i) {
        while (i > 0) {
            int p = parent(i);
            bool swapNeeded = isMin ? heap[i] < heap[p] : heap[i] > heap[p];
            if (!swapNeeded) break;
            swap(heap[i], heap[p]);
            i = p;
        }
    }

    void siftDown(int i) {
        int n = heap.size();
        while (true) {
            int target = i;
            int l = left(i), r = right(i);
            if (l < n && (isMin ? heap[l] < heap[target] : heap[l] > heap[target]))
                target = l;
            if (r < n && (isMin ? heap[r] < heap[target] : heap[r] > heap[target]))
                target = r;
            if (target == i) break;
            swap(heap[i], heap[target]);
            i = target;
        }
    }

public:
    BinaryHeap(bool minMode = true) : isMin(minMode) {}

    int peek() const { return heap.empty() ? -1 : heap[0]; }

    void insert(int val) {
        heap.push_back(val);
        siftUp(heap.size() - 1);
    }

    int extractRoot() {
        if (heap.empty()) return -1;
        int rootVal = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        if (!heap.empty()) siftDown(0);
        return rootVal;
    }

    // Linear O(n) Bottom-Up Heapify
    void buildHeap(const vector<int>& arr) {
        heap = arr;
        for (int i = (int)heap.size() / 2 - 1; i >= 0; i--) {
            siftDown(i);
        }
    }
};`;

export function HeapVisualizer() {
  const engineRef = useRef<HeapEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new HeapEngine([10, 20, 15, 30, 40, 50, 60], "min");
  }
  const engine = engineRef.current;

  // Animation State
  const [steps, setSteps] = useState<HeapStep[]>(() => [engine.getInitialStep()]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(750); // ms per step

  // Interactive Inputs
  const [inputVal, setInputVal] = useState<string>("25");
  const [heapMode, setHeapMode] = useState<HeapType>("min");
  const [selectedPreset, setSelectedPreset] = useState<
    "balanced-min" | "balanced-max" | "almost-sorted" | "random-unordered" | "task-priorities"
  >("balanced-min");
  const [selectedInspectorNode, setSelectedInspectorNode] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStep = steps[currentStepIndex] || steps[0];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const executeStepList = (newSteps: HeapStep[]) => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(false);
    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  // Operations
  const handleInsert = () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;
    const genSteps = engine.generateInsertSteps(val);
    executeStepList(genSteps);
  };

  const handleExtractRoot = () => {
    const genSteps = engine.generateExtractRootSteps();
    executeStepList(genSteps);
  };

  const handlePeek = () => {
    const genSteps = engine.generatePeekSteps();
    executeStepList(genSteps);
  };

  const handleHeapify = () => {
    const genSteps = engine.generateHeapifySteps();
    executeStepList(genSteps);
  };

  const handleToggleMode = () => {
    const nextMode: HeapType = heapMode === "min" ? "max" : "min";
    setHeapMode(nextMode);
    const genSteps = engine.toggleHeapType();
    executeStepList(genSteps);
  };

  const handlePresetChange = (
    preset: "balanced-min" | "balanced-max" | "almost-sorted" | "random-unordered" | "task-priorities"
  ) => {
    setSelectedPreset(preset);
    engine.loadPreset(preset);
    setHeapMode(engine.getHeapType());
    const initial = engine.getInitialStep(`Loaded preset: ${preset.toUpperCase().replace("-", " ")}`);
    executeStepList([initial]);
  };

  const handleReset = () => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(false);
    engine.loadPreset(selectedPreset);
    setHeapMode(engine.getHeapType());
    executeStepList([engine.getInitialStep("Binary Heap reset to baseline.")]);
  };

  const handleRandomInsert = () => {
    const randomKey = Math.floor(Math.random() * 90) + 10;
    setInputVal(randomKey.toString());
    const genSteps = engine.generateInsertSteps(randomKey);
    executeStepList(genSteps);
  };

  // Playback Controls
  const handlePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Animation Loop
  useEffect(() => {
    if (isPlaying && !isPaused) {
      if (currentStepIndex < steps.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, speed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimer();
  }, [isPlaying, isPaused, currentStepIndex, steps.length, speed, clearTimer]);

  // Compute visual 2D coordinates for Tree
  const { coords: nodeCoords } = useMemo(() => {
    return calculateHeapTreeCoordinates(currentStep.array, 580, 260);
  }, [currentStep.array]);

  // Inspector Node calculations
  const inspIdx = Math.min(selectedInspectorNode, Math.max(0, currentStep.array.length - 1));
  const inspParent = inspIdx > 0 ? Math.floor((inspIdx - 1) / 2) : null;
  const inspLeft = 2 * inspIdx + 1 < currentStep.array.length ? 2 * inspIdx + 1 : null;
  const inspRight = 2 * inspIdx + 2 < currentStep.array.length ? 2 * inspIdx + 2 : null;

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto select-text font-body">
      {/* 2-Column Studio Grid: Left Visual Stage (7 cols), Right Code Execution & Telemetry (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ========================================================
            LEFT COLUMN (7 cols): Dual Canvas (Tree + Array), Controls
            ======================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual Dual Stage */}
          <div className="relative w-full rounded-2xl border border-border/80 bg-card shadow-sm p-4 overflow-hidden flex flex-col gap-3">
            {/* Top Toolbar overlay on Canvas */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  {currentStep.heapType.toUpperCase()}-HEAP (ARRAY-AS-TREE)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/60">
                  Size: {currentStep.array.length}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/60">
                  Height: {currentStep.metrics.height}
                </span>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-bold border ${
                    currentStep.metrics.isHeapValid
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  }`}
                >
                  {currentStep.metrics.isHeapValid ? "Heap Valid ✓" : "Rebalancing..."}
                </span>
              </div>
            </div>

            {/* Tree SVG Chamber */}
            <div className="relative w-full h-[250px] sm:h-[270px] bg-secondary/15 rounded-xl border border-border/50 flex items-center justify-center overflow-x-auto overflow-y-hidden">
              {currentStep.array.length === 0 ? (
                <div className="text-center space-y-1 text-muted-foreground font-mono text-xs">
                  <p>Binary Heap is currently empty.</p>
                  <p className="text-[11px]">Insert keys or load a preset below to populate the heap.</p>
                </div>
              ) : (
                <svg className="w-full h-full min-w-[540px]" viewBox="0 0 580 260">
                  {/* Edges from parent to children */}
                  {Object.values(nodeCoords).map((node) => {
                    const edges: React.ReactNode[] = [];
                    if (node.leftIndex !== null && nodeCoords[node.leftIndex]) {
                      const child = nodeCoords[node.leftIndex];
                      const isComparingEdge =
                        currentStep.comparingIndices.includes(node.index) &&
                        currentStep.comparingIndices.includes(child.index);
                      const isSwappingEdge =
                        currentStep.swappingIndices.includes(node.index) &&
                        currentStep.swappingIndices.includes(child.index);

                      edges.push(
                        <line
                          key={`edge-${node.index}-${child.index}`}
                          x1={node.x}
                          y1={node.y}
                          x2={child.x}
                          y2={child.y}
                          stroke={
                            isSwappingEdge
                              ? "#ec4899"
                              : isComparingEdge
                              ? "#f59e0b"
                              : "currentColor"
                          }
                          className={
                            isSwappingEdge || isComparingEdge
                              ? "transition-colors duration-300"
                              : "text-border/70"
                          }
                          strokeWidth={isSwappingEdge || isComparingEdge ? "3" : "1.75"}
                          strokeDasharray={isComparingEdge ? "4 3" : undefined}
                        />
                      );
                    }

                    if (node.rightIndex !== null && nodeCoords[node.rightIndex]) {
                      const child = nodeCoords[node.rightIndex];
                      const isComparingEdge =
                        currentStep.comparingIndices.includes(node.index) &&
                        currentStep.comparingIndices.includes(child.index);
                      const isSwappingEdge =
                        currentStep.swappingIndices.includes(node.index) &&
                        currentStep.swappingIndices.includes(child.index);

                      edges.push(
                        <line
                          key={`edge-${node.index}-${child.index}`}
                          x1={node.x}
                          y1={node.y}
                          x2={child.x}
                          y2={child.y}
                          stroke={
                            isSwappingEdge
                              ? "#ec4899"
                              : isComparingEdge
                              ? "#f59e0b"
                              : "currentColor"
                          }
                          className={
                            isSwappingEdge || isComparingEdge
                              ? "transition-colors duration-300"
                              : "text-border/70"
                          }
                          strokeWidth={isSwappingEdge || isComparingEdge ? "3" : "1.75"}
                          strokeDasharray={isComparingEdge ? "4 3" : undefined}
                        />
                      );
                    }
                    return edges;
                  })}

                  {/* Nodes */}
                  {Object.values(nodeCoords).map((node) => {
                    const isActive = currentStep.activeIndices.includes(node.index);
                    const isComparing = currentStep.comparingIndices.includes(node.index);
                    const isSwapping = currentStep.swappingIndices.includes(node.index);
                    const isHighlight = currentStep.highlightIndices.includes(node.index);
                    const isSelected = selectedInspectorNode === node.index;

                    let circleClass = "fill-card stroke-border/90 stroke-2";
                    let textClass = "fill-foreground font-mono font-bold text-xs";

                    if (isSwapping) {
                      circleClass = "fill-pink-500/20 stroke-pink-500 stroke-3 animate-pulse";
                      textClass = "fill-pink-600 dark:fill-pink-300 font-mono font-bold text-xs";
                    } else if (isComparing) {
                      circleClass = "fill-amber-500/20 stroke-amber-500 stroke-2.5";
                      textClass = "fill-amber-600 dark:fill-amber-300 font-mono font-bold text-xs";
                    } else if (isHighlight || node.index === 0) {
                      circleClass = "fill-emerald-500/15 stroke-emerald-500 stroke-2";
                      textClass = "fill-emerald-700 dark:fill-emerald-300 font-mono font-bold text-xs";
                    } else if (isActive) {
                      circleClass = "fill-cyan-500/20 stroke-cyan-500 stroke-2.5";
                      textClass = "fill-cyan-700 dark:fill-cyan-300 font-mono font-bold text-xs";
                    }

                    return (
                      <g
                        key={`node-${node.index}`}
                        onClick={() => setSelectedInspectorNode(node.index)}
                        className="cursor-pointer transition-transform duration-200 hover:scale-110"
                      >
                        {/* Selected halo */}
                        {isSelected && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="22"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="animate-spin"
                            style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "10s" }}
                          />
                        )}

                        {/* Node circle */}
                        <circle cx={node.x} cy={node.y} r="17" className={circleClass} />

                        {/* Node value */}
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          className={textClass}
                        >
                          {node.val}
                        </text>

                        {/* Index badge at top */}
                        <rect
                          x={node.x - 12}
                          y={node.y - 28}
                          width="24"
                          height="12"
                          rx="3"
                          className="fill-secondary/90 stroke-border/60 stroke-1"
                        />
                        <text
                          x={node.x}
                          y={node.y - 19}
                          textAnchor="middle"
                          className="text-[9px] font-mono fill-muted-foreground font-semibold"
                        >
                          [{node.index}]
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Synchronized 1D Memory Array Strip */}
            <div className="p-3 rounded-xl border border-border/70 bg-secondary/30 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <Layers className="h-3.5 w-3.5 text-amber-500" />
                  1D Contiguous Physical Memory Strip
                </span>
                <span>Click any cell to inspect index formulas</span>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
                {currentStep.array.map((val, idx) => {
                  const isActive = currentStep.activeIndices.includes(idx);
                  const isComparing = currentStep.comparingIndices.includes(idx);
                  const isSwapping = currentStep.swappingIndices.includes(idx);
                  const isHighlight = currentStep.highlightIndices.includes(idx);
                  const isSelected = selectedInspectorNode === idx;

                  let boxClass = "border-border/70 bg-card hover:bg-secondary/70";
                  let textClass = "text-foreground";

                  if (isSwapping) {
                    boxClass = "border-pink-500 bg-pink-500/15";
                    textClass = "text-pink-600 dark:text-pink-300 font-bold";
                  } else if (isComparing) {
                    boxClass = "border-amber-500 bg-amber-500/15";
                    textClass = "text-amber-600 dark:text-amber-300 font-bold";
                  } else if (isHighlight || idx === 0) {
                    boxClass = "border-emerald-500 bg-emerald-500/15";
                    textClass = "text-emerald-700 dark:text-emerald-300 font-bold";
                  } else if (isActive) {
                    boxClass = "border-cyan-500 bg-cyan-500/15";
                    textClass = "text-cyan-700 dark:text-cyan-300 font-bold";
                  } else if (isSelected) {
                    boxClass = "border-cyan-500 ring-1 ring-cyan-500";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedInspectorNode(idx)}
                      className={`flex flex-col items-center px-2 py-1.5 rounded-lg border text-center transition-all min-w-[42px] sm:min-w-[46px] cursor-pointer ${boxClass}`}
                    >
                      <span className="text-[9px] font-mono text-muted-foreground">[{idx}]</span>
                      <span className={`text-xs font-mono font-bold ${textClass}`}>{val}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Operation Status & Live Telemetry Box */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 backdrop-blur-md shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                <span className="font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Step Telemetry
                </span>
              </div>
              <span className="text-muted-foreground">
                Step {currentStepIndex + 1} of {Math.max(1, steps.length)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed min-h-[36px] flex items-center">
              {currentStep.description}
            </p>

            {currentStep.formulaNote && (
              <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-xs font-mono">
                <span className="text-amber-700 dark:text-amber-300 font-semibold">
                  {currentStep.formulaNote.label}: {currentStep.formulaNote.calculation}
                </span>
                <span className="font-bold px-2 py-0.5 rounded bg-amber-500/20 text-foreground">
                  {currentStep.formulaNote.result}
                </span>
              </div>
            )}
          </div>

          {/* Studio Control Deck */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 backdrop-blur-md shadow-sm space-y-4">
            {/* Action Bar: Custom Input & Operations */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                <input
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Key value"
                  className="w-24 px-3 py-1.5 rounded-lg border border-border bg-secondary/60 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleInsert}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Insert (Sift-Up)</span>
                </button>
                <button
                  onClick={handleExtractRoot}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                  title="Extract root node and sift down last leaf"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Extract {heapMode === "min" ? "Min" : "Max"}</span>
                </button>
                <button
                  onClick={handlePeek}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-secondary/80 hover:bg-secondary text-foreground border border-border/70 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                  title="Peek root element in O(1) time"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Peek</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleHeapify}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                  title="Build Heap in linear O(n) time using bottom-up sift-down"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Heapify O(n)</span>
                </button>
                <button
                  onClick={handleToggleMode}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                  title="Toggle Min-Heap / Max-Heap mode"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-purple-500" />
                  <span>To {heapMode === "min" ? "Max" : "Min"}</span>
                </button>
                <button
                  onClick={handleRandomInsert}
                  className="p-1.5 rounded-lg text-xs font-semibold bg-secondary/60 hover:bg-secondary text-foreground border border-border/70 transition-all active:scale-95 cursor-pointer"
                  title="Insert a random number between 10 and 99"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                </button>
              </div>
            </div>

            {/* Presets Selector & Playback Controls */}
            <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground">Preset:</span>
                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-secondary/60 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="balanced-min">Balanced Min-Heap (9 Items)</option>
                  <option value="balanced-max">Balanced Max-Heap (9 Items)</option>
                  <option value="random-unordered">Unordered Array (Ready to Heapify!)</option>
                  <option value="almost-sorted">Almost Sorted Sequence</option>
                  <option value="task-priorities">Task Priorities [99..33]</option>
                </select>
              </div>

              {/* Step / Play Controls & Speed */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleStepBackward}
                  disabled={currentStepIndex <= 0 || isPlaying}
                  className="p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 text-foreground transition-all active:scale-95 cursor-pointer"
                  title="Step Backward"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={isPlaying ? handlePause : handlePlay}
                  disabled={steps.length <= 1 && currentStepIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Play</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleStepForward}
                  disabled={currentStepIndex >= steps.length - 1 || isPlaying}
                  className="p-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 text-foreground transition-all active:scale-95 cursor-pointer"
                  title="Step Forward"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground border border-border/60 transition-all active:scale-95 cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <span className="text-[11px] font-mono text-muted-foreground ml-1">
                  Step {steps.length > 0 ? currentStepIndex + 1 : 1}/{Math.max(1, steps.length)}
                </span>

                {/* Speed Slider */}
                <div className="flex items-center gap-1.5 ml-2">
                  <Sliders className="h-3 w-3 text-muted-foreground" />
                  <input
                    type="range"
                    min="250"
                    max="1500"
                    step="50"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-16 sm:w-20 accent-amber-500 cursor-pointer h-1.5"
                    title={`Animation delay: ${speed}ms`}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {speed}ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (5 cols, sticky): CodeViewer & Index Arithmetic Inspector
            ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          {/* Synchronized Compact C++ CodeViewer */}
          <div className="h-[280px] sm:h-[300px] lg:h-[320px] max-h-[280px] sm:max-h-[300px] lg:max-h-[320px] min-h-0 shrink-0 overflow-hidden flex flex-col rounded-2xl border border-border/80 bg-card shadow-sm">
            <CodeViewer
              code={HEAP_CPP_SOURCE}
              activeLineNumber={currentStep.codeLine}
              algorithmName="Binary Heap (C++)"
            />
          </div>

          {/* Heap Invariant & Index Derivation Inspector */}
          <div className="rounded-2xl border border-border/80 bg-card p-4 backdrop-blur-md shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                  Index Arithmetic Calculator
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Selected: Node [{inspIdx}]
              </span>
            </div>

            {/* Arithmetic Formula Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl border border-border/70 bg-secondary/40 space-y-1">
                <span className="text-[10px] text-muted-foreground block">CURRENT NODE:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  Index [{inspIdx}] = {currentStep.array[inspIdx] ?? "None"}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Depth Level: {Math.floor(Math.log2(inspIdx + 1))}
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-border/70 bg-secondary/40 space-y-1">
                <span className="text-[10px] text-muted-foreground block">PARENT FORMULA:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {inspParent !== null ? `⌊(${inspIdx}-1)/2⌋ = [${inspParent}] (${currentStep.array[inspParent]})` : "None (Root)"}
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-border/70 bg-secondary/40 space-y-1">
                <span className="text-[10px] text-muted-foreground block">LEFT CHILD FORMULA:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {inspLeft !== null ? `2*${inspIdx}+1 = [${inspLeft}] (${currentStep.array[inspLeft]})` : "None (Leaf)"}
                </span>
              </div>

              <div className="p-2.5 rounded-xl border border-border/70 bg-secondary/40 space-y-1">
                <span className="text-[10px] text-muted-foreground block">RIGHT CHILD FORMULA:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {inspRight !== null ? `2*${inspIdx}+2 = [${inspRight}] (${currentStep.array[inspRight]})` : "None (Leaf)"}
                </span>
              </div>
            </div>

            {/* Invariant Explanation Summary */}
            <div className="p-3 rounded-xl border border-border/60 bg-secondary/20 text-xs text-muted-foreground leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px] font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zero-Pointer Array Cache Locality:</span>
              </div>
              <p className="text-[11px]">
                Because array elements are stored contiguously in CPU RAM, navigating parent and children requires zero pointer-dereference misses, achieving peak L1 cache throughput compared to linked trees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
