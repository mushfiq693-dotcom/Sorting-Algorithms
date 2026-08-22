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
};
