import React from "react";
import Link from "next/link";
import { COMPARISON_TABLE_DATA } from "@/data/comparison";
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
} from "lucide-react";

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070b12] text-foreground selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  SortViz
                </span>
                <span className="ml-2 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Comparison Matrix
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary hover:text-cyan-400 transition-all active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Visualizer
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-4 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Comprehensive Comparison</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Sorting Algorithm Comparison Matrix
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Side-by-side complexity analysis, algorithmic properties, and practical engineering guidance to help you choose the right algorithm for every scenario.
          </p>
        </div>

        {/* Side-by-Side Matrix Table */}
        <div className="rounded-2xl border border-border/60 bg-card/60 shadow-2xl backdrop-blur-md overflow-hidden mb-12">
          <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between bg-card/80">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Full Algorithmic Comparison</span>
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

        {/* Practical Guidance Section: "Which Algorithm Should I Use?" */}
        <div>
          <div className="mb-6 flex items-center gap-2">
            <Compass className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              Which Algorithm Should I Use?
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 py-8 text-center text-xs text-muted-foreground mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Sorting Algorithm Visualizer. Full 5-Algorithm Comparison Matrix.</p>
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            ← Return to Interactive Visualizer
          </Link>
        </div>
      </footer>
    </div>
  );
}
