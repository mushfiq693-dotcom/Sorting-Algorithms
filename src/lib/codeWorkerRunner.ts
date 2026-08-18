/**
 * Web Worker Code Execution Runner for Coding Practice Challenges
 *
 * Runs user-submitted sorting algorithms in an isolated Web Worker with a strict
 * timeout to protect the main UI thread from infinite loops, freezes, and syntax/runtime crashes.
 */

export interface TestResult {
  name: string;
  input: number[];
  expected: number[];
  actual: number[] | null;
  passed: boolean;
  error?: string;
  executionTimeMs?: number;
}

export interface WorkerExecutionResult {
  success: boolean;
  results?: TestResult[];
  allPassed?: boolean;
  error?: string;
}

export interface WorkerRequestPayload {
  code: string;
  algorithmId: string;
  testCases: Array<{
    name: string;
    input: number[];
    expected: number[];
  }>;
}

/**
 * Strips lightweight TypeScript annotations (param types, return types, variable types)
 * so students can write either TypeScript or JavaScript in the editor without syntax errors.
 */
export function stripSimpleTsTypes(code: string): string {
  return code
    // Remove interface/type declarations
    .replace(/(?:interface|type)\s+[A-Za-z0-9_$]+\s*=?\s*\{[^}]*\};?/g, "")
    // Remove function return type annotations: ): returnType {
    .replace(/\):\s*[A-Za-z0-9_$\[\]<>, |]+\s*\{/g, ") {")
    .replace(/\):\s*[A-Za-z0-9_$\[\]<>, |]+\s*=>/g, ") =>")
    // Remove parameter type annotations: (arr: number[]) -> (arr)
    .replace(/(\b[A-Za-z0-9_$]+)\s*:\s*[A-Za-z0-9_$\[\]<>, |]+(?=[,\)\s=])/g, "$1")
    // Remove variable type annotations: let/const/var x: type =
    .replace(/(let|const|var)\s+([A-Za-z0-9_$]+)\s*:\s*[A-Za-z0-9_$\[\]<>, |]+\s*=/g, "$1 $2 =")
    // Remove 'as Type' casts
    .replace(/\s+as\s+[A-Za-z0-9_$\[\]<>]+/g, "");
}

const WORKER_SCRIPT = `
self.onmessage = function(e) {
  var data = e.data;
  var code = data.code;
  var algorithmId = data.algorithmId;
  var testCases = data.testCases;

  try {
    var wrappedCode = '"use strict";\\n' +
      code + '\\n' +
      'if (typeof ' + algorithmId + 'Sort === "function") { return ' + algorithmId + 'Sort; }' +
      'else if (typeof bubbleSort === "function") { return bubbleSort; }' +
      'else if (typeof selectionSort === "function") { return selectionSort; }' +
      'else if (typeof insertionSort === "function") { return insertionSort; }' +
      'else if (typeof mergeSort === "function") { return mergeSort; }' +
      'else if (typeof quickSort === "function") { return quickSort; }' +
      'throw new Error("No sort function found. Please define function " + algorithmId + "Sort(arr) { ... }");';

    var userSortFnFactory = new Function(wrappedCode);
    var userSortFn = userSortFnFactory();

    if (typeof userSortFn !== "function") {
      self.postMessage({
        success: false,
        error: "Expected a function definition for " + algorithmId + "Sort"
      });
      return;
    }

    var results = [];
    var allPassed = true;

    for (var i = 0; i < testCases.length; i++) {
      var tc = testCases[i];
      var inputCopy = tc.input.slice();
      var startTime = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();

      var output;
      try {
        output = userSortFn(inputCopy);
      } catch (execErr) {
        results.push({
          name: tc.name,
          input: tc.input,
          expected: tc.expected,
          actual: null,
          passed: false,
          error: (execErr && execErr.message) || "Runtime exception"
        });
        allPassed = false;
        continue;
      }

      var endTime = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
      var duration = endTime - startTime;
      var actualArr = Array.isArray(output) ? output : inputCopy;

      var isMatch = Array.isArray(actualArr) &&
        actualArr.length === tc.expected.length &&
        actualArr.every(function(val, idx) { return val === tc.expected[idx]; });

      if (!isMatch) {
        allPassed = false;
      }

      results.push({
        name: tc.name,
        input: tc.input,
        expected: tc.expected,
        actual: actualArr,
        passed: isMatch,
        executionTimeMs: Math.round(duration * 100) / 100
      });
    }

    self.postMessage({
      success: true,
      results: results,
      allPassed: allPassed
    });
  } catch (err) {
    self.postMessage({
      success: false,
      error: (err && err.message) || "Syntax or execution error in submitted code."
    });
  }
};
`;

/**
 * Handle execution in Node environment (for automated tests / tsx CLI)
 */
function executeInNodeWorker(
  payload: WorkerRequestPayload,
  timeoutMs: number
): Promise<WorkerExecutionResult> {
  return new Promise((resolve) => {
    let NodeWorker: any = null;
    try {
      // Use eval require to prevent Webpack from attempting to bundle node:worker_threads
      // eslint-disable-next-line no-eval
      const dynamicRequire = eval("require");
      NodeWorker = dynamicRequire("worker_threads").Worker;
    } catch {
      resolve({
        success: false,
        error: "Worker execution is not supported in this server environment.",
      });
      return;
    }

    const sanitizedCode = stripSimpleTsTypes(payload.code);

    const nodeWorkerScript = `
      const { parentPort } = require('worker_threads');
      parentPort.on('message', (data) => {
        const { code, algorithmId, testCases } = data;
        try {
          const wrappedCode = \`"use strict";
            \${code}
            if (typeof \${algorithmId}Sort === "function") { return \${algorithmId}Sort; }
            else if (typeof bubbleSort === "function") { return bubbleSort; }
            else if (typeof selectionSort === "function") { return selectionSort; }
            else if (typeof insertionSort === "function") { return insertionSort; }
            else if (typeof mergeSort === "function") { return mergeSort; }
            else if (typeof quickSort === "function") { return quickSort; }
            throw new Error("No sort function found. Please define function \${algorithmId}Sort(arr) { ... }");\`;

          const userSortFnFactory = new Function(wrappedCode);
          const userSortFn = userSortFnFactory();

          if (typeof userSortFn !== "function") {
            parentPort.postMessage({ success: false, error: "Expected a function definition for " + algorithmId + "Sort" });
            return;
          }

          const results = [];
          let allPassed = true;

          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const inputCopy = [...tc.input];
            const startTime = performance.now();

            let output;
            try {
              output = userSortFn(inputCopy);
            } catch (execErr) {
              results.push({
                name: tc.name,
                input: tc.input,
                expected: tc.expected,
                actual: null,
                passed: false,
                error: (execErr && execErr.message) || "Runtime exception"
              });
              allPassed = false;
              continue;
            }

            const duration = performance.now() - startTime;
            const actualArr = Array.isArray(output) ? output : inputCopy;

            const isMatch = Array.isArray(actualArr) &&
              actualArr.length === tc.expected.length &&
              actualArr.every((val, idx) => val === tc.expected[idx]);

            if (!isMatch) allPassed = false;

            results.push({
              name: tc.name,
              input: tc.input,
              expected: tc.expected,
              actual: actualArr,
              passed: isMatch,
              executionTimeMs: Math.round(duration * 100) / 100
            });
          }

          parentPort.postMessage({ success: true, results, allPassed });
        } catch (err) {
          parentPort.postMessage({
            success: false,
            error: (err && err.message) || "Syntax or execution error in submitted code."
          });
        }
      });
    `;

    let worker: any = null;
    let timer: NodeJS.Timeout | null = null;
    let isSettled = false;

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (worker) {
        worker.terminate().catch(() => {});
        worker = null;
      }
    };

    try {
      worker = new NodeWorker(nodeWorkerScript, { eval: true });

      timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          cleanup();
          resolve({
            success: false,
            error: `Execution timed out (${timeoutMs}ms limit exceeded). Check for infinite loops or non-terminating recursion.`,
          });
        }
      }, timeoutMs);

      worker.on("message", (res: WorkerExecutionResult) => {
        if (!isSettled) {
          isSettled = true;
          cleanup();
          resolve(res);
        }
      });

      worker.on("error", (err: any) => {
        if (!isSettled) {
          isSettled = true;
          cleanup();
          resolve({
            success: false,
            error: err?.message || "Worker thread execution error.",
          });
        }
      });

      worker.postMessage({
        ...payload,
        code: sanitizedCode,
      });
    } catch (initErr: any) {
      cleanup();
      resolve({
        success: false,
        error: initErr?.message || "Failed to initialize worker thread.",
      });
    }
  });
}

/**
 * Execute user-submitted code in a dedicated Web Worker with strict timeout.
 * Returns a Promise that resolves with the test results or error.
 */
export function executeCodeInWorker(
  payload: WorkerRequestPayload,
  timeoutMs: number = 1000,
  onWorkerInstance?: (worker: { terminate: () => void }) => void
): Promise<WorkerExecutionResult> {
  // If in Node.js environment (e.g. running tests with tsx)
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return executeInNodeWorker(payload, timeoutMs);
  }

  const sanitizedCode = stripSimpleTsTypes(payload.code);

  return new Promise((resolve) => {
    let worker: Worker | null = null;
    let blobUrl: string | null = null;
    let timer: NodeJS.Timeout | null = null;
    let isSettled = false;

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (worker) {
        worker.terminate();
        worker = null;
      }
      if (blobUrl) {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch {
          // ignore
        }
        blobUrl = null;
      }
    };

    try {
      const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
      blobUrl = URL.createObjectURL(blob);
      worker = new Worker(blobUrl);

      if (onWorkerInstance) {
        onWorkerInstance(worker);
      }

      // Strict Execution Timeout Guard
      timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          cleanup();
          resolve({
            success: false,
            error: `Execution timed out (${timeoutMs}ms limit exceeded). Check for infinite loops (e.g., while(true)) or non-terminating recursion.`,
          });
        }
      }, timeoutMs);

      // On Message Received from Worker
      worker.onmessage = (event: MessageEvent<WorkerExecutionResult>) => {
        if (!isSettled) {
          isSettled = true;
          cleanup();
          resolve(event.data);
        }
      };

      // On Worker Execution Error
      worker.onerror = (errorEvent: ErrorEvent) => {
        if (!isSettled) {
          isSettled = true;
          cleanup();
          resolve({
            success: false,
            error: errorEvent.message || "An unexpected error occurred inside the Web Worker.",
          });
        }
      };

      // Send payload to worker with sanitized code
      worker.postMessage({
        ...payload,
        code: sanitizedCode,
      });
    } catch (initErr: any) {
      cleanup();
      resolve({
        success: false,
        error: initErr?.message || "Failed to initialize Web Worker sandbox.",
      });
    }
  });
}
