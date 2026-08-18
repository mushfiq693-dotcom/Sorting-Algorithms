import { executeCodeInWorker } from "../codeWorkerRunner";
import { STANDARD_PRACTICE_TEST_CASES, CODING_CHALLENGES } from "../../data/codingPractice";

async function runWorkerTests() {
  console.log("=========================================");
  console.log("  CODING WORKER SANDBOX TEST SUITE       ");
  console.log("=========================================\n");

  let totalTests = 0;
  let passedTests = 0;

  // TEST 1: Valid Submission (Bubble Sort Canonical Solution)
  totalTests++;
  console.log("Test 1: Valid Submission (Canonical Bubble Sort)");
  try {
    const res = await executeCodeInWorker({
      code: CODING_CHALLENGES.bubble.solutionCode,
      algorithmId: "bubble",
      testCases: STANDARD_PRACTICE_TEST_CASES,
    }, 1500);

    if (res.success && res.allPassed && res.results && res.results.length === 6) {
      passedTests++;
      console.log("  ✓ PASSED: All 6 test cases executed and passed in worker.");
    } else {
      console.error("  ✗ FAILED: Valid code did not pass all tests.", res);
    }
  } catch (err) {
    console.error("  ✗ FAILED with exception:", err);
  }
  console.log("");

  // TEST 2: Incorrect Submission (Returns Unsorted / Reversed Array)
  totalTests++;
  console.log("Test 2: Incorrect Submission (Returns input in reverse)");
  try {
    const wrongCode = `
      function bubbleSort(arr) {
        return arr.slice().reverse();
      }
    `;
    const res = await executeCodeInWorker({
      code: wrongCode,
      algorithmId: "bubble",
      testCases: STANDARD_PRACTICE_TEST_CASES,
    }, 1500);

    if (res.success && !res.allPassed && res.results) {
      const failedCases = res.results.filter(r => !r.passed);
      if (failedCases.length > 0) {
        passedTests++;
        console.log(`  ✓ PASSED: Correctly identified ${failedCases.length} failing test cases.`);
      } else {
        console.error("  ✗ FAILED: Incorrect code was reported as passing.", res);
      }
    } else {
      console.error("  ✗ FAILED: Expected results array with failed cases.", res);
    }
  } catch (err) {
    console.error("  ✗ FAILED with exception:", err);
  }
  console.log("");

  // TEST 3: Syntax Error in User Code
  totalTests++;
  console.log("Test 3: Syntax Error Handling");
  try {
    const syntaxErrorCode = `
      function bubbleSort(arr) {
        const x = ; // Invalid syntax
        return arr;
      }
    `;
    const res = await executeCodeInWorker({
      code: syntaxErrorCode,
      algorithmId: "bubble",
      testCases: STANDARD_PRACTICE_TEST_CASES,
    }, 1500);

    if (!res.success && res.error) {
      passedTests++;
      console.log(`  ✓ PASSED: Syntax error caught gracefully: "${res.error}".`);
    } else {
      console.error("  ✗ FAILED: Syntax error was not caught.", res);
    }
  } catch (err) {
    console.error("  ✗ FAILED with exception:", err);
  }
  console.log("");

  // TEST 4: Runtime Error Inside Function
  totalTests++;
  console.log("Test 4: Runtime Exception Handling");
  try {
    const runtimeErrorCode = `
      function bubbleSort(arr) {
        if (arr.length > 2) {
          throw new Error("Array is too large for this implementation!");
        }
        return arr;
      }
    `;
    const res = await executeCodeInWorker({
      code: runtimeErrorCode,
      algorithmId: "bubble",
      testCases: STANDARD_PRACTICE_TEST_CASES,
    }, 1500);

    if (res.success && !res.allPassed && res.results) {
      const errorCases = res.results.filter(r => r.error);
      if (errorCases.length > 0) {
        passedTests++;
        console.log(`  ✓ PASSED: Runtime exception recorded in test result: "${errorCases[0].error}".`);
      } else {
        console.error("  ✗ FAILED: Runtime error was not captured in test results.", res);
      }
    } else {
      console.error("  ✗ FAILED: Expected results with error items.", res);
    }
  } catch (err) {
    console.error("  ✗ FAILED with exception:", err);
  }
  console.log("");

  // TEST 5: Infinite Loop Timeout Protection
  totalTests++;
  console.log("Test 5: Infinite Loop Timeout Protection (1000ms guard)");
  const startTime = Date.now();
  try {
    const infiniteLoopCode = `
      function bubbleSort(arr) {
        let i = 0;
        while (true) {
          i++; // Infinite loop!
        }
        return arr;
      }
    `;
    const res = await executeCodeInWorker({
      code: infiniteLoopCode,
      algorithmId: "bubble",
      testCases: STANDARD_PRACTICE_TEST_CASES,
    }, 1000);

    const elapsed = Date.now() - startTime;

    if (!res.success && res.error && res.error.includes("timed out")) {
      passedTests++;
      console.log(`  ✓ PASSED: Infinite loop terminated cleanly after ${elapsed}ms: "${res.error}".`);
    } else {
      console.error("  ✗ FAILED: Infinite loop was not terminated with timeout.", res);
    }
  } catch (err) {
    console.error("  ✗ FAILED with exception:", err);
  }
  console.log("");

  console.log("=========================================");
  console.log(`Worker Test Results: ${passedTests} / ${totalTests} Passed.`);
  console.log("=========================================\n");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runWorkerTests();
