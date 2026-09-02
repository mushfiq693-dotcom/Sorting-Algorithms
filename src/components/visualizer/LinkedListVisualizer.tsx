"use client";

import React, { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  createInitialList,
  getOrderedNodes,
  insertAtHead,
  insertAtTail,
  deleteValue,
  searchList,
  LinkedListState,
  LinkedListStep,
} from "@/algorithms/linkedList";
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
  Info,
  Clock,
  Zap,
} from "lucide-react";

export function LinkedListVisualizer() {
  const [listState, setListState] = useState<LinkedListState>(() => createInitialList([14, 28, 42, 60]));
  const [inputValue, setInputValue] = useState<string>("75");
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>(
    "Singly Linked List initialized with 4 nodes. Try inserting at head (O(1)), tail (O(n)), deleting a value, or searching."
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [lastOperation, setLastOperation] = useState<string>("init");

  const orderedNodes = getOrderedNodes(listState);

  const handleReset = useCallback(() => {
    const initial = createInitialList([14, 28, 42, 60]);
    setListState(initial);
    setActiveNodeId(null);
    setTargetNodeId(null);
    setExplanation("Linked list reset to default 4 nodes [14 -> 28 -> 42 -> 60 -> NULL].");
    setLastOperation("reset");
  }, []);

  const handleClear = useCallback(() => {
    setListState({ nodes: {}, headId: null, count: 0 });
    setActiveNodeId(null);
    setTargetNodeId(null);
    setExplanation("All nodes deallocated. Linked list is now empty (HEAD = NULL).");
    setLastOperation("clear");
  }, []);

  // Helper to play steps with delay
  const playSteps = async (steps: LinkedListStep[], finalState: LinkedListState) => {
    setIsAnimating(true);
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setActiveNodeId(step.activeNodeId);
      setTargetNodeId(step.targetNodeId);
      setExplanation(step.description);
      if (i < steps.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 550));
      }
    }
    setListState(finalState);
    setIsAnimating(false);
    setTimeout(() => {
      setActiveNodeId(null);
      setTargetNodeId(null);
    }, 1200);
  };

  const handleInsertAtHead = async () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    if (orderedNodes.length >= 8) {
      setExplanation("Maximum display limit reached (8 nodes). Delete a node first.");
      return;
    }

    setLastOperation("insert-head");
    const { newState, steps } = insertAtHead(listState, val);
    await playSteps(steps, newState);
  };

  const handleInsertAtTail = async () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    if (orderedNodes.length >= 8) {
      setExplanation("Maximum display limit reached (8 nodes). Delete a node first.");
      return;
    }

    setLastOperation("insert-tail");
    const { newState, steps } = insertAtTail(listState, val);
    await playSteps(steps, newState);
  };

  const handleDelete = async () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;

    setLastOperation("delete");
    const { newState, steps, success } = deleteValue(listState, val);
    await playSteps(steps, newState);
  };

  const handleSearch = async () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;

    setLastOperation("search");
    const { steps, found } = searchList(listState, val);
    await playSteps(steps, listState);
    if (found) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/80 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground font-sans flex items-center gap-2">
              <span>Linked List Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
                Singly Linked List
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Dynamic heap nodes linked via pointers. O(1) prepend without memory shifting.
            </p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-border bg-secondary/80 flex items-center gap-2">
            <span className="text-muted-foreground">Nodes:</span>
            <span className="font-bold text-foreground">{listState.count}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-border bg-secondary/80 flex items-center gap-2">
            <span className="text-muted-foreground">HEAD:</span>
            <span className="font-bold text-cyan-500">
              {listState.headId ? `${listState.nodes[listState.headId]?.val} (0x${listState.headId.slice(-4)})` : "NULL"}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Value Input Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-secondary/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-foreground">Node Value:</span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAnimating}
            className="w-20 px-2.5 py-1 rounded-lg border border-border bg-card font-mono text-xs font-bold text-foreground text-center focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleInsertAtHead}
            disabled={isAnimating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 disabled:opacity-40 transition-all active:scale-95 shadow-sm cursor-pointer"
            title="Prepend new node before HEAD: strictly O(1) time"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Insert at Head (O(1))</span>
          </button>

          <button
            onClick={handleInsertAtTail}
            disabled={isAnimating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-secondary/90 text-foreground font-semibold text-xs hover:bg-secondary disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            title="Traverse pointer chain to append: O(n) time"
          >
            <ArrowRight className="h-3.5 w-3.5 text-cyan-500" />
            <span>Insert at Tail (O(n))</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={isAnimating || orderedNodes.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 font-semibold text-xs hover:bg-rose-500/20 disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            title="Find and splice out target node: O(n) time"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Value</span>
          </button>

          <button
            onClick={handleSearch}
            disabled={isAnimating || orderedNodes.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-semibold text-xs hover:bg-cyan-500/20 disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
            title="Sequential pointer traversal from head: O(n) time"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isAnimating}
            className="p-1.5 rounded-xl border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 transition-colors cursor-pointer"
            title="Reset to 4 default nodes"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Connected Nodes Horizontal Stage */}
      <div className="min-h-[170px] sm:min-h-[200px] rounded-2xl border border-border/80 bg-card/60 p-5 flex items-center justify-start overflow-x-auto shadow-inner select-none">
        {orderedNodes.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-muted-foreground text-xs font-mono py-8">
            <span className="text-cyan-500 font-bold mb-1">HEAD = nullptr</span>
            <span>The linked list is currently empty. Use the buttons above to insert nodes.</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 py-2">
            {/* HEAD Pointer Label Box */}
            <div className="flex flex-col items-center gap-1">
              <span className="px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-mono text-[10px] font-extrabold tracking-wider shadow-sm">
                HEAD
              </span>
              <span className="text-cyan-500 text-base font-mono">→</span>
            </div>

            {/* Render Chain of Nodes */}
            {orderedNodes.map((node, index) => {
              const isHead = index === 0;
              const isTail = index === orderedNodes.length - 1;
              const isActive = activeNodeId === node.id;
              const isTarget = targetNodeId === node.id;

              let nodeBorder = "border-border/90 bg-secondary/70";
              if (isTarget) {
                nodeBorder = "border-emerald-500 bg-emerald-500/20 ring-4 ring-emerald-500/30 scale-105";
              } else if (isActive) {
                nodeBorder = "border-amber-500 bg-amber-500/20 ring-2 ring-amber-400/40 scale-105";
              }

              return (
                <div key={node.id} className="flex items-center gap-3 transition-all duration-300">
                  {/* The Node Box: [ val | next • ] */}
                  <div className={`flex flex-col items-center rounded-2xl border shadow-md transition-all duration-300 ${nodeBorder}`}>
                    {/* Node Header Info */}
                    <div className="w-full flex items-center justify-between px-2.5 py-1 border-b border-border/60 text-[9px] font-mono text-muted-foreground">
                      <span>Node #{index + 1}</span>
                      <span className="text-cyan-500 font-bold">0x{node.id.slice(-4)}</span>
                    </div>

                    {/* Node Interior Compartments */}
                    <div className="flex items-stretch h-14 w-28 sm:w-32">
                      {/* Data Value Compartment */}
                      <div className="flex-1 flex flex-col items-center justify-center p-2 border-r border-border/60">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">data</span>
                        <span className="font-mono text-sm sm:text-base font-black text-foreground">
                          {node.val}
                        </span>
                      </div>

                      {/* Next Pointer Compartment */}
                      <div className="w-12 sm:w-14 flex flex-col items-center justify-center p-1.5 bg-secondary/50">
                        <span className="text-[8px] font-mono text-muted-foreground uppercase">next</span>
                        <span className="text-xs font-mono font-bold text-cyan-500">
                          {node.nextId ? `•→` : `NULL`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pointer Arrow to Next Node */}
                  <div className="flex items-center text-cyan-500 font-mono font-black text-lg select-none px-0.5">
                    →
                  </div>
                </div>
              );
            })}

            {/* Terminal NULL Box */}
            <div className="flex items-center justify-center px-3 py-2 rounded-xl border border-border/60 bg-secondary/40 text-muted-foreground font-mono text-xs font-bold shadow-xs">
              nullptr
            </div>
          </div>
        )}
      </div>

      {/* Step Explanation Banner */}
      <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-900 dark:text-purple-200 text-xs font-mono flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
        <span className="leading-relaxed">{explanation}</span>
      </div>

      {/* Comparison Insight Note */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-muted-foreground">
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
            ⚡ Advantage over Arrays:
          </span>
          Inserting at head (`insertAtHead`) takes strictly O(1) time. In an array, prepending requires shifting all n elements O(n).
        </div>
        <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-muted-foreground">
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400 block mb-1">
            ⚠️ Tradeoff vs Arrays:
          </span>
          No O(1) random indexing (`arr[i]`). To reach node i, you must traverse i pointer hops sequentially from HEAD in O(n) time.
        </div>
      </div>
    </div>
  );
}
