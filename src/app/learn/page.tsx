"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LEARNING_PATH, LearningStep } from "@/data/learningPath";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { AlgoHubLogo } from "@/components/brand/AlgoHubLogo";
import { createClient } from "@/lib/supabase/client";
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
  Lock,
  Target,
  Flame,
  Trophy,
} from "lucide-react";

import { useProgressSync } from "@/hooks/useProgressSync";
import { AuthButton } from "@/components/auth/AuthButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function LearnPage() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "sorting" | "searching" | "data-structure" | "complexity"
  >("all");
  const { syncStep } = useProgressSync();
  const supabase = createClient();

  // Track auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

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
        localStorage.setItem(
          "sortviz_completed_steps",
          JSON.stringify(updated)
        );
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
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-base sm:text-lg tracking-tight text-foreground font-sans">
                AlgoHub
              </span>
              <AmbientSortLogo />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95 shadow-sm"
              title="My Progress"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">My Progress</span>
            </Link>

            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-500 transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
              <span className="hidden sm:inline">Docs & Course</span>
              <span className="sm:hidden">Docs</span>
            </Link>

            <ThemeToggle />
            <NotificationBell />
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium mb-4 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Beginner-First Structured Roadmap</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3 font-sans">
            Algorithm &amp; Data Structure{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
              Mastery Path
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A step-by-step roadmap from brute-force paradigms to optimal
            algorithms, linear data structures, searching strategies, and asymptotic complexity analysis.
          </p>

          {/* Motivational Cloud Sync & Progress Tracking Banner for Guests (Compact & Sleek) */}
          {!user && (
            <div className="relative mt-6 rounded-2xl border-2 border-[#B08422]/40 dark:border-[#C9A962]/35 bg-gradient-to-r from-card via-card/95 to-amber-500/[0.04] p-4 sm:p-5 backdrop-blur-xl shadow-lg overflow-hidden text-left corner-flourish animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Title & Google 1-Click Button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shrink-0">
                  <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight font-sans">
                    Save Your Personal DSA Learning Journey
                  </h2>
                  <Link
                    href="/auth/login"
                    className="btn-brass inline-flex items-center gap-2 px-4 py-2 rounded-xl font-sans font-bold text-xs tracking-wide shadow-brass hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto shrink-0"
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign In with Google</span>
                    <ArrowRight className="h-3 w-3 ml-0.5" />
                  </Link>
                </div>

                {/* Right: 3 Compact Locked Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-muted/40 dark:bg-black/30 text-xs font-sans">
                    <span>🔥</span>
                    <span className="font-semibold text-foreground text-[11px]">Streak Keeper</span>
                    <Lock className="h-2.5 w-2.5 text-[#B08422] ml-1" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-muted/40 dark:bg-black/30 text-xs font-sans">
                    <span>⚡</span>
                    <span className="font-semibold text-foreground text-[11px]">Algo Master</span>
                    <Lock className="h-2.5 w-2.5 text-[#B08422] ml-1" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-muted/40 dark:bg-black/30 text-xs font-sans">
                    <span>🎯</span>
                    <span className="font-semibold text-foreground text-[11px]">Bug Hunter</span>
                    <Lock className="h-2.5 w-2.5 text-[#B08422] ml-1" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Overview Bar */}
          <div className="mt-8 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md max-w-xl mx-auto shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-muted-foreground">Overall Roadmap Completion</span>
              <span className="text-cyan-500 font-bold">
                {completedSteps.length} / {LEARNING_PATH.length} ({progressPercent}%)
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
          <div className="mt-6 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto touch-scroll pb-2 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                categoryFilter === "all"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              All Topics ({LEARNING_PATH.length})
            </button>
            <button
              onClick={() => setCategoryFilter("sorting")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                categoryFilter === "sorting"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Sorting ({LEARNING_PATH.filter((s) => s.category === "sorting").length})
            </button>
            <button
              onClick={() => setCategoryFilter("searching")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                categoryFilter === "searching"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Searching ({LEARNING_PATH.filter((s) => s.category === "searching").length})
            </button>
            <button
              onClick={() => setCategoryFilter("data-structure")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                categoryFilter === "data-structure"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Data Structures ({LEARNING_PATH.filter((s) => s.category === "data-structure").length})
            </button>
            <button
              onClick={() => setCategoryFilter("complexity")}
              className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                categoryFilter === "complexity"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Complexity ({LEARNING_PATH.filter((s) => s.category === "complexity").length})
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
                      <h2 className="text-lg font-bold text-foreground group-hover:text-cyan-500 transition-colors flex items-center gap-2">
                        <span>{step.name}</span>
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
