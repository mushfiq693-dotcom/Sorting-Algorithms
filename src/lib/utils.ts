import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random array of integers within a given size and range.
 */
export function generateRandomArray(size: number = 15, min: number = 5, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * Parse and validate comma-separated custom array string.
 * Returns either the parsed number array or an error message.
 */
export function parseCustomArray(input: string): { success: true; data: number[] } | { success: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: false, error: "Please enter comma-separated numbers." };
  }

  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    return { success: false, error: "Array cannot be empty." };
  }

  if (parts.length > 50) {
    return { success: false, error: "Maximum array size is 50 elements." };
  }

  const numbers: number[] = [];
  for (const part of parts) {
    const num = Number(part);
    if (isNaN(num) || !Number.isInteger(num)) {
      return { success: false, error: `"${part}" is not a valid integer.` };
    }
    if (num < 1 || num > 500) {
      return { success: false, error: `Value ${num} is out of range. Values must be between 1 and 500.` };
    }
    numbers.push(num);
  }

  return { success: true, data: numbers };
}
