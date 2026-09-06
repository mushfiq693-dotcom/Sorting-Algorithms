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
            Initializing visualizer engine...
          </div>
        </div>
      </div>
    );
  }

  // Render full interactive visualizer
  return (
    <div className="space-y-3">
      <SortingVisualizer />
    </div>
  );
}
