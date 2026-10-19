"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StringEngine,
  StringStep,
  formatStringHexAddress,
  BASE_STRING_ADDRESS,
  CHAR_SIZE_BYTES,
  getCharByteInfo,
  CharByteInfo,
} from "@/algorithms/string";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CodeViewer } from "@/components/code/CodeViewer";
import { ALGORITHMS } from "@/data/algorithms";
import {
  ArrowLeftRight,
  RotateCcw,
  Search,
  Plus,
  Edit3,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Cpu,
  Database,
  Binary,
  Layers,
  Sparkles,
  RefreshCw,
  Hash,
  Scissors,
} from "lucide-react";

const FALLBACK_STRING_CPP = `class StringOperations {
public:
    // 1. Two-Pointer In-Place Reversal: O(n) Time, O(1) Space
    void reverseString(string& s) {
        int left = 0, right = (int)s.size() - 1;
        while (left < right) {
            swap(s[left++], s[right--]); // In-place byte swap
        }
    }

    // 2. Two-Pointer Palindrome Verification: O(n) Time, O(1) Space
    bool isPalindrome(const string& s) {
        int left = 0, right = (int)s.size() - 1;
        while (left < right) {
            if (tolower(s[left++]) != tolower(s[right--])) return false;
        }
        return true;
    }

    // 3. Sliding Window: Longest Substring Without Repeating Chars: O(n)
    int longestUniqueSubstring(const string& s) {
        vector<int> lastPos(256, -1);
        int maxLen = 0, left = 0;
        for (int right = 0; right < (int)s.size(); right++) {
            if (lastPos[(unsigned char)s[right]] >= left)
                left = lastPos[(unsigned char)s[right]] + 1;
            lastPos[(unsigned char)s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    // 4. In-Place Byte Overwrite vs Immutable Duplication
    void updateChar(string& s, int index, char newChar) {
        s[index] = newChar; // C++ in-place mutable write: O(1)
    }
};`;

export function StringVisualizer() {
  const prefersReducedMotion = useReducedMotion();

  // Engine instance initialized with default "ALGORITHM"
  const [engine] = useState(() => new StringEngine("ALGORITHM", "mutable"));

  // Current visual step
  const [currentStep, setCurrentStep] = useState<StringStep>(() => ({
    type: "idle",
    description: "String initialized with 'ALGORITHM' (9 characters, 9 Bytes contiguous in RAM). Try Reverse, Palindrome, Sliding Window, or Search.",
    chars: ["A", "L", "G", "O", "R", "I", "T", "H", "M"],
    length: 9,
    capacity: 16,
    baseAddress: BASE_STRING_ADDRESS,
    elementSize: CHAR_SIZE_BYTES,
    pointers: {},
    highlightedIndices: [],
    matchedIndices: [],
    mismatchedIndices: [],
    mode: "mutable",
    activeCharInfo: getCharByteInfo("A", 0, BASE_STRING_ADDRESS),
  }));

  const [mode, setMode] = useState<"mutable" | "immutable">("mutable");
  const [selectedOperation, setSelectedOperation] = useState<
    "reverse" | "palindrome" | "window" | "search" | "mutate"
  >("reverse");

  // Inputs
  const [inputText, setInputText] = useState<string>("ALGORITHM");
  const [searchNeedle, setSearchNeedle] = useState<string>("RIT");
  const [mutateIndex, setMutateIndex] = useState<string>("4");
  const [mutateChar, setMutateChar] = useState<string>("X");

  // Stepper & Animation queue
  const [stepQueue, setStepQueue] = useState<StringStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(450);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const executeOperationSteps = (steps: StringStep[]) => {
    clearTimer();
    setStepQueue(steps);
    setStepIndex(0);
    if (steps.length > 0) {
      setCurrentStep(steps[0]);
    }
    if (steps.length > 1) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleModeToggle = (newMode: "mutable" | "immutable") => {
    clearTimer();
    setIsPlaying(false);
    setMode(newMode);
    const step = engine.setMode(newMode);
    setCurrentStep(step);
    setStepQueue([step]);
    setStepIndex(0);
  };

  const handleLoadPreset = (text: string) => {
    clearTimer();
    setIsPlaying(false);
    setInputText(text);
    const step = engine.setString(text);
    setCurrentStep(step);
    setStepQueue([step]);
    setStepIndex(0);
  };

  const handleApplyCustomString = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    handleLoadPreset(inputText.toUpperCase());
  };

  const handleReverse = () => {
    const res = engine.reverse();
    executeOperationSteps(res.steps);
  };

  const handlePalindrome = () => {
    const res = engine.palindromeCheck();
    executeOperationSteps(res.steps);
  };

  const handleSlidingWindow = () => {
    const res = engine.slidingWindow();
    executeOperationSteps(res.steps);
  };

  const handleSearchPattern = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchNeedle) return;
    const res = engine.searchPattern(searchNeedle.toUpperCase());
    executeOperationSteps(res.steps);
  };

  const handleMutate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idx = parseInt(mutateIndex, 10);
    if (isNaN(idx) || !mutateChar) return;
    const res = engine.replaceChar(idx, mutateChar.toUpperCase().charAt(0));
    executeOperationSteps(res.steps);
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    if (stepIndex >= stepQueue.length - 1) {
      setIsPlaying(false);
      clearTimer();
      return;
    }

    timerRef.current = setTimeout(() => {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setCurrentStep(stepQueue[nextIdx]);
      if (nextIdx >= stepQueue.length - 1) {
        setIsPlaying(false);
      }
    }, speed);

    return () => clearTimer();
  }, [isPlaying, stepIndex, stepQueue, speed, clearTimer]);

  const handleStepForward = () => {
    clearTimer();
    setIsPlaying(false);
    if (stepIndex < stepQueue.length - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setCurrentStep(stepQueue[nextIdx]);
    }
  };

  const handleStepBack = () => {
    clearTimer();
    setIsPlaying(false);
    if (stepIndex > 0) {
      const prevIdx = stepIndex - 1;
      setStepIndex(prevIdx);
      setCurrentStep(stepQueue[prevIdx]);
    }
  };

  const isError = currentStep.type === "error" || currentStep.type === "mismatch";
  const isSuccess = currentStep.type === "complete" || currentStep.type === "match" || currentStep.type === "window-match";

  // Active line calculation for synchronized C++ viewer
  const activeLineNumber = useMemo(() => {
    switch (currentStep.type) {
      case "swap":
        return 6;
      case "compare":
        return selectedOperation === "palindrome" ? 14 : 5;
      case "match":
        return 14;
      case "mismatch":
        return 14;
      case "window-expand":
      case "window-shrink":
      case "window-match":
        return 24;
      case "mutate-start":
      case "mutate-copy":
      case "mutate-complete":
        return 32;
      default:
        return null;
    }
  }, [currentStep, selectedOperation]);

  // Active character byte inspector info
  const selectedCharInfo: CharByteInfo = useMemo(() => {
    if (currentStep.activeCharInfo) {
      return currentStep.activeCharInfo;
    }
    const targetIdx = currentStep.highlightedIndices[0] ?? currentStep.pointers.left ?? 0;
    const char = currentStep.chars[targetIdx] || (currentStep.chars.length > 0 ? currentStep.chars[0] : "A");
    return getCharByteInfo(char, targetIdx, currentStep.baseAddress);
  }, [currentStep]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto" suppressHydrationWarning>
      {/* Unified Studio Grid: Left Visual Stage (7 cols), Right Code Execution & Byte Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Visual Canvas + Live Telemetry + Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Contiguous Character Memory Visual Stage */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl flex flex-col min-h-[360px] relative overflow-hidden shadow-sm">
            {/* Header Indicators */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
                <Cpu className="h-4 w-4" />
                <span>Contiguous Character Buffer (1 Byte / Char)</span>
              </div>
              <div className="text-muted-foreground text-[11px]">
                Base: <span className="font-bold text-foreground">{formatStringHexAddress(currentStep.baseAddress, 0)}</span>
              </div>
            </div>

            {/* Reallocation Old Buffer View (Shown during Immutable String Reallocation) */}
            {currentStep.immutableReallocation && (
              <div className="mb-4 p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-500">
                  <span>IMMUTABLE SOURCE BUFFER (Read-Only Heap Block)</span>
                  <span>Base: {formatStringHexAddress(currentStep.immutableReallocation.oldBuffer.address, 0)}</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {currentStep.immutableReallocation.oldBuffer.chars.map((char, idx) => (
                    <div
                      key={`old-${idx}`}
                      className="w-10 h-11 rounded-lg border border-amber-500/30 bg-amber-950/20 flex flex-col items-center justify-center font-mono text-[10px] opacity-70 text-amber-200"
                    >
                      <span className="text-[8px] text-amber-400">[{idx}]</span>
                      <span className="font-bold">{char}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Horizontal Contiguous Character Memory Strip */}
            <div className="w-full overflow-x-auto py-4">
              <div className="flex items-center justify-start sm:justify-center gap-2 min-w-[540px] px-2">
                {currentStep.chars.map((char, idx) => {
                  const isLeftPointer = currentStep.pointers.left === idx;
                  const isRightPointer = currentStep.pointers.right === idx;
                  const isWindowStart = currentStep.pointers.windowStart === idx;
                  const isWindowEnd = currentStep.pointers.windowEnd === idx;
                  const isInsideWindow =
                    currentStep.pointers.windowStart !== null &&
                    currentStep.pointers.windowStart !== undefined &&
                    currentStep.pointers.windowEnd !== null &&
                    currentStep.pointers.windowEnd !== undefined &&
                    idx >= currentStep.pointers.windowStart &&
                    idx <= currentStep.pointers.windowEnd;
                  const isHighlighted = currentStep.highlightedIndices.includes(idx);
                  const isMatched = currentStep.matchedIndices.includes(idx);
                  const isMismatched = currentStep.mismatchedIndices.includes(idx);
                  const addressStr = formatStringHexAddress(currentStep.baseAddress, idx);
                  const asciiCode = char.charCodeAt(0) || 0;

                  let cellBg = "bg-card border-border text-foreground";
                  if (isMismatched) {
                    cellBg = "bg-red-500/25 border-red-500 text-red-300 ring-2 ring-red-500/50 scale-105";
                  } else if (isMatched || (isInsideWindow && selectedOperation === "window")) {
                    cellBg = "bg-emerald-500/25 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 font-bold scale-105";
                  } else if (isHighlighted || isLeftPointer || isRightPointer) {
                    cellBg = "bg-cyan-500 text-slate-950 border-cyan-300 font-extrabold shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400 scale-105";
                  } else {
                    cellBg = "bg-secondary/70 border-cyan-500/30 text-foreground";
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                      {/* Top Physical Byte RAM Address */}
                      <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                        {addressStr}
                      </span>

                      {/* Character Cell Box */}
                      <div className="relative">
                        <AnimatePresence mode="popLayout">
                          <motion.div
                            layout={!prefersReducedMotion}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className={`w-11 h-16 sm:w-13 sm:h-18 rounded-xl flex flex-col items-center justify-between p-1.5 border font-mono transition-all ${cellBg}`}
                          >
                            <span className="text-[8px] opacity-70">
                              +{idx}B
                            </span>
                            <span className="text-base sm:text-lg font-bold">
                              {char}
                            </span>
                            <span className="text-[8px] font-mono tracking-tighter opacity-70">
                              {asciiCode}
                            </span>
                          </motion.div>
                        </AnimatePresence>

                        {/* Two-Pointer Overlay Indicators */}
                        {isLeftPointer && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-mono text-[8px] font-extrabold shadow-sm"
                          >
                            L
                          </motion.div>
                        )}
                        {isRightPointer && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-purple-400 text-slate-950 font-mono text-[8px] font-extrabold shadow-sm"
                          >
                            R
                          </motion.div>
                        )}
                        {isWindowStart && selectedOperation === "window" && (
                          <div className="absolute -top-3 -left-1 text-[9px] font-mono font-bold text-emerald-400">
                            [L
                          </div>
                        )}
                        {isWindowEnd && selectedOperation === "window" && (
                          <div className="absolute -top-3 -right-1 text-[9px] font-mono font-bold text-emerald-400">
                            R]
                          </div>
                        )}
                      </div>

                      {/* Array Index Label */}
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-mono font-bold text-foreground">
                          [{idx}]
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Null Terminator '\\0' Representation (C-String Standard) */}
                <div className="flex flex-col items-center gap-1.5 shrink-0 opacity-50">
                  <span className="text-[9px] font-mono text-muted-foreground font-semibold">
                    {formatStringHexAddress(currentStep.baseAddress, currentStep.chars.length)}
                  </span>
                  <div className="w-11 h-16 sm:w-13 sm:h-18 rounded-xl border border-dashed border-border/70 bg-secondary/30 flex flex-col items-center justify-between p-1.5 font-mono text-muted-foreground">
                    <span className="text-[8px]">+{currentStep.chars.length}B</span>
                    <span className="text-sm font-bold">\0</span>
                    <span className="text-[8px]">0x00</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground font-bold">
                    [END]
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Operation Status & Live Execution Telemetry */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2.5 sm:p-3 backdrop-blur-xl shadow-sm">
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
                  <span className="text-[10px] text-muted-foreground">Len:</span>
                  <strong className="font-bold">{currentStep.length} Chars ({currentStep.length}B)</strong>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-300">
                  <span className="text-[10px] text-muted-foreground">Model:</span>
                  <strong className="font-bold">{mode === "mutable" ? "C++ std::string" : "Immutable"}</strong>
                </div>
                {stepQueue.length > 1 && (
                  <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-600 dark:text-emerald-300">
                    <span className="text-[10px] text-muted-foreground">Step:</span>
                    <strong className="font-bold">{stepIndex + 1}/{stepQueue.length}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Explanation Text Box */}
            <div
              className={`rounded-xl border px-3 py-1.5 min-h-[36px] flex items-center shadow-inner ${
                isError
                  ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
                  : isSuccess
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                  : "border-border/80 bg-secondary/60 text-foreground"
              }`}
            >
              <p className="text-xs font-medium font-mono flex items-center gap-2 truncate">
                {isError ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                ) : isSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
                )}
                <span className="truncate">{currentStep.description}</span>
              </p>
            </div>
          </div>

          {/* Interactive Operation Control Panel */}
          <div className="p-3.5 rounded-2xl border border-border bg-card/90 shadow-sm backdrop-blur-xl space-y-2.5" suppressHydrationWarning>
            {/* Row 1: Mode Toggle & Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  <span>Model:</span>
                </span>
                <div className="inline-flex p-0.5 rounded-lg border border-border bg-secondary/80 text-[11px]">
                  <button
                    onClick={() => handleModeToggle("mutable")}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      mode === "mutable"
                        ? "bg-card text-foreground shadow-xs font-bold text-cyan-600 dark:text-cyan-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    C++ Mutable (In-Place)
                  </button>
                  <button
                    onClick={() => handleModeToggle("immutable")}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      mode === "immutable"
                        ? "bg-card text-foreground shadow-xs font-bold text-amber-500"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    JS/Python (Immutable)
                  </button>
                </div>
              </div>

              {/* String Presets */}
              <div className="flex items-center gap-1 ml-auto overflow-x-auto text-[11px]">
                <span className="text-[10px] text-muted-foreground font-mono mr-1">Presets:</span>
                {["ALGORITHM", "RACECAR", "ABRACADABRA"].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleLoadPreset(preset)}
                    className="px-2 py-0.5 rounded-lg border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary font-mono text-[10px] transition-all cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Operation Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-secondary/60 border border-border/80">
              {[
                { id: "reverse", label: "Reverse (Two-Pointer)", icon: ArrowLeftRight },
                { id: "palindrome", label: "Palindrome Check", icon: CheckCircle2 },
                { id: "window", label: "Sliding Window", icon: Scissors },
                { id: "search", label: "Pattern Search", icon: Search },
                { id: "mutate", label: "Replace / Mutate", icon: Edit3 },
              ].map((op) => {
                const Icon = op.icon;
                const isActive = selectedOperation === op.id;
                return (
                  <button
                    key={op.id}
                    onClick={() => setSelectedOperation(op.id as any)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{op.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Row 3: Operation Execution Form & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/70">
              <div className="flex flex-wrap items-center gap-2 bg-secondary/40 border border-border/70 p-1 rounded-xl">
                {selectedOperation === "search" && (
                  <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">Needle:</span>
                    <input
                      type="text"
                      value={searchNeedle}
                      onChange={(e) => setSearchNeedle(e.target.value)}
                      className="w-20 px-1.5 py-0.5 text-xs font-mono rounded border border-border bg-background text-foreground uppercase"
                      placeholder="e.g. RIT"
                    />
                  </div>
                )}

                {selectedOperation === "mutate" && (
                  <>
                    <div className="flex items-center gap-1 px-1">
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">Idx:</span>
                      <input
                        type="number"
                        value={mutateIndex}
                        onChange={(e) => setMutateIndex(e.target.value)}
                        className="w-12 px-1.5 py-0.5 text-xs font-mono rounded border border-border bg-background text-foreground text-center"
                        min={0}
                        max={Math.max(0, currentStep.chars.length - 1)}
                      />
                    </div>
                    <div className="flex items-center gap-1 px-1">
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold">Char:</span>
                      <input
                        type="text"
                        maxLength={1}
                        value={mutateChar}
                        onChange={(e) => setMutateChar(e.target.value)}
                        className="w-10 px-1.5 py-0.5 text-xs font-mono rounded border border-border bg-background text-foreground text-center uppercase"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={() => {
                    if (selectedOperation === "reverse") handleReverse();
                    else if (selectedOperation === "palindrome") handlePalindrome();
                    else if (selectedOperation === "window") handleSlidingWindow();
                    else if (selectedOperation === "search") handleSearchPattern();
                    else if (selectedOperation === "mutate") handleMutate();
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-cyan-400 transition-all cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Execute {selectedOperation.toUpperCase()}</span>
                </button>
              </div>

              {stepQueue.length > 1 && (
                <div className="flex items-center gap-1.5 bg-secondary/40 border border-border/70 px-2 py-1 rounded-xl">
                  <button
                    onClick={handleStepBack}
                    disabled={stepIndex === 0 || isPlaying}
                    className="p-1 rounded border border-border bg-secondary text-foreground disabled:opacity-40 cursor-pointer"
                    title="Step Back"
                  >
                    <SkipBack className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (stepIndex >= stepQueue.length - 1) {
                        setStepIndex(0);
                        setCurrentStep(stepQueue[0]);
                        setIsPlaying(true);
                      } else {
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-[11px] cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={stepIndex >= stepQueue.length - 1 || isPlaying}
                    className="p-1 rounded border border-border bg-secondary text-foreground disabled:opacity-40 cursor-pointer"
                    title="Step Forward"
                  >
                    <SkipForward className="h-3 w-3" />
                  </button>
                  <div className="flex items-center gap-1 ml-2 text-[10px] font-mono text-muted-foreground">
                    <span>Speed:</span>
                    <input
                      type="range"
                      min={150}
                      max={900}
                      step={50}
                      value={1050 - speed}
                      onChange={(e) => setSpeed(1050 - parseInt(e.target.value, 10))}
                      className="w-16 accent-cyan-500 cursor-pointer h-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Synchronized C++ Code Viewer + Character Byte Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          <div className="h-[270px] sm:h-[290px] lg:h-[310px]">
            <CodeViewer
              code={ALGORITHMS.string?.cppCode || FALLBACK_STRING_CPP}
              activeLineNumber={activeLineNumber}
              algorithmName="StringOperations"
            />
          </div>

          {/* Character & ASCII Byte Inspector Card */}
          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-xl space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Binary className="h-3.5 w-3.5 text-cyan-500" />
                <span>ASCII &amp; Byte Hardware Inspector</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono">
                1 Byte (8-bit)
              </span>
            </h3>

            <div className="p-3 rounded-xl bg-background/80 border border-border font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground text-[11px]">Character Glyph:</span>
                <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">
                  &apos;{selectedCharInfo.char}&apos;
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-1.5 rounded-lg bg-secondary/50 border border-border/50">
                  <span className="text-muted-foreground block text-[9px]">ASCII Decimal:</span>
                  <span className="font-bold text-foreground">{selectedCharInfo.asciiDec}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-secondary/50 border border-border/50">
                  <span className="text-muted-foreground block text-[9px]">Hex Byte:</span>
                  <span className="font-bold text-foreground">{selectedCharInfo.asciiHex}</span>
                </div>
              </div>
              <div className="p-1.5 rounded-lg bg-secondary/50 border border-border/50 text-[11px]">
                <span className="text-muted-foreground block text-[9px]">8-Bit Binary Representation:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                  {selectedCharInfo.binary}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1">
                <span>RAM Address:</span>
                <span className="font-bold text-foreground">{selectedCharInfo.address}</span>
              </div>
            </div>
          </div>

          {/* String Architectural Invariant Card */}
          <div className="p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-cyan-500" />
              <span>Contiguous Memory Invariant</span>
            </h3>

            <div className="p-2.5 rounded-xl bg-background/60 border border-border text-xs font-mono space-y-1">
              <div className="text-muted-foreground text-[10px]">
                Direct Byte Address = BaseAddress + (i × 1B)
              </div>
              <div className="text-[11px] text-foreground leading-relaxed">
                Because <code className="text-cyan-500">sizeof(char) == 1</code>, character offsets directly mirror raw memory byte increments. In C++, <code className="text-cyan-500">str[i]</code> reads physical RAM in strict <strong className="text-emerald-500">O(1)</strong> with zero indirection.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
