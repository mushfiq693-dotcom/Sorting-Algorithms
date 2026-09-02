"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Eye, Bug, Sparkles, ArrowRight } from "lucide-react";

interface StepItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  link: string;
}

const JOURNEY_STEPS: StepItem[] = [
  {
    number: "01",
    title: "LEARN",
    tagline: "Concept Before Syntax",
    description: "Understand the core algorithmic intuition and invariant before worrying about the implementation.",
    icon: BookOpen,
    link: "/docs",
  },
  {
    number: "02",
    title: "VISUALIZE",
    tagline: "See Every Step",
    description: "Watch the actual algorithm execute with live comparisons, swaps, partitions, and recursion trees.",
    icon: Eye,
    link: "/visualizer",
  },
  {
    number: "03",
    title: "DEBUG",
    tagline: "Break & Investigate",
    description: "Follow synchronized C++ lines, inspect scope variables, and track call stack frames in real time.",
    icon: Bug,
    link: "/algorithms/bubble",
  },
  {
    number: "04",
    title: "PRACTICE",
    tagline: "Achieve Mastery",
    description: "Solve quizzes, hunt buggy code logic, write implementations, and test against rigorous automated test suites.",
    icon: Sparkles,
    link: "/learn",
  },
];

export function LearningJourney() {
  return (
    <section
      id="learning-workflow"
      className="py-16 sm:py-24 border-b border-border relative overflow-hidden bg-background scroll-mt-16 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/40 bg-card text-primary text-xs font-sans font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <span>Pedagogical Architecture</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            A Complete Learning Workflow
          </h2>

          <p className="font-sans font-normal text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            From zero understanding to complete algorithmic confidence through a structured, 4-stage interactive journey.
          </p>
        </div>

        {/* 4-Stage Connected Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {JOURNEY_STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative flex flex-col justify-between rounded bg-card border border-border p-6 sm:p-7 backdrop-blur-xl shadow-lg hover:border-primary/60 hover:shadow-brass transition-all duration-300 corner-flourish group"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-sans text-2xl font-bold text-muted-foreground/40 group-hover:text-primary transition-colors select-none">
                      {step.number}
                    </span>
                    <div className="p-2.5 rounded border border-border bg-background text-primary group-hover:border-primary group-hover:bg-[#8B2635] group-hover:text-white transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="font-sans text-lg font-semibold text-foreground tracking-wide uppercase">
                    {step.title}
                  </h3>

                  <p className="font-sans italic text-xs text-primary font-medium mt-1">
                    {step.tagline}
                  </p>

                  <p className="font-sans font-normal text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    href={step.link}
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 group-hover:tracking-widest transition-all"
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
