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
  ShieldAlert,
  BarChart3,
  Crown,
} from "lucide-react";
import { useAccessControl } from "@/hooks/useAccessControl";

export function AuthButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    isLoaded,
    user,
    role,
    isAdmin,
    isMentor,
  } = useAccessControl();

  // Profile data for display name
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchName() {
      if (user) {
        const { data } = await (supabase.from("profiles") as any)
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (data?.full_name) setFullName(data.full_name);
      } else {
        setFullName(null);
      }
    }
    fetchName();
  }, [user, supabase]);

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
    const displayName = fullName || user.email?.split("@")[0] || (isAdmin ? "Administrator" : "Student");
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
              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#8B2635] text-white border border-[#A62D3F] shadow-sm">
                    <ShieldAlert className="h-3 w-3 text-white" />
                    <span>Administrator</span>
                  </span>
                ) : isMentor ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[#8B2635]/20 text-[#8B2635] dark:text-[#E8DFD4] border border-[#8B2635]">
                    <span>Mentor</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-gradient-to-r from-amber-500/20 to-primary/20 text-[#B08422] dark:text-[#D4B872] border border-amber-500/40 shadow-xs">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>Student / Scholar</span>
                  </span>
                )}
              </div>
            </div>

            {/* Links — Conditional for Admin vs Regular Users */}
            <div className="py-1 space-y-0.5 text-xs">
              {isAdmin ? (
                <Link
                  href="/admin/moderation"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded text-foreground hover:text-primary-foreground hover:bg-primary transition-colors group"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-primary group-hover:text-primary-foreground" />
                  <span className="font-sans text-xs font-semibold tracking-wide">Admin Panel (Approvals)</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded text-foreground hover:text-primary-foreground hover:bg-primary transition-colors group"
                >
                  <BarChart3 className="h-3.5 w-3.5 text-primary group-hover:text-primary-foreground" />
                  <span className="font-sans text-xs font-semibold tracking-wide">My Progress Dashboard</span>
                </Link>
              )}
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
      <span>Sign In / Register</span>
    </Link>
  );
}
