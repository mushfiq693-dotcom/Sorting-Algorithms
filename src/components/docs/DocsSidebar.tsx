"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_LEVELS, DOCS_ARTICLES, DocsArticle } from "@/data/docs";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Search,
  Layers,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface DocsSidebarProps {
  onLinkClick?: () => void;
}

export function DocsSidebar({ onLinkClick }: DocsSidebarProps) {
  const pathname = usePathname();

  // Collapsible state per level (default all expanded)
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);

  // Load reading completion from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sortviz_docs_completed");
      if (saved) setCompletedArticles(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleLevel = (lvl: number) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [lvl]: !prev[lvl],
    }));
  };

  const toggleArticleCompleted = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setCompletedArticles((prev) => {
      const updated = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem("sortviz_docs_completed", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const filteredArticles = searchQuery.trim()
    ? DOCS_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const progressPercent = Math.round(
    (completedArticles.length / DOCS_ARTICLES.length) * 100
  );

  return (
    <aside className="w-full h-full flex flex-col bg-card border-r border-border select-none">
      {/* Sidebar Header & Search */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <Link
            href="/docs"
            onClick={onLinkClick}
            className="flex items-center gap-2 group"
          >
            <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight group-hover:text-cyan-500 transition-colors">
              Zero → Advanced Docs
            </span>
          </Link>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-secondary text-cyan-600 dark:text-cyan-400 border border-border">
            {DOCS_ARTICLES.length} Lessons
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="w-full rounded-xl bg-secondary/60 border border-border pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Progress Mini Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Course Progress</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredArticles ? (
          /* Search Results */
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2">
              Search Results ({filteredArticles.length})
            </span>
            {filteredArticles.map((article) => {
              const href = `/docs/${article.slug}`;
              const isActive = pathname === href;
              const isCompleted = completedArticles.includes(article.slug);

              return (
                <Link
                  key={article.slug}
                  href={href}
                  onClick={onLinkClick}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{article.title}</span>
                  {isCompleted && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-2" />
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          /* Structured Level Hierarchy */
          DOCS_LEVELS.map((level) => {
            const isExpanded = expandedLevels[level.level] ?? true;

            return (
              <div key={level.level} className="space-y-1">
                {/* Level Title Toggle */}
                <button
                  onClick={() => toggleLevel(level.level)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-left text-xs font-bold text-foreground/90 hover:text-cyan-400 transition-colors"
                >
                  <span className="font-mono text-[11px] tracking-wide text-cyan-400 uppercase">
                    {level.title}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>

                {/* Level Articles */}
                {isExpanded && (
                  <div className="space-y-0.5 pl-2 border-l border-border/50 ml-2">
                    {level.articles.map((article) => {
                      const href = `/docs/${article.slug}`;
                      const isActive = pathname === href;
                      const isCompleted = completedArticles.includes(article.slug);

                      return (
                        <Link
                          key={article.slug}
                          href={href}
                          onClick={onLinkClick}
                          className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all group ${
                            isActive
                              ? "bg-cyan-500/20 text-cyan-200 font-bold shadow-sm shadow-cyan-500/10"
                              : "text-muted-foreground hover:bg-card hover:text-foreground"
                          }`}
                        >
                          <span className="truncate pr-2">{article.title}</span>

                          <button
                            onClick={(e) => toggleArticleCompleted(article.slug, e)}
                            title={isCompleted ? "Mark unread" : "Mark as read"}
                            className="shrink-0 text-muted-foreground hover:text-emerald-400 transition-colors"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground" />
                            )}
                          </button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer Link to Visualizer */}
      <div className="p-3 border-t border-border/50 flex items-center justify-between text-xs">
        <Link
          href="/learn"
          onClick={onLinkClick}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-cyan-400 transition-colors font-semibold"
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Learning Path</span>
        </Link>
        <Link
          href="/visualizer"
          onClick={onLinkClick}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-cyan-400 transition-colors font-semibold"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Visualizer</span>
        </Link>
      </div>
    </aside>
  );
}
