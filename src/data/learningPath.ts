import { AlgorithmId } from "@/types/sorting";

export interface LearningStep {
  id: AlgorithmId;
  order: number;
  name: string;
  category: "sorting" | "searching" | "data-structure" | "complexity";
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
  {
    id: "linked-list",
    order: 8,
    name: "Linked List",
    category: "data-structure",
    badge: "Nodes & Forward Pointers",
    estimatedTime: "~15 min",
    difficulty: "Intermediate",
    reason: "The quintessential pointer-based linear structure. Master how dynamic nodes eliminate element shifting at the cost of direct indexing.",
    analogy: "A treasure hunt with clues: each clue box has a treasure item and a slip of paper telling you the exact GPS address of the next clue box.",
    idea: "A Singly Linked List consists of independently allocated nodes in heap memory, each holding data and a next pointer. Unlike contiguous arrays, inserting at the head is strictly O(1) because no other elements move.",
    sampleArray: [10, 20, 30, 40],
    codeBlocks: [
      {
        title: "Node Definition & Head Prepending",
        lines: "struct Node {\n    int val;\n    Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n\nvoid insertAtHead(int val) {\n    Node* newNode = new Node(val);\n    newNode->next = head;\n    head = newNode;\n}",
        explanation: "Allocates a new node and redirects head in O(1) time without shifting elements.",
      },
      {
        title: "Traversal & Search",
        lines: "bool search(int target) {\n    Node* curr = head;\n    while (curr) {\n        if (curr->val == target) return true;\n        curr = curr->next;\n    }\n    return false;\n}",
        explanation: "Follows pointer chains sequentially from head to tail in O(n) time.",
      },
      {
        title: "Deletion by Value",
        lines: "bool deleteValue(int val) {\n    if (!head) return false;\n    if (head->val == val) {\n        Node* temp = head;\n        head = head->next;\n        delete temp;\n        return true;\n    }\n    Node* curr = head;\n    while (curr->next && curr->next->val != val) curr = curr->next;\n    if (!curr->next) return false;\n    Node* temp = curr->next;\n    curr->next = curr->next->next;\n    delete temp;\n    return true;\n}",
        explanation: "Splices predecessor pointer around target node in O(n) time without shifting other nodes.",
      },
    ],
    complexityWhy: {
      time: "Prepend at head is O(1). Searching, tail insertion (without tail pointer), and deleting by value require sequential traversal O(n).",
      space: "Consumes O(n) extra memory for pointer storage (4-8 bytes per node).",
    },
  },
  {
    id: "linear-search",
    order: 9,
    name: "Linear Search",
    category: "searching",
    badge: "Sequential Scan",
    estimatedTime: "~10 min",
    difficulty: "Beginner",
    reason: "The simplest search algorithm. Works on any collection without requiring sorting or extra preprocessing.",
    analogy: "Looking for your lost keys in a row of jacket pockets: you check the first pocket, then the second, then the third, until you find them or check every pocket.",
    idea: "Linear Search checks every element of an array one by one from left to right. When it finds the target, it stops and returns the index. If it reaches the end without a match, it returns -1.",
    sampleArray: [42, 17, 89, 23, 56, 12, 78],
    codeBlocks: [
      {
        title: "Sequential Iteration & Early Exit",
        lines: "int linearSearch(const vector<int>& arr, int target) {\n    for (int i = 0; i < (int)arr.size(); i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}",
        explanation: "Loops through each slot from 0 to n-1. Returns as soon as target matches.",
      },
    ],
    complexityWhy: {
      time: "Best case O(1) if target is at index 0. Average and worst case O(n) if target is at the end or absent.",
      space: "Requires strictly O(1) extra space because it uses only one loop counter variable.",
    },
  },
  {
    id: "binary-search",
    order: 10,
    name: "Binary Search",
    category: "searching",
    badge: "Logarithmic Halving",
    estimatedTime: "~15 min",
    difficulty: "Intermediate",
    reason: "Requires sorted input. Dramatically accelerates search time from O(n) to O(log n) by repeatedly halving the remaining candidates.",
    analogy: "Looking up a word in a printed dictionary: you open the book to the exact middle. If the target word comes before, you discard the entire second half and repeat in the first half.",
    idea: "PRECONDITION: Array must be sorted. Compare target with middle element arr[mid]. If equal, return mid. If target is smaller, search left half; if larger, search right half. Each step cuts the search space in half.",
    sampleArray: [12, 24, 32, 45, 57, 68, 81, 99],
    codeBlocks: [
      {
        title: "Iterative Implementation (O(1) Space)",
        lines: "int binarySearch(const vector<int>& arr, int target) {\n    int low = 0, high = (int)arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}",
        explanation: "Narrows search window [low..high]. `low + (high - low) / 2` avoids 32-bit integer overflow.",
      },
      {
        title: "Recursive Implementation (O(log n) Call Stack)",
        lines: "int binarySearchRec(const vector<int>& arr, int low, int high, int target) {\n    if (low > high) return -1;\n    int mid = low + (high - low) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target) return binarySearchRec(arr, mid + 1, high, target);\n    return binarySearchRec(arr, low, mid - 1, target);\n}",
        explanation: "Recursive divide-and-conquer consumes log₂(n) activation frames on the call stack.",
      },
    ],
    complexityWhy: {
      time: "Halving the search space on each step guarantees at most log₂(n) comparisons in all cases O(log n).",
      space: "Iterative version uses O(1) space. Recursive version uses O(log n) call stack space.",
    },
  },
  {
    id: "time-complexity",
    order: 11,
    name: "Time Complexity",
    category: "complexity",
    badge: "Big-O & Growth Rates",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "The foundation of all algorithmic evaluation. Understand how instruction count and loops scale as input size n grows.",
    analogy: "Cooking breakfast: Boiling 1 egg vs boiling 10 eggs takes the same 10 minutes in one pot O(1). But peeling 10 eggs individually takes 10 times longer O(n).",
    idea: "Time Complexity mathematically models the number of basic operations executed by an algorithm as a function of the input size n. Using Big-O asymptotic notation, it categorizes algorithms into growth tiers: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) log-linear, and O(n²) quadratic.",
    sampleArray: [1, 2, 4, 8, 16, 32, 64, 128],
    codeBlocks: [
      {
        title: "Logarithmic Step (Binary Division)",
        lines: "while (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n}",
        explanation: "Halves the remaining candidate elements on every step, completing in at most log₂(n) iterations.",
      },
      {
        title: "Linear Loop Traversal",
        lines: "for (int i = 0; i < n; i++) {\n    sum += arr[i];\n}",
        explanation: "Executes the loop body exactly n times, directly proportional to input size.",
      },
      {
        title: "Quadratic Nested Loops",
        lines: "for (int i = 0; i < n; i++) {\n    for (int j = 0; j < n; j++) {\n        matrix[i][j] = 0;\n    }\n}",
        explanation: "The inner loop runs n times for each of the outer loop's n iterations, yielding n × n = O(n²) operations.",
      },
    ],
    complexityWhy: {
      time: "Focuses on asymptotic worst-case bounds, ignoring constant hardware coefficients and CPU clock frequencies.",
      space: "Time analysis tracks computational step transitions and loop iterations.",
    },
  },
  {
    id: "space-complexity",
    order: 12,
    name: "Space Complexity",
    category: "complexity",
    badge: "Auxiliary Memory & Stack",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Memory is a finite physical resource. Master the distinction between input storage, auxiliary working buffers, and call stack overhead.",
    analogy: "Packing a travel suitcase: the clothes you bring are the input space O(n). The folding table or organizers you temporarily use while packing are the auxiliary space O(1) or O(n).",
    idea: "Space Complexity measures the total extra memory (auxiliary space) required by an algorithm to execute to completion. This includes dynamic heap allocations (temporary arrays, hash tables) and the call stack frames allocated during recursive function execution.",
    sampleArray: [10, 20, 30, 40, 50],
    codeBlocks: [
      {
        title: "In-Place O(1) Auxiliary Space",
        lines: "void reverseArray(vector<int>& arr) {\n    int l = 0, r = arr.size() - 1;\n    while (l < r) swap(arr[l++], arr[r--]);\n}",
        explanation: "Rearranges elements directly inside the input vector using only two scalar index integers, requiring O(1) extra memory.",
      },
      {
        title: "Recursive Call Stack O(log n) Space",
        lines: "void divide(int l, int r) {\n    if (l >= r) return;\n    int mid = l + (r - l) / 2;\n    divide(l, mid);\n    divide(mid + 1, r);\n}",
        explanation: "A balanced divide-and-conquer tree reaches a maximum stack recursion depth of log₂(n) simultaneous activation records.",
      },
      {
        title: "Auxiliary Dynamic Buffer O(n) Space",
        lines: "vector<int> temp(n);\nfor (int i = 0; i < n; i++) temp[i] = arr[i];",
        explanation: "Allocates a new heap array of size n, consuming auxiliary memory proportional to the input size.",
      },
    ],
    complexityWhy: {
      time: "Memory management operations take time, but space complexity isolates physical byte footprint.",
      space: "Auxiliary space measures extra working memory beyond the input array itself.",
    },
  },
];

export const SORTING_PATH = LEARNING_PATH.filter((s) => s.category === "sorting");
export const SEARCHING_PATH = LEARNING_PATH.filter((s) => s.category === "searching");
export const DATA_STRUCTURES_PATH = LEARNING_PATH.filter((s) => s.category === "data-structure");
export const COMPLEXITY_PATH = LEARNING_PATH.filter((s) => s.category === "complexity");

export interface GlossaryTerm {
  term: string;
  category: "Fundamentals" | "Properties" | "Recursion" | "Data Structures" | "Searching";
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
  {
    term: "Linear Search",
    category: "Searching",
    definition: "A sequential search examining elements one-by-one from start to finish. Works on unsorted data in O(n) time.",
  },
  {
    term: "Binary Search",
    category: "Searching",
    definition: "A divide-and-conquer search requiring a sorted array that halves the search space on each step, achieving O(log n) time.",
  },
  {
    term: "Linked List",
    category: "Data Structures",
    definition: "A linear sequence of node structures stored non-contiguously in memory, connected through explicit next pointers.",
  },
  {
    term: "Node",
    category: "Data Structures",
    definition: "A basic building block of linked data structures, packaging an item payload alongside one or more pointer references.",
  },
  {
    term: "Pointer / Reference",
    category: "Fundamentals",
    definition: "A memory variable that stores the direct physical or virtual heap address of another object or node.",
  },
];
