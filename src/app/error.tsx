"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-Level Error Boundary for AlgoHub
 *
 * Provides a production-grade, branded error recovery screen without exposing
 * internal stack traces, system paths, or environment secrets to end users.
 */
export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Safely log error message for developer telemetry without leaking to UI
    console.error("AlgoHub Application Error:", error?.message || "Unexpected runtime error");
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="max-w-md w-full rounded-2xl border border-rose-500/25 bg-[#0e0509]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-rose-950/30 text-center space-y-6">
        {/* Glowing Error Badge */}
        <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>

        {/* Header & Supporting Copy */}
        <div className="space-y-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Something went wrong.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            AlgoHub encountered an unexpected error. You can try again or return to the learning experience.
          </p>
        </div>

        {/* Optional Safe Reference ID (Next.js Digest) */}
        {error?.digest && (
          <div className="p-2.5 rounded-lg bg-[#060204] border border-rose-950/60 font-mono text-[11px] text-slate-400">
            <span>Reference ID: </span>
            <span className="text-rose-300 font-semibold">{error.digest}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Primary Action: Reset / Try Again */}
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-600/25 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>

          {/* Secondary Action: Back to Home */}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-950/70 bg-[#14080e]/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-[#1f0c16] hover:border-rose-800/60 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none transition-all active:scale-95"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Back to AlgoHub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
