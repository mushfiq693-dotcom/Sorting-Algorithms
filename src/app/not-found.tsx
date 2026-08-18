import React from "react";
import Link from "next/link";
import { Compass, Home, Search, Terminal } from "lucide-react";

/**
 * Custom 404 Not Found Page for AlgoHub
 *
 * Provides a clean, branded, and accessible fallback experience when users
 * visit a non-existent URL or an invalid dynamic algorithm route.
 */
export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="max-w-md w-full rounded-2xl border border-rose-500/25 bg-[#0e0509]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-rose-950/30 text-center space-y-6">
        {/* Algorithmic Monospace Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-xs font-semibold">
          <Terminal className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
          <span>404 // ELEMENT_NOT_FOUND</span>
        </div>

        {/* Visual Icon Illustration */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500/15 to-amber-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
          <Search className="h-8 w-8" aria-hidden="true" />
        </div>

        {/* Header & Supporting Copy */}
        <div className="space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        {/* Algorithmic Code Hint */}
        <div className="p-3 rounded-xl bg-[#060204] border border-rose-950/60 font-mono text-[11px] text-slate-400 text-left space-y-1">
          <div className="text-slate-500">// Binary search in AlgoHub routes:</div>
          <div>
            <span className="text-rose-400">const</span> status = routes.find(r =&gt; r.path === url);
          </div>
          <div className="text-amber-400">&gt; return null; // [Index: -1]</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Primary Action: Back to AlgoHub */}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-600/25 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none transition-all active:scale-95"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Back to AlgoHub</span>
          </Link>

          {/* Secondary Action: Explore Learning Path */}
          <Link
            href="/learn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-950/70 bg-[#14080e]/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-[#1f0c16] hover:border-rose-800/60 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none transition-all active:scale-95"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>Explore Learning Path</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
