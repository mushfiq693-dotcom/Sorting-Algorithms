export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const QUIZZES: Record<string, QuizTopic> = {
  bubble: {
    id: "bubble",
    title: "Bubble Sort Quiz",
    description: "Test your understanding of adjacent comparisons, early exit optimization, and bubble-up mechanics.",
    questions: [
      {
        id: "b1",
        question: "In standard Bubble Sort without early exit, how many total comparisons are performed for an array of size n in the worst case?",
        options: ["n", "n log n", "n(n - 1) / 2", "2^n"],
        correctIndex: 2,
        explanation: "The outer loop runs n-1 times and the inner loop makes (n-1), (n-2), ..., 1 comparisons, summing to n(n - 1) / 2 = O(n²)."
      },
      {
        id: "b2",
        question: "What is the primary purpose of introducing a boolean 'swapped' flag in Bubble Sort?",
        options: [
          "To reduce memory usage from O(n) to O(1)",
          "To allow the algorithm to terminate in O(n) time if the array is already sorted",
          "To make Bubble Sort an unstable sorting algorithm",
          "To double the sorting speed on reverse-sorted inputs"
        ],
        correctIndex: 1,
        explanation: "If an entire pass completes without a single swap, the elements are already in non-decreasing order and the algorithm can break early in O(n) best-case time."
      },
      {
        id: "b3",
        question: "Consider the array [5, 1, 4, 2, 8]. After the very first full pass of Bubble Sort, what will the array look like?",
        options: [
          "[1, 2, 4, 5, 8]",
          "[1, 5, 2, 4, 8]",
          "[1, 4, 2, 5, 8]",
          "[5, 4, 2, 1, 8]"
        ],
        correctIndex: 2,
        explanation: "Tracing step-by-step: (5,1)->[1,5,4,2,8] -> (5,4)->[1,4,5,2,8] -> (5,2)->[1,4,2,5,8] -> (5,8)->[1,4,2,5,8]. The largest element (8) bubbles to the end."
      },
      {
        id: "b4",
        question: "Why is standard Bubble Sort considered a 'stable' sorting algorithm?",
        options: [
          "Because it runs in O(n log n) time on all inputs",
          "Because it swaps adjacent items only when arr[j] > arr[j + 1], never when they are equal",
          "Because it uses zero additional stack frames",
          "Because it always picks the global minimum item first"
        ],
        correctIndex: 1,
        explanation: "Strict inequality (arr[j] > arr[j + 1]) ensures identical values never swap past each other, preserving their initial relative ordering."
      }
    ]
  },
  selection: {
    id: "selection",
    title: "Selection Sort Quiz",
    description: "Test your knowledge of minimum element selection, fixed comparisons, and instability.",
    questions: [
      {
        id: "s1",
        question: "How many swaps does Selection Sort perform in the worst case on an array of size n?",
        options: ["At most n - 1 swaps", "n² swaps", "n log n swaps", "Zero swaps"],
        correctIndex: 0,
        explanation: "Unlike Bubble Sort which can do O(n²) swaps, Selection Sort does at most one swap per outer loop iteration, totaling at most n - 1 swaps."
      },
      {
        id: "s2",
        question: "What is Selection Sort's best-case time complexity when given an already sorted array?",
        options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
        correctIndex: 3,
        explanation: "Selection Sort must always scan the entire unsorted partition to verify the minimum element, so it always performs n(n-1)/2 comparisons = O(n²) even if sorted."
      },
      {
        id: "s3",
        question: "Why is standard array Selection Sort NOT stable?",
        options: [
          "Because it uses divide-and-conquer recursion",
          "Because long-distance swaps can move an element past an identical duplicate element",
          "Because it requires O(n) auxiliary memory",
          "Because it compares adjacent elements only"
        ],
        correctIndex: 1,
        explanation: "For example, in [4a, 4b, 2], the minimum '2' is swapped with '4a', placing '4a' after '4b' -> [2, 4b, 4a], reversing their original order."
      },
      {
        id: "s4",
        question: "In an array [64, 25, 12, 22, 11], what is the state of the array after the 2nd pass of Selection Sort?",
        options: [
          "[11, 12, 22, 25, 64]",
          "[11, 12, 64, 25, 22]",
          "[11, 12, 64, 22, 25]",
          "[11, 25, 12, 22, 64]"
        ],
        correctIndex: 2,
        explanation: "Pass 1 finds min 11, swaps with 64 -> [11, 25, 12, 22, 64]. Pass 2 searches [25, 12, 22, 64], finds min 12, swaps with 25 -> [11, 12, 64, 22, 25]."
      }
    ]
  },
  insertion: {
    id: "insertion",
    title: "Insertion Sort Quiz",
    description: "Test your understanding of key extraction, backwards shifting, and adaptive performance.",
    questions: [
      {
        id: "i1",
        question: "Under what input condition does Insertion Sort achieve its optimal O(n) best-case time complexity?",
        options: [
          "When the array is reverse sorted",
          "When all elements are negative",
          "When the array is already sorted or nearly sorted",
          "Only when the array length is a power of 2"
        ],
        correctIndex: 2,
        explanation: "When already sorted, the inner while loop comparison `arr[j] > key` immediately evaluates to false on the first check, resulting in only 1 comparison per element = O(n)."
      },
      {
        id: "i2",
        question: "How does Insertion Sort make room for the current 'key' element?",
        options: [
          "It swaps the key with the first element of the array",
          "It shifts all elements larger than the key one position to the right",
          "It allocates a new sub-vector in heap memory",
          "It partitions elements around a random pivot"
        ],
        correctIndex: 1,
        explanation: "The while loop copies larger sorted elements rightward (`arr[j+1] = arr[j]`) until the correct insertion index is found."
      },
      {
        id: "i3",
        question: "Why is Insertion Sort often preferred over Merge Sort or Quick Sort for very small arrays (e.g. n <= 16)?",
        options: [
          "It has a lower asymptotic time complexity",
          "It has extremely low constant factors and zero recursion call stack overhead",
          "It uses multi-threading automatically",
          "It guarantees O(log n) swaps"
        ],
        correctIndex: 1,
        explanation: "For small inputs, simple loops with direct memory cache locality outperform recursive function call overhead, which is why production sorts (like Timsort) use Insertion Sort for small partitions."
      },
      {
        id: "i4",
        question: "What is the maximum number of shifts/inversions Insertion Sort will resolve on an array of size n in reverse order?",
        options: ["n - 1", "n log n", "n(n - 1) / 2", "2n"],
        correctIndex: 2,
        explanation: "Every pair of elements is inverted in a reverse-sorted array, requiring 1 + 2 + ... + (n-1) = n(n-1)/2 total shift steps."
      }
    ]
  },
  merge: {
    id: "merge",
    title: "Merge Sort Quiz",
    description: "Test your knowledge of divide-and-conquer recursion, merge step mechanics, and space complexity.",
    questions: [
      {
        id: "m1",
        question: "What is the recurrence relation that models Merge Sort's time complexity?",
        options: [
          "T(n) = T(n - 1) + O(1)",
          "T(n) = 2T(n / 2) + O(n)",
          "T(n) = T(n / 2) + O(1)",
          "T(n) = 2T(n / 2) + O(n²)"
        ],
        correctIndex: 1,
        explanation: "Merge Sort divides into 2 equal subproblems of size n/2 (2T(n/2)) and spends linear time O(n) merging them together."
      },
      {
        id: "m2",
        question: "Why does standard array Merge Sort have a space complexity of O(n)?",
        options: [
          "Because the call stack has n frames",
          "Because it requires an auxiliary temporary array to merge two sorted subarrays without overwriting data",
          "Because each element is copied n times into global variables",
          "Because it uses a 2D matrix internally"
        ],
        correctIndex: 1,
        explanation: "Merging two contiguous sorted subarrays in an array cannot easily be done in-place in linear time without an auxiliary buffer of size O(n)."
      },
      {
        id: "m3",
        question: "Which condition during the merge step ensures that Merge Sort remains stable?",
        options: [
          "Using `arr[left] < arr[right]` (strict inequality)",
          "Using `arr[left] <= arr[right]` (less than or equal)",
          "Sorting the right half before the left half",
          "Always picking the pivot from the middle"
        ],
        correctIndex: 1,
        explanation: "The `<=` ensures that when left and right elements are equal, the element from the left (earlier) subarray is picked first."
      },
      {
        id: "m4",
        question: "In what input scenario does Merge Sort exhibit its worst-case time complexity of O(n log n)?",
        options: [
          "Only when elements are reverse-sorted",
          "Only when all elements are duplicates",
          "On ALL inputs (Best, Average, and Worst cases are all O(n log n))",
          "Only when n is an odd number"
        ],
        correctIndex: 2,
        explanation: "Merge Sort always divides the array into exact halves down to depth log₂ n, and always merges all elements across each level, making it strictly O(n log n) in all cases."
      }
    ]
  },
  quick: {
    id: "quick",
    title: "Quick Sort Quiz",
    description: "Test your mastery of Lomuto partitioning, pivot choices, and worst-case recursion analysis.",
    questions: [
      {
        id: "q1",
        question: "What causes Quick Sort with Lomuto partitioning (last element pivot) to degrade to O(n²) time complexity?",
        options: [
          "When the array contains floating point numbers",
          "When the pivot divides the array into severely unbalanced partitions (e.g. 0 and n-1 elements each time on already sorted data)",
          "When the array size is a power of 2",
          "When recursion stack depth is limited to log n"
        ],
        correctIndex: 1,
        explanation: "If the pivot is always the smallest or largest element, the recursion tree becomes a degenerate line of depth n, taking O(n) work per level = O(n²)."
      },
      {
        id: "q2",
        question: "After one pass of Lomuto partitioning around pivot P, what is guaranteed about P's position?",
        options: [
          "P is placed at index 0",
          "P is placed in its permanent, final sorted position in the array",
          "P is copied into a temporary vector",
          "P is swapped with the middle element"
        ],
        correctIndex: 1,
        explanation: "Partitioning places all smaller elements to the left of P and all larger elements to the right. Thus P is permanently sorted and never moved again."
      },
      {
        id: "q3",
        question: "What is Quick Sort's average-case auxiliary space complexity (call stack space)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 1,
        explanation: "On average, balanced splits result in a recursion tree depth of O(log n), needing O(log n) activation records on the call stack."
      },
      {
        id: "q4",
        question: "Which technique is commonly used in production to prevent Quick Sort from hitting O(n²) on sorted inputs?",
        options: [
          "Switching to Selection Sort",
          "Median-of-three pivot selection or Randomized pivot selection",
          "Doubling the array size before sorting",
          "Running the sort backwards"
        ],
        correctIndex: 1,
        explanation: "Median-of-three (examining first, middle, last elements) avoids picking extreme elements as pivots on pre-sorted or reverse-sorted data."
      }
    ]
  },
  "advanced-analysis": {
    id: "advanced-analysis",
    title: "Advanced DSA Analysis Quiz",
    description: "Deep dive questions on proofs, recurrence trees, stability proofs, and hybrid production sorts.",
    questions: [
      {
        id: "adv1",
        question: "What is the closed-form sum of comparisons for Bubble Sort's worst case: (n-1) + (n-2) + ... + 1?",
        options: ["n² - n", "(n² - n) / 2", "n log n", "2ⁿ - 1"],
        correctIndex: 1,
        explanation: "The arithmetic series sum is n(n - 1) / 2 = 0.5n² - 0.5n, which is asymptotically Θ(n²)."
      },
      {
        id: "adv2",
        question: "Which of the following describes the hybrid sorting strategy used by C++'s `std::sort` (Introsort)?",
        options: [
          "Starts with Quick Sort, falls back to Heap Sort if recursion depth exceeds 2*log(n), and uses Insertion Sort for small subarrays",
          "Uses Bubble Sort for the left half and Merge Sort for the right half",
          "Converts all numbers to binary radix sort first",
          "Exclusively uses pure Selection Sort"
        ],
        correctIndex: 0,
        explanation: "Introsort provides Quick Sort's fast cache performance while guaranteeing worst-case O(n log n) via Heap Sort fallback, and speedups via Insertion Sort on small partitions."
      },
      {
        id: "adv3",
        question: "Why can't any general comparison-based sorting algorithm have a worst-case time complexity better than Ω(n log n)?",
        options: [
          "Because CPU clocks cannot exceed 5 GHz",
          "Because a decision tree with n! permutations has minimum height ⌈log₂(n!)⌉ ≈ n log₂ n - n log₂ e",
          "Because arrays require linear memory traversal",
          "Because swaps take O(log n) time in hardware"
        ],
        correctIndex: 1,
        explanation: "A binary decision tree distinguishing between all n! possible input orderings must have a tree height of at least log₂(n!) = Ω(n log n)."
      },
      {
        id: "adv4",
        question: "Which of the 5 algorithms in our course are guaranteed STABLE in their standard implementations?",
        options: [
          "Quick Sort and Selection Sort",
          "Bubble Sort, Insertion Sort, and Merge Sort",
          "Merge Sort and Selection Sort only",
          "All 5 algorithms are stable"
        ],
        correctIndex: 1,
        explanation: "Bubble, Insertion, and Merge Sort preserve relative ordering of equal keys. Selection Sort and Quick Sort perform long-distance swaps that can violate stability."
      }
    ]
  }
};
