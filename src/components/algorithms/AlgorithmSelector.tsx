"use client";

import React, { useState, useEffect } from "react";
import { AlgorithmId } from "@/types/sorting";
import {
  ALGORITHMS,
  SORTING_ALGORITHMS,
  SEARCHING_ALGORITHMS,
  DATA_STRUCTURES,
  COMPLEXITY_TOPICS,
} from "@/data/algorithms";
import { Cpu, Database, TrendingUp, ChevronDown, Sparkles, Layers, Search } from "lucide-react";

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmId;
  onSelectAlgorithm: (id: AlgorithmId) => void;
  disabled?: boolean;
}

type CategoryKey = "sorting" | "searching" | "data-structures" | "complexity";

export function AlgorithmSelector({
  selectedAlgorithm,
  onSelectAlgorithm,
  disabled = false,
}: AlgorithmSelectorProps) {
  // Determine which category the current selected algorithm belongs to
  const getActiveCategory = (id: AlgorithmId): CategoryKey => {
    if (SORTING_ALGORITHMS.includes(id as any)) return "sorting";
    if (SEARCHING_ALGORITHMS.includes(id as any)) return "searching";
    if (DATA_STRUCTURES.includes(id as any)) return "data-structures";
    return "complexity";
  };

  // State to track open/closed categories (allow independent toggling)
  const [openCategories, setOpenCategories] = useState<Record<CategoryKey, boolean>>(() => {
    const active = getActiveCategory(selectedAlgorithm);
    return {
      sorting: active === "sorting",
      searching: active === "searching",
      "data-structures": active === "data-structures",
      complexity: active === "complexity",
    };
  });

  // Automatically ensure the category containing selectedAlgorithm is expanded when algorithm changes
  useEffect(() => {
    const active = getActiveCategory(selectedAlgorithm);
    setOpenCategories((prev) => ({
      ...prev,
      [active]: true,
    }));
  }, [selectedAlgorithm]);

  const toggleCategory = (cat: CategoryKey) => {
    setOpenCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const expandAll = () => {
    setOpenCategories({ sorting: true, searching: true, "data-structures": true, complexity: true });
  };

  const collapseAll = () => {
    setOpenCategories({ sorting: false, searching: false, "data-structures": false, complexity: false });
  };

  const isSortingActive = SORTING_ALGORITHMS.includes(selectedAlgorithm as any);
  const isSearchingActive = SEARCHING_ALGORITHMS.includes(selectedAlgorithm as any);
  const isDsActive = DATA_STRUCTURES.includes(selectedAlgorithm as any);
  const isComplexityActive = COMPLEXITY_TOPICS.includes(selectedAlgorithm as any);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/80 p-3.5 sm:p-4 backdrop-blur-xl shadow-xl">
      {/* Top Header with Expand/Collapse All */}
      <div className="flex items-center justify-between px-1 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            Topic Categories
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <button
            type="button"
            onClick={expandAll}
            className="px-2 py-0.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-cyan-500 transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-border">•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="px-2 py-0.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-cyan-500 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Category 1: Sorting Algorithms Dropdown */}
      {/* =================================================================== */}
      <div className="rounded-xl border border-border/80 bg-secondary/30 overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => toggleCategory("sorting")}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-secondary/50 hover:bg-secondary/80 transition-colors text-left cursor-pointer group"
          aria-expanded={openCategories.sorting}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0 shadow-sm">
              <Cpu className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-foreground truncate">
                  Sorting Algorithms
                </span>
                {isSortingActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                {openCategories.sorting ? "Click to collapse" : `Active: ${ALGORITHMS[selectedAlgorithm]?.name || "Select"}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-[10px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
              {SORTING_ALGORITHMS.length} Algorithms
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                openCategories.sorting ? "rotate-180 text-cyan-500" : ""
              }`}
            />
          </div>
        </button>

        {openCategories.sorting && (
          <div className="p-2.5 flex flex-col gap-1.5 border-t border-border/60 animate-in fade-in slide-in-from-top-1 duration-150">
            {SORTING_ALGORITHMS.map((algoId) => {
              const meta = ALGORITHMS[algoId];
              const isSelected = selectedAlgorithm === algoId;

              return (
                <button
                  key={algoId}
                  id={`algo-btn-${algoId}`}
                  disabled={disabled}
                  onClick={() => onSelectAlgorithm(algoId)}
                  className={`group relative flex flex-col items-start rounded-xl p-2.5 text-left transition-all ${
                    isSelected
                      ? "bg-cyan-500/15 border border-cyan-500/60 shadow-sm text-foreground"
                      : "border border-border/60 bg-background/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99] cursor-pointer"}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-bold text-xs text-foreground flex items-center gap-2">
                      {meta.name}
                      {isSelected && (
                        <span className="flex items-end gap-0.5 h-3 px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-500">
                          <span className="w-0.5 h-1 rounded-xs bg-cyan-500" />
                          <span className="w-0.5 h-2 rounded-xs bg-cyan-500" />
                          <span className="w-0.5 h-3 rounded-xs bg-cyan-500" />
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        meta.complexity.average.includes("log")
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20"
                      }`}
                    >
                      {meta.complexity.average}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed line-clamp-1">
                    {meta.shortDescription}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* Category 2: Searching Algorithms Dropdown */}
      {/* =================================================================== */}
      <div className="rounded-xl border border-border/80 bg-secondary/30 overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => toggleCategory("searching")}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-secondary/50 hover:bg-secondary/80 transition-colors text-left cursor-pointer group"
          aria-expanded={openCategories.searching}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
              <Search className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-foreground truncate">
                  Searching Algorithms
                </span>
                {isSearchingActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                {openCategories.searching ? "Click to collapse" : `Active: ${ALGORITHMS[selectedAlgorithm]?.name || "Select"}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              {SEARCHING_ALGORITHMS.length} Algorithms
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                openCategories.searching ? "rotate-180 text-emerald-500" : ""
              }`}
            />
          </div>
        </button>

        {openCategories.searching && (
          <div className="p-2.5 flex flex-col gap-1.5 border-t border-border/60 animate-in fade-in slide-in-from-top-1 duration-150">
            {SEARCHING_ALGORITHMS.map((algoId) => {
              const meta = ALGORITHMS[algoId];
              const isSelected = selectedAlgorithm === algoId;

              return (
                <button
                  key={algoId}
                  id={`algo-btn-${algoId}`}
                  disabled={disabled}
                  onClick={() => onSelectAlgorithm(algoId)}
                  className={`group relative flex flex-col items-start rounded-xl p-2.5 text-left transition-all ${
                    isSelected
                      ? "bg-emerald-500/15 border border-emerald-500/60 shadow-sm text-foreground"
                      : "border border-border/60 bg-background/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99] cursor-pointer"}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-bold text-xs text-foreground flex items-center gap-2">
                      {meta.name}
                      {isSelected && (
                        <span className="flex items-end gap-0.5 h-3 px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-500">
                          <span className="w-0.5 h-1 rounded-xs bg-emerald-500" />
                          <span className="w-0.5 h-2 rounded-xs bg-emerald-500" />
                          <span className="w-0.5 h-3 rounded-xs bg-emerald-500" />
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        meta.complexity.average.includes("log")
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20"
                      }`}
                    >
                      {meta.complexity.average}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed line-clamp-1">
                    {meta.shortDescription}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* Category 3: Data Structures Dropdown */}
      {/* =================================================================== */}
      <div className="rounded-xl border border-border/80 bg-secondary/30 overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => toggleCategory("data-structures")}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-secondary/50 hover:bg-secondary/80 transition-colors text-left cursor-pointer group"
          aria-expanded={openCategories["data-structures"]}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
              <Database className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-foreground truncate">
                  Data Structures
                </span>
                {isDsActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                {openCategories["data-structures"] ? "Click to collapse" : `Active: ${ALGORITHMS[selectedAlgorithm]?.name || "Select"}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-[10px] font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
              {DATA_STRUCTURES.length} Structures
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                openCategories["data-structures"] ? "rotate-180 text-blue-500" : ""
              }`}
            />
          </div>
        </button>

        {openCategories["data-structures"] && (
          <div className="p-2.5 flex flex-col gap-1.5 border-t border-border/60 animate-in fade-in slide-in-from-top-1 duration-150">
            {DATA_STRUCTURES.map((dsId) => {
              const meta = ALGORITHMS[dsId];
              const isSelected = selectedAlgorithm === dsId;

              return (
                <button
                  key={dsId}
                  id={`ds-btn-${dsId}`}
                  disabled={disabled}
                  onClick={() => onSelectAlgorithm(dsId)}
                  className={`group relative flex flex-col items-start rounded-xl p-2.5 text-left transition-all ${
                    isSelected
                      ? "bg-blue-500/15 border border-blue-500/60 shadow-sm text-foreground"
                      : "border border-border/60 bg-background/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99] cursor-pointer"}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-bold text-xs text-foreground flex items-center gap-2">
                      {meta.name}
                      {isSelected && (
                        <span className="flex items-end gap-0.5 h-3 px-1 py-0.5 rounded bg-blue-500/20 text-blue-500">
                          <span className="w-0.5 h-1 rounded-xs bg-blue-500" />
                          <span className="w-0.5 h-2 rounded-xs bg-blue-500" />
                          <span className="w-0.5 h-3 rounded-xs bg-blue-500" />
                        </span>
                      )}
                    </span>
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                      LIFO/FIFO O(1)
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed line-clamp-1">
                    {meta.shortDescription}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* Category 3: Complexity Analysis Dropdown */}
      {/* =================================================================== */}
      <div className="rounded-xl border border-border/80 bg-secondary/30 overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => toggleCategory("complexity")}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-secondary/50 hover:bg-secondary/80 transition-colors text-left cursor-pointer group"
          aria-expanded={openCategories.complexity}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 shrink-0 shadow-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-foreground truncate">
                  Complexity Analysis
                </span>
                {isComplexityActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                {openCategories.complexity ? "Click to collapse" : `Active: ${ALGORITHMS[selectedAlgorithm]?.name || "Select"}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-[10px] font-mono font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
              {COMPLEXITY_TOPICS.length} Topics
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                openCategories.complexity ? "rotate-180 text-purple-500" : ""
              }`}
            />
          </div>
        </button>

        {openCategories.complexity && (
          <div className="p-2.5 flex flex-col gap-1.5 border-t border-border/60 animate-in fade-in slide-in-from-top-1 duration-150">
            {COMPLEXITY_TOPICS.map((compId) => {
              const meta = ALGORITHMS[compId];
              const isSelected = selectedAlgorithm === compId;

              return (
                <button
                  key={compId}
                  id={`comp-btn-${compId}`}
                  disabled={disabled}
                  onClick={() => onSelectAlgorithm(compId)}
                  className={`group relative flex flex-col items-start rounded-xl p-2.5 text-left transition-all ${
                    isSelected
                      ? "bg-purple-500/15 border border-purple-500/60 shadow-sm text-foreground"
                      : "border border-border/60 bg-background/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.99] cursor-pointer"}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-bold text-xs text-foreground flex items-center gap-2">
                      {meta.name}
                      {isSelected && (
                        <span className="flex items-end gap-0.5 h-3 px-1 py-0.5 rounded bg-purple-500/20 text-purple-500">
                          <span className="w-0.5 h-1 rounded-xs bg-purple-500" />
                          <span className="w-0.5 h-2 rounded-xs bg-purple-500" />
                          <span className="w-0.5 h-3 rounded-xs bg-purple-500" />
                        </span>
                      )}
                    </span>
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                      {compId === "time-complexity" ? "Big-O Scale" : "Aux Space"}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed line-clamp-1">
                    {meta.shortDescription}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
