import { SortOperation } from "@/types/sorting";

/**
 * Pure Bubble Sort implementation recording operations and variable snapshots for debugger.
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
        snapshot: { i: 0, j: 0, n, swapped: false, arr: [...arr] },
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
        description: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
        snapshot: { i, j, n, swapped, arr: [...arr] },
      });

      if (arr[j] > arr[j + 1]) {
        // Swap operation
        operations.push({
          type: "swap",
          indices: [j, j + 1],
          description: `${arr[j]} > ${arr[j + 1]}: Swapping indices ${j} and ${j + 1}`,
          snapshot: { i, j, n, swapped: true, arr: [...arr] },
        });
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }

    const sortedIdx = n - i - 1;
    sortedSet.add(sortedIdx);
    operations.push({
      type: "sorted",
      indices: Array.from(sortedSet),
      description: `Element ${arr[sortedIdx]} at index ${sortedIdx} is in sorted position`,
      snapshot: { i, j: n - i - 1, n, swapped, arr: [...arr] },
    });

    if (!swapped) {
      operations.push({
        type: "sorted",
        indices: Array.from({ length: n }, (_, k) => k),
        description: "No swaps made in pass; entire array is fully sorted early!",
        snapshot: { i, j: 0, n, swapped: false, arr: [...arr] },
      });
      return operations;
    }
  }

  for (let k = 0; k < n; k++) sortedSet.add(k);
  operations.push({
    type: "sorted",
    indices: Array.from(sortedSet),
    description: "Array is completely sorted!",
    snapshot: { i: n - 1, j: 0, n, swapped: false, arr: [...arr] },
  });

  return operations;
}
