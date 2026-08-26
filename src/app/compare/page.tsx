"use client";

import React, { useState } from "react";
import Link from "next/link";
import { COMPARISON_TABLE_DATA, DATA_STRUCTURE_COMPARISON_DATA } from "@/data/comparison";
import {
  Table,
  Layers,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  HardDrive,
  Compass,
  BookOpen,
  GraduationCap,
  BarChart3,
  Database,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { AlgoHubLogo } from "@/components/brand/AlgoHubLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GrowthChart } from "@/components/complexity/GrowthChart";
import { ComplexityCalculator } from "@/components/complexity/ComplexityCalculator";

export default function ComparePage() {
  const [activeTab, setActiveTab] = useState<"sorting" | "data-structures">("sorting");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200 transition-colors duration-150">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <AlgoHubLogo size={36} />
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
              <BarChart3 className="h-3.5 w-3.5" />
              <span>My Progress</span>
            </Link>

            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-500 transition-all active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
              <span>Docs & Course</span>
            </Link>

            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-500 transition-all active:scale-95"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Learning Path</span>
            </Link>

            <Link
              href="/visualizer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/80 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-500 transition-all active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Visualizer</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium mb-4 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Comprehensive Comparison</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {activeTab === "sorting" ? "Sorting Algorithm Comparison Matrix" : "Data Structures Operational Comparison"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {activeTab === "sorting"
              ? "Side-by-side complexity analysis, algorithmic properties, and practical engineering guidance to help you choose the right sorting algorithm for every scenario."
              : "Compare primary invariants, operation times (Push/Enqueue, Pop/Dequeue, Access, Search), and memory trade-offs across fundamental linear data structures."}
          </p>

          {/* Category Tabs */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab("sorting")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "sorting"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Sorting Algorithms (5)</span>
            </button>
            <button
              onClick={() => setActiveTab("data-structures")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "data-structures"
                  ? "bg-blue-500 text-white shadow-md font-bold"
                  : "border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Data Structures (4 Containers)</span>
            </button>
          </div>
        </div>

        {activeTab === "sorting" ? (
          <>
            {/* Side-by-Side Sorting Matrix Table */}
            <div className="rounded-2xl border border-border/60 bg-card/60 shadow-2xl backdrop-blur-md overflow-hidden mb-12">
              <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between bg-card/80">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span>Sorting Algorithmic Comparison</span>
                </h2>
                <span className="text-xs font-mono text-muted-foreground">
                  5 Algorithms Analyzed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono border-collapse min-w-[850px]">
                  <thead>
                    <tr className="border-b border-border/60 bg-background/50 text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-semibold text-foreground">Algorithm</th>
                      <th className="py-3.5 px-4 font-semibold text-emerald-400">Best Time</th>
                      <th className="py-3.5 px-4 font-semibold text-amber-400">Avg Time</th>
                      <th className="py-3.5 px-4 font-semibold text-rose-400">Worst Time</th>
                      <th className="py-3.5 px-4 font-semibold text-cyan-400">Space</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Stable</th>
                      <th className="py-3.5 px-4 font-semibold text-center">In-Place</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Adaptive</th>
                      <th className="py-3.5 px-4 font-semibold text-center">D & C</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                    {COMPARISON_TABLE_DATA.map((algo) => (
                      <tr
                        key={algo.id}
                        className="hover:bg-cyan-500/[0.04] transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-foreground flex flex-col">
                          <span>{algo.name}</span>
                          <span className="text-[11px] font-sans font-normal text-muted-foreground line-clamp-1 mt-0.5">
                            {algo.bestUseCase}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-emerald-400 font-semibold">{algo.bestTime}</td>
                        <td className="py-4 px-4 text-amber-400 font-semibold">{algo.avgTime}</td>
                        <td className="py-4 px-4 text-rose-400 font-semibold">{algo.worstTime}</td>
                        <td className="py-4 px-4 text-cyan-400 font-semibold">
                          {algo.space}
                          {algo.spaceNote && (
                            <span className="block text-[10px] font-sans font-normal text-muted-foreground/80 mt-0.5">
                              *Avg stack depth
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {algo.stable ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="h-4 w-4" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                              <XCircle className="h-4 w-4" /> No
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {algo.inPlace ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="h-4 w-4" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                              <XCircle className="h-4 w-4" /> No
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {algo.adaptive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <CheckCircle2 className="h-4 w-4" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-muted-foreground/60 font-medium">
                              <XCircle className="h-4 w-4" /> No
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {algo.divideAndConquer ? (
                            <span className="inline-flex items-center gap-1 text-cyan-400 font-medium">
                              <CheckCircle2 className="h-4 w-4" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-muted-foreground/60 font-medium">
                              <XCircle className="h-4 w-4" /> No
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Growth Curves & Cross-Algorithm Operation Estimator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <GrowthChart
                title="Asymptotic Divergence"
                subtitle="Comparing growth curves across O(n²), O(n log n), O(n), and O(log n)."
              />
              <ComplexityCalculator
                initialAlgorithm="bubble"
                showAllAlgorithmsToggle={true}
              />
            </div>

            {/* Practical Guidance Section: "Which Algorithm Should I Use?" */}
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Compass className="h-5 w-5 text-cyan-500" />
                <h2 className="text-xl font-bold text-foreground">
                  Which Sorting Algorithm Should I Use?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COMPARISON_TABLE_DATA.map((algo) => (
                  <div
                    key={algo.id}
                    className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md shadow-xl hover:border-cyan-500/40 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
                        <h3 className="font-bold text-base text-foreground group-hover:text-cyan-400 transition-colors">
                          {algo.name}
                        </h3>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-secondary text-cyan-400 border border-border/60">
                          {algo.avgTime}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground/90 leading-relaxed">
                        {algo.guidance}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>Best for:</span>
                      <span className="text-foreground/90 font-medium font-sans text-right line-clamp-1 ml-2">
                        {algo.bestUseCase.split(",")[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Data Structures Comparison Table */
          <div className="space-y-8">
            <div className="rounded-2xl border border-border/60 bg-card/60 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between bg-card/80">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  <span>Data Structure Operation Complexity Matrix</span>
                </h2>
                <span className="text-xs font-mono text-muted-foreground">
                  4 Fundamental Containers Analyzed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-border/60 bg-background/50 text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-semibold text-foreground">Data Structure</th>
                      <th className="py-3.5 px-4 font-semibold text-cyan-400">Primary Invariant</th>
                      <th className="py-3.5 px-4 font-semibold text-emerald-400">Insert</th>
                      <th className="py-3.5 px-4 font-semibold text-rose-400">Delete</th>
                      <th className="py-3.5 px-4 font-semibold text-blue-400">Peek / Top</th>
                      <th className="py-3.5 px-4 font-semibold text-amber-400">Random Access</th>
                      <th className="py-3.5 px-4 font-semibold text-purple-400">Search</th>
                      <th className="py-3.5 px-4 font-semibold">Space</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                    {DATA_STRUCTURE_COMPARISON_DATA.map((ds) => (
                      <tr
                        key={ds.id}
                        className="hover:bg-blue-500/[0.04] transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-foreground flex flex-col">
                          <span>{ds.name}</span>
                          <span className="text-[11px] font-sans font-normal text-muted-foreground mt-0.5">
                            {ds.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-cyan-500 dark:text-cyan-300 font-semibold">{ds.invariant}</td>
                        <td className="py-4 px-4 text-emerald-500 dark:text-emerald-300 font-semibold">{ds.insertion}</td>
                        <td className="py-4 px-4 text-rose-500 dark:text-rose-300 font-semibold">{ds.deletion}</td>
                        <td className="py-4 px-4 text-blue-500 dark:text-blue-300 font-semibold">{ds.peek}</td>
                        <td className="py-4 px-4 text-amber-500 dark:text-amber-300 font-semibold">{ds.access}</td>
                        <td className="py-4 px-4 text-purple-500 dark:text-purple-300 font-semibold">{ds.search}</td>
                        <td className="py-4 px-4 text-foreground font-semibold">{ds.space}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* In-Depth Data Structure Tradeoffs Cards */}
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold text-foreground">
                  Architectural Trade-offs & Real-World Selection
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DATA_STRUCTURE_COMPARISON_DATA.map((ds) => (
                  <div
                    key={ds.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card/70 p-5 sm:p-6 backdrop-blur-md shadow-sm hover:border-blue-500/40 transition-all space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="font-bold text-base text-foreground">
                          {ds.name}
                        </h3>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-secondary text-blue-500 border border-border">
                          {ds.invariant}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs leading-relaxed">
                        <p className="text-foreground">
                          <strong className="text-muted-foreground font-mono">Trade-offs:</strong> {ds.tradeoffs}
                        </p>
                        <p className="text-muted-foreground">
                          <strong className="text-muted-foreground font-mono">Common Use Cases:</strong> {ds.bestUseCase}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Interactive Visualizer
                      </span>
                      {ds.id === "stack" || ds.id === "queue" ? (
                        <Link
                          href={`/algorithms/${ds.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          <span>Explore {ds.name} Module</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <span className="text-[11px] font-mono text-muted-foreground/60 italic">
                          Reference Container
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 py-8 text-center text-xs text-muted-foreground mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AlgoHub. Multi-Category Algorithmic Comparison Matrix.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/docs" className="hover:text-foreground">Docs & Course</Link>
            <span>•</span>
            <Link href="/visualizer" className="hover:text-foreground">Visualizer</Link>
            <span>•</span>
            <Link href="/learn" className="hover:text-foreground">Learning Path</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
