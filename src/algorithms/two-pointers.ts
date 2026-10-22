/**
 * AlgoHub — Two Pointers Algorithmic Engine
 * Pure deterministic state machine supporting:
 * 1. Opposite-Direction Converging Pointers (Sorted Two Sum: target pair search)
 * 2. Geometric Trapping (Container With Most Water: area maximization & pruning)
 * 3. Same-Direction Fast & Slow Pointers (Remove Duplicates in-place compaction)
 * 4. Symmetric Palindrome Verification (dual-end inward convergence)
 */

export type TwoPointersMode = "two-sum" | "container" | "fast-slow" | "palindrome";

export interface TwoPointerStep {
  stepIndex: number;
  mode: TwoPointersMode;
  array: number[];
  left: number;
  right: number;
  slow?: number;
  fast?: number;
  target?: number;
  currentSum?: number;
  currentArea?: number;
  maxArea?: number;
  maxAreaPair?: [number, number];
  uniqueCount?: number;
  highlightIndices: number[];
  eliminatedIndices: number[];
  status:
    | "idle"
    | "comparing"
    | "advancing-left"
    | "advancing-right"
    | "found"
    | "not-found"
    | "write-unique"
    | "skip-duplicate"
    | "mismatch"
    | "completed";
  explanation: string;
  invariantNote: string;
}

export interface TwoPointersPreset {
  id: string;
  name: string;
  mode: TwoPointersMode;
  array: number[];
  target?: number;
  description: string;
}

export const TWO_POINTERS_PRESETS: TwoPointersPreset[] = [
  {
    id: "sorted-two-sum",
    name: "Sorted Two Sum (Target: 14)",
    mode: "two-sum",
    array: [1, 2, 4, 6, 8, 11, 15],
    target: 14,
    description: "Find pair {6, 8} in O(n) time by monotonic sum elimination instead of O(n²) nested brute-force.",
  },
  {
    id: "container-water",
    name: "Container With Most Water",
    mode: "container",
    array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    description: "Maximize water area = (R - L) × min(h[L], h[R]). Shift shorter line inward to explore higher candidates.",
  },
  {
    id: "remove-duplicates",
    name: "Remove Duplicates (In-Place)",
    mode: "fast-slow",
    array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
    description: "Fast pointer scans ahead; slow pointer writes unique elements at O(1) auxiliary space.",
  },
  {
    id: "palindrome-check",
    name: "Palindrome Verification",
    mode: "palindrome",
    array: [1, 3, 5, 7, 5, 3, 1],
    description: "Verify symmetric reflection from outer boundaries converging toward the center axis.",
  },
];

export class TwoPointersEngine {
  /**
   * Mode 1: Sorted Two Sum
   * Precondition: Array must be sorted in ascending order.
   * Monotonic invariant:
   *   If arr[L] + arr[R] < target => All pairs with arr[L] are < target. Advance L (L++).
   *   If arr[L] + arr[R] > target => All pairs with arr[R] are > target. Decrement R (R--).
   */
  public static generateTwoSumSteps(initialArr: number[], target: number): TwoPointerStep[] {
    const arr = [...initialArr].sort((a, b) => a - b);
    const steps: TwoPointerStep[] = [];
    const eliminated: number[] = [];

    let left = 0;
    let right = arr.length - 1;
    let stepIndex = 0;

    steps.push({
      stepIndex: stepIndex++,
      mode: "two-sum",
      array: [...arr],
      left,
      right,
      target,
      currentSum: arr[left] + arr[right],
      highlightIndices: [left, right],
      eliminatedIndices: [...eliminated],
      status: "idle",
      explanation: `Initialized Two Sum pointers at boundaries: Left=[${left}] (${arr[left]}), Right=[${right}] (${arr[right]}). Target = ${target}.`,
      invariantNote: "Monotonicity Invariant: Array is sorted. Sum will increase if Left moves right, decrease if Right moves left.",
    });

    while (left < right) {
      const sum = arr[left] + arr[right];

      // Comparison step
      steps.push({
        stepIndex: stepIndex++,
        mode: "two-sum",
        array: [...arr],
        left,
        right,
        target,
        currentSum: sum,
        highlightIndices: [left, right],
        eliminatedIndices: [...eliminated],
        status: "comparing",
        explanation: `Comparing pair arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum} against Target ${target}.`,
        invariantNote:
          sum === target
            ? `Target match found: ${arr[left]} + ${arr[right]} === ${target}!`
            : sum < target
            ? `Sum (${sum}) < Target (${target}): We need a LARGER sum. All pairs with arr[${left}] are strictly < ${target}.`
            : `Sum (${sum}) > Target (${target}): We need a SMALLER sum. All pairs with arr[${right}] are strictly > ${target}.`,
      });

      if (sum === target) {
        steps.push({
          stepIndex: stepIndex++,
          mode: "two-sum",
          array: [...arr],
          left,
          right,
          target,
          currentSum: sum,
          highlightIndices: [left, right],
          eliminatedIndices: [...eliminated],
          status: "found",
          explanation: `🎯 MATCH FOUND! Indices [${left}, ${right}] with values (${arr[left]}, ${arr[right]}) sum exactly to ${target}.`,
          invariantNote: "Search space successfully reduced in O(n) single pass with zero auxiliary allocation.",
        });
        return steps;
      }

      if (sum < target) {
        eliminated.push(left);
        steps.push({
          stepIndex: stepIndex++,
          mode: "two-sum",
          array: [...arr],
          left,
          right,
          target,
          currentSum: sum,
          highlightIndices: [left, right],
          eliminatedIndices: [...eliminated],
          status: "advancing-left",
          explanation: `Sum ${sum} is too small. Eliminating index ${left} (${arr[left]}). Advancing Left: ${left} → ${left + 1}.`,
          invariantNote: `Pruning proof: Since array is sorted, arr[${left}] + any element <= arr[${right}] is strictly < ${target}.`,
        });
        left++;
      } else {
        eliminated.push(right);
        steps.push({
          stepIndex: stepIndex++,
          mode: "two-sum",
          array: [...arr],
          left,
          right,
          target,
          currentSum: sum,
          highlightIndices: [left, right],
          eliminatedIndices: [...eliminated],
          status: "advancing-right",
          explanation: `Sum ${sum} is too large. Eliminating index ${right} (${arr[right]}). Decrementing Right: ${right} → ${right - 1}.`,
          invariantNote: `Pruning proof: Since array is sorted, arr[${right}] + any element >= arr[${left}] is strictly > ${target}.`,
        });
        right--;
      }
    }

    steps.push({
      stepIndex: stepIndex++,
      mode: "two-sum",
      array: [...arr],
      left,
      right,
      target,
      highlightIndices: [],
      eliminatedIndices: [...eliminated],
      status: "not-found",
      explanation: `Pointers crossed without finding any pair summing to ${target}.`,
      invariantNote: "Complete O(n) search space exhausted without finding a matching target pair.",
    });

    return steps;
  }

  /**
   * Mode 2: Container With Most Water (LeetCode 11)
   * Formula: Area = (R - L) * min(arr[L], arr[R])
   * Pruning proof: Moving the taller line inward shrinks width without increasing min height (which is capped by shorter).
   * Therefore, we MUST advance the SHORTER pointer inward to have any chance of finding a larger area.
   */
  public static generateContainerSteps(heights: number[]): TwoPointerStep[] {
    const arr = [...heights];
    const steps: TwoPointerStep[] = [];
    const eliminated: number[] = [];

    let left = 0;
    let right = arr.length - 1;
    let maxArea = 0;
    let bestPair: [number, number] = [left, right];
    let stepIndex = 0;

    steps.push({
      stepIndex: stepIndex++,
      mode: "container",
      array: [...arr],
      left,
      right,
      currentArea: (right - left) * Math.min(arr[left], arr[right]),
      maxArea: 0,
      maxAreaPair: [left, right],
      highlightIndices: [left, right],
      eliminatedIndices: [],
      status: "idle",
      explanation: `Initialized Container boundaries at Left=[${left}] (h=${arr[left]}), Right=[${right}] (h=${arr[right]}).`,
      invariantNote: "Area Theorem: Area = Width × min(Height_L, Height_R). Always move the shorter boundary inward.",
    });

    while (left < right) {
      const width = right - left;
      const minHeight = Math.min(arr[left], arr[right]);
      const area = width * minHeight;

      const isNewMax = area > maxArea;
      if (isNewMax) {
        maxArea = area;
        bestPair = [left, right];
      }

      steps.push({
        stepIndex: stepIndex++,
        mode: "container",
        array: [...arr],
        left,
        right,
        currentArea: area,
        maxArea,
        maxAreaPair: [...bestPair],
        highlightIndices: [left, right],
        eliminatedIndices: [...eliminated],
        status: isNewMax ? "found" : "comparing",
        explanation: `Width: ${width}, Limiting Height: min(${arr[left]}, ${arr[right]}) = ${minHeight}. Area = ${area}.${
          isNewMax ? ` 🏆 NEW RECORD AREA: ${maxArea}!` : ` Current Max remains ${maxArea}.`
        }`,
        invariantNote:
          arr[left] <= arr[right]
            ? `Left bar (${arr[left]}) <= Right bar (${arr[right]}). Advancing Left pointer inward.`
            : `Right bar (${arr[right]}) < Left bar (${arr[left]}). Advancing Right pointer inward.`,
      });

      if (arr[left] <= arr[right]) {
        eliminated.push(left);
        steps.push({
          stepIndex: stepIndex++,
          mode: "container",
          array: [...arr],
          left,
          right,
          currentArea: area,
          maxArea,
          maxAreaPair: [...bestPair],
          highlightIndices: [left, right],
          eliminatedIndices: [...eliminated],
          status: "advancing-left",
          explanation: `Eliminating shorter boundary at index ${left} (height ${arr[left]}). Incrementing Left → ${left + 1}.`,
          invariantNote: "Pruning proof: Keeping the shorter line and moving right inward would only reduce width without height gain.",
        });
        left++;
      } else {
        eliminated.push(right);
        steps.push({
          stepIndex: stepIndex++,
          mode: "container",
          array: [...arr],
          left,
          right,
          currentArea: area,
          maxArea,
          maxAreaPair: [...bestPair],
          highlightIndices: [left, right],
          eliminatedIndices: [...eliminated],
          status: "advancing-right",
          explanation: `Eliminating shorter boundary at index ${right} (height ${arr[right]}). Decrementing Right → ${right - 1}.`,
          invariantNote: "Pruning proof: Keeping the shorter line and moving left inward would only reduce width without height gain.",
        });
        right--;
      }
    }

    steps.push({
      stepIndex: stepIndex++,
      mode: "container",
      array: [...arr],
      left: bestPair[0],
      right: bestPair[1],
      currentArea: maxArea,
      maxArea,
      maxAreaPair: [...bestPair],
      highlightIndices: [bestPair[0], bestPair[1]],
      eliminatedIndices: [...eliminated],
      status: "completed",
      explanation: `Container search complete. Maximum trapped water is ${maxArea} between lines [${bestPair[0]}] and [${bestPair[1]}].`,
      invariantNote: "Optimal O(n) time complexity achieved by eliminating n-1 impossible candidate configurations.",
    });

    return steps;
  }

  /**
   * Mode 3: Remove Duplicates from Sorted Array (Fast & Slow Pointers)
   * Slow pointer = writer (tracks end of unique prefix)
   * Fast pointer = reader (scans unexplored elements)
   */
  public static generateFastSlowSteps(initialArr: number[]): TwoPointerStep[] {
    const arr = [...initialArr].sort((a, b) => a - b);
    const steps: TwoPointerStep[] = [];

    if (arr.length === 0) return steps;

    let slow = 0;
    let fast = 1;
    let stepIndex = 0;

    steps.push({
      stepIndex: stepIndex++,
      mode: "fast-slow",
      array: [...arr],
      left: slow,
      right: fast,
      slow,
      fast,
      uniqueCount: 1,
      highlightIndices: [slow, fast],
      eliminatedIndices: [],
      status: "idle",
      explanation: `Initialized Reader/Writer pointers: Slow (Writer)=[${slow}], Fast (Reader)=[${fast}]. First element is unique.`,
      invariantNote: "Prefix invariant: arr[0...slow] contains strictly unique elements sorted in non-decreasing order.",
    });

    while (fast < arr.length) {
      const isDuplicate = arr[fast] === arr[slow];

      steps.push({
        stepIndex: stepIndex++,
        mode: "fast-slow",
        array: [...arr],
        left: slow,
        right: fast,
        slow,
        fast,
        uniqueCount: slow + 1,
        highlightIndices: [slow, fast],
        eliminatedIndices: [],
        status: isDuplicate ? "skip-duplicate" : "comparing",
        explanation: isDuplicate
          ? `Duplicate detected: arr[${fast}] (${arr[fast]}) === arr[${slow}] (${arr[slow]}). Skip duplicate.`
          : `New unique value: arr[${fast}] (${arr[fast]}) !== arr[${slow}] (${arr[slow]}). Advance writer and overwrite.`,
        invariantNote: isDuplicate
          ? "Fast pointer increments to scan next element while slow pointer holds the unique boundary."
          : `arr[${slow + 1}] will be updated to store ${arr[fast]} at the next unique slot.`,
      });

      if (!isDuplicate) {
        slow++;
        arr[slow] = arr[fast];

        steps.push({
          stepIndex: stepIndex++,
          mode: "fast-slow",
          array: [...arr],
          left: slow,
          right: fast,
          slow,
          fast,
          uniqueCount: slow + 1,
          highlightIndices: [slow],
          eliminatedIndices: [],
          status: "write-unique",
          explanation: `Wrote unique value ${arr[slow]} to index [${slow}]. Unique prefix length is now ${slow + 1}.`,
          invariantNote: "In-place compaction maintains O(1) auxiliary space without creating duplicate arrays.",
        });
      }

      fast++;
    }

    steps.push({
      stepIndex: stepIndex++,
      mode: "fast-slow",
      array: [...arr],
      left: 0,
      right: slow,
      slow,
      fast: arr.length,
      uniqueCount: slow + 1,
      highlightIndices: Array.from({ length: slow + 1 }, (_, i) => i),
      eliminatedIndices: Array.from({ length: arr.length - (slow + 1) }, (_, i) => i + slow + 1),
      status: "completed",
      explanation: `Compaction complete! Array has ${slow + 1} unique elements in prefix arr[0...${slow}].`,
      invariantNote: "Time: O(n) single scan. Auxiliary Space: O(1) strictly in-place modification.",
    });

    return steps;
  }

  /**
   * Mode 4: Palindrome Symmetric Inward Scan
   */
  public static generatePalindromeSteps(initialArr: number[]): TwoPointerStep[] {
    const arr = [...initialArr];
    const steps: TwoPointerStep[] = [];
    const verified: number[] = [];

    let left = 0;
    let right = arr.length - 1;
    let stepIndex = 0;

    steps.push({
      stepIndex: stepIndex++,
      mode: "palindrome",
      array: [...arr],
      left,
      right,
      highlightIndices: [left, right],
      eliminatedIndices: [],
      status: "idle",
      explanation: `Starting palindrome symmetry test at Left=[${left}] (${arr[left]}) and Right=[${right}] (${arr[right]}).`,
      invariantNote: "Symmetry Invariant: arr[i] must equal arr[n - 1 - i] for all i up to floor(n/2).",
    });

    while (left < right) {
      const isMatch = arr[left] === arr[right];

      steps.push({
        stepIndex: stepIndex++,
        mode: "palindrome",
        array: [...arr],
        left,
        right,
        highlightIndices: [left, right],
        eliminatedIndices: [...verified],
        status: isMatch ? "comparing" : "mismatch",
        explanation: isMatch
          ? `Match verified: arr[${left}] (${arr[left]}) === arr[${right}] (${arr[right]}). Converging inward.`
          : `MISMATCH: arr[${left}] (${arr[left]}) !== arr[${right}] (${arr[right]}). Not a palindrome!`,
        invariantNote: isMatch
          ? "Both outer boundaries mirror each other. Move Left++ and Right-- inward."
          : "Single inequality violates the mirror symmetry property. Early termination.",
      });

      if (!isMatch) {
        steps.push({
          stepIndex: stepIndex++,
          mode: "palindrome",
          array: [...arr],
          left,
          right,
          highlightIndices: [left, right],
          eliminatedIndices: [...verified],
          status: "not-found",
          explanation: `❌ Array is NOT a palindrome due to asymmetry at indices ${left} and ${right}.`,
          invariantNote: "Terminated in early O(k) steps where k is first asymmetry index.",
        });
        return steps;
      }

      verified.push(left, right);
      left++;
      right--;
    }

    steps.push({
      stepIndex: stepIndex++,
      mode: "palindrome",
      array: [...arr],
      left,
      right,
      highlightIndices: Array.from({ length: arr.length }, (_, i) => i),
      eliminatedIndices: [],
      status: "completed",
      explanation: `✅ Array is a valid symmetric palindrome! All corresponding mirrored pairs match.`,
      invariantNote: "Verified in O(n/2) = O(n) time with O(1) auxiliary pointer memory.",
    });

    return steps;
  }
}
