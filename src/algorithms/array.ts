export type ArrayOperationType =
  | "idle"
  | "access"
  | "update"
  | "insert-start"
  | "insert-shift"
  | "insert-place"
  | "delete-start"
  | "delete-shift"
  | "delete-complete"
  | "search-step"
  | "search-complete"
  | "resize-start"
  | "resize-copy"
  | "resize-complete"
  | "error";

export interface ArrayStep {
  type: ArrayOperationType;
  description: string;
  items: (number | null)[];
  capacity: number;
  size: number;
  highlightedIndices: number[];
  targetIndex: number | null;
  shiftIndices?: { from: number; to: number } | null;
  searchValue?: number | null;
  searchFound?: boolean;
  baseAddress: number;
  elementSize: number;
  isResizing?: boolean;
  oldBuffer?: { items: (number | null)[]; capacity: number; baseAddress: number } | null;
  formulaHighlight?: {
    index: number;
    baseAddress: number;
    elementSize: number;
    computedAddress: string;
  } | null;
}

export interface ArrayState {
  items: (number | null)[];
  size: number;
  capacity: number;
  mode: "static" | "dynamic";
  baseAddress: number;
  elementSize: number;
  history: ArrayStep[];
}

export const BASE_MEMORY_ADDRESS = 0x7FFF00;
export const ELEMENT_SIZE_BYTES = 4; // 32-bit integer (4 bytes)

export function formatHexAddress(base: number, index: number, elementSize = ELEMENT_SIZE_BYTES): string {
  const addr = base + index * elementSize;
  return `0x${addr.toString(16).toUpperCase()}`;
}

export class ArrayEngine {
  private items: (number | null)[];
  private size: number;
  private capacity: number;
  private mode: "static" | "dynamic";
  private baseAddress: number;
  private elementSize: number;

  constructor(
    initialCapacity = 8,
    initialItems: number[] = [14, 28, 42, 56, 70],
    mode: "static" | "dynamic" = "dynamic",
    baseAddress = BASE_MEMORY_ADDRESS
  ) {
    this.capacity = Math.max(initialCapacity, initialItems.length);
    this.size = initialItems.length;
    this.mode = mode;
    this.baseAddress = baseAddress;
    this.elementSize = ELEMENT_SIZE_BYTES;
    this.items = new Array(this.capacity).fill(null);
    for (let i = 0; i < initialItems.length; i++) {
      this.items[i] = initialItems[i];
    }
  }

  public getState(): ArrayState {
    return {
      items: [...this.items],
      size: this.size,
      capacity: this.capacity,
      mode: this.mode,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
      history: [],
    };
  }

  public setMode(mode: "static" | "dynamic"): ArrayStep {
    this.mode = mode;
    return {
      type: "idle",
      description: `Switched mode to ${mode === "static" ? "Static Fixed-Capacity Array" : "Dynamic Auto-Resizing Array (Vector / ArrayList)"}.`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [],
      targetIndex: null,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
    };
  }

  public access(index: number): { success: boolean; steps: ArrayStep[] } {
    const steps: ArrayStep[] = [];
    if (index < 0 || index >= this.size) {
      steps.push({
        type: "error",
        description: `IndexOutOfBoundsException: Index ${index} is outside valid bounds [0, ${Math.max(0, this.size - 1)}].`,
        items: [...this.items],
        capacity: this.capacity,
        size: this.size,
        highlightedIndices: [],
        targetIndex: index,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
      });
      return { success: false, steps };
    }

    const val = this.items[index];
    const computedAddr = formatHexAddress(this.baseAddress, index, this.elementSize);

    steps.push({
      type: "access",
      description: `Access: arr[${index}] = ${val}. Direct memory address computed in O(1) time via: ${formatHexAddress(this.baseAddress, 0)} + (${index} × ${this.elementSize}B) = ${computedAddr}.`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [index],
      targetIndex: index,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
      formulaHighlight: {
        index,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
        computedAddress: computedAddr,
      },
    });

    return { success: true, steps };
  }

  public update(index: number, newValue: number): { success: boolean; steps: ArrayStep[] } {
    const steps: ArrayStep[] = [];
    if (index < 0 || index >= this.size) {
      steps.push({
        type: "error",
        description: `IndexOutOfBoundsException: Cannot update index ${index}. Valid range is [0, ${Math.max(0, this.size - 1)}].`,
        items: [...this.items],
        capacity: this.capacity,
        size: this.size,
        highlightedIndices: [],
        targetIndex: index,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
      });
      return { success: false, steps };
    }

    const oldVal = this.items[index];
    this.items[index] = newValue;
    const computedAddr = formatHexAddress(this.baseAddress, index, this.elementSize);

    steps.push({
      type: "update",
      description: `Update: arr[${index}] modified from ${oldVal} → ${newValue} in place in O(1) time at address ${computedAddr}.`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [index],
      targetIndex: index,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
      formulaHighlight: {
        index,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
        computedAddress: computedAddr,
      },
    });

    return { success: true, steps };
  }

  public insert(index: number, value: number): { success: boolean; steps: ArrayStep[] } {
    const steps: ArrayStep[] = [];

    if (index < 0 || index > this.size) {
      steps.push({
        type: "error",
        description: `IndexOutOfBoundsException: Cannot insert at index ${index}. Valid insertion range is [0, ${this.size}].`,
        items: [...this.items],
        capacity: this.capacity,
        size: this.size,
        highlightedIndices: [],
        targetIndex: index,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
      });
      return { success: false, steps };
    }

    // Check capacity overflow
    if (this.size >= this.capacity) {
      if (this.mode === "static") {
        steps.push({
          type: "error",
          description: `ArrayBufferOverflow: Static array reached maximum capacity of ${this.capacity}. Cannot insert without allocating a new buffer.`,
          items: [...this.items],
          capacity: this.capacity,
          size: this.size,
          highlightedIndices: [],
          targetIndex: index,
          baseAddress: this.baseAddress,
          elementSize: this.elementSize,
        });
        return { success: false, steps };
      }

      // Dynamic array geometric reallocation
      const resizeSteps = this.performGeometricResizeSteps();
      steps.push(...resizeSteps);
    }

    steps.push({
      type: "insert-start",
      description: `Insert: Preparing to insert ${value} at index [${index}]. Need to shift elements in range [${index}..${this.size - 1}] one slot to the right.`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [index],
      targetIndex: index,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
    });

    // Step-by-step right shift from back to index
    for (let i = this.size - 1; i >= index; i--) {
      this.items[i + 1] = this.items[i];
      const nextArr = [...this.items];
      steps.push({
        type: "insert-shift",
        description: `Shift Right: Moving element ${this.items[i]} from index [${i}] → [${i + 1}] to open slot [${index}].`,
        items: nextArr,
        capacity: this.capacity,
        size: this.size,
        highlightedIndices: [i, i + 1],
        targetIndex: index,
        shiftIndices: { from: i, to: i + 1 },
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
      });
    }

    // Place the new element
    this.items[index] = value;
    this.size += 1;
    const finalAddr = formatHexAddress(this.baseAddress, index, this.elementSize);

    steps.push({
      type: "insert-place",
      description: `Insert Complete: Placed ${value} into slot [${index}] (Address ${finalAddr}). Total elements shifted: ${this.size - 1 - index}. Complexity: O(n - index) = ${index === 0 ? "O(n) Worst Case (Front Insert)" : index === this.size - 1 ? "O(1) Best Case (Back Insert)" : "O(n) Average Case"}.`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [index],
      targetIndex: index,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
      formulaHighlight: {
        index,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
        computedAddress: finalAddr,
      },
    });

    return { success: true, steps };
  }

  public append(value: number): { success: boolean; steps: ArrayStep[] } {
    return this.insert(this.size, value);
  }

  public delete(index: number): { success: boolean; steps: ArrayStep[] } {
    const steps: ArrayStep[] = [];

    if (this.size === 0) {
      steps.push({
        type: "error",
        description: "ArrayUnderflow: Cannot delete from an empty array (size = 0).",
        items: [...this.items],
        capacity: this.capacity,
        size: 0,
        highlightedIndices: [],
        targetIndex: null,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
      });
      return { success: false, steps };
    }

    if (index < 0 || index >= this.size) {
      steps.push({
        type: "error",
        description: `IndexOutOfBoundsException: Cannot delete index ${index}. Valid index range is [0, ${this.size - 1}].`,
        items: [...this.items],
        capacity: this.capacity,
        size: this.size,
        highlightedIndices: [],
        targetIndex: index,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
      });
      return { success: false, steps };
    }

    const removedValue = this.items[index];

    steps.push({
      type: "delete-start",
      description: `Delete: Removing element ${removedValue} from index [${index}]. Subsequent elements will shift left to fill the gap.`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [index],
      targetIndex: index,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
    });

    // Step-by-step left shift
    for (let i = index; i < this.size - 1; i++) {
      this.items[i] = this.items[i + 1];
      const nextArr = [...this.items];
      steps.push({
        type: "delete-shift",
        description: `Shift Left: Moving element ${this.items[i]} from index [${i + 1}] → [${i}].`,
        items: nextArr,
        capacity: this.capacity,
        size: this.size,
        highlightedIndices: [i, i + 1],
        targetIndex: index,
        shiftIndices: { from: i + 1, to: i },
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
      });
    }

    this.items[this.size - 1] = null;
    this.size -= 1;

    steps.push({
      type: "delete-complete",
      description: `Delete Complete: Successfully removed ${removedValue}. New array size is ${this.size}. Complexity: O(n - index) = ${index === 0 ? "O(n) Worst Case (Front Delete)" : index === this.size ? "O(1) Best Case (Back Pop)" : "O(n) Average Case"}.`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [],
      targetIndex: null,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
    });

    return { success: true, steps };
  }

  public pop(): { success: boolean; steps: ArrayStep[] } {
    return this.delete(this.size - 1);
  }

  public search(target: number): { success: boolean; steps: ArrayStep[] } {
    const steps: ArrayStep[] = [];

    if (this.size === 0) {
      steps.push({
        type: "search-complete",
        description: `Search: Array is empty. Target ${target} not found.`,
        items: [...this.items],
        capacity: this.capacity,
        size: 0,
        highlightedIndices: [],
        targetIndex: null,
        searchValue: target,
        searchFound: false,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
      });
      return { success: false, steps };
    }

    for (let i = 0; i < this.size; i++) {
      const currentVal = this.items[i];
      const isMatch = currentVal === target;
      const addr = formatHexAddress(this.baseAddress, i, this.elementSize);

      steps.push({
        type: "search-step",
        description: `Linear Search Step ${i + 1}/${this.size}: Checking index [${i}] (value = ${currentVal}, address = ${addr}). ${isMatch ? `MATCH FOUND! ${currentVal} == ${target}.` : `${currentVal} != ${target}, continuing scan.`}`,
        items: [...this.items],
        capacity: this.capacity,
        size: this.size,
        highlightedIndices: [i],
        targetIndex: i,
        searchValue: target,
        searchFound: isMatch,
        baseAddress: this.baseAddress,
        elementSize: this.elementSize,
        formulaHighlight: {
          index: i,
          baseAddress: this.baseAddress,
          elementSize: this.elementSize,
          computedAddress: addr,
        },
      });

      if (isMatch) {
        steps.push({
          type: "search-complete",
          description: `Search Complete: Target ${target} found at index [${i}] in ${i + 1} comparison(s). Best: O(1), Average/Worst: O(n).`,
          items: [...this.items],
          capacity: this.capacity,
          size: this.size,
          highlightedIndices: [i],
          targetIndex: i,
          searchValue: target,
          searchFound: true,
          baseAddress: this.baseAddress,
          elementSize: this.elementSize,
        });
        return { success: true, steps };
      }
    }

    steps.push({
      type: "search-complete",
      description: `Search Complete: Scanned all ${this.size} elements. Target ${target} does not exist in array (O(n) comparisons).`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [],
      targetIndex: null,
      searchValue: target,
      searchFound: false,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
    });

    return { success: false, steps };
  }

  private performGeometricResizeSteps(): ArrayStep[] {
    const steps: ArrayStep[] = [];
    const oldCapacity = this.capacity;
    const newCapacity = oldCapacity * 2;
    const oldBaseAddress = this.baseAddress;
    const newBaseAddress = oldBaseAddress + oldCapacity * this.elementSize + 0x20; // Simulated new heap block

    const oldBufferSnapshot = {
      items: [...this.items],
      capacity: oldCapacity,
      baseAddress: oldBaseAddress,
    };

    steps.push({
      type: "resize-start",
      description: `Dynamic Array Capacity Full (${this.size}/${oldCapacity}): Allocating new contiguous memory block with 2× capacity (${oldCapacity} → ${newCapacity} slots).`,
      items: [...this.items],
      capacity: oldCapacity,
      size: this.size,
      highlightedIndices: [],
      targetIndex: null,
      baseAddress: oldBaseAddress,
      elementSize: this.elementSize,
      isResizing: true,
      oldBuffer: oldBufferSnapshot,
    });

    const newItems: (number | null)[] = new Array(newCapacity).fill(null);

    for (let i = 0; i < this.size; i++) {
      newItems[i] = this.items[i];
      steps.push({
        type: "resize-copy",
        description: `Memory Copy: Transferring element ${this.items[i]} from old address ${formatHexAddress(oldBaseAddress, i)} → new address ${formatHexAddress(newBaseAddress, i)}.`,
        items: [...newItems],
        capacity: newCapacity,
        size: this.size,
        highlightedIndices: [i],
        targetIndex: i,
        baseAddress: newBaseAddress,
        elementSize: this.elementSize,
        isResizing: true,
        oldBuffer: oldBufferSnapshot,
      });
    }

    this.items = newItems;
    this.capacity = newCapacity;
    this.baseAddress = newBaseAddress;

    steps.push({
      type: "resize-complete",
      description: `Reallocation Complete: Old memory buffer at ${formatHexAddress(oldBaseAddress, 0)} deallocated. New capacity is ${newCapacity}. Amortized cost per push remains O(1)!`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [],
      targetIndex: null,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
      isResizing: false,
    });

    return steps;
  }

  public clear(): ArrayStep {
    this.items = new Array(this.capacity).fill(null);
    this.size = 0;
    return {
      type: "idle",
      description: `Cleared all elements. Array size is 0 (Capacity: ${this.capacity}).`,
      items: [...this.items],
      capacity: this.capacity,
      size: 0,
      highlightedIndices: [],
      targetIndex: null,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
    };
  }

  public randomize(count = 6, capacity = 10): ArrayStep {
    const targetCap = Math.max(capacity, count);
    this.capacity = targetCap;
    this.size = count;
    this.items = new Array(targetCap).fill(null);
    for (let i = 0; i < count; i++) {
      this.items[i] = Math.floor(Math.random() * 90) + 10;
    }
    return {
      type: "idle",
      description: `Generated random array with ${count} elements (Capacity: ${targetCap}).`,
      items: [...this.items],
      capacity: this.capacity,
      size: this.size,
      highlightedIndices: [],
      targetIndex: null,
      baseAddress: this.baseAddress,
      elementSize: this.elementSize,
    };
  }
}
