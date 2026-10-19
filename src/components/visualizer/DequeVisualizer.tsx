"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  DequeEngine,
  DequeStep,
  DequeMode,
  DequeNode,
} from "@/algorithms/deque";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Eye,
  Trash2,
  Shuffle,
  Layers,
  CircleDot,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  Sliders,
} from "lucide-react";

const DEQUE_CPP_SOURCE = `// Production-Grade C++ Double-Ended Queue (Deque)
#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

class CircularDeque {
private:
    vector<int> buffer;
    int capacity, front, rear, count;
public:
    CircularDeque(int cap) : capacity(cap), buffer(cap), front(0), rear(0), count(0) {}

    // O(1) Push Front: Modular backward wrap
    void pushFront(int val) {
        if (isFull()) throw overflow_error("Deque full");
        if (isEmpty()) { front = rear = 0; }
        else { front = (front - 1 + capacity) % capacity; }
        buffer[front] = val;
        count++;
    }

    // O(1) Push Back: Modular forward wrap
    void pushBack(int val) {
        if (isFull()) throw overflow_error("Deque full");
        if (isEmpty()) { front = rear = 0; }
        else { rear = (rear + 1) % capacity; }
        buffer[rear] = val;
        count++;
    }

    // O(1) Pop Front
    int popFront() {
        if (isEmpty()) throw underflow_error("Deque empty");
        int val = buffer[front];
        front = (front + 1) % capacity;
        count--;
        return val;
    }

    // O(1) Pop Back
    int popBack() {
        if (isEmpty()) throw underflow_error("Deque empty");
        int val = buffer[rear];
        rear = (rear - 1 + capacity) % capacity;
        count--;
        return val;
    }

    int peekFront() const { return isEmpty() ? -1 : buffer[front]; }
    int peekBack() const { return isEmpty() ? -1 : buffer[rear]; }
    bool isEmpty() const { return count == 0; }
    bool isFull() const { return count == capacity; }
};

// Algorithmic Application: Monotonic Deque Sliding Window Max
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // stores indices in monotonic decreasing order
    vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}`;

export function DequeVisualizer() {
  const prefersReducedMotion = useReducedMotion();
  const [engine] = useState(() => new DequeEngine(8, [15, 28, 42]));
  const [currentStep, setCurrentStep] = useState<DequeStep>(() =>
    engine.getCurrentStep()
  );
  const [activeTab, setActiveTab] = useState<
    "basic" | "sliding-window" | "palindrome"
  >("basic");
  const [representationMode, setRepresentationMode] =
    useState<DequeMode>("circular-array");

  // Playback state for multi-step algorithmic modes
  const [algorithmSteps, setAlgorithmSteps] = useState<DequeStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(750);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Inputs
  const [inputValue, setInputValue] = useState<string>("56");
  const [windowK, setWindowK] = useState<number>(3);
  const [palindromeWord, setPalindromeWord] = useState<string>("RACECAR");

  // Synchronize representation mode with engine
  useEffect(() => {
    engine.setMode(representationMode);
    setCurrentStep((prev) => ({ ...prev, mode: representationMode }));
  }, [representationMode, engine]);

  // Handle Playback Loop
  useEffect(() => {
    if (isPlaying && algorithmSteps.length > 0) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < algorithmSteps.length - 1) {
          const nextIdx = currentStepIndex + 1;
          setCurrentStepIndex(nextIdx);
          setCurrentStep(algorithmSteps[nextIdx]);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, algorithmSteps, playbackSpeed]);

  // Basic Deque Handlers
  const handlePushFront = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    const steps = engine.pushFront(val);
    if (steps.length > 0) {
      setCurrentStep(steps[steps.length - 1]);
      setInputValue(String(Math.floor(Math.random() * 80) + 10));
    }
  };

  const handlePushBack = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    const steps = engine.pushBack(val);
    if (steps.length > 0) {
      setCurrentStep(steps[steps.length - 1]);
      setInputValue(String(Math.floor(Math.random() * 80) + 10));
    }
  };

  const handlePopFront = () => {
    const steps = engine.popFront();
    if (steps.length > 0) setCurrentStep(steps[steps.length - 1]);
  };

  const handlePopBack = () => {
    const steps = engine.popBack();
    if (steps.length > 0) setCurrentStep(steps[steps.length - 1]);
  };

  const handlePeekFront = () => {
    const steps = engine.peekFront();
    if (steps.length > 0) setCurrentStep(steps[0]);
  };

  const handlePeekBack = () => {
    const steps = engine.peekBack();
    if (steps.length > 0) setCurrentStep(steps[0]);
  };

  const handleClear = () => {
    setIsPlaying(false);
    const steps = engine.clear();
    setCurrentStep(steps[0]);
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const count = Math.floor(Math.random() * 4) + 2;
    engine.clear();
    for (let i = 0; i < count; i++) {
      engine.pushBack(Math.floor(Math.random() * 85) + 10);
    }
    setCurrentStep(
      engine.getCurrentStep(`Populated Deque with ${count} random elements.`)
    );
  };

  // Launch Sliding Window Maximum
  const launchSlidingWindow = () => {
    setIsPlaying(false);
    const sampleArr = [1, 3, -1, -3, 5, 3, 6, 7];
    const steps = engine.generateSlidingWindowSteps(sampleArr, windowK);
    setAlgorithmSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
  };

  // Launch Palindrome Check
  const launchPalindrome = () => {
    setIsPlaying(false);
    const steps = engine.generatePalindromeSteps(palindromeWord);
    setAlgorithmSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
  };

  // Step Controls for Algorithm Modes
  const handlePlayPause = () => {
    if (currentStepIndex >= algorithmSteps.length - 1) {
      setCurrentStepIndex(0);
      setCurrentStep(algorithmSteps[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < algorithmSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setCurrentStep(algorithmSteps[nextIdx]);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setCurrentStep(algorithmSteps[prevIdx]);
    }
  };

  const handleResetAlgorithm = () => {
    setIsPlaying(false);
    if (algorithmSteps.length > 0) {
      setCurrentStepIndex(0);
      setCurrentStep(algorithmSteps[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      {/* Studio Header Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab("basic");
              setIsPlaying(false);
              setCurrentStep(engine.getCurrentStep("Basic Operations Mode."));
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "basic"
                ? "bg-amber-500 text-black font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Basic Operations (O(1))
          </button>
          <button
            onClick={() => {
              setActiveTab("sliding-window");
              launchSlidingWindow();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "sliding-window"
                ? "bg-amber-500 text-black font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Sliding Window Max (Monotonic)
          </button>
          <button
            onClick={() => {
              setActiveTab("palindrome");
              launchPalindrome();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "palindrome"
                ? "bg-amber-500 text-black font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            Palindrome Verification
          </button>
        </div>

        {activeTab === "basic" && (
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl border border-border/80">
            <button
              onClick={() => setRepresentationMode("circular-array")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                representationMode === "circular-array"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Circular Array
            </button>
            <button
              onClick={() => setRepresentationMode("doubly-linked")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                representationMode === "doubly-linked"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Doubly-Linked List
            </button>
          </div>
        )}
      </div>

      {/* Signature 2-Column Studio Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (7 cols): Visual Stage + Telemetry + Studio Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual Chamber */}
          <div className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6 backdrop-blur-md shadow-sm relative overflow-hidden min-h-[360px] flex flex-col justify-between">
            {/* Visual Header / Modality Label */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                  {activeTab === "basic" &&
                    (representationMode === "circular-array"
                      ? "Circular Ring Array Chamber"
                      : "Doubly-Linked Bidirectional Nodes")}
                  {activeTab === "sliding-window" &&
                    "Monotonic Deque Window Laboratory"}
                  {activeTab === "palindrome" &&
                    "Dual-End Palindrome Shrink Test"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Size: {currentStep.size} / {currentStep.capacity}
              </span>
            </div>

            {/* TAB 1: BASIC OPERATIONS CANVAS */}
            {activeTab === "basic" && (
              <div className="my-auto py-4">
                {representationMode === "circular-array" ? (
                  /* Circular Array Visualization */
                  <div className="space-y-6">
                    {/* Direction Indicators */}
                    <div className="flex items-center justify-between text-xs font-mono px-2">
                      <div className="flex items-center gap-1.5 text-red-500 font-bold">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Front Pointer: [{currentStep.frontIndex}]</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                        <span>Rear Pointer: [{currentStep.rearIndex}]</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Array Slots */}
                    <div className="grid grid-cols-8 gap-2">
                      {currentStep.items.map((val, idx) => {
                        const isFront = idx === currentStep.frontIndex;
                        const isRear = idx === currentStep.rearIndex;
                        const isBoth = isFront && isRear && currentStep.size > 0;
                        const isHighlighted =
                          currentStep.highlightedIndices.includes(idx);
                        const isOccupied = val !== null;

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-1"
                          >
                            <motion.div
                              layout={!prefersReducedMotion}
                              className={`w-full h-20 sm:h-22 rounded-xl flex flex-col items-center justify-center border font-mono font-bold text-sm sm:text-base transition-all relative ${
                                isBoth
                                  ? "bg-purple-500/20 border-purple-500 text-purple-400 ring-2 ring-purple-500/40"
                                  : isFront
                                  ? "bg-red-500/20 border-red-500 text-red-400 ring-2 ring-red-500/40"
                                  : isRear
                                  ? "bg-blue-500/20 border-blue-500 text-blue-400 ring-2 ring-blue-500/40"
                                  : isOccupied
                                  ? "bg-secondary/50 border-border text-foreground"
                                  : "bg-secondary/15 border-dashed border-border/40 text-muted-foreground/30"
                              } ${
                                isHighlighted
                                  ? "scale-105 shadow-lg shadow-amber-500/20"
                                  : ""
                              }`}
                            >
                              <span>{val !== null ? val : "·"}</span>
                              <span className="text-[10px] text-muted-foreground font-mono mt-1 font-normal">
                                [{idx}]
                              </span>
                            </motion.div>

                            {/* Badge */}
                            <div className="h-4 flex items-center justify-center">
                              {isBoth ? (
                                <span className="text-[9px] font-extrabold px-1 rounded bg-purple-500/20 text-purple-400 uppercase">
                                  F & R
                                </span>
                              ) : isFront ? (
                                <span className="text-[9px] font-extrabold px-1 rounded bg-red-500/20 text-red-400 uppercase">
                                  FRONT
                                </span>
                              ) : isRear ? (
                                <span className="text-[9px] font-extrabold px-1 rounded bg-blue-500/20 text-blue-400 uppercase">
                                  REAR
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-center text-[11px] font-mono text-muted-foreground">
                      Circular Buffer Math: Front wraps via{" "}
                      <span className="text-red-400">(F - 1 + N) % N</span> • Rear
                      wraps via <span className="text-blue-400">(R + 1) % N</span>
                    </div>
                  </div>
                ) : (
                  /* Doubly-Linked Node Chain Visualization */
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 overflow-x-auto py-6">
                      <span className="text-xs font-mono text-muted-foreground">
                        nullptr
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        ⇄
                      </span>

                      {currentStep.nodes.length === 0 ? (
                        <div className="px-4 py-3 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs font-mono">
                          Empty Doubly-Linked Deque (head = tail = nullptr)
                        </div>
                      ) : (
                        currentStep.nodes.map((node, i) => (
                          <React.Fragment key={node.id}>
                            <motion.div
                              layout={!prefersReducedMotion}
                              className={`px-3.5 py-3 rounded-xl border font-mono text-xs text-center flex flex-col items-center gap-1 shadow-sm ${
                                node.isHead && node.isTail
                                  ? "bg-purple-500/20 border-purple-500 text-purple-400"
                                  : node.isHead
                                  ? "bg-red-500/20 border-red-500 text-red-400"
                                  : node.isTail
                                  ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                  : "bg-secondary/60 border-border text-foreground"
                              }`}
                            >
                              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                                {node.isHead && node.isTail
                                  ? "Head & Tail"
                                  : node.isHead
                                  ? "Head"
                                  : node.isTail
                                  ? "Tail"
                                  : `Node ${i}`}
                              </span>
                              <span className="text-sm font-extrabold">
                                {node.value}
                              </span>
                              <span className="text-[9px] text-muted-foreground/70">
                                prev ⇄ next
                              </span>
                            </motion.div>
                            <span className="text-xs font-mono text-muted-foreground">
                              ⇄
                            </span>
                          </React.Fragment>
                        ))
                      )}

                      <span className="text-xs font-mono text-muted-foreground">
                        nullptr
                      </span>
                    </div>

                    <div className="text-center text-[11px] font-mono text-muted-foreground">
                      Doubly-Linked List Guarantee: Zero array reallocations,
                      strict O(1) pointer updates.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SLIDING WINDOW MAXIMUM CANVAS */}
            {activeTab === "sliding-window" && currentStep.slidingWindow && (
              <div className="space-y-6 my-auto py-2">
                {/* Array Strip with Window Bracket */}
                <div>
                  <div className="text-xs font-mono text-muted-foreground mb-2 flex justify-between">
                    <span>Input Array (Length: {currentStep.slidingWindow.array.length})</span>
                    <span className="text-amber-500 font-bold">Window k = {currentStep.slidingWindow.k}</span>
                  </div>
                  <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                    {currentStep.slidingWindow.array.map((num, idx) => {
                      const curIdx = currentStep.slidingWindow?.currentIndex ?? -1;
                      const kVal = currentStep.slidingWindow?.k ?? 3;
                      const isInWindow =
                        idx <= curIdx && idx >= Math.max(0, curIdx - kVal + 1);
                      const isCurrent = idx === curIdx;

                      return (
                        <div
                          key={idx}
                          className={`h-16 sm:h-18 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-sm transition-all ${
                            isCurrent
                              ? "bg-amber-500/20 border-amber-500 text-amber-400 ring-2 ring-amber-500/40"
                              : isInWindow
                              ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                              : "bg-secondary/30 border-border/60 text-muted-foreground"
                          }`}
                        >
                          <span className="text-base">{num}</span>
                          <span className="text-[10px] text-muted-foreground/70 font-normal">
                            [{idx}]
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Monotonic Deque Box */}
                <div className="p-4 rounded-xl border border-border bg-background/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-amber-500">
                      Monotonic Decreasing Deque (Indices & Values)
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Front is ALWAYS Window Maximum
                    </span>
                  </div>
                  <div className="flex items-center gap-2 min-h-[48px] overflow-x-auto py-1">
                    {currentStep.slidingWindow.dequeIndices.length === 0 ? (
                      <span className="text-xs font-mono text-muted-foreground/60 italic">
                        Deque empty
                      </span>
                    ) : (
                      currentStep.slidingWindow.dequeIndices.map((idx, pos) => (
                        <div
                          key={idx}
                          className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 ${
                            pos === 0
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                              : "bg-secondary/60 border-border text-foreground"
                          }`}
                        >
                          <span className="text-[10px] text-muted-foreground font-normal">
                            [{idx}]
                          </span>
                          <span className="text-sm font-extrabold">
                            {currentStep.slidingWindow?.array[idx]}
                          </span>
                          {pos === 0 && (
                            <span className="text-[9px] bg-emerald-500/30 px-1 rounded uppercase">
                              MAX
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Computed Window Results */}
                <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
                  <span className="text-muted-foreground font-bold">Results:</span>
                  {currentStep.slidingWindow.windowMaxResults.map((res, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5"
                    >
                      <span className="text-[10px] text-muted-foreground">
                        W[{res.windowRange[0]}..{res.windowRange[1]}]:
                      </span>
                      <span className="font-bold">{res.maxVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PALINDROME CANVAS */}
            {activeTab === "palindrome" && currentStep.palindrome && (
              <div className="space-y-6 my-auto py-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    Target Word:
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-foreground tracking-widest">
                    {currentStep.palindrome.word}
                  </div>
                </div>

                {/* Active Comparison Tile Pair */}
                {currentStep.palindrome.frontChar &&
                  currentStep.palindrome.backChar && (
                    <div className="flex items-center justify-center gap-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                      <div className="text-center font-mono">
                        <div className="text-[10px] text-red-500 uppercase font-bold">
                          Front Pop
                        </div>
                        <div className="w-14 h-14 rounded-xl border border-red-500 bg-red-500/20 text-red-400 flex items-center justify-center text-xl font-bold mt-1">
                          {currentStep.palindrome.frontChar}
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          VS
                        </span>
                        {currentStep.palindrome.isMatch !== null && (
                          <span
                            className={`text-[10px] font-extrabold uppercase mt-1 px-1.5 py-0.5 rounded ${
                              currentStep.palindrome.isMatch
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {currentStep.palindrome.isMatch ? "MATCH" : "MISMATCH"}
                          </span>
                        )}
                      </div>

                      <div className="text-center font-mono">
                        <div className="text-[10px] text-blue-500 uppercase font-bold">
                          Rear Pop
                        </div>
                        <div className="w-14 h-14 rounded-xl border border-blue-500 bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold mt-1">
                          {currentStep.palindrome.backChar}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Remaining Deque Chars */}
                <div className="text-center space-y-2">
                  <div className="text-xs font-mono text-muted-foreground">
                    Remaining Deque Characters:
                  </div>
                  <div className="flex justify-center gap-1.5">
                    {currentStep.palindrome.charsRemaining.length === 0 ? (
                      <span className="text-xs font-mono text-muted-foreground/60 italic">
                        Deque completely exhausted
                      </span>
                    ) : (
                      currentStep.palindrome.charsRemaining.map((ch, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-10 rounded-lg border border-border bg-card flex items-center justify-center font-mono font-bold text-sm"
                        >
                          {ch}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Final Verdict Banner */}
                {currentStep.palindrome.isPalindrome !== null && (
                  <div
                    className={`p-3 rounded-xl border text-center font-mono text-xs font-bold flex items-center justify-center gap-2 ${
                      currentStep.palindrome.isPalindrome
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : "bg-red-500/15 border-red-500/40 text-red-400"
                    }`}
                  >
                    {currentStep.palindrome.isPalindrome ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>VERIFIED: Word is a VALID PALINDROME!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <span>REJECTED: Word is NOT a palindrome!</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Execution Telemetry Box */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card/70 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  EXECUTION TELEMETRY
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-secondary/80 text-foreground font-medium">
                  Op: {currentStep.type}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-bold">
                  Time: O(1)
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 font-mono leading-relaxed bg-background/50 p-2.5 rounded-lg border border-border/70">
              {currentStep.description}
            </p>
          </div>

          {/* Studio Controls Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            {activeTab === "basic" ? (
              /* Basic Deque Interactive Controls */
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                    <span className="text-xs font-mono text-muted-foreground">Value:</span>
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-20 px-2.5 py-1.5 rounded-xl border border-border bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Dual End Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handlePushFront}
                      className="px-3 py-1.5 rounded-xl bg-red-500 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-red-600 transition-all shadow-xs"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Push Front</span>
                    </button>
                    <button
                      onClick={handlePushBack}
                      className="px-3 py-1.5 rounded-xl bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-blue-600 transition-all shadow-xs"
                    >
                      <span>Push Rear</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={handlePopFront}
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-red-500 font-medium text-xs flex items-center gap-1.5 border border-border transition-all"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Pop Front</span>
                    </button>
                    <button
                      onClick={handlePopBack}
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-blue-500 font-medium text-xs flex items-center gap-1.5 border border-border transition-all"
                    >
                      <span>Pop Rear</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Secondary Utility Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePeekFront}
                      className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5 text-red-400" />
                      <span>Peek Front</span>
                    </button>
                    <button
                      onClick={handlePeekBack}
                      className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-400" />
                      <span>Peek Rear</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRandomize}
                      className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all flex items-center gap-1"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      <span>Randomize</span>
                    </button>
                    <button
                      onClick={handleClear}
                      className="px-2.5 py-1.5 rounded-lg border border-red-500/30 text-xs font-mono text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Multi-Step Algorithmic Playback Controls */
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Step Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayPause}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-all shadow-sm"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-3.5 w-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleStepBack}
                      disabled={currentStepIndex <= 0 || isPlaying}
                      className="px-3 py-2 rounded-xl border border-border bg-secondary/50 text-xs font-medium disabled:opacity-40 hover:bg-secondary transition-all"
                    >
                      Step Back
                    </button>
                    <button
                      onClick={handleStepForward}
                      disabled={
                        currentStepIndex >= algorithmSteps.length - 1 || isPlaying
                      }
                      className="px-3 py-2 rounded-xl border border-border bg-secondary/50 text-xs font-medium disabled:opacity-40 hover:bg-secondary transition-all flex items-center gap-1"
                    >
                      <span>Step</span>
                      <SkipForward className="h-3 w-3" />
                    </button>
                    <button
                      onClick={handleResetAlgorithm}
                      className="px-3 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Speed Slider */}
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>Speed:</span>
                    <input
                      type="range"
                      min="200"
                      max="1500"
                      step="50"
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="w-24 accent-amber-500"
                    />
                    <span>{playbackSpeed}ms</span>
                  </div>
                </div>

                {/* Sub-inputs for algorithms */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
                  {activeTab === "sliding-window" ? (
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span>Window Size k:</span>
                      <select
                        value={windowK}
                        onChange={(e) => {
                          const newK = Number(e.target.value);
                          setWindowK(newK);
                          const steps = engine.generateSlidingWindowSteps(
                            [1, 3, -1, -3, 5, 3, 6, 7],
                            newK
                          );
                          setAlgorithmSteps(steps);
                          setCurrentStepIndex(0);
                          setCurrentStep(steps[0]);
                        }}
                        className="px-2 py-1 rounded-lg border border-border bg-background text-xs font-mono"
                      >
                        <option value={2}>k = 2</option>
                        <option value={3}>k = 3 (Default)</option>
                        <option value={4}>k = 4</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span>Word:</span>
                      <input
                        type="text"
                        value={palindromeWord}
                        onChange={(e) => setPalindromeWord(e.target.value)}
                        className="w-28 px-2 py-1 rounded-lg border border-border bg-background text-xs font-mono uppercase"
                      />
                      <button
                        onClick={launchPalindrome}
                        className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-mono hover:bg-secondary/80"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                  <span className="text-[11px] font-mono text-muted-foreground ml-auto">
                    Step {currentStepIndex + 1} / {algorithmSteps.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols, sticky): Synchronized C++ CodeViewer & Invariants */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          {/* Synchronized C++ CodeViewer */}
          <div className="h-[270px] sm:h-[290px] lg:h-[310px]">
            <CodeViewer
              code={DEQUE_CPP_SOURCE}
              activeLineNumber={currentStep.codeLine}
              algorithmName="CircularDeque"
            />
          </div>

          {/* Invariant & Mathematical Guarantee Card */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-md space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <CircleDot className="h-3.5 w-3.5" />
                <span>INVARIANT GUARANTEES</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Formal Properties
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-background/60 border border-border space-y-1">
                <div className="text-[11px] font-bold text-foreground">
                  1. Circular Modulo Index Math
                </div>
                <div className="text-[10px] text-muted-foreground space-y-0.5">
                  <div>
                    pushFront: <code className="text-red-400 font-bold">(F - 1 + N) % N</code>
                  </div>
                  <div>
                    pushBack: <code className="text-blue-400 font-bold">(R + 1) % N</code>
                  </div>
                  <div>
                    popFront: <code className="text-red-400 font-bold">(F + 1) % N</code>
                  </div>
                  <div>
                    popBack: <code className="text-blue-400 font-bold">(R - 1 + N) % N</code>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-background/60 border border-border space-y-1">
                <div className="text-[11px] font-bold text-foreground">
                  2. Dual-End Invariant
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Both ends support strictly $O(1)$ push and pop. Unlike a standard queue
                  which is restricted to FIFO (Enqueue Rear, Dequeue Front), Deque
                  subsumes both Stack (LIFO) and Queue (FIFO).
                </p>
              </div>

              <div className="p-2 rounded-lg bg-background/60 border border-border space-y-1">
                <div className="text-[11px] font-bold text-foreground">
                  3. Monotonic Window Invariant
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Inside sliding windows, elements strictly decrease from Front to Back:{" "}
                  <code className="text-amber-400">arr[dq[i]] &gt; arr[dq[i+1]]</code>. The
                  front index always holds the window maximum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
