"use client";

import React from "react";
import { TrendingUp, Zap, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Flame } from "lucide-react";

export function TimeComplexityDiagram() {
  const curveTiers = [
    { notation: "O(1)", name: "Constant", color: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/10", ops100: "1", speed: "Instant", icon: CheckCircle2 },
    { notation: "O(log n)", name: "Logarithmic", color: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-500/10", ops100: "7", speed: "Super Fast", icon: CheckCircle2 },
    { notation: "O(n)", name: "Linear", color: "text-blue-400", border: "border-blue-500/40", bg: "bg-blue-500/10", ops100: "100", speed: "Fair", icon: Zap },
    { notation: "O(n log n)", name: "Linearithmic", color: "text-purple-400", border: "border-purple-500/40", bg: "bg-purple-500/10", ops100: "700", speed: "Good for Sorting", icon: Zap },
    { notation: "O(n²)", name: "Quadratic", color: "text-amber-400", border: "border-amber-500/40", bg: "bg-amber-500/10", ops100: "10,000", speed: "Slow on Large N", icon: AlertTriangle },
    { notation: "O(2ⁿ)", name: "Exponential", color: "text-rose-400", border: "border-rose-500/40", bg: "bg-rose-500/10", ops100: "1.26 × 10³⁰", speed: "Intractable", icon: Flame },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-slate-950/80 p-5 sm:p-7 text-slate-100 shadow-2xl">
      {/* Visual Asymptotic Hierarchy Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-xs text-emerald-400">Ω (Big-Omega)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Lower Bound</span>
          </div>
          <p className="text-xs text-slate-300">Best-case minimum operations an algorithm will ever execute.</p>
        </div>

        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-xs text-cyan-400">Θ (Big-Theta)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Tight Bound</span>
          </div>
          <p className="text-xs text-slate-300">Exact asymptotic rate when best and worst case growth rates match.</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-xs text-amber-400">O (Big-O)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Upper Bound</span>
          </div>
          <p className="text-xs text-slate-300">Worst-case ceiling guarantee. Algorithm never exceeds this growth rate.</p>
        </div>
      </div>

      {/* Big-O Growth Hierarchy Spectrum Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <span>Asymptotic Growth Spectrum (Scale at n = 100)</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400">Faster ← → Slower</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {curveTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.notation}
                className={`p-4 rounded-2xl border ${tier.border} ${tier.bg} space-y-2 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-base font-extrabold ${tier.color}`}>
                    {tier.notation}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                    {tier.name}
                  </span>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Steps at n=100:</span>
                    <span className="font-bold text-slate-100">{tier.ops100}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Rating:</span>
                    <span className={`font-semibold flex items-center gap-1 ${tier.color}`}>
                      <Icon className="h-3 w-3" /> {tier.speed}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules of Big-O Calculation Box */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-2">
        <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
          💡 The 2 Cardinal Rules of Big-O Simplification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-100">1. Drop Constant Multipliers</span>
            <p className="text-slate-400 font-mono text-[11px]">
              O(3n² + 5n + 100) → constants 3, 5, 100 are ignored as n → ∞.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-slate-100">2. Keep Dominant Terms Only</span>
            <p className="text-slate-400 font-mono text-[11px]">
              O(n² + n log n + n) → O(n²) because quadratic growth overwhelms all lower terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
