"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AlgorithmId } from "@/types/sorting";
import {
  ALGORITHMS,
  SORTING_ALGORITHMS,
  SEARCHING_ALGORITHMS,
  DATA_STRUCTURES,
  COMPLEXITY_TOPICS,
} from "@/data/algorithms";
import {
  Cpu,
  Database,
  TrendingUp,
  ChevronDown,
  Sparkles,
  Layers,
  Search,
  Check,
  X,
} from "lucide-react";

interface TopicNavbarDropdownProps {
  selectedTopic?: AlgorithmId;
  onSelectTopic?: (topicId: AlgorithmId) => void;
  className?: string;
}

type CategoryTab = "all" | "sorting" | "searching" | "data-structures" | "complexity";

export function TopicNavbarDropdown({
  selectedTopic = "bubble",
  onSelectTopic,
  className = "",
}: TopicNavbarDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMeta = ALGORITHMS[selectedTopic] || ALGORITHMS.bubble;

  // Category info matching AlgoHub's classical palette
  const getCategoryInfo = (id: AlgorithmId) => {
    if (SORTING_ALGORITHMS.includes(id as any)) {
      return {
        name: "Sorting",
        icon: Cpu,
        colorClass: "text-[#B08422] dark:text-[#C9A962]",
        bgClass: "bg-[#B08422]/10 dark:bg-[#C9A962]/10 border-[#B08422]/30 dark:border-[#C9A962]/30",
      };
    }
    if (SEARCHING_ALGORITHMS.includes(id as any)) {
      return {
        name: "Searching",
        icon: Search,
        colorClass: "text-emerald-600 dark:text-emerald-400",
        bgClass: "bg-emerald-500/10 border-emerald-500/30",
      };
    }
    if (DATA_STRUCTURES.includes(id as any)) {
      return {
        name: "Data Structures",
        icon: Database,
        colorClass: "text-blue-600 dark:text-blue-400",
        bgClass: "bg-blue-500/10 border-blue-500/30",
      };
    }
    return {
      name: "Complexity",
      icon: TrendingUp,
      colorClass: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-500/10 border-purple-500/30",
    };
  };

  const currentCat = getCategoryInfo(selectedTopic);
  const CurrentIcon = currentCat.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = useCallback(
    (algoId: AlgorithmId) => {
      if (onSelectTopic) {
        onSelectTopic(algoId);
      } else {
        if (pathname?.startsWith("/visualizer")) {
          const url = new URL(window.location.href);
          url.searchParams.set("algo", algoId);
          window.history.pushState({}, "", url.toString());
        } else {
          router.push(`/visualizer?algo=${algoId}`);
        }
      }
      setIsOpen(false);
    },
    [onSelectTopic, pathname, router]
  );

  const categories = [
    {
      id: "sorting" as const,
      label: "Sorting",
      icon: Cpu,
      items: SORTING_ALGORITHMS,
      color: "text-[#B08422] dark:text-[#C9A962]",
    },
    {
      id: "searching" as const,
      label: "Searching",
      icon: Search,
      items: SEARCHING_ALGORITHMS,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "data-structures" as const,
      label: "Data Structures",
      icon: Database,
      items: DATA_STRUCTURES,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "complexity" as const,
      label: "Complexity",
      icon: TrendingUp,
      items: COMPLEXITY_TOPICS,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  // Helper for complexity color badge with classical academia styling
  const getComplexityBadge = (timeStr: string) => {
    if (timeStr.includes("log")) {
      return "bg-[#B08422]/15 dark:bg-[#C9A962]/15 text-[#B08422] dark:text-[#C9A962] border-[#B08422]/30 dark:border-[#C9A962]/30";
    }
    if (timeStr === "O(1)") {
      return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
    }
    if (timeStr === "O(n)") {
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
    }
    return "bg-[#8B2635]/15 text-[#8B2635] dark:text-[#C43B4E] border-[#8B2635]/30";
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    activeTab === "all" ? true : cat.id === activeTab
  );

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Trigger Button — Matches Site Nav Button Typography & Aesthetics */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 transition-all active:scale-95 shadow-sm cursor-pointer ${
          isOpen
            ? "border-primary bg-card text-primary shadow-brass"
            : "border-border bg-card/80 text-foreground hover:text-primary hover:border-primary/50 hover:bg-card"
        }`}
      >
        {/* Category Icon Badge */}
        <div
          className={`h-5 w-5 rounded-xs border flex items-center justify-center shrink-0 transition-transform ${currentCat.bgClass} ${currentCat.colorClass}`}
        >
          <CurrentIcon className="h-3 w-3" />
        </div>

        {/* Text Details */}
        <div className="flex items-center gap-1.5 text-left font-heading">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#B08422] dark:text-[#C9A962] hidden lg:inline">
            Topic:
          </span>
          <span className="text-sm sm:text-base font-heading font-bold text-foreground truncate max-w-[130px] sm:max-w-[180px]">
            {currentMeta.name}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#B08422] dark:bg-[#C9A962] animate-pulse shrink-0" />
        </div>

        {/* Dropdown Chevron */}
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Popover (Right-aligned, Solid 100% Opaque, Corner-Flourish Academia Aesthetic) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[480px] md:w-[560px] max-w-[94vw] rounded-lg border-2 border-[#B08422]/50 dark:border-[#C9A962]/50 bg-[#FFFFFF] dark:bg-[#251E19] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 corner-flourish animate-in fade-in zoom-in-95 font-heading">
          {/* Header Bar */}
          <div className="pb-3 mb-3 border-b border-[#D8CBB8] dark:border-[#4A3F35] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded border border-[#D8CBB8] dark:border-[#4A3F35] bg-[#FAF6F0] dark:bg-[#1C1714] text-[#B08422] dark:text-[#C9A962]">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm sm:text-base font-heading font-bold tracking-wide text-foreground">
                  Topic Categories
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded border border-[#D8CBB8] dark:border-[#4A3F35] bg-[#FAF6F0] dark:bg-[#1C1714] hover:border-primary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                  activeTab === "all"
                    ? "bg-[#B08422] dark:bg-[#C9A962] text-white dark:text-[#1C1714] font-bold border-transparent shadow-xs"
                    : "bg-[#FAF6F0] dark:bg-[#1C1714] border-[#D8CBB8] dark:border-[#4A3F35] text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                All Topics (12)
              </button>
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveTab(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                      isActive
                        ? "bg-[#B08422] dark:bg-[#C9A962] text-white dark:text-[#1C1714] font-bold border-transparent shadow-xs"
                        : "bg-[#FAF6F0] dark:bg-[#1C1714] border-[#D8CBB8] dark:border-[#4A3F35] text-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    <CatIcon className="h-3 w-3" />
                    <span>{cat.label}</span>
                    <span className="text-xs font-heading font-normal opacity-85">({cat.items.length})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topics List Container (Hidden scrollbar) */}
          <div className="max-h-[360px] sm:max-h-[400px] overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-1 space-y-3.5 divide-y divide-[#D8CBB8]/60 dark:divide-[#4A3F35]/60">
            {filteredCategories.map((cat, idx) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.id} className={idx > 0 ? "pt-3.5" : ""}>
                  {/* Category Subheader */}
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <CatIcon className={`h-3.5 w-3.5 ${cat.color}`} />
                      <span className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-[#B08422] dark:text-[#C9A962]">
                        {cat.label}
                      </span>
                    </div>
                  </div>

                  {/* Category Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {cat.items.map((topicId) => {
                      const meta = ALGORITHMS[topicId];
                      const isSelected = selectedTopic === topicId;

                      return (
                        <button
                          key={topicId}
                          type="button"
                          onClick={() => handleSelect(topicId)}
                          className={`group relative flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-md text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-2 border-[#B08422] dark:border-[#C9A962] bg-[#B08422]/10 dark:bg-[#C9A962]/10 text-foreground shadow-xs ring-1 ring-[#B08422]/30 dark:ring-[#C9A962]/30"
                              : "border border-[#D8CBB8] dark:border-[#4A3F35] bg-[#FAF6F0]/80 dark:bg-[#1C1714]/80 hover:bg-[#F5EFEB] dark:hover:bg-[#14100D] hover:border-primary/60 text-foreground"
                          }`}
                        >
                          <span className="font-heading font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 truncate">
                            <span>{meta.name}</span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-xs bg-[#B08422] text-white dark:bg-[#C9A962] dark:text-[#1C1714]">
                                <Check className="h-2.5 w-2.5" />
                                Active
                              </span>
                            )}
                          </span>

                          {/* Complexity Badge */}
                          <span
                            className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-xs border shrink-0 ${getComplexityBadge(
                              meta.complexity.average
                            )}`}
                          >
                            {meta.complexity.average}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dropdown Footer */}
          <div className="pt-2.5 mt-2.5 border-t border-[#D8CBB8] dark:border-[#4A3F35] flex items-center justify-between text-xs sm:text-sm font-heading font-medium text-muted-foreground px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Click any topic to switch visualizer</span>
            </span>
            <span className="text-xs font-heading">ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
