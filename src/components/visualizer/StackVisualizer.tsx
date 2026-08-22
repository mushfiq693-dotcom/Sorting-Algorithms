"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackEngine, StackState } from "@/algorithms/stack";
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
} from "lucide-react";

export function StackVisualizer() {
  const [engine] = useState(() => new StackEngine(7, [15, 32, 48]));
  const [stackState, setStackState] = useState<StackState>(() => engine.getState());
  const [inputValue, setInputValue] = useState<string>("64");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"array" | "linked-list">("array");
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
    const res = engine.pop();
    setStackState(engine.getState());
    if (res.success) {
      setFeedback({ type: "success", message: res.operation.description });
    } else {
      setFeedback({ type: "error", message: res.error || "Stack Underflow!" });
    }
  };

  const handlePeek = () => {
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
    const op = engine.clear();
    setStackState(engine.getState());
    setFeedback({ type: "info", message: op.description });
    setHighlightedIndex(null);
  };

  const handleRandomPush = () => {
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

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Control Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm backdrop-blur-xl">
        <form onSubmit={handlePush} className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground font-semibold">Value:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-20 px-3 py-1.5 text-xs font-mono rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Value"
            />
          </div>

          <button
            type="submit"
            disabled={stackState.items.length >= stackState.capacity}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Push(x)</span>
          </button>

          <button
            type="button"
            onClick={handlePop}
            disabled={stackState.items.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <ArrowDown className="h-3.5 w-3.5 text-red-400" />
            <span>Pop()</span>
          </button>

          <button
            type="button"
            onClick={handlePeek}
            disabled={stackState.items.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-secondary text-foreground text-xs font-bold hover:bg-cyan-500/10 hover:text-cyan-500 hover:border-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-cyan-500" />
            <span>Peek() / Top</span>
          </button>

          <button
            type="button"
            onClick={handleRandomPush}
            disabled={stackState.items.length >= stackState.capacity}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-secondary/80 text-muted-foreground text-xs font-medium hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Random</span>
          </button>
        </form>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex p-0.5 rounded-xl border border-border bg-secondary text-xs">
            <button
              onClick={() => setViewMode("array")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === "array"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Array Mode
            </button>
            <button
              onClick={() => setViewMode("linked-list")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
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
            className="p-1.5 rounded-xl border border-border bg-secondary text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer"
            title="Clear Stack"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Operation Status / Feedback Banner */}
      <div
        className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all text-xs leading-relaxed ${
          feedback.type === "error"
            ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
            : feedback.type === "success"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
            : "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
        }`}
      >
        {feedback.type === "error" ? (
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
        ) : feedback.type === "success" ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
        ) : (
          <Sparkles className="h-4 w-4 shrink-0 text-cyan-500 mt-0.5" />
        )}
        <div className="flex-1 font-mono">{feedback.message}</div>
        <div className="font-mono text-[11px] font-bold opacity-80 shrink-0">
          Size: {stackState.items.length} / {stackState.capacity}
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Vertical Stack Container */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-xl flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden shadow-sm">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Layers className="h-4 w-4 text-cyan-500" />
            <span>LIFO Container View</span>
          </div>

          <div className="absolute top-4 right-4 text-xs font-mono font-semibold text-muted-foreground">
            Top Pointer: <span className="text-cyan-500">{stackState.topIndex >= 0 ? `[${stackState.topIndex}]` : "EMPTY (-1)"}</span>
          </div>

          {viewMode === "array" ? (
            /* Array-Based Vertical Stacking */
            <div className="w-full max-w-sm flex flex-col items-center mt-6">
              {/* Stack Upper Entry Indicator */}
              <div className="text-[11px] font-mono text-cyan-500 mb-2 flex items-center gap-1.5 animate-pulse">
                <span>PUSH ↓ / POP ↑ (Top Entry)</span>
              </div>

              {/* Vertical Stack Wells */}
              <div className="w-64 border-x-4 border-b-4 border-cyan-500/40 rounded-b-2xl p-2 bg-secondary/30 flex flex-col gap-1.5 min-h-[300px] justify-end">
                {capacitySlots.map((slot) => {
                  const hasValue = slot.value !== null;
                  const isTop = slot.isTop;
                  const isHighlighted = highlightedIndex === slot.index;

                  return (
                    <div key={slot.index} className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">
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
                                  ? "bg-cyan-500 text-white border-cyan-300 shadow-lg shadow-cyan-500/30 scale-105"
                                  : isTop
                                  ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-600 dark:text-cyan-300 shadow-sm"
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
                              (empty)
                            </div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Top Arrow Pointer */}
                      <div className="w-16">
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
              <div className="text-[10px] font-mono text-muted-foreground mt-2">
                Fixed Stack Base (Capacity: {stackState.capacity})
              </div>
            </div>
          ) : (
            /* Linked-List Dynamic Node View */
            <div className="w-full flex flex-col items-center justify-center gap-3 mt-6">
              {stackState.items.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-muted-foreground">
                  Head pointer is NULL. The linked-list stack is empty.
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-500 mb-1">
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
                              className={`flex items-center rounded-xl border bg-card shadow-sm p-1.5 text-xs font-mono ${
                                isTop ? "border-cyan-500/50 bg-cyan-500/5" : "border-border"
                              }`}
                            >
                              <div className="px-3 py-1 bg-secondary rounded-lg font-bold text-foreground">
                                data: {val}
                              </div>
                              <div className="px-2.5 py-1 text-muted-foreground text-[11px]">
                                next: {originalIdx > 0 ? "0xPtr" : "nullptr"}
                              </div>
                            </motion.div>
                            {originalIdx > 0 && (
                              <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/60" />
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

        {/* State Inspector & Complexity Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <ListOrdered className="h-3.5 w-3.5 text-cyan-500" />
              <span>Stack Memory Table</span>
            </h3>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="grid grid-cols-3 text-[11px] text-muted-foreground border-b border-border pb-1 font-semibold">
                <span>Index</span>
                <span>Value</span>
                <span>Role</span>
              </div>
              {stackState.items.length === 0 ? (
                <div className="py-4 text-center text-[11px] text-muted-foreground italic">
                  Stack is currently empty
                </div>
              ) : (
                stackState.items.map((val, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-3 py-1 px-1.5 rounded-lg transition-colors ${
                      idx === stackState.topIndex
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold"
                        : "text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <span>arr[{idx}]</span>
                    <span>{val}</span>
                    <span>{idx === stackState.topIndex ? "TOP" : "-"}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-cyan-500" />
              <span>LIFO Invariant Guarantee</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every <code className="text-cyan-500 font-mono">push()</code> and{" "}
              <code className="text-cyan-500 font-mono">pop()</code> operates in strict{" "}
              <strong className="text-foreground">O(1) time</strong> because we only manipulate the
              single item at index <code className="font-mono text-cyan-500">topIndex</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
