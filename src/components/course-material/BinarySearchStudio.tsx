"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Activity,
  Award,
} from "lucide-react";

interface StepState {
  beg: number;
  end: number;
  mid: number;
  midVal: number;
  status: "init" | "comparing" | "left" | "right" | "found" | "not_found";
  codeLine: number;
  explanationEn: string;
  explanationBn: string;
}

const DEFAULT_ARRAY = [11, 22, 30, 33, 40, 44, 55, 60, 66, 77, 80, 88, 99];

export function BinarySearchStudio() {
  const [array] = useState<number[]>(DEFAULT_ARRAY);
  const [target, setTarget] = useState<number>(40);
  const [inputVal, setInputVal] = useState<string>("40");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1100);
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxValInArray = useMemo(() => Math.max(...array, 1), [array]);

  // Compute all step states for the current array and target
  const steps: StepState[] = useMemo(() => {
    const list: StepState[] = [];
    const n = array.length;
    let beg = 1;
    let end = n;

    // Initial state
    const initialMid = Math.floor((beg + end) / 2);
    list.push({
      beg,
      end,
      mid: initialMid,
      midVal: array[initialMid - 1],
      status: "init",
      codeLine: 2,
      explanationEn: `Initial Segment: BEG = 1, END = ${n}. Calculated MID = INT((1 + ${n})/2) = ${initialMid} with DATA[${initialMid}] = ${array[initialMid - 1]}.`,
      explanationBn: `প্রাথমিক সীমানা: BEG = ১, END = ${n}। মাঝখানের ঘর MID = INT((১ + ${n})/২) = ${initialMid}, যেখানে মান DATA[${initialMid}] = ${array[initialMid - 1]}।`,
    });

    while (beg <= end) {
      const mid = Math.floor((beg + end) / 2);
      const midVal = array[mid - 1];

      // Comparison step
      list.push({
        beg,
        end,
        mid,
        midVal,
        status: "comparing",
        codeLine: 3,
        explanationEn: `Comparing ITEM (${target}) with DATA[MID] (${midVal}) at index [${mid}].`,
        explanationBn: `টার্গেট ITEM (${target}) এর সাথে মাঝখানের ঘর DATA[${mid}] (${midVal}) এর মান তুলনা করা হচ্ছে।`,
      });

      if (midVal === target) {
        list.push({
          beg,
          end,
          mid,
          midVal,
          status: "found",
          codeLine: 6,
          explanationEn: `MATCH FOUND! DATA[${mid}] = ${target}. Target located at LOC = ${mid} in O(log n) steps.`,
          explanationBn: `কাঙ্ক্ষিত সংখ্যা পাওয়া গেছে! DATA[${mid}] == ${target}। সফল অনুসন্ধান, লোকেশন LOC = ${mid}।`,
        });
        return list;
      } else if (target < midVal) {
        const nextEnd = mid - 1;
        list.push({
          beg,
          end,
          mid,
          midVal,
          status: "left",
          codeLine: 4,
          explanationEn: `Since ITEM (${target}) < DATA[${mid}] (${midVal}), target must lie in the LEFT half. Discarding right half: Update END = MID - 1 = ${nextEnd}.`,
          explanationBn: `যেহেতু ${target} < ${midVal}, তাই টার্গেট অবশ্যই বামের অংশে রয়েছে। ডানের অংশ বাদ দিয়ে নতুন সীমানা END = MID - ১ = ${nextEnd} নির্ধারণ করা হলো।`,
        });
        end = nextEnd;
      } else {
        const nextBeg = mid + 1;
        list.push({
          beg,
          end,
          mid,
          midVal,
          status: "right",
          codeLine: 5,
          explanationEn: `Since ITEM (${target}) > DATA[${mid}] (${midVal}), target must lie in the RIGHT half. Discarding left half: Update BEG = MID + 1 = ${nextBeg}.`,
          explanationBn: `যেহেতু ${target} > ${midVal}, তাই টার্গেট অবশ্যই ডানের অংশে রয়েছে। বামের অংশ বাদ দিয়ে নতুন সীমানা BEG = MID + ১ = ${nextBeg} নির্ধারণ করা হলো।`,
        });
        beg = nextBeg;
      }
    }

    // Not found step
    list.push({
      beg,
      end,
      mid: -1,
      midVal: -1,
      status: "not_found",
      codeLine: 8,
      explanationEn: `Search space exhausted (BEG = ${beg} > END = ${end}). ITEM (${target}) is not present in DATA. Result: LOC = NULL.`,
      explanationBn: `অনুসন্ধানের সীমানা অতিক্রম করেছে (BEG = ${beg} > END = ${end})। অ্যারেতে ${target} উপাদানটি পাওয়া যায়নি। ফলাফল: LOC = NULL (অসফল অনুসন্ধান)।`,
    });

    return list;
  }, [array, target]);

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)] || steps[0];

  // Auto-play loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const handleApplyTarget = (val: number) => {
    setTarget(val);
    setInputVal(val.toString());
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-cyan-950/30 p-5 md:p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm">
            <Search className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Interactive Binary Search Studio (Algorithm 4.6 & Example 4.9)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                O(log n)
              </span>
            </h4>
            <p className="text-xs text-muted-foreground">
              {lang === "bn"
                ? "অ্যারে বার্স (Array Bars) এর মাধ্যমে ধাপে ধাপে সেগমেন্ট অর্ধেক করা ও BEG/MID/END পয়েন্টার পর্যবেক্ষণ করুন"
                : "Observe live segment halving, BEG/MID/END pointers, and comparison trace via dynamic array bars"}
            </p>
          </div>
        </div>

        {/* Language Switch */}
        <button
          type="button"
          onClick={() => setLang(lang === "bn" ? "en" : "bn")}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-secondary/80 hover:bg-secondary border border-border text-foreground transition-all cursor-pointer shadow-sm"
        >
          {lang === "bn" ? "🇧🇩 বাংলা" : "🇺🇸 English"}
        </button>
      </div>

      {/* Target Selection & Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
        <span className="text-xs font-semibold text-muted-foreground mr-1">
          {lang === "bn" ? "লিপশুটজ প্রিসেট:" : "Lipschutz Presets:"}
        </span>

        <button
          type="button"
          onClick={() => handleApplyTarget(40)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            target === 40
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm"
              : "bg-secondary/60 hover:bg-secondary text-foreground/80 border-border"
          }`}
        >
          {lang === "bn" ? "Example 4.9(a): Search 40 (সফল)" : "Example 4.9(a): Search 40 (Found)"}
        </button>

        <button
          type="button"
          onClick={() => handleApplyTarget(85)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            target === 85
              ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm"
              : "bg-secondary/60 hover:bg-secondary text-foreground/80 border-border"
          }`}
        >
          {lang === "bn" ? "Example 4.9(b): Search 85 (অসফল)" : "Example 4.9(b): Search 85 (Not Found)"}
        </button>

        <button
          type="button"
          onClick={() => handleApplyTarget(55)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            target === 55
              ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm"
              : "bg-secondary/60 hover:bg-secondary text-foreground/80 border-border"
          }`}
        >
          {lang === "bn" ? "Best Case: Search 55 (১ম ধাপে)" : "Best Case: Search 55 (Step 1)"}
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const parsed = parseInt(inputVal, 10);
                if (!isNaN(parsed)) handleApplyTarget(parsed);
              }
            }}
            className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-border text-xs text-foreground font-mono text-center focus:outline-none focus:border-cyan-500"
            placeholder="Target"
          />
          <button
            type="button"
            onClick={() => {
              const parsed = parseInt(inputVal, 10);
              if (!isNaN(parsed)) handleApplyTarget(parsed);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-sm cursor-pointer"
          >
            {lang === "bn" ? "সার্চ" : "Search"}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VERTICAL ARRAY BARS VISUALIZER CANVAS */}
      {/* ========================================================================= */}
      <div className="relative p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/30 mb-5 overflow-hidden shadow-inner">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-36 bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full overflow-x-auto pb-2">
          {/* Array Bars Flex Container */}
          <div className="min-w-[640px] flex items-end justify-between gap-2 sm:gap-2.5 h-56 pt-8 pb-3">
            {array.map((val, idx) => {
              const pos = idx + 1; // 1-indexed to match textbook
              const inRange = pos >= currentStep.beg && pos <= currentStep.end;
              const isMid = pos === currentStep.mid;
              const isBeg = pos === currentStep.beg;
              const isEnd = pos === currentStep.end;
              const isFound = isMid && currentStep.status === "found";
              const isComparing = isMid && currentStep.status === "comparing";

              // Proportional Bar Height (Minimum 22% for visibility, up to 88%)
              const heightPercent = Math.max(22, Math.round((val / maxValInArray) * 88));

              return (
                <div
                  key={idx}
                  className={`group relative flex-1 flex flex-col items-center justify-end h-full max-w-[54px] transition-all duration-300 ${
                    !inRange && currentStep.status !== "init" ? "opacity-30 grayscale" : "opacity-100"
                  }`}
                >
                  {/* Top Pointer Badges (BEG / MID / END / MATCH) */}
                  <div className="h-8 flex flex-col items-center justify-end mb-1.5 font-mono text-[9px] pointer-events-none">
                    {isFound ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black tracking-wider text-[10px] shadow-lg shadow-emerald-500/50 animate-bounce flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>LOC={pos}</span>
                      </span>
                    ) : isMid ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black tracking-wider text-[9px] shadow-md shadow-amber-500/40 animate-pulse border border-amber-300">
                        MID
                      </span>
                    ) : isBeg && isEnd ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 font-extrabold text-[8px] shadow-sm">
                        B=E
                      </span>
                    ) : isBeg ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[8px]">
                        BEG
                      </span>
                    ) : isEnd ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold text-[8px]">
                        END
                      </span>
                    ) : null}
                  </div>

                  {/* The Vertical Array Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-xl border transition-all duration-300 flex flex-col items-center justify-between p-1.5 shadow-md relative ${
                      isFound
                        ? "bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 border-emerald-300 ring-4 ring-emerald-500/40 text-slate-950 font-black shadow-emerald-500/50 scale-105"
                        : isComparing
                        ? "bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 border-amber-200 ring-4 ring-amber-400/40 text-slate-950 font-black shadow-amber-500/40 scale-105"
                        : isMid
                        ? "bg-gradient-to-t from-amber-600/90 via-amber-500/90 to-amber-400/90 border-amber-300 text-slate-950 font-bold"
                        : inRange
                        ? "bg-gradient-to-t from-cyan-900/80 via-cyan-600/70 to-blue-500/80 border-cyan-400/60 text-white font-bold hover:brightness-110"
                        : "bg-slate-900/60 border-slate-800/80 text-slate-500"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs sm:text-sm font-extrabold drop-shadow-sm ${
                        isFound || isComparing || isMid ? "text-slate-950 font-black" : "text-white"
                      }`}
                    >
                      {val}
                    </span>
                  </div>

                  {/* 1-Indexed Position Indicator matching Lipschutz */}
                  <div className="flex flex-col items-center text-center mt-2">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isMid
                          ? "text-amber-400"
                          : isBeg || isEnd
                          ? "text-cyan-300"
                          : inRange
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      [{pos}]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pointer HUD & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-[11px] text-muted-foreground border-t border-slate-800/80 pt-3 font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
                <span className="text-emerald-400 font-bold">BEG = {currentStep.beg}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block shadow-sm" />
                <span className="text-amber-400 font-bold">
                  MID = {currentStep.mid > 0 ? `${currentStep.mid} (DATA[${currentStep.mid}]=${currentStep.midVal})` : "—"}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 inline-block shadow-sm" />
                <span className="text-indigo-400 font-bold">END = {currentStep.end}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{lang === "bn" ? "টার্গেট সংখ্যা:" : "Search Target:"}</span>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold font-mono text-xs">
                ITEM = {target}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 mb-5 flex items-start gap-3 shadow-md">
        {currentStep.status === "found" ? (
          <Award className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : currentStep.status === "not_found" ? (
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        )}
        <div>
          <div className="font-bold text-cyan-300 mb-0.5">
            {lang === "bn"
              ? `ধাপ ${currentStepIndex + 1} / ${steps.length} — ${
                  currentStep.status === "found"
                    ? "অনুসন্ধান সফল"
                    : currentStep.status === "not_found"
                    ? "অনুসন্ধান অসফল"
                    : "তুলনা ও সীমানা নির্ধারণ"
                }`
              : `Step ${currentStepIndex + 1} / ${steps.length} — ${
                  currentStep.status === "found"
                    ? "Match Located"
                    : currentStep.status === "not_found"
                    ? "Target Absent"
                    : "Interval Halving"
                }`}
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            {lang === "bn" ? currentStep.explanationBn : currentStep.explanationEn}
          </p>
        </div>
      </div>

      {/* Algorithm 4.6 Pseudocode Line Tracker & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Algorithm Pseudocode Sync (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs text-slate-300 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-cyan-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              Algorithm 4.6 Execution Sync (BINARY)
            </span>
            <span className="text-[10px] text-muted-foreground">Lipschutz Notation</span>
          </div>

          {[
            { line: 1, text: "1. [Initialize] Set BEG := 1, END := n, and MID := INT((BEG + END)/2)." },
            { line: 2, text: "2. Repeat Steps 3 and 4 while BEG <= END and DATA[MID] != ITEM:" },
            { line: 4, text: "3.   If ITEM < DATA[MID], then Set END := MID - 1." },
            { line: 5, text: "     Else Set BEG := MID + 1. [End of If]" },
            { line: 3, text: "4.   Set MID := INT((BEG + END)/2). [End of Step 2 loop]" },
            { line: 6, text: "5. If DATA[MID] = ITEM, then Set LOC := MID; Else Set LOC := NULL." },
            { line: 8, text: "6. Exit." },
          ].map((code) => {
            const isActive =
              (currentStep.codeLine === 2 && code.line <= 2) ||
              (currentStep.codeLine === 3 && code.line === 3) ||
              (currentStep.codeLine === 4 && code.line === 4) ||
              (currentStep.codeLine === 5 && code.line === 5) ||
              (currentStep.codeLine === 6 && code.line === 6) ||
              (currentStep.codeLine === 8 && code.line === 8);

            return (
              <div
                key={code.line}
                className={`px-2.5 py-1 rounded transition-all flex items-center justify-between ${
                  isActive
                    ? currentStep.status === "found"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                      : currentStep.status === "not_found"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                      : "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-bold"
                    : "hover:bg-slate-900/50"
                }`}
              >
                <span>{code.text}</span>
                {isActive && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-300 font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Playback Controls & Speed (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between gap-3 shadow-sm">
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2 font-mono flex items-center justify-between">
              <span>{lang === "bn" ? "প্লেব্যাক কন্ট্রোল" : "Playback Controls"}</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {currentStepIndex + 1} / {steps.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-all cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border disabled:opacity-40 transition-all cursor-pointer"
                title="Previous Step"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>{lang === "bn" ? "পজ" : "Pause"}</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>{currentStepIndex >= steps.length - 1 ? (lang === "bn" ? "পুনরায় চালান" : "Replay") : (lang === "bn" ? "অটো-রান" : "Auto Play")}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentStepIndex >= steps.length - 1}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border disabled:opacity-40 transition-all cursor-pointer"
                title="Next Step"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Speed Selector */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>{lang === "bn" ? "গতি:" : "Speed:"}</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: "0.5x", val: 1800 },
                { label: "1.0x", val: 1100 },
                { label: "2.0x", val: 600 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSpeed(s.val)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                    speed === s.val
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                      : "bg-slate-900 border-slate-800 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
