"use client";

import React, { useState, useMemo } from "react";
import { AlgorithmId } from "@/types/sorting";
import {
  TrendingUp,
  Info,
  ZoomIn,
  Sliders,
} from "lucide-react";

interface GrowthChartProps {
  highlightAlgorithm?: AlgorithmId;
  title?: string;
  subtitle?: string;
}

export function GrowthChart({
  highlightAlgorithm,
  title = "Asymptotic Growth Rate Comparison",
  subtitle = "Observe how O(n²), O(n log n), O(n), and O(log n) diverge as input size n grows.",
}: GrowthChartProps) {
  const [maxN, setMaxN] = useState<number>(100);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate 50 sampled data points from n=1 to maxN
  const dataPoints = useMemo(() => {
    const points = [];
    const steps = 40;
    const stepSize = Math.max(1, Math.floor(maxN / steps));

    for (let n = 1; n <= maxN; n += stepSize) {
      const logN = Math.log2(n);
      const nLogN = n * logN;
      const nSquared = (n * (n - 1)) / 2; // Real comparisons formula for sorting

      points.push({
        n,
        o1: 1,
        oLogN: Math.max(1, Math.round(logN)),
        oN: n,
        oNLogN: Math.max(1, Math.round(nLogN)),
        oNSquared: Math.max(1, Math.round(nSquared)),
      });
    }

    if (points[points.length - 1].n !== maxN) {
      const logN = Math.log2(maxN);
      points.push({
        n: maxN,
        o1: 1,
        oLogN: Math.max(1, Math.round(logN)),
        oN: maxN,
        oNLogN: Math.max(1, Math.round(maxN * logN)),
        oNSquared: Math.max(1, Math.round((maxN * (maxN - 1)) / 2)),
      });
    }

    return points;
  }, [maxN]);

  // Compute SVG viewBox coordinates
  const svgWidth = 600;
  const svgHeight = 320;
  const padding = { top: 20, right: 30, bottom: 40, left: 65 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const maxYValue = dataPoints[dataPoints.length - 1].oNSquared;

  const getX = (n: number) => padding.left + (n / maxN) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (val / maxYValue) * graphHeight;

  // Build SVG path strings
  const pathNSquared = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(p.n)} ${getY(p.oNSquared)}`).join(" ");
  const pathNLogN = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(p.n)} ${getY(p.oNLogN)}`).join(" ");
  const pathN = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(p.n)} ${getY(p.oN)}`).join(" ");
  const pathLogN = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(p.n)} ${getY(p.oLogN)}`).join(" ");

  // Highlight rules based on current algorithm
  const isQuadraticAlgo = highlightAlgorithm === "bubble" || highlightAlgorithm === "selection" || highlightAlgorithm === "insertion";
  const isLogarithmicAlgo = highlightAlgorithm === "merge" || highlightAlgorithm === "quick";

  const hoveredPoint = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < dataPoints.length ? dataPoints[hoverIndex] : dataPoints[dataPoints.length - 1];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#0b101d]/90 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>Growth Curves</span>
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white font-sans mt-0.5">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Zoom Range Slider */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#070b14] border border-slate-800">
          <ZoomIn className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-300 font-bold">Zoom X:</span>
          <input
            type="range"
            min="20"
            max="1000"
            step="20"
            value={maxN}
            aria-label="Adjust X-axis maximum range n"
            onChange={(e) => setMaxN(Number(e.target.value))}
            className="w-28 sm:w-36 h-2 cursor-pointer bg-slate-800 accent-cyan-400 rounded-lg"
          />
          <span className="text-xs font-mono text-cyan-300 font-bold w-12">
            n={maxN}
          </span>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#070b14]/90 p-2 sm:p-4 border border-slate-800">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const normalizedX = (mouseX / rect.width) * svgWidth;
            const targetX = Math.max(padding.left, Math.min(svgWidth - padding.right, normalizedX));
            const ratio = (targetX - padding.left) / graphWidth;
            const targetIndex = Math.min(dataPoints.length - 1, Math.max(0, Math.round(ratio * (dataPoints.length - 1))));
            setHoverIndex(targetIndex);
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Background Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + graphHeight * (1 - ratio);
            const val = Math.round(ratio * maxYValue);

            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* X Axis Ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const x = padding.left + graphWidth * ratio;
            const nVal = Math.round(ratio * maxN);

            return (
              <g key={ratio}>
                <line
                  x1={x}
                  y1={svgHeight - padding.bottom}
                  x2={x}
                  y2={svgHeight - padding.bottom + 5}
                  stroke="#334155"
                />
                <text
                  x={x}
                  y={svgHeight - padding.bottom + 18}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {nVal}
                </text>
              </g>
            );
          })}

          {/* O(log n) Curve */}
          <path
            d={pathLogN}
            fill="none"
            stroke="#a855f7"
            strokeWidth={highlightAlgorithm ? 1.5 : 2}
            strokeOpacity={highlightAlgorithm ? 0.4 : 0.8}
          />

          {/* O(n) Curve */}
          <path
            d={pathN}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={highlightAlgorithm === "insertion" || highlightAlgorithm === "bubble" ? 2.5 : 1.5}
            strokeOpacity={highlightAlgorithm === "insertion" || highlightAlgorithm === "bubble" ? 1 : 0.6}
          />

          {/* O(n log n) Curve */}
          <path
            d={pathNLogN}
            fill="none"
            stroke="#10b981"
            strokeWidth={isLogarithmicAlgo ? 3.5 : 2}
            strokeOpacity={isLogarithmicAlgo || !highlightAlgorithm ? 1 : 0.4}
            className={isLogarithmicAlgo ? "filter drop-shadow-[0_0_8px_#10b981]" : ""}
          />

          {/* O(n²) Curve */}
          <path
            d={pathNSquared}
            fill="none"
            stroke="#f43f5e"
            strokeWidth={isQuadraticAlgo ? 3.5 : 2}
            strokeOpacity={isQuadraticAlgo || !highlightAlgorithm ? 1 : 0.4}
            className={isQuadraticAlgo ? "filter drop-shadow-[0_0_8px_#f43f5e]" : ""}
          />

          {/* Hover Crosshair Vertical Line */}
          {hoverIndex !== null && (
            <line
              x1={getX(hoveredPoint.n)}
              y1={padding.top}
              x2={getX(hoveredPoint.n)}
              y2={svgHeight - padding.bottom}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Hover Inspector Tooltip */}
        <div className="mt-3 p-3 rounded-xl border border-slate-800 bg-[#0b101d] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <span>At Input Size n = {hoveredPoint.n}:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              O(n²): {hoveredPoint.oNSquared.toLocaleString()}
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              O(n log n): {hoveredPoint.oNLogN.toLocaleString()}
            </span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              O(n): {hoveredPoint.oN.toLocaleString()}
            </span>
            <span className="text-purple-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              O(log n): {hoveredPoint.oLogN.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Educational Truth in Advertising Disclaimer */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-[#070b14]/70 flex items-start gap-2.5 text-xs text-slate-400 font-mono leading-relaxed">
        <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Theoretical Counts Notice: </strong>
          These curves show exact mathematical operation bounds (comparisons & assignments), not measured wall-clock execution time. Actual CPU runtime also depends on hardware architecture, CPU cache locality, and compiler optimization.
        </p>
      </div>
    </div>
  );
}
