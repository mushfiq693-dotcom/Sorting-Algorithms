"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Eye, Bug, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  bgGlow: string;
  link: string;
}

const JOURNEY_STEPS: StepItem[] = [
  {
    number: "01",
    title: "LEARN",
    tagline: "Concept Before Syntax",
    description: "Understand the core algorithmic intuition and invariant before worrying about the implementation.",
    icon: BookOpen,
    accentColor: "text-cyan-400 border-cyan-500/30",
    bgGlow: "from-cyan-500/15 via-cyan-500/5 to-transparent",
    link: "/docs",
  },
  {
    number: "02",
    title: "VISUALIZE",
    tagline: "See Every Step",
    description: "Watch the actual algorithm execute with live comparisons, swaps, partitions, and recursion trees.",
    icon: Eye,
    accentColor: "text-blue-400 border-blue-500/30",
    bgGlow: "from-blue-500/15 via-blue-500/5 to-transparent",
    link: "/#visualizer-workspace",
  },
  {
    number: "03",
    title: "DEBUG",
    tagline: "Break & Investigate",
    description: "Follow synchronized C++ lines, inspect scope variables, and track call stack frames in real time.",
    icon: Bug,
    accentColor: "text-rose-400 border-rose-500/30",
    bgGlow: "from-rose-500/15 via-rose-500/5 to-transparent",
    link: "/algorithms/bubble",
  },
  {
    number: "04",
    title: "PRACTICE",
    tagline: "Achieve Mastery",
    description: "Solve quizzes, hunt buggy code logic, write implementations, and test against rigorous automated test suites.",
    icon: Sparkles,
    accentColor: "text-emerald-400 border-emerald-500/30",
    bgGlow: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    link: "/learn",
  },
];

export function LearningJourney() {
  return (
    <section className="py-16 sm:py-20 border-b border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold mb-4 backdrop-blur-md">
            <span>Pedagogical Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            A Complete Learning Workflow
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            From zero understanding to complete algorithmic confidence through a structured, 4-stage interactive journey.
          </p>
        </div>

        {/* 4-Stage Connected Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className={`relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-gradient-to-b ${step.bgGlow} bg-[#0b101d]/90 p-6 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 transition-all duration-300 group`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-extrabold text-white/30 group-hover:text-white/60 transition-colors">
                      {step.number}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${step.accentColor} bg-[#070b14] shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{step.title}</span>
                  </h3>
                  <p className="text-xs font-mono text-cyan-300 font-semibold mt-1">
                    {step.tagline}
                  </p>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-3 font-sans">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={step.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
                  >
                    <span>Explore Stage</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
