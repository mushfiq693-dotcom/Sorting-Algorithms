import { SortOperation } from "@/types/sorting";

/**
 * Pure Selection Sort implementation that records step-by-step operations.
 * Matches the C++ reference logic.
 */
export function selectionSort(inputArray: number[]): SortOperation[] {
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
    let minIdx = i;

    // Scan for minimum element in remaining unsorted portion
    for (let j = i + 1; j < n; j++) {
      operations.push({
        type: "compare",
        indices: [j, minIdx],
        description: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]})`,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        operations.push({
          type: "compare",
          indices: [minIdx, i],
          description: `New minimum found: arr[${minIdx}] (${arr[minIdx]})`,
        });
      }
    }

    // Swap the found minimum element with the first element of unsorted portion
    operations.push({
      type: "swap",
      indices: [i, minIdx],
      description: `Swapping index ${i} (${arr[i]}) with minimum element index ${minIdx} (${arr[minIdx]})`,
    });

    const temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;

    // Mark element at i as sorted
    sortedSet.add(i);
    operations.push({
      type: "sorted",
      indices: Array.from(sortedSet),
      description: `Element ${arr[i]} at index ${i} is in its sorted position`,
    });
  }

  // Last remaining element is sorted
  for (let k = 0; k < n; k++) sortedSet.add(k);
  operations.push({
    type: "sorted",
    indices: Array.from(sortedSet),
    description: "Array is completely sorted!",
  });

  return operations;
}
