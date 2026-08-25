"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LEARNING_PATH, LearningStep } from "@/data/learningPath";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Circle,
  Lightbulb,
  Zap,
  BarChart3,
} from "lucide-react";

import { useProgressSync } from "@/hooks/useProgressSync";
import { AuthButton } from "@/components/auth/AuthButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function LearnPage() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "sorting" | "data-structure" | "complexity">("all");
  const { syncStep } = useProgressSync();

  // Load completed steps from localStorage and sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sortviz_completed_steps");
      if (saved) setCompletedSteps(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleStepCompleted = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("sortviz_completed_steps", JSON.stringify(updated));
        if (!prev.includes(id)) {
          syncStep(id);
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const filteredSteps = LEARNING_PATH.filter((s) =>
    categoryFilter === "all" ? true : s.category === categoryFilter
  );

  const progressPercent = Math.round(
    (completedSteps.length / LEARNING_PATH.length) * 100
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 transition-colors duration-150">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-foreground font-sans">
                  AlgoHub
                </span>
                <AmbientSortLogo />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95 shadow-sm"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>My Progress</span>
            </Link>

            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-500 transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
              <span className="hidden sm:inline">Docs & Course</span>
            </Link>

            <ThemeToggle />
            <NotificationBell />
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium mb-4 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Beginner-First Structured Roadmap</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            AlgoHub Curriculum & Learning Path
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Master the core concepts of algorithms and data structures in the ideal conceptual order. Each lesson breaks down intuition, interactive visualizers, code dissection, complexity, and practice.
          </p>

          {/* Progress Tracker Bar */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5 backdrop-blur-md shadow-sm dark:shadow-xl text-left">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-foreground flex items-center gap-2 font-semibold">
                <Zap className="h-4 w-4 text-cyan-500" /> Overall Mastery Progress
              </span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                {completedSteps.length} of {LEARNING_PATH.length} Completed ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/20"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === "all"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              All Topics ({LEARNING_PATH.length})
            </button>
            <button
              onClick={() => setCategoryFilter("sorting")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === "sorting"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Sorting Algorithms (5)
            </button>
            <button
              onClick={() => setCategoryFilter("data-structure")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === "data-structure"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Data Structures (2)
            </button>
            <button
              onClick={() => setCategoryFilter("complexity")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === "complexity"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Complexity Analysis (2)
            </button>
          </div>
        </div>

        {/* Sequential Path Timeline Cards */}
        <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 sm:before:left-7 before:h-full before:w-0.5 before:bg-border">
          {filteredSteps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);

            return (
              <div
                key={step.id}
                className="relative flex items-start gap-4 sm:gap-6 group"
              >
                {/* Timeline Number / Checkmark Badge */}
                <button
                  onClick={(e) => toggleStepCompleted(step.id, e)}
                  title={isCompleted ? "Mark incomplete" : "Mark completed"}
                  className={`relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                    isCompleted
                      ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-600 dark:text-emerald-300 shadow-sm"
                      : "bg-card border-border text-foreground hover:border-cyan-500 hover:text-cyan-500 shadow-sm"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                  ) : (
                    <span className="font-mono font-bold text-sm sm:text-base">
                      0{step.order}
                    </span>
                  )}
                </button>

                {/* Lesson Card */}
                <div
                  className={`flex-1 rounded-2xl border p-5 sm:p-6 backdrop-blur-md shadow-sm dark:shadow-xl transition-all ${
                    isCompleted
                      ? "border-emerald-500/30 bg-card"
                      : "border-border bg-card hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold text-foreground group-hover:text-cyan-500 transition-colors">
                        {step.name}
                      </h2>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        {step.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-500" /> {step.estimatedTime}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary text-foreground">
                        {step.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Why this order explanation */}
                  <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed mb-3">
                    {step.reason}
                  </p>

                  {/* Analogy Preview */}
                  <div className="rounded-xl border border-border/50 bg-background/50 p-3 text-xs text-muted-foreground leading-relaxed flex items-start gap-2 mb-4">
                    <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground/90 font-semibold">Analogy: </strong>
                      {step.analogy}
                    </span>
                  </div>

                  {/* Action Link & Checkbox Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
                    <button
                      onClick={(e) => toggleStepCompleted(step.id, e)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 text-muted-foreground" />
                          <span>Mark as Completed</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/algorithms/${step.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
                    >
                      <span>Start Lesson</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 py-8 text-center text-xs text-muted-foreground mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AlgoHub. Interactive Algorithm Learning Platform.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/docs" className="hover:text-foreground">Docs & Course</Link>
            <span>•</span>
            <Link href="/visualizer" className="hover:text-foreground">Visualizer</Link>
            <span>•</span>
            <Link href="/compare" className="hover:text-foreground">Comparison Matrix</Link>
            <span>•</span>
            <Link href="/learn" className="text-cyan-400 font-medium">Learning Path</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
