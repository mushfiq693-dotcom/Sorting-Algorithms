/**
 * Priority Queue Engine & Interactive Step Generator
 *
 * Implements an abstract Priority Queue data structure backed by an efficient Binary Heap:
 * - Supports both Max-Priority Queue (e.g. OS CPU Task Scheduler, Emergency Triage)
 *   and Min-Priority Queue (e.g. Dijkstra's Shortest Path Frontier, Event Simulator).
 * - Underlying 1D contiguous array representation:
 *     Parent(i) = ⌊(i - 1) / 2⌋
 *     Left(i)   = 2i + 1
 *     Right(i)  = 2i + 2
 * - Enqueue (Push): O(log n) via Sift-Up
 * - Dequeue (Extract-Max / Extract-Min): O(log n) via Sift-Down
 * - Peek: O(1)
 * - Change Priority (Decrease-Key / Increase-Key): O(log n)
 * - Linear Heap Construction: O(n)
 */

export type PQMode = "max" | "min";

export type PQItemCategory =
  | "critical"
  | "high"
  | "normal"
  | "low"
  | "kernel"
  | "render"
  | "io";

export interface PQItem {
  id: string;
  title: string;
  priority: number;
  category: PQItemCategory;
  description?: string;
  color?: string;
  dispatchedAt?: number;
}

export type PQOperationType =
  | "idle"
  | "enqueue-append"
  | "enqueue-compare"
  | "enqueue-swap"
  | "enqueue-settled"
  | "dequeue-start"
  | "dequeue-swap-root"
  | "dequeue-dispatched"
  | "dequeue-compare-children"
  | "dequeue-compare-parent"
  | "dequeue-swap"
  | "dequeue-settled"
  | "change-priority-start"
  | "change-priority-sift"
  | "change-priority-done"
  | "peek"
  | "mode-change";

export interface PQMetrics {
  size: number;
  capacity: number;
  mode: PQMode;
  topPriority: number | null;
  totalEnqueued: number;
  totalDispatched: number;
}

export interface PQNodeCoord {
  index: number;
  item: PQItem;
  x: number;
  y: number;
  depth: number;
  parentIndex: number | null;
  leftIndex: number | null;
  rightIndex: number | null;
}

export interface PQStep {
  operation: PQOperationType;
  items: PQItem[];
  comparingIndices: [number, number] | null;
  swappingIndices: [number, number] | null;
  activeItemIndex: number | null;
  dispatchedItem: PQItem | null;
  explanation: string;
  cppLine: number | null;
  metrics: PQMetrics;
  dispatchedHistory: PQItem[];
}

export class PriorityQueueEngine {
  private items: PQItem[];
  private mode: PQMode;
  private dispatchedHistory: PQItem[];
  private totalEnqueuedCount: number;

  constructor(initialItems: PQItem[] = [], mode: PQMode = "max") {
    this.mode = mode;
    this.items = [...initialItems];
    this.dispatchedHistory = [];
    this.totalEnqueuedCount = initialItems.length;
    this.heapifyInPlace();
  }

  public getItems(): PQItem[] {
    return [...this.items];
  }

  public getMode(): PQMode {
    return this.mode;
  }

  public getDispatchedHistory(): PQItem[] {
    return [...this.dispatchedHistory];
  }

  public setMode(newMode: PQMode): PQStep[] {
    const steps: PQStep[] = [];
    this.mode = newMode;
    steps.push(this.createStep("mode-change", null, null, null, null, `Switched Priority Queue mode to ${newMode === "max" ? "Max-Priority (Highest first)" : "Min-Priority (Lowest first)"}. Re-heapifying queue...`, 1));

    const heapifySteps = this.generateHeapifySteps();
    steps.push(...heapifySteps);
    return steps;
  }

  public clear(): PQStep[] {
    this.items = [];
    this.dispatchedHistory = [];
    this.totalEnqueuedCount = 0;
    return [
      this.createStep("idle", null, null, null, null, "Priority Queue cleared. All pending and dispatched tasks removed.", null),
    ];
  }

  public loadPreset(presetItems: PQItem[], mode: PQMode = "max"): PQStep[] {
    this.mode = mode;
    this.items = [...presetItems];
    this.dispatchedHistory = [];
    this.totalEnqueuedCount = presetItems.length;
    this.heapifyInPlace();

    return [
      this.createStep(
        "idle",
        null,
        null,
        null,
        null,
        `Loaded preset with ${this.items.length} prioritized tasks in ${mode === "max" ? "Max-Priority" : "Min-Priority"} mode.`,
        null
      ),
    ];
  }

  /**
   * Helper comparison respecting mode
   */
  private shouldPrioritize(a: PQItem, b: PQItem): boolean {
    if (this.mode === "max") {
      return a.priority > b.priority;
    }
    return a.priority < b.priority;
  }

  private parentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private leftIndex(i: number): number {
    return 2 * i + 1;
  }

  private rightIndex(i: number): number {
    return 2 * i + 2;
  }

  private createStep(
    operation: PQOperationType,
    comparingIndices: [number, number] | null,
    swappingIndices: [number, number] | null,
    activeItemIndex: number | null,
    dispatchedItem: PQItem | null,
    explanation: string,
    cppLine: number | null
  ): PQStep {
    return {
      operation,
      items: this.items.map((it) => ({ ...it })),
      comparingIndices,
      swappingIndices,
      activeItemIndex,
      dispatchedItem: dispatchedItem ? { ...dispatchedItem } : null,
      explanation,
      cppLine,
      metrics: {
        size: this.items.length,
        capacity: Math.max(16, this.items.length),
        mode: this.mode,
        topPriority: this.items.length > 0 ? this.items[0].priority : null,
        totalEnqueued: this.totalEnqueuedCount,
        totalDispatched: this.dispatchedHistory.length,
      },
      dispatchedHistory: this.dispatchedHistory.map((it) => ({ ...it })),
    };
  }

  /**
   * Enqueue a new prioritized task (Sift-Up)
   */
  public enqueue(item: PQItem): PQStep[] {
    const steps: PQStep[] = [];
    this.totalEnqueuedCount += 1;

    // Step 1: Append to end of array
    this.items.push({ ...item });
    let curr = this.items.length - 1;

    steps.push(
      this.createStep(
        "enqueue-append",
        null,
        null,
        curr,
        null,
        `Enqueued task "${item.title}" with priority ${item.priority} at index [${curr}] (leaf position). Beginning Sift-Up...`,
        7 // push line
      )
    );

    // Step 2: Sift-Up
    while (curr > 0) {
      const parent = this.parentIndex(curr);
      const parentItem = this.items[parent];
      const currItem = this.items[curr];

      steps.push(
        this.createStep(
          "enqueue-compare",
          [curr, parent],
          null,
          curr,
          null,
          `Comparing "${currItem.title}" (priority ${currItem.priority}) with parent "${parentItem.title}" at [${parent}] (priority ${parentItem.priority}).`,
          11 // while loop comparator
        )
      );

      if (this.shouldPrioritize(currItem, parentItem)) {
        // Swap
        this.items[curr] = parentItem;
        this.items[parent] = currItem;

        steps.push(
          this.createStep(
            "enqueue-swap",
            null,
            [curr, parent],
            parent,
            null,
            `Priority invariant violated! Swapped "${currItem.title}" upward to index [${parent}].`,
            12 // swap line
          )
        );

        curr = parent;
      } else {
        steps.push(
          this.createStep(
            "enqueue-settled",
            null,
            null,
            curr,
            null,
            `Task "${currItem.title}" satisfies heap ordering. Sift-Up complete at index [${curr}].`,
            14
          )
        );
        return steps;
      }
    }

    steps.push(
      this.createStep(
        "enqueue-settled",
        null,
        null,
        curr,
        null,
        `Task "${this.items[curr].title}" reached the top of the Priority Queue at root [0]! Highest priority ready for dispatch.`,
        14
      )
    );

    return steps;
  }

  /**
   * Dequeue highest priority task (Sift-Down)
   */
  public dequeue(): PQStep[] {
    const steps: PQStep[] = [];

    if (this.items.length === 0) {
      steps.push(
        this.createStep(
          "idle",
          null,
          null,
          null,
          null,
          "Priority Queue is empty! No tasks available to dispatch.",
          20
        )
      );
      return steps;
    }

    if (this.items.length === 1) {
      const dispatched = this.items.pop()!;
      this.dispatchedHistory.unshift({ ...dispatched, dispatchedAt: Date.now() });

      steps.push(
        this.createStep(
          "dequeue-dispatched",
          null,
          null,
          null,
          dispatched,
          `Dispatched sole task "${dispatched.title}" (priority ${dispatched.priority}). Queue is now empty.`,
          24
        )
      );
      return steps;
    }

    // Step 1: Root task to be extracted
    const rootTask = { ...this.items[0] };
    const lastTask = this.items[this.items.length - 1];

    steps.push(
      this.createStep(
        "dequeue-start",
        [0, this.items.length - 1],
        null,
        0,
        rootTask,
        `Extracting top priority task "${rootTask.title}" (priority ${rootTask.priority}). Swapping root with leaf task "${lastTask.title}" at [${this.items.length - 1}].`,
        21
      )
    );

    // Swap root with last leaf
    this.items[0] = this.items.pop()!;
    this.dispatchedHistory.unshift({ ...rootTask, dispatchedAt: Date.now() });

    steps.push(
      this.createStep(
        "dequeue-swap-root",
        null,
        null,
        0,
        rootTask,
        `Dispatched "${rootTask.title}" to execution engine! Leaf task "${this.items[0].title}" placed at root [0]. Beginning Sift-Down to restore priority order...`,
        24
      )
    );

    // Sift-Down from root
    let curr = 0;
    const n = this.items.length;

    while (this.leftIndex(curr) < n) {
      const left = this.leftIndex(curr);
      const right = this.rightIndex(curr);
      let targetChild = left;

      if (right < n) {
        steps.push(
          this.createStep(
            "dequeue-compare-children",
            [left, right],
            null,
            curr,
            null,
            `Comparing left child "${this.items[left].title}" (prio ${this.items[left].priority}) with right child "${this.items[right].title}" (prio ${this.items[right].priority}) to find dominant candidate.`,
            28
          )
        );

        if (this.shouldPrioritize(this.items[right], this.items[left])) {
          targetChild = right;
        }
      }

      steps.push(
        this.createStep(
          "dequeue-compare-parent",
          [curr, targetChild],
          null,
          curr,
          null,
          `Comparing active task "${this.items[curr].title}" (prio ${this.items[curr].priority}) with dominant child "${this.items[targetChild].title}" (prio ${this.items[targetChild].priority}) at [${targetChild}].`,
          32
        )
      );

      if (this.shouldPrioritize(this.items[targetChild], this.items[curr])) {
        // Swap
        const temp = this.items[curr];
        this.items[curr] = this.items[targetChild];
        this.items[targetChild] = temp;

        steps.push(
          this.createStep(
            "dequeue-swap",
            null,
            [curr, targetChild],
            targetChild,
            null,
            `Swapped "${temp.title}" downward with higher-priority child "${this.items[curr].title}" at [${targetChild}].`,
            34
          )
        );

        curr = targetChild;
      } else {
        steps.push(
          this.createStep(
            "dequeue-settled",
            null,
            null,
            curr,
            null,
            `Task "${this.items[curr].title}" dominates its children. Sift-Down complete. Priority Queue invariant restored.`,
            37
          )
        );
        return steps;
      }
    }

    steps.push(
      this.createStep(
        "dequeue-settled",
        null,
        null,
        curr,
        null,
        `Task "${this.items[curr].title}" settled at leaf level. Priority Queue invariant fully restored!`,
        37
      )
    );

    return steps;
  }

  /**
   * Peek top task without removing
   */
  public peek(): PQStep[] {
    if (this.items.length === 0) {
      return [
        this.createStep("idle", null, null, null, null, "Priority Queue is empty! Nothing to peek.", 4),
      ];
    }

    const top = this.items[0];
    return [
      this.createStep(
        "peek",
        null,
        null,
        0,
        null,
        `Next task scheduled for execution: "${top.title}" (Priority ${top.priority}, Category: ${top.category.toUpperCase()}). O(1) peek access.`,
        5
      ),
    ];
  }

  /**
   * Change priority of a specific task (Decrease-Key / Increase-Key)
   */
  public changePriority(taskId: string, newPriority: number): PQStep[] {
    const steps: PQStep[] = [];
    const index = this.items.findIndex((t) => t.id === taskId);

    if (index === -1) {
      steps.push(
        this.createStep("idle", null, null, null, null, `Task with ID "${taskId}" not found in Priority Queue.`, null)
      );
      return steps;
    }

    const oldPriority = this.items[index].priority;
    this.items[index].priority = newPriority;

    steps.push(
      this.createStep(
        "change-priority-start",
        null,
        null,
        index,
        null,
        `Updated priority of "${this.items[index].title}" from ${oldPriority} to ${newPriority}. Re-positioning via Sift...`,
        42
      )
    );

    // If new priority increased (in max mode) or decreased (in min mode), sift-up
    const shouldSiftUp =
      (this.mode === "max" && newPriority > oldPriority) ||
      (this.mode === "min" && newPriority < oldPriority);

    if (shouldSiftUp) {
      let curr = index;
      while (curr > 0) {
        const parent = this.parentIndex(curr);
        if (this.shouldPrioritize(this.items[curr], this.items[parent])) {
          const temp = this.items[curr];
          this.items[curr] = this.items[parent];
          this.items[parent] = temp;

          steps.push(
            this.createStep(
              "change-priority-sift",
              null,
              [curr, parent],
              parent,
              null,
              `Sift-Up: Moved "${temp.title}" upward to index [${parent}] due to elevated priority.`,
              45
            )
          );
          curr = parent;
        } else {
          break;
        }
      }
    } else {
      // Sift-down
      let curr = index;
      const n = this.items.length;
      while (this.leftIndex(curr) < n) {
        const left = this.leftIndex(curr);
        const right = this.rightIndex(curr);
        let target = left;

        if (right < n && this.shouldPrioritize(this.items[right], this.items[left])) {
          target = right;
        }

        if (this.shouldPrioritize(this.items[target], this.items[curr])) {
          const temp = this.items[curr];
          this.items[curr] = this.items[target];
          this.items[target] = temp;

          steps.push(
            this.createStep(
              "change-priority-sift",
              null,
              [curr, target],
              target,
              null,
              `Sift-Down: Sunk "${temp.title}" downward to index [${target}] due to reduced priority.`,
              48
            )
          );
          curr = target;
        } else {
          break;
        }
      }
    }

    steps.push(
      this.createStep(
        "change-priority-done",
        null,
        null,
        null,
        null,
        `Priority modification complete for "${this.items[index]?.title || taskId}". Queue invariant fully restored.`,
        50
      )
    );

    return steps;
  }

  private heapifyInPlace(): void {
    const n = this.items.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.siftDownDirect(i, n);
    }
  }

  private siftDownDirect(i: number, n: number): void {
    let curr = i;
    while (this.leftIndex(curr) < n) {
      const left = this.leftIndex(curr);
      const right = this.rightIndex(curr);
      let target = left;

      if (right < n && this.shouldPrioritize(this.items[right], this.items[left])) {
        target = right;
      }

      if (this.shouldPrioritize(this.items[target], this.items[curr])) {
        const temp = this.items[curr];
        this.items[curr] = this.items[target];
        this.items[target] = temp;
        curr = target;
      } else {
        break;
      }
    }
  }

  private generateHeapifySteps(): PQStep[] {
    const steps: PQStep[] = [];
    const n = this.items.length;
    const startIdx = Math.floor(n / 2) - 1;

    for (let i = startIdx; i >= 0; i--) {
      let curr = i;
      while (this.leftIndex(curr) < n) {
        const left = this.leftIndex(curr);
        const right = this.rightIndex(curr);
        let target = left;

        if (right < n && this.shouldPrioritize(this.items[right], this.items[left])) {
          target = right;
        }

        if (this.shouldPrioritize(this.items[target], this.items[curr])) {
          const temp = this.items[curr];
          this.items[curr] = this.items[target];
          this.items[target] = temp;

          steps.push(
            this.createStep(
              "enqueue-swap",
              null,
              [curr, target],
              target,
              null,
              `Heapify: Swapped "${temp.title}" with dominant child "${this.items[curr].title}" at [${target}].`,
              12
            )
          );
          curr = target;
        } else {
          break;
        }
      }
    }

    steps.push(
      this.createStep(
        "idle",
        null,
        null,
        0,
        null,
        `Queue successfully reconstructed in ${this.mode === "max" ? "Max-Priority" : "Min-Priority"} order via linear O(n) Heapify.`,
        null
      )
    );

    return steps;
  }

  /**
   * Calculate 2D SVG coordinates for Complete Binary Tree display
   */
  public static calculateNodeCoordinates(
    items: PQItem[],
    svgWidth: number = 700,
    svgHeight: number = 340
  ): PQNodeCoord[] {
    const n = items.length;
    if (n === 0) return [];

    const coords: PQNodeCoord[] = [];
    const maxDepth = Math.floor(Math.log2(Math.max(1, n)));
    const verticalGap = Math.min(68, (svgHeight - 70) / Math.max(1, maxDepth));

    for (let i = 0; i < n; i++) {
      const depth = Math.floor(Math.log2(i + 1));
      const positionInLevel = i - (Math.pow(2, depth) - 1);
      const totalNodesInLevel = Math.pow(2, depth);

      const levelWidth = svgWidth - 60;
      const x = 30 + ((positionInLevel + 0.5) / totalNodesInLevel) * levelWidth;
      const y = 42 + depth * verticalGap;

      const parentIndex = i === 0 ? null : Math.floor((i - 1) / 2);
      const leftIndex = 2 * i + 1 < n ? 2 * i + 1 : null;
      const rightIndex = 2 * i + 2 < n ? 2 * i + 2 : null;

      coords.push({
        index: i,
        item: items[i],
        x,
        y,
        depth,
        parentIndex,
        leftIndex,
        rightIndex,
      });
    }

    return coords;
  }
}

// =========================================================================
// CURATED PRESETS
// =========================================================================

export const PQ_PRESET_OS_SCHEDULER: PQItem[] = [
  { id: "os-1", title: "Kernel Panic IRQ", priority: 99, category: "kernel", description: "Hardware interrupt handler" },
  { id: "os-2", title: "GPU V-Sync Render", priority: 90, category: "render", description: "Display refresh pipeline" },
  { id: "os-3", title: "Audio Mixer Stream", priority: 84, category: "io", description: "Real-time sound buffer" },
  { id: "os-4", title: "Network Packet Read", priority: 72, category: "io", description: "TCP socket incoming buffer" },
  { id: "os-5", title: "User Key Press", priority: 68, category: "normal", description: "Keyboard event dispatch" },
  { id: "os-6", title: "File Indexer", priority: 25, category: "low", description: "Background drive crawl" },
  { id: "os-7", title: "Garbage Collector", priority: 15, category: "low", description: "Heap memory reclamation" },
];

export const PQ_PRESET_HOSPITAL_TRIAGE: PQItem[] = [
  { id: "er-1", title: "Cardiac Arrest", priority: 98, category: "critical", description: "Immediate resuscitation required" },
  { id: "er-2", title: "Massive Trauma", priority: 92, category: "critical", description: "Operating theater prep" },
  { id: "er-3", title: "Severe Fracture", priority: 70, category: "high", description: "Orthopedic realignment" },
  { id: "er-4", title: "Pediatric High Fever", priority: 65, category: "normal", description: "Pediatric assessment" },
  { id: "er-5", title: "Deep Laceration", priority: 45, category: "normal", description: "Suturing & dressing" },
  { id: "er-6", title: "Mild Ankle Sprain", priority: 20, category: "low", description: "Routine outpatient walk-in" },
];

export const PQ_PRESET_DIJKSTRA_FRONTIER: PQItem[] = [
  { id: "dj-1", title: "Node S (Source)", priority: 0, category: "critical", description: "Initial starting vertex" },
  { id: "dj-2", title: "Node A (Edge S->A)", priority: 3, category: "high", description: "Tentative path distance = 3" },
  { id: "dj-3", title: "Node B (Edge S->B)", priority: 7, category: "normal", description: "Tentative path distance = 7" },
  { id: "dj-4", title: "Node C (Edge A->C)", priority: 11, category: "normal", description: "Tentative path distance = 11" },
  { id: "dj-5", title: "Node D (Edge B->D)", priority: 16, category: "low", description: "Tentative path distance = 16" },
  { id: "dj-6", title: "Node Target (End)", priority: 24, category: "low", description: "Tentative path distance = 24" },
];

export const PQ_PRESET_NETWORK_QOS: PQItem[] = [
  { id: "qos-1", title: "VoIP Audio (RTP)", priority: 95, category: "critical", description: "Zero-latency voice transmission" },
  { id: "qos-2", title: "WebRTC Video Call", priority: 88, category: "high", description: "Live interactive video frames" },
  { id: "qos-3", title: "Web API JSON", priority: 60, category: "normal", description: "HTTP REST response" },
  { id: "qos-4", title: "HTML Assets", priority: 40, category: "normal", description: "Static page delivery" },
  { id: "qos-5", title: "Cloud Backup Sync", priority: 10, category: "low", description: "Non-critical bulk upload" },
];
