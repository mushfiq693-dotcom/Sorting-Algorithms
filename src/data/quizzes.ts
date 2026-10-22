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
    title: "Bubble Sort Knowledge Quiz",
    description: "Test your deep understanding of adjacent comparisons, early exit optimization, boundary invariants, and stability.",
    questions: [
      {
        id: "b1",
        question: "In standard Bubble Sort without early exit, how many total comparisons are performed for an array of size n in the worst case?",
        options: ["n", "n log n", "n(n - 1) / 2", "2^n"],
        correctIndex: 2,
        explanation: "The outer loop runs n - 1 times and the inner loop makes (n - 1), (n - 2), ..., 1 comparisons, summing to n(n - 1) / 2 = O(n²)."
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
        explanation: "Tracing step-by-step: (5,1) -> [1,5,4,2,8] -> (5,4) -> [1,4,5,2,8] -> (5,2) -> [1,4,2,5,8] -> (5,8) -> [1,4,2,5,8]. The largest element (8) bubbles to the end."
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
      },
      {
        id: "b5",
        question: "In the inner loop of Bubble Sort, why is the loop upper bound `j < n - i - 1` rather than `j < n - 1`?",
        codeSnippet: "for (int i = 0; i < n - 1; i++) {\n    for (int j = 0; j < n - i - 1; j++) {\n        if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);\n    }\n}",
        options: [
          "To avoid array index out of bounds on the first pass",
          "Because after each pass i, the last i elements are already in their permanent sorted positions",
          "To allow the sort to handle negative integers",
          "To convert the algorithm into recursive divide-and-conquer"
        ],
        correctIndex: 1,
        explanation: "After i passes, the i largest elements have already bubbled to the end of the array. Checking them again is redundant."
      },
      {
        id: "b6",
        question: "If an array of size n contains all identical elements (e.g. [7, 7, 7, 7, 7]), how many swaps and passes will an optimized Bubble Sort execute?",
        options: [
          "0 swaps and 1 pass",
          "n(n - 1) / 2 swaps and n - 1 passes",
          "n swaps and n passes",
          "0 swaps and n - 1 passes"
        ],
        correctIndex: 0,
        explanation: "Because arr[j] > arr[j + 1] is false for all identical pairs, 0 swaps occur. The early-exit flag `swapped` remains false, stopping after exactly 1 pass in O(n) time."
      },
      {
        id: "b7",
        question: "What is the worst-case space complexity (auxiliary memory) of Bubble Sort?",
        options: ["O(1) Auxiliary Space (In-Place)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 0,
        explanation: "Bubble Sort rearranges elements directly within the original array using only a single temporary variable for swapping, requiring O(1) auxiliary space."
      }
    ]
  },
  selection: {
    id: "selection",
    title: "Selection Sort Knowledge Quiz",
    description: "Test your knowledge of minimum element selection, fixed comparisons, memory writes, and instability.",
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
        explanation: "Selection Sort must always scan the entire unsorted partition to verify the minimum element, so it always performs n(n - 1) / 2 comparisons = O(n²) even if sorted."
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
        explanation: "For example, in [4a, 4b, 2], the minimum '2' is swapped with '4a', placing '4a' after '4b' -> [2, 4b, 4a], reversing their original relative order."
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
      },
      {
        id: "s5",
        question: "In what real-world hardware scenario is Selection Sort advantageous over Bubble Sort and Insertion Sort?",
        options: [
          "When sorting billions of rows in memory",
          "When write/erase operations to physical memory (e.g. Flash EEPROM) are extremely expensive compared to read operations",
          "When maximum multi-core CPU parallelism is required",
          "When stable sorting is strictly necessary"
        ],
        correctIndex: 1,
        explanation: "Selection Sort performs at most O(n) memory writes (swaps), minimizing hardware wear on Flash memory where write/erase cycles degrade hardware life."
      },
      {
        id: "s6",
        question: "Consider this Selection Sort code snippet. What bug occurs if `minIndex` is not updated inside the condition?",
        codeSnippet: "for (int i = 0; i < n - 1; i++) {\n    int minIndex = i;\n    for (int j = i + 1; j < n; j++) {\n        if (arr[j] < arr[minIndex]) {\n            // missing minIndex = j\n        }\n    }\n    swap(arr[i], arr[minIndex]);\n}",
        options: [
          "It crashes with IndexOutOfBoundsException",
          "Every element will simply swap with itself, leaving the array completely unsorted",
          "It sorts the array in descending order",
          "It causes an infinite loop"
        ],
        correctIndex: 1,
        explanation: "Without updating `minIndex = j`, `minIndex` remains `i`, meaning `swap(arr[i], arr[i])` is executed on every iteration, leaving the array unchanged."
      },
      {
        id: "s7",
        question: "What is the total number of comparisons made by Selection Sort on an array of size n = 6?",
        options: ["15", "30", "6", "36"],
        correctIndex: 0,
        explanation: "Formula: n(n - 1) / 2 = 6 × 5 / 2 = 15 comparisons, regardless of whether the array was initially sorted, reverse sorted, or random."
      }
    ]
  },
  insertion: {
    id: "insertion",
    title: "Insertion Sort Knowledge Quiz",
    description: "Test your understanding of key extraction, backwards shifting, adaptive performance, and online data streams.",
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
        explanation: "The while loop copies larger sorted elements rightward (`arr[j + 1] = arr[j]`) until the correct insertion index is found."
      },
      {
        id: "i3",
        question: "Why is Insertion Sort widely used in production hybrid algorithms (like Timsort and Introsort) for small subarrays (n <= 16)?",
        options: [
          "It has lower asymptotic time complexity than Quick Sort",
          "It has minimal constant factor overhead, high CPU cache locality, and zero recursion overhead",
          "It uses GPU acceleration automatically",
          "It guarantees O(log n) swaps"
        ],
        correctIndex: 1,
        explanation: "For small partitions, simple sequential memory shifts run directly inside fast CPU L1 cache with zero recursive call stack overhead."
      },
      {
        id: "i4",
        question: "What is the maximum number of shifts/inversions Insertion Sort will resolve on an array of size n in reverse order?",
        options: ["n - 1", "n log n", "n(n - 1) / 2", "2n"],
        correctIndex: 2,
        explanation: "Every pair of elements is inverted in a reverse-sorted array, requiring 1 + 2 + ... + (n - 1) = n(n - 1) / 2 total shift steps."
      },
      {
        id: "i5",
        question: "What does it mean that Insertion Sort is an 'online' sorting algorithm?",
        options: [
          "It requires an active internet connection to download sorting keys",
          "It can sort a list in real time as elements are received one-by-one from a continuous data stream",
          "It only runs inside a web browser JavaScript engine",
          "It requires a distributed database cluster"
        ],
        correctIndex: 1,
        explanation: "An online algorithm processes pieces of the input as they arrive without needing the entire dataset upfront. New elements can simply be inserted into the already sorted prefix."
      },
      {
        id: "i6",
        question: "Given the sorted prefix [12, 24, 36, 48] and a new key = 20, what is the sequence of shifts executed to insert 20?",
        options: [
          "48 shifts to index 4, 36 shifts to index 3, 24 shifts to index 2, then 20 is placed at index 1",
          "12 is swapped with 20 immediately",
          "All elements are shifted left by one index",
          "20 is appended to the end of the array"
        ],
        correctIndex: 0,
        explanation: "48 > 20 (shift), 36 > 20 (shift), 24 > 20 (shift), but 12 < 20 (stop). 20 is written into position j + 1 = 1 resulting in [12, 20, 24, 36, 48]."
      },
      {
        id: "i7",
        question: "Is standard Insertion Sort stable, and why?",
        options: [
          "Yes, because the shifting loop stops as soon as `arr[j] <= key`, preserving duplicate key order",
          "No, because shifting can displace equal elements",
          "No, because it does not use auxiliary buffers",
          "Yes, but only if the array size is even"
        ],
        correctIndex: 0,
        explanation: "Because the while condition is strictly `arr[j] > key`, elements equal to key are not shifted past it, keeping identical elements in their original relative order."
      }
    ]
  },
  merge: {
    id: "merge",
    title: "Merge Sort Knowledge Quiz",
    description: "Test your knowledge of divide-and-conquer recursion, merge step mechanics, auxiliary space, and stability proofs.",
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
          "Because it requires an auxiliary temporary buffer to merge two sorted subarrays without overwriting active data",
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
        explanation: "The `<=` ensures that when left and right elements are equal, the element from the left (earlier) subarray is picked first, preserving original order."
      },
      {
        id: "m4",
        question: "In what input scenario does Merge Sort exhibit its worst-case time complexity of O(n log n)?",
        options: [
          "Only when elements are reverse-sorted",
          "Only when all elements are duplicates",
          "On ALL inputs (Best, Average, and Worst cases are all strictly O(n log n))",
          "Only when n is an odd number"
        ],
        correctIndex: 2,
        explanation: "Merge Sort always divides the array into exact halves down to depth log₂ n, and always merges all elements across each level, making it strictly O(n log n) in all cases."
      },
      {
        id: "m5",
        question: "Why is Merge Sort the preferred sorting algorithm for Singly Linked Lists?",
        options: [
          "Because linked list nodes can be merged by rewiring next pointers in O(1) auxiliary space without allocating arrays",
          "Because linked lists allow O(1) random array indexing",
          "Because Merge Sort runs in O(n) on linked lists",
          "Because Quick Sort cannot run on linked lists"
        ],
        correctIndex: 0,
        explanation: "For linked lists, elements can be re-linked in-place in O(1) extra space without copying elements into temporary arrays, solving Merge Sort's main memory drawback."
      },
      {
        id: "m6",
        question: "What is the total depth of the recursion tree when Merge Sort is executed on an array of size n = 1024?",
        options: ["10 levels (since log₂(1024) = 10)", "1024 levels", "512 levels", "1 level"],
        correctIndex: 0,
        explanation: "At each step, n is halved: 1024 -> 512 -> 256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1. Total tree depth is log₂(1024) = 10."
      },
      {
        id: "m7",
        question: "During the merge step of two sorted subarrays Left=[3, 8] and Right=[2, 7], what is the exact order in which elements are merged into the target array?",
        options: [
          "2, then 3, then 7, then 8",
          "3, then 2, then 8, then 7",
          "8, then 7, then 3, then 2",
          "2, then 8, then 3, then 7"
        ],
        correctIndex: 0,
        explanation: "Compare 3 vs 2 -> pick 2. Compare 3 vs 7 -> pick 3. Compare 8 vs 7 -> pick 7. Remaining 8 copied -> [2, 3, 7, 8]."
      }
    ]
  },
  quick: {
    id: "quick",
    title: "Quick Sort Knowledge Quiz",
    description: "Test your mastery of Lomuto partitioning, pivot choices, worst-case recursion analysis, and cache locality.",
    questions: [
      {
        id: "q1",
        question: "What causes Quick Sort with Lomuto partitioning (last element pivot) to degrade to O(n²) time complexity?",
        options: [
          "When the array contains floating point numbers",
          "When the pivot divides the array into severely unbalanced partitions (e.g. 0 and n - 1 elements each time on already sorted data)",
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
      },
      {
        id: "q5",
        question: "Why is Quick Sort generally faster in practice than Merge Sort, even though both have O(n log n) average time?",
        options: [
          "Quick Sort has a lower constant factor, operates in-place without dynamic array allocations, and exhibits superior CPU cache locality",
          "Quick Sort skips half the elements during partitioning",
          "Quick Sort runs in O(n) on random arrays",
          "Quick Sort does not use comparisons"
        ],
        correctIndex: 0,
        explanation: "Quick Sort modifies memory in-place and reads sequential memory blocks, fitting snugly inside CPU L1/L2 data caches without the memory allocation overhead of Merge Sort."
      },
      {
        id: "q6",
        question: "How can Tail Call Elimination be applied to Quick Sort to guarantee O(log n) worst-case call stack space?",
        options: [
          "By always recurring on the smaller partition first and handling the larger partition with an iterative loop",
          "By converting recursion into Bubble Sort",
          "By allocating memory on the heap instead of stack",
          "By using multithreading for all calls"
        ],
        correctIndex: 0,
        explanation: "Recurring on the smaller subarray (at most n/2 size) guarantees the stack depth will never exceed log₂(n), while the remaining part is processed iteratively."
      },
      {
        id: "q7",
        question: "Is standard Lomuto / Hoare Quick Sort stable?",
        options: [
          "No, because elements are swapped over long distances across the pivot, which can alter the relative order of duplicate keys",
          "Yes, it is strictly stable on all inputs",
          "Yes, provided median-of-three pivot is used",
          "No, because it uses recursion"
        ],
        correctIndex: 0,
        explanation: "During partitioning, elements are swapped across large index distances without regard to duplicate key order, making standard Quick Sort non-stable."
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
        question: "What is the closed-form sum of comparisons for Bubble Sort's worst case: (n - 1) + (n - 2) + ... + 1?",
        options: ["n² - n", "(n² - n) / 2", "n log n", "2ⁿ - 1"],
        correctIndex: 1,
        explanation: "The arithmetic series sum is n(n - 1) / 2 = 0.5n² - 0.5n, which is asymptotically Θ(n²)."
      },
      {
        id: "adv2",
        question: "Which of the following describes the hybrid sorting strategy used by C++'s `std::sort` (Introsort)?",
        options: [
          "Starts with Quick Sort, falls back to Heap Sort if recursion depth exceeds 2 × log₂(n), and uses Insertion Sort for small subarrays",
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
      },
      {
        id: "adv5",
        question: "In algorithm complexity analysis, what is the formal difference between Big-O and Big-Theta (Θ)?",
        options: [
          "Big-O represents an asymptotic upper bound (≤), while Big-Theta (Θ) represents an asymptotically tight bound (both upper and lower bound)",
          "Big-O is for space complexity, Big-Theta is for time complexity",
          "Big-O is only for worst case, Big-Theta is only for best case",
          "There is no difference; they are interchangeable terms"
        ],
        correctIndex: 0,
        explanation: "f(n) = O(g(n)) means f grows at most as fast as g(n). f(n) = Θ(g(n)) means f is bounded both above and below by constants of g(n)."
      },
      {
        id: "adv6",
        question: "If algorithm A takes 0.001 × n² seconds and algorithm B takes 100 × n log₂ n seconds, for which range of n is algorithm A faster?",
        options: [
          "For very small n, because the constant factor 0.001 is small, but as n grows, B becomes exponentially faster",
          "Algorithm A is always faster for all n",
          "Algorithm B is always faster for all n",
          "They have identical runtime for all n"
        ],
        correctIndex: 0,
        explanation: "For small inputs, constants dominate. But asymptotic growth O(n log n) inevitably surpasses O(n²) as n becomes large."
      }
    ]
  },
  array: {
    id: "array",
    title: "Array Data Structure Quiz",
    description: "Test your mastery of contiguous memory layout, index arithmetic formulas, shifting costs, amortized doubling, and spatial cache locality.",
    questions: [
      {
        id: "arr1",
        question: "How does a computer achieve strict O(1) constant-time random access for arr[i] in an array?",
        options: [
          "By performing a binary search on the memory pointers",
          "By calculating the exact RAM address in a single step using the formula: BaseAddress + (i * elementSize)",
          "By traversing pointers from the head of the array to index i",
          "By caching all array elements in the GPU registers"
        ],
        correctIndex: 1,
        explanation: "Because elements are stored contiguously in memory and each item has the exact same byte size, the CPU computes the target hardware address via simple arithmetic in a single clock cycle."
      },
      {
        id: "arr2",
        question: "Inserting a new element at index 0 (the front) of an array containing n elements requires shifting how many elements?",
        options: ["0 elements", "1 element", "n / 2 elements", "All n elements"],
        correctIndex: 3,
        explanation: "To open up slot 0, every existing element from index 0 to n-1 must shift one position to the right, requiring O(n) total copy operations."
      },
      {
        id: "arr3",
        question: "Why do dynamic arrays (e.g. std::vector, ArrayList) double their capacity (2x) when full rather than incrementing capacity by +1?",
        options: [
          "Geometric doubling guarantees amortized O(1) append time, whereas +1 expansion would cause O(n²) total copying overhead",
          "Operating systems forbid allocating odd-numbered memory sizes",
          "To prevent the array from ever using more than 16 bytes of RAM",
          "Because memory can only be allocated in powers of two on 64-bit systems"
        ],
        correctIndex: 0,
        explanation: "Doubling the capacity ensures that expensive reallocations happen exponentially less frequently. The total cost of copying across n insertions sums to 1 + 2 + 4 + ... + n < 2n = O(n), giving an amortized cost of O(1) per push."
      },
      {
        id: "arr4",
        question: "What is the primary hardware reason sequential array iteration is dramatically faster than linked list traversal?",
        options: [
          "Arrays use less electricity in CPU registers",
          "Contiguous array storage maximizes CPU cache line spatial locality (64 bytes pre-fetched at once into L1 cache)",
          "Arrays do not execute machine code instructions",
          "Linked lists cannot store 32-bit integers"
        ],
        correctIndex: 1,
        explanation: "When arr[0] is accessed, modern CPU hardware automatically loads the surrounding 64-byte memory cache line into L1 cache, meaning the next 15 integer accesses are already waiting in high-speed cache with near-zero latency."
      },
      {
        id: "arr5",
        question: "If an array of 32-bit integers (4 bytes each) has a base memory address of 0x1000, what is the physical byte address of arr[4]?",
        options: ["0x1004", "0x1008", "0x1010", "0x1016"],
        correctIndex: 2,
        explanation: "Address = 0x1000 + (4 * 4 bytes) = 0x1000 + 16 bytes (decimal 16 is 0x10 in hexadecimal). Thus, Address = 0x1010."
      },
      {
        id: "arr6",
        question: "For an array with n = 8 valid elements, what is the valid range of numerical indices in zero-based indexing languages?",
        options: ["1 to 8", "0 to 7", "0 to 8", "-1 to 7"],
        correctIndex: 1,
        explanation: "In zero-based indexing, an array of size n has valid indices from 0 to n - 1 (here 0 through 7). Accessing arr[8] is an out-of-bounds error."
      },
      {
        id: "arr7",
        question: "What is the worst-case time complexity of searching for an arbitrary value in an unsorted array of size n?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 2,
        explanation: "In an unsorted array, the target element may be at the very last index or entirely absent, requiring a linear scan checking all n elements in O(n) time."
      }
    ]
  },
  string: {
    id: "string",
    title: "String Data Structure Quiz",
    description: "Test your mastery of contiguous 1-byte memory mapping, ASCII vs UTF-8 byte encodings, string immutability pitfalls, two-pointer inward scans, and sliding window complexity.",
    questions: [
      {
        id: "str1",
        question: "Why does repeatedly concatenating characters in a loop (`str += c`) in languages like Python, Java, or JavaScript result in an O(n²) time complexity?",
        options: [
          "Because strings use hash tables internally",
          "Because strings are immutable, so every concatenation allocates a new memory buffer and copies all previous characters",
          "Because the operating system limits string concatenation to 10 operations per second",
          "Because garbage collection pauses the CPU for O(n) seconds"
        ],
        correctIndex: 1,
        explanation: "In immutable string runtimes, every `+` or `+=` allocates a new memory array and copies all k existing characters. Across n iterations, 1 + 2 + ... + n = n(n+1)/2 = O(n²) total bytes are copied."
      },
      {
        id: "str2",
        question: "How does a computer locate the physical RAM address of str[i] in a standard C/C++ string in O(1) time?",
        options: [
          "By following linked pointers from the head node",
          "By calculating Address = BaseAddress + (i * 1 Byte) using direct 1-byte hardware offset arithmetic",
          "By querying an operating system string registry",
          "By executing a binary search over the ASCII character codes"
        ],
        correctIndex: 1,
        explanation: "Standard ASCII characters occupy exactly 1 Byte (8 bits). Because the characters reside contiguously in memory, the hardware computes the exact RAM byte address in a single instruction."
      },
      {
        id: "str3",
        question: "What is the primary role of the null character '\\0' (byte 0x00) in C-style strings (char*)?",
        options: [
          "To tell the CPU to invert the string order",
          "To encrypt the string against buffer reading",
          "To act as a sentinel value marking the end of the character sequence in memory",
          "To reserve heap space for future UTF-8 multi-byte characters"
        ],
        correctIndex: 2,
        explanation: "C strings do not store an explicit length field in a struct header. The runtime loops through memory until it encounters '\\0' (byte value 0x00) to determine where the string terminates."
      },
      {
        id: "str4",
        question: "When verifying whether a string of length n is a palindrome using the Two-Pointer technique, what are the time and auxiliary space complexities?",
        options: [
          "Time: O(n), Auxiliary Space: O(1)",
          "Time: O(n log n), Auxiliary Space: O(n)",
          "Time: O(n²), Auxiliary Space: O(1)",
          "Time: O(1), Auxiliary Space: O(n)"
        ],
        correctIndex: 0,
        explanation: "The two pointers `left = 0` and `right = n - 1` step inward symmetrically, comparing at most n/2 pairs in O(n) time. Only two integer pointer variables are needed, consuming strict O(1) auxiliary space."
      },
      {
        id: "str5",
        question: "In the Sliding Window algorithm for 'Longest Substring Without Repeating Characters', why does the algorithm run in O(n) total time even though it has a nested while/lookup condition?",
        options: [
          "Because strings are limited to 256 characters maximum",
          "Because both the Left and Right window pointers move monotonically forward from 0 to n, so each character is processed at most twice",
          "Because the CPU parallelizes the inner loop across multiple cores",
          "Because hashing eliminates all comparison operations completely"
        ],
        correctIndex: 1,
        explanation: "Both the Right expansion pointer and Left contraction pointer only ever increment forward. Since neither pointer ever moves backward, each of the n characters is visited at most twice (once by R, once by L), guaranteeing O(2n) = O(n) total runtime."
      }
    ]
  },
  stack: {
    id: "stack",
    title: "Stack Data Structure Quiz",
    description: "Test your mastery of LIFO mechanics, call stack recursion, balanced brackets, and O(1) push/pop operations.",
    questions: [
      {
        id: "stk1",
        question: "You perform the following operations on an empty stack: push(10), push(20), push(30), pop(), push(40). What does top() / peek() return?",
        options: ["10", "20", "30", "40"],
        correctIndex: 3,
        explanation: "Tracing: push(10)->[10], push(20)->[10,20], push(30)->[10,20,30], pop()->removes 30 [10,20], push(40)->[10,20,40]. The top element is 40."
      },
      {
        id: "stk2",
        question: "What is the theoretical time complexity of push(), pop(), and top() in a standard array or linked-list stack?",
        options: ["O(1) constant time", "O(n) linear time", "O(log n) logarithmic time", "O(n²) quadratic time"],
        correctIndex: 0,
        explanation: "Stack operations only access or modify the single element at the 'top' index or head pointer, requiring strictly O(1) work without shifting."
      },
      {
        id: "stk3",
        question: "How does the runtime system execute recursive algorithms like Merge Sort or Quick Sort under the hood?",
        options: [
          "It uses a CPU Call Stack to push stack frames for each recursive call and pops them on return",
          "It uses a FIFO Queue to process calls in arrival order",
          "It converts all recursive calls into bubble sorts",
          "It allocates a new hard drive file for each function call"
        ],
        correctIndex: 0,
        explanation: "Function invocation is fundamentally LIFO: the most recently invoked nested function must complete and pop its stack frame before the caller can resume."
      },
      {
        id: "stk4",
        question: "Why is a Stack the natural data structure for validating balanced parentheses in code (e.g. '{[()]}')?",
        options: [
          "Because opening brackets must be closed in reverse chronological order (the last opened must be the first closed)",
          "Because stacks can sort characters in alphabetical order",
          "Because queues cannot store bracket characters",
          "Because stacks take zero memory space"
        ],
        correctIndex: 0,
        explanation: "A closing bracket must match the most recently encountered unclosed opening bracket, which perfectly mirrors LIFO (Last-In, First-Out) behavior."
      },
      {
        id: "stk5",
        question: "What error occurs if your code calls pop() on a Stack that contains 0 elements?",
        options: [
          "Stack Underflow",
          "Stack Overflow",
          "Segmentation Fault (always)",
          "Array Out of Bounds Exception"
        ],
        correctIndex: 0,
        explanation: "Attempting to retrieve or delete an element from an empty data structure is termed an 'Underflow' error."
      }
    ]
  },
  queue: {
    id: "queue",
    title: "Queue Data Structure Quiz",
    description: "Test your understanding of FIFO mechanics, circular buffer modulo logic, and breadth-first search queues.",
    questions: [
      {
        id: "q1",
        question: "You perform the following operations on an empty queue: enqueue(5), enqueue(15), enqueue(25), dequeue(), enqueue(35). What does front() return?",
        options: ["5", "15", "25", "35"],
        correctIndex: 1,
        explanation: "Tracing: enqueue(5)->[5], enqueue(15)->[5,15], enqueue(25)->[5,15,25], dequeue()->removes front element 5 leaving [15,25], enqueue(35)->[15,25,35]. The front element is 15."
      },
      {
        id: "q2",
        question: "In a circular array-based Queue of capacity 8, if rear is currently at index 7, what is the new rear index after enqueueing a new item?",
        options: ["0", "7", "8", "Index Out of Range Error"],
        correctIndex: 0,
        explanation: "Circular queues use modulo arithmetic: rear = (7 + 1) % 8 = 0. The pointer wraps around to the start of the array in O(1) time."
      },
      {
        id: "q3",
        question: "Why is a circular array preferred over a simple linear array for implementing a Queue?",
        options: [
          "It avoids shifting all remaining elements on dequeue, preserving O(1) dequeue time and reusing freed slots",
          "It doubles the memory capacity of the computer",
          "It allows elements to be dequeued in random order",
          "It sorts the elements automatically"
        ],
        correctIndex: 0,
        explanation: "Without circular wrapping, removing from the front either requires O(n) element shifting or wastes space permanently as the front pointer advances."
      },
      {
        id: "q4",
        question: "Which major graph and tree traversal algorithm relies fundamentally on a FIFO Queue?",
        options: [
          "Breadth-First Search (BFS)",
          "Depth-First Search (DFS)",
          "Binary Search",
          "Quick Sort Partitioning"
        ],
        correctIndex: 0,
        explanation: "BFS explores nodes level-by-level, discovering neighbors and enqueuing them to be visited in exact arrival order (FIFO)."
      },
      {
        id: "q5",
        question: "What is the primary difference between a Stack and a Queue?",
        options: [
          "Stack is LIFO (Last-In, First-Out) while Queue is FIFO (First-In, First-Out)",
          "Stack is O(n) while Queue is O(1)",
          "Stack can only hold numbers while Queue can hold strings",
          "Queue only operates on trees, Stack only operates on arrays"
        ],
        correctIndex: 0,
        explanation: "The fundamental operational distinction is removal order: Stacks remove the most recently added item (LIFO), whereas Queues remove the oldest item (FIFO)."
      }
    ]
  },
  "time-complexity": {
    id: "time-complexity",
    title: "Time Complexity & Big-O Mastery Quiz",
    description: "Test your skills on asymptotic notation, loop growth analysis, binary division rates, and dominance rules.",
    questions: [
      {
        id: "tc1",
        question: "What does Big-O notation O(f(n)) mathematically represent?",
        options: [
          "The exact running time in milliseconds on an Intel i7 processor",
          "An asymptotic upper bound on the growth rate of operations as n approaches infinity",
          "The minimum memory consumed by the operating system",
          "The average number of lines of code in the implementation"
        ],
        correctIndex: 1,
        explanation: "Big-O provides a formal upper bound on operation count growth as input size n grows indefinitely, independent of hardware clocks."
      },
      {
        id: "tc2",
        question: "Consider a loop: `for (int i = 1; i < n; i *= 2) { ... }`. What is its time complexity?",
        codeSnippet: "for (int i = 1; i < n; i *= 2) {\n    cout << i << endl;\n}",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctIndex: 1,
        explanation: "The variable i doubles every iteration: 1, 2, 4, 8, ..., 2^k. The loop terminates when 2^k >= n, meaning k = ⌈log₂ n⌉ iterations."
      },
      {
        id: "tc3",
        question: "An algorithm executes f(n) = 7n³ + 250n² + 4000n + 99999 operations. What is its Big-O classification?",
        options: ["O(n³)", "O(n²)", "O(7n³)", "O(99999)"],
        correctIndex: 0,
        explanation: "By the asymptotic dominance rule, we drop all lower-order terms (250n², 4000n, 99999) and constant multipliers (7), leaving strictly O(n³)."
      },
      {
        id: "tc4",
        question: "What is the time complexity of the following nested loop?\nfor (int i = 0; i < n; i++) {\n    for (int j = 0; j <= i; j++) {\n        count++;\n    }\n}",
        codeSnippet: "for (int i = 0; i < n; i++) {\n    for (int j = 0; j <= i; j++) {\n        count++;\n    }\n}",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
        correctIndex: 2,
        explanation: "The inner loop runs 1, 2, 3, ..., n times, summing to n(n + 1) / 2 = 0.5n² + 0.5n = O(n²)."
      },
      {
        id: "tc5",
        question: "Why is Binary Search on a sorted array of size n = 1,000,000 able to find an item in at most ~20 comparisons?",
        options: [
          "Because 2²⁰ = 1,048,576 > 1,000,000 and it halves the search space on every step (O(log₂ n))",
          "Because it uses multi-threaded GPU parallelism",
          "Because it guesses the location based on memory address hashing",
          "Because it skips all odd numbers"
        ],
        correctIndex: 0,
        explanation: "With logarithmic O(log₂ n) halving, log₂(1,000,000) ≈ 19.93. At most 20 comparisons are needed to isolate any single element among one million."
      },
      {
        id: "tc6",
        question: "Why does running an O(n²) algorithm on a 4.0 GHz CPU still fail on large inputs (e.g. n = 1,000,000) compared to an O(n log n) algorithm on a 1.0 GHz CPU?",
        options: [
          "Because (10⁶)² = 10¹² operations takes ~250 seconds, whereas 10⁶ log₂(10⁶) ≈ 20 × 10⁶ operations takes only ~0.02 seconds",
          "Because modern CPUs cannot perform quadratic arithmetic",
          "Because O(n²) algorithms crash RAM immediately",
          "Because compiler optimizations only work on O(n log n) code"
        ],
        correctIndex: 0,
        explanation: "Asymptotic growth dwarfs constant hardware clock speed advantages. A trillion operations is ~50,000 times slower than 20 million operations."
      },
      {
        id: "tc7",
        question: "Which of the following correctly orders growth rates from fastest (best) to slowest (worst)?",
        options: [
          "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)",
          "O(n) < O(1) < O(log n) < O(n²) < O(n log n) < O(2ⁿ)",
          "O(1) < O(n) < O(log n) < O(n log n) < O(2ⁿ) < O(n²)",
          "O(log n) < O(1) < O(n) < O(n log n) < O(n²) < O(2ⁿ)"
        ],
        correctIndex: 0,
        explanation: "The standard hierarchy is Constant O(1) < Logarithmic O(log n) < Linear O(n) < Log-linear O(n log n) < Quadratic O(n²) < Exponential O(2ⁿ)."
      }
    ]
  },
  "space-complexity": {
    id: "space-complexity",
    title: "Space Complexity & Memory Allocation Quiz",
    description: "Master auxiliary memory, stack frames, heap buffers, in-place guarantees, and memory leaks.",
    questions: [
      {
        id: "sc1",
        question: "What is the key difference between Total Space Complexity and Auxiliary Space Complexity?",
        options: [
          "Total space includes the original input data memory; auxiliary space strictly measures extra working memory allocated by the algorithm",
          "Total space is measured in Gigabytes, auxiliary space in Megabytes",
          "Auxiliary space only applies to recursive functions",
          "There is no difference; they are exact synonyms"
        ],
        correctIndex: 0,
        explanation: "Auxiliary space isolates the algorithmic overhead by subtracting the input space provided by the caller."
      },
      {
        id: "sc2",
        question: "Why is Merge Sort considered NOT in-place while Quick Sort is considered in-place?",
        options: [
          "Merge Sort allocates an O(n) auxiliary temporary buffer array to merge subarrays, whereas Quick Sort partitions directly within the array with O(log n) stack space",
          "Merge Sort cannot be written in C++",
          "Quick Sort uses 0 stack frames",
          "Merge Sort requires external hard drive storage"
        ],
        correctIndex: 0,
        explanation: "Merge Sort requires an O(n) auxiliary heap buffer during array merging, whereas Quick Sort partitions in-place using O(log n) recursive stack depth."
      },
      {
        id: "sc3",
        question: "What is the auxiliary space complexity of an in-place algorithm like Selection Sort or Bubble Sort?",
        options: ["O(1) Auxiliary Space", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 0,
        explanation: "They mutate the array in-place using only a fixed number of scalar variables (i, j, temp), consuming constant O(1) extra memory."
      },
      {
        id: "sc4",
        question: "A recursive function calls itself n times linearly without returning until base case: `int count(int n) { if(n==0) return 0; return 1 + count(n-1); }`. What is its auxiliary space complexity?",
        options: ["O(n) Call Stack Space", "O(1)", "O(log n)", "O(n²)"],
        correctIndex: 0,
        explanation: "Each recursive call pushes an activation record (return address, parameter n) onto the CPU call stack. With depth n, stack space is O(n)."
      },
      {
        id: "sc5",
        question: "If a C++ function passes a vector by value `void recurse(vector<int> arr, int depth)` across n recursive steps, what is the disastrous space complexity effect?",
        options: [
          "Each step makes a full copy of the n-element vector, resulting in O(n²) total auxiliary memory on the stack/heap",
          "The program runs in O(1) space automatically",
          "The compiler deletes the vector after step 1",
          "It converts the vector to a linked list"
        ],
        correctIndex: 0,
        explanation: "Passing by value deep-copies the entire array at each recursion level. To avoid O(n²) space explosion, always pass by reference `const vector<int>&`."
      },
      {
        id: "sc6",
        question: "What is the auxiliary space complexity of allocating an n × n dynamic programming 2D table in memory?",
        options: ["O(n²)", "O(n)", "O(1)", "O(2ⁿ)"],
        correctIndex: 0,
        explanation: "An n × n matrix allocates n² distinct memory slots (e.g. 4n² bytes for integers), scaling quadratically O(n²)."
      },
      {
        id: "sc7",
        question: "What is the maximum recursion depth (and auxiliary stack space) of a balanced Divide & Conquer algorithm like Merge Sort on an array of size n?",
        options: ["O(log₂ n)", "O(n)", "O(1)", "O(n²)"],
        correctIndex: 0,
        explanation: "A balanced binary recursion tree of size n has height ⌈log₂ n⌉. Only one root-to-leaf path is active on the call stack at any moment, consuming O(log n) stack space."
      }
    ]
  },
  "linear-search": {
    id: "linear-search",
    title: "Linear Search Knowledge Quiz",
    description: "Test your understanding of sequential traversal, early exit optimizations, unsorted array utility, and best/worst cases.",
    questions: [
      {
        id: "ls1",
        question: "What is the best-case time complexity of Linear Search, and when does it occur?",
        options: [
          "O(1), when the target value is located at index 0",
          "O(log n), when the array is already sorted",
          "O(n), because the entire array must always be checked",
          "O(n²), if the array contains duplicate elements"
        ],
        correctIndex: 0,
        explanation: "Linear Search inspects elements starting at index 0. If the first element matches the target, the loop immediately terminates and returns 0 in O(1) time."
      },
      {
        id: "ls2",
        question: "What is the primary operational advantage of Linear Search over Binary Search?",
        options: [
          "It works on completely unsorted collections without requiring any preprocessing or sorting overhead",
          "It runs in O(log n) time on large collections",
          "It requires O(n) auxiliary heap memory",
          "It performs fewer comparisons than Binary Search on sorted arrays"
        ],
        correctIndex: 0,
        explanation: "Linear Search makes zero assumptions about element ordering. When data is unsorted or small, paying O(n log n) to sort first just to use Binary Search is inefficient."
      },
      {
        id: "ls3",
        question: "By standard software convention, what does a linear search function return when the target value is absent from the array?",
        options: ["-1", "0", "arr.size()", "Throws runtime_error"],
        correctIndex: 0,
        explanation: "Since array indices range from 0 to n - 1, returning -1 unambiguously signals that no valid index matched the target."
      },
      {
        id: "ls4",
        question: "Assuming a target element is present in an array of size n with uniform random distribution, what is the average number of comparisons required by Linear Search?",
        options: ["(n + 1) / 2 comparisons → O(n)", "n / 4 comparisons", "log₂ n comparisons", "n² comparisons"],
        correctIndex: 0,
        explanation: "The average case is the mean of (1 + 2 + ... + n) / n = n(n + 1) / (2n) = (n + 1) / 2 comparisons, which asymptotically is O(n)."
      }
    ]
  },
  "binary-search": {
    id: "binary-search",
    title: "Binary Search Mastery Quiz",
    description: "Deep dive into logarithmic halving, sorted array preconditions, 32-bit overflow avoidance, and recursion stack tradeoffs.",
    questions: [
      {
        id: "bs1",
        question: "What essential precondition MUST be satisfied before Binary Search can be safely executed?",
        options: [
          "The array MUST be sorted in monotonic (non-decreasing) order",
          "The array size must be an exact power of 2",
          "The array must not contain negative integers",
          "The array elements must all be distinct"
        ],
        correctIndex: 0,
        explanation: "Binary Search relies on the sorted invariant: if arr[mid] < target, ALL elements in the left half are guaranteed to be smaller than target and can be safely eliminated."
      },
      {
        id: "bs2",
        question: "In professional C++ code, why is `mid = low + (high - low) / 2` strongly preferred over `mid = (low + high) / 2`?",
        options: [
          "To avoid 32-bit signed integer overflow when (low + high) exceeds 2,147,483,647",
          "Because division by 2 is slower in the second formula",
          "Because the second formula does not compile with templates",
          "To force the compiler to use bitwise right-shift"
        ],
        correctIndex: 0,
        explanation: "If low and high are both large positive integers (e.g. > 1 billion), `low + high` overflows signed 32-bit integer limits and turns negative, crashing the program."
      },
      {
        id: "bs3",
        question: "In the worst case, how many comparisons does Binary Search perform on a sorted array of 1,000,000 elements?",
        options: ["At most 20 comparisons", "500,000 comparisons", "1,000,000 comparisons", "100 comparisons"],
        correctIndex: 0,
        explanation: "⌈log₂(1,000,000)⌉ = 20. Binary Search inspects at most 20 elements out of 1 million items! This demonstrates the immense power of O(log n)."
      },
      {
        id: "bs4",
        question: "What is the key difference in auxiliary space complexity between iterative Binary Search and recursive Binary Search?",
        options: [
          "Iterative uses O(1) space, while recursive uses O(log n) auxiliary stack space for activation frames",
          "Recursive uses O(1) space, while iterative uses O(n) space",
          "Both use O(n) heap memory buffers",
          "Iterative uses O(log n) space for loop variables"
        ],
        correctIndex: 0,
        explanation: "The iterative version only maintains scalar integer variables (low, high, mid). The recursive version pushes up to log₂(n) activation frames onto the call stack."
      },
      {
        id: "bs5",
        question: "Consider the sorted array [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]. You search for target = 23. What are the mid elements checked in order?",
        options: [
          "16 (idx 4), then 38 (idx 7), then 23 (idx 5)",
          "12 (idx 3), then 23 (idx 5)",
          "23 on the very first comparison",
          "5, 12, 16, 23"
        ],
        correctIndex: 0,
        explanation: "Pass 1: low=0, high=9, mid=4 (val=16). 16 < 23 → low=5. Pass 2: low=5, high=9, mid=7 (val=38). 38 > 23 → high=6. Pass 3: low=5, high=6, mid=5 (val=23 == 23). Match found!"
      }
    ]
  },
  "linked-list": {
    id: "linked-list",
    title: "Linked List Data Structure Quiz",
    description: "Test your mastery of dynamic node pointers, O(1) head prepending, sequential traversal, and pointer manipulation safety.",
    questions: [
      {
        id: "ll1",
        question: "Why does inserting an element at the head of a Singly Linked List take O(1) time, while doing so in a dynamic array takes O(n) time?",
        options: [
          "Because prepending to a linked list only rewires two pointers, whereas an array must physically shift all n elements one position to the right",
          "Because linked list nodes are stored in the CPU cache",
          "Because arrays cannot be modified after compilation",
          "Because linked lists use binary search internally"
        ],
        correctIndex: 0,
        explanation: "Prepend in a linked list simply assigns newNode->next = head and head = newNode. Contiguous array storage requires all existing elements to shift right to create slot 0."
      },
      {
        id: "ll2",
        question: "In a standard Singly Linked List that stores only a `head` pointer (no `tail` pointer), what is the time complexity of `insertAtTail(val)`?",
        options: [
          "O(n), because the algorithm must traverse from head to the last node to locate nullptr",
          "O(1), because the compiler tracks the tail automatically",
          "O(log n), via binary pointer jumps",
          "O(n²), due to memory reallocation"
        ],
        correctIndex: 0,
        explanation: "Without an explicit tail pointer, reaching the end of the list requires following `curr = curr->next` across all n nodes, taking O(n) time."
      },
      {
        id: "ll3",
        question: "During head insertion, what disastrous bug occurs if you execute `head = newNode;` BEFORE `newNode->next = head;`?",
        options: [
          "The reference to the entire existing list is overwritten and lost, causing a massive memory leak (orphaned nodes)",
          "The code fails to compile with a syntax error",
          "The list is automatically converted into a doubly-linked list",
          "The node is inserted at the tail instead of head"
        ],
        correctIndex: 0,
        explanation: "If you overwrite `head` first, you destroy your only reference to the original first node. The entire rest of the chain becomes unreachable in memory."
      },
      {
        id: "ll4",
        question: "Why is accessing the element at index k (e.g. `arr[k]`) O(1) in an array, but O(k) in a Singly Linked List?",
        options: [
          "Arrays use contiguous memory allowing direct arithmetic offset address calculation, while linked list nodes are scattered across memory and must be hopped sequentially",
          "Linked lists use virtual memory whereas arrays use physical memory",
          "Array access is optimized by the GPU",
          "Linked lists do not store integers"
        ],
        correctIndex: 0,
        explanation: "Array address is simply `base_address + k * sizeof(type)`. In a linked list, each node is dynamically allocated anywhere on the heap; you must follow k `next` pointers to reach it."
      },
      {
        id: "ll5",
        question: "When deleting a node `curr` from a Singly Linked List, why do we need a reference to its predecessor `prev`?",
        options: [
          "Because singly linked nodes only point forward, so `prev->next` must be redirected to `curr->next` to splice `curr` out of the chain",
          "Because the C++ `delete` operator requires two pointers",
          "To check if the node has an even or odd value",
          "Because `curr` cannot be deallocated without `prev`"
        ],
        correctIndex: 0,
        explanation: "To remove a node while keeping the chain intact, the predecessor's next pointer must bypass the target node and point to the successor."
      }
    ]
  },
  deque: {
    id: "deque",
    title: "Deque (Double-Ended Queue) Quiz",
    description: "Test your mastery of bidirectional boundary operations, circular array wrap-around, monotonic deque invariants, and work-stealing schedulers.",
    questions: [
      {
        id: "dq1",
        question: "What is the primary operational distinction between a standard FIFO Queue and a Double-Ended Queue (Deque)?",
        options: [
          "A Deque supports instantaneous O(1) insertions and deletions at BOTH the front and rear, whereas a standard queue only inserts at rear and removes from front",
          "A Deque is sorted automatically on every insertion",
          "A Deque only operates on string data types",
          "A Deque uses binary tree balancing instead of array storage"
        ],
        correctIndex: 0,
        explanation: "A Deque (Double-Ended Queue) generalizes both Stack and Queue by supporting pushFront, pushBack, popFront, and popBack in strict O(1) time."
      },
      {
        id: "dq2",
        question: "In a circular array implementation with capacity N, why is `front = (front - 1 + N) % N` used to prepend an element instead of `(front - 1) % N`?",
        options: [
          "Because in C++, Java, and JS, `(-1) % N` evaluates to `-1` (a negative invalid index) rather than `N - 1`, so adding N guarantees a non-negative dividend",
          "Because adding N doubles the array capacity dynamically",
          "Because modulo arithmetic only works with even numbers",
          "Because N is the CPU memory page size"
        ],
        correctIndex: 0,
        explanation: "In C++, Java, and JavaScript, the `%` operator calculates the remainder, preserving negative signs: `(-1) % 8 == -1`. Adding capacity N ensures `(0 - 1 + 8) % 8 == 7`, correctly wrapping back to the last slot."
      },
      {
        id: "dq3",
        question: "In the Monotonic Deque algorithm for Sliding Window Maximum, why are elements smaller than or equal to the current element popped from the BACK of the deque?",
        options: [
          "Because the current incoming element is both larger and will stay in the sliding window longer, rendering the smaller previous elements permanently obsolete as maximum candidates",
          "To keep the deque sorted in ascending order",
          "Because small elements cause memory fragmentation in the CPU cache",
          "Because the deque has a fixed capacity of 2 elements"
        ],
        correctIndex: 0,
        explanation: "If an incoming element is greater than or equal to an existing candidate, the existing candidate can never become the maximum of the current or any future window. Popping it preserves the monotonic decreasing invariant."
      },
      {
        id: "dq4",
        question: "What is the total overall time complexity of finding the maximum in all sliding windows of size k across an array of length n using a Monotonic Deque?",
        options: [
          "O(n), because each array index is pushed onto the deque at most once and popped at most once",
          "O(n × k), because each window requires scanning all k items",
          "O(n log n), due to binary heap insertions",
          "O(n²), because of nested while loops"
        ],
        correctIndex: 0,
        explanation: "Although there is a while loop inside the iteration, each element is pushed to the deque exactly once and popped at most once across the entire run. Amortized work per element is O(1), yielding strict O(n) total runtime."
      },
      {
        id: "dq5",
        question: "In modern multi-core runtimes (such as Go goroutines or Java ForkJoinPool), why do worker thread pools use Deques for 'work-stealing'?",
        options: [
          "The owning worker accesses the Front as a LIFO Stack for optimal CPU cache reuse, while idle 'thief' threads steal from the Rear as a FIFO Queue, minimizing lock contention",
          "Because Deques automatically encrypt thread memory",
          "Because Deques run on the GPU instead of the CPU",
          "Because operating systems only permit thread queues with double ends"
        ],
        correctIndex: 0,
        explanation: "In work-stealing, the local owner pushes and pops from the head (LIFO) to maximize cache locality on recent sub-tasks. Thieves steal from the opposite tail end (FIFO), preventing concurrent workers from contending on the same end of the queue."
      }
    ]
  },
  "hash-table": {
    id: "hash-table",
    title: "Hash Table (Hash Map) Quiz",
    description: "Test your mastery of hash functions, collision resolution via Separate Chaining vs Open Addressing, Tombstones, and Load Factor rehashing.",
    questions: [
      {
        id: "ht1",
        question: "What is the primary mechanism that enables a Hash Table to achieve average O(1) lookups and insertions?",
        options: [
          "A deterministic hash function transforms an arbitrary key into a numeric array index, allowing direct memory offset jumps without scanning",
          "It maintains elements in strictly sorted order using AVL tree rotations",
          "It uses binary search on a dynamically compressed bit-vector",
          "It stores all keys on high-speed CPU registers instead of RAM"
        ],
        correctIndex: 0,
        explanation: "A Hash Table maps keys to array slots via a hash function h(k) = k % capacity. This converts the search problem into direct memory index addressing in O(1) constant time."
      },
      {
        id: "ht2",
        question: "Why can hash collisions never be completely eliminated in any practical Hash Table implementation?",
        options: [
          "By the Pigeonhole Principle, the universe of possible keys is vast or infinite, while the table's backing array capacity is finite",
          "Because modulo arithmetic is inherently imprecise in floating point processors",
          "Because operating systems restrict arrays to powers of two",
          "Because C++ and Java compilers enforce random collision generation"
        ],
        correctIndex: 0,
        explanation: "According to the Pigeonhole Principle, mapping an unbounded universe of potential keys (e.g., all 64-bit integers or arbitrary strings) into a finite table buffer of size M guarantees that multiple distinct keys will eventually hash to the same slot."
      },
      {
        id: "ht3",
        question: "In a Hash Table using Separate Chaining, what is the worst-case time complexity of search(key), and when does it occur?",
        options: [
          "O(n), when an adversarial input or pathological hash function causes all n keys to hash into the exact same bucket chain",
          "O(log n), because buckets are always balanced red-black trees",
          "O(1), because collisions do not affect chain traversal",
          "O(n²), because every element must be pairwise compared with every other element"
        ],
        correctIndex: 0,
        explanation: "If a poor hash function or adversarial input maps all n keys to bucket index 0, the bucket degenerates into a linear singly linked list of length n, degrading search and deletion to linear O(n) traversal."
      },
      {
        id: "ht4",
        question: "In Open Addressing with Linear Probing, why can't a deleted slot simply be emptied (set to null/empty)?",
        options: [
          "Because linear probing searches terminate upon encountering the first empty slot; clearing a slot would prematurely terminate future searches for keys that probed past that slot",
          "Because empty array cells cause hardware bus parity errors",
          "Because empty slots double the load factor calculation",
          "Because array slots in C++ cannot be set to null"
        ],
        correctIndex: 0,
        explanation: "If slot i is vacated and left empty, any subsequent search for a collided key that probed past slot i will stop at slot i and incorrectly report that the key does not exist. A Tombstone marker (DEL) signals that the slot is vacant for new insertions, but probes must continue past it during searches."
      },
      {
        id: "ht5",
        question: "What is the Load Factor (α = N / M) and why do production Hash Tables trigger a rehash when α exceeds approximately 0.70 - 0.75?",
        options: [
          "Load factor measures table fullness (elements / capacity); exceeding 0.75 sharply increases collision clustering and probe lengths, so the table doubles capacity and re-hashes all keys to restore O(1) speed",
          "Load factor measures memory fragmentation; exceeding 0.75 triggers OS garbage collection",
          "Load factor is the probability of CPU cache misses during hashing",
          "Load factor determines the encryption strength of the hash function"
        ],
        correctIndex: 0,
        explanation: "The Load Factor α = N / M represents the ratio of stored elements to total slots. As α approaches 1.0 in open addressing, probe sequences become catastrophically long (primary clustering). Production tables resize to 2M and re-insert all keys when α > 0.75 to maintain average O(1) efficiency."
      }
    ]
  },
  "binary-tree": {
    id: "binary-tree",
    title: "Binary Tree Fundamentals Quiz",
    description: "Test your understanding of tree anatomy (root, leaf, height, depth), full/complete/perfect classifications, and DFS/BFS traversals.",
    questions: [
      {
        id: "bt1",
        question: "In a binary tree where the root is at level 0, what is the maximum number of nodes possible at level L?",
        options: [
          "2ᴸ",
          "2 × L",
          "L²",
          "2ᴸ - 1"
        ],
        correctIndex: 0,
        explanation: "Since each node can have at most 2 children, level 0 has at most 2⁰ = 1 node, level 1 has 2¹ = 2, level 2 has 2² = 4, and level L has at most 2ᴸ nodes."
      },
      {
        id: "bt2",
        question: "Which Depth-First traversal order visits the Left subtree, then the Root node, and finally the Right subtree?",
        options: [
          "In-order Traversal (LNR)",
          "Pre-order Traversal (NLR)",
          "Post-order Traversal (LRN)",
          "Level-order Traversal (BFS)"
        ],
        correctIndex: 0,
        explanation: "In-order traversal follows the Left-Root-Right pattern. In a Binary Search Tree (BST), an In-order traversal visits nodes in strictly sorted non-decreasing numerical order."
      },
      {
        id: "bt3",
        question: "What is the precise structural definition of a 'Complete Binary Tree'?",
        options: [
          "Every level is completely filled except possibly the last level, and all nodes in the last level are populated as far left as possible",
          "Every single internal node has exactly two children and all leaves are at the exact same depth",
          "Every node has at most one child, forming a single linear vertical chain",
          "The tree has an odd number of nodes and left height equals right height at every node"
        ],
        correctIndex: 0,
        explanation: "In a Complete Binary Tree, all levels 0 through h-1 are 100% full. At level h, all leaf nodes reside contiguously on the far left without gaps, which allows compact 1D array representations (like binary heaps) without null pointers."
      },
      {
        id: "bt4",
        question: "What is the difference between the Depth of a node and the Height of a node in a binary tree?",
        options: [
          "Depth is the number of edges from the Root down to the node; Height is the number of edges on the longest path from the node down to a leaf",
          "Depth and Height are strictly interchangeable identical terms",
          "Depth is the number of children a node has; Height is the total count of all nodes in the tree",
          "Depth is measured from bottom-up; Height is measured from top-down"
        ],
        correctIndex: 0,
        explanation: "Depth measures distance downward from the Root (root depth = 0). Height measures distance downward from the node to its furthest descendant leaf (leaf height = 0, tree height = root height)."
      },
      {
        id: "bt5",
        question: "Which auxiliary data structure is fundamentally required to perform iterative Level-Order (Breadth-First) traversal of a binary tree?",
        options: [
          "A FIFO Queue",
          "A LIFO Stack",
          "A Hash Table",
          "A Disjoint Set (Union-Find)"
        ],
        correctIndex: 0,
        explanation: "Level-order traversal visits nodes tier by tier from top to bottom. A First-In-First-Out (FIFO) queue guarantees that nodes at depth d are processed before nodes at depth d + 1."
      }
    ]
  },
  bst: {
    id: "bst",
    title: "Binary Search Tree (BST) Mastery Quiz",
    description: "Test your understanding of the global BST trichotomy invariant, logarithmic search/insert mechanics, 3-case deletion with in-order successors, and degenerate skew hazards.",
    questions: [
      {
        id: "bst1",
        question: "What is the global ordering invariant that distinguishes a Binary Search Tree (BST) from a general Binary Tree?",
        options: [
          "For every node X, all keys in left subtree of X are < X, and all keys in right subtree of X are > X",
          "Only immediate left and right children must be smaller and larger than the parent respectively",
          "All leaf nodes must reside on the same level and have values divisible by 2",
          "The root must be equal to the median of all keys in the tree at all times"
        ],
        correctIndex: 0,
        explanation: "The BST invariant is global across entire subtrees: every descendant in the left subtree must be strictly less than X, and every descendant in the right subtree must be strictly greater than X. Checking only immediate children is a classic bug."
      },
      {
        id: "bst2",
        question: "When deleting a node that has TWO children from a BST (Case 3), what node is conventionally used to replace its value?",
        options: [
          "Its In-Order Successor (smallest node in the right subtree) or In-Order Predecessor (largest in left)",
          "Any random leaf node in the entire tree",
          "The root node of the entire tree",
          "The node's immediate parent"
        ],
        correctIndex: 0,
        explanation: "Replacing with the In-Order Successor (minimum of right subtree) guarantees that all remaining keys in the left subtree are smaller and all remaining keys in the right subtree are larger, preserving the BST invariant. The successor itself has at most one child, making its subsequent removal trivial."
      },
      {
        id: "bst3",
        question: "Why is the In-Order Successor of a node guaranteed to have at most ONE child?",
        options: [
          "Because it is the leftmost node in the right subtree, so by definition its left child pointer is nullptr",
          "Because it must always be a leaf node with 0 children",
          "Because C++ memory allocators prohibit two children on successor nodes",
          "Because its right child pointer is always nullptr"
        ],
        correctIndex: 0,
        explanation: "The In-Order Successor is found by moving once to the right child and then repeatedly following left pointers until left is nullptr. Because it has no left child, it has at most one child (its right child), safely belonging to Case 1 (leaf) or Case 2 (1 child)."
      },
      {
        id: "bst4",
        question: "What sequence of operations is produced by running an In-Order Traversal (Left -> Root -> Right) on a valid BST?",
        options: [
          "A strictly sorted ascending sequence of all keys",
          "A reverse sorted descending sequence of all keys",
          "A level-by-level breadth-first sequence",
          "A pseudo-random permutation depending on insertion order"
        ],
        correctIndex: 0,
        explanation: "Because in-order visits all keys in the left subtree (which are all smaller), then the root, then all keys in the right subtree (which are all larger), induction proves the resulting sequence is strictly sorted in ascending order."
      },
      {
        id: "bst5",
        question: "What happens to the search and insertion time complexity of an unaugmented BST if keys are inserted in pre-sorted ascending order (e.g., 10, 20, 30, 40, 50)?",
        options: [
          "It degrades from O(log n) to O(n) because the tree skews into a single linear linked list",
          "It improves to O(1) because elements are already sorted",
          "It remains strictly O(log n) because the compiler balances the tree automatically",
          "The tree throws a runtime memory exception and refuses the insertion"
        ],
        correctIndex: 0,
        explanation: "Inserting pre-sorted elements causes each new key to become the right child of the previous node. The tree has no left branches, height becomes h = n - 1, and search degenerates to an O(n) linear scan like a linked list. This motivated self-balancing trees like AVL and Red-Black trees."
      }
    ]
  },
  "avl-tree": {
    id: "avl-tree",
    title: "AVL Tree Self-Balancing Mastery Quiz",
    description: "Test your deep understanding of Balance Factor invariants, the 4 canonical rotations (LL, RR, LR, RL), insertion vs deletion rebalancing, and Fibonacci height bounds.",
    questions: [
      {
        id: "avl1",
        question: "What is the defining balance invariant of an AVL Tree?",
        options: [
          "For every node, Balance Factor BF = h(left) - h(right) ∈ {-1, 0, +1}",
          "Every leaf node must be black and red nodes cannot have red children",
          "The height of the left subtree must be exactly equal to the height of the right subtree",
          "The number of nodes in the left subtree must equal the number of nodes in the right subtree"
        ],
        correctIndex: 0,
        explanation: "An AVL Tree enforces that for every single node in the tree, the height difference between its left and right subtrees (Balance Factor) must be at most 1, meaning BF ∈ {-1, 0, +1}."
      },
      {
        id: "avl2",
        question: "When inserting a new key into an AVL tree, what is the maximum number of rotations required to restore the balance invariant globally?",
        options: [
          "At most 1 single or double rotation",
          "At most 2 rotations",
          "Up to O(log n) cascading rotations",
          "Up to O(n) rotations"
        ],
        correctIndex: 0,
        explanation: "During an AVL insertion, a single rotation (LL or RR) or double rotation (LR or RL) at the lowest unbalanced ancestor decreases the height of that subtree back to its pre-insertion height. Because subtree height does not change relative to ancestors above it, no further rotations are needed. Exactly ≤ 1 rotation restores global balance."
      },
      {
        id: "avl3",
        question: "In contrast to insertion, how many rotations can be triggered in the worst case during an AVL DELETION?",
        options: [
          "O(log n) cascading rotations all the way up to the root",
          "Strictly 0 rotations",
          "At most 1 single rotation",
          "Exactly 2 rotations"
        ],
        correctIndex: 0,
        explanation: "During deletion, balancing a node can reduce its subtree height by 1, which may in turn unbalance its parent. This height reduction can cascade up the entire tree, requiring up to O(log n) rotations."
      },
      {
        id: "avl4",
        question: "A node Z has Balance Factor BF(Z) = +2 and its left child Y has Balance Factor BF(Y) = -1. Which rotation sequence is required to restore balance?",
        options: [
          "Left-Right (LR) Double Rotation: Left rotation on Y, followed by Right rotation on Z",
          "Right-Left (RL) Double Rotation: Right rotation on Y, followed by Left rotation on Z",
          "Single Right Rotation on Z (LL)",
          "Single Left Rotation on Z (RR)"
        ],
        correctIndex: 0,
        explanation: "Because BF(Z) = +2 (left-heavy) and BF(Y) = -1 (its left child is right-heavy), this forms a zig-zag Left-Right (LR) imbalance. It requires rotating left on child Y to straighten the branch into a Left-Left line, then rotating right on Z."
      },
      {
        id: "avl5",
        question: "What is the asymptotic maximum height of an AVL Tree containing n nodes in the worst case?",
        options: [
          "h < 1.44 log₂(n + 2) ≈ O(log n)",
          "h = O(n)",
          "h = O(√n)",
          "h = 2 log₂(n + 1)"
        ],
        correctIndex: 0,
        explanation: "Using Fibonacci minimal AVL tree recurrence N(h) = 1 + N(h-1) + N(h-2), the maximum height is mathematically bounded by (log_phi(√5 · (n+1))) ≈ 1.4404 log₂(n + 2), strictly guaranteeing O(log n) time for all operations."
      }
    ]
  },
  heap: {
    id: "heap",
    title: "Binary Heap & Priority Queue Mastery Quiz",
    description: "Test your understanding of array-as-tree representation, index formulas, Sift-Up/Sift-Down mechanics, and linear O(n) Heapify.",
    questions: [
      {
        id: "heap1",
        question: "What mathematical invariant defines a Min-Heap stored in a 0-indexed array?",
        options: [
          "Array[Parent(i)] ≤ Array[i] for every node i > 0, where Parent(i) = ⌊(i - 1) / 2⌋",
          "Array[Left(i)] < Array[i] < Array[Right(i)] (BST invariant)",
          "Array[Parent(i)] ≥ Array[i] for every node i > 0",
          "All elements must be sorted in ascending order from index 0 to n - 1"
        ],
        correctIndex: 0,
        explanation: "In a Min-Heap, every parent node must be less than or equal to its children. This guarantees that the global minimum element always resides at root index [0]. Unlike a BST, there is no required ordering between left and right siblings."
      },
      {
        id: "heap2",
        question: "For a node at index i in a 0-indexed complete binary tree array, which formulas compute its children?",
        options: [
          "Left: 2i + 1, Right: 2i + 2",
          "Left: 2i, Right: 2i + 1",
          "Left: i / 2, Right: i / 2 + 1",
          "Left: 2i - 1, Right: 2i"
        ],
        correctIndex: 0,
        explanation: "In 0-indexed complete binary trees, level-order packing places the left child of node i at index 2i + 1 and the right child at index 2i + 2. (In 1-based indexing, they are 2i and 2i + 1)."
      },
      {
        id: "heap3",
        question: "What is the time complexity of converting an arbitrary unsorted array of n elements into a valid binary heap using bottom-up Heapify (Build-Heap)?",
        options: [
          "O(n) linear time",
          "O(n log n) time",
          "O(n²) time",
          "O(log n) time"
        ],
        correctIndex: 0,
        explanation: "Bottom-up Heapify starts at the lowest non-leaf nodes (⌊n/2⌋ - 1) and calls sift-down. Because approximately n/2 nodes are leaves requiring 0 swaps and only the root node requires up to log n swaps, the sum of heights ∑ (n / 2^(h+1)) · h converges to ≤ O(n)."
      },
      {
        id: "heap4",
        question: "During extractMin() in a Min-Heap, why does the new root sift down by swapping with the SMALLER of its two children?",
        options: [
          "Because the chosen child becomes the new parent of both subtrees, so it must be ≤ both children to preserve the Min-Heap invariant",
          "Because swapping with the larger child would cause an infinite loop",
          "Because left children always have priority over right children",
          "It does not matter; either child can be picked arbitrarily"
        ],
        correctIndex: 0,
        explanation: "When node P swaps with child C, C becomes the new parent of both its original sibling and the demoted node P. To satisfy the Min-Heap property (parent ≤ both children), C must be the minimum among {P, Left, Right}."
      },
      {
        id: "heap5",
        question: "In an array representation of a complete binary tree of size n (0-indexed), at which index range do all leaf nodes reside?",
        options: [
          "From index ⌊n / 2⌋ to n - 1",
          "From index 0 to ⌊n / 2⌋ - 1",
          "Only at odd indices",
          "Only at index n - 1"
        ],
        correctIndex: 0,
        explanation: "Any node at index i has a left child at 2i + 1. If 2i + 1 ≥ n, the node has no children and is therefore a leaf. Solving 2i + 1 ≥ n yields i ≥ (n - 1) / 2, meaning leaf nodes occupy indices from ⌊n / 2⌋ up to n - 1 (approximately half the tree)."
      }
    ]
  },
  "priority-queue": {
    id: "priority-queue",
    title: "Priority Queue Mastery Assessment",
    description: "Test your understanding of priority queue semantics, heap vs array tradeoffs, C++ priority_queue syntax, Dijkstra's frontier optimization, and Decrease-Key complexities.",
    questions: [
      {
        id: "pq1",
        question: "What is the defining operational difference between a standard FIFO Queue and a Priority Queue?",
        options: [
          "A FIFO Queue serves items strictly by arrival time, whereas a Priority Queue serves items by their associated priority key regardless of arrival time",
          "A Priority Queue can only store unique integer values",
          "A Priority Queue does not support removal of elements",
          "A FIFO Queue is always faster than a Priority Queue in every scenario"
        ],
        correctIndex: 0,
        explanation: "In a FIFO Queue, the first item in is the first item out. In a Priority Queue, every item has an urgency score; the item with the highest (or lowest) priority is dispatched next, regardless of how recently it arrived."
      },
      {
        id: "pq2",
        question: "When using a Binary Heap to back a Priority Queue of n items, what are the time complexities of peek(), push(), and pop()?",
        options: [
          "peek: O(1), push: O(log n), pop: O(log n)",
          "peek: O(log n), push: O(1), pop: O(n)",
          "peek: O(1), push: O(n), pop: O(1)",
          "peek: O(1), push: O(1), pop: O(1)"
        ],
        correctIndex: 0,
        explanation: "Peek inspects the root element at index [0] in O(1) time. Push appends to the array and calls Sift-Up along the tree branch in O(log n). Pop extracts the root, places the last leaf at the top, and calls Sift-Down in O(log n)."
      },
      {
        id: "pq3",
        question: "Why is an unsorted dynamic array generally considered a poor choice for a production Priority Queue under frequent extractions?",
        options: [
          "While push is O(1), extracting the highest priority item requires a linear O(n) scan across all elements",
          "An unsorted array cannot store custom task structs",
          "An unsorted array uses 3x more memory than a binary heap",
          "An unsorted array does not permit dynamic resizing"
        ],
        correctIndex: 0,
        explanation: "In an unsorted array, inserting is O(1) by appending at the end, but finding and removing the maximum priority item requires scanning the entire array (O(n)), making repeated extractions prohibitively slow for large datasets."
      },
      {
        id: "pq4",
        question: "In C++ STL, how do you declare a Min-Priority Queue for integers where smaller values have higher dispatch priority?",
        options: [
          "std::priority_queue<int, vector<int>, std::greater<int>> pq;",
          "std::priority_queue<int> pq;",
          "std::priority_queue<int, std::less<int>> pq;",
          "std::priority_queue<int, min_heap> pq;"
        ],
        correctIndex: 0,
        explanation: "By default, std::priority_queue<int> uses std::less<int> to create a Max-Heap. Supplying std::greater<int> as the comparator template argument inverts the relationship, creating a Min-Priority Queue where the smallest integer is at the top."
      },
      {
        id: "pq5",
        question: "How does a Min-Priority Queue reduce the time complexity of Dijkstra's Single-Source Shortest Path algorithm on a graph with V vertices and E edges?",
        options: [
          "It greedily extracts the unsettled vertex with minimum tentative distance in O(log V), yielding O((V + E) log V) total time instead of O(V²)",
          "It completely eliminates the need to inspect graph edges",
          "It guarantees the graph is bipartite",
          "It runs in O(1) time by precomputing all pairs shortest paths"
        ],
        correctIndex: 0,
        explanation: "Without a priority queue, scanning all unsettled vertices to find the minimum distance takes O(V) per step, leading to O(V²) total runtime. A Min-PQ extracts the minimum in O(log V) and updates edges in O(log V), achieving optimal O((V + E) log V)."
      }
    ]
  },
  "union-find": {
    id: "union-find",
    title: "Union-Find (DSU) Knowledge Quiz",
    description: "Assess your understanding of disjoint set forests, path compression mechanics, union by rank bounds, Inverse Ackermann complexity, and cycle detection.",
    questions: [
      {
        id: "uf1",
        question: "What condition mathematically defines that node x is the root representative of its disjoint set in a 0-indexed parent array?",
        options: [
          "parent[x] == x",
          "parent[x] == -1",
          "rank[x] == 0",
          "parent[x] == size[x]"
        ],
        correctIndex: 0,
        explanation: "In a standard Union-Find parent array, a node is its own representative if and only if its parent pointer points directly to itself (parent[x] == x)."
      },
      {
        id: "uf2",
        question: "What is the primary operational effect of Path Compression during a find(x) traversal?",
        options: [
          "It re-parents every node along the visited path directly to the root, flattening the tree to height 1 for instant future lookups",
          "It deletes all visited nodes from the data structure to save memory",
          "It sorts the elements in ascending order",
          "It doubles the capacity of the parent array"
        ],
        correctIndex: 0,
        explanation: "Path compression updates the parent pointer of every node visited on the way up to the root, pointing them directly to the root. Subsequent queries on those nodes execute in O(1) time."
      },
      {
        id: "uf3",
        question: "When using Union by Rank to merge two sets with roots r1 and r2, under what specific condition does the surviving root's rank increase?",
        options: [
          "Only when rank[r1] == rank[r2] (both trees have equal rank)",
          "Whenever any two sets are united",
          "Only when rank[r1] > rank[r2]",
          "Rank never changes after initialization"
        ],
        correctIndex: 0,
        explanation: "If the ranks are unequal, the shorter tree is placed beneath the deeper tree without increasing overall tree height. The height only increases by 1 when merging two trees of identical rank."
      },
      {
        id: "uf4",
        question: "Why is the amortized runtime O(α(n)) of Union-Find with Path Compression and Union by Rank considered practically O(1) constant time in software engineering?",
        options: [
          "Because the Inverse Ackermann function α(n) ≤ 4 for all input sizes n ≤ 10⁸⁰ (exceeding total atoms in the observable universe)",
          "Because modern CPU cache lines automatically prefetch all nodes in O(1)",
          "Because it uses a hash table with zero collisions",
          "Because n is always constrained to less than 100 in practice"
        ],
        correctIndex: 0,
        explanation: "The Ackermann function grows faster than tower-of-powers, so its inverse α(n) never exceeds 4 for any practical or cosmological value of n, making operations practically instantaneous."
      },
      {
        id: "uf5",
        question: "How is Union-Find used to detect whether adding an undirected edge (u, v) introduces a cycle into a graph?",
        options: [
          "Check if find(u) == find(v). If their roots are identical, a path already connects them, so adding (u, v) creates a cycle",
          "Check if u > v",
          "Check if rank[u] + rank[v] > n",
          "By counting the total number of edges with DFS"
        ],
        correctIndex: 0,
        explanation: "If two vertices already share the same canonical root representative in the disjoint set forest, they already belong to the same connected component. Adding an edge between them immediately creates a cycle."
      }
    ]
  },
  "two-pointers": {
    id: "two-pointers",
    title: "Two Pointers Technique Mastery Quiz",
    description: "Assess your mastery of opposite converging scans, reader-writer partition arrays, Container With Most Water invariants, and Floyd's cycle detection.",
    questions: [
      {
        id: "tp1",
        question: "Under what prerequisite can the Opposite Converging Two-Pointers pattern be applied to find a pair with a target sum in O(n) time and O(1) extra space?",
        options: [
          "The array must be sorted (monotonic order) so pointer movements reliably increment or decrement the pair sum",
          "The array must contain only positive integers",
          "The array size must be a power of two",
          "The array must have distinct elements with no duplicates"
        ],
        correctIndex: 0,
        explanation: "The two-pointer technique for pair sum relies fundamentally on monotonicity. When sorted, moving the left pointer rightward strictly increases the sum (or leaves it equal), and moving the right pointer leftward strictly decreases it, allowing each step to prune an entire row/column of candidates."
      },
      {
        id: "tp2",
        question: "In LeetCode 11 (Container With Most Water), why is it mathematically sound to advance the pointer pointing to the shorter vertical bar rather than the taller one?",
        options: [
          "Because container height is strictly bounded by the shorter line; keeping the shorter line while decreasing width cannot possibly yield a larger area",
          "Because the taller line is always adjacent to the peak",
          "Because moving both pointers at once would cause an out-of-bounds memory error",
          "Because the area formula requires width to increase at every step"
        ],
        correctIndex: 0,
        explanation: "Area = min(height[L], height[R]) * (R - L). If we move the pointer pointing to the taller bar inward, width shrinks and the bottleneck height is still bounded by the shorter bar (or worse), guaranteeing the area decreases. Only moving the shorter bar has the potential to find a taller bottleneck that compensates for lost width."
      },
      {
        id: "tp3",
        question: "In the Fast & Slow (Reader-Writer) pointer pattern for in-place array modification (such as LeetCode 26: Remove Duplicates from Sorted Array), what do the two pointers represent?",
        options: [
          "The slow pointer tracks the boundary of unique processed elements, while the fast pointer scans ahead inspecting every new candidate",
          "The slow pointer traverses from the right end, while the fast pointer starts from the middle",
          "The fast pointer deletes elements using dynamic allocation while the slow pointer pauses the thread",
          "Both pointers move at identical speeds but read different memory channels"
        ],
        correctIndex: 0,
        explanation: "The reader-writer pattern maintains an invariant: arr[0..slow] contains all verified, deduplicated elements. The fast pointer traverses every index of the raw input. Whenever arr[fast] reveals a new distinct value, slow increments and receives the value: arr[++slow] = arr[fast]."
      },
      {
        id: "tp4",
        question: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) uses two pointers moving at speed 1 and 2 respectively. If a linked list has a cycle of length C, what is the maximum number of steps required for the two pointers to meet inside the loop once both enter it?",
        options: [
          "At most C steps, because the relative distance between them decreases by exactly 1 on every iteration",
          "O(n² log n) steps due to pointer hopping",
          "Exactly 2C steps regardless of cycle entry point",
          "They only meet if the cycle length is an odd number"
        ],
        correctIndex: 0,
        explanation: "Relative to the slow pointer, the fast pointer closes the gap by exactly (2 - 1) = 1 step per iteration. In modular arithmetic modulo C, a gap of at most C - 1 takes at most C - 1 iterations to collapse to 0."
      },
      {
        id: "tp5",
        question: "How does sorting followed by the Two-Pointer technique reduce the time complexity of the 3Sum problem (LeetCode 15) compared to a brute force search?",
        options: [
          "Brute force checks O(n³) triplets; fixing one element and using opposite-converging two pointers on the remaining sorted sub-array checks pairs in O(n), achieving O(n²) total time",
          "It reduces time complexity to O(n log n) by using binary search for all three indices simultaneously",
          "It eliminates the need to inspect duplicate elements, reducing complexity to O(1)",
          "It requires an auxiliary 2D hash table requiring O(n²) extra memory"
        ],
        correctIndex: 0,
        explanation: "Sorting takes O(n log n). Then an outer loop fixes the first element nums[i] across n values. For each fixed element, two pointers L and R scan the remainder in O(n) time. Total time is O(n log n + n²) = O(n²), with O(1) auxiliary space beyond sorting."
      }
    ]
  }
};


