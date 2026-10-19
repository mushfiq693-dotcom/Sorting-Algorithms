export type StringOperationType =
  | "idle"
  | "access"
  | "compare"
  | "swap"
  | "match"
  | "mismatch"
  | "window-expand"
  | "window-shrink"
  | "window-match"
  | "mutate-start"
  | "mutate-copy"
  | "mutate-complete"
  | "complete"
  | "error";

export interface CharByteInfo {
  char: string;
  asciiDec: number;
  asciiHex: string;
  binary: string;
  index: number;
  address: string;
}

export interface StringPointers {
  left?: number | null;
  right?: number | null;
  windowStart?: number | null;
  windowEnd?: number | null;
  textIndex?: number | null;
  patternIndex?: number | null;
}

export interface StringStep {
  type: StringOperationType;
  description: string;
  chars: string[];
  length: number;
  capacity: number;
  baseAddress: number;
  elementSize: number; // 1 Byte for ASCII char
  pointers: StringPointers;
  highlightedIndices: number[];
  matchedIndices: number[];
  mismatchedIndices: number[];
  mode: "mutable" | "immutable";
  activeCharInfo?: CharByteInfo | null;
  immutableReallocation?: {
    oldBuffer: { chars: string[]; address: number; capacity: number };
    newBuffer: { chars: string[]; address: number; capacity: number };
    copiedIndex: number;
  } | null;
}

export const BASE_STRING_ADDRESS = 0x7FFF00;
export const CHAR_SIZE_BYTES = 1; // Standard 8-bit ASCII character

export function formatStringHexAddress(base: number, index: number): string {
  const addr = base + index * CHAR_SIZE_BYTES;
  return `0x${addr.toString(16).toUpperCase()}`;
}

export function getCharByteInfo(char: string, index: number, base: number = BASE_STRING_ADDRESS): CharByteInfo {
  const code = char.charCodeAt(0) || 0;
  return {
    char,
    asciiDec: code,
    asciiHex: `0x${code.toString(16).toUpperCase().padStart(2, "0")}`,
    binary: code.toString(2).padStart(8, "0"),
    index,
    address: formatStringHexAddress(base, index),
  };
}

export class StringEngine {
  private chars: string[];
  private mode: "mutable" | "immutable";
  private baseAddress: number;
  private capacity: number;

  constructor(
    initialText: string = "ALGORITHM",
    mode: "mutable" | "immutable" = "mutable",
    baseAddress: number = BASE_STRING_ADDRESS
  ) {
    this.chars = initialText.split("");
    this.mode = mode;
    this.baseAddress = baseAddress;
    this.capacity = Math.max(16, this.chars.length + 4);
  }

  public getChars(): string[] {
    return [...this.chars];
  }

  public getText(): string {
    return this.chars.join("");
  }

  public setMode(mode: "mutable" | "immutable"): StringStep {
    this.mode = mode;
    return {
      type: "idle",
      description: `Switched execution model to ${
        mode === "mutable"
          ? "C++ std::string (In-Place Mutable Buffer with O(1) character updates)"
          : "Python / Java / JavaScript (Immutable String with O(n) heap cloning on modification)"
      }.`,
      chars: [...this.chars],
      length: this.chars.length,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: {},
      highlightedIndices: [],
      matchedIndices: [],
      mismatchedIndices: [],
      mode: this.mode,
      activeCharInfo: this.chars.length > 0 ? getCharByteInfo(this.chars[0], 0, this.baseAddress) : null,
    };
  }

  public setString(newText: string): StringStep {
    this.chars = newText.split("");
    this.capacity = Math.max(16, this.chars.length + 4);
    return {
      type: "idle",
      description: `Loaded string "${newText}" (${this.chars.length} characters, ${this.chars.length} Bytes in RAM).`,
      chars: [...this.chars],
      length: this.chars.length,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: {},
      highlightedIndices: [],
      matchedIndices: [],
      mismatchedIndices: [],
      mode: this.mode,
      activeCharInfo: this.chars.length > 0 ? getCharByteInfo(this.chars[0], 0, this.baseAddress) : null,
    };
  }

  /**
   * Two-Pointer In-Place String Reversal
   * Left and right pointers start at opposite ends and swap inward.
   * Time: O(n/2) = O(n), Space: O(1)
   */
  public reverse(): { success: boolean; steps: StringStep[] } {
    const steps: StringStep[] = [];
    const n = this.chars.length;
    if (n <= 1) {
      steps.push({
        type: "complete",
        description: `String length is ${n}. Already trivially reversed.`,
        chars: [...this.chars],
        length: n,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: { left: 0, right: Math.max(0, n - 1) },
        highlightedIndices: [],
        matchedIndices: [],
        mismatchedIndices: [],
        mode: this.mode,
      });
      return { success: true, steps };
    }

    let l = 0;
    let r = n - 1;

    steps.push({
      type: "idle",
      description: `Two-Pointer Reversal: Initialize Left pointer at index [0] ('${this.chars[0]}') and Right pointer at index [${r}] ('${this.chars[r]}').`,
      chars: [...this.chars],
      length: n,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { left: l, right: r },
      highlightedIndices: [l, r],
      matchedIndices: [],
      mismatchedIndices: [],
      mode: this.mode,
      activeCharInfo: getCharByteInfo(this.chars[l], l, this.baseAddress),
    });

    while (l < r) {
      const leftChar = this.chars[l];
      const rightChar = this.chars[r];
      const leftAddr = formatStringHexAddress(this.baseAddress, l);
      const rightAddr = formatStringHexAddress(this.baseAddress, r);

      // Compare step
      steps.push({
        type: "compare",
        description: `Inspect Pointers: Left [${l}] ('${leftChar}' @ ${leftAddr}) and Right [${r}] ('${rightChar}' @ ${rightAddr}). Swapping in-place.`,
        chars: [...this.chars],
        length: n,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: { left: l, right: r },
        highlightedIndices: [l, r],
        matchedIndices: [],
        mismatchedIndices: [],
        mode: this.mode,
        activeCharInfo: getCharByteInfo(leftChar, l, this.baseAddress),
      });

      // Perform swap
      this.chars[l] = rightChar;
      this.chars[r] = leftChar;

      steps.push({
        type: "swap",
        description: `Swapped: str[${l}] ('${rightChar}') ⟷ str[${r}] ('${leftChar}'). Now increment Left (l → ${l + 1}) and decrement Right (r → ${r - 1}).`,
        chars: [...this.chars],
        length: n,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: { left: l, right: r },
        highlightedIndices: [l, r],
        matchedIndices: [l, r],
        mismatchedIndices: [],
        mode: this.mode,
        activeCharInfo: getCharByteInfo(rightChar, l, this.baseAddress),
      });

      l++;
      r--;
    }

    steps.push({
      type: "complete",
      description: `Reversal Complete: Pointers met in the middle (${l} >= ${r}). String is now "${this.chars.join("")}". Time: O(n), Auxiliary Space: O(1).`,
      chars: [...this.chars],
      length: n,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { left: l, right: r },
      highlightedIndices: [],
      matchedIndices: Array.from({ length: n }, (_, i) => i),
      mismatchedIndices: [],
      mode: this.mode,
    });

    return { success: true, steps };
  }

  /**
   * Two-Pointer Palindrome Check
   * Compares str[L] and str[R] moving inward.
   * Early exit on mismatch.
   */
  public palindromeCheck(): { success: boolean; steps: StringStep[]; isPalindrome: boolean } {
    const steps: StringStep[] = [];
    const n = this.chars.length;

    if (n === 0) {
      steps.push({
        type: "complete",
        description: "Empty string is trivially a palindrome.",
        chars: [],
        length: 0,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: {},
        highlightedIndices: [],
        matchedIndices: [],
        mismatchedIndices: [],
        mode: this.mode,
      });
      return { success: true, steps, isPalindrome: true };
    }

    let l = 0;
    let r = n - 1;
    let isPal = true;
    const verifiedIndices: number[] = [];

    steps.push({
      type: "idle",
      description: `Palindrome Verification: Checking if "${this.chars.join("")}" reads identically forward and backward using symmetric pointers L=0, R=${r}.`,
      chars: [...this.chars],
      length: n,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { left: l, right: r },
      highlightedIndices: [l, r],
      matchedIndices: [],
      mismatchedIndices: [],
      mode: this.mode,
      activeCharInfo: getCharByteInfo(this.chars[l], l, this.baseAddress),
    });

    while (l < r) {
      const leftChar = this.chars[l].toLowerCase();
      const rightChar = this.chars[r].toLowerCase();

      steps.push({
        type: "compare",
        description: `Comparing Symmetry: str[${l}] ('${this.chars[l]}') vs str[${r}] ('${this.chars[r]}').`,
        chars: [...this.chars],
        length: n,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: { left: l, right: r },
        highlightedIndices: [l, r],
        matchedIndices: [...verifiedIndices],
        mismatchedIndices: [],
        mode: this.mode,
        activeCharInfo: getCharByteInfo(this.chars[l], l, this.baseAddress),
      });

      if (leftChar !== rightChar) {
        isPal = false;
        steps.push({
          type: "mismatch",
          description: `MISMATCH FOUND: str[${l}] ('${this.chars[l]}') ≠ str[${r}] ('${this.chars[r]}'). Terminating early: "${this.chars.join("")}" is NOT a palindrome!`,
          chars: [...this.chars],
          length: n,
          capacity: this.capacity,
          baseAddress: this.baseAddress,
          elementSize: CHAR_SIZE_BYTES,
          pointers: { left: l, right: r },
          highlightedIndices: [l, r],
          matchedIndices: [...verifiedIndices],
          mismatchedIndices: [l, r],
          mode: this.mode,
          activeCharInfo: getCharByteInfo(this.chars[l], l, this.baseAddress),
        });
        return { success: true, steps, isPalindrome: false };
      }

      verifiedIndices.push(l, r);

      steps.push({
        type: "match",
        description: `SYMMETRIC MATCH: str[${l}] ('${this.chars[l]}') == str[${r}] ('${this.chars[r]}'). Moving inward.`,
        chars: [...this.chars],
        length: n,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: { left: l, right: r },
        highlightedIndices: [l, r],
        matchedIndices: [...verifiedIndices],
        mismatchedIndices: [],
        mode: this.mode,
        activeCharInfo: getCharByteInfo(this.chars[l], l, this.baseAddress),
      });

      l++;
      r--;
    }

    if (l === r) {
      verifiedIndices.push(l);
    }

    steps.push({
      type: "complete",
      description: `VALID PALINDROME CONFIRMED: All character pairs matched symmetrically. Time: O(n/2) = O(n), Auxiliary Space: O(1).`,
      chars: [...this.chars],
      length: n,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { left: l, right: r },
      highlightedIndices: [],
      matchedIndices: Array.from({ length: n }, (_, i) => i),
      mismatchedIndices: [],
      mode: this.mode,
    });

    return { success: true, steps, isPalindrome: true };
  }

  /**
   * Sliding Window: Longest Substring Without Repeating Characters
   * Demonstrates window expansion [L..R] and contraction when duplicate encountered.
   */
  public slidingWindow(): { success: boolean; steps: StringStep[] } {
    const steps: StringStep[] = [];
    const n = this.chars.length;

    if (n === 0) {
      steps.push({
        type: "complete",
        description: "Empty string has longest unique substring of length 0.",
        chars: [],
        length: 0,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: {},
        highlightedIndices: [],
        matchedIndices: [],
        mismatchedIndices: [],
        mode: this.mode,
      });
      return { success: true, steps };
    }

    let left = 0;
    let maxLen = 0;
    let bestWindow = { start: 0, end: 0 };
    const charIndexMap = new Map<string, number>();

    steps.push({
      type: "idle",
      description: `Sliding Window Initialization: Finding longest substring without repeating characters. Window [L..R] starts at [0..0].`,
      chars: [...this.chars],
      length: n,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { windowStart: 0, windowEnd: 0 },
      highlightedIndices: [0],
      matchedIndices: [],
      mismatchedIndices: [],
      mode: this.mode,
      activeCharInfo: getCharByteInfo(this.chars[0], 0, this.baseAddress),
    });

    for (let right = 0; right < n; right++) {
      const currentChar = this.chars[right];

      // If duplicate found inside current window [left..right-1]
      if (charIndexMap.has(currentChar) && (charIndexMap.get(currentChar) ?? -1) >= left) {
        const prevIdx = charIndexMap.get(currentChar)!;
        const newLeft = prevIdx + 1;

        steps.push({
          type: "window-shrink",
          description: `Duplicate Detected: '${currentChar}' at index [${right}] was previously seen at [${prevIdx}]. Contracting window: shifting L from ${left} → ${newLeft}.`,
          chars: [...this.chars],
          length: n,
          capacity: this.capacity,
          baseAddress: this.baseAddress,
          elementSize: CHAR_SIZE_BYTES,
          pointers: { windowStart: newLeft, windowEnd: right },
          highlightedIndices: [prevIdx, right],
          matchedIndices: Array.from({ length: right - newLeft + 1 }, (_, i) => newLeft + i),
          mismatchedIndices: [prevIdx, right],
          mode: this.mode,
          activeCharInfo: getCharByteInfo(currentChar, right, this.baseAddress),
        });

        left = newLeft;
      }

      charIndexMap.set(currentChar, right);
      const currentWindowLen = right - left + 1;
      const isNewRecord = currentWindowLen > maxLen;

      if (isNewRecord) {
        maxLen = currentWindowLen;
        bestWindow = { start: left, end: right };
      }

      const windowIndices = Array.from({ length: currentWindowLen }, (_, i) => left + i);

      steps.push({
        type: isNewRecord ? "window-match" : "window-expand",
        description: `Window [${left}..${right}]: Substring "${this.chars.slice(left, right + 1).join("")}" (Length ${currentWindowLen}). ${
          isNewRecord ? `★ NEW MAX UNIQUE LENGTH: ${maxLen}!` : `Valid unique window.`
        }`,
        chars: [...this.chars],
        length: n,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: { windowStart: left, windowEnd: right },
        highlightedIndices: [right],
        matchedIndices: windowIndices,
        mismatchedIndices: [],
        mode: this.mode,
        activeCharInfo: getCharByteInfo(currentChar, right, this.baseAddress),
      });
    }

    const bestSubstr = this.chars.slice(bestWindow.start, bestWindow.end + 1).join("");
    const bestIndices = Array.from({ length: maxLen }, (_, i) => bestWindow.start + i);

    steps.push({
      type: "complete",
      description: `Sliding Window Complete: Longest unique substring is "${bestSubstr}" with length ${maxLen} (Range [${bestWindow.start}..${bestWindow.end}]). Time: O(n) linear single scan!`,
      chars: [...this.chars],
      length: n,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { windowStart: bestWindow.start, windowEnd: bestWindow.end },
      highlightedIndices: [],
      matchedIndices: bestIndices,
      mismatchedIndices: [],
      mode: this.mode,
    });

    return { success: true, steps };
  }

  /**
   * Substring Pattern Search (Needle in Haystack)
   * Scans text looking for match of pattern string.
   */
  public searchPattern(needle: string): { success: boolean; steps: StringStep[]; foundIndex: number } {
    const steps: StringStep[] = [];
    const textLen = this.chars.length;
    const patLen = needle.length;

    if (patLen === 0) {
      steps.push({
        type: "complete",
        description: "Empty needle matches at index 0.",
        chars: [...this.chars],
        length: textLen,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: {},
        highlightedIndices: [],
        matchedIndices: [],
        mismatchedIndices: [],
        mode: this.mode,
      });
      return { success: true, steps, foundIndex: 0 };
    }

    if (patLen > textLen) {
      steps.push({
        type: "error",
        description: `Pattern length (${patLen}) exceeds string text length (${textLen}). Cannot match.`,
        chars: [...this.chars],
        length: textLen,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: {},
        highlightedIndices: [],
        matchedIndices: [],
        mismatchedIndices: [],
        mode: this.mode,
      });
      return { success: false, steps, foundIndex: -1 };
    }

    steps.push({
      type: "idle",
      description: `Pattern Search: Searching for needle "${needle}" in haystack "${this.chars.join("")}".`,
      chars: [...this.chars],
      length: textLen,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { textIndex: 0, patternIndex: 0 },
      highlightedIndices: [0],
      matchedIndices: [],
      mismatchedIndices: [],
      mode: this.mode,
    });

    for (let i = 0; i <= textLen - patLen; i++) {
      let matchedChars = 0;

      for (let j = 0; j < patLen; j++) {
        const textIdx = i + j;
        const tChar = this.chars[textIdx];
        const pChar = needle[j];

        steps.push({
          type: "compare",
          description: `Testing Alignment at offset [${i}]: text[${textIdx}] ('${tChar}') vs needle[${j}] ('${pChar}').`,
          chars: [...this.chars],
          length: textLen,
          capacity: this.capacity,
          baseAddress: this.baseAddress,
          elementSize: CHAR_SIZE_BYTES,
          pointers: { textIndex: textIdx, patternIndex: j },
          highlightedIndices: [textIdx],
          matchedIndices: Array.from({ length: matchedChars }, (_, k) => i + k),
          mismatchedIndices: [],
          mode: this.mode,
          activeCharInfo: getCharByteInfo(tChar, textIdx, this.baseAddress),
        });

        if (tChar === pChar) {
          matchedChars++;
        } else {
          steps.push({
            type: "mismatch",
            description: `Mismatch at text[${textIdx}] ('${tChar}' ≠ '${pChar}'). Shifting window to next text offset [${i + 1}].`,
            chars: [...this.chars],
            length: textLen,
            capacity: this.capacity,
            baseAddress: this.baseAddress,
            elementSize: CHAR_SIZE_BYTES,
            pointers: { textIndex: textIdx, patternIndex: j },
            highlightedIndices: [textIdx],
            matchedIndices: [],
            mismatchedIndices: [textIdx],
            mode: this.mode,
            activeCharInfo: getCharByteInfo(tChar, textIdx, this.baseAddress),
          });
          break;
        }
      }

      if (matchedChars === patLen) {
        const matchRange = Array.from({ length: patLen }, (_, k) => i + k);
        steps.push({
          type: "complete",
          description: `MATCH FOUND! Pattern "${needle}" found starting at index [${i}] (Memory Range: ${formatStringHexAddress(
            this.baseAddress,
            i
          )} .. ${formatStringHexAddress(this.baseAddress, i + patLen - 1)}).`,
          chars: [...this.chars],
          length: textLen,
          capacity: this.capacity,
          baseAddress: this.baseAddress,
          elementSize: CHAR_SIZE_BYTES,
          pointers: { textIndex: i },
          highlightedIndices: [],
          matchedIndices: matchRange,
          mismatchedIndices: [],
          mode: this.mode,
        });
        return { success: true, steps, foundIndex: i };
      }
    }

    steps.push({
      type: "complete",
      description: `Pattern Search Complete: Pattern "${needle}" does not occur anywhere in the text (O((n - m + 1) * m) worst case).`,
      chars: [...this.chars],
      length: textLen,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: {},
      highlightedIndices: [],
      matchedIndices: [],
      mismatchedIndices: [],
      mode: this.mode,
    });

    return { success: false, steps, foundIndex: -1 };
  }

  /**
   * In-Place Mutation (C++) vs Immutable Copy Reallocation (JS/Python/Java)
   * This is the cornerstone visual for String:
   * Shows in-place O(1) byte overwrite in C++ vs allocating a brand new memory block
   * and copying every byte in O(n) time for immutable languages!
   */
  public replaceChar(index: number, newChar: string): { success: boolean; steps: StringStep[] } {
    const steps: StringStep[] = [];
    const n = this.chars.length;

    if (index < 0 || index >= n) {
      steps.push({
        type: "error",
        description: `IndexOutOfBounds: Cannot replace character at index [${index}]. Valid range is [0..${n - 1}].`,
        chars: [...this.chars],
        length: n,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: {},
        highlightedIndices: [],
        matchedIndices: [],
        mismatchedIndices: [],
        mode: this.mode,
      });
      return { success: false, steps };
    }

    const oldChar = this.chars[index];

    if (this.mode === "mutable") {
      // C++ std::string in-place overwrite
      this.chars[index] = newChar;
      const targetAddr = formatStringHexAddress(this.baseAddress, index);

      steps.push({
        type: "mutate-complete",
        description: `C++ Mutable in-place update: Overwrote byte at address ${targetAddr} ('${oldChar}' → '${newChar}') in strict O(1) time with 0 extra memory allocation.`,
        chars: [...this.chars],
        length: n,
        capacity: this.capacity,
        baseAddress: this.baseAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: { textIndex: index },
        highlightedIndices: [index],
        matchedIndices: [index],
        mismatchedIndices: [],
        mode: "mutable",
        activeCharInfo: getCharByteInfo(newChar, index, this.baseAddress),
      });

      return { success: true, steps };
    }

    // Immutable Language Simulation (Python / JS / Java)
    const oldAddress = this.baseAddress;
    const newAddress = oldAddress + this.capacity * CHAR_SIZE_BYTES + 0x30;
    const oldBufferSnapshot = {
      chars: [...this.chars],
      address: oldAddress,
      capacity: this.capacity,
    };

    steps.push({
      type: "mutate-start",
      description: `Immutable String Violation: String memory at ${formatStringHexAddress(
        oldAddress,
        0
      )} is READ-ONLY. Allocating a brand new heap buffer at ${formatStringHexAddress(
        newAddress,
        0
      )} (${n} Bytes).`,
      chars: [...this.chars],
      length: n,
      capacity: this.capacity,
      baseAddress: oldAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { textIndex: index },
      highlightedIndices: [index],
      matchedIndices: [],
      mismatchedIndices: [],
      mode: "immutable",
      immutableReallocation: {
        oldBuffer: oldBufferSnapshot,
        newBuffer: { chars: new Array(n).fill("-"), address: newAddress, capacity: this.capacity },
        copiedIndex: -1,
      },
    });

    const newChars: string[] = [];

    // Step-by-step memory copy
    for (let i = 0; i < n; i++) {
      const charToPut = i === index ? newChar : this.chars[i];
      newChars.push(charToPut);

      steps.push({
        type: "mutate-copy",
        description: `Copying Byte ${i + 1}/${n}: Copying '${charToPut}' from old buffer → new buffer slot [${i}] (${formatStringHexAddress(
          newAddress,
          i
        )}). Cost: O(n) copies!`,
        chars: [...newChars, ...new Array(n - newChars.length).fill("-")],
        length: n,
        capacity: this.capacity,
        baseAddress: newAddress,
        elementSize: CHAR_SIZE_BYTES,
        pointers: { textIndex: i },
        highlightedIndices: [i],
        matchedIndices: [i],
        mismatchedIndices: [],
        mode: "immutable",
        immutableReallocation: {
          oldBuffer: oldBufferSnapshot,
          newBuffer: { chars: [...newChars], address: newAddress, capacity: this.capacity },
          copiedIndex: i,
        },
      });
    }

    this.chars = newChars;
    this.baseAddress = newAddress;

    steps.push({
      type: "mutate-complete",
      description: `Immutable Mutation Finished: New string created at ${formatStringHexAddress(
        newAddress,
        0
      )}. Old buffer scheduled for Garbage Collection. Total cost: O(n) Time & O(n) Space for a single character change!`,
      chars: [...this.chars],
      length: n,
      capacity: this.capacity,
      baseAddress: this.baseAddress,
      elementSize: CHAR_SIZE_BYTES,
      pointers: { textIndex: index },
      highlightedIndices: [index],
      matchedIndices: [index],
      mismatchedIndices: [],
      mode: "immutable",
      activeCharInfo: getCharByteInfo(newChar, index, this.baseAddress),
    });

    return { success: true, steps };
  }
}
