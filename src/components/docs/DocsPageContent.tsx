"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DocsArticle, DOCS_ARTICLES } from "@/data/docs";
import { BanglaNote } from "@/components/docs/BanglaNote";
import { Quiz } from "@/components/practice/Quiz";
import { AlgorithmDiagram } from "@/components/diagrams/AlgorithmDiagram";
import {
  Clock,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Share2,
  Check,
  Lock,
  Zap,
} from "lucide-react";

import { useProgressSync } from "@/hooks/useProgressSync";
import { FormattedMarkdown } from "@/components/docs/FormattedMarkdown";

interface DocsPageContentProps {
  article: DocsArticle;
}

export function DocsPageContent({ article }: DocsPageContentProps) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const { syncDoc } = useProgressSync();

  // Find index in global articles for next / previous links
  const currentIndex = DOCS_ARTICLES.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? DOCS_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < DOCS_ARTICLES.length - 1 ? DOCS_ARTICLES[currentIndex + 1] : null;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sortviz_docs_completed");
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsCompleted(list.includes(article.slug));
      }
    } catch {
      // ignore
    }
  }, [article.slug]);

  const toggleCompleted = () => {
    try {
      const saved = localStorage.getItem("sortviz_docs_completed");
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(article.slug)) {
        list = list.filter((s) => s !== article.slug);
        setIsCompleted(false);
      } else {
        list.push(article.slug);
        setIsCompleted(true);
        syncDoc(article.slug);
      }
      localStorage.setItem("sortviz_docs_completed", JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8 animate-in fade-in">
      {/* Top Breadcrumb & Metadata Card */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-7 backdrop-blur-xl shadow-sm dark:shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-muted-foreground">
            <Link href="/docs" className="hover:text-cyan-500 transition-colors">
              Docs
            </Link>
            <span>/</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{article.levelTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-muted-foreground text-[11px] bg-secondary/80 px-2.5 py-1 rounded-lg">
              <Clock className="h-3 w-3 text-amber-500" />
              <span>{article.estimatedReadTime} read</span>
            </span>

            <button
              onClick={handleShare}
              title="Copy page link"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="h-3 w-3 text-emerald-500" /> : <Share2 className="h-3 w-3" />}
              <span>{copiedLink ? "Copied" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {article.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
            {article.subtitle}
          </p>
        </div>

        {/* Read Status Toggle */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <button
            onClick={toggleCompleted}
            className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isCompleted
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${isCompleted ? "text-emerald-500" : "text-muted-foreground"}`} />
            <span>{isCompleted ? "Completed Lesson" : "Mark as Completed"}</span>
          </button>

          {article.visualizerLink && (
            <Link
              href={article.visualizerLink.path}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{article.visualizerLink.label} →</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Formatted Article Content */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 backdrop-blur-xl shadow-sm dark:shadow-xl">
        <FormattedMarkdown content={article.content} />
      </div>

          {/* Signature Static Diagram for Algorithm Lessons */}
          {(() => {
            const algoMap: Record<string, "bubble" | "selection" | "insertion" | "merge" | "quick"> = {
              "bubble-sort": "bubble",
              "selection-sort": "selection",
              "insertion-sort": "insertion",
              "merge-sort": "merge",
              "quick-sort": "quick",
            };
            const algoId = algoMap[article.slug];
            if (algoId) {
              return (
                <div className="my-6">
                  <AlgorithmDiagram algorithmId={algoId} />
                </div>
              );
            }
            return null;
          })()}

          {/* Collapsible Bangla Explanation Box */}
          {article.banglaNote && (
            <BanglaNote
              topic={article.banglaNote.topic}
              banglaText={article.banglaNote.banglaText}
            />
          )}

          {/* Embedded Quiz if present */}
          {article.quizTopicId && (
            <div className="pt-6">
              <Quiz topicId={article.quizTopicId} />
            </div>
          )}

      {/* Next / Previous Article Navigation Buttons */}
      <div className="pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevArticle ? (
          <Link
            href={`/docs/${prevArticle.slug}`}
            className="flex flex-col p-4 rounded-2xl border border-border bg-card hover:bg-secondary/40 hover:border-cyan-500/40 transition-all text-left group"
          >
            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mb-1">
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Previous Lesson
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
              {prevArticle.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextArticle ? (
          <Link
            href={`/docs/${nextArticle.slug}`}
            className="flex flex-col p-4 rounded-2xl border border-border bg-card hover:bg-secondary/40 hover:border-cyan-500/40 transition-all text-right group items-end"
          >
            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mb-1">
              Next Lesson <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
              {nextArticle.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
