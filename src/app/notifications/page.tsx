"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Bell,
  CheckCircle2,
  CheckCheck,
  Clock,
  ArrowLeft,
  Loader2,
  Send,
  Award,
  Sparkles,
  Info,
} from "lucide-react";

interface NoticeItem {
  id: string;
  sender_id: string;
  title: string;
  message: string;
  target_filter: string | null;
  created_at: string;
  isRead: boolean;
  sender?: {
    full_name: string | null;
    email: string;
    role: string;
  };
}

export default function NotificationsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?next=/notifications");
        return;
      }
      setCurrentUserId(user.id);

      // 1. Fetch all notices with sender profile info
      const { data: noticesData, error: noticesErr } = await (supabase.from("notices") as any)
        .select(`
          id, sender_id, title, message, target_filter, created_at,
          sender:profiles!notices_sender_id_fkey(full_name, email, role)
        `)
        .order("created_at", { ascending: false });

      if (noticesErr) {
        console.error("Error fetching notices:", noticesErr);
      }

      // 2. Fetch read markers for this user
      const { data: readsData } = await (supabase.from("notice_reads") as any)
        .select("notice_id")
        .eq("user_id", user.id);

      const readIds = new Set((readsData || []).map((r: any) => r.notice_id));

      if (noticesData) {
        const formatted: NoticeItem[] = noticesData.map((n: any) => ({
          id: n.id,
          sender_id: n.sender_id,
          title: n.title,
          message: n.message,
          target_filter: n.target_filter,
          created_at: n.created_at,
          isRead: readIds.has(n.id),
          sender: n.sender,
        }));
        setNotices(formatted);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Mark single notice as read
  const handleMarkAsRead = async (noticeId: string) => {
    if (!currentUserId) return;
    try {
      await (supabase.from("notice_reads") as any).insert({
        notice_id: noticeId,
        user_id: currentUserId,
      });

      setNotices((prev) =>
        prev.map((n) => (n.id === noticeId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notice as read:", err);
    }
  };

  // Mark all notices as read
  const handleMarkAllAsRead = async () => {
    if (!currentUserId || notices.length === 0) return;
    setMarkingAll(true);
    try {
      const unread = notices.filter((n) => !n.isRead);
      if (unread.length > 0) {
        const inserts = unread.map((n) => ({
          notice_id: n.id,
          user_id: currentUserId,
        }));
        await (supabase.from("notice_reads") as any).upsert(inserts, {
          onConflict: "notice_id,user_id",
        });
      }

      setNotices((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notices.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b12] flex items-center justify-center text-foreground">
        <div className="flex items-center gap-3 text-sm font-mono text-cyan-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading Notifications Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-foreground flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-card/60 border border-border/70 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Notifications Hub
              </span>
              <AmbientSortLogo />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 flex-1 w-full">
        {/* Header Summary */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Mentor &amp; System Broadcasts</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Direct announcements, study session updates, and algorithmic guidance from course mentors.
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Notifications List */}
        {notices.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md space-y-3">
            <Bell className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No Notifications Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You&apos;re all caught up! New mentor notices and courseware announcements will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`p-5 rounded-2xl border transition-all duration-200 ${
                  notice.isRead
                    ? "border-border/50 bg-card/20 text-slate-300 opacity-80"
                    : "border-cyan-500/40 bg-gradient-to-r from-[#0c1322] to-[#070b14] text-white shadow-lg shadow-cyan-950/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {!notice.isRead && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                    )}
                    <span className="font-bold text-sm text-white">{notice.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                    {!notice.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notice.id)}
                        className="px-2 py-0.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/20 transition-all"
                        title="Mark as read"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap mb-3">
                  {notice.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[11px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-400" />
                    <span>
                      Sender: {notice.sender?.full_name || notice.sender?.email || "Mentor"}
                    </span>
                  </div>

                  {notice.target_filter && notice.target_filter !== "all" && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px]">
                      Target: {notice.target_filter.replace("weak_", "Struggling on ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
