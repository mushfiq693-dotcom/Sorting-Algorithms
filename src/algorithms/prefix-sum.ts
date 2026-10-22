/**
 * AlgoHub — Prefix Sum & Difference Arrays Algorithmic Engine
 * Pure deterministic state machine supporting:
 * 1. 1D Range Query: P[i] = P[i-1] + A[i-1], query(L, R) = P[R+1] - P[L] in O(1)
 * 2. 2D Matrix Prefix Sum: Inclusion-Exclusion subgrid queries in O(1)
 * 3. Difference Array: Range updates [L, R] += val in O(1) + Prefix reconstruction in O(n)
 * 4. Subarray Sum Equals K (Hash Prefix): Running prefix sum with frequency hash table (LC 560)
 */

export type PrefixSumMode = "1d-range-query" | "2d-range-query" | "difference-array" | "hash-prefix";

export interface RangeUpdate {
  l: number;
  r: number;
  val: number;
}

export interface InclusionExclusionTerms {
  bottomRight: { r: number; c: number; val: number };
  topRegion?: { r: number; c: number; val: number };
  leftRegion?: { r: number; c: number; val: number };
  topLeftOverlap?: { r: number; c: number; val: number };
  formulaString: string;
}

export interface PrefixSumStep {
  stepIndex: number;
  mode: PrefixSumMode;

  // 1D Mode Fields
  array1D?: number[];
  prefix1D?: number[];
  queryL?: number;
  queryR?: number;
  computedSum?: number;
  highlightIndices1D?: number[];
  prefixHighlightIndices?: { index: number; role: "positive" | "negative" | "active" }[];

  // 2D Mode Fields
  grid2D?: number[][];
  prefix2D?: number[][];
  queryR1?: number;
  queryC1?: number;
  queryR2?: number;
  queryC2?: number;
  subgridSum?: number;
  highlightCells2D?: { r: number; c: number }[];
  prefixHighlightCells2D?: { r: number; c: number; role: "positive" | "negative" | "overlap" | "active" }[];
  inclusionExclusion?: InclusionExclusionTerms;

  // Difference Array Mode Fields
  diffArray?: number[];
  reconstructedArray?: number[];
  updates?: RangeUpdate[];
  activeUpdateIndex?: number;
  diffHighlightIndices?: { index: number; role: "add" | "subtract" | "carry" }[];

  // Hash Prefix Mode Fields (LC 560)
  targetK?: number;
  currentIndex?: number;
  currentPrefixSum?: number;
  neededPrefixSum?: number;
  prefixHashMap?: Record<number, number>;
  totalSubarraysCount?: number;
  matchingSubarrays?: [number, number][];

  status:
    | "idle"
    | "building"
    | "querying"
    | "updating"
    | "reconstructing"
    | "searching"
    | "completed";
  formulaText: string;
  explanation: string;
  invariantNote: string;
}

export interface PrefixSumPreset {
  id: string;
  name: string;
  mode: PrefixSumMode;
  description: string;
  array1D?: number[];
  queryL?: number;
  queryR?: number;
  grid2D?: number[][];
  queryR1?: number;
  queryC1?: number;
  queryR2?: number;
  queryC2?: number;
  updates?: RangeUpdate[];
  targetK?: number;
}

export const PREFIX_SUM_PRESETS: PrefixSumPreset[] = [
  {
    id: "1d-metric-stream",
    name: "1D: Metric Stream [3, 1, 4, 1, 5, 9, 2, 6]",
    mode: "1d-range-query",
    array1D: [3, 1, 4, 1, 5, 9, 2, 6],
    queryL: 2,
    queryR: 5,
    description: "Standard 1D prefix sum array with 1-based indexing. Query sum(2, 5) computes P[6] - P[2] in O(1) time.",
  },
  {
    id: "1d-cashflow",
    name: "1D: Financial Cashflow [12, -4, 8, 15, -7, 20, 6, -3]",
    mode: "1d-range-query",
    array1D: [12, -4, 8, 15, -7, 20, 6, -3],
    queryL: 1,
    queryR: 4,
    description: "Mixed positive and negative integers demonstrating that prefix subtraction holds universally without monotonicity constraints.",
  },
  {
    id: "2d-heatmap-grid",
    name: "2D: 4x4 Pixel Intensity Heatmap",
    mode: "2d-range-query",
    grid2D: [
      [2, 1, 4, 3],
      [1, 3, 2, 4],
      [5, 2, 1, 3],
      [3, 4, 2, 1],
    ],
    queryR1: 1,
    queryC1: 1,
    queryR2: 2,
    queryC2: 2,
    description: "Query rectangle (1,1) to (2,2) using the 4-term Inclusion-Exclusion Principle formula.",
  },
  {
    id: "2d-terrain-elevation",
    name: "2D: 4x4 Terrain Matrix",
    mode: "2d-range-query",
    grid2D: [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ],
    queryR1: 0,
    queryC1: 2,
    queryR2: 3,
    queryC2: 3,
    description: "Subgrid sum from row 0 to 3, column 2 to 3, computed in strictly 4 operations regardless of rectangle dimensions.",
  },
  {
    id: "diff-flight-booking",
    name: "Difference Array: Flight Bookings (3 Batch Updates)",
    mode: "difference-array",
    array1D: [0, 0, 0, 0, 0, 0, 0, 0],
    updates: [
      { l: 1, r: 4, val: 10 },
      { l: 2, r: 6, val: 5 },
      { l: 3, r: 5, val: -3 },
    ],
    description: "Applies 3 range updates in O(1) each via D[L] += val, D[R+1] -= val, then reconstructs the final seating loads in O(n).",
  },
  {
    id: "hash-subarray-k",
    name: "Subarray Sum Equals K (LC 560): K = 7",
    mode: "hash-prefix",
    array1D: [3, 4, 7, 2, -3, 1, 4, 2],
    targetK: 7,
    description: "Maintains a running prefix sum and hash map of prefix frequencies. At each step, checks if (currentSum - 7) was seen before.",
  },
  {
    id: "hash-zero-sum",
    name: "Subarray Sum Equals K: Zero-Sum Balance (K = 0)",
    mode: "hash-prefix",
    array1D: [1, -1, 2, -2, 3, -3, 1, -1],
    targetK: 0,
    description: "Detects all contiguous zero-sum balance intervals in linear O(n) time using the running prefix frequency dictionary.",
  },
];

export class PrefixSumEngine {
  /**
   * Generates step-by-step telemetry and visual snapshots for the chosen mode.
   */
  public static generateSteps(config: {
    mode: PrefixSumMode;
    array1D?: number[];
    queryL?: number;
    queryR?: number;
    grid2D?: number[][];
    queryR1?: number;
    queryC1?: number;
    queryR2?: number;
    queryC2?: number;
    updates?: RangeUpdate[];
    targetK?: number;
  }): PrefixSumStep[] {
    switch (config.mode) {
      case "1d-range-query":
        return this.generate1DSteps(
          config.array1D ?? [3, 1, 4, 1, 5, 9, 2, 6],
          config.queryL ?? 2,
          config.queryR ?? 5
        );
      case "2d-range-query":
        return this.generate2DSteps(
          config.grid2D ?? [
            [2, 1, 4, 3],
            [1, 3, 2, 4],
            [5, 2, 1, 3],
            [3, 4, 2, 1],
          ],
          config.queryR1 ?? 1,
          config.queryC1 ?? 1,
          config.queryR2 ?? 2,
          config.queryC2 ?? 2
        );
      case "difference-array":
        return this.generateDifferenceSteps(
          config.array1D ?? [0, 0, 0, 0, 0, 0, 0, 0],
          config.updates ?? [
            { l: 1, r: 4, val: 10 },
            { l: 2, r: 6, val: 5 },
            { l: 3, r: 5, val: -3 },
          ]
        );
      case "hash-prefix":
        return this.generateHashPrefixSteps(
          config.array1D ?? [3, 4, 7, 2, -3, 1, 4, 2],
          config.targetK ?? 7
        );
      default:
        return [];
    }
  }

  // ==========================================
  // 1D PREFIX SUM STEPS
  // ==========================================
  private static generate1DSteps(
    arr: number[],
    qL: number,
    qR: number
  ): PrefixSumStep[] {
    const steps: PrefixSumStep[] = [];
    const n = arr.length;
    const clampedL = Math.max(0, Math.min(qL, n - 1));
    const clampedR = Math.max(clampedL, Math.min(qR, n - 1));

    // Construct 1-based prefix sum array: length n + 1
    const prefix: number[] = [0];

    // Initial Step
    steps.push({
      stepIndex: 0,
      mode: "1d-range-query",
      array1D: [...arr],
      prefix1D: [0],
      queryL: clampedL,
      queryR: clampedR,
      status: "idle",
      formulaText: "P[0] = 0 (Base case for 1-based prefix indexing)",
      explanation: "Initialize prefix sum array P with size N+1. Setting P[0] = 0 avoids out-of-bounds checks when querying intervals starting at index 0.",
      invariantNote: "Invariant: P[i] represents the exact cumulative sum of the first i elements: A[0] + ... + A[i-1].",
    });

    // Step-by-step construction of P
    for (let i = 0; i < n; i++) {
      const prevSum = prefix[i];
      const currentVal = arr[i];
      const newSum = prevSum + currentVal;
      prefix.push(newSum);

      steps.push({
        stepIndex: steps.length,
        mode: "1d-range-query",
        array1D: [...arr],
        prefix1D: [...prefix],
        queryL: clampedL,
        queryR: clampedR,
        highlightIndices1D: [i],
        prefixHighlightIndices: [
          { index: i, role: "active" },
          { index: i + 1, role: "positive" },
        ],
        status: "building",
        formulaText: `P[${i + 1}] = P[${i}] + A[${i}] = ${prevSum} + ${currentVal} = ${newSum}`,
        explanation: `Building prefix array at index ${i + 1}: Add element A[${i}] (${currentVal}) to preceding cumulative sum P[${i}] (${prevSum}).`,
        invariantNote: `Precomputation cost: O(N) linear time and O(N) auxiliary space. Prepares array for instant O(1) queries.`,
      });
    }

    // Now execute range query [clampedL, clampedR]
    const pRightPlusOne = prefix[clampedR + 1];
    const pLeft = prefix[clampedL];
    const sumResult = pRightPlusOne - pLeft;

    const queryIndices: number[] = [];
    for (let k = clampedL; k <= clampedR; k++) {
      queryIndices.push(k);
    }

    steps.push({
      stepIndex: steps.length,
      mode: "1d-range-query",
      array1D: [...arr],
      prefix1D: [...prefix],
      queryL: clampedL,
      queryR: clampedR,
      computedSum: sumResult,
      highlightIndices1D: queryIndices,
      prefixHighlightIndices: [
        { index: clampedR + 1, role: "positive" },
        { index: clampedL, role: "negative" },
      ],
      status: "querying",
      formulaText: `sum(${clampedL}, ${clampedR}) = P[${clampedR + 1}] - P[${clampedL}] = ${pRightPlusOne} - ${pLeft} = ${sumResult}`,
      explanation: `Range query [${clampedL}, ${clampedR}]: Take cumulative sum up to R (${pRightPlusOne} at P[${clampedR + 1}]) and subtract prefix sum before L (${pLeft} at P[${clampedL}]).`,
      invariantNote: `Instant O(1) evaluation! No matter how large the subarray (even N = 10⁷), exactly 1 arithmetic subtraction yields the exact answer.`,
    });

    steps.push({
      stepIndex: steps.length,
      mode: "1d-range-query",
      array1D: [...arr],
      prefix1D: [...prefix],
      queryL: clampedL,
      queryR: clampedR,
      computedSum: sumResult,
      highlightIndices1D: queryIndices,
      prefixHighlightIndices: [
        { index: clampedR + 1, role: "positive" },
        { index: clampedL, role: "negative" },
      ],
      status: "completed",
      formulaText: `Target Range Sum = ${sumResult} (Computed in O(1))`,
      explanation: `Query completed! Elements [${queryIndices.map((idx) => arr[idx]).join(" + ")}] = ${sumResult}. Prefix array remains immutable and ready for subsequent queries.`,
      invariantNote: `Total Complexity: O(N) precomputation once, O(1) per query for Q queries → O(N + Q) vs Naive O(N · Q).`,
    });

    return steps;
  }

  // ==========================================
  // 2D MATRIX PREFIX SUM STEPS
  // ==========================================
  private static generate2DSteps(
    grid: number[][],
    r1: number,
    c1: number,
    r2: number,
    c2: number
  ): PrefixSumStep[] {
    const steps: PrefixSumStep[] = [];
    const rows = grid.length;
    const cols = grid[0].length;

    const clampedR1 = Math.max(0, Math.min(r1, rows - 1));
    const clampedC1 = Math.max(0, Math.min(c1, cols - 1));
    const clampedR2 = Math.max(clampedR1, Math.min(r2, rows - 1));
    const clampedC2 = Math.max(clampedC1, Math.min(c2, cols - 1));

    // Construct 2D prefix matrix P of size (rows + 1) x (cols + 1)
    const P: number[][] = Array.from({ length: rows + 1 }, () =>
      Array(cols + 1).fill(0)
    );

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        P[r][c] =
          grid[r - 1][c - 1] +
          P[r - 1][c] +
          P[r][c - 1] -
          P[r - 1][c - 1];
      }
    }

    // Step 0: Grid Inspection
    steps.push({
      stepIndex: 0,
      mode: "2d-range-query",
      grid2D: grid.map((row) => [...row]),
      prefix2D: P.map((row) => [...row]),
      queryR1: clampedR1,
      queryC1: clampedC1,
      queryR2: clampedR2,
      queryC2: clampedC2,
      status: "idle",
      formulaText: "P[r][c] = Grid[r-1][c-1] + P[r-1][c] + P[r][c-1] - P[r-1][c-1]",
      explanation: `A 2D prefix matrix of size ${rows + 1}×${cols + 1} stores cumulative rectangular sums from top-left (0,0) to any cell (r-1, c-1).`,
      invariantNote: "Inclusion-Exclusion Principle: Adding top and left cumulative sums counts the diagonal overlap twice, so P[r-1][c-1] is subtracted.",
    });

    // Step 1: Subgrid Query Setup
    const targetCells: { r: number; c: number }[] = [];
    for (let r = clampedR1; r <= clampedR2; r++) {
      for (let c = clampedC1; c <= clampedC2; c++) {
        targetCells.push({ r, c });
      }
    }

    const A = P[clampedR2 + 1][clampedC2 + 1];
    const B = P[clampedR1][clampedC2 + 1];
    const C = P[clampedR2 + 1][clampedC1];
    const D = P[clampedR1][clampedC1];
    const subgridResult = A - B - C + D;

    const inclusionExclusion: InclusionExclusionTerms = {
      bottomRight: { r: clampedR2 + 1, c: clampedC2 + 1, val: A },
      topRegion: { r: clampedR1, c: clampedC2 + 1, val: B },
      leftRegion: { r: clampedR2 + 1, c: clampedC1, val: C },
      topLeftOverlap: { r: clampedR1, c: clampedC1, val: D },
      formulaString: `${A} - ${B} - ${C} + ${D} = ${subgridResult}`,
    };

    // Sub-step: Term A (Full bottom-right block)
    steps.push({
      stepIndex: 1,
      mode: "2d-range-query",
      grid2D: grid.map((row) => [...row]),
      prefix2D: P.map((row) => [...row]),
      queryR1: clampedR1,
      queryC1: clampedC1,
      queryR2: clampedR2,
      queryC2: clampedC2,
      highlightCells2D: targetCells,
      prefixHighlightCells2D: [
        { r: clampedR2 + 1, c: clampedC2 + 1, role: "positive" },
      ],
      inclusionExclusion,
      status: "querying",
      formulaText: `Term 1: Full Block P[${clampedR2 + 1}][${clampedC2 + 1}] = ${A}`,
      explanation: `Step 1/4 of Inclusion-Exclusion: Begin with the entire rectangle from (0,0) down to (${clampedR2}, ${clampedC2}), which has total sum ${A}.`,
      invariantNote: "Contains target subgrid plus excessive top and left bounding regions.",
    });

    // Sub-step: Term B (Subtract top region)
    steps.push({
      stepIndex: 2,
      mode: "2d-range-query",
      grid2D: grid.map((row) => [...row]),
      prefix2D: P.map((row) => [...row]),
      queryR1: clampedR1,
      queryC1: clampedC1,
      queryR2: clampedR2,
      queryC2: clampedC2,
      highlightCells2D: targetCells,
      prefixHighlightCells2D: [
        { r: clampedR2 + 1, c: clampedC2 + 1, role: "positive" },
        { r: clampedR1, c: clampedC2 + 1, role: "negative" },
      ],
      inclusionExclusion,
      status: "querying",
      formulaText: `Subtract Top Strip: ${A} - P[${clampedR1}][${clampedC2 + 1}] (${B}) = ${A - B}`,
      explanation: `Step 2/4: Subtract the unwanted region strictly above row ${clampedR1}. Value subtracted: ${B}.`,
      invariantNote: "Leaves the horizontal band from row r1 to r2, but still contains excess to the left of c1.",
    });

    // Sub-step: Term C (Subtract left region)
    steps.push({
      stepIndex: 3,
      mode: "2d-range-query",
      grid2D: grid.map((row) => [...row]),
      prefix2D: P.map((row) => [...row]),
      queryR1: clampedR1,
      queryC1: clampedC1,
      queryR2: clampedR2,
      queryC2: clampedC2,
      highlightCells2D: targetCells,
      prefixHighlightCells2D: [
        { r: clampedR2 + 1, c: clampedC2 + 1, role: "positive" },
        { r: clampedR1, c: clampedC2 + 1, role: "negative" },
        { r: clampedR2 + 1, c: clampedC1, role: "negative" },
      ],
      inclusionExclusion,
      status: "querying",
      formulaText: `Subtract Left Strip: ${A} - ${B} - P[${clampedR2 + 1}][${clampedC1}] (${C}) = ${A - B - C}`,
      explanation: `Step 3/4: Subtract the unwanted region strictly to the left of column ${clampedC1}. Value subtracted: ${C}.`,
      invariantNote: "Hazard: The top-left corner (0,0) to (r1-1, c1-1) was subtracted TWICE (once in top, once in left)!",
    });

    // Sub-step: Term D (Add back top-left overlap)
    steps.push({
      stepIndex: 4,
      mode: "2d-range-query",
      grid2D: grid.map((row) => [...row]),
      prefix2D: P.map((row) => [...row]),
      queryR1: clampedR1,
      queryC1: clampedC1,
      queryR2: clampedR2,
      queryC2: clampedC2,
      subgridSum: subgridResult,
      highlightCells2D: targetCells,
      prefixHighlightCells2D: [
        { r: clampedR2 + 1, c: clampedC2 + 1, role: "positive" },
        { r: clampedR1, c: clampedC2 + 1, role: "negative" },
        { r: clampedR2 + 1, c: clampedC1, role: "negative" },
        { r: clampedR1, c: clampedC1, role: "overlap" },
      ],
      inclusionExclusion,
      status: "completed",
      formulaText: `Final: ${A} - ${B} - ${C} + P[${clampedR1}][${clampedC1}] (${D}) = ${subgridResult}`,
      explanation: `Step 4/4: Add back the top-left overlap region (+${D}) to compensate for double subtraction. The exact subgrid sum is ${subgridResult}.`,
      invariantNote: "Exact 2D Subgrid Invariant: Evaluates in O(1) time and O(1) space per query!",
    });

    return steps;
  }

  // ==========================================
  // DIFFERENCE ARRAY STEPS
  // ==========================================
  private static generateDifferenceSteps(
    arr: number[],
    updates: RangeUpdate[]
  ): PrefixSumStep[] {
    const steps: PrefixSumStep[] = [];
    const n = arr.length;

    // Construct base difference array D of size n + 1
    // D[0] = arr[0], D[i] = arr[i] - arr[i-1]
    const diff: number[] = new Array(n + 1).fill(0);
    diff[0] = arr[0];
    for (let i = 1; i < n; i++) {
      diff[i] = arr[i] - arr[i - 1];
    }

    // Step 0: Initial state
    steps.push({
      stepIndex: 0,
      mode: "difference-array",
      array1D: [...arr],
      diffArray: [...diff],
      reconstructedArray: [...arr],
      updates: [...updates],
      status: "idle",
      formulaText: "D[0] = A[0], D[i] = A[i] - A[i-1]",
      explanation: `Difference array tracks step differences between adjacent elements. A range update of +val on [L, R] only alters two boundary markers: D[L] += val and D[R+1] -= val.`,
      invariantNote: "Running prefix sum of difference array D exactly reconstructs the original array A in O(n) time.",
    });

    // Process each range update
    for (let uIdx = 0; uIdx < updates.length; uIdx++) {
      const { l, r, val } = updates[uIdx];
      const validL = Math.max(0, Math.min(l, n - 1));
      const validR = Math.max(validL, Math.min(r, n - 1));

      // Apply boundary markers
      diff[validL] += val;
      if (validR + 1 < n + 1) {
        diff[validR + 1] -= val;
      }

      const diffHighlight: { index: number; role: "add" | "subtract" | "carry" }[] = [
        { index: validL, role: "add" },
      ];
      if (validR + 1 < n + 1) {
        diffHighlight.push({ index: validR + 1, role: "subtract" });
      }

      steps.push({
        stepIndex: steps.length,
        mode: "difference-array",
        array1D: [...arr],
        diffArray: [...diff],
        updates: [...updates],
        activeUpdateIndex: uIdx,
        diffHighlightIndices: diffHighlight,
        status: "updating",
        formulaText: `Update #${uIdx + 1}: [${validL}, ${validR}] += ${val} → D[${validL}] += ${val}, D[${validR + 1}] -= ${val}`,
        explanation: `Marked interval [${validL}, ${validR}] with delta ${val >= 0 ? "+" + val : val}. Only 2 array cells modified in O(1) time! No elements between L and R are touched.`,
        invariantNote: `In naive approach, this update would touch ${validR - validL + 1} elements. Here it takes strictly O(1) time.`,
      });
    }

    // Reconstruction step by prefix sum
    const reconstructed: number[] = new Array(n).fill(0);
    let runningVal = 0;

    for (let i = 0; i < n; i++) {
      runningVal += diff[i];
      reconstructed[i] = runningVal;

      steps.push({
        stepIndex: steps.length,
        mode: "difference-array",
        array1D: [...arr],
        diffArray: [...diff],
        reconstructedArray: [...reconstructed],
        updates: [...updates],
        diffHighlightIndices: [{ index: i, role: "carry" }],
        status: "reconstructing",
        formulaText: `A'[${i}] = A'[${i - 1}] + D[${i}] = ${runningVal}`,
        explanation: `Prefix sum sweep across difference array at index ${i}: Accumulating D[${i}] into running sum produces final updated value ${runningVal}.`,
        invariantNote: "Single O(n) pass sweeps all boundary markers and applies every batch update simultaneously.",
      });
    }

    steps.push({
      stepIndex: steps.length,
      mode: "difference-array",
      array1D: [...arr],
      diffArray: [...diff],
      reconstructedArray: [...reconstructed],
      updates: [...updates],
      status: "completed",
      formulaText: "Batch Range Updates Completed in O(Q + N) Total Time!",
      explanation: `All ${updates.length} batch updates successfully applied. Final array: [${reconstructed.join(", ")}].`,
      invariantNote: "Efficiency comparison: Naive Q updates take O(Q · N). Difference array takes O(Q + N), transforming intractable batch simulations into linear speed.",
    });

    return steps;
  }

  // ==========================================
  // HASH PREFIX STEPS (LEETCODE 560)
  // ==========================================
  private static generateHashPrefixSteps(
    arr: number[],
    targetK: number
  ): PrefixSumStep[] {
    const steps: PrefixSumStep[] = [];
    const n = arr.length;

    // Hash map stores: prefixSum -> frequency
    const prefixMap: Record<number, number> = { 0: 1 };
    let currentSum = 0;
    let totalCount = 0;
    const matches: [number, number][] = [];

    // Step 0: Base setup
    steps.push({
      stepIndex: 0,
      mode: "hash-prefix",
      array1D: [...arr],
      targetK,
      currentIndex: -1,
      currentPrefixSum: 0,
      neededPrefixSum: -targetK,
      prefixHashMap: { ...prefixMap },
      totalSubarraysCount: 0,
      matchingSubarrays: [],
      status: "idle",
      formulaText: "Map = { 0: 1 } (Base prefix before index 0)",
      explanation: `Initialize frequency hash map with { 0: 1 }. If a running prefix sum equals target K (${targetK}), (currentSum - K = 0) will find this base match immediately.`,
      invariantNote: "Subarray equation: sum(j, i) = P[i] - P[j-1] = K  <=>  P[j-1] = P[i] - K.",
    });

    // Step-by-step sweep
    for (let i = 0; i < n; i++) {
      currentSum += arr[i];
      const needed = currentSum - targetK;
      const foundOccurrences = prefixMap[needed] || 0;

      const previousMatchesCount = totalCount;
      if (foundOccurrences > 0) {
        totalCount += foundOccurrences;
        matches.push([i, foundOccurrences]);
      }

      // Add to map
      prefixMap[currentSum] = (prefixMap[currentSum] || 0) + 1;

      steps.push({
        stepIndex: steps.length,
        mode: "hash-prefix",
        array1D: [...arr],
        targetK,
        currentIndex: i,
        currentPrefixSum: currentSum,
        neededPrefixSum: needed,
        prefixHashMap: { ...prefixMap },
        totalSubarraysCount: totalCount,
        matchingSubarrays: [...matches],
        highlightIndices1D: [i],
        status: foundOccurrences > 0 ? "searching" : "building",
        formulaText: `i = ${i} (A[${i}] = ${arr[i]}): Sum = ${currentSum}, Need = Sum - K (${currentSum} - ${targetK} = ${needed}) → Found: ${foundOccurrences}`,
        explanation: foundOccurrences > 0
          ? `Found ${foundOccurrences} valid subarray(s) ending at index ${i}! Needed prefix sum ${needed} exists in hash map with count ${foundOccurrences}. Total count now ${totalCount}.`
          : `Running sum is ${currentSum}. Needed prefix ${needed} not in map. Registered prefix ${currentSum} into hash map.`,
        invariantNote: `Single O(n) pass with O(1) average hash map lookups solves the negative numbers subarray problem where two pointers fail!`,
      });
    }

    steps.push({
      stepIndex: steps.length,
      mode: "hash-prefix",
      array1D: [...arr],
      targetK,
      currentIndex: n - 1,
      currentPrefixSum: currentSum,
      neededPrefixSum: currentSum - targetK,
      prefixHashMap: { ...prefixMap },
      totalSubarraysCount: totalCount,
      matchingSubarrays: [...matches],
      status: "completed",
      formulaText: `Total Subarrays with Sum = ${targetK}: ${totalCount}`,
      explanation: `Sweep complete! Found a total of ${totalCount} contiguous subarrays with exact sum ${targetK}.`,
      invariantNote: "Time Complexity: O(n) single pass. Space Complexity: O(n) hash map storing at most n distinct prefix sums.",
    });

    return steps;
  }
}
