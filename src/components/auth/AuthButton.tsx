"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LogOut,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Clock,
  BarChart3,
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
          data: { session },
        } = await supabase.auth.getSession();

        const currentUser = session?.user || null;
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
          className="inline-flex items-center gap-2 rounded border border-border bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground hover:text-primary hover:border-primary/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shadow-sm"
        >
          <div className="h-6 w-6 rounded-sm bg-gradient-to-tr from-[#8B2635] via-[#A62D3F] to-[#C9A962] flex items-center justify-center text-white text-[11px] font-sans font-bold shadow-sm">
            {initial}
          </div>
          <span className="hidden sm:inline max-w-[100px] truncate font-sans font-normal">{displayName}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
        </button>

        {/* Dropdown Menu — 100% Solid Opaque */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 rounded-lg border-2 border-[#B08422]/50 dark:border-[#C9A962]/50 bg-[#FFFFFF] dark:bg-[#251E19] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in fade-in zoom-in-95 space-y-1 corner-flourish font-sans">
            {/* User Details Header */}
            <div className="px-3 py-2.5 border-b border-border space-y-1">
              <div className="text-xs font-sans font-semibold text-foreground truncate">{displayName}</div>
              <div className="text-[11px] font-mono text-muted-foreground truncate">{user.email}</div>
              <div className="pt-1 flex items-center gap-1.5">
                {betaStatus === "approved" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Beta Approved</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm bg-primary/15 text-primary border border-primary/30">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>Review Pending</span>
                  </span>
                )}
                {profile?.role === "mentor" && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[#8B2635]/20 text-[#8B2635] dark:text-[#E8DFD4] border border-[#8B2635]">
                    Mentor
                  </span>
                )}
                {profile?.role === "admin" && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[#8B2635] text-white border border-[#A62D3F]">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Links — Only My Progress Dashboard */}
            <div className="py-1 space-y-0.5 text-xs">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded text-foreground hover:text-primary-foreground hover:bg-primary transition-colors"
              >
                <BarChart3 className="h-3.5 w-3.5 text-primary group-hover:text-primary-foreground" />
                <span className="font-sans text-xs font-semibold tracking-wide">My Progress Dashboard</span>
              </Link>
            </div>

            {/* Sign Out Button */}
            <div className="pt-1 border-t border-border">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-sans font-semibold tracking-wide text-muted-foreground hover:text-white hover:bg-destructive transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default / Unauthenticated: Polished Brass Metallic Sign In CTA Button (Manrope 600 + letter spacing)
  return (
    <Link
      href="/auth/login"
      className="btn-brass inline-flex items-center gap-2 rounded px-4 py-2 text-xs font-sans font-semibold tracking-[0.08em] shadow-brass active:scale-95 transition-all"
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span>Join Beta / Sign In</span>
    </Link>
  );
}
