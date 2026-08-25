import { AlgorithmId, AlgorithmMetadata, SortOperation } from "@/types/sorting";
import { bubbleSort } from "@/algorithms/bubbleSort";
import { selectionSort } from "@/algorithms/selectionSort";
import { insertionSort } from "@/algorithms/insertionSort";
import { mergeSort } from "@/algorithms/mergeSort";
import { quickSort } from "@/algorithms/quickSort";

export const ALGORITHMS: Record<AlgorithmId, AlgorithmMetadata> = {
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    category: "sorting",
    shortDescription: "Repeatedly compares adjacent elements and swaps them if out of order.",
    description:
      "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The largest unsorted element 'bubbles' up to its correct position at the end of each pass.",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: true,
      inPlace: true,
    },
    cppCode: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    highlightLine: (operation: SortOperation): number | null => {
      switch (operation.type) {
        case "compare":
          return 6;
        case "swap":
          return 7;
        case "sorted":
          return 11;
        default:
          return null;
      }
    },
  },
  selection: {
    id: "selection",
    name: "Selection Sort",
    category: "sorting",
    shortDescription: "Finds the minimum element from unsorted part and swaps it to the front.",
    description:
      "Selection Sort divides the array into a sorted and an unsorted region. In each iteration, it searches the entire unsorted region for the minimum element, and then performs a single swap to place it at the end of the sorted region.",
    complexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: false,
      inPlace: true,
    },
    cppCode: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
    highlightLine: (operation: SortOperation): number | null => {
      switch (operation.type) {
        case "compare":
          return 6;
        case "swap":
          return 8;
        case "sorted":
          return 9;
        default:
          return null;
      }
    },
  },
  insertion: {
    id: "insertion",
    name: "Insertion Sort",
    category: "sorting",
    shortDescription: "Builds sorted array one element at a time by shifting larger elements right.",
    description:
      "Insertion Sort works similarly to the way you sort playing cards in your hands. It iterates through the array, extracts the current element ('key'), and shifts all larger elements in the sorted portion to the right until the correct slot for the key is found.",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: true,
      inPlace: true,
    },
    cppCode: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    highlightLine: (operation: SortOperation): number | null => {
      switch (operation.type) {
        case "range":
          return 4;
        case "compare":
          return 6;
        case "overwrite":
          return 7;
        case "sorted":
          return 10;
        default:
          return null;
      }
    },
  },
  merge: {
    id: "merge",
    name: "Merge Sort",
    category: "sorting",
    shortDescription: "Recursively splits array in half, sorts each half, and merges them.",
    description:
      "Merge Sort is an efficient, general-purpose, divide-and-conquer algorithm. It divides the unsorted array into n subarrays, each containing one element, and repeatedly merges subarrays to produce new sorted subarrays until there is only one remaining sorted array.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
      stable: true,
      inPlace: false,
    },
    cppCode: `void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else temp.push_back(arr[j++]);
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);
    for (int k = left; k <= right; k++) arr[k] = temp[k - left];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`,
    highlightLine: (operation: SortOperation): number | null => {
      switch (operation.type) {
        case "range":
          return 15;
        case "merge-start":
          return 18;
        case "merge-compare":
          return 5;
        case "overwrite":
          return 10;
        case "sorted":
          return 19;
        default:
          return null;
      }
    },
  },
  quick: {
    id: "quick",
    name: "Quick Sort",
    category: "sorting",
    shortDescription: "Partitions array around a chosen pivot and recursively sorts subarrays.",
    description:
      "Quick Sort is an efficient, in-place, divide-and-conquer sorting algorithm. It selects a 'pivot' element from the array and partitions the other elements into two sub-arrays according to whether they are less than or greater than the pivot. Sub-arrays are then sorted recursively.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
      stable: false,
      inPlace: true,
      spaceNote:
        "O(log n) average recursion depth, degrades to O(n) worst case on already-sorted input with poor pivot choice.",
    },
    cppCode: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    highlightLine: (operation: SortOperation): number | null => {
      switch (operation.type) {
        case "range":
          return 15;
        case "pivot":
          return 2;
        case "compare":
          return 5;
        case "swap":
          return 7;
        case "sorted":
          return 10;
        default:
          return null;
      }
    },
  },
  stack: {
    id: "stack",
    name: "Stack",
    category: "data-structure",
    shortDescription: "LIFO (Last-In-First-Out) container with O(1) push, pop, and top operations.",
    description:
      "A Stack is a linear data structure following the Last-In, First-Out (LIFO) principle. Elements are added (pushed) and removed (popped) exclusively from one end, known as the top. Perfect for function call management, expression parsing, and backtracking undo buffers.",
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(n)",
      spaceNote: "O(1) auxiliary space per operation; O(n) total storage for n elements.",
      operations: [
        { name: "push(x)", time: "O(1)", space: "O(1)", description: "Inserts element x onto top of stack." },
        { name: "pop()", time: "O(1)", space: "O(1)", description: "Removes element from top of stack." },
        { name: "top() / peek()", time: "O(1)", space: "O(1)", description: "Returns top element without removing." },
        { name: "empty()", time: "O(1)", space: "O(1)", description: "Checks whether stack contains 0 items." },
      ],
    },
    cppCode: `// 1. Array-Based Stack Implementation
class ArrayStack {
private:
    static const int MAX_SIZE = 1000;
    int arr[MAX_SIZE];
    int topIndex;
public:
    ArrayStack() : topIndex(-1) {}
    
    bool push(int val) {
        if (topIndex >= MAX_SIZE - 1) return false; // Stack Overflow
        arr[++topIndex] = val;
        return true;
    }
    
    bool pop() {
        if (isEmpty()) return false; // Stack Underflow
        topIndex--;
        return true;
    }
    
    int peek() const {
        if (isEmpty()) throw runtime_error("Stack is empty");
        return arr[topIndex];
    }
    
    bool isEmpty() const { return topIndex == -1; }
};

// 2. Linked-List-Based Dynamic Stack
struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedListStack {
private:
    Node* head;
public:
    LinkedListStack() : head(nullptr) {}
    
    void push(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }
    
    bool pop() {
        if (!head) return false;
        Node* temp = head;
        head = head->next;
        delete temp;
        return true;
    }
    
    int top() const {
        if (!head) throw runtime_error("Empty Stack");
        return head->data;
    }
};`,
  },
  queue: {
    id: "queue",
    name: "Queue",
    category: "data-structure",
    shortDescription: "FIFO (First-In-First-Out) container with O(1) enqueue and dequeue operations.",
    description:
      "A Queue is a linear data structure following the First-In, First-Out (FIFO) principle. Elements enter at the rear (enqueue) and exit from the front (dequeue). Essential for breadth-first search (BFS), task scheduling, and asynchronous message buffers.",
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(1)",
      space: "O(n)",
      spaceNote: "O(1) auxiliary space per operation; O(n) total storage for n elements.",
      operations: [
        { name: "enqueue(x) / push(x)", time: "O(1)", space: "O(1)", description: "Inserts element x at rear of queue." },
        { name: "dequeue() / pop()", time: "O(1)", space: "O(1)", description: "Removes element from front of queue." },
        { name: "front() / peek()", time: "O(1)", space: "O(1)", description: "Returns element at front without removing." },
        { name: "empty()", time: "O(1)", space: "O(1)", description: "Checks if queue contains 0 elements." },
      ],
    },
    cppCode: `// 1. Circular Array-Based Queue (O(1) with no element shifting)
class CircularQueue {
private:
    int* arr;
    int frontIdx, rearIdx, count, capacity;
public:
    CircularQueue(int cap = 100) : capacity(cap), frontIdx(0), rearIdx(-1), count(0) {
        arr = new int[capacity];
    }
    ~CircularQueue() { delete[] arr; }

    bool enqueue(int val) {
        if (isFull()) return false; // Overflow
        rearIdx = (rearIdx + 1) % capacity;
        arr[rearIdx] = val;
        count++;
        return true;
    }

    bool dequeue() {
        if (isEmpty()) return false; // Underflow
        frontIdx = (frontIdx + 1) % capacity;
        count--;
        return true;
    }

    int front() const {
        if (isEmpty()) throw runtime_error("Queue is empty");
        return arr[frontIdx];
    }

    bool isEmpty() const { return count == 0; }
    bool isFull() const { return count == capacity; }
};

// 2. Linked-List-Based Dynamic Queue
struct QNode {
    int data;
    QNode* next;
    QNode(int val) : data(val), next(nullptr) {}
};

class LinkedListQueue {
private:
    QNode *head, *tail;
public:
    LinkedListQueue() : head(nullptr), tail(nullptr) {}

    void enqueue(int val) {
        QNode* newNode = new QNode(val);
        if (!tail) {
            head = tail = newNode;
            return;
        }
        tail->next = newNode;
        tail = newNode;
    }

    bool dequeue() {
        if (!head) return false;
        QNode* temp = head;
        head = head->next;
        if (!head) tail = nullptr;
        delete temp;
        return true;
    }

    int front() const {
        if (!head) throw runtime_error("Empty Queue");
        return head->data;
    }
};`,
  },
  "time-complexity": {
    id: "time-complexity",
    name: "Time Complexity",
    category: "complexity",
    shortDescription: "Mathematical evaluation of algorithm execution time and operation growth as input size n scales.",
    description:
      "Time Complexity measures the rate at which execution time grows relative to input size n. Expressed in Big-O asymptotic notation, it classifies algorithms from lightning-fast O(1) and O(log n) to linear O(n), log-linear O(n log n), quadratic O(n²), and intractable O(2ⁿ) exponential growth.",
    complexity: {
      best: "O(1)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(1)",
      spaceNote:
        "Time complexity evaluates instruction operations independently of hardware clock speed or CPU differences.",
      operations: [
        { name: "O(1) Constant", time: "1 op", space: "O(1)", description: "Direct index access, push/pop, arithmetic operations." },
        { name: "O(log n) Logarithmic", time: "~log₂ n ops", space: "O(1)", description: "Binary search, balanced tree lookups (halving search space)." },
        { name: "O(n) Linear", time: "n ops", space: "O(1)", description: "Single linear scan, array traversal, counting elements." },
        { name: "O(n log n) Linearithmic", time: "n × log₂ n ops", space: "O(n) / O(log n)", description: "Optimal comparison sorting (Merge Sort, Quick Sort avg)." },
        { name: "O(n²) Quadratic", time: "n² ops", space: "O(1)", description: "Nested loops, pairwise comparisons (Bubble, Selection Sort)." },
      ],
    },
    cppCode: `// 1. O(1) Constant Time
int getFirstElement(const vector<int>& arr) {
    return arr.empty() ? -1 : arr[0]; // Exactly 1 operation
}

// 2. O(log n) Logarithmic Time (Binary Search)
int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1; // Halves the search space each step
    }
    return -1;
}

// 3. O(n) Linear Time (Single Loop)
int findMax(const vector<int>& arr) {
    int maxVal = arr[0];
    for (int x : arr) {
        maxVal = max(maxVal, x); // Steps scale directly with n
    }
    return maxVal;
}

// 4. O(n^2) Quadratic Time (Nested Loops)
void printPairs(const vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            // Executes n * n = n^2 total iterations
        }
    }
}`,
  },
  "space-complexity": {
    id: "space-complexity",
    name: "Space Complexity",
    category: "complexity",
    shortDescription: "Analysis of memory consumption, distinguishing auxiliary working memory from input memory and call stack overhead.",
    description:
      "Space Complexity quantifies the total extra working memory (auxiliary space) an algorithm allocates beyond the input itself. Includes stack frames created during recursive function calls, dynamically allocated arrays, hash sets, and auxiliary buffers.",
    complexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(n)",
      space: "O(1) - O(n)",
      spaceNote:
        "Auxiliary space excludes the input storage itself and focuses strictly on extra memory allocated by the algorithm.",
      operations: [
        { name: "O(1) In-Place", time: "Constant Memory", space: "O(1)", description: "Variables, counters, pointers, temporary swap values." },
        { name: "O(log n) Call Stack", time: "Tree Recursion", space: "O(log n)", description: "Divide & Conquer call frames on balanced recursion trees." },
        { name: "O(n) Dynamic Buffer", time: "Linear Memory", space: "O(n)", description: "Auxiliary merge arrays, hash tables, linear recursion stacks." },
        { name: "O(n²) Matrix Space", time: "Quadratic Grid", space: "O(n²)", description: "2D adjacency matrices, dynamic programming lookup grids." },
      ],
    },
    cppCode: `// 1. O(1) Auxiliary Space (In-Place Mutation)
void reverseArray(vector<int>& arr) {
    int left = 0, right = (int)arr.size() - 1;
    while (left < right) {
        swap(arr[left++], arr[right--]); // Uses single temp int
    }
}

// 2. O(log n) Auxiliary Stack Space (Recursion Depth)
void divideAndConquer(int low, int high) {
    if (low >= high) return;
    int mid = low + (high - low) / 2;
    divideAndConquer(low, mid);     // Max stack depth = log2(n)
    divideAndConquer(mid + 1, high);
}

// 3. O(n) Auxiliary Space (Buffer Allocation)
vector<int> copyElements(const vector<int>& arr) {
    vector<int> clone;
    for (int val : arr) clone.push_back(val); // Allocates n ints
    return clone;
}

// 4. O(n^2) Matrix Auxiliary Space
vector<vector<int>> createGrid(int n) {
    return vector<vector<int>>(n, vector<int>(n, 0)); // n x n grid
}`,
  },
};

// All 5 Sorting Algorithms
export const SORTING_ALGORITHMS: AlgorithmId[] = [
  "bubble",
  "selection",
  "insertion",
  "merge",
  "quick",
];

// All Data Structures
export const DATA_STRUCTURES: AlgorithmId[] = ["stack", "queue"];

// All Complexity Topics
export const COMPLEXITY_TOPICS: AlgorithmId[] = [
  "time-complexity",
  "space-complexity",
];

// Backward compatibility alias for sorting visualizer
export const ALL_ALGORITHMS: AlgorithmId[] = SORTING_ALGORITHMS;

// Global catalog of all topics across all categories
export const ALL_TOPICS: AlgorithmId[] = [
  ...SORTING_ALGORITHMS,
  ...DATA_STRUCTURES,
  ...COMPLEXITY_TOPICS,
];

export const ALGORITHM_RUNNERS: Partial<
  Record<AlgorithmId, (arr: number[]) => SortOperation[]>
> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};
