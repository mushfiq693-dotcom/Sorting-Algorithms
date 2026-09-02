"use client";

import React from "react";
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
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export default function VisualizerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-[#C9A962]/35 selection:text-[#1C1714] transition-colors duration-200 font-body">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                AlgoHub
              </span>
              <AmbientSortLogo />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <NotificationBell />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Page Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/40 bg-card text-primary text-[11px] font-mono font-semibold mb-1 backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              <span>Live Execution Engine</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Interactive Visualizer Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <Link
              href="/learn"
              className="btn-brass inline-flex items-center gap-2 rounded px-4 py-2.5 text-xs font-display uppercase tracking-wider font-bold shadow-brass active:scale-95 transition-all"
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
      <footer className="border-t border-border bg-card/60 py-10 text-xs text-muted-foreground mt-auto font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-heading text-base font-bold text-foreground">AlgoHub</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 font-bold">
                GSTU CSE Beta
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              An interactive environment for understanding algorithms by seeing, debugging, and practicing them.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <Link href="/" className="hover:text-primary transition-colors text-foreground">Home</Link>
            <span>•</span>
            <Link href="/learn" className="hover:text-primary transition-colors font-semibold text-primary">Learning Path</Link>
            <span>•</span>
            <Link href="/docs" className="hover:text-primary transition-colors text-foreground">Docs & Course</Link>
            <span>•</span>
            <Link href="/compare" className="hover:text-primary transition-colors text-foreground">Compare</Link>
            <span>•</span>
            <a
              href={LINKS.GOOGLE_FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4B872] hover:text-[#C9A962] font-semibold"
            >
              💬 Feedback
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
