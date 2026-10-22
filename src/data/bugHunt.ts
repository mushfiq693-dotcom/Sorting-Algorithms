import { AlgorithmId, SortOperation } from "@/types/sorting";
import { bubbleSortBuggy } from "@/algorithms/buggy/bubbleSortBuggy";
import { selectionSortBuggy } from "@/algorithms/buggy/selectionSortBuggy";
import { insertionSortBuggy } from "@/algorithms/buggy/insertionSortBuggy";
import { mergeSortBuggy } from "@/algorithms/buggy/mergeSortBuggy";
import { quickSortBuggy } from "@/algorithms/buggy/quickSortBuggy";

export interface BugHuntChallenge {
  algorithmId: AlgorithmId;
  title: string;
  description: string;
  buggyCode: string;
  buggyLineNumber: number; // 1-indexed
  hint: string;
  explanation: string;
  validateFix: (lineText: string) => boolean;
  flawedRunner: (arr: number[]) => SortOperation[];
}

export const BUG_HUNT_CHALLENGES: Record<AlgorithmId, BugHuntChallenge> = {
  bubble: {
    algorithmId: "bubble",
    title: "Bubble Sort: Inverted Comparison Operator",
    description:
      "A developer made a typo in the comparison condition. Run the code to observe the bug in action, find the erroneous line, and fix it!",
    buggyCode: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] < arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    buggyLineNumber: 6,
    hint: "Check the if-condition inside the inner loop. Is it comparing for ascending or descending order?",
    explanation:
      "Line 6 used `<` instead of `>`. Bubble sort for ascending order must check `arr[j] > arr[j + 1]` to push larger items right.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("arr[j]>arr[j+1]");
    },
    flawedRunner: bubbleSortBuggy,
  },

  selection: {
    algorithmId: "selection",
    title: "Selection Sort: Finding the Wrong Extremum",
    description:
      "This Selection Sort implementation produces an incorrect order. Identify the flawed line and fix it.",
    buggyCode: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] > arr[minIdx]) minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
    buggyLineNumber: 6,
    hint: "Look at the condition used to update minIdx. Is it looking for the smallest element or the largest element?",
    explanation:
      "Line 6 was checking `arr[j] > arr[minIdx]`, which found the maximum element instead of the minimum. It should be `arr[j] < arr[minIdx]`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("arr[j]<arr[minIdx]");
    },
    flawedRunner: selectionSortBuggy,
  },

  insertion: {
    algorithmId: "insertion",
    title: "Insertion Sort: Incorrect While Condition",
    description:
      "The while loop shifts elements under the wrong condition. Find the bug and fix it.",
    buggyCode: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] < key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    buggyLineNumber: 6,
    hint: "Examine the while loop condition that determines which elements should shift to the right.",
    explanation:
      "Line 6 used `arr[j] < key` instead of `arr[j] > key`. We only shift elements that are strictly larger than the key to make room.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("arr[j]>key");
    },
    flawedRunner: insertionSortBuggy,
  },

  merge: {
    algorithmId: "merge",
    title: "Merge Sort: Inverted Merge Condition",
    description:
      "During the merge step, elements from the left and right subarrays are combined in the wrong order.",
    buggyCode: `void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;
    while (i <= mid && j <= right) {
        if (arr[i] > arr[j]) temp.push_back(arr[i++]);
        else temp.push_back(arr[j++]);
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);
    for (int k = left; k <= right; k++) arr[k] = temp[k - left];
}`,
    buggyLineNumber: 5,
    hint: "Check the if-condition in the merge comparison loop. Which element should be pushed into temp first?",
    explanation:
      "Line 5 checked `arr[i] > arr[j]` instead of `arr[i] <= arr[j]`. For ascending order, the smaller (or equal) element must be pushed first.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("arr[i]<=arr[j]") || trimmed.includes("arr[i]<arr[j]");
    },
    flawedRunner: mergeSortBuggy,
  },

  quick: {
    algorithmId: "quick",
    title: "Quick Sort: Partition Loop Boundary Error",
    description:
      "The partition loop boundary includes the pivot itself, causing pivot corruption.",
    buggyCode: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j <= high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
    buggyLineNumber: 4,
    hint: "Check the upper limit of the for-loop index j. Should j compare elements up to high or strictly before high?",
    explanation:
      "Line 4 used `j <= high` which included the pivot `arr[high]` inside the loop comparisons. The loop must stop before the pivot with `j < high`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("j<high") && !trimmed.includes("j<=high");
    },
    flawedRunner: quickSortBuggy,
  },

  stack: {
    algorithmId: "stack",
    title: "Stack: Premature Underflow Condition on Pop",
    description:
      "This C++ ArrayStack pop() method has a flawed underflow check that mistakes a 1-element stack (topIndex == 0) for an empty stack.",
    buggyCode: `class ArrayStack {
private:
    int arr[100];
    int topIndex = -1;
public:
    void push(int val) { arr[++topIndex] = val; }
    int pop() {
        if (topIndex == 0) return -1;
        return arr[topIndex--];
    }
};`,
    buggyLineNumber: 7,
    hint: "What is topIndex when the stack is completely empty? Remember that topIndex == 0 means there is 1 valid element at arr[0].",
    explanation:
      "Line 7 checked `if (topIndex == 0)`. When topIndex is 0, the stack has 1 element. The empty stack check must be `if (topIndex == -1)` or `if (topIndex < 0)`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return (
        trimmed.includes("topIndex==-1") ||
        trimmed.includes("topIndex<0") ||
        trimmed.includes("isEmpty()") ||
        trimmed.includes("topIndex<=-1")
      );
    },
    flawedRunner: () => [
      { type: "compare", indices: [0], description: "Attempting to inspect top of stack" },
    ],
  },

  queue: {
    algorithmId: "queue",
    title: "Circular Queue: Missing Modulo Arithmetic on Enqueue",
    description:
      "This Circular Queue implementation fails to wrap the rear pointer around to index 0, causing index out-of-bounds corruption after reaching capacity.",
    buggyCode: `class CircularQueue {
private:
    int arr[8];
    int front = 0, rear = -1, count = 0, capacity = 8;
public:
    bool enqueue(int val) {
        if (count >= capacity) return false;
        rear = rear + 1;
        arr[rear] = val;
        count++;
        return true;
    }
};`,
    buggyLineNumber: 7,
    hint: "How should rear advance in a circular queue when it reaches index capacity - 1? Think about the modulo operator (%).",
    explanation:
      "Line 7 used simple `rear = rear + 1` instead of `rear = (rear + 1) % capacity;`. Without modulo wrapping, the queue cannot reuse freed slots at the front.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return (
        trimmed.includes("%capacity") &&
        (trimmed.includes("rear+1") || trimmed.includes("rear++"))
      );
    },
    flawedRunner: () => [
      { type: "compare", indices: [0, 7], description: "Rear pointer exceeded boundary without circular modulo wrapping" },
    ],
  },

  "time-complexity": {
    algorithmId: "time-complexity",
    title: "Time Complexity: Infinite Loop Stall in Binary Search",
    description:
      "This Binary Search implementation fails to shrink the search interval, causing an infinite loop O(∞) instead of guaranteed O(log n) logarithmic termination.",
    buggyCode: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid;
        else high = mid - 1;
    }
    return -1;
}`,
    buggyLineNumber: 6,
    hint: "If arr[mid] < target, we know arr[mid] cannot be the answer. Should low become mid or mid + 1?",
    explanation:
      "Line 6 used `low = mid;` instead of `low = mid + 1;`. When high - low == 1 and arr[low] < target, mid evaluates to low, leaving low unchanged and locking the CPU into an infinite loop.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("low=mid+1") || trimmed.includes("low=mid+1;");
    },
    flawedRunner: () => [
      { type: "compare", indices: [0, 1], description: "Search interval failed to shrink: low remained equal to mid" },
    ],
  },

  "space-complexity": {
    algorithmId: "space-complexity",
    title: "Space Complexity: Pass-by-Value Memory Explosion in Recursion",
    description:
      "This recursive divide-and-conquer function passes the vector by value, allocating a full copy at each activation record and blowing auxiliary memory up to O(n²).",
    buggyCode: `int recursiveSum(vector<int> arr, int low, int high) {
    if (low > high) return 0;
    if (low == high) return arr[low];
    int mid = low + (high - low) / 2;
    return recursiveSum(arr, low, mid) + recursiveSum(arr, mid + 1, high);
}`,
    buggyLineNumber: 1,
    hint: "Look at the function signature for arr. How do we pass by reference in C++ to avoid cloning the array?",
    explanation:
      "Line 1 passed `vector<int> arr` by value, copying the entire array at each stack frame. Adding `const vector<int>& arr` or `vector<int>& arr` avoids memory allocations and preserves O(log n) stack space.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("&arr") || trimmed.includes("&arr,");
    },
    flawedRunner: () => [
      { type: "compare", indices: [0], description: "Full array duplicated onto stack frame via copy constructor" },
    ],
  },

  "linear-search": {
    algorithmId: "linear-search",
    title: "Linear Search: Premature Loop Termination (Missing Last Element)",
    description:
      "This Linear Search function has a boundary off-by-one error: the loop condition stops one index too early, causing searches for the final element in the array to fail.",
    buggyCode: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < (int)arr.size() - 1; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
    buggyLineNumber: 2,
    hint: "Examine the loop upper bound. In an n-element array with indices 0 to n-1, does `i < arr.size() - 1` visit index n-1?",
    explanation:
      "Line 2 used `i < (int)arr.size() - 1`, stopping at index n-2 and completely skipping the last element. Correct condition is `i < (int)arr.size();`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return (
        (trimmed.includes("i<(int)arr.size();") ||
          trimmed.includes("i<arr.size();") ||
          trimmed.includes("i<=(int)arr.size()-1;") ||
          trimmed.includes("i<=arr.size()-1;")) &&
        trimmed.includes("i++")
      );
    },
    flawedRunner: () => [
      { type: "compare", indices: [0], description: "Terminated loop prematurely without checking final array slot" },
    ],
  },

  "binary-search": {
    algorithmId: "binary-search",
    title: "Binary Search: Strict Inequality Skipping Single-Element Match",
    description:
      "This Binary Search implementation uses `low < high` instead of `low <= high`, causing the algorithm to exit prematurely when the search space narrows to a single element.",
    buggyCode: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    buggyLineNumber: 3,
    hint: "What happens when low == high (e.g. only 1 candidate element left)? Does `while (low < high)` check it?",
    explanation:
      "Line 3 used `while (low < high)`. When low == high, the single remaining element is at that position, but the loop breaks immediately and incorrectly returns -1. The correct loop condition is `while (low <= high)`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("while(low<=high)");
    },
    flawedRunner: () => [
      { type: "compare", indices: [0], description: "Loop broke prematurely when low == high, returning -1 on valid target" },
    ],
  },

  "linked-list": {
    algorithmId: "linked-list",
    title: "Linked List: Overwriting Head Before Linking (Memory Orphan Bug)",
    description:
      "This `insertAtHead` function destroys the entire existing linked list by overwriting the `head` pointer before linking the new node's next pointer.",
    buggyCode: `void insertAtHead(int val) {
    Node* newNode = new Node(val);
    head = newNode;
    newNode->next = head;
}`,
    buggyLineNumber: 3,
    hint: "In what order must you assign pointers when prepending? If you overwrite `head` first, where does the old head go?",
    explanation:
      "Line 3 assigned `head = newNode;` before setting `newNode->next = head;`. This overwrote the only pointer to the rest of the list, creating a circular self-reference `newNode->next = newNode` and orphaning all previous nodes in memory. First do `newNode->next = head;`, then `head = newNode;`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("newNode->next=head") || trimmed.includes("newNode->next=head;");
    },
    flawedRunner: () => [
      { type: "compare", indices: [0], description: "Memory leak: Previous head reference wiped out before linkage" },
    ],
  },

  array: {
    algorithmId: "array",
    title: "Array Insertion: Forward Loop Overwrite Bug",
    description:
      "This array insertion function shifts elements from left-to-right (`i = index; i < size; i++`) instead of backwards, causing the first shifted element to overwrite every single subsequent slot!",
    buggyCode: `void insert(vector<int>& arr, int index, int val) {
    arr.push_back(0); // expand size
    for (int i = index; i < (int)arr.size() - 1; i++) {
        arr[i + 1] = arr[i]; // Bug: Forward shift propagates same value
    }
    arr[index] = val;
}`,
    buggyLineNumber: 3,
    hint: "If you shift from index forward, arr[index+1] gets arr[index]. What happens when the next loop iteration reads arr[index+1]?",
    explanation:
      "Line 3 iterated forward from `index` to `size - 1`. Shifting forward overwrote arr[index+1] with arr[index], so the next iteration copied that same value to arr[index+2], destroying all existing data. To insert into an array, you must shift backwards starting from `size - 1` down to `index`: `for (int i = (int)arr.size() - 2; i >= index; i--)`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("i>=index") && (trimmed.includes("i--") || trimmed.includes("--i"));
    },
    flawedRunner: () => [
      { type: "overwrite", index: 1, value: 14, description: "Forward shift duplicated element across all subsequent slots" },
    ],
  },

  string: {
    algorithmId: "string",
    title: "Two-Pointer Reversal: Off-By-One Buffer Overflow Bug",
    description:
      "This two-pointer string reversal initializes `right = s.size()` instead of `s.size() - 1`, causing the very first swap to read and write unallocated memory beyond the null-terminator boundary!",
    buggyCode: `void reverseString(string& s) {
    int left = 0;
    int right = s.size(); // Bug: Index out of bounds (should be s.size() - 1)
    while (left < right) {
        swap(s[left++], s[right--]);
    }
}`,
    buggyLineNumber: 3,
    hint: "Remember strings in C++ are 0-indexed. If a string has 5 characters (indices 0..4), what index does `s.size()` access?",
    explanation:
      "Line 3 initialized `right = s.size()`. In 0-indexed strings, valid indices range strictly from `0` to `s.size() - 1`. Accessing `s[s.size()]` touches the null terminator '\\0' or unallocated heap memory, causing buffer corruption or undefined behavior. The right pointer must start at `s.size() - 1`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("s.size()-1") || trimmed.includes("s.length()-1");
    },
    flawedRunner: () => [
      { type: "swap", indices: [0, 4], description: "Accessed index out of bounds beyond string boundary" },
    ],
  },

  deque: {
    algorithmId: "deque",
    title: "Circular Deque: Negative Modulo Buffer Out-of-Bounds Crash",
    description:
      "This circular deque implementation decrements the front pointer with `(front - 1) % capacity`. When `front == 0`, C++ remainder arithmetic evaluates to `-1` instead of wrapping to `capacity - 1`, corrupting heap memory with buffer[-1] access!",
    buggyCode: `void pushFront(int val) {
    if (count == capacity) throw overflow_error("Deque full");
    front = (front - 1) % capacity; // Bug: evaluates to -1 when front == 0!
    buffer[front] = val;
    count++;
}`,
    buggyLineNumber: 3,
    hint: "What does `(-1) % capacity` evaluate to in C++ or Java? If capacity is 8, does it evaluate to 7 or -1?",
    explanation:
      "Line 3 calculated `front = (front - 1) % capacity`. In C++, the modulo operator `%` calculates truncated division remainder: when `front == 0`, `(0 - 1) % 8 == -1`. Accessing `buffer[-1]` causes memory corruption and crashes the program. To wrap around safely into a valid positive index, always add the capacity before taking modulo: `front = (front - 1 + capacity) % capacity;`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("front-1+capacity") || trimmed.includes("front-1+cap");
    },
    flawedRunner: () => [
      { type: "overwrite", index: 0, value: 99, description: "Negative index (-1) heap access violation on circular buffer" },
    ],
  },

  "hash-table": {
    algorithmId: "hash-table",
    title: "Hash Table: Linear Probing Missing Modulo Wrap-Around",
    description:
      "This open-addressing Hash Table resolves collisions using linear probing. However, it increments the probe pointer without modulo wrap-around, crashing with an out-of-bounds memory violation when collisions occur near the end of the backing array!",
    buggyCode: `void insert(int key, int val) {
    int idx = abs(key) % capacity;
    while (table[idx].occupied && table[idx].key != key) {
        idx = idx + 1; // Bug: crashes out of bounds when idx exceeds capacity - 1!
    }
    table[idx] = {key, val, true};
    count++;
}`,
    buggyLineNumber: 4,
    hint: "When a collision occurs at index `capacity - 1`, what should the next probed index be? Does `idx + 1` cycle back to `0` or jump beyond array limits?",
    explanation:
      "Line 4 advances the probe index with `idx = idx + 1;`. Once `idx` reaches `capacity - 1`, incrementing it yields `capacity`, which accesses memory beyond the bounds of the array and crashes. Linear probing must wrap circularly back to index 0 using modulo arithmetic: `idx = (idx + 1) % capacity;`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return (
        trimmed.includes("(idx+1)%capacity") ||
        trimmed.includes("(idx+1)%cap") ||
        trimmed.includes("idx=(idx+1)%capacity") ||
        trimmed.includes("idx=(idx+1)%cap")
      );
    },
    flawedRunner: () => [
      { type: "overwrite", index: 7, value: 999, description: "Index out of bounds crash: accessed slot capacity instead of wrapping to 0" },
    ],
  },
  "binary-tree": {
    algorithmId: "binary-tree",
    title: "Binary Tree: Off-by-One Base Case in Maximum Depth Recursion",
    description:
      "This recursive function computes the maximum depth (height) of a binary tree. However, its base case returns 1 instead of 0 when root is nullptr, causing all tree depths to be inflated by 1!",
    buggyCode: `int maxDepth(TreeNode* root) {
    if (!root) return 1; // Bug: empty node returns 1 instead of 0!
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
    buggyLineNumber: 2,
    hint: "What is the depth of an empty tree (a nullptr node)? Does a null child contribute 1 level or 0 levels to the tree height?",
    explanation:
      "Line 2 returned 1 for the base case when `!root`. When a node pointer is null, that branch has a depth of 0. Returning 1 inflates the height calculation of every leaf node to 2 instead of 1. The base case must be `if (!root) return 0;`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("return0");
    },
    flawedRunner: () => [
      { type: "call-enter", fn: "maxDepth", args: [0], description: "Base case returned depth 1 for nullptr, inflating tree height" },
    ],
  },
  bst: {
    algorithmId: "bst",
    title: "Binary Search Tree: Inverted Branch Direction in Search Recursion",
    description:
      "This recursive search function is supposed to find a target value in a BST. However, when the target is smaller than the current node's value, it mistakenly searches the right subtree instead of the left!",
    buggyCode: `bool search(BSTNode* node, int target) {
    if (!node) return false;
    if (node->val == target) return true;
    if (target < node->val)
        return search(node->right, target); // Bug: traversing right when target is smaller!
    return search(node->right, target);
}`,
    buggyLineNumber: 5,
    hint: "According to the fundamental BST invariant, where do all keys strictly smaller than node->val reside: in the left subtree or the right subtree?",
    explanation:
      "Line 5 mistakenly called `search(node->right, target)` when `target < node->val`. By the BST trichotomy invariant, all keys strictly smaller than the current node are stored in its left subtree. Searching the right subtree discards the valid half and guarantees the target will not be found. The fix is `return search(node->left, target);`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("search(node->left");
    },
    flawedRunner: () => [
      { type: "call-enter", fn: "search", args: [30], description: "Target 30 < 50, but algorithm branched right towards 70 instead of left" },
    ],
  },
  "avl-tree": {
    algorithmId: "avl-tree",
    title: "AVL Tree: Inverted Balance Factor Formula Causing Wrong Rotation Triggers",
    description:
      "This helper function computes the Balance Factor (BF) of an AVL node. However, it mistakenly subtracts the left subtree height from the right subtree height (right - left) instead of left - right, completely inverting balance signals and triggering the wrong rotations!",
    buggyCode: `int getBalanceFactor(AVLNode* node) {
    if (!node) return 0;
    return getHeight(node->right) - getHeight(node->left); // Bug: inverted BF formula!
}`,
    buggyLineNumber: 3,
    hint: "In standard AVL definitions, if the left subtree is taller than the right subtree, should the Balance Factor be positive (+1/+2) or negative (-1/-2)?",
    explanation:
      "Line 3 calculated `getHeight(node->right) - getHeight(node->left)`. The standard AVL Balance Factor is defined as `getHeight(node->left) - getHeight(node->right)`. Inverting the subtraction turns left-heavy subtrees into negative balance factors and right-heavy subtrees into positive ones, causing the tree to attempt RR/RL rotations on left-heavy trees and corrupting balance invariants. The fix is `return getHeight(node->left) - getHeight(node->right);`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return trimmed.includes("getHeight(node->left)-getHeight(node->right)");
    },
    flawedRunner: () => [
      { type: "call-enter", fn: "getBalanceFactor", args: [2], description: "Node has left height 2 and right height 0, but returned BF = -2 instead of +2" },
    ],
  },
  heap: {
    algorithmId: "heap",
    title: "Binary Heap: Inverted Sift-Down Child Comparison Violating Min-Heap Invariant",
    description:
      "This Min-Heap siftDown function is supposed to sink a node downward by swapping with its smallest child. However, when inspecting the right child, the comparison operator is inverted (> instead of <), causing the function to pick the larger child and corrupting the Min-Heap property!",
    buggyCode: `void siftDown(int i, int n, vector<int>& heap) {
    int smallest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    if (l < n && heap[l] < heap[smallest])
        smallest = l;
    if (r < n && heap[r] > heap[smallest]) // Bug: inverted > operator in Min-Heap!
        smallest = r;

    if (smallest != i) {
        swap(heap[i], heap[smallest]);
        siftDown(smallest, n, heap);
    }
}`,
    buggyLineNumber: 8,
    hint: "In a Min-Heap, the new parent must be smaller than both its children. Should you swap with the smaller child (< heap[smallest]) or the larger one?",
    explanation:
      "Line 8 checked `if (r < n && heap[r] > heap[smallest])`. In a Min-Heap, the node must swap with the absolute smallest child so that the promoted child dominates both subtrees. Checking `> heap[smallest]` causes the function to prefer larger elements, immediately breaking the Min-Heap invariant `heap[parent] <= heap[child]`. The fix is `if (r < n && heap[r] < heap[smallest])`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return (
        trimmed.includes("heap[r]<heap[smallest]") ||
        trimmed.includes("arr[r]<arr[smallest]")
      );
    },
    flawedRunner: () => [
      {
        type: "call-enter",
        fn: "siftDown",
        args: [0],
        description:
          "Parent is 50, Left child is 10, Right child is 30. Function selected right child 30 instead of smaller child 10!",
      },
    ],
  },
  "priority-queue": {
    algorithmId: "priority-queue",
    title: "Priority Queue: Inverted Sift-Up Comparator Demoting Urgent Tasks",
    description:
      "In this Min-Priority Queue implementation for an OS scheduler, tasks with lower numerical priority values have higher urgency. However, the siftUp loop uses `>` instead of `<`, causing low-priority background tasks to bubble up to the root while critical high-priority kernel tasks sink to the bottom!",
    buggyCode: `void siftUp(int i, vector<Task>& heap) {
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[i].priority > heap[parent].priority) { // Bug: inverted > operator in Min-PQ!
            swap(heap[i], heap[parent]);
            i = parent;
        } else {
            break;
        }
    }
}`,
    buggyLineNumber: 4,
    hint: "In a Min-Priority Queue, a task with a lower numerical priority (higher urgency) must bubble up if it is less than its parent's priority.",
    explanation:
      "Line 4 checked `if (heap[i].priority > heap[parent].priority)`. In a Min-Priority Queue, higher priority corresponds to smaller numerical values (e.g. Priority 1 = Emergency, Priority 10 = Background). To maintain the Min-Heap property, the child must bubble up when its priority is strictly smaller than its parent (`heap[i].priority < heap[parent].priority`). The `>` operator inverted the priority queue into an inverted structure where urgent tasks get trapped at the bottom.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return (
        trimmed.includes("heap[i].priority<heap[parent].priority") ||
        trimmed.includes("heap[parent].priority>heap[i].priority")
      );
    },
    flawedRunner: () => [
      {
        type: "call-enter",
        fn: "siftUp",
        args: [4],
        description:
          "Inserted Critical Kernel Task (Priority 1) beneath Idle Background Task (Priority 10). Condition failed to bubble up!",
      },
    ],
  },
  "union-find": {
    algorithmId: "union-find",
    title: "Union-Find: Missing Path Compression Assignment Degrading to O(n)",
    description:
      "This recursive find function successfully locates the root representative of an element. However, it returns the recursive call directly without assigning `parent[i] = ...`, failing to compress the path and causing the tree to degrade into an O(n) linear chain!",
    buggyCode: `int find(int i, vector<int>& parent) {
    if (parent[i] == i)
        return i;
    return find(parent[i], parent); // Bug: forgot parent[i] = assignment!
}`,
    buggyLineNumber: 4,
    hint: "To flatten the tree in-place, the result of find(parent[i], parent) must be assigned back to parent[i] before returning it.",
    explanation:
      "Line 4 wrote `return find(parent[i], parent);`. While this returns the correct root, it fails to execute Path Compression because `parent[i]` is never updated! Without assigning `parent[i] = find(...)`, the chain remains uncompressed at height n, completely throwing away the O(α(n)) amortized guarantee. The fix is `return parent[i] = find(parent[i], parent);`.",
    validateFix: (line: string) => {
      const trimmed = line.replace(/\s+/g, "");
      return (
        trimmed.includes("parent[i]=find(") ||
        trimmed.includes("parent[i]=find(parent[i]")
      );
    },
    flawedRunner: () => [
      {
        type: "call-enter",
        fn: "find",
        args: [5],
        description:
          "Traversed 5 hops to find root 0, but parent[5] remained 4 without flattening!",
      },
    ],
  },
};



