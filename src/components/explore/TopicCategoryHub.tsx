"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlgorithmId } from "@/types/sorting";
import { LEARNING_PATH, LearningStep } from "@/data/learningPath";
import { ALGORITHMS } from "@/data/algorithms";
import {
  BarChart3,
  Network,
  Search,
  Layers,
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Target,
  SlidersHorizontal,
  GitMerge,
  Zap,
  LayoutGrid,
  ListStart,
  Link2,
  ScanLine,
  Focus,
  Timer,
  Cpu,
  Sparkles,
  Binary,
  Hash,
  GitFork,
  Boxes,
} from "lucide-react";

export type CategoryKey = "sorting" | "data-structure" | "tree" | "heap" | "searching" | "complexity" | "technique";

export interface CategoryCardMeta {
  key: CategoryKey;
  title: string;
  countLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  iconBorder: string;
  accentGlow: string;
}

export const CATEGORY_CARDS: CategoryCardMeta[] = [
  {
    key: "sorting",
    title: "Sorting",
    countLabel: "5 Visualizations",
    icon: BarChart3,
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    iconBorder: "border-indigo-500/30",
    accentGlow: "group-hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]",
  },
  {
    key: "data-structure",
    title: "Data Structures",
    countLabel: "8 Visualizations",
    icon: Network,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/30",
    accentGlow: "group-hover:shadow-[0_0_24px_rgba(16,185,129,0.2)]",
  },
  {
    key: "tree",
    title: "Trees",
    countLabel: "3 Visualizations",
    icon: GitFork,
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-500 dark:text-teal-400",
    iconBorder: "border-teal-500/30",
    accentGlow: "group-hover:shadow-[0_0_24px_rgba(20,184,166,0.2)]",
  },
  {
    key: "heap",
    title: "Heaps",
    countLabel: "2 Visualizations",
    icon: Boxes,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBorder: "border-amber-500/30",
    accentGlow: "group-hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]",
  },
  {
    key: "searching",
    title: "Searching",
    countLabel: "2 Visualizations",
    icon: Search,
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-500 dark:text-orange-400",
    iconBorder: "border-orange-500/30",
    accentGlow: "group-hover:shadow-[0_0_24px_rgba(249,115,22,0.2)]",
  },
  {
    key: "complexity",
    title: "Core Concepts",
    countLabel: "2 Visualizations",
    icon: Layers,
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-500 dark:text-purple-400",
    iconBorder: "border-purple-500/30",
    accentGlow: "group-hover:shadow-[0_0_24px_rgba(168,85,247,0.2)]",
  },
  {
    key: "technique",
    title: "Techniques",
    countLabel: "3 Visualizations",
    icon: SlidersHorizontal,
    iconBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
    iconColor: "text-fuchsia-500 dark:text-fuchsia-400",
    iconBorder: "border-fuchsia-500/30",
    accentGlow: "group-hover:shadow-[0_0_24px_rgba(217,70,239,0.2)]",
  },
];

interface TopicVisualMeta {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  iconBorder: string;
}

const TOPIC_VISUALS: Record<AlgorithmId, TopicVisualMeta> = {
  // Sorting (Indigo / Amber palette)
  bubble: {
    icon: ArrowLeftRight,
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    iconBorder: "border-indigo-500/25",
  },
  selection: {
    icon: Target,
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    iconBorder: "border-indigo-500/25",
  },
  insertion: {
    icon: SlidersHorizontal,
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    iconBorder: "border-indigo-500/25",
  },
  merge: {
    icon: GitMerge,
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    iconBorder: "border-indigo-500/25",
  },
  quick: {
    icon: Zap,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBorder: "border-amber-500/25",
  },

  // Data Structures (Emerald / Green palette)
  array: {
    icon: LayoutGrid,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },
  string: {
    icon: Binary,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },
  stack: {
    icon: Layers,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },
  queue: {
    icon: ListStart,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },
  "linked-list": {
    icon: Link2,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },
  deque: {
    icon: ArrowLeftRight,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },
  "hash-table": {
    icon: Hash,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },
  "binary-tree": {
    icon: GitFork,
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-500 dark:text-teal-400",
    iconBorder: "border-teal-500/25",
  },
  bst: {
    icon: GitFork,
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-500 dark:text-teal-400",
    iconBorder: "border-teal-500/25",
  },
  "avl-tree": {
    icon: GitFork,
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-500 dark:text-teal-400",
    iconBorder: "border-teal-500/25",
  },
  heap: {
    icon: Boxes,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBorder: "border-amber-500/25",
  },
  "priority-queue": {
    icon: Boxes,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBorder: "border-amber-500/25",
  },
  "union-find": {
    icon: Network,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },

  // Searching (Orange / Rust palette)
  "linear-search": {
    icon: ScanLine,
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-500 dark:text-orange-400",
    iconBorder: "border-orange-500/25",
  },
  "binary-search": {
    icon: Focus,
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-500 dark:text-orange-400",
    iconBorder: "border-orange-500/25",
  },

  // Complexity (Purple / Violet palette)
  "time-complexity": {
    icon: Timer,
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-500 dark:text-purple-400",
    iconBorder: "border-purple-500/25",
  },
  "space-complexity": {
    icon: Cpu,
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-500 dark:text-purple-400",
    iconBorder: "border-purple-500/25",
  },

  // Techniques (Fuchsia / Rose palette)
  "two-pointers": {
    icon: ArrowLeftRight,
    iconBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
    iconColor: "text-fuchsia-500 dark:text-fuchsia-400",
    iconBorder: "border-fuchsia-500/25",
  },
  "sliding-window": {
    icon: ScanLine,
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    iconBorder: "border-indigo-500/25",
  },
  "prefix-sum": {
    icon: Layers,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    iconBorder: "border-emerald-500/25",
  },
};

// Descriptions from Coddy Tech screenshot for algorithms, plus matched descriptions for others
const TOPIC_DESCRIPTIONS: Record<AlgorithmId, string> = {
  // Sorting (Exact text from Screenshot 2)
  insertion: "Watch insertion sort build a sorted section one element at a time.",
  selection: "See selection sort repeatedly pick the smallest element and place it.",
  merge: "Watch merge sort divide the array and merge the pieces back in order.",
  bubble: "See adjacent elements compared and swapped until the array is sorted.",
  quick: "Watch quick sort partition around a pivot and recurse on each side.",

  // Data Structures
  array: "Watch contiguous memory cells store and access indexed elements instantly.",
  string: "Watch contiguous character bytes store text, reverse in-place, and slide dynamic windows.",
  stack: "See elements pushed and popped from the top following Last-In, First-Out order.",
  queue: "Watch elements enter the back and exit the front in First-In, First-Out order.",
  deque: "Watch dual-end push and pop operations with circular buffer wrap-around and monotonic sliding window.",
  "linked-list": "See nodes connected by pointers traverse, insert, and delete dynamically.",
  "hash-table": "Watch hash functions map keys directly to buckets with collision resolution and O(1) lookups.",
  "binary-tree": "Explore hierarchical branching, tree anatomy, DFS traversals (pre/in/post), and BFS level orders.",
  bst: "Explore Left < Root < Right invariant, O(log n) dynamic search, insertion, and 3-case deletion with in-order successors.",
  "avl-tree": "Watch self-balancing tree rotations (LL, RR, LR, RL) and Balance Factor telemetry keep height strictly O(log n).",
  heap: "Explore array-as-tree representation, O(1) peek, O(log n) sift-up/down, and linear O(n) heapify.",
  "priority-queue": "Watch priority-based task dispatching, O(1) peek, O(log n) enqueue/dequeue, and Decrease-Key priority mutations.",
  "union-find": "Watch disjoint set forests merge, path compression flatten trees to O(1), and cycle detection protect networks.",

  // Searching
  "linear-search": "Watch linear search scan elements one by one from start to end for a match.",
  "binary-search": "See binary search repeatedly halve the sorted range until target is found.",

  // Complexity
  "time-complexity": "Watch operations scale from O(1) constant to O(2ⁿ) exponential growth.",
  "space-complexity": "See auxiliary memory allocation and recursion stack footprint scale with input.",

  // Techniques
  "two-pointers": "Watch converging and reader-writer pointers traverse sorted arrays and calculate water containers in O(n) time.",
  "sliding-window": "Slide fixed and dynamic contiguous windows over arrays and strings, updating telemetry in amortized O(n) time.",
  "prefix-sum": "Precompute cumulative prefix arrays for O(1) range sum queries and use difference arrays for O(1) batch interval updates.",
};

interface SortingComparisonRow {
  name: string;
  id: AlgorithmId;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
}

// Exact match of Screenshot 2's "Sorting comparison" table
const SORTING_COMPARISON: SortingComparisonRow[] = [
  {
    name: "Insertion Sort",
    id: "insertion",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
  },
  {
    name: "Selection Sort",
    id: "selection",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
  },
  {
    name: "Merge Sort",
    id: "merge",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: true,
  },
  {
    name: "Bubble Sort",
    id: "bubble",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
  },
  {
    name: "Quick Sort",
    id: "quick",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    stable: false,
  },
];

interface DataStructureComparisonRow {
  name: string;
  id: AlgorithmId;
  access: string;
  search: string;
  insertion: string;
  deletion: string;
  space: string;
}

const DATA_STRUCTURE_COMPARISON: DataStructureComparisonRow[] = [
  {
    name: "Array",
    id: "array",
    access: "O(1)",
    search: "O(n)",
    insertion: "O(n)",
    deletion: "O(n)",
    space: "O(n)",
  },
  {
    name: "String",
    id: "string",
    access: "O(1)",
    search: "O(n)",
    insertion: "O(n)",
    deletion: "O(n)",
    space: "O(n)",
  },
  {
    name: "Stack",
    id: "stack",
    access: "O(n)",
    search: "O(n)",
    insertion: "O(1)",
    deletion: "O(1)",
    space: "O(n)",
  },
  {
    name: "Queue",
    id: "queue",
    access: "O(n)",
    search: "O(n)",
    insertion: "O(1)",
    deletion: "O(1)",
    space: "O(n)",
  },
  {
    name: "Deque",
    id: "deque",
    access: "O(n)",
    search: "O(n)",
    insertion: "O(1)",
    deletion: "O(1)",
    space: "O(n)",
  },
  {
    name: "Linked List",
    id: "linked-list",
    access: "O(n)",
    search: "O(n)",
    insertion: "O(1)",
    deletion: "O(1)",
    space: "O(n)",
  },
  {
    name: "Hash Table",
    id: "hash-table",
    access: "N/A",
    search: "O(1) avg / O(n) worst",
    insertion: "O(1) avg / O(n) worst",
    deletion: "O(1) avg / O(n) worst",
    space: "O(n)",
  },
  {
    name: "Union-Find (DSU)",
    id: "union-find",
    access: "O(α(n))",
    search: "O(α(n)) [Find]",
    insertion: "O(α(n)) [Union]",
    deletion: "N/A",
    space: "O(n)",
  },
];

interface TreeComparisonRow {
  name: string;
  id: AlgorithmId;
  type: string;
  lookup: string;
  insert: string;
  delete: string;
  traversal: string;
}

const TREE_COMPARISON: TreeComparisonRow[] = [
  {
    name: "Binary Tree (Standard)",
    id: "binary-tree",
    type: "Hierarchical (At most 2 children)",
    lookup: "O(n)",
    insert: "O(n) BFS / O(1) leaf",
    delete: "O(n)",
    traversal: "DFS (NLR, LNR, LRN) & BFS",
  },
  {
    name: "Binary Search Tree (BST)",
    id: "bst",
    type: "Sorted Key (Left < Root < Right)",
    lookup: "O(log n) avg / O(n) worst",
    insert: "O(log n) avg / O(n) worst",
    delete: "O(log n) avg / O(n) worst",
    traversal: "In-Order yields sorted sequence",
  },
  {
    name: "AVL Tree (Balanced BST)",
    id: "avl-tree",
    type: "Height-Balanced (|BF| ≤ 1)",
    lookup: "O(log n) guaranteed",
    insert: "O(log n) with rotations",
    delete: "O(log n) with rotations",
    traversal: "Guaranteed O(log n) height",
  },
  {
    name: "Binary Heap (Priority Queue)",
    id: "heap",
    type: "Complete Tree (Heap Property)",
    lookup: "O(1) Min/Max",
    insert: "O(log n) percolate up",
    delete: "O(log n) percolate down",
    traversal: "Level-Order array mapping",
  },
];

interface HeapComparisonRow {
  name: string;
  id: AlgorithmId;
  variant: string;
  peek: string;
  insert: string;
  extract: string;
  heapify: string;
  representation: string;
}

const HEAP_COMPARISON: HeapComparisonRow[] = [
  {
    name: "Min-Heap",
    id: "heap",
    variant: "Parent ≤ Children (Global min at root)",
    peek: "O(1) Min",
    insert: "O(log n) Sift-Up",
    extract: "O(log n) Sift-Down",
    heapify: "O(n) Bottom-Up",
    representation: "0-Indexed Array: P=⌊(i-1)/2⌋, L=2i+1, R=2i+2",
  },
  {
    name: "Max-Heap",
    id: "heap",
    variant: "Parent ≥ Children (Global max at root)",
    peek: "O(1) Max",
    insert: "O(log n) Sift-Up",
    extract: "O(log n) Sift-Down",
    heapify: "O(n) Bottom-Up",
    representation: "0-Indexed Array: P=⌊(i-1)/2⌋, L=2i+1, R=2i+2",
  },
  {
    name: "Priority Queue",
    id: "priority-queue",
    variant: "Key-Priority Tuple extraction",
    peek: "O(1) Top Priority",
    insert: "O(log n) Enqueue",
    extract: "O(log n) Dequeue Extreme",
    heapify: "O(n) Batch Build",
    representation: "Underlying Binary Heap Container",
  },
  {
    name: "Binary Search Tree (Comparison)",
    id: "bst",
    variant: "Left < Root < Right (Total Ordering)",
    peek: "O(log n) avg / O(n) worst",
    insert: "O(log n) avg / O(n) worst",
    extract: "O(log n) avg / O(n) worst",
    heapify: "O(n log n) sequential insert",
    representation: "Pointer-Linked Dynamic Nodes",
  },
];

interface SearchComparisonRow {
  name: string;
  id: AlgorithmId;
  best: string;
  average: string;
  worst: string;
  space: string;
  sortedRequired: boolean;
}

const SEARCH_COMPARISON: SearchComparisonRow[] = [
  {
    name: "Linear Search",
    id: "linear-search",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    sortedRequired: false,
  },
  {
    name: "Binary Search",
    id: "binary-search",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
    sortedRequired: true,
  },
];

interface ComplexityComparisonRow {
  notation: string;
  name: string;
  growth: string;
  example: string;
}

const COMPLEXITY_COMPARISON: ComplexityComparisonRow[] = [
  {
    notation: "O(1)",
    name: "Constant Time",
    growth: "Immediate, unaffected by input size",
    example: "Array index lookup, Stack push/pop",
  },
  {
    notation: "O(log n)",
    name: "Logarithmic Time",
    growth: "Divides problem space in half each step",
    example: "Binary search, Balanced BST lookup",
  },
  {
    notation: "O(n)",
    name: "Linear Time",
    growth: "Grows in direct proportion to input",
    example: "Linear search, Array traversal",
  },
  {
    notation: "O(n log n)",
    name: "Linearithmic Time",
    growth: "Optimal comparison-based sorting",
    example: "Merge sort, Quick sort (average)",
  },
  {
    notation: "O(n²)",
    name: "Quadratic Time",
    growth: "Nested iterations over input",
    example: "Bubble sort, Selection sort, Insertion sort",
  },
];

interface TechniqueComparisonRow {
  pattern: string;
  id: AlgorithmId;
  time: string;
  space: string;
  prerequisite: string;
  classicProblems: string;
}

const TECHNIQUE_COMPARISON: TechniqueComparisonRow[] = [
  {
    pattern: "Opposite Converging (L → ← R)",
    id: "two-pointers",
    time: "O(n)",
    space: "O(1)",
    prerequisite: "Sorted Array (Monotonicity)",
    classicProblems: "Two Sum II, 3Sum, Valid Palindrome",
  },
  {
    pattern: "Container With Most Water",
    id: "two-pointers",
    time: "O(n)",
    space: "O(1)",
    prerequisite: "Height Array (Bottleneck Invariant)",
    classicProblems: "Container With Most Water, Trapping Rain",
  },
  {
    pattern: "Fast & Slow (Reader-Writer)",
    id: "two-pointers",
    time: "O(n)",
    space: "O(1)",
    prerequisite: "Sequential Stream / In-Place Partition",
    classicProblems: "Remove Duplicates, Move Zeroes",
  },
  {
    pattern: "Floyd Cycle Detection (Tortoise & Hare)",
    id: "two-pointers",
    time: "O(n)",
    space: "O(1)",
    prerequisite: "Functional Graph / Linked List Loop",
    classicProblems: "Linked List Cycle, Find Duplicate Number",
  },
  {
    pattern: "Fixed-Size Window (K-Slide)",
    id: "sliding-window",
    time: "O(n)",
    space: "O(1)",
    prerequisite: "Known Subarray Length K",
    classicProblems: "Max Average Subarray I, Permutation in String",
  },
  {
    pattern: "Dynamic Window (Expand & Shrink)",
    id: "sliding-window",
    time: "O(n)",
    space: "O(1) / O(k)",
    prerequisite: "Monotonicity (Sum or Frequency Property)",
    classicProblems: "Min Size Subarray Sum, Longest Substring Without Repeating",
  },
  {
    pattern: "Monotonic Deque Window",
    id: "sliding-window",
    time: "O(n)",
    space: "O(k)",
    prerequisite: "Sliding Window Extrema (Min/Max)",
    classicProblems: "Sliding Window Maximum (LC 239)",
  },
  {
    pattern: "1D Range Sum Query (P[R+1] - P[L])",
    id: "prefix-sum",
    time: "O(1) query",
    space: "O(n)",
    prerequisite: "Static Array (Immutable Queries)",
    classicProblems: "Range Sum Query Immutable, Subarray Sums Divisible by K",
  },
  {
    pattern: "2D Matrix Inclusion-Exclusion",
    id: "prefix-sum",
    time: "O(1) query",
    space: "O(m · n)",
    prerequisite: "Static 2D Grid",
    classicProblems: "Range Sum Query 2D Immutable, Matrix Block Sum",
  },
  {
    pattern: "Difference Array (Batch Range Updates)",
    id: "prefix-sum",
    time: "O(1) update",
    space: "O(n)",
    prerequisite: "Offline Batch Interval Updates",
    classicProblems: "Car Pooling, Corporate Flight Bookings",
  },
  {
    pattern: "Prefix Sum + Frequency Hash Map",
    id: "prefix-sum",
    time: "O(n)",
    space: "O(n)",
    prerequisite: "Contiguous Subarray Target with Negative Numbers",
    classicProblems: "Subarray Sum Equals K (LC 560), Contiguous Array",
  },
];

interface TopicCategoryHubProps {
  mode?: "visualizer" | "learn" | "standalone";
  selectedCategory?: CategoryKey | "all" | null;
  onSelectCategory?: (category: CategoryKey | null) => void;
  activeTopicId?: AlgorithmId;
  onSelectTopic?: (topicId: AlgorithmId) => void;
  className?: string;
  showSubtitle?: boolean;
}

export function TopicCategoryHub({
  mode = "visualizer",
  selectedCategory: controlledCategory,
  onSelectCategory,
  activeTopicId,
  onSelectTopic,
  className = "",
  showSubtitle = true,
}: TopicCategoryHubProps) {
  const [internalCategory, setInternalCategory] = useState<CategoryKey | null>(null);

  const currentCategory =
    controlledCategory !== undefined ? controlledCategory : internalCategory;

  const handleCategoryClick = (key: CategoryKey) => {
    if (onSelectCategory) {
      if (currentCategory === key) {
        onSelectCategory(null);
      } else {
        onSelectCategory(key);
      }
    } else {
      setInternalCategory(internalCategory === key ? null : key);
    }
  };

  const handleBackToCategories = () => {
    if (onSelectCategory) {
      onSelectCategory(null);
    } else {
      setInternalCategory(null);
    }
  };

  const activeCatMeta =
    currentCategory && currentCategory !== "all"
      ? CATEGORY_CARDS.find((c) => c.key === currentCategory)
      : null;

  const activeTopics: LearningStep[] =
    currentCategory && currentCategory !== "all"
      ? LEARNING_PATH.filter((step) => step.category === currentCategory)
      : [];

  const isLearnMode = mode === "learn";

  return (
    <section className={`w-full ${className}`}>
      {/* ========================================================
          VIEW 1: CATEGORY CARDS ONLY
          In visualizer mode: shown when no category is selected.
          In learn mode: shown as the category filter.
          ======================================================== */}
      {isLearnMode || !currentCategory ? (
        <div>
          {/* 6 Main Category Cards (Balanced 2x3 Responsive Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 max-w-5xl mx-auto mb-6">
            {CATEGORY_CARDS.map((cat) => {
              const isSelected = currentCategory === cat.key;
              const IconComponent = cat.icon;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer flex items-center gap-3.5 sm:gap-4 select-none group active:scale-[0.99] ${
                    isSelected
                      ? "border-2 border-primary bg-primary/[0.08] shadow-[0_0_24px_rgba(201,169,98,0.2)] ring-1 ring-primary/40"
                      : `border border-border/80 bg-card/75 dark:bg-[#18181b]/80 hover:bg-card hover:border-primary/50 hover:shadow-lg ${cat.accentGlow}`
                  }`}
                >
                  {/* Modern glowing icon container */}
                  <div
                    className={`h-12 w-12 sm:h-13 sm:w-13 rounded-2xl flex items-center justify-center shrink-0 border ${cat.iconBg} ${cat.iconColor} ${cat.iconBorder} shadow-sm group-hover:scale-105 transition-transform duration-200`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>

                  {/* Text content (Sub-text removed, clean modern tile layout) */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-bold text-base sm:text-lg text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
                        {cat.title}
                      </h3>
                      {isSelected ? (
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center text-xs font-mono text-muted-foreground/90 whitespace-nowrap">
                      <span className="whitespace-nowrap">{cat.countLabel}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================
           VIEW 2: DEDICATED CATEGORY TOPICS INTERFACE
           Appears when user clicks on a category card (e.g. Sorting).
           Outer box removed, time/space pills removed, clean descriptions,
           and comparison table added below!
           ======================================================== */
        <div className="max-w-5xl mx-auto">
          {/* Header Bar: Back Button & Category Details ONLY (No other main categories) */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border/70">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToCategories}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>All Categories</span>
              </button>

              <div className="h-5 w-px bg-border" />

              <div className="flex items-center gap-2.5 min-w-0">
                {activeCatMeta && (
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${activeCatMeta.iconBg} ${activeCatMeta.iconColor} ${activeCatMeta.iconBorder}`}
                  >
                    <activeCatMeta.icon className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-heading font-bold text-base sm:text-lg text-foreground flex items-center gap-2 flex-wrap">
                    <span>{activeCatMeta?.title}</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border whitespace-nowrap">
                      {activeTopics.length} Visualizations
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Topics Grid (Full box CTA, #01 and Start Here removed, separate button removed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {activeTopics.map((step) => {
              const meta = ALGORITHMS[step.id];
              const isCurrentTopic = activeTopicId === step.id;
              const visual = TOPIC_VISUALS[step.id] || {
                icon: Sparkles,
                iconBg: "bg-primary/10",
                iconColor: "text-primary",
                iconBorder: "border-primary/25",
              };
              const TopicIcon = visual.icon;

              return (
                <Link
                  key={step.id}
                  href={`/visualizer?algo=${step.id}`}
                  className={`rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 transition-all duration-200 group cursor-pointer active:scale-[0.99] select-none ${
                    isCurrentTopic
                      ? "border-primary bg-primary/[0.08] shadow-[0_0_24px_rgba(201,169,98,0.2)] ring-1 ring-primary/40"
                      : "border-border/80 bg-card/75 dark:bg-[#18181b]/80 hover:bg-card hover:border-primary/50 hover:shadow-lg"
                  }`}
                >
                  {/* Topic-Relevant Modern Icon */}
                  <div
                    className={`h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 border ${visual.iconBg} ${visual.iconColor} ${visual.iconBorder} shadow-sm group-hover:scale-110 transition-transform duration-200 mt-0.5`}
                  >
                    <TopicIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  {/* Title & Description */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                        {step.name}
                      </h3>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="mt-1 text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                      {TOPIC_DESCRIPTIONS[step.id] || meta?.shortDescription}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Comparison Table Section (Exact match of Screenshot 2) */}
          {currentCategory === "sorting" && (
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-5">
                Sorting comparison
              </h3>
              <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <th className="py-3.5 px-4 sm:px-6">Algorithm</th>
                      <th className="py-3.5 px-4">Best</th>
                      <th className="py-3.5 px-4">Average</th>
                      <th className="py-3.5 px-4">Worst</th>
                      <th className="py-3.5 px-4">Space</th>
                      <th className="py-3.5 px-4 sm:px-6">Stable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-xs">
                    {SORTING_COMPARISON.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/visualizer?algo=${row.id}`} className="hover:underline">
                            {row.name}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.best}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.average}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.worst}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.space}</td>
                        <td className="py-3.5 px-4 sm:px-6 font-sans">
                          {row.stable ? (
                            <span className="font-semibold text-emerald-500 dark:text-emerald-400">Yes</span>
                          ) : (
                            <span className="font-medium text-muted-foreground">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentCategory === "data-structure" && (
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-5">
                Data structures comparison
              </h3>
              <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <th className="py-3.5 px-4 sm:px-6">Data Structure</th>
                      <th className="py-3.5 px-4">Access</th>
                      <th className="py-3.5 px-4">Search</th>
                      <th className="py-3.5 px-4">Insertion</th>
                      <th className="py-3.5 px-4">Deletion</th>
                      <th className="py-3.5 px-4 sm:px-6">Space</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-xs">
                    {DATA_STRUCTURE_COMPARISON.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/visualizer?algo=${row.id}`} className="hover:underline">
                            {row.name}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.access}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.search}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.insertion}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.deletion}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-foreground/90">{row.space}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentCategory === "tree" && (
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-5">
                Tree structures &amp; variants comparison
              </h3>
              <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <th className="py-3.5 px-4 sm:px-6">Tree Variant</th>
                      <th className="py-3.5 px-4">Ordering Invariant</th>
                      <th className="py-3.5 px-4">Search</th>
                      <th className="py-3.5 px-4">Insertion</th>
                      <th className="py-3.5 px-4">Deletion</th>
                      <th className="py-3.5 px-4 sm:px-6">Traversal Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-xs">
                    {TREE_COMPARISON.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/visualizer?algo=${row.id}`} className="hover:underline">
                            {row.name}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/90 font-sans">{row.type}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.lookup}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.insert}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.delete}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-foreground/90 font-sans">{row.traversal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentCategory === "heap" && (
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-5">
                Heap structures &amp; variants comparison
              </h3>
              <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <th className="py-3.5 px-4 sm:px-6">Variant / Structure</th>
                      <th className="py-3.5 px-4">Ordering Invariant</th>
                      <th className="py-3.5 px-4">Peek Extreme</th>
                      <th className="py-3.5 px-4">Insert</th>
                      <th className="py-3.5 px-4">Extract</th>
                      <th className="py-3.5 px-4">Build / Heapify</th>
                      <th className="py-3.5 px-4 sm:px-6">Internal Layout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-xs">
                    {HEAP_COMPARISON.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/visualizer?algo=${row.id}`} className="hover:underline">
                            {row.name}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/90 font-sans">{row.variant}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.peek}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.insert}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.extract}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.heapify}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-foreground/90 font-sans">{row.representation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentCategory === "searching" && (
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-5">
                Searching comparison
              </h3>
              <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <th className="py-3.5 px-4 sm:px-6">Algorithm</th>
                      <th className="py-3.5 px-4">Best</th>
                      <th className="py-3.5 px-4">Average</th>
                      <th className="py-3.5 px-4">Worst</th>
                      <th className="py-3.5 px-4">Space</th>
                      <th className="py-3.5 px-4 sm:px-6">Sorted Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-xs">
                    {SEARCH_COMPARISON.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/visualizer?algo=${row.id}`} className="hover:underline">
                            {row.name}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.best}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.average}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.worst}</td>
                        <td className="py-3.5 px-4 text-foreground/90">{row.space}</td>
                        <td className="py-3.5 px-4 sm:px-6 font-sans">
                          {row.sortedRequired ? (
                            <span className="font-semibold text-amber-500">Yes</span>
                          ) : (
                            <span className="font-medium text-muted-foreground">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentCategory === "complexity" && (
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-5">
                Core complexity comparison
              </h3>
              <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <th className="py-3.5 px-4 sm:px-6">Order</th>
                      <th className="py-3.5 px-4">Classification</th>
                      <th className="py-3.5 px-4">Growth Rate</th>
                      <th className="py-3.5 px-4 sm:px-6">Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs">
                    {COMPLEXITY_COMPARISON.map((row) => (
                      <tr
                        key={row.notation}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-foreground">
                          <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
                            {row.notation}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans font-semibold text-foreground/90">{row.name}</td>
                        <td className="py-3.5 px-4 text-muted-foreground">{row.growth}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-muted-foreground">{row.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentCategory === "technique" && (
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-5">
                Two-pointer paradigms &amp; invariant comparison
              </h3>
              <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-border/70 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <th className="py-3.5 px-4 sm:px-6">Paradigm / Pattern</th>
                      <th className="py-3.5 px-4">Time</th>
                      <th className="py-3.5 px-4">Space</th>
                      <th className="py-3.5 px-4">Prerequisite / Invariant</th>
                      <th className="py-3.5 px-4 sm:px-6">Classic Problems</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs">
                    {TECHNIQUE_COMPARISON.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/visualizer?algo=${row.id}`} className="hover:underline">
                            {row.pattern}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-500 font-bold">{row.time}</td>
                        <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">{row.space}</td>
                        <td className="py-3.5 px-4 text-foreground/90 font-sans">{row.prerequisite}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-muted-foreground font-sans">{row.classicProblems}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
