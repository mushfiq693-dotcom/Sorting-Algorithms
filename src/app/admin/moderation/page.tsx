"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  getGlobalPresenceState,
  parsePresenceMap,
} from "@/components/telemetry/UserPresenceTracker";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Search,
  MessageSquare,
  Bug,
  RefreshCw,
  ArrowLeft,
  Star,
  Loader2,
  GraduationCap,
  ShieldCheck,
  Award,
  UserCheck,
  UserX,
  Crown,
  Sparkles,
  Activity,
  Zap,
  Eye,
  BookOpen,
  BarChart2,
  X,
  Radio,
  Check,
} from "lucide-react";

interface UserProgressData {
  completed_steps?: string[];
  completed_docs?: string[];
  quiz_scores?: Record<string, number>;
  topic_scores?: Record<string, any>;
  activity_history?: Array<{
    id: string;
    algorithmId: string;
    activityType: string;
    score: number;
    title: string;
    timestamp: string;
  }>;
  last_active_at?: string | null;
}

interface ProfileUser {
  id: string;
  email: string;
  full_name: string | null;
  department: string | null;
  student_id: string | null;
  avatar_url: string | null;
  role: "student" | "mentor" | "admin";
  created_at: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  approved_at: string | null;
  notes: string | null;
  // Telemetry fields from user_progress
  completed_steps: string[];
  completed_docs: string[];
  quiz_scores: Record<string, number>;
  topic_scores: Record<string, any>;
  activity_history: Array<{
    id: string;
    algorithmId: string;
    activityType: string;
    score: number;
    title: string;
    timestamp: string;
  }>;
  last_active_at: string | null;
}

interface MentorApplicationItem {
  id: string;
  user_id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
    department: string | null;
    student_id: string | null;
    role: string;
  };
}

interface FeedbackItem {
  id: string;
  user_id: string;
  category: string;
  rating: number | null;
  message: string;
  page_url: string | null;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

interface BugReportItem {
  id: string;
  user_id: string;
  algorithm_id: string | null;
  page_url: string;
  steps_to_reproduce: string;
  expected_behavior: string | null;
  actual_behavior: string | null;
  browser_info: string | null;
  status: "open" | "investigating" | "resolved" | "closed";
  created_at: string;
  profiles?: {
    email: string;
    full_name: string | null;
  };
}

// Format relative time helper
function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Never";
  const now = Date.now();
  const past = new Date(dateString).getTime();
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 45) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function AdminModerationPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "mentors" | "feedback" | "bugs">("users");

  // Data states
  const [users, setUsers] = useState<ProfileUser[]>([]);
  const [mentorApps, setMentorApps] = useState<MentorApplicationItem[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [bugsList, setBugsList] = useState<BugReportItem[]>([]);

  // Real-time live presence tracking map: userId -> { page, online_at }
  const [liveOnlineMap, setLiveOnlineMap] = useState<Map<string, { page?: string; online_at?: string }>>(new Map());

  // Selected User for Activity Inspector Drawer / Modal
  const [inspectingUser, setInspectingUser] = useState<ProfileUser | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [presenceFilter, setPresenceFilter] = useState<"all" | "online" | "recent">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Load all data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // 1. Verify Admin Role
      const { data: currentProfile, error: profileErr } = await (supabase.from("profiles") as any)
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileErr || currentProfile?.role !== "admin") {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      setIsAdmin(true);

      // 2. Fetch all tables independently to completely eliminate PostgREST relation ambiguity
      const [profilesRes, betaRes, progressRes, mentorAppsRes, feedbackRes, bugsRes] = await Promise.all([
        (supabase.from("profiles") as any).select("*").order("created_at", { ascending: false }),
        (supabase.from("beta_access") as any).select("user_id, status, approved_at, notes"),
        (supabase.from("user_progress") as any).select("user_id, completed_steps, completed_docs, quiz_scores, topic_scores, activity_history, last_active_at"),
        (supabase.from("mentor_applications") as any).select("*").order("created_at", { ascending: false }),
        (supabase.from("feedback") as any).select("*").order("created_at", { ascending: false }),
        (supabase.from("bug_reports") as any).select("*").order("created_at", { ascending: false }),
      ]);

      const profileMap = new Map<string, any>();
      (profilesRes.data || []).forEach((p: any) => {
        if (p?.id) profileMap.set(p.id, p);
      });

      const betaMap = new Map<string, any>();
      (betaRes.data || []).forEach((b: any) => {
        if (b?.user_id) betaMap.set(b.user_id, b);
      });

      const progMap = new Map<string, any>();
      (progressRes.data || []).forEach((p: any) => {
        if (p?.user_id) progMap.set(p.user_id, p);
      });

      if (profilesRes.data && Array.isArray(profilesRes.data)) {
        const formattedUsers: ProfileUser[] = profilesRes.data.map((p: any) => {
          const beta = betaMap.get(p.id) || {};
          const prog: UserProgressData = progMap.get(p.id) || {};

          return {
            id: p.id,
            email: p.email || "",
            full_name: p.full_name || null,
            department: p.department || null,
            student_id: p.student_id || null,
            avatar_url: p.avatar_url || null,
            role: p.role || "student",
            created_at: p.created_at || new Date().toISOString(),
            status: beta.status || "approved",
            approved_at: beta.approved_at || null,
            notes: beta.notes || null,
            completed_steps: Array.isArray(prog.completed_steps) ? prog.completed_steps : [],
            completed_docs: Array.isArray(prog.completed_docs) ? prog.completed_docs : [],
            quiz_scores: prog.quiz_scores && typeof prog.quiz_scores === "object" ? prog.quiz_scores : {},
            topic_scores: prog.topic_scores && typeof prog.topic_scores === "object" ? prog.topic_scores : {},
            activity_history: Array.isArray(prog.activity_history) ? prog.activity_history : [],
            last_active_at: prog.last_active_at || null,
          };
        });
        setUsers(formattedUsers);
      }

      if (mentorAppsRes.data && Array.isArray(mentorAppsRes.data)) {
        const formattedMentorApps = mentorAppsRes.data.map((m: any) => ({
          ...m,
          profiles: profileMap.get(m.user_id) || null,
        }));
        setMentorApps(formattedMentorApps);
      }

      if (feedbackRes.data && Array.isArray(feedbackRes.data)) {
        const formattedFeedback = feedbackRes.data.map((f: any) => ({
          ...f,
          profiles: profileMap.get(f.user_id) || null,
        }));
        setFeedbackList(formattedFeedback);
      }

      if (bugsRes.data && Array.isArray(bugsRes.data)) {
        const formattedBugs = bugsRes.data.map((b: any) => ({
          ...b,
          profiles: profileMap.get(b.user_id) || null,
        }));
        setBugsList(formattedBugs);
      }
    } catch (err) {
      console.error("Failed to load moderation data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time Presence Listener synchronized with UserPresenceTracker
  useEffect(() => {
    // 1. Initial hydration from existing memory cache
    const initialPresence = getGlobalPresenceState();
    if (initialPresence && Object.keys(initialPresence).length > 0) {
      setLiveOnlineMap(parsePresenceMap(initialPresence));
    }

    // 2. Window event listener for live realtime sync/join/leave events
    const handlePresenceEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Record<string, any>>;
      if (customEvent.detail) {
        setLiveOnlineMap(parsePresenceMap(customEvent.detail));
      }
    };

    window.addEventListener("algohub:presence-sync", handlePresenceEvent);

    return () => {
      window.removeEventListener("algohub:presence-sync", handlePresenceEvent);
    };
  }, []);

  // Online Check Helper
  const checkIsUserOnline = useCallback(
    (user: ProfileUser): { isOnline: boolean; isRecent: boolean; label: string; activePage?: string } => {
      const liveData = liveOnlineMap.get(user.id);
      if (liveData) {
        return {
          isOnline: true,
          isRecent: false,
          label: "Online Now",
          activePage: liveData.page || "Active on Platform",
        };
      }

      if (user.last_active_at) {
        const diffMs = Date.now() - new Date(user.last_active_at).getTime();
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin <= 4) {
          return {
            isOnline: true,
            isRecent: false,
            label: "Online Now",
            activePage: "Active recently",
          };
        }

        if (diffMin <= 60) {
          return {
            isOnline: false,
            isRecent: true,
            label: `Active ${diffMin}m ago`,
          };
        }

        const diffHours = Math.floor(diffMin / 60);
        if (diffHours < 24) {
          return {
            isOnline: false,
            isRecent: false,
            label: `Active ${diffHours}h ago`,
          };
        }
      }

      return {
        isOnline: false,
        isRecent: false,
        label: formatTimeAgo(user.last_active_at || user.created_at),
      };
    },
    [liveOnlineMap]
  );

  // Mentor Application Action Handlers
  const handleApproveMentor = async (appId: string, userId: string) => {
    setActionLoadingId(appId);
    try {
      const {
        data: { user: currentAdmin },
      } = await supabase.auth.getUser();

      const { error: appErr } = await (supabase.from("mentor_applications") as any)
        .update({
          status: "approved",
          reviewed_by: currentAdmin?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", appId);

      if (appErr) throw appErr;

      const { error: roleErr } = await (supabase.from("profiles") as any)
        .update({ role: "mentor" })
        .eq("id", userId);

      if (roleErr) throw roleErr;

      setMentorApps((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, status: "approved", reviewed_at: new Date().toISOString() }
            : app
        )
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: "mentor" } : u))
      );
    } catch (err: any) {
      alert(`Failed to approve mentor: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectMentor = async (appId: string) => {
    setActionLoadingId(appId);
    try {
      const {
        data: { user: currentAdmin },
      } = await supabase.auth.getUser();

      const { error: appErr } = await (supabase.from("mentor_applications") as any)
        .update({
          status: "rejected",
          reviewed_by: currentAdmin?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", appId);

      if (appErr) throw appErr;

      setMentorApps((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, status: "rejected", reviewed_at: new Date().toISOString() }
            : app
        )
      );
    } catch (err: any) {
      alert(`Failed to reject mentor: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // User Role and Account Status Update
  const handleUpdateRole = async (userId: string, newRole: "student" | "mentor" | "admin") => {
    setActionLoadingId(userId);
    try {
      const { error } = await (supabase.from("profiles") as any)
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      if (inspectingUser && inspectingUser.id === userId) {
        setInspectingUser({ ...inspectingUser, role: newRole });
      }
    } catch (err: any) {
      alert(`Failed to update role: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: "approved" | "suspended") => {
    setActionLoadingId(userId);
    try {
      const {
        data: { user: currentAdmin },
      } = await supabase.auth.getUser();

      const { error } = await (supabase.from("beta_access") as any)
        .update({
          status: newStatus,
          approved_by: newStatus === "approved" ? currentAdmin?.id : null,
          approved_at: newStatus === "approved" ? new Date().toISOString() : null,
        })
        .eq("user_id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                status: newStatus,
                approved_at: newStatus === "approved" ? new Date().toISOString() : null,
              }
            : u
        )
      );
      if (inspectingUser && inspectingUser.id === userId) {
        setInspectingUser({ ...inspectingUser, status: newStatus });
      }
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Bug Report Status Update
  const handleUpdateBugStatus = async (bugId: string, newStatus: "open" | "investigating" | "resolved" | "closed") => {
    try {
      const { error } = await (supabase.from("bug_reports") as any)
        .update({ status: newStatus })
        .eq("id", bugId);

      if (error) throw error;

      setBugsList((prev) =>
        prev.map((b) => (b.id === bugId ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      alert(`Failed to update bug status: ${err.message}`);
    }
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch =
          (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.student_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.department || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || u.status === statusFilter;

        const onlineInfo = checkIsUserOnline(u);
        const matchesPresence =
          presenceFilter === "all" ||
          (presenceFilter === "online" && onlineInfo.isOnline) ||
          (presenceFilter === "recent" && (onlineInfo.isOnline || onlineInfo.isRecent));

        return matchesSearch && matchesStatus && matchesPresence;
      })
      .sort((a, b) => {
        const aOnline = checkIsUserOnline(a).isOnline;
        const bOnline = checkIsUserOnline(b).isOnline;
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;

        const aTime = a.last_active_at ? new Date(a.last_active_at).getTime() : new Date(a.created_at).getTime();
        const bTime = b.last_active_at ? new Date(b.last_active_at).getTime() : new Date(b.created_at).getTime();
        return bTime - aTime;
      });
  }, [users, searchQuery, statusFilter, presenceFilter, checkIsUserOnline]);

  // Aggregate Platform KPI Metrics
  const onlineCount = useMemo(() => {
    return users.filter((u) => checkIsUserOnline(u).isOnline).length;
  }, [users, checkIsUserOnline]);

  const activeTodayCount = useMemo(() => {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return users.filter((u) => {
      if (!u.last_active_at) return false;
      return new Date(u.last_active_at).getTime() > twentyFourHoursAgo;
    }).length;
  }, [users]);

  const totalStepsCompleted = useMemo(() => {
    return users.reduce((acc, u) => acc + (u.completed_steps?.length || 0), 0);
  }, [users]);

  const pendingMentorCount = mentorApps.filter((m) => m.status === "pending").length;
  const openBugsCount = bugsList.filter((b) => b.status === "open").length;

  if (isLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-sm font-sans text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Verifying Administrator Console Access...</span>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans p-4">
        <div className="max-w-md w-full p-6 rounded-2xl border border-border bg-card/90 text-center space-y-4 shadow-xl corner-flourish">
          <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive border border-destructive/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-heading text-foreground">Access Restricted</h2>
            <p className="text-xs text-muted-foreground">
              You do not have administrator permissions to access this control center. Please sign in with an administrator account.
            </p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-border bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
            >
              Return Home
            </Link>
            <Link
              href="/auth/login"
              className="btn-brass px-4 py-2 rounded-lg text-xs font-semibold text-primary-foreground shadow-brass hover:scale-[1.02] transition-all"
            >
              Sign In as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-[#C9A962]/35 selection:text-[#1C1714] transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded border border-border bg-card text-foreground hover:text-primary hover:border-primary transition-colors"
              title="Back to AlgoHub"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                AlgoHub Admin & Telemetry Dashboard
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-bold ml-1">
                Live Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator Pill in Header */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{onlineCount} Online Right Now</span>
            </div>

            <ThemeToggle />
            <button
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-xs font-semibold text-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title and Intro */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-heading">
            Admin <span className="italic font-semibold text-primary dark:text-[#D4B872]">Control Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            Monitor real-time learner presence, inspect algorithm activity telemetry, manage permissions, and track platform growth.
          </p>
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Users */}
          <div className="p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-mono font-semibold">Total Accounts</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {users.length}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Registered developers</p>
          </div>

          {/* Card 2: 🟢 Online Right Now */}
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-mono font-semibold flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Online Now
              </span>
              <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {onlineCount}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Active in product right now</p>
          </div>

          {/* Card 3: Active Today */}
          <div className="p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-primary">
              <span className="text-xs font-mono font-semibold">Active Today</span>
              <Activity className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {activeTodayCount}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Active in past 24 hours</p>
          </div>

          {/* Card 4: Total Steps Completed */}
          <div className="p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-cyan-500 dark:text-cyan-400">
              <span className="text-xs font-mono font-semibold">Steps Solved</span>
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {totalStepsCompleted}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Total algorithm milestones</p>
          </div>

          {/* Card 5: Feedback & Bugs */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-rose-500 dark:text-rose-400">
              <span className="text-xs font-mono font-semibold">Feedback / Bugs</span>
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {feedbackList.length} <span className="text-xs text-muted-foreground font-normal">/ {openBugsCount} bugs</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Community submissions</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border gap-2 overflow-x-auto font-sans">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "users"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Learners & Activity ({users.length})</span>
            {onlineCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold animate-pulse">
                {onlineCount} Online
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("mentors")}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "mentors"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Mentor Applications ({mentorApps.length})</span>
            {pendingMentorCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px] font-mono">
                {pendingMentorCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "feedback"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Feedback ({feedbackList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("bugs")}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "bugs"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bug className="h-4 w-4" />
            <span>Bug Reports ({bugsList.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS & REAL-TIME ACTIVITY TELEMETRY */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Filters, Search, and Live Presence Filter */}
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, institution..."
                  className="w-full rounded border border-border bg-background pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-sans"
                />
              </div>

              {/* Presence & Status Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {/* Presence Filter */}
                <div className="inline-flex rounded-lg border border-border bg-secondary/40 p-0.5">
                  <button
                    onClick={() => setPresenceFilter("all")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      presenceFilter === "all"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setPresenceFilter("online")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      presenceFilter === "online"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-xs font-bold"
                        : "text-muted-foreground hover:text-emerald-500"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>🟢 Online ({onlineCount})</span>
                  </button>
                  <button
                    onClick={() => setPresenceFilter("recent")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      presenceFilter === "recent"
                        ? "bg-card text-primary font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Active Recently
                  </button>
                </div>
              </div>
            </div>

            {/* Users & Live Activity Table */}
            <div className="rounded-xl border border-border bg-card/90 overflow-hidden shadow-sm corner-flourish">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="border-b border-border bg-secondary/60 text-muted-foreground font-mono">
                    <tr>
                      <th className="p-3.5">Learner Profile</th>
                      <th className="p-3.5">Live Presence & Status</th>
                      <th className="p-3.5">Learning Telemetry</th>
                      <th className="p-3.5">Institution & ID</th>
                      <th className="p-3.5 text-right">Activity & Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-muted-foreground font-sans">
                          No matching learners or users found for the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const onlineInfo = checkIsUserOnline(user);
                        const initials = (user.full_name || user.email || "U").charAt(0).toUpperCase();

                        return (
                          <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                            {/* User Profile Column with Avatar & Green Online Dot */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                {/* Avatar with Live Presence Indicator */}
                                <div className="relative shrink-0">
                                  {user.avatar_url ? (
                                    <img
                                      src={user.avatar_url}
                                      alt={user.full_name || user.email}
                                      className="h-9 w-9 rounded-full object-cover border border-border"
                                    />
                                  ) : (
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#8B2635] via-[#B08422] to-[#C9A962] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                                      {initials}
                                    </div>
                                  )}

                                  {/* 🟢 Live Green Online Signal Badge on Avatar */}
                                  {onlineInfo.isOnline ? (
                                    <span
                                      className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3"
                                      title="User is online now"
                                    >
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-card"></span>
                                    </span>
                                  ) : onlineInfo.isRecent ? (
                                    <span
                                      className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 border-2 border-card"
                                      title="Active in last hour"
                                    />
                                  ) : null}
                                </div>

                                <div>
                                  <div className="font-semibold text-foreground flex items-center gap-2">
                                    <span>{user.full_name || "Unnamed Developer"}</span>
                                    {user.role === "admin" && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary text-primary-foreground font-bold">
                                        Admin
                                      </span>
                                    )}
                                    {user.role === "mentor" && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#8B2635]/20 text-[#8B2635] dark:text-[#E8DFD4] border border-[#8B2635] font-bold">
                                        Mentor
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] font-mono text-muted-foreground">{user.email}</div>
                                  <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                                    Joined {new Date(user.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Live Presence Column */}
                            <td className="p-3.5">
                              {onlineInfo.isOnline ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold shadow-xs">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span>Online Now</span>
                                  </span>
                                  <div className="text-[10px] font-mono text-emerald-600/80 dark:text-emerald-400/80 truncate max-w-[140px]">
                                    {onlineInfo.activePage}
                                  </div>
                                </div>
                              ) : onlineInfo.isRecent ? (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    <span>{onlineInfo.label}</span>
                                  </span>
                                </div>
                              ) : (
                                <div className="text-[11px] font-mono text-muted-foreground">
                                  <span>Last seen: {onlineInfo.label}</span>
                                </div>
                              )}
                            </td>

                            {/* Learning Telemetry Column */}
                            <td className="p-3.5 font-mono text-[11px]">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
                                    {user.completed_steps.length} Steps
                                  </span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-foreground">
                                    {Object.keys(user.quiz_scores).length} Quizzes
                                  </span>
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {user.completed_docs.length} Docs read
                                </div>
                              </div>
                            </td>

                            {/* Institution & Roll ID Column */}
                            <td className="p-3.5 font-mono text-[11px]">
                              <div>{user.department || "General"}</div>
                              <div className="text-muted-foreground">{user.student_id || "N/A"}</div>
                            </td>

                            {/* Moderation & Activity Inspection Actions */}
                            <td className="p-3.5 text-right font-sans">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Inspect Telemetry / Activity History Button */}
                                <button
                                  onClick={() => setInspectingUser(user)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs transition-colors cursor-pointer"
                                  title="View full activity history & quiz telemetry"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>Activity</span>
                                </button>

                                {/* Role Selector */}
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateRole(user.id, e.target.value as any)}
                                  disabled={actionLoadingId === user.id}
                                  className="bg-card text-foreground border border-border rounded px-2 py-1 text-xs font-mono focus:border-primary focus:outline-none cursor-pointer"
                                  title="Change role"
                                >
                                  <option value="student">Student</option>
                                  <option value="mentor">Mentor</option>
                                  <option value="admin">Admin</option>
                                </select>

                                {/* Suspend / Unsuspend */}
                                {user.status === "suspended" ? (
                                  <button
                                    onClick={() => handleUpdateStatus(user.id, "approved")}
                                    disabled={actionLoadingId === user.id}
                                    className="px-2 py-1 rounded border border-border bg-secondary/50 text-muted-foreground font-semibold hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    Unsuspend
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateStatus(user.id, "suspended")}
                                    disabled={actionLoadingId === user.id || user.role === "admin"}
                                    className="px-2 py-1 rounded border border-destructive/40 bg-destructive/10 text-destructive font-semibold hover:bg-destructive/20 transition-colors disabled:opacity-30 cursor-pointer"
                                    title={user.role === "admin" ? "Admins cannot be suspended" : "Suspend account"}
                                  >
                                    Suspend
                                  </button>
                                )}
                              </div>
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

        {/* TAB 2: MENTOR APPLICATIONS */}
        {activeTab === "mentors" && (
          <div className="space-y-4">
            {mentorApps.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground rounded-xl border border-border bg-card/80 font-sans">
                No mentor applications submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card/90 overflow-hidden shadow-sm corner-flourish">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="border-b border-border bg-secondary/60 text-muted-foreground font-mono">
                        <tr>
                          <th className="p-3.5">Applicant Profile</th>
                          <th className="p-3.5">Institution & ID</th>
                          <th className="p-3.5">Motivation Statement</th>
                          <th className="p-3.5">Current Role</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Moderation Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground">
                        {mentorApps.map((app) => (
                          <tr key={app.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-3.5">
                              <div className="font-semibold text-foreground">
                                {app.profiles?.full_name || "Anonymous Applicant"}
                              </div>
                              <div className="text-[11px] font-mono text-muted-foreground">
                                {app.profiles?.email || "No email"}
                              </div>
                            </td>

                            <td className="p-3.5 font-mono text-[11px]">
                              <div>{app.profiles?.department || "General"}</div>
                              <div className="text-muted-foreground">
                                {app.profiles?.student_id || "N/A"}
                              </div>
                            </td>

                            <td className="p-3.5 max-w-xs sm:max-w-sm">
                              <p className="text-xs text-foreground line-clamp-3 bg-secondary/40 p-2.5 rounded border border-border font-sans">
                                {app.reason}
                              </p>
                              <div className="text-[10px] font-mono text-muted-foreground mt-1">
                                Applied: {new Date(app.created_at).toLocaleDateString()}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <span
                                className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                  app.profiles?.role === "mentor"
                                    ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40"
                                    : app.profiles?.role === "admin"
                                    ? "bg-primary/20 text-primary border border-primary/40"
                                    : "bg-secondary text-muted-foreground border border-border"
                                }`}
                              >
                                {app.profiles?.role || "student"}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <span
                                className={`inline-flex items-center gap-1 font-mono text-[10px] px-2.5 py-0.5 rounded font-bold uppercase ${
                                  app.status === "approved"
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                    : app.status === "pending"
                                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                    : "bg-destructive/10 text-destructive border border-destructive/30"
                                }`}
                              >
                                {app.status === "approved" && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                                {app.status === "pending" && <Clock className="h-3 w-3 text-amber-600" />}
                                {app.status === "rejected" && <XCircle className="h-3 w-3 text-destructive" />}
                                <span>{app.status}</span>
                              </span>
                            </td>

                            <td className="p-3.5 text-right font-sans">
                              <div className="flex items-center justify-end gap-1.5">
                                {app.status !== "approved" && (
                                  <button
                                    onClick={() => handleApproveMentor(app.id, app.user_id)}
                                    disabled={actionLoadingId === app.id}
                                    className="btn-brass px-3 py-1 rounded text-xs font-sans font-semibold tracking-wide text-primary-foreground shadow-brass hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    <UserCheck className="h-3 w-3" />
                                    <span>Approve as Mentor</span>
                                  </button>
                                )}
                                {app.status !== "rejected" && (
                                  <button
                                    onClick={() => handleRejectMentor(app.id)}
                                    disabled={actionLoadingId === app.id}
                                    className="px-2.5 py-1 rounded border border-destructive/40 bg-destructive/10 text-destructive font-semibold hover:bg-destructive/20 transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                                  >
                                    <UserX className="h-3 w-3" />
                                    <span>Reject</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER FEEDBACK */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            {feedbackList.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground rounded-xl border border-border bg-card/80 font-sans">
                No feedback submissions received yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbackList.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-border bg-card/80 space-y-3 shadow-sm corner-flourish"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          {item.profiles?.full_name || "Anonymous User"}
                        </span>
                        <div className="text-[11px] font-mono text-muted-foreground">
                          {item.profiles?.email || "Unknown email"}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            (item.rating || 0) >= s
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground font-mono ml-1.5">
                        {item.rating || 5}/5
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans bg-secondary/40 p-3 rounded border border-border">
                      &quot;{item.message}&quot;
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1">
                      <span>URL: {item.page_url || "/"}</span>
                      <span>{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BUG REPORTS */}
        {activeTab === "bugs" && (
          <div className="space-y-4">
            {bugsList.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground rounded-xl border border-border bg-card/80 font-sans">
                No bug reports logged. All algorithm engines are operating cleanly.
              </div>
            ) : (
              <div className="space-y-3">
                {bugsList.map((bug) => (
                  <div
                    key={bug.id}
                    className="p-5 rounded-xl border border-border bg-card/80 space-y-3 shadow-sm corner-flourish"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Bug className="h-4 w-4 text-destructive shrink-0" />
                        <span className="text-sm font-semibold text-foreground">
                          {bug.algorithm_id || "Algorithm Bug"}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          by {bug.profiles?.full_name || bug.profiles?.email || "User"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-muted-foreground text-[11px]">Status:</span>
                        <select
                          value={bug.status}
                          onChange={(e) =>
                            handleUpdateBugStatus(bug.id, e.target.value as any)
                          }
                          className="bg-card text-foreground border border-border rounded px-2.5 py-1 text-xs focus:border-primary focus:outline-none cursor-pointer"
                        >
                          <option value="open">Open</option>
                          <option value="investigating">Investigating</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded bg-secondary/40 border border-border space-y-1">
                        <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                          Steps to Reproduce:
                        </span>
                        <p className="text-foreground font-sans">{bug.steps_to_reproduce}</p>
                      </div>

                      <div className="p-3 rounded bg-secondary/40 border border-border space-y-1">
                        <div className="text-[11px] font-mono text-muted-foreground">
                          Expected:{" "}
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {bug.expected_behavior || "None provided"}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground">
                          Actual:{" "}
                          <span className="text-destructive">
                            {bug.actual_behavior || "None provided"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border">
                      <span>Logged on: {bug.page_url}</span>
                      <span>{new Date(bug.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* USER ACTIVITY INSPECTOR MODAL */}
      {inspectingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setInspectingUser(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-primary/40 bg-card p-6 sm:p-7 text-foreground shadow-2xl backdrop-blur-2xl space-y-5 corner-flourish animate-in zoom-in-95 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setInspectingUser(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header / User Info */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-border">
              <div className="relative shrink-0">
                {inspectingUser.avatar_url ? (
                  <img
                    src={inspectingUser.avatar_url}
                    alt={inspectingUser.full_name || inspectingUser.email}
                    className="h-14 w-14 rounded-full object-cover border-2 border-primary/50"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#8B2635] via-[#B08422] to-[#C9A962] flex items-center justify-center text-white text-lg font-bold shadow-brass">
                    {(inspectingUser.full_name || inspectingUser.email).charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Live Online Badge */}
                {checkIsUserOnline(inspectingUser).isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-card"></span>
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {inspectingUser.full_name || "Unnamed Developer"}
                  </h3>
                  {checkIsUserOnline(inspectingUser).isOnline ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online Now
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono text-[10px]">
                      {checkIsUserOnline(inspectingUser).label}
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-muted-foreground">{inspectingUser.email}</div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
                  <span>Org: {inspectingUser.department || "General"}</span>
                  <span>•</span>
                  <span>ID: {inspectingUser.student_id || "N/A"}</span>
                  <span>•</span>
                  <span>Registered: {new Date(inspectingUser.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-0.5">
                <div className="text-xl font-extrabold text-primary">
                  {inspectingUser.completed_steps.length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Steps Solved</div>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-0.5">
                <div className="text-xl font-extrabold text-cyan-500">
                  {Object.keys(inspectingUser.quiz_scores).length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Quizzes Completed</div>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 border border-border space-y-0.5">
                <div className="text-xl font-extrabold text-amber-500">
                  {inspectingUser.completed_docs.length}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Docs Read</div>
              </div>
            </div>

            {/* Completed Steps Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span>Completed Algorithm Steps ({inspectingUser.completed_steps.length})</span>
              </h4>

              {inspectingUser.completed_steps.length === 0 ? (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center text-xs text-muted-foreground font-sans">
                  No learning steps completed yet.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                  {inspectingUser.completed_steps.map((step) => (
                    <span
                      key={step}
                      className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/25 text-primary font-mono text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span>{step}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Scores Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground flex items-center gap-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-cyan-500" />
                <span>Quiz Scores Breakdown</span>
              </h4>

              {Object.keys(inspectingUser.quiz_scores).length === 0 ? (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center text-xs text-muted-foreground font-sans">
                  No quiz attempts recorded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {Object.entries(inspectingUser.quiz_scores).map(([quizId, score]) => (
                    <div
                      key={quizId}
                      className="p-2.5 rounded-lg bg-secondary/40 border border-border flex items-center justify-between text-xs font-mono"
                    >
                      <span className="capitalize text-foreground font-medium truncate max-w-[150px]">
                        {quizId.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          Number(score) >= 80
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : Number(score) >= 60
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity History Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Recent Activity Log</span>
              </h4>

              {inspectingUser.activity_history.length === 0 ? (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center text-xs text-muted-foreground font-sans">
                  No timestamped activity logs recorded.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {inspectingUser.activity_history.slice(0, 10).map((act, i) => (
                    <div
                      key={act.id || i}
                      className="p-2 rounded-lg bg-secondary/40 border border-border flex items-center justify-between text-xs font-sans"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground text-xs">
                          {act.title || act.activityType}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {act.algorithmId} • Score: {act.score}%
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {formatTimeAgo(act.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectingUser(null)}
                className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

