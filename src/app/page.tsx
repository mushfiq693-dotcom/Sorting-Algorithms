"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeroAnimation } from "@/components/landing/HeroAnimation";
import { ValueProposition } from "@/components/landing/ValueProposition";
import { LearningJourney } from "@/components/landing/LearningJourney";
import { BetaBanner } from "@/components/landing/BetaBanner";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { AuthButton } from "@/components/auth/AuthButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LINKS } from "@/config/links";
import {
  ArrowDown,
  Code2,
  Sparkles,
  Layers,
  Table,
  GraduationCap,
  BookOpen,
  Terminal,
  Bug,
  Menu,
  X,
  ArrowRight,
  BarChart3,
  ChevronDown,
  Eye,
  Award,
} from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Dropdown states
  const [learnDropdownOpen, setLearnDropdownOpen] = useState<boolean>(false);
  const [practiceDropdownOpen, setPracticeDropdownOpen] = useState<boolean>(false);

  const learnRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
        setLearnDropdownOpen(false);
      }
      if (practiceRef.current && !practiceRef.current.contains(event.target as Node)) {
        setPracticeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 transition-colors duration-150">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-secondary text-foreground hover:text-cyan-500"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-foreground font-sans">
                  AlgoHub
                </span>
                <AmbientSortLogo />
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links — Grouped Structure (3-4 Top-Level Items) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 sm:gap-2">
              {/* 1. Learn Dropdown */}
              <div className="relative" ref={learnRef}>
                <button
                  onClick={() => {
                    setLearnDropdownOpen(!learnDropdownOpen);
                    setPracticeDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 shadow-sm ${
                    learnDropdownOpen
                      ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300"
                      : "border-border bg-secondary/80 text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-secondary"
                  }`}
                  aria-expanded={learnDropdownOpen}
                >
                  <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Learn</span>
                  <ChevronDown
                    className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                      learnDropdownOpen ? "rotate-180 text-cyan-500" : ""
                    }`}
                  />
                </button>

                {learnDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 z-50">
                    <Link
                      href="/learn"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 shrink-0 mt-0.5">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          Learning Path
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          Guided step-by-step roadmap from Bubble to Quick Sort
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/docs"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0 mt-0.5">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                          Docs & Course
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          17 deep-dive lessons with C++ code & theory
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. Practice Dropdown */}
              <div className="relative" ref={practiceRef}>
                <button
                  onClick={() => {
                    setPracticeDropdownOpen(!practiceDropdownOpen);
                    setLearnDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 shadow-sm ${
                    practiceDropdownOpen
                      ? "border-blue-500/50 bg-blue-500/15 text-blue-600 dark:text-blue-300"
                      : "border-border bg-secondary/80 text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-secondary"
                  }`}
                  aria-expanded={practiceDropdownOpen}
                >
                  <Terminal className="h-3.5 w-3.5 text-blue-500" />
                  <span>Practice</span>
                  <ChevronDown
                    className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                      practiceDropdownOpen ? "rotate-180 text-blue-500" : ""
                    }`}
                  />
                </button>

                {practiceDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 z-50">
                    <Link
                      href="/visualizer"
                      onClick={() => setPracticeDropdownOpen(false)}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 shrink-0 mt-0.5">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          Live Visualizer
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          Step-by-step array animations & line-tracking
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/algorithms/bubble"
                      onClick={() => setPracticeDropdownOpen(false)}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0 mt-0.5">
                        <Terminal className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                          Code Debugger
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          Inspect live variables, scope & call stack
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/algorithms/bubble"
                      onClick={() => setPracticeDropdownOpen(false)}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 shrink-0 mt-0.5">
                        <Bug className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                          Bug-Hunt Challenge
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          Find & fix flawed algorithms under test
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. My Progress (Dashboard) */}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95 shadow-sm"
              >
                <BarChart3 className="h-3.5 w-3.5 text-cyan-500" />
                <span>My Progress</span>
              </Link>
            </div>

            {/* Notification Bell, Theme Toggle & Auth Button */}
            <ThemeToggle />
            <NotificationBell />
            <AuthButton />
          </div>
        </div>

        {/* Mobile Grouped Accordion Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-border bg-card/95 p-4 space-y-3 backdrop-blur-xl animate-in slide-in-from-top-2">
            <div className="pb-2 border-b border-border">
              <AuthButton />
            </div>

            {/* Primary Action in Mobile */}
            <Link
              href="/learn"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Start Learning (Bubble Sort →)</span>
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Group 1: Learn */}
            <div className="space-y-1 pt-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 font-bold">
                Learn
              </div>
              <Link
                href="/learn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/80 text-foreground text-xs font-medium hover:bg-secondary transition-colors"
              >
                <GraduationCap className="h-4 w-4 text-cyan-500" />
                <span>Learning Path (Structured Roadmap)</span>
              </Link>
              <Link
                href="/docs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/80 text-foreground text-xs font-medium hover:bg-secondary transition-colors"
              >
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>Docs & Course (17 Lessons)</span>
              </Link>
            </div>

            {/* Group 2: Practice & Tools */}
            <div className="space-y-1 pt-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 font-bold">
                Practice & Tools
              </div>
              <Link
                href="/visualizer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/80 text-foreground text-xs font-medium hover:bg-secondary transition-colors"
              >
                <Layers className="h-4 w-4 text-cyan-500" />
                <span>Interactive Visualizer Workspace</span>
              </Link>
              <Link
                href="/algorithms/bubble"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/80 text-foreground text-xs font-medium hover:bg-secondary transition-colors"
              >
                <Terminal className="h-4 w-4 text-rose-500" />
                <span>Debugger & Bug Hunt</span>
              </Link>
              <Link
                href="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/80 text-foreground text-xs font-medium hover:bg-secondary transition-colors"
              >
                <Table className="h-4 w-4 text-purple-500" />
                <span>Algorithm Comparison Matrix</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-xs font-semibold border border-cyan-500/20"
              >
                <BarChart3 className="h-4 w-4 text-cyan-500" />
                <span>My Progress Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SECTION — ONE UNMISTAKABLE PRIMARY ACTION */}
        <section className="relative overflow-hidden pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14 border-b border-border/40">
          {/* Subtle Glow Accents */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 blur-[130px] pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            {/* 1. Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full border border-cyan-500/35 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-xs sm:text-sm font-mono font-bold mb-5 backdrop-blur-md shadow-sm">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              <span>Interactive Algorithm Learning Platform</span>
            </div>

            {/* 2. Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12] font-sans">
              Make Algorithms{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Make Sense.
              </span>
            </h1>

            {/* 3. Hero Tagline */}
            <p className="mt-5 text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-snug font-sans max-w-4xl">
              Don&apos;t just learn Algorithms.{" "}
              <span className="text-cyan-500 dark:text-cyan-400 font-black">See them.</span>{" "}
              <span className="text-rose-500 dark:text-rose-400 font-black">Break them.</span>{" "}
              <span className="text-amber-500 dark:text-amber-400 font-black">Fix them.</span>{" "}
              <span className="text-emerald-500 dark:text-emerald-400 font-black">Master them.</span>
            </p>

            {/* 4. Supporting Description */}
            <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground font-medium max-w-3xl leading-relaxed font-sans">
              Learn algorithms step by step through interactive visualization, code execution, debugging, comparison, and hands-on practice.
            </p>

            {/* 5. Clear Action Hierarchy: ONE Dominant Primary CTA + ONE Lightweight Secondary Option */}
            <div className="mt-7 flex flex-wrap justify-center items-center gap-3.5 sm:gap-4">
              {/* PRIMARY VISUALLY DOMINANT CTA */}
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Start Learning</span>
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </Link>

              {/* VISUALLY DOMINANT CTA — EXPLORE VISUALIZER */}
              <Link
                id="cta-start-visualizing"
                href="/visualizer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <Layers className="h-5 w-5" />
                <span>Explore Visualizer</span>
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </Link>
            </div>

            {/* 6. Compact Live Engine Interactive Preview */}
            <div className="mt-8 w-full">
              <HeroAnimation />
            </div>
          </div>
        </section>

        {/* 1. PRIMARY NARRATIVE: 4-STAGE LEARNING JOURNEY (01 LEARN -> 02 VISUALIZE -> 03 DEBUG -> 04 PRACTICE) */}
        <LearningJourney />

        {/* 5. GSTU CSE RESTRICTED BETA BANNER & FEEDBACK ENTRY POINTS */}
        <BetaBanner />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/50 bg-background/90 py-10 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-foreground font-sans text-sm">AlgoHub</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 font-bold">
                GSTU CSE Beta
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              An interactive environment for understanding algorithms by seeing, debugging, and practicing them.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <Link href="/learn" className="hover:text-cyan-500 transition-colors font-semibold text-cyan-600 dark:text-cyan-300">Learning Path</Link>
            <span>•</span>
            <Link href="/docs" className="hover:text-cyan-500 transition-colors">Docs & Course</Link>
            <span>•</span>
            <Link href="/compare" className="hover:text-cyan-500 transition-colors">Compare</Link>
            <span>•</span>
            <Link href="/visualizer" className="hover:text-cyan-500 transition-colors">Visualizer</Link>
            <span>•</span>
            <Link href="/mentor" className="hover:text-purple-400 transition-colors text-purple-300/80">
              Mentor Portal
            </Link>
            <span>•</span>
            <a
              href={LINKS.GOOGLE_FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
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
