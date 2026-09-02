"use client";

import React, { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * AmbientSortLogo Component (Classical Edition)
 * A miniature 5-bar ambient sorting micro-visualizer embedded in the site logo header.
 * Styled with polished brass bars and aged oak housing.
 */
export function AmbientSortLogo() {
  const prefersReducedMotion = useReducedMotion();

  // 5 bar heights
  const [bars, setBars] = useState<number[]>([18, 8, 24, 12, 16]);
  const [comparing, setComparing] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let step = 0;
    const interval = setInterval(() => {
      setBars((prev) => {
        const arr = [...prev];
        const i = step % (arr.length - 1);
        setComparing([i, i + 1]);

        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
        }

        // Shuffle occasionally
        if (step > 0 && step % 18 === 0) {
          return [22, 10, 26, 14, 8].sort(() => Math.random() - 0.5);
        }

        return arr;
      });

      step++;
    }, 1400);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="flex items-end gap-1 h-7 px-1.5 py-1 rounded bg-[#251E19] border border-[#4A3F35] shadow-inner group-hover:border-[#C9A962]/50 transition-colors"
    >
      {bars.map((height, idx) => {
        const isComparing = comparing && (comparing[0] === idx || comparing[1] === idx);

        return (
          <div
            key={idx}
            style={{ height: `${height}px` }}
            className={`w-1 rounded-none transition-[height,background-color,box-shadow] duration-300 ease-out will-change-[height] ${
              isComparing
                ? "bg-[#8B2635] shadow-[0_0_6px_rgba(139,38,53,0.8)]"
                : "bg-gradient-to-t from-[#B8953F] to-[#D4B872]"
            }`}
          />
        );
      })}
    </div>
  );
}
