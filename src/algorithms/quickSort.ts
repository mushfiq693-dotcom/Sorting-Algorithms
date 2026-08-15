import { SortOperation } from "@/types/sorting";

/**
 * Pure Quick Sort implementation that records step-by-step operations.
 * Models Lomuto partitioning, pivot selection, range scopes, and in-place swaps.
 */
export function quickSort(inputArray: number[]): SortOperation[] {
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

  const sortedIndices = new Set<number>();

  function partition(low: number, high: number): number {
    const pivot = arr[high];

    operations.push({
      type: "pivot",
      index: high,
      description: `Selected pivot element: ${pivot} at index ${high}`,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      operations.push({
        type: "compare",
        indices: [j, high],
        description: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot})`,
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          operations.push({
            type: "swap",
            indices: [i, j],
            description: `${arr[j]} < ${pivot}: Swapping index ${i} (${arr[i]}) with index ${j} (${arr[j]})`,
          });
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    }

    // Place pivot at its correct position (i + 1)
    const pivotFinalPos = i + 1;
    operations.push({
      type: "swap",
      indices: [pivotFinalPos, high],
      description: `Placing pivot ${pivot} into its sorted position at index ${pivotFinalPos}`,
    });

    const temp = arr[pivotFinalPos];
    arr[pivotFinalPos] = arr[high];
    arr[high] = temp;

    sortedIndices.add(pivotFinalPos);
    operations.push({
      type: "sorted",
      indices: Array.from(sortedIndices),
      description: `Pivot ${pivot} is now fixed at sorted position ${pivotFinalPos}`,
    });

    return pivotFinalPos;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      operations.push({
        type: "range",
        left: low,
        right: high,
        description: `Partitioning subarray range [${low}..${high}]`,
      });

      const pi = partition(low, high);

      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
      operations.push({
        type: "sorted",
        indices: Array.from(sortedIndices),
        description: `Single element at index ${low} is sorted`,
      });
    }
  }

  sort(0, n - 1);

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Array is completely sorted!",
  });

  return operations;
}
