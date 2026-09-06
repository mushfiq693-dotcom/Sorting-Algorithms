"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import confetti from "canvas-confetti";
import {
  createInitialList,
  getOrderedNodes,
  insertAtHead,
  insertAtTail,
  insertAtPosition,
  deleteValue,
  searchList,
  LinkedListState,
  LinkedListNode,
  LinkedListStep,
  OperationType,
  OPERATION_CODE_SNIPPETS,
  OPERATION_COMPLEXITY_INFO,
} from "@/algorithms/linkedList";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  PlusCircle,
  Trash2,
  Search,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Clock,
  Zap,
  Cpu,
  Code2,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ============================================================================
// MEMOIZED LOGICAL NODE COMPONENT
// Renders individual node in the Logical View with high performance
// ============================================================================
interface LogicalNodeProps {
  node: LinkedListNode;
  index: number;
  isHead: boolean;
  isActive: boolean;
  isTarget: boolean;
  isPredecessor: boolean;
  isBypassed: boolean;
  isPointerModified: boolean;
  targetAddress: string | null;
  prefersReducedMotion: boolean;
}

const LogicalNode = memo(function LogicalNode({
  node,
  index,
  isHead,
  isActive,
  isTarget,
  isPredecessor,
  isBypassed,
  isPointerModified,
  targetAddress,
  prefersReducedMotion,
}: LogicalNodeProps) {
  // Compute state-driven highlight styling
  let containerStyle = "border-[#4A3F35] bg-[#1C1714]/90 text-[#E8DFD4]";
  let pulseClass = "";

  if (isBypassed) {
    containerStyle = "border-rose-500/80 bg-rose-950/30 text-rose-200 opacity-60 line-through ring-2 ring-rose-500/30";
  } else if (isTarget) {
    containerStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-100 ring-4 ring-emerald-500/30";
    if (!prefersReducedMotion) pulseClass = "animate-pulse";
  } else if (isActive) {
    containerStyle = "border-[#C9A962] bg-[#2A221B] text-[#FFF] ring-2 ring-[#C9A962]/50";
    if (!prefersReducedMotion) pulseClass = "animate-pulse";
  } else if (isPredecessor) {
    containerStyle = "border-cyan-500/70 bg-cyan-950/30 text-cyan-200 ring-1 ring-cyan-500/30";
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 transition-transform duration-300 shrink-0 ${pulseClass}`}>
      {/* Node Card Box: [ Node # & Hex | DATA | NEXT ] */}
      <div
        className={`flex flex-col rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 w-32 sm:w-36 ${containerStyle}`}
      >
        {/* Top Header: Node # and Hex Address */}
        <div className="flex items-center justify-between px-2.5 py-1 border-b border-[#4A3F35]/70 bg-[#14100D]/80 text-[10px] font-mono">
          <span className="text-[#C9A962] font-semibold">Node #{index + 1}</span>
          <span className="font-bold text-cyan-400 font-mono tracking-wider">{node.address}</span>
        </div>

        {/* Interior Compartments: DATA + NEXT */}
        <div className="flex items-stretch h-16 divide-x divide-[#4A3F35]/60 bg-[#1C1714]/40">
          {/* DATA Compartment */}
          <div className="flex-1 flex flex-col items-center justify-center p-1.5 bg-[#14100D]/30">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
              DATA
            </span>
            <span className="font-mono text-base sm:text-lg font-black text-foreground">
              {node.val}
            </span>
          </div>

          {/* NEXT Compartment */}
          <div
            className={`w-14 sm:w-16 flex flex-col items-center justify-center p-1 transition-colors ${
              isPointerModified
                ? "bg-[#C9A962]/20 text-[#C9A962] ring-1 ring-[#C9A962] font-bold"
                : "bg-[#14100D]/60 text-muted-foreground"
            }`}
          >
            <span className="text-[8px] font-mono uppercase tracking-wider">NEXT</span>
            <span className="font-mono text-[10px] font-bold truncate max-w-[52px] text-cyan-400">
              {isPointerModified && targetAddress
                ? targetAddress
                : node.nextId
                ? `•→`
                : `NULL`}
            </span>
          </div>
        </div>

        {/* Footer Address Note for NEXT */}
        <div className="px-2 py-0.5 border-t border-[#4A3F35]/40 bg-[#14100D]/40 text-[9px] font-mono text-center truncate">
          {isPointerModified && targetAddress ? (
            <span className="text-[#C9A962] font-semibold animate-pulse">→ {targetAddress}</span>
          ) : (
            <span className="text-muted-foreground">{node.nextId ? `points to next` : `end of list`}</span>
          )}
        </div>
      </div>

      {/* Pointer Arrow to Next Node */}
      <div className="flex flex-col items-center justify-center shrink-0">
        <span
          className={`font-mono font-black text-lg select-none px-1 transition-all ${
            isPointerModified
              ? "text-[#C9A962] scale-125"
              : isBypassed
              ? "text-rose-400/50"
              : "text-cyan-500"
          }`}
        >
          {isPointerModified ? "══►" : "──►"}
        </span>
      </div>
    </div>
  );
});

// ============================================================================
// MEMOIZED MEMORY HEAP OBJECT COMPONENT
// Renders each node as an independent heap allocation with explicit address
// ============================================================================
interface MemoryNodeProps {
  node: LinkedListNode;
  index: number;
  isHead: boolean;
  isActive: boolean;
  isTarget: boolean;
  isPredecessor: boolean;
  isBypassed: boolean;
  isPointerModified: boolean;
  targetAddress: string | null;
  nextNodeAddress: string | null;
  prefersReducedMotion: boolean;
}

const MemoryNode = memo(function MemoryNode({
  node,
  index,
  isHead,
  isActive,
  isTarget,
  isPredecessor,
  isBypassed,
  isPointerModified,
  targetAddress,
  nextNodeAddress,
  prefersReducedMotion,
}: MemoryNodeProps) {
  let borderClass = "border-[#4A3F35] bg-[#1C1714]";
  if (isBypassed) {
    borderClass = "border-rose-500 bg-rose-950/30 text-rose-200 line-through opacity-60";
  } else if (isTarget) {
    borderClass = "border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/40";
  } else if (isActive) {
    borderClass = "border-[#C9A962] bg-[#2A221B] ring-2 ring-[#C9A962]/40";
  } else if (isPredecessor) {
    borderClass = "border-cyan-500/70 bg-cyan-950/30";
  }

  return (
    <div className="flex flex-col items-start gap-1.5 shrink-0 transition-transform duration-300">
      {/* Heap Memory Header Badge */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono">
        <span className="px-2 py-0.5 rounded bg-[#14100D] border border-[#4A3F35] text-cyan-400 font-bold shadow-xs">
          Heap: {node.address}
        </span>
        {isHead && (
          <span className="px-1.5 py-0.5 rounded bg-[#C9A962]/20 border border-[#C9A962]/40 text-[#C9A962] text-[9px] font-bold">
            HEAD
          </span>
        )}
      </div>

      {/* Heap Object Block */}
      <div className={`rounded-2xl border p-3 w-40 sm:w-44 shadow-lg space-y-2.5 ${borderClass}`}>
        {/* Header line */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pb-1.5 border-b border-[#4A3F35]/50">
          <span>struct Node</span>
          <span className="text-[#C9A962]">Node #{index + 1}</span>
        </div>

        {/* Fields list: DATA & NEXT */}
        <div className="space-y-1.5 text-xs font-mono">
          {/* DATA Field */}
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#14100D] border border-[#4A3F35]/40">
            <span className="text-muted-foreground text-[10px]">int data:</span>
            <span className="font-bold text-foreground text-sm">{node.val}</span>
          </div>

          {/* NEXT Field */}
          <div
            className={`flex items-center justify-between p-1.5 rounded-lg border transition-colors ${
              isPointerModified
                ? "bg-[#C9A962]/20 border-[#C9A962] text-[#C9A962]"
                : "bg-[#14100D] border-[#4A3F35]/40 text-cyan-400"
            }`}
          >
            <span className="text-muted-foreground text-[10px]">Node* next:</span>
            <span className="font-bold font-mono text-[11px]">
              {isPointerModified && targetAddress
                ? targetAddress
                : nextNodeAddress
                ? nextNodeAddress
                : "nullptr"}
            </span>
          </div>
        </div>

        {/* Pointer Directional Connector */}
        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-muted-foreground">
          <span>Dereference:</span>
          <span className="text-cyan-400 font-bold">
            {isPointerModified && targetAddress
              ? `*(${targetAddress})`
              : nextNodeAddress
              ? `*(${nextNodeAddress})`
              : "0x0000"}
          </span>
        </div>
      </div>

      {/* Arrow linking this heap object to next heap object */}
      <div className="w-full flex items-center justify-center py-0.5 text-cyan-500 font-mono text-xs">
        {nextNodeAddress ? `↓ NEXT: ${nextNodeAddress}` : `↓ NEXT: nullptr`}
      </div>
    </div>
  );
});

// ============================================================================
// MAIN LINKED LIST VISUALIZER COMPONENT
// ============================================================================
export function LinkedListVisualizer() {
  // 1. Fundamental State
  const [listState, setListState] = useState<LinkedListState>(() => createInitialList([14, 28, 42, 60]));
  const [baseSnapshot, setBaseSnapshot] = useState<LinkedListState>(() => listState);
  const [inputValue, setInputValue] = useState<string>("75");
  const [inputPosition, setInputPosition] = useState<string>("2");
  const [positionError, setPositionError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"logical" | "memory">("logical");
  const [activeOperation, setActiveOperation] = useState<OperationType>("init");
  const [showCodeSnippet, setShowCodeSnippet] = useState<boolean>(true);

  // 2. Playback State Machine
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(850); // ms per step

  const prefersReducedMotion = useReducedMotion();

  // Active step derived state
  const currentStep = steps[currentStepIndex] || null;
  const isOperationActive = steps.length > 0;
  const isOperationComplete = isOperationActive && currentStepIndex === steps.length - 1;

  // Visualized state: if an operation step is active, show the step's state snapshot; else listState
  const displayedState = currentStep ? currentStep.state : listState;
  const orderedNodes = useMemo(() => getOrderedNodes(displayedState), [displayedState]);

  // Derived metadata from currentStep
  const stagedNode = currentStep ? currentStep.stagedNode : null;
  const activeNodeId = currentStep ? currentStep.activeNodeId : null;
  const targetNodeId = currentStep ? currentStep.targetNodeId : null;
  const predecessorNodeId = currentStep ? currentStep.predecessorNodeId : null;
  const bypassedNodeId = currentStep ? currentStep.bypassedNodeId : null;
  const modifiedPointer = currentStep ? currentStep.modifiedPointer : null;
  const pointerSourceAddress = currentStep ? currentStep.pointerSourceAddress : null;
  const pointerTargetAddress = currentStep ? currentStep.pointerTargetAddress : null;
  const subStepLabel = currentStep ? currentStep.subStepLabel : "";
  const description = currentStep
    ? currentStep.description
    : "Singly Linked List initialized. Select an operation above to simulate pointer mutations step-by-step.";
  const codeSnippetKey = currentStep ? currentStep.codeSnippetKey : "insertAtHead";
  const codeLine = currentStep ? currentStep.codeLine : null;
  const searchStats = currentStep?.stats || null;

  // Active complexity info
  const complexityInfo = OPERATION_COMPLEXITY_INFO[activeOperation] || OPERATION_COMPLEXITY_INFO["init"];

  // 3. Auto-Playback Loop (Play / Pause / Next)
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      setListState(steps[steps.length - 1].state);
      if (steps[steps.length - 1].stats?.found) {
        confetti({ particleCount: 55, spread: 60, origin: { y: 0.6 } });
      }
      return;
    }

    const delay = prefersReducedMotion ? 120 : playbackSpeed;
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, playbackSpeed, prefersReducedMotion]);

  // Helper to initiate a new operation with granular steps
  const startOperation = useCallback(
    (op: OperationType, generatedSteps: LinkedListStep[], finalState: LinkedListState) => {
      setBaseSnapshot(listState);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setActiveOperation(op);
      setIsPlaying(true);
    },
    [listState]
  );

  // Playback Controls
  const handlePlay = useCallback(() => {
    if (steps.length === 0) return;
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [steps.length, currentStepIndex]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    if (steps.length === 0) return;
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (nextIdx === steps.length - 1) {
        setListState(steps[nextIdx].state);
        if (steps[nextIdx].stats?.found) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
      }
    }
  }, [steps, currentStepIndex]);

  const handleStepBackward = useCallback(() => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const handleResetOperation = useCallback(() => {
    setIsPlaying(false);
    setListState(baseSnapshot);
    setSteps([]);
    setCurrentStepIndex(0);
    setActiveOperation("init");
  }, [baseSnapshot]);

  const handleGlobalReset = useCallback(() => {
    setIsPlaying(false);
    const initial = createInitialList([14, 28, 42, 60]);
    setListState(initial);
    setBaseSnapshot(initial);
    setSteps([]);
    setCurrentStepIndex(0);
    setActiveOperation("reset");
  }, []);

  const handleClear = useCallback(() => {
    setIsPlaying(false);
    const empty: LinkedListState = { nodes: {}, headId: null, count: 0 };
    setListState(empty);
    setBaseSnapshot(empty);
    setSteps([]);
    setCurrentStepIndex(0);
    setActiveOperation("clear");
  }, []);

  // Operation Handlers
  const handleInsertAtHead = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    if (orderedNodes.length >= 8) {
      alert("Maximum display limit reached (8 nodes). Delete a node first.");
      return;
    }
    const { newState, steps: opSteps } = insertAtHead(listState, val);
    startOperation("insert-head", opSteps, newState);
  };

  const handleInsertAtTail = () => {
    setPositionError(null);
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    if (orderedNodes.length >= 8) {
      alert("Maximum display limit reached (8 nodes). Delete a node first.");
      return;
    }
    const { newState, steps: opSteps } = insertAtTail(listState, val);
    startOperation("insert-tail", opSteps, newState);
  };

  const handleInsertAtPosition = () => {
    setPositionError(null);
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;

    const pos = parseInt(inputPosition, 10);
    if (isNaN(pos)) {
      setPositionError("Please enter a valid numeric position.");
      return;
    }

    if (pos < 0) {
      setPositionError(`Position ${pos} is invalid. Position cannot be negative.`);
      return;
    }

    if (orderedNodes.length >= 8) {
      alert("Maximum display limit reached (8 nodes). Delete a node first.");
      return;
    }

    if (pos > orderedNodes.length) {
      setPositionError(
        `Position ${pos} is out of range — this list only has ${orderedNodes.length} node(s) (valid positions: 0 to ${orderedNodes.length}).`
      );
      return;
    }

    const { newState, steps: opSteps, success, error } = insertAtPosition(listState, val, pos);
    if (!success && error) {
      setPositionError(error);
      return;
    }

    startOperation("insert-position", opSteps, newState);
  };

  const handleDelete = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    const { newState, steps: opSteps } = deleteValue(listState, val);
    startOperation("delete", opSteps, newState);
  };

  const handleSearch = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    const { steps: opSteps } = searchList(listState, val);
    startOperation("search", opSteps, listState);
  };

  // Telemetry Addresses for Pointer State Panel
  const headAddress = displayedState.headId ? displayedState.nodes[displayedState.headId]?.address : "nullptr";
  const activeNode = activeNodeId ? displayedState.nodes[activeNodeId] : null;
  const currentAddress = activeNode
    ? activeNode.address
    : stagedNode && activeNodeId === stagedNode.id
    ? stagedNode.address
    : "-";
  const nextAddress = activeNode
    ? activeNode.nextId
      ? displayedState.nodes[activeNode.nextId]?.address || "nullptr"
      : "nullptr"
    : stagedNode && stagedNode.nextId
    ? displayedState.nodes[stagedNode.nextId]?.address || "nullptr"
    : "-";
  const prevAddress = predecessorNodeId && displayedState.nodes[predecessorNodeId]
    ? displayedState.nodes[predecessorNodeId].address
    : "-";
  const stagedAddress = stagedNode ? `${stagedNode.address} (val: ${stagedNode.val})` : "-";

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#4A3F35] bg-[#14100D] p-4 sm:p-7 text-[#E8DFD4] shadow-2xl backdrop-blur-xl corner-flourish">
      {/* 1. Header Bar with Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#4A3F35]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#C9A962]/15 border border-[#C9A962]/30 flex items-center justify-center text-[#C9A962] shadow-sm">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#E8DFD4] font-serif flex items-center gap-2">
              <span>Linked List Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C9A962]/15 text-[#C9A962] border border-[#C9A962]/30 font-semibold uppercase tracking-wider">
                Interactive Simulator
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Explore dynamic heap nodes, persistent memory addresses, and pointer rewirings in real time.
            </p>
          </div>
        </div>

        {/* View Mode Toggle: [ Logical View ] [ Memory View ] */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl p-1 bg-[#1C1714] border border-[#4A3F35] shadow-inner text-xs font-mono">
            <button
              onClick={() => setViewMode("logical")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "logical"
                  ? "bg-[#C9A962] text-[#14100D] shadow-sm font-bold"
                  : "text-muted-foreground hover:text-[#E8DFD4]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Logical View</span>
            </button>
            <button
              onClick={() => setViewMode("memory")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "memory"
                  ? "bg-[#C9A962] text-[#14100D] shadow-sm font-bold"
                  : "text-muted-foreground hover:text-[#E8DFD4]"
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Memory View</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls & Value Input Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-[#4A3F35] bg-[#1C1714]/80 text-xs">
        {/* Node Value & Position Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-foreground">Value:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isPlaying}
              className="w-16 px-2 py-1 rounded-lg border border-[#4A3F35] bg-[#14100D] font-mono text-xs font-bold text-foreground text-center focus:outline-none focus:ring-1 focus:ring-[#C9A962]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-foreground">Pos (0..{orderedNodes.length}):</span>
            <input
              type="number"
              value={inputPosition}
              onChange={(e) => {
                setInputPosition(e.target.value);
                if (positionError) setPositionError(null);
              }}
              disabled={isPlaying}
              className="w-14 px-2 py-1 rounded-lg border border-[#4A3F35] bg-[#14100D] font-mono text-xs font-bold text-foreground text-center focus:outline-none focus:ring-1 focus:ring-[#C9A962]"
              min={0}
              max={orderedNodes.length}
            />
          </div>
        </div>

        {/* Operation Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleInsertAtHead}
            disabled={isPlaying}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 disabled:opacity-40 transition-all active:scale-95 shadow-sm cursor-pointer"
            title="Prepend new node before HEAD: strictly O(1) time"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Insert at Head (O(1))</span>
          </button>

          <button
            onClick={handleInsertAtPosition}
            disabled={isPlaying}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#C9A962]/50 bg-[#C9A962]/15 text-[#C9A962] font-bold text-xs hover:bg-[#C9A962]/25 disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            title="Two-pointer insertion at chosen position (0-indexed)"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Insert at Pos</span>
          </button>

          <button
            onClick={handleInsertAtTail}
            disabled={isPlaying}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#4A3F35] bg-[#251E19] text-[#E8DFD4] font-semibold text-xs hover:border-[#C9A962] hover:text-[#C9A962] disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            title="Traverse pointer chain to append: O(n) time"
          >
            <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
            <span>Insert at Tail (O(n))</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={isPlaying || orderedNodes.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-semibold text-xs hover:bg-rose-500/20 disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            title="Find and splice out target node: O(n) time"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Value</span>
          </button>

          <button
            onClick={handleSearch}
            disabled={isPlaying || orderedNodes.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-semibold text-xs hover:bg-cyan-500/20 disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            title="Sequential pointer traversal from head: O(n) time"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
          </button>

          {/* Reset All to 4 Default Nodes */}
          <button
            onClick={handleGlobalReset}
            disabled={isPlaying}
            className="p-1.5 rounded-xl border border-[#4A3F35] bg-[#14100D] text-muted-foreground hover:text-[#C9A962] hover:border-[#C9A962] disabled:opacity-40 transition-colors cursor-pointer"
            title="Reset to 4 default nodes"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Inline Position Validation Error Banner */}
      {positionError && (
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 font-mono text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{positionError}</span>
          </div>
          <button
            onClick={() => setPositionError(null)}
            className="text-muted-foreground hover:text-rose-200 text-[10px] uppercase font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Step Playback Control Bar (Play, Pause, Step Forward, Step Backward, Reset) */}
      {isOperationActive && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-[#C9A962]/40 bg-[#1C1714] text-xs animate-in fade-in">
          {/* Status Text / Step Index */}
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#C9A962]/20 border border-[#C9A962]/40 text-[#C9A962] font-mono font-bold text-xs">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="font-mono text-xs text-[#E8DFD4] font-semibold truncate max-w-xs sm:max-w-md">
              {subStepLabel}
            </span>
          </div>

          {/* Playback Buttons */}
          <div className="flex items-center gap-2 font-mono">
            {/* Step Backward */}
            <button
              onClick={handleStepBackward}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg border border-[#4A3F35] bg-[#14100D] text-[#E8DFD4] hover:border-[#C9A962] disabled:opacity-40 transition-all cursor-pointer"
              title="Previous Step"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>

            {/* Play / Pause Toggle */}
            {isPlaying ? (
              <button
                onClick={handlePause}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A962] text-[#14100D] font-bold text-xs hover:bg-[#D4B872] transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{currentStepIndex >= steps.length - 1 ? "Replay" : "Play"}</span>
              </button>
            )}

            {/* Step Forward */}
            <button
              onClick={handleStepForward}
              disabled={currentStepIndex >= steps.length - 1}
              className="p-1.5 rounded-lg border border-[#4A3F35] bg-[#14100D] text-[#E8DFD4] hover:border-[#C9A962] disabled:opacity-40 transition-all cursor-pointer"
              title="Next Step Forward"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>

            {/* Reset Operation State */}
            <button
              onClick={handleResetOperation}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#4A3F35] bg-[#14100D] text-muted-foreground hover:text-foreground hover:border-[#C9A962] transition-all cursor-pointer"
              title="Reset to state before operation started"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Op</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Live Pointer State Panel (Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 rounded-xl border border-[#4A3F35] bg-[#1C1714]/60 font-mono text-[11px]">
        {/* HEAD */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#14100D] border border-[#4A3F35]/40">
          <span className="text-muted-foreground text-[10px] uppercase">HEAD</span>
          <span className="font-bold text-cyan-400 truncate max-w-full">{headAddress}</span>
        </div>

        {/* CURRENT */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#14100D] border border-[#4A3F35]/40">
          <span className="text-muted-foreground text-[10px] uppercase">CURRENT</span>
          <span className={`font-bold truncate max-w-full ${currentAddress !== "-" ? "text-[#C9A962]" : "text-muted-foreground"}`}>
            {currentAddress}
          </span>
        </div>

        {/* NEXT */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#14100D] border border-[#4A3F35]/40">
          <span className="text-muted-foreground text-[10px] uppercase">NEXT</span>
          <span className={`font-bold truncate max-w-full ${nextAddress !== "-" ? "text-cyan-400" : "text-muted-foreground"}`}>
            {nextAddress}
          </span>
        </div>

        {/* NEW_NODE */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#14100D] border border-[#4A3F35]/40">
          <span className="text-muted-foreground text-[10px] uppercase">NEW_NODE</span>
          <span className={`font-bold truncate max-w-full ${stagedAddress !== "-" ? "text-emerald-400" : "text-muted-foreground"}`}>
            {stagedAddress}
          </span>
        </div>

        {/* PREV */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-2 rounded-lg bg-[#14100D] border border-[#4A3F35]/40">
          <span className="text-muted-foreground text-[10px] uppercase">PREV</span>
          <span className={`font-bold truncate max-w-full ${prevAddress !== "-" ? "text-amber-400" : "text-muted-foreground"}`}>
            {prevAddress}
          </span>
        </div>
      </div>

      {/* 5. Main Visualization Stage: [ Logical View ] or [ Memory View ] */}
      <div className="min-h-[220px] rounded-2xl border border-[#4A3F35] bg-[#14100D]/90 p-5 flex flex-col justify-center overflow-x-auto shadow-inner select-none space-y-4">
        {/* Staged New Node (if currently allocating before linking) */}
        {stagedNode && (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#C9A962] bg-[#251E19]/80 w-fit animate-in fade-in">
            <span className="px-2 py-1 rounded bg-[#C9A962]/20 border border-[#C9A962]/40 text-[#C9A962] font-mono text-[10px] font-bold">
              ALLOCATING NEW NODE
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-muted-foreground">Address:</span>
              <span className="text-cyan-400 font-bold">{stagedNode.address}</span>
              <span className="text-muted-foreground pl-2">DATA:</span>
              <span className="font-bold text-foreground">{stagedNode.val}</span>
              <span className="text-muted-foreground pl-2">NEXT:</span>
              <span className="text-amber-400 font-bold">
                {stagedNode.nextId ? displayedState.nodes[stagedNode.nextId]?.address || "head" : "nullptr"}
              </span>
            </div>
            {modifiedPointer === "staged.next" && (
              <span className="text-[#C9A962] font-mono text-xs font-bold animate-pulse">
                ──► Linking to HEAD ({pointerTargetAddress})
              </span>
            )}
          </div>
        )}

        {/* Empty List Fallback */}
        {orderedNodes.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-muted-foreground text-xs font-mono py-10 space-y-2">
            <span className="text-cyan-400 font-bold text-sm">HEAD == nullptr</span>
            <span>The linked list is currently empty. Use &quot;Insert at Head&quot; or &quot;Insert at Tail&quot; above to allocate nodes.</span>
          </div>
        ) : viewMode === "logical" ? (
          /* ==================== LOGICAL VIEW ==================== */
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 py-2">
            {/* Persistent HEAD Pointer Label */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className="px-2.5 py-1 rounded-xl bg-[#C9A962]/20 border border-[#C9A962]/40 text-[#C9A962] font-mono text-[11px] font-extrabold tracking-wider shadow-sm">
                HEAD
              </span>
              <span className="text-cyan-400 text-xs font-mono font-bold truncate max-w-[65px]">
                {headAddress}
              </span>
              <span className="text-[#C9A962] text-base font-mono font-bold">↓</span>
            </div>

            {/* Render Horizontal Node Chain */}
            {orderedNodes.map((node, index) => {
              const isHead = index === 0;
              const isActive = activeNodeId === node.id;
              const isTarget = targetNodeId === node.id;
              const isPredecessor = predecessorNodeId === node.id;
              const isBypassed = bypassedNodeId === node.id;
              const isPointerModified = modifiedPointer === "next" && pointerSourceAddress === node.address;

              return (
                <LogicalNode
                  key={node.id}
                  node={node}
                  index={index}
                  isHead={isHead}
                  isActive={isActive}
                  isTarget={isTarget}
                  isPredecessor={isPredecessor}
                  isBypassed={isBypassed}
                  isPointerModified={isPointerModified}
                  targetAddress={pointerTargetAddress}
                  prefersReducedMotion={prefersReducedMotion}
                />
              );
            })}

            {/* Terminal nullptr Box */}
            <div className="flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-[#4A3F35] bg-[#1C1714] text-muted-foreground font-mono text-xs font-bold shadow-xs shrink-0">
              nullptr
            </div>
          </div>
        ) : (
          /* ==================== MEMORY VIEW ==================== */
          <div className="flex items-start gap-5 sm:gap-7 shrink-0 py-3">
            {/* HEAD Pointer Anchor */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 pt-2">
              <span className="px-2.5 py-1 rounded-xl bg-[#C9A962]/20 border border-[#C9A962]/40 text-[#C9A962] font-mono text-xs font-bold">
                HEAD ptr
              </span>
              <span className="text-cyan-400 font-mono text-xs font-bold">{headAddress}</span>
              <span className="text-[#C9A962] font-mono text-base font-bold">──►</span>
            </div>

            {/* Render Heap Objects */}
            {orderedNodes.map((node, index) => {
              const isHead = index === 0;
              const isActive = activeNodeId === node.id;
              const isTarget = targetNodeId === node.id;
              const isPredecessor = predecessorNodeId === node.id;
              const isBypassed = bypassedNodeId === node.id;
              const isPointerModified = modifiedPointer === "next" && pointerSourceAddress === node.address;
              const nextNodeAddress = node.nextId ? displayedState.nodes[node.nextId]?.address : null;

              return (
                <MemoryNode
                  key={node.id}
                  node={node}
                  index={index}
                  isHead={isHead}
                  isActive={isActive}
                  isTarget={isTarget}
                  isPredecessor={isPredecessor}
                  isBypassed={isBypassed}
                  isPointerModified={isPointerModified}
                  targetAddress={pointerTargetAddress}
                  nextNodeAddress={nextNodeAddress}
                  prefersReducedMotion={prefersReducedMotion}
                />
              );
            })}

            {/* Terminal NULL in Heap */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-[#4A3F35] bg-[#14100D] text-muted-foreground font-mono text-xs shrink-0 self-center">
              <span className="text-cyan-400 font-bold">0x0000</span>
              <span className="text-[10px]">NULL / nullptr</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Step Narrative Banner & Search Metrics (Section 5) */}
      <div className="p-4 rounded-xl border border-[#C9A962]/30 bg-[#251E19]/90 text-xs font-mono space-y-2 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#4A3F35]/60 pb-2">
          <div className="flex items-center gap-2 text-[#C9A962] font-bold">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{isOperationActive ? `Operation Status: ${complexityInfo.name}` : "Simulator Idle"}</span>
          </div>

          {isOperationComplete && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
              <CheckCircle2 className="h-3 w-3" /> Operation Complete ✓
            </span>
          )}
        </div>

        {/* Narrative Description */}
        <p className="text-foreground leading-relaxed">{description}</p>

        {/* Accurate Search Metrics Reporting (Section 5) */}
        {searchStats && (
          <div className="mt-2 pt-2 border-t border-[#4A3F35]/50 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-muted-foreground">Result: </span>
              <span className={`font-bold ${searchStats.found ? "text-emerald-400" : "text-rose-400"}`}>
                {searchStats.found ? `✓ Found at Position #${searchStats.position}` : "✕ Value Not Found"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground">Nodes Checked: </span>
              <span className="font-bold text-foreground">{searchStats.nodesChecked}</span>
            </div>

            <div>
              <span className="text-muted-foreground">Time Complexity (This Search): </span>
              <span className="font-bold text-[#C9A962]">{searchStats.actualComplexity}</span>
            </div>

            <div>
              <span className="text-muted-foreground">General Worst-Case: </span>
              <span className="font-bold text-cyan-400">{searchStats.worstCaseComplexity}</span>
            </div>
          </div>
        )}
      </div>

      {/* 7. Dynamic Contextual Complexity Education (Section 6) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Time Complexity Card */}
        <div className="p-3.5 rounded-xl border border-[#4A3F35] bg-[#1C1714] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Time Complexity</span>
          </div>
          <p className="font-mono text-sm font-black text-foreground">
            {complexityInfo.timeComplexity}
          </p>
          <span className="text-[10px] text-muted-foreground block font-mono">
            {activeOperation === "search"
              ? "Actual search checks 1 to n nodes"
              : activeOperation === "insert-head"
              ? "Prepend executes in strictly constant time"
              : activeOperation === "insert-position"
              ? "Position 0 is O(1); otherwise O(position) traversal"
              : "Linear sequential pointer hops"}
          </span>
        </div>

        {/* Space Complexity Card */}
        <div className="p-3.5 rounded-xl border border-[#4A3F35] bg-[#1C1714] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
            <Database className="h-3.5 w-3.5" />
            <span>Space Complexity</span>
          </div>
          <p className="font-mono text-sm font-black text-foreground">
            {complexityInfo.spaceComplexity}
          </p>
          <span className="text-[10px] text-muted-foreground block font-mono">
            Auxiliary memory per operation (in-place pointer rewiring)
          </span>
        </div>

        {/* "Why?" Explanation Card */}
        <div className="p-3.5 rounded-xl border border-[#C9A962]/30 bg-[#251E19]/70 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#C9A962]">
            <Zap className="h-3.5 w-3.5" />
            <span>Why {complexityInfo.timeComplexity}?</span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {complexityInfo.whyExplanation}
          </p>
        </div>
      </div>

      {/* 8. Synchronized C++ Code Walkthrough (Section 11) */}
      <div className="rounded-xl border border-[#4A3F35] bg-[#1C1714] overflow-hidden">
        <button
          onClick={() => setShowCodeSnippet((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#14100D] text-xs font-mono font-bold text-[#E8DFD4] hover:text-[#C9A962] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-[#C9A962]" />
            <span>Synchronized C++ Implementation: {complexityInfo.name}</span>
            {codeLine && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/40">
                Active Line #{codeLine}
              </span>
            )}
          </div>
          {showCodeSnippet ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showCodeSnippet && (
          <div className="p-3 sm:p-4 bg-[#14100D] border-t border-[#4A3F35]">
            <CodeViewer
              code={OPERATION_CODE_SNIPPETS[codeSnippetKey]}
              activeLineNumber={codeLine}
              algorithmName={`LinkedList::${codeSnippetKey}`}
            />
          </div>
        )}
      </div>

      {/* 9. Educational UX Takeaway Note (Section 10) */}
      <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-muted-foreground text-xs flex items-start gap-2.5">
        <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Core Architectural Insight:</strong> Unlike arrays, linked-list nodes do not need to be stored next to each other in memory. Each node stores the address/reference of the next node. This enables <span className="text-emerald-400 font-semibold">O(1) prepends</span> and <span className="text-emerald-400 font-semibold">O(1) splices</span> without shifting, but eliminates <span className="text-rose-400 font-semibold">O(1) random index access</span>.
        </p>
      </div>
    </div>
  );
}
