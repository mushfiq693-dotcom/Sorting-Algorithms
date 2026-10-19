/**
 * Deque (Double-Ended Queue) Engine & Step Generator
 * Implements both Circular Buffer Array model and Doubly-Linked List model,
 * along with algorithmic demonstrations (Sliding Window Maximum & Palindrome Verification).
 */

export type DequeMode = "circular-array" | "doubly-linked";

export type DequeOperationType =
  | "idle"
  | "push-front"
  | "push-back"
  | "pop-front"
  | "pop-back"
  | "peek-front"
  | "peek-back"
  | "clear"
  | "overflow"
  | "underflow"
  | "sliding-window-init"
  | "sliding-window-inspect"
  | "sliding-window-pop-back"
  | "sliding-window-pop-front"
  | "sliding-window-push"
  | "sliding-window-record"
  | "sliding-window-complete"
  | "palindrome-init"
  | "palindrome-compare"
  | "palindrome-match"
  | "palindrome-mismatch"
  | "palindrome-complete";

export interface DequeNode {
  id: string;
  value: number | string;
  prevId: string | null;
  nextId: string | null;
  isHead?: boolean;
  isTail?: boolean;
}

export interface SlidingWindowState {
  array: number[];
  k: number;
  currentIndex: number;
  dequeIndices: number[];
  windowMaxResults: { windowRange: [number, number]; maxVal: number }[];
}

export interface PalindromeState {
  word: string;
  charsRemaining: string[];
  frontChar: string | null;
  backChar: string | null;
  isMatch: boolean | null;
  isPalindrome: boolean | null;
}

export interface DequeStep {
  type: DequeOperationType;
  description: string;
  codeLine: number;
  items: (number | string | null)[]; // Circular array slots
  capacity: number;
  size: number;
  frontIndex: number; // Front pointer in circular buffer
  rearIndex: number;  // Rear pointer in circular buffer
  highlightedIndices: number[];
  highlightedRole?: "front" | "rear" | "both" | "discard" | null;
  nodes: DequeNode[]; // Doubly-linked chain
  mode: DequeMode;
  slidingWindow?: SlidingWindowState | null;
  palindrome?: PalindromeState | null;
}

export class DequeEngine {
  private capacity: number;
  private buffer: (number | string | null)[];
  private front: number = 0;
  private rear: number = 0;
  private count: number = 0;
  private mode: DequeMode = "circular-array";
  private nodes: DequeNode[] = [];

  constructor(capacity = 8, initialItems: number[] = [15, 28, 42]) {
    this.capacity = capacity;
    this.buffer = new Array(capacity).fill(null);
    this.rebuildInitial(initialItems);
  }

  private rebuildInitial(items: number[]) {
    this.buffer = new Array(this.capacity).fill(null);
    this.nodes = [];
    this.front = 0;
    this.rear = 0;
    this.count = 0;

    let prevId: string | null = null;
    items.forEach((val, i) => {
      if (this.count < this.capacity) {
        if (i === 0) {
          this.buffer[0] = val;
          this.front = 0;
          this.rear = 0;
        } else {
          this.rear = (this.rear + 1) % this.capacity;
          this.buffer[this.rear] = val;
        }
        this.count++;

        const nodeId = `node-${Date.now()}-${i}`;
        const newNode: DequeNode = {
          id: nodeId,
          value: val,
          prevId,
          nextId: null,
          isHead: i === 0,
          isTail: false,
        };
        if (this.nodes.length > 0) {
          this.nodes[this.nodes.length - 1].nextId = nodeId;
        }
        this.nodes.push(newNode);
        prevId = nodeId;
      }
    });

    if (this.nodes.length > 0) {
      this.nodes[this.nodes.length - 1].isTail = true;
    }
  }

  public setMode(mode: DequeMode) {
    this.mode = mode;
  }

  public getCurrentStep(description?: string, codeLine: number = 1): DequeStep {
    return {
      type: "idle",
      description: description || `Deque initialized with ${this.count} elements. Capacity: ${this.capacity}. Both ends ready for O(1) operations.`,
      codeLine,
      items: [...this.buffer],
      capacity: this.capacity,
      size: this.count,
      frontIndex: this.count === 0 ? -1 : this.front,
      rearIndex: this.count === 0 ? -1 : this.rear,
      highlightedIndices: [],
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      mode: this.mode,
    };
  }

  // --- O(1) Push Front ---
  public pushFront(val: number | string): DequeStep[] {
    const steps: DequeStep[] = [];

    if (this.count >= this.capacity) {
      steps.push({
        type: "overflow",
        description: `Deque Overflow: Cannot push ${val} to Front. Maximum capacity of ${this.capacity} reached.`,
        codeLine: 4,
        items: [...this.buffer],
        capacity: this.capacity,
        size: this.count,
        frontIndex: this.front,
        rearIndex: this.rear,
        highlightedIndices: [this.front],
        highlightedRole: "discard",
        nodes: JSON.parse(JSON.stringify(this.nodes)),
        mode: this.mode,
      });
      return steps;
    }

    if (this.count === 0) {
      this.front = 0;
      this.rear = 0;
    } else {
      // Circular decrement: (front - 1 + capacity) % capacity
      this.front = (this.front - 1 + this.capacity) % this.capacity;
    }

    this.buffer[this.front] = val;
    this.count++;

    // Update doubly-linked nodes
    const newNodeId = `node-${Date.now()}`;
    const newHeadNode: DequeNode = {
      id: newNodeId,
      value: val,
      prevId: null,
      nextId: this.nodes.length > 0 ? this.nodes[0].id : null,
      isHead: true,
      isTail: this.nodes.length === 0,
    };
    if (this.nodes.length > 0) {
      this.nodes[0].prevId = newNodeId;
      this.nodes[0].isHead = false;
    }
    this.nodes.unshift(newHeadNode);

    steps.push({
      type: "push-front",
      description: `Push Front: Inserted ${val} at front index [${this.front}]. Modulo wrap formula: front = (front - 1 + capacity) % capacity. Size is now ${this.count}/${this.capacity}.`,
      codeLine: 6,
      items: [...this.buffer],
      capacity: this.capacity,
      size: this.count,
      frontIndex: this.front,
      rearIndex: this.rear,
      highlightedIndices: [this.front],
      highlightedRole: "front",
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      mode: this.mode,
    });

    return steps;
  }

  // --- O(1) Push Back ---
  public pushBack(val: number | string): DequeStep[] {
    const steps: DequeStep[] = [];

    if (this.count >= this.capacity) {
      steps.push({
        type: "overflow",
        description: `Deque Overflow: Cannot push ${val} to Rear. Maximum capacity of ${this.capacity} reached.`,
        codeLine: 12,
        items: [...this.buffer],
        capacity: this.capacity,
        size: this.count,
        frontIndex: this.front,
        rearIndex: this.rear,
        highlightedIndices: [this.rear],
        highlightedRole: "discard",
        nodes: JSON.parse(JSON.stringify(this.nodes)),
        mode: this.mode,
      });
      return steps;
    }

    if (this.count === 0) {
      this.front = 0;
      this.rear = 0;
    } else {
      // Circular increment: (rear + 1) % capacity
      this.rear = (this.rear + 1) % this.capacity;
    }

    this.buffer[this.rear] = val;
    this.count++;

    // Update doubly-linked nodes
    const newNodeId = `node-${Date.now()}`;
    const newTailNode: DequeNode = {
      id: newNodeId,
      value: val,
      prevId: this.nodes.length > 0 ? this.nodes[this.nodes.length - 1].id : null,
      nextId: null,
      isHead: this.nodes.length === 0,
      isTail: true,
    };
    if (this.nodes.length > 0) {
      this.nodes[this.nodes.length - 1].nextId = newNodeId;
      this.nodes[this.nodes.length - 1].isTail = false;
    }
    this.nodes.push(newTailNode);

    steps.push({
      type: "push-back",
      description: `Push Back: Inserted ${val} at rear index [${this.rear}]. Modulo wrap formula: rear = (rear + 1) % capacity. Size is now ${this.count}/${this.capacity}.`,
      codeLine: 14,
      items: [...this.buffer],
      capacity: this.capacity,
      size: this.count,
      frontIndex: this.front,
      rearIndex: this.rear,
      highlightedIndices: [this.rear],
      highlightedRole: "rear",
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      mode: this.mode,
    });

    return steps;
  }

  // --- O(1) Pop Front ---
  public popFront(): DequeStep[] {
    const steps: DequeStep[] = [];

    if (this.count === 0) {
      steps.push({
        type: "underflow",
        description: "Deque Underflow: Cannot pop from Front. The Deque is completely empty.",
        codeLine: 20,
        items: [...this.buffer],
        capacity: this.capacity,
        size: 0,
        frontIndex: -1,
        rearIndex: -1,
        highlightedIndices: [],
        nodes: [],
        mode: this.mode,
      });
      return steps;
    }

    const removedVal = this.buffer[this.front];
    const oldFront = this.front;
    this.buffer[this.front] = null;
    this.count--;

    if (this.count === 0) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.front = (this.front + 1) % this.capacity;
    }

    // Update doubly-linked nodes
    if (this.nodes.length > 0) {
      this.nodes.shift();
      if (this.nodes.length > 0) {
        this.nodes[0].prevId = null;
        this.nodes[0].isHead = true;
      }
    }

    steps.push({
      type: "pop-front",
      description: `Pop Front: Extracted ${removedVal} from front index [${oldFront}]. New front shifted to [${this.count === 0 ? "none" : this.front}]. Size: ${this.count}/${this.capacity}.`,
      codeLine: 22,
      items: [...this.buffer],
      capacity: this.capacity,
      size: this.count,
      frontIndex: this.count === 0 ? -1 : this.front,
      rearIndex: this.count === 0 ? -1 : this.rear,
      highlightedIndices: [oldFront],
      highlightedRole: "front",
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      mode: this.mode,
    });

    return steps;
  }

  // --- O(1) Pop Back ---
  public popBack(): DequeStep[] {
    const steps: DequeStep[] = [];

    if (this.count === 0) {
      steps.push({
        type: "underflow",
        description: "Deque Underflow: Cannot pop from Rear. The Deque is completely empty.",
        codeLine: 28,
        items: [...this.buffer],
        capacity: this.capacity,
        size: 0,
        frontIndex: -1,
        rearIndex: -1,
        highlightedIndices: [],
        nodes: [],
        mode: this.mode,
      });
      return steps;
    }

    const removedVal = this.buffer[this.rear];
    const oldRear = this.rear;
    this.buffer[this.rear] = null;
    this.count--;

    if (this.count === 0) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.rear = (this.rear - 1 + this.capacity) % this.capacity;
    }

    // Update doubly-linked nodes
    if (this.nodes.length > 0) {
      this.nodes.pop();
      if (this.nodes.length > 0) {
        this.nodes[this.nodes.length - 1].nextId = null;
        this.nodes[this.nodes.length - 1].isTail = true;
      }
    }

    steps.push({
      type: "pop-back",
      description: `Pop Back: Extracted ${removedVal} from rear index [${oldRear}]. New rear shifted to [${this.count === 0 ? "none" : this.rear}]. Size: ${this.count}/${this.capacity}.`,
      codeLine: 30,
      items: [...this.buffer],
      capacity: this.capacity,
      size: this.count,
      frontIndex: this.count === 0 ? -1 : this.front,
      rearIndex: this.count === 0 ? -1 : this.rear,
      highlightedIndices: [oldRear],
      highlightedRole: "rear",
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      mode: this.mode,
    });

    return steps;
  }

  // --- O(1) Peek Front ---
  public peekFront(): DequeStep[] {
    if (this.count === 0) {
      return [
        {
          type: "underflow",
          description: "Peek Front: Deque is empty. No element at front.",
          codeLine: 36,
          items: [...this.buffer],
          capacity: this.capacity,
          size: 0,
          frontIndex: -1,
          rearIndex: -1,
          highlightedIndices: [],
          nodes: [],
          mode: this.mode,
        },
      ];
    }

    return [
      {
        type: "peek-front",
        description: `Peek Front: Front element is ${this.buffer[this.front]} at index [${this.front}]. Operation is O(1) non-destructive.`,
        codeLine: 38,
        items: [...this.buffer],
        capacity: this.capacity,
        size: this.count,
        frontIndex: this.front,
        rearIndex: this.rear,
        highlightedIndices: [this.front],
        highlightedRole: "front",
        nodes: JSON.parse(JSON.stringify(this.nodes)),
        mode: this.mode,
      },
    ];
  }

  // --- O(1) Peek Back ---
  public peekBack(): DequeStep[] {
    if (this.count === 0) {
      return [
        {
          type: "underflow",
          description: "Peek Back: Deque is empty. No element at rear.",
          codeLine: 42,
          items: [...this.buffer],
          capacity: this.capacity,
          size: 0,
          frontIndex: -1,
          rearIndex: -1,
          highlightedIndices: [],
          nodes: [],
          mode: this.mode,
        },
      ];
    }

    return [
      {
        type: "peek-back",
        description: `Peek Back: Rear element is ${this.buffer[this.rear]} at index [${this.rear}]. Operation is O(1) non-destructive.`,
        codeLine: 44,
        items: [...this.buffer],
        capacity: this.capacity,
        size: this.count,
        frontIndex: this.front,
        rearIndex: this.rear,
        highlightedIndices: [this.rear],
        highlightedRole: "rear",
        nodes: JSON.parse(JSON.stringify(this.nodes)),
        mode: this.mode,
      },
    ];
  }

  // --- Clear ---
  public clear(): DequeStep[] {
    this.buffer = new Array(this.capacity).fill(null);
    this.nodes = [];
    this.front = 0;
    this.rear = 0;
    this.count = 0;

    return [
      {
        type: "clear",
        description: `Deque Cleared: All ${this.capacity} circular buffer slots reset to empty.`,
        codeLine: 48,
        items: [...this.buffer],
        capacity: this.capacity,
        size: 0,
        frontIndex: -1,
        rearIndex: -1,
        highlightedIndices: [],
        nodes: [],
        mode: this.mode,
      },
    ];
  }

  // --- Sliding Window Maximum Generator ---
  public generateSlidingWindowSteps(arr: number[] = [1, 3, -1, -3, 5, 3, 6, 7], k: number = 3): DequeStep[] {
    const steps: DequeStep[] = [];
    const deque: number[] = []; // Stores INDICES in monotonic decreasing order
    const results: { windowRange: [number, number]; maxVal: number }[] = [];

    steps.push({
      type: "sliding-window-init",
      description: `Sliding Window Maximum initialized. Array length: ${arr.length}, Window Size k = ${k}. Monotonic Deque will store candidate indices in decreasing value order.`,
      codeLine: 52,
      items: deque.map((idx) => arr[idx]),
      capacity: k + 1,
      size: 0,
      frontIndex: -1,
      rearIndex: -1,
      highlightedIndices: [],
      nodes: [],
      mode: "circular-array",
      slidingWindow: {
        array: [...arr],
        k,
        currentIndex: 0,
        dequeIndices: [],
        windowMaxResults: [],
      },
    });

    for (let i = 0; i < arr.length; i++) {
      const currentVal = arr[i];

      // 1. Inspect current element
      steps.push({
        type: "sliding-window-inspect",
        description: `Step i = ${i}: Examining element arr[${i}] = ${currentVal}. Window bounds: [${Math.max(0, i - k + 1)} .. ${i}].`,
        codeLine: 56,
        items: deque.map((idx) => arr[idx]),
        capacity: k + 1,
        size: deque.length,
        frontIndex: deque.length > 0 ? 0 : -1,
        rearIndex: deque.length > 0 ? deque.length - 1 : -1,
        highlightedIndices: [i],
        nodes: [],
        mode: "circular-array",
        slidingWindow: {
          array: [...arr],
          k,
          currentIndex: i,
          dequeIndices: [...deque],
          windowMaxResults: [...results],
        },
      });

      // 2. Remove indices outside the current window from FRONT (i - k)
      if (deque.length > 0 && deque[0] <= i - k) {
        const evictedIdx = deque.shift()!;
        steps.push({
          type: "sliding-window-pop-front",
          description: `Window Out-of-Bounds: Index [${evictedIdx}] (value ${arr[evictedIdx]}) fell outside window [${i - k + 1} .. ${i}]. Popped from FRONT in O(1).`,
          codeLine: 58,
          items: deque.map((idx) => arr[idx]),
          capacity: k + 1,
          size: deque.length,
          frontIndex: deque.length > 0 ? 0 : -1,
          rearIndex: deque.length > 0 ? deque.length - 1 : -1,
          highlightedIndices: [evictedIdx],
          highlightedRole: "discard",
          nodes: [],
          mode: "circular-array",
          slidingWindow: {
            array: [...arr],
            k,
            currentIndex: i,
            dequeIndices: [...deque],
            windowMaxResults: [...results],
          },
        });
      }

      // 3. Remove smaller elements from BACK of deque to preserve monotonic decreasing order
      while (deque.length > 0 && arr[deque[deque.length - 1]] <= currentVal) {
        const poppedIdx = deque.pop()!;
        steps.push({
          type: "sliding-window-pop-back",
          description: `Monotonic Invariant: arr[${poppedIdx}] = ${arr[poppedIdx]} is <= current incoming ${currentVal}. Popped from REAR because it can never be the maximum of this or future windows!`,
          codeLine: 62,
          items: deque.map((idx) => arr[idx]),
          capacity: k + 1,
          size: deque.length,
          frontIndex: deque.length > 0 ? 0 : -1,
          rearIndex: deque.length > 0 ? deque.length - 1 : -1,
          highlightedIndices: [poppedIdx],
          highlightedRole: "discard",
          nodes: [],
          mode: "circular-array",
          slidingWindow: {
            array: [...arr],
            k,
            currentIndex: i,
            dequeIndices: [...deque],
            windowMaxResults: [...results],
          },
        });
      }

      // 4. Push current index to BACK
      deque.push(i);
      steps.push({
        type: "sliding-window-push",
        description: `Pushed index [${i}] (value ${currentVal}) to REAR of deque. Monotonic decreasing invariant preserved.`,
        codeLine: 65,
        items: deque.map((idx) => arr[idx]),
        capacity: k + 1,
        size: deque.length,
        frontIndex: 0,
        rearIndex: deque.length - 1,
        highlightedIndices: [i],
        highlightedRole: "rear",
        nodes: [],
        mode: "circular-array",
        slidingWindow: {
          array: [...arr],
          k,
          currentIndex: i,
          dequeIndices: [...deque],
          windowMaxResults: [...results],
        },
      });

      // 5. If window has reached size k, record the maximum at FRONT
      if (i >= k - 1) {
        const maxIdx = deque[0];
        const maxVal = arr[maxIdx];
        results.push({ windowRange: [i - k + 1, i], maxVal });

        steps.push({
          type: "sliding-window-record",
          description: `Window [${i - k + 1} .. ${i}] complete! Maximum is arr[${maxIdx}] = ${maxVal} (read from FRONT in O(1)).`,
          codeLine: 69,
          items: deque.map((idx) => arr[idx]),
          capacity: k + 1,
          size: deque.length,
          frontIndex: 0,
          rearIndex: deque.length - 1,
          highlightedIndices: [maxIdx],
          highlightedRole: "front",
          nodes: [],
          mode: "circular-array",
          slidingWindow: {
            array: [...arr],
            k,
            currentIndex: i,
            dequeIndices: [...deque],
            windowMaxResults: [...results],
          },
        });
      }
    }

    steps.push({
      type: "sliding-window-complete",
      description: `Sliding Window Maximum Complete! All ${results.length} windows computed in O(N) linear time because each index is pushed and popped at most once.`,
      codeLine: 74,
      items: deque.map((idx) => arr[idx]),
      capacity: k + 1,
      size: deque.length,
      frontIndex: deque.length > 0 ? 0 : -1,
      rearIndex: deque.length > 0 ? deque.length - 1 : -1,
      highlightedIndices: [],
      nodes: [],
      mode: "circular-array",
      slidingWindow: {
        array: [...arr],
        k,
        currentIndex: arr.length - 1,
        dequeIndices: [...deque],
        windowMaxResults: [...results],
      },
    });

    return steps;
  }

  // --- Palindrome Verification Generator ---
  public generatePalindromeSteps(rawWord: string = "RACECAR"): DequeStep[] {
    const steps: DequeStep[] = [];
    const word = rawWord.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const deque = word.split("");

    steps.push({
      type: "palindrome-init",
      description: `Palindrome Verification: Loaded word "${word}" (${deque.length} characters) into Deque. We will simultaneously pop Front and Back to compare characters.`,
      codeLine: 80,
      items: [...deque],
      capacity: deque.length,
      size: deque.length,
      frontIndex: 0,
      rearIndex: deque.length - 1,
      highlightedIndices: [0, deque.length - 1],
      highlightedRole: "both",
      nodes: [],
      mode: "circular-array",
      palindrome: {
        word,
        charsRemaining: [...deque],
        frontChar: null,
        backChar: null,
        isMatch: null,
        isPalindrome: null,
      },
    });

    let isPal = true;
    while (deque.length > 1) {
      const frontChar = deque.shift()!;
      const backChar = deque.pop()!;
      const match = frontChar === backChar;

      steps.push({
        type: "palindrome-compare",
        description: `Extracted Front '${frontChar}' and Rear '${backChar}'. Comparing '${frontChar}' == '${backChar}'...`,
        codeLine: 84,
        items: [...deque],
        capacity: word.length,
        size: deque.length,
        frontIndex: deque.length > 0 ? 0 : -1,
        rearIndex: deque.length > 0 ? deque.length - 1 : -1,
        highlightedIndices: [],
        nodes: [],
        mode: "circular-array",
        palindrome: {
          word,
          charsRemaining: [...deque],
          frontChar,
          backChar,
          isMatch: match,
          isPalindrome: null,
        },
      });

      if (!match) {
        isPal = false;
        steps.push({
          type: "palindrome-mismatch",
          description: `Mismatch detected! Front '${frontChar}' != Rear '${backChar}'. String "${word}" is NOT a palindrome.`,
          codeLine: 86,
          items: [...deque],
          capacity: word.length,
          size: deque.length,
          frontIndex: deque.length > 0 ? 0 : -1,
          rearIndex: deque.length > 0 ? deque.length - 1 : -1,
          highlightedIndices: [],
          highlightedRole: "discard",
          nodes: [],
          mode: "circular-array",
          palindrome: {
            word,
            charsRemaining: [...deque],
            frontChar,
            backChar,
            isMatch: false,
            isPalindrome: false,
          },
        });
        break;
      } else {
        steps.push({
          type: "palindrome-match",
          description: `Match verified! '${frontChar}' === '${backChar}'. Remaining characters in deque: [${deque.join(", ") || "none"}].`,
          codeLine: 88,
          items: [...deque],
          capacity: word.length,
          size: deque.length,
          frontIndex: deque.length > 0 ? 0 : -1,
          rearIndex: deque.length > 0 ? deque.length - 1 : -1,
          highlightedIndices: [],
          nodes: [],
          mode: "circular-array",
          palindrome: {
            word,
            charsRemaining: [...deque],
            frontChar,
            backChar,
            isMatch: true,
            isPalindrome: null,
          },
        });
      }
    }

    if (isPal) {
      steps.push({
        type: "palindrome-complete",
        description: `Verification Complete: "${word}" is a VALID PALINDROME! Symmetric inward Deque scan confirmed in O(N/2) comparisons.`,
        codeLine: 92,
        items: [...deque],
        capacity: word.length,
        size: deque.length,
        frontIndex: deque.length > 0 ? 0 : -1,
        rearIndex: deque.length > 0 ? deque.length - 1 : -1,
        highlightedIndices: [],
        nodes: [],
        mode: "circular-array",
        palindrome: {
          word,
          charsRemaining: [...deque],
          frontChar: null,
          backChar: null,
          isMatch: true,
          isPalindrome: true,
        },
      });
    }

    return steps;
  }
}
