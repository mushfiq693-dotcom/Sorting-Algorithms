/**
 * AlgoHub — Sliding Window Algorithmic Engine
 * Pure deterministic state machine supporting:
 * 1. Fixed-Size Window (Maximum Sum Subarray of size K)
 * 2. Dynamic-Size Window (Minimum Size Subarray with Sum >= S)
 * 3. Auxiliary Frequency Window (Longest Substring Without Repeating Characters)
 * 4. At-Most-K Condition Window (Max Consecutive Ones with at most K flips)
 */

export type SlidingWindowMode = "fixed" | "dynamic-sum" | "longest-unique" | "at-most-k";

export interface SlidingWindowStep {
  stepIndex: number;
  mode: SlidingWindowMode;
  array: (number | string)[];
  left: number;
  right: number;
  windowSize?: number;
  target?: number;
  windowSum?: number;
  bestSum?: number;
  minLen?: number;
  maxLen?: number;
  bestWindow?: [number, number];
  charFrequency?: Record<string, number>;
  zeroCount?: number;
  maxFlips?: number;
  highlightIndices: number[];
  windowIndices: number[];
  status:
    | "idle"
    | "expanding"
    | "contracting"
    | "sliding"
    | "condition-met"
    | "invalid-condition"
    | "completed";
  explanation: string;
  invariantNote: string;
}

export interface SlidingWindowPreset {
  id: string;
  name: string;
  mode: SlidingWindowMode;
  array: (number | string)[];
  windowSize?: number;
  target?: number;
  maxFlips?: number;
  description: string;
}

export const SLIDING_WINDOW_PRESETS: SlidingWindowPreset[] = [
  {
    id: "fixed-max-sum",
    name: "Fixed Window: Max Sum (K = 3)",
    mode: "fixed",
    array: [2, 1, 5, 1, 3, 2, 8, 4],
    windowSize: 3,
    description: "Slide a fixed window of size 3 across 8 elements. O(1) slide update avoids O(n·K) repeated additions.",
  },
  {
    id: "dynamic-min-len",
    name: "Dynamic Window: Min Subarray Sum >= 7",
    mode: "dynamic-sum",
    array: [2, 3, 1, 2, 4, 3, 1, 5],
    target: 7,
    description: "Expand R to satisfy sum >= 7, then contract L greedily to find the minimal contiguous subarray length.",
  },
  {
    id: "longest-no-repeat",
    name: "Frequency Window: Longest Unique Substring",
    mode: "longest-unique",
    array: ["p", "w", "w", "k", "e", "w", "a", "b"],
    description: "Expand R adding characters to frequency map. When a duplicate is detected, contract L past the duplicate.",
  },
  {
    id: "max-consecutive-ones",
    name: "At-Most-K: Max Consecutive Ones (K = 2)",
    mode: "at-most-k",
    array: [1, 1, 0, 0, 1, 1, 1, 0, 1, 1],
    maxFlips: 2,
    description: "Maintain a window with at most 2 zeros. When zeroCount > 2, contract L until the window becomes valid again.",
  },
];

export class SlidingWindowEngine {
  /**
   * Generates step-by-step state machine execution snapshots for any Sliding Window mode.
   */
  public static generateSteps(
    mode: SlidingWindowMode,
    inputArray: (number | string)[],
    options: {
      windowSize?: number;
      target?: number;
      maxFlips?: number;
    } = {}
  ): SlidingWindowStep[] {
    switch (mode) {
      case "fixed":
        return this.runFixedWindow(
          inputArray as number[],
          options.windowSize ?? 3
        );
      case "dynamic-sum":
        return this.runDynamicSum(
          inputArray as number[],
          options.target ?? 7
        );
      case "longest-unique":
        return this.runLongestUnique(inputArray.map(String));
      case "at-most-k":
        return this.runAtMostK(
          inputArray.map((v) => Number(v) || 0),
          options.maxFlips ?? 2
        );
      default:
        return [];
    }
  }

  /**
   * 1. Fixed-Size Window: Max Sum Subarray of size K
   */
  private static runFixedWindow(arr: number[], k: number): SlidingWindowStep[] {
    const steps: SlidingWindowStep[] = [];
    const n = arr.length;
    if (n === 0 || k <= 0 || k > n) return steps;

    let stepIndex = 0;
    let windowSum = 0;

    // Step 0: Initial state before window builds
    steps.push({
      stepIndex: stepIndex++,
      mode: "fixed",
      array: [...arr],
      left: 0,
      right: 0,
      windowSize: k,
      windowSum: 0,
      bestSum: -Infinity,
      highlightIndices: [],
      windowIndices: [],
      status: "idle",
      explanation: `Initializing fixed-size sliding window with K = ${k}. First, build initial window [0..${k - 1}].`,
      invariantNote: "Fixed-size invariant: Window length is strictly K after initial bootstrap.",
    });

    // Build the initial window
    for (let i = 0; i < k; i++) {
      windowSum += arr[i];
      const winIndices = Array.from({ length: i + 1 }, (_, idx) => idx);
      steps.push({
        stepIndex: stepIndex++,
        mode: "fixed",
        array: [...arr],
        left: 0,
        right: i,
        windowSize: k,
        windowSum,
        bestSum: i === k - 1 ? windowSum : -Infinity,
        bestWindow: i === k - 1 ? [0, k - 1] : undefined,
        highlightIndices: [i],
        windowIndices: winIndices,
        status: i === k - 1 ? "condition-met" : "expanding",
        explanation:
          i < k - 1
            ? `Bootstrapping: Included arr[${i}] = ${arr[i]}. Current accumulated sum = ${windowSum}.`
            : `Initial window [0..${k - 1}] complete! Initial sum = ${windowSum}. Recorded as current maximum.`,
        invariantNote: `Bootstrap invariant: Building elements 0 to ${k - 1}. Running sum = ${windowSum}.`,
      });
    }

    let maxSum = windowSum;
    let bestWindow: [number, number] = [0, k - 1];

    // Slide the window across the rest of the array
    for (let r = k; r < n; r++) {
      const l = r - k + 1;
      const leavingVal = arr[l - 1];
      const enteringVal = arr[r];

      // Step: Slide with delta update (subtract leaving, add entering)
      windowSum = windowSum - leavingVal + enteringVal;
      const isNewMax = windowSum > maxSum;
      if (isNewMax) {
        maxSum = windowSum;
        bestWindow = [l, r];
      }

      const winIndices = Array.from({ length: k }, (_, idx) => l + idx);

      steps.push({
        stepIndex: stepIndex++,
        mode: "fixed",
        array: [...arr],
        left: l,
        right: r,
        windowSize: k,
        windowSum,
        bestSum: maxSum,
        bestWindow,
        highlightIndices: [l - 1, r],
        windowIndices: winIndices,
        status: isNewMax ? "condition-met" : "sliding",
        explanation: `Slid window to [${l}..${r}]: Subtracted arr[${l - 1}] = ${leavingVal}, Added arr[${r}] = ${enteringVal}. New sum = ${windowSum}.${
          isNewMax ? ` 🌟 New maximum found: ${maxSum}!` : ` Max remains ${maxSum}.`
        }`,
        invariantNote: `O(1) Delta Update: sum = prevSum - arr[${l - 1}] + arr[${r}] = ${windowSum}.`,
      });
    }

    // Completion step
    steps.push({
      stepIndex: stepIndex++,
      mode: "fixed",
      array: [...arr],
      left: bestWindow[0],
      right: bestWindow[1],
      windowSize: k,
      windowSum: maxSum,
      bestSum: maxSum,
      bestWindow,
      highlightIndices: [],
      windowIndices: Array.from({ length: k }, (_, idx) => bestWindow[0] + idx),
      status: "completed",
      explanation: `Scan complete! Maximum sum subarray of size ${k} is [${bestWindow[0]}..${bestWindow[1]}] with sum = ${maxSum}. Total runtime O(n).`,
      invariantNote: "Complexity: O(n) time, O(1) auxiliary space. Exactly n - K + 1 window states evaluated.",
    });

    return steps;
  }

  /**
   * 2. Dynamic-Size Window: Min Size Subarray with Sum >= S
   */
  private static runDynamicSum(arr: number[], target: number): SlidingWindowStep[] {
    const steps: SlidingWindowStep[] = [];
    const n = arr.length;
    if (n === 0) return steps;

    let stepIndex = 0;
    let left = 0;
    let windowSum = 0;
    let minLen = Infinity;
    let bestWindow: [number, number] | undefined = undefined;

    steps.push({
      stepIndex: stepIndex++,
      mode: "dynamic-sum",
      array: [...arr],
      left: 0,
      right: -1,
      target,
      windowSum: 0,
      minLen: Infinity,
      highlightIndices: [],
      windowIndices: [],
      status: "idle",
      explanation: `Searching for the minimum length contiguous subarray with sum >= ${target}.`,
      invariantNote: "Dynamic invariant: Expand R while sum < target. Contract L greedily while sum >= target.",
    });

    for (let right = 0; right < n; right++) {
      windowSum += arr[right];

      let winIndices = Array.from({ length: right - left + 1 }, (_, idx) => left + idx);

      steps.push({
        stepIndex: stepIndex++,
        mode: "dynamic-sum",
        array: [...arr],
        left,
        right,
        target,
        windowSum,
        minLen: minLen === Infinity ? undefined : minLen,
        bestWindow,
        highlightIndices: [right],
        windowIndices: winIndices,
        status: windowSum >= target ? "condition-met" : "expanding",
        explanation: `Expanded R to index ${right} (arr[${right}] = ${arr[right]}). Window sum = ${windowSum} (${
          windowSum >= target ? `>= ${target} condition satisfied!` : `< ${target}, keep expanding`
        }).`,
        invariantNote: `Current window [${left}..${right}]: length = ${right - left + 1}, sum = ${windowSum}.`,
      });

      // Contract left pointer as long as window condition is satisfied
      while (windowSum >= target) {
        const currentLen = right - left + 1;
        if (currentLen < minLen) {
          minLen = currentLen;
          bestWindow = [left, right];
        }

        // Snapshot of condition met and testing contraction
        steps.push({
          stepIndex: stepIndex++,
          mode: "dynamic-sum",
          array: [...arr],
          left,
          right,
          target,
          windowSum,
          minLen,
          bestWindow,
          highlightIndices: [left],
          windowIndices: winIndices,
          status: "condition-met",
          explanation: `Window [${left}..${right}] satisfies sum (${windowSum} >= ${target}). Length = ${currentLen}.${
            currentLen === minLen ? ` ✨ New minimal length recorded: ${minLen}!` : ""
          } Contracting L to check if a smaller window works.`,
          invariantNote: `Optimal record invariant: best minimal length so far = ${minLen}.`,
        });

        // Remove arr[left] and slide left forward
        windowSum -= arr[left];
        left++;
        winIndices = Array.from({ length: Math.max(0, right - left + 1) }, (_, idx) => left + idx);

        steps.push({
          stepIndex: stepIndex++,
          mode: "dynamic-sum",
          array: [...arr],
          left,
          right,
          target,
          windowSum,
          minLen,
          bestWindow,
          highlightIndices: [left - 1],
          windowIndices: winIndices,
          status: "contracting",
          explanation: `Contracted L: Subtracted arr[${left - 1}] = ${arr[left - 1]}. New window sum = ${windowSum}.`,
          invariantNote: `Contracted window [${left}..${right}]: sum is now ${windowSum}.`,
        });
      }
    }

    // Final result
    steps.push({
      stepIndex: stepIndex++,
      mode: "dynamic-sum",
      array: [...arr],
      left: bestWindow ? bestWindow[0] : 0,
      right: bestWindow ? bestWindow[1] : 0,
      target,
      windowSum: bestWindow
        ? arr.slice(bestWindow[0], bestWindow[1] + 1).reduce((a, b) => a + b, 0)
        : 0,
      minLen: minLen === Infinity ? 0 : minLen,
      bestWindow,
      highlightIndices: [],
      windowIndices: bestWindow
        ? Array.from({ length: minLen }, (_, idx) => bestWindow[0] + idx)
        : [],
      status: "completed",
      explanation:
        minLen === Infinity
          ? `No valid subarray found with sum >= ${target}. Minimum length = 0.`
          : `Optimal window found: [${bestWindow![0]}..${bestWindow![1]}] with length ${minLen} and sum >= ${target}. Runtime O(n).`,
      invariantNote: "Two pointers each move at most n times -> Total time is strictly O(2n) = O(n).",
    });

    return steps;
  }

  /**
   * 3. Auxiliary Frequency Window: Longest Substring Without Repeating Characters
   */
  private static runLongestUnique(arr: string[]): SlidingWindowStep[] {
    const steps: SlidingWindowStep[] = [];
    const n = arr.length;
    if (n === 0) return steps;

    let stepIndex = 0;
    let left = 0;
    let maxLen = 0;
    let bestWindow: [number, number] = [0, 0];
    const lastSeenIndex: Record<string, number> = {};

    steps.push({
      stepIndex: stepIndex++,
      mode: "longest-unique",
      array: [...arr],
      left: 0,
      right: -1,
      maxLen: 0,
      charFrequency: {},
      highlightIndices: [],
      windowIndices: [],
      status: "idle",
      explanation: "Searching for the longest contiguous substring with all distinct characters.",
      invariantNote: "Map invariant: Hash table stores index of last occurrence of each character in O(1).",
    });

    for (let right = 0; right < n; right++) {
      const char = arr[right];

      // Check if character was previously seen inside the active window
      if (lastSeenIndex[char] !== undefined && lastSeenIndex[char] >= left) {
        const prevIdx = lastSeenIndex[char];
        steps.push({
          stepIndex: stepIndex++,
          mode: "longest-unique",
          array: [...arr],
          left,
          right,
          maxLen,
          bestWindow,
          charFrequency: { ...lastSeenIndex },
          highlightIndices: [prevIdx, right],
          windowIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          status: "invalid-condition",
          explanation: `Duplicate detected! Character '${char}' at index ${right} was already seen at index ${prevIdx} inside current window. Contracting L to ${prevIdx + 1}.`,
          invariantNote: `Window violation invariant: '${char}' appears twice in window. Hop L past ${prevIdx}.`,
        });

        left = prevIdx + 1;
      }

      lastSeenIndex[char] = right;
      const currentLen = right - left + 1;
      const isNewMax = currentLen > maxLen;
      if (isNewMax) {
        maxLen = currentLen;
        bestWindow = [left, right];
      }

      const winIndices = Array.from({ length: right - left + 1 }, (_, idx) => left + idx);

      steps.push({
        stepIndex: stepIndex++,
        mode: "longest-unique",
        array: [...arr],
        left,
        right,
        maxLen,
        bestWindow,
        charFrequency: { ...lastSeenIndex },
        highlightIndices: [right],
        windowIndices: winIndices,
        status: isNewMax ? "condition-met" : "expanding",
        explanation: `Valid window [${left}..${right}]: Substring "${arr.slice(left, right + 1).join("")}" has length ${currentLen}.${
          isNewMax ? ` 🌟 New maximum length: ${maxLen}!` : ` Max remains ${maxLen}.`
        }`,
        invariantNote: `Unique characters invariant: arr[${left}..${right}] contains zero duplicate characters.`,
      });
    }

    steps.push({
      stepIndex: stepIndex++,
      mode: "longest-unique",
      array: [...arr],
      left: bestWindow[0],
      right: bestWindow[1],
      maxLen,
      bestWindow,
      highlightIndices: [],
      windowIndices: Array.from({ length: maxLen }, (_, idx) => bestWindow[0] + idx),
      status: "completed",
      explanation: `Completed! Longest substring without duplicates is "${arr.slice(bestWindow[0], bestWindow[1] + 1).join("")}" with length ${maxLen}.`,
      invariantNote: "Complexity: O(n) time, O(min(m, n)) space where m is character alphabet size.",
    });

    return steps;
  }

  /**
   * 4. At-Most-K Condition Window: Max Consecutive Ones with at most K flips
   */
  private static runAtMostK(arr: number[], k: number): SlidingWindowStep[] {
    const steps: SlidingWindowStep[] = [];
    const n = arr.length;
    if (n === 0) return steps;

    let stepIndex = 0;
    let left = 0;
    let zeroCount = 0;
    let maxLen = 0;
    let bestWindow: [number, number] = [0, 0];

    steps.push({
      stepIndex: stepIndex++,
      mode: "at-most-k",
      array: [...arr],
      left: 0,
      right: -1,
      maxFlips: k,
      zeroCount: 0,
      maxLen: 0,
      highlightIndices: [],
      windowIndices: [],
      status: "idle",
      explanation: `Finding longest consecutive sequence of 1s allowing at most K = ${k} zeros to be flipped.`,
      invariantNote: `Constraint invariant: Maintain window with zeroCount <= ${k}.`,
    });

    for (let right = 0; right < n; right++) {
      if (arr[right] === 0) {
        zeroCount++;
      }

      let winIndices = Array.from({ length: right - left + 1 }, (_, idx) => left + idx);

      steps.push({
        stepIndex: stepIndex++,
        mode: "at-most-k",
        array: [...arr],
        left,
        right,
        maxFlips: k,
        zeroCount,
        maxLen,
        bestWindow,
        highlightIndices: [right],
        windowIndices: winIndices,
        status: zeroCount > k ? "invalid-condition" : "expanding",
        explanation: `Expanded R to index ${right} (val = ${arr[right]}). Total zeros in window = ${zeroCount} (${
          zeroCount > k ? `> ${k} limit exceeded!` : `<= ${k} allowed flips`
        }).`,
        invariantNote: `Window zeros: ${zeroCount} / ${k} allowed.`,
      });

      // Contract left pointer if zeroCount exceeds K
      while (zeroCount > k) {
        if (arr[left] === 0) {
          zeroCount--;
        }
        left++;
        winIndices = Array.from({ length: Math.max(0, right - left + 1) }, (_, idx) => left + idx);

        steps.push({
          stepIndex: stepIndex++,
          mode: "at-most-k",
          array: [...arr],
          left,
          right,
          maxFlips: k,
          zeroCount,
          maxLen,
          bestWindow,
          highlightIndices: [left - 1],
          windowIndices: winIndices,
          status: "contracting",
          explanation: `Contracted L to index ${left}. Zero count decreased to ${zeroCount}.`,
          invariantNote: `Contracted to restore invariant: zeroCount is now ${zeroCount}.`,
        });
      }

      const currentLen = right - left + 1;
      const isNewMax = currentLen > maxLen;
      if (isNewMax) {
        maxLen = currentLen;
        bestWindow = [left, right];
      }

      steps.push({
        stepIndex: stepIndex++,
        mode: "at-most-k",
        array: [...arr],
        left,
        right,
        maxFlips: k,
        zeroCount,
        maxLen,
        bestWindow,
        highlightIndices: [],
        windowIndices: winIndices,
        status: isNewMax ? "condition-met" : "expanding",
        explanation: `Window [${left}..${right}] is valid (zeros: ${zeroCount} <= ${k}). Length = ${currentLen}.${
          isNewMax ? ` 🌟 New maximum length: ${maxLen}!` : ""
        }`,
        invariantNote: `Active valid window of length ${currentLen} with ${zeroCount} flips.`,
      });
    }

    steps.push({
      stepIndex: stepIndex++,
      mode: "at-most-k",
      array: [...arr],
      left: bestWindow[0],
      right: bestWindow[1],
      maxFlips: k,
      zeroCount: arr.slice(bestWindow[0], bestWindow[1] + 1).filter((x) => x === 0).length,
      maxLen,
      bestWindow,
      highlightIndices: [],
      windowIndices: Array.from({ length: maxLen }, (_, idx) => bestWindow[0] + idx),
      status: "completed",
      explanation: `Finished! Maximum consecutive 1s with at most ${k} flips is ${maxLen} (window [${bestWindow[0]}..${bestWindow[1]}]).`,
      invariantNote: "Amortized complexity: O(n) time, O(1) extra space.",
    });

    return steps;
  }
}
