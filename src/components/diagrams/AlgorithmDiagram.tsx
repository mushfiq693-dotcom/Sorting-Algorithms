"use client";

import React from "react";
import { AlgorithmId } from "@/types/sorting";
import { DIAGRAM_CONFIGS } from "@/data/diagrams";
import { BubbleSortTimelineDiagram } from "./BubbleSortTimelineDiagram";
import { SelectionSortSplitDiagram } from "./SelectionSortSplitDiagram";
import { InsertionSortShiftDiagram } from "./InsertionSortShiftDiagram";
import { MergeSortTreeDiagram } from "./MergeSortTreeDiagram";
import { QuickSortTreeDiagram } from "./QuickSortTreeDiagram";
import { ArrayContiguousMemoryDiagram } from "./ArrayContiguousMemoryDiagram";
import { StringMemoryDiagram } from "./StringMemoryDiagram";
import { StackLIFODiagram } from "./StackLIFODiagram";
import { QueueFIFODiagram } from "./QueueFIFODiagram";
import { DequeDiagram } from "./DequeDiagram";
import { TimeComplexityDiagram } from "./TimeComplexityDiagram";
import { SpaceComplexityDiagram } from "./SpaceComplexityDiagram";
import { LinearSearchTimelineDiagram } from "./LinearSearchTimelineDiagram";
import { BinarySearchRangeShrinkingDiagram } from "./BinarySearchRangeShrinkingDiagram";
import { LinkedListPointerDiagram } from "./LinkedListPointerDiagram";
import { HashTableDiagram } from "./HashTableDiagram";
import { BinaryTreeDiagram } from "./BinaryTreeDiagram";
import { BstDiagram } from "./BstDiagram";
import { AvlTreeDiagram } from "./AvlTreeDiagram";
import { HeapDiagram } from "./HeapDiagram";
import { PriorityQueueDiagram } from "./PriorityQueueDiagram";
import { UnionFindDiagram } from "./UnionFindDiagram";
import { TwoPointersDiagram } from "./TwoPointersDiagram";
import { SlidingWindowDiagram } from "./SlidingWindowDiagram";
import { PrefixSumDiagram } from "./PrefixSumDiagram";
import { BinarySearchPatternsDiagram } from "./BinarySearchPatternsDiagram";
import { Image } from "lucide-react";

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
      case "array":
        return <ArrayContiguousMemoryDiagram />;
      case "string":
        return <StringMemoryDiagram />;
      case "deque":
        return <DequeDiagram />;
      case "stack":
        return <StackLIFODiagram />;
      case "queue":
        return <QueueFIFODiagram />;
      case "linked-list":
        return <LinkedListPointerDiagram />;
      case "hash-table":
        return <HashTableDiagram />;
      case "binary-tree":
        return <BinaryTreeDiagram />;
      case "bst":
        return <BstDiagram />;
      case "avl-tree":
        return <AvlTreeDiagram />;
      case "heap":
        return <HeapDiagram />;
      case "priority-queue":
        return <PriorityQueueDiagram />;
      case "union-find":
        return <UnionFindDiagram />;
      case "two-pointers":
        return <TwoPointersDiagram />;
      case "sliding-window":
        return <SlidingWindowDiagram />;
      case "prefix-sum":
        return <PrefixSumDiagram />;
      case "binary-search-patterns":
        return <BinarySearchPatternsDiagram />;
      case "linear-search":
        return <LinearSearchTimelineDiagram />;
      case "binary-search":
        return <BinarySearchRangeShrinkingDiagram />;
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
            <span>The Full Picture • Architectural &amp; Visual Infographic</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
            Interactive Architecture
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
    </div>
  );
}
