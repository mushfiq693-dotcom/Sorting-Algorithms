import { AlgorithmId } from "@/types/sorting";

export interface DiagramData {
  algorithmId: AlgorithmId;
  title: string;
  subtitle: string;
  caption: string;
  fixedArray: number[];
  complexityFormula: string;
  complexityExplanation: string;
  codeSnippet: string;
  highlightedLine: number;
}

export const DIAGRAM_CONFIGS: Record<AlgorithmId, DiagramData> = {
  bubble: {
    algorithmId: "bubble",
    title: "Bubble Sort — Pass-by-Pass Settling Timeline",
    subtitle: "Observe how each outer pass bubbles the largest remaining element to the sorted right boundary.",
    caption: "Each pass pushes the largest remaining element into place — like a bubble rising.",
    fixedArray: [5, 1, 4, 2, 8],
    complexityFormula: "Comparisons = (n-1) + (n-2) + ... + 1 = n(n-1)/2 → O(n²)",
    complexityExplanation: "Each pass looks at one fewer element as the sorted boundary expands from right to left.",
    codeSnippet: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]); // Bubble larger element right
                swapped = true;
            }
        }
        if (!swapped) break; // Early exit optimization
    }
}`,
    highlightedLine: 7,
  },
  selection: {
    algorithmId: "selection",
    title: "Selection Sort — Sorted vs Unsorted Split View",
    subtitle: "A moving boundary partitions the array: find the absolute minimum in the unsorted zone, then swap it into the boundary.",
    caption: "Each round finds the smallest remaining value and moves it to the sorted edge.",
    fixedArray: [64, 25, 12, 22, 11],
    complexityFormula: "Comparisons = (n-1) + (n-2) + ... + 1 = O(n²) always",
    complexityExplanation: "Selection sort always scans the entire unsorted region regardless of initial data order.",
    codeSnippet: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i; // Assume first unsorted is minimum
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j; // Track smallest
        }
        swap(arr[i], arr[minIdx]); // Move minimum to sorted edge
    }
}`,
    highlightedLine: 8,
  },
  insertion: {
    algorithmId: "insertion",
    title: "Insertion Sort — Key Extraction & Shift Zone",
    subtitle: "Like arranging cards in hand: lift the key element, shift larger elements right, and drop the key into the gap.",
    caption: "Lift the next card, shift larger cards right, then insert it into the gap.",
    fixedArray: [8, 3, 5, 1, 9, 2],
    complexityFormula: "Best: O(n) (already sorted) | Worst: O(n²) (reverse sorted)",
    complexityExplanation: "Elements shift right one position at a time until finding the key's exact sorted position.",
    codeSnippet: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i]; // Lift the unsorted card
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; // Shift larger elements right
            j--;
        }
        arr[j + 1] = key; // Insert key into the gap
    }
}`,
    highlightedLine: 7,
  },
  merge: {
    algorithmId: "merge",
    title: "Merge Sort — Divide & Conquer Recursion Tree",
    subtitle: "Recursively halve the array into single elements, then merge sorted halves back upward level-by-level.",
    caption: "Split until single elements, then merge pairs back together in sorted order.",
    fixedArray: [38, 27, 43, 3, 9, 82, 10, 19],
    complexityFormula: "Depth: log₂8 = 3 levels | Work per level: O(n) → Total: O(n log n)",
    complexityExplanation: "The tree depth is strictly logarithmic; merging across all nodes at any level takes linear time.",
    codeSnippet: `void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]); // Take smaller
        else temp.push_back(arr[j++]);
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);
    for (int k = left; k <= right; k++) arr[k] = temp[k - left];
}`,
    highlightedLine: 5,
  },
  quick: {
    algorithmId: "quick",
    title: "Quick Sort — Asymmetric Partition Recursion Tree",
    subtitle: "Pick a pivot, partition into smaller and greater halves in-place, then recursively sort each sub-partition.",
    caption: "Pick a pivot, partition around it, then recurse on each side independently.",
    fixedArray: [33, 10, 55, 71, 29, 14, 42, 60],
    complexityFormula: "Average: O(n log n) | Worst Case: O(n²) (if pivot splits 0 / n-1)",
    complexityExplanation: "Unlike Merge Sort, Quick Sort's tree shape is asymmetric and depends directly on pivot selection.",
    codeSnippet: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // Select rightmost element as pivot
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]); // Move smaller elements left
        }
    }
    swap(arr[i + 1], arr[high]); // Place pivot in its true final slot
    return i + 1;
}`,
    highlightedLine: 7,
  },
  array: {
    algorithmId: "array",
    title: "Array — Contiguous Physical Memory Layout & Index Arithmetic",
    subtitle: "Elements reside in an unbroken sequential block of physical RAM addresses, enabling single-instruction O(1) random access.",
    caption: "Hardware calculates address directly via Base + (index × elementSize) without searching through previous nodes.",
    fixedArray: [14, 28, 42, 56, 70],
    complexityFormula: "Address(arr[i]) = BaseAddress + (i × sizeof(T)) → O(1) Access",
    complexityExplanation: "Direct arithmetic computation delivers O(1) access and peak hardware CPU cache line spatial locality.",
    codeSnippet: `// Direct O(1) Indexing Calculation
// BaseAddress = 0x7FFF00, sizeof(int) = 4 Bytes
int getElement(int* arr, int index) {
    // Hardware generates: *(arr + index)
    return arr[index]; // 0x7FFF00 + (index * 4) -> O(1)
}`,
    highlightedLine: 5,
  },
  string: {
    algorithmId: "string",
    title: "String — Contiguous Character Buffer, ASCII & Immutability Architecture",
    subtitle: "Characters reside in sequential 1-byte physical RAM cells ending with '\\0'. Contiguous layout empowers O(n) two-pointer reversals and sliding windows, while immutability incurs O(n) reallocation penalties.",
    caption: "Hardware accesses character bytes directly in O(1) time via Base + (index × 1B). Mutable strings permit in-place edits, while immutable runtimes duplicate the entire buffer.",
    fixedArray: [65, 76, 71, 79, 82, 73, 84, 72, 77], // ASCII for "ALGORITHM"
    complexityFormula: "Address(str[i]) = BaseAddress + (i × 1 Byte) → O(1) Access",
    complexityExplanation: "1-byte contiguous indexing guarantees instantaneous random reads and zero pointer hopping.",
    codeSnippet: `// 1. Two-Pointer In-Place Reversal: O(n) Time, O(1) Auxiliary Space
void reverseString(string& s) {
    int left = 0, right = (int)s.size() - 1;
    while (left < right) {
        swap(s[left++], s[right--]); // In-place character byte swap
    }
}

// 2. Sliding Window: Longest Substring Without Repeating Chars: O(n)
int longestUniqueSubstring(const string& s) {
    vector<int> lastPos(256, -1);
    int maxLen = 0, left = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        if (lastPos[(unsigned char)s[right]] >= left)
            left = lastPos[(unsigned char)s[right]] + 1;
        lastPos[(unsigned char)s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    highlightedLine: 5,
  },
  deque: {
    algorithmId: "deque",
    title: "Deque — Double-Ended Queue Circular Array & Node Chain Blueprint",
    subtitle: "Supports instantaneous O(1) push and pop operations at both the Front and Rear boundaries using modular arithmetic wrap-around or bidirectional node pointers.",
    caption: "Front wraps backward via (F - 1 + N) % N, while Rear wraps forward via (R + 1) % N without costly element shifts.",
    fixedArray: [42, 58, 73, 89],
    complexityFormula: "pushFront, pushBack, popFront, popBack, peekFront, peekBack = O(1)",
    complexityExplanation: "Both boundaries update their pointers directly in single-instruction modular time without shifting intermediate items.",
    codeSnippet: `// Circular Array Deque Wrap Operations
void pushFront(int val) {
    if (size == capacity) throw overflow_error("Deque full");
    front = (front - 1 + capacity) % capacity; // Modular backward wrap
    buffer[front] = val;
    size++;
}

void pushBack(int val) {
    if (size == capacity) throw overflow_error("Deque full");
    rear = (rear + 1) % capacity; // Modular forward wrap
    buffer[rear] = val;
    size++;
}`,
    highlightedLine: 4,
  },
  stack: {
    algorithmId: "stack",
    title: "Stack — LIFO Push, Pop & Call Stack Anatomy",
    subtitle: "A vertical container where insertions and deletions strictly occur at the Top pointer.",
    caption: "The most recently added element is always the first to be retrieved (Last-In, First-Out).",
    fixedArray: [10, 20, 30, 40],
    complexityFormula: "All primary operations: push(x), pop(), top(), isEmpty() = O(1)",
    complexityExplanation: "Direct index topIndex modification without shifting or scanning elements.",
    codeSnippet: `class ArrayStack {
    int arr[1000];
    int topIndex = -1;
public:
    void push(int x) { arr[++topIndex] = x; }
    void pop() { if (topIndex >= 0) topIndex--; }
    int top() { return arr[topIndex]; }
};`,
    highlightedLine: 5,
  },
  queue: {
    algorithmId: "queue",
    title: "Queue — FIFO Circular Buffer Ring Architecture",
    subtitle: "A horizontal container where elements enter at the Rear and exit from the Front using modulo arithmetic.",
    caption: "The first element to arrive is the first to be processed (First-In, First-Out).",
    fixedArray: [5, 15, 25, 35],
    complexityFormula: "All primary operations: enqueue(x), dequeue(), front() = O(1)",
    complexityExplanation: "Circular modulo pointer wrapping (rear + 1) % capacity avoids O(n) element shifting.",
    codeSnippet: `class CircularQueue {
    int arr[8], front = 0, rear = -1, count = 0;
public:
    void enqueue(int x) {
        rear = (rear + 1) % 8;
        arr[rear] = x;
        count++;
    }
};`,
    highlightedLine: 5,
  },
  "time-complexity": {
    algorithmId: "time-complexity",
    title: "Time Complexity — Asymptotic Growth Curves & Big-O Hierarchy",
    subtitle: "Observe how instruction step counts scale across constant O(1), logarithmic O(log n), linear O(n), log-linear O(n log n), and quadratic O(n²) tiers.",
    caption: "Big-O evaluates operation scalability by dropping constant multipliers and keeping only dominant terms.",
    fixedArray: [1, 2, 4, 8, 16, 32, 64, 128],
    complexityFormula: "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)",
    complexityExplanation: "Asymptotic bounds evaluate algorithmic growth rate independently of hardware CPU speed.",
    codeSnippet: `// Asymptotic Loop Growth Hierarchy
// 1. O(log n) Binary Division
while (low <= high) { mid = (low + high) / 2; ... }

// 2. O(n) Linear Traversal
for (int i = 0; i < n; i++) { ... }

// 3. O(n^2) Quadratic Nested Loops
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) { ... }
}`,
    highlightedLine: 8,
  },
  "space-complexity": {
    algorithmId: "space-complexity",
    title: "Space Complexity — Memory Hierarchy & Auxiliary Allocation",
    subtitle: "Distinguishing input storage from auxiliary working memory, dynamic heap buffers, and recursive call stack depth.",
    caption: "Auxiliary space measures only the extra working memory allocated by the algorithm itself.",
    fixedArray: [10, 20, 30, 40, 50],
    complexityFormula: "Total Space = Input Space O(n) + Auxiliary Space S(n)",
    complexityExplanation: "In-place algorithms maintain auxiliary space at O(1) or O(log n) recursion call stack depth.",
    codeSnippet: `// 1. O(1) Auxiliary Space (In-Place Pointers)
void reverseInPlace(vector<int>& arr) {
    int l = 0, r = arr.size() - 1;
    while (l < r) swap(arr[l++], arr[r--]);
}

// 2. O(n) Auxiliary Space (Heap Vector Buffer)
vector<int> temp(arr.size()); // Consumes n auxiliary ints`,
    highlightedLine: 3,
  },
  "linear-search": {
    algorithmId: "linear-search",
    title: "Linear Search — Sequential Element Examination",
    subtitle: "Steps through elements sequentially from index 0 until the target is found or the array ends.",
    caption: "Linear Search examines elements one by one without needing sorted data, stopping as soon as a match is found.",
    fixedArray: [42, 17, 89, 23, 56, 12, 78],
    complexityFormula: "Best: O(1) • Average: (n+1)/2 → O(n) • Worst: O(n)",
    complexityExplanation: "Requires 1 comparison if target is at index 0, but n comparisons if target is last or absent.",
    codeSnippet: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size(); i++) {
        if (arr[i] == target) {
            return i; // Early exit on match: O(1) best case
        }
    }
    return -1; // Exhausted collection: O(n) worst case
}`,
    highlightedLine: 4,
  },
  "binary-search": {
    algorithmId: "binary-search",
    title: "Binary Search — Search-Range-Shrinking Timeline",
    subtitle: "Repeatedly cuts the sorted candidate interval in half by comparing the target with the middle element.",
    caption: "Each comparison eliminates half of the remaining elements, guaranteeing an O(log n) search time.",
    fixedArray: [12, 24, 32, 45, 57, 68, 81, 99],
    complexityFormula: "Recurrence: T(n) = T(n/2) + O(1) → O(log n)",
    complexityExplanation: "Repeated division by 2 guarantees termination in at most ⌈log₂(n)⌉ comparisons on sorted data.",
    codeSnippet: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents 32-bit overflow
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1; // Discard left half
        else high = mid - 1; // Discard right half
    }
    return -1;
}`,
    highlightedLine: 5,
  },
  "linked-list": {
    algorithmId: "linked-list",
    title: "Linked List — Dynamic Node Pointer Architecture",
    subtitle: "Nodes scattered across memory connected via pointers: O(1) head insertion vs O(n) traversal search.",
    caption: "Prepend at the head takes O(1) time without shifting any elements, while search requires following pointers sequentially.",
    fixedArray: [10, 25, 42, 60],
    complexityFormula: "Insert Head: O(1) • Insert Tail: O(n) • Search: O(n)",
    complexityExplanation: "Manipulating node pointers circumvents array contiguous memory shifts, but sacrifices O(1) index access.",
    codeSnippet: `// O(1) Head Insertion
void insertAtHead(int val) {
    Node* newNode = new Node(val);
    newNode->next = head; // Point new node to current head
    head = newNode;       // Update head pointer: O(1) time
}

// O(n) Pointer Traversal Search
bool search(int target) {
    Node* curr = head;
    while (curr) {
        if (curr->val == target) return true;
        curr = curr->next; // O(n) sequential pointer hop
    }
    return false;
}`,
    highlightedLine: 4,
  },
  "hash-table": {
    algorithmId: "hash-table",
    title: "Hash Table — Direct Addressing, Hash Functions & Collision Resolution",
    subtitle: "Maps keys to array buckets via h(key) = key % capacity with Separate Chaining and Linear Probing.",
    caption: "Instantaneous O(1) expected time for insert, search, and delete with well-distributed hashing.",
    fixedArray: [12, 25, 38, 51],
    complexityFormula: "Insert: O(1) avg • Search: O(1) avg • Delete: O(1) avg • Worst: O(n)",
    complexityExplanation: "Direct bucket jump calculates memory offset instantaneously, degrading only on severe collision clustering.",
    codeSnippet: `// O(1) Average Hash Table Lookup
int idx = abs(key) % capacity;
for (const auto& [k, v] : table[idx]) {
    if (k == key) return v; // Found in bucket chain
}
return -1; // Not found`,
    highlightedLine: 2,
  },
  "binary-tree": {
    algorithmId: "binary-tree",
    title: "Binary Tree — Hierarchical Node Topology & Traversal Orders",
    subtitle: "Root node branching down to left and right subtrees with Depth-First (DFS) and Breadth-First (BFS) paths.",
    caption: "Recursive tree structure: solving a problem on a tree reduces to solving identical subproblems on left and right child subtrees.",
    fixedArray: [1, 2, 3, 4, 5, 6, 7],
    complexityFormula: "Traversals: O(n) • Height/Depth: O(n) • Call Stack: O(h)",
    complexityExplanation: "Every node is visited exactly once in O(n) time. Auxiliary call stack memory is bounded by tree height h (O(log n) balanced, O(n) skewed).",
    codeSnippet: `// Recursive Depth-First Traversals
void inOrder(TreeNode* root) {
    if (!root) return;
    inOrder(root->left);   // 1. Traverse Left subtree
    visit(root->val);      // 2. Process Current Root
    inOrder(root->right);  // 3. Traverse Right subtree
}`,
    highlightedLine: 3,
  },
  bst: {
    algorithmId: "bst",
    title: "Binary Search Tree — Ordered Search, Insertion & 3-Case Deletion",
    subtitle: "Left subtree keys < Root < Right subtree keys enable logarithmic lookup and sorted in-order sequence.",
    caption: "Binary decision at each node eliminates half of the remaining subtrees, achieving O(log n) average search.",
    fixedArray: [50, 30, 70, 20, 40, 60, 80],
    complexityFormula: "Search/Insert/Delete: O(log n) avg, O(n) worst • In-Order: O(n) sorted",
    complexityExplanation: "Height h governs all operations. Balanced BST guarantees h = floor(log2 n). Skewed insertion degrades height to n (linear linked list).",
    codeSnippet: `// O(log n) Average BST Search
TreeNode* search(TreeNode* root, int key) {
    if (!root || root->val == key) return root;
    if (key < root->val)
        return search(root->left, key);  // Prune right half
    return search(root->right, key);     // Prune left half
}`,
    highlightedLine: 4,
  },
  "avl-tree": {
    algorithmId: "avl-tree",
    title: "AVL Tree — Height-Balanced Self-Correction via Tree Rotations",
    subtitle: "Maintains Balance Factor BF = h(left) - h(right) ∈ {-1, 0, 1} with LL, RR, LR, and RL rotations.",
    caption: "Automatic O(1) rotation primitives rebalance the tree whenever insertion or deletion causes |BF| ≥ 2.",
    fixedArray: [50, 25, 75, 15, 35, 65, 85],
    complexityFormula: "Search: O(log n) • Insert: O(log n) • Delete: O(log n) • Max Height: 1.44 log₂(n)",
    complexityExplanation: "Strict height balancing guarantees tree height h never exceeds 1.44 log2(n), completely eliminating the O(n) skew hazard of ordinary BSTs.",
    codeSnippet: `// O(1) Right Rotation (LL Case)
AVLNode* rotateRight(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    x->right = y;   // y becomes right child of x
    y->left = T2;   // T2 becomes left child of y
    updateHeight(y);
    updateHeight(x);
    return x;       // New subtree root
}`,
    highlightedLine: 4,
  },
  heap: {
    algorithmId: "heap",
    title: "Binary Heap — Pointerless Complete Tree Array Mapping",
    subtitle: "Complete binary tree invariants mapped directly to 1D contiguous RAM with Parent ⌊(i-1)/2⌋ and Children 2i+1, 2i+2.",
    caption: "Sift-Up and Sift-Down maintain heap order in O(log n), while Bottom-Up Heapify builds the entire heap in linear O(n) time.",
    fixedArray: [10, 20, 15, 30, 40, 50, 60],
    complexityFormula: "Peek: O(1) • Insert: O(log n) • Extract: O(log n) • Build-Heap: O(n)",
    complexityExplanation: "Array indexing eliminates pointer overhead and guarantees optimal CPU L1/L2 cache locality, making heaps the premier choice for priority queues.",
    codeSnippet: `// O(log n) Sift-Down (Min-Heap)
void siftDown(int i, int n) {
    int smallest = i;
    int l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] < arr[smallest]) smallest = l;
    if (r < n && arr[r] < arr[smallest]) smallest = r;
    if (smallest != i) {
        swap(arr[i], arr[smallest]);
        siftDown(smallest, n);
    }
}`,
    highlightedLine: 7,
  },
  "priority-queue": {
    algorithmId: "priority-queue",
    title: "Priority Queue — Task Scheduling & Greedy Exploration Engine",
    subtitle: "Abstract Priority Queue ADT backed by an efficient Binary Heap with O(1) peek and O(log n) push/pop.",
    caption: "Essential for OS kernel thread dispatchers, Emergency Room triage, network packet prioritization, and Dijkstra / A* graph algorithms.",
    fixedArray: [99, 90, 84, 72, 68, 25, 15],
    complexityFormula: "Peek: O(1) • Enqueue: O(log n) • Dequeue: O(log n) • Decrease-Key: O(log n)",
    complexityExplanation: "Balanced O(log n) insertions and extractions combined with O(1) top-priority inspection deliver the optimal tradeoff compared to O(n) unsorted or sorted array implementations.",
    codeSnippet: `// Priority Queue Task Extraction
Task extractTop() {
    if (heap.empty()) throw runtime_error("Empty queue");
    Task top = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    siftDown(0);
    return top;
}`,
    highlightedLine: 3,
  },
  "union-find": {
    algorithmId: "union-find",
    title: "Union-Find (DSU) — Disjoint Set Forests & Path Compression",
    subtitle: "Dynamic partitioning of n elements into equivalence classes with near-constant O(α(n)) amortized queries.",
    caption: "Essential for Kruskal's Minimum Spanning Tree, dynamic network connectivity, image segmentation, and cycle detection.",
    fixedArray: [0, 0, 0, 3, 3, 5],
    complexityFormula: "Find: O(α(n)) ≈ O(1) • Union: O(α(n)) ≈ O(1) • Connected: O(α(n)) • Space: O(n)",
    complexityExplanation: "Combining Union by Rank/Size with Path Compression achieves the theoretical lower bound: O(m · α(n)) total runtime for m operations across n elements, where α(n) ≤ 4 for any practical input.",
    codeSnippet: `// Disjoint Set Union with Path Compression
int find(int i) {
    if (parent[i] == i) return i;
    return parent[i] = find(parent[i]); // Path compression
}

void unite(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return; // Cycle detected
    if (rank[rx] < rank[ry]) swap(rx, ry);
    parent[ry] = rx;
    if (rank[rx] == rank[ry]) rank[rx]++;
}`,
    highlightedLine: 3,
  },
  "two-pointers": {
    algorithmId: "two-pointers",
    title: "Two Pointers — Invariant Search & Memory Compaction",
    subtitle: "Pruning search spaces from O(n²) to O(n) and mutating linear structures in-place with O(1) auxiliary space.",
    caption: "The foundational technique for Two Sum, Container With Most Water, 3Sum, In-Place Duplication Removal, and Floyd Cycle Detection.",
    fixedArray: [1, 2, 4, 6, 8, 11, 15],
    complexityFormula: "Time: O(n) Single Pass • Space: O(1) Auxiliary • Pruning: Eliminates O(n²) Brute Force",
    complexityExplanation: "Monotonicity in sorted arrays guarantees that moving Left rightward strictly increases the sum while moving Right leftward strictly decreases it. Every comparison eliminates an entire row or column of the pair matrix.",
    codeSnippet: `// Sorted Two Sum in O(n) Time & O(1) Space
bool twoSum(vector<int>& arr, int target, int& l, int& r) {
    l = 0; r = arr.size() - 1;
    while (l < r) {
        int sum = arr[l] + arr[r];
        if (sum == target) return true;
        if (sum < target) l++; // Need larger sum
        else r--;              // Need smaller sum
    }
    return false;
}`,
    highlightedLine: 6,
  },
  "sliding-window": {
    algorithmId: "sliding-window",
    title: "Sliding Window — Contiguous Frame Tracking & Delta Math",
    subtitle: "Converting O(n·k) and O(n²) nested substring searches into O(n) linear single-pass amortized sweeps.",
    caption: "The foundational paradigm for Fixed-Size Maximum Sum, Dynamic Subarray Sum >= S, Longest Substring Without Repeating Characters, and Sliding Window Maximum.",
    fixedArray: [2, 1, 5, 1, 3, 2, 8, 4],
    complexityFormula: "Time: O(n) Amortized (2n pointer moves) • Space: O(1) or O(k) • Optimization: Delta Math",
    complexityExplanation: "By adding the newly included element at R and subtracting the excluded element at L-1, window states transition in O(1) time. Both pointers advance monotonically without backtracking.",
    codeSnippet: `// Maximum Sum Subarray of Fixed Size K in O(n)
int maxSumSubarray(const vector<int>& arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int r = k; r < arr.size(); r++) {
        windowSum += arr[r] - arr[r - k]; // O(1) delta slide
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
    highlightedLine: 7,
  },
  "prefix-sum": {
    algorithmId: "prefix-sum",
    title: "Prefix Sum & Difference Arrays — Cumulative Precomputation & O(1) Boundary Sweeps",
    subtitle: "Trading linear precomputation for O(1) arbitrary range queries and transforming batch updates from O(Q·N) into O(Q + N).",
    caption: "The foundational paradigm for Immutable Range Sum Query (1D/2D), Subarray Sum Equals K (LC 560), Product Except Self, and Batch Difference Schedules.",
    fixedArray: [3, 1, 4, 1, 5, 9, 2, 6],
    complexityFormula: "Precompute: O(N) • Range Query: O(1) • Range Update: O(1) • Space: O(N) or O(1)",
    complexityExplanation: "Cumulative prefix summation P[i] = P[i-1] + A[i-1] decouples query interval size from computation time: sum(L, R) evaluates in exactly 1 subtraction P[R+1] - P[L]. Difference arrays invert this relation, allowing batch range increments in O(1) boundary writes.",
    codeSnippet: `// 1D Prefix Sum Construction & O(1) Query
vector<int> buildPrefix(const vector<int>& A) {
    int n = A.size();
    vector<int> P(n + 1, 0);
    for (int i = 0; i < n; i++) P[i + 1] = P[i] + A[i];
    return P;
}
int queryRange(const vector<int>& P, int L, int R) {
    return P[R + 1] - P[L]; // O(1) instant subtraction
}`,
    highlightedLine: 8,
  },
  "binary-search-patterns": {
    algorithmId: "binary-search-patterns",
    title: "Binary Search Patterns — Logarithmic Halving & Monotonic Invariants",
    subtitle: "Generalizing binary search beyond simple lookups into boundary detection, rotated sorted arrays, monotone predicate optimization, and gradient climbing.",
    caption: "The foundational paradigm for Lower/Upper Bound (LC 34), Rotated Sorted Array (LC 33), Koko Eating Bananas (LC 875), and Peak Element (LC 162).",
    fixedArray: [1, 3, 5, 5, 5, 8, 12, 19],
    complexityFormula: "Time: O(log N) Space Halving • Auxiliary Space: O(1) Iterative • Search on Answer: O(N · log(Range))",
    complexityExplanation: "By testing a middle candidate against an invariant predicate, half the candidate space is eliminated unconditionally at each step. Works on any domain where the predicate f(x) exhibits a monotonic step [F...F, T...T].",
    codeSnippet: `// Universal Binary Search Pattern on Monotonic Predicate [low, high]
int binarySearchPredicate(int low, int high) {
    int ans = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevent overflow
        if (isValid(mid)) {
            ans = mid;         // Record candidate
            high = mid - 1;    // Seek smaller valid answer
        } else {
            low = mid + 1;     // Seek feasibility to the right
        }
    }
    return ans;
}`,
    highlightedLine: 6,
  },
  "backtracking": {
    algorithmId: "backtracking",
    title: "Backtracking — Constraint Satisfaction & Decision Tree Architecture",
    subtitle: "Depth-first choose-explore-undo search that prunes invalid branches and backtracks to explore alternatives.",
    caption: "N-Queens places queens row-by-row with column/diagonal conflict checks; Subsets branch via include/exclude at every element.",
    fixedArray: [1, 2, 3],
    complexityFormula: "N-Queens: O(N!) worst | Subsets: O(2ⁿ) | Aux Space: O(N) recursion stack",
    complexityExplanation: "Each row tries up to N columns (N-Queens) or each element doubles branches (Subsets). Constraint pruning discards entire subtrees without visiting them.",
    codeSnippet: `// Backtracking Choose → Explore → Undo
bool solve(int row) {
    if (row == n) return true;           // Leaf: complete solution
    for (int col = 0; col < n; col++) {
        if (isValid(row, col)) {
            placeQueen(row, col);        // CHOOSE
            if (solve(row + 1)) return true; // EXPLORE
            removeQueen(row, col);       // UNDO / backtrack
        }
    }
    return false;                        // Dead end → backtrack
}`,
    highlightedLine: 6,
  },

};
