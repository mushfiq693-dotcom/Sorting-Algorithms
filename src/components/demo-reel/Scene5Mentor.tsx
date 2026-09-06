"use client";

import React from "react";
import {
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  BarChart3,
  Search,
} from "lucide-react";

/**
 * Scene 5: Mentor Analytics / Cohort Oversight
 * 
 * Note: /demo-reel is intentionally designed as an automated screen-recording tool
 * for social media marketing reels. Its scripted animations bypass prefers-reduced-motion
 * by design to guarantee deterministic recording output across environments.
 */
const TOPIC_AVERAGES = [
  { name: "Bubble Sort", avg: 92, stuckRate: 0 },
  { name: "Selection Sort", avg: 88, stuckRate: 4 },
  { name: "Insertion Sort", avg: 81, stuckRate: 8 },
  { name: "Merge Sort", avg: 68, stuckRate: 18 },
  { name: "Quick Sort", avg: 62, stuckRate: 24 },
];

export function Scene5Mentor() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-[#1C1714] text-[#E8DFD4] select-none overflow-hidden font-sans">
      {/* Top Header */}
      <div className="relative z-10 pt-2 space-y-2">
        <div className="flex items-center justify-between border-b border-[#4A3F35]/70 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Award className="h-3.5 w-3.5" />
            </div>
            <span className="font-heading text-lg font-bold text-white">
              Mentor Analytics
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
            Cohort Oversight
          </span>
        </div>
      </div>

      {/* Center Body: 4 KPI Cards & Cohort Chart */}
      <div className="relative z-10 my-auto w-full space-y-3 py-1">
        {/* 4 Stat Cards Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-xl border border-purple-500/30 bg-[#140612]/90 space-y-0.5">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-[10px] font-bold">Enrolled Cohort</span>
              <Users className="h-3.5 w-3.5" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">48</div>
            <p className="text-[9px] text-slate-400">GSTU CSE Scholars</p>
          </div>

          <div className="p-3 rounded-xl border border-rose-500/30 bg-[#140612]/90 space-y-0.5">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-[10px] font-bold">Needs Attention</span>
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <div className="text-2xl font-extrabold text-rose-400 font-mono">4</div>
            <p className="text-[9px] text-slate-400">Score &lt; 60% on Merge</p>
          </div>

          <div className="p-3 rounded-xl border border-cyan-500/30 bg-[#06121c]/90 space-y-0.5">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-[10px] font-bold">Cohort Avg</span>
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-300 font-mono">78%</div>
            <p className="text-[9px] text-slate-400">Mastery benchmark</p>
          </div>

          <div className="p-3 rounded-xl border border-emerald-500/30 bg-[#071810]/90 space-y-0.5">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] font-bold">Advanced</span>
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">32</div>
            <p className="text-[9px] text-slate-400">Ready for Quick Sort</p>
          </div>
        </div>

        {/* Topic Averages & Stuck Rates Chart */}
        <div className="rounded-2xl border border-[#4A3F35] bg-[#14100D]/90 p-3.5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono border-b border-[#4A3F35]/60 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
              Topic Averages &amp; Stuck Rates
            </span>
            <span className="text-slate-400 text-[9px]">48 Students</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {TOPIC_AVERAGES.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-200">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-bold">{item.avg}% Avg</span>
                    {item.stuckRate > 0 && (
                      <span className="text-rose-400 text-[9px] font-semibold bg-rose-950/50 px-1 rounded">
                        {item.stuckRate}% Stuck
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-[#251E19] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-300"
                    style={{ width: `${item.avg}%` }}
                  />
                  {item.stuckRate > 0 && (
                    <div
                      className="h-full bg-rose-500/80"
                      style={{ width: `${item.stuckRate}%` }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pb-2 border-t border-[#4A3F35]/70 pt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="text-purple-300 font-bold">GSTU CSE Faculty Portal</span>
        <span className="text-cyan-400 font-semibold">Live Real-time Telemetry</span>
      </div>
    </div>
  );
}
