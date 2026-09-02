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
  }
};
