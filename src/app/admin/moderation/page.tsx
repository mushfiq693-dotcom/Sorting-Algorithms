"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
  Lock,
  Sparkles,
} from "lucide-react";

interface ProfileBetaUser {
  id: string;
  email: string;
  full_name: string | null;
  department: string | null;
  student_id: string | null;
  role: string;
  created_at: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  approved_at: string | null;
  notes: string | null;
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

export default function AdminModerationPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "mentors" | "feedback" | "bugs">("users");

  // Data states
  const [users, setUsers] = useState<ProfileBetaUser[]>([]);
  const [mentorApps, setMentorApps] = useState<MentorApplicationItem[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [bugsList, setBugsList] = useState<BugReportItem[]>([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
        router.push("/auth/login");
        return;
      }

      // 1. Verify Admin Role
      const { data: currentProfile } = await (supabase.from("profiles") as any)
        .select("role")
        .eq("id", user.id)
        .single();

      if (currentProfile?.role !== "admin") {
        router.push("/");
        return;
      }
      setIsAdmin(true);

      // 2. Fetch all profiles joined with beta_access
      const { data: profilesData, error: profilesErr } = await (supabase.from("profiles") as any)
        .select("id, email, full_name, department, student_id, role, created_at, beta_access!beta_access_user_id_fkey(status, approved_at, notes)")
        .order("created_at", { ascending: false });

      if (profilesErr) {
        console.error("Error fetching profiles in admin dashboard:", profilesErr);
      }

      if (profilesData) {
        const formattedUsers: ProfileBetaUser[] = profilesData.map((p: any) => {
          const beta = Array.isArray(p.beta_access) ? p.beta_access[0] : p.beta_access;
          return {
            id: p.id,
            email: p.email,
            full_name: p.full_name,
            department: p.department,
            student_id: p.student_id,
            role: p.role,
            created_at: p.created_at,
            status: beta?.status || "pending",
            approved_at: beta?.approved_at || null,
            notes: beta?.notes || null,
          };
        });
        setUsers(formattedUsers);
      }

      // 3. Fetch Mentor Applications
      const { data: mentorAppsData } = await (supabase.from("mentor_applications") as any)
        .select("id, user_id, reason, status, reviewed_by, reviewed_at, notes, created_at, profiles(email, full_name, department, student_id, role)")
        .order("created_at", { ascending: false });

      if (mentorAppsData) {
        setMentorApps(mentorAppsData);
      }

      // 4. Fetch Feedback
      const { data: feedbackData } = await (supabase.from("feedback") as any)
        .select("id, user_id, category, rating, message, page_url, created_at, profiles(email, full_name)")
        .order("created_at", { ascending: false });

      if (feedbackData) setFeedbackList(feedbackData);

      // 5. Fetch Bug Reports
      const { data: bugsData } = await (supabase.from("bug_reports") as any)
        .select("id, user_id, algorithm_id, page_url, steps_to_reproduce, expected_behavior, actual_behavior, browser_info, status, created_at, profiles(email, full_name)")
        .order("created_at", { ascending: false });

      if (bugsData) setBugsList(bugsData);
    } catch (err) {
      console.error("Failed to load moderation data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mentor Application Action Handlers
  const handleApproveMentor = async (appId: string, userId: string) => {
    setActionLoadingId(appId);
    try {
      const {
        data: { user: currentAdmin },
      } = await supabase.auth.getUser();

      // 1. Update application status
      const { error: appErr } = await (supabase.from("mentor_applications") as any)
        .update({
          status: "approved",
          reviewed_by: currentAdmin?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", appId);

      if (appErr) throw appErr;

      // 2. Update user profile role to 'mentor'
      const { error: roleErr } = await (supabase.from("profiles") as any)
        .update({ role: "mentor" })
        .eq("id", userId);

      if (roleErr) throw roleErr;

      // Update local state
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

  // Beta Access Action Handlers
  const handleUpdateStatus = async (userId: string, newStatus: "approved" | "rejected" | "suspended") => {
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

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: newStatus, approved_at: newStatus === "approved" ? new Date().toISOString() : null }
            : u
        )
      );
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

  if (isAdmin === null || isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-sm font-sans text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Verifying Departmental Administrator Access...</span>
        </div>
      </div>
    );
  }

  // Filtered Users (Prioritize pending requests first)
  const filteredUsers = users
    .filter((u) => {
      const matchesSearch =
        (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.student_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.department || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Stats Counters
  const pendingCount = users.filter((u) => u.status === "pending").length;
  const approvedCount = users.filter((u) => u.status === "approved").length;
  const pendingMentorCount = mentorApps.filter((m) => m.status === "pending").length;
  const openBugsCount = bugsList.filter((b) => b.status === "open").length;

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
                AlgoHub Moderation Dashboard
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-bold ml-1">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={loadData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-card text-xs font-semibold text-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} />
              <span>Refresh</span>
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
            Manage student registrations, evaluate mentor applications, oversee user permissions, and maintain platform stability.
          </p>
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-mono font-semibold">Total Users</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {users.length}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Registered accounts</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-purple-500 dark:text-purple-400">
              <span className="text-xs font-mono font-semibold">Mentor Apps</span>
              <Award className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {pendingMentorCount}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Pending review</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-emerald-500 dark:text-emerald-400">
              <span className="text-xs font-mono font-semibold">Active Scholars</span>
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {users.filter(u => u.status !== 'suspended').length}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Free full access active</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-cyan-500 dark:text-cyan-400">
              <span className="text-xs font-mono font-semibold">Feedback</span>
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {feedbackList.length}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">In-app ratings</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/80 space-y-1 shadow-sm corner-flourish">
            <div className="flex items-center justify-between text-rose-500 dark:text-rose-400">
              <span className="text-xs font-mono font-semibold">Bug Reports</span>
              <Bug className="h-4 w-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
              {openBugsCount}
            </div>
            <p className="text-[11px] text-muted-foreground font-sans">Open diagnostics</p>
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
            <span>User Management ({users.length})</span>
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

        {/* TAB 1: USERS & ACCESS APPROVALS */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, roll..."
                  className="w-full rounded border border-border bg-background pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-sans"
                />
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap gap-1 text-xs font-mono self-start sm:self-auto">
                {["all", "pending", "approved", "rejected", "suspended"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded capitalize border transition-all cursor-pointer ${
                      statusFilter === st
                        ? "border-primary/60 bg-primary/15 text-primary font-bold"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st === "pending" ? "Pending Requests" : st === "approved" ? "Premium Users" : st === "rejected" ? "Free Users" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-border bg-card/90 overflow-hidden shadow-sm corner-flourish">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="border-b border-border bg-secondary/60 text-muted-foreground font-mono">
                    <tr>
                      <th className="p-3.5">Student / User</th>
                      <th className="p-3.5">Dept & Roll ID</th>
                      <th className="p-3.5">Registered</th>
                      <th className="p-3.5">Access Tier</th>
                      <th className="p-3.5 text-right">Moderation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground font-sans">
                          No matching students or access requests found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="p-3.5">
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              <span>{user.full_name || "Anonymous Student"}</span>
                              {user.role === "admin" && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary text-primary-foreground font-bold">Admin</span>
                              )}
                              {user.role === "mentor" && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#8B2635]/20 text-[#8B2635] dark:text-[#E8DFD4] border border-[#8B2635] font-bold">Mentor</span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground">{user.email}</div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-foreground">
                            <div>{user.department || "CSE"}</div>
                            <div className="text-muted-foreground">{user.student_id || "N/A"}</div>
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3.5">
                            {user.role === "admin" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 shadow-xs">
                                <ShieldCheck className="h-3 w-3" /> Administrator
                              </span>
                            ) : user.role === "mentor" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-xs">
                                <Award className="h-3 w-3" /> Mentor
                              </span>
                            ) : user.status === "suspended" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-destructive/20 text-destructive border border-destructive/40">
                                <Ban className="h-3 w-3" /> Suspended
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <Sparkles className="h-3 w-3" /> Active Scholar
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right font-sans">
                            <div className="flex items-center justify-end gap-1.5">
                              {user.status !== "approved" && user.role !== "admin" && (
                                <button
                                  onClick={() => handleUpdateStatus(user.id, "approved")}
                                  disabled={actionLoadingId === user.id}
                                  className="btn-brass px-3 py-1 rounded text-xs font-sans font-semibold tracking-wide text-primary-foreground shadow-brass hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                >
                                  <Crown className="h-3 w-3" />
                                  <span>Approve Premium</span>
                                </button>
                              )}
                              {user.status === "approved" && user.role !== "admin" && (
                                <button
                                  onClick={() => handleUpdateStatus(user.id, "rejected")}
                                  disabled={actionLoadingId === user.id}
                                  className="px-2.5 py-1 rounded border border-border bg-secondary/50 text-muted-foreground font-semibold hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  Revoke Premium
                                </button>
                              )}
                              {user.status !== "suspended" && user.role !== "admin" && (
                                <button
                                  onClick={() => handleUpdateStatus(user.id, "suspended")}
                                  disabled={actionLoadingId === user.id}
                                  className="px-2 py-1 rounded border border-destructive/40 bg-destructive/10 text-destructive font-semibold hover:bg-destructive/20 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  Suspend
                                </button>
                              )}
                              {user.status === "suspended" && (
                                <button
                                  onClick={() => handleUpdateStatus(user.id, "rejected")}
                                  disabled={actionLoadingId === user.id}
                                  className="px-2 py-1 rounded border border-border bg-secondary/50 text-muted-foreground font-semibold hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                  Unsuspend
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
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
                          <th className="p-3.5">Dept & Roll ID</th>
                          <th className="p-3.5">Motivation Statement</th>
                          <th className="p-3.5">Current Role</th>
                          <th className="p-3.5">Application Status</th>
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
                              <div>{app.profiles?.department || "CSE"}</div>
                              <div className="text-muted-foreground">
                                {app.profiles?.student_id || "N/A"}
                              </div>
                            </td>

                            <td className="p-3.5 max-w-xs sm:max-w-sm">
                              <p className="text-xs text-foreground line-clamp-3 bg-secondary/40 p-2.5 rounded border border-border">
                                {app.reason}
                              </p>
                              <div className="text-[10px] font-mono text-muted-foreground mt-1">
                                Applied: {new Date(app.created_at).toLocaleDateString()}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                app.profiles?.role === "mentor"
                                  ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40"
                                  : app.profiles?.role === "admin"
                                  ? "bg-primary/20 text-primary border border-primary/40"
                                  : "bg-secondary text-muted-foreground border border-border"
                              }`}>
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
                          by {bug.profiles?.full_name || bug.profiles?.email || "Student"}
                        </span>
                      </div>

                      {/* Status Toggle */}
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

                    {/* Bug Details */}
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
    </div>
  );
}
