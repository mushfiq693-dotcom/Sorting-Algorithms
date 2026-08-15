import { SortOperation } from "@/types/sorting";

/**
 * Pure Merge Sort implementation recording operations, variable snapshots, and recursion call stack frames.
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
        snapshot: { left: 0, right: 0, mid: 0, n, arr: [...arr] },
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
      snapshot: { left, mid, right, i: left, j: mid + 1, n, arr: [...arr] },
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
        snapshot: { left, mid, right, i, j, n, arr: [...arr] },
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

    for (let k = left; k <= right; k++) {
      const val = temp[k - left];
      operations.push({
        type: "overwrite",
        index: k,
        value: val,
        description: `Placing merged value ${val} into index ${k}`,
        snapshot: { left, mid, right, k, val, n, arr: [...arr] },
      });
      arr[k] = val;
    }
  }

  function sort(left: number, right: number) {
    operations.push({
      type: "call-enter",
      fn: "mergeSort",
      args: [left, right],
      description: `Entering mergeSort(left: ${left}, right: ${right})`,
      snapshot: { left, right, n, arr: [...arr] },
    });

    if (left >= right) {
      operations.push({
        type: "call-exit",
        fn: "mergeSort",
        description: `Base case reached at [${left}..${right}], unwinding call stack`,
        snapshot: { left, right, n, arr: [...arr] },
      });
      return;
    }

    const mid = left + Math.floor((right - left) / 2);

    operations.push({
      type: "range",
      left,
      right,
      description: `Dividing range [${left}..${right}] at mid index ${mid}`,
      snapshot: { left, mid, right, n, arr: [...arr] },
    });

    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);

    operations.push({
      type: "call-exit",
      fn: "mergeSort",
      description: `Completed mergeSort(left: ${left}, right: ${right})`,
      snapshot: { left, mid, right, n, arr: [...arr] },
    });
  }

  sort(0, n - 1);

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Array is completely sorted!",
    snapshot: { left: 0, right: n - 1, mid: Math.floor((n - 1) / 2), n, arr: [...arr] },
  });

  return operations;
}
