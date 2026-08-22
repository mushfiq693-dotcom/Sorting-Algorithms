import { AlgorithmId } from "@/types/sorting";

export interface LearningStep {
  id: AlgorithmId;
  order: number;
  name: string;
  category: "sorting" | "data-structure";
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
    stability?: string;
  };
}

export const LEARNING_PATH: LearningStep[] = [
  {
    id: "bubble",
    order: 1,
    name: "Bubble Sort",
    category: "sorting",
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
    category: "sorting",
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
    category: "sorting",
    badge: "Hand-Sorting Cards",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Most practical O(n²) algorithm. Very fast on nearly-sorted data and small arrays.",
    analogy: "Think of picking up playing cards one by one from a table and slotting each new card into its proper position among the cards already in your left hand.",
    idea: "Insertion Sort takes elements one at a time and slides them leftward into their correct position in the already-sorted prefix of the array.",
    sampleArray: [22, 11, 35, 18, 9, 44, 2],
    codeBlocks: [
      {
        title: "Extracting the Key",
        lines: "for (int i = 1; i < n; i++) {\n    int key = arr[i];\n    int j = i - 1;",
        explanation: "Picks arr[i] as the 'key' to be inserted into the sorted subarray arr[0..i-1].",
      },
      {
        title: "Shifting Greater Elements Right",
        lines: "while (j >= 0 && arr[j] > key) {\n    arr[j + 1] = arr[j];\n    j--;\n}",
        explanation: "Shifts elements greater than the key one position to the right to open up a vacant slot.",
      },
      {
        title: "Inserting into the Slot",
        lines: "arr[j + 1] = key;",
        explanation: "Drops the key directly into the vacated position.",
      },
    ],
    complexityWhy: {
      time: "O(n) best-case when array is already sorted (while-loop never runs). O(n²) worst-case on reverse sorted input where every item shifts full distance.",
      space: "O(1) in-place auxiliary space.",
      stability: "Strictly stable because equal keys are never shifted past each other.",
    },
  },
  {
    id: "merge",
    order: 4,
    name: "Merge Sort",
    category: "sorting",
    badge: "Divide & Conquer",
    estimatedTime: "~20 min",
    difficulty: "Intermediate",
    reason: "Your first O(n log n) algorithm. The foundation of divide-and-conquer thinking.",
    analogy: "Like splitting a huge pile of exam papers into two equal halves, giving each half to a teaching assistant to sort, and then zipping the two sorted stacks together.",
    idea: "Merge Sort recursively splits the array into two halves until singletons remain, then merges sorted subarrays back together in linear time using a two-pointer technique.",
    sampleArray: [38, 27, 43, 3, 9, 82, 10],
    codeBlocks: [
      {
        title: "Recursive Divide Step",
        lines: "int mid = left + (right - left) / 2;\nmergeSort(arr, left, mid);\nmergeSort(arr, mid + 1, right);",
        explanation: "Divides the array into two equal halves and recursively sorts each half.",
      },
      {
        title: "Two-Pointer Linear Merge",
        lines: "while (i <= mid && j <= right) {\n    if (arr[i] <= arr[j]) temp.push_back(arr[i++]);\n    else temp.push_back(arr[j++]);\n}",
        explanation: "Compares the heads of both sorted halves and appends the smaller element to temporary buffer.",
      },
      {
        title: "Copy Back to Original Array",
        lines: "for (int k = left; k <= right; k++) arr[k] = temp[k - left];",
        explanation: "Copies the merged sorted slice back into the original array.",
      },
    ],
    complexityWhy: {
      time: "Guaranteed O(n log n) in all cases (best, average, worst). Tree depth is log₂ n and work per level is O(n).",
      space: "O(n) auxiliary space due to the temporary array buffer required during merge.",
      stability: "Stable because <= comparator prioritizes the left subarray on equal keys.",
    },
  },
  {
    id: "quick",
    order: 5,
    name: "Quick Sort",
    category: "sorting",
    badge: "In-Place Speed Champion",
    estimatedTime: "~25 min",
    difficulty: "Advanced",
    reason: "Industry standard for in-place general sorting. Fast cache performance, but tricky edge cases.",
    analogy: "Like organizing students by height: pick one student as a reference (pivot), send everyone shorter to the left and everyone taller to the right, then repeat on each group.",
    idea: "Quick Sort selects a pivot, partitions the array so smaller elements move left and larger move right, and recursively sorts the sub-partitions.",
    sampleArray: [33, 10, 55, 71, 29, 14, 42],
    codeBlocks: [
      {
        title: "Pivot Selection (Lomuto)",
        lines: "int pivot = arr[high];\nint i = low - 1;",
        explanation: "Chooses the rightmost element as the pivot and maintains partition boundary index i.",
      },
      {
        title: "Partitioning Scan",
        lines: "for (int j = low; j < high; j++) {\n    if (arr[j] < pivot) {\n        i++;\n        swap(arr[i], arr[j]);\n    }\n}",
        explanation: "Moves all elements smaller than pivot into the left zone [low..i].",
      },
      {
        title: "Settling the Pivot",
        lines: "swap(arr[i + 1], arr[high]);\nreturn i + 1;",
        explanation: "Places the pivot into its final settled spot between the two partitions.",
      },
    ],
    complexityWhy: {
      time: "Average case is O(n log n) with balanced partitions. Worst case is O(n²) if an unbalanced pivot is picked on already-sorted input (tree depth becomes n).",
      space: "O(log n) average recursion call stack space (can degrade to O(n) in worst case), but 0 extra array memory required (In-place).",
      stability: "Not stable because partitioning swaps elements across wide distances over the pivot.",
    },
  },
  {
    id: "stack",
    order: 6,
    name: "Stack",
    category: "data-structure",
    badge: "LIFO Container",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "The foundational LIFO (Last-In, First-Out) data structure. Direct insight into function calls, recursion call stacks, and undo buffers.",
    analogy: "A stack of plates in a cafeteria: you add new clean plates to the very top, and you take plates off from the top. The last plate placed is the first one removed.",
    idea: "A Stack restricts all insertions and deletions to a single endpoint called the top. It provides strict O(1) Push (insert), Pop (remove), and Top/Peek (read) operations.",
    sampleArray: [10, 20, 30, 40],
    codeBlocks: [
      {
        title: "Push Operation (Insert to Top)",
        lines: "bool push(int val) {\n    if (topIndex >= MAX_SIZE - 1) return false; // Overflow\n    arr[++topIndex] = val;\n    return true;\n}",
        explanation: "Increments the topIndex and stores the value in O(1) time without moving any existing items.",
      },
      {
        title: "Pop Operation (Remove from Top)",
        lines: "bool pop() {\n    if (isEmpty()) return false; // Underflow\n    topIndex--;\n    return true;\n}",
        explanation: "Decrements topIndex to discard the top item in O(1) time.",
      },
      {
        title: "Peek / Top Operation (Inspect)",
        lines: "int top() const {\n    if (isEmpty()) throw runtime_error(\"Stack is empty\");\n    return arr[topIndex];\n}",
        explanation: "Reads the current top element in O(1) time without modifying stack state.",
      },
    ],
    complexityWhy: {
      time: "All core operations (push, pop, top, empty) execute in strictly O(1) constant time because operations always target index topIndex directly.",
      space: "O(1) auxiliary space per operation; O(n) overall storage for n elements.",
    },
  },
  {
    id: "queue",
    order: 7,
    name: "Queue",
    category: "data-structure",
    badge: "FIFO Container",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "The foundational FIFO (First-In, First-Out) data structure. Essential for breadth-first traversal (BFS), task scheduling, and buffering.",
    analogy: "A ticket line at a cinema: the first person who arrives in line is the first person served and allowed into the theater. New arrivals enter at the back.",
    idea: "A Queue allows elements to enter at the rear (enqueue) and exit from the front (dequeue). In circular array implementations, modulo arithmetic (rear + 1) % capacity avoids shifting elements.",
    sampleArray: [5, 15, 25, 35],
    codeBlocks: [
      {
        title: "Enqueue (Insert at Rear)",
        lines: "bool enqueue(int val) {\n    if (isFull()) return false; // Overflow\n    rear = (rear + 1) % capacity;\n    arr[rear] = val;\n    count++;\n    return true;\n}",
        explanation: "Advances the rear pointer using modulo wrapping and stores the element in O(1) time.",
      },
      {
        title: "Dequeue (Remove from Front)",
        lines: "bool dequeue() {\n    if (isEmpty()) return false; // Underflow\n    front = (front + 1) % capacity;\n    count--;\n    return true;\n}",
        explanation: "Advances front pointer in O(1) time, avoiding expensive O(n) array element shifts.",
      },
      {
        title: "Front Inspection",
        lines: "int getFront() const {\n    if (isEmpty()) throw runtime_error(\"Queue is empty\");\n    return arr[front];\n}",
        explanation: "Returns the front element in O(1) time without removal.",
      },
    ],
    complexityWhy: {
      time: "All core operations (enqueue, dequeue, front, empty) execute in strictly O(1) constant time with circular buffer pointer arithmetic.",
      space: "O(1) auxiliary space per operation; O(n) overall storage for n elements.",
    },
  },
];

export const SORTING_PATH = LEARNING_PATH.filter((s) => s.category === "sorting");
export const DATA_STRUCTURES_PATH = LEARNING_PATH.filter((s) => s.category === "data-structure");

export interface GlossaryTerm {
  term: string;
  category: "Fundamentals" | "Properties" | "Recursion" | "Data Structures";
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
  {
    term: "LIFO (Last-In, First-Out)",
    category: "Data Structures",
    definition: "An ordering rule where the most recently added item is the first one removed (e.g. Stack).",
  },
  {
    term: "FIFO (First-In, First-Out)",
    category: "Data Structures",
    definition: "An ordering rule where the earliest added item is the first one removed (e.g. Queue).",
  },
  {
    term: "Push / Pop",
    category: "Data Structures",
    definition: "The primary insert (push) and remove (pop) operations of a Stack data structure.",
  },
  {
    term: "Enqueue / Dequeue",
    category: "Data Structures",
    definition: "The primary insert at rear (enqueue) and remove from front (dequeue) operations of a Queue data structure.",
  },
  {
    term: "Circular Buffer",
    category: "Data Structures",
    definition: "A fixed-size array where the end wraps around to the beginning using modulo arithmetic, enabling O(1) Queue operations without shifting.",
  },
  {
    term: "Call Stack",
    category: "Data Structures",
    definition: "A special stack maintained by CPU/runtimes to store active function execution frames and return addresses during recursion.",
  },
];
