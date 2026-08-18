"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert, Mail, LogOut, Home } from "lucide-react";

export default function BetaSuspendedPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#060305] flex items-center justify-center p-4 sm:p-6 antialiased selection:bg-rose-500/30 selection:text-rose-200">
      <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-[#0e0509]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-rose-950/30 text-center space-y-6">
        {/* Shield Alert Badge */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
          <ShieldAlert className="h-8 w-8" />
        </div>

        {/* Header & Copy */}
        <div className="space-y-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Account Access Suspended
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Your beta account access has been temporarily suspended by a departmental administrator.
          </p>
        </div>

        {/* Support Information */}
        <div className="p-4 rounded-xl border border-rose-950/70 bg-[#060204] text-xs text-slate-300 space-y-2 text-left">
          <p className="text-slate-400 leading-relaxed">
            Please reach out to the departmental administrator to resolve account status issues or policy questions.
          </p>
          <a
            href="mailto:mushfiq693@gmail.com?subject=AlgoHub%20Account%20Suspension%20Inquiry"
            className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold underline pt-1"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact Administrator (mushfiq693@gmail.com)</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-600/25 hover:brightness-110 transition-all active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Back to AlgoHub</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-950/70 bg-[#14080e]/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-[#1f0c16] transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
