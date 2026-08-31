"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Scissors,
  Search,
  PlusCircle,
  Trash2,
  RefreshCw,
  Layers,
  Code2,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";

export function StringOperationsVisualizer() {
  const [activeTab, setActiveTab] = useState<"operations" | "algorithms">("operations");

  // =========================================================================
  // STATE: OPERATIONS PLAYGROUND (0-based Indexing)
  // =========================================================================
  const [selectedOp, setSelectedOp] = useState<
    "substring" | "index" | "concat" | "insert" | "delete" | "replace"
  >("substring");

  // Operation Inputs
  const [rawStringS, setRawStringS] = useState<string>("TO BE OR NOT TO BE");
  const [subInitial, setSubInitial] = useState<number>(3); // 0-indexed (index 3 is 'B')
  const [subLength, setSubLength] = useState<number>(7);

  const [indexText, setIndexText] = useState<string>("HIS FATHER IS THE PROFESSOR");
  const [indexPattern, setIndexPattern] = useState<string>("THE");

  const [concatS1, setConcatS1] = useState<string>("MARK");
  const [concatS2, setConcatS2] = useState<string>("TWAIN");
  const [concatDelim, setConcatDelim] = useState<string>(" ");

  const [insertText, setInsertText] = useState<string>("ABCDEFG");
  const [insertPos, setInsertPos] = useState<number>(2); // 0-indexed
  const [insertStr, setInsertStr] = useState<string>("XYZ");

  const [deleteText, setDeleteText] = useState<string>("ABCDEFG");
  const [deletePos, setDeletePos] = useState<number>(3); // 0-indexed
  const [deleteLen, setDeleteLen] = useState<number>(2);

  const [replaceText, setReplaceText] = useState<string>("XABYABZ");
  const [replaceP1, setReplaceP1] = useState<string>("AB");
  const [replaceP2, setReplaceP2] = useState<string>("C");

  // Calculations for Playground (0-based)
  const subResult = useMemo(() => {
    const startIdx = Math.max(0, subInitial);
    return rawStringS.substring(startIdx, startIdx + Math.max(0, subLength));
  }, [rawStringS, subInitial, subLength]);

  const indexResult = useMemo(() => {
    if (!indexPattern) return -1;
    return indexText.indexOf(indexPattern); // 0-based index, -1 if not found
  }, [indexText, indexPattern]);

  const concatResult = useMemo(() => {
    return concatS1 + concatDelim + concatS2;
  }, [concatS1, concatS2, concatDelim]);

  const insertResult = useMemo(() => {
    const k = Math.max(0, Math.min(insertPos, insertText.length));
    const prefix = insertText.substring(0, k);
    const suffix = insertText.substring(k);
    return prefix + insertStr + suffix;
  }, [insertText, insertPos, insertStr]);

  const deleteResult = useMemo(() => {
    if (deletePos < 0 || deletePos >= deleteText.length) return deleteText;
    const prefix = deleteText.substring(0, deletePos);
    const suffix = deleteText.substring(deletePos + deleteLen);
    return prefix + suffix;
  }, [deleteText, deletePos, deleteLen]);

  const replaceResult = useMemo(() => {
    const k = replaceText.indexOf(replaceP1);
    if (k === -1) return replaceText;
    return replaceText.substring(0, k) + replaceP2 + replaceText.substring(k + replaceP1.length);
  }, [replaceText, replaceP1, replaceP2]);

  // =========================================================================
  // STATE: ALGORITHMS 3.1 & 3.2 SIMULATOR (0-based Indexing)
  // =========================================================================
  const [selectedAlgo, setSelectedAlgo] = useState<"algo31" | "algo32">("algo31");
  const [algoText, setAlgoText] = useState<string>("XAABBBY");
  const [algoP, setAlgoP] = useState<string>("AB");
  const [algoQ, setAlgoQ] = useState<string>("C");

  // Step-by-step trace generation
  type AlgoStep = {
    stepNum: number;
    description: string;
    currentText: string;
    indexK: number;
    pattern: string;
    replacement?: string;
    actionType: "init" | "find" | "delete" | "replace" | "done";
    highlightRange?: [number, number]; // [start0Idx, end0Idx]
  };

  const algoSteps = useMemo(() => {
    const steps: AlgoStep[] = [];
    let t = algoText;
    const p = algoP;
    const q = algoQ;

    if (!p) {
      steps.push({
        stepNum: 1,
        description: "Pattern P is empty. No operations performed.",
        currentText: t,
        indexK: -1,
        pattern: p,
        actionType: "done",
      });
      return steps;
    }

    if (selectedAlgo === "algo31") {
      // Algorithm 3.1: Delete every occurrence of P in T (0-based)
      let k = t.indexOf(p);
      let stepCount = 1;

      steps.push({
        stepNum: stepCount++,
        description: `Step 1: Compute initial INDEX(T, "${p}"). Found at index K = ${k}.`,
        currentText: t,
        indexK: k,
        pattern: p,
        actionType: "find",
        highlightRange: k !== -1 ? [k, k + p.length] : undefined,
      });

      let iteration = 1;
      while (k !== -1 && iteration <= 20) {
        // Delete operation
        const prefix = t.substring(0, k);
        const suffix = t.substring(k + p.length);
        const newT = prefix + suffix;

        steps.push({
          stepNum: stepCount++,
          description: `Iteration ${iteration}a: DELETE(T, ${k}, ${p.length}). Deleted "${p}" starting at index ${k}. String becomes "${newT}".`,
          currentText: newT,
          indexK: k,
          pattern: p,
          actionType: "delete",
        });

        t = newT;
        k = t.indexOf(p);

        steps.push({
          stepNum: stepCount++,
          description: `Iteration ${iteration}b: Update K := INDEX(T, "${p}"). ${
            k !== -1 ? `Pattern found again at index K = ${k}!` : `Pattern not found (K = -1). Loop terminates.`
          }`,
          currentText: t,
          indexK: k,
          pattern: p,
          actionType: "find",
          highlightRange: k !== -1 ? [k, k + p.length] : undefined,
        });

        iteration++;
      }

      steps.push({
        stepNum: stepCount++,
        description: `Step 3 & 4: Output final string T = "${t}". Algorithm finished.`,
        currentText: t,
        indexK: -1,
        pattern: p,
        actionType: "done",
      });
    } else {
      // Algorithm 3.2: Replace every occurrence of P in T by Q (0-based)
      let k = t.indexOf(p);
      let stepCount = 1;

      steps.push({
        stepNum: stepCount++,
        description: `Step 1: Compute initial INDEX(T, "${p}"). Found at index K = ${k}.`,
        currentText: t,
        indexK: k,
        pattern: p,
        replacement: q,
        actionType: "find",
        highlightRange: k !== -1 ? [k, k + p.length] : undefined,
      });

      let iteration = 1;
      while (k !== -1 && iteration <= 20) {
        const prefix = t.substring(0, k);
        const suffix = t.substring(k + p.length);
        const newT = prefix + q + suffix;

        steps.push({
          stepNum: stepCount++,
          description: `Iteration ${iteration}a: REPLACE(T, "${p}", "${q}"). Replaced "${p}" at index ${k} with "${q}". String becomes "${newT}".`,
          currentText: newT,
          indexK: k,
          pattern: p,
          replacement: q,
          actionType: "replace",
          highlightRange: [k, k + q.length],
        });

        t = newT;
        k = t.indexOf(p);

        steps.push({
          stepNum: stepCount++,
          description: `Iteration ${iteration}b: Update K := INDEX(T, "${p}"). ${
            k !== -1 ? `Found next occurrence at index K = ${k}.` : `Pattern "${p}" not found (K = -1). Loop ends.`
          }`,
          currentText: t,
          indexK: k,
          pattern: p,
          replacement: q,
          actionType: "find",
          highlightRange: k !== -1 ? [k, k + p.length] : undefined,
        });

        iteration++;
      }

      steps.push({
        stepNum: stepCount++,
        description: `Step 3 & 4: Output final string T = "${t}". Algorithm finished.`,
        currentText: t,
        indexK: -1,
        pattern: p,
        replacement: q,
        actionType: "done",
      });
    }

    return steps;
  }, [selectedAlgo, algoText, algoP, algoQ]);

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlayingAlgo, setIsPlayingAlgo] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlayingAlgo(false);
  }, [selectedAlgo, algoText, algoP, algoQ]);

  useEffect(() => {
    if (isPlayingAlgo) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= algoSteps.length - 1) {
            setIsPlayingAlgo(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingAlgo, algoSteps.length]);

  const activeStep = algoSteps[currentStepIdx] || algoSteps[0];

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-[#060e1e]/95 text-foreground overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-background border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 shrink-0">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Chapter 3 Laboratory
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                0-Based Indexing Standard
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight mt-1">
              Interactive String Operations & Trace Studio
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary/80 rounded-2xl border border-border/80 text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveTab("operations")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "operations"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>1. Core String Operations</span>
          </button>
          <button
            onClick={() => setActiveTab("algorithms")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "algorithms"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>2. Algorithm 3.1 & 3.2 Simulator</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OPERATIONS PLAYGROUND (0-based Indexing) */}
      {/* ========================================================================= */}
      {activeTab === "operations" && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Operation Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "substring", label: "SUBSTRING(S, K, L)", icon: Scissors },
              { id: "index", label: "INDEX(T, P)", icon: Search },
              { id: "concat", label: "CONCAT (S1 // S2)", icon: PlusCircle },
              { id: "insert", label: "INSERT(T, K, S)", icon: PlusCircle },
              { id: "delete", label: "DELETE(T, K, L)", icon: Trash2 },
              { id: "replace", label: "REPLACE(T, P1, P2)", icon: RefreshCw },
            ].map((op) => {
              const Icon = op.icon;
              const isSelected = selectedOp === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => setSelectedOp(op.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all active:scale-95 ${
                    isSelected
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400"
                      : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{op.label}</span>
                </button>
              );
            })}
          </div>

          {/* Operation Controls & Visual Box */}
          <div className="rounded-2xl border border-border/80 bg-black/50 p-6 space-y-5">
            {/* SUBSTRING */}
            {selectedOp === "substring" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="space-y-1 sm:col-span-3">
                    <span className="text-muted-foreground">Source String S:</span>
                    <input
                      type="text"
                      value={rawStringS}
                      onChange={(e) => setRawStringS(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Initial Position K (0-based):</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, rawStringS.length - 1)}
                        value={subInitial}
                        onChange={(e) => setSubInitial(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <span className="font-bold text-cyan-400 w-6 text-right">{subInitial}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Length L:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, rawStringS.length - subInitial)}
                        value={subLength}
                        onChange={(e) => setSubLength(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <span className="font-bold text-cyan-400 w-6 text-right">{subLength}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Quick Preset:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRawStringS("TO BE OR NOT TO BE");
                          setSubInitial(3); // 0-based index 3 is 'B'
                          setSubLength(7);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-[11px] text-cyan-300 hover:bg-secondary/80 font-mono"
                      >
                        Ex 3.3(a) [K=3, L=7]
                      </button>
                      <button
                        onClick={() => {
                          setRawStringS("THE END");
                          setSubInitial(3); // 0-based index 3 is ' '
                          setSubLength(4);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-[11px] text-cyan-300 hover:bg-secondary/80 font-mono"
                      >
                        Ex 3.3(b) [K=3, L=4]
                      </button>
                    </div>
                  </div>
                </div>

                {/* 0-indexed Character Visual Array */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Character Index Map (0-based Indexing):</span>
                    <span className="text-cyan-400">Index range: 0 to {rawStringS.length - 1}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono overflow-x-auto pb-2">
                    {rawStringS.split("").map((ch, idx) => {
                      const isHighlighted = idx >= subInitial && idx < subInitial + subLength;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center justify-center min-w-[28px] h-12 rounded-lg border text-xs transition-all ${
                            isHighlighted
                              ? "border-cyan-400 bg-cyan-950/50 text-cyan-200 font-black ring-2 ring-cyan-500/30 scale-105 shadow-md shadow-cyan-500/20"
                              : "border-border/60 bg-secondary/30 text-muted-foreground"
                          }`}
                        >
                          <span className="text-foreground text-sm font-bold">
                            {ch === " " ? "␣" : ch}
                          </span>
                          <span className="text-[9px] text-muted-foreground">{idx}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Result Display */}
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                  <div>
                    <span className="text-xs text-muted-foreground">Computed Expression:</span>
                    <div className="text-sm font-bold text-white mt-0.5">
                      SUBSTRING(&apos;{rawStringS}&apos;, {subInitial}, {subLength})
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-base">
                    Result: &apos;{subResult}&apos;
                  </div>
                </div>
              </div>
            )}

            {/* INDEX */}
            {selectedOp === "index" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Text T:</span>
                    <input
                      type="text"
                      value={indexText}
                      onChange={(e) => setIndexText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Pattern P:</span>
                    <input
                      type="text"
                      value={indexPattern}
                      onChange={(e) => setIndexPattern(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                </div>

                {/* 0-indexed Character Map */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Matching Visualizer (0-based Indexing):</span>
                    <span className="text-emerald-400">
                      {indexResult !== -1 ? `Match starts at index ${indexResult}` : "No match (-1)"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono overflow-x-auto pb-2">
                    {indexText.split("").map((ch, idx) => {
                      const isMatch =
                        indexResult !== -1 &&
                        idx >= indexResult &&
                        idx < indexResult + indexPattern.length;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center justify-center min-w-[28px] h-12 rounded-lg border text-xs transition-all ${
                            isMatch
                              ? "border-emerald-400 bg-emerald-950/60 text-emerald-200 font-black ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20 scale-105"
                              : "border-border/60 bg-secondary/30 text-muted-foreground"
                          }`}
                        >
                          <span className="text-foreground text-sm font-bold">
                            {ch === " " ? "␣" : ch}
                          </span>
                          <span className="text-[9px] text-muted-foreground">{idx}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Result */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                  <div>
                    <span className="text-xs text-muted-foreground">Computed Expression:</span>
                    <div className="text-sm font-bold text-white mt-0.5">
                      INDEX(&apos;{indexText}&apos;, &apos;{indexPattern}&apos;)
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-base">
                    Index Result: {indexResult} {indexResult === -1 ? "(Not Found: -1)" : `(Found at index ${indexResult})`}
                  </div>
                </div>
              </div>
            )}

            {/* CONCAT */}
            {selectedOp === "concat" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">String S1:</span>
                    <input
                      type="text"
                      value={concatS1}
                      onChange={(e) => setConcatS1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Delimiter (optional):</span>
                    <input
                      type="text"
                      value={concatDelim}
                      onChange={(e) => setConcatDelim(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">String S2:</span>
                    <input
                      type="text"
                      value={concatS2}
                      onChange={(e) => setConcatS2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                  <div>
                    <span className="text-xs text-muted-foreground">Concatenation Formula:</span>
                    <div className="text-sm font-bold text-white mt-0.5">
                      S1 // &apos;{concatDelim}&apos; // S2
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-base">
                    Result: &apos;{concatResult}&apos; (Length: {concatResult.length})
                  </div>
                </div>
              </div>
            )}

            {/* INSERT */}
            {selectedOp === "insert" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Original Text T:</span>
                    <input
                      type="text"
                      value={insertText}
                      onChange={(e) => setInsertText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Insert Index K (0-based):</span>
                    <input
                      type="number"
                      min={0}
                      max={insertText.length}
                      value={insertPos}
                      onChange={(e) => setInsertPos(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Inserted String S:</span>
                    <input
                      type="text"
                      value={insertStr}
                      onChange={(e) => setInsertStr(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2 font-mono text-xs">
                  <div className="text-amber-300 font-bold">
                    0-Based Substring Formula:
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    INSERT(T, K, S) = SUBSTRING(T, 0, {insertPos}) // &apos;{insertStr}&apos; // SUBSTRING(T, {insertPos}, {insertText.length - insertPos})
                  </div>
                  <div className="pt-2 text-base font-black text-white">
                    Result: <span className="text-amber-400">&apos;{insertResult}&apos;</span>
                  </div>
                </div>
              </div>
            )}

            {/* DELETE */}
            {selectedOp === "delete" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Original Text T:</span>
                    <input
                      type="text"
                      value={deleteText}
                      onChange={(e) => setDeleteText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Delete Start Index K (0-based):</span>
                    <input
                      type="number"
                      min={0}
                      max={deleteText.length - 1}
                      value={deletePos}
                      onChange={(e) => setDeletePos(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Delete Length L:</span>
                    <input
                      type="number"
                      min={1}
                      max={deleteText.length - deletePos}
                      value={deleteLen}
                      onChange={(e) => setDeleteLen(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2 font-mono text-xs">
                  <div className="text-rose-300 font-bold">
                    0-Based Substring Formula:
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    DELETE(T, K, L) = SUBSTRING(T, 0, {deletePos}) // SUBSTRING(T, {deletePos + deleteLen}, {deleteText.length - deletePos - deleteLen})
                  </div>
                  <div className="pt-2 text-base font-black text-white">
                    Result: <span className="text-rose-400">&apos;{deleteResult}&apos;</span>
                  </div>
                </div>
              </div>
            )}

            {/* REPLACE */}
            {selectedOp === "replace" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Text T:</span>
                    <input
                      type="text"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Target Pattern P1:</span>
                    <input
                      type="text"
                      value={replaceP1}
                      onChange={(e) => setReplaceP1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Replacement P2:</span>
                    <input
                      type="text"
                      value={replaceP2}
                      onChange={(e) => setReplaceP2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-sm text-foreground"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2 font-mono text-xs">
                  <div className="text-cyan-300 font-bold">
                    0-Based Steps: (1) K = INDEX(T, P1) ➔ (2) DELETE(T, K, len) ➔ (3) INSERT(T, K, P2)
                  </div>
                  <div className="pt-2 text-base font-black text-white">
                    Result: <span className="text-cyan-400">&apos;{replaceResult}&apos;</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALGORITHM 3.1 & 3.2 SIMULATOR (0-based Indexing) */}
      {/* ========================================================================= */}
      {activeTab === "algorithms" && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Preset Buttons & Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-secondary/30 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedAlgo("algo31")}
                className={`px-3 py-1.5 rounded-xl border transition-all ${
                  selectedAlgo === "algo31"
                    ? "bg-cyan-500 text-white font-bold border-cyan-400"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Algorithm 3.1 (Delete All P)
              </button>
              <button
                onClick={() => setSelectedAlgo("algo32")}
                className={`px-3 py-1.5 rounded-xl border transition-all ${
                  selectedAlgo === "algo32"
                    ? "bg-cyan-500 text-white font-bold border-cyan-400"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Algorithm 3.2 (Replace All P with Q)
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-[11px]">Presets:</span>
              <button
                onClick={() => {
                  setSelectedAlgo("algo31");
                  setAlgoText("XAABBBY");
                  setAlgoP("AB");
                }}
                className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-cyan-300 text-[11px]"
              >
                Ex 3.7(b) [Cascading Collapse]
              </button>
              <button
                onClick={() => {
                  setSelectedAlgo("algo31");
                  setAlgoText("XABYABZ");
                  setAlgoP("AB");
                }}
                className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-cyan-300 text-[11px]"
              >
                Ex 3.7(a) [Double Occur]
              </button>
            </div>
          </div>

          {/* Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground">Input Text T:</span>
              <input
                type="text"
                value={algoText}
                onChange={(e) => setAlgoText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-mono text-foreground"
              />
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Target Pattern P:</span>
              <input
                type="text"
                value={algoP}
                onChange={(e) => setAlgoP(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-mono text-foreground"
              />
            </div>
            {selectedAlgo === "algo32" && (
              <div className="space-y-1">
                <span className="text-muted-foreground">Replacement Q:</span>
                <input
                  type="text"
                  value={algoQ}
                  onChange={(e) => setAlgoQ(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-mono text-foreground"
                />
              </div>
            )}
          </div>

          {/* Visual Execution Arena */}
          <div className="rounded-2xl border border-border/80 bg-black/60 p-6 space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" />
                <span>Live State: Step {activeStep.stepNum} / {algoSteps.length}</span>
              </span>
              <span className="text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                Index K = {activeStep.indexK} {activeStep.indexK === -1 ? "(Terminated)" : ""}
              </span>
            </div>

            {/* Visual String representation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Current String State (0-based Index):</span>
                <span>Length: {activeStep.currentText.length}</span>
              </div>
              <div className="flex flex-wrap gap-2 py-2">
                {activeStep.currentText.split("").map((ch, idx) => {
                  const isHighlighted =
                    activeStep.highlightRange &&
                    idx >= activeStep.highlightRange[0] &&
                    idx < activeStep.highlightRange[1];

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center min-w-[36px] h-14 rounded-xl border text-sm font-bold transition-all duration-300 ${
                        isHighlighted
                          ? "border-amber-400 bg-amber-950/60 text-amber-200 ring-4 ring-amber-500/30 scale-110 shadow-xl shadow-amber-500/20"
                          : "border-border/70 bg-secondary/40 text-foreground"
                      }`}
                    >
                      <span>{ch === " " ? "␣" : ch}</span>
                      <span className="text-[9px] text-muted-foreground font-normal">{idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Explanation Banner */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-xs text-foreground flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>{activeStep.description}</span>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlayingAlgo(false);
                  setCurrentStepIdx(0);
                }}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlayingAlgo(false);
                  setCurrentStepIdx((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  if (currentStepIdx >= algoSteps.length - 1) {
                    setCurrentStepIdx(0);
                  }
                  setIsPlayingAlgo(!isPlayingAlgo);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
              >
                {isPlayingAlgo ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>{currentStepIdx >= algoSteps.length - 1 ? "Replay Trace" : "Play Trace"}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsPlayingAlgo(false);
                  setCurrentStepIdx((prev) => Math.min(algoSteps.length - 1, prev + 1));
                }}
                disabled={currentStepIdx >= algoSteps.length - 1}
                className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-all active:scale-95"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              Total Steps: <span className="font-bold text-cyan-400">{algoSteps.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
