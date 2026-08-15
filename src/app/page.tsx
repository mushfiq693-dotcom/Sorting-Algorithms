import React from "react";
import Link from "next/link";
import { SortingVisualizer } from "@/components/visualizer/SortingVisualizer";
import { HeroAnimation } from "@/components/landing/HeroAnimation";
import {
  ArrowDown,
  Code2,
  Sparkles,
  Layers,
  ShieldCheck,
  Table,
  Zap,
  Cpu,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070b12] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                SortViz
              </span>
              <span className="ml-2 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                5 Algorithms
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-400 transition-all active:scale-95"
            >
              <Table className="h-3.5 w-3.5" />
              <span>Compare Matrix</span>
            </Link>

            <a
              href="#visualizer-workspace"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            >
              Launch Visualizer
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 border-b border-border/40">
          {/* Subtle Glow Accents */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/10 blur-[130px] pointer-events-none -z-10" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-6 backdrop-blur-md shadow-inner">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Data Structures & Algorithms</span>
            </div>

            {/* Headline as requested in roadmap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Sorting Algorithms,{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Visualized.
              </span>
            </h1>

            {/* Subheading as requested in roadmap */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Understand how sorting algorithms actually work — one comparison and swap at a time.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
              <a
                id="cta-start-visualizing"
                href="#visualizer-workspace"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Start Visualizing</span>
                <ArrowDown className="h-4 w-4 animate-bounce" />
              </a>

              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/80 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary hover:border-cyan-500/40 transition-all active:scale-98"
              >
                <Table className="h-4 w-4 text-cyan-400" />
                <span>Compare All 5 Algorithms</span>
              </Link>
            </div>

            {/* Hero Animation Looping Sort Preview */}
            <div className="mt-12 w-full">
              <HeroAnimation />
            </div>

            {/* Feature Highlights Pills */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
                <Layers className="h-5 w-5 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Real-Time Step Engine</h4>
                  <p className="text-[11px] text-muted-foreground">True operational capture, 0% faked animations</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
                <Code2 className="h-5 w-5 text-blue-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Synced C++ Code</h4>
                  <p className="text-[11px] text-muted-foreground">Line-by-line highlight tracking each operation</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Rigorous Complexity Cards</h4>
                  <p className="text-[11px] text-muted-foreground">Time, Space, Stability & In-Place metrics</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visualizer Workspace Section */}
        <section id="visualizer-workspace" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block" />
                  Interactive Visualizer Workspace
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Adjust playback speed, step forward, test custom arrays, and follow C++ execution line-by-line.
                </p>
              </div>

              <Link
                href="/compare"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View Full Comparison Matrix</span>
                <span>→</span>
              </Link>
            </div>

            <SortingVisualizer />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Sorting Algorithm Visualizer. Built with Next.js 15, React, Tailwind & Framer Motion.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="hover:text-foreground">Visualizer</Link>
            <span>•</span>
            <Link href="/compare" className="text-cyan-400 hover:text-cyan-300 font-medium">Comparison Matrix</Link>
            <span>•</span>
            <span>All 5 Algorithms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
