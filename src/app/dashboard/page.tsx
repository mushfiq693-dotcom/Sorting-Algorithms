"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { fastCache } from "@/lib/cache";
import {
  ORDERED_TOPICS,
  ALGORITHM_NAME_MAP,
  ALGORITHM_DOCS_MAP,
  calculateTopicScore,
  calculateOverallProgress,
  getAdaptiveGuidance,
  calculateDocsCompletion,
  SCORING_WEIGHTS,
} from "@/lib/scoring";
import {
  TOPIC_SCORES_KEY,
  ACTIVITY_HISTORY_KEY,
  DOCS_KEY,
  STEPS_KEY,
} from "@/hooks/useProgressSync";
import {
  TopicMetrics,
  TopicScoresRecord,
  ActivityHistoryItem,
} from "../../../backend/database/types/database.types";
import { LEARNING_PATH } from "@/data/learningPath";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { AlgoHubLogo } from "@/components/brand/AlgoHubLogo";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  BarChart3,
  Sparkles,
  Award,
  ArrowRight,
  HelpCircle,
  Bug,
  BookOpen,
  Compass,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  GraduationCap,
  TrendingUp,
  RotateCcw,
  Zap,
  Info,
  Clock,
  ShieldCheck,
  Home,
  Check,
  UserCheck,
  Send,
  X,
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string;
    student_id: string | null;
    department: string | null;
    role: string;
  } | null>(null);

  const [topicScores, setTopicScores] = useState<TopicScoresRecord>({});
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>([]);
  const [completedDocs, setCompletedDocs] = useState<string[]>([]);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  // Mentor Application States
  const [mentorApp, setMentorApp] = useState<{
    id: string;
    status: "pending" | "approved" | "rejected";
    reason: string;
  } | null>(null);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorReason, setMentorReason] = useState("");
  const [submittingMentorApp, setSubmittingMentorApp] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("algohub_welcome_dismissed") === "true";
      setWelcomeDismissed(dismissed);
    }
  }, []);

  const handleDismissWelcome = () => {
    setWelcomeDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("algohub_welcome_dismissed", "true");
    }
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user;

        if (!user) {
          router.push("/auth/login?next=/dashboard");
          return;
        }

        // 1. Instant cache check for fast response
        const cachedProfile = fastCache.get<any>(`prof_${user.id}`);
        if (cachedProfile) setProfile(cachedProfile);

        // 2. Fetch Profile, Mentor Application & Progress in parallel (single roundtrip)
        const [profRes, appRes, progRes] = await Promise.all([
          (supabase.from("profiles") as any)
            .select("full_name, email, student_id, department, role")
            .eq("id", user.id)
            .single(),
          (supabase.from("mentor_applications") as any)
            .select("id, status, reason")
            .eq("user_id", user.id)
            .maybeSingle(),
          (supabase.from("user_progress") as any)
            .select("topic_scores, activity_history, completed_docs, completed_steps")
            .eq("user_id", user.id)
            .single(),
        ]);

        if (profRes.data) {
          setProfile(profRes.data);
          fastCache.set(`prof_${user.id}`, profRes.data, 300);

          // Admin users do not need a student progress dashboard; forward directly to Admin Panel
          if (profRes.data.role === "admin") {
            router.replace("/admin/moderation");
            return;
          }
        }

        if (appRes.data) {
          setMentorApp(appRes.data);
        }

        const progress = progRes.data;

        // 3. Reconcile with localStorage
        const localDocs: string[] = JSON.parse(localStorage.getItem(DOCS_KEY) || "[]");
        const mergedDocs = Array.from(
          new Set([...localDocs, ...(progress?.completed_docs || [])])
        );
        setCompletedDocs(mergedDocs);

        const localScores: TopicScoresRecord = JSON.parse(
          localStorage.getItem(TOPIC_SCORES_KEY) || "{}"
        );
        const remoteScores: TopicScoresRecord = progress?.topic_scores || {};

        const consolidatedScores: TopicScoresRecord = {};
        for (const { id } of ORDERED_TOPICS) {
          const l = localScores[id];
          const r = remoteScores[id];

          const quiz = Math.max(l?.quiz_best_score || 0, r?.quiz_best_score || 0);
          const bug = Math.max(l?.bug_hunt_best_score || 0, r?.bug_hunt_best_score || 0);
          const docs = calculateDocsCompletion(id, mergedDocs);
          const predict = Math.max(l?.prediction_best_score || 0, r?.prediction_best_score || 0);

          const computed = calculateTopicScore({
            quiz_best_score: quiz,
            bug_hunt_best_score: bug,
            docs_completion: docs,
            prediction_best_score: predict,
          });

          consolidatedScores[id] = {
            quiz_best_score: quiz,
            bug_hunt_best_score: bug,
            docs_completion: docs,
            prediction_best_score: predict,
            computed_topic_score: computed,
            last_activity_at: l?.last_activity_at || r?.last_activity_at || new Date().toISOString(),
          };
        }

        setTopicScores(consolidatedScores);

        // 4. Activity History
        const localHistory: ActivityHistoryItem[] = JSON.parse(
          localStorage.getItem(ACTIVITY_HISTORY_KEY) || "[]"
        );
        const remoteHistory: ActivityHistoryItem[] = Array.isArray(progress?.activity_history)
          ? progress.activity_history
          : [];

        const historyMap = new Map<string, ActivityHistoryItem>();
        [...remoteHistory, ...localHistory].forEach((item) => {
          if (item && item.id) historyMap.set(item.id, item);
        });

        const mergedHistory = Array.from(historyMap.values())
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 15);

        setActivityHistory(mergedHistory);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [supabase, router]);

  // Derived Overall Progress & Adaptive Guidance
  const overallMetrics = useMemo(() => {
    return calculateOverallProgress(topicScores);
  }, [topicScores]);

  const activeGuidance = useMemo(() => {
    const activeTopicMetrics = topicScores[overallMetrics.activeTopic];
    const score = activeTopicMetrics?.computed_topic_score ?? 0;
    return getAdaptiveGuidance(overallMetrics.activeTopic, score);
  }, [topicScores, overallMetrics.activeTopic]);

  const isZeroData = useMemo(() => {
    return overallMetrics.overallScore === 0 && activityHistory.length === 0;
  }, [overallMetrics.overallScore, activityHistory.length]);

  const handleApplyMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorReason.trim()) return;
    setSubmittingMentorApp(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await (supabase.from("mentor_applications") as any)
        .insert({
          user_id: user.id,
          reason: mentorReason.trim(),
          status: "pending",
        })
        .select("id, status, reason")
        .single();

      if (error) throw error;
      setMentorApp(data);
      setShowMentorModal(false);
      setMentorReason("");
    } catch (err: any) {
      alert(`Failed to submit application: ${err.message}`);
    } finally {
      setSubmittingMentorApp(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-foreground">
        <div className="flex items-center gap-3 text-sm font-mono text-cyan-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading Personalized Mastery Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-foreground flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-sans">
                AlgoHub
              </span>
              <AmbientSortLogo />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-card/70 transition-all active:scale-95 shadow-sm"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Docs</span>
            </Link>

            <ThemeToggle />
            <NotificationBell />

            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95 shadow-md shadow-cyan-500/15"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Continue Learning</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* User Welcome & Departmental Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-semibold">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>
                GSTU {profile?.department || "CSE"} Department • {profile?.student_id || "Student"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Scholar"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Track your algorithmic mastery, practice scores, and adaptive readiness in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {/* Mentor Role or Application CTA */}
            {profile?.role === "mentor" || profile?.role === "admin" ? (
              <Link
                href="/mentor"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-500/15 text-xs font-semibold text-purple-300 hover:bg-purple-500/25 transition-all shadow-sm"
              >
                <Award className="h-3.5 w-3.5 text-purple-400" />
                <span>Mentor Portal</span>
              </Link>
            ) : mentorApp?.status === "pending" ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs font-mono text-amber-300">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Mentor App: Under Review</span>
              </div>
            ) : (
              <button
                onClick={() => setShowMentorModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-all shadow-sm active:scale-95"
              >
                <Award className="h-3.5 w-3.5 text-purple-400" />
                <span>{mentorApp?.status === "rejected" ? "Re-apply for Mentor" : "Apply to be a Mentor"}</span>
              </button>
            )}

            <button
              onClick={() => setShowFormulaInfo(!showFormulaInfo)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-secondary/60 text-xs font-semibold text-muted-foreground hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
            >
              <Info className="h-3.5 w-3.5" />
              <span>How Scores are Computed</span>
            </button>
          </div>
        </div>

        {/* Mentor Application Dialog Modal */}
        {showMentorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl border border-purple-500/40 bg-[#0d0714] p-6 sm:p-7 shadow-2xl shadow-purple-950/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-base">
                  <Award className="h-5 w-5 text-purple-400" />
                  <span>Apply for Mentor Role</span>
                </div>
                <button
                  onClick={() => setShowMentorModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Mentors assist peers in mastering sorting algorithms, review cohort performance analytics, and dispatch broadcast notifications to struggling students.
              </p>

              <form onSubmit={handleApplyMentor} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-purple-300">
                    Why do you want to mentor on AlgoHub?
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={mentorReason}
                    onChange={(e) => setMentorReason(e.target.value)}
                    placeholder="Briefly state your background with DSA, your teaching experience, or why you want to support your department cohort..."
                    className="w-full rounded-2xl border border-purple-500/30 bg-black/60 p-3.5 text-xs text-white placeholder:text-slate-600 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMentorModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingMentorApp || !mentorReason.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {submittingMentorApp ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Scoring Formula Explainer Modal/Banner */}
        {showFormulaInfo && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 backdrop-blur-xl animate-in fade-in space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Info className="h-4 w-4" />
                <span>AlgoHub Weighted Topic Mastery Formula</span>
              </div>
              <button
                onClick={() => setShowFormulaInfo(false)}
                className="text-xs text-muted-foreground hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Each algorithm’s topic score is a weighted aggregate of your best attempt across 4 core competencies:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-border/50">
                <span className="text-cyan-400 font-bold block">40% Quiz</span>
                <span className="text-slate-400 text-[11px]">Best attempt %</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-border/50">
                <span className="text-amber-400 font-bold block">30% Bug Hunt</span>
                <span className="text-slate-400 text-[11px]">100 - hints - errors</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-border/50">
                <span className="text-emerald-400 font-bold block">20% Docs & Theory</span>
                <span className="text-slate-400 text-[11px]">Articles completed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-border/50">
                <span className="text-purple-400 font-bold block">10% Predict Next</span>
                <span className="text-slate-400 text-[11px]">Best prediction %</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * Note: Unattempted components count as 0% to measure genuine well-rounded comprehension rather than isolated attempts.
            </p>
          </div>
        )}

        {/* First-Time User Lightweight Dismissible Callout */}
        {isZeroData && !welcomeDismissed && (
          <div className="relative rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-background p-4 sm:p-5 backdrop-blur-xl shadow-lg flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  First-Time Student Quickstart
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  Welcome to your AlgoHub Dashboard! Your topic mastery scores will compute automatically as you read docs, solve quizzes, and debug code.
                  Follow the structured curriculum in order — start with <strong className="text-white">Bubble Sort</strong> below.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismissWelcome}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 shrink-0 transition-colors"
              aria-label="Dismiss welcome tip"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Directive Zero-Data Hero Banner */}
        {isZeroData && (
          <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-blue-950/50 via-cyan-950/40 to-background p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold">
                <Compass className="h-4 w-4" />
                <span>Step 1 of 5 • Structured Learning Path</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Start with Lesson 01: Bubble Sort
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Understand adjacent comparisons, swap operations, and termination flags through interactive visualization, code debugging, and hands-on practice.
              </p>
            </div>
            <Link
              href="/algorithms/bubble"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-600/30 hover:brightness-110 active:scale-95 transition-all shrink-0"
            >
              <span>Start Bubble Sort (Lesson 01)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Section 1 & 2: Overview Stats & Adaptive Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Mastery Radial Card */}
          <div className="rounded-3xl border border-border/80 bg-[#0c121e]/90 p-6 sm:p-7 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
                Overall Progress
              </span>
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart3 className="h-4 w-4" />
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {overallMetrics.overallScore}%
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                across all 5 core sorting algorithms
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-secondary/80 h-3 rounded-full overflow-hidden p-0.5 border border-border/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${overallMetrics.overallScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>{overallMetrics.masteredCount} of 5 Mastered (&gt;85%)</span>
                <span>Goal: 100%</span>
              </div>
            </div>
          </div>

          {/* Adaptive Guidance Banner */}
          <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-gradient-to-br from-[#0c121e]/90 via-[#0e1626]/80 to-[#0c121e]/90 p-6 sm:p-7 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Adaptive Readiness Engine</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                Current Focus: <strong className="text-white">{activeGuidance.currentTopicName}</strong>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeGuidance.message}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {activeGuidance.status === "weak" &&
                  "Your weighted score is below 60%. Strengthen your foundation by reviewing the algorithm's code line-by-line and re-taking the quiz."}
                {activeGuidance.status === "progressing" &&
                  "You're between 60% and 85%. Try solving the Bug-Hunt challenge or running Step Predictions to unlock full mastery."}
                {activeGuidance.status === "ready" &&
                  "Excellent work! You've achieved a mastery score above 85%. You have a strong grasp of the fundamentals and are ready to advance."}
                {activeGuidance.status === "completed" &&
                  "Incredible achievement! You have mastered all 5 core sorting algorithms with distinction."}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/algorithms/${activeGuidance.nextTopicId || activeGuidance.currentTopicId}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 hover:brightness-110 transition-all active:scale-95"
              >
                <span>
                  {activeGuidance.nextTopicId
                    ? `Advance to ${activeGuidance.nextTopicName}`
                    : `Practice ${activeGuidance.currentTopicName}`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`/algorithms/${activeGuidance.currentTopicId}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/70 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
              >
                <span>Review {activeGuidance.currentTopicName}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section 3: Per-Topic Algorithmic Mastery Breakdown Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              <span>Curriculum Topic Breakdown</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              Curriculum Sequence (01 → 07)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {ORDERED_TOPICS.map(({ id, name, category }, index) => {
              const metrics: TopicMetrics = topicScores[id] || {
                quiz_best_score: 0,
                bug_hunt_best_score: 0,
                docs_completion: 0,
                prediction_best_score: 0,
                computed_topic_score: 0,
                last_activity_at: new Date().toISOString(),
              };

              const score = metrics.computed_topic_score;
              const stepInfo = LEARNING_PATH.find((s) => s.id === id);

              // Color badge depending on threshold
              let badgeColor = "border-rose-500/40 bg-rose-500/10 text-rose-300";
              let badgeLabel = "Needs Review (<60%)";
              let barColor = "from-rose-600 to-red-500";

              if (score >= 85) {
                badgeColor = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
                badgeLabel = "Mastered (Ready)";
                barColor = "from-emerald-500 to-teal-400";
              } else if (score >= 60) {
                badgeColor = "border-amber-500/40 bg-amber-500/10 text-amber-300";
                badgeLabel = "Progressing (60-85%)";
                barColor = "from-amber-500 to-yellow-400";
              }

              return (
                <div
                  key={id}
                  className="rounded-2xl border border-border/80 bg-[#0c121e]/80 p-5 sm:p-6 backdrop-blur-md shadow-xl hover:border-cyan-500/40 transition-all space-y-5"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-secondary border border-border/60 flex items-center justify-center font-mono font-bold text-xs text-cyan-400 shrink-0">
                        0{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white">
                            {name}
                          </h3>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                            {badgeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {stepInfo?.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                          {score}%
                        </span>
                        <span className="block text-[10px] text-muted-foreground font-mono">
                          Mastery Score
                        </span>
                      </div>

                      <Link
                        href={`/algorithms/${id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95"
                      >
                        <span>Practice</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-secondary/80 h-2.5 rounded-full overflow-hidden border border-border/50">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  {/* 4 Contributing Components Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {/* Quiz Pill */}
                    <div className="p-3 rounded-xl bg-card/60 border border-border/50 flex flex-col justify-between space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1">
                          <HelpCircle className="h-3 w-3 text-cyan-400" /> Quiz
                        </span>
                        <span className="font-mono text-[10px]">40% wt</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold font-mono text-foreground">
                          {metrics.quiz_best_score}%
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400">
                          +{(metrics.quiz_best_score * 0.4).toFixed(1)} pts
                        </span>
                      </div>
                    </div>

                    {/* Bug Hunt Pill */}
                    <div className="p-3 rounded-xl bg-card/60 border border-border/50 flex flex-col justify-between space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1">
                          <Bug className="h-3 w-3 text-amber-400" /> Bug Hunt
                        </span>
                        <span className="font-mono text-[10px]">30% wt</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold font-mono text-foreground">
                          {metrics.bug_hunt_best_score}%
                        </span>
                        <span className="text-[10px] font-mono text-amber-400">
                          +{(metrics.bug_hunt_best_score * 0.3).toFixed(1)} pts
                        </span>
                      </div>
                    </div>

                    {/* Docs Completion Pill */}
                    <div className="p-3 rounded-xl bg-card/60 border border-border/50 flex flex-col justify-between space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-emerald-400" /> Docs & Theory
                        </span>
                        <span className="font-mono text-[10px]">20% wt</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold font-mono text-foreground">
                          {metrics.docs_completion}%
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          +{(metrics.docs_completion * 0.2).toFixed(1)} pts
                        </span>
                      </div>
                    </div>

                    {/* Prediction Pill */}
                    <div className="p-3 rounded-xl bg-card/60 border border-border/50 flex flex-col justify-between space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1">
                          <Compass className="h-3 w-3 text-purple-400" /> Prediction
                        </span>
                        <span className="font-mono text-[10px]">10% wt</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold font-mono text-foreground">
                          {metrics.prediction_best_score}%
                        </span>
                        <span className="text-[10px] font-mono text-purple-400">
                          +{(metrics.prediction_best_score * 0.1).toFixed(1)} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Recent Scored Activity Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              <span>Recent Activity History</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              Last {activityHistory.length} attempts recorded
            </span>
          </div>

          {activityHistory.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-muted-foreground space-y-2">
              <p className="text-xs sm:text-sm">No activity recorded yet.</p>
              <p className="text-[11px]">
                Complete quizzes, bug hunts, or prediction exercises to see your session logs here.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/80 bg-[#0c121e]/80 divide-y divide-border/40 backdrop-blur-md overflow-hidden">
              {activityHistory.map((item) => {
                let ActivityIcon = HelpCircle;
                let iconColor = "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";

                if (item.activityType === "bug_hunt") {
                  ActivityIcon = Bug;
                  iconColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
                } else if (item.activityType === "prediction") {
                  ActivityIcon = Compass;
                  iconColor = "text-purple-400 bg-purple-500/10 border-purple-500/30";
                } else if (item.activityType === "docs") {
                  ActivityIcon = BookOpen;
                  iconColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
                }

                const timeAgo = formatTimeAgo(new Date(item.timestamp));

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-card/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 ${iconColor}`}>
                        <ActivityIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-foreground block">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {timeAgo} • Algorithm: {(ALGORITHM_NAME_MAP as Record<string, string>)[item.algorithmId] || item.algorithmId}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold font-mono text-cyan-400">
                        {item.score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#070b12] text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mr-2" />
          <span>Loading AlgoHub Dashboard...</span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
