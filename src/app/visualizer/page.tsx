"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { LockedVisualizerGate } from "@/components/landing/LockedVisualizerGate";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { AuthButton } from "@/components/auth/AuthButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AlgorithmId } from "@/types/sorting";
import { ALL_TOPICS, ALGORITHMS } from "@/data/algorithms";
import { TopicCategoryHub, CategoryKey } from "@/components/explore/TopicCategoryHub";
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

const getCategoryMetaForAlgo = (algoId: AlgorithmId): { key: CategoryKey; label: string } => {
  const cat = (ALGORITHMS[algoId]?.category as CategoryKey) || "sorting";
  switch (cat) {
    case "data-structure":
      return { key: "data-structure", label: "Data Structures" };
    case "tree":
      return { key: "tree", label: "Trees" };
    case "searching":
      return { key: "searching", label: "Searching" };
    case "complexity":
      return { key: "complexity", label: "Core Concepts" };
    case "sorting":
    default:
      return { key: "sorting", label: "Sorting" };
  }
};

function VisualizerWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const algoParam = searchParams.get("algo") as AlgorithmId | null;
  const categoryParam = searchParams.get("category") as CategoryKey | null;

  // Studio mode is only active when a specific topic was selected to visualize
  const isStudioMode = Boolean(algoParam && ALL_TOPICS.includes(algoParam));
  const selectedAlgorithm: AlgorithmId = isStudioMode && algoParam ? algoParam : "bubble";
  const activeMeta = ALGORITHMS[selectedAlgorithm] || ALGORITHMS.bubble;
  const categoryMeta = getCategoryMetaForAlgo(selectedAlgorithm);

  const handleSelectAlgorithmInStudio = (algoId: AlgorithmId) => {
    const url = new URL(window.location.href);
    url.searchParams.set("algo", algoId);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-[#C9A962]/35 selection:text-[#1C1714] transition-colors duration-200 font-body">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group">
              <span className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                AlgoHub
              </span>
              <div className="shrink-0">
                <AmbientSortLogo />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeToggle />
            <NotificationBell />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!isStudioMode ? (
          /* ========================================================
             1. EXPLORE VISUALIZER (CATEGORIES OR TOPIC INTERFACE)
             When categoryParam is null: shows ONLY the 4 Category Cards!
             When categoryParam is clicked (e.g. Sorting): shows ONLY that
             category's topics with a clean back button!
             ======================================================== */
          <div className="py-2">
            {!categoryParam && (
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Layers className="h-6 w-6 text-primary" />
                    <span>Explore Algorithms & Data Structures</span>
                  </h1>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <Link
                    href="/learn"
                    className="btn-brass inline-flex items-center gap-2 rounded px-4 py-2 text-xs font-display uppercase tracking-wider font-bold shadow-brass active:scale-95 transition-all"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Start Learning</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            <TopicCategoryHub
              mode="visualizer"
              selectedCategory={categoryParam}
              onSelectCategory={(cat) => {
                if (cat) {
                  router.push(`/visualizer?category=${cat}`);
                } else {
                  router.push(`/visualizer`);
                }
              }}
              showSubtitle={!categoryParam}
            />
          </div>
        ) : (
          /* ========================================================
             2. SPECIFIC ALGORITHM VISUALIZER STUDIO
             Opened only when launching a specific algorithm.
             ======================================================== */
          <div>
            {/* Studio Header Bar */}
            <div className="mb-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 flex-wrap">
                  <Layers className="h-5 w-5 text-primary" />
                  <span>Now Visualizing:</span>
                  <span className="text-primary font-extrabold">{activeMeta.name}</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  {activeMeta.shortDescription}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <Link
                  href={`/visualizer?category=${categoryMeta.key}`}
                  className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-border/80 hover:border-primary/40 bg-secondary/80 hover:bg-secondary text-foreground hover:text-primary active:scale-95 transition-all shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Back to {categoryMeta.label}</span>
                </Link>

                <Link
                  href={`/algorithms/${selectedAlgorithm}`}
                  className="btn-brass inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-brass active:scale-95 transition-all"
                >
                  <span>In-Depth Lesson</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Visualizer Gate & Engine */}
            <div className="mb-14">
              <LockedVisualizerGate
                selectedAlgorithm={selectedAlgorithm}
                onSelectAlgorithm={handleSelectAlgorithmInStudio}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-10 text-xs text-muted-foreground mt-auto font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-heading text-base font-bold text-foreground">AlgoHub</span>
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
            <Link href="/compare" className="hover:text-primary transition-colors text-foreground">Compare</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function VisualizerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-mono text-xs">
          Loading visualizer studio...
        </div>
      }
    >
      <VisualizerWorkspace />
    </Suspense>
  );
}
