"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackEngine, StackState } from "@/algorithms/stack";
import { CodeViewer } from "@/components/code/CodeViewer";
import { ALGORITHMS } from "@/data/algorithms";
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Code2,
  ListOrdered,
  Plus,
  Trash2,
  Cpu,
} from "lucide-react";

export function StackVisualizer() {
  const [engine] = useState(() => new StackEngine(7, [15, 32, 48]));
  const [stackState, setStackState] = useState<StackState>(() => engine.getState());
  const [inputValue, setInputValue] = useState<string>("64");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"array" | "linked-list">("array");
  const [activeOp, setActiveOp] = useState<"push" | "pop" | "peek" | "clear" | "idle">("idle");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  }>({
    type: "info",
    message: "Stack initialized. Perform Push, Pop, or Peek operations to observe LIFO mechanics.",
  });

  const handlePush = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) {
      setFeedback({ type: "error", message: "Please enter a valid numeric value to push." });
      return;
    }

    setActiveOp("push");
    const res = engine.push(val);
    setStackState(engine.getState());
    if (res.success) {
      setFeedback({ type: "success", message: res.operation.description });
      setInputValue(String(Math.floor(Math.random() * 90) + 10));
      setHighlightedIndex(stackState.items.length);
      setTimeout(() => setHighlightedIndex(null), 800);
    } else {
      setFeedback({ type: "error", message: res.error || "Stack Overflow!" });
    }
  };

  const handlePop = () => {
    setActiveOp("pop");
    const res = engine.pop();
    setStackState(engine.getState());
    if (res.success) {
      setFeedback({ type: "success", message: res.operation.description });
    } else {
      setFeedback({ type: "error", message: res.error || "Stack Underflow!" });
    }
  };

  const handlePeek = () => {
    setActiveOp("peek");
    const res = engine.peek();
    setStackState(engine.getState());
    if (res.success) {
      setFeedback({ type: "info", message: res.operation.description });
      setHighlightedIndex(stackState.items.length - 1);
      setTimeout(() => setHighlightedIndex(null), 1200);
    } else {
      setFeedback({ type: "error", message: res.error || "Stack Underflow!" });
    }
  };

  const handleClear = () => {
    setActiveOp("clear");
    const op = engine.clear();
    setStackState(engine.getState());
    setFeedback({ type: "info", message: op.description });
    setHighlightedIndex(null);
  };

  const handleRandomPush = () => {
    setActiveOp("push");
    const randomVal = Math.floor(Math.random() * 90) + 10;
    const res = engine.push(randomVal);
    setStackState(engine.getState());
    if (res.success) {
      setFeedback({ type: "success", message: res.operation.description });
      setHighlightedIndex(stackState.items.length);
      setTimeout(() => setHighlightedIndex(null), 800);
    } else {
      setFeedback({ type: "error", message: res.error || "Stack Overflow!" });
    }
  };

  const capacitySlots = useMemo(() => {
    const slots = [];
    for (let i = stackState.capacity - 1; i >= 0; i--) {
      const itemVal = stackState.items[i] !== undefined ? stackState.items[i] : null;
      slots.push({ index: i, value: itemVal, isTop: i === stackState.topIndex });
    }
    return slots;
  }, [stackState]);

  const activeLineNumber = useMemo(() => {
    if (viewMode === "array") {
      switch (activeOp) {
        case "push": return 12; // arr[++topIndex] = val;
        case "pop": return 18; // topIndex--;
        case "peek": return 24; // return arr[topIndex];
        default: return null;
      }
    } else {
      switch (activeOp) {
        case "push": return 45; // newNode->next = head; head = newNode;
        case "pop": return 52; // head = head->next; delete temp;
        case "peek": return 59; // return head->data;
        default: return null;
      }
    }
  }, [activeOp, viewMode]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto" suppressHydrationWarning>
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual Stage Canvas */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col min-h-[360px] relative overflow-hidden shadow-sm">
            {/* Header Indicators */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
                <Layers className="h-4 w-4" />
                <span>LIFO Execution Chamber ({viewMode === "array" ? "Array Stack" : "Linked Nodes"})</span>
              </div>
              <div className="text-muted-foreground text-[11px] font-semibold">
                Top Pointer:{" "}
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {stackState.topIndex >= 0 ? `[${stackState.topIndex}]` : "EMPTY (-1)"}
                </span>
              </div>
            </div>

            {/* Canvas Body */}
            <div className="flex-1 flex flex-col items-center justify-center py-2">
              {viewMode === "array" ? (
                /* Array-Based Vertical Stacking */
                <div className="w-full max-w-sm flex flex-col items-center">
                  <div className="text-[11px] font-mono text-cyan-500 mb-2 flex items-center gap-1.5 animate-pulse font-semibold">
                    <span>PUSH ↓ / POP ↑ (Strict Top Invariant)</span>
                  </div>

                  {/* Vertical Stack Well */}
                  <div className="w-64 border-x-4 border-b-4 border-cyan-500/40 rounded-b-2xl p-2 bg-secondary/30 flex flex-col gap-1.5 min-h-[250px] justify-end">
                    {capacitySlots.map((slot) => {
                      const hasValue = slot.value !== null;
                      const isTop = slot.isTop;
                      const isHighlighted = highlightedIndex === slot.index;

                      return (
                        <div key={slot.index} className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground w-6 text-right font-medium">
                            [{slot.index}]
                          </span>

                          <div className="flex-1 relative">
                            <AnimatePresence mode="popLayout">
                              {hasValue ? (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, y: -40, scale: 0.8 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, x: 80, scale: 0.8 }}
                                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                  className={`h-9 rounded-xl flex items-center justify-between px-3.5 border font-mono font-bold text-xs transition-all ${
                                    isHighlighted
                                      ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/30 scale-105"
                                      : isTop
                                      ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-600 dark:text-cyan-300 shadow-xs"
                                      : "bg-card border-border text-foreground"
                                  }`}
                                >
                                  <span>{slot.value}</span>
                                  {isTop && (
                                    <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                                      TOP
                                    </span>
                                  )}
                                </motion.div>
                              ) : (
                                <div className="h-9 rounded-xl border border-dashed border-border/60 bg-secondary/20 flex items-center justify-center text-[10px] font-mono text-muted-foreground/40">
                                  (empty slot)
                                </div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Top Arrow Pointer */}
                          <div className="w-14">
                            {isTop && (
                              <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-500"
                              >
                                <span>← TOP</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-2 font-medium">
                    Fixed Stack Chamber (Capacity: {stackState.capacity})
                  </div>
                </div>
              ) : (
                /* Linked-List Dynamic Node View */
                <div className="w-full flex flex-col items-center justify-center gap-2 py-2">
                  {stackState.items.length === 0 ? (
                    <div className="py-12 text-center text-xs font-mono text-muted-foreground">
                      Head pointer is NULL. The linked-list stack is empty.
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-500 mb-0.5">
                        <span>head (top)</span>
                        <ArrowDown className="h-3.5 w-3.5" />
                      </div>

                      <AnimatePresence>
                        {stackState.items
                          .slice()
                          .reverse()
                          .map((val, revIdx) => {
                            const originalIdx = stackState.items.length - 1 - revIdx;
                            const isTop = revIdx === 0;

                            return (
                              <React.Fragment key={`node-${originalIdx}-${val}`}>
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.8, x: 50 }}
                                  className={`flex items-center rounded-xl border bg-card shadow-xs p-1.5 text-xs font-mono ${
                                    isTop ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300" : "border-border text-foreground"
                                  }`}
                                >
                                  <div className="px-3 py-1 bg-secondary rounded-lg font-bold">
                                    data: {val}
                                  </div>
                                  <div className="px-2.5 py-1 text-muted-foreground text-[11px]">
                                    next: {originalIdx > 0 ? `0x${(originalIdx * 16).toString(16).padStart(4, "0")}` : "nullptr"}
                                  </div>
                                </motion.div>
                                {originalIdx > 0 && (
                                  <ArrowDown className="h-3 w-3 text-muted-foreground/60" />
                                )}
                              </React.Fragment>
                            );
                          })}
                      </AnimatePresence>
                    </div>
                  )}
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
                  <span className="text-[10px] text-muted-foreground">Size:</span>
                  <strong className="font-bold">{stackState.items.length}/{stackState.capacity}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-300">
                  <span className="text-[10px] text-muted-foreground">Top:</span>
                  <strong className="font-bold">{stackState.topIndex >= 0 ? stackState.topIndex : "-1"}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-600 dark:text-emerald-300">
                  <span className="text-[10px] text-muted-foreground">Status:</span>
                  <strong className="font-bold capitalize">{activeOp}</strong>
                </div>
              </div>
            </div>

            {/* Dynamic Explanation Text Box */}
            <div className={`rounded-xl border px-3 py-1.5 min-h-[36px] flex items-center shadow-inner ${
              feedback.type === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
                : feedback.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                : "border-border/80 bg-secondary/60 text-foreground"
            }`}>
              <p className="text-xs font-medium font-mono flex items-center gap-2 truncate">
                {feedback.type === "error" ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                ) : feedback.type === "success" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
                )}
                <span className="truncate">{feedback.message}</span>
              </p>
            </div>
          </div>

          {/* Studio Control Bar */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/90 shadow-xs backdrop-blur-xl space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
              {/* Push Input Form */}
              <form onSubmit={handlePush} className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-muted-foreground font-semibold">Value:</span>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-16 px-2.5 py-1 text-xs font-mono rounded-lg border border-border bg-secondary text-foreground focus:outline-hidden focus:ring-1 focus:ring-cyan-500/50"
                    placeholder="Val"
                  />
                </div>

                <button
                  type="submit"
                  disabled={stackState.items.length >= stackState.capacity}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowUp className="h-3 w-3" />
                  <span>Push(x)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePop}
                  disabled={stackState.items.length === 0}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-secondary text-foreground text-xs font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowDown className="h-3 w-3 text-red-400" />
                  <span>Pop()</span>
                </button>

                <button
                  type="button"
                  onClick={handlePeek}
                  disabled={stackState.items.length === 0}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-secondary text-foreground text-xs font-bold hover:bg-cyan-500/10 hover:text-cyan-500 hover:border-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Eye className="h-3 w-3 text-cyan-500" />
                  <span>Peek()</span>
                </button>

                <button
                  type="button"
                  onClick={handleRandomPush}
                  disabled={stackState.items.length >= stackState.capacity}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-secondary/80 text-muted-foreground text-xs font-medium hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Random</span>
                </button>
              </form>

              {/* View Mode & Reset */}
              <div className="flex items-center gap-2">
                <div className="inline-flex p-0.5 rounded-xl border border-border bg-secondary text-xs">
                  <button
                    onClick={() => setViewMode("array")}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      viewMode === "array"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Array
                  </button>
                  <button
                    onClick={() => setViewMode("linked-list")}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      viewMode === "linked-list"
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Linked List
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer"
                  title="Clear Stack"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky C++ Code Execution Studio & Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[270px] sm:h-[290px] lg:h-[310px]">
            <CodeViewer
              code={ALGORITHMS.stack.cppCode}
              algorithmName="Stack"
              activeLineNumber={activeLineNumber}
            />
          </div>

          {/* Stack Memory Inspector */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <ListOrdered className="h-3.5 w-3.5 text-cyan-500" />
              <span>Stack Memory Table</span>
            </h3>

            <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto pr-1">
              <div className="grid grid-cols-4 text-[10px] text-muted-foreground border-b border-border pb-1 font-semibold">
                <span>Index</span>
                <span>Address</span>
                <span>Value</span>
                <span className="text-right">Role</span>
              </div>
              {stackState.items.length === 0 ? (
                <div className="py-3 text-center text-[11px] text-muted-foreground italic">
                  Stack is currently empty
                </div>
              ) : (
                stackState.items.map((val, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-4 py-1 px-1.5 rounded-lg text-[11px] transition-colors ${
                      idx === stackState.topIndex
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/20"
                        : "text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <span>arr[{idx}]</span>
                    <span className="text-muted-foreground text-[10px]">0x{(0x7ffe00 + idx * 4).toString(16).toUpperCase()}</span>
                    <span>{val}</span>
                    <span className="text-right">{idx === stackState.topIndex ? "TOP" : "-"}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Invariant Card */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-cyan-500" />
              <span>LIFO Invariant Guarantee</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
              Every <code className="text-cyan-500 font-bold">push()</code> and{" "}
              <code className="text-cyan-500 font-bold">pop()</code> executes in strict{" "}
              <strong className="text-foreground">O(1) time</strong> because we only manipulate the
              single item at index <code className="text-cyan-500 font-bold">topIndex</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

