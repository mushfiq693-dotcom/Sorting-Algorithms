"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AlgorithmId } from "@/types/sorting";
import {
  Cpu,
  Database,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";

interface TopicNavbarDropdownProps {
  selectedTopic?: AlgorithmId;
  onSelectTopic?: (topicId: AlgorithmId) => void;
  className?: string;
}

interface CategoryItem {
  id: AlgorithmId;
  num: string;
  name: string;
  badge: string;
}

interface CategoryGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  items: CategoryItem[];
}

const CATEGORIES: CategoryGroup[] = [
  {
    id: "sorting",
    label: "SORTING ALGORITHMS",
    icon: Cpu,
    colorClass: "text-cyan-400",
    items: [
      { id: "bubble", num: "01", name: "Bubble Sort", badge: "O(n²)" },
      { id: "selection", num: "02", name: "Selection Sort", badge: "O(n²)" },
      { id: "insertion", num: "03", name: "Insertion Sort", badge: "O(n²)" },
      { id: "merge", num: "04", name: "Merge Sort", badge: "O(n log n)" },
      { id: "quick", num: "05", name: "Quick Sort", badge: "O(n log n)" },
    ],
  },
  {
    id: "data-structures",
    label: "DATA STRUCTURES",
    icon: Database,
    colorClass: "text-blue-400",
    items: [
      { id: "stack", num: "06", name: "Stack", badge: "LIFO O(1)" },
      { id: "queue", num: "07", name: "Queue", badge: "FIFO O(1)" },
      { id: "linked-list", num: "08", name: "Linked List", badge: "FIFO O(1)" },
    ],
  },
  {
    id: "searching",
    label: "SEARCHING ALGORITHMS",
    icon: Search,
    colorClass: "text-emerald-400",
    items: [
      { id: "linear-search", num: "09", name: "Linear Search", badge: "O(n)" },
      { id: "binary-search", num: "010", name: "Binary Search", badge: "O(log n)" },
    ],
  },
  {
    id: "complexity",
    label: "COMPLEXITY ANALYSIS",
    icon: TrendingUp,
    colorClass: "text-purple-400",
    items: [
      { id: "time-complexity", num: "011", name: "Time Complexity", badge: "Big-O" },
      { id: "space-complexity", num: "012", name: "Space Complexity", badge: "Aux Space" },
    ],
  },
];

export function TopicNavbarDropdown({
  selectedTopic = "bubble",
  onSelectTopic,
  className = "",
}: TopicNavbarDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm ${
          isOpen
            ? "border-cyan-500/60 bg-cyan-950/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            : "border-cyan-500/30 bg-cyan-950/30 text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-950/40"
        }`}
      >
        <Layers className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="font-medium tracking-wide">All Topics</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-cyan-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-cyan-400 shrink-0" />
        )}
      </button>

      {/* Floating Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-[330px] sm:w-[350px] max-w-[94vw] max-h-[82vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-[#2b2724] bg-[#121110]/95 backdrop-blur-xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 duration-150">
          {CATEGORIES.map((cat, catIdx) => {
            const CatIcon = cat.icon;
            return (
              <div key={cat.id}>
                {catIdx > 0 && <div className="h-px bg-neutral-800/60 my-3" />}

                {/* Category Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <CatIcon className={`h-3.5 w-3.5 ${cat.colorClass}`} />
                    <span
                      className={`text-[11px] font-mono font-bold tracking-wider uppercase ${cat.colorClass}`}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase font-medium">
                    {cat.items.length} TOPICS
                  </span>
                </div>

                {/* Category Items List */}
                <div className="space-y-1">
                  {cat.items.map((item) => {
                    const isSelected = selectedTopic === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 shadow-xs"
                            : "border border-transparent hover:bg-neutral-800/40 text-neutral-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span
                            className={`text-xs font-mono shrink-0 ${
                              isSelected
                                ? "text-cyan-400 font-semibold"
                                : "text-neutral-500"
                            }`}
                          >
                            {item.num}
                          </span>
                          <span
                            className={`text-sm truncate ${
                              isSelected
                                ? "font-semibold text-cyan-300"
                                : "font-normal text-neutral-300"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        {/* Complexity / Detail Badge */}
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border shrink-0 ${
                            isSelected
                              ? "border-neutral-700/60 bg-neutral-800/80 text-neutral-400"
                              : "border-neutral-800/70 bg-neutral-800/40 text-neutral-500"
                          }`}
                        >
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
