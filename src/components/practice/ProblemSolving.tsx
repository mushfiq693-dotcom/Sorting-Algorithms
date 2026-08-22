"use client";

import React, { useState, useEffect } from "react";
import { AlgorithmId } from "@/types/sorting";
import { ALGORITHM_PROBLEMS, PracticeProblem } from "@/data/problemSolving";
import {
  ExternalLink,
  CheckCircle2,
  Circle,
  Filter,
  Sparkles,
  Award,
  Globe,
  Code2,
  Compass,
  Layers,
  BookOpen,
} from "lucide-react";

interface ProblemSolvingProps {
  algorithmId: AlgorithmId;
}

const STORAGE_KEY = "sortviz_solved_problems";

export function ProblemSolving({ algorithmId }: ProblemSolvingProps) {
  const problems = ALGORITHM_PROBLEMS[algorithmId] || [];
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
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
      const updated = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const filteredProblems = problems.filter((p) => {
    const platformMatch =
      selectedPlatform === "all" ||
      p.platform.toLowerCase() === selectedPlatform.toLowerCase();
    const difficultyMatch =
      selectedDifficulty === "all" ||
      p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return platformMatch && difficultyMatch;
  });

  const solvedCount = problems.filter((p) => solvedIds.includes(p.id)).length;
  const totalCount = problems.length;
  const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const getPlatformStyles = (platform: PracticeProblem["platform"]) => {
    switch (platform) {
      case "LeetCode":
        return {
          badge: "border-amber-500/30 bg-amber-500/10 text-amber-400",
          button: "hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-300",
          iconColor: "text-amber-400",
        };
      case "Codeforces":
        return {
          badge: "border-blue-500/30 bg-blue-500/10 text-blue-400",
          button: "hover:bg-blue-500/20 hover:border-blue-500/40 text-blue-300",
          iconColor: "text-blue-400",
        };
      case "AtCoder":
        return {
          badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
          button: "hover:bg-emerald-500/20 hover:border-emerald-500/40 text-emerald-300",
          iconColor: "text-emerald-400",
        };
      default:
        return {
          badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
          button: "hover:bg-cyan-500/20 hover:border-cyan-500/40 text-cyan-300",
          iconColor: "text-cyan-400",
        };
    }
  };

  const getDifficultyStyles = (difficulty: PracticeProblem["difficulty"]) => {
    switch (difficulty) {
      case "Easy":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "Medium":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400";
      case "Hard":
        return "border-rose-500/30 bg-rose-500/10 text-rose-400";
      default:
        return "border-slate-500/30 bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Summary Card */}
      <div className="rounded-2xl border border-cyan-500/20 bg-card p-5 sm:p-6 shadow-sm dark:shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-semibold mb-2">
              <Compass className="h-3.5 w-3.5" />
              <span>Competitive Programming & Problem Solving</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Curated Online Judge Challenges
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Practice real-world algorithm problems on LeetCode, Codeforces, and AtCoder that require understanding this algorithm&apos;s invariant, sorting principles, or divide-and-conquer logic.
            </p>
          </div>

          {/* Solved Progress Pill */}
          <div className="shrink-0 flex items-center gap-3 bg-secondary/80 border border-border p-3 rounded-xl backdrop-blur-md">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground">Problems Solved</div>
              <div className="text-sm font-bold text-foreground font-mono">
                {solvedCount} / {totalCount}{" "}
                <span className="text-xs font-normal text-cyan-600 dark:text-cyan-300">({progressPercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-secondary h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Platform & Difficulty Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card backdrop-blur-md">
        {/* Platform Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
            <Globe className="h-3 w-3" /> Platform:
          </span>
          {[
            { id: "all", label: "All Platforms" },
            { id: "leetcode", label: "LeetCode" },
            { id: "codeforces", label: "Codeforces" },
            { id: "atcoder", label: "AtCoder" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPlatform(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedPlatform === item.id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Difficulty:
          </span>
          {["all", "Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedDifficulty === d
                  ? "bg-foreground text-background font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {d === "all" ? "All" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProblems.map((problem) => {
          const isSolved = solvedIds.includes(problem.id);
          const platformStyles = getPlatformStyles(problem.platform);
          const diffStyle = getDifficultyStyles(problem.difficulty);

          return (
            <div
              key={problem.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all duration-200 ${
                isSolved
                  ? "border-emerald-500/30 bg-card shadow-sm"
                  : "border-border bg-card hover:border-cyan-500/40 shadow-sm"
              }`}
            >
              <div>
                {/* Card Top: Badges & Solved Checkbox */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Platform Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${platformStyles.badge}`}
                    >
                      <span>{problem.platform}</span>
                      {problem.problemCode && (
                        <span className="opacity-70">#{problem.problemCode}</span>
                      )}
                    </span>

                    {/* Difficulty Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${diffStyle}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Mark as Solved Button */}
                  <button
                    onClick={(e) => toggleSolved(problem.id, e)}
                    title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      isSolved
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-300"
                        : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {isSolved ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[11px]">Solved</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[11px]">Mark Solved</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Problem Title */}
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group-hover:text-cyan-500 transition-colors"
                >
                  <h4 className="text-base font-bold text-foreground flex items-center gap-1.5">
                    <span>{problem.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-cyan-500 transition-colors inline shrink-0" />
                  </h4>
                </a>

                {/* Problem Description */}
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed font-sans">
                  {problem.description}
                </p>

                {/* Key Algorithmic Concept Highlight */}
                <div className="mt-3 p-2.5 rounded-xl bg-secondary/70 border border-border text-[11px] text-foreground leading-snug">
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">Concept: </span>
                  {problem.keyConcept}
                </div>
              </div>

              {/* Card Footer: Tags & Action Button */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {problem.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-secondary text-[10px] font-mono text-muted-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 bg-secondary text-foreground hover:text-cyan-500 border-border"
                >
                  <span>Solve on {problem.platform}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border/60 bg-card/20">
          <p className="text-xs text-muted-foreground font-mono">
            No problems match the selected platform and difficulty filters.
          </p>
        </div>
      )}
    </div>
  );
}
