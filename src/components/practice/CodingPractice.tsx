"use client";

import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { AlgorithmId, SortingAlgorithmId } from "@/types/sorting";
import {
  CODING_CHALLENGES,
  STANDARD_PRACTICE_TEST_CASES,
  CodingChallenge,
} from "@/data/codingPractice";
import {
  executeCodeInWorker,
  TestResult,
} from "@/lib/codeWorkerRunner";
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Terminal,
} from "lucide-react";

interface CodingPracticeProps {
  algorithmId: AlgorithmId;
}

export function CodingPractice({ algorithmId }: CodingPracticeProps) {
  const challenge = CODING_CHALLENGES[algorithmId as SortingAlgorithmId];

  const [code, setCode] = useState<string>(challenge?.starterCode || "");
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Keep track of active Web Worker instance for safe termination and cleanup
  const activeWorkerRef = useRef<{ terminate: () => void } | null>(null);

  // Terminate any active worker on component unmount
  useEffect(() => {
    return () => {
      if (activeWorkerRef.current) {
        activeWorkerRef.current.terminate();
        activeWorkerRef.current = null;
      }
    };
  }, []);

  // Reset to starter code and abort any running worker
  const handleReset = () => {
    if (activeWorkerRef.current) {
      activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }
    setCode(challenge.starterCode);
    setTestResults(null);
    setRuntimeError(null);
    setShowSolution(false);
    setIsRunning(false);
  };

  // Dedicated Web Worker Runner with 1000ms Timeout & Loop Protection
  const handleRunTests = async () => {
    // Terminate any previously running worker instance
    if (activeWorkerRef.current) {
      activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }

    setIsRunning(true);
    setRuntimeError(null);
    setTestResults(null);

    try {
      const response = await executeCodeInWorker(
        {
          code,
          algorithmId: challenge.algorithmId,
          testCases: STANDARD_PRACTICE_TEST_CASES,
        },
        1000, // Strict 1000ms execution timeout
        (workerInstance) => {
          activeWorkerRef.current = workerInstance;
        }
      );

      activeWorkerRef.current = null;

      if (!response.success) {
        setRuntimeError(response.error || "Execution failed. Check syntax and function definition.");
        setTestResults(response.results || null);
      } else if (response.results) {
        setTestResults(response.results);
        if (response.allPassed) {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        }
      }
    } catch (err: any) {
      setRuntimeError(err?.message || "An unexpected error occurred during execution.");
    } finally {
      activeWorkerRef.current = null;
      setIsRunning(false);
    }
  };

  if (!challenge) {
    return null;
  }

  const totalPassed = testResults ? testResults.filter((t) => t.passed).length : 0;
  const isAllPassed = testResults ? totalPassed === testResults.length : false;

  return (
    <div className="rounded-2xl border border-rose-500/20 bg-[#0e0509]/95 p-5 sm:p-7 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-950/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              TypeScript Coding Practice: {challenge.name}
            </h3>
            <p className="text-xs text-slate-400">{challenge.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30">
            {challenge.badge}
          </span>
        </div>
      </div>

      {/* Task & Complexity Specs */}
      <div className="p-4 rounded-xl border border-rose-950/60 bg-[#060204]/90 space-y-2">
        <h4 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider">
          Task Prompt
        </h4>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {challenge.task}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono text-slate-400">
          <span>Expected Time: <strong className="text-slate-200">{challenge.expectedComplexity.time}</strong></span>
          <span>•</span>
          <span>Expected Space: <strong className="text-slate-200">{challenge.expectedComplexity.space}</strong></span>
        </div>
      </div>

      {/* Interactive Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-rose-400" />
            <span>editor.ts (Isolated Web Worker Sandbox)</span>
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            1000ms Timeout Guard
          </span>
        </div>

        <div className="relative rounded-2xl border border-rose-950/60 bg-[#060204] overflow-hidden shadow-inner focus-within:border-rose-500/60 transition-colors">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-72 p-4 font-mono text-xs sm:text-sm bg-transparent text-rose-100 resize-y outline-none leading-relaxed selection:bg-rose-500/30"
            placeholder="Write your sorting implementation here..."
          />
        </div>
      </div>

      {/* Editor Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-950/60 bg-[#14080e]/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1f0c16] transition-all"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>{showHints ? "Hide Hints" : "Show Hints"}</span>
          </button>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-950/60 bg-[#14080e]/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1f0c16] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Code</span>
          </button>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-6 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-md shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>{isRunning ? "Running in Worker Sandbox..." : "Run Test Suite (Submit)"}</span>
        </button>
      </div>

      {/* Hints Card */}
      {showHints && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2 animate-in fade-in">
          <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider block">
            Algorithmic Hints
          </span>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-200/90 leading-relaxed font-sans">
            {challenge.hints.map((hint: string, idx: number) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Runtime / Syntax / Timeout Error Alert */}
      {runtimeError && (
        <div className="p-4 rounded-xl border border-rose-500/50 bg-rose-500/15 text-rose-200 text-xs sm:text-sm font-mono space-y-1 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Execution Error</span>
          </div>
          <p>{runtimeError}</p>
        </div>
      )}

      {/* Test Case Results Grid */}
      {testResults && (
        <div className="space-y-4 pt-2 border-t border-rose-950/60 animate-in fade-in">
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
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
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
                    <span className="font-mono text-[10px] text-slate-400">
                      {tr.executionTimeMs}ms
                    </span>
                  )}
                </div>

                <div className="font-mono text-[11px] text-slate-400 space-y-0.5 pt-1">
                  <div>Input: [{tr.input.join(", ")}]</div>
                  <div>Expected: [{tr.expected.join(", ")}]</div>
                  {tr.actual && !tr.passed && (
                    <div className="text-rose-400 font-bold">Got: [{tr.actual.join(", ")}]</div>
                  )}
                  {tr.error && <div className="text-rose-400 font-bold">Error: {tr.error}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Reference Solution Display */}
          {showSolution && (
            <div className="p-4 rounded-xl border border-rose-500/25 bg-[#12070d]/90 space-y-2 animate-in fade-in">
              <span className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider block">
                Reference Implementation (Canonical TypeScript)
              </span>
              <pre className="p-3 rounded-lg bg-[#060204] border border-rose-950/60 font-mono text-xs text-rose-200 overflow-x-auto">
                <code>{challenge.solutionCode}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
