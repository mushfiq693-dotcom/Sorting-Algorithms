"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  Eye,
  Sliders,
  Flame,
  ShieldCheck,
  Code2,
  RefreshCw,
  Crown,
  ArrowRight,
  Database,
  Link as LinkIcon,
  AlertTriangle,
  FileCode2,
  Info,
  Cpu,
  Boxes,
  Terminal,
  Activity,
} from "lucide-react";

// Memory Cell model for Lipschutz 1-indexed parallel arrays
interface VisualizerState {
  info: (string | null)[];
  link: (number | null)[];
  start: number | null;
  avail: number | null;
  loc: number | null;
  item: string;
  newAllocated: number | null;
  stepIndex: number;
  codeLine: number;
  message: string;
  isOverflow: boolean;
  isCompleted: boolean;
  operationHighlight?: string;
}

interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  initialInfo: (string | null)[];
  initialLink: (number | null)[];
  initialStart: number | null;
  initialAvail: number | null;
  loc: number | null;
  item: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "insert-beginning",
    name: "Insert at Beginning",
    badge: "LOC = NULL (Head)",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    description: "Inserts as the very first node. START pointer updates to point to the newly allocated NEW node.",
    initialInfo: [null, "CAT", "DOG", "ELEPHANT", null, null, null, null, null, null],
    initialLink: [null, 2, 3, null, 5, 6, 7, 8, 9, null], // 1 -> 2 -> 3 -> null. Avail: 4 -> 5 -> 6 -> 7 -> 8 -> 9
    initialStart: 1,
    initialAvail: 4,
    loc: null,
    item: "BAT",
  },
  {
    id: "insert-middle",
    name: "Insert After LOC",
    badge: "LOC = 2 (Middle)",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description: "Inserts item after node at location LOC (index 2). Pointer rewiring: LINK[NEW] := LINK[LOC], LINK[LOC] := NEW.",
    initialInfo: [null, "APPLE", "BANANA", "DATE", null, null, null, null, null, null],
    initialLink: [null, 2, 3, null, 5, 6, 7, 8, 9, null],
    initialStart: 1,
    initialAvail: 4,
    loc: 2,
    item: "CHERRY",
  },
  {
    id: "insert-end",
    name: "Insert at End / Append",
    badge: "LOC = 3 (Tail)",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    description: "Inserts after last node (LINK[3]=NULL). LINK[NEW] becomes NULL and LINK[3] points to NEW.",
    initialInfo: [null, "NODE_A", "NODE_B", "NODE_C", null, null, null, null, null, null],
    initialLink: [null, 2, 3, null, 5, 6, 7, 8, 9, null],
    initialStart: 1,
    initialAvail: 4,
    loc: 3,
    item: "NODE_D",
  },
  {
    id: "overflow",
    name: "Overflow Condition",
    badge: "AVAIL = NULL (Full)",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    description: "Memory pool is completely full (AVAIL = NULL). Step 1 halts execution with an OVERFLOW alert.",
    initialInfo: [null, "ALPHA", "BETA", "GAMMA", "DELTA", "EPSILON", null, null, null, null],
    initialLink: [null, 2, 3, 4, 5, null, null, null, null, null],
    initialStart: 1,
    initialAvail: null, // No free memory cells
    loc: 2,
    item: "ZETA",
  },
];

const ALGORITHM_STEPS = [
  {
    line: 1,
    label: "Step 1: [OVERFLOW?]",
    code: "If AVAIL = NULL, then:\n    Write: OVERFLOW, and Exit.",
    explanation: "Checks if free memory storage is available. If AVAIL is NULL, dynamic allocation halts immediately.",
  },
  {
    line: 2,
    label: "Step 2: [Remove first node from AVAIL list]",
    code: "Set NEW := AVAIL and AVAIL := LINK[AVAIL].",
    explanation: "Allocates the head cell from AVAIL to NEW and advances the AVAIL free list pointer.",
  },
  {
    line: 3,
    label: "Step 3: [Copy new data into node]",
    code: "Set INFO[NEW] := ITEM.",
    explanation: "Copies the payload value ITEM into INFO[NEW] of the newly allocated memory cell.",
  },
  {
    line: 4,
    label: "Step 4: [Pointer Insertion & Relinking]",
    code: "If LOC = NULL, then: [Insert as first node]\n    Set LINK[NEW] := START and START := NEW.\nElse: [Insert after node with location LOC]\n    Set LINK[NEW] := LINK[LOC] and LINK[LOC] := NEW.",
    explanation: "Rewires pointers to splice the NEW node into the linked list chain in O(1) time.",
  },
  {
    line: 5,
    label: "Step 5: [Exit]",
    code: "Exit.",
    explanation: "Insertion completed successfully. All list invariants and memory pool pointers preserved.",
  },
];

export function LinkedListInsLocVisualizer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("insert-beginning");
  const [customItem, setCustomItem] = useState<string>("BAT");
  const [customLoc, setCustomLoc] = useState<number | null>(null);

  // Playback control state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activePreset = PRESET_SCENARIOS.find((p) => p.id === selectedPresetId) || PRESET_SCENARIOS[0];

  // Pre-calculate all deterministic simulation steps
  const simulationSteps = useMemo<VisualizerState[]>(() => {
    const steps: VisualizerState[] = [];
    const infoArr = [...activePreset.initialInfo];
    const linkArr = [...activePreset.initialLink];
    let startPtr = activePreset.initialStart;
    let availPtr = activePreset.initialAvail;
    const locPtr = activePreset.loc;
    const itemVal = customItem || activePreset.item;

    // Initial State (Step 0)
    steps.push({
      info: [...infoArr],
      link: [...linkArr],
      start: startPtr,
      avail: availPtr,
      loc: locPtr,
      item: itemVal,
      newAllocated: null,
      stepIndex: 0,
      codeLine: 1,
      message: `Initial State: START = ${startPtr ?? "NULL"}, AVAIL = ${availPtr ?? "NULL"}, LOC = ${locPtr ?? "NULL"}. Ready to insert "${itemVal}".`,
      isOverflow: false,
      isCompleted: false,
      operationHighlight: "initial",
    });

    // Step 1: Check OVERFLOW
    if (availPtr === null) {
      steps.push({
        info: [...infoArr],
        link: [...linkArr],
        start: startPtr,
        avail: availPtr,
        loc: locPtr,
        item: itemVal,
        newAllocated: null,
        stepIndex: 1,
        codeLine: 1,
        message: "Step 1 [OVERFLOW]: AVAIL is NULL! No free nodes in memory pool. Execution halts with OVERFLOW.",
        isOverflow: true,
        isCompleted: true,
        operationHighlight: "overflow",
      });
      return steps;
    } else {
      steps.push({
        info: [...infoArr],
        link: [...linkArr],
        start: startPtr,
        avail: availPtr,
        loc: locPtr,
        item: itemVal,
        newAllocated: null,
        stepIndex: 1,
        codeLine: 1,
        message: `Step 1 [PASS]: AVAIL = ${availPtr} (≠ NULL). Free storage cell available. Proceeding to allocation.`,
        isOverflow: false,
        isCompleted: false,
        operationHighlight: "avail_check",
      });
    }

    // Step 2: Remove first node from AVAIL list: NEW := AVAIL, AVAIL := LINK[AVAIL]
    const newIndex = availPtr;
    const nextAvail = linkArr[newIndex];
    availPtr = nextAvail;

    steps.push({
      info: [...infoArr],
      link: [...linkArr],
      start: startPtr,
      avail: availPtr,
      loc: locPtr,
      item: itemVal,
      newAllocated: newIndex,
      stepIndex: 2,
      codeLine: 2,
      message: `Step 2: Allocated node NEW := ${newIndex}. Advanced AVAIL := LINK[${newIndex}] (${availPtr ?? "NULL"}).`,
      isOverflow: false,
      isCompleted: false,
      operationHighlight: "allocated",
    });

    // Step 3: Copy new data into node: INFO[NEW] := ITEM
    infoArr[newIndex] = itemVal;

    steps.push({
      info: [...infoArr],
      link: [...linkArr],
      start: startPtr,
      avail: availPtr,
      loc: locPtr,
      item: itemVal,
      newAllocated: newIndex,
      stepIndex: 3,
      codeLine: 3,
      message: `Step 3: Stored data payload: INFO[${newIndex}] := "${itemVal}". Node #${newIndex} is populated.`,
      isOverflow: false,
      isCompleted: false,
      operationHighlight: "info_written",
    });

    // Step 4: Pointer Insertion & Relinking
    if (locPtr === null) {
      // Case A: Insert as first node (LOC = NULL)
      const prevStart = startPtr;
      linkArr[newIndex] = prevStart;
      startPtr = newIndex;

      steps.push({
        info: [...infoArr],
        link: [...linkArr],
        start: startPtr,
        avail: availPtr,
        loc: locPtr,
        item: itemVal,
        newAllocated: newIndex,
        stepIndex: 4,
        codeLine: 4,
        message: `Step 4 (LOC = NULL): Inserted as Head! Set LINK[${newIndex}] := ${prevStart ?? "NULL"}, and START := ${newIndex}.`,
        isOverflow: false,
        isCompleted: false,
        operationHighlight: "head_linked",
      });
    } else {
      // Case B: Insert after node LOC
      const locNext = linkArr[locPtr];
      linkArr[newIndex] = locNext;
      linkArr[locPtr] = newIndex;

      steps.push({
        info: [...infoArr],
        link: [...linkArr],
        start: startPtr,
        avail: availPtr,
        loc: locPtr,
        item: itemVal,
        newAllocated: newIndex,
        stepIndex: 4,
        codeLine: 4,
        message: `Step 4 (LOC = ${locPtr}): Relinked! Set LINK[${newIndex}] := LINK[${locPtr}] (${locNext ?? "NULL"}), and LINK[${locPtr}] := ${newIndex}.`,
        isOverflow: false,
        isCompleted: false,
        operationHighlight: "middle_linked",
      });
    }

    // Step 5: Exit
    steps.push({
      info: [...infoArr],
      link: [...linkArr],
      start: startPtr,
      avail: availPtr,
      loc: locPtr,
      item: itemVal,
      newAllocated: newIndex,
      stepIndex: 5,
      codeLine: 5,
      message: `Step 5 [Complete]: Algorithm 5.5 INSLOC successfully finished in O(1) time complexity!`,
      isOverflow: false,
      isCompleted: true,
      operationHighlight: "completed",
    });

    return steps;
  }, [activePreset, customItem]);

  const currentStep = simulationSteps[Math.min(currentStepIdx, simulationSteps.length - 1)] || simulationSteps[0];

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 1800 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= simulationSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, simulationSteps.length]);

  // Preset changer
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = PRESET_SCENARIOS.find((item) => item.id === presetId);
    if (p) {
      setCustomItem(p.item);
      setCustomLoc(p.loc);
    }
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStepIdx < simulationSteps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  // Traverse logical active list to build nodes array for UI rendering
  const activeChainNodes = useMemo(() => {
    const nodes: { index: number; info: string | null; next: number | null }[] = [];
    const visited = new Set<number>();
    let curr = currentStep.start;

    while (curr !== null && !visited.has(curr) && nodes.length < 10) {
      visited.add(curr);
      nodes.push({
        index: curr,
        info: currentStep.info[curr],
        next: currentStep.link[curr],
      });
      curr = currentStep.link[curr];
    }
    return nodes;
  }, [currentStep]);

  // Traverse free AVAIL chain for UI rendering
  const availChainNodes = useMemo(() => {
    const nodes: { index: number; next: number | null }[] = [];
    const visited = new Set<number>();
    let curr = currentStep.avail;

    while (curr !== null && !visited.has(curr) && nodes.length < 10) {
      visited.add(curr);
      nodes.push({
        index: curr,
        next: currentStep.link[curr],
      });
      curr = currentStep.link[curr];
    }
    return nodes;
  }, [currentStep]);

  const progressPercent = Math.round((currentStepIdx / Math.max(1, simulationSteps.length - 1)) * 100);

  return (
    <div className="rounded-2xl border border-primary/40 bg-card/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl text-foreground font-sans space-y-4 corner-flourish">
      {/* ========================================================================= */}
      {/* 1. TOP COMMAND BAR: TITLE, PRESETS, PLAYBACK CONTROLS & STATUS */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border/70 pb-4">
        {/* Brand / Title & Complexity */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-primary/15 text-primary border border-primary/30">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Algorithm 5.5: INSLOC Interactive Workbench</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                Time: O(1)
              </span>
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Parallel Memory Arrays (<code className="text-primary font-mono font-semibold">INFO</code>, <code className="text-cyan-400 font-mono font-semibold">LINK</code>, <code className="text-emerald-400 font-mono font-semibold">START</code>, <code className="text-purple-400 font-mono font-semibold">AVAIL</code>)
            </p>
          </div>
        </div>

        {/* Global Control Deck (Play, Step, Speed, Reset) */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep.isCompleted && currentStepIdx === simulationSteps.length - 1}
            className="btn-brass px-3.5 py-1.5 rounded-xl text-xs font-bold text-primary-foreground flex items-center gap-1.5 shadow-brass hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-40"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          {/* Step Controls */}
          <div className="flex items-center rounded-xl border border-border bg-secondary/60 p-0.5">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className="p-1.5 rounded-lg hover:bg-secondary text-foreground transition-colors disabled:opacity-30 cursor-pointer"
              title="Previous Step"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <div className="px-2 text-[11px] font-mono font-bold text-muted-foreground border-x border-border/50">
              {currentStepIdx} / {simulationSteps.length - 1}
            </div>
            <button
              onClick={handleNextStep}
              disabled={currentStepIdx === simulationSteps.length - 1}
              className="p-1.5 rounded-lg hover:bg-secondary text-foreground transition-colors disabled:opacity-30 cursor-pointer"
              title="Next Step"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
            title="Restart Simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center rounded-xl border border-border bg-secondary/60 p-0.5 text-[11px] font-mono">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Scenarios Switcher Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1">
          <Sliders className="h-3 w-3 text-primary" />
          Scenario:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary/20 border-primary text-primary shadow-brass-sm font-bold scale-[1.02]"
                    : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <span>{preset.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-bold ${preset.badgeColor}`}>
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Status & Micro-Step Banner */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-secondary/40 border-border/80 text-xs">
        <div className="flex items-center gap-2">
          {currentStep.isOverflow ? (
            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
          ) : currentStep.isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : (
            <Activity className="h-4 w-4 text-primary shrink-0 animate-pulse" />
          )}
          <span className="font-sans text-foreground leading-snug">
            <strong className="text-primary font-mono mr-1.5">
              Step {currentStep.stepIndex} of {simulationSteps.length - 1}:
            </strong>
            {currentStep.message}
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-muted-foreground shrink-0">
          <span>{progressPercent}%</span>
          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE: INTEGRATED SIDE-BY-SIDE DUAL DECK */}
      {/* Left Deck: Algorithm Pseudocode & Pointer State Registers */}
      {/* Right Deck: Parallel Memory Arrays Table & Live Graph Chain */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ===================================================================== */}
        {/* LEFT DECK (5 Cols): ALGORITHM CODE TRACER & REGISTER CARDS */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
          {/* Algorithm Code Execution Card */}
          <div className="rounded-xl border border-[#4A3F35] bg-[#14100D] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#4A3F35] bg-[#1C1714] text-xs font-mono">
              <span className="flex items-center gap-1.5 text-primary font-bold">
                <FileCode2 className="h-3.5 w-3.5 text-primary" />
                <span>Textbook Algorithm 5.5 INSLOC</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold">
                Active Line: #{currentStep.codeLine}
              </span>
            </div>

            <div className="p-2.5 space-y-1.5 font-mono text-xs">
              {ALGORITHM_STEPS.map((step) => {
                const isCurrent = currentStep.codeLine === step.line;
                return (
                  <div
                    key={step.line}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isCurrent
                        ? "bg-primary/25 border-l-4 border-primary text-white font-bold shadow-brass-sm"
                        : "text-slate-400 hover:text-slate-300 hover:bg-white/5 opacity-85"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold ${isCurrent ? "text-amber-400" : "text-slate-500"}`}>
                            {step.label}
                          </span>
                        </div>
                        <pre className="text-[11px] font-mono whitespace-pre-wrap leading-tight overflow-x-auto text-slate-200">
                          {step.code}
                        </pre>
                      </div>

                      {isCurrent && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-extrabold uppercase animate-pulse">
                          Running
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pointer State Registers */}
          <div className="rounded-xl border border-border bg-card/80 p-3 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                Live Pointer &amp; Variable Registers:
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Lipschutz State</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 font-mono text-xs">
              {/* START Register */}
              <div className="p-2 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">START:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentStep.start !== null ? currentStep.start : "NULL"}
                </span>
              </div>

              {/* AVAIL Register */}
              <div className="p-2 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">AVAIL:</span>
                <span className={`px-2 py-0.5 rounded border font-bold ${
                  currentStep.avail !== null
                    ? "bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-300"
                    : "bg-rose-500/15 border-rose-500/30 text-rose-500"
                }`}>
                  {currentStep.avail !== null ? currentStep.avail : "NULL"}
                </span>
              </div>

              {/* LOC Register */}
              <div className="p-2 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">LOC:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold">
                  {currentStep.loc !== null ? currentStep.loc : "NULL"}
                </span>
              </div>

              {/* NEW Allocated Register */}
              <div className="p-2 rounded-lg border border-border bg-secondary/30 flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">NEW:</span>
                <span className={`px-2 py-0.5 rounded border font-bold ${
                  currentStep.newAllocated !== null
                    ? "bg-primary/25 border-primary text-primary"
                    : "bg-secondary text-muted-foreground border-border"
                }`}>
                  {currentStep.newAllocated !== null ? `#${currentStep.newAllocated}` : "None"}
                </span>
              </div>
            </div>

            {/* Target ITEM Payload */}
            <div className="p-2 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-primary" />
                <span>ITEM Payload to Insert:</span>
              </span>
              <span className="px-2.5 py-0.5 rounded bg-primary text-primary-foreground font-bold text-xs">
                &quot;{currentStep.item}&quot;
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT DECK (7 Cols): PARALLEL MEMORY ARRAYS & DYNAMIC LIST GRAPH */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Primary Visual Representation: Parallel Memory Arrays (INFO & LINK) */}
          <div className="rounded-xl border border-border bg-card/80 p-3.5 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-primary" />
                Parallel Memory Array Representation (Indices 1 to 9):
              </span>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-500 inline-block" /> AVAIL
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary inline-block" /> NEW
                </span>
              </div>
            </div>

            {/* Memory Grid Table (Lipschutz format with pointers) */}
            <div className="overflow-x-auto rounded-xl border border-[#4A3F35] bg-[#14100D] p-2.5 shadow-inner">
              <div className="min-w-[580px] grid grid-cols-10 gap-1.5 font-mono text-center">
                {/* Header Column */}
                <div className="flex flex-col gap-1 text-[11px] font-bold text-muted-foreground">
                  <div className="h-6 flex items-center justify-center">Index</div>
                  <div className="h-9 flex items-center justify-center rounded bg-[#1C1714] border border-[#4A3F35]/60 text-[#D4B872]">
                    INFO
                  </div>
                  <div className="h-9 flex items-center justify-center rounded bg-[#1C1714] border border-[#4A3F35]/60 text-cyan-400">
                    LINK
                  </div>
                </div>

                {/* Cells 1 to 9 */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
                  const val = currentStep.info[idx];
                  const nextPtr = currentStep.link[idx];
                  const isNew = currentStep.newAllocated === idx;
                  const isLoc = currentStep.loc === idx;
                  const isStart = currentStep.start === idx;
                  const isAvailHead = currentStep.avail === idx;

                  let cellBorder = "border-[#3D332A]";
                  let cellBg = "bg-[#181310]";
                  let tag = null;
                  let tagClass = "bg-card border-border text-muted-foreground";

                  if (isNew) {
                    cellBorder = "border-primary ring-2 ring-primary/50 shadow-brass-sm";
                    cellBg = "bg-primary/20";
                    tag = "NEW";
                    tagClass = "bg-primary text-primary-foreground border-primary";
                  } else if (isLoc) {
                    cellBorder = "border-cyan-400 ring-2 ring-cyan-400/40";
                    cellBg = "bg-cyan-500/15";
                    tag = "LOC";
                    tagClass = "bg-cyan-500 text-white border-cyan-400";
                  } else if (isStart) {
                    tag = "START";
                    tagClass = "bg-emerald-600 text-white border-emerald-500";
                  } else if (isAvailHead) {
                    tag = "AVAIL";
                    tagClass = "bg-purple-600 text-white border-purple-500";
                  }

                  return (
                    <div key={idx} className="flex flex-col gap-1 text-xs">
                      {/* Index Header with Tag */}
                      <div className="h-6 flex items-center justify-center text-[11px] text-slate-400 font-bold relative">
                        <span>{idx}</span>
                        {tag && (
                          <span
                            className={`absolute -top-2.5 px-1 py-0.2 rounded text-[8px] font-extrabold uppercase border shadow-xs ${tagClass}`}
                          >
                            {tag}
                          </span>
                        )}
                      </div>

                      {/* INFO[k] Value */}
                      <div
                        className={`h-9 flex items-center justify-center rounded-lg border font-bold transition-all text-xs ${cellBorder} ${cellBg} ${
                          val ? "text-white" : "text-slate-600 italic"
                        }`}
                      >
                        {val !== null && val !== undefined ? val : "—"}
                      </div>

                      {/* LINK[k] Pointer */}
                      <div
                        className={`h-9 flex items-center justify-center rounded-lg border border-[#3D332A] bg-[#181310] font-bold text-xs text-cyan-300 transition-all ${
                          nextPtr === null ? "text-rose-400" : ""
                        }`}
                      >
                        {nextPtr !== null && nextPtr !== undefined ? nextPtr : "0 (NULL)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Logical Chains: Active List Graph + Free Storage AVAIL Pool */}
          <div className="grid grid-cols-1 gap-3">
            {/* Box A: Active Linked List Chain */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2 shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Logical Active Linked List Chain:
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {activeChainNodes.length} nodes in list
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 py-1 min-h-[44px]">
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/40">
                  START ({currentStep.start ?? "NULL"})
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />

                {activeChainNodes.length === 0 ? (
                  <span className="text-xs text-muted-foreground font-mono italic">Empty List (NULL)</span>
                ) : (
                  activeChainNodes.map((node, i) => {
                    const isNew = currentStep.newAllocated === node.index;
                    const isLoc = currentStep.loc === node.index;

                    return (
                      <React.Fragment key={node.index}>
                        <div
                          className={`flex items-center rounded-lg border px-2 py-1 text-xs font-mono font-bold shadow-xs transition-all ${
                            isNew
                              ? "bg-primary/30 border-primary text-primary-foreground animate-pulse ring-2 ring-primary"
                              : isLoc
                              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                              : "bg-secondary/70 border-border text-foreground"
                          }`}
                        >
                          <span className="text-[9px] text-muted-foreground mr-1">#{node.index}:</span>
                          <span>{node.info}</span>
                        </div>

                        {i < activeChainNodes.length - 1 ? (
                          <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        ) : (
                          <>
                            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold">
                              NULL
                            </span>
                          </>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </div>

            {/* Box B: Free Storage AVAIL Pool Chain */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3 space-y-2 shadow-xs">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-1.5">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  Free Storage Pool (AVAIL List):
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {availChainNodes.length} free cells remaining
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 py-1 min-h-[44px]">
                <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/40">
                  AVAIL ({currentStep.avail ?? "NULL"})
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />

                {availChainNodes.length === 0 ? (
                  <span className="text-xs text-rose-400 font-mono font-bold">NULL (Memory Pool Full!)</span>
                ) : (
                  availChainNodes.slice(0, 6).map((node, i) => (
                    <React.Fragment key={node.index}>
                      <div className="flex items-center rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs font-mono text-purple-300">
                        <span>#{node.index}</span>
                      </div>
                      {i < Math.min(availChainNodes.length - 1, 5) && (
                        <ArrowRight className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                      )}
                    </React.Fragment>
                  ))
                )}
                {availChainNodes.length > 6 && (
                  <span className="text-[10px] font-mono text-muted-foreground">+{availChainNodes.length - 6} more</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
