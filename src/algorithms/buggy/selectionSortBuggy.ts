import { SortOperation } from "@/types/sorting";

/**
 * Real flawed Selection Sort implementation:
 * Bug: Scans with `arr[j] > arr[minIdx]` instead of `<`, finding the MAXIMUM element instead of minimum!
 */
export function selectionSortBuggy(inputArray: number[]): SortOperation[] {
  const operations: SortOperation[] = [];
  const arr = [...inputArray];
  const n = arr.length;

  if (n <= 1) return operations;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      operations.push({
        type: "compare",
        indices: [j, minIdx],
        description: `Buggy check: arr[${j}] > arr[${minIdx}]`,
      });

      // Flawed check: > instead of <
      if (arr[j] > arr[minIdx]) {
        minIdx = j;
        operations.push({
          type: "compare",
          indices: [minIdx, i],
          description: `Flawed selection: picked larger element at index ${minIdx}`,
        });
      }
    }

    operations.push({
      type: "swap",
      indices: [i, minIdx],
      description: `Swapped index ${i} with flawed index ${minIdx}`,
    });

    const temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Flawed execution finished (Array ended up in descending order!)",
  });

  return operations;
}
