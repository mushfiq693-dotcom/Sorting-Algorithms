import { AlgorithmId } from "@/types/sorting";

export interface LearningStep {
  id: AlgorithmId;
  order: number;
  name: string;
  badge: string;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  reason: string;
  analogy: string;
  idea: string;
  sampleArray: number[];
  codeBlocks: {
    title: string;
    lines: string;
    explanation: string;
  }[];
  complexityWhy: {
    time: string;
    space: string;
    stability: string;
  };
}

export const LEARNING_PATH: LearningStep[] = [
  {
    id: "bubble",
    order: 1,
    name: "Bubble Sort",
    badge: "Start Here",
    estimatedTime: "~10 min",
    difficulty: "Beginner",
    reason: "Start here. Simplest possible mechanism: compare neighbors, swap if wrong order.",
    analogy: "Think of air bubbles rising to the surface of water — in every pass, the heaviest (largest) unsorted element bubbles up to the very end.",
    idea: "Bubble Sort walks through the list from left to right, comparing pairs of adjacent elements. If an element is greater than the one immediately after it, they trade places. After each full pass, the biggest remaining number is guaranteed to be in its correct final spot.",
    sampleArray: [29, 10, 14, 37, 13, 22, 45, 8],
    codeBlocks: [
      {
        title: "Outer Loop & Early Exit Flag",
        lines: "for (int i = 0; i < n - 1; i++) {\n    bool swapped = false;",
        explanation: "Runs up to n - 1 times. If an entire pass completes without making a single swap, the list is already sorted and we can stop immediately.",
      },
      {
        title: "Inner Adjacent Comparisons",
        lines: "for (int j = 0; j < n - i - 1; j++) {\n    if (arr[j] > arr[j + 1]) {",
        explanation: "Compares adjacent neighbors. The `- i` skips the elements at the end that are already in their final sorted positions.",
      },
      {
        title: "Swapping Elements",
        lines: "    swap(arr[j], arr[j + 1]);\n    swapped = true;\n}",
        explanation: "Swaps the two elements if the left one is bigger, and marks swapped = true so the loop knows work was done.",
      },
    ],
    complexityWhy: {
      time: "Two nested loops, each running up to n times, result in roughly n × n = O(n²) comparisons in the worst case. If already sorted, it finishes in O(n) thanks to the swapped flag.",
      space: "It modifies the array directly without allocating additional memory arrays, making space complexity O(1) (In-place).",
      stability: "Stable because it only swaps when arr[j] is strictly strictly greater than arr[j + 1], preserving original order of duplicate values.",
    },
  },
  {
    id: "selection",
    order: 2,
    name: "Selection Sort",
    badge: "Find the Minimum",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Same difficulty tier, different strategy: find-the-minimum instead of swap-as-you-go.",
    analogy: "Like browsing a shelf of books: you scan all of them from left to right to find the shortest one, then place it in the first position.",
    idea: "Selection Sort splits the array into a sorted portion on the left and an unsorted portion on the right. In each round, it scans the entire unsorted portion to find the absolute minimum value, and makes exactly one swap to place it at the beginning.",
    sampleArray: [35, 12, 48, 19, 7, 60, 24, 15],
    codeBlocks: [
      {
        title: "Outer Partition Loop",
        lines: "for (int i = 0; i < n - 1; i++) {\n    int minIdx = i;",
        explanation: "Index i marks the start of the unsorted portion. We assume arr[i] is the smallest until we scan the rest.",
      },
      {
        title: "Finding the Smallest Element",
        lines: "for (int j = i + 1; j < n; j++) {\n    if (arr[j] < arr[minIdx]) minIdx = j;\n}",
        explanation: "Scans every remaining element to the right. Whenever a smaller value is found, its index is remembered in minIdx.",
      },
      {
        title: "Single Swap per Pass",
        lines: "swap(arr[i], arr[minIdx]);",
        explanation: "After finding the true minimum for this pass, performs exactly one swap to put it into slot i.",
      },
    ],
    complexityWhy: {
      time: "Always scans the entire remaining list regardless of initial array order. (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons, resulting in strictly O(n²) time.",
      space: "O(1) auxiliary space because it sorts completely in-place.",
      stability: "Not stable in default implementation because swapping across long distances can jump past identical items.",
    },
  },
  {
    id: "insertion",
    order: 3,
    name: "Insertion Sort",
    badge: "Hand-Sorting Cards",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Introduces shifting instead of swapping. Closest to how humans sort by hand.",
    analogy: "Like sorting playing cards in your hand: you take the next unsorted card ('key') and slide existing cards over to the right until you find where it belongs.",
    idea: "Insertion Sort builds a sorted section one item at a time. It picks up the next unsorted element ('key') and shifts all larger elements in the sorted portion one position to the right, creating a slot to insert the key.",
    sampleArray: [24, 13, 9, 45, 18, 32, 7, 50],
    codeBlocks: [
      {
        title: "Key Extraction Loop",
        lines: "for (int i = 1; i < n; i++) {\n    int key = arr[i];\n    int j = i - 1;",
        explanation: "Takes the current element arr[i] as the key and prepares to search backwards through the sorted sub-array [0..i-1].",
      },
      {
        title: "Shifting Larger Elements",
        lines: "while (j >= 0 && arr[j] > key) {\n    arr[j + 1] = arr[j];\n    j--;\n}",
        explanation: "As long as elements are larger than the key, shifts them one spot to the right to make room.",
      },
      {
        title: "Inserting the Key",
        lines: "arr[j + 1] = key;",
        explanation: "Drops the key into the open slot. Sub-array [0..i] is now completely sorted.",
      },
    ],
    complexityWhy: {
      time: "Worst case is O(n²) when reverse sorted (each item shifts all the way left). Best case is O(n) on nearly-sorted data because the while loop breaks immediately.",
      space: "O(1) auxiliary space as it shifts elements directly inside the array.",
      stability: "Stable because it stops shifting when it encounters an identical item (arr[j] > key), never reordering duplicate values.",
    },
  },
  {
    id: "merge",
    order: 4,
    name: "Merge Sort",
    badge: "Divide & Conquer",
    estimatedTime: "~25 min",
    difficulty: "Intermediate",
    reason: "First recursive algorithm here. Introduces divide-and-conquer thinking.",
    analogy: "Like organizing two neat stacks of alphabetically sorted papers: you simply compare the top paper of each stack and take the smaller one until both stacks are merged.",
    idea: "Merge Sort uses divide-and-conquer. It recursively splits the array into two halves until each sub-array has only 1 element (which is inherently sorted), then zips the sorted halves back together in order.",
    sampleArray: [38, 27, 43, 3, 9, 82, 10, 19],
    codeBlocks: [
      {
        title: "Recursive Division (Divide)",
        lines: "if (left >= right) return;\nint mid = left + (right - left) / 2;\nmergeSort(arr, left, mid);\nmergeSort(arr, mid + 1, right);",
        explanation: "Splits the array in half and sorts each half recursively until base case (left >= right) is reached.",
      },
      {
        title: "Comparing Subarray Pointers (Conquer)",
        lines: "while (i <= mid && j <= right) {\n    if (arr[i] <= arr[j]) temp.push_back(arr[i++]);\n    else temp.push_back(arr[j++]);\n}",
        explanation: "Compares the smallest unpicked items from left and right halves and appends the smaller one into temp.",
      },
      {
        title: "Writing Back Merged Values",
        lines: "for (int k = left; k <= right; k++) arr[k] = temp[k - left];",
        explanation: "Copies the ordered items from temp back into the original array interval [left..right].",
      },
    ],
    complexityWhy: {
      time: "The recursion tree has log₂(n) levels of division, and each level performs O(n) total merging work. Thus, time complexity is guaranteed O(n log n) in all cases.",
      space: "Requires a temporary array of size O(n) to hold merged elements before copying back.",
      stability: "Stable because when elements are equal (arr[i] <= arr[j]), the left element is selected first.",
    },
  },
  {
    id: "quick",
    order: 5,
    name: "Quick Sort",
    badge: "In-Place Partitioning",
    estimatedTime: "~30 min",
    difficulty: "Advanced",
    reason: "Builds on Merge Sort's recursion, adds the harder idea of in-place partitioning.",
    analogy: "Like picking a student in the classroom as the benchmark: everyone shorter moves to the left side of the room, and everyone taller moves to the right.",
    idea: "Quick Sort picks an element called a 'pivot' and partitions the array around it: all smaller items move left, all larger items move right. Once partitioned, the pivot is in its permanent position, and we sort left and right partitions recursively.",
    sampleArray: [33, 10, 55, 71, 29, 14, 42, 60],
    codeBlocks: [
      {
        title: "Pivot Selection & Lomuto Partitioning",
        lines: "int pivot = arr[high];\nint i = low - 1;\nfor (int j = low; j < high; j++) {\n    if (arr[j] < pivot) {\n        i++;\n        swap(arr[i], arr[j]);\n    }\n}",
        explanation: "Scans with pointer j. Whenever arr[j] is less than pivot, expands the smaller-items region i and swaps arr[i] with arr[j].",
      },
      {
        title: "Placing Pivot into Final Slot",
        lines: "swap(arr[i + 1], arr[high]);\nreturn i + 1;",
        explanation: "Places the pivot right between the small and large regions (at index i + 1). Pivot is now permanently sorted.",
      },
      {
        title: "Recursive Subarray Sorting",
        lines: "if (low < high) {\n    int pi = partition(arr, low, high);\n    quickSort(arr, low, pi - 1);\n    quickSort(arr, pi + 1, high);\n}",
        explanation: "Recursively partitions the sub-array to the left of the pivot and the sub-array to the right.",
      },
    ],
    complexityWhy: {
      time: "Average case is O(n log n) with balanced partitions. Worst case is O(n²) if an unbalanced pivot is picked on already-sorted input (tree depth becomes n).",
      space: "O(log n) average recursion call stack space (can degrade to O(n) in worst case), but 0 extra array memory required (In-place).",
      stability: "Not stable because partitioning swaps elements across wide distances over the pivot.",
    },
  },
];

export interface GlossaryTerm {
  term: string;
  category: "Fundamentals" | "Properties" | "Recursion";
  definition: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Comparison",
    category: "Fundamentals",
    definition: "Evaluating two values (e.g. asking 'is A greater than B?') to decide their relative order.",
  },
  {
    term: "Swap",
    category: "Fundamentals",
    definition: "Exchanging the positions of two elements in an array using a temporary holding variable.",
  },
  {
    term: "In-Place",
    category: "Properties",
    definition: "An algorithm that rearranges items inside the original array using only O(1) or minimal extra memory.",
  },
  {
    term: "Stable",
    category: "Properties",
    definition: "Preserves the original relative order of elements that have equal values or keys.",
  },
  {
    term: "Time Complexity",
    category: "Fundamentals",
    definition: "A mathematical estimate of how the number of operations grows as the input size n increases.",
  },
  {
    term: "Space Complexity",
    category: "Fundamentals",
    definition: "The amount of extra working memory an algorithm needs relative to the input size n.",
  },
  {
    term: "Recursion",
    category: "Recursion",
    definition: "A problem-solving method where a function breaks a large problem into smaller instances and calls itself to solve them.",
  },
  {
    term: "Base Case",
    category: "Recursion",
    definition: "The simplest condition where a recursive function stops calling itself and returns immediately (e.g. an array with 1 element).",
  },
  {
    term: "Pivot",
    category: "Recursion",
    definition: "A chosen reference element used in Quick Sort to split other elements into 'smaller' and 'larger' groups.",
  },
  {
    term: "Partition",
    category: "Recursion",
    definition: "Rearranging a section of an array so that items smaller than the pivot end up on one side and larger items on the other.",
  },
  {
    term: "Divide and Conquer",
    category: "Recursion",
    definition: "A strategy that breaks a large array into sub-problems, solves each sub-problem, and combines their solutions.",
  },
  {
    term: "Subarray",
    category: "Fundamentals",
    definition: "A contiguous slice or portion of an array bounded by a starting index and an ending index.",
  },
];
