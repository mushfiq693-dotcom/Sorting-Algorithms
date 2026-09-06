"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fastCache } from "@/lib/cache";
import { CourseMaterial } from "@/types/courseMaterial";
import { DEFAULT_COURSE_MATERIALS } from "@/data/defaultCourseMaterials";
import dynamic from "next/dynamic";
import { FormattedMarkdown } from "@/components/docs/FormattedMarkdown";
import { AlgoHubLogo } from "@/components/brand/AlgoHubLogo";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const SimLabLoading = () => (
  <div className="h-64 rounded-2xl border border-cyan-500/20 bg-card/60 flex flex-col items-center justify-center p-8 text-center animate-pulse">
    <div className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mb-3" />
    <span className="text-xs text-muted-foreground font-mono">Loading Simulation Lab...</span>
  </div>
);

const MaxElementComplexityVisualizer = dynamic(
  () =>
    import("@/components/course-material/MaxElementComplexityVisualizer").then(
      (m) => m.MaxElementComplexityVisualizer
    ),
  { ssr: false, loading: () => <SimLabLoading /> }
);
const LoopComplexityVisualizer = dynamic(
  () =>
    import("@/components/course-material/LoopComplexityVisualizer").then(
      (m) => m.LoopComplexityVisualizer
    ),
  { ssr: false, loading: () => <SimLabLoading /> }
);
const StringOperationsVisualizer = dynamic(
  () =>
    import("@/components/course-material/StringOperationsVisualizer").then(
      (m) => m.StringOperationsVisualizer
    ),
  { ssr: false, loading: () => <SimLabLoading /> }
);
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  Code2,
  Search,
  Tag,
  Flame,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Loader2,
  Bookmark,
  ChevronsUpDown,
  Minimize2,
  Maximize2,
  Lock,
  ArrowRight,
  Zap,
  Clock,
} from "lucide-react";
import { useAccessControl } from "@/hooks/useAccessControl";
import { AuthButton } from "@/components/auth/AuthButton";

// Chapter Filter Options
const CHAPTER_OPTIONS = [
  { id: "all", label: "All Chapters", icon: BookOpen },
  { id: "Chapter 2", label: "Chapter 2: Complexity Analysis", icon: Bookmark },
  { id: "Chapter 3", label: "Chapter 3: String Processing", icon: Bookmark },
  { id: "Chapter 4", label: "Chapter 4: Linear Arrays", icon: Bookmark },
];

const TYPE_OPTIONS = [
  { id: "all", label: "All Content Types", icon: Layers },
  { id: "topic", label: "Lecture Topics Only", icon: Lightbulb },
  { id: "problem", label: "Assigned Problems Only", icon: HelpCircle },
  { id: "algorithm", label: "Algorithms Only", icon: Code2 },
];

const DIFFICULTY_OPTIONS = [
  { id: "all", label: "All Difficulties", icon: Flame },
  { id: "easy", label: "Easy", icon: Flame },
  { id: "medium", label: "Medium", icon: Flame },
  { id: "hard", label: "Hard", icon: Flame },
];

// Helper: Custom Dropdown Component
function CustomDropdown({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  badgeColor,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (val: string) => void;
  options: { id: string; label: string; icon?: React.ElementType }[];
  badgeColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.id === value) || options[0];
  const isSelected = value !== "all";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-dropdown-id="${label}"]`)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, label]);

  return (
    <div className="relative" data-dropdown-id={label}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
          isSelected
            ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-bold"
            : "bg-secondary/70 hover:bg-secondary text-foreground/80 border-border/80"
        }`}
      >
        <Icon className={`h-3.5 w-3.5 ${badgeColor || "text-muted-foreground"}`} />
        <span>{selectedOption.label}</span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-56 p-1.5 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-0.5">
            {options.map((opt) => {
              const OptIcon = opt.icon || Icon;
              const isCurrent = opt.id === value;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    isCurrent
                      ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 font-bold"
                      : "text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <OptIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isCurrent && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Intelligent Sequential Sorting Key (Chapter 2 -> Chapter 3, Topics & Problems ordered)
function getMaterialSortKey(m: CourseMaterial): number {
  const ref = ((m.book_reference || "") + " " + (m.title || "") + " " + (m.id || "")).toLowerCase();

  // Chapter 2: Complexity Analysis
  if (ref.includes("step-counting") || (ref.includes("chapter 2") && m.content_type === "topic")) return 200;
  if (ref.includes("2.6") || ref.includes("exercise 2.6") || ref.includes("maximum element")) return 206;
  if (ref.includes("2.7") || ref.includes("exercise 2.7") || ref.includes("nested loops")) return 207;

  // Chapter 3: String Processing (Topics & Problems)
  if (ref.includes("3.5") && m.content_type === "topic") return 350;
  if (ref.includes("3.5") && m.content_type === "problem") return 355;

  if (ref.includes("3.6") && m.content_type === "topic") return 360;
  if (ref.includes("3.6") && m.content_type === "problem") return 365;

  if (ref.includes("3.1") || ref.includes("algorithm 3.1")) return 370;
  if (ref.includes("3.2") || ref.includes("algorithm 3.2")) return 375;

  // Regex fallback
  const chapMatch = ref.match(/chapter\s+(\d+)/i);
  const secMatch = ref.match(/(?:problem|section|exercise|algorithm)\s+(\d+)(?:\.(\d+))?/i);
  const chap = chapMatch ? parseInt(chapMatch[1], 10) : 99;
  const secMajor = secMatch ? parseInt(secMatch[1], 10) : 0;
  const secMinor = secMatch && secMatch[2] ? parseInt(secMatch[2], 10) : 0;
  return chap * 1000 + secMajor * 10 + secMinor;
}

export default function CourseMaterialPage() {
  const router = useRouter();
  const supabase = createClient();

  const { user, role } = useAccessControl();

  const [materials, setMaterials] = useState<CourseMaterial[]>(() => {
    if (typeof window !== "undefined") {
      const cached = fastCache.get<CourseMaterial[]>("course_materials");
      if (cached && cached.length > 0) return cached;
    }
    return DEFAULT_COURSE_MATERIALS;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Track expanded cards (Dropdown accordions)
  // First item open by default for immediate engagement
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    "cm-problem-2-6": true,
  });

  // Track expanded solutions & visualizers
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [expandedVisualizers, setExpandedVisualizers] = useState<Record<string, boolean>>({
    "cm-problem-2-6": true,
  });

  useEffect(() => {
    async function fetchCourseMaterials() {
      // Check cache first
      const cached = fastCache.get<CourseMaterial[]>("course_materials");
      if (cached && cached.length > 0) {
        setMaterials(cached);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await (supabase
          .from("course_materials" as any)
          .select("*") as any);

        if (fetchErr) {
          console.warn("Could not load course materials from database, using local dataset:", fetchErr);
        } else if (data && data.length > 0) {
          const existingIds = new Set(data.map((d: CourseMaterial) => d.title));
          const missingDefaults = DEFAULT_COURSE_MATERIALS.filter((d) => !existingIds.has(d.title));
          const consolidated = [...(data as CourseMaterial[]), ...missingDefaults];
          setMaterials(consolidated);
          fastCache.set("course_materials", consolidated, 600); // cache for 10 mins
        }
      } catch (err: any) {
        console.warn("Unexpected error loading materials, using fallback:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourseMaterials();
  }, [supabase]);

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllCards = () => {
    const next: Record<string, boolean> = {};
    filteredMaterials.forEach((m) => {
      next[m.id] = true;
    });
    setExpandedCards(next);
  };

  const collapseAllCards = () => {
    setExpandedCards({});
  };

  const toggleSolution = (id: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleVisualizer = (id: string) => {
    setExpandedVisualizers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Distinct topic tags for filter dropdown
  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    materials.forEach((m) => {
      if (m.topic_tag) tags.add(m.topic_tag);
    });
    const tagList = Array.from(tags).map((t) => ({ id: t, label: t, icon: Tag }));
    return [{ id: "all", label: "All Topic Tags", icon: Tag }, ...tagList];
  }, [materials]);

  // Filtered and Sequentially Sorted materials (Chapter-wise ascending)
  const filteredMaterials = useMemo(() => {
    const list = materials.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        (m.book_reference && m.book_reference.toLowerCase().includes(q)) ||
        (m.topic_tag && m.topic_tag.toLowerCase().includes(q)) ||
        (m.problem_statement && m.problem_statement.toLowerCase().includes(q));

      const matchesChapter =
        selectedChapter === "all" ||
        (m.book_reference && m.book_reference.toLowerCase().includes(selectedChapter.toLowerCase()));

      const matchesTag = selectedTag === "all" || m.topic_tag === selectedTag;
      const matchesType = selectedType === "all" || m.content_type === selectedType;
      const matchesDifficulty = selectedDifficulty === "all" || m.difficulty === selectedDifficulty;

      return matchesSearch && matchesChapter && matchesTag && matchesType && matchesDifficulty;
    });

    // Sort numerically in ascending Chapter & Section order
    return list.sort((a, b) => getMaterialSortKey(a) - getMaterialSortKey(b));
  }, [materials, searchQuery, selectedChapter, selectedTag, selectedType, selectedDifficulty]);

  const hasActiveFilters =
    searchQuery ||
    selectedChapter !== "all" ||
    selectedType !== "all" ||
    selectedTag !== "all" ||
    selectedDifficulty !== "all";

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedChapter("all");
    setSelectedType("all");
    setSelectedTag("all");
    setSelectedDifficulty("all");
  };

  const allAreExpanded =
    filteredMaterials.length > 0 &&
    filteredMaterials.every((m) => expandedCards[m.id]);

  // Statistics for Hero Section
  const stats = useMemo(() => {
    const totalProblems = materials.filter((m) => m.content_type === "problem").length;
    const totalTopics = materials.filter((m) => m.content_type === "topic").length;
    const totalAlgorithms = materials.filter((m) => m.content_type === "algorithm").length;
    const chapters = new Set(
      materials
        .map((m) => {
          const match = (m.book_reference || "").match(/Chapter\s+(\d+)/i);
          return match ? match[1] : null;
        })
        .filter(Boolean)
    );
    return {
      totalProblems,
      totalTopics,
      totalAlgorithms,
      totalChapters: chapters.size || 3,
    };
  }, [materials]);

  return (
    <div className="min-h-screen bg-background dark:bg-[#050811] text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-base sm:text-lg tracking-tight text-foreground font-sans">
                AlgoHub
              </span>
              <AmbientSortLogo />
            </Link>

            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              Course Material
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/learn"
              className="px-3 py-1.5 rounded-xl border border-border bg-secondary/70 text-xs font-semibold hover:bg-secondary transition-colors"
            >
              Curriculum
            </Link>
            <Link
              href="/docs"
              className="px-3 py-1.5 rounded-xl border border-border bg-secondary/70 text-xs font-semibold hover:bg-secondary transition-colors"
            >
              Docs
            </Link>
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Course Materials</span>
        </div>

        {/* Hero Section with Live Stats */}
        <div className="relative rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 mb-3">
                <Bookmark className="h-3.5 w-3.5" />
                <span>Lipschutz &amp; Seymour (4th Ed.)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                Course Materials &amp; Assigned Problems
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                Curated lecture topics, complexity derivations, and worked textbook solutions arranged in sequential chapter order with interactive simulation laboratories.
              </p>
            </div>

            {/* Stat Counters Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2.5 shrink-0">
              {/* Total Problems Stat */}
              <button
                onClick={() => setSelectedType(selectedType === "problem" ? "all" : "problem")}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                  selectedType === "problem"
                    ? "bg-amber-500/20 border-amber-500/50 shadow-md shadow-amber-500/10 ring-2 ring-amber-400/30"
                    : "bg-secondary/60 hover:bg-secondary border-border/80"
                }`}
              >
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Problems</span>
                  <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-extrabold text-foreground font-mono">
                  {stats.totalProblems}
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                  Assigned Exercises
                </div>
              </button>

              {/* Total Topics Stat */}
              <button
                onClick={() => setSelectedType(selectedType === "topic" ? "all" : "topic")}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                  selectedType === "topic"
                    ? "bg-indigo-500/20 border-indigo-500/50 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-400/30"
                    : "bg-secondary/60 hover:bg-secondary border-border/80"
                }`}
              >
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Topics</span>
                  <Lightbulb className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <div className="text-xl font-extrabold text-foreground font-mono">
                  {stats.totalTopics}
                </div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  Lecture Modules
                </div>
              </button>

              {/* Total Algorithms Stat */}
              <button
                onClick={() => setSelectedType(selectedType === "algorithm" ? "all" : "algorithm")}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                  selectedType === "algorithm"
                    ? "bg-emerald-500/20 border-emerald-500/50 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-400/30"
                    : "bg-secondary/60 hover:bg-secondary border-border/80"
                }`}
              >
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Algorithms</span>
                  <Code2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="text-xl font-extrabold text-foreground font-mono">
                  {stats.totalAlgorithms}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  Core Algorithms
                </div>
              </button>

              {/* Chapters Stat */}
              <div className="p-3 rounded-2xl border border-border/80 bg-secondary/60 flex flex-col justify-between">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Chapters</span>
                  <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className="text-xl font-extrabold text-foreground font-mono">
                  {stats.totalChapters}
                </div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">
                  Ch 2, 3 &amp; 4
                </div>
              </div>

              {/* Interactive Labs Stat */}
              <div className="p-3 rounded-2xl border border-border/80 bg-secondary/60 flex flex-col justify-between">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Labs</span>
                  <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                </div>
                <div className="text-xl font-extrabold text-foreground font-mono">
                  3
                </div>
                <div className="text-[10px] text-pink-600 dark:text-pink-400 font-medium mt-0.5">
                  Simulators
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 mb-6 backdrop-blur-md shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search topics, problems, complexity, algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-border/80 bg-secondary/70 focus:bg-background focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Custom Modern Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <CustomDropdown
                label="Chapter"
                icon={BookOpen}
                value={selectedChapter}
                onChange={setSelectedChapter}
                options={CHAPTER_OPTIONS}
                badgeColor="text-indigo-500"
              />

              <CustomDropdown
                label="Type"
                icon={Layers}
                value={selectedType}
                onChange={setSelectedType}
                options={TYPE_OPTIONS}
                badgeColor="text-cyan-500"
              />

              <CustomDropdown
                label="Topic Tag"
                icon={Tag}
                value={selectedTag}
                onChange={setSelectedTag}
                options={tagOptions}
                badgeColor="text-blue-500"
              />

              <CustomDropdown
                label="Difficulty"
                icon={Flame}
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                options={DIFFICULTY_OPTIONS}
                badgeColor="text-amber-500"
              />

              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all active:scale-95 shadow-sm"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats & Expand/Collapse All Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 text-xs font-mono">
            <div className="text-muted-foreground flex items-center gap-2">
              <span>Showing</span>
              <span className="font-bold text-cyan-500 dark:text-cyan-400">
                {filteredMaterials.length}
              </span>
              <span>items in sequential chapter order</span>
            </div>

            <div className="flex items-center gap-2">
              {allAreExpanded ? (
                <button
                  onClick={collapseAllCards}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border transition-all active:scale-95"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Collapse All</span>
                </button>
              ) : (
                <button
                  onClick={expandAllCards}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 transition-all active:scale-95"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Expand All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-cyan-500 animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading course materials in chapter order...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredMaterials.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-foreground">No course materials match your search</h3>
            <p className="text-xs text-muted-foreground mt-1">Try resetting your search query or filter criteria.</p>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Material Cards List (Dropdown / Collapsible Accordions) */}
        {!isLoading && !error && filteredMaterials.length > 0 && (
          <div className="space-y-4">
            {filteredMaterials.map((item, index) => {
              const isProblem = item.content_type === "problem";
              const isAlgorithm = item.content_type === "algorithm";
              const isTopic = item.content_type === "topic";
              const isCardOpen = expandedCards[item.id] || false;
              const isSolutionOpen = expandedSolutions[item.id] || false;

              // Extract chapter badge text cleanly
              const ref = item.book_reference || "";
              const chapterMatch = ref.match(/(Chapter\s+\d+.*|Section\s+\d+.*)/i);
              const chapterText = chapterMatch ? chapterMatch[0].trim() : ref;

              return (
                <article
                  key={item.id}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-lg ${
                    isCardOpen
                      ? "border-cyan-500/40 bg-card/95 shadow-cyan-500/5 ring-1 ring-cyan-500/20"
                      : "border-border/80 bg-card/70 hover:border-cyan-500/30 hover:bg-card/90"
                  }`}
                >
                  {/* Card Header Bar (Dropdown Trigger) */}
                  <div
                    onClick={() => toggleCard(item.id)}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group select-none transition-colors hover:bg-secondary/30"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      {/* Number Badge */}
                      <span className="h-8 w-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-mono text-xs font-black text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm shadow-cyan-500/10 group-hover:scale-105 transition-transform">
                        {index + 1}
                      </span>

                      {/* Main Title & Chapter Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {/* Chapter Badge */}
                          {chapterText && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-extrabold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                              <Bookmark className="h-3 w-3" />
                              <span>{chapterText}</span>
                            </span>
                          )}

                          {/* Content Type Badge */}
                          {isProblem ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                              <HelpCircle className="h-3 w-3" />
                              <span>PROBLEM</span>
                            </span>
                          ) : isAlgorithm ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                              <Code2 className="h-3 w-3" />
                              <span>ALGORITHM</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                              <Lightbulb className="h-3 w-3" />
                              <span>TOPIC</span>
                            </span>
                          )}

                          {/* Difficulty Badge */}
                          {item.difficulty && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                                item.difficulty === "easy"
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30"
                                  : item.difficulty === "medium"
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30"
                                  : "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30"
                              }`}
                            >
                              {item.difficulty.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Card Title */}
                        <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors truncate">
                          {item.title}
                        </h2>
                      </div>
                    </div>

                    {/* Right Action / Dropdown Accordion Toggle Button */}
                    <div className="flex items-center justify-between md:justify-end gap-2.5 self-stretch md:self-center border-t md:border-t-0 pt-2 md:pt-0 border-border/50">
                      {item.topic_tag && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium bg-secondary text-foreground/70 border border-border">
                          <Tag className="h-3 w-3 text-cyan-500" />
                          <span>{item.topic_tag}</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCard(item.id);
                        }}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 shadow-sm ${
                          isCardOpen
                            ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/40"
                            : "bg-secondary text-foreground hover:bg-secondary/80 border-border"
                        }`}
                      >
                        <span>{isCardOpen ? "Hide Details" : "Open Dropdown"}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-cyan-500 transition-transform duration-300 ${
                            isCardOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Body (Expanded Dropdown Content) */}
                  {isCardOpen && (
                    <div className="p-6 sm:p-8 space-y-6 border-t border-border/60 bg-card/40 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Prominent Topic & Chapter Locator Badge */}
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 font-black shadow-md shadow-cyan-500/10">
                          <BookOpen className="h-4 w-4 text-cyan-400" />
                          <span className="text-white text-xs tracking-tight">{chapterText}</span>
                        </div>
                        <span className="text-muted-foreground text-[11px] px-2.5 py-1 rounded-lg bg-secondary/80 border border-border">
                          📖 Lipschutz &amp; Seymour, Data Structures, Revised 4th Ed.
                        </span>
                      </div>

                      {/* Problem Statement Section (For Problem Type) */}
                      {isProblem && item.problem_statement && (
                        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.04] p-5 sm:p-6 shadow-inner">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-3">
                            <HelpCircle className="h-4 w-4 text-cyan-500" />
                            <span>Problem Statement</span>
                          </div>
                          <FormattedMarkdown content={item.problem_statement} />
                        </div>
                      )}

                      {/* Problem Action Bar & Interactive Visualizer / Solution Blocks */}
                      {isProblem ? (
                        <div className="space-y-6 pt-2">
                          {(() => {
                            const isProblem26 =
                              item.title.toLowerCase().includes("maximum element") ||
                              item.title.includes("2.6") ||
                              (item.problem_statement && item.problem_statement.includes("Algorithm 2.3")) ||
                              item.id === "cm-problem-2-6";

                            const isProblem27 =
                              item.title.toLowerCase().includes("nested loops") ||
                              item.title.includes("2.7") ||
                              (item.problem_statement && item.problem_statement.includes("Algorithm P2.7")) ||
                              item.id === "cm-problem-2-7";

                            const isStringProblem =
                              item.topic_tag === "String Processing" ||
                              item.title.toLowerCase().includes("string") ||
                              item.title.toLowerCase().includes("word processing") ||
                              item.title.includes("3.1") ||
                              item.title.includes("3.2") ||
                              item.title.includes("3.5") ||
                              item.title.includes("3.6");

                            const hasVisualizer = isProblem26 || isProblem27 || isStringProblem;
                            const isVisualizerOpen = !!expandedVisualizers[item.id];

                            return (
                              <>
                                {/* Action Buttons Row */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                                  <div className="text-xs text-muted-foreground">
                                    {isProblem26
                                      ? "Interactive visualizer available to test Worst Case, Best Case, and Average Case permutations."
                                      : isProblem27
                                      ? "Interactive loop counter available for 3-loop nested cubic growth and logarithmic stepping."
                                      : isStringProblem
                                      ? "Interactive string studio & algorithm execution trace available."
                                      : "Attempt the question first before viewing the full step-by-step verification."}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Interactive Visualizer Toggle Button */}
                                    {hasVisualizer && (
                                      <button
                                        onClick={() => toggleVisualizer(item.id)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md ${
                                          isVisualizerOpen
                                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-indigo-500/10"
                                            : "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white hover:opacity-95 shadow-indigo-500/20 ring-2 ring-indigo-400/30"
                                        }`}
                                      >
                                        <Play className={`h-3.5 w-3.5 ${isVisualizerOpen ? "text-indigo-400" : "text-white fill-white"}`} />
                                        <span>
                                          {isVisualizerOpen ? "Hide Simulation Lab" : "🚀 Launch Simulation Lab"}
                                        </span>
                                        {isVisualizerOpen ? (
                                          <ChevronUp className="h-3.5 w-3.5" />
                                        ) : (
                                          <ChevronDown className="h-3.5 w-3.5" />
                                        )}
                                      </button>
                                    )}

                                    {/* Solution Toggle Button */}
                                    <button
                                      onClick={() => toggleSolution(item.id)}
                                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
                                        isSolutionOpen
                                          ? "bg-secondary text-foreground border border-border hover:bg-secondary/80"
                                          : hasVisualizer
                                          ? "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                                          : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 shadow-cyan-500/20"
                                      }`}
                                    >
                                      {isSolutionOpen ? (
                                        <>
                                          <EyeOff className="h-3.5 w-3.5" />
                                          <span>Hide Solution</span>
                                          <ChevronUp className="h-3.5 w-3.5" />
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="h-3.5 w-3.5" />
                                          <span>Show Worked Solution</span>
                                          <ChevronDown className="h-3.5 w-3.5" />
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Embedded Simulation & Visualizer Studio for Problem 2.6 */}
                                {isProblem26 && isVisualizerOpen && (
                                  <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                                    <MaxElementComplexityVisualizer />
                                  </div>
                                )}

                                {/* Embedded Simulation & Visualizer Studio for Problem 2.7 */}
                                {isProblem27 && isVisualizerOpen && (
                                  <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                                    <LoopComplexityVisualizer />
                                  </div>
                                )}

                                {/* Embedded Simulation & Visualizer Studio for String Problems (3.1, 3.2, 3.5, 3.6) */}
                                {isStringProblem && isVisualizerOpen && (
                                  <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                                    <StringOperationsVisualizer />
                                  </div>
                                )}

                                {/* Collapsible Solution Content */}
                                {isSolutionOpen && (
                                  <div className="rounded-2xl border border-emerald-500/30 bg-card p-6 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider pb-3 border-b border-border/60 mb-4">
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                      <span>Step-by-Step Worked Solution &amp; Mathematical Verification</span>
                                    </div>
                                    <FormattedMarkdown content={item.explanation_or_solution} />
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ) : isAlgorithm ? (
                        /* Algorithm Content (Direct display with code specification) */
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-emerald-500/30 bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider pb-3 border-b border-border/60 mb-4">
                              <Code2 className="h-4 w-4 text-emerald-500" />
                              <span>Formal Textbook Algorithm Specification &amp; Analysis</span>
                            </div>
                            <FormattedMarkdown content={item.explanation_or_solution} />
                          </div>
                        </div>
                      ) : (
                        /* Topic Explanation (Direct display with optional Interactive Studio) */
                        (() => {
                          const isStringTopic =
                            item.topic_tag === "String Processing" ||
                            item.title.toLowerCase().includes("string") ||
                            item.title.toLowerCase().includes("word processing") ||
                            item.title.toLowerCase().includes("3.5") ||
                            item.title.toLowerCase().includes("3.6");

                          const isVisualizerOpen = !!expandedVisualizers[item.id];

                          return (
                            <div className="space-y-4">
                              {/* Action / Visualizer Toggle Bar for Topic */}
                              {isStringTopic && (
                                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
                                  <div className="text-xs text-muted-foreground">
                                    Interactive String Operations &amp; Algorithm 3.1/3.2 Trace Studio available.
                                  </div>
                                  <button
                                    onClick={() => toggleVisualizer(item.id)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md ${
                                      isVisualizerOpen
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-cyan-500/10"
                                        : "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:opacity-95 shadow-cyan-500/20 ring-2 ring-cyan-400/30"
                                    }`}
                                  >
                                    <Play className={`h-3.5 w-3.5 ${isVisualizerOpen ? "text-cyan-400" : "text-white fill-white"}`} />
                                    <span>
                                      {isVisualizerOpen ? "Hide String Studio" : "🚀 Launch String Studio"}
                                    </span>
                                    {isVisualizerOpen ? (
                                      <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>
                              )}

                              {/* Embedded Visualizer */}
                              {isStringTopic && isVisualizerOpen && (
                                <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                                  <StringOperationsVisualizer />
                                </div>
                              )}

                              {/* Topic Content */}
                              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider pb-3 border-b border-border/60 mb-4">
                                  <Lightbulb className="h-4 w-4 text-cyan-500" />
                                  <span>Concept Explanation &amp; Textbook Derivations</span>
                                </div>
                                <FormattedMarkdown content={item.explanation_or_solution} />
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
