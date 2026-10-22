"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { AlgorithmId } from "@/types/sorting";
import { ALGORITHM_PROBLEMS, PracticeProblem } from "@/data/problemSolving";
import {
  ExternalLink,
  CheckCircle2,
  Circle,
  Filter,
  Sparkles,
  Award,
  Search,
  X,
  Code2,
  Flame,
  Check,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";

interface ProblemSolvingProps {
  algorithmId: AlgorithmId;
}

const STORAGE_KEY = "sortviz_solved_problems";

/* ============================================================================
 * OFFICIAL SVG LOGOS FOR ONLINE JUDGE PLATFORMS
 * ============================================================================ */

export function LeetCodeLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Grey chevron */}
      <path
        d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.649 1.837-.649s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.216 5.216 0 0 0-3.85-1.455c-1.42 0-2.84.545-3.85 1.558L3.998 12.49c-2.128 2.128-2.128 5.572 0 7.7 1.01 1.013 2.43 1.558 3.85 1.558 1.42 0 2.84-.545 3.85-1.558l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.553-1.9-.038l-.266.275z"
        fill="#94A3B8"
      />
      <path
        d="M8.778 12.49c.535.536 1.386.554 1.901.039.514-.515.496-1.366-.039-1.901l-2.609-2.636c-.515-.514-1.366-.496-1.901.039s-.554 1.386-.039 1.901l2.687 2.557z"
        fill="#94A3B8"
      />
      {/* Signature Golden Hook */}
      <path
        d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.164V4.5a1.38 1.38 0 0 0-1.38-1.38H7.8a1.38 1.38 0 0 0-1.38 1.38v.023L5.4 5.54a1.38 1.38 0 1 0 1.952 1.952l.53-.53V4.5h3.693v.038c0 .368.146.72.406.98l4.417 4.417a1.38 1.38 0 0 0 1.952-1.952L14.444.438A1.374 1.374 0 0 0 13.483 0z"
        fill="#FFA116"
      />
    </svg>
  );
}

export function CodeforcesLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 3 Iconic Multi-Color Podium Bars */}
      <path
        d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21 1.5 1.5 0 0 1 3 19.5V9A1.5 1.5 0 0 1 4.5 7.5z"
        fill="#FFD800"
      />
      <path
        d="M12 1.5A1.5 1.5 0 0 1 13.5 3v16.5a1.5 1.5 0 0 1-3 0V3A1.5 1.5 0 0 1 12 1.5z"
        fill="#2196F3"
      />
      <path
        d="M19.5 12a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6a1.5 1.5 0 0 1 1.5-1.5z"
        fill="#EF4444"
      />
    </svg>
  );
}

export function AtCoderLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="6" fill="#182234" />
      <path
        d="M12 4L5 18.5H8.3L9.8 15.2H14.2L15.7 18.5H19L12 4ZM12 8.8L13.5 12.2H10.5L12 8.8Z"
        fill="#00D2FF"
      />
    </svg>
  );
}

export function PlatformLogo({
  platform,
  className = "w-4 h-4",
}: {
  platform: PracticeProblem["platform"] | string;
  className?: string;
}) {
  switch (platform.toLowerCase()) {
    case "leetcode":
      return <LeetCodeLogo className={className} />;
    case "codeforces":
      return <CodeforcesLogo className={className} />;
    case "atcoder":
      return <AtCoderLogo className={className} />;
    default:
      return <Code2 className={className} />;
  }
}

/* ============================================================================
 * MAIN COMPONENT: PROBLEM SOLVING ARENA
 * ============================================================================ */

export function ProblemSolving({ algorithmId }: ProblemSolvingProps) {
  const problems = ALGORITHM_PROBLEMS[algorithmId] || [];
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  // Load solved problems from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSolvedIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSolved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSolvedIds((prev) => {
      const isCurrentlySolved = prev.includes(id);
      const updated = isCurrentlySolved
        ? prev.filter((p) => p !== id)
        : [...prev, id];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      // Celebratory micro-burst when marking as solved
      if (!isCurrentlySolved) {
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.75 },
            colors: ["#10B981", "#34D399", "#6EE7B7", "#FFA116", "#38BDF8"],
          });
        } catch {
          // ignore
        }
      }

      return updated;
    });
  };

  // Filtered problem pool
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const platformMatch =
        selectedPlatform === "all" ||
        p.platform.toLowerCase() === selectedPlatform.toLowerCase();
      const difficultyMatch =
        selectedDifficulty === "all" ||
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const queryMatch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.problemCode && p.problemCode.toLowerCase().includes(query)) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query));

      return platformMatch && difficultyMatch && queryMatch;
    });
  }, [problems, selectedPlatform, selectedDifficulty, searchQuery]);

  // Overall Statistics
  const totalCount = problems.length;
  const solvedCount = problems.filter((p) => solvedIds.includes(p.id)).length;
  const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Platform Counts
  const platformCounts = useMemo(() => {
    return {
      leetcode: problems.filter((p) => p.platform.toLowerCase() === "leetcode").length,
      codeforces: problems.filter((p) => p.platform.toLowerCase() === "codeforces").length,
      atcoder: problems.filter((p) => p.platform.toLowerCase() === "atcoder").length,
    };
  }, [problems]);

  // Difficulty Counts
  const difficultyCounts = useMemo(() => {
    return {
      easy: problems.filter((p) => p.difficulty === "Easy").length,
      medium: problems.filter((p) => p.difficulty === "Medium").length,
      hard: problems.filter((p) => p.difficulty === "Hard").length,
    };
  }, [problems]);

  // Platform Visual Configs
  const getPlatformMeta = (platform: PracticeProblem["platform"]) => {
    switch (platform) {
      case "LeetCode":
        return {
          name: "LeetCode",
          badgeBorder: "border-amber-500/30",
          badgeBg: "bg-amber-500/10",
          badgeText: "text-amber-400",
          hoverBorder: "group-hover:border-amber-500/40",
          cardGlow: "hover:shadow-[0_10px_35px_rgba(245,158,11,0.12)]",
          topLineGlow: "from-amber-500/80 via-orange-500/50 to-transparent",
          buttonBg:
            "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 hover:from-amber-500 hover:to-orange-500 text-amber-300 hover:text-slate-950 border-amber-500/40 hover:border-amber-400 shadow-sm hover:shadow-amber-500/30",
        };
      case "Codeforces":
        return {
          name: "Codeforces",
          badgeBorder: "border-blue-500/30",
          badgeBg: "bg-blue-500/10",
          badgeText: "text-blue-400",
          hoverBorder: "group-hover:border-blue-500/40",
          cardGlow: "hover:shadow-[0_10px_35px_rgba(59,130,246,0.12)]",
          topLineGlow: "from-blue-500/80 via-indigo-500/50 to-transparent",
          buttonBg:
            "bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-500/5 hover:from-blue-500 hover:to-indigo-500 text-blue-300 hover:text-slate-950 border-blue-500/40 hover:border-blue-400 shadow-sm hover:shadow-blue-500/30",
        };
      case "AtCoder":
        return {
          name: "AtCoder",
          badgeBorder: "border-cyan-500/30",
          badgeBg: "bg-cyan-500/10",
          badgeText: "text-cyan-400",
          hoverBorder: "group-hover:border-cyan-500/40",
          cardGlow: "hover:shadow-[0_10px_35px_rgba(6,182,212,0.12)]",
          topLineGlow: "from-cyan-500/80 via-teal-500/50 to-transparent",
          buttonBg:
            "bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-cyan-500/5 hover:from-cyan-500 hover:to-teal-500 text-cyan-300 hover:text-slate-950 border-cyan-500/40 hover:border-cyan-400 shadow-sm hover:shadow-cyan-500/30",
        };
      default:
        return {
          name: platform,
          badgeBorder: "border-primary/30",
          badgeBg: "bg-primary/10",
          badgeText: "text-primary",
          hoverBorder: "group-hover:border-primary/40",
          cardGlow: "hover:shadow-md",
          topLineGlow: "from-primary/80 via-primary/40 to-transparent",
          buttonBg:
            "bg-secondary hover:bg-primary hover:text-primary-foreground border-border",
        };
    }
  };

  // Difficulty Badges
  const getDifficultyPill = (difficulty: PracticeProblem["difficulty"]) => {
    switch (difficulty) {
      case "Easy":
        return {
          wrap: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
          dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
        };
      case "Medium":
        return {
          wrap: "border-amber-500/30 bg-amber-500/10 text-amber-400",
          dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
        };
      case "Hard":
        return {
          wrap: "border-rose-500/30 bg-rose-500/10 text-rose-400",
          dot: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
        };
      default:
        return {
          wrap: "border-slate-500/30 bg-slate-500/10 text-slate-400",
          dot: "bg-slate-400",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* ====================================================================
       * HERO BANNER: BRANDED PLATFORM ARENA & PROGRESS RADIAL
       * ==================================================================== */}
      <div className="relative rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-secondary/30 p-5 sm:p-7 shadow-xl overflow-hidden">
        {/* Subtle decorative glow orb */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 text-xs font-mono font-bold tracking-wide">
              <Flame className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Competitive Programming Arena</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80">{totalCount} Curated Problems</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
              <span>Mastery Through Coding Challenges</span>
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Test your deep invariant understanding on industry-standard judge platforms.
              Every challenge maps directly to real-world software engineering interview patterns.
            </p>

            {/* Platform Badges with Authentic Logos */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-muted-foreground mr-1">Platforms:</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium">
                <LeetCodeLogo className="w-3.5 h-3.5" />
                <span>LeetCode</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium">
                <CodeforcesLogo className="w-3.5 h-3.5" />
                <span>Codeforces</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium">
                <AtCoderLogo className="w-3.5 h-3.5" />
                <span>AtCoder</span>
              </div>
            </div>
          </div>

          {/* Solved Progress Metric Showcase */}
          <div className="shrink-0 flex items-center gap-4 bg-secondary/80 border border-border/80 p-4 rounded-2xl backdrop-blur-md shadow-inner">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-muted/30 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Dynamic Progress Fill */}
                <path
                  className="text-cyan-400 stroke-current transition-all duration-700 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono font-bold text-foreground">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground font-semibold flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-cyan-400" />
                <span>Topic Solved</span>
              </div>
              <div className="text-lg font-black text-foreground font-mono">
                {solvedCount}{" "}
                <span className="text-xs font-normal text-muted-foreground">/ {totalCount} Solved</span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                {solvedCount === totalCount && totalCount > 0 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="h-3 w-3" /> All Solved! 🏆
                  </span>
                ) : (
                  <span>{totalCount - solvedCount} remaining to master</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Line Bar */}
        <div className="mt-6 w-full bg-secondary/80 h-2 rounded-full overflow-hidden border border-border/40">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ====================================================================
       * FILTER BAR: PLATFORM TABS, DIFFICULTY PILLS, SEARCH
       * ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card/90 backdrop-blur-md shadow-xs">
        {/* Platform Selection with Brand Logos */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Platform:
          </span>

          <button
            onClick={() => setSelectedPlatform("all")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPlatform === "all"
                ? "bg-foreground text-background shadow-sm"
                : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All</span>
            <span className="text-[10px] opacity-75 font-mono font-normal">({totalCount})</span>
          </button>

          {platformCounts.leetcode > 0 && (
            <button
              onClick={() => setSelectedPlatform("leetcode")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPlatform === "leetcode"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              <LeetCodeLogo className="w-3.5 h-3.5" />
              <span>LeetCode</span>
              <span className="text-[10px] opacity-75 font-mono font-normal">
                ({platformCounts.leetcode})
              </span>
            </button>
          )}

          {platformCounts.codeforces > 0 && (
            <button
              onClick={() => setSelectedPlatform("codeforces")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPlatform === "codeforces"
                  ? "bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              <CodeforcesLogo className="w-3.5 h-3.5" />
              <span>Codeforces</span>
              <span className="text-[10px] opacity-75 font-mono font-normal">
                ({platformCounts.codeforces})
              </span>
            </button>
          )}

          {platformCounts.atcoder > 0 && (
            <button
              onClick={() => setSelectedPlatform("atcoder")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPlatform === "atcoder"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              <AtCoderLogo className="w-3.5 h-3.5" />
              <span>AtCoder</span>
              <span className="text-[10px] opacity-75 font-mono font-normal">
                ({platformCounts.atcoder})
              </span>
            </button>
          )}
        </div>

        {/* Difficulty Filter & Search Box */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Pills */}
          <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border/80">
            {[
              { id: "all", label: "All", count: totalCount },
              { id: "Easy", label: "Easy", count: difficultyCounts.easy },
              { id: "Medium", label: "Med", count: difficultyCounts.medium },
              { id: "Hard", label: "Hard", count: difficultyCounts.hard },
            ]
              .filter((item) => item.id === "all" || item.count > 0)
              .map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    selectedDifficulty === d.id
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {d.label}
                  <span className="text-[10px] opacity-70 ml-1">({d.count})</span>
                </button>
              ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem..."
              className="w-36 sm:w-44 pl-8 pr-7 py-1 text-xs rounded-xl bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
       * PROBLEM CARDS GRID (Sleek, High-End & Concept-Free)
       * ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProblems.map((problem) => {
          const isSolved = solvedIds.includes(problem.id);
          const platformMeta = getPlatformMeta(problem.platform);
          const diffPill = getDifficultyPill(problem.difficulty);

          return (
            <div
              key={problem.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
                isSolved
                  ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 via-card to-card shadow-sm shadow-emerald-500/10"
                  : `border-border/80 bg-card hover:border-border ${platformMeta.hoverBorder} ${platformMeta.cardGlow}`
              }`}
            >
              {/* Subtle top edge glow gradient accent */}
              <div
                className={`absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${platformMeta.topLineGlow}`}
              />

              <div>
                {/* Card Header: Platform Badge + Difficulty Indicator + Mark Solved Toggle */}
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Platform Badge with Authentic SVG Logo */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${platformMeta.badgeBorder} ${platformMeta.badgeBg} ${platformMeta.badgeText}`}
                    >
                      <PlatformLogo platform={problem.platform} className="w-3.5 h-3.5" />
                      <span>{problem.platform}</span>
                      {problem.problemCode && (
                        <span className="opacity-80 font-normal">#{problem.problemCode}</span>
                      )}
                    </span>

                    {/* Difficulty Pill with Live Glowing Status Dot */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold border ${diffPill.wrap}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${diffPill.dot}`} />
                      <span>{problem.difficulty}</span>
                    </span>
                  </div>

                  {/* Mark as Solved Button with Celebratory Toggle */}
                  <button
                    onClick={(e) => toggleSolved(problem.id, e)}
                    title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                      isSolved
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-sm shadow-emerald-500/20"
                        : "bg-secondary/80 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {isSolved ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="text-[11px] font-mono">Solved</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-[11px] font-mono">Mark Solved</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Problem Title with Hover Interaction */}
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <h4 className="text-base font-bold text-foreground group-hover/link:text-cyan-400 transition-colors flex items-center gap-1.5 leading-snug">
                    <span>{problem.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-cyan-400 transition-colors inline shrink-0" />
                  </h4>
                </a>

                {/* Problem Description (Clear, uncluttered without concept box) */}
                <p className="text-xs text-muted-foreground/90 mt-2.5 leading-relaxed font-sans">
                  {problem.description}
                </p>
              </div>

              {/* Card Footer: Tags Cloud & Branded CTA Button */}
              <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                {/* Topic / Invariant Tags */}
                <div className="flex flex-wrap items-center gap-1">
                  {problem.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-secondary/80 text-[10px] font-mono font-medium text-muted-foreground border border-border/60 hover:text-foreground hover:border-border transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Branded "Solve on [Platform]" CTA Button */}
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${platformMeta.buttonBg}`}
                >
                  <PlatformLogo platform={problem.platform} className="w-3.5 h-3.5" />
                  <span>Solve on {problem.platform}</span>
                  <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================================================
       * EMPTY STATE
       * ==================================================================== */}
      {filteredProblems.length === 0 && (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-border/80 bg-card/30 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground border border-border">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground font-mono">No matching problems found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Try adjusting your platform or difficulty filters, or clearing your search query.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedPlatform("all");
              setSelectedDifficulty("all");
              setSearchQuery("");
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground border border-border cursor-pointer transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
