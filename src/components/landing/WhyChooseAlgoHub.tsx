"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Bug,
  Split,
  BrainCircuit,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Eye,
  CheckCircle2,
} from "lucide-react";

interface AdvantageCard {
  icon: React.ElementType;
  badge: string;
  title: string;
  description: string;
  highlight: string;
  accentColor: string;
}

const ADVANTAGES: AdvantageCard[] = [
  {
    icon: Eye,
    badge: "Active vs. Passive",
    title: "Live Deterministic Execution",
    description:
      "Not static GIFs or canned animations. Every array swap, pivot partition, and linked-list pointer shift is generated live from actual algorithmic logic in real time.",
    highlight: "Control speed, step forward/backward, and test custom input arrays.",
    accentColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  },
  {
    icon: Bug,
    badge: "Real Engineering Skill",
    title: "Interactive Bug Hunt Mode",
    description:
      "True algorithmic mastery is knowing how to fix broken code. Encounter intentionally injected edge-case bugs, off-by-one loops, and pointer leaks to hone your debugging instinct.",
    highlight: "Diagnose flaws before you face them in technical interviews.",
    accentColor: "text-rose-500 bg-rose-500/10 border-rose-500/30",
  },
  {
    icon: Split,
    badge: "Empirical Benchmarking",
    title: "Side-by-Side Comparison Matrix",
    description:
      "Don't just take textbook time complexities on faith. Run multiple sorting algorithms simultaneously on identical randomized, reversed, or nearly sorted datasets.",
    highlight: "Compare exact comparison counts, swaps, and millisecond runtimes.",
    accentColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
  },
  {
    icon: BrainCircuit,
    badge: "Adaptive Mastery",
    title: "Conceptual Checkpoints & Telemetry",
    description:
      "Reinforce knowledge instantly with targeted micro-quizzes, time complexity puzzles, and cloud-synced progress tracking that measures your accuracy across every topic.",
    highlight: "Continuous feedback loop so concepts stick permanently.",
    accentColor: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  },
  {
    icon: GraduationCap,
    badge: "Academic & Interview Ready",
    title: "Rigorous Mathematical Proofs",
    description:
      "From university exam derivations (recurrence relations, tree depths, summation proofs) to production-grade C++ and TypeScript implementations ready for MAANG interviews.",
    highlight: "Covers intuition, formal math, and clean readable code.",
    accentColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    icon: Zap,
    badge: "Frictionless Experience",
    title: "Zero Setup & 100% Free",
    description:
      "No complex IDE setup, compiler configurations, or paywalls. Jump right into learning with 1-click Google sign-in and responsive, glassmorphic design on desktop and mobile.",
    highlight: "Instant access anytime, anywhere across all your devices.",
    accentColor: "text-primary bg-primary/10 border-primary/30",
  },
];

export function WhyChooseAlgoHub() {
  return (
    <section className="py-20 sm:py-24 border-b border-border relative overflow-hidden bg-secondary/20">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/40 bg-card/80 text-primary text-xs font-sans font-semibold uppercase tracking-wider shadow-xs backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>The AlgoHub Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground font-heading leading-tight">
            Why Choose{" "}
            <span className="italic font-semibold text-primary dark:text-[#D4B872]">
              AlgoHub?
            </span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
            Traditional textbooks and static video lectures make DSA feel abstract and tedious. 
            AlgoHub transforms algorithm education into an interactive laboratory where you actively see, test, break, and master every concept.
          </p>
        </div>

        {/* 6 High-Impact Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADVANTAGES.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-xl border border-border bg-card/80 hover:bg-card/95 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between corner-flourish"
              >
                <div className="space-y-4">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-11 w-11 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 ${card.accentColor}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border font-semibold">
                      {card.badge}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground font-heading tracking-tight">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>

                {/* Highlight Footer */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-start gap-2 text-[11px] font-mono text-foreground/90">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{card.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Metric & CTA Strip */}
        <div className="p-6 sm:p-8 rounded-2xl border border-primary/30 bg-card/90 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 corner-flourish">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h4 className="text-base sm:text-lg font-bold font-heading text-foreground">
                Ready to transform how you learn Data Structures & Algorithms?
              </h4>
            </div>
            <p className="text-xs text-muted-foreground font-sans">
              Join students and engineers mastering DSA with interactive visual intuition.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/visualizer"
              className="btn-brass inline-flex items-center gap-2 rounded px-6 py-2.5 text-xs font-sans font-semibold tracking-wide text-primary-foreground shadow-brass hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>Explore Visualizer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded border border-border bg-secondary hover:bg-secondary/80 text-xs font-sans font-semibold text-foreground transition-colors"
            >
              Start Learning Track
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
