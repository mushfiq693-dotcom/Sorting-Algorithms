/**
 * AlgoHub — Binary Search Patterns Algorithmic Engine
 * Pure deterministic state machine supporting:
 * 1. Lower Bound & Upper Bound (Half-Open Range [L, R) Invariant)
 * 2. Search in Rotated Sorted Array (LeetCode 33 Inflection & Sorted Half Detection)
 * 3. Search On Answer / Monotonic Predicate Function (LeetCode 875 Koko Eating Bananas)
 * 4. Peak Element Gradient Climb (LeetCode 162)
 */

export type BinarySearchPatternMode =
  | "lower-upper-bound"
  | "rotated-array"
  | "search-on-answer"
  | "peak-element";

export interface BinarySearchPatternsStep {
  stepIndex: number;
  mode: BinarySearchPatternMode;

  array: number[];
  low: number;
  mid: number;
  high: number;
  target?: number;

  // Sub-pattern telemetry
  lowerBoundResult?: number;
  upperBoundResult?: number;
  foundIndex?: number;
  discardedIndices?: number[];
  activeIndices?: number[];

  // Rotated Array Specifics
  isLeftSorted?: boolean;
  isRightSorted?: boolean;

  // Search On Answer Specifics (Koko Bananas)
  piles?: number[];
  maxHours?: number;
  calculatedHours?: number;
  predicateResult?: boolean;
  speedCandidate?: number;

  status:
    | "idle"
    | "evaluating-mid"
    | "branching-left"
    | "branching-right"
    | "found"
    | "not-found"
    | "completed";
  explanation: string;
  formulaText: string;
  invariantNote: string;
}

export interface BinarySearchPatternPreset {
  id: string;
  name: string;
  mode: BinarySearchPatternMode;
  description: string;
  array?: number[];
  target?: number;
  piles?: number[];
  maxHours?: number;
}

export const BINARY_SEARCH_PATTERNS_PRESETS: BinarySearchPatternPreset[] = [
  {
    id: "bound-duplicates",
    name: "Lower & Upper Bound: [1, 2, 4, 4, 4, 6, 7, 9] (Target 4)",
    mode: "lower-upper-bound",
    array: [1, 2, 4, 4, 4, 6, 7, 9],
    target: 4,
    description: "Identifies first index ≥ 4 (Lower Bound = 2) and first index > 4 (Upper Bound = 5). Count = 5 - 2 = 3 elements.",
  },
  {
    id: "bound-missing",
    name: "Lower Bound Insertion Point: [1, 3, 5, 8, 10] (Target 6)",
    mode: "lower-upper-bound",
    array: [1, 3, 5, 8, 10],
    target: 6,
    description: "When target is absent, Lower Bound returns the exact zero-cost insertion index maintaining sorted monotonicity (index 3).",
  },
  {
    id: "rotated-pivot-left",
    name: "Rotated Array: [4, 5, 6, 7, 0, 1, 2] (Target 0)",
    mode: "rotated-array",
    array: [4, 5, 6, 7, 0, 1, 2],
    target: 0,
    description: "Rotated sorted array. At any mid, one half is strictly sorted. Eliminates entire halves in O(log n) time.",
  },
  {
    id: "rotated-pivot-right",
    name: "Rotated Array: [6, 7, 1, 2, 3, 4, 5] (Target 3)",
    mode: "rotated-array",
    array: [6, 7, 1, 2, 3, 4, 5],
    target: 3,
    description: "Left half [6, 7, 1] contains pivot inflection while right half [1..5] is sorted. Directs search rightward.",
  },
  {
    id: "koko-bananas-standard",
    name: "Search on Answer: Koko Bananas [3, 6, 7, 11] (H = 8)",
    mode: "search-on-answer",
    piles: [3, 6, 7, 11],
    maxHours: 8,
    description: "Search speed K ∈ [1, 11]. Monotonic predicate f(K) transitions [F, F, F, T, T...]. Finds minimal eating speed K = 4.",
  },
  {
    id: "peak-element-mountain",
    name: "Find Peak Element: [1, 2, 1, 3, 5, 6, 4]",
    mode: "peak-element",
    array: [1, 2, 1, 3, 5, 6, 4],
    description: "Unsorted array with local peaks. Follows positive slope A[mid] < A[mid+1] to locate peak in guaranteed O(log n) time.",
  },
];

export const BINARY_SEARCH_PATTERN_PRESETS = BINARY_SEARCH_PATTERNS_PRESETS;

export class BinarySearchPatternsEngine {
  /**
   * Generates step-by-step telemetry and visual snapshots for the chosen pattern.
   */
  public static generateSteps(config: {
    mode: BinarySearchPatternMode;
    array?: number[];
    target?: number;
    piles?: number[];
    maxHours?: number;
  }): BinarySearchPatternsStep[] {
    switch (config.mode) {
      case "lower-upper-bound":
        return this.generateBoundSteps(
          config.array ?? [1, 2, 4, 4, 4, 6, 7, 9],
          config.target ?? 4
        );
      case "rotated-array":
        return this.generateRotatedSteps(
          config.array ?? [4, 5, 6, 7, 0, 1, 2],
          config.target ?? 0
        );
      case "search-on-answer":
        return this.generateSearchOnAnswerSteps(
          config.piles ?? [3, 6, 7, 11],
          config.maxHours ?? 8
        );
      case "peak-element":
        return this.generatePeakElementSteps(
          config.array ?? [1, 2, 1, 3, 5, 6, 4]
        );
      default:
        return [];
    }
  }

  // ==========================================
  // 1. LOWER & UPPER BOUND STEPS
  // ==========================================
  public static generateBoundSteps(
    arr: number[],
    target: number
  ): BinarySearchPatternsStep[] {
    const steps: BinarySearchPatternsStep[] = [];
    const n = arr.length;

    // We demonstrate finding the Lower Bound (first index where A[i] >= target)
    let low = 0;
    let high = n; // Half-open [low, high)

    steps.push({
      stepIndex: 0,
      mode: "lower-upper-bound",
      array: [...arr],
      low: 0,
      mid: Math.floor((low + high) / 2),
      high: n,
      target,
      status: "idle",
      formulaText: "Lower Bound: First index where A[i] ≥ target",
      explanation: `Initializing Half-Open Interval [0, ${n}) for target = ${target}. Range has ${n} candidate elements.`,
      invariantNote: "Invariant: Lower bound answer is guaranteed to lie in [low, high]. In C++, std::lower_bound uses this exact convention.",
    });

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      const midVal = arr[mid];

      steps.push({
        stepIndex: steps.length,
        mode: "lower-upper-bound",
        array: [...arr],
        low,
        mid,
        high,
        target,
        status: "evaluating-mid",
        formulaText: `mid = ${low} + (${high} - ${low}) / 2 = ${mid} -> A[${mid}] = ${midVal}`,
        explanation: `Evaluating middle element A[${mid}] = ${midVal} against target ${target}.`,
        invariantNote: "mid calculation uses low + (high - low) / 2 to avoid 32-bit signed integer overflow.",
      });

      if (midVal >= target) {
        // mid is a valid candidate for lower bound; can we find an earlier one to the left?
        steps.push({
          stepIndex: steps.length,
          mode: "lower-upper-bound",
          array: [...arr],
          low,
          mid,
          high,
          target,
          status: "branching-left",
          formulaText: `A[${mid}] (${midVal}) ≥ ${target} -> high = ${mid}`,
          explanation: `A[${mid}] is ≥ ${target}. Element at index ${mid} is a valid candidate, so lower bound cannot be strictly to the right. High is pulled in to ${mid}.`,
          invariantNote: "Because mid might be the FIRST occurrence, we keep it in the search space by setting high = mid (half-open boundary).",
        });
        high = mid;
      } else {
        // mid is strictly < target; lower bound MUST be strictly to the right
        steps.push({
          stepIndex: steps.length,
          mode: "lower-upper-bound",
          array: [...arr],
          low,
          mid,
          high,
          target,
          status: "branching-right",
          formulaText: `A[${mid}] (${midVal}) < ${target} -> low = ${mid + 1}`,
          explanation: `A[${mid}] is < ${target}. Index ${mid} cannot possibly be ≥ target, so all elements ≤ mid are pruned. Low advances to ${mid + 1}.`,
          invariantNote: "Setting low = mid + 1 discards the entire left half because sorted monotonicity guarantees everything to the left is < target.",
        });
        low = mid + 1;
      }
    }

    const lowerBound = low;

    // Also calculate upper bound mathematically for equal_range telemetry
    let ubLow = 0;
    let ubHigh = n;
    while (ubLow < ubHigh) {
      const ubMid = ubLow + Math.floor((ubHigh - ubLow) / 2);
      if (arr[ubMid] > target) ubHigh = ubMid;
      else ubLow = ubMid + 1;
    }
    const upperBound = ubLow;
    const frequency = upperBound - lowerBound;

    steps.push({
      stepIndex: steps.length,
      mode: "lower-upper-bound",
      array: [...arr],
      low: lowerBound,
      mid: lowerBound,
      high: lowerBound,
      target,
      lowerBoundResult: lowerBound,
      upperBoundResult: upperBound,
      status: "completed",
      formulaText: `Lower Bound = ${lowerBound} (A[${lowerBound}] = ${arr[lowerBound] ?? "N/A"}), Upper Bound = ${upperBound}`,
      explanation: `Binary search converged at index ${lowerBound}. First element ≥ ${target} is at index ${lowerBound}. Upper bound (first > ${target}) is at index ${upperBound}. Total count of target = ${frequency}.`,
      invariantNote: "Time Complexity: O(log n) comparisons. Space: O(1). Handles duplicates and non-existent elements with zero edge-case branching.",
    });

    return steps;
  }

  // ==========================================
  // 2. SEARCH IN ROTATED SORTED ARRAY (LC 33)
  // ==========================================
  public static generateRotatedSteps(
    arr: number[],
    target: number
  ): BinarySearchPatternsStep[] {
    const steps: BinarySearchPatternsStep[] = [];
    const n = arr.length;
    let low = 0;
    let high = n - 1;
    let foundIdx = -1;

    steps.push({
      stepIndex: 0,
      mode: "rotated-array",
      array: [...arr],
      low,
      mid: Math.floor((low + high) / 2),
      high,
      target,
      status: "idle",
      formulaText: "Rotated Sorted Array: Find Target in O(log n)",
      explanation: `Array is sorted but rotated around an inflection point. Target = ${target}. Range [${low}..${high}].`,
      invariantNote: "Key Theorem: Dividing a rotated sorted array at ANY mid guarantees that at least ONE half is normally sorted!",
    });

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      const midVal = arr[mid];

      // Check if mid is the target
      if (midVal === target) {
        foundIdx = mid;
        steps.push({
          stepIndex: steps.length,
          mode: "rotated-array",
          array: [...arr],
          low,
          mid,
          high,
          target,
          foundIndex: mid,
          status: "found",
          formulaText: `Found! A[${mid}] == ${target}`,
          explanation: `Direct hit! Middle element A[${mid}] matches target ${target}. Target found at index ${mid}.`,
          invariantNote: "Fast path exit: O(1) comparison on match.",
        });
        break;
      }

      // Check which half is sorted
      const leftSorted = arr[low] <= midVal;
      const rightSorted = !leftSorted;

      steps.push({
        stepIndex: steps.length,
        mode: "rotated-array",
        array: [...arr],
        low,
        mid,
        high,
        target,
        isLeftSorted: leftSorted,
        isRightSorted: rightSorted,
        status: "evaluating-mid",
        formulaText: leftSorted
          ? `Left Half [${low}..${mid}] is SORTED (A[${low}] ≤ A[${mid}])`
          : `Right Half [${mid}..${high}] is SORTED (A[${mid}] < A[${low}])`,
        explanation: leftSorted
          ? `A[${low}] (${arr[low]}) ≤ A[${mid}] (${midVal}) confirms the left half [${low}..${mid}] is monotonically sorted. We can safely test if target is inside [${arr[low]}..${midVal}].`
          : `A[${low}] (${arr[low]}) > A[${mid}] (${midVal}) means the pivot is in the left half, so the right half [${mid}..${high}] is monotonically sorted.`,
        invariantNote: "Sorted half detection enables standard range containment check: target >= min && target <= max.",
      });

      if (leftSorted) {
        // Left half is sorted: check if target is inside left half
        if (target >= arr[low] && target < midVal) {
          steps.push({
            stepIndex: steps.length,
            mode: "rotated-array",
            array: [...arr],
            low,
            mid,
            high,
            target,
            status: "branching-left",
            formulaText: `${arr[low]} ≤ target (${target}) < ${midVal} -> Search Left [high = ${mid - 1}]`,
            explanation: `Target ${target} falls strictly within the sorted left interval [${arr[low]}..${midVal - 1}]. Discarding entire right half.`,
            invariantNote: "Pruning: Eliminates right half with absolute mathematical certainty.",
          });
          high = mid - 1;
        } else {
          steps.push({
            stepIndex: steps.length,
            mode: "rotated-array",
            array: [...arr],
            low,
            mid,
            high,
            target,
            status: "branching-right",
            formulaText: `Target (${target}) NOT in sorted left half -> Search Right [low = ${mid + 1}]`,
            explanation: `Target ${target} is outside [${arr[low]}..${midVal}]. It must reside in the right half. Low advances to ${mid + 1}.`,
            invariantNote: "Pruning: Eliminates left half because target cannot exist in [low..mid].",
          });
          low = mid + 1;
        }
      } else {
        // Right half is sorted: check if target is inside right half
        if (target > midVal && target <= arr[high]) {
          steps.push({
            stepIndex: steps.length,
            mode: "rotated-array",
            array: [...arr],
            low,
            mid,
            high,
            target,
            status: "branching-right",
            formulaText: `${midVal} < target (${target}) ≤ ${arr[high]} -> Search Right [low = ${mid + 1}]`,
            explanation: `Target ${target} falls strictly within the sorted right interval [${midVal + 1}..${arr[high]}]. Discarding entire left half.`,
            invariantNote: "Pruning: Eliminates left half in O(1) comparison.",
          });
          low = mid + 1;
        } else {
          steps.push({
            stepIndex: steps.length,
            mode: "rotated-array",
            array: [...arr],
            low,
            mid,
            high,
            target,
            status: "branching-left",
            formulaText: `Target (${target}) NOT in sorted right half -> Search Left [high = ${mid - 1}]`,
            explanation: `Target ${target} is outside [${midVal}..${arr[high]}]. It must reside in the left half. High retreats to ${mid - 1}.`,
            invariantNote: "Pruning: Eliminates right half.",
          });
          high = mid - 1;
        }
      }
    }

    steps.push({
      stepIndex: steps.length,
      mode: "rotated-array",
      array: [...arr],
      low,
      mid: Math.max(0, Math.min(low, n - 1)),
      high,
      target,
      foundIndex: foundIdx,
      status: foundIdx !== -1 ? "completed" : "not-found",
      formulaText: foundIdx !== -1 ? `Target Found at Index ${foundIdx}` : `Target ${target} Not Present (-1)`,
      explanation: foundIdx !== -1
        ? `Search complete! Located target ${target} at index ${foundIdx} in O(log n) time.`
        : `Search space exhausted. Target ${target} does not exist in the array. Return -1.`,
      invariantNote: "Strict O(log n) time complexity and O(1) auxiliary space without finding the pivot index first.",
    });

    return steps;
  }

  // ==========================================
  // 3. SEARCH ON ANSWER / PREDICATE (LC 875)
  // ==========================================
  public static generateSearchOnAnswerSteps(
    piles: number[],
    maxHours: number
  ): BinarySearchPatternsStep[] {
    const steps: BinarySearchPatternsStep[] = [];
    const maxPile = Math.max(...piles);

    // Koko's speed space: K in [1, maxPile]
    let low = 1;
    let high = maxPile;

    const dummyArr = Array.from({ length: maxPile }, (_, i) => i + 1);

    steps.push({
      stepIndex: 0,
      mode: "search-on-answer",
      array: dummyArr,
      low: 1,
      mid: Math.floor((1 + maxPile) / 2),
      high: maxPile,
      piles: [...piles],
      maxHours,
      status: "idle",
      formulaText: `Search Space: Speed K ∈ [1, ${maxPile}] bananas/hour`,
      explanation: `Piles: [${piles.join(", ")}]. Time limit: ${maxHours} hours. Search for minimal integer speed K such that total hours ≤ ${maxHours}.`,
      invariantNote: "Monotonic Predicate Theorem: If speed K is valid (f(K) = True), every speed > K is also valid. This monotonic boolean sequence [F, F, T, T, T] allows Binary Search on Answer!",
    });

    while (low < high) {
      const midSpeed = low + Math.floor((high - low) / 2);

      // Evaluate predicate: total hours to eat all piles at midSpeed
      let totalHours = 0;
      for (const pile of piles) {
        totalHours += Math.ceil(pile / midSpeed);
      }
      const canEat = totalHours <= maxHours;

      steps.push({
        stepIndex: steps.length,
        mode: "search-on-answer",
        array: dummyArr,
        low,
        mid: midSpeed,
        high,
        piles: [...piles],
        maxHours,
        calculatedHours: totalHours,
        predicateResult: canEat,
        speedCandidate: midSpeed,
        status: "evaluating-mid",
        formulaText: `Test Speed K = ${midSpeed} -> Total Hours = ${totalHours} (Limit: ${maxHours}h)`,
        explanation: `At speed ${midSpeed} bananas/hr, Koko needs ${totalHours} hours to finish all piles. Condition (${totalHours} ≤ ${maxHours}): ${canEat ? "PASS (Valid Speed)" : "FAIL (Too Slow)"}.`,
        invariantNote: `Predicate computation takes O(piles.length) = O(N) operations per candidate speed.`,
      });

      if (canEat) {
        // midSpeed works! Can she eat even slower (smaller K)?
        steps.push({
          stepIndex: steps.length,
          mode: "search-on-answer",
          array: dummyArr,
          low,
          mid: midSpeed,
          high,
          piles: [...piles],
          maxHours,
          calculatedHours: totalHours,
          predicateResult: true,
          speedCandidate: midSpeed,
          status: "branching-left",
          formulaText: `Speed ${midSpeed} works -> high = ${midSpeed} (Search for smaller speed)`,
          explanation: `Because speed ${midSpeed} succeeds within ${totalHours}h (≤ ${maxHours}h), ${midSpeed} is a valid candidate. Pull high in to ${midSpeed} to test if a smaller speed also works.`,
          invariantNote: "Keeping high = mid ensures we never discard a valid working candidate speed.",
        });
        high = midSpeed;
      } else {
        // midSpeed is too slow! She MUST eat faster (larger K)
        steps.push({
          stepIndex: steps.length,
          mode: "search-on-answer",
          array: dummyArr,
          low,
          mid: midSpeed,
          high,
          piles: [...piles],
          maxHours,
          calculatedHours: totalHours,
          predicateResult: false,
          speedCandidate: midSpeed,
          status: "branching-right",
          formulaText: `Speed ${midSpeed} exceeded limit (${totalHours}h > ${maxHours}h) -> low = ${midSpeed + 1}`,
          explanation: `Speed ${midSpeed} is too slow (${totalHours} hours required). Every speed ≤ ${midSpeed} will also fail. Advance low to ${midSpeed + 1}.`,
          invariantNote: "Monotonic pruning: Discards [low..midSpeed] completely because predicate is strictly monotonic.",
        });
        low = midSpeed + 1;
      }
    }

    const minSpeed = low;
    let finalHours = 0;
    for (const pile of piles) {
      finalHours += Math.ceil(pile / minSpeed);
    }

    steps.push({
      stepIndex: steps.length,
      mode: "search-on-answer",
      array: dummyArr,
      low: minSpeed,
      mid: minSpeed,
      high: minSpeed,
      piles: [...piles],
      maxHours,
      calculatedHours: finalHours,
      predicateResult: true,
      speedCandidate: minSpeed,
      status: "completed",
      formulaText: `Optimal Minimum Speed K = ${minSpeed} bananas/hr (${finalHours} hours)`,
      explanation: `Binary search converged on the boundary! Minimum speed Koko needs to finish within ${maxHours} hours is exactly ${minSpeed} bananas/hr.`,
      invariantNote: "Overall Complexity: O(N · log(max_pile)) time, O(1) space. Converts an exponential search into logarithmic speed.",
    });

    return steps;
  }

  // ==========================================
  // 4. FIND PEAK ELEMENT (LC 162)
  // ==========================================
  public static generatePeakElementSteps(
    arr: number[]
  ): BinarySearchPatternsStep[] {
    const steps: BinarySearchPatternsStep[] = [];
    const n = arr.length;
    let low = 0;
    let high = n - 1;

    steps.push({
      stepIndex: 0,
      mode: "peak-element",
      array: [...arr],
      low,
      mid: Math.floor((low + high) / 2),
      high,
      status: "idle",
      formulaText: "Find Peak Element in Unsorted Array: O(log n)",
      explanation: `An element is a peak if strictly greater than its neighbors. Given array [${arr.join(", ")}], locate any local peak in O(log n) time.`,
      invariantNote: "Gradient Ascent Invariant: If A[mid] < A[mid+1], the sequence is climbing uphill to the right. A peak is mathematically guaranteed to exist in [mid+1..high]!",
    });

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      const midVal = arr[mid];
      const rightVal = arr[mid + 1];

      steps.push({
        stepIndex: steps.length,
        mode: "peak-element",
        array: [...arr],
        low,
        mid,
        high,
        status: "evaluating-mid",
        formulaText: `Compare slope: A[${mid}] (${midVal}) vs A[${mid + 1}] (${rightVal})`,
        explanation: `Comparing middle element A[${mid}] (${midVal}) with its right neighbor A[${mid + 1}] (${rightVal}).`,
        invariantNote: "Comparing two adjacent elements reveals the local slope (ascending or descending).",
      });

      if (midVal < rightVal) {
        // Climbing uphill to the right: peak must exist to the right
        steps.push({
          stepIndex: steps.length,
          mode: "peak-element",
          array: [...arr],
          low,
          mid,
          high,
          status: "branching-right",
          formulaText: `A[${mid}] < A[${mid + 1}] (Uphill Slope) -> low = ${mid + 1}`,
          explanation: `Slope is rising to the right (${midVal} < ${rightVal}). Since boundaries are -∞, moving in the direction of the uphill slope guarantees encountering a peak. Advance low to ${mid + 1}.`,
          invariantNote: "Discards [low..mid] because rightward gradient guarantees a local maximum.",
        });
        low = mid + 1;
      } else {
        // Falling downhill to the right: mid itself might be a peak, or peak exists to the left
        steps.push({
          stepIndex: steps.length,
          mode: "peak-element",
          array: [...arr],
          low,
          mid,
          high,
          status: "branching-left",
          formulaText: `A[${mid}] ≥ A[${mid + 1}] (Downhill Slope) -> high = ${mid}`,
          explanation: `Slope is falling (${midVal} ≥ ${rightVal}). Index ${mid} itself could be the peak, or a peak exists in the left uphill direction. Pull high in to ${mid}.`,
          invariantNote: "Setting high = mid preserves mid as a potential peak candidate.",
        });
        high = mid;
      }
    }

    const peakIndex = low;
    steps.push({
      stepIndex: steps.length,
      mode: "peak-element",
      array: [...arr],
      low: peakIndex,
      mid: peakIndex,
      high: peakIndex,
      foundIndex: peakIndex,
      status: "completed",
      formulaText: `Peak Found at Index ${peakIndex}: A[${peakIndex}] = ${arr[peakIndex]}`,
      explanation: `Binary search converged at peak element A[${peakIndex}] = ${arr[peakIndex]}! Left neighbor is ${arr[peakIndex - 1] ?? "-∞"} and right neighbor is ${arr[peakIndex + 1] ?? "-∞"}.`,
      invariantNote: "Time Complexity: O(log n) on completely unsorted data! Proof that binary search works on gradient monotonicity, not just sorted arrays.",
    });

    return steps;
  }
}
