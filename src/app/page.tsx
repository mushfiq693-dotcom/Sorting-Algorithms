"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SortingVisualizer } from "@/components/visualizer/SortingVisualizer";
import { HeroAnimation } from "@/components/landing/HeroAnimation";
import { ValueProposition } from "@/components/landing/ValueProposition";
import { LearningJourney } from "@/components/landing/LearningJourney";
import { CurriculumShowcase } from "@/components/landing/CurriculumShowcase";
import { BetaBanner } from "@/components/landing/BetaBanner";
import { GlossaryModal } from "@/components/glossary/GlossaryModal";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import {
  ArrowDown,
  Code2,
  Sparkles,
  Layers,
  ShieldCheck,
  Table,
  GraduationCap,
  BookOpen,
  Terminal,
  Bug,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#070b12] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-secondary/80 text-foreground hover:text-cyan-400"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-sans">
                  AlgoHub
                </span>
                <AmbientSortLogo />
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-card/70 transition-all active:scale-95 shadow-sm"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>Docs & Course</span>
            </Link>

            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-card/70 transition-all active:scale-95"
            >
              <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
              <span>Learning Path</span>
            </Link>

            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-card/70 transition-all active:scale-95"
            >
              <Table className="h-3.5 w-3.5 text-purple-400" />
              <span>Compare</span>
            </Link>

            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-card/70 transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
              <span>Glossary</span>
            </button>

            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Learning</span>
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-[#070b14]/95 p-4 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-2">
            <Link
              href="/learn"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 text-cyan-300 font-semibold text-xs border border-cyan-500/20"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Start Learning (Learning Path)</span>
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 text-slate-200 text-xs font-medium"
            >
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>Documentation & Course (17 Lessons)</span>
            </Link>

            <Link
              href="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 text-slate-200 text-xs font-medium"
            >
              <Table className="h-4 w-4 text-purple-400" />
              <span>Algorithm Comparison Matrix</span>
            </Link>

            <a
              href="#visualizer-workspace"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 text-slate-200 text-xs font-medium"
            >
              <Layers className="h-4 w-4 text-blue-400" />
              <span>Interactive Visualizer Workspace</span>
            </a>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsGlossaryOpen(true);
              }}
              className="w-full text-left flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 text-slate-200 text-xs font-medium"
            >
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Interactive Glossary (30+ Terms)</span>
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SECTION — LARGE BOLD TEXTS + COMPACT LIVE PREVIEW */}
        <section className="relative overflow-hidden pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14 border-b border-border/40">
          {/* Subtle Glow Accents */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 blur-[130px] pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            {/* 1. Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-cyan-500/35 bg-cyan-500/15 text-cyan-300 text-xs sm:text-sm font-mono font-bold mb-5 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Interactive Algorithm Learning Platform</span>
            </div>

            {/* 2. Main Headline (Large & Bold) */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15] font-sans">
              Make Algorithms{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Make Sense.
              </span>
            </h1>

            {/* 3. Hero Tagline (Prominent & Clear) */}
            <p className="mt-5 text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug font-sans max-w-4xl">
              Don&apos;t just learn Algorithms.{" "}
              <span className="text-cyan-400 font-black">See them.</span>{" "}
              <span className="text-rose-400 font-black">Break them.</span>{" "}
              <span className="text-amber-400 font-black">Fix them.</span>{" "}
              <span className="text-emerald-400 font-black">Master them.</span>
            </p>

            {/* 4. Supporting Description (Readable & Clear) */}
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-200 font-medium max-w-3xl leading-relaxed font-sans">
              Learn algorithms step by step through interactive visualization, code execution, debugging, comparison, and hands-on practice.
            </p>

            {/* 5. Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-3.5 sm:gap-4">
              {/* Primary CTA */}
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Start Learning</span>
              </Link>

              {/* Secondary CTA */}
              <a
                id="cta-start-visualizing"
                href="#visualizer-workspace"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/80 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-foreground hover:bg-secondary hover:border-cyan-500/40 transition-all active:scale-[0.98]"
              >
                <span>Explore Visualizer</span>
                <ArrowDown className="h-4 w-4 animate-bounce text-cyan-400" />
              </a>

              {/* Tertiary CTA */}
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/80 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-foreground hover:bg-secondary hover:border-purple-500/40 transition-all active:scale-[0.98]"
              >
                <Table className="h-4 w-4 text-purple-400" />
                <span>Compare Algorithms</span>
              </Link>
            </div>

            {/* 6. Compact Live Engine Interactive Preview */}
            <div className="mt-7 w-full">
              <HeroAnimation />
            </div>

            {/* 7. 4-Feature Cards Row */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full text-left">
              {/* Feature 1 */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-lg hover:border-cyan-500/40 transition-all group">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white font-sans truncate">
                    Real-Time Step Engine
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    True operational capture, 0% faked animations
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-lg hover:border-blue-500/40 transition-all group">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Terminal className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white font-sans truncate">
                    Code Debugger
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    Live scope variables & call stack frames
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-lg hover:border-rose-500/40 transition-all group">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                  <Bug className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white font-sans truncate">
                    Bug-Hunt Challenge
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    Find & fix flaws in real buggy engines
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-[#0b101d]/90 backdrop-blur-xl shadow-lg hover:border-emerald-500/40 transition-all group">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white font-sans truncate">
                    Rigorous Complexity
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    Time, Space, Stability & In-Place metrics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-STAGE LEARNING JOURNEY (01 LEARN -> 02 VISUALIZE -> 03 DEBUG -> 04 PRACTICE) */}
        <LearningJourney />

        {/* CURRICULUM SHOWCASE, ALGORITHM GRID & COMPARISON TEASER */}
        <CurriculumShowcase />

        {/* INTERACTIVE VISUALIZER WORKSPACE */}
        <section id="visualizer-workspace" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-border/40">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#38bdf8]" />
                  Interactive Visualizer Workspace
                </h2>
                <p className="text-sm text-muted-foreground mt-1 font-sans">
                  Adjust playback speed, step forward, test custom arrays, and follow C++ execution line-by-line in real time.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <Link
                  href="/learn"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>Guided Learning Path</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <SortingVisualizer />
          </div>
        </section>

        {/* GSTU CSE RESTRICTED BETA BANNER & FEEDBACK ENTRY POINTS */}
        <BetaBanner />
      </main>

      {/* Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-background/90 py-10 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-white font-sans text-sm">AlgoHub</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                GSTU CSE Beta
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              An interactive environment for understanding algorithms by seeing, debugging, and practicing them.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <Link href="/docs" className="hover:text-cyan-400 transition-colors">Docs & Course</Link>
            <span>•</span>
            <Link href="/learn" className="hover:text-cyan-400 transition-colors">Learning Path</Link>
            <span>•</span>
            <Link href="/compare" className="hover:text-cyan-400 transition-colors">Compare</Link>
            <span>•</span>
            <a href="#visualizer-workspace" className="hover:text-cyan-400 transition-colors">Visualizer</a>
            <span>•</span>
            <button onClick={() => setIsGlossaryOpen(true)} className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Glossary
            </button>
            <span>•</span>
            <a
              href="mailto:mushfiq693@gmail.com?subject=AlgoHub%20Beta%20Feedback%20[GSTU%20CSE]"
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              💬 Feedback
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-slate-800/60 text-center text-[10px] text-slate-500 font-mono">
          © 2026 AlgoHub. Gopalganj Science and Technology University (GSTU) CSE Department Restricted Beta.
        </div>
      </footer>
    </div>
  );
}
