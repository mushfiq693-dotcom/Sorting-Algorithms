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
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        router.replace("/admin/moderation");
        return;
      }

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
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-[#C9A962]/35 selection:text-[#1C1714] transition-colors duration-200 overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar items */}
      <div className="absolute top-4 left-4 sm:left-8 z-50">
        <Link href="/" className="flex items-center gap-2 group text-foreground hover:text-primary transition-colors">
          <span className="font-heading text-lg sm:text-xl font-bold tracking-tight">AlgoHub</span>
        </Link>
      </div>
      <div className="absolute top-4 right-4 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-lg w-full rounded-2xl border border-border bg-card/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 relative z-10 corner-flourish transition-all">
        {/* Glowing Clock Badge */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-brass">
          <Clock className="h-8 w-8 animate-pulse text-primary" />
        </div>

        {/* Header & Status Details */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/40 bg-card text-primary font-sans text-xs uppercase tracking-wider font-semibold">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Restricted Beta Verification</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-heading">
            Beta Approval <span className="italic font-semibold text-primary dark:text-[#D4B872]">Pending</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans max-w-md mx-auto">
            Welcome{userName ? `, ${userName}` : ""}! Your registration has been received.
            Departmental administrators are reviewing access requests to ensure platform stability.
          </p>
        </div>

        {/* Verification Card */}
        <div className="p-4 rounded-xl border border-border bg-secondary/40 font-mono text-xs text-foreground space-y-2 text-left">
          <div className="flex items-center justify-between text-muted-foreground border-b border-border/60 pb-2">
            <span>Account Email:</span>
            <span className="text-foreground font-bold">{userEmail || "Loading..."}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Current Status:</span>
            <span className="inline-flex items-center gap-1.5 text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20 font-sans text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              Pending Review
            </span>
          </div>
        </div>

        {/* Status Check Alert */}
        {statusMessage && (
          <div className="p-3.5 rounded-xl border border-primary/40 bg-primary/10 text-primary text-xs flex items-center justify-center gap-2 animate-in fade-in font-sans">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Refresh / Check Status */}
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="btn-brass w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded px-6 py-2.5 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground disabled:opacity-50 cursor-pointer"
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-sans font-semibold text-foreground hover:text-primary hover:border-primary/50 transition-all active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Back to AlgoHub</span>
          </Link>
        </div>

        {/* Sign Out */}
        <div className="pt-2 border-t border-border">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out of this account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
