"use client";

import React, { useState, useEffect } from "react";
import { AmbientSortLogo } from "@/components/brand/AmbientSortLogo";
import { Sparkles, GraduationCap, Layers, ArrowRight } from "lucide-react";

/**
 * Scene 1: Hero / Opening Scene
 * 
 * Note: /demo-reel is intentionally designed as an automated screen-recording tool
 * for social media marketing reels. Its scripted animations bypass prefers-reduced-motion
 * by design to guarantee deterministic recording output across environments.
 */
const INITIAL_DEMO_ARRAY = [28, 14, 75, 42, 90, 36, 62, 19, 84, 53];

export function Scene1Hero() {
  const [array, setArray] = useState<number[]>(INITIAL_DEMO_ARRAY);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  // Self-running live sorting preview animation loop
  useEffect(() => {
    let isMounted = true;

    async function runSortLoop() {
      const arr = [...INITIAL_DEMO_ARRAY];
      const n = arr.length;
      const sorted = new Set<number>();

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (!isMounted) return;
          setActiveIndices([j, j + 1]);
          await new Promise((r) => setTimeout(r, 90));

          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            if (!isMounted) return;
            setArray([...arr]);
            await new Promise((r) => setTimeout(r, 110));
          }
        }
        sorted.add(n - i - 1);
        if (!isMounted) return;
        setSortedIndices(Array.from(sorted));
      }
      sorted.add(0);
      if (!isMounted) return;
      setSortedIndices(Array.from(sorted));
      setActiveIndices([]);
    }

    runSortLoop();

    return () => {
      isMounted = false;
    };
  }, []);

  const maxVal = Math.max(...INITIAL_DEMO_ARRAY);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-[#1C1714] text-[#E8DFD4] select-none overflow-hidden">
      {/* Precision Background Glow & Ambient Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#B08422]/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

      {/* Top Header / University Tag */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-b border-[#4A3F35]/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-tight text-white">
            AlgoHub
          </span>
          <AmbientSortLogo />
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-[#B08422]/15 text-[#C9A962] border border-[#B08422]/30">
          GSTU CSE Dept
        </div>
      </div>

      {/* Center Body: Headline, Tagline, Dynamic Preview */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto space-y-5">
        {/* Sub-Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B08422]/50 bg-[#251E19]/90 text-[#C9A962] text-[11px] font-sans font-semibold uppercase tracking-wider shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#C9A962]" />
          <span>Interactive DSA Studio</span>
        </div>

        {/* Main Title */}
        <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
          Make Algorithms{" "}
          <span className="italic text-[#D4B872] block">
            Make Sense.
          </span>
        </h1>

        {/* Dynamic Tagline */}
        <div className="text-sm sm:text-base font-medium text-slate-300 leading-relaxed font-sans max-w-xs">
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
            Don&apos;t just memorize code.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 font-semibold">
            <span className="text-[#C9A962] bg-[#B08422]/10 px-2 py-0.5 rounded border border-[#B08422]/30">See them.</span>
            <span className="text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">Break them.</span>
            <span className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">Fix them.</span>
            <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">Master them.</span>
          </div>
        </div>

        {/* Real Live Engine Visual Card */}
        <div className="w-full max-w-sm rounded-2xl border border-[#4A3F35] bg-[#14100D]/90 p-4 shadow-2xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#4A3F35]/60 pb-2">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              Live Execution Engine
            </span>
            <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
              Interactive
            </span>
          </div>

          {/* Animated Bars Track */}
          <div className="flex h-24 items-end justify-center gap-1.5 px-2">
            {array.map((val, idx) => {
              const isActive = activeIndices.includes(idx);
              const isSorted = sortedIndices.includes(idx);
              const heightPercent = Math.max(16, Math.round((val / maxVal) * 92));

              let barGradient = "from-[#B8953F] to-[#D4B872]";
              let glowStyle = "shadow-[0_0_8px_rgba(201,169,98,0.2)]";

              if (isActive) {
                barGradient = "from-amber-400 via-rose-500 to-red-500";
                glowStyle = "shadow-[0_0_14px_rgba(244,63,94,0.7)]";
              } else if (isSorted) {
                barGradient = "from-emerald-400 to-teal-400";
                glowStyle = "shadow-[0_0_10px_rgba(16,185,129,0.5)]";
              }

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full transition-all duration-150"
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm bg-gradient-to-t ${barGradient} ${glowStyle} transition-all duration-150`}
                  />
                  <span className="text-[9px] font-mono text-slate-400 mt-1">
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer Callout */}
      <div className="relative z-10 pb-4 border-t border-[#4A3F35]/70 pt-3 flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1 text-[#C9A962] font-semibold">
          <GraduationCap className="h-4 w-4" />
          Zero to Advanced Roadmap
        </span>
        <span className="text-[11px] text-cyan-400 flex items-center gap-1">
          Explore Studio <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
