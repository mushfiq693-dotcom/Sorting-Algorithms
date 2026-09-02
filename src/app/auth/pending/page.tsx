"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Clock,
  RotateCcw,
  LogOut,
  Home,
  GraduationCap,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function BetaPendingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUserEmail(user.email || null);

      const { data: profile } = await (supabase.from("profiles") as any)
        .select("full_name")
        .eq("id", user.id)
        .single();

      setUserName(profile?.full_name || null);
    }

    loadUser();
  }, [router, supabase]);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setStatusMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: betaAccess } = await (supabase.from("beta_access") as any)
      .select("status")
      .eq("user_id", user.id)
      .single();

    const status = betaAccess?.status || "pending";

    if (status === "approved") {
      setStatusMessage("🎉 Congratulations! Your beta access has been approved!");
      setTimeout(() => {
        router.push("/learn");
      }, 1500);
    } else if (status === "rejected") {
      router.push("/auth/rejected");
    } else if (status === "suspended") {
      router.push("/auth/suspended");
    } else {
      setStatusMessage("Status is still Pending Review. Please check back shortly.");
      setIsChecking(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="relative min-h-screen bg-[#060305] flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-rose-500/30 selection:text-rose-200">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-lg w-full rounded-2xl border border-amber-500/30 bg-[#0e0509]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-amber-950/20 text-center space-y-6">
        {/* Glowing Clock Badge */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
          <Clock className="h-8 w-8 animate-pulse" />
        </div>

        {/* Header & Status Details */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-xs font-semibold">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>GSTU CSE Restricted Beta Verification</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            Beta Approval Pending
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-md mx-auto">
            Welcome{userName ? `, ${userName}` : ""}! Your registration has been received.
            Departmental administrators are reviewing access requests to ensure server stability.
          </p>
        </div>

        {/* Verification Card */}
        <div className="p-4 rounded-xl border border-rose-950/70 bg-[#060204] font-mono text-xs text-slate-300 space-y-2 text-left">
          <div className="flex items-center justify-between text-slate-400 border-b border-rose-950/50 pb-2">
            <span>Account Email:</span>
            <span className="text-white font-bold">{userEmail || "Loading..."}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Current Status:</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              Pending Review
            </span>
          </div>
        </div>

        {/* Status Check Alert */}
        {statusMessage && (
          <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Refresh / Check Status */}
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-600/25 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            <span>Check Approval Status</span>
          </button>

          {/* Return Home */}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-950/70 bg-[#14080e]/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-[#1f0c16] hover:border-rose-800/60 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none transition-all active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Explore Landing Page</span>
          </Link>
        </div>

        {/* Sign Out */}
        <div className="pt-2 border-t border-rose-950/50">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out of this account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
