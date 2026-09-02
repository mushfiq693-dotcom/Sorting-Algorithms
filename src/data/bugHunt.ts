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
};
