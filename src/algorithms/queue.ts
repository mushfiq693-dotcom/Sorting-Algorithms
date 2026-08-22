import { QueueOperation } from "@/types/topic";

export interface QueueNode {
  value: number;
  id: string;
}

export interface QueueState {
  items: (number | null)[];
  activeCount: number;
  capacity: number;
  frontIndex: number;
  rearIndex: number;
  isCircular: boolean;
  lastOperation: QueueOperation | null;
  history: QueueOperation[];
}

export class QueueEngine {
  private buffer: (number | null)[];
  private capacity: number;
  private front: number = 0;
  private rear: number = -1;
  private count: number = 0;
  private isCircularMode: boolean;
  private history: QueueOperation[] = [];

  constructor(capacity = 8, isCircular = true, initialItems: number[] = [10, 20, 30]) {
    this.capacity = capacity;
    this.isCircularMode = isCircular;
    this.buffer = new Array(capacity).fill(null);

    // Populate initial items
    for (const val of initialItems) {
      if (this.count < this.capacity) {
        this.rear = (this.rear + 1) % this.capacity;
        this.buffer[this.rear] = val;
        this.count++;
      }
    }
  }

  public getState(): QueueState {
    return {
      items: [...this.buffer],
      activeCount: this.count,
      capacity: this.capacity,
      frontIndex: this.count === 0 ? -1 : this.front,
      rearIndex: this.count === 0 ? -1 : this.rear,
      isCircular: this.isCircularMode,
      lastOperation: this.history[this.history.length - 1] || null,
      history: [...this.history],
    };
  }

  public setCircularMode(enable: boolean) {
    this.isCircularMode = enable;
  }

  public enqueue(val: number): { success: boolean; error?: string; operation: QueueOperation } {
    if (this.count >= this.capacity) {
      const op: QueueOperation = {
        type: "overflow",
        value: val,
        description: `Queue Overflow: Cannot enqueue ${val}. Queue has reached maximum capacity of ${this.capacity} slots.`,
      };
      this.history.push(op);
      return { success: false, error: op.description, operation: op };
    }

    this.rear = (this.rear + 1) % this.capacity;
    this.buffer[this.rear] = val;
    this.count++;

    const op: QueueOperation = {
      type: "enqueue",
      value: val,
      index: this.rear,
      description: `Enqueue: Added ${val} at rear pointer index [${this.rear}]. (Size: ${this.count}/${this.capacity})`,
    };
    this.history.push(op);
    return { success: true, operation: op };
  }

  public dequeue(): { success: boolean; value?: number; error?: string; operation: QueueOperation } {
    if (this.count === 0) {
      const op: QueueOperation = {
        type: "underflow",
        description: "Queue Underflow: Cannot dequeue from an empty queue.",
      };
      this.history.push(op);
      return { success: false, error: op.description, operation: op };
    }

    const dequeuedVal = this.buffer[this.front]!;
    this.buffer[this.front] = null;
    const oldFront = this.front;
    this.front = (this.front + 1) % this.capacity;
    this.count--;

    const op: QueueOperation = {
      type: "dequeue",
      value: dequeuedVal,
      index: oldFront,
      description: `Dequeue: Removed front item ${dequeuedVal} from index [${oldFront}]. New front is at index [${this.count > 0 ? this.front : "NONE"}].`,
    };
    this.history.push(op);
    return { success: true, value: dequeuedVal, operation: op };
  }

  public getFront(): { success: boolean; value?: number; error?: string; operation: QueueOperation } {
    if (this.count === 0) {
      const op: QueueOperation = {
        type: "underflow",
        description: "Queue Underflow: Cannot inspect front of an empty queue.",
      };
      this.history.push(op);
      return { success: false, error: op.description, operation: op };
    }

    const frontVal = this.buffer[this.front]!;
    const op: QueueOperation = {
      type: "front",
      value: frontVal,
      index: this.front,
      description: `Front: Next element to be dequeued is ${frontVal} at index [${this.front}].`,
    };
    this.history.push(op);
    return { success: true, value: frontVal, operation: op };
  }

  public clear(): QueueOperation {
    this.buffer = new Array(this.capacity).fill(null);
    this.front = 0;
    this.rear = -1;
    this.count = 0;

    const op: QueueOperation = {
      type: "clear",
      description: "Cleared all elements from the queue. Reset front = 0 and rear = -1.",
    };
    this.history.push(op);
    return op;
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }

  public isFull(): boolean {
    return this.count >= this.capacity;
  }

  public size(): number {
    return this.count;
  }
}
