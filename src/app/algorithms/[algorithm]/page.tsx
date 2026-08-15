"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { AlgorithmId } from "@/types/sorting";
import { LEARNING_PATH, LearningStep } from "@/data/learningPath";
import { ALGORITHMS } from "@/data/algorithms";
import { SortingVisualizer } from "@/components/visualizer/SortingVisualizer";
import { CodeDebugger } from "@/components/debugger/CodeDebugger";
import { BugHunt } from "@/components/challenge/BugHunt";
import { GlossaryModal } from "@/components/glossary/GlossaryModal";
import { ComplexityCard } from "@/components/algorithms/ComplexityCard";
import { CodeViewer } from "@/components/code/CodeViewer";
import {
  ArrowLeft,
  Lightbulb,
  Eye,
  Code2,
  Zap,
  Terminal,
  Bug,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
} from "lucide-react";

export default function AlgorithmDetailPage() {
  const params = useParams();
  const algorithmId = (params.algorithm as AlgorithmId) || "bubble";

  const stepData = LEARNING_PATH.find((s) => s.id === algorithmId);
  const meta = ALGORITHMS[algorithmId];

  if (!stepData || !meta) {
    notFound();
  }

  const [activeStep, setActiveStep] = useState<number>(1);
  const [activePracticeTab, setActivePracticeTab] = useState<"debugger" | "bughunt">("debugger");
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const stepsList = [
    { num: 1, label: "The Idea", icon: Lightbulb },
    { num: 2, label: "Watch It Work", icon: Eye },
    { num: 3, label: "Read the Code", icon: Code2 },
    { num: 4, label: "Why It's Fast/Slow", icon: Zap },
    { num: 5, label: "Try It (Practice)", icon: Terminal },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070b12] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/learn" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-cyan-400 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Learning Path</span>
            </Link>
            <span className="text-border">/</span>
            <span className="text-sm font-bold text-white font-mono">{meta.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-400 transition-all active:scale-95"
            >
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>Glossary</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-400 transition-all active:scale-95"
            >
              <Layers className="h-4 w-4" />
              <span>Main Visualizer</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Title & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Lesson 0{stepData.order} of 05
              </span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-400" /> {stepData.estimatedTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {meta.name} Deep Dive
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {stepData.reason}
            </p>
          </div>
        </div>

        {/* 5-Step Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.num;

            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-transparent border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                    : "border-border/60 bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step.num}
                </div>
                <div className="truncate">
                  <span className="block text-xs font-semibold truncate">
                    {step.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progressive Step Content Sections */}
        <div className="space-y-6">
          {/* STEP 1: The Idea */}
          {activeStep === 1 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <Lightbulb className="h-4 w-4" />
                <span>Step 1: Conceptual Intuition</span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3">
                  How {meta.name} Works in Plain English
                </h2>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-sans">
                  {stepData.idea}
                </p>
              </div>

              {/* Analogy Callout Card */}
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 leading-relaxed">
                <h3 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Real-World Analogy
                </h3>
                <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                  {stepData.analogy}
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Watch It Work →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Watch It Work */}
          {activeStep === 2 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-6 backdrop-blur-md shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <Eye className="h-4 w-4" />
                  <span>Step 2: Interactive Demonstration</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  Small ~8 element sample array
                </span>
              </div>

              <SortingVisualizer />

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back to The Idea
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Read the Code →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Read the Code */}
          {activeStep === 3 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <Code2 className="h-4 w-4" />
                <span>Step 3: Logical Code Dissection</span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  C++ Implementation Breakdown
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Notice how each logical block maps directly to the mental model explained earlier.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {stepData.codeBlocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border/60 bg-[#0d1117] p-4 sm:p-5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                        {block.title}
                      </h4>
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        Block 0{idx + 1}
                      </span>
                    </div>

                    <pre className="p-3 rounded-xl bg-black/50 border border-border/50 font-mono text-xs text-slate-200 overflow-x-auto">
                      <code>{block.lines}</code>
                    </pre>

                    <p className="text-xs text-muted-foreground/90 leading-relaxed font-sans">
                      {block.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back to Visualizer
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Why It&apos;s Fast/Slow →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Why It's Fast/Slow */}
          {activeStep === 4 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <Zap className="h-4 w-4" />
                <span>Step 4: Complexity Analysis</span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Why {meta.name} Has These Complexity Bounds
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Understand complexity based on what the loops and recursion tree are physically doing.
                </p>
              </div>

              <ComplexityCard metadata={meta} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-1.5">
                  <span className="text-xs font-bold font-mono text-amber-400 block">
                    Time Complexity Rationale
                  </span>
                  <p className="text-xs text-muted-foreground/90 leading-relaxed">
                    {stepData.complexityWhy.time}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-1.5">
                  <span className="text-xs font-bold font-mono text-cyan-400 block">
                    Space Complexity Rationale
                  </span>
                  <p className="text-xs text-muted-foreground/90 leading-relaxed">
                    {stepData.complexityWhy.space}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-1.5">
                  <span className="text-xs font-bold font-mono text-indigo-400 block">
                    Stability Rationale
                  </span>
                  <p className="text-xs text-muted-foreground/90 leading-relaxed">
                    {stepData.complexityWhy.stability}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(3)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back to Code Breakdown
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Try It (Practice) →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Try It (Debugger & Bug Hunt) */}
          {activeStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Toggle practice modes */}
              <div className="flex items-center justify-between bg-card/60 p-2 rounded-2xl border border-border/60">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePracticeTab("debugger")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      activePracticeTab === "debugger"
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Live Code Debugger</span>
                  </button>

                  <button
                    onClick={() => setActivePracticeTab("bughunt")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      activePracticeTab === "bughunt"
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Bug className="h-3.5 w-3.5" />
                    <span>Bug-Hunt Challenge</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-muted-foreground px-3">
                  Hands-On Interactive Practice
                </span>
              </div>

              {activePracticeTab === "debugger" && (
                <CodeDebugger algorithmId={algorithmId} initialArray={stepData.sampleArray} />
              )}

              {activePracticeTab === "bughunt" && (
                <BugHunt algorithmId={algorithmId} />
              )}

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(4)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back to Complexity
                </button>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-all"
                >
                  <span>Return to Learning Path Roadmap</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
