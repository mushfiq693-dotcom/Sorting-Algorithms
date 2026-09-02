"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ShieldAlert, Mail, LogOut, Home } from "lucide-react";

export default function BetaSuspendedPage() {
  const router = useRouter();
  const supabase = createClient();

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

      <div className="max-w-md w-full rounded-2xl border border-border bg-card/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 relative z-10 corner-flourish transition-all">
        {/* Shield Alert Badge */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>

        {/* Header & Copy */}
        <div className="space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-heading">
            Account Access <span className="italic font-semibold text-destructive">Suspended</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
            Your beta account access has been temporarily suspended by a departmental administrator.
          </p>
        </div>

        {/* Support Information */}
        <div className="p-4 rounded-xl border border-border bg-secondary/40 text-xs text-muted-foreground space-y-2 text-left font-sans">
          <p className="text-muted-foreground leading-relaxed">
            Please reach out to the departmental administrator to resolve account status issues or policy questions.
          </p>
          <a
            href="mailto:mushfiq693@gmail.com?subject=AlgoHub%20Account%20Suspension%20Inquiry"
            className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold pt-1"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact Administrator (mushfiq693@gmail.com)</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="btn-brass w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.01] active:scale-[0.98] transition-all text-primary-foreground cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Back to AlgoHub</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-sans font-semibold text-foreground hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
