"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

        // Perform simple animated bubble sort pass
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
              await new Promise((r) => setTimeout(r, 100));
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
    <div className="relative w-full max-w-xl mx-auto rounded-2xl border border-border/60 bg-gradient-to-b from-card/60 via-card/30 to-background/80 p-4 sm:p-5 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Decorative badge */}
      <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-400">
          <Sparkles className="h-3 w-3" /> Live Engine Preview
        </span>
        <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
          Continuous Demonstration
        </span>
      </div>

      {/* Mini Bars */}
      <div className="flex h-32 items-end justify-center gap-1 sm:gap-1.5">
        {array.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          const heightPercent = Math.max(12, Math.round((val / maxVal) * 90));

          let barColor = "from-cyan-500/70 to-blue-600/70";
          if (isActive) barColor = "from-amber-400 to-rose-500 shadow-lg shadow-rose-500/40";
          if (isSorted) barColor = "from-emerald-400/80 to-teal-500/80 shadow-sm shadow-emerald-500/20";

          return (
            <motion.div
              key={idx}
              layout={!prefersReducedMotion}
              className="flex-1 max-w-[28px] rounded-t-md relative overflow-hidden"
              style={{ height: `${heightPercent}%` }}
            >
              <div className={`w-full h-full rounded-t-md bg-gradient-to-t ${barColor} transition-colors duration-150`} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
