"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { AlgorithmId } from "@/types/sorting";
import { LEARNING_PATH, LearningStep } from "@/data/learningPath";
import { ALGORITHMS } from "@/data/algorithms";
import { DOCS_ARTICLES } from "@/data/docs";
import { SortingVisualizer } from "@/components/visualizer/SortingVisualizer";
import { AlgorithmDiagram } from "@/components/diagrams/AlgorithmDiagram";
import { CodeDebugger } from "@/components/debugger/CodeDebugger";
import { BugHunt } from "@/components/challenge/BugHunt";
import { PredictNext } from "@/components/practice/PredictNext";
import { CodingPractice } from "@/components/practice/CodingPractice";
import { Quiz } from "@/components/practice/Quiz";
import { BanglaNote } from "@/components/docs/BanglaNote";
import { GlossaryModal } from "@/components/glossary/GlossaryModal";
import { ComplexityCard } from "@/components/algorithms/ComplexityCard";
import { CodeViewer } from "@/components/code/CodeViewer";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { MathDerivation } from "@/components/complexity/MathDerivation";
import { ComplexityCalculator } from "@/components/complexity/ComplexityCalculator";
import { GrowthChart } from "@/components/complexity/GrowthChart";
import {
  ArrowLeft,
  Lightbulb,
  Eye,
  Image as ImageIcon,
  Code2,
  Zap,
  Terminal,
  Bug,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  Compass,
  FileCode,
  HelpCircle,
} from "lucide-react";

export default function AlgorithmDetailPage() {
  const params = useParams();
  const algorithmId = (params.algorithm as AlgorithmId) || "bubble";

  const stepData = LEARNING_PATH.find((s) => s.id === algorithmId);
  const meta = ALGORITHMS[algorithmId];
  const docsArticle = DOCS_ARTICLES.find((a) => a.slug === `${algorithmId}-sort` || a.slug === algorithmId);

  if (!stepData || !meta) {
    notFound();
  }

  const [activeStep, setActiveStep] = useState<number>(1);
  const [activePracticeTab, setActivePracticeTab] = useState<
    "debugger" | "bughunt" | "predict" | "coding" | "quiz"
  >("debugger");
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const stepsList = [
    { num: 1, label: "The Idea", icon: Lightbulb },
    { num: 2, label: "Watch It Work", icon: Eye },
    { num: 3, label: "The Full Picture", icon: ImageIcon },
    { num: 4, label: "Read the Code", icon: Code2 },
    { num: 5, label: "Why It's Fast/Slow", icon: Zap },
    { num: 6, label: "Try It (Practice)", icon: Terminal },
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
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono">{meta.name}</span>
              <AmbientSortLogo />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={`/docs/${algorithmId}-sort`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Docs & Theory</span>
            </Link>

            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-400 transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Glossary</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-400 transition-all active:scale-95"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Visualizer</span>
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

        {/* 6-Step Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
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

              {/* Collapsible Bangla Note if available */}
              {docsArticle?.banglaNote && (
                <BanglaNote
                  topic={docsArticle.banglaNote.topic}
                  banglaText={docsArticle.banglaNote.banglaText}
                />
              )}

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
                  <span>Next: The Full Picture (Diagram) →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: The Full Picture (Signature Static Diagram) */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <AlgorithmDiagram algorithmId={algorithmId} />

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back to Watch It Work
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Read the Code →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Read the Code */}
          {activeStep === 4 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <Code2 className="h-4 w-4" />
                <span>Step 4: Annotated C++ Code Walkthrough</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[380px]">
                  <CodeViewer
                    code={meta.cppCode}
                    activeLineNumber={null}
                    algorithmName={algorithmId}
                  />
                </div>

                <div className="flex flex-col gap-3 justify-center">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Key Logical Building Blocks
                  </h3>
                  <div className="space-y-2.5">
                    {stepData.codeBlocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-border/60 bg-background/50 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-cyan-300 font-mono">
                            {block.title}
                          </span>
                        </div>
                        <pre className="text-[10px] font-mono text-cyan-200 bg-slate-900/60 p-1.5 rounded overflow-x-auto">
                          <code>{block.lines}</code>
                        </pre>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {block.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(3)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back to The Full Picture
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Why It's Fast/Slow →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Why It's Fast/Slow */}
          {activeStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Overview Grid */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <Zap className="h-4 w-4" />
                  <span>Step 5: Algorithmic Efficiency & Complexity Deep Dive</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <ComplexityCard metadata={meta} />

                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 space-y-2">
                      <h3 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
                        Why does it behave this way?
                      </h3>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {stepData.complexityWhy.time}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-border/60 bg-card/40 space-y-2">
                      <h4 className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                        Algorithmic Behavior Summary
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Step-by-Step Mathematical Derivation */}
              <MathDerivation algorithmId={algorithmId} />

              {/* 2. Interactive Calculator */}
              <ComplexityCalculator initialAlgorithm={algorithmId} showAllAlgorithmsToggle={true} />

              {/* 3. Asymptotic Growth Curves */}
              <GrowthChart highlightAlgorithm={algorithmId} />

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(4)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back to Read the Code
                </button>
                <button
                  onClick={() => setActiveStep(6)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Practice Suite →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Try It (Practice Suite) */}
          {activeStep === 6 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Practice Mode Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md">
                <button
                  onClick={() => setActivePracticeTab("debugger")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activePracticeTab === "debugger"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>1. Live Debugger</span>
                </button>

                <button
                  onClick={() => setActivePracticeTab("predict")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activePracticeTab === "predict"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>2. Predict Next</span>
                </button>

                <button
                  onClick={() => setActivePracticeTab("bughunt")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activePracticeTab === "bughunt"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Bug className="h-3.5 w-3.5" />
                  <span>3. Bug-Hunt</span>
                </button>

                <button
                  onClick={() => setActivePracticeTab("coding")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activePracticeTab === "coding"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>4. Coding Practice</span>
                </button>

                <button
                  onClick={() => setActivePracticeTab("quiz")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activePracticeTab === "quiz"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>5. Knowledge Quiz</span>
                </button>
              </div>

              {/* Render Active Practice Component */}
              {activePracticeTab === "debugger" && (
                <CodeDebugger algorithmId={algorithmId} />
              )}

              {activePracticeTab === "predict" && (
                <PredictNext algorithmId={algorithmId} />
              )}

              {activePracticeTab === "bughunt" && (
                <BugHunt algorithmId={algorithmId} />
              )}

              {activePracticeTab === "coding" && (
                <CodingPractice algorithmId={algorithmId} />
              )}

              {activePracticeTab === "quiz" && (
                <Quiz topicId={`${algorithmId}-sort`} />
              )}

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(5)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  ← Back to Why It's Fast/Slow
                </button>

                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Return to Learning Path</span>
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
