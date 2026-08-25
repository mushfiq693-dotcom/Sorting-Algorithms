"use client";

import React from "react";
import Link from "next/link";
import { ALL_TOPICS, ALGORITHMS } from "@/data/algorithms";
import { LEARNING_PATH } from "@/data/learningPath";
import {
  GraduationCap,
  ArrowRight,
  Compass,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Database,
} from "lucide-react";

export function CurriculumShowcase() {
  return (
    <section className="py-16 sm:py-20 border-b border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* PART 1: Learning Path — "Your Path from Confused to Confident" */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold mb-4 backdrop-blur-md">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Structured Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Your Path from Confused to Confident
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Learn algorithms & data structures progressively instead of jumping randomly between topics. Master foundational mechanics before advancing to divide-and-conquer recursion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
            {LEARNING_PATH.map((step) => (
              <Link
                key={step.id}
                href={`/algorithms/${step.id}`}
                className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 hover:-translate-y-1 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      0{step.order}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-400" /> {step.estimatedTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {step.name}
                  </h3>
                  <p className="text-[10px] font-mono text-cyan-400 mt-0.5 line-clamp-1">
                    {step.badge}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                    {step.reason}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Start</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* PART 2: Deep-Dive Modules Showcase */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-mono font-semibold mb-3">
                <Layers className="h-3.5 w-3.5" />
                <span>Curriculum Modules</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Explore Core Topics & Modules
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Each module includes animated visualizers, step-by-step code walkthroughs, Bug-Hunt exercises, and signature static diagrams.
              </p>
            </div>

            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
            >
              <span>View Full Learning Path</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_TOPICS.map((id) => {
              const meta = ALGORITHMS[id];
              const isDS = meta.category === "data-structure";
              const isComplexity = meta.category === "complexity";

              return (
                <div
                  key={id}
                  className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 p-6 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {meta.name}
                        </h3>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          {isDS ? "Data Structure" : isComplexity ? "Complexity Analysis" : "Sorting Algorithm"}
                        </span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                        {meta.complexity.average}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                      {meta.shortDescription}
                    </p>

                    {/* Complexity Pills */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-[#070b14]/80 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Best Time</span>
                        <span className="text-emerald-400 font-bold">{meta.complexity.best}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Worst Time</span>
                        <span className="text-rose-400 font-bold">{meta.complexity.worst}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Aux Space</span>
                        <span className="text-purple-300 font-bold">{meta.complexity.space}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">{isDS ? "Invariant" : isComplexity ? "Scale" : "Stability"}</span>
                        <span className="text-cyan-300 font-bold">{isDS ? (id === "stack" ? "LIFO" : "FIFO") : isComplexity ? "Asymptotic" : meta.complexity.stable ? "Stable" : "Unstable"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <Link
                      href={`/algorithms/${id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
                    >
                      <span>Launch Deep Dive</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href={isDS ? `/docs/${id}-data-structure` : isComplexity ? `/docs/${id}` : `/docs/${id}-sort`}
                      className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                    >
                      Read Theory →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PART 3: Comparison Matrix Teaser & Beginner-Friendly Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comparison Card */}
          <div className="p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-[#0b101d] to-[#070b12] backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold mb-4">
                <Compass className="h-3.5 w-3.5" />
                <span>Multi-Dimensional Analysis</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Don&apos;t just learn one algorithm. Compare them.
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                See how different algorithmic approaches behave across time complexity, auxiliary memory, stability guarantees, and practical real-world engineering constraints.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-cyan-500/20">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 transition-all shadow-md shadow-cyan-500/20"
              >
                <Zap className="h-4 w-4" />
                <span>Open Comparison Matrix →</span>
              </Link>
            </div>
          </div>

          {/* Beginner-Friendly Card */}
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Beginner-Centered Design</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Built for the moment when algorithms finally make sense.
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                No opaque math jargon without intuition. AlgoHub pairs step-by-step visual demonstrations with synchronized C++ line execution, Bug-Hunt challenges, and Bengali summary notes.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-4 text-xs font-mono text-emerald-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Intuitive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Interactive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Production-Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
