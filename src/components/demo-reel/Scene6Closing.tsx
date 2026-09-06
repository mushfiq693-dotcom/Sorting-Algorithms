"use client";

import React from "react";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * Scene 6: Closing Card / Call to Action
 * 
 * Note: /demo-reel is intentionally designed as an automated screen-recording tool
 * for social media marketing reels. Its scripted animations bypass prefers-reduced-motion
 * by design to guarantee deterministic recording output across environments.
 */
export function Scene6Closing() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-[#1C1714] text-[#E8DFD4] select-none overflow-hidden font-sans">
      {/* Precision Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#B08422]/20 via-cyan-500/15 to-purple-600/15 blur-[120px] pointer-events-none" />

      {/* Top University Brand */}
      <div className="relative z-10 pt-4 flex items-center justify-center">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A962] font-semibold px-3 py-1 rounded-full bg-[#B08422]/15 border border-[#B08422]/30">
          GSTU CSE Department Official Platform
        </span>
      </div>

      {/* Center Body: Logo, Brand & Full Tagline */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto space-y-6">
        {/* Glowing Brand Icon */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-3xl bg-[#B08422]/30 blur-xl animate-pulse" />
          <div className="relative h-20 w-20 rounded-3xl border-2 border-[#B08422] bg-[#14100D] flex items-center justify-center shadow-2xl">
            <AmbientSortLogo />
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white">
            AlgoHub
          </h1>
          <p className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
            Interactive Algorithm Learning Platform
          </p>
        </div>

        {/* Exact Core Tagline */}
        <div className="max-w-xs space-y-2 py-2">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Don&apos;t just learn Algorithms.
          </p>
          <div className="text-xl sm:text-2xl font-heading font-semibold text-white leading-snug">
            <span className="text-[#C9A962]">See them. </span>
            <span className="text-rose-400">Break them. </span>
            <br />
            <span className="text-cyan-300">Fix them. </span>
            <span className="text-emerald-400">Master them.</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#B08422]/20 to-cyan-500/20 border border-[#B08422]/40 text-xs font-mono font-bold text-[#E8DFD4] shadow-lg">
          <Sparkles className="h-4 w-4 text-[#C9A962]" />
          <span>Now live for GSTU CSE — Beta</span>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pb-4 border-t border-[#4A3F35]/70 pt-3 flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          100% Free &amp; Open
        </span>
        <span className="text-slate-300 font-semibold">
          Get Started Today &rarr;
        </span>
      </div>
    </div>
  );
}
