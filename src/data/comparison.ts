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
