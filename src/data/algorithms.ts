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
};

// All 5 algorithms active in Phase 2
export const ALL_ALGORITHMS: AlgorithmId[] = [
  "bubble",
  "selection",
  "insertion",
  "merge",
  "quick",
];

export const ALGORITHM_RUNNERS: Record<
  AlgorithmId,
  (arr: number[]) => SortOperation[]
> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};
