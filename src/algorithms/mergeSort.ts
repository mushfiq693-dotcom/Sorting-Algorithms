import { SortOperation } from "@/types/sorting";

/**
 * Pure Merge Sort implementation that records step-by-step operations.
 * Models recursive divide-and-conquer, subarray comparisons, and overwrite merge writebacks.
 */
export function mergeSort(inputArray: number[]): SortOperation[] {
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

  function merge(left: number, mid: number, right: number) {
    operations.push({
      type: "merge-start",
      left,
      mid,
      right,
      description: `Merging sorted subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
    });

    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      operations.push({
        type: "merge-compare",
        leftIndex: i,
        rightIndex: j,
        description: `Comparing left [${i}] (${arr[i]}) vs right [${j}] (${arr[j]})`,
      });

      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }

    while (i <= mid) {
      temp.push(arr[i++]);
    }

    while (j <= right) {
      temp.push(arr[j++]);
    }

    // Write back merged values into the original array
    for (let k = left; k <= right; k++) {
      const val = temp[k - left];
      operations.push({
        type: "overwrite",
        index: k,
        value: val,
        description: `Placing merged value ${val} into index ${k}`,
      });
      arr[k] = val;
    }
  }

  function sort(left: number, right: number) {
    if (left >= right) return;

    const mid = left + Math.floor((right - left) / 2);

    operations.push({
      type: "range",
      left,
      right,
      description: `Dividing range [${left}..${right}] at mid index ${mid}`,
    });

    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, n - 1);

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Array is completely sorted!",
  });

  return operations;
}
