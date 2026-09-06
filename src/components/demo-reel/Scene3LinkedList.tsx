"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  createInitialList,
  insertAtPosition,
  LinkedListStep,
  LinkedListNode,
  getOrderedNodes,
} from "@/algorithms/linkedList";
import { Database, Code2, ArrowRight, Sparkles, Zap, CheckCircle2 } from "lucide-react";

/**
 * Scene 3: Linked List Studio (Insert at Position)
 * 
 * Note: /demo-reel is intentionally designed as an automated screen-recording tool
 * for social media marketing reels. Its scripted animations bypass prefers-reduced-motion
 * by design to guarantee deterministic recording output across environments.
 */
export function Scene3LinkedList() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const isRunningRef = useRef(true);

  // Generate real deterministic steps for Insert at Position (val: 99, pos: 2)
  const steps: LinkedListStep[] = React.useMemo(() => {
    const initial = createInitialList();
    const res = insertAtPosition(initial, 99, 2);
    return res.steps;
  }, []);

  useEffect(() => {
    isRunningRef.current = true;

    async function runScriptedLinkedList() {
      for (let i = 0; i < steps.length; i++) {
        if (!isRunningRef.current) return;
        setCurrentStepIndex(i);
        // Step duration tuned for clear social media observation
        await new Promise((r) => setTimeout(r, 1600));
      }
    }

    runScriptedLinkedList();

    return () => {
      isRunningRef.current = false;
    };
  }, [steps]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const orderedNodes = getOrderedNodes(currentStep.state);
  const stagedNode = currentStep.stagedNode;

  // C++ snippet for insertAtPosition
  const cppSnippet = [
    "void insertAtPosition(Node*& head, int val, int pos) {",
    "    Node* pred = head; // 1. Traverse to index",
    "    for(int i = 0; i < pos - 1; i++) pred = pred->next;",
    "    Node* newNode = new Node(val); // 2. Allocate",
    "    newNode->next = pred->next; // 3. Link forward",
    "    pred->next = newNode; // 4. Splice predecessor",
    "}",
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#1C1714] text-[#E8DFD4] select-none overflow-hidden font-sans">
      {/* Top Header */}
      <div className="relative z-10 pt-2 space-y-2">
        <div className="flex items-center justify-between border-b border-[#4A3F35]/70 pb-2.5">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            <span className="font-heading text-lg font-bold text-white">
              Linked List Studio
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
            Insert at Position (pos: 2)
          </span>
        </div>

        {/* Step Indicator & Telemetry */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#14100D] border border-[#4A3F35] text-[11px] font-mono">
          <span className="text-amber-300 flex items-center gap-1.5 truncate max-w-[220px]">
            <Zap className="h-3 w-3 text-amber-400 shrink-0" />
            {currentStep.description}
          </span>
          <span className="text-[10px] text-[#C9A962] font-bold px-1.5 py-0.5 rounded bg-[#251E19] border border-[#4A3F35] shrink-0">
            {currentStep.subStepLabel}
          </span>
        </div>
      </div>

      {/* Main Center Area: Real Connected Node Cards with Hex Memory Addresses */}
      <div className="relative z-10 my-auto w-full py-2 space-y-3">
        {/* Active Chain View */}
        <div className="rounded-2xl border border-[#4A3F35] bg-[#14100D]/90 p-4 shadow-2xl backdrop-blur-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
            <span>Dynamic Heap Chain</span>
            <span className="text-cyan-400 font-bold">HEAD: {currentStep.state.headId ? currentStep.state.nodes[currentStep.state.headId]?.address : "NULL"}</span>
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {orderedNodes.map((node, idx) => {
              const isActive = currentStep.activeNodeId === node.id;
              const isPredecessor = currentStep.predecessorNodeId === node.id;
              const isNewlyInserted = node.val === 99;

              let nodeBorder = "border-[#4A3F35] bg-[#1C1714]";
              let ringClass = "";

              if (isNewlyInserted) {
                nodeBorder = "border-emerald-500 bg-emerald-950/40 text-emerald-100";
                ringClass = "ring-2 ring-emerald-500/50";
              } else if (isPredecessor) {
                nodeBorder = "border-cyan-400 bg-cyan-950/40 text-cyan-200";
                ringClass = "ring-2 ring-cyan-400/50";
              } else if (isActive) {
                nodeBorder = "border-amber-400 bg-[#251E19] text-white";
                ringClass = "ring-2 ring-amber-400/50";
              }

              return (
                <div key={node.id} className="flex items-center gap-1.5 shrink-0">
                  {/* Node Box */}
                  <div className={`flex flex-col rounded-xl border p-2 w-20 sm:w-22 text-center transition-all duration-200 ${nodeBorder} ${ringClass}`}>
                    <div className="text-[8px] font-mono text-[#C9A962] truncate">
                      {node.address}
                    </div>
                    <div className="text-base font-extrabold text-white my-0.5">
                      {node.val}
                    </div>
                    <div className="text-[8px] font-mono text-cyan-300 border-t border-[#4A3F35] pt-0.5 mt-0.5">
                      {node.nextId ? (currentStep.state.nodes[node.nextId]?.address || "0x????") : "NULL"}
                    </div>
                  </div>

                  {/* Pointer Arrow */}
                  <ArrowRight className="h-3.5 w-3.5 text-[#C9A962] shrink-0" />
                </div>
              );
            })}
            <span className="text-[10px] font-mono text-muted-foreground px-1 py-0.5 rounded border border-[#4A3F35]">
              NULL
            </span>
          </div>
        </div>

        {/* Staged Node Allocation Callout (When allocating/linking) */}
        {stagedNode && (
          <div className="rounded-xl border border-dashed border-[#C9A962] bg-[#251E19]/90 p-2.5 flex items-center justify-between animate-in fade-in slide-in-from-bottom-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-[10px] font-mono">
                <span className="text-[#C9A962] font-bold">Staged newNode: </span>
                <span className="text-white font-extrabold text-xs">[{stagedNode.val}]</span>
                <span className="text-slate-400 ml-1">({stagedNode.address})</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Next &rarr; {stagedNode.nextId ? (currentStep.state.nodes[stagedNode.nextId]?.address || "0x02F8") : "NULL"}
            </span>
          </div>
        )}
      </div>

      {/* Synchronized C++ Code Panel */}
      <div className="relative z-10 pb-2">
        <div className="rounded-xl border border-[#4A3F35] bg-[#14100D] overflow-hidden shadow-xl text-[11px] font-mono">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#4A3F35] bg-[#1C1714]">
            <span className="flex items-center gap-1.5 text-xs text-[#C9A962] font-semibold">
              <Code2 className="h-3.5 w-3.5" />
              <span>linked_list.cpp • Dual Pointer Rewiring</span>
            </span>
            <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold">
              Line {currentStep.codeLine || 4}
            </span>
          </div>

          <div className="p-2 space-y-0.5 max-h-28 overflow-hidden text-[10px] leading-tight">
            {cppSnippet.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isCurrent = currentStep.codeLine === lineNum;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-1.5 py-0.5 rounded transition-colors ${
                    isCurrent
                      ? "bg-[#B08422]/25 border-l-2 border-[#C9A962] text-white font-bold"
                      : "text-slate-400 opacity-80"
                  }`}
                >
                  <span className="w-4 text-right text-[9px] text-slate-500 select-none">
                    {lineNum}
                  </span>
                  <span className="truncate">{lineText}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
