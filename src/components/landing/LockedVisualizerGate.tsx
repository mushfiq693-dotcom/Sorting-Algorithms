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

  // Render full interactive visualizer in sandbox mode
  return (
    <div className="space-y-3">
      {!isApproved && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Public Evaluation Sandbox</span>
            <span className="hidden sm:inline text-slate-400">• Full real-time execution engine active</span>
          </div>
          <Link
            href="/auth/login"
            className="text-xs text-slate-300 hover:text-white transition-colors underline decoration-cyan-500/50 hover:decoration-cyan-400"
          >
            Simulate Departmental RBAC Access &rarr;
          </Link>
        </div>
      )}
      <SortingVisualizer />
    </div>
  );
}
