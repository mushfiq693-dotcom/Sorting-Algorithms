import { SortOperation } from "@/types/sorting";

/**
 * Pure Insertion Sort implementation recording operations and variable snapshots.
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
        snapshot: { i: 0, j: 0, key: arr[0], n, arr: [...arr] },
      });
    }
    return operations;
  }

  operations.push({
    type: "sorted",
    indices: [0],
    description: "Initial element at index 0 is considered sorted.",
    snapshot: { i: 0, j: 0, key: arr[0], n, arr: [...arr] },
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    operations.push({
      type: "range",
      left: 0,
      right: i,
      description: `Extracting key = ${key} at index ${i} to insert into sorted portion [0..${i - 1}]`,
      snapshot: { i, j, key, n, arr: [...arr] },
    });

    while (j >= 0) {
      operations.push({
        type: "compare",
        indices: [j, j + 1],
        description: `Comparing sorted element arr[${j}] (${arr[j]}) with key (${key})`,
        snapshot: { i, j, key, n, arr: [...arr] },
      });

      if (arr[j] > key) {
        operations.push({
          type: "overwrite",
          index: j + 1,
          value: arr[j],
          description: `${arr[j]} > ${key}: Shifting ${arr[j]} right from index ${j} to ${j + 1}`,
          snapshot: { i, j, key, n, arr: [...arr] },
        });
        arr[j + 1] = arr[j];
        j--;
      } else {
        break;
      }
    }

    operations.push({
      type: "overwrite",
      index: j + 1,
      value: key,
      description: `Inserting key (${key}) into slot at index ${j + 1}`,
      snapshot: { i, j, key, n, arr: [...arr] },
    });
    arr[j + 1] = key;

    const sortedIndices = Array.from({ length: i + 1 }, (_, k) => k);
    operations.push({
      type: "sorted",
      indices: sortedIndices,
      description: `Subarray [0..${i}] is now sorted`,
      snapshot: { i, j: j + 1, key, n, arr: [...arr] },
    });
  }

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Entire array is completely sorted!",
    snapshot: { i: n, j: 0, key: 0, n, arr: [...arr] },
  });

  return operations;
}
