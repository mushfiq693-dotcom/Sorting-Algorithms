"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SortingVisualizer } from "@/components/visualizer/SortingVisualizer";
import { Lock, Sparkles, ShieldCheck, ArrowRight, Clock, GraduationCap } from "lucide-react";

export function LockedVisualizerGate() {
  const supabase = createClient();
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [betaStatus, setBetaStatus] = useState<string>("anonymous");

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsApproved(false);
          setBetaStatus("anonymous");
          return;
        }

        const { data: betaAccess } = await (supabase.from("beta_access") as any)
          .select("status")
          .eq("user_id", user.id)
          .single();

        const status = betaAccess?.status || "pending";
        setBetaStatus(status);
        setIsApproved(status === "approved");
      } catch (err) {
        setIsApproved(false);
        setBetaStatus("anonymous");
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: betaAccess } = await (supabase.from("beta_access") as any)
          .select("status")
          .eq("user_id", session.user.id)
          .single();
        const status = betaAccess?.status || "pending";
        setBetaStatus(status);
        setIsApproved(status === "approved");
      } else {
        setIsApproved(false);
        setBetaStatus("anonymous");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // While checking auth status
  if (isApproved === null) {
    return (
      <div className="relative rounded-2xl border border-border/60 bg-[#070c14] p-12 text-center">
        <div className="h-64 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            Verifying GSTU CSE Beta credentials...
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in & approved, render full interactive visualizer
  if (isApproved) {
    return <SortingVisualizer />;
  }

  // If user is anonymous or pending, render preview with glassmorphic lock overlay
  return (
    <div className="relative rounded-3xl overflow-hidden border border-rose-500/25 bg-[#090408] shadow-2xl shadow-rose-950/30">
      {/* Blurred background preview of the visualizer */}
      <div className="pointer-events-none select-none opacity-20 filter blur-sm scale-[0.99]">
        <SortingVisualizer />
      </div>

      {/* Glassmorphic Lock Overlay Banner */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060205]/75 via-[#0c0409]/92 to-[#060205]/98 backdrop-blur-md flex flex-col items-center justify-center p-6 sm:p-10 text-center z-20">
        <div className="max-w-xl space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-xs font-semibold">
            {betaStatus === "pending" ? (
              <>
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span>Beta Access Status: Review Pending</span>
              </>
            ) : (
              <>
                <GraduationCap className="h-3.5 w-3.5 text-rose-400" />
                <span>GSTU CSE Restricted Beta Access Required</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Unlock Interactive Visualizer & Practice
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-lg mx-auto">
            {betaStatus === "pending"
              ? "Your account has been created and is currently awaiting administrator approval. Once approved, the full interactive debugger, custom array engine, and coding practice modules will unlock."
              : "AlgoHub's interactive execution engine, custom array inputs, C++ line-by-line debugger, and coding sandbox are reserved for GSTU CSE students and faculty."}
          </p>

          {/* Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {betaStatus === "pending" ? (
              <Link
                href="/auth/pending"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-600/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Clock className="h-4 w-4" />
                <span>Check Approval Status</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Request Beta Access / Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Security Tag */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-mono pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Row Level Security (RLS) & Departmental Verification Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
