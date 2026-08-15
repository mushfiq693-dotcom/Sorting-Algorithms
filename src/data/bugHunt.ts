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
};
