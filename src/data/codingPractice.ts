import { AlgorithmId, SortingAlgorithmId } from "@/types/sorting";

export interface CodingChallenge {
  algorithmId: AlgorithmId;
  name: string;
  badge: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  task: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  expectedComplexity: {
    time: string;
    space: string;
  };
}

export const CODING_CHALLENGES: Record<SortingAlgorithmId, CodingChallenge> = {
  bubble: {
    algorithmId: "bubble",
    name: "Bubble Sort",
    badge: "Beginner Practice",
    difficulty: "Beginner",
    description: "Implement the classic Bubble Sort algorithm with early exit optimization in TypeScript.",
    task: "Write a function `bubbleSort(arr: number[]): number[]` that sorts an array of numbers in ascending order. You may mutate the array in-place or return a new sorted copy.",
    starterCode: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  // TODO: Implement Bubble Sort with early break optimization
  // 1. Iterate with outer loop i from 0 to n - 1
  // 2. Track whether any swap happened in this pass
  // 3. Iterate with inner loop j from 0 to n - i - 2
  // 4. If arr[j] > arr[j + 1], swap them
  // 5. If no swaps occurred in a full pass, break early!
  
  return arr;
}`,
    solutionCode: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    hints: [
      "Remember that after pass i, the largest i elements are already settled at the end of the array, so the inner loop can stop at n - i - 1.",
      "Track a boolean `swapped = false` before each inner loop pass. Set it to `true` on any swap. If it remains `false` after the pass, the array is already sorted!"
    ],
    expectedComplexity: {
      time: "O(n) best case, O(n²) average & worst case",
      space: "O(1) auxiliary space (In-place)"
    }
  },
  selection: {
    algorithmId: "selection",
    name: "Selection Sort",
    badge: "Beginner Practice",
    difficulty: "Beginner",
    description: "Implement Selection Sort by finding the minimum element in the unsorted partition and swapping it.",
    task: "Write a function `selectionSort(arr: number[]): number[]` that sorts numbers in ascending order using Selection Sort.",
    starterCode: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  // TODO: Implement Selection Sort
  // 1. Outer loop i from 0 to n - 1
  // 2. Assume minIdx = i
  // 3. Inner loop j from i + 1 to n - 1 to find the true minimum
  // 4. Swap arr[i] with arr[minIdx]
  
  return arr;
}`,
    solutionCode: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}`,
    hints: [
      "In each round i, scan indices i + 1 to n - 1 to find the index of the minimum element.",
      "Only perform a swap after the inner loop finishes scanning the entire unsorted partition."
    ],
    expectedComplexity: {
      time: "O(n²) in all cases (always n(n-1)/2 comparisons)",
      space: "O(1) auxiliary space (In-place)"
    }
  },
  insertion: {
    algorithmId: "insertion",
    name: "Insertion Sort",
    badge: "Beginner Practice",
    difficulty: "Beginner",
    description: "Implement card-hand Insertion Sort by extracting keys and shifting larger elements rightwards.",
    task: "Write a function `insertionSort(arr: number[]): number[]` that sorts numbers in ascending order using Insertion Sort.",
    starterCode: `function insertionSort(arr: number[]): number[] {
  const n = arr.length;
  // TODO: Implement Insertion Sort
  // 1. Outer loop i from 1 to n - 1
  // 2. Extract key = arr[i], set j = i - 1
  // 3. While j >= 0 and arr[j] > key, shift arr[j + 1] = arr[j] and decrement j
  // 4. Place key at arr[j + 1]
  
  return arr;
}`,
    solutionCode: `function insertionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    hints: [
      "Remember to start the outer loop at index 1 (a single element at index 0 is already sorted by definition).",
      "Inside the while loop, shift `arr[j]` to `arr[j + 1]`, and finally drop `key` into `arr[j + 1]`."
    ],
    expectedComplexity: {
      time: "O(n) best case (already sorted), O(n²) worst case",
      space: "O(1) auxiliary space (In-place)"
    }
  },
  merge: {
    algorithmId: "merge",
    name: "Merge Sort",
    badge: "Intermediate Practice",
    difficulty: "Intermediate",
    description: "Implement recursive Divide and Conquer Merge Sort in TypeScript.",
    task: "Write a function `mergeSort(arr: number[]): number[]` that recursively divides the array and merges sorted halves.",
    starterCode: `function mergeSort(arr: number[]): number[] {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr;

  // TODO: Implement Merge Sort
  // 1. Find midpoint mid = Math.floor(arr.length / 2)
  // 2. Recursively sort left half and right half
  // 3. Merge the two sorted halves into a single sorted array
  
  return arr;
}`,
    solutionCode: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // Merge helper
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}`,
    hints: [
      "Use `arr.slice(0, mid)` and `arr.slice(mid)` to divide the array.",
      "During the merge step, compare `left[i] <= right[j]` (the `<=` preserves stability) and push the smaller one into the result array."
    ],
    expectedComplexity: {
      time: "Guaranteed O(n log n) in all cases",
      space: "O(n) auxiliary memory for subarray slices / buffers"
    }
  },
  quick: {
    algorithmId: "quick",
    name: "Quick Sort",
    badge: "Advanced Practice",
    difficulty: "Advanced",
    description: "Implement Quick Sort with partition logic around a pivot element.",
    task: "Write a function `quickSort(arr: number[]): number[]` that partitions and sorts an array in ascending order.",
    starterCode: `function quickSort(arr: number[]): number[] {
  // Base case
  if (arr.length <= 1) return arr;

  // TODO: Implement Quick Sort
  // 1. Pick a pivot (e.g. arr[arr.length - 1] or arr[0])
  // 2. Partition elements into left (< pivot), equal (== pivot), right (> pivot)
  // 3. Recursively call quickSort on left and right
  // 4. Return [...quickSort(left), ...equal, ...quickSort(right)]
  
  return arr;
}`,
    solutionCode: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left: number[] = [];
  const equal: number[] = [];
  const right: number[] = [];

  for (const num of arr) {
    if (num < pivot) left.push(num);
    else if (num > pivot) right.push(num);
    else equal.push(num);
  }

  return [...quickSort(left), ...equal, ...quickSort(right)];
}`,
    hints: [
      "For a clean array-based TypeScript implementation, partitioning into `left`, `equal`, and `right` handles duplicate elements cleanly.",
      "Combine the recursively sorted `quickSort(left)`, `equal`, and `quickSort(right)`."
    ],
    expectedComplexity: {
      time: "O(n log n) average case, O(n²) worst case on degenerate pivots",
      space: "O(log n) average recursion depth"
    }
  }
};

export interface CodingTestCase {
  name: string;
  input: number[];
  expected: number[];
}

export const STANDARD_PRACTICE_TEST_CASES: CodingTestCase[] = [
  { name: "Random Array", input: [29, 10, 14, 37, 13, 22, 45, 8], expected: [8, 10, 13, 14, 22, 29, 37, 45] },
  { name: "Already Sorted Array", input: [1, 2, 3, 4, 5, 6, 7, 8], expected: [1, 2, 3, 4, 5, 6, 7, 8] },
  { name: "Reverse Sorted Array", input: [8, 7, 6, 5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5, 6, 7, 8] },
  { name: "Array with Duplicates", input: [5, 2, 8, 2, 5, 1, 9, 8], expected: [1, 2, 2, 5, 5, 8, 8, 9] },
  { name: "Single Element Array", input: [42], expected: [42] },
  { name: "Empty Array", input: [], expected: [] }
];
