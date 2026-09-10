"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

interface MemoryRow {
  index: number;
  info: string;
  link: number | null;
  description?: string;
}

const MEMORY_TABLE: MemoryRow[] = [
  { index: 1, info: "", link: null },
  { index: 2, info: "", link: null },
  { index: 3, info: "O", link: 6, description: "2nd character" },
  { index: 4, info: "T", link: 0, description: "7th character (End: LINK=0)" },
  { index: 5, info: "", link: null },
  { index: 6, info: "␣", link: 11, description: "3rd character (Blank space)" },
  { index: 7, info: "X", link: 10, description: "5th character" },
  { index: 8, info: "", link: null },
  { index: 9, info: "N", link: 3, description: "1st character (START=9)" },
  { index: 10, info: "I", link: 4, description: "6th character" },
  { index: 11, info: "E", link: 7, description: "4th character" },
  { index: 12, info: "", link: null },
];

const TRAVERSAL_SEQUENCE = [
  {
    step: 1,
    ptr: 9,
    char: "N",
    next: 3,
    builtString: "N",
    en: "START = 9. Read INFO[9] = 'N'. Next pointer LINK[9] = 3.",
    bn: "START = ৯। ১ম ক্যারেক্টার INFO[৯] = 'N' পড়া হলো। পরবর্তী পয়েন্টার LINK[৯] = ৩।",
  },
  {
    step: 2,
    ptr: 3,
    char: "O",
    next: 6,
    builtString: "NO",
    en: "Pointer moves to index 3. Read INFO[3] = 'O'. Next pointer LINK[3] = 6.",
    bn: "পয়েন্টার ৩ নম্বর ঘরে গেল। ২য় ক্যারেক্টার INFO[৩] = 'O'। পরবর্তী পয়েন্টার LINK[৩] = ৬।",
  },
  {
    step: 3,
    ptr: 6,
    char: " ",
    next: 11,
    builtString: "NO ",
    en: "Pointer moves to index 6. Read INFO[6] = ' ' (space). Next pointer LINK[6] = 11.",
    bn: "পয়েন্টার ৬ নম্বর ঘরে গেল। ৩য় ক্যারেক্টার INFO[৬] = ' ' (স্পেস)। পরবর্তী পয়েন্টার LINK[৬] = ১১।",
  },
  {
    step: 4,
    ptr: 11,
    char: "E",
    next: 7,
    builtString: "NO E",
    en: "Pointer moves to index 11. Read INFO[11] = 'E'. Next pointer LINK[11] = 7.",
    bn: "পয়েন্টার ১১ নম্বর ঘরে গেল। ৪র্থ ক্যারেক্টার INFO[১১] = 'E'। পরবর্তী পয়েন্টার LINK[১১] = ৭।",
  },
  {
    step: 5,
    ptr: 7,
    char: "X",
    next: 10,
    builtString: "NO EX",
    en: "Pointer moves to index 7. Read INFO[7] = 'X'. Next pointer LINK[7] = 10.",
    bn: "পয়েন্টার ৭ নম্বর ঘরে গেল। ৫ম ক্যারেক্টার INFO[৭] = 'X'। পরবর্তী পয়েন্টার LINK[৭] = ১০।",
  },
  {
    step: 6,
    ptr: 10,
    char: "I",
    next: 4,
    builtString: "NO EXI",
    en: "Pointer moves to index 10. Read INFO[10] = 'I'. Next pointer LINK[10] = 4.",
    bn: "পয়েন্টার ১০ নম্বর ঘরে গেল। ৬ষ্ঠ ক্যারেক্টার INFO[১০] = 'I'। পরবর্তী পয়েন্টার LINK[১০] = ৪।",
  },
  {
    step: 7,
    ptr: 4,
    char: "T",
    next: 0,
    builtString: "NO EXIT",
    en: "Pointer moves to index 4. Read INFO[4] = 'T'. Next pointer LINK[4] = 0 (NULL).",
    bn: "পয়েন্টার ৪ নম্বর ঘরে গেল। ৭ম ক্যারেক্টার INFO[৪] = 'T'। পরবর্তী পয়েন্টার LINK[৪] = ০ (NULL)।",
  },
  {
    step: 8,
    ptr: 0,
    char: "",
    next: 0,
    builtString: "NO EXIT",
    en: "LINK[4] = 0 signifies NULL termination. Traversal successfully completed: 'NO EXIT'.",
    bn: "LINK[৪] = ০ নির্দেশ করছে লিঙ্কড লিস্টের সমাপ্তি (NULL)। সম্পূর্ণ স্ট্রিং উদ্ধার: 'NO EXIT'!",
  },
];

export function LinkedListMemoryArrayStudio() {
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lang, setLang] = useState<"bn" | "en">("bn");

  const currentStep = TRAVERSAL_SEQUENCE[stepIdx];

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= TRAVERSAL_SEQUENCE.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-indigo-950/30 p-5 md:p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm">
            <Layers className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Memory Array Representation Studio (Lipschutz Example 5.2)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                INFO & LINK Arrays
              </span>
            </h4>
            <p className="text-xs text-muted-foreground">
              {lang === "bn"
                ? "মেমোরিতে ছড়ানো নোডগুলোকে START ও LINK পয়েন্টার দিয়ে ট্রাভার্স করে 'NO EXIT' স্ট্রিং উদ্ধার"
                : "Trace START and LINK pointers across memory arrays to reconstruct the string 'NO EXIT'"}
            </p>
          </div>
        </div>

        {/* Language Switch */}
        <button
          type="button"
          onClick={() => setLang(lang === "bn" ? "en" : "bn")}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-secondary/80 hover:bg-secondary border border-border text-foreground transition-all"
        >
          {lang === "bn" ? "🇧🇩 বাংলা" : "🇺🇸 English"}
        </button>
      </div>

      {/* Live String Output & START Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-muted-foreground">
            {lang === "bn" ? "শুরুর পয়েন্টার (START):" : "Start Pointer (START):"}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-bold text-sm">
            <span>START = 9</span>
          </div>
        </div>

        <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-muted-foreground">
            {lang === "bn" ? "উদ্ধারকৃত স্ট্রিং (Output):" : "Reconstructed String:"}
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-base px-3 py-1 rounded-lg bg-slate-950 border border-indigo-500/30 text-amber-300 tracking-widest">
            <span>"{currentStep.builtString}"</span>
            {stepIdx === TRAVERSAL_SEQUENCE.length - 1 && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans ml-2">
                ✓ Done
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Memory Table Layout */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 mb-5 overflow-x-auto">
        <div className="min-w-[500px]">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-muted-foreground text-left">
                <th className="py-2 px-3 w-16 text-center">INDEX</th>
                <th className="py-2 px-3 w-28 text-center bg-indigo-500/10 text-indigo-300">INFO (Data)</th>
                <th className="py-2 px-3 w-28 text-center bg-cyan-500/10 text-cyan-300">LINK (Pointer)</th>
                <th className="py-2 px-3 text-left">TRAVERSAL STATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MEMORY_TABLE.map((row) => {
                const isCurrent = row.index === currentStep.ptr;
                const isVisited =
                  TRAVERSAL_SEQUENCE.slice(0, stepIdx).some((s) => s.ptr === row.index) && !isCurrent;

                return (
                  <tr
                    key={row.index}
                    className={`transition-colors ${
                      isCurrent
                        ? "bg-indigo-500/20 font-bold"
                        : isVisited
                        ? "bg-slate-900/40 text-muted-foreground"
                        : "hover:bg-slate-900/20"
                    }`}
                  >
                    <td className="py-2 px-3 text-center text-muted-foreground font-bold">
                      <span className={`inline-block px-1.5 py-0.5 rounded ${isCurrent ? "bg-indigo-500 text-white" : ""}`}>
                        {row.index}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-sm">
                      {row.info ? (
                        <span className={`px-2 py-0.5 rounded ${isCurrent ? "bg-amber-500 text-slate-950" : "text-amber-300"}`}>
                          {row.info === "␣" ? "␣ (space)" : row.info}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center font-bold">
                      {row.link !== null ? (
                        <span className={`px-2 py-0.5 rounded ${row.link === 0 ? "text-rose-400 bg-rose-500/10" : "text-cyan-300"}`}>
                          {row.link === 0 ? "0 (NULL)" : row.link}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {isCurrent ? (
                        <div className="flex items-center gap-2 text-indigo-300 font-bold">
                          <ArrowRight className="h-3.5 w-3.5 animate-pulse text-amber-400" />
                          <span>
                            {lang === "bn" ? `বর্তমান নোড: ক্যারেক্টার '${row.info}'` : `Current Node: '${row.info}'`}
                          </span>
                        </div>
                      ) : isVisited ? (
                        <span className="text-emerald-400/70 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="h-3 w-3" /> {lang === "bn" ? "ভিজিট সম্পন্ন" : "Visited"}
                        </span>
                      ) : row.info ? (
                        <span className="text-muted-foreground/50 text-[11px]">{row.description}</span>
                      ) : (
                        <span className="text-muted-foreground/20 text-[11px] font-sans">
                          {lang === "bn" ? "খালি স্লট" : "Empty slot"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 mb-5 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-indigo-300 mr-1">
            {lang === "bn" ? `ধাপ ${stepIdx + 1}/${TRAVERSAL_SEQUENCE.length}:` : `Step ${stepIdx + 1}/${TRAVERSAL_SEQUENCE.length}:`}
          </span>
          {lang === "bn" ? currentStep.bn : currentStep.en}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx((prev) => Math.max(0, prev - 1));
            }}
            disabled={stepIdx === 0}
            className="p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary disabled:opacity-30 border border-border text-foreground transition-all"
            title="Previous Step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isPlaying
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-sm"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" /> {lang === "bn" ? "থামান" : "Pause"}
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> {lang === "bn" ? "অটোপ্লে" : "Auto-Play"}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx((prev) => Math.min(TRAVERSAL_SEQUENCE.length - 1, prev + 1));
            }}
            disabled={stepIdx >= TRAVERSAL_SEQUENCE.length - 1}
            className="p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary disabled:opacity-30 border border-border text-foreground transition-all"
            title="Next Step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx(0);
            }}
            className="p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all ml-1"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="text-xs font-mono font-semibold text-muted-foreground">
          Step <span className="text-foreground font-bold">{stepIdx + 1}</span> of {TRAVERSAL_SEQUENCE.length}
        </div>
      </div>
    </div>
  );
}
