"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { AlgorithmId } from "@/types/sorting";
import { LEARNING_PATH, LearningStep } from "@/data/learningPath";
import { ALGORITHMS, SORTING_ALGORITHMS, DATA_STRUCTURES, COMPLEXITY_TOPICS } from "@/data/algorithms";
import { DOCS_ARTICLES } from "@/data/docs";
import dynamic from "next/dynamic";
import { SortingVisualizer } from "@/components/visualizer/SortingVisualizer";
import { BanglaNote } from "@/components/docs/BanglaNote";
import { ComplexityCard } from "@/components/algorithms/ComplexityCard";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getAdaptiveGuidance } from "@/lib/scoring";
import { TOPIC_SCORES_KEY } from "@/hooks/useProgressSync";
import { TopicScoresRecord } from "../../../../backend/database/types/database.types";

const TabLoading = () => (
  <div className="h-64 rounded-2xl border border-border/80 bg-card/50 flex flex-col items-center justify-center p-8 text-center animate-pulse">
    <div className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mb-3" />
    <span className="text-xs text-muted-foreground font-mono">Loading interactive lab...</span>
  </div>
);

const ArrayVisualizer = dynamic(
  () => import("@/components/visualizer/ArrayVisualizer").then((mod) => mod.ArrayVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const StringVisualizer = dynamic(
  () => import("@/components/visualizer/StringVisualizer").then((mod) => mod.StringVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const DequeVisualizer = dynamic(
  () => import("@/components/visualizer/DequeVisualizer").then((mod) => mod.DequeVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const StackVisualizer = dynamic(
  () => import("@/components/visualizer/StackVisualizer").then((mod) => mod.StackVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const QueueVisualizer = dynamic(
  () => import("@/components/visualizer/QueueVisualizer").then((mod) => mod.QueueVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const LinkedListVisualizer = dynamic(
  () => import("@/components/visualizer/LinkedListVisualizer").then((mod) => mod.LinkedListVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const HashTableVisualizer = dynamic(
  () => import("@/components/visualizer/HashTableVisualizer").then((mod) => mod.HashTableVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const BinaryTreeVisualizer = dynamic(
  () => import("@/components/visualizer/BinaryTreeVisualizer").then((mod) => mod.BinaryTreeVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const LinearSearchVisualizer = dynamic(
  () => import("@/components/visualizer/LinearSearchVisualizer").then((mod) => mod.LinearSearchVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const BinarySearchVisualizer = dynamic(
  () => import("@/components/visualizer/BinarySearchVisualizer").then((mod) => mod.BinarySearchVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const TimeComplexityVisualizer = dynamic(
  () => import("@/components/visualizer/TimeComplexityVisualizer").then((mod) => mod.TimeComplexityVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const SpaceComplexityVisualizer = dynamic(
  () => import("@/components/visualizer/SpaceComplexityVisualizer").then((mod) => mod.SpaceComplexityVisualizer),
  { ssr: false, loading: () => <TabLoading /> }
);
const BugHunt = dynamic(
  () => import("@/components/challenge/BugHunt").then((mod) => mod.BugHunt),
  { ssr: false, loading: () => <TabLoading /> }
);
const Quiz = dynamic(
  () => import("@/components/practice/Quiz").then((mod) => mod.Quiz),
  { ssr: false, loading: () => <TabLoading /> }
);
const ProblemSolving = dynamic(
  () => import("@/components/practice/ProblemSolving").then((mod) => mod.ProblemSolving),
  { ssr: false, loading: () => <TabLoading /> }
);
const ComplexityCalculator = dynamic(
  () => import("@/components/complexity/ComplexityCalculator").then((mod) => mod.ComplexityCalculator),
  { ssr: false, loading: () => <TabLoading /> }
);
const GrowthChart = dynamic(
  () => import("@/components/complexity/GrowthChart").then((mod) => mod.GrowthChart),
  { ssr: false, loading: () => <TabLoading /> }
);
const MathDerivation = dynamic(
  () => import("@/components/complexity/MathDerivation").then((mod) => mod.MathDerivation),
  { ssr: false, loading: () => <TabLoading /> }
);
const AlgorithmDiagram = dynamic(
  () => import("@/components/diagrams/AlgorithmDiagram").then((mod) => mod.AlgorithmDiagram),
  { ssr: false, loading: () => <TabLoading /> }
);
import { FormattedMarkdown } from "@/components/docs/FormattedMarkdown";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Eye,
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
  X,
  TrendingUp,
  Globe,
  Database,
  ChevronDown,
  Cpu,
  Search,
} from "lucide-react";
export default function AlgorithmDetailPage() {
  const params = useParams();
  const algorithmId = (params.algorithm as AlgorithmId) || "bubble";

  const stepData = LEARNING_PATH.find((s) => s.id === algorithmId);
  const meta = ALGORITHMS[algorithmId];
  const docsArticle = DOCS_ARTICLES.find(
    (a) =>
      a.slug === `${algorithmId}-sort` ||
      a.slug === `${algorithmId}-data-structure` ||
      a.slug === `${algorithmId}-fundamentals` ||
      a.slug === algorithmId ||
      a.quizTopicId === algorithmId ||
      a.visualizerLink?.algorithmId === algorithmId
  );

  if (!stepData || !meta) {
    notFound();
  }

  const isDataStructure = meta.category === "data-structure" || meta.category === "tree";
  const isTree = meta.category === "tree";
  const isComplexity = meta.category === "complexity";
  const isSearching = meta.category === "searching";

  const [activeStep, setActiveStep] = useState<number>(1);
  const [activePracticeTab, setActivePracticeTab] = useState<
    "quiz" | "bughunt" | "problems"
  >("quiz");
  const [guidanceInfo, setGuidanceInfo] = useState<{ message: string; score: number; status: string } | null>(null);
  const [isGuidanceDismissed, setIsGuidanceDismissed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(`dismissed_guidance_${algorithmId}`);
      if (dismissed) {
        setIsGuidanceDismissed(true);
        return;
      }
      const scores: TopicScoresRecord = JSON.parse(localStorage.getItem(TOPIC_SCORES_KEY) || "{}");
      const topicMetrics = scores[algorithmId];
      if (topicMetrics && topicMetrics.computed_topic_score > 0) {
        const guidance = getAdaptiveGuidance(algorithmId, topicMetrics.computed_topic_score);
        setGuidanceInfo({
          message: guidance.message,
          score: topicMetrics.computed_topic_score,
          status: guidance.status,
        });
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, [algorithmId]);

  const handleDismissGuidance = () => {
    setIsGuidanceDismissed(true);
    try {
      sessionStorage.setItem(`dismissed_guidance_${algorithmId}`, "true");
    } catch {}
  };

  const stepsList = [
    { num: 1, label: "The Idea", icon: Lightbulb },
    { num: 2, label: "In-Depth Theory", icon: BookOpen },
    { num: 3, label: "Watch It Work", icon: Eye },
    { num: 4, label: "Why It's Fast/Slow", icon: Zap },
    { num: 5, label: "Try It (Practice)", icon: Terminal },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 transition-colors duration-150">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/learn" className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-cyan-500 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Learning Path</span>
            </Link>
            <span className="text-border">/</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground font-mono">{meta.name}</span>
              <AmbientSortLogo />
            </div>
          </div>

          {/* Right: Actions with Topics Dropdown to the left of Docs & Theory */}
          <div className="flex items-center gap-2 sm:gap-3">


            <Link
              href={`/visualizer?algo=${algorithmId}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-500 transition-all active:scale-95"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Visualizer</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Title & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                <span>
                  {isTree ? "Tree Data Structure" : isDataStructure ? "Data Structure" : isComplexity ? "Complexity Analysis" : isSearching ? "Searching Algorithm" : "Sorting Algorithm"} • {stepData.order < 10 ? `0${stepData.order}` : stepData.order} of {LEARNING_PATH.length < 10 ? `0${LEARNING_PATH.length}` : LEARNING_PATH.length}
                </span>
              </span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" /> {stepData.estimatedTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <span>{meta.name} Deep Dive</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {stepData.reason}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-secondary/80 text-xs font-semibold text-foreground hover:text-cyan-500 hover:border-cyan-500/30 transition-colors"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>View Mastery Dashboard</span>
          </Link>
        </div>

        {/* Subtle Adaptive Guidance Banner */}
        {guidanceInfo && !isGuidanceDismissed && (
          <div className="mb-6 p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-600 dark:text-cyan-300 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-xs sm:text-sm text-cyan-700 dark:text-cyan-200 font-medium">
                {guidanceInfo.message}{" "}
                <span className="font-mono text-xs text-cyan-800 dark:text-cyan-300 font-bold">
                  (Current Mastery: {guidanceInfo.score}%)
                </span>
              </p>
            </div>
            <button
              onClick={handleDismissGuidance}
              className="p-1 rounded-lg text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 hover:bg-cyan-500/20 transition-colors"
              aria-label="Dismiss note"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 5-Step Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.num;

            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500 text-foreground shadow-sm dark:shadow-cyan-500/10"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
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
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 backdrop-blur-md shadow-sm dark:shadow-xl space-y-6 animate-in fade-in">
              {/* Top Tag & Time */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <Lightbulb className="h-4 w-4" />
                  <span>Step 1: Conceptual Intuition</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span>Core Intuition &amp; Mental Model</span>
                </div>
              </div>

              {/* 1. THE CURIOSITY HOOK / MIND CATCHER */}
              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent p-5 sm:p-6 shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-500 shrink-0 mt-0.5">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-2.5 sm:space-y-3">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400">
                      The Big Question • Why This Matters
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-foreground leading-relaxed pt-0.5">
                      "{stepData.hook || stepData.reason}"
                    </h2>
                  </div>
                </div>
              </div>

              {/* 2. THREE MENTAL MODEL POWER BADGES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Core Superpower</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {stepData.superpower || "High-efficiency execution"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Crucial Tradeoff</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {stepData.tradeoff || "Algorithmic resource tradeoff"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    <Compass className="h-3.5 w-3.5" />
                    <span>Mental Model Anchor</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {stepData.mentalModel || stepData.name}
                  </p>
                </div>
              </div>

              {/* 3. CORE EXPLANATION (HIGH READABILITY) */}
              <div className="space-y-3">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-cyan-500" />
                  <span>How {meta.name} Operates in Plain English</span>
                </h3>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-sans bg-secondary/30 p-4 rounded-xl border border-border/60">
                  {stepData.idea}
                </p>
              </div>

              {/* 4. BANGLA EXPLANATION NOTE */}
              {docsArticle?.banglaNote && (
                <BanglaNote
                  topic={docsArticle.banglaNote.topic}
                  banglaText={docsArticle.banglaNote.banglaText}
                />
              )}

              {/* FOOTER */}
              <div className="pt-4 border-t border-border/40 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Next: In-Depth Theory →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: In-Depth Theory & Architectural Mastery */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 backdrop-blur-md shadow-sm dark:shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                    <BookOpen className="h-4 w-4" />
                    <span>Step 2: In-Depth Architectural &amp; Theoretical Mastery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1 bg-secondary/80 px-2.5 py-1 rounded-lg">
                      <Clock className="h-3 w-3 text-amber-500" />
                      <span>{docsArticle?.estimatedReadTime || "~10 min"} in-depth read</span>
                    </span>
                  </div>
                </div>

                {/* Article Header Banner */}
                <div className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    {docsArticle?.title || `${meta.name} Comprehensive Deep Dive`}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {docsArticle?.subtitle || meta.description}
                  </p>
                </div>

                {/* Full In-Depth Formatted Markdown Article (Theory First) */}
                {docsArticle && (
                  <div className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-background/50">
                    <FormattedMarkdown content={docsArticle.content} />
                  </div>
                )}

                {/* In-Depth Bengali Theory Explanation & Conceptual Breakdown */}
                {docsArticle?.banglaNote && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 pt-2">
                      <Sparkles className="h-4 w-4" />
                      <span>বাংলায় বিস্তারিত থিওরি ও বিশ্লেষণ (In-Depth Bengali Theory)</span>
                    </div>
                    <BanglaNote
                      topic={docsArticle.banglaNote.topic}
                      banglaText={docsArticle.banglaNote.banglaText}
                      defaultExpanded={true}
                    />
                  </div>
                )}

                {/* Signature Architecture Diagram for this topic (Full Picture at Bottom) */}
                <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                  <AlgorithmDiagram algorithmId={algorithmId} />
                </div>

                <div className="pt-4 border-t border-border flex justify-between">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    ← Back to The Idea
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <span>Next: Watch It Work →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Watch It Work */}
          {activeStep === 3 && (
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 backdrop-blur-md shadow-sm dark:shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <Eye className="h-4 w-4" />
                  <span>Step 3: Interactive Demonstration</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {isDataStructure ? "Interactive Operation Playground" : "Small ~8 element sample array"}
                </span>
              </div>

              {algorithmId === "array" ? (
                <ArrayVisualizer />
              ) : algorithmId === "string" ? (
                <StringVisualizer />
              ) : algorithmId === "deque" ? (
                <DequeVisualizer />
              ) : algorithmId === "stack" ? (
                <StackVisualizer />
              ) : algorithmId === "queue" ? (
                <QueueVisualizer />
              ) : algorithmId === "linked-list" ? (
                <LinkedListVisualizer />
              ) : algorithmId === "hash-table" ? (
                <HashTableVisualizer />
              ) : algorithmId === "binary-tree" ? (
                <BinaryTreeVisualizer />
              ) : algorithmId === "linear-search" ? (
                <LinearSearchVisualizer />
              ) : algorithmId === "binary-search" ? (
                <BinarySearchVisualizer />
              ) : algorithmId === "time-complexity" ? (
                <TimeComplexityVisualizer />
              ) : algorithmId === "space-complexity" ? (
                <SpaceComplexityVisualizer />
              ) : (
                <SortingVisualizer />
              )}

              <div className="pt-4 border-t border-border flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ← Back to In-Depth Theory
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Next: Why It's Fast/Slow →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Why It's Fast/Slow */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Overview Grid */}
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 backdrop-blur-md shadow-sm dark:shadow-xl space-y-6">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                  <Zap className="h-4 w-4" />
                  <span>Step 4: Algorithmic Efficiency &amp; Complexity Deep Dive</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <ComplexityCard metadata={meta} />

                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 space-y-2">
                      <h3 className="text-xs font-bold font-mono text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                        Why does it behave this way?
                      </h3>
                      <p className="text-sm text-foreground leading-relaxed">
                        {stepData.complexityWhy.time}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-border bg-secondary/60 space-y-2">
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

              {/* Data Structure / Complexity Operations Breakdown vs Sorting Growth Curves */}
              {isDataStructure ? (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Database className="h-4 w-4 text-cyan-500" />
                    <span>Operation Complexity Guarantee Matrix</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {meta.complexity.operations?.map((op, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-border bg-secondary/40 space-y-1">
                        <div className="font-mono font-bold text-xs text-foreground">{op.name}</div>
                        <div className="text-xs font-mono font-bold text-emerald-500">{op.time}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight">{op.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isSearching ? (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Search className="h-4 w-4 text-emerald-500" />
                    <span>Search Traversal &amp; Precondition Guarantee Matrix</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {meta.complexity.operations?.map((op, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-border bg-secondary/40 space-y-1">
                        <div className="font-mono font-bold text-xs text-foreground">{op.name}</div>
                        <div className="text-xs font-mono font-bold text-emerald-500">{op.time}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight">{op.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isComplexity ? (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span>Asymptotic Operations Scale Breakdown</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {meta.complexity.operations?.map((op, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-border bg-secondary/40 space-y-1">
                        <div className="font-mono font-bold text-xs text-foreground">{op.name}</div>
                        <div className="text-xs font-mono font-bold text-purple-400">{op.time}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight">{op.description}</div>
                      </div>
                    ))}
                  </div>
                  <GrowthChart />
                </div>
              ) : (
                <>
                  <MathDerivation algorithmId={algorithmId} />
                  <ComplexityCalculator initialAlgorithm={algorithmId} showAllAlgorithmsToggle={true} />
                  <GrowthChart highlightAlgorithm={algorithmId} />
                </>
              )}

              <div className="pt-4 border-t border-border flex justify-between">
                <button
                  onClick={() => setActiveStep(3)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ← Back to Watch It Work
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Next: Practice Suite →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Try It (Practice Suite) */}
          {activeStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Practice Mode Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border border-border bg-card backdrop-blur-md shadow-sm">
                <button
                  onClick={() => setActivePracticeTab("quiz")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activePracticeTab === "quiz"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>1. Knowledge Quiz</span>
                </button>

                <button
                  onClick={() => setActivePracticeTab("bughunt")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activePracticeTab === "bughunt"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Bug className="h-3.5 w-3.5" />
                  <span>2. Bug-Hunt</span>
                </button>

                <button
                  onClick={() => setActivePracticeTab("problems")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activePracticeTab === "problems"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>3. Problem Solving</span>
                </button>
              </div>

              {/* Render Active Practice Component */}
              {activePracticeTab === "quiz" && (
                <Quiz topicId={algorithmId} />
              )}

              {activePracticeTab === "bughunt" && (
                <BugHunt algorithmId={algorithmId} />
              )}

              {activePracticeTab === "problems" && (
                <ProblemSolving algorithmId={algorithmId} />
              )}

              <div className="pt-4 border-t border-border/40 flex justify-between">
                <button
                  onClick={() => setActiveStep(4)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
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
    </div>
  );
}
