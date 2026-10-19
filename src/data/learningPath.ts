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
  hook: string;
  superpower: string;
  tradeoff: string;
  mentalModel: string;
  keyPrinciples: string[];
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

/**
 * ============================================================================
 * PEDAGOGICAL TIER ARCHITECTURE — BEGINNER-FIRST ROADMAP STANDARDS
 * ============================================================================
 * Every topic in AlgoHub follows a strict beginner-first cognitive progression.
 * When adding future topics, they MUST be inserted according to their tier:
 *
 * TIER 1: FOUNDATIONS & CONTIGUOUS MEMORY (Order 1..)
 *   - Direct memory addressing, 0-indexed contiguous layout.
 *   - Examples: Array (Static & Dynamic), Vector, Matrix.
 *
 * TIER 2: ELEMENTARY LINEAR SEARCHING (Order 2..)
 *   - Single-pass linear iteration, zero preconditions.
 *   - Examples: Linear Search.
 *
 * TIER 3: ASYMPTOTIC COMPLEXITY ANALYSIS (Order 3..)
 *   - Big-O mathematical foundations, growth rates, auxiliary space, recursion depth.
 *   - Examples: Time Complexity, Space Complexity.
 *
 * TIER 4: SUB-LINEAR / DIVIDE-AND-CONQUER SEARCHING (Order 5..)
 *   - Logarithmic intervals, precondition of sorted data.
 *   - Examples: Binary Search, Jump Search.
 *
 * TIER 5: ELEMENTARY ABSTRACT DATA STRUCTURES (Order 6..)
 *   - LIFO / FIFO linear discipline.
 *   - Examples: Stack, Queue, Deque.
 *
 * TIER 6: NON-CONTIGUOUS POINTER-LINKED STRUCTURES (Order 8..)
 *   - Heap allocation, pointer chains, dynamic node splicing.
 *   - Examples: Singly Linked List, Doubly Linked List, Circular Linked List.
 *
 * TIER 7: ELEMENTARY QUADRATIC SORTING (Order 9..)
 *   - Adjacent swaps, minimum selection, incremental card insertion.
 *   - Examples: Bubble Sort, Selection Sort, Insertion Sort.
 *
 * TIER 8: ADVANCED DIVIDE-AND-CONQUER SORTING (Order 12..)
 *   - Subarray recursion, pivot partitioning, guaranteed O(n log n).
 *   - Examples: Merge Sort, Quick Sort, Heap Sort.
 *
 * TIER 9+: HIERARCHICAL & NON-LINEAR STRUCTURES (Future Topics)
 *   - Trees, Graphs, Heaps, Hash Tables, Dynamic Programming.
 * ============================================================================
 */
export const LEARNING_PATH: LearningStep[] = [
  // ==========================================
  // TIER 1: FOUNDATIONS & CONTIGUOUS MEMORY
  // ==========================================
  {
    id: "array",
    order: 1,
    name: "Array (Static & Dynamic)",
    category: "data-structure",
    badge: "Start Here",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Start here. The fundamental building block of all computer memory: contiguous elements and instant O(1) index access.",
    hook: "How does your CPU access the 10,000,000th item in memory in a single clock cycle without scanning through the first 9,999,999?",
    superpower: "Instantaneous O(1) Random Access via Hardware Math",
    tradeoff: "Expensive O(n) Element Shifting on Middle Insertions & Deletions",
    mentalModel: "A Numbered Row of School Hallway Lockers",
    keyPrinciples: [
      "Elements sit back-to-back in an unbroken contiguous strip of physical RAM.",
      "Address arithmetic: Address = BaseAddress + (index × elementSize) executes in 1 CPU cycle.",
      "Inserting or deleting in the middle forces all subsequent items to slide left or right O(n).",
      "Dynamic arrays (std::vector, ArrayList) double capacity (2×) to achieve amortized O(1) appends."
    ],
    analogy: "A row of numbered locker boxes in a school hallway: knowing locker #42 allows you to walk directly to it in one step O(1). But squeezing a new locker into the middle forces you to slide all subsequent lockers down the hall O(n).",
    idea: "An Array stores elements consecutively in contiguous physical memory addresses. Because every element has an identical size in bytes, calculating any index's address requires only a single addition and multiplication: BaseAddress + (i × elementSize). Inserting or deleting in the middle requires shifting subsequent elements in O(n) time. Dynamic arrays double capacity when full to achieve amortized O(1) push operations.",
    sampleArray: [14, 28, 42, 56, 70],
    codeBlocks: [
      {
        title: "O(1) Direct Indexing Operator",
        lines: "T& operator[](int index) {\n    return data[index]; // BaseAddress + index * sizeof(T)\n}",
        explanation: "Hardware calculates RAM location in a single clock cycle without scanning through prior elements.",
      },
      {
        title: "Amortized O(1) Push Back & Geometric Doubling",
        lines: "void push_back(T val) {\n    if (size == capacity) resize(capacity * 2);\n    data[size++] = val;\n}",
        explanation: "Doubling capacity when full ensures the cost of reallocating and copying elements across memory is amortized to O(1) per push.",
      },
      {
        title: "O(n) Middle Insertion with Right Shift",
        lines: "void insert(int index, T val) {\n    if (size == capacity) resize(capacity * 2);\n    for (int i = size - 1; i >= index; i--) {\n        data[i + 1] = data[i]; // Shift right\n    }\n    data[index] = val;\n    size++;\n}",
        explanation: "Opens a slot at index by shifting all existing elements from index to size-1 one position to the right.",
      },
      {
        title: "O(n) Element Deletion with Left Shift",
        lines: "void erase(int index) {\n    for (int i = index; i < size - 1; i++) {\n        data[i] = data[i + 1]; // Shift left\n    }\n    size--;\n}",
        explanation: "Fills the vacancy left by the deleted item by shifting all subsequent elements one position to the left.",
      },
    ],
    complexityWhy: {
      time: "Direct access and in-place updates are O(1). Inserting or deleting from the middle requires O(n) element shifts. Appending to dynamic array is amortized O(1).",
      space: "Contiguous O(n) storage with zero pointer overhead per element. L1/L2 cache prefetching provides peak spatial locality.",
    },
  },
  {
    id: "string",
    order: 2,
    name: "String",
    category: "data-structure",
    badge: "Contiguous Chars",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "A character array in contiguous memory. Master ASCII byte mapping, immutability tradeoffs, and the two-pointer & sliding-window patterns.",
    hook: "Why does typing str += '!' inside a loop crash your program's performance by 10,000x in JavaScript or Python, but run at instant speed in C++?",
    superpower: "1-Byte Hardware Offsets & Cache-Saturated Linear Passes",
    tradeoff: "Language Immutability Duplication Overhead (O(n) Copies)",
    mentalModel: "A Beaded Necklace with Letter Beads and a Clasp (\\0)",
    keyPrinciples: [
      "Characters are stored consecutively as 1-byte ASCII integers (or variable-byte UTF-8) in hardware RAM.",
      "C-strings terminate with '\\0' (0x00), while modern string objects store a dedicated length header.",
      "Immutable strings (Python, Java, JS) force new buffer allocations on mutation, turning naive concat loops into O(n²).",
      "Contiguous layout empowers optimal O(n) Two-Pointer inward scans and Sliding Window substring algorithms."
    ],
    analogy: "A beaded necklace with letter beads ending in a magnetic clasp ('\\0'): you can instantly read any bead by its position, but in an immutable language, changing a single bead requires restringing the entire necklace from scratch.",
    idea: "A String is fundamentally an array of characters mapped contiguously in memory. Because each ASCII character consumes exactly 1 Byte (8 bits), indexing str[i] translates directly to BaseAddress + (i × 1B) in strict O(1) time. In mutable languages (C++ std::string), characters can be modified in-place; in immutable languages (Python, Java, JS), every edit duplicates the buffer in O(n) time. Two pointers moving symmetrically inward allow O(n) reversals and palindrome validation, while sliding window intervals solve complex substring problems in a single linear pass.",
    sampleArray: [65, 76, 71, 79, 82, 73, 84, 72, 77],
    codeBlocks: [
      {
        title: "Two-Pointer In-Place Reversal: O(n) Time, O(1) Space",
        lines: "void reverseString(string& s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) swap(s[l++], s[r--]);\n}",
        explanation: "Symmetrically swaps characters from opposite ends inward in O(n/2) = O(n) steps without allocating extra memory.",
      },
      {
        title: "Two-Pointer Palindrome Verification: O(n)",
        lines: "bool isPalindrome(const string& s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        if (tolower(s[l++]) != tolower(s[r--])) return false;\n    }\n    return true;\n}",
        explanation: "Validates string symmetry moving inward with instant O(1) early exit on the first character mismatch.",
      },
      {
        title: "Sliding Window: Longest Substring Without Repeating Chars",
        lines: "int lengthOfLongestSubstring(string s) {\n    vector<int> last(256, -1);\n    int maxLen = 0, l = 0;\n    for (int r = 0; r < s.size(); r++) {\n        if (last[(unsigned char)s[r]] >= l) l = last[(unsigned char)s[r]] + 1;\n        last[(unsigned char)s[r]] = r;\n        maxLen = max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}",
        explanation: "Maintains a dynamic window [L..R] that expands rightward and contracts leftward upon duplicate detection in a single O(n) pass.",
      },
      {
        title: "In-Place Mutable Write vs Immutable Duplication",
        lines: "// C++ Mutable Write: O(1) Time, O(1) Space\ns[index] = newChar;\n\n// Java/Python/JS: Allocates new buffer + copies n chars: O(n)\nString newStr = s.substring(0, i) + newChar + s.substring(i + 1);",
        explanation: "C++ modifies the physical RAM byte directly in O(1), whereas immutable languages duplicate the entire string buffer in O(n) time.",
      },
    ],
    complexityWhy: {
      time: "Direct character indexing and in-place mutation are O(1). Two-pointer reversals, palindrome checks, and sliding windows are O(n). Immutable concatenation in loops degrades to O(n²).",
      space: "Contiguous 1-byte storage O(n) in RAM. In-place algorithms achieve O(1) auxiliary space, while immutable transformations require O(n) extra heap memory.",
    },
  },

  // ==========================================
  // TIER 2: ELEMENTARY LINEAR SEARCHING
  // ==========================================
  {
    id: "linear-search",
    order: 3,
    name: "Linear Search",
    category: "searching",
    badge: "First Algorithm",
    estimatedTime: "~10 min",
    difficulty: "Beginner",
    reason: "Your first algorithm. The simplest intuition: walk through the array one element at a time until you find what you need.",
    hook: "When you have a completely unsorted pile of papers or an unsorted list, what is the honest, unavoidable mathematical reality?",
    superpower: "Zero Preconditions: Works on Any Unsorted, Raw Collection",
    tradeoff: "O(n) Linear Scalability (Must Check Every Item in Worst Case)",
    mentalModel: "Checking Pockets One by One to Find Your Car Keys",
    keyPrinciples: [
      "Begin at index 0 and inspect every element sequentially until target is found or end is reached.",
      "Requires absolutely no sorting, no indexing trees, and no extra memory overhead.",
      "Best Case: O(1) if target happens to be the very first item.",
      "Worst Case: O(n) if target is at the final position or completely absent."
    ],
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

  // ==========================================
  // TIER 3: ASYMPTOTIC COMPLEXITY ANALYSIS
  // ==========================================
  {
    id: "time-complexity",
    order: 4,
    name: "Time Complexity",
    category: "complexity",
    badge: "Big-O Foundation",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Understand why some code runs in milliseconds while other code freezes your browser. Big-O notation demystified with visual curves.",
    hook: "Why does an algorithm that runs in 1 millisecond on 100 users suddenly freeze and crash a million-dollar cloud server when user traffic doubles?",
    superpower: "Hardware-Independent Asymptotic Growth Modeling",
    tradeoff: "Ignores Constant Multipliers and CPU Cache Physics on Small Inputs",
    mentalModel: "Cooking Time: Boiling 10 Eggs in One Pot vs Peeling 10 Eggs Individually",
    keyPrinciples: [
      "Time complexity measures how instruction count scales as input size n approaches infinity.",
      "O(1) Constant < O(log n) Logarithmic < O(n) Linear < O(n log n) Log-Linear < O(n²) Quadratic.",
      "Focuses on asymptotic worst-case bounds, discarding hardware constants and clock frequencies.",
      "Distinguishes between algorithms that survive production traffic and those that crash servers."
    ],
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
    order: 5,
    name: "Space Complexity",
    category: "complexity",
    badge: "Memory Footprint",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Memory is a finite physical resource. Master the distinction between input storage, auxiliary working buffers, and call stack overhead.",
    hook: "Speed means nothing if your program runs out of physical memory and crashes with an Out-of-Memory exception. How do we measure RAM cost?",
    superpower: "Tracks Auxiliary Heap Allocations & Call Stack Recursion Overhead",
    tradeoff: "Time-Space Tradeoff: Faster Algorithms Often Demand Extra Memory Buffers",
    mentalModel: "Suitcase Packing: Clothes (Input) vs Packing Organizers (Auxiliary Space)",
    keyPrinciples: [
      "Space complexity measures total extra (auxiliary) memory required by the algorithm to run.",
      "Auxiliary Space excludes the input data itself and measures working arrays and buffers.",
      "Recursion Depth: Every recursive call allocates a stack frame; depth d consumes O(d) memory.",
      "In-place algorithms modify memory directly using O(1) auxiliary space (e.g., Quick Sort, Heap Sort)."
    ],
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
      time: "Tracks whether memory allocations happen inside inner loops (O(n) per pass) or statically upfront.",
      space: "Differentiates between Total Space (input + working memory) and Auxiliary Space (strictly extra memory).",
    },
  },

  // ==========================================
  // TIER 4: SUB-LINEAR / DIVIDE SEARCHING
  // ==========================================
  {
    id: "binary-search",
    order: 6,
    name: "Binary Search",
    category: "searching",
    badge: "Divide & Halve",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Discover the magic of sorted data: cut the search space in half with every single check to achieve blazing O(log n) speed.",
    hook: "Pick a secret number between 1 and 1,000,000. In 20 questions or fewer, a computer will guess it correctly every single time. Here is the math.",
    superpower: "Exponential Halving: Cuts 1,000,000 Possibilities Down in ~20 Checks",
    tradeoff: "Strict Precondition: The Collection MUST Be Sorted",
    mentalModel: "Opening a Thick Printed Dictionary Directly to the Middle",
    keyPrinciples: [
      "Crucial Precondition: The array must be sorted in non-decreasing order.",
      "Calculate mid = low + (high - low) / 2 to prevent 32-bit integer overflow.",
      "Compare arr[mid] with target: if equal, done! If target is smaller, search left; if larger, search right.",
      "Each comparison cuts the search space exactly in half, achieving astonishing O(log n) speed."
    ],
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

  // ==========================================
  // TIER 5: ELEMENTARY ABSTRACT DATA STRUCTURES
  // ==========================================
  {
    id: "stack",
    order: 7,
    name: "Stack",
    category: "data-structure",
    badge: "LIFO Container",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Last-In, First-Out (LIFO). The core mental model powering undo buttons, browser back stacks, and recursive function calls.",
    hook: "How do text editor 'Undo (Ctrl+Z)', browser 'Back', and function call recursion never lose track of where you came from?",
    superpower: "Strict O(1) Push, Pop & Top Operations with Zero Ambiguity",
    tradeoff: "Zero Random Index Access (Only the Top is Visible)",
    mentalModel: "A Spring-Loaded Cafeteria Tray Dispenser",
    keyPrinciples: [
      "Strict LIFO (Last-In, First-Out) discipline: only the most recently added item can be removed.",
      "Push adds a new element to the top in O(1) time.",
      "Pop removes the current top element in O(1) time.",
      "Crucial in syntax parsing (matching parentheses), expression evaluation, and call-stack unwinding."
    ],
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
    order: 8,
    name: "Queue",
    category: "data-structure",
    badge: "FIFO Container",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "First-In, First-Out (FIFO). The fair line-waiting structure powering task scheduling, printer queues, and breadth-first search.",
    hook: "How do Spotify stream buffers, printer spoolers, and hospital emergency triage lines guarantee fairness without starving anyone?",
    superpower: "Strict O(1) FIFO Enqueue & Dequeue via Circular Pointers",
    tradeoff: "Only Front and Rear are Accessible; Middle Inspection is Forbidden",
    mentalModel: "An Airport Security Line (First Arrived, First Cleared)",
    keyPrinciples: [
      "Strict FIFO (First-In, First-Out) discipline: elements exit in the exact order they entered.",
      "Enqueue adds new arrivals to the rear in O(1) time.",
      "Dequeue removes the oldest waiting element from the front in O(1) time.",
      "Circular array implementations use modulo arithmetic (rear + 1) % capacity to prevent memory drift."
    ],
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
    id: "deque",
    order: 9,
    name: "Deque",
    category: "data-structure",
    badge: "Double-Ended Queue",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "The supercharged queue: insert and delete at both ends in strictly O(1) time. Master circular buffer wrap-around and monotonic sliding window algorithms.",
    hook: "What if you need the LIFO capability of a Stack and the FIFO fairness of a Queue in a single structure? Enter the Double-Ended Queue.",
    superpower: "Strict O(1) Push & Pop at BOTH Boundaries (Front & Rear)",
    tradeoff: "Slightly more complex pointer management and modulo wrapping arithmetic",
    mentalModel: "A Double-Ended Pipe Open at Both Ends",
    keyPrinciples: [
      "Subsumes both Stack and Queue: can behave as LIFO, FIFO, or bidirectional deque.",
      "Front wraps backward via (front - 1 + capacity) % capacity in O(1) time.",
      "Rear wraps forward via (rear + 1) % capacity in O(1) time.",
      "Powers monotonic deque algorithms (Sliding Window Maximum) and work-stealing schedulers in Go & Java."
    ],
    analogy: "A transparent tube open at both ends: train cars can enter or exit from the left end, or enter and exit from the right end independently without disturbing the cars in the middle.",
    idea: "A Deque (Double-Ended Queue, pronounced 'deck') is a linear sequence that allows insertions and deletions at both ends in strictly O(1) time: push_front, push_back, pop_front, and pop_back. In a circular array, modular arithmetic avoids shifting elements. In a doubly-linked list, bidirectional pointers (prev ⇄ next) allow O(1) head and tail operations.",
    sampleArray: [15, 28, 42, 56],
    codeBlocks: [
      {
        title: "Push Front via Modular Backward Wrap",
        lines: "void pushFront(int val) {\n    if (isFull()) throw overflow_error(\"Deque full\");\n    front = (front - 1 + capacity) % capacity;\n    buffer[front] = val;\n    count++;\n}",
        explanation: "Wraps the front pointer counter-clockwise in O(1) time without shifting any elements.",
      },
      {
        title: "Push Back via Modular Forward Wrap",
        lines: "void pushBack(int val) {\n    if (isFull()) throw overflow_error(\"Deque full\");\n    rear = (rear + 1) % capacity;\n    buffer[rear] = val;\n    count++;\n}",
        explanation: "Advances the rear pointer clockwise in O(1) time.",
      },
      {
        title: "Pop Front & Pop Back",
        lines: "int popFront() {\n    int val = buffer[front];\n    front = (front + 1) % capacity;\n    count--;\n    return val;\n}\nint popBack() {\n    int val = buffer[rear];\n    rear = (rear - 1 + capacity) % capacity;\n    count--;\n    return val;\n}",
        explanation: "Pops from either boundary in O(1) time by updating the respective pointer.",
      },
      {
        title: "Monotonic Deque (Sliding Window Maximum)",
        lines: "while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();\ndq.push_back(i);",
        explanation: "Pops smaller candidate elements from the back to maintain a monotonic decreasing deque where the front is always the window maximum.",
      },
    ],
    complexityWhy: {
      time: "All boundary push, pop, and peek operations run in strictly O(1) constant time. Monotonic sliding window runs in O(n) total time.",
      space: "O(1) auxiliary space per operation; O(n) overall storage for n elements.",
    },
  },

  // ==========================================
  // TIER 6: NON-CONTIGUOUS POINTER-LINKED STRUCTURES
  // ==========================================
  {
    id: "linked-list",
    order: 10,
    name: "Linked List",
    category: "data-structure",
    badge: "Pointer Chains",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Break free of contiguous memory! Dynamic nodes connected by pointers that enable instantaneous O(1) insertions at the head.",
    hook: "What if your computer's RAM is heavily fragmented and cannot find an unbroken contiguous block of memory? Enter dynamic node pointers.",
    superpower: "Instant O(1) Node Insertion at Head Without Shifting Elements",
    tradeoff: "O(n) Sequential Traversal (No O(1) Random Index Access)",
    mentalModel: "A Scavenger Hunt Where Each Clue Points to the Next",
    keyPrinciples: [
      "Nodes live scattered anywhere in heap memory, connected solely by forward next pointers.",
      "Inserting at the head is strictly O(1) — allocate a node and redirect a single pointer.",
      "To find index k, you must walk through k pointers starting from the head (O(k) traversal).",
      "No wasted pre-allocated capacity, but incurs extra memory overhead for storing pointer addresses."
    ],
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

  // ==========================================
  // TIER 6.5: ASSOCIATIVE HASH-BASED CONTAINERS
  // ==========================================
  {
    id: "hash-table",
    order: 11,
    name: "Hash Table",
    category: "data-structure",
    badge: "Direct Addressing",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Instantaneous O(1) lookups! Transform arbitrary keys into direct array indices using deterministic hash functions and smart collision handling.",
    hook: "How does Google search, database indexing, and Python dictionaries find any record in constant O(1) time among billions of items?",
    superpower: "Amortized O(1) Insertion, Deletion, and Lookup via Hash Indexing",
    tradeoff: "O(n) Worst-Case Degeneration on Pathological Collision Clustering",
    mentalModel: "A Giant Mail Sorting Room with Numbered Pigeonhole Cubbies",
    keyPrinciples: [
      "Deterministic hash function maps arbitrary keys to numeric bucket indices via modulo math: h(k) = k % capacity.",
      "Separate Chaining resolves collisions by attaching a linked list or bucket chain at each slot.",
      "Open Addressing (Linear Probing) resolves collisions by scanning for the next adjacent empty slot.",
      "Load Factor α = N / M tracks table fullness; when α > 0.75, table capacity doubles and all keys are rehashed."
    ],
    analogy: "A hotel mailroom where each room number corresponds to an exact numbered cubby on the wall. Mail arrives, the clerk drops it directly into that cubby in O(1) time without searching every room.",
    idea: "A Hash Table maps keys to values. A mathematical hash function converts a key into a slot index in a backing array. When two keys map to the same slot (a collision), separate chaining stores both in a linked list, while linear probing checks the next slot.",
    sampleArray: [12, 25, 38, 51],
    codeBlocks: [
      {
        title: "Deterministic Hash Function",
        lines: "int hash(int key) const {\n    return abs(key) % capacity;\n}",
        explanation: "Computes the slot index in strictly O(1) time by taking the positive remainder modulo capacity.",
      },
      {
        title: "Separate Chaining Insertion",
        lines: "void insert(int key, const string& val) {\n    if ((float)(count + 1) / capacity > 0.75) rehash();\n    int idx = hash(key);\n    for (auto& [k, v] : table[idx]) {\n        if (k == key) { v = val; return; }\n    }\n    table[idx].emplace_back(key, val);\n    count++;\n}",
        explanation: "Traverses bucket chain to update existing key or appends a new node in O(1) average time.",
      },
      {
        title: "Lookup & Retrieval",
        lines: "bool search(int key, string& outVal) const {\n    int idx = hash(key);\n    for (const auto& [k, v] : table[idx]) {\n        if (k == key) { outVal = v; return true; }\n    }\n    return false;\n}",
        explanation: "Jumps immediately to the bucket index and scans short collision chain in O(1) expected time.",
      },
      {
        title: "Two Sum Hash Optimization",
        lines: "unordered_map<int, int> seen;\nfor (int i = 0; i < nums.size(); i++) {\n    int comp = target - nums[i];\n    if (seen.count(comp)) return {seen[comp], i};\n    seen[nums[i]] = i;\n}",
        explanation: "Replaces naive O(n²) nested loop pair comparison with single-pass O(1) map lookups in O(n) total time.",
      },
    ],
    complexityWhy: {
      time: "Average case is O(1) for insert, search, and delete assuming uniform hashing distribution. Worst case degrades to O(n) if all keys hash to the same bucket.",
      space: "O(n) storage for n key-value pairs plus table bucket buffer overhead.",
    },
  },

  // ==========================================
  // TIER 6.6: NON-LINEAR HIERARCHICAL TREES
  // ==========================================
  {
    id: "binary-tree",
    order: 12,
    name: "Binary Tree",
    category: "data-structure",
    badge: "Hierarchical Nodes",
    estimatedTime: "~20 min",
    difficulty: "Intermediate",
    reason: "Step out of flat linear data! Learn recursive branching, tree terminology (root, height, depth, leaf), and fundamental DFS & BFS traversals.",
    hook: "Filesystems, DOM trees, compiler ASTs, and database B-trees all break free from 1D flat arrays. How does a single root branch out to represent millions of items?",
    superpower: "Hierarchical Branching & Divide-and-Conquer Recursive Problem Solving",
    tradeoff: "O(n) Worst-Case Degeneration into a Linked List on Skewed Trees",
    mentalModel: "An Inverted Family Tree or Branching River Delta",
    keyPrinciples: [
      "A non-linear tree where every node contains at most two children: Left and Right.",
      "Root has depth 0; leaves are nodes with no children (left == nullptr && right == nullptr).",
      "Height is the maximum number of edges from the node to a leaf (Height of tree = Height of root).",
      "Depth-First Search (DFS) traversals: Pre-order (NLR), In-order (LNR), and Post-order (LRN).",
      "Breadth-First Search (BFS): Level-order traversal using a FIFO queue."
    ],
    analogy: "An upside-down tree with its root in the sky and branches growing downward. Each branch can split into at most two twigs (left and right), ending at the leaves.",
    idea: "A Binary Tree is a hierarchical data structure where each node stores a payload and pointers to at most two child nodes (left and right). Recursive subproblems naturally match tree subtrees: solving a problem on a tree means solving it on the left and right subtrees and combining the results.",
    sampleArray: [1, 2, 3, 4, 5, 6, 7],
    codeBlocks: [
      {
        title: "TreeNode Structure",
        lines: "struct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};",
        explanation: "Each node holds a value and two child pointers initialized to nullptr.",
      },
      {
        title: "Recursive In-Order Traversal (LNR)",
        lines: "void inOrder(TreeNode* root, vector<int>& res) {\n    if (!root) return;\n    inOrder(root->left, res);\n    res.push_back(root->val);\n    inOrder(root->right, res);\n}",
        explanation: "Recursively processes left subtree, visits current node, then processes right subtree.",
      },
      {
        title: "Level-Order Traversal (BFS Queue)",
        lines: "vector<int> levelOrder(TreeNode* root) {\n    vector<int> res;\n    if (!root) return res;\n    queue<TreeNode*> q; q.push(root);\n    while (!q.empty()) {\n        TreeNode* curr = q.front(); q.pop();\n        res.push_back(curr->val);\n        if (curr->left) q.push(curr->left);\n        if (curr->right) q.push(curr->right);\n    }\n    return res;\n}",
        explanation: "Uses a FIFO queue to visit nodes level-by-level from top to bottom, left to right.",
      },
      {
        title: "Calculating Maximum Depth / Height",
        lines: "int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}",
        explanation: "Recursively finds the deepest path from the current node down to any leaf.",
      },
    ],
    complexityWhy: {
      time: "Traversals visit every node exactly once: O(n) time. Insertion via BFS takes O(n) to find the first open child slot.",
      space: "O(h) call stack memory for DFS recursion where h is height (O(log n) balanced, O(n) skewed). BFS queue takes O(w) where w is max level width.",
    },
  },

  // ==========================================
  // TIER 7: ELEMENTARY QUADRATIC SORTING
  // ==========================================
  {
    id: "bubble",
    order: 13,
    name: "Bubble Sort",
    category: "sorting",
    badge: "Adjacent Swaps",
    estimatedTime: "~10 min",
    difficulty: "Beginner",
    reason: "Your first sorting algorithm: compare neighbors and swap if they are in the wrong order until all items bubble into place.",
    hook: "What is the absolute simplest way to sort a messy list if you are only ever allowed to compare two neighboring items at a time?",
    superpower: "O(n) Adaptive Best Case on Already Sorted Lists",
    tradeoff: "O(n²) Slow Nested Comparisons on Inverted Data",
    mentalModel: "Bubbles Rising to the Surface of Carbonated Water",
    keyPrinciples: [
      "Scan from left to right, comparing adjacent neighbors (arr[j], arr[j+1]).",
      "If the left item is strictly greater than the right item, swap them immediately.",
      "After each full pass, the largest remaining unsorted item is permanently settled at the far right.",
      "Early-Exit Optimization: If a full pass finishes with 0 swaps, terminate immediately in O(n) time."
    ],
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
    order: 14,
    name: "Selection Sort",
    category: "sorting",
    badge: "Find Minimum",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Different strategy, same simplicity: scan the unsorted pool, find the smallest item, and swap it into place once per pass.",
    hook: "If moving physical objects in memory is expensive, how do you sort an entire collection with the absolute minimum number of total swaps?",
    superpower: "Strictly O(n) Swaps (At Most 1 Single Swap per Pass)",
    tradeoff: "Always O(n²) Comparisons Regardless of Input Order",
    mentalModel: "Scanning a Shelf to Find the Absolute Shortest Book",
    keyPrinciples: [
      "Divide the array into two zones: a sorted prefix on the left, and an unsorted pool on the right.",
      "Scan the entire unsorted pool to locate the index of the absolute minimum item.",
      "Execute exactly ONE swap to place that minimum into its correct position at the boundary.",
      "Repeat until the unsorted pool is empty. Never benefits from partially sorted data."
    ],
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
    order: 15,
    name: "Insertion Sort",
    category: "sorting",
    badge: "Hand-Sorting Cards",
    estimatedTime: "~15 min",
    difficulty: "Beginner",
    reason: "Most practical O(n²) algorithm: slide each item into its proper sorted slot just like arranging playing cards in your hand.",
    hook: "Watch how card players sort a hand as cards are dealt one by one: they slide each card into its exact slot. Why is this nearly instant on almost-sorted data?",
    superpower: "Blazing Near O(n) Speed on Almost-Sorted Real-World Data",
    tradeoff: "O(n²) Worst Case with Heavy Shifting on Inverted Arrays",
    mentalModel: "Slotting Playing Cards into Your Left Hand",
    keyPrinciples: [
      "Assume the first item is already sorted.",
      "Pick the next item (the 'key') and inspect the sorted items to its left.",
      "Shift all items greater than the key one slot to the right to open a vacancy.",
      "Drop the key into the open slot. Extremely fast and cache-friendly for small collections."
    ],
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

  // ==========================================
  // TIER 8: ADVANCED DIVIDE-AND-CONQUER SORTING
  // ==========================================
  {
    id: "merge",
    order: 16,
    name: "Merge Sort",
    category: "sorting",
    badge: "Divide & Conquer",
    estimatedTime: "~20 min",
    difficulty: "Intermediate",
    reason: "Divide the problem, conquer the halves, and merge them in linear time. Guaranteed O(n log n) efficiency for massive datasets.",
    hook: "Can you sort a list of 1,000,000 numbers in under a second by repeatedly breaking it in half? The mathematical triumph of divide-and-conquer.",
    superpower: "Guaranteed O(n log n) Rock-Solid Worst-Case Predictability",
    tradeoff: "Requires O(n) Auxiliary RAM Buffer for Merging",
    mentalModel: "Zipping Two Sorted Decks of Cards Together",
    keyPrinciples: [
      "Divide: Recursively split the array in half until single-item subarrays remain.",
      "Base Case: An array of 1 element is inherently sorted.",
      "Conquer: Merge two sorted subarrays by comparing heads with a two-pointer pass.",
      "Guaranteed O(n log n) performance regardless of whether data is random, sorted, or reversed."
    ],
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
    order: 17,
    name: "Quick Sort",
    category: "sorting",
    badge: "Pivot Partition",
    estimatedTime: "~25 min",
    difficulty: "Intermediate",
    reason: "The gold standard in-place sorting algorithm used in production runtimes: partition around a pivot for blazing average-case speed.",
    hook: "Why does nearly every programming language standard library (C++, Java, Rust) default to Quicksort over every other sorting algorithm?",
    superpower: "Blazing Real-World Cache Locality & In-Place Speed",
    tradeoff: "O(n²) Worst Case if an Unbalanced Pivot is Selected",
    mentalModel: "Height Partitioning Around a Center Reference Student",
    keyPrinciples: [
      "Pick a reference element called the pivot.",
      "Partition the array: move all smaller elements left, and all larger elements right.",
      "The pivot lands in its permanent, mathematically settled spot.",
      "Recursively repeat partitioning on the left and right sides without needing temporary arrays."
    ],
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
  {
    term: "Binary Tree",
    category: "Data Structures",
    definition: "A hierarchical structure where every node has at most two children: left and right.",
  },
  {
    term: "Root Node",
    category: "Data Structures",
    definition: "The top-most node in a tree with no parent, serving as the single entry point.",
  },
  {
    term: "Leaf Node",
    category: "Data Structures",
    definition: "A terminating node in a tree with no children (both left and right pointers are nullptr).",
  },
  {
    term: "Tree Traversal",
    category: "Data Structures",
    definition: "Systematically visiting every node in a tree exactly once, either Depth-First (DFS) or Breadth-First (BFS).",
  },
];
