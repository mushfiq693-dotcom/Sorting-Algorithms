"use client";

import React from "react";

interface AlgoHubLogoProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

/**
 * AlgoHubLogo Component
 * Official vector brand mark for AlgoHub representing ascending sorting bars,
 * algorithmic execution nodes, and optimal convergence.
 */
export function AlgoHubLogo({
  size = 36,
  className = "",
  showGlow = true,
}: AlgoHubLogoProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-2xl bg-cyan-500/25 blur-md -z-10 group-hover:bg-cyan-400/40 transition-all duration-300"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#070d1e" />
            <stop offset="50%" stopColor="#0a1329" />
            <stop offset="100%" stopColor="#050813" />
          </linearGradient>

          <radialGradient id="logoTopGlow" cx="50%" cy="10%" r="70%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="logoBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="logoBar1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="logoBar2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="logoBar3" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="logoBar4" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Squircle Base */}
        <rect width="512" height="512" rx="112" fill="url(#logoBgGrad)" />
        <rect width="512" height="512" rx="112" fill="url(#logoTopGlow)" />

        {/* Glowing Border */}
        <rect
          x="6"
          y="6"
          width="500"
          height="500"
          rx="106"
          fill="none"
          stroke="url(#logoBorderGrad)"
          strokeWidth="10"
        />

        {/* Background Grid Accent */}
        <g opacity="0.25">
          <circle cx="90" cy="110" r="4" fill="#38bdf8" />
          <circle cx="130" cy="110" r="4" fill="#38bdf8" />
          <circle cx="90" cy="150" r="4" fill="#38bdf8" />
          <circle cx="420" cy="380" r="4" fill="#818cf8" />
          <circle cx="380" cy="420" r="4" fill="#818cf8" />
          <circle cx="420" cy="420" r="4" fill="#818cf8" />
        </g>

        {/* Algorithm Bars */}
        <rect x="96" y="280" width="56" height="136" rx="20" fill="url(#logoBar1)" />
        <rect
          x="96"
          y="280"
          width="56"
          height="136"
          rx="20"
          fill="none"
          stroke="#67e8f9"
          strokeWidth="2"
          opacity="0.4"
        />

        <rect x="176" y="210" width="56" height="206" rx="20" fill="url(#logoBar2)" />
        <rect
          x="176"
          y="210"
          width="56"
          height="206"
          rx="20"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="2"
          opacity="0.4"
        />

        <rect x="256" y="145" width="56" height="271" rx="20" fill="url(#logoBar3)" />
        <rect
          x="256"
          y="145"
          width="56"
          height="271"
          rx="20"
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="2"
          opacity="0.4"
        />

        <rect x="336" y="85" width="56" height="331" rx="20" fill="url(#logoBar4)" />
        <rect
          x="336"
          y="85"
          width="56"
          height="331"
          rx="20"
          fill="none"
          stroke="#e9d5ff"
          strokeWidth="2"
          opacity="0.4"
        />

        {/* Trajectory Energy Line */}
        <path
          d="M 124 280 Q 200 230 284 145 T 364 85"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 124 280 Q 200 230 284 145 T 364 85"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Nodes */}
        <circle cx="124" cy="280" r="11" fill="#06b6d4" stroke="#ffffff" strokeWidth="3.5" />
        <circle cx="204" cy="210" r="12" fill="#38bdf8" stroke="#ffffff" strokeWidth="4" />
        <circle cx="284" cy="145" r="13" fill="#818cf8" stroke="#ffffff" strokeWidth="4.5" />
        <circle cx="364" cy="85" r="15" fill="#c084fc" stroke="#ffffff" strokeWidth="5" />

        {/* Spark */}
        <g transform="translate(420, 75)">
          <path
            d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z"
            fill="#67e8f9"
          />
          <circle cx="0" cy="0" r="4" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}
