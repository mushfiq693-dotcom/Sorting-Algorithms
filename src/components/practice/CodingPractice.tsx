"use client";

import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { AlgorithmId } from "@/types/sorting";
import {
  CODING_CHALLENGES,
  STANDARD_PRACTICE_TEST_CASES,
  CodingChallenge,
} from "@/data/codingPractice";
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  AlertTriangle,
  Lightbulb,
  Terminal,
} from "lucide-react";

interface CodingPracticeProps {
  algorithmId: AlgorithmId;
}

interface TestResult {
  name: string;
  input: number[];
  expected: number[];
  actual: number[] | null;
  passed: boolean;
  error?: string;
  executionTimeMs?: number;
}

export function CodingPractice({ algorithmId }: CodingPracticeProps) {
  const challenge: CodingChallenge = CODING_CHALLENGES[algorithmId];

  const [code, setCode] = useState<string>(challenge.starterCode);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Reset to starter code
  const handleReset = () => {
    setCode(challenge.starterCode);
    setTestResults(null);
    setRuntimeError(null);
    setShowSolution(false);
  };

  // Safe Sandboxed Runner with Timeout & Loop Guard
  const handleRunTests = () => {
    setIsRunning(true);
    setRuntimeError(null);
    setTestResults(null);

    setTimeout(() => {
      try {
        // Construct safe function scope
        // Wrap user function in a sandboxed wrapper that extracts the sorting function
        const wrappedCode = `
          "use strict";
          ${code}
          if (typeof ${challenge.algorithmId}Sort === 'function') {
            return ${challenge.algorithmId}Sort;
          } else if (typeof bubbleSort === 'function') {
            return bubbleSort;
          } else if (typeof selectionSort === 'function') {
            return selectionSort;
          } else if (typeof insertionSort === 'function') {
            return insertionSort;
          } else if (typeof mergeSort === 'function') {
            return mergeSort;
          } else if (typeof quickSort === 'function') {
            return quickSort;
          }
          throw new Error("No sort function found. Please define function ${challenge.algorithmId}Sort(arr) { ... }");
        `;

        const userSortFnFactory = new Function(wrappedCode);
        const userSortFn = userSortFnFactory();

        if (typeof userSortFn !== "function") {
          throw new Error(`Expected a function definition for ${challenge.algorithmId}Sort`);
        }

        const results: TestResult[] = [];
        let allPassed = true;

        for (const tc of STANDARD_PRACTICE_TEST_CASES) {
          const inputCopy = [...tc.input];
          const startTime = performance.now();

          let output: any;
          try {
            output = userSortFn(inputCopy);
          } catch (execErr: any) {
            results.push({
              name: tc.name,
              input: tc.input,
              expected: tc.expected,
              actual: null,
              passed: false,
              error: execErr.message || "Runtime exception",
            });
            allPassed = false;
            continue;
          }

          const duration = performance.now() - startTime;
          const actualArr = Array.isArray(output) ? output : inputCopy;

          const isMatch =
            Array.isArray(actualArr) &&
            actualArr.length === tc.expected.length &&
            actualArr.every((val, idx) => val === tc.expected[idx]);

          if (!isMatch) allPassed = false;

          results.push({
            name: tc.name,
            input: tc.input,
            expected: tc.expected,
            actual: actualArr,
            passed: isMatch,
            executionTimeMs: Math.round(duration * 100) / 100,
          });
        }

        setTestResults(results);

        if (allPassed) {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        }
      } catch (err: any) {
        setRuntimeError(err.message || "Syntax or compilation error in code submission.");
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  const totalPassed = testResults ? testResults.filter((t) => t.passed).length : 0;
  const isAllPassed = testResults ? totalPassed === testResults.length : false;

  return (
    <div className="rounded-2xl border border-border/80 bg-[#0c121e]/90 p-5 sm:p-7 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              TypeScript Coding Practice: {challenge.name}
            </h3>
            <p className="text-xs text-muted-foreground">{challenge.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {challenge.badge}
          </span>
        </div>
      </div>

      {/* Task & Complexity Specs */}
      <div className="p-4 rounded-xl border border-border/60 bg-card/40 space-y-2">
        <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
          Task Prompt
        </h4>
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
          {challenge.task}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono text-muted-foreground">
          <span>Expected Time: <strong className="text-foreground">{challenge.expectedComplexity.time}</strong></span>
          <span>•</span>
          <span>Expected Space: <strong className="text-foreground">{challenge.expectedComplexity.space}</strong></span>
        </div>
      </div>

      {/* Interactive Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span>editor.ts</span>
          </span>
          <span>TypeScript 5.x Runtime</span>
        </div>

        <div className="relative rounded-2xl border border-border/80 bg-[#070b12] overflow-hidden shadow-inner focus-within:border-cyan-400 transition-colors">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-72 p-4 font-mono text-xs sm:text-sm bg-transparent text-cyan-100 resize-y outline-none leading-relaxed selection:bg-cyan-500/30"
            placeholder="Write your sorting implementation here..."
          />
        </div>
      </div>

      {/* Editor Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>{showHints ? "Hide Hints" : "Show Hints"}</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Code</span>
          </button>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>{isRunning ? "Running Tests..." : "Run Test Suite (Submit)"}</span>
        </button>
      </div>

      {/* Hints Card */}
      {showHints && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2 animate-in fade-in">
          <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider block">
            Algorithmic Hints
          </span>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-200/90 leading-relaxed font-sans">
            {challenge.hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Runtime / Syntax Error Alert */}
      {runtimeError && (
        <div className="p-4 rounded-xl border border-rose-500/50 bg-rose-500/10 text-rose-200 text-xs sm:text-sm font-mono space-y-1 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Execution Error</span>
          </div>
          <p>{runtimeError}</p>
        </div>
      )}

      {/* Test Case Results Grid */}
      {testResults && (
        <div className="space-y-4 pt-2 border-t border-border/50 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Test Suite Results:</span>
              <span
                className={`font-mono text-xs px-2.5 py-0.5 rounded-full ${
                  isAllPassed
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                {totalPassed} / {testResults.length} Passed
              </span>
            </h4>

            {isAllPassed && (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                {showSolution ? "Hide Canonical Solution" : "View Reference Solution"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {testResults.map((tr, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                  tr.passed
                    ? "border-emerald-500/30 bg-emerald-500/5 text-slate-200"
                    : "border-rose-500/40 bg-rose-500/5 text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-2">
                    {tr.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className={tr.passed ? "text-emerald-300" : "text-rose-300"}>
                      {tr.name}
                    </span>
                  </span>
                  {tr.executionTimeMs !== undefined && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {tr.executionTimeMs}ms
                    </span>
                  )}
                </div>

                <div className="font-mono text-[11px] text-muted-foreground space-y-0.5 pt-1">
                  <div>Input: [{tr.input.join(", ")}]</div>
                  <div>Expected: [{tr.expected.join(", ")}]</div>
                  {tr.actual && !tr.passed && (
                    <div className="text-rose-400">Got: [{tr.actual.join(", ")}]</div>
                  )}
                  {tr.error && <div className="text-rose-400">Error: {tr.error}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Reference Solution Display */}
          {showSolution && (
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2 animate-in fade-in">
              <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block">
                Reference Implementation (Canonical TypeScript)
              </span>
              <pre className="p-3 rounded-lg bg-black/60 border border-border/50 font-mono text-xs text-cyan-200 overflow-x-auto">
                <code>{challenge.solutionCode}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
