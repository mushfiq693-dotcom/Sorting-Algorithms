/**
 * Binary Heap (Min-Heap / Max-Heap) Engine & Interactive Step Generator
 *
 * Implements strict Complete Binary Tree invariant mapped directly to a 1D Array:
 * - Parent(i) = Math.floor((i - 1) / 2)
 * - LeftChild(i) = 2 * i + 1
 * - RightChild(i) = 2 * i + 2
 * - Min-Heap Property: Array[Parent(i)] <= Array[i]
 * - Max-Heap Property: Array[Parent(i)] >= Array[i]
 *
 * Features:
 * - Sift-Up (Bubble-Up) on Insertion: O(log n)
 * - Sift-Down (Bubble-Down) on Extract Root: O(log n)
 * - Bottom-Up Linear Build Heap (Heapify): O(n)
 * - Dynamic Min-Heap <-> Max-Heap Mode Toggle
 */

export type HeapType = "min" | "max";

export type HeapOperationType =
  | "idle"
  | "insert-append"
  | "insert-compare"
  | "insert-swap"
  | "insert-settled"
  | "extract-start"
  | "extract-swap-root"
  | "extract-popped"
  | "extract-compare-children"
  | "extract-compare-parent"
  | "extract-swap"
  | "extract-settled"
  | "heapify-start"
  | "heapify-step"
  | "heapify-swap"
  | "heapify-done"
  | "peek"
  | "mode-change";

export interface HeapMetrics {
  size: number;
  capacity: number;
  height: number;
  heapType: HeapType;
  isHeapValid: boolean;
  totalOperations: number;
}

export interface HeapNodeCoord {
  index: number;
  val: number;
  x: number;
  y: number;
  depth: number;
  parentIndex: number | null;
  leftIndex: number | null;
  rightIndex: number | null;
}

export interface HeapStep {
  type: HeapOperationType;
  heapType: HeapType;
  array: number[];
  activeIndices: number[]; // Focused element(s)
  comparingIndices: number[]; // Elements being compared
  swappingIndices: number[]; // Elements swapping
  highlightIndices: number[]; // Successful root or result
  targetValue?: number;
  extractedValue?: number;
  description: string;
  codeLine: number;
  metrics: HeapMetrics;
  formulaNote?: {
    label: string;
    calculation: string;
    result: string;
  };
}

export class HeapEngine {
  private array: number[] = [];
  private heapType: HeapType = "min";
  private totalOpsCount: number = 0;

  constructor(initialArray: number[] = [12, 18, 25, 30, 42, 35, 60], type: HeapType = "min") {
    this.heapType = type;
    this.array = [...initialArray];
  }

  public getArray(): number[] {
    return [...this.array];
  }

  public getHeapType(): HeapType {
    return this.heapType;
  }

  public setHeapType(type: HeapType) {
    this.heapType = type;
  }

  private parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private left(i: number): number {
    return 2 * i + 1;
  }

  private right(i: number): number {
    return 2 * i + 2;
  }

  public calculateHeight(size: number = this.array.length): number {
    if (size <= 0) return 0;
    return Math.floor(Math.log2(size)) + 1;
  }

  public isHeapValid(arr: number[] = this.array, type: HeapType = this.heapType): boolean {
    const n = arr.length;
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (type === "min") {
        if (l < n && arr[l] < arr[i]) return false;
        if (r < n && arr[r] < arr[i]) return false;
      } else {
        if (l < n && arr[l] > arr[i]) return false;
        if (r < n && arr[r] > arr[i]) return false;
      }
    }
    return true;
  }

  private getMetrics(arr: number[] = this.array): HeapMetrics {
    return {
      size: arr.length,
      capacity: Math.max(15, arr.length),
      height: this.calculateHeight(arr.length),
      heapType: this.heapType,
      isHeapValid: this.isHeapValid(arr),
      totalOperations: this.totalOpsCount,
    };
  }

  public getInitialStep(description: string = "Heap ready. Complete binary tree mapped directly to 1D Array."): HeapStep {
    return {
      type: "idle",
      heapType: this.heapType,
      array: [...this.array],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: this.array.length > 0 ? [0] : [],
      description,
      codeLine: 1,
      metrics: this.getMetrics(),
    };
  }

  /**
   * Generates step-by-step animation for Insert with Sift-Up
   */
  public generateInsertSteps(value: number): HeapStep[] {
    const steps: HeapStep[] = [];
    const arr = [...this.array];
    this.totalOpsCount++;

    // 1. Append at the end (maintaining complete binary tree shape)
    arr.push(value);
    let curr = arr.length - 1;

    steps.push({
      type: "insert-append",
      heapType: this.heapType,
      array: [...arr],
      activeIndices: [curr],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: [],
      targetValue: value,
      description: `Appended ${value} to index [${curr}] at the leftmost vacant leaf to preserve complete binary tree shape.`,
      codeLine: 4,
      metrics: this.getMetrics(arr),
      formulaNote: {
        label: "Leaf Placement",
        calculation: `arr.push(${value})`,
        result: `index = ${curr}`,
      },
    });

    // 2. Sift-Up loop
    while (curr > 0) {
      const p = this.parent(curr);
      const shouldSwap =
        this.heapType === "min" ? arr[curr] < arr[p] : arr[curr] > arr[p];

      steps.push({
        type: "insert-compare",
        heapType: this.heapType,
        array: [...arr],
        activeIndices: [curr],
        comparingIndices: [curr, p],
        swappingIndices: [],
        highlightIndices: [],
        targetValue: value,
        description: `Comparing child node arr[${curr}] = ${arr[curr]} with parent arr[${p}] = ${arr[p]}. Condition: ${arr[curr]} ${
          this.heapType === "min" ? "<" : ">"
        } ${arr[p]} is ${shouldSwap ? "TRUE (Invariant violated)" : "FALSE (Heap order valid)"}.`,
        codeLine: 6,
        metrics: this.getMetrics(arr),
        formulaNote: {
          label: "Parent Index Calculation",
          calculation: `parent(${curr}) = floor((${curr} - 1) / 2)`,
          result: `p = ${p}`,
        },
      });

      if (!shouldSwap) {
        break;
      }

      // Perform swap
      const temp = arr[curr];
      arr[curr] = arr[p];
      arr[p] = temp;

      steps.push({
        type: "insert-swap",
        heapType: this.heapType,
        array: [...arr],
        activeIndices: [p],
        comparingIndices: [],
        swappingIndices: [curr, p],
        highlightIndices: [],
        targetValue: value,
        description: `Swapped arr[${curr}] with arr[${p}]. Value ${value} bubbles up toward the root.`,
        codeLine: 8,
        metrics: this.getMetrics(arr),
      });

      curr = p;
    }

    // Settled step
    steps.push({
      type: "insert-settled",
      heapType: this.heapType,
      array: [...arr],
      activeIndices: [curr],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: [curr],
      targetValue: value,
      description: `Insertion complete! Value ${value} has settled into index [${curr}]. Heap invariant fully restored in O(log n) time.`,
      codeLine: 11,
      metrics: this.getMetrics(arr),
    });

    this.array = arr;
    return steps;
  }

  /**
   * Generates step-by-step animation for Extract Root (Extract-Min / Extract-Max)
   */
  public generateExtractRootSteps(): HeapStep[] {
    const steps: HeapStep[] = [];
    if (this.array.length === 0) {
      steps.push(this.getInitialStep("Heap is empty; cannot extract root."));
      return steps;
    }

    const arr = [...this.array];
    this.totalOpsCount++;
    const rootVal = arr[0];

    // 1. Identify Root
    steps.push({
      type: "extract-start",
      heapType: this.heapType,
      array: [...arr],
      activeIndices: [0],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: [0],
      extractedValue: rootVal,
      description: `Extracting root element ${rootVal} (${
        this.heapType === "min" ? "Global Minimum" : "Global Maximum"
      } at index [0]).`,
      codeLine: 14,
      metrics: this.getMetrics(arr),
    });

    if (arr.length === 1) {
      arr.pop();
      steps.push({
        type: "extract-popped",
        heapType: this.heapType,
        array: [],
        activeIndices: [],
        comparingIndices: [],
        swappingIndices: [],
        highlightIndices: [],
        extractedValue: rootVal,
        description: `Extracted last remaining element ${rootVal}. Heap is now empty.`,
        codeLine: 16,
        metrics: this.getMetrics([]),
      });
      this.array = arr;
      return steps;
    }

    // 2. Swap root with last element
    const lastIdx = arr.length - 1;
    const lastVal = arr[lastIdx];

    steps.push({
      type: "extract-swap-root",
      heapType: this.heapType,
      array: [...arr],
      activeIndices: [0, lastIdx],
      comparingIndices: [],
      swappingIndices: [0, lastIdx],
      highlightIndices: [],
      extractedValue: rootVal,
      description: `Swapped root ${rootVal} with the last leaf arr[${lastIdx}] = ${lastVal} to preserve structural completeness.`,
      codeLine: 17,
      metrics: this.getMetrics(arr),
    });

    arr[0] = lastVal;
    arr.pop();

    steps.push({
      type: "extract-popped",
      heapType: this.heapType,
      array: [...arr],
      activeIndices: [0],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: [],
      extractedValue: rootVal,
      description: `Removed ${rootVal} from array. Index [0] now holds ${lastVal}, which must sift down to restore heap ordering.`,
      codeLine: 19,
      metrics: this.getMetrics(arr),
    });

    // 3. Sift-Down
    let curr = 0;
    const n = arr.length;

    while (true) {
      const l = this.left(curr);
      const r = this.right(curr);
      let targetIdx = curr;

      if (l < n) {
        if (this.heapType === "min" ? arr[l] < arr[targetIdx] : arr[l] > arr[targetIdx]) {
          targetIdx = l;
        }
      }

      if (r < n) {
        if (this.heapType === "min" ? arr[r] < arr[targetIdx] : arr[r] > arr[targetIdx]) {
          targetIdx = r;
        }
      }

      const candidateIndices = [curr];
      if (l < n) candidateIndices.push(l);
      if (r < n) candidateIndices.push(r);

      steps.push({
        type: "extract-compare-children",
        heapType: this.heapType,
        array: [...arr],
        activeIndices: [curr],
        comparingIndices: candidateIndices,
        swappingIndices: [],
        highlightIndices: [],
        extractedValue: rootVal,
        description: `Inspecting node arr[${curr}] = ${arr[curr]} and children: Left arr[${l}] = ${
          l < n ? arr[l] : "None"
        }, Right arr[${r}] = ${r < n ? arr[r] : "None"}. Best swap candidate is index [${targetIdx}] (${
          targetIdx === curr ? "Current is optimal" : arr[targetIdx]
        }).`,
        codeLine: 22,
        metrics: this.getMetrics(arr),
        formulaNote: {
          label: "Children Calculation",
          calculation: `left = 2*${curr}+1 (${l}), right = 2*${curr}+2 (${r})`,
          result: `nextTarget = ${targetIdx}`,
        },
      });

      if (targetIdx === curr) {
        break; // Invariant satisfied
      }

      // Swap with target
      const temp = arr[curr];
      arr[curr] = arr[targetIdx];
      arr[targetIdx] = temp;

      steps.push({
        type: "extract-swap",
        heapType: this.heapType,
        array: [...arr],
        activeIndices: [targetIdx],
        comparingIndices: [],
        swappingIndices: [curr, targetIdx],
        highlightIndices: [],
        extractedValue: rootVal,
        description: `Swapped arr[${curr}] with arr[${targetIdx}]. Value ${temp} sifts down into index [${targetIdx}].`,
        codeLine: 26,
        metrics: this.getMetrics(arr),
      });

      curr = targetIdx;
    }

    // Settled step
    steps.push({
      type: "extract-settled",
      heapType: this.heapType,
      array: [...arr],
      activeIndices: [curr],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: [curr],
      extractedValue: rootVal,
      description: `Extraction complete! Extracted value ${rootVal} returned. Heap property satisfied across all nodes in O(log n) time.`,
      codeLine: 30,
      metrics: this.getMetrics(arr),
    });

    this.array = arr;
    return steps;
  }

  /**
   * Generates step-by-step animation for Linear Build Heap (Heapify)
   */
  public generateHeapifySteps(rawArray?: number[]): HeapStep[] {
    const steps: HeapStep[] = [];
    const arr = rawArray ? [...rawArray] : [...this.array];
    this.totalOpsCount++;
    const n = arr.length;

    steps.push({
      type: "heapify-start",
      heapType: this.heapType,
      array: [...arr],
      activeIndices: [],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: [],
      description: `Starting Linear O(n) Heapify on array of ${n} elements. Sift-down begins at the last non-leaf node: floor(${n}/2) - 1 = ${Math.floor(
        n / 2
      ) - 1}.`,
      codeLine: 33,
      metrics: this.getMetrics(arr),
      formulaNote: {
        label: "Last Non-Leaf Formula",
        calculation: `Math.floor(${n} / 2) - 1`,
        result: `startIdx = ${Math.floor(n / 2) - 1}`,
      },
    });

    const siftDownInternal = (startIdx: number) => {
      let curr = startIdx;
      while (true) {
        const l = 2 * curr + 1;
        const r = 2 * curr + 2;
        let targetIdx = curr;

        if (l < n) {
          if (this.heapType === "min" ? arr[l] < arr[targetIdx] : arr[l] > arr[targetIdx]) {
            targetIdx = l;
          }
        }
        if (r < n) {
          if (this.heapType === "min" ? arr[r] < arr[targetIdx] : arr[r] > arr[targetIdx]) {
            targetIdx = r;
          }
        }

        const candidateIndices = [curr];
        if (l < n) candidateIndices.push(l);
        if (r < n) candidateIndices.push(r);

        steps.push({
          type: "heapify-step",
          heapType: this.heapType,
          array: [...arr],
          activeIndices: [curr],
          comparingIndices: candidateIndices,
          swappingIndices: [],
          highlightIndices: [],
          description: `Heapify check at non-leaf index [${curr}] (value ${arr[curr]}). Comparing with children [${
            l < n ? l : ""
          }${r < n ? `, ${r}` : ""}].`,
          codeLine: 36,
          metrics: this.getMetrics(arr),
        });

        if (targetIdx === curr) {
          break;
        }

        const temp = arr[curr];
        arr[curr] = arr[targetIdx];
        arr[targetIdx] = temp;

        steps.push({
          type: "heapify-swap",
          heapType: this.heapType,
          array: [...arr],
          activeIndices: [targetIdx],
          comparingIndices: [],
          swappingIndices: [curr, targetIdx],
          highlightIndices: [],
          description: `Sift-down swap: arr[${curr}] (${temp}) exchanged with arr[${targetIdx}] (${arr[curr]}).`,
          codeLine: 39,
          metrics: this.getMetrics(arr),
        });

        curr = targetIdx;
      }
    };

    // Run siftDown from last non-leaf down to root
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      siftDownInternal(i);
    }

    steps.push({
      type: "heapify-done",
      heapType: this.heapType,
      array: [...arr],
      activeIndices: [0],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: [0],
      description: `Heapify complete! Entire array reorganized into a mathematically valid ${this.heapType.toUpperCase()}-Heap in strictly linear O(n) time.`,
      codeLine: 43,
      metrics: this.getMetrics(arr),
    });

    this.array = arr;
    return steps;
  }

  /**
   * Generates step for Peek
   */
  public generatePeekSteps(): HeapStep[] {
    const steps: HeapStep[] = [];
    if (this.array.length === 0) {
      steps.push(this.getInitialStep("Heap is empty; nothing to peek."));
      return steps;
    }

    const rootVal = this.array[0];
    steps.push({
      type: "peek",
      heapType: this.heapType,
      array: [...this.array],
      activeIndices: [0],
      comparingIndices: [],
      swappingIndices: [],
      highlightIndices: [0],
      description: `Peek root at index [0] = ${rootVal} (${
        this.heapType === "min" ? "Global Minimum" : "Global Maximum"
      }). Instant lookup in strictly O(1) time without modifying heap state.`,
      codeLine: 2,
      metrics: this.getMetrics(),
    });

    return steps;
  }

  /**
   * Load presets
   */
  public loadPreset(
    preset: "balanced-min" | "balanced-max" | "almost-sorted" | "random-unordered" | "task-priorities"
  ) {
    switch (preset) {
      case "balanced-min":
        this.heapType = "min";
        this.array = [10, 20, 15, 30, 40, 50, 60, 70, 80];
        break;
      case "balanced-max":
        this.heapType = "max";
        this.array = [95, 80, 85, 60, 75, 70, 65, 40, 50];
        break;
      case "almost-sorted":
        this.heapType = "min";
        this.array = [5, 12, 19, 21, 28, 35, 49, 56];
        break;
      case "random-unordered":
        this.array = [65, 12, 84, 32, 9, 47, 53, 21, 76];
        // Don't auto-heapify, so user can press "Build Heap (Heapify)" to watch O(n) construction!
        break;
      case "task-priorities":
        this.heapType = "max";
        this.array = [99, 88, 77, 66, 55, 44, 33];
        break;
    }
  }

  /**
   * Toggles between Min-Heap and Max-Heap, automatically generating heapify steps
   */
  public toggleHeapType(): HeapStep[] {
    this.heapType = this.heapType === "min" ? "max" : "min";
    return this.generateHeapifySteps();
  }
}

/**
 * Pre-computes 2D visual layout coordinates for complete binary tree of size N
 */
export function calculateHeapTreeCoordinates(
  array: number[],
  canvasWidth: number = 600,
  canvasHeight: number = 320
): { coords: Record<number, HeapNodeCoord>; width: number; height: number } {
  const coords: Record<number, HeapNodeCoord> = {};
  const n = array.length;
  if (n === 0) return { coords, width: canvasWidth, height: canvasHeight };

  const totalLevels = Math.floor(Math.log2(n)) + 1;
  const levelHeight = Math.min(65, (canvasHeight - 60) / Math.max(1, totalLevels));

  for (let i = 0; i < n; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const levelStartIndex = Math.pow(2, depth) - 1;
    const indexInLevel = i - levelStartIndex;
    const nodesInLevel = Math.pow(2, depth);

    // Calculate symmetric X spacing across width
    const segmentWidth = canvasWidth / (nodesInLevel + 1);
    const x = segmentWidth * (indexInLevel + 1);
    const y = 35 + depth * levelHeight;

    const p = i > 0 ? Math.floor((i - 1) / 2) : null;
    const l = 2 * i + 1 < n ? 2 * i + 1 : null;
    const r = 2 * i + 2 < n ? 2 * i + 2 : null;

    coords[i] = {
      index: i,
      val: array[i],
      x,
      y,
      depth,
      parentIndex: p,
      leftIndex: l,
      rightIndex: r,
    };
  }

  return { coords, width: canvasWidth, height: canvasHeight };
}
