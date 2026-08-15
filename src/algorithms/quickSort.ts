import { SortOperation } from "@/types/sorting";

/**
 * Pure Quick Sort implementation recording operations, variable snapshots, and recursion call stack frames.
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
        snapshot: { low: 0, high: 0, pivot: arr[0], i: 0, j: 0, n, arr: [...arr] },
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
      snapshot: { low, high, pivot, i: low - 1, j: low, n, arr: [...arr] },
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      operations.push({
        type: "compare",
        indices: [j, high],
        description: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot})`,
        snapshot: { low, high, pivot, i, j, n, arr: [...arr] },
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          operations.push({
            type: "swap",
            indices: [i, j],
            description: `${arr[j]} < ${pivot}: Swapping index ${i} (${arr[i]}) with index ${j} (${arr[j]})`,
            snapshot: { low, high, pivot, i, j, n, arr: [...arr] },
          });
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    }

    const pivotFinalPos = i + 1;
    operations.push({
      type: "swap",
      indices: [pivotFinalPos, high],
      description: `Placing pivot ${pivot} into its sorted position at index ${pivotFinalPos}`,
      snapshot: { low, high, pivot, i, j: high, pi: pivotFinalPos, n, arr: [...arr] },
    });

    const temp = arr[pivotFinalPos];
    arr[pivotFinalPos] = arr[high];
    arr[high] = temp;

    sortedIndices.add(pivotFinalPos);
    operations.push({
      type: "sorted",
      indices: Array.from(sortedIndices),
      description: `Pivot ${pivot} is now fixed at sorted position ${pivotFinalPos}`,
      snapshot: { low, high, pivot, pi: pivotFinalPos, n, arr: [...arr] },
    });

    return pivotFinalPos;
  }

  function sort(low: number, high: number) {
    operations.push({
      type: "call-enter",
      fn: "quickSort",
      args: [low, high],
      description: `Entering quickSort(low: ${low}, high: ${high})`,
      snapshot: { low, high, n, arr: [...arr] },
    });

    if (low < high) {
      operations.push({
        type: "range",
        left: low,
        right: high,
        description: `Partitioning subarray range [${low}..${high}]`,
        snapshot: { low, high, n, arr: [...arr] },
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
        snapshot: { low, high, n, arr: [...arr] },
      });
    }

    operations.push({
      type: "call-exit",
      fn: "quickSort",
      description: `Completed quickSort(low: ${low}, high: ${high})`,
      snapshot: { low, high, n, arr: [...arr] },
    });
  }

  sort(0, n - 1);

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Array is completely sorted!",
    snapshot: { low: 0, high: n - 1, n, arr: [...arr] },
  });

  return operations;
}
