import { SortOperation } from "@/types/sorting";

/**
 * Real flawed Bubble Sort implementation:
 * Bug: Inverted comparison condition `arr[j] < arr[j + 1]` instead of `>`, which sorts descending instead of ascending!
 */
export function bubbleSortBuggy(inputArray: number[]): SortOperation[] {
  const operations: SortOperation[] = [];
  const arr = [...inputArray];
  const n = arr.length;

  if (n <= 1) return operations;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      operations.push({
        type: "compare",
        indices: [j, j + 1],
        description: `Buggy check: arr[${j}] < arr[${j + 1}] (${arr[j]} < ${arr[j + 1]})`,
      });

      // Flawed condition: < instead of >
      if (arr[j] < arr[j + 1]) {
        operations.push({
          type: "swap",
          indices: [j, j + 1],
          description: `FLAWED: Swapping indices ${j} and ${j + 1} when smaller!`,
        });
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  operations.push({
    type: "sorted",
    indices: Array.from({ length: n }, (_, k) => k),
    description: "Flawed execution finished (Array ended up in wrong order!)",
  });

  return operations;
}
