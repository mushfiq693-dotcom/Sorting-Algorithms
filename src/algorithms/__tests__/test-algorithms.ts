import { bubbleSort } from "../bubbleSort";
import { selectionSort } from "../selectionSort";
import { insertionSort } from "../insertionSort";
import { mergeSort } from "../mergeSort";
import { quickSort } from "../quickSort";
import { SortOperation } from "../../types/sorting";

interface TestCase {
  name: string;
  input: number[];
}

const TEST_CASES: TestCase[] = [
  { name: "Random Array", input: [45, 12, 89, 34, 7, 60, 23] },
  { name: "Already Sorted Array", input: [1, 2, 3, 4, 5, 6, 7] },
  { name: "Reverse Sorted Array", input: [90, 80, 70, 60, 50, 40] },
  { name: "Array with Duplicates", input: [5, 1, 3, 5, 2, 1, 3, 5] },
  { name: "Single Element Array", input: [42] },
  { name: "Empty Array", input: [] },
];

function simulateOperations(initialArr: number[], operations: SortOperation[]): number[] {
  const arr = [...initialArr];
  for (const op of operations) {
    if (op.type === "swap") {
      const [i, j] = op.indices;
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    } else if (op.type === "overwrite") {
      arr[op.index] = op.value;
    }
  }
  return arr;
}

function runTests() {
  console.log("=========================================");
  console.log("  ALGORITHM ENGINE VERIFICATION SUITE   ");
  console.log("=========================================\n");

  const algorithms = [
    { name: "Bubble Sort", fn: bubbleSort },
    { name: "Selection Sort", fn: selectionSort },
    { name: "Insertion Sort", fn: insertionSort },
    { name: "Merge Sort", fn: mergeSort },
    { name: "Quick Sort", fn: quickSort },
  ];

  let totalTests = 0;
  let passedTests = 0;

  for (const { name: algoName, fn } of algorithms) {
    console.log(`Testing Algorithm: [${algoName}]`);
    console.log("-----------------------------------------");

    for (const testCase of TEST_CASES) {
      totalTests++;
      const expected = [...testCase.input].sort((a, b) => a - b);
      const operations = fn(testCase.input);
      const resultingArr = simulateOperations(testCase.input, operations);

      const isSortedCorrectly =
        JSON.stringify(resultingArr) === JSON.stringify(expected);

      if (isSortedCorrectly) {
        passedTests++;
        console.log(
          `  ✓ PASSED: ${testCase.name} (input: [${testCase.input.join(
            ", "
          )}] -> [${resultingArr.join(", ")}]) - ${operations.length} operations recorded`
        );
      } else {
        console.error(
          `  ✗ FAILED: ${testCase.name}\n    Expected: [${expected.join(
            ", "
          )}]\n    Got:      [${resultingArr.join(", ")}]`
        );
      }
    }
    console.log("");
  }

  console.log("=========================================");
  console.log(`Results: ${passedTests} / ${totalTests} Passed.`);
  console.log("=========================================");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests();
