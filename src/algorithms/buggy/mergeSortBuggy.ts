import { SortOperation } from "@/types/sorting";

/**
 * Real flawed Merge Sort implementation:
 * Bug: while loop condition inverts merge comparison `arr[i] > arr[j]` instead of `<=`, producing descending subarrays.
 */
export function mergeSortBuggy(inputArray: number[]): SortOperation[] {
  const operations: SortOperation[] = [];
  const arr = [...inputArray];
  const n = arr.length;

  if (n <= 1) return operations;

  function merge(left: number, mid: number, right: number) {
    operations.push({
      type: "merge-start",
      left,
      mid,
      right,
      description: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
    });

    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      operations.push({
        type: "merge-compare",
        leftIndex: i,
        rightIndex: j,
        description: `Flawed check: arr[${i}] > arr[${j}] (${arr[i]} > ${arr[j]})`,
      });

      // Flawed condition: > instead of <=
      if (arr[i] > arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }

    while (i <= mid) temp.push(arr[i++]);
    while (j <= right) temp.push(arr[j++]);

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
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, n - 1);

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Flawed execution finished (Subarrays merged incorrectly!)",
  });

  return operations;
}
