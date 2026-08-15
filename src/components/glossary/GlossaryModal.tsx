"use client";

import React, { useState } from "react";
import { GLOSSARY_TERMS, GlossaryTerm } from "@/data/learningPath";
import { BookOpen, X, Search, Sparkles } from "lucide-react";

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlossaryModal({ isOpen, onClose }: GlossaryModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Fundamentals", "Properties", "Recursion"];

  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border/80 bg-card/95 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-background/60 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 id="glossary-title" className="text-base font-bold text-foreground">
                DSA Terminology Glossary
              </h2>
              <p className="text-xs text-muted-foreground">
                Plain-English, non-circular definitions for core sorting concepts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close glossary modal"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-border/40 bg-card/40 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search concepts (e.g. pivot, in-place, stability)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/70 bg-background/80 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Terms List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              No matching terms found for &quot;{search}&quot;.
            </div>
          ) : (
            filteredTerms.map((item) => (
              <div
                key={item.term}
                className="rounded-xl border border-border/60 bg-background/60 p-3.5 hover:border-cyan-500/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-foreground font-mono group-hover:text-cyan-300 transition-colors">
                    {item.term}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary border border-border/60 text-muted-foreground">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/90 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 bg-background/40 p-3.5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> {filteredTerms.length} terms available
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
