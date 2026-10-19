"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HashTableEngine,
  HashTableStep,
  HashTableMode,
  HashBucket,
  LinearSlot,
} from "@/algorithms/hashTable";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
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
  Hash,
  Database,
  ArrowDownRight,
  RefreshCw,
  Search,
  Plus,
} from "lucide-react";

const HASH_TABLE_CPP_SOURCE = `// Production-Grade C++ Hash Table (Separate Chaining)
#include <iostream>
#include <vector>
#include <list>
#include <utility>
#include <unordered_map>
using namespace std;

class HashTable {
private:
    int capacity;
    int count;
    vector<list<pair<int, string>>> table;

    // Line 13: Deterministic Modulo Hashing
    int hash(int key) const {
        return abs(key) % capacity;
    }

    // Line 17: Amortized O(1) Capacity Doubling
    void rehash() {
        int oldCap = capacity;
        capacity *= 2;
        vector<list<pair<int, string>>> oldTable = move(table);
        table.assign(capacity, list<pair<int, string>>());
        count = 0;
        for (const auto& bucket : oldTable) {
            for (const auto& [k, v] : bucket) insert(k, v);
        }
    }

public:
    HashTable(int cap = 8) : capacity(cap), count(0), table(cap) {}

    // Line 30: Average O(1) Insertion
    void insert(int key, const string& value) {
        if ((float)(count + 1) / capacity > 0.75) rehash();
        int idx = hash(key);
        for (auto& [k, v] : table[idx]) {
            if (k == key) { v = value; return; } // Key exists: update
        }
        table[idx].emplace_back(key, value);
        count++;
    }

    // Line 40: Average O(1) Lookup
    bool search(int key, string& outVal) const {
        int idx = hash(key);
        for (const auto& [k, v] : table[idx]) {
            if (k == key) { outVal = v; return true; }
        }
        return false;
    }

    // Line 48: Average O(1) Deletion
    bool erase(int key) {
        int idx = hash(key);
        auto& bucket = table[idx];
        for (auto it = bucket.begin(); it != bucket.end(); ++it) {
            if (it->first == key) {
                bucket.erase(it);
                count--;
                return true;
            }
        }
        return false;
    }
};

// Algorithmic Application: Two Sum via Hash Map O(n)
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}`;

export function HashTableVisualizer() {
  const prefersReducedMotion = useReducedMotion();
  const [engine] = useState(() => new HashTableEngine(8, [[12, "Data-12"], [25, "Data-25"], [20, "Data-20"]]));
  const [currentStep, setCurrentStep] = useState<HashTableStep>(() => engine.getCurrentStep());
  const [activeTab, setActiveTab] = useState<"interactive" | "two-sum">("interactive");
  const [collisionMode, setCollisionMode] = useState<HashTableMode>("separate-chaining");

  // Playback state for multi-step sequences
  const [playbackSteps, setPlaybackSteps] = useState<HashTableStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(800);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Form inputs
  const [inputKey, setInputKey] = useState<string>("38");
  const [inputValue, setInputValue] = useState<string>("Data-38");
  const [searchKey, setSearchKey] = useState<string>("25");

  // Two sum algorithm parameters
  const [twoSumTarget, setTwoSumTarget] = useState<number>(9);
  const [twoSumNums] = useState<number[]>([2, 7, 11, 15]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Multi-step playback runner
  useEffect(() => {
    if (isPlaying && playbackSteps.length > 0) {
      clearTimer();
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (prevIndex < playbackSteps.length - 1) {
            const nextIdx = prevIndex + 1;
            setCurrentStep(playbackSteps[nextIdx]);
            return nextIdx;
          } else {
            setIsPlaying(false);
            clearTimer();
            return prevIndex;
          }
        });
      }, playbackSpeed);
    } else {
      clearTimer();
    }
  }, [isPlaying, playbackSteps, playbackSpeed]);

  const handleModeSwitch = (mode: HashTableMode) => {
    setCollisionMode(mode);
    const step = engine.setMode(mode);
    setCurrentStep(step);
    setPlaybackSteps([]);
    setIsPlaying(false);
  };

  const handleInsert = () => {
    const key = parseInt(inputKey, 10);
    if (isNaN(key)) return;
    const val = inputValue.trim() || `Val-${key}`;

    const steps = engine.generateInsertSteps(key, val);
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) {
      setIsPlaying(true);
    }
  };

  const handleSearch = () => {
    const key = parseInt(searchKey, 10);
    if (isNaN(key)) return;

    const steps = engine.generateSearchSteps(key);
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) {
      setIsPlaying(true);
    }
  };

  const handleDelete = (keyToDelete?: number) => {
    const key = keyToDelete !== undefined ? keyToDelete : parseInt(searchKey, 10);
    if (isNaN(key)) return;

    const steps = engine.generateDeleteSteps(key);
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) {
      setIsPlaying(true);
    }
  };

  const handleRehash = () => {
    const steps = engine.generateRehashSteps();
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    if (steps.length > 1) {
      setIsPlaying(true);
    }
  };

  const handleClear = () => {
    clearTimer();
    setIsPlaying(false);
    const step = engine.clear();
    setCurrentStep(step);
    setPlaybackSteps([]);
  };

  const handleRandomize = () => {
    clearTimer();
    setIsPlaying(false);
    const step = engine.randomize();
    setCurrentStep(step);
    setPlaybackSteps([]);
  };

  // Two Sum simulation runner
  const handleStartTwoSum = () => {
    clearTimer();
    setIsPlaying(false);
    const steps = engine.generateTwoSumSteps(twoSumNums, twoSumTarget);
    setPlaybackSteps(steps);
    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (playbackSteps.length === 0) return;
    if (currentStepIndex >= playbackSteps.length - 1) {
      setCurrentStepIndex(0);
      setCurrentStep(playbackSteps[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < playbackSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setCurrentStep(playbackSteps[nextIdx]);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setCurrentStep(playbackSteps[prevIdx]);
    }
  };

  const handleResetPlayback = () => {
    clearTimer();
    setIsPlaying(false);
    if (playbackSteps.length > 0) {
      setCurrentStepIndex(0);
      setCurrentStep(playbackSteps[0]);
    }
  };

  // Calculate status badge styles
  const isHighLoad = currentStep.loadFactor > 0.75;
  const loadPercentage = Math.round(currentStep.loadFactor * 100);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      {/* 2-Column Studio Grid: Left Visual Stage (7 cols), Right Code Execution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (7 cols): Studio Canvas & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visualizer Card */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 backdrop-blur-md shadow-xs space-y-4">
            {/* Top Toolbar: Tabs & Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              {/* Primary Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border">
                <button
                  onClick={() => {
                    setActiveTab("interactive");
                    setPlaybackSteps([]);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "interactive"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Database className="h-3.5 w-3.5 text-blue-500" />
                  <span>Hash Table Studio</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("two-sum");
                    handleStartTwoSum();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "two-sum"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Hash className="h-3.5 w-3.5 text-amber-500" />
                  <span>Two Sum (O(n) Map)</span>
                </button>
              </div>

              {/* Mode Toggle (Chaining vs Linear Probing) */}
              {activeTab === "interactive" && (
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-secondary/40 border border-border text-[11px] font-mono">
                  <button
                    onClick={() => handleModeSwitch("separate-chaining")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      collisionMode === "separate-chaining"
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Separate Chaining
                  </button>
                  <button
                    onClick={() => handleModeSwitch("linear-probing")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      collisionMode === "linear-probing"
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Linear Probing
                  </button>
                </div>
              )}
            </div>

            {/* Live Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-secondary/30 border border-border/60 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span>Size:</span>
                  <strong className="text-foreground">{currentStep.size}</strong>
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span>Capacity:</span>
                  <strong className="text-foreground">{currentStep.capacity}</strong>
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span>Load Factor α:</span>
                  <strong
                    className={
                      isHighLoad ? "text-amber-500 font-bold animate-pulse" : "text-emerald-500 font-bold"
                    }
                  >
                    {currentStep.loadFactor.toFixed(2)} ({loadPercentage}%)
                  </strong>
                </span>
              </div>

              {/* Hash Function Math Formula Tag */}
              <div className="flex items-center gap-1 text-[11px] bg-background/80 px-2 py-0.5 rounded border border-border">
                <span className="text-muted-foreground">Formula:</span>
                <span className="text-cyan-500 font-semibold">
                  h(k) = k % {currentStep.capacity}
                </span>
              </div>
            </div>

            {/* Description Banner */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-300 flex items-start gap-2">
              <Activity className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
              <div className="space-y-1">
                <p className="leading-relaxed">{currentStep.description}</p>
                {currentStep.computedHash !== null && (
                  <div className="text-[10px] text-muted-foreground">
                    Active Key: <span className="font-bold text-foreground">{currentStep.activeKey}</span> → Computed Slot: <span className="font-bold text-cyan-400">[{currentStep.computedHash}]</span>
                  </div>
                )}
              </div>
            </div>

            {/* TAB 1: Main Hash Table Visual Canvas */}
            {activeTab === "interactive" && (
              <div className="min-h-[290px] p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col justify-center">
                {collisionMode === "separate-chaining" ? (
                  /* Separate Chaining: Buckets with Horizontal Linked Chains */
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-muted-foreground flex justify-between px-1">
                      <span>Bucket Index [0 .. {currentStep.capacity - 1}]</span>
                      <span>Chained Linked Nodes →</span>
                    </div>

                    <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                      {currentStep.buckets.map((bucket) => {
                        const isHighlighted = currentStep.highlightedIndices.includes(bucket.index);
                        return (
                          <div
                            key={bucket.index}
                            className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                              isHighlighted
                                ? "border-cyan-500 bg-cyan-500/10 shadow-xs shadow-cyan-500/20"
                                : "border-border/60 bg-card/60 hover:border-border"
                            }`}
                          >
                            {/* Bucket Slot Address Header */}
                            <div className="w-14 shrink-0 flex items-center justify-between px-2 py-1 rounded-lg bg-secondary/80 border border-border text-[11px] font-mono font-bold">
                              <span className="text-muted-foreground">#{bucket.index}</span>
                              <span
                                className={`text-[10px] ${
                                  bucket.entries.length > 0 ? "text-blue-400" : "text-muted-foreground"
                                }`}
                              >
                                ({bucket.entries.length})
                              </span>
                            </div>

                            {/* Linked Nodes in this Bucket */}
                            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                              {bucket.entries.length === 0 ? (
                                <span className="text-[10px] font-mono text-muted-foreground/60 italic pl-1">
                                  empty bucket
                                </span>
                              ) : (
                                bucket.entries.map((entry, nIdx) => (
                                  <React.Fragment key={entry.id}>
                                    <motion.div
                                      initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30 text-xs font-mono shadow-2xs group relative"
                                    >
                                      <span className="font-bold text-blue-400">{entry.key}</span>
                                      <span className="text-muted-foreground text-[10px]">:</span>
                                      <span className="text-[11px] text-foreground font-medium truncate max-w-[80px]">
                                        {entry.value}
                                      </span>
                                      <button
                                        onClick={() => handleDelete(entry.key)}
                                        title={`Delete key ${entry.key}`}
                                        className="opacity-0 group-hover:opacity-100 ml-1 text-red-400 hover:text-red-300 transition-opacity"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </motion.div>
                                    {nIdx < bucket.entries.length - 1 && (
                                      <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                                    )}
                                  </React.Fragment>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Open Addressing (Linear Probing): Flat Array with Tombstones */
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono text-muted-foreground flex justify-between px-1">
                      <span>Linear Backing Array (Slots 0 .. {currentStep.capacity - 1})</span>
                      <span>Probe Step Sequence</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {currentStep.linearSlots.map((slot) => {
                        const isHighlighted = currentStep.highlightedIndices.includes(slot.index);
                        const isProbeTarget = currentStep.probeChain.includes(slot.index);
                        const isTombstone = slot.state === "tombstone";
                        const isOccupied = slot.state === "occupied";

                        return (
                          <div
                            key={slot.index}
                            className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1 transition-all ${
                              isHighlighted
                                ? "border-cyan-500 bg-cyan-500/15 shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-500"
                                : isProbeTarget
                                ? "border-amber-500/60 bg-amber-500/10"
                                : "border-border/60 bg-card/60"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                              <span>Slot [{slot.index}]</span>
                              {isTombstone && (
                                <span className="px-1 py-0.2 rounded bg-red-500/20 text-red-400 font-bold text-[9px]">
                                  DEL
                                </span>
                              )}
                              {isOccupied && (
                                <span className="px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 font-bold text-[9px]">
                                  OCC
                                </span>
                              )}
                              {slot.state === "empty" && (
                                <span className="text-[9px] text-muted-foreground/50">EMPTY</span>
                              )}
                            </div>

                            <div className="py-1">
                              {isOccupied && slot.entry ? (
                                <div className="space-y-0.5">
                                  <div className="text-xs font-mono font-bold text-blue-400 flex items-center justify-between">
                                    <span>Key: {slot.entry.key}</span>
                                    <button
                                      onClick={() => handleDelete(slot.entry!.key)}
                                      className="text-muted-foreground hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <div className="text-[10px] font-mono text-foreground truncate">
                                    "{slot.entry.value}"
                                  </div>
                                </div>
                              ) : isTombstone ? (
                                <div className="text-[11px] font-mono text-red-400/80 italic flex items-center gap-1">
                                  <span>[Tombstone]</span>
                                </div>
                              ) : (
                                <div className="text-[11px] font-mono text-muted-foreground/40 italic">
                                  —
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Two Sum Algorithm Simulation Canvas */}
            {activeTab === "two-sum" && currentStep.twoSum && (
              <div className="min-h-[290px] p-4 rounded-xl border border-border/80 bg-background/50 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">
                    Input Array: <strong className="text-foreground">nums = [{twoSumNums.join(", ")}]</strong>
                  </span>
                  <span className="text-amber-500 font-bold">
                    Target Sum: {currentStep.twoSum.target}
                  </span>
                </div>

                {/* Array Elements with Active Pointer */}
                <div className="flex items-center justify-center gap-3 py-2">
                  {currentStep.twoSum.nums.map((num, idx) => {
                    const isCurrent = currentStep.twoSum?.currentIndex === idx;
                    const isFoundPair = currentStep.twoSum?.foundIndices?.includes(idx);

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono text-muted-foreground">i = {idx}</span>
                        <div
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-sm transition-all ${
                            isFoundPair
                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 scale-110 shadow-md shadow-emerald-500/30"
                              : isCurrent
                              ? "border-cyan-500 bg-cyan-500/20 text-cyan-400 scale-105 ring-2 ring-cyan-500/50"
                              : "border-border bg-card text-foreground"
                          }`}
                        >
                          {num}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic Hash Map Snapshot */}
                <div className="p-3 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-400 font-bold flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" />
                      <span>Internal Hash Map Table (Seen Values → Indices)</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">O(1) Map Lookups</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 min-h-[40px] items-center">
                    {Object.keys(currentStep.twoSum.mapSnapshot).length === 0 ? (
                      <span className="text-[11px] font-mono text-muted-foreground/60 italic">
                        Map is currently empty. Keys are recorded as array is scanned.
                      </span>
                    ) : (
                      Object.entries(currentStep.twoSum.mapSnapshot).map(([k, idx]) => (
                        <div
                          key={k}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-mono flex items-center gap-1.5"
                        >
                          <span className="text-blue-400 font-bold">{k}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground">idx [{idx}]</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Operations Form */}
            {activeTab === "interactive" ? (
              <div className="space-y-3 pt-1 border-t border-border/60">
                {/* Primary Operations: Insert & Search / Delete */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {/* Insert Box */}
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/70 flex flex-col justify-between gap-2.5 min-w-0 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Plus className="h-3.5 w-3.5 text-blue-500" />
                        <span>Insert Key-Value Pair</span>
                      </span>
                      <span className="text-[10px] font-mono text-blue-500/80 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                        O(1) avg
                      </span>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0 w-20">
                        <input
                          type="number"
                          placeholder="Key"
                          value={inputKey}
                          onChange={(e) => setInputKey(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-foreground"
                        />
                      </div>
                      <div className="relative flex-1 min-w-0">
                        <input
                          type="text"
                          placeholder="Value string"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="w-full min-w-0 px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 text-foreground"
                        />
                      </div>
                      <button
                        onClick={handleInsert}
                        className="shrink-0 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs font-mono hover:bg-blue-500 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
                      >
                        Insert
                      </button>
                    </div>
                  </div>

                  {/* Search & Delete Box */}
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/70 flex flex-col justify-between gap-2.5 min-w-0 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Search className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Lookup or Remove by Key</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-500/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Search / Delete
                      </span>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative flex-1 min-w-0">
                        <input
                          type="number"
                          placeholder="Target Key"
                          value={searchKey}
                          onChange={(e) => setSearchKey(e.target.value)}
                          className="w-full min-w-0 px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground text-center"
                        />
                      </div>
                      <button
                        onClick={handleSearch}
                        className="shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs font-mono hover:bg-emerald-500 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
                      >
                        Search
                      </button>
                      <button
                        onClick={() => handleDelete()}
                        className="shrink-0 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-500 text-xs font-mono hover:bg-red-500/10 transition-all cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secondary Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleRehash}
                      className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-mono text-foreground hover:bg-secondary transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-cyan-500" />
                      <span>Double Capacity (Rehash)</span>
                    </button>
                    <button
                      onClick={handleRandomize}
                      className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      <span>Randomize</span>
                    </button>
                    <button
                      onClick={handleClear}
                      className="px-2.5 py-1.5 rounded-lg border border-red-500/30 bg-card text-xs font-mono text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>

                  {/* Playback step count if sequence is active */}
                  {playbackSteps.length > 0 && (
                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-card border border-border shadow-2xs">
                      <button
                        onClick={handleStepBack}
                        disabled={currentStepIndex <= 0 || isPlaying}
                        className="px-2 py-1 rounded text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePlayPause}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white font-mono text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {isPlaying ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                        <span>{isPlaying ? "Pause" : "Play"}</span>
                      </button>
                      <button
                        onClick={handleStepForward}
                        disabled={currentStepIndex >= playbackSteps.length - 1 || isPlaying}
                        className="px-2 py-1 rounded text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
                      >
                        Step
                      </button>
                      <span className="text-[10px] font-mono text-muted-foreground px-1 border-l border-border">
                        {currentStepIndex + 1}/{playbackSteps.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Two Sum Playback Controls */
              <div className="space-y-3 pt-1 border-t border-border/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayPause}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-all shadow-sm cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-3.5 w-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Play Solver</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleStepBack}
                      disabled={currentStepIndex <= 0 || isPlaying}
                      className="px-3 py-2 rounded-xl border border-border bg-secondary/50 text-xs font-medium disabled:opacity-40 hover:bg-secondary transition-all cursor-pointer"
                    >
                      Step Back
                    </button>
                    <button
                      onClick={handleStepForward}
                      disabled={currentStepIndex >= playbackSteps.length - 1 || isPlaying}
                      className="px-3 py-2 rounded-xl border border-border bg-secondary/50 text-xs font-medium disabled:opacity-40 hover:bg-secondary transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Step</span>
                      <SkipForward className="h-3 w-3" />
                    </button>
                    <button
                      onClick={handleResetPlayback}
                      className="px-3 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Playback speed slider */}
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

                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1">
                  <span>Target Sum: {twoSumTarget}</span>
                  <span>
                    Step {currentStepIndex + 1} / {playbackSteps.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols, sticky top-20): Synchronized C++ CodeViewer & Invariants */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-20">
          {/* Synchronized C++ CodeViewer with Compact Scrollable Wrapper */}
          <div className="h-[280px] sm:h-[300px] lg:h-[320px] max-h-[280px] sm:max-h-[300px] lg:max-h-[320px] min-h-0 shrink-0 overflow-hidden flex flex-col">
            <CodeViewer
              code={HASH_TABLE_CPP_SOURCE}
              activeLineNumber={currentStep.codeLine}
              algorithmName="HashTable"
            />
          </div>

          {/* Invariant Guarantees & Complexity Card */}
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
                  1. Direct Modulo Addressing
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Maps arbitrary keys directly to array buckets via <code className="text-cyan-400">h(k) = abs(k) % capacity</code> in strictly $O(1)$ constant time.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-background/60 border border-border space-y-1">
                <div className="text-[11px] font-bold text-foreground">
                  2. Collision Resolution Invariant
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <strong>Separate Chaining:</strong> Multiple keys in same bucket form linked chains.<br />
                  <strong>Linear Probing:</strong> Collided keys probe sequentially <code className="text-amber-400">(idx + 1) % M</code>; deleted slots preserve probe continuity using Tombstones (DEL).
                </p>
              </div>

              <div className="p-2 rounded-lg bg-background/60 border border-border space-y-1">
                <div className="text-[11px] font-bold text-foreground">
                  3. Dynamic Load Factor (α &le; 0.75)
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  When load factor $\alpha = N / M &gt; 0.75$, the table doubles capacity and rehashes all elements to guarantee amortized $O(1)$ operations and prevent primary clustering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
