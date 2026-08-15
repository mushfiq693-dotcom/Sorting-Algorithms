import { SortOperation } from "@/types/sorting";

/**
 * Pure Insertion Sort implementation that records step-by-step operations.
 * Accurately models the key extraction and shifting behavior of Insertion Sort.
 */
export function insertionSort(inputArray: number[]): SortOperation[] {
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

  // Index 0 is trivially sorted by itself
  operations.push({
    type: "sorted",
    indices: [0],
    description: "Initial element at index 0 is considered sorted.",
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    operations.push({
      type: "range",
      left: 0,
      right: i,
      description: `Considering key = ${key} at index ${i} to insert into sorted portion [0..${i - 1}]`,
    });

    while (j >= 0) {
      operations.push({
        type: "compare",
        indices: [j, j + 1],
        description: `Comparing sorted element arr[${j}] (${arr[j]}) with key (${key})`,
      });

      if (arr[j] > key) {
        // Shift arr[j] to arr[j + 1]
        operations.push({
          type: "overwrite",
          index: j + 1,
          value: arr[j],
          description: `${arr[j]} > ${key}: Shifting ${arr[j]} right from index ${j} to ${j + 1}`,
        });
        arr[j + 1] = arr[j];
        j--;
      } else {
        break;
      }
    }

    // Insert key at found slot j + 1
    operations.push({
      type: "overwrite",
      index: j + 1,
      value: key,
      description: `Inserting key (${key}) into its correct position at index ${j + 1}`,
    });
    arr[j + 1] = key;

    // Subarray from 0 to i is now fully sorted
    const sortedIndices = Array.from({ length: i + 1 }, (_, k) => k);
    operations.push({
      type: "sorted",
      indices: sortedIndices,
      description: `Subarray [0..${i}] is now sorted`,
    });
  }

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Entire array is completely sorted!",
  });

  return operations;
}
