"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LockedVisualizerGate } from "@/components/landing/LockedVisualizerGate";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { AuthButton } from "@/components/auth/AuthButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LINKS } from "@/config/links";
import {
  Layers,
  Sparkles,
  BookOpen,
  GraduationCap,
  BarChart3,
  Table,
  ArrowLeft,
  ArrowRight,
  Code2,
  Terminal,
  Zap,
} from "lucide-react";

export default function VisualizerPage() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 transition-colors duration-150">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95 shadow-sm"
            >
              <BarChart3 className="h-3.5 w-3.5 text-cyan-500" />
              <span>My Progress</span>
            </Link>

            <Link
              href="/learn"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-secondary transition-all active:scale-95"
            >
              <GraduationCap className="h-3.5 w-3.5 text-cyan-500" />
              <span>Learning Path</span>
            </Link>

            <Link
              href="/docs"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-secondary transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
              <span>Docs</span>
            </Link>

            <Link
              href="/compare"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-secondary transition-all active:scale-95"
            >
              <Table className="h-3.5 w-3.5 text-purple-500" />
              <span>Compare</span>
            </Link>

            <ThemeToggle />
            <NotificationBell />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/40">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-3 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live Execution Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <Layers className="h-7 w-7 text-cyan-500" />
              Interactive Visualizer Workspace
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-sans max-w-3xl leading-relaxed">
              Adjust playback speed, step forward or backward, test custom array inputs, and follow C++ execution line-by-line in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Guided Learning Path</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Visualizer Gate & Engine */}
        <div className="mb-12">
          <LockedVisualizerGate />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/90 py-10 text-xs text-muted-foreground mt-auto">
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
            <Link href="/" className="hover:text-cyan-500 transition-colors">Home</Link>
            <span>•</span>
            <Link href="/learn" className="hover:text-cyan-500 transition-colors font-semibold text-cyan-600 dark:text-cyan-300">Learning Path</Link>
            <span>•</span>
            <Link href="/docs" className="hover:text-cyan-500 transition-colors">Docs & Course</Link>
            <span>•</span>
            <Link href="/compare" className="hover:text-cyan-500 transition-colors">Compare</Link>
            <span>•</span>
            <a
              href={LINKS.GOOGLE_FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline font-semibold"
            >
              💬 Feedback
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-border text-center text-[10px] text-muted-foreground font-mono">
          © 2026 AlgoHub. Gopalganj Science and Technology University (GSTU) CSE Department Restricted Beta.
        </div>
      </footer>
    </div>
  );
}
