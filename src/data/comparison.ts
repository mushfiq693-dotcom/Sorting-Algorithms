export interface AlgorithmComparisonData {
  id: string;
  name: string;
  bestTime: string;
  avgTime: string;
  worstTime: string;
  space: string;
  spaceNote?: string;
  stable: boolean;
  inPlace: boolean;
  adaptive: boolean;
  divideAndConquer: boolean;
  bestUseCase: string;
  guidance: string;
}

export const COMPARISON_TABLE_DATA: AlgorithmComparisonData[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    bestTime: "O(n)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    adaptive: true,
    divideAndConquer: false,
    bestUseCase: "Educational demonstration, extremely small or nearly-sorted datasets.",
    guidance:
      "Best used as an introductory educational baseline for understanding sorting concepts and invariants. Rarely used in production due to high comparison and swap overhead on larger datasets.",
  },
  {
    id: "selection",
    name: "Selection Sort",
    bestTime: "O(n²)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    adaptive: false,
    divideAndConquer: false,
    bestUseCase: "Systems where memory write operations are significantly more expensive than reads.",
    guidance:
      "Useful when minimizing the number of memory writes is critical (does at most O(n) swaps). However, because it always makes O(n²) comparisons regardless of initial array order, it is generally outperformed by Insertion Sort.",
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    bestTime: "O(n)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    adaptive: true,
    divideAndConquer: false,
    bestUseCase: "Small datasets (n < 20), nearly-sorted arrays, online streaming data.",
    guidance:
      "Ideal for small arrays or datasets that are already substantially sorted. Many hybrid production sorting algorithms (such as Timsort in Python and Java, or Introsort in C++ std::sort) switch to Insertion Sort for small subarrays.",
  },
  {
    id: "merge",
    name: "Merge Sort",
    bestTime: "O(n log n)",
    avgTime: "O(n log n)",
    worstTime: "O(n log n)",
    space: "O(n)",
    stable: true,
    inPlace: false,
    adaptive: false,
    divideAndConquer: true,
    bestUseCase: "External sorting (disk files), linked lists, when guaranteed O(n log n) and stability are mandatory.",
    guidance:
      "Choose Merge Sort when you need strict worst-case performance guarantees of O(n log n) and stability is required. It is standard for sorting linked lists and external files that do not fit into RAM.",
  },
  {
    id: "quick",
    name: "Quick Sort",
    bestTime: "O(n log n)",
    avgTime: "O(n log n)",
    worstTime: "O(n²)",
    space: "O(log n)",
    spaceNote: "O(log n) average recursion depth, degrades to O(n) worst case on pathological pivot choices.",
    stable: false,
    inPlace: true,
    adaptive: false,
    divideAndConquer: true,
    bestUseCase: "General-purpose in-memory sorting of primitive types where cache locality matters.",
    guidance:
      "The practical default for fast in-memory array sorting due to superior cache locality and small hidden constant factors. Avoid naive pivot implementations on already-sorted data, or use median-of-three / randomized pivoting.",
  },
];

export interface DataStructureComparisonData {
  id: string;
  name: string;
  category: string;
  invariant: string;
  insertion: string;
  deletion: string;
  peek: string;
  access: string;
  search: string;
  space: string;
  bestUseCase: string;
  tradeoffs: string;
}

export const DATA_STRUCTURE_COMPARISON_DATA: DataStructureComparisonData[] = [
  {
    id: "stack",
    name: "Stack",
    category: "LIFO Container",
    invariant: "Last-In, First-Out (LIFO)",
    insertion: "O(1) [Push to Top]",
    deletion: "O(1) [Pop from Top]",
    peek: "O(1) [Top/Peek]",
    access: "O(n) [Restricted to Top]",
    search: "O(n)",
    space: "O(n) total, O(1) auxiliary",
    bestUseCase: "Function call stacks, recursion, undo/redo buffers, syntax bracket validation, DFS graph traversal.",
    tradeoffs: "Guarantees O(1) top access with zero element shifting. Cannot inspect or delete arbitrary middle elements without popping.",
  },
  {
    id: "queue",
    name: "Queue (Circular Buffer)",
    category: "FIFO Container",
    invariant: "First-In, First-Out (FIFO)",
    insertion: "O(1) [Enqueue at Rear]",
    deletion: "O(1) [Dequeue from Front]",
    peek: "O(1) [Front/Peek]",
    access: "O(n) [Restricted to Front]",
    search: "O(n)",
    space: "O(n) total, O(1) auxiliary",
    bestUseCase: "Breadth-First Search (BFS), task scheduling queues, asynchronous message buffers, printer spoolers.",
    tradeoffs: "Modulo pointer wrapping avoids O(n) array element shifts. Fixed capacity in array implementations unless dynamically resized.",
  },
  {
    id: "array",
    name: "Array (Contiguous Buffer)",
    category: "Random Access Sequence",
    invariant: "Contiguous Memory Indexing",
    insertion: "O(n) at middle/front, O(1) amortized append",
    deletion: "O(n) at middle/front, O(1) at end",
    peek: "O(1) at any index",
    access: "O(1) [Direct Indexing]",
    search: "O(n) unsorted, O(log n) sorted",
    space: "O(n)",
    bestUseCase: "Frequent random access by index, lookup tables, mathematical matrices, cache-sensitive tight loops.",
    tradeoffs: "Blazing fast O(1) random access and cache locality, but expensive O(n) insertions and deletions in the middle.",
  },
  {
    id: "linked-list",
    name: "Singly Linked List",
    category: "Dynamic Pointer Chain",
    invariant: "Node Pointer References",
    insertion: "O(1) at head / known node, O(n) at tail",
    deletion: "O(1) at head / known node",
    peek: "O(1) at head",
    access: "O(n) [Sequential Pointer Hop]",
    search: "O(n)",
    space: "O(n) + Pointer Overhead",
    bestUseCase: "Frequent head insertions/deletions, unbounded dynamic sizing, building blocks for stacks and queues.",
    tradeoffs: "Dynamic memory without fixed bounds, but poor CPU cache locality and extra memory per node for pointer references.",
  },
];
