"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Global Error Boundary for AlgoHub
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("AlgoHub Critical Global Error:", error?.message || "Root layout error");
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#1C1714] text-[#E8DFD4] flex items-center justify-center p-4 antialiased font-body selection:bg-[#C9A962]/35 selection:text-[#1C1714]">
        <div
          role="alert"
          aria-live="assertive"
          className="max-w-md w-full rounded bg-[#251E19] border border-[#4A3F35] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-center space-y-6 corner-flourish"
        >
          {/* Glowing Error Badge */}
          <div className="mx-auto h-14 w-14 rounded bg-[#8B2635]/20 border border-[#8B2635] flex items-center justify-center text-[#A62D3F] shadow-inner">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>

          {/* Header & Supporting Copy */}
          <div className="space-y-2.5">
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#E8DFD4]">
              Something went wrong.
            </h1>
            <p className="text-xs sm:text-sm text-[#9C8B7A] leading-relaxed font-body">
              AlgoHub encountered an unexpected error. You can try again or return to the learning experience.
            </p>
          </div>

          {/* Optional Safe Reference ID (Next.js Digest) */}
          {error?.digest && (
            <div className="p-2.5 rounded bg-[#14100D] border border-[#4A3F35] font-mono text-[11px] text-[#9C8B7A]">
              <span>Reference ID: </span>
              <span className="text-[#C9A962] font-semibold">{error.digest}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {/* Primary Action: Reset / Try Again */}
            <button
              onClick={() => reset()}
              className="btn-brass w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-xs sm:text-sm font-display uppercase tracking-wider font-bold shadow-brass active:scale-95 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Try Again</span>
            </button>

            {/* Secondary Action: Back to AlgoHub */}
            <Link
              href="/"
              className="btn-secondary-brass w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-xs sm:text-sm font-display uppercase tracking-wider font-bold active:scale-95"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>Back to AlgoHub</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
