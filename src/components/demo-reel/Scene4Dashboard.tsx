"use client";

import React from "react";
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Compass,
  ArrowRight,
  GraduationCap,
  Award,
} from "lucide-react";

/**
 * Scene 4: Student Dashboard / Adaptive Guidance
 * 
 * Note: /demo-reel is intentionally designed as an automated screen-recording tool
 * for social media marketing reels. Its scripted animations bypass prefers-reduced-motion
 * by design to guarantee deterministic recording output across environments.
 */
const DEMO_TOPICS = [
  { name: "Bubble Sort", score: 95, status: "Mastered", color: "text-emerald-400", bg: "bg-emerald-500" },
  { name: "Selection Sort", score: 90, status: "Mastered", color: "text-emerald-400", bg: "bg-emerald-500" },
  { name: "Insertion Sort", score: 85, status: "Proficient", color: "text-cyan-300", bg: "bg-cyan-500" },
  { name: "Merge Sort", score: 65, status: "In Progress", color: "text-amber-400", bg: "bg-amber-500" },
  { name: "Quick Sort", score: 0, status: "Next Up", color: "text-purple-400", bg: "bg-purple-500" },
];

export function Scene4Dashboard() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#1C1714] text-[#E8DFD4] select-none overflow-hidden font-sans">
      {/* Top Header: Student Profile */}
      <div className="relative z-10 pt-2 space-y-2">
        <div className="flex items-center justify-between border-b border-[#4A3F35]/70 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#B08422] to-[#D4B872] flex items-center justify-center text-[#1C1714] font-bold text-xs shadow-md">
              MR
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-none">
                Mushfiqur Rahman
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                GSTU CSE • ID: 220101
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            Active Scholar
          </span>
        </div>
      </div>

      {/* Center Body: Overall Progress & Adaptive Recommendation */}
      <div className="relative z-10 my-auto w-full space-y-3 py-1">
        {/* Overall Mastery Stat Card */}
        <div className="rounded-2xl border border-[#4A3F35] bg-[#14100D]/90 p-4 shadow-xl backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
              Overall Mastery Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                84%
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">
                +18% this week
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              4 of 5 sorting algorithms completed
            </p>
          </div>

          <div className="h-14 w-14 rounded-full border-4 border-[#B08422] border-t-transparent flex items-center justify-center font-mono font-bold text-xs text-[#C9A962] shadow-[0_0_15px_rgba(201,169,98,0.3)]">
            84%
          </div>
        </div>

        {/* Personalized Adaptive Guidance Callout */}
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-[#14100D] to-[#1C1714] p-3.5 shadow-xl space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <Compass className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
            <span>Personalized Next Step</span>
          </div>
          <p className="text-xs text-white font-medium leading-relaxed">
            Ready for <strong className="text-cyan-300">Merge Sort</strong> (Divide &amp; Conquer). Your Bubble &amp; Selection foundations are solid!
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-cyan-400">
            <span>Weighted Mastery Formula Active</span>
            <span className="flex items-center gap-1 font-bold">
              Continue Lesson <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Topic Breakdown Bars List */}
        <div className="rounded-2xl border border-[#4A3F35] bg-[#14100D]/90 p-3.5 shadow-xl space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold block">
            Curriculum Topic Progress
          </span>

          <div className="space-y-1.5">
            {DEMO_TOPICS.map((topic, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-200 font-semibold">{topic.name}</span>
                  <span className={topic.color}>{topic.score > 0 ? `${topic.score}%` : topic.status}</span>
                </div>
                <div className="w-full bg-[#251E19] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${topic.bg} rounded-full transition-all duration-300`}
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pb-2 border-t border-[#4A3F35]/70 pt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-[#C9A962]">
          <Sparkles className="h-3.5 w-3.5 text-[#C9A962]" />
          Synchronized to Supabase Cloud
        </span>
        <span className="text-emerald-400 font-bold">100% Free Access</span>
      </div>
    </div>
  );
}
