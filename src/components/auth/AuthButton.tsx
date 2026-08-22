"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  GraduationCap,
  ShieldCheck,
  Clock,
  BookOpen,
  BarChart3,
  Award,
  Bell,
} from "lucide-react";

export function AuthButton() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ full_name: string | null; role: string } | null>(null);
  const [betaStatus, setBetaStatus] = useState<string>("pending");
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUserSession() {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        setUser(currentUser);

        if (currentUser) {
          const { data: userProfile } = await (supabase.from("profiles") as any)
            .select("full_name, role")
            .eq("id", currentUser.id)
            .single();

          setProfile(userProfile);

          const { data: betaAccess } = await (supabase.from("beta_access") as any)
            .select("status")
            .eq("user_id", currentUser.id)
            .single();

          setBetaStatus(betaAccess?.status || "pending");
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        setIsInitialized(true);
      }
    }

    loadUserSession();

    // Listen to real-time auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data: userProfile } = await (supabase.from("profiles") as any)
          .select("full_name, role")
          .eq("id", session.user.id)
          .single();
        setProfile(userProfile);

        const { data: betaAccess } = await (supabase.from("beta_access") as any)
          .select("status")
          .eq("user_id", session.user.id)
          .single();
        setBetaStatus(betaAccess?.status || "pending");
      } else {
        setProfile(null);
        setBetaStatus("pending");
      }
      setIsInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // If user is authenticated, render the avatar and menu
  if (user) {
    const displayName = profile?.full_name || user.email?.split("@")[0] || "Student";
    const initial = displayName.charAt(0).toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-[#12070d]/90 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:border-rose-500/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
        >
          <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
            {initial}
          </div>
          <span className="hidden sm:inline max-w-[100px] truncate">{displayName}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-rose-500/30 bg-[#0e0509]/95 p-2 shadow-2xl shadow-rose-950/50 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 space-y-1 font-sans">
            {/* User Details Header */}
            <div className="px-3 py-2.5 border-b border-rose-950/60 space-y-1">
              <div className="text-xs font-bold text-white truncate">{displayName}</div>
              <div className="text-[11px] font-mono text-slate-400 truncate">{user.email}</div>
              <div className="pt-1 flex items-center gap-1.5">
                {betaStatus === "approved" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    <span>Beta Approved</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>Review Pending</span>
                  </span>
                )}
                {profile?.role === "mentor" && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Mentor
                  </span>
                )}
                {profile?.role === "admin" && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="py-1 space-y-0.5 text-xs">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-cyan-300 hover:text-white hover:bg-cyan-500/15 font-semibold transition-colors"
              >
                <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                <span>My Progress Dashboard</span>
              </Link>

              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-cyan-500/15 transition-colors"
              >
                <Bell className="h-3.5 w-3.5 text-cyan-400" />
                <span>Notifications Hub</span>
              </Link>

              {(profile?.role === "mentor" || profile?.role === "admin") && (
                <Link
                  href="/mentor"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-500/20 font-semibold transition-colors"
                >
                  <Award className="h-3.5 w-3.5 text-purple-400" />
                  <span>Mentor Portal</span>
                </Link>
              )}

              <Link
                href="/learn"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-rose-500/15 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-rose-400" />
                <span>Curriculum & Visualizers</span>
              </Link>

              {profile?.role === "admin" && (
                <Link
                  href="/admin/moderation"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 font-semibold transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-400" />
                  <span>Admin Moderation Console</span>
                </Link>
              )}

              {betaStatus === "pending" && (
                <Link
                  href="/auth/pending"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-amber-500/15 transition-colors"
                >
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Check Approval Status</span>
                </Link>
              )}
            </div>

            {/* Sign Out Button */}
            <div className="pt-1 border-t border-rose-950/60">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default / Unauthenticated: Always render vibrant Join Beta / Sign In CTA button
  return (
    <Link
      href="/auth/login"
      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/25 hover:brightness-110 active:scale-95 transition-all"
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span>Join Beta / Sign In</span>
    </Link>
  );
}
