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
  ShieldAlert,
} from "lucide-react";

interface StepState {
  k: number;
  loc: number | null;
  comparisons: number;
  status: "init" | "comparing" | "match" | "next" | "sentinel_found" | "not_found";
  codeLine: number;
  explanationEn: string;
  explanationBn: string;
}

const DEFAULT_ARRAY = [22, 55, 11, 88, 33, 77, 44, 66, 99, 50];

export function LinearSearchStudio() {
  const [array] = useState<number[]>(DEFAULT_ARRAY);
  const [target, setTarget] = useState<number>(77);
  const [inputVal, setInputVal] = useState<string>("77");
  const [useSentinel, setUseSentinel] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Array with optional Sentinel at DATA[n+1]
  const displayArray = useMemo(() => {
    if (useSentinel) {
      return [...array, target];
    }
    return array;
  }, [array, target, useSentinel]);

  const maxValInArray = useMemo(() => Math.max(...displayArray, 1), [displayArray]);

  // Compute all step states
  const steps: StepState[] = useMemo(() => {
    const list: StepState[] = [];
    const n = array.length;

    if (useSentinel) {
      // Sentinel Linear Search (Lipschutz Section 4.7 / Algorithm 4.5)
      // 1. [Insert ITEM at end] DATA[n+1] := ITEM
      // 2. Set LOC := 1
      // 3. While DATA[LOC] != ITEM do: LOC := LOC + 1
      // 4. If LOC = n+1 then LOC := 0 (Unsuccessful)
      let loc = 1;
      let comps = 0;

      list.push({
        k: 1,
        loc: 1,
        comparisons: 0,
        status: "init",
        codeLine: 1,
        explanationEn: `Sentinel Setup: Placed sentinel DATA[${n + 1}] = ${target} at the end of the array to eliminate loop boundary testing! Initialized LOC := 1.`,
        explanationBn: `সেন্টিনেল অপ্টিমাইজেশন: লুপের বাউন্ডারি চেক এড়াতে অ্যারের শেষে DATA[${n + 1}] = ${target} যুক্ত করা হলো। পয়েন্টার LOC := ১ সেট করা হলো।`,
      });

      while (loc <= n + 1) {
        comps++;
        const currentVal = loc <= n ? array[loc - 1] : target;

        list.push({
          k: loc,
          loc: loc,
          comparisons: comps,
          status: "comparing",
          codeLine: 3,
          explanationEn: `Step ${comps}: Comparing DATA[${loc}] (${currentVal}) with ITEM (${target}).`,
          explanationBn: `ধাপ ${comps}: DATA[${loc}] (${currentVal}) এর সাথে টার্গেট ITEM (${target}) তুলনা করা হচ্ছে।`,
        });

        if (currentVal === target) {
          if (loc <= n) {
            list.push({
              k: loc,
              loc: loc,
              comparisons: comps,
              status: "match",
              codeLine: 4,
              explanationEn: `SUCCESSFUL SEARCH! ITEM (${target}) found in valid data array at location LOC = ${loc} after ${comps} comparison(s).`,
              explanationBn: `সফল অনুসন্ধান! টার্গেট ITEM (${target}) মূল অ্যারের LOC = ${loc} নম্বর ঘরে পাওয়া গেছে (${comps}টি তুলনার পর)।`,
            });
          } else {
            list.push({
              k: loc,
              loc: 0,
              comparisons: comps,
              status: "sentinel_found",
              codeLine: 4,
              explanationEn: `UNSUCCESSFUL SEARCH: Only the sentinel DATA[${n + 1}] matched! Target does not exist in original data. LOC := 0 / NULL (after ${comps} comparisons = n + 1).`,
              explanationBn: `অসফল অনুসন্ধান: মূল অ্যারেতে টার্গেট নেই, কেবল সেন্টিনেল মান DATA[${n + 1}] মিলেছে। তাই LOC := 0 / NULL (${comps}টি তুলনা = n + ১)।`,
            });
          }
          return list;
        }

        loc++;
      }
    } else {
      // Standard Linear Search
      let comps = 0;
      let found = false;

      list.push({
        k: 1,
        loc: 1,
        comparisons: 0,
        status: "init",
        codeLine: 1,
        explanationEn: `Standard Linear Search initialized. Searching for ITEM = ${target} across n = ${n} elements. Initialized LOC := 1.`,
        explanationBn: `স্ট্যান্ডার্ড লিনিয়ার সার্চ শুরু: মোট n = ${n} টি উপাদানের মধ্যে টার্গেট ITEM = ${target} খোঁজা হচ্ছে। প্রারম্ভিক LOC := ১।`,
      });

      for (let i = 1; i <= n; i++) {
        comps++;
        const currentVal = array[i - 1];

        list.push({
          k: i,
          loc: i,
          comparisons: comps,
          status: "comparing",
          codeLine: 2,
          explanationEn: `Step ${comps}: Examining DATA[${i}] = ${currentVal}. Comparing with target ${target}.`,
          explanationBn: `ধাপ ${comps}: DATA[${i}] = ${currentVal} পর্যবেক্ষণ করা হচ্ছে। টার্গেট ${target} এর সাথে তুলনা হচ্ছে।`,
        });

        if (currentVal === target) {
          list.push({
            k: i,
            loc: i,
            comparisons: comps,
            status: "match",
            codeLine: 3,
            explanationEn: `MATCH FOUND! DATA[${i}] == ${target}. Target located at index LOC = ${i} in ${comps} comparison(s).`,
            explanationBn: `কাঙ্ক্ষিত সংখ্যা পাওয়া গেছে! DATA[${i}] == ${target}। সফল অনুসন্ধান, লোকেশন LOC = ${i} (${comps}টি তুলনা)।`,
          });
          found = true;
          break;
        }
      }

      if (!found) {
        list.push({
          k: n + 1,
          loc: 0,
          comparisons: comps,
          status: "not_found",
          codeLine: 5,
          explanationEn: `Search space exhausted after checking all ${n} elements. ITEM = ${target} is NOT present in DATA. LOC := 0 (Worst Case O(n)).`,
          explanationBn: `সবগুলো ${n}টি উপাদান স্ক্যান করার পরও ${target} পাওয়া যায়নি। LOC := 0 (Worst Case O(n), অসফল অনুসন্ধান)।`,
        });
      }
    }

    return list;
  }, [array, target, useSentinel]);

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
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-emerald-950/30 p-5 md:p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
            <Search className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Interactive Linear Search Studio (Algorithm 4.5 & Section 4.7)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                O(n)
              </span>
            </h4>
            <p className="text-xs text-muted-foreground">
              {lang === "bn"
                ? "অ্যারে বার্স (Array Bars) এর মাধ্যমে ক্রমান্বয়ে স্ক্যানিং ও সেন্টিনেল অপ্টিমাইজেশন পর্যবেক্ষণ করুন"
                : "Observe sequential traversal, comparisons counter, and sentinel element optimization"}
            </p>
          </div>
        </div>

        {/* Mode Toggle & Language Switch */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setUseSentinel(!useSentinel);
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              useSentinel
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{useSentinel ? (lang === "bn" ? "সেন্টিনেল মোড: সক্রিয়" : "Sentinel Mode: ON") : (lang === "bn" ? "সেন্টিনেল মোড" : "Sentinel Mode")}</span>
          </button>

          <button
            type="button"
            onClick={() => setLang(lang === "bn" ? "en" : "bn")}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-secondary/80 hover:bg-secondary border border-border text-foreground transition-all cursor-pointer shadow-sm"
          >
            {lang === "bn" ? "🇧🇩 বাংলা" : "🇺🇸 English"}
          </button>
        </div>
      </div>

      {/* Target Selection & Complexity Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
        <span className="text-xs font-semibold text-muted-foreground mr-1">
          {lang === "bn" ? "কেস প্রিসেট:" : "Case Presets:"}
        </span>

        <button
          type="button"
          onClick={() => handleApplyTarget(22)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            target === 22
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
              : "bg-secondary/60 hover:bg-secondary text-foreground/80 border-border"
          }`}
        >
          {lang === "bn" ? "Best Case: 22 (১ম ঘরে, ১ তুলনা)" : "Best Case: 22 (1st element)"}
        </button>

        <button
          type="button"
          onClick={() => handleApplyTarget(77)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            target === 77
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
              : "bg-secondary/60 hover:bg-secondary text-foreground/80 border-border"
          }`}
        >
          {lang === "bn" ? "Average Case: 77 (৬ষ্ঠ ঘরে)" : "Average Case: 77 (6th element)"}
        </button>

        <button
          type="button"
          onClick={() => handleApplyTarget(50)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            target === 50
              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50"
              : "bg-secondary/60 hover:bg-secondary text-foreground/80 border-border"
          }`}
        >
          {lang === "bn" ? "Worst Found: 50 (১০ম ঘরে)" : "Worst Found: 50 (10th element)"}
        </button>

        <button
          type="button"
          onClick={() => handleApplyTarget(999)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            target === 999
              ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
              : "bg-secondary/60 hover:bg-secondary text-foreground/80 border-border"
          }`}
        >
          {lang === "bn" ? "Worst Absent: 999 (অসফল, n+1 তুলনা)" : "Absent: 999 (Worst Case)"}
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
            className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-border text-xs text-foreground font-mono text-center focus:outline-none focus:border-emerald-500"
            placeholder="Target"
          />
          <button
            type="button"
            onClick={() => {
              const parsed = parseInt(inputVal, 10);
              if (!isNaN(parsed)) handleApplyTarget(parsed);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm cursor-pointer"
          >
            {lang === "bn" ? "সার্চ" : "Search"}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VERTICAL ARRAY BARS VISUALIZER CANVAS */}
      {/* ========================================================================= */}
      <div className="relative p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/30 mb-5 overflow-hidden shadow-inner">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-36 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full overflow-x-auto pb-2">
          {/* Array Bars Flex Container */}
          <div className="min-w-[620px] flex items-end justify-between gap-2 sm:gap-3 h-56 pt-8 pb-3">
            {displayArray.map((val, idx) => {
              const pos = idx + 1;
              const isSentinelSlot = useSentinel && pos === array.length + 1;
              const isCurrentK = currentStep.k === pos;
              const isMatch = isCurrentK && (currentStep.status === "match" || currentStep.status === "sentinel_found");
              const isPastScanned = pos < currentStep.k;

              // Proportional Bar Height (Minimum 22% for visibility, up to 88%)
              const heightPercent = Math.max(22, Math.round((val / maxValInArray) * 88));

              return (
                <div
                  key={idx}
                  className={`group relative flex-1 flex flex-col items-center justify-end h-full max-w-[58px] transition-all duration-300 ${
                    isPastScanned && !isMatch ? "opacity-45" : "opacity-100"
                  }`}
                >
                  {/* Top Pointer Badges (LOC / MATCH / SENTINEL) */}
                  <div className="h-8 flex flex-col items-center justify-end mb-1.5 font-mono text-[9px] pointer-events-none">
                    {isMatch ? (
                      <span className={`px-1.5 py-0.5 rounded-full font-black tracking-wider text-[10px] shadow-lg animate-bounce flex items-center gap-0.5 ${
                        isSentinelSlot
                          ? "bg-rose-500 text-white shadow-rose-500/50"
                          : "bg-emerald-500 text-slate-950 shadow-emerald-500/50"
                      }`}>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{isSentinelSlot ? "SENTINEL" : `LOC=${pos}`}</span>
                      </span>
                    ) : isCurrentK ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black tracking-wider text-[9px] shadow-md shadow-amber-500/40 animate-pulse border border-amber-300">
                        LOC={pos}
                      </span>
                    ) : isSentinelSlot ? (
                      <span className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[8px]">
                        SENTINEL
                      </span>
                    ) : null}
                  </div>

                  {/* The Vertical Array Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-xl border transition-all duration-300 flex flex-col items-center justify-between p-1.5 shadow-md relative ${
                      isMatch
                        ? isSentinelSlot
                          ? "bg-gradient-to-t from-rose-600 via-rose-500 to-rose-400 border-rose-300 ring-4 ring-rose-500/40 text-white font-black shadow-rose-500/50 scale-105"
                          : "bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 border-emerald-300 ring-4 ring-emerald-500/40 text-slate-950 font-black shadow-emerald-500/50 scale-105"
                        : isCurrentK
                        ? "bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 border-amber-200 ring-4 ring-amber-400/40 text-slate-950 font-black shadow-amber-500/40 scale-105"
                        : isSentinelSlot
                        ? "bg-gradient-to-t from-amber-950/60 via-amber-900/60 to-amber-700/60 border-amber-500/50 text-amber-200 border-dashed"
                        : isPastScanned
                        ? "bg-slate-900/70 border-slate-800 text-slate-400"
                        : "bg-gradient-to-t from-emerald-950/70 via-emerald-800/60 to-teal-600/70 border-emerald-500/40 text-white font-bold hover:brightness-110"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs sm:text-sm font-extrabold drop-shadow-sm ${
                        isMatch || isCurrentK ? "text-slate-950 font-black" : "text-white"
                      }`}
                    >
                      {val}
                    </span>
                  </div>

                  {/* Index Indicator (1-indexed matching Lipschutz) */}
                  <div className="flex flex-col items-center text-center mt-2">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isCurrentK
                          ? "text-amber-400"
                          : isSentinelSlot
                          ? "text-amber-300"
                          : "text-slate-400"
                      }`}
                    >
                      [{pos}]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complexity HUD & Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-[11px] text-muted-foreground border-t border-slate-800/80 pt-3 font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
                <span className="text-emerald-400 font-bold">
                  {lang === "bn" ? "মোট তুলনা:" : "Comparisons:"} {currentStep.comparisons} / {array.length}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block shadow-sm" />
                <span className="text-amber-400 font-bold">
                  {lang === "bn" ? "গড় প্রত্যাশিত:" : "Average Expected:"} (n+1)/2 = {( (array.length + 1) / 2 ).toFixed(1)}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block shadow-sm" />
                <span className="text-rose-400 font-bold">
                  {lang === "bn" ? "সর্বোচ্চ (Worst):" : "Worst Case:"} {useSentinel ? "n + 1" : "n"} = {useSentinel ? array.length + 1 : array.length}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{lang === "bn" ? "টার্গেট সংখ্যা:" : "Search Target:"}</span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold font-mono text-xs">
                ITEM = {target}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200 mb-5 flex items-start gap-3 shadow-md">
        {currentStep.status === "match" ? (
          <Award className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : currentStep.status === "sentinel_found" || currentStep.status === "not_found" ? (
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div>
          <div className="font-bold text-emerald-300 mb-0.5">
            {lang === "bn"
              ? `ধাপ ${currentStepIndex + 1} / ${steps.length} — ${
                  currentStep.status === "match"
                    ? "টার্গেট পাওয়া গেছে"
                    : currentStep.status === "sentinel_found" || currentStep.status === "not_found"
                    ? "টার্গেট অনুপস্থিত (Worst Case)"
                    : "এলিমেন্ট স্ক্যান ও তুলনা"
                }`
              : `Step ${currentStepIndex + 1} / ${steps.length} — ${
                  currentStep.status === "match"
                    ? "Match Located"
                    : currentStep.status === "sentinel_found" || currentStep.status === "not_found"
                    ? "Target Absent"
                    : "Sequential Scan"
                }`}
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            {lang === "bn" ? currentStep.explanationBn : currentStep.explanationEn}
          </p>
        </div>
      </div>

      {/* Algorithm 4.5 Pseudocode Line Tracker & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Algorithm Pseudocode Sync (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs text-slate-300 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              Algorithm 4.5 Execution Sync (LINEAR)
            </span>
            <span className="text-[10px] text-muted-foreground">{useSentinel ? "Sentinel Mode" : "Standard Mode"}</span>
          </div>

          {useSentinel ? (
            [
              { line: 1, text: "1. [Insert ITEM at end] Set DATA[N + 1] := ITEM." },
              { line: 2, text: "2. [Initialize] Set LOC := 1." },
              { line: 3, text: "3. [Search] Repeat while DATA[LOC] != ITEM: Set LOC := LOC + 1." },
              { line: 4, text: "4. [Successful?] If LOC = N + 1, then Set LOC := 0; Else Output LOC." },
              { line: 5, text: "5. Exit." },
            ].map((code) => {
              const isActive =
                (currentStep.codeLine === 1 && code.line <= 2) ||
                (currentStep.codeLine === 3 && code.line === 3) ||
                (currentStep.codeLine === 4 && code.line >= 4);

              return (
                <div
                  key={code.line}
                  className={`px-2.5 py-1 rounded transition-all flex items-center justify-between ${
                    isActive
                      ? currentStep.status === "match"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                        : currentStep.status === "sentinel_found"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                        : "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-bold"
                      : "hover:bg-slate-900/50"
                  }`}
                >
                  <span>{code.text}</span>
                  {isActive && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            [
              { line: 1, text: "1. [Initialize] Set LOC := 1." },
              { line: 2, text: "2. Repeat Steps 3 and 4 while LOC <= N:" },
              { line: 3, text: "3.   If DATA[LOC] = ITEM, then Exit with LOC." },
              { line: 4, text: "4.   Set LOC := LOC + 1. [End of Step 2 loop]" },
              { line: 5, text: "5. [Unsuccessful] Set LOC := 0. Exit." },
            ].map((code) => {
              const isActive =
                (currentStep.codeLine === 1 && code.line === 1) ||
                (currentStep.codeLine === 2 && (code.line === 2 || code.line === 4)) ||
                (currentStep.codeLine === 3 && code.line === 3) ||
                (currentStep.codeLine === 5 && code.line === 5);

              return (
                <div
                  key={code.line}
                  className={`px-2.5 py-1 rounded transition-all flex items-center justify-between ${
                    isActive
                      ? currentStep.status === "match"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                        : currentStep.status === "not_found"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                        : "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-bold"
                      : "hover:bg-slate-900/50"
                  }`}
                >
                  <span>{code.text}</span>
                  {isActive && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Playback Controls & Speed (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between gap-3 shadow-sm">
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2 font-mono flex items-center justify-between">
              <span>{lang === "bn" ? "প্লেব্যাক কন্ট্রোল" : "Playback Controls"}</span>
              <span className="text-[10px] text-emerald-400 font-mono">
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
                className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
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
                { label: "0.5x", val: 1600 },
                { label: "1.0x", val: 1000 },
                { label: "2.0x", val: 500 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSpeed(s.val)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                    speed === s.val
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
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
