"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  GitBranch,
  Layers,
  Code2,
  ArrowUpDown,
  Calculator,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface TopicCard {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  subtopics: string[];
  icon: React.ElementType;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  link: string;
  ctaText: string;
}

const TOPIC_HUBS: TopicCard[] = [
  {
    id: "arrays-searching",
    badge: "Linear Arrays & Search",
    badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    title: "Linear Arrays & Searching",
    description:
      "Contiguous memory addressing, element deletion/insertion, and logarithmic reduction search engines.",
    subtopics: [
      "Linear Search (Unordered & Ordered)",
      "Sentinel Search Optimization",
      "Binary Search Studio — O(log n)",
    ],
    icon: Search,
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/30",
    accentText: "text-blue-700 dark:text-blue-400",
    link: "/docs/linear-search",
    ctaText: "Read Linear & Binary Search Docs",
  },
  {
    id: "linked-lists",
    badge: "Dynamic Memory",
    badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    title: "Linked Lists & Memory Architecture",
    description:
      "Pointer manipulation, free storage pooling (AVAIL list), and textbook parallel memory simulations.",
    subtopics: [
      "Parallel Arrays (INFO & LINK indices)",
      "INSLOC Node Insertion & Deletion",
      "Pointer Dereferencing & C++ Tracing",
    ],
    icon: GitBranch,
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/30",
    accentText: "text-purple-700 dark:text-purple-400",
    link: "/docs/linked-list-fundamentals",
    ctaText: "Read Linked List Docs",
  },
  {
    id: "stacks-recursion",
    badge: "LIFO Architecture",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    title: "Stacks & Expression Parsing",
    description:
      "Call stack frames, stack overflow/underflow handling, and algorithmic expression evaluation.",
    subtopics: [
      "Stack Push & Pop Pointer Traversal",
      "Infix to Postfix Polish Notation",
      "QuickSort Partitioning Stack Simulation",
    ],
    icon: Layers,
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    accentText: "text-emerald-700 dark:text-emerald-400",
    link: "/docs/stack-data-structure",
    ctaText: "Read Stack Architecture Docs",
  },
  {
    id: "string-processing",
    badge: "Pattern Engine",
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    title: "String Processing & Operations",
    description:
      "Textbook substring slicing, exact pattern matching, index position search, and string transformations.",
    subtopics: [
      "SUBSTRING(S, K, L) Extraction",
      "INDEX(T, P) First Occurrence Finder",
      "Dynamic Concatenation & Replacement",
    ],
    icon: Code2,
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-700 dark:text-amber-400",
    link: "/docs/reading-cpp-syntax",
    ctaText: "Read C++ & String Processing Docs",
  },
  {
    id: "sorting-algorithms",
    badge: "Visual Execution",
    badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    title: "Sorting Algorithms Suite",
    description:
      "Interactive deterministic visualizers for quadratic, divide-and-conquer, and non-comparison sorting routines.",
    subtopics: [
      "Bubble, Insertion & Selection Sort",
      "Merge Sort & QuickSort Partitioning",
      "Heap Sort, Counting Sort & Radix Sort",
    ],
    icon: ArrowUpDown,
    accentBg: "bg-rose-500/10",
    accentBorder: "border-rose-500/30",
    accentText: "text-rose-700 dark:text-rose-400",
    link: "/docs/bubble-sort",
    ctaText: "Explore Sorting Lessons",
  },
  {
    id: "complexity-analysis",
    badge: "Mathematical Rigor",
    badgeColor: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    title: "Complexity & Mathematical Analysis",
    description:
      "Empirical step counter matrices, formal Big-O proofs, permutation analyzers, and Monte Carlo harmonic bounds.",
    subtopics: [
      "Best, Worst & Average Case Analysis",
      "Step Counter Matrix & Invariant Loops",
      "Harmonic Number Monte Carlo Verification",
    ],
    icon: Calculator,
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/30",
    accentText: "text-cyan-700 dark:text-cyan-400",
    link: "/docs/time-complexity",
    ctaText: "Read Time Complexity Masterclass",
  },
  {
    id: "bangla-explanations",
    badge: "🇧🇩 দ্বিভাষিক লার্নিং",
    badgeColor: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-bold",
    title: "সহজ বাংলা ব্যাখ্যা (Bangla Explanations)",
    description:
      "কঠিন অ্যালগরিদম ও ডেটা স্ট্রাকচারের প্রতিটি কনসেপ্টের জন্য সহজবোধ্য বাংলা ব্যাখ্যা, বাস্তব জীবনের উদাহরণ ও ইনটুইশন নোট।",
    subtopics: [
      "প্রতিটি ডকস লেসনের সাথে 'বাংলায় বুঝি' কার্ড",
      "মেমরি ও পয়েন্টারের সহজ বাংলা অ্যানালজি",
      "বিশ্ববিদ্যালয় পরীক্ষার স্পেশাল গাইডলাইন ও প্রুফ",
    ],
    icon: BookOpen,
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    accentText: "text-emerald-700 dark:text-emerald-400",
    link: "/docs/what-is-sorting",
    ctaText: "বাংলা নোট ও ডকস পড়ুন",
  },
];

export function CoveredTopicsHub() {
  return (
    <section
      id="covered-topics-hub"
      className="py-16 sm:py-24 border-b border-border relative overflow-hidden bg-muted/20 scroll-mt-16 transition-colors"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/40 bg-card text-primary text-xs font-sans font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Comprehensive DSA Curriculum</span>
          </div>

          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Covered Topics & Visualizer Hub
          </h2>

          <p className="font-sans font-normal text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            From university textbook proofs (Lipschutz 4th Ed.) to interactive C++ memory studios — everything you need to master Data Structures & Algorithms.
          </p>
        </div>

        {/* Dynamic 7-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {TOPIC_HUBS.map((topic, index) => {
            const Icon = topic.icon;
            const isFullSpan = index === TOPIC_HUBS.length - 1; // Highlight Bangla note as full-width or featured card

            return (
              <div
                key={topic.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-card border border-border p-6 sm:p-7 backdrop-blur-xl shadow-lg hover:border-primary/60 hover:shadow-brass transition-all duration-300 corner-flourish group ${
                  isFullSpan ? "md:col-span-2 lg:col-span-3 border-emerald-500/30 bg-emerald-500/[0.03]" : ""
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badge & Icon Row */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${topic.badgeColor}`}
                    >
                      {topic.badge}
                    </span>

                    <div
                      className={`p-2.5 rounded-xl border ${topic.accentBorder} ${topic.accentBg} ${topic.accentText} group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5">
                      {topic.description}
                    </p>
                  </div>

                  {/* Bullet Subtopics */}
                  <ul className="space-y-1.5 pt-2 border-t border-border/60">
                    {topic.subtopics.map((sub, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-foreground/90 font-sans"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA Link */}
                <div className="pt-5 mt-4 border-t border-border/40">
                  <Link
                    href={topic.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/90 hover:underline"
                  >
                    <span>{topic.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
