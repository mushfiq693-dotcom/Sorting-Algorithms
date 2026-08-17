"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import {
  Menu,
  X,
  BookOpen,
  Layers,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#070b12] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-secondary/80 text-foreground hover:text-cyan-400"
              aria-label="Toggle Documentation Navigation"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  AlgoHub
                </span>
                <AmbientSortLogo />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-400 transition-all active:scale-95"
            >
              <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Learning Path</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:from-blue-500 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Launch Visualizer</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dual-Pane Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
        {/* Desktop Sidebar (Fixed Width, Scrollable) */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <DocsSidebar />
        </div>

        {/* Mobile Slideout Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] h-full bg-[#070b12] z-50 shadow-2xl">
              <DocsSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Dynamic Main Article Content */}
        <main className="flex-1 min-w-0 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
