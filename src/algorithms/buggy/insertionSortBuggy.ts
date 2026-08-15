import { SortOperation } from "@/types/sorting";

/**
 * Real flawed Insertion Sort implementation:
 * Bug: while condition uses `arr[j] < key` instead of `arr[j] > key`, shifting smaller elements right!
 */
export function insertionSortBuggy(inputArray: number[]): SortOperation[] {
  const operations: SortOperation[] = [];
  const arr = [...inputArray];
  const n = arr.length;

  if (n <= 1) return operations;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Flawed: arr[j] < key
    while (j >= 0 && arr[j] < key) {
      operations.push({
        type: "compare",
        indices: [j, j + 1],
        description: `Flawed while condition: arr[${j}] < key (${arr[j]} < ${key})`,
      });

      operations.push({
        type: "overwrite",
        index: j + 1,
        value: arr[j],
        description: `Shifting ${arr[j]} into slot ${j + 1}`,
      });
      arr[j + 1] = arr[j];
      j--;
    }

    operations.push({
      type: "overwrite",
      index: j + 1,
      value: key,
      description: `Inserted key ${key} at index ${j + 1}`,
    });
    arr[j + 1] = key;
  }

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Flawed execution finished (Array is wrongly sorted!)",
  });

  return operations;
}
