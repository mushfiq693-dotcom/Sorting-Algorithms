"use client";

import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

const INITIAL_HERO_ARRAY = [32, 14, 58, 22, 70, 45, 18, 88, 39, 62, 28, 76, 50, 12, 65];

export function HeroAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const [array, setArray] = useState<number[]>(INITIAL_HERO_ARRAY);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const isRunningRef = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion) return;

    isRunningRef.current = true;

    async function runDemoLoop() {
      while (isRunningRef.current) {
        // Reset
        const arr = [...INITIAL_HERO_ARRAY];
        setArray([...arr]);
        setActiveIndices([]);
        setSortedIndices([]);
        await new Promise((r) => setTimeout(r, 1200));

        // Perform live animated bubble sort pass
        const n = arr.length;
        const sorted = new Set<number>();

        for (let i = 0; i < n - 1; i++) {
          let swapped = false;
          for (let j = 0; j < n - i - 1; j++) {
            if (!isRunningRef.current) return;
            setActiveIndices([j, j + 1]);
            await new Promise((r) => setTimeout(r, 80));

            if (arr[j] > arr[j + 1]) {
              const temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
              setArray([...arr]);
              swapped = true;
              await new Promise((r) => setTimeout(r, 95));
            }
          }
          sorted.add(n - i - 1);
          setSortedIndices(Array.from(sorted));
          if (!swapped) break;
        }

        // All sorted
        setSortedIndices(Array.from({ length: n }, (_, k) => k));
        setActiveIndices([]);
        await new Promise((r) => setTimeout(r, 2500));
      }
    }

    runDemoLoop();

    return () => {
      isRunningRef.current = false;
    };
  }, [prefersReducedMotion]);

  const maxVal = Math.max(...INITIAL_HERO_ARRAY);

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0c1220]/90 via-[#070b14]/95 to-[#050811] p-3 sm:p-3.5 shadow-xl backdrop-blur-xl overflow-hidden">
      {/* Precision Dev-Tool Background Grid */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#38bdf806_1px,transparent_1px),linear-gradient(to_bottom,#38bdf806_1px,transparent_1px)] bg-[size:1.2rem_1.2rem]" />

      {/* Decorative Header Banner */}
      <div className="flex items-center justify-between mb-2 text-xs font-mono relative z-10">
        <span className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold">
          <Sparkles className="h-3 w-3 text-cyan-400" /> Live Engine Preview
        </span>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/20 font-semibold">
          Continuous Demonstration
        </span>
      </div>

      {/* Mini Bars Track: Compact height (h-20 sm:h-24) to save vertical space */}
      <div className="flex h-20 sm:h-24 items-end justify-center gap-1 sm:gap-1.5 relative z-10 px-1">
        {array.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          const heightPercent = Math.max(14, Math.round((val / maxVal) * 92));

          let barColor = "from-cyan-500 to-blue-600 shadow-[0_0_8px_rgba(56,189,248,0.2)]";
          if (isActive) barColor = "from-amber-400 via-rose-500 to-red-500 shadow-[0_0_14px_rgba(244,63,94,0.6)]";
          else if (isSorted) barColor = "from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]";

          return (
            <div
              key={idx}
              className="flex-1 max-w-[24px] h-full flex items-end justify-center"
            >
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-md bg-gradient-to-t ${barColor} transition-all duration-150 relative overflow-hidden`}
              >
                {/* Top Shine */}
                <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-md" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
