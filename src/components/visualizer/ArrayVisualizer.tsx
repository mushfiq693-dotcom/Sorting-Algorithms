"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrayEngine,
  ArrayStep,
  formatHexAddress,
  BASE_MEMORY_ADDRESS,
  ELEMENT_SIZE_BYTES,
} from "@/algorithms/array";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CodeViewer } from "@/components/code/CodeViewer";
import { ALGORITHMS } from "@/data/algorithms";
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Edit3,
  Eye,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Code2,
  ListOrdered,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Cpu,
  Database,
  Calculator,
  RefreshCw,
} from "lucide-react";

export function ArrayVisualizer() {
  const prefersReducedMotion = useReducedMotion();

  // Engine instance
  const [engine] = useState(() => new ArrayEngine(8, [14, 28, 42, 56, 70], "dynamic"));

  // State
  const [currentStep, setCurrentStep] = useState<ArrayStep>(() => ({
    type: "idle",
    description: "Array initialized with 5 elements (Capacity: 8). Try Access, Insert, Delete, or Search operations.",
    items: [14, 28, 42, 56, 70, null, null, null],
    capacity: 8,
    size: 5,
    highlightedIndices: [],
    targetIndex: null,
    baseAddress: BASE_MEMORY_ADDRESS,
    elementSize: ELEMENT_SIZE_BYTES,
  }));

  const [mode, setMode] = useState<"static" | "dynamic">("dynamic");
  const [selectedOperation, setSelectedOperation] = useState<
    "access" | "insert" | "append" | "delete" | "pop" | "update" | "search"
  >("access");

  // Inputs
  const [inputIndex, setInputIndex] = useState<string>("2");
  const [inputValue, setInputValue] = useState<string>("99");
  const [searchTarget, setSearchTarget] = useState<string>("42");

  // Stepper & Animation queue
  const [stepQueue, setStepQueue] = useState<ArrayStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(450);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleModeToggle = (newMode: "static" | "dynamic") => {
    clearTimer();
    setIsPlaying(false);
    setMode(newMode);
    const step = engine.setMode(newMode);
    setCurrentStep(step);
    setStepQueue([step]);
    setStepIndex(0);
  };

  const executeOperationSteps = (steps: ArrayStep[]) => {
    clearTimer();
    setStepQueue(steps);
    setStepIndex(0);
    if (steps.length > 0) {
      setCurrentStep(steps[0]);
    }
    if (steps.length > 1) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleAccess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idx = parseInt(inputIndex, 10);
    if (isNaN(idx)) return;
    const res = engine.access(idx);
    executeOperationSteps(res.steps);
  };

  const handleUpdate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idx = parseInt(inputIndex, 10);
    const val = parseInt(inputValue, 10);
    if (isNaN(idx) || isNaN(val)) return;
    const res = engine.update(idx, val);
    executeOperationSteps(res.steps);
  };

  const handleInsert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idx = parseInt(inputIndex, 10);
    const val = parseInt(inputValue, 10);
    if (isNaN(idx) || isNaN(val)) return;
    const res = engine.insert(idx, val);
    executeOperationSteps(res.steps);
  };

  const handleAppend = () => {
    const val = parseInt(inputValue, 10) || Math.floor(Math.random() * 90) + 10;
    const res = engine.append(val);
    executeOperationSteps(res.steps);
  };

  const handleDelete = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idx = parseInt(inputIndex, 10);
    if (isNaN(idx)) return;
    const res = engine.delete(idx);
    executeOperationSteps(res.steps);
  };

  const handlePop = () => {
    const res = engine.pop();
    executeOperationSteps(res.steps);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = parseInt(searchTarget, 10);
    if (isNaN(target)) return;
    const res = engine.search(target);
    executeOperationSteps(res.steps);
  };

  const handleRandomize = () => {
    clearTimer();
    setIsPlaying(false);
    const step = engine.randomize(5, 8);
    setCurrentStep(step);
    setStepQueue([step]);
    setStepIndex(0);
  };

  const handleClear = () => {
    clearTimer();
    setIsPlaying(false);
    const step = engine.clear();
    setCurrentStep(step);
    setStepQueue([step]);
    setStepIndex(0);
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    if (stepIndex >= stepQueue.length - 1) {
      setIsPlaying(false);
      clearTimer();
      return;
    }

    timerRef.current = setTimeout(() => {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setCurrentStep(stepQueue[nextIdx]);
      if (nextIdx >= stepQueue.length - 1) {
        setIsPlaying(false);
      }
    }, speed);

    return () => clearTimer();
  }, [isPlaying, stepIndex, stepQueue, speed, clearTimer]);

  const handleStepForward = () => {
    clearTimer();
    setIsPlaying(false);
    if (stepIndex < stepQueue.length - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setCurrentStep(stepQueue[nextIdx]);
    }
  };

  const handleStepBack = () => {
    clearTimer();
    setIsPlaying(false);
    if (stepIndex > 0) {
      const prevIdx = stepIndex - 1;
      setStepIndex(prevIdx);
      setCurrentStep(stepQueue[prevIdx]);
    }
  };

  const isError = currentStep.type === "error";
  const isSearchSuccess = currentStep.type === "search-complete" && currentStep.searchFound;

  const activeLineNumber = useMemo(() => {
    if (currentStep.isResizing) return 8;
    switch (currentStep.type) {
      case "access":
        return 26;
      case "insert-start":
      case "insert-shift":
      case "insert-place":
        return 39;
      case "delete-start":
      case "delete-shift":
      case "delete-complete":
        return 48;
      case "search-step":
      case "search-complete":
        return 26;
      case "update":
        return 26;
      case "resize-start":
      case "resize-copy":
      case "resize-complete":
        return 8;
      default:
        return selectedOperation === "append" || selectedOperation === "pop" ? 32 : null;
    }
  }, [currentStep, selectedOperation]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto" suppressHydrationWarning>
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Contiguous Memory Visual Stage Canvas */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col min-h-[360px] relative overflow-hidden shadow-sm">
            {/* Header Indicators */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
                <Cpu className="h-4 w-4" />
                <span>Contiguous Physical Memory Layout (4B / Slot)</span>
              </div>
              <div className="text-muted-foreground text-[11px]">
                Base: <span className="font-bold text-foreground">{formatHexAddress(currentStep.baseAddress, 0)}</span>
              </div>
            </div>

            {/* Reallocation Old Buffer View (Shown during Dynamic Resizing) */}
            {currentStep.isResizing && currentStep.oldBuffer && (
              <div className="mb-4 p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-500">
                  <span>OLD HEAP BUFFER (Deallocated)</span>
                  <span>Base: {formatHexAddress(currentStep.oldBuffer.baseAddress, 0)} (Cap: {currentStep.oldBuffer.capacity})</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {currentStep.oldBuffer.items.map((val, idx) => (
                    <div
                      key={`old-${idx}`}
                      className="w-10 h-10 rounded-lg border border-amber-500/30 bg-amber-950/20 flex flex-col items-center justify-center font-mono text-[10px] opacity-60 line-through text-amber-200"
                    >
                      <span className="text-[8px] text-amber-400">[{idx}]</span>
                      <span>{val ?? "-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Horizontal Memory Slot Strip */}
            <div className="w-full overflow-x-auto py-4">
              <div className="flex items-center justify-start sm:justify-center gap-2 min-w-[500px] px-2">
                {currentStep.items.map((val, idx) => {
                  const isOccupied = val !== null;
                  const isTarget = currentStep.targetIndex === idx;
                  const isHighlighted = currentStep.highlightedIndices.includes(idx);
                  const isShiftFrom = currentStep.shiftIndices?.from === idx;
                  const isShiftTo = currentStep.shiftIndices?.to === idx;
                  const addressStr = formatHexAddress(currentStep.baseAddress, idx, currentStep.elementSize);

                  let cellBg = "bg-card border-border text-foreground";
                  if (isHighlighted || isTarget) {
                    cellBg = "bg-cyan-500 text-slate-950 border-cyan-300 font-extrabold shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400 scale-105";
                  } else if (isShiftTo) {
                    cellBg = "bg-amber-500/20 border-amber-500/60 text-amber-300 ring-2 ring-amber-500/40";
                  } else if (isShiftFrom) {
                    cellBg = "bg-purple-500/20 border-purple-500/60 text-purple-300";
                  } else if (isOccupied) {
                    cellBg = "bg-secondary/70 border-cyan-500/30 text-foreground";
                  } else {
                    cellBg = "bg-secondary/20 border-dashed border-border/60 text-muted-foreground/40";
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                      {/* Top Hex Physical Address */}
                      <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                        {addressStr}
                      </span>

                      {/* Memory Cell Box */}
                      <div className="relative">
                        <AnimatePresence mode="popLayout">
                          <motion.div
                            layout={!prefersReducedMotion}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1 border font-mono transition-all ${cellBg}`}
                          >
                            <span className="text-[8px] opacity-70">
                              +{idx * currentStep.elementSize}B
                            </span>
                            <span className="text-xs sm:text-sm font-bold">
                              {isOccupied ? val : "-"}
                            </span>
                            <span className="text-[7px] font-mono tracking-tighter opacity-60">
                              {isOccupied ? "32-BIT" : "FREE"}
                            </span>
                          </motion.div>
                        </AnimatePresence>

                        {/* Directional Shift Overlay Indicator */}
                        {isShiftTo && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -top-2.5 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[8px] font-bold shadow-sm"
                          >
                            SHIFT
                          </motion.div>
                        )}
                      </div>

                      {/* Array Index Label */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-mono font-bold text-foreground">
                          [{idx}]
                        </span>
                        {idx === currentStep.size - 1 && (
                          <span className="text-[8px] font-mono text-cyan-500 font-bold">
                            END
                          </span>
                        )}
                        {idx === 0 && (
                          <span className="text-[8px] font-mono text-emerald-500 font-bold">
                            HEAD
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Operation Status & Live Execution Telemetry */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2.5 sm:p-3 backdrop-blur-xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-cyan-400" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground">
                  Execution Telemetry
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <div className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-cyan-600 dark:text-cyan-300">
                  <span className="text-[10px] text-muted-foreground">Size:</span>
                  <strong className="font-bold">{currentStep.size}/{currentStep.capacity}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-300">
                  <span className="text-[10px] text-muted-foreground">Mode:</span>
                  <strong className="font-bold">{mode === "dynamic" ? "std::vector" : "Static"}</strong>
                </div>
                {stepQueue.length > 1 && (
                  <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-600 dark:text-emerald-300">
                    <span className="text-[10px] text-muted-foreground">Step:</span>
                    <strong className="font-bold">{stepIndex + 1}/{stepQueue.length}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Explanation Text Box */}
            <div className={`rounded-xl border px-3 py-1.5 min-h-[36px] flex items-center shadow-inner ${
              isError
                ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
                : isSearchSuccess
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                : "border-border/80 bg-secondary/60 text-foreground"
            }`}>
              <p className="text-xs font-medium font-mono flex items-center gap-2 truncate">
                {isError ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                ) : isSearchSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
                )}
                <span className="truncate">{currentStep.description}</span>
              </p>
            </div>
          </div>

          {/* Interactive Operation Control Panel */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/90 shadow-sm backdrop-blur-xl space-y-2.5" suppressHydrationWarning>
            {/* Row 1: Mode & Utility Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  <span>Type:</span>
                </span>
                <div className="inline-flex p-0.5 rounded-lg border border-border bg-secondary/80 text-[11px]">
                  <button
                    onClick={() => handleModeToggle("dynamic")}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      mode === "dynamic"
                        ? "bg-card text-foreground shadow-xs font-bold text-cyan-600 dark:text-cyan-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dynamic (vector)
                  </button>
                  <button
                    onClick={() => handleModeToggle("static")}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      mode === "static"
                        ? "bg-card text-foreground shadow-xs font-bold text-cyan-600 dark:text-cyan-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Static Fixed
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={handleRandomize}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-border bg-secondary/80 text-muted-foreground text-[11px] hover:text-foreground transition-all cursor-pointer"
                  title="Random Elements"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Random</span>
                </button>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-red-400 transition-all cursor-pointer text-[11px]"
                  title="Clear Array"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Row 2: Operation Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-secondary/60 border border-border/80">
              {[
                { id: "access", label: "Access", icon: Eye },
                { id: "insert", label: "Insert", icon: Plus },
                { id: "append", label: "Append", icon: ArrowRight },
                { id: "delete", label: "Delete", icon: Trash2 },
                { id: "pop", label: "Pop", icon: ArrowLeft },
                { id: "update", label: "Update", icon: Edit3 },
                { id: "search", label: "Search", icon: Search },
              ].map((op) => {
                const Icon = op.icon;
                const isActive = selectedOperation === op.id;
                return (
                  <button
                    key={op.id}
                    onClick={() => setSelectedOperation(op.id as any)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{op.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Row 3: Operation Form & Playback Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/70">
              <div className="flex flex-wrap items-center gap-2 bg-secondary/40 border border-border/70 p-1 rounded-xl">
                {(selectedOperation === "access" ||
                  selectedOperation === "insert" ||
                  selectedOperation === "delete" ||
                  selectedOperation === "update") && (
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">i:</span>
                    <input
                      type="number"
                      value={inputIndex}
                      onChange={(e) => setInputIndex(e.target.value)}
                      className="w-12 px-1.5 py-0.5 text-xs font-mono rounded border border-border bg-background text-foreground text-center"
                      min={0}
                      max={Math.max(0, currentStep.capacity)}
                    />
                  </div>
                )}

                {(selectedOperation === "insert" ||
                  selectedOperation === "append" ||
                  selectedOperation === "update") && (
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">Val:</span>
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-14 px-1.5 py-0.5 text-xs font-mono rounded border border-border bg-background text-foreground text-center"
                    />
                  </div>
                )}

                {selectedOperation === "search" && (
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">Target:</span>
                    <input
                      type="number"
                      value={searchTarget}
                      onChange={(e) => setSearchTarget(e.target.value)}
                      className="w-14 px-1.5 py-0.5 text-xs font-mono rounded border border-border bg-background text-foreground text-center"
                    />
                  </div>
                )}

                <button
                  onClick={() => {
                    if (selectedOperation === "access") handleAccess();
                    else if (selectedOperation === "insert") handleInsert();
                    else if (selectedOperation === "append") handleAppend();
                    else if (selectedOperation === "delete") handleDelete();
                    else if (selectedOperation === "pop") handlePop();
                    else if (selectedOperation === "update") handleUpdate();
                    else if (selectedOperation === "search") handleSearch();
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-cyan-400 transition-all cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Execute {selectedOperation.toUpperCase()}</span>
                </button>
              </div>

              {stepQueue.length > 1 && (
                <div className="flex items-center gap-1.5 bg-secondary/40 border border-border/70 px-2 py-1 rounded-xl">
                  <button
                    onClick={handleStepBack}
                    disabled={stepIndex === 0 || isPlaying}
                    className="p-1 rounded border border-border bg-secondary text-foreground disabled:opacity-40 cursor-pointer"
                    title="Step Back"
                  >
                    <SkipBack className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (stepIndex >= stepQueue.length - 1) {
                        setStepIndex(0);
                        setCurrentStep(stepQueue[0]);
                        setIsPlaying(true);
                      } else {
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-[11px] cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={stepIndex >= stepQueue.length - 1 || isPlaying}
                    className="p-1 rounded border border-border bg-secondary text-foreground disabled:opacity-40 cursor-pointer"
                    title="Step Forward"
                  >
                    <SkipForward className="h-3 w-3" />
                  </button>
                  <div className="flex items-center gap-1 ml-2 text-[10px] font-mono text-muted-foreground">
                    <span>Speed:</span>
                    <input
                      type="range"
                      min={150}
                      max={900}
                      step={50}
                      value={1050 - speed}
                      onChange={(e) => setSpeed(1050 - parseInt(e.target.value, 10))}
                      className="w-16 accent-cyan-500 cursor-pointer h-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized C++ Code Viewer + Address Calculator */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[280px] sm:h-[300px] lg:h-[320px] max-h-[280px] sm:max-h-[300px] lg:max-h-[320px] min-h-0 shrink-0 overflow-hidden flex flex-col">
            <CodeViewer
              code={ALGORITHMS.array.cppCode}
              activeLineNumber={activeLineNumber}
              algorithmName="DynamicArray"
            />
          </div>

          {/* Live Index Calculation Card */}
          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-xl space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
              <Calculator className="h-3.5 w-3.5 text-cyan-500" />
              <span>O(1) Memory Address Formula</span>
            </h3>

            <div className="p-2.5 rounded-xl bg-background/80 border border-border font-mono text-xs space-y-1">
              <div className="text-muted-foreground text-[10px]">
                Address = Base + (Index × ElementSize)
              </div>
              <div className="font-bold text-foreground text-xs leading-relaxed">
                {currentStep.formulaHighlight ? (
                  <span>
                    {formatHexAddress(currentStep.formulaHighlight.baseAddress, 0)} + (
                    {currentStep.formulaHighlight.index} × {currentStep.formulaHighlight.elementSize}B) ={" "}
                    <strong className="text-cyan-600 dark:text-cyan-400">
                      {currentStep.formulaHighlight.computedAddress}
                    </strong>
                  </span>
                ) : (
                  <span>
                    {formatHexAddress(currentStep.baseAddress, 0)} + (i × 4B)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Compact Array Memory Table */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <ListOrdered className="h-3.5 w-3.5 text-cyan-500" />
              <span>Memory Table &amp; Spatial Cache</span>
            </h3>

            <div className="space-y-1 font-mono text-xs max-h-[160px] overflow-y-auto touch-scroll">
              <div className="grid grid-cols-4 text-[10px] text-muted-foreground border-b border-border pb-1 font-semibold">
                <span>Slot</span>
                <span>Address</span>
                <span>Value</span>
                <span>State</span>
              </div>
              {currentStep.items.map((val, idx) => {
                const isOccupied = val !== null;
                const isSelected = currentStep.targetIndex === idx || currentStep.highlightedIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-4 py-0.5 px-1 rounded text-[10px] transition-colors ${
                      isSelected
                        ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-bold"
                        : isOccupied
                        ? "text-foreground hover:bg-secondary/50"
                        : "text-muted-foreground/40 italic"
                    }`}
                  >
                    <span>arr[{idx}]</span>
                    <span>{formatHexAddress(currentStep.baseAddress, idx, currentStep.elementSize)}</span>
                    <span>{isOccupied ? val : "-"}</span>
                    <span>{isOccupied ? "ACTIVE" : "FREE"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
