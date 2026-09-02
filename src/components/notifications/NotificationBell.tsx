"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Bell } from "lucide-react";

import { fastCache } from "@/lib/cache";

export function NotificationBell() {
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setUnreadCount(0);
        return;
      }
      const user = session.user;

      // Check cache first
      const cachedCount = fastCache.get<number>(`unread_${user.id}`);
      if (cachedCount !== null) {
        setUnreadCount(cachedCount);
        return;
      }

      // 1. Fetch total notices
      const { data: noticesData } = await (supabase.from("notices") as any)
        .select("id");

      if (!noticesData || noticesData.length === 0) {
        setUnreadCount(0);
        fastCache.set(`unread_${user.id}`, 0, 60);
        return;
      }

      // 2. Fetch notice_reads for current user
      const { data: readData } = await (supabase.from("notice_reads") as any)
        .select("notice_id")
        .eq("user_id", user.id);

      const readIds = new Set((readData || []).map((r: any) => r.notice_id));
      const unread = noticesData.filter((n: any) => !readIds.has(n.id)).length;
      setUnreadCount(unread);
      fastCache.set(`unread_${user.id}`, unread, 60);
    } catch {
      // ignore
    }
  }, [supabase]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-xl border border-border/70 bg-card/40 text-slate-300 hover:text-cyan-400 hover:bg-card/70 transition-all active:scale-95 shadow-sm inline-flex items-center justify-center"
      title="Notifications Hub"
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-pulse">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
