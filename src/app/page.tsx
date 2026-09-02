"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HeroAnimation } from "@/components/landing/HeroAnimation";
import { LearningJourney } from "@/components/landing/LearningJourney";
import { BetaBanner } from "@/components/landing/BetaBanner";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { AuthButton } from "@/components/auth/AuthButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LINKS } from "@/config/links";
import {
  Code2,
  Sparkles,
  Layers,
  Table,
  GraduationCap,
  BookOpen,
  Terminal,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Bookmark,
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
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-[#C9A962]/35 selection:text-[#1C1714] transition-colors duration-200 font-sans font-normal">
      {/* Top Navbar — Scholarly Header with Day & Night Support */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded bg-card border border-border text-foreground hover:text-primary hover:border-primary"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                AlgoHub
              </span>
              <AmbientSortLogo />
            </Link>
          </div>

          {/* Desktop Nav Links — Grouped Structure (Manrope 600) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 sm:gap-2 font-sans text-xs font-semibold tracking-wide">
              {/* 1. Learn Dropdown */}
              <div className="relative" ref={learnRef}>
                <button
                  onClick={() => {
                    setLearnDropdownOpen(!learnDropdownOpen);
                    setPracticeDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-semibold transition-all active:scale-95 shadow-sm ${
                    learnDropdownOpen
                      ? "border-primary bg-card text-primary shadow-brass"
                      : "border-border bg-card/80 text-foreground hover:text-primary hover:border-primary/50 hover:bg-card"
                  }`}
                  aria-expanded={learnDropdownOpen}
                >
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>Learn</span>
                  <ChevronDown
                    className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                      learnDropdownOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {learnDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 rounded-lg border-2 border-[#B08422]/50 dark:border-[#C9A962]/50 bg-[#FFFFFF] dark:bg-[#251E19] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 corner-flourish">
                    <Link
                      href="/learn"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-md hover:bg-[#F5EFEB] dark:hover:bg-[#1C1714] transition-colors group"
                    >
                      <div className="p-2 rounded border border-[#D8CBB8] dark:border-[#4A3F35] bg-[#FAF6F0] dark:bg-[#1C1714] text-[#B08422] dark:text-[#C9A962] shrink-0 mt-0.5 group-hover:border-primary group-hover:bg-[#8B2635] group-hover:text-white transition-colors">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-sans text-xs font-semibold text-[#1C1714] dark:text-[#E8DFD4] group-hover:text-primary tracking-wide transition-colors">
                          Learning Path
                        </div>
                        <div className="font-sans text-xs text-[#5C4D42] dark:text-[#9C8B7A] leading-relaxed mt-0.5 normal-case font-normal">
                          Guided step-by-step roadmap from Bubble to Quick Sort
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/docs"
                      onClick={() => setLearnDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-md hover:bg-[#F5EFEB] dark:hover:bg-[#1C1714] transition-colors group"
                    >
                      <div className="p-2 rounded border border-[#D8CBB8] dark:border-[#4A3F35] bg-[#FAF6F0] dark:bg-[#1C1714] text-[#B08422] dark:text-[#C9A962] shrink-0 mt-0.5 group-hover:border-primary group-hover:bg-[#8B2635] group-hover:text-white transition-colors">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-sans text-xs font-semibold text-[#1C1714] dark:text-[#E8DFD4] group-hover:text-primary tracking-wide transition-colors">
                          Docs & Course
                        </div>
                        <div className="font-sans text-xs text-[#5C4D42] dark:text-[#9C8B7A] leading-relaxed mt-0.5 normal-case font-normal">
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
                  className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-semibold transition-all active:scale-95 shadow-sm ${
                    practiceDropdownOpen
                      ? "border-primary bg-card text-primary shadow-brass"
                      : "border-border bg-card/80 text-foreground hover:text-primary hover:border-primary/50 hover:bg-card"
                  }`}
                  aria-expanded={practiceDropdownOpen}
                >
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span>Practice</span>
                  <ChevronDown
                    className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                      practiceDropdownOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {practiceDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 rounded-lg border-2 border-[#B08422]/50 dark:border-[#C9A962]/50 bg-[#FFFFFF] dark:bg-[#251E19] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 corner-flourish">
                    <Link
                      href="/visualizer"
                      onClick={() => setPracticeDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-md hover:bg-[#F5EFEB] dark:hover:bg-[#1C1714] transition-colors group"
                    >
                      <div className="p-2 rounded border border-[#D8CBB8] dark:border-[#4A3F35] bg-[#FAF6F0] dark:bg-[#1C1714] text-[#B08422] dark:text-[#C9A962] shrink-0 mt-0.5 group-hover:border-primary group-hover:bg-[#8B2635] group-hover:text-white transition-colors">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-sans text-xs font-semibold text-[#1C1714] dark:text-[#E8DFD4] group-hover:text-primary tracking-wide transition-colors">
                          Interactive Visualizer
                        </div>
                        <div className="font-sans text-xs text-[#5C4D42] dark:text-[#9C8B7A] leading-relaxed mt-0.5 normal-case font-normal">
                          Studio controls & step-by-step array animations
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/compare"
                      onClick={() => setPracticeDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-md hover:bg-[#F5EFEB] dark:hover:bg-[#1C1714] transition-colors group"
                    >
                      <div className="p-2 rounded border border-[#D8CBB8] dark:border-[#4A3F35] bg-[#FAF6F0] dark:bg-[#1C1714] text-[#B08422] dark:text-[#C9A962] shrink-0 mt-0.5 group-hover:border-primary group-hover:bg-[#8B2635] group-hover:text-white transition-colors">
                        <Table className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-sans text-xs font-semibold text-[#1C1714] dark:text-[#E8DFD4] group-hover:text-primary tracking-wide transition-colors">
                          Comparison Matrix
                        </div>
                        <div className="font-sans text-xs text-[#5C4D42] dark:text-[#9C8B7A] leading-relaxed mt-0.5 normal-case font-normal">
                          Side-by-side Big-O trade-offs & characteristics
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/algorithms/bubble"
                      onClick={() => setPracticeDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-md hover:bg-[#F5EFEB] dark:hover:bg-[#1C1714] transition-colors group"
                    >
                      <div className="p-2 rounded border border-[#D8CBB8] dark:border-[#4A3F35] bg-[#FAF6F0] dark:bg-[#1C1714] text-[#B08422] dark:text-[#C9A962] shrink-0 mt-0.5 group-hover:border-primary group-hover:bg-[#8B2635] group-hover:text-white transition-colors">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-sans text-xs font-semibold text-[#1C1714] dark:text-[#E8DFD4] group-hover:text-primary tracking-wide transition-colors">
                          Code Debugger
                        </div>
                        <div className="font-sans text-xs text-[#5C4D42] dark:text-[#9C8B7A] leading-relaxed mt-0.5 normal-case font-normal">
                          Inspect live variables, scope & call stack
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. Course Material */}
              <Link
                href="/course-material"
                className="inline-flex items-center gap-1.5 rounded border border-border bg-card/80 px-3 py-1.5 font-semibold text-foreground hover:border-primary hover:text-primary hover:bg-card transition-all active:scale-95 shadow-sm"
              >
                <Bookmark className="h-3.5 w-3.5 text-primary" />
                <span>Course Material</span>
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
          <div className="lg:hidden border-b border-border bg-card p-4 space-y-3 backdrop-blur-xl animate-in slide-in-from-top-2">
            <div className="pb-2 border-b border-border">
              <AuthButton />
            </div>

            {/* Primary Action in Mobile */}
            <Link
              href="/learn"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-brass flex items-center justify-between p-3.5 rounded text-xs font-display uppercase tracking-widest font-bold shadow-brass"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Start Learning (Bubble Sort →)</span>
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Group 1: Learn */}
            <div className="space-y-1 pt-1">
              <div className="text-[10px] font-display uppercase tracking-[0.2em] text-primary px-2 font-bold">
                Learn
              </div>
              <Link
                href="/learn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded bg-background text-foreground text-xs font-display hover:text-primary transition-colors"
              >
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>Learning Path (Structured Roadmap)</span>
              </Link>
              <Link
                href="/docs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded bg-background text-foreground text-xs font-display hover:text-primary transition-colors"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Docs & Course (17 Lessons)</span>
              </Link>
            </div>

            {/* Group 2: Practice & Tools */}
            <div className="space-y-1 pt-1">
              <div className="text-[10px] font-display uppercase tracking-[0.2em] text-primary px-2 font-bold">
                Practice & Tools
              </div>
              <Link
                href="/visualizer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded bg-background text-foreground text-xs font-display hover:text-primary transition-colors"
              >
                <Layers className="h-4 w-4 text-primary" />
                <span>Interactive Visualizer Workspace</span>
              </Link>
              <Link
                href="/algorithms/bubble"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded bg-background text-foreground text-xs font-display hover:text-primary transition-colors"
              >
                <Terminal className="h-4 w-4 text-destructive" />
                <span>Debugger & Bug Hunt</span>
              </Link>
              <Link
                href="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded bg-background text-foreground text-xs font-display hover:text-primary transition-colors"
              >
                <Table className="h-4 w-4 text-primary" />
                <span>Algorithm Comparison Matrix</span>
              </Link>
              <Link
                href="/course-material"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded bg-background text-foreground text-xs font-display hover:text-primary transition-colors"
              >
                <Bookmark className="h-4 w-4 text-primary" />
                <span>Course Material (Assigned Topics & Problems)</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO SECTION — FULL VIEWPORT FOCUSED HERO */}
        <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 sm:py-16 border-b border-border">
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center my-auto">
            {/* 1. Hero Badge — Manrope 600 uppercase */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-primary/40 bg-card text-primary text-xs sm:text-sm font-sans font-semibold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Interactive Algorithm Learning Platform</span>
            </div>

            {/* 2. Main Headline — Cormorant Garamond 600 & Cormorant Garamond 600 Italic */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.15] font-heading">
              Make Algorithms{" "}
              <span className="italic font-semibold text-[#B08422] dark:text-[#D4B872]">
                Make Sense.
              </span>
            </h1>

            {/* 3. Hero Tagline / Subtitle — Manrope 500 */}
            <div className="mt-4 sm:mt-5 text-lg sm:text-2xl md:text-3xl font-medium tracking-tight text-foreground leading-snug font-sans max-w-3xl">
              <p className="text-muted-foreground font-medium">
                Don&apos;t just learn Algorithms.
              </p>
              <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5">
                <span className="text-[#B08422] dark:text-[#C9A962] font-semibold">See them.</span>
                <span className="text-[#8B2635] font-semibold">Break them.</span>
                <span className="text-amber-600 dark:text-amber-500 font-semibold">Fix them.</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-semibold">Master them.</span>
              </p>
            </div>

            {/* 4. Action Buttons — Manrope 600 + letter spacing */}
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              {/* PRIMARY CTA */}
              <Link
                href="/learn"
                className="btn-brass inline-flex items-center gap-2 rounded px-7 py-3.5 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] shadow-brass hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <GraduationCap className="h-5 w-5" />
                <span>Start Learning</span>
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </Link>

              {/* SECONDARY CTA */}
              <Link
                id="cta-start-visualizing"
                href="/visualizer"
                className="btn-secondary-brass inline-flex items-center gap-2 rounded px-7 py-3.5 text-xs sm:text-sm font-sans font-semibold tracking-[0.08em] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Layers className="h-5 w-5" />
                <span>Explore Visualizer</span>
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </Link>
            </div>

            {/* 5. Live Engine Preview */}
            <div className="mt-8 sm:mt-10 w-full max-w-lg p-2 rounded bg-card border border-border shadow-2xl corner-flourish">
              <HeroAnimation />
            </div>

            {/* 6. Subtle Scroll-Down Hint */}
            <a
              href="#learning-workflow"
              className="mt-6 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              <span>Explore 4-Stage Learning Workflow</span>
              <ChevronDown className="h-3.5 w-3.5 animate-bounce text-primary" />
            </a>
          </div>
        </section>

        {/* 1. PRIMARY NARRATIVE: 4-STAGE LEARNING JOURNEY */}
        <LearningJourney />

        {/* 5. GSTU CSE RESTRICTED BETA BANNER & FEEDBACK ENTRY POINTS */}
        <BetaBanner />
      </main>

      {/* FOOTER — Manrope 400 with Manrope 600 links */}
      <footer className="border-t border-border bg-card/60 py-10 text-xs text-muted-foreground font-sans font-normal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-heading text-base font-bold text-foreground">AlgoHub</span>
              <span className="font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 font-semibold">
                GSTU CSE Beta
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              An interactive environment for understanding algorithms by seeing, debugging, and practicing them.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-sans text-xs font-semibold tracking-wide">
            <Link href="/learn" className="hover:text-primary transition-colors text-primary">Learning Path</Link>
            <span className="text-border">·</span>
            <Link href="/docs" className="hover:text-primary transition-colors text-foreground">Docs & Course</Link>
            <span className="text-border">·</span>
            <Link href="/compare" className="hover:text-primary transition-colors text-foreground">Compare</Link>
            <span className="text-border">·</span>
            <Link href="/visualizer" className="hover:text-primary transition-colors text-foreground">Visualizer</Link>
            <span className="text-border">·</span>
            <Link href="/mentor" className="hover:text-primary transition-colors text-primary">
              Mentor Portal
            </Link>
            <span className="text-border">·</span>
            <a
              href={LINKS.GOOGLE_FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              💬 Feedback
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-border/60 text-center font-sans text-[11px] tracking-wide text-muted-foreground">
          © 2026 AlgoHub. Gopalganj Science and Technology University (GSTU) CSE Department Restricted Beta.
        </div>
      </footer>
    </div>
  );
}
