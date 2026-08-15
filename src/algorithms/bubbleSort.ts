import { SortOperation } from "@/types/sorting";

/**
 * Pure Bubble Sort implementation that records step-by-step operations.
 * Matches the C++ reference logic with early break optimization.
 */
export function bubbleSort(inputArray: number[]): SortOperation[] {
  const operations: SortOperation[] = [];
  const arr = [...inputArray];
  const n = arr.length;

  if (n <= 1) {
    if (n === 1) {
      operations.push({
        type: "sorted",
        indices: [0],
        description: "Single element array is already sorted.",
      });
    }
    return operations;
  }

  const sortedSet = new Set<number>();

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison operation
      operations.push({
        type: "compare",
        indices: [j, j + 1],
        description: `Comparing elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`,
      });

      if (arr[j] > arr[j + 1]) {
        // Swap operation
        operations.push({
          type: "swap",
          indices: [j, j + 1],
          description: `${arr[j]} > ${arr[j + 1]}, so swapping indices ${j} and ${j + 1}`,
        });
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }

    // The element at n - i - 1 is now in its sorted position
    const sortedIdx = n - i - 1;
    sortedSet.add(sortedIdx);
    operations.push({
      type: "sorted",
      indices: Array.from(sortedSet),
      description: `Element ${arr[sortedIdx]} at index ${sortedIdx} is now in its final sorted position`,
    });

    if (!swapped) {
      operations.push({
        type: "sorted",
        indices: Array.from({ length: n }, (_, k) => k),
        description: "No swaps made in pass; entire array is fully sorted early!",
      });
      return operations;
    }
  }

  // Ensure index 0 is also added
  for (let k = 0; k < n; k++) sortedSet.add(k);
  operations.push({
    type: "sorted",
    indices: Array.from(sortedSet),
    description: "Array is completely sorted!",
  });

  return operations;
}
