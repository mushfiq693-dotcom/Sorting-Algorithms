"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ORDERED_TOPICS,
  calculateTopicScore,
  calculateOverallProgress,
  getAdaptiveGuidance,
  ALGORITHM_NAME_MAP,
} from "@/lib/scoring";
import {
  TopicMetrics,
  TopicScoresRecord,
  ActivityHistoryItem,
  UserRole,
} from "../../../backend/database/types/database.types";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Users,
  Award,
  BarChart3,
  Search,
  Filter,
  Send,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  GraduationCap,
  Loader2,
  X,
  RefreshCw,
  BookOpen,
  Bug,
  HelpCircle,
  Compass,
  Flame,
} from "lucide-react";

interface StudentProgressRecord {
  userId: string;
  fullName: string | null;
  email: string;
  department: string | null;
  studentId: string | null;
  role: UserRole;
  lastActiveAt: string;
  topicScores: TopicScoresRecord;
  activityHistory: ActivityHistoryItem[];
  overallScore: number;
  masteredCount: number;
  activeTopic: string;
  isStuckOnActiveTopic: boolean;
}

export default function MentorPortalPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"students" | "analytics">("students");

  // Data states
  const [students, setStudents] = useState<StudentProgressRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("all");
  const [stuckOnlyFilter, setStuckOnlyFilter] = useState(false);

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressRecord | null>(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeTarget, setNoticeTarget] = useState<string>("all");
  const [sendingNotice, setSendingNotice] = useState(false);
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Load all students and their real-time progress
  const loadMentorData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?next=/mentor");
        return;
      }
      setCurrentUser(user);

      // Verify Mentor or Admin role
      const { data: profile } = await (supabase.from("profiles") as any)
        .select("role, full_name, email")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "mentor" && profile?.role !== "admin") {
        router.push("/");
        return;
      }
      setIsAuthorized(true);

      // Fetch all approved students with profiles and user_progress
      const { data: profilesData, error: profilesErr } = await (supabase.from("profiles") as any)
        .select(`
          id, email, full_name, department, student_id, role,
          user_progress (
            topic_scores, activity_history, last_active_at
          )
        `)
        .order("created_at", { ascending: false });

      if (profilesErr) {
        console.error("Error fetching student roster for mentor:", profilesErr);
      }

      if (profilesData) {
        const studentRecords: StudentProgressRecord[] = profilesData
          .filter((p: any) => p.id !== user.id) // Exclude current mentor from student tracking list
          .map((p: any) => {
            const prog = Array.isArray(p.user_progress) ? p.user_progress[0] : p.user_progress;
            const topicScores: TopicScoresRecord = prog?.topic_scores || {};
            const activityHistory: ActivityHistoryItem[] = Array.isArray(prog?.activity_history)
              ? prog.activity_history
              : [];

            const overall = calculateOverallProgress(topicScores);
            const activeTopicMetrics = topicScores[overall.activeTopic];
            const activeScore = activeTopicMetrics?.computed_topic_score ?? 0;
            const isStuck = activeScore > 0 && activeScore < 60;

            return {
              userId: p.id,
              fullName: p.full_name,
              email: p.email,
              department: p.department,
              studentId: p.student_id,
              role: p.role,
              lastActiveAt: prog?.last_active_at || p.created_at,
              topicScores,
              activityHistory,
              overallScore: overall.overallScore,
              masteredCount: overall.masteredCount,
              activeTopic: overall.activeTopic,
              isStuckOnActiveTopic: isStuck,
            };
          });

        setStudents(studentRecords);
      }
    } catch (err) {
      console.error("Error in loadMentorData:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadMentorData();
  }, [loadMentorData]);

  // Notice Dispatch Handler
  const handleSendNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim() || !currentUser) return;
    setSendingNotice(true);
    try {
      const { error } = await (supabase.from("notices") as any).insert({
        sender_id: currentUser.id,
        title: noticeTitle.trim(),
        message: noticeMessage.trim(),
        target_filter: noticeTarget,
      });

      if (error) throw error;
      setNoticeSuccess(true);
      setTimeout(() => {
        setNoticeSuccess(false);
        setShowNoticeModal(false);
        setNoticeTitle("");
        setNoticeMessage("");
        setNoticeTarget("all");
      }, 1500);
    } catch (err: any) {
      alert(`Failed to send notice: ${err.message}`);
    } finally {
      setSendingNotice(false);
    }
  };

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        (s.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.studentId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.department || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic =
        selectedTopicFilter === "all" || s.activeTopic === selectedTopicFilter;

      const matchesStuck = !stuckOnlyFilter || s.isStuckOnActiveTopic;

      return matchesSearch && matchesTopic && matchesStuck;
    });
  }, [students, searchQuery, selectedTopicFilter, stuckOnlyFilter]);

  // Cohort Analytics Aggregations
  const cohortAnalytics = useMemo(() => {
    const totalStudents = students.length;
    if (totalStudents === 0) {
      return {
        topicAverages: ORDERED_TOPICS.map(({ id, name }) => ({ id, name, avgScore: 0, attemptedCount: 0, stuckCount: 0, stuckPercent: 0 })),
        overallCohortAverage: 0,
        stageDistribution: { foundation: 0, intermediate: 0, advanced: 0 },
        stuckStudentsTotal: 0,
      };
    }

    let overallSum = 0;
    let stuckTotal = 0;
    let foundationCount = 0; // bubble, selection
    let intermediateCount = 0; // insertion, merge
    let advancedCount = 0; // quick, stack, queue

    const topicStats: Record<string, { totalScore: number; attemptedCount: number; stuckCount: number }> = {};
    for (const { id } of ORDERED_TOPICS) {
      topicStats[id] = { totalScore: 0, attemptedCount: 0, stuckCount: 0 };
    }

    students.forEach((s) => {
      overallSum += s.overallScore;
      if (s.isStuckOnActiveTopic) stuckTotal++;

      if (s.activeTopic === "bubble" || s.activeTopic === "selection") foundationCount++;
      else if (s.activeTopic === "insertion" || s.activeTopic === "merge") intermediateCount++;
      else advancedCount++;

      ORDERED_TOPICS.forEach(({ id }) => {
        const t = s.topicScores[id];
        const score = t?.computed_topic_score ?? 0;
        if (score > 0 || (t && (t.quiz_best_score > 0 || t.bug_hunt_best_score > 0 || t.docs_completion > 0 || t.prediction_best_score > 0))) {
          topicStats[id].attemptedCount++;
          topicStats[id].totalScore += score;
          if (score < 60) {
            topicStats[id].stuckCount++;
          }
        }
      });
    });

    const topicAverages = ORDERED_TOPICS.map(({ id, name }) => {
      const stats = topicStats[id];
      const avg = stats.attemptedCount > 0 ? Math.round(stats.totalScore / stats.attemptedCount) : 0;
      const stuckPercent = stats.attemptedCount > 0 ? Math.round((stats.stuckCount / stats.attemptedCount) * 100) : 0;
      return {
        id,
        name,
        avgScore: avg,
        attemptedCount: stats.attemptedCount,
        stuckCount: stats.stuckCount,
        stuckPercent,
      };
    });

    return {
      topicAverages,
      overallCohortAverage: Math.round(overallSum / totalStudents),
      stageDistribution: {
        foundation: foundationCount,
        intermediate: intermediateCount,
        advanced: advancedCount,
      },
      stuckStudentsTotal: stuckTotal,
    };
  }, [students]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-foreground">
        <div className="flex items-center gap-3 text-sm font-mono text-purple-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verifying Mentor Credentials & Synchronizing Cohort...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-foreground flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-purple-950/70 bg-[#0c0514]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  AlgoHub Mentor Portal
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold ml-1 hidden sm:inline">
                Cohort Oversight
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Notice</span>
            </button>

            <button
              onClick={loadMentorData}
              disabled={isLoading}
              className="p-2 rounded-xl border border-purple-950 bg-[#12071f] text-slate-300 hover:text-white hover:border-purple-600 transition-colors"
              title="Refresh Cohort Data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* KPI Cohort Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-purple-500/30 bg-[#10071c] space-y-1">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-xs font-mono font-semibold">Enrolled Cohort</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {students.length}
            </div>
            <p className="text-[11px] text-slate-400">Students under mentorship</p>
          </div>

          <div className="p-4 rounded-2xl border border-rose-500/30 bg-[#140612] space-y-1">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs font-mono font-semibold">Needs Attention</span>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {cohortAnalytics.stuckStudentsTotal}
            </div>
            <p className="text-[11px] text-slate-400">Scoring &lt; 60% on active topic</p>
          </div>

          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-[#06121c] space-y-1">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-xs font-mono font-semibold">Cohort Avg Progress</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {cohortAnalytics.overallCohortAverage}%
            </div>
            <p className="text-[11px] text-slate-400">Across all 5 sorting algorithms</p>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-[#071810] space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-mono font-semibold">Advanced / Ready</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {cohortAnalytics.stageDistribution.advanced}
            </div>
            <p className="text-[11px] text-slate-400">On Quick Sort or fully mastered</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-purple-950 gap-2">
          <button
            onClick={() => setActiveTab("students")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "students"
                ? "border-purple-500 text-purple-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Student Tracking Roster ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "analytics"
                ? "border-purple-500 text-purple-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Cohort Analytics &amp; Stuck Rates</span>
          </button>
        </div>

        {/* TAB 1: STUDENT ROSTER & TRACKING */}
        {activeTab === "students" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students by name, email, roll ID..."
                  className="w-full rounded-xl border border-purple-950 bg-[#0e0717] pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setStuckOnlyFilter(!stuckOnlyFilter)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold font-mono transition-all ${
                    stuckOnlyFilter
                      ? "border-rose-500 bg-rose-500/20 text-rose-300 font-bold"
                      : "border-purple-950 bg-[#0e0717] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Stuck Students Only (&lt;60%)</span>
                </button>

                <div className="flex items-center gap-1 bg-[#0e0717] border border-purple-950 p-1 rounded-xl">
                  {["all", "bubble", "selection", "insertion", "merge", "quick"].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopicFilter(topic)}
                      className={`px-2.5 py-1 rounded-lg capitalize text-xs transition-all ${
                        selectedTopicFilter === topic
                          ? "bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {topic === "all" ? "All Topics" : topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="rounded-2xl border border-purple-950/70 bg-[#0c0514]/95 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-purple-950/80 bg-[#150821] text-slate-400 font-mono">
                    <tr>
                      <th className="p-3.5">Student Scholar</th>
                      <th className="p-3.5">Dept &amp; Roll ID</th>
                      <th className="p-3.5">Active Algorithm</th>
                      <th className="p-3.5">Overall Progress</th>
                      <th className="p-3.5">Status Flag</th>
                      <th className="p-3.5 text-right">Mastery Breakdown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-950/40 text-slate-300 font-sans">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                          No students matched your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => {
                        const activeMetric = s.topicScores[s.activeTopic];
                        const activeScore = activeMetric?.computed_topic_score ?? 0;

                        return (
                          <tr key={s.userId} className="hover:bg-purple-950/20 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-white">
                                {s.fullName || "Student Scholar"}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">{s.email}</div>
                            </td>

                            <td className="p-3.5 font-mono text-[11px]">
                              <div>{s.department || "CSE"}</div>
                              <div className="text-slate-400">{s.studentId || "N/A"}</div>
                            </td>

                            <td className="p-3.5">
                              <div className="font-semibold text-white">
                                {(ALGORITHM_NAME_MAP as any)[s.activeTopic] || s.activeTopic}
                              </div>
                              <div className="text-[11px] font-mono text-cyan-400">
                                Current Score: {activeScore}%
                              </div>
                            </td>

                            <td className="p-3.5 w-48">
                              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                                <span className="text-slate-400">Mastery</span>
                                <span className="text-white font-bold">{s.overallScore}%</span>
                              </div>
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                  style={{ width: `${s.overallScore}%` }}
                                />
                              </div>
                            </td>

                            <td className="p-3.5">
                              {s.isStuckOnActiveTopic ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                                  <AlertTriangle className="h-3 w-3 text-rose-400" />
                                  <span>Needs Attention (&lt;60%)</span>
                                </span>
                              ) : s.overallScore >= 85 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                  <span>Mastered</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                  <Clock className="h-3 w-3 text-cyan-400" />
                                  <span>Progressing</span>
                                </span>
                              )}
                            </td>

                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => setSelectedStudent(s)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-semibold"
                              >
                                <span>Inspect Details</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COHORT ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Algorithm Performance & Stuck Rates Chart */}
            <div className="rounded-3xl border border-purple-950/80 bg-[#0c0514]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-950 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    <span>Per-Algorithm Average Score vs. Stuck Percentage</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Stuck % is calculated strictly for students who have attempted that specific algorithm.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-cyan-500" /> Avg Score (%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500" /> Stuck Rate (&lt;60%)
                  </span>
                </div>
              </div>

              {/* Bar Comparison Charts */}
              <div className="space-y-5">
                {cohortAnalytics.topicAverages.map((t) => (
                  <div key={t.id} className="space-y-2 p-4 rounded-2xl bg-black/40 border border-purple-950/40">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white">{t.name}</span>
                      <span className="text-slate-400">
                        {t.attemptedCount} / {students.length} attempted • {t.stuckCount} struggling
                      </span>
                    </div>

                    {/* Average Score Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                        <span>Cohort Average Score</span>
                        <span>{t.avgScore}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${t.avgScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Stuck Percentage Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-rose-400">
                        <span>Stuck Rate among active learners</span>
                        <span>{t.stuckPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${t.stuckPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cohort Stage Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-[#06121c] space-y-2">
                <div className="flex items-center justify-between text-cyan-400 font-mono text-xs font-bold">
                  <span>Foundation Stage</span>
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {cohortAnalytics.stageDistribution.foundation}
                </div>
                <p className="text-xs text-slate-300">Active on Bubble Sort or Selection Sort.</p>
              </div>

              <div className="p-5 rounded-2xl border border-purple-500/30 bg-[#12071f] space-y-2">
                <div className="flex items-center justify-between text-purple-400 font-mono text-xs font-bold">
                  <span>Intermediate Stage</span>
                  <Layers className="h-4 w-4" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {cohortAnalytics.stageDistribution.intermediate}
                </div>
                <p className="text-xs text-slate-300">Active on Insertion Sort or Merge Sort.</p>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-[#06180f] space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-mono text-xs font-bold">
                  <span>Advanced / Mastered</span>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {cohortAnalytics.stageDistribution.advanced}
                </div>
                <p className="text-xs text-slate-300">Working on Quick Sort or completed curriculum.</p>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT DETAIL DRAWER / MODAL */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-purple-500/40 bg-[#0e0717] p-6 sm:p-8 shadow-2xl shadow-purple-950/60 space-y-6">
              <div className="flex items-start justify-between border-b border-purple-950/80 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 font-mono text-[10px] font-semibold mb-1">
                    GSTU {selectedStudent.department || "CSE"} • {selectedStudent.studentId || "Student"}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedStudent.fullName || "Student Scholar"}
                  </h2>
                  <p className="text-xs font-mono text-slate-400">{selectedStudent.email}</p>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Per-Topic Scores Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Curriculum Competency Scores (7 Topics)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ORDERED_TOPICS.map(({ id, name }) => {
                    const m: TopicMetrics | undefined = selectedStudent.topicScores[id];
                    const score = m?.computed_topic_score ?? 0;
                    const guidance = getAdaptiveGuidance(id, score);

                    return (
                      <div key={id} className="p-4 rounded-2xl bg-black/50 border border-purple-950/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{name}</span>
                          <span className={`text-xs font-mono font-bold ${
                            score >= 85 ? "text-emerald-400" : score >= 60 ? "text-cyan-400" : "text-rose-400"
                          }`}>
                            {score}%
                          </span>
                        </div>

                        {/* 4 Sub-metric breakdown */}
                        <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center pt-1 border-t border-purple-950/40">
                          <div className="bg-purple-950/30 p-1 rounded">
                            <span className="text-cyan-400 block">Q: {m?.quiz_best_score || 0}%</span>
                          </div>
                          <div className="bg-purple-950/30 p-1 rounded">
                            <span className="text-amber-400 block">B: {m?.bug_hunt_best_score || 0}%</span>
                          </div>
                          <div className="bg-purple-950/30 p-1 rounded">
                            <span className="text-emerald-400 block">D: {m?.docs_completion || 0}%</span>
                          </div>
                          <div className="bg-purple-950/30 p-1 rounded">
                            <span className="text-purple-400 block">P: {m?.prediction_best_score || 0}%</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-400 italic">{guidance.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Recent Activity Log ({selectedStudent.activityHistory.length})
                </h3>
                {selectedStudent.activityHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono">No recent activity logged yet.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedStudent.activityHistory.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-purple-950/30 text-xs font-mono"
                      >
                        <span className="text-slate-200">{act.title}</span>
                        <span className="text-cyan-400 font-bold">{act.score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SEND NOTICE MODAL */}
        {showNoticeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl border border-purple-500/40 bg-[#0e0717] p-6 sm:p-7 shadow-2xl shadow-purple-950/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-base">
                  <Send className="h-5 w-5 text-purple-400" />
                  <span>Dispatch Mentor Broadcast Notice</span>
                </div>
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {noticeSuccess ? (
                <div className="p-8 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-300">Notice Broadcast Successfully!</p>
                  <p className="text-xs text-slate-400">All targeted students will receive this in their notification hub.</p>
                </div>
              ) : (
                <form onSubmit={handleSendNotice} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-semibold text-purple-300">
                      Target Student Group
                    </label>
                    <select
                      value={noticeTarget}
                      onChange={(e) => setNoticeTarget(e.target.value)}
                      className="w-full rounded-xl border border-purple-950 bg-black/70 p-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="all">All Enrolled Students</option>
                      <option value="weak_bubble">Students Struggling with Bubble Sort (&lt;60%)</option>
                      <option value="weak_selection">Students Struggling with Selection Sort (&lt;60%)</option>
                      <option value="weak_insertion">Students Struggling with Insertion Sort (&lt;60%)</option>
                      <option value="weak_merge">Students Struggling with Merge Sort (&lt;60%)</option>
                      <option value="weak_quick">Students Struggling with Quick Sort (&lt;60%)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-semibold text-purple-300">
                      Notice Title
                    </label>
                    <input
                      required
                      type="text"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      placeholder="e.g. Office Hours on Merge Sort Recursion Trees"
                      className="w-full rounded-xl border border-purple-950 bg-black/70 p-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-semibold text-purple-300">
                      Message Content
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={noticeMessage}
                      onChange={(e) => setNoticeMessage(e.target.value)}
                      placeholder="Type guidance, study advice, or workshop links for the cohort..."
                      className="w-full rounded-xl border border-purple-950 bg-black/70 p-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNoticeModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingNotice || !noticeTitle.trim() || !noticeMessage.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:brightness-110 disabled:opacity-50 transition-all active:scale-95"
                    >
                      {sendingNotice ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      <span>Broadcast Notice</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
