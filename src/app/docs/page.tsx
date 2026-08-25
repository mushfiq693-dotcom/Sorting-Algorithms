"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DOCS_LEVELS, DOCS_ARTICLES } from "@/data/docs";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Layers,
  Zap,
  Clock,
  Compass,
} from "lucide-react";

export default function DocsIndexPage() {
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sortviz_docs_completed");
      if (saved) setCompletedArticles(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const progressPercent = Math.round(
    (completedArticles.length / DOCS_ARTICLES.length) * 100
  );

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-10 animate-in fade-in">
      {/* Header Banner */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Zero to Advanced DSA Curriculum</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Complete DSA Documentation & Theory Course
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          A structured 7-level masterclass exploring formal definitions, asymptotic Big-O time & space complexity, pure C++ algorithmic implementations, and targeted Bengali explanations for complex concepts.
        </p>

        {/* Global Progress Card */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-foreground/90 flex items-center gap-2 font-semibold">
              <Zap className="h-4 w-4 text-cyan-400" /> Course Progress
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {completedArticles.length} of {DOCS_ARTICLES.length} Lessons Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/20"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Levels Curriculum Cards */}
      <div className="space-y-6">
        {DOCS_LEVELS.map((level) => {
          const completedInLevel = level.articles.filter((a) =>
            completedArticles.includes(a.slug)
          ).length;

          return (
            <div
              key={level.level}
              className="rounded-2xl border border-border/70 bg-card/40 p-6 backdrop-blur-md shadow-xl hover:border-cyan-500/40 transition-all space-y-4 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    Level 0{level.level}
                  </span>
                  <h2 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {level.title}
                  </h2>
                </div>

                <span className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-lg">
                  {completedInLevel} / {level.articles.length} Completed
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {level.description}
              </p>

              {/* Lesson links grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {level.articles.map((article) => {
                  const isDone = completedArticles.includes(article.slug);

                  return (
                    <Link
                      key={article.slug}
                      href={`/docs/${article.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary hover:border-cyan-500/40 transition-all group/item text-left"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-cyan-400/40 group-hover/item:bg-cyan-400 shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-foreground/90 group-hover/item:text-white truncate">
                          {article.title}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-muted-foreground shrink-0 pl-2">
                        {article.estimatedReadTime}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
