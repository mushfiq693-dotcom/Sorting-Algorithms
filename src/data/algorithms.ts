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
  "linear-search": {
    id: "linear-search",
    name: "Linear Search",
    category: "searching",
    shortDescription: "Sequentially checks each element until a match is found or the array ends.",
    description:
      "Linear Search (or Sequential Search) scans through a collection element by element from left to right. If the current element matches the target value, its index is returned immediately. If the end of the collection is reached without finding a match, -1 is returned. It makes no assumptions about data ordering and requires zero preprocessing.",
    complexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
      inPlace: true,
      spaceNote: "Uses a single index counter variable.",
    },
    cppCode: `int linearSearch(const vector<int>& arr, int target) {
    // Sequentially inspect each element from start to finish
    for (int i = 0; i < (int)arr.size(); i++) {
        if (arr[i] == target) {
            return i; // Target found at index i (Best case O(1) if first element)
        }
    }
    return -1; // Target not present in collection (Worst case O(n))
}`,
  },
  "binary-search": {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    shortDescription: "Repeatedly halves the search space in a sorted array to locate target in O(log n) time.",
    description:
      "Binary Search is an extremely efficient divide-and-conquer search algorithm. PRECONDITION: The array MUST be sorted. By comparing the target with the middle element, Binary Search eliminates an entire half of the remaining elements in each step, achieving logarithmic O(log n) time complexity.",
    complexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1) iter / O(log n) rec",
      inPlace: true,
      spaceNote: "Iterative uses O(1) variables; recursive allocates O(log n) stack frames.",
    },
    cppCode: `// PRECONDITION: arr MUST be sorted in non-decreasing order!

// 1. Iterative Binary Search (O(1) Auxiliary Space)
int binarySearchIterative(const vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents 32-bit integer overflow
        if (arr[mid] == target) {
            return mid; // Found!
        } else if (arr[mid] < target) {
            low = mid + 1;  // Discard left half
        } else {
            high = mid - 1; // Discard right half
        }
    }
    return -1; // Not found
}

// 2. Recursive Binary Search (O(log n) Call Stack Space)
int binarySearchRecursive(const vector<int>& arr, int low, int high, int target) {
    if (low > high) return -1; // Base case: search interval exhausted
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) {
        return binarySearchRecursive(arr, mid + 1, high, target);
    } else {
        return binarySearchRecursive(arr, low, mid - 1, target);
    }
}`,
  },
  "linked-list": {
    id: "linked-list",
    name: "Linked List",
    category: "data-structure",
    shortDescription: "Linear sequence of dynamically allocated nodes linked via forward pointers.",
    description:
      "A Singly Linked List is a dynamic linear data structure composed of nodes. Each node stores a data value and a pointer (next) referencing the subsequent node in memory. Unlike arrays, nodes are not stored contiguously in memory, enabling O(1) insertions at the head without shifting subsequent elements, at the cost of losing O(1) random index access.",
    complexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(n)",
      inPlace: false,
      spaceNote: "Requires an extra pointer field (4-8 bytes) per stored node.",
      operations: [
        { name: "Insert at Head", time: "O(1)", space: "O(1)", description: "Allocate node, point to current head, update head." },
        { name: "Insert at Tail", time: "O(n)", space: "O(1)", description: "Traverse to last node and link new node." },
        { name: "Delete by Value", time: "O(n)", space: "O(1)", description: "Traverse to target's predecessor and splice pointer." },
        { name: "Search / Traversal", time: "O(n)", space: "O(1)", description: "Sequential pointer dereferencing from head." },
      ],
    },
    cppCode: `struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

class LinkedList {
public:
    Node* head;
    LinkedList() : head(nullptr) {}

    // O(1) Time: Prepend new node before current head
    void insertAtHead(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }

    // O(n) Time: Traverse to tail (without tail pointer)
    void insertAtTail(int val) {
        Node* newNode = new Node(val);
        if (!head) { head = newNode; return; }
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = newNode;
    }

    // O(n) Time: Splice predecessor pointer around target node
    bool deleteValue(int val) {
        if (!head) return false;
        if (head->val == val) {
            Node* temp = head;
            head = head->next;
            delete temp;
            return true;
        }
        Node* curr = head;
        while (curr->next && curr->next->val != val) {
            curr = curr->next;
        }
        if (!curr->next) return false; // Not found
        Node* temp = curr->next;
        curr->next = curr->next->next;
        delete temp;
        return true;
    }

    // O(n) Time: Pointer traversal from head
    bool search(int val) {
        Node* curr = head;
        while (curr) {
            if (curr->val == val) return true;
            curr = curr->next;
        }
        return false;
    }
};`,
  },
  array: {
    id: "array",
    name: "Array (Static & Dynamic)",
    category: "data-structure",
    shortDescription: "Contiguous block of memory offering O(1) random access via index arithmetic.",
    description:
      "An Array stores elements in contiguous memory locations. Because memory addresses are contiguous, accessing any element by its numerical index takes strict O(1) constant time via base-offset arithmetic: Address = Base + index * sizeof(Type). Inserting or deleting elements from the middle requires shifting subsequent elements across memory in O(n) time. Dynamic arrays (like std::vector or ArrayList) double their capacity geometrically when full, guaranteeing amortized O(1) append operations.",
    complexity: {
      best: "O(1)",
      average: "O(1) Access / O(n) Insert",
      worst: "O(n) Insert/Delete",
      space: "O(n)",
      stable: true,
      inPlace: true,
      operations: [
        {
          name: "Direct Access arr[i]",
          time: "O(1)",
          space: "O(1)",
          description: "Instantaneous memory address computation: Base + i * 4 bytes.",
        },
        {
          name: "Update arr[i] = v",
          time: "O(1)",
          space: "O(1)",
          description: "Overwrites value in-place in constant time.",
        },
        {
          name: "Append / Push Back",
          time: "O(1) Amortized",
          space: "O(1)",
          description: "Appends at end of buffer; doubles capacity geometrically when full.",
        },
        {
          name: "Insert at Index",
          time: "O(n)",
          space: "O(1)",
          description: "Shifts all elements from index to size-1 one position right.",
        },
        {
          name: "Delete at Index",
          time: "O(n)",
          space: "O(1)",
          description: "Shifts all subsequent elements one position left to fill gap.",
        },
        {
          name: "Linear Search",
          time: "O(n)",
          space: "O(1)",
          description: "Sequential scan checking each slot from index 0 to n-1.",
        },
      ],
    },
    cppCode: `template <typename T>
class DynamicArray {
private:
    T* data;
    int size;
    int capacity;

    void resize(int newCapacity) {
        T* newData = new T[newCapacity];
        for (int i = 0; i < size; i++) {
            newData[i] = data[i]; // Copy elements
        }
        delete[] data;
        data = newData;
        capacity = newCapacity;
    }

public:
    DynamicArray(int initialCap = 4) : size(0), capacity(initialCap) {
        data = new T[capacity];
    }

    ~DynamicArray() { delete[] data; }

    // O(1) Time: Direct arithmetic access
    T& operator[](int index) {
        return data[index];
    }

    // O(1) Amortized Time: Push to tail
    void push_back(T val) {
        if (size == capacity) resize(capacity * 2);
        data[size++] = val;
    }

    // O(n) Time: Insert at index with right shift
    void insert(int index, T val) {
        if (size == capacity) resize(capacity * 2);
        for (int i = size - 1; i >= index; i--) {
            data[i + 1] = data[i]; // Shift right
        }
        data[index] = val;
        size++;
    }

    // O(n) Time: Delete at index with left shift
    void erase(int index) {
        for (int i = index; i < size - 1; i++) {
            data[i] = data[i + 1]; // Shift left
        }
        size--;
    }
};`,
  },
  string: {
    id: "string",
    name: "String",
    category: "data-structure",
    shortDescription: "Contiguous 1-byte character array with O(1) random access, ASCII/UTF-8 mapping, and sliding window patterns.",
    description:
      "A String is an array of characters stored consecutively in physical memory. In C and C++, strings are null-terminated ('\\0') character arrays with sizeof(char) == 1 Byte, enabling instant O(1) random indexing and cache-line saturation. Modern high-level languages treat strings either as mutable buffers (C++ std::string) or immutable objects (Java, Python, JavaScript) where any modification triggers an O(n) heap allocation and full byte copy. Contiguous indexing powers quintessential interview paradigms including Two-Pointer reversals, Palindrome checks, and Sliding Window substring optimizations.",
    complexity: {
      best: "O(1)",
      average: "O(1) Access / O(n) Manipulation",
      worst: "O(n) Worst Case / O(n²) Naive Concat Loop",
      space: "O(n)",
      stable: true,
      inPlace: true,
      operations: [
        {
          name: "Direct Access str[i]",
          time: "O(1)",
          space: "O(1)",
          description: "Direct 1-byte memory offset arithmetic: BaseAddress + (i * 1 Byte).",
        },
        {
          name: "In-Place Update (Mutable)",
          time: "O(1)",
          space: "O(1)",
          description: "Overwrites byte in-place directly in C++ std::string.",
        },
        {
          name: "Two-Pointer Reversal",
          time: "O(n)",
          space: "O(1)",
          description: "Swaps symmetric characters from opposite ends inward (n/2 swaps).",
        },
        {
          name: "Palindrome Verification",
          time: "O(n)",
          space: "O(1)",
          description: "Compares characters inward with early termination on first mismatch.",
        },
        {
          name: "Sliding Window Substring",
          time: "O(n)",
          space: "O(min(n, m))",
          description: "Dynamic window [L..R] expands and contracts in a single linear pass.",
        },
        {
          name: "Substring Search (Naive)",
          time: "O((n - m + 1) * m)",
          space: "O(1)",
          description: "Checks needle alignment character-by-character across haystack.",
        },
        {
          name: "Immutable Concatenation",
          time: "O(n + m)",
          space: "O(n + m)",
          description: "Allocates brand new heap buffer and copies all characters (JS/Python/Java).",
        },
      ],
    },
    cppCode: `class StringOperations {
public:
    // 1. Two-Pointer In-Place Reversal: O(n) Time, O(1) Space
    void reverseString(string& s) {
        int left = 0, right = (int)s.size() - 1;
        while (left < right) {
            swap(s[left++], s[right--]); // In-place byte swap
        }
    }

    // 2. Two-Pointer Palindrome Verification: O(n) Time, O(1) Space
    bool isPalindrome(const string& s) {
        int left = 0, right = (int)s.size() - 1;
        while (left < right) {
            if (tolower(s[left++]) != tolower(s[right--])) return false;
        }
        return true;
    }

    // 3. Sliding Window: Longest Substring Without Repeating Chars: O(n)
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
    }

    // 4. In-Place Byte Overwrite vs Immutable Duplication
    void updateChar(string& s, int index, char newChar) {
        s[index] = newChar; // C++ in-place mutable write: O(1)
    }
};`,
  },
  deque: {
    id: "deque",
    name: "Deque (Double-Ended Queue)",
    category: "data-structure",
    shortDescription: "Double-ended sequence supporting O(1) insertion and deletion at both the front and rear.",
    description:
      "A Deque (Double-Ended Queue, pronounced 'deck') is a generalized sequence container that allows instantaneous O(1) insertions and removals at both ends: push_front, push_back, pop_front, and pop_back. It can be implemented either as a circular array with modular pointer wrap-around ((i ± 1 + N) % N) or as a doubly-linked list with bidirectional node pointers. Deques provide the foundational engine for high-performance scheduling (work-stealing algorithms in thread pools), monotonic sliding window maximums, and symmetric palindrome algorithms.",
    complexity: {
      best: "O(1)",
      average: "O(1) Boundary Operations / O(n) Search",
      worst: "O(1) Boundary / O(n) Search",
      space: "O(n)",
      stable: true,
      inPlace: true,
      operations: [
        {
          name: "pushFront(x) / push_front(x)",
          time: "O(1)",
          space: "O(1)",
          description: "Inserts item at front boundary via modular wrap (F - 1 + N) % N or head pointer.",
        },
        {
          name: "pushBack(x) / push_back(x)",
          time: "O(1)",
          space: "O(1)",
          description: "Inserts item at rear boundary via modular wrap (R + 1) % N or tail pointer.",
        },
        {
          name: "popFront() / pop_front()",
          time: "O(1)",
          space: "O(1)",
          description: "Extracts and removes item from front boundary in constant time.",
        },
        {
          name: "popBack() / pop_back()",
          time: "O(1)",
          space: "O(1)",
          description: "Extracts and removes item from rear boundary in constant time.",
        },
        {
          name: "peekFront() / front()",
          time: "O(1)",
          space: "O(1)",
          description: "Reads front element non-destructively in O(1) time.",
        },
        {
          name: "peekBack() / back()",
          time: "O(1)",
          space: "O(1)",
          description: "Reads rear element non-destructively in O(1) time.",
        },
        {
          name: "Linear Search",
          time: "O(n)",
          space: "O(1)",
          description: "Scans all elements sequentially from front to rear.",
        },
        {
          name: "Monotonic Window Max",
          time: "O(n)",
          space: "O(k)",
          description: "Computes maximum for all sliding windows of size k with each element pushed/popped at most once.",
        },
      ],
    },
    cppCode: `// Production-Grade C++ Double-Ended Queue (Circular Array)
class CircularDeque {
private:
    vector<int> buffer;
    int capacity, front, rear, count;
public:
    CircularDeque(int cap) : capacity(cap), buffer(cap), front(0), rear(0), count(0) {}

    // O(1) Push Front: Modular wrap backward
    void pushFront(int val) {
        if (count == capacity) throw overflow_error("Deque full");
        if (count == 0) front = rear = 0;
        else front = (front - 1 + capacity) % capacity;
        buffer[front] = val;
        count++;
    }

    // O(1) Push Back: Modular wrap forward
    void pushBack(int val) {
        if (count == capacity) throw overflow_error("Deque full");
        if (count == 0) front = rear = 0;
        else rear = (rear + 1) % capacity;
        buffer[rear] = val;
        count++;
    }

    // O(1) Pop Front
    int popFront() {
        if (count == 0) throw underflow_error("Deque empty");
        int val = buffer[front];
        front = (front + 1) % capacity;
        count--;
        return val;
    }

    // O(1) Pop Back
    int popBack() {
        if (count == 0) throw underflow_error("Deque empty");
        int val = buffer[rear];
        rear = (rear - 1 + capacity) % capacity;
        count--;
        return val;
    }
};`,
  },
  "hash-table": {
    id: "hash-table",
    name: "Hash Table (Hash Map)",
    category: "data-structure",
    shortDescription: "Associative key-value container providing average O(1) insertion, lookup, and deletion via hash functions.",
    description:
      "A Hash Table (or Hash Map) is an associative data structure that stores key-value pairs by computing a numeric hash index via a hash function (h(k) = k % capacity) for constant-time direct memory access. Collisions—where distinct keys produce identical hash indices—are resolved using Separate Chaining (linked lists or balanced trees per bucket) or Open Addressing (Linear Probing, Quadratic Probing, or Double Hashing). With a well-distributed hash function and dynamic table resizing when load factor α exceeds threshold (typically 0.75), Hash Tables provide optimal amortized O(1) operations, serving as the backbone for database indices, compilers, caches, and dictionary primitives across all modern software.",
    complexity: {
      best: "O(1)",
      average: "O(1)",
      worst: "O(n) (Severe Collision Clumping)",
      space: "O(n)",
      stable: false,
      inPlace: false,
      operations: [
        {
          name: "hash(key)",
          time: "O(1)",
          space: "O(1)",
          description: "Maps arbitrary key to deterministic bucket index via hash function and modulo arithmetic.",
        },
        {
          name: "insert(key, value)",
          time: "O(1) avg / O(n) worst",
          space: "O(1)",
          description: "Inserts or updates key-value pair in designated bucket or probe slot.",
        },
        {
          name: "search(key) / find(key)",
          time: "O(1) avg / O(n) worst",
          space: "O(1)",
          description: "Looks up associated value by key via direct bucket jump and short collision traversal.",
        },
        {
          name: "remove(key) / erase(key)",
          time: "O(1) avg / O(n) worst",
          space: "O(1)",
          description: "Deletes key-value pair by splicing linked chain or marking slot as Tombstone (DEL).",
        },
        {
          name: "rehash() / resize()",
          time: "O(n)",
          space: "O(n)",
          description: "Doubles table capacity and re-inserts all existing entries when load factor α > 0.75.",
        },
        {
          name: "Two Sum Hash Lookup",
          time: "O(n)",
          space: "O(n)",
          description: "Single-pass complement matching reducing naive O(n²) pair search to optimal linear time.",
        },
      ],
    },
    cppCode: `// Production-Grade C++ Hash Table (Separate Chaining)
#include <iostream>
#include <vector>
#include <list>
#include <utility>
using namespace std;

class HashTable {
private:
    int capacity;
    int count;
    vector<list<pair<int, string>>> table;

    int hash(int key) const {
        return abs(key) % capacity;
    }

    void rehash() {
        int oldCap = capacity;
        capacity *= 2;
        vector<list<pair<int, string>>> oldTable = move(table);
        table.assign(capacity, list<pair<int, string>>());
        count = 0;
        for (const auto& bucket : oldTable) {
            for (const auto& [k, v] : bucket) {
                insert(k, v);
            }
        }
    }

public:
    HashTable(int cap = 8) : capacity(cap), count(0), table(cap) {}

    // O(1) Average Insert
    void insert(int key, const string& value) {
        if ((float)(count + 1) / capacity > 0.75) rehash();
        int idx = hash(key);
        for (auto& [k, v] : table[idx]) {
            if (k == key) { v = value; return; } // Key exists, update
        }
        table[idx].emplace_back(key, value);
        count++;
    }

    // O(1) Average Search
    bool search(int key, string& outVal) const {
        int idx = hash(key);
        for (const auto& [k, v] : table[idx]) {
            if (k == key) { outVal = v; return true; }
        }
        return false;
    }

    // O(1) Average Deletion
    bool erase(int key) {
        int idx = hash(key);
        auto& bucket = table[idx];
        for (auto it = bucket.begin(); it != bucket.end(); ++it) {
            if (it->first == key) {
                bucket.erase(it);
                count--;
                return true;
            }
        }
        return false;
    }
};`,
  },
  "binary-tree": {
    id: "binary-tree",
    name: "Binary Tree",
    category: "tree",
    shortDescription: "Hierarchical non-linear data structure where each node points to at most two child nodes (left and right).",
    description:
      "A Binary Tree is a fundamental hierarchical data structure where each node contains a value and references to at most two child nodes, conventionally termed left and right. Unlike linear data structures (arrays, linked lists, stacks), trees model hierarchical relationships, recursive structures, and decision spaces. Special classifications include Full, Complete, Perfect, and Balanced trees. Standard tree traversals explore nodes depth-first (Pre-order, In-order, Post-order) or breadth-first (Level-order).",
    complexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(n)",
      stable: true,
      inPlace: false,
      operations: [
        {
          name: "Pre-order Traversal",
          time: "O(n)",
          space: "O(h)",
          description: "Visits Root, then Left subtree, then Right subtree (DFS).",
        },
        {
          name: "In-order Traversal",
          time: "O(n)",
          space: "O(h)",
          description: "Visits Left subtree, then Root, then Right subtree (DFS).",
        },
        {
          name: "Post-order Traversal",
          time: "O(n)",
          space: "O(h)",
          description: "Visits Left subtree, then Right subtree, then Root (DFS).",
        },
        {
          name: "Level-order Traversal",
          time: "O(n)",
          space: "O(w)",
          description: "Visits nodes level-by-level using a FIFO queue (BFS).",
        },
        {
          name: "Level-Order Insertion",
          time: "O(n)",
          space: "O(w)",
          description: "Finds the first node with an empty child via BFS and attaches new node.",
        },
        {
          name: "Height / Depth Calculation",
          time: "O(n)",
          space: "O(h)",
          description: "1 + max(height(left), height(right)) recursively.",
        },
      ],
    },
    cppCode: `// Production-Grade C++ Binary Tree Implementation
#include <iostream>
#include <queue>
#include <vector>
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinaryTree {
public:
    TreeNode* root;

    BinaryTree() : root(nullptr) {}

    // Level-order insertion: fills left-to-right (O(n) time, O(w) space)
    void insert(int val) {
        if (!root) {
            root = new TreeNode(val);
            return;
        }
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();

            if (!curr->left) {
                curr->left = new TreeNode(val);
                return;
            } else {
                q.push(curr->left);
            }

            if (!curr->right) {
                curr->right = new TreeNode(val);
                return;
            } else {
                q.push(curr->right);
            }
        }
    }

    // Depth-First Traversals (O(n) time, O(h) recursion stack)
    void preOrder(TreeNode* node, vector<int>& res) {
        if (!node) return;
        res.push_back(node->val);      // Root
        preOrder(node->left, res);     // Left
        preOrder(node->right, res);    // Right
    }

    void inOrder(TreeNode* node, vector<int>& res) {
        if (!node) return;
        inOrder(node->left, res);      // Left
        res.push_back(node->val);      // Root
        inOrder(node->right, res);     // Right
    }

    void postOrder(TreeNode* node, vector<int>& res) {
        if (!node) return;
        postOrder(node->left, res);     // Left
        postOrder(node->right, res);    // Right
        res.push_back(node->val);       // Root
    }

    // Breadth-First Level-Order Traversal (O(n) time, O(w) queue)
    vector<int> levelOrder() {
        vector<int> res;
        if (!root) return res;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();
            res.push_back(curr->val);
            if (curr->left) q.push(curr->left);
            if (curr->right) q.push(curr->right);
        }
        return res;
    }

    // Calculate maximum depth / height (O(n) time)
    int maxDepth(TreeNode* node) {
        if (!node) return 0;
        return 1 + max(maxDepth(node->left), maxDepth(node->right));
    }
};`,
  },
  bst: {
    id: "bst",
    name: "Binary Search Tree",
    category: "tree",
    shortDescription:
      "A binary tree obeying the key invariant: left subtree < root < right subtree, enabling O(log n) search, insert, and delete.",
    description:
      "A Binary Search Tree (BST) is an ordered node-based binary tree data structure. For every node, all keys in its left subtree are strictly less than the node's key, and all keys in its right subtree are strictly greater. This trichotomy enables binary search efficiency (O(log n) average time) on dynamic data where insertions and deletions can occur without shifting contiguous memory. An in-order traversal visits all keys in strictly sorted ascending order. However, without self-balancing mechanisms, sequential insertions can cause the tree to degenerate into an O(n) linked list.",
    complexity: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(n)",
      space: "O(n)",
      stable: false,
      inPlace: true,
      operations: [
        {
          name: "Search",
          time: "O(log n)",
          space: "O(h)",
          description: "Prunes half the remaining tree at each node comparison. Worst-case O(n) if skewed.",
        },
        {
          name: "Insertion",
          time: "O(log n)",
          space: "O(h)",
          description: "Traverses to the correct leaf position preserving the BST invariant and attaches new node.",
        },
        {
          name: "Deletion (3 Cases)",
          time: "O(log n)",
          space: "O(h)",
          description: "Case 1: Leaf (sever pointer). Case 2: 1 child (splice child). Case 3: 2 children (replace with in-order successor).",
        },
        {
          name: "In-Order Traversal",
          time: "O(n)",
          space: "O(h)",
          description: "Visits Left -> Root -> Right, yielding elements in strictly sorted ascending order.",
        },
        {
          name: "Find Min / Max",
          time: "O(log n)",
          space: "O(h)",
          description: "Repeatedly follows left (Min) or right (Max) child pointers until reaching null.",
        },
        {
          name: "In-Order Successor",
          time: "O(log n)",
          space: "O(h)",
          description: "Finds the smallest key strictly greater than current key (min node in right subtree).",
        },
      ],
    },
    cppCode: `// Production-Grade C++ Binary Search Tree (BST)
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct BSTNode {
    int val;
    BSTNode* left;
    BSTNode* right;
    BSTNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinarySearchTree {
private:
    BSTNode* root;

    BSTNode* insert(BSTNode* node, int val) {
        if (!node) return new BSTNode(val);
        if (val < node->val) {
            node->left = insert(node->left, val);
        } else if (val > node->val) {
            node->right = insert(node->right, val);
        }
        // Duplicate keys ignored in standard BST
        return node;
    }

    bool search(BSTNode* node, int val) const {
        if (!node) return false;
        if (node->val == val) return true;
        if (val < node->val) return search(node->left, val);
        return search(node->right, val);
    }

    BSTNode* findMin(BSTNode* node) const {
        while (node && node->left) {
            node = node->left;
        }
        return node;
    }

    BSTNode* remove(BSTNode* node, int val) {
        if (!node) return nullptr;

        if (val < node->val) {
            node->left = remove(node->left, val);
        } else if (val > node->val) {
            node->right = remove(node->right, val);
        } else {
            // Found node to delete! Handle 3 topological cases:
            // Case 1: Leaf (0 children)
            if (!node->left && !node->right) {
                delete node;
                return nullptr;
            }
            // Case 2: Single child
            if (!node->left) {
                BSTNode* temp = node->right;
                delete node;
                return temp;
            } else if (!node->right) {
                BSTNode* temp = node->left;
                delete node;
                return temp;
            }
            // Case 3: Two children -> Find In-Order Successor
            BSTNode* successor = findMin(node->right);
            node->val = successor->val;
            node->right = remove(node->right, successor->val);
        }
        return node;
    }

    void inOrder(BSTNode* node, vector<int>& result) const {
        if (!node) return;
        inOrder(node->left, result);
        result.push_back(node->val);
        inOrder(node->right, result);
    }

    void destroy(BSTNode* node) {
        if (!node) return;
        destroy(node->left);
        destroy(node->right);
        delete node;
    }

public:
    BinarySearchTree() : root(nullptr) {}
    ~BinarySearchTree() { destroy(root); }

    void insert(int val) { root = insert(root, val); }
    bool search(int val) const { return search(root, val); }
    void remove(int val) { root = remove(root, val); }

    vector<int> getSorted() const {
        vector<int> res;
        inOrder(root, res);
        return res; // Ascending sorted order
    }
};`,
  },
  "avl-tree": {
    id: "avl-tree",
    name: "AVL Tree",
    category: "tree",
    shortDescription:
      "A self-balancing binary search tree where subtree heights differ by at most 1, guaranteeing strict O(log n) operations.",
    description:
      "An AVL Tree (Adelson-Velsky and Landis) is a self-balancing binary search tree. For every node, the difference between the heights of its left and right subtrees (the Balance Factor, BF = h_left - h_right) is strictly maintained within {-1, 0, +1}. When an insertion or deletion causes |BF| to reach 2, localized O(1) tree rotations (Single Left, Single Right, Double Left-Right, Double Right-Left) are immediately executed to restore balance. This guarantees that the tree height h never exceeds 1.44 log2(n), completely preventing the catastrophic O(n) degeneration seen in naive BSTs.",
    complexity: {
      best: "O(log n)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(n)",
      stable: false,
      inPlace: true,
      operations: [
        {
          name: "Search",
          time: "O(log n)",
          space: "O(log n)",
          description: "Strictly logarithmic in all cases because tree height is mathematically capped at ≤ 1.44 log₂(n).",
        },
        {
          name: "Insertion & Rebalance",
          time: "O(log n)",
          space: "O(log n)",
          description: "Standard BST insertion followed by at most ONE single or double rotation to restore global balance.",
        },
        {
          name: "Deletion & Rebalance",
          time: "O(log n)",
          space: "O(log n)",
          description: "Standard BST deletion with potential cascading rotations along the ancestry path up to the root.",
        },
        {
          name: "Single Rotation (LL / RR)",
          time: "O(1)",
          space: "O(1)",
          description: "Re-links 3 pointers and recalculates 2 node heights in constant time.",
        },
        {
          name: "Double Rotation (LR / RL)",
          time: "O(1)",
          space: "O(1)",
          description: "Two consecutive single rotations resolving zig-zag and zag-zig imbalances.",
        },
        {
          name: "In-Order Traversal",
          time: "O(n)",
          space: "O(log n)",
          description: "Visits Left -> Root -> Right, yielding elements in strictly sorted ascending order.",
        },
      ],
    },
    cppCode: `// Production-Grade C++ AVL Tree
#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

struct AVLNode {
    int val, height;
    AVLNode *left, *right;
    AVLNode(int x) : val(x), height(1), left(nullptr), right(nullptr) {}
};

class AVLTree {
private:
    AVLNode* root;

    int getHeight(AVLNode* n) const { return n ? n->height : 0; }
    int getBF(AVLNode* n) const { return n ? getHeight(n->left) - getHeight(n->right) : 0; }
    void updateH(AVLNode* n) { if (n) n->height = 1 + max(getHeight(n->left), getHeight(n->right)); }

    AVLNode* rotateRight(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;
        x->right = y;
        y->left = T2;
        updateH(y);
        updateH(x);
        return x; // New root of subtree
    }

    AVLNode* rotateLeft(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;
        y->left = x;
        x->right = T2;
        updateH(x);
        updateH(y);
        return y; // New root of subtree
    }

    AVLNode* insert(AVLNode* node, int val) {
        if (!node) return new AVLNode(val);
        if (val < node->val) node->left = insert(node->left, val);
        else if (val > node->val) node->right = insert(node->right, val);
        else return node; // Duplicate keys ignored

        updateH(node);
        int bf = getBF(node);

        // 4 Rotation Cases:
        // LL Case
        if (bf > 1 && val < node->left->val)
            return rotateRight(node);
        // RR Case
        if (bf < -1 && val > node->right->val)
            return rotateLeft(node);
        // LR Case
        if (bf > 1 && val > node->left->val) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }
        // RL Case
        if (bf < -1 && val < node->right->val) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }
        return node;
    }

    AVLNode* findMin(AVLNode* node) const {
        while (node && node->left) node = node->left;
        return node;
    }

    AVLNode* remove(AVLNode* node, int val) {
        if (!node) return nullptr;

        if (val < node->val) node->left = remove(node->left, val);
        else if (val > node->val) node->right = remove(node->right, val);
        else {
            if (!node->left || !node->right) {
                AVLNode* temp = node->left ? node->left : node->right;
                if (!temp) { temp = node; node = nullptr; }
                else *node = *temp;
                delete temp;
            } else {
                AVLNode* temp = findMin(node->right);
                node->val = temp->val;
                node->right = remove(node->right, temp->val);
            }
        }
        if (!node) return nullptr;

        updateH(node);
        int bf = getBF(node);

        // Rebalance
        if (bf > 1 && getBF(node->left) >= 0) return rotateRight(node);
        if (bf > 1 && getBF(node->left) < 0) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }
        if (bf < -1 && getBF(node->right) <= 0) return rotateLeft(node);
        if (bf < -1 && getBF(node->right) > 0) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }
        return node;
    }

    void destroy(AVLNode* n) {
        if (!n) return;
        destroy(n->left);
        destroy(n->right);
        delete n;
    }

public:
    AVLTree() : root(nullptr) {}
    ~AVLTree() { destroy(root); }

    void insert(int val) { root = insert(root, val); }
    void remove(int val) { root = remove(root, val); }
};`,
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

// All Searching Algorithms
export const SEARCHING_ALGORITHMS: AlgorithmId[] = [
  "linear-search",
  "binary-search",
];

// All Data Structures (Linear & Hash)
export const DATA_STRUCTURES: AlgorithmId[] = [
  "array",
  "string",
  "deque",
  "stack",
  "queue",
  "linked-list",
  "hash-table",
];

// All Tree Data Structures
export const TREE_TOPICS: AlgorithmId[] = [
  "binary-tree",
  "bst",
  "avl-tree",
];

// All Complexity Topics
export const COMPLEXITY_TOPICS: AlgorithmId[] = [
  "time-complexity",
  "space-complexity",
];

// Backward compatibility alias for sorting visualizer
export const ALL_ALGORITHMS: AlgorithmId[] = SORTING_ALGORITHMS;

// Global catalog of all topics across all categories (Beginner-First Progression)
export const ALL_TOPICS: AlgorithmId[] = [
  "array",
  "string",
  "deque",
  "linear-search",
  "time-complexity",
  "space-complexity",
  "binary-search",
  "stack",
  "queue",
  "linked-list",
  "hash-table",
  "binary-tree",
  "bst",
  "avl-tree",
  "bubble",
  "selection",
  "insertion",
  "merge",
  "quick",
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
