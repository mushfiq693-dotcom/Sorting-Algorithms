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
};
