import { AlgorithmId, SortingAlgorithmId } from "@/types/sorting";

export interface DerivationStep {
  stepNumber: number;
  title: string;
  formula: string;
  explanation: string;
  highlight?: boolean;
}

export interface AlgorithmDerivation {
  algorithmId: AlgorithmId;
  name: string;
  summary: string;
  bestCase: {
    complexity: string;
    condition: string;
    derivation: string;
  };
  averageCase: {
    complexity: string;
    condition: string;
    derivation: string;
  };
  worstCase: {
    complexity: string;
    condition: string;
    derivation: string;
  };
  spaceComplexity: {
    complexity: string;
    type: "O(1) In-Place" | "O(n) Auxiliary" | "O(log n) Call Stack";
    derivation: string;
  };
  steps: DerivationStep[];
  realWorldIntuition: string;
}

export const COMPLEXITY_DERIVATIONS: Record<SortingAlgorithmId, AlgorithmDerivation> = {
  bubble: {
    algorithmId: "bubble",
    name: "Bubble Sort",
    summary: "Iteratively compares adjacent pairs, bubbling the maximum unsorted value to the rightmost boundary on each pass.",
    bestCase: {
      complexity: "O(n)",
      condition: "Array is already sorted in non-decreasing order.",
      derivation: "Outer loop runs pass 1 (n-1 comparisons). With the early-exit swapped flag, swapped remains false → loop terminates immediately after 1 pass = n-1 comparisons, 0 swaps.",
    },
    averageCase: {
      complexity: "O(n²)",
      condition: "Random initial element distribution.",
      derivation: "On average, each element is out of order with half the elements before it. Total comparisons = n(n-1)/2, and average swaps = n(n-1)/4.",
    },
    worstCase: {
      complexity: "O(n²)",
      condition: "Array is reverse sorted (strictly descending).",
      derivation: "Must perform all n-1 passes. Every single adjacent comparison results in a swap: n(n-1)/2 comparisons and n(n-1)/2 swaps.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      type: "O(1) In-Place",
      derivation: "Only requires a few primitive variables (i, j, n, swapped, temp) for tracking indices. Auxiliary memory is constant regardless of n.",
    },
    steps: [
      {
        stepNumber: 1,
        title: "Nested Loops Counting",
        formula: "Total Comparisons = \\sum_{i=0}^{n-2} (n - i - 1)",
        explanation: "Outer loop runs for i = 0 to n - 2 (n - 1 times). For a given i, the inner loop compares j from 0 to n - i - 2.",
      },
      {
        stepNumber: 2,
        title: "Summation Expansion",
        formula: "C(n) = (n - 1) + (n - 2) + (n - 3) + ... + 2 + 1 + 0",
        explanation: "Pass 0 makes n-1 comparisons; Pass 1 makes n-2 comparisons; down to the last pass which makes 1 comparison.",
      },
      {
        stepNumber: 3,
        title: "Arithmetic Series Closed-Form",
        formula: "C(n) = \\frac{n(n - 1)}{2} = \\frac{n^2 - n}{2} = 0.5n^2 - 0.5n",
        explanation: "Using Gauss's summation formula for the sum of integers from 1 to n-1: S = k(k+1)/2 where k = n-1.",
      },
      {
        stepNumber: 4,
        title: "Asymptotic Dominance",
        formula: "\\lim_{n \\to \\infty} \\frac{0.5n^2 - 0.5n}{n^2} = 0.5 \\implies O(n^2)",
        explanation: "As n grows large, the n² term completely dominates the linear term n and constant multiplier 0.5 is ignored in Big-O.",
        highlight: true,
      },
    ],
    realWorldIntuition: "If you double the array size from 500 to 1,000, comparisons quadruple from ~125,000 to ~500,000.",
  },
  selection: {
    algorithmId: "selection",
    name: "Selection Sort",
    summary: "Repeatedly scans the unsorted partition to find the absolute minimum, then places it at the sorted left edge with exactly one swap.",
    bestCase: {
      complexity: "O(n²)",
      condition: "Any initial permutation (including already sorted).",
      derivation: "Selection sort does NOT adapt to existing sorted order; it must scan all remaining unsorted elements in every round to confirm the minimum.",
    },
    averageCase: {
      complexity: "O(n²)",
      condition: "Random initial permutation.",
      derivation: "Total comparisons = n(n-1)/2, average swaps = n-1.",
    },
    worstCase: {
      complexity: "O(n²)",
      condition: "Any input (comparisons invariant; reverse sorted causes max swaps).",
      derivation: "Comparisons are strictly n(n-1)/2 across all inputs. Swaps are at most n-1.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      type: "O(1) In-Place",
      derivation: "Performs swaps directly in the input array with O(1) auxiliary variables (minIdx, temp).",
    },
    steps: [
      {
        stepNumber: 1,
        title: "Unconditional Inner Loop Scan",
        formula: "C(n) = \\sum_{i=0}^{n-2} \\sum_{j=i+1}^{n-1} 1 = \\sum_{i=0}^{n-2} (n - 1 - i)",
        explanation: "For each position i, it inspects every subsequent element j to test if arr[j] < arr[minIdx].",
      },
      {
        stepNumber: 2,
        title: "Summation Evaluation",
        formula: "C(n) = (n - 1) + (n - 2) + ... + 1 = \\frac{n(n - 1)}{2} = \\frac{n^2 - n}{2}",
        explanation: "Regardless of input ordering, every iteration executes its full loop to ensure no smaller value exists.",
      },
      {
        stepNumber: 3,
        title: "Exact Swap Count Guarantee",
        formula: "S(n) \\le n - 1 \\text{ swaps (Strictly Linear)}",
        explanation: "Unlike Bubble Sort which can make O(n²) swaps, Selection Sort makes at most n - 1 memory writes.",
        highlight: true,
      },
      {
        stepNumber: 4,
        title: "Asymptotic Bound",
        formula: "T(n) = C(n) + S(n) = O(n^2) + O(n) = O(n^2)",
        explanation: "The quadratic comparison count dominates the linear swap count, yielding O(n²) time always.",
      },
    ],
    realWorldIntuition: "Ideal when memory writes are extremely expensive compared to reads, as it guarantees at most n-1 writes.",
  },
  insertion: {
    algorithmId: "insertion",
    name: "Insertion Sort",
    summary: "Builds the sorted array one element at a time by picking the next key and shifting larger sorted elements rightward.",
    bestCase: {
      complexity: "O(n)",
      condition: "Array is already sorted in non-decreasing order.",
      derivation: "Each element i is compared exactly once with arr[i-1]. Since arr[i-1] <= key, the while loop immediately halts with 0 shifts → total work = n-1 comparisons = O(n).",
    },
    averageCase: {
      complexity: "O(n²)",
      condition: "Randomly ordered array.",
      derivation: "On average, each element shifts halfway through the sorted prefix. Total comparisons and shifts ≈ n(n-1)/4 = O(n²).",
    },
    worstCase: {
      complexity: "O(n²)",
      condition: "Array is reverse sorted (strictly descending).",
      derivation: "Each element i must shift past all i preceding elements. Total shifts = 1 + 2 + ... + (n-1) = n(n-1)/2 = O(n²).",
    },
    spaceComplexity: {
      complexity: "O(1)",
      type: "O(1) In-Place",
      derivation: "Shifts occur directly inside the existing array; requires only a single key temporary variable.",
    },
    steps: [
      {
        stepNumber: 1,
        title: "Adaptive Inner While Loop",
        formula: "W(i) = \\text{Number of elements in sorted prefix greater than } \\text{key}_i",
        explanation: "For element at index i, the while loop runs at most i times, but stops as soon as a smaller or equal element is reached.",
      },
      {
        stepNumber: 2,
        title: "Worst-Case Derivation",
        formula: "T_{worst}(n) = \\sum_{i=1}^{n-1} i = 1 + 2 + 3 + ... + (n - 1) = \\frac{n(n - 1)}{2} = O(n^2)",
        explanation: "In reverse order, key must travel to index 0 on every step, making i comparisons and i shifts.",
      },
      {
        stepNumber: 3,
        title: "Adaptive Inversion Bound",
        formula: "T(n) = O(n + I) \\text{ where } I = \\text{number of inversions}",
        explanation: "If an array is nearly sorted with only k inversions, Insertion Sort runs in fast O(n + k) linear time.",
        highlight: true,
      },
    ],
    realWorldIntuition: "The fastest algorithm for small arrays (n ≤ 32) and nearly sorted data, which is why Timsort uses it as a sub-routine.",
  },
  merge: {
    algorithmId: "merge",
    name: "Merge Sort",
    summary: "Recursively divides array into two halves until single elements, then merges sorted subarrays back together in linear time.",
    bestCase: {
      complexity: "O(n log n)",
      condition: "Any input permutation (Guaranteed).",
      derivation: "Division tree always has ⌈log₂ n⌉ levels and merging at each level takes linear time, regardless of data distribution.",
    },
    averageCase: {
      complexity: "O(n log n)",
      condition: "Any input permutation.",
      derivation: "Exact same recursion tree structure across all permutations.",
    },
    worstCase: {
      complexity: "O(n log n)",
      condition: "Any input permutation.",
      derivation: "No input ordering can cause uneven splits or increase tree depth beyond ⌈log₂ n⌉.",
    },
    spaceComplexity: {
      complexity: "O(n)",
      type: "O(n) Auxiliary",
      derivation: "Standard array merge requires an auxiliary buffer of size n to hold merged values before copying back.",
    },
    steps: [
      {
        stepNumber: 1,
        title: "Recurrence Relation Formulation",
        formula: "T(n) = 2T(n / 2) + O(n) \\quad [T(1) = O(1)]",
        explanation: "Dividing array into 2 halves of size n/2 takes 2T(n/2), while merging the two sorted halves takes cn = O(n) comparisons.",
      },
      {
        stepNumber: 2,
        title: "Recursion Tree Depth",
        formula: "\\text{Depth} = \\log_2 n \\text{ levels} \\quad (n \\to n/2 \\to n/4 \\to ... \\to 1)",
        explanation: "Repeated division by 2 reaches base case size 1 after exactly log₂ n steps.",
      },
      {
        stepNumber: 3,
        title: "Work per Level Summation",
        formula: "\\text{Work at Level } k = 2^k \\times O(n / 2^k) = O(n)",
        explanation: "At depth k there are 2^k subarrays each of size n/2^k. Summing work across the entire horizontal slice always equals n.",
      },
      {
        stepNumber: 4,
        title: "Master Theorem / Total Work",
        formula: "T(n) = \\sum_{k=0}^{\\log_2 n} O(n) = O(n) \\times \\log_2 n = O(n \\log n)",
        explanation: "Total time is simply (work per level) × (number of levels) = n log₂ n across all cases.",
        highlight: true,
      },
    ],
    realWorldIntuition: "Guaranteed predictability: for n = 1,000,000, Merge Sort takes ~20 million operations, whereas O(n²) would take 1 trillion operations.",
  },
  quick: {
    algorithmId: "quick",
    name: "Quick Sort",
    summary: "Selects a pivot, partitions elements into smaller and greater halves in-place, then recursively sorts the sub-partitions.",
    bestCase: {
      complexity: "O(n log n)",
      condition: "Pivot repeatedly splits array into two perfectly balanced halves (size n/2).",
      derivation: "Recurrence T(n) = 2T(n/2) + O(n) gives optimal recursion depth log₂ n and O(n log n) work.",
    },
    averageCase: {
      complexity: "O(n log n)",
      condition: "Random pivots or randomly distributed input elements.",
      derivation: "Average recurrence solves to ~1.39 n log₂ n comparisons (only ~39% more than optimal).",
    },
    worstCase: {
      complexity: "O(n²)",
      condition: "Already sorted or reverse sorted array with extreme pivot choice (e.g. Lomuto high pivot).",
      derivation: "Partitions split into sizes 0 and n-1 at every level. Tree depth degrades from log₂ n to n, yielding n + (n-1) + ... + 1 = n(n+1)/2 = O(n²).",
    },
    spaceComplexity: {
      complexity: "O(log n)",
      type: "O(log n) Call Stack",
      derivation: "In-place partition requires O(1) memory, but recursive call stack consumes O(log n) stack frames on average (O(n) worst case).",
    },
    steps: [
      {
        stepNumber: 1,
        title: "Partition Step Work",
        formula: "\\text{Partition}(A, low, high) = O(high - low) = O(m)",
        explanation: "Scanning elements against pivot takes linear time relative to current subarray size m.",
      },
      {
        stepNumber: 2,
        title: "Average Recurrence",
        formula: "T_{avg}(n) = \\frac{2}{n} \\sum_{k=0}^{n-1} T(k) + O(n) = O(n \\log n)",
        explanation: "Averaging over all possible pivot positions yields a balanced tree with depth O(log n).",
      },
      {
        stepNumber: 3,
        title: "Worst-Case Unbalanced Degradation",
        formula: "T_{worst}(n) = T(n - 1) + O(n) = \\sum_{i=1}^n i = \\frac{n(n + 1)}{2} = O(n^2)",
        explanation: "When pivot is always min or max, only 1 element is eliminated per level, turning the tree into a linked list of depth n.",
        highlight: true,
      },
    ],
    realWorldIntuition: "With randomized pivot or median-of-three, Quick Sort is typically 2–3x faster in CPU cache performance than Merge/Heap sort.",
  },
};

/**
 * Closed-form theoretical prediction formulas
 */
export function calculatePredictedOperations(algorithmId: AlgorithmId, n: number) {
  if (n <= 0) {
    return { bestComp: 0, avgComp: 0, worstComp: 0, bestSwaps: 0, worstSwaps: 0, depth: 0, operationName: "Operations" };
  }

  const log2n = Math.log2(n);
  const nLogN = Math.round(n * log2n);
  const worstQuadratic = Math.round((n * (n - 1)) / 2);

  switch (algorithmId) {
    case "bubble":
      return {
        bestComp: n - 1,
        avgComp: worstQuadratic,
        worstComp: worstQuadratic,
        bestSwaps: 0,
        worstSwaps: worstQuadratic,
        depth: n - 1,
        operationName: "Swaps",
      };
    case "selection":
      return {
        bestComp: worstQuadratic,
        avgComp: worstQuadratic,
        worstComp: worstQuadratic,
        bestSwaps: n - 1,
        worstSwaps: n - 1,
        depth: n - 1,
        operationName: "Swaps",
      };
    case "insertion":
      return {
        bestComp: n - 1,
        avgComp: Math.round(worstQuadratic / 2),
        worstComp: worstQuadratic,
        bestSwaps: 0,
        worstSwaps: worstQuadratic,
        depth: n - 1,
        operationName: "Shifts",
      };
    case "merge":
      return {
        bestComp: nLogN,
        avgComp: nLogN,
        worstComp: nLogN,
        bestSwaps: 2 * nLogN, // Buffer writes
        worstSwaps: 2 * nLogN,
        depth: Math.ceil(log2n),
        operationName: "Buffer Writes",
      };
    case "quick":
      return {
        bestComp: nLogN,
        avgComp: Math.round(1.39 * nLogN),
        worstComp: worstQuadratic,
        bestSwaps: Math.round(nLogN / 3),
        worstSwaps: worstQuadratic,
        depth: Math.ceil(log2n),
        operationName: "Swaps",
      };
    case "time-complexity":
      return {
        bestComp: 1,
        avgComp: nLogN,
        worstComp: worstQuadratic,
        bestSwaps: 0,
        worstSwaps: 0,
        depth: Math.ceil(log2n),
        operationName: "Instructions",
      };
    case "space-complexity":
      return {
        bestComp: 1,
        avgComp: Math.ceil(log2n),
        worstComp: n,
        bestSwaps: 0,
        worstSwaps: 0,
        depth: Math.ceil(log2n),
        operationName: "Allocations",
      };
    default:
      return {
        bestComp: 1,
        avgComp: 1,
        worstComp: 1,
        bestSwaps: 0,
        worstSwaps: 0,
        depth: 1,
        operationName: "Operations",
      };
  }
}
