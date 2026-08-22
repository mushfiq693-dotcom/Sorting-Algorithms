import { StackOperation } from "@/types/topic";

export interface StackNode {
  value: number;
  id: string;
}

export interface StackState {
  items: number[];
  nodes: StackNode[];
  capacity: number;
  topIndex: number; // -1 if empty
  lastOperation: StackOperation | null;
  history: StackOperation[];
}

export class StackEngine {
  private items: number[] = [];
  private capacity: number;
  private history: StackOperation[] = [];

  constructor(capacity = 8, initialItems: number[] = [12, 45, 78]) {
    this.capacity = capacity;
    this.items = initialItems.slice(0, capacity);
  }

  public getState(): StackState {
    return {
      items: [...this.items],
      nodes: this.items.map((val, idx) => ({
        value: val,
        id: `node-${idx}-${val}`,
      })),
      capacity: this.capacity,
      topIndex: this.items.length - 1,
      lastOperation: this.history[this.history.length - 1] || null,
      history: [...this.history],
    };
  }

  public push(val: number): { success: boolean; error?: string; operation: StackOperation } {
    if (this.items.length >= this.capacity) {
      const op: StackOperation = {
        type: "overflow",
        value: val,
        description: `Stack Overflow: Cannot push ${val}. Stack has reached maximum capacity of ${this.capacity} elements.`,
      };
      this.history.push(op);
      return { success: false, error: op.description, operation: op };
    }

    this.items.push(val);
    const newTop = this.items.length - 1;
    const op: StackOperation = {
      type: "push",
      value: val,
      index: newTop,
      description: `Push: Added ${val} onto the top of the stack at index [${newTop}].`,
    };
    this.history.push(op);
    return { success: true, operation: op };
  }

  public pop(): { success: boolean; value?: number; error?: string; operation: StackOperation } {
    if (this.items.length === 0) {
      const op: StackOperation = {
        type: "underflow",
        description: "Stack Underflow: Cannot pop from an empty stack (top = -1).",
      };
      this.history.push(op);
      return { success: false, error: op.description, operation: op };
    }

    const poppedVal = this.items.pop()!;
    const op: StackOperation = {
      type: "pop",
      value: poppedVal,
      index: this.items.length,
      description: `Pop: Removed top element ${poppedVal} from the stack. New top is ${this.items.length > 0 ? `[${this.items[this.items.length - 1]}]` : "EMPTY"}.`,
    };
    this.history.push(op);
    return { success: true, value: poppedVal, operation: op };
  }

  public peek(): { success: boolean; value?: number; error?: string; operation: StackOperation } {
    if (this.items.length === 0) {
      const op: StackOperation = {
        type: "underflow",
        description: "Stack Underflow: Cannot peek into an empty stack.",
      };
      this.history.push(op);
      return { success: false, error: op.description, operation: op };
    }

    const topVal = this.items[this.items.length - 1];
    const op: StackOperation = {
      type: "peek",
      value: topVal,
      index: this.items.length - 1,
      description: `Peek: Top element is ${topVal} at index [${this.items.length - 1}] without modifying the stack.`,
    };
    this.history.push(op);
    return { success: true, value: topVal, operation: op };
  }

  public clear(): StackOperation {
    this.items = [];
    const op: StackOperation = {
      type: "clear",
      description: "Cleared all elements from the stack. Top reset to -1.",
    };
    this.history.push(op);
    return op;
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public isFull(): boolean {
    return this.items.length >= this.capacity;
  }

  public size(): number {
    return this.items.length;
  }
}
