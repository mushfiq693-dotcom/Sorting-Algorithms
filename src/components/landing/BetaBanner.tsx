"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Bug, Sparkles, GraduationCap, ShieldCheck } from "lucide-react";

export function BetaBanner() {
  const feedbackMailto = "mailto:mushfiq693@gmail.com?subject=AlgoHub%20Beta%20Feedback%20[GSTU%20CSE]&body=Hi%20Mushfiq,%0A%0AHere%20is%20my%20feedback%20on%20AlgoHub:%0A";
  const bugReportMailto = "mailto:mushfiq693@gmail.com?subject=AlgoHub%20Bug%20Report%20[GSTU%20CSE]&body=Hi%20Mushfiq,%0A%0AI%20found%20a%20bug%20on%20AlgoHub:%0A%0APage/Algorithm:%20%0ASteps%20to%20reproduce:%20%0AExpected%20behavior:%20%0AActual%20behavior:%20";

  return (
    <section className="py-16 sm:py-20 border-b border-border/40 relative overflow-hidden bg-gradient-to-b from-[#070b12] via-[#0b101d] to-[#070b12]">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-purple-600/10 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* University Department Beta Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold mb-6 backdrop-blur-md shadow-inner">
          <GraduationCap className="h-4 w-4" />
          <span>GSTU CSE Department Restricted Beta</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Help shape the next version of AlgoHub.
        </h2>

        <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans">
          AlgoHub is currently in an early beta for <strong className="text-slate-200">GSTU CSE students</strong>. Explore the platform, try the learning experience, and tell us what should be better.
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Join the Beta (Start Learning)</span>
          </Link>

          <a
            href={feedbackMailto}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-xs sm:text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-[0.98]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Give Beta Feedback</span>
          </a>

          <a
            href={bugReportMailto}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-xs sm:text-sm font-semibold text-rose-300 hover:bg-rose-500/20 transition-all active:scale-[0.98]"
          >
            <Bug className="h-4 w-4" />
            <span>Report a Bug</span>
          </a>
        </div>

        {/* Department Notice */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            Active Academic Sandbox
          </span>
          <span>•</span>
          <span>Gopalganj Science and Technology University</span>
          <span>•</span>
          <span>Batch & Semester Cohort Feedback</span>
        </div>
      </div>
    </section>
  );
}
