"use client";

import React from "react";
import {
  Layers,
  Terminal,
  Bug,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";

export function ValueProposition() {
  return (
    <section className="py-16 sm:py-20 border-b border-border/40 relative overflow-hidden bg-gradient-to-b from-[#070b12] via-[#090e18] to-[#070b12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Statement Banner */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
            Algorithms shouldn&apos;t feel like{" "}
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              static textbook pages.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans">
            AlgoHub turns algorithm learning into an interactive environment where you can see every step,
            follow the code, investigate mistakes, and practice what you learned.
          </p>
        </div>

        {/* 4 Outcome-Oriented Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 transition-all group">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white font-sans">
                Real-Time Step Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Watch the actual algorithm execution step by step — 100% real operations captured live from deterministic C++ and TypeScript engines, not pre-recorded animations.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-xl hover:border-blue-500/40 transition-all group">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Terminal className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white font-sans">
                Code Debugger & Scope Inspector
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Follow C++17 execution line-by-line while inspecting live local variables, recursion call stacks, and invariant conditions during every cycle.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-xl hover:border-rose-500/40 transition-all group">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
              <Bug className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white font-sans">
                Bug-Hunt Challenges
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Diagnose broken logic, off-by-one boundary bugs, and invalid partition pivots in real flawed algorithm implementations with immediate verification.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-xl hover:border-emerald-500/40 transition-all group">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white font-sans">
                Rigorous Mathematical Complexity
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Step-by-step arithmetic summations, recursion tree depth derivations, interactive Big-O calculators, and asymptotic growth graphs in one unified place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
