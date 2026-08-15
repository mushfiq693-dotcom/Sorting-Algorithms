import { SortOperation } from "@/types/sorting";

/**
 * Real flawed Quick Sort implementation:
 * Bug: Partition loop condition `j <= high` instead of `j < high`, which includes the pivot itself in comparison and causes incorrect partition positioning.
 */
export function quickSortBuggy(inputArray: number[]): SortOperation[] {
  const operations: SortOperation[] = [];
  const arr = [...inputArray];
  const n = arr.length;

  if (n <= 1) return operations;

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    // Flawed loop: j <= high includes the pivot
    for (let j = low; j <= high; j++) {
      operations.push({
        type: "compare",
        indices: [j, high],
        description: `Flawed partition loop: compared pivot at index ${high} with index ${j}`,
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          operations.push({
            type: "swap",
            indices: [i, j],
            description: `Swapped index ${i} and ${j}`,
          });
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    }

    const pivotFinalPos = i + 1;
    if (pivotFinalPos < n) {
      operations.push({
        type: "swap",
        indices: [pivotFinalPos, high],
        description: `Swapped index ${pivotFinalPos} and ${high}`,
      });
      const temp = arr[pivotFinalPos];
      arr[pivotFinalPos] = arr[high];
      arr[high] = temp;
    }

    return pivotFinalPos;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, n - 1);

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Flawed execution finished (Pivot partitioned inaccurately!)",
  });

  return operations;
}
