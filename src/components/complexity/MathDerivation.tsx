"use client";

import React from "react";
import { AlgorithmId } from "@/types/sorting";
import { COMPLEXITY_DERIVATIONS } from "@/data/complexityDerivations";
import {
  Calculator,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface MathDerivationProps {
  algorithmId: AlgorithmId;
}

export function MathDerivation({ algorithmId }: MathDerivationProps) {
  const data = COMPLEXITY_DERIVATIONS[algorithmId];

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Calculator className="h-4 w-4" />
            <span>Mathematical Derivation</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
            Formal Proof Sketch
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
          Why is {data.name} {data.worstCase.complexity}?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* 3-Column Best / Average / Worst & Space Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Best Case */}
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-400">Best Case</span>
            <span className="text-sm font-mono font-extrabold text-emerald-300">{data.bestCase.complexity}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{data.bestCase.condition}</p>
        </div>

        {/* Average Case */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-amber-400">Average Case</span>
            <span className="text-sm font-mono font-extrabold text-amber-300">{data.averageCase.complexity}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{data.averageCase.condition}</p>
        </div>

        {/* Worst Case */}
        <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-rose-400">Worst Case</span>
            <span className="text-sm font-mono font-extrabold text-rose-300">{data.worstCase.complexity}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{data.worstCase.condition}</p>
        </div>

        {/* Space Complexity */}
        <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-purple-400">Space Complexity</span>
            <span className="text-sm font-mono font-extrabold text-purple-300">{data.spaceComplexity.complexity}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{data.spaceComplexity.type}</p>
        </div>
      </div>

      {/* Step-by-Step Counting Argument */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
          <span>Step-by-Step Counting Argument</span>
        </h4>

        <div className="space-y-3">
          {data.steps.map((step) => (
            <div
              key={step.stepNumber}
              className={`p-4 rounded-xl border transition-all ${
                step.highlight
                  ? "border-cyan-400/50 bg-cyan-950/30 shadow-[0_0_16px_rgba(56,189,248,0.1)]"
                  : "border-slate-800 bg-[#070b14]/80"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-md bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-[10px]">
                    {step.stepNumber}
                  </span>
                  <span>{step.title}</span>
                </span>
                {step.highlight && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold">
                    Conclusion
                  </span>
                )}
              </div>

              {/* Mathematical Formula Banner */}
              <div className="my-2 p-2.5 rounded-lg bg-[#050811] border border-slate-700/60 font-mono text-xs sm:text-sm text-cyan-200 overflow-x-auto select-text shadow-inner">
                <code>{step.formula}</code>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans">
                {step.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Intuitive Real-World Scale Takeaway */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-start gap-3">
        <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
            Real-World Scalability Intuition
          </h5>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed mt-1">
            {data.realWorldIntuition}
          </p>
        </div>
      </div>
    </div>
  );
}
