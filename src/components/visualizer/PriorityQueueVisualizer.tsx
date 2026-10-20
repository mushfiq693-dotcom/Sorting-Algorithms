"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Boxes,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sliders,
  Plus,
  ArrowUpRight,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  ArrowDown,
  ArrowUp,
  Activity,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  PriorityQueueEngine,
  PQItem,
  PQStep,
  PQMode,
  PQItemCategory,
  PQ_PRESET_OS_SCHEDULER,
  PQ_PRESET_HOSPITAL_TRIAGE,
  PQ_PRESET_DIJKSTRA_FRONTIER,
  PQ_PRESET_NETWORK_QOS,
} from "@/algorithms/priority-queue";
import { CodeViewer } from "@/components/code/CodeViewer";

const CPP_PRIORITY_QUEUE_CODE = `template <typename T>
class PriorityQueue {
    vector<T> heap;
    bool isMax;

    bool compare(const T& a, const T& b) {
        return isMax ? a.priority > b.priority : a.priority < b.priority;
    }

public:
    PriorityQueue(bool maxPrio = true) : isMax(maxPrio) {}

    // Enqueue task into priority queue: O(log n)
    void push(T item) {
        heap.push_back(item);
        int i = heap.size() - 1;
        while (i > 0 && compare(heap[i], heap[(i - 1) / 2])) {
            swap(heap[i], heap[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }

    // Dequeue highest priority task: O(log n)
    T pop() {
        if (heap.empty()) throw runtime_error("Empty queue");
        T top = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        siftDown(0);
        return top;
    }

    // Sift down to maintain priority invariant: O(log n)
    void siftDown(int i) {
        int n = heap.size();
        while (2 * i + 1 < n) {
            int left = 2 * i + 1, right = 2 * i + 2, target = left;
            if (right < n && compare(heap[right], heap[left])) target = right;
            if (compare(heap[target], heap[i])) {
                swap(heap[i], heap[target]);
                i = target;
            } else break;
        }
    }

    // O(1) inspection of highest priority task
    const T& peek() const { return heap.at(0); }

    // Dynamic priority modification: O(log n)
    void changePriority(int index, int newPrio) {
        int oldPrio = heap[index].priority;
        heap[index].priority = newPrio;
        if (newPrio > oldPrio) siftUp(index);
        else siftDown(index);
    }
};`;

export function PriorityQueueVisualizer() {
  const [engine] = useState<PriorityQueueEngine>(
    () => new PriorityQueueEngine(PQ_PRESET_OS_SCHEDULER, "max")
  );

  const [mode, setMode] = useState<PQMode>("max");
  const [steps, setSteps] = useState<PQStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(450);

  // Form states for manual enqueue
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] = useState<number>(50);
  const [newTaskCategory, setNewTaskCategory] = useState<PQItemCategory>("normal");

  // Form states for change priority
  const [selectedTaskToChange, setSelectedTaskToChange] = useState<string>("");
  const [updatedPriorityValue, setUpdatedPriorityValue] = useState<number>(50);

  // Selected Preset
  const [activePreset, setActivePreset] = useState<string>("os");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize steps
  useEffect(() => {
    const initialSteps = engine.loadPreset(PQ_PRESET_OS_SCHEDULER, "max");
    setSteps(initialSteps);
    setCurrentStepIdx(0);
    setMode("max");
  }, [engine]);

  const currentStep: PQStep | null = steps[currentStepIdx] || null;
  const currentItems = currentStep?.items || engine.getItems();
  const dispatchedHistory = currentStep?.dispatchedHistory || engine.getDispatchedHistory();

  // Clear timer helper
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Step navigation
  const handleStepNext = useCallback(() => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      clearTimer();
    }
  }, [currentStepIdx, steps.length, clearTimer]);

  const handleStepPrev = useCallback(() => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  }, [currentStepIdx]);

  const handleReset = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    setCurrentStepIdx(0);
  }, [clearTimer]);

  // Autoplay loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          setIsPlaying(false);
          clearTimer();
          return prev;
        });
      }, speed);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isPlaying, speed, steps.length, clearTimer]);

  // Execute operations
  const runOperation = (generatedSteps: PQStep[]) => {
    clearTimer();
    setIsPlaying(false);
    setSteps(generatedSteps);
    setCurrentStepIdx(0);

    if (generatedSteps.length > 1) {
      setIsPlaying(true);
    }
  };

  const handleEnqueue = () => {
    if (!newTaskTitle.trim()) return;
    const item: PQItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      priority: Number(newTaskPriority),
      category: newTaskCategory,
    };
    const newSteps = engine.enqueue(item);
    runOperation(newSteps);
    setNewTaskTitle("");
  };

  const handleDequeue = () => {
    const newSteps = engine.dequeue();
    runOperation(newSteps);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handlePeek = () => {
    const newSteps = engine.peek();
    runOperation(newSteps);
  };

  const handleChangePriority = () => {
    if (!selectedTaskToChange) return;
    const newSteps = engine.changePriority(selectedTaskToChange, Number(updatedPriorityValue));
    runOperation(newSteps);
  };

  const handleModeToggle = (newMode: PQMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    const newSteps = engine.setMode(newMode);
    runOperation(newSteps);
  };

  const handlePresetSelect = (presetKey: string) => {
    setActivePreset(presetKey);
    let presetItems: PQItem[] = [];
    let presetMode: PQMode = "max";

    switch (presetKey) {
      case "os":
        presetItems = PQ_PRESET_OS_SCHEDULER;
        presetMode = "max";
        break;
      case "er":
        presetItems = PQ_PRESET_HOSPITAL_TRIAGE;
        presetMode = "max";
        break;
      case "dijkstra":
        presetItems = PQ_PRESET_DIJKSTRA_FRONTIER;
        presetMode = "min";
        break;
      case "qos":
        presetItems = PQ_PRESET_NETWORK_QOS;
        presetMode = "max";
        break;
      default:
        presetItems = PQ_PRESET_OS_SCHEDULER;
        presetMode = "max";
    }

    setMode(presetMode);
    const newSteps = engine.loadPreset(presetItems, presetMode);
    runOperation(newSteps);
  };

  const handleClear = () => {
    const newSteps = engine.clear();
    runOperation(newSteps);
  };

  // Node coordinates for Complete Binary Tree
  const nodeCoords = useMemo(() => {
    return PriorityQueueEngine.calculateNodeCoordinates(currentItems, 740, 310);
  }, [currentItems]);

  const activeIdx = currentStep?.activeItemIndex ?? null;
  const comparingIdxs = currentStep?.comparingIndices ?? null;
  const swappingIdxs = currentStep?.swappingIndices ?? null;

  const topTask = currentItems.length > 0 ? currentItems[0] : null;

  // Category badge colors
  const getCategoryBadgeClass = (category: PQItemCategory) => {
    switch (category) {
      case "critical":
        return "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30";
      case "high":
        return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "kernel":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "render":
        return "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
      case "io":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "low":
        return "bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30";
      case "normal":
      default:
        return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto select-none font-body">
      {/* =========================================================================
          CONTROL HUB & PRESETS
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-border/80 bg-card/75 dark:bg-[#18181b]/80 backdrop-blur-md shadow-sm">
        {/* Left: Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Boxes className="h-4 w-4 text-amber-500" />
            <span>Preset Domain:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "os", label: "OS CPU Scheduler", mode: "Max" },
              { id: "er", label: "Hospital ER Triage", mode: "Max" },
              { id: "dijkstra", label: "Dijkstra Frontier", mode: "Min" },
              { id: "qos", label: "Network Packet QoS", mode: "Max" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activePreset === p.id
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/40 shadow-sm"
                    : "border border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Mode Toggle (Max-PQ vs Min-PQ) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-muted-foreground">Mode:</span>
          <div className="inline-flex rounded-xl border border-border p-1 bg-secondary/50">
            <button
              onClick={() => handleModeToggle("max")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "max"
                  ? "bg-amber-500 text-black shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowUp className="h-3 w-3" />
              <span>Max-Priority</span>
            </button>
            <button
              onClick={() => handleModeToggle("min")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "min"
                  ? "bg-cyan-500 text-black shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowDown className="h-3 w-3" />
              <span>Min-Priority</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STUDIO 7:5 WORKSPACE
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* =====================================================================
            LEFT COLUMN (7 cols): Dual-Canvas (Tree SVG + Priority Strip + Dispatch Runway)
            ===================================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Visual Stage */}
          <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="font-heading text-sm font-bold text-foreground">
                  Complete Binary Heap Backbone
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  ({currentItems.length} tasks queued)
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {mode === "max" ? "Root = Global Maximum" : "Root = Global Minimum"}
              </span>
            </div>

            {/* Tree SVG Canvas */}
            <div className="relative w-full h-[320px] bg-secondary/15 rounded-xl border border-border/40 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 740 310" preserveAspectRatio="xMidYMid meet">
                {/* Connecting Edges */}
                {nodeCoords.map((node) => {
                  if (node.parentIndex === null) return null;
                  const parentNode = nodeCoords[node.parentIndex];
                  if (!parentNode) return null;

                  const isComparingEdge =
                    comparingIdxs &&
                    ((comparingIdxs[0] === node.index && comparingIdxs[1] === node.parentIndex) ||
                      (comparingIdxs[1] === node.index && comparingIdxs[0] === node.parentIndex));

                  const isSwappingEdge =
                    swappingIdxs &&
                    ((swappingIdxs[0] === node.index && swappingIdxs[1] === node.parentIndex) ||
                      (swappingIdxs[1] === node.index && swappingIdxs[0] === node.parentIndex));

                  return (
                    <line
                      key={`edge-${node.parentIndex}-${node.index}`}
                      x1={parentNode.x}
                      y1={parentNode.y}
                      x2={node.x}
                      y2={node.y}
                      stroke={
                        isSwappingEdge
                          ? "#f59e0b"
                          : isComparingEdge
                          ? "#38bdf8"
                          : "currentColor"
                      }
                      strokeWidth={isSwappingEdge ? 3.5 : isComparingEdge ? 2.5 : 1.5}
                      strokeDasharray={isComparingEdge ? "4 4" : undefined}
                      className={
                        isSwappingEdge
                          ? "text-amber-500 transition-colors"
                          : isComparingEdge
                          ? "text-cyan-400 transition-colors"
                          : "text-border transition-colors"
                      }
                    />
                  );
                })}

                {/* SVG Nodes */}
                {nodeCoords.map((node) => {
                  const isComparing =
                    comparingIdxs &&
                    (comparingIdxs[0] === node.index || comparingIdxs[1] === node.index);
                  const isSwapping =
                    swappingIdxs &&
                    (swappingIdxs[0] === node.index || swappingIdxs[1] === node.index);
                  const isActive = activeIdx === node.index;
                  const isRoot = node.index === 0;

                  return (
                    <g key={`pq-node-${node.item.id}-${node.index}`} className="transition-transform duration-200">
                      {/* Outer Aura */}
                      {(isComparing || isSwapping || isRoot) && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={28}
                          className={`animate-pulse ${
                            isSwapping
                              ? "fill-amber-500/25"
                              : isComparing
                              ? "fill-cyan-500/25"
                              : "fill-amber-500/10"
                          }`}
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={22}
                        className={`transition-all duration-200 ${
                          isSwapping
                            ? "fill-amber-500 stroke-amber-300 stroke-2"
                            : isComparing
                            ? "fill-cyan-500 stroke-cyan-300 stroke-2"
                            : isActive
                            ? "fill-purple-600 stroke-purple-400 stroke-2"
                            : isRoot
                            ? "fill-card stroke-amber-500 stroke-2"
                            : "fill-card stroke-border stroke-1"
                        }`}
                      />

                      {/* Priority Value */}
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className={`font-mono font-bold text-xs pointer-events-none ${
                          isSwapping || isComparing || isActive
                            ? "fill-white"
                            : isRoot
                            ? "fill-amber-500 dark:fill-amber-400"
                            : "fill-foreground"
                        }`}
                      >
                        {node.item.priority}
                      </text>

                      {/* Array Index Pill above node */}
                      <rect
                        x={node.x - 12}
                        y={node.y - 34}
                        width={24}
                        height={13}
                        rx={3}
                        className="fill-secondary stroke-border/70 stroke-[0.8]"
                      />
                      <text
                        x={node.x}
                        y={node.y - 25}
                        textAnchor="middle"
                        className="font-mono text-[9px] fill-muted-foreground font-semibold pointer-events-none"
                      >
                        [{node.index}]
                      </text>

                      {/* Task Title Label below node */}
                      <text
                        x={node.x}
                        y={node.y + 36}
                        textAnchor="middle"
                        className="font-sans font-semibold text-[10px] fill-muted-foreground pointer-events-none truncate max-w-[90px]"
                      >
                        {node.item.title.length > 13
                          ? `${node.item.title.slice(0, 12)}…`
                          : node.item.title}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 1D Array Slots Strip */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <Layers className="h-3.5 w-3.5 text-amber-500" />
                  <span>1D Contiguous Memory Array</span>
                </span>
                <span>Parent: ⌊(i-1)/2⌋ • Left: 2i+1 • Right: 2i+2</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                {currentItems.map((item, idx) => {
                  const isRoot = idx === 0;
                  const isComparing = comparingIdxs && (comparingIdxs[0] === idx || comparingIdxs[1] === idx);
                  const isSwapping = swappingIdxs && (swappingIdxs[0] === idx || swappingIdxs[1] === idx);

                  return (
                    <div
                      key={`slot-${item.id}-${idx}`}
                      className={`shrink-0 flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all min-w-[70px] ${
                        isSwapping
                          ? "border-amber-500 bg-amber-500/20 text-foreground"
                          : isComparing
                          ? "border-cyan-500 bg-cyan-500/20 text-foreground"
                          : isRoot
                          ? "border-amber-500/50 bg-amber-500/5 text-foreground"
                          : "border-border/60 bg-secondary/30 text-muted-foreground"
                      }`}
                    >
                      <span className="text-[10px] font-mono text-muted-foreground">[{idx}]</span>
                      <span className="font-mono font-bold text-sm text-foreground mt-0.5">
                        {item.priority}
                      </span>
                      <span className="text-[9px] font-sans truncate max-w-[60px] text-muted-foreground mt-0.5">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real-time Operation Indicator */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-secondary/40 flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span className="font-bold text-foreground uppercase tracking-wide">
                    Live Telemetry
                  </span>
                  <span>
                    Step {currentStepIdx + 1} / {Math.max(1, steps.length)}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 mt-1 leading-relaxed">
                  {currentStep?.explanation ||
                    "Ready. Enqueue tasks, dispatch the highest priority, or modify task weights."}
                </p>
              </div>
            </div>

            {/* Playback Transport Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>

                <button
                  onClick={handleStepPrev}
                  disabled={currentStepIdx === 0}
                  className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Step Backward"
                >
                  <SkipBack className="h-4 w-4" />
                </button>

                <button
                  onClick={handleStepNext}
                  disabled={currentStepIdx >= steps.length - 1}
                  className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  title="Step Forward"
                >
                  <SkipForward className="h-4 w-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground cursor-pointer transition-all"
                  title="Reset to Start"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">Delay:</span>
                <input
                  type="range"
                  min="150"
                  max="1000"
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-24 accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                  {speed}ms
                </span>
              </div>
            </div>
          </div>

          {/* Execution Runway & Dispatched History Shelf */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-500" />
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
                  Task Execution Dispatch Runway
                </h4>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {dispatchedHistory.length} completed
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {/* Next Up Slot */}
              <div className="shrink-0 p-3 rounded-xl border-2 border-amber-500/80 bg-amber-500/10 min-w-[150px] shadow-sm">
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  NEXT IN LINE &rarr;
                </span>
                {topTask ? (
                  <div className="mt-1">
                    <div className="font-bold text-xs text-foreground truncate">{topTask.title}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-mono font-bold text-xs text-amber-500">
                        Prio: {topTask.priority}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getCategoryBadgeClass(
                          topTask.category
                        )}`}
                      >
                        {topTask.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic mt-1">Queue Empty</div>
                )}
              </div>

              {/* History Shelf */}
              {dispatchedHistory.map((item, idx) => (
                <div
                  key={`dispatched-${item.id}-${idx}`}
                  className="shrink-0 p-3 rounded-xl border border-border bg-secondary/30 min-w-[140px] opacity-75 hover:opacity-100 transition-opacity"
                >
                  <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span>Dispatched #{dispatchedHistory.length - idx}</span>
                  </span>
                  <div className="font-semibold text-xs text-foreground truncate mt-1">
                    {item.title}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-muted-foreground">
                    <span>Priority: {item.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (5 cols): Operation Controls & C++ Synchronized CodeViewer
            ===================================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Action Hub Panel */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm space-y-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Priority Queue Operations</span>
            </h4>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDequeue}
                disabled={currentItems.length === 0}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 shadow-md shadow-amber-500/20"
              >
                <ArrowUpRight className="h-4 w-4" />
                <span>Dispatch Top (Pop)</span>
              </button>

              <button
                onClick={handlePeek}
                disabled={currentItems.length === 0}
                className="py-2.5 px-3 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <Eye className="h-4 w-4 text-cyan-500" />
                <span>Peek Root O(1)</span>
              </button>
            </div>

            {/* Enqueue Task Form */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/30 space-y-3">
              <span className="text-[11px] font-mono font-bold text-foreground flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-emerald-500" />
                <span>Enqueue New Task (Sift-Up)</span>
              </span>

              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  placeholder="Task Name (e.g. Sync Database)"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted-foreground">Priority Value:</label>
                    <input
                      type="number"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-muted-foreground">Category:</label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as PQItemCategory)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="kernel">Kernel</option>
                      <option value="normal">Normal</option>
                      <option value="render">Render</option>
                      <option value="io">I/O</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleEnqueue}
                  disabled={!newTaskTitle.trim()}
                  className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Push to Queue O(log n)</span>
                </button>
              </div>
            </div>

            {/* Change Priority Form (Decrease-Key / Increase-Key) */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/30 space-y-3">
              <span className="text-[11px] font-mono font-bold text-foreground flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 text-purple-500" />
                <span>Modify Task Priority (Decrease/Increase Key)</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedTaskToChange}
                  onChange={(e) => {
                    setSelectedTaskToChange(e.target.value);
                    const item = currentItems.find((it) => it.id === e.target.value);
                    if (item) setUpdatedPriorityValue(item.priority);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select Task...</option>
                  {currentItems.map((it) => (
                    <option key={`opt-${it.id}`} value={it.id}>
                      {it.title} ({it.priority})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="New Priority"
                  value={updatedPriorityValue}
                  onChange={(e) => setUpdatedPriorityValue(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handleChangePriority}
                disabled={!selectedTaskToChange}
                className="w-full py-2 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Update Priority O(log n)</span>
              </button>
            </div>

            {/* Clear Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={handleClear}
                className="text-xs font-mono text-muted-foreground hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All Tasks</span>
              </button>
            </div>
          </div>

          {/* Synchronized C++ CodeViewer */}
          <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                <span>C++ PriorityQueue Implementation</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Line: {currentStep?.cppLine || "--"}
              </span>
            </div>

            <CodeViewer
              code={CPP_PRIORITY_QUEUE_CODE}
              activeLineNumber={currentStep?.cppLine ?? null}
              algorithmName="Priority Queue (C++)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
