"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, BookOpen, Check } from "lucide-react";

import { FormattedMarkdown } from "@/components/docs/FormattedMarkdown";

interface BanglaNoteProps {
  topic: string;
  banglaText: string;
  defaultExpanded?: boolean;
}

/**
 * BanglaNote Component
 * Renders a collapsible Bengali explanation card for complex DSA concepts.
 * 
 * NOTE FOR USER REVIEW:
 * All Bengali texts are drafted as pedagogical teaching notes.
 * Marked as [REVIEW DRAFT] in data files for user review.
 */
export function BanglaNote({ topic, banglaText, defaultExpanded = false }: BanglaNoteProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div className="my-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-200 hover:border-emerald-500/50">
      {/* Header Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors bg-emerald-500/10 hover:bg-emerald-500/15 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <span className="text-sm">🇧🇩</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                বাংলায় বুঝি
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold">
                {topic}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isOpen ? "ক্লিক করে বন্ধ করুন" : "ক্লিক করে বাংলায় সহজ ব্যাখ্যা পড়ুন"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hidden sm:inline">
            {isOpen ? "লুকান" : "দেখুন"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
        </div>
      </button>

      {/* Expandable Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 sm:p-6 border-t border-emerald-500/20 text-sm text-foreground leading-relaxed font-sans space-y-3 select-text">
              <FormattedMarkdown content={banglaText.trim()} />

              <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400/80 font-mono">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> সহজ বাংলা টিউটোরিয়াল নোট
                </span>
                <span className="italic text-[10px] text-muted-foreground">
                  (Draft for review)
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
