"use client";

import React from "react";
import { AlgorithmId } from "@/types/sorting";
import { DIAGRAM_CONFIGS } from "@/data/diagrams";
import { BubbleSortTimelineDiagram } from "./BubbleSortTimelineDiagram";
import { SelectionSortSplitDiagram } from "./SelectionSortSplitDiagram";
import { InsertionSortShiftDiagram } from "./InsertionSortShiftDiagram";
import { MergeSortTreeDiagram } from "./MergeSortTreeDiagram";
import { QuickSortTreeDiagram } from "./QuickSortTreeDiagram";
import { StackLIFODiagram } from "./StackLIFODiagram";
import { QueueFIFODiagram } from "./QueueFIFODiagram";
import { TimeComplexityDiagram } from "./TimeComplexityDiagram";
import { SpaceComplexityDiagram } from "./SpaceComplexityDiagram";
import { CodeViewer } from "@/components/code/CodeViewer";
import { Image, Sparkles, BookOpen, Calculator, Info } from "lucide-react";

interface AlgorithmDiagramProps {
  algorithmId: AlgorithmId;
}

export function AlgorithmDiagram({ algorithmId }: AlgorithmDiagramProps) {
  const config = DIAGRAM_CONFIGS[algorithmId];

  const renderVisualDiagram = () => {
    switch (algorithmId) {
      case "bubble":
        return <BubbleSortTimelineDiagram />;
      case "selection":
        return <SelectionSortSplitDiagram />;
      case "insertion":
        return <InsertionSortShiftDiagram />;
      case "merge":
        return <MergeSortTreeDiagram />;
      case "quick":
        return <QuickSortTreeDiagram />;
      case "stack":
        return <StackLIFODiagram />;
      case "queue":
        return <QueueFIFODiagram />;
      case "time-complexity":
        return <TimeComplexityDiagram />;
      case "space-complexity":
        return <SpaceComplexityDiagram />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 sm:p-7 backdrop-blur-xl shadow-sm dark:shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Image className="h-4 w-4" />
            <span>The Full Picture • Signature Static Diagram</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Screenshot Ready
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight font-sans">
          {config.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {config.subtitle}
        </p>
      </div>

      {/* Main Visual Infographic Diagram */}
      <div className="w-full">
        {renderVisualDiagram()}
      </div>

      {/* Complexity & Mathematical Annotation Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold">
          <Calculator className="h-4 w-4 text-amber-500 shrink-0" />
          <span>{config.complexityFormula}</span>
        </div>
        <p className="text-[11px] text-amber-700 dark:text-amber-300/80 font-mono">
          {config.complexityExplanation}
        </p>
      </div>

      {/* Code Snippet Block (reusing CodeViewer) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-cyan-500" />
          <span>Core Mechanism Implementation</span>
        </span>
        <div className="h-64 sm:h-72">
          <CodeViewer
            code={config.codeSnippet}
            activeLineNumber={config.highlightedLine}
            algorithmName={config.algorithmId}
          />
        </div>
      </div>

      {/* One-Line Educational Caption */}
      <div className="rounded-xl border border-border bg-secondary/50 p-3.5 flex items-center gap-3">
        <Sparkles className="h-4 w-4 text-cyan-500 shrink-0" />
        <p className="text-xs sm:text-sm font-medium text-foreground font-sans italic">
          &ldquo;{config.caption}&rdquo;
        </p>
      </div>
    </div>
  );
}
