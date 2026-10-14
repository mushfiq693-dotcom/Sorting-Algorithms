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
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto" suppressHydrationWarning>
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visualization Stage Canvas */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col min-h-[360px] relative overflow-hidden shadow-xs">
            {/* Header Indicators */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
                <Database className="h-4 w-4" />
                <span>Dynamic Heap Pointer Studio ({viewMode === "logical" ? "Logical View" : "Memory View"})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-xl p-0.5 bg-secondary border border-border text-[11px] font-mono">
                  <button
                    onClick={() => setViewMode("logical")}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
                      viewMode === "logical"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Logical
                  </button>
                  <button
                    onClick={() => setViewMode("memory")}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
                      viewMode === "memory"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Memory
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas Stage Viewport */}
            <div className="flex-1 flex flex-col justify-center overflow-x-auto py-2">
              {/* Staged New Node (if currently allocating before linking) */}
              {stagedNode && (
                <div className="mb-3 flex items-center gap-2.5 p-2 rounded-xl border border-dashed border-cyan-500/50 bg-cyan-500/10 w-fit animate-in fade-in text-xs font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold text-[10px]">
                    ALLOCATING
                  </span>
                  <span className="text-muted-foreground">Addr:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{stagedNode.address}</span>
                  <span className="text-muted-foreground pl-1">DATA:</span>
                  <span className="font-bold text-foreground">{stagedNode.val}</span>
                  <span className="text-muted-foreground pl-1">NEXT:</span>
                  <span className="text-amber-500 font-bold">
                    {stagedNode.nextId ? displayedState.nodes[stagedNode.nextId]?.address || "head" : "nullptr"}
                  </span>
                  {modifiedPointer === "staged.next" && (
                    <span className="text-cyan-500 font-bold animate-pulse pl-1">
                      ──► Linking to HEAD ({pointerTargetAddress})
                    </span>
                  )}
                </div>
              )}

              {/* Empty List Fallback */}
              {orderedNodes.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center text-muted-foreground text-xs font-mono py-12 space-y-1">
                  <span className="text-cyan-500 font-bold text-sm">HEAD == nullptr</span>
                  <span>The linked list is currently empty. Use &quot;Insert at Head&quot; or &quot;Insert at Tail&quot; below.</span>
                </div>
              ) : viewMode === "logical" ? (
                /* ==================== LOGICAL VIEW ==================== */
                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 py-2">
                  {/* Persistent HEAD Pointer Label */}
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-extrabold tracking-wider">
                      HEAD
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400 text-[10px] font-mono font-bold truncate max-w-[55px]">
                      {headAddress}
                    </span>
                    <span className="text-cyan-500 text-xs font-mono font-bold">↓</span>
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
                  <div className="flex items-center justify-center px-3 py-2 rounded-xl border border-border bg-secondary text-muted-foreground font-mono text-xs font-bold shadow-xs shrink-0">
                    nullptr
                  </div>
                </div>
              ) : (
                /* ==================== MEMORY VIEW ==================== */
                <div className="flex items-start gap-4 sm:gap-5 shrink-0 py-2">
                  {/* HEAD Pointer Anchor */}
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold">
                      HEAD
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold">{headAddress}</span>
                    <span className="text-cyan-500 font-mono text-sm font-bold">──►</span>
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
                  <div className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-dashed border-border bg-secondary/30 text-muted-foreground font-mono text-xs shrink-0 self-center">
                    <span className="text-cyan-500 font-bold">0x0000</span>
                    <span className="text-[9px]">NULL</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Operation Status & Live Execution Telemetry */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2.5 sm:p-3 backdrop-blur-xl shadow-xs">
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
                  <span className="text-[10px] text-muted-foreground">Nodes:</span>
                  <strong className="font-bold">{orderedNodes.length}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-300">
                  <span className="text-[10px] text-muted-foreground">Op:</span>
                  <strong className="font-bold">{complexityInfo.name}</strong>
                </div>
                {isOperationActive && (
                  <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-600 dark:text-emerald-300">
                    <span className="text-[10px] text-muted-foreground">Step:</span>
                    <strong className="font-bold">{currentStepIndex + 1}/{steps.length}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Explanation Text Box */}
            <div className={`rounded-xl border px-3 py-1.5 min-h-[36px] flex items-center shadow-inner ${
              isOperationComplete
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                : "border-border/80 bg-secondary/60 text-foreground"
            }`}>
              <p className="text-xs font-medium font-mono flex items-center gap-2 truncate">
                {isOperationComplete ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
                )}
                <span className="truncate">{description}</span>
              </p>
            </div>
          </div>

          {/* Stepper Playback Toolbar (Visible while operation is active) */}
          {isOperationActive && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl border border-cyan-500/30 bg-card/90 text-xs font-mono shadow-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-[11px]">
                  Step {currentStepIndex + 1}/{steps.length}
                </span>
                <span className="text-muted-foreground truncate max-w-xs">{subStepLabel}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleStepBackward}
                  disabled={currentStepIndex === 0}
                  className="p-1 rounded-lg border border-border bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-40 cursor-pointer"
                  title="Previous Step"
                >
                  <SkipBack className="h-3 w-3" />
                </button>

                {isPlaying ? (
                  <button
                    onClick={handlePause}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer shadow-xs"
                  >
                    <Pause className="h-3 w-3" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePlay}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs hover:opacity-95 cursor-pointer shadow-xs"
                  >
                    <Play className="h-3 w-3" />
                    <span>{currentStepIndex >= steps.length - 1 ? "Replay" : "Play"}</span>
                  </button>
                )}

                <button
                  onClick={handleStepForward}
                  disabled={currentStepIndex >= steps.length - 1}
                  className="p-1 rounded-lg border border-border bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-40 cursor-pointer"
                  title="Next Step"
                >
                  <SkipForward className="h-3 w-3" />
                </button>

                <button
                  onClick={handleResetOperation}
                  className="p-1 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Reset Op"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Operation Toolbar & Inputs */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/90 shadow-xs backdrop-blur-xl space-y-2.5">
            {/* Position Validation Warning */}
            {positionError && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 font-mono text-xs">
                <span>{positionError}</span>
                <button
                  onClick={() => setPositionError(null)}
                  className="text-xs uppercase font-bold underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-semibold">Value:</span>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isPlaying}
                    className="w-14 px-2 py-1 rounded-lg border border-border bg-secondary text-foreground text-center font-bold focus:outline-hidden focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-semibold">Pos (0..{orderedNodes.length}):</span>
                  <input
                    type="number"
                    value={inputPosition}
                    onChange={(e) => {
                      setInputPosition(e.target.value);
                      if (positionError) setPositionError(null);
                    }}
                    disabled={isPlaying}
                    className="w-12 px-2 py-1 rounded-lg border border-border bg-secondary text-foreground text-center font-bold focus:outline-hidden focus:ring-1 focus:ring-cyan-500/50"
                    min={0}
                    max={orderedNodes.length}
                  />
                </div>
              </div>

              <button
                onClick={handleGlobalReset}
                disabled={isPlaying}
                className="p-1.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                title="Reset to 4 default nodes"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={handleInsertAtHead}
                disabled={isPlaying}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
                title="Prepend new node before HEAD: strictly O(1) time"
              >
                <PlusCircle className="h-3 w-3" />
                <span>Insert Head (O(1))</span>
              </button>

              <button
                onClick={handleInsertAtPosition}
                disabled={isPlaying}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold hover:bg-cyan-500/20 disabled:opacity-40 transition-all cursor-pointer"
                title="Two-pointer insertion at chosen position"
              >
                <Layers className="h-3 w-3" />
                <span>Insert at Pos</span>
              </button>

              <button
                onClick={handleInsertAtTail}
                disabled={isPlaying}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-secondary text-foreground font-semibold hover:bg-secondary/80 disabled:opacity-40 transition-all cursor-pointer"
                title="Traverse pointer chain to append: O(n) time"
              >
                <ArrowRight className="h-3 w-3 text-cyan-500" />
                <span>Insert Tail (O(n))</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={isPlaying || orderedNodes.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 font-semibold hover:bg-rose-500/20 disabled:opacity-40 transition-all cursor-pointer"
                title="Find and splice out target node"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete Value</span>
              </button>

              <button
                onClick={handleSearch}
                disabled={isPlaying || orderedNodes.length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-semibold hover:bg-cyan-500/20 disabled:opacity-40 transition-all cursor-pointer"
                title="Sequential pointer traversal"
              >
                <Search className="h-3 w-3" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky C++ Code Studio & Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[270px] sm:h-[290px] lg:h-[310px]">
            <CodeViewer
              code={OPERATION_CODE_SNIPPETS[codeSnippetKey]}
              algorithmName={`LinkedList::${codeSnippetKey}`}
              activeLineNumber={codeLine}
            />
          </div>

          {/* Pointer Register Inspector */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-500" />
              <span>Pointer Register Table</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 rounded-lg bg-secondary/50 border border-border flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">HEAD PTR</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate">{headAddress}</span>
              </div>
              <div className="p-2 rounded-lg bg-secondary/50 border border-border flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">CURRENT PTR</span>
                <span className={`font-bold truncate ${currentAddress !== "-" ? "text-amber-500" : "text-muted-foreground"}`}>
                  {currentAddress}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-secondary/50 border border-border flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">NEXT PTR</span>
                <span className={`font-bold truncate ${nextAddress !== "-" ? "text-cyan-500" : "text-muted-foreground"}`}>
                  {nextAddress}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-secondary/50 border border-border flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">PREV PTR</span>
                <span className={`font-bold truncate ${prevAddress !== "-" ? "text-purple-400" : "text-muted-foreground"}`}>
                  {prevAddress}
                </span>
              </div>
              <div className="col-span-2 p-2 rounded-lg bg-secondary/50 border border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase">STAGED NODE</span>
                <span className={`font-bold truncate ${stagedAddress !== "-" ? "text-emerald-500" : "text-muted-foreground"}`}>
                  {stagedAddress}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
