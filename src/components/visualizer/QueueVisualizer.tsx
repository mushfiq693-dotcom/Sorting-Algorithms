"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QueueEngine, QueueState } from "@/algorithms/queue";
import { CodeViewer } from "@/components/code/CodeViewer";
import { ALGORITHMS } from "@/data/algorithms";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Code2,
  ListOrdered,
  Plus,
  RefreshCw,
  Layers,
} from "lucide-react";

export function QueueVisualizer() {
  const [engine] = useState(() => new QueueEngine(8, true, [10, 20, 30, 40]));
  const [queueState, setQueueState] = useState<QueueState>(() => engine.getState());
  const [inputValue, setInputValue] = useState<string>("50");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isCircularMode, setIsCircularMode] = useState<boolean>(true);
  const [activeOp, setActiveOp] = useState<"enqueue" | "dequeue" | "front" | "clear" | "idle">("idle");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  }>({
    type: "info",
    message: "Queue initialized. Enqueue items at the Rear or Dequeue items from the Front to observe FIFO flow.",
  });

  const handleEnqueue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) {
      setFeedback({ type: "error", message: "Please enter a valid numeric value to enqueue." });
      return;
    }

    setActiveOp("enqueue");
    const res = engine.enqueue(val);
    const newState = engine.getState();
    setQueueState(newState);
    if (res.success) {
      setFeedback({ type: "success", message: res.operation.description });
      setInputValue(String(Math.floor(Math.random() * 90) + 10));
      setHighlightedIndex(newState.rearIndex);
      setTimeout(() => setHighlightedIndex(null), 800);
    } else {
      setFeedback({ type: "error", message: res.error || "Queue Overflow!" });
    }
  };

  const handleDequeue = () => {
    setActiveOp("dequeue");
    const oldFront = queueState.frontIndex;
    const res = engine.dequeue();
    const newState = engine.getState();
    setQueueState(newState);
    if (res.success) {
      setFeedback({ type: "success", message: res.operation.description });
      setHighlightedIndex(oldFront);
      setTimeout(() => setHighlightedIndex(null), 800);
    } else {
      setFeedback({ type: "error", message: res.error || "Queue Underflow!" });
    }
  };

  const handleFront = () => {
    setActiveOp("front");
    const res = engine.getFront();
    setQueueState(engine.getState());
    if (res.success) {
      setFeedback({ type: "info", message: res.operation.description });
      setHighlightedIndex(queueState.frontIndex);
      setTimeout(() => setHighlightedIndex(null), 1200);
    } else {
      setFeedback({ type: "error", message: res.error || "Queue Underflow!" });
    }
  };

  const handleClear = () => {
    setActiveOp("clear");
    const op = engine.clear();
    setQueueState(engine.getState());
    setFeedback({ type: "info", message: op.description });
    setHighlightedIndex(null);
  };

  const handleRandomEnqueue = () => {
    setActiveOp("enqueue");
    const randomVal = Math.floor(Math.random() * 90) + 10;
    const res = engine.enqueue(randomVal);
    const newState = engine.getState();
    setQueueState(newState);
    if (res.success) {
      setFeedback({ type: "success", message: res.operation.description });
      setHighlightedIndex(newState.rearIndex);
      setTimeout(() => setHighlightedIndex(null), 800);
    } else {
      setFeedback({ type: "error", message: res.error || "Queue Overflow!" });
    }
  };

  const toggleCircular = (enable: boolean) => {
    setIsCircularMode(enable);
    engine.setCircularMode(enable);
    setQueueState(engine.getState());
  };

  const activeLineNumber = useMemo(() => {
    switch (activeOp) {
      case "enqueue": return 15; // arr[rearIdx] = val;
      case "dequeue": return 22; // frontIdx = (frontIdx + 1) % capacity;
      case "front": return 29; // return arr[frontIdx];
      default: return null;
    }
  }, [activeOp]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto" suppressHydrationWarning>
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Horizontal Queue Buffer Canvas */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col min-h-[360px] relative overflow-hidden shadow-xs">
            {/* Header Indicators */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
                <Layers className="h-4 w-4" />
                <span>FIFO Ring Buffer Pipeline ({isCircularMode ? "Circular Wrap O(1)" : "Linear Array"})</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold">
                <span className="text-red-500 font-bold">Front: [{queueState.frontIndex >= 0 ? queueState.frontIndex : "-"}]</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-cyan-500 font-bold">Rear: [{queueState.rearIndex >= 0 ? queueState.rearIndex : "-"}]</span>
              </div>
            </div>

            {/* Ingress / Egress Directions */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5 font-bold text-red-500">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>FRONT (Dequeue / Out)</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-cyan-500">
                <span>REAR (Enqueue / In)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Horizontal Array Buffer Slots */}
            <div className="w-full overflow-x-auto py-4 flex-1 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2.5 min-w-[500px]">
                {queueState.items.map((val, idx) => {
                  const isFront = idx === queueState.frontIndex && queueState.activeCount > 0;
                  const isRear = idx === queueState.rearIndex && queueState.activeCount > 0;
                  const isHighlighted = highlightedIndex === idx;
                  const hasValue = val !== null;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      {/* Top Pointer Badge */}
                      <div className="h-5 flex items-center justify-center">
                        {isFront && (
                          <motion.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-red-500/15 text-red-500 border border-red-500/30"
                          >
                            FRONT
                          </motion.span>
                        )}
                      </div>

                      {/* Value Cell */}
                      <div className="relative">
                        <AnimatePresence mode="popLayout">
                          {hasValue ? (
                            <motion.div
                              layout
                              initial={{ opacity: 0, scale: 0.5, y: -20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.5, x: -30 }}
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center border font-mono font-bold text-xs shadow-xs transition-all ${
                                isHighlighted
                                  ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/30 scale-105"
                                  : isFront
                                  ? "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-300"
                                  : isRear
                                  ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-600 dark:text-cyan-300"
                                  : "bg-card border-border text-foreground"
                              }`}
                            >
                              {val}
                            </motion.div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl border border-dashed border-border/70 bg-secondary/20 flex items-center justify-center text-xs font-mono text-muted-foreground/30">
                              -
                            </div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Bottom Pointer Badge */}
                      <div className="h-5 flex items-center justify-center">
                        {isRear && (
                          <motion.span
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30"
                          >
                            REAR
                          </motion.span>
                        )}
                      </div>

                      {/* Slot Index */}
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Circular Modulo Formula Display */}
            {isCircularMode && (
              <div className="mt-2 px-3 py-1.5 rounded-xl border border-border bg-secondary/50 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5 text-cyan-500" />
                <span>
                  Circular Pointer Math: <strong className="text-foreground">rear = (rear + 1) % {queueState.capacity}</strong>
                </span>
              </div>
            )}
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
                  <span className="text-[10px] text-muted-foreground">Load:</span>
                  <strong className="font-bold">{queueState.activeCount}/{queueState.capacity}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-red-600 dark:text-red-300">
                  <span className="text-[10px] text-muted-foreground">Front:</span>
                  <strong className="font-bold">{queueState.frontIndex >= 0 ? queueState.frontIndex : "-"}</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-600 dark:text-emerald-300">
                  <span className="text-[10px] text-muted-foreground">Rear:</span>
                  <strong className="font-bold">{queueState.rearIndex >= 0 ? queueState.rearIndex : "-"}</strong>
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
              {/* Enqueue Input Form */}
              <form onSubmit={handleEnqueue} className="flex flex-wrap items-center gap-2">
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
                  disabled={queueState.activeCount >= queueState.capacity}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowRight className="h-3 w-3" />
                  <span>Enqueue(x)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDequeue}
                  disabled={queueState.activeCount === 0}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-secondary text-foreground text-xs font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="h-3 w-3 text-red-400" />
                  <span>Dequeue()</span>
                </button>

                <button
                  type="button"
                  onClick={handleFront}
                  disabled={queueState.activeCount === 0}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-secondary text-foreground text-xs font-bold hover:bg-cyan-500/10 hover:text-cyan-500 hover:border-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Eye className="h-3 w-3 text-cyan-500" />
                  <span>Front()</span>
                </button>

                <button
                  type="button"
                  onClick={handleRandomEnqueue}
                  disabled={queueState.activeCount >= queueState.capacity}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-secondary/80 text-muted-foreground text-xs font-medium hover:text-foreground hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Random</span>
                </button>
              </form>

              {/* Mode & Reset */}
              <div className="flex items-center gap-2">
                <div className="inline-flex p-0.5 rounded-xl border border-border bg-secondary text-xs">
                  <button
                    onClick={() => toggleCircular(true)}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      isCircularMode
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Circular
                  </button>
                  <button
                    onClick={() => toggleCircular(false)}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                      !isCircularMode
                        ? "bg-card text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Linear
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer"
                  title="Clear Queue"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky C++ Code Execution Studio & Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[280px] sm:h-[300px] lg:h-[320px] max-h-[280px] sm:max-h-[300px] lg:max-h-[320px] min-h-0 shrink-0 overflow-hidden flex flex-col">
            <CodeViewer
              code={ALGORITHMS.queue.cppCode}
              algorithmName="Queue"
              activeLineNumber={activeLineNumber}
            />
          </div>

          {/* Queue Buffer Table */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <ListOrdered className="h-3.5 w-3.5 text-cyan-500" />
              <span>Queue Buffer Table</span>
            </h3>

            <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto pr-1">
              <div className="grid grid-cols-4 text-[10px] text-muted-foreground border-b border-border pb-1 font-semibold">
                <span>Slot</span>
                <span>Address</span>
                <span>Value</span>
                <span className="text-right">Role</span>
              </div>
              {queueState.items.map((val, idx) => {
                const isFront = idx === queueState.frontIndex && queueState.activeCount > 0;
                const isRear = idx === queueState.rearIndex && queueState.activeCount > 0;
                const role = isFront && isRear ? "FRONT & REAR" : isFront ? "FRONT" : isRear ? "REAR" : val !== null ? "OCCUPIED" : "FREE";

                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-4 py-1 px-1.5 rounded-lg text-[11px] transition-colors ${
                      isFront
                        ? "bg-red-500/10 text-red-600 dark:text-red-300 font-bold border border-red-500/20"
                        : isRear
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/20"
                        : val !== null
                        ? "text-foreground hover:bg-secondary/50"
                        : "text-muted-foreground/40 italic"
                    }`}
                  >
                    <span>[{idx}]</span>
                    <span className="text-muted-foreground text-[10px]">0x{(0x7ffe00 + idx * 4).toString(16).toUpperCase()}</span>
                    <span>{val !== null ? val : "-"}</span>
                    <span className="text-right text-[10px]">{role}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invariant Card */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-cyan-500" />
              <span>FIFO Invariant Guarantee</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
              Using circular pointer arithmetic, both <code className="text-cyan-500 font-bold">enqueue()</code> and{" "}
              <code className="text-cyan-500 font-bold">dequeue()</code> execute in strict{" "}
              <strong className="text-foreground">O(1) time</strong> with zero element-shifting overhead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

